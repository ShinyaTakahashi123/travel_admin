/**
 * #2 bb3ae76a 点の直しの続き（しおりえ(制作補助2)、法務 10/30 の指摘。OSM のどの点とも一致しない前からの点）
 * - はこだて明治館 41.766708,140.717316 → node 4646622292（41.766633,140.718792）。金森から foot 299m・4.0分（5分のまま）、山麓駅まで 874m・11.7分（約12分のまま）
 * - 函館聖ヨハネ教会 41.762726,140.713104 → way 390279691（41.762551,140.712804）。ハリストスから 81m・1.1分（2分のまま）
 * - 外国人墓地 41.767921,140.696533 → way 583977285（41.767305,140.696321）
 *   ヨハネ→墓地は foot 1,857m・24.8分で、いまの「歩いて12分」は前の点でも 1,796m・23.9分と短すぎた → 25分に直す
 *   13分遅れるぶんは立待岬の滞在 58→45分で合わせ、立待岬を出る 15:41 と終わり 16:32 は変えない
 *   墓地 14:03→14:16、立待岬 14:43→14:56（タクシーは OSRM 9.8分＋5 で15分のまま）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-002d-bb3ae76a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const MEIJI = "7c56eb57-6be0-4062-836e-b090186d92b7";
const YOHA = "0d0e493f-c777-410a-a2fd-6f0e1518788a";
const BOCHI = "e01e6de3-104a-469b-a13f-43e618b95521";
const TACHI = "83d240bf-a232-4fbc-9ebd-8b44a485ca0d";
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [MEIJI]: { from: [41.766708, 140.717316], to: [41.766633, 140.718792] },
  [YOHA]: { from: [41.762726, 140.713104], to: [41.762551, 140.712804] },
  [BOCHI]: { from: [41.767921, 140.696533], to: [41.767305, 140.696321] },
};
const EDITS: Record<string, { from: string; to: string }> = {
  [YOHA]: { from: "この後は、歩いておよそ12分、外国人墓地へ向かいましょう。", to: "この後は、歩いておよそ25分、外国人墓地へ向かいましょう。" },
  [BOCHI]: { from: "函館聖ヨハネ教会から歩いておよそ12分、", to: "函館聖ヨハネ教会から歩いておよそ25分、" },
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [MEIJI, YOHA, BOCHI, TACHI] } }, include: { transitLegs: true, day: { select: { itineraryId: true } } } });
  const get = (id: string) => spots.find((s) => s.id === id)!;
  if (spots.length !== 4 || spots.some((s) => !s.day.itineraryId.startsWith("bb3ae76a"))) throw new Error("スポットが想定と違います");
  for (const [id, c] of Object.entries(COORDS)) {
    const s = get(id);
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
    console.log(`${s.name}: ${c.from.join(",")} → ${c.to.join(",")}`);
  }
  const hm = (d: Date) => `${d.getUTCHours()}:${String(d.getUTCMinutes()).padStart(2, "0")}`;
  const b = get(BOCHI), tc = get(TACHI);
  if (hm(b.visitTime!) !== "14:03" || b.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join() !== "walk12" || hm(tc.visitTime!) !== "14:43" || tc.stayDurationMin !== 58)
    throw new Error("時刻が想定と違います");
  const memos: Record<string, string> = {};
  for (const [id, e] of Object.entries(EDITS)) {
    const m = get(id).memo ?? "";
    if (m.split(e.from).length !== 2) throw new Error(`${get(id).name}: 置き換え元が見つかりません`);
    memos[id] = m.replace(e.from, e.to);
    console.log(`${get(id).name} → ${e.to}`);
  }
  console.log("外国人墓地 14:03 walk12 → 14:16 walk25（滞在25分）、立待岬 14:43 滞在58 → 14:56 滞在45（15:41 に出るのは同じ）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: MEIJI }, data: { lat: COORDS[MEIJI].to[0], lng: COORDS[MEIJI].to[1] } }),
    prisma.spot.update({ where: { id: YOHA }, data: { lat: COORDS[YOHA].to[0], lng: COORDS[YOHA].to[1], memo: memos[YOHA] } }),
    prisma.spot.update({
      where: { id: BOCHI },
      data: {
        lat: COORDS[BOCHI].to[0],
        lng: COORDS[BOCHI].to[1],
        memo: memos[BOCHI],
        visitTime: t(14, 16),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25, transitLine: null }] },
      },
    }),
    prisma.spot.update({ where: { id: TACHI }, data: { visitTime: t(14, 56), stayDurationMin: 45 } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
