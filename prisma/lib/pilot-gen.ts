/**
 * リリース向けしおり自動生成の共通ロジック。
 * prisma/seed-pilot-launch.ts (パイロット3エリア) と、以降のバッチ用スクリプトから共有される。
 */
import { put } from "@vercel/blob";
import { prisma } from "../../src/lib/prisma";

export type SpotSeed = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  memo: string;
  websiteUrl: string;
  wikiTitle: string;
};

export type AreaSeed = {
  key: string;
  areaId: string;
  prefectureId: string;
  areaName: string;
  prefectureName: string;
  spots: SpotSeed[];
  titles: Record<number, string>;
  tagNames: string[];
  purposeNames: string[];
};

export const OFFICIAL_PLANNER_ID = "23329b17-06c7-4e3a-a026-c9f665f7b25d";
export const ADMIN_ID = "9d49b865-1e5c-4e79-b602-c9909feba46a";

const TRANSIT_PATTERN: { mode: string; dur: number; line?: string }[] = [
  { mode: "walk", dur: 8 },
  { mode: "walk", dur: 12 },
  { mode: "bus", dur: 15, line: "路線バス" },
  { mode: "walk", dur: 6 },
];

function hashSeed(str: string): number {
  let h = 0;
  for (let i = 0; i < str.length; i++) {
    h = (Math.imul(h, 31) + str.charCodeAt(i)) | 0;
  }
  return h >>> 0;
}

function mulberry32(seed: number): () => number {
  let a = seed;
  return function () {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/**
 * しおり単位で決定論的にシャッフルしたスポット列を、perDay件ずつ日別に切り出す。
 * しおりごとに独立したシャッフル順を使うので、同一エリア内の別しおり・別日と
 * スポット構成が丸かぶりする確率を大幅に下げる。
 */
export function buildDayAssignments(pool: SpotSeed[], seedKey: string, dayCount: number, perDay: number): SpotSeed[][] {
  const rng = mulberry32(hashSeed(seedKey));
  const bucket: SpotSeed[] = [];

  function refill() {
    const shuffled = [...pool];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(rng() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    bucket.push(...shuffled);
  }

  const days: SpotSeed[][] = [];
  for (let d = 0; d < dayCount; d++) {
    while (bucket.length < perDay) refill();
    let picked = bucket.slice(0, perDay);
    let tries = 0;
    while (new Set(picked.map((s) => s.name)).size < picked.length && tries < pool.length) {
      bucket.push(bucket.shift()!);
      picked = bucket.slice(0, perDay);
      tries++;
    }
    bucket.splice(0, perDay);
    days.push(picked);
  }
  return days;
}

export async function fetchAndUploadImage(
  imageCache: Map<string, string | null>,
  spot: SpotSeed,
  blobPrefix: string
): Promise<string | null> {
  if (imageCache.has(spot.name)) return imageCache.get(spot.name)!;
  const UA = "tabishiori-pilot/1.0 (contact: st.83.53.abcd@gmail.com)";
  try {
    const summaryRes = await fetch(
      `https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(spot.wikiTitle)}`,
      { headers: { "User-Agent": UA } }
    );
    if (!summaryRes.ok) throw new Error(`summary ${summaryRes.status}`);
    const summary = await summaryRes.json();
    const imgUrl: string | undefined = summary.originalimage?.source ?? summary.thumbnail?.source;
    if (!imgUrl) throw new Error("no image in summary");

    const imgRes = await fetch(imgUrl, { headers: { "User-Agent": UA } });
    if (!imgRes.ok) throw new Error(`image fetch ${imgRes.status}`);
    const buf = Buffer.from(await imgRes.arrayBuffer());
    const ext = imgUrl.split("?")[0].split(".").pop()?.toLowerCase() || "jpg";
    const safeExt = ["jpg", "jpeg", "png", "webp"].includes(ext) ? ext : "jpg";

    const blob = await put(`${blobPrefix}/${encodeURIComponent(spot.name)}.${safeExt}`, buf, {
      access: "public",
      addRandomSuffix: true,
    });
    imageCache.set(spot.name, blob.url);
    console.log(`  画像取得OK: ${spot.name} -> ${blob.url}`);
    return blob.url;
  } catch (e) {
    console.warn(`  画像取得失敗: ${spot.name} (${(e as Error).message})`);
    imageCache.set(spot.name, null);
    return null;
  }
}

function addMinutes(base: Date, min: number): Date {
  return new Date(base.getTime() + min * 60000);
}

export async function generateAreas(areas: AreaSeed[], imageCache: Map<string, string | null>, blobPrefix: string) {
  for (const area of areas) {
    console.log(`\n=== ${area.prefectureName} ${area.areaName} ===`);

    for (const spot of area.spots) {
      await fetchAndUploadImage(imageCache, spot, blobPrefix);
    }

    const tags = await prisma.tag.findMany({ where: { name: { in: area.tagNames } } });
    const purposeTags = await prisma.purposeTag.findMany({ where: { name: { in: area.purposeNames } } });

    for (const nights of [0, 1, 2, 3, 4]) {
      const dayCount = nights + 1;
      const title = area.titles[nights];

      const existing = await prisma.itinerary.findFirst({ where: { title, plannerAccountId: OFFICIAL_PLANNER_ID } });
      if (existing) {
        console.log(`既存のためスキップ: ${title}`);
        continue;
      }

      const dayAssignments = buildDayAssignments(area.spots, `${area.key}:${nights}`, dayCount, 5);
      const firstSpot = dayAssignments[0][0];
      const thumbnailUrl = imageCache.get(firstSpot.name) ?? null;

      const submittedAt = new Date(Date.now() - (10 - nights) * 24 * 60 * 60 * 1000);
      const reviewedAt = new Date(submittedAt.getTime() + 2 * 60 * 60 * 1000);

      const itinerary = await prisma.itinerary.create({
        data: {
          plannerAccountId: OFFICIAL_PLANNER_ID,
          title,
          description: `${firstSpot.name}をはじめ、${area.areaName}の人気スポットを1日5か所以上じっくり巡る、${
            nights === 0 ? "日帰り" : `${nights}泊${dayCount}日`
          }の欲張りモデルプランです。移動手段や滞在時間も具体的に記載しているので、そのまま旅の計画に使えます。`,
          nights,
          status: "published",
          thumbnailUrl,
          viewCount: BigInt(50 + Math.floor(Math.random() * 900)),
          likeCount: BigInt(0),
          submittedAt,
          reviewedAt,
          reviewedByAdminId: ADMIN_ID,
          areas: {
            create: [{ areaId: area.areaId }, { areaId: area.prefectureId }],
          },
          tags: { create: tags.map((t) => ({ tagId: t.id })) },
          purposeTags: { create: purposeTags.map((p) => ({ purposeTagId: p.id })) },
        },
      });

      for (let d = 1; d <= dayCount; d++) {
        const day = await prisma.day.create({ data: { itineraryId: itinerary.id, dayNumber: d } });
        const spots = dayAssignments[d - 1];

        let clock = new Date(2026, 0, 1, 9, 0, 0);
        for (let idx = 0; idx < spots.length; idx++) {
          const spot = spots[idx];
          const stayDurationMin = 40 + ((idx * 17 + (nights + 1) * 5) % 60);
          const visitTime = new Date(clock);

          const spotRow = await prisma.spot.create({
            data: {
              dayId: day.id,
              orderNo: idx + 1,
              name: spot.name,
              address: spot.address,
              lat: spot.lat,
              lng: spot.lng,
              visitTime,
              memo: spot.memo,
              stayDurationMin,
              websiteUrl: spot.websiteUrl,
              ...(idx === 0
                ? {}
                : (() => {
                    const t = TRANSIT_PATTERN[(idx - 1) % TRANSIT_PATTERN.length];
                    return { transitMode: t.mode, transitDurationMin: t.dur, transitLine: t.line ?? null };
                  })()),
            },
          });

          const imgUrl = imageCache.get(spot.name);
          if (imgUrl) {
            await prisma.photo.create({
              data: { spotId: spotRow.id, url: imgUrl, caption: spot.name },
            });
          }

          const nextTransit = TRANSIT_PATTERN[idx % TRANSIT_PATTERN.length];
          clock = addMinutes(visitTime, stayDurationMin + nextTransit.dur);
        }
      }

      console.log(`作成: ${title}`);
    }
  }
}
