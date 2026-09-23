/**
 * ルート・訪問時刻・移動手段を1本ずつ手作りで定義した公式しおりを登録する共通ロジック。
 * seed-koyo-2026.ts（紅葉特集）・seed-winter-2026.ts（冬特集）から使う。
 *
 *  - 緯度経度: Wikipediaの座標 → なければOpenStreetMap(Nominatim)で検索 → それでもなければ fallbackLatLng
 *  - 公式サイトURL: 実際にアクセスできたものだけ登録
 *  - 写真: photo-cache.json を再利用し、ない分だけWikipediaから取得して縮小のうえBlobへ保存
 *  - 閲覧数・いいね数は架空の値を入れず0から始める
 *
 * 各seedスクリプトの実行モード（コマンドライン引数）:
 *   （なし）       … 確認モード。座標・URL・時刻の矛盾・徒歩距離・路線名の制約をチェックして表示（DBは変更しない）
 *   --commit      … 登録モード（同名のしおりが既にあればスキップ）
 *   --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { writeFileSync } from "node:fs";
import { join } from "node:path";
import { prisma } from "../../src/lib/prisma";
import { fetchAndUploadImage, OFFICIAL_PLANNER_ID, ADMIN_ID, type SpotSeed } from "./pilot-gen";
import existingPhotoCache from "../photo-cache.json";

export type Transit = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };

export type HandmadeSpot = {
  name: string;
  wikiTitle: string;
  address: string;
  time: string; // 訪問予定時刻 "HH:MM"
  stay: number; // 滞在時間（分）
  memo: string;
  websiteUrl?: string;
  transit?: Transit; // 前のスポットからの移動（各日の1件目は持たない）
  fallbackLatLng?: [number, number]; // 指定した場合はWikipedia・OSMより優先する
  osmQuery?: string; // OSMで検索するときの検索語（省略時はスポット名）
};

export type HandmadeItinerary = {
  title: string;
  description: string;
  nights: number;
  prefectureName: string;
  areaNames: string[];
  tagNames: string[];
  purposeNames: string[];
  days: HandmadeSpot[][];
};

const UA = "shiorie-seed/1.0 (contact: st.83.53.abcd@gmail.com)";
// OSMの検索結果が、同じしおりの他スポットからこれ以上離れていたら別の場所とみなして採用しない
const OSM_MAX_DISTANCE_KM = 30;

// 1件ずつ問い合わせるとWikipedia APIのレート制限にかかるため、記事名をまとめて1回で取得する
// （APIの上限は1リクエスト50件）。リダイレクト・表記正規化後の記事名も元の記事名に対応づける。
async function fetchWikiCoordsBatch(titles: string[]): Promise<Map<string, [number, number]>> {
  const result = new Map<string, [number, number]>();
  for (let i = 0; i < titles.length; i += 50) {
    const chunk = titles.slice(i, i + 50);
    const url = `https://ja.wikipedia.org/w/api.php?action=query&prop=coordinates&colimit=max&redirects=1&format=json&titles=${encodeURIComponent(chunk.join("|"))}`;
    const res = await fetch(url, { headers: { "User-Agent": UA } });
    if (!res.ok) throw new Error(`Wikipedia API ${res.status}`);
    const json = await res.json();
    const aliases = new Map<string, string>();
    for (const r of [...(json.query.normalized ?? []), ...(json.query.redirects ?? [])]) aliases.set(r.from, r.to);
    const coordsByTitle = new Map<string, [number, number]>();
    for (const page of Object.values(json.query.pages) as { title: string; coordinates?: { lat: number; lon: number }[] }[]) {
      const c = page.coordinates?.[0];
      if (c) coordsByTitle.set(page.title, [c.lat, c.lon]);
    }
    for (const title of chunk) {
      let resolvedTitle = title;
      while (aliases.has(resolvedTitle)) resolvedTitle = aliases.get(resolvedTitle)!;
      const c = coordsByTitle.get(resolvedTitle);
      if (c) result.set(title, c);
    }
  }
  return result;
}

// Nominatimの利用規約（1秒1リクエストまで）に合わせて間隔を空けて検索する
async function fetchOsmCandidates(query: string): Promise<[number, number][]> {
  await new Promise((r) => setTimeout(r, 1200));
  const url = `https://nominatim.openstreetmap.org/search?format=json&limit=5&countrycodes=jp&q=${encodeURIComponent(query)}`;
  const res = await fetch(url, { headers: { "User-Agent": UA, "Accept-Language": "ja" } });
  if (!res.ok) return [];
  const json = (await res.json()) as { lat: string; lon: string }[];
  return json.map((r) => [Number(r.lat), Number(r.lon)]);
}

async function isReachable(url: string): Promise<boolean> {
  try {
    const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow", signal: AbortSignal.timeout(15000) });
    return res.ok;
  } catch {
    return false;
  }
}

export function distanceKm(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const rad = Math.PI / 180;
  const a =
    Math.sin(((lat2 - lat1) * rad) / 2) ** 2 +
    Math.cos(lat1 * rad) * Math.cos(lat2 * rad) * Math.sin(((lng2 - lng1) * rad) / 2) ** 2;
  return 6371 * 2 * Math.asin(Math.sqrt(a));
}

function toTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

type ResolvedSpot = HandmadeSpot & { lat: number; lng: number; latLngSource: string; verifiedUrl: string | null };

async function resolveSpots(itineraries: HandmadeItinerary[]): Promise<Map<HandmadeSpot, ResolvedSpot>> {
  const resolved = new Map<HandmadeSpot, ResolvedSpot>();
  const allTitles = [...new Set(itineraries.flatMap((it) => it.days.flat()).map((s) => s.wikiTitle))];
  const coordsByTitle = await fetchWikiCoordsBatch(allTitles);
  const urlCache = new Map<string, boolean>();
  const missing: string[] = [];

  for (const it of itineraries) {
    const spots = it.days.flat();
    const located = new Map<HandmadeSpot, { latLng: [number, number]; source: string }>();
    // 1つのWikipedia記事を名前の違う複数のスポットで共有している場合（城崎温泉の各外湯など）、
    // 記事の代表座標を使うと全スポットが同じ位置になるため、OSMでの個別検索を優先する
    const namesByTitle = new Map<string, Set<string>>();
    for (const s of spots) namesByTitle.set(s.wikiTitle, (namesByTitle.get(s.wikiTitle) ?? new Set()).add(s.name));
    const sharedTitle = (s: HandmadeSpot) => (namesByTitle.get(s.wikiTitle)?.size ?? 0) > 1;
    for (const spot of spots) {
      if (spot.fallbackLatLng) located.set(spot, { latLng: spot.fallbackLatLng, source: "手動指定" });
      else if (coordsByTitle.has(spot.wikiTitle) && !sharedTitle(spot)) located.set(spot, { latLng: coordsByTitle.get(spot.wikiTitle)!, source: `Wikipedia(${spot.wikiTitle})` });
    }
    // 座標が未確定のスポットはOSMで検索し、同じしおりの他スポットの近くにある結果だけを採用する
    for (const spot of spots.filter((s) => !located.has(s))) {
      const anchors = [...located.values()].map((v) => v.latLng);
      if (anchors.length === 0 && coordsByTitle.has(spot.wikiTitle)) anchors.push(coordsByTitle.get(spot.wikiTitle)!);
      // 「熱乃湯（湯もみショー）」のような補足のかっこ書きは地図データの名称にないため外して検索する
      const baseQuery = spot.osmQuery ?? spot.name.replace(/（[^）]*）/g, "").trim();
      const queries = [...new Set([baseQuery, `${baseQuery} ${spot.address}`])];
      for (const query of queries) {
        const hit = (await fetchOsmCandidates(query)).find((c) =>
          anchors.length === 0 ? true : anchors.some((a) => distanceKm(a[0], a[1], c[0], c[1]) <= OSM_MAX_DISTANCE_KM),
        );
        if (hit) {
          located.set(spot, { latLng: hit, source: `OSM(${query})` });
          break;
        }
      }
      // OSMでも見つからなければ、共有しているWikipedia記事の座標を使う（同じ座標の警告で気づけるようにする）
      if (!located.has(spot) && coordsByTitle.has(spot.wikiTitle)) {
        located.set(spot, { latLng: coordsByTitle.get(spot.wikiTitle)!, source: `Wikipedia(${spot.wikiTitle})` });
      }
    }

    for (const spot of spots) {
      const loc = located.get(spot);
      if (!loc) {
        missing.push(`${it.title} / ${spot.name}（wikiTitle: ${spot.wikiTitle}）`);
        continue;
      }
      let verifiedUrl: string | null = null;
      if (spot.websiteUrl) {
        if (!urlCache.has(spot.websiteUrl)) urlCache.set(spot.websiteUrl, await isReachable(spot.websiteUrl));
        verifiedUrl = urlCache.get(spot.websiteUrl) ? spot.websiteUrl : null;
      }
      resolved.set(spot, { ...spot, lat: loc.latLng[0], lng: loc.latLng[1], latLngSource: loc.source, verifiedUrl });
    }
  }
  if (missing.length) {
    throw new Error(`座標が取得できないスポットがあります。fallbackLatLng を指定してください:\n  ${missing.join("\n  ")}`);
  }
  return resolved;
}

function printAndValidate(itineraries: HandmadeItinerary[], resolved: Map<HandmadeSpot, ResolvedSpot>): number {
  let warnings = 0;
  for (const it of itineraries) {
    console.log(`\n■ ${it.title}（${it.nights === 0 ? "日帰り" : `${it.nights}泊${it.nights + 1}日`}）`);
    it.days.forEach((spots, i) => {
      console.log(`  Day${i + 1}`);
      for (const [idx, s] of spots.entries()) {
        const r = resolved.get(s)!;
        // 徒歩区間の所要時間が現実的か確認できるよう、前のスポットからの直線距離を併記する
        const prev = idx > 0 ? resolved.get(spots[idx - 1])! : null;
        const km = prev ? distanceKm(prev.lat, prev.lng, r.lat, r.lng) : 0;
        const tooFar = s.transit?.mode === "walk" && km / s.transit.min > 0.08 ? " ⚠️徒歩では遠い" : "";
        if (tooFar) warnings++;
        const transit = s.transit
          ? `${s.transit.mode}${s.transit.line ? `/${s.transit.line}` : ""} ${s.transit.min}分(直線${km.toFixed(1)}km)${tooFar} → `
          : "";
        const url = s.websiteUrl ? (r.verifiedUrl ? " URL:OK" : ` URL:NG(${s.websiteUrl})`) : "";
        console.log(`    ${transit}${s.time} ${s.name}（${s.stay}分） [${r.lat.toFixed(4)},${r.lng.toFixed(4)} ${r.latLngSource}]${url}`);
      }
    });
    // 名前の違うスポットが同じ座標になっていると、地図上でピンが重なる（共通のWikipedia記事を流用した場合など）
    const byCoord = new Map<string, string[]>();
    for (const s of it.days.flat()) {
      const r = resolved.get(s)!;
      const key = `${r.lat.toFixed(4)},${r.lng.toFixed(4)}`;
      byCoord.set(key, [...new Set([...(byCoord.get(key) ?? []), s.name])]);
    }
    for (const names of byCoord.values()) {
      if (names.length > 1) {
        console.log(`  ⚠️同じ座標のスポット: ${names.join(" / ")}`);
        warnings++;
      }
    }
  }

  for (const it of itineraries) {
    for (const spots of it.days) {
      for (const s of spots) {
        // DBのCHECK制約 spot_transit_line_only_for_train_bus と同じルール
        if (s.transit?.line && s.transit.mode !== "train" && s.transit.mode !== "bus") {
          throw new Error(`路線名は電車・バスのときのみ指定できます: ${it.title} / ${s.name}`);
        }
      }
      // 各日の時刻が前のスポットの滞在＋移動時間と矛盾していないか（前倒しになっていないか）
      for (let i = 1; i < spots.length; i++) {
        const prev = spots[i - 1];
        const cur = spots[i];
        const earliest = toTime(prev.time).getTime() + (prev.stay + (cur.transit?.min ?? 0)) * 60000;
        if (toTime(cur.time).getTime() < earliest) {
          throw new Error(`時刻が矛盾しています: ${it.title} / ${prev.name} → ${cur.name}`);
        }
      }
    }
  }
  return warnings;
}

function photoSeed(spot: HandmadeSpot): SpotSeed {
  return { name: spot.wikiTitle, address: spot.address, lat: 0, lng: 0, memo: "", websiteUrl: "", wikiTitle: spot.wikiTitle };
}

function saveImageCache(imageCache: Map<string, string | null>) {
  const cacheOut = Object.fromEntries([...imageCache.entries()].filter(([, v]) => v));
  writeFileSync(join(process.cwd(), "prisma", "photo-cache.json"), JSON.stringify(cacheOut));
}

async function insertItineraries(itineraries: HandmadeItinerary[], resolved: Map<HandmadeSpot, ResolvedSpot>, blobPrefix: string) {
  const imageCache = new Map<string, string | null>(Object.entries(existingPhotoCache as Record<string, string>));
  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" } });

  for (const it of itineraries) {
    const existing = await prisma.itinerary.findFirst({ where: { title: it.title, plannerAccountId: OFFICIAL_PLANNER_ID } });
    if (existing) {
      console.log(`既存のためスキップ: ${it.title}`);
      continue;
    }

    const prefecture = prefectures.find((p) => p.name === it.prefectureName);
    if (!prefecture) throw new Error(`都道府県が見つかりません: ${it.prefectureName}`);
    const subAreas = await prisma.area.findMany({ where: { parentId: prefecture.id, name: { in: it.areaNames } } });
    if (subAreas.length !== it.areaNames.length) throw new Error(`エリアが見つかりません: ${it.areaNames.join(",")}`);
    const tags = await prisma.tag.findMany({ where: { name: { in: it.tagNames } } });
    if (tags.length !== it.tagNames.length) throw new Error(`タグが見つかりません: ${it.tagNames.join(",")}`);
    const purposeTags = await prisma.purposeTag.findMany({ where: { name: { in: it.purposeNames } } });
    if (purposeTags.length !== it.purposeNames.length) throw new Error(`目的タグが見つかりません: ${it.purposeNames.join(",")}`);

    // 写真はWikipedia記事単位で取得する。同じ記事を複数のスポットで共有している場合（城崎温泉の各外湯など）、
    // 全スポットに同じ写真が並ぶと不自然なため、その記事を使う最初のスポットにだけ付ける
    const photoBySpot = new Map<HandmadeSpot, string | null>();
    const usedTitles = new Set<string>();
    for (const spot of it.days.flat()) {
      if (usedTitles.has(spot.wikiTitle)) continue;
      usedTitles.add(spot.wikiTitle);
      photoBySpot.set(spot, await fetchAndUploadImage(imageCache, photoSeed(spot), blobPrefix));
    }
    const now = new Date();

    // 日程・スポット・写真までネストして1回のcreateで登録する（途中で失敗しても中途半端なしおりが残らない）
    await prisma.itinerary.create({
      data: {
        plannerAccountId: OFFICIAL_PLANNER_ID,
        title: it.title,
        description: it.description,
        nights: it.nights,
        status: "published",
        thumbnailUrl: it.days.flat().map((s) => photoBySpot.get(s)).find(Boolean) ?? null,
        primaryAreaId: prefecture.id,
        submittedAt: now,
        reviewedAt: now,
        reviewedByAdminId: ADMIN_ID,
        areas: { create: [...subAreas.map((a) => ({ areaId: a.id })), { areaId: prefecture.id }] },
        tags: { create: tags.map((t) => ({ tagId: t.id })) },
        purposeTags: { create: purposeTags.map((p) => ({ purposeTagId: p.id })) },
        days: {
          create: it.days.map((spots, dayIndex) => ({
            dayNumber: dayIndex + 1,
            spots: {
              create: spots.map((spot, idx) => {
                const r = resolved.get(spot)!;
                const photoUrl = photoBySpot.get(spot);
                return {
                  orderNo: idx + 1,
                  name: spot.name,
                  address: spot.address,
                  lat: r.lat,
                  lng: r.lng,
                  visitTime: toTime(spot.time),
                  memo: spot.memo,
                  stayDurationMin: spot.stay,
                  websiteUrl: r.verifiedUrl,
                  transitMode: spot.transit?.mode ?? null,
                  transitDurationMin: spot.transit?.min ?? null,
                  transitLine: spot.transit?.line ?? null,
                  photos: photoUrl ? { create: [{ url: photoUrl, caption: spot.name }] } : undefined,
                };
              }),
            },
          })),
        },
      },
    });
    console.log(`作成: ${it.title}`);
    saveImageCache(imageCache);
  }
  console.log("\n完了しました。");
}

/**
 * 登録済みしおりのうち、写真が付いていないスポットに写真を補完し、
 * サムネイル未設定のしおりには最初の写真を設定する（Blob容量不足などで写真なしになった分の復旧用）。
 */
async function fillMissingPhotos(itineraries: HandmadeItinerary[], blobPrefix: string) {
  const imageCache = new Map<string, string | null>(Object.entries(existingPhotoCache as Record<string, string>));
  for (const it of itineraries) {
    const itinerary = await prisma.itinerary.findFirst({
      where: { title: it.title, plannerAccountId: OFFICIAL_PLANNER_ID },
      select: {
        id: true,
        thumbnailUrl: true,
        days: { orderBy: { dayNumber: "asc" }, select: { dayNumber: true, spots: { orderBy: { orderNo: "asc" }, select: { id: true, orderNo: true, name: true, photos: { select: { url: true } } } } } },
      },
    });
    if (!itinerary) continue;

    let added = 0;
    for (const day of itinerary.days) {
      for (const row of day.spots) {
        if (row.photos.length > 0) continue;
        const spot = it.days[day.dayNumber - 1]?.[row.orderNo - 1];
        if (!spot || spot.name !== row.name) continue;
        const url = await fetchAndUploadImage(imageCache, photoSeed(spot), blobPrefix);
        if (url) {
          await prisma.photo.create({ data: { spotId: row.id, url, caption: row.name } });
          added++;
        }
      }
    }

    if (!itinerary.thumbnailUrl) {
      const first = await prisma.photo.findFirst({
        where: { spot: { day: { itineraryId: itinerary.id } } },
        orderBy: [{ spot: { day: { dayNumber: "asc" } } }, { spot: { orderNo: "asc" } }],
        select: { url: true },
      });
      if (first) await prisma.itinerary.update({ where: { id: itinerary.id }, data: { thumbnailUrl: first.url } });
    }
    console.log(`写真補完: ${it.title}（${added}枚追加）`);
  }
  saveImageCache(imageCache);
}

/** 各seedスクリプトのエントリポイント。コマンドライン引数で確認／登録／写真補完を切り替える */
export async function runHandmadeSeed(itineraries: HandmadeItinerary[], { blobPrefix }: { blobPrefix: string }) {
  try {
    if (process.argv.includes("--fill-photos")) {
      await fillMissingPhotos(itineraries, blobPrefix);
      return;
    }
    const commit = process.argv.includes("--commit");
    console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

    const resolved = await resolveSpots(itineraries);
    const warnings = printAndValidate(itineraries, resolved);
    console.log(`\n警告: ${warnings}件`);

    if (!commit) {
      console.log("確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
      return;
    }
    await insertItineraries(itineraries, resolved, blobPrefix);
  } catch (e) {
    console.error(e);
    process.exitCode = 1;
  } finally {
    await prisma.$disconnect();
  }
}
