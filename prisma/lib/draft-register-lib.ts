/**
 * register-draft.ts の中身。下書きファイル(DraftItinerary)から、DBに書き込むデータの形(createの引数)を
 * 1つだけ作り、確認モードの表示も読み戻しの比較も、必ずこの同じ形から作る
 * (2026-11-04、確認モードの表示と書き込むデータのずれが続いたための決まり。仕様書 3節)。
 */
import { prisma } from "../../src/lib/prisma";
import { OFFICIAL_PLANNER_ID, ADMIN_ID } from "./pilot-gen";
import type { DraftItinerary, DraftSpot } from "./draft-schema";

function toTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

export type PhotoUrlResolver = (commonsFile: string, label: string) => Promise<string | null>;

export async function resolveLookups(draft: DraftItinerary) {
  const prefecture = await prisma.area.findFirst({ where: { level: "prefecture", name: draft.prefectureName } });
  if (!prefecture) throw new Error(`都道府県が見つかりません: ${draft.prefectureName}`);
  const subAreas = await prisma.area.findMany({ where: { parentId: prefecture.id, name: { in: draft.areaNames } } });
  if (subAreas.length !== draft.areaNames.length) {
    const found = new Set(subAreas.map((a) => a.name));
    throw new Error(`エリアが見つかりません: ${draft.areaNames.filter((n) => !found.has(n)).join(",")}`);
  }
  const tags = await prisma.tag.findMany({ where: { name: { in: draft.tagNames } } });
  if (tags.length !== draft.tagNames.length) {
    const found = new Set(tags.map((t) => t.name));
    throw new Error(`タグが見つかりません: ${draft.tagNames.filter((n) => !found.has(n)).join(",")}`);
  }
  const purposeTags = await prisma.purposeTag.findMany({ where: { name: { in: draft.purposeNames } } });
  if (purposeTags.length !== draft.purposeNames.length) {
    const found = new Set(purposeTags.map((p) => p.name));
    throw new Error(`目的タグが見つかりません: ${draft.purposeNames.filter((n) => !found.has(n)).join(",")}`);
  }
  return { prefecture, subAreas, tags, purposeTags };
}

async function buildSpotData(spot: DraftSpot, resolvePhoto: PhotoUrlResolver, dayNumber: number) {
  const photoUrls: (string | null)[] = [];
  for (const p of spot.photos ?? []) photoUrls.push(await resolvePhoto(p.commonsFile, `${dayNumber}-${spot.name}`));

  return {
    name: spot.name,
    address: spot.address ?? null,
    lat: spot.point.lat,
    lng: spot.point.lng,
    visitTime: toTime(spot.time),
    memo: spot.memo,
    stayDurationMin: spot.stayDurationMin,
    transitLegs: spot.legs.length
      ? { create: spot.legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null })) }
      : undefined,
    photos: (spot.photos ?? []).length
      ? {
          create: (spot.photos ?? []).map((p, i) => ({
            url: photoUrls[i] ?? "",
            caption: spot.name,
            sourceUrl: p.sourceUrl,
            author: p.author,
            license: p.license,
            licenseUrl: p.licenseUrl ?? null,
          })),
        }
      : undefined,
  };
}

/** 確認モード・--commit のどちらも、この関数が作った1つの値を使う(表示と書き込みのずれを防ぐ) */
export async function buildItineraryCreateData(
  draft: DraftItinerary,
  lookups: Awaited<ReturnType<typeof resolveLookups>>,
  resolvePhoto: PhotoUrlResolver,
) {
  const coverUrl = await resolvePhoto(draft.cover.commonsFile, "cover");
  const days = [];
  for (let di = 0; di < draft.days.length; di++) {
    const spots = [];
    for (let si = 0; si < draft.days[di].length; si++) spots.push(await buildSpotData(draft.days[di][si], resolvePhoto, di + 1));
    days.push({ dayNumber: di + 1, spots: { create: spots.map((s, i) => ({ ...s, orderNo: i + 1 })) } });
  }

  return {
    plannerAccountId: OFFICIAL_PLANNER_ID,
    title: draft.title,
    description: draft.description,
    nights: draft.nights,
    status: "pending" as const,
    thumbnailUrl: coverUrl,
    primaryAreaId: lookups.prefecture.id,
    seasons: draft.seasons,
    submittedAt: new Date(),
    reviewedAt: null,
    reviewedByAdminId: null,
    areas: { create: [...lookups.subAreas.map((a) => ({ areaId: a.id })), { areaId: lookups.prefecture.id }] },
    tags: { create: lookups.tags.map((t) => ({ tagId: t.id })) },
    purposeTags: { create: lookups.purposeTags.map((p) => ({ purposeTagId: p.id })) },
    days: { create: days },
  };
}

function fmtTime(d: Date | null): string {
  if (!d) return "--:--";
  return `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
}

/** 確認モードの表示。buildItineraryCreateData が作った同じオブジェクトをそのまま読んで表示する */
export function renderPreview(data: Awaited<ReturnType<typeof buildItineraryCreateData>>): void {
  console.log(`\n■ ${data.title}（${data.nights === 0 ? "日帰り" : `${data.nights}泊${data.nights + 1}日`}）`);
  console.log(`  状態: ${data.status}（承認待ち・非公開）  季節: ${data.seasons.join("/") || "(なし)"}  表紙: ${data.thumbnailUrl ?? "(なし)"}`);
  for (const day of data.days.create) {
    console.log(`  Day${day.dayNumber}`);
    for (const s of day.spots.create) {
      const legs = s.transitLegs?.create?.map((l: any) => `${l.transitMode}${l.transitDurationMin}分${l.transitLine ? `(${l.transitLine})` : ""}`).join("+") ?? "-";
      const photos = s.photos?.create?.length ?? 0;
      console.log(`    ${legs} → ${fmtTime(s.visitTime)} ${s.name}（${s.stayDurationMin}分）[${s.lat},${s.lng}] 写真${photos}枚`);
    }
  }
}

export type ReadBackDiff = string[];

/** 登録のあとに読み戻し、下書きファイルとすべて同じかを比べる */
export async function readBackAndCompare(itineraryId: string, draft: DraftItinerary): Promise<ReadBackDiff> {
  const diffs: ReadBackDiff = [];
  const row = await prisma.itinerary.findUniqueOrThrow({
    where: { id: itineraryId },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } },
  });
  if (row.title !== draft.title) diffs.push(`title: DB「${row.title}」 下書き「${draft.title}」`);
  if (row.description !== draft.description) diffs.push(`description: 一致しません`);
  if (row.nights !== draft.nights) diffs.push(`nights: DB${row.nights} 下書き${draft.nights}`);
  if (row.status !== "pending") diffs.push(`status: DB「${row.status}」(pendingのはず)`);

  row.days.forEach((d, di) => {
    const draftDay = draft.days[di];
    if (!draftDay) { diffs.push(`Day${d.dayNumber}: 下書きに存在しません`); return; }
    d.spots.forEach((s, si) => {
      const ds = draftDay[si];
      if (!ds) { diffs.push(`Day${d.dayNumber} ${s.name}: 下書きに存在しません`); return; }
      const label = `Day${d.dayNumber} ${s.name}`;
      if (s.name !== ds.name) diffs.push(`${label}: name DB「${s.name}」下書き「${ds.name}」`);
      if (fmtTime(s.visitTime) !== ds.time) diffs.push(`${label}: time DB${fmtTime(s.visitTime)} 下書き${ds.time}`);
      if (s.stayDurationMin !== ds.stayDurationMin) diffs.push(`${label}: stayDurationMin DB${s.stayDurationMin} 下書き${ds.stayDurationMin}`);
      if (s.memo !== ds.memo) diffs.push(`${label}: memo が一致しません`);
      if (Number(s.lat) !== ds.point.lat || Number(s.lng) !== ds.point.lng) diffs.push(`${label}: 座標 DB(${s.lat},${s.lng}) 下書き(${ds.point.lat},${ds.point.lng})`);
      const dbLegs = s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ?? ""}`).join("+");
      const draftLegs = ds.legs.map((l) => `${l.mode}${l.min}${l.line ?? ""}`).join("+");
      if (dbLegs !== draftLegs) diffs.push(`${label}: legs DB[${dbLegs}] 下書き[${draftLegs}]`);
    });
  });
  return diffs;
}
