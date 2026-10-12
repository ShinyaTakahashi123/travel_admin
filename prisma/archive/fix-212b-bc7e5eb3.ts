/**
 * #212 bc7e5eb3 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * ① 大涌谷に、火山ガスの体への一文
 * ② 海賊船に、デッキの揺れ・手すりの一文
 * ③ 箱根神社「坂上田村麻呂がお参りして願いがかなったことから」を伝聞（〜と伝えられ）に
 * ④ 彫刻の森美術館の写真（Hakone5.jpg、表紙も同じ）は今の作家の彫刻作品が大きく写っており、入場料のいる美術館の庭が著作権法46条の
 *    「一般に開放された屋外の場所」にあたるか確かでないので外す（Blob は消さない）。表紙は大涌谷の写真にする。
 *    photo-cache.json の「彫刻の森美術館」のキーも消す（ほかのしおりで同じ写真が付き直らないように）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-212b-bc7e5eb3.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "bc7e5eb3-b38a-4372-a07b-e6fa8fcb0577";
const PHOTO_ID = "1358e670-ed6a-41a8-a3b2-f8914206574f";
const OWAKU_PHOTO_ID = "38419713-2a6e-4860-a444-ad1097524e70";
const COMMIT = process.argv.includes("--commit");
const REP: [string, string, string][] = [
  ["大涌谷", "温泉の池でゆでた名物の黒たまごもあります。", "温泉の池でゆでた名物の黒たまごもあります。火山ガスが出ているので、ぜんそくや心臓の病気のある人、体調のすぐれない人は気をつけましょう。"],
  ["箱根海賊船（桃源台港）", "晴れた日は、デッキから湖を囲む山々を眺めましょう。", "晴れた日は、デッキから湖を囲む山々を眺めましょう。デッキは揺れることがあるので、手すりにつかまり、足元に気をつけましょう。"],
  ["箱根神社", "坂上田村麻呂がお参りして願いがかなったことから、武将たちの信仰を集め、", "坂上田村麻呂がお参りして願いがかなったと伝えられ、武将たちの信仰を集めて、"],
];

async function main() {
  const updates: [string, string][] = [];
  for (const [name, a, b] of REP) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(a)) throw new Error(`${name}: 本文が想定と違います`);
    updates.push([name, s.memo.replace(a, b)]);
    console.log(`${name}: …${b}`);
  }
  const ph = await prisma.photo.findUniqueOrThrow({ where: { id: PHOTO_ID } });
  const ow = await prisma.photo.findUniqueOrThrow({ where: { id: OWAKU_PHOTO_ID } });
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  if (!String(ph.sourceUrl).includes("Hakone5") || it.thumbnailUrl !== ph.url) throw new Error("写真が想定と違います");
  console.log(`写真を外す: ${ph.id}（${ph.sourceUrl}）\n表紙: → ${ow.url}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [name, memo] of updates) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name }, { memo }, { tx });
    await tx.photo.delete({ where: { id: PHOTO_ID } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { thumbnailUrl: ow.url } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
