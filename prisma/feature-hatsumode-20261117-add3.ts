/**
 * 初詣の特集(hatsumode-daytrip)に、新しく公開した3本(東国三社・川崎大師・諏訪大社、いずれも日帰り)を足す。
 * ユーザーの言葉「3本を初詣の特集に足して」(企画運営の画面、2026-11-17 09:09ごろJST)を受けて作成。
 * 題・説明文・はじめの文の本数を10→13に見直す(slugは変えない)。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/feature-hatsumode-20261117-add3.ts
 *   本登録     : npm run prod -- npx tsx prisma/feature-hatsumode-20261117-add3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const SLUG = "hatsumode-daytrip";

const UPDATE = {
  title: "初詣のモデルコース13選、新年に社寺をめぐる日帰り・1泊2日の旅のしおり",
  description:
    "明治神宮、伏見稲荷大社、住吉大社、鶴岡八幡宮、日光東照宮、成田山新勝寺、伊勢神宮、太宰府天満宮、出雲大社、熱田神宮、鹿島神宮、川崎大師、諏訪大社など、初詣で知られる社寺をめぐる日帰り・1泊2日のモデルコースを13本紹介。新年の始まりに訪れたい、由緒ある社寺を集めました。",
  lead:
    "新しい年の始まりに、由緒ある社寺へお参りする初詣。明治神宮や伏見稲荷大社、住吉大社、鶴岡八幡宮、日光東照宮、成田山新勝寺、伊勢神宮、太宰府天満宮、出雲大社、熱田神宮、鹿島神宮、川崎大師、諏訪大社など、各地で知られる社寺をめぐる日帰り・1泊2日のモデルコースを集めました。参拝の時間や授与所が、ふだんと変わることもあるので、出かける前に公式の案内で確かめましょう。どの社寺も今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
};
const ADD_ITINERARY_IDS = [
  "7d6aacfb-606a-485e-98ea-0bdcda28670a", // 鹿島神宮・香取神宮・息栖神社(東国三社)
  "a640202e-80a7-47c7-94bd-728ab553da59", // 川崎大師と總持寺
  "42bf6bf1-2b3a-476f-bc6c-d79c2bc4c107", // 諏訪大社の四社めぐり
];

async function main() {
  console.log(commit ? "=== 本登録モード ===" : "=== 確認モード(書き込みなし) ===");

  const existing = await prisma.feature.findUnique({ where: { slug: SLUG }, include: { items: true } });
  if (!existing) throw new Error(`特集が見つかりません: ${SLUG}`);
  const existingIds = new Set(existing.items.map((i) => i.itineraryId));
  for (const id of ADD_ITINERARY_IDS) {
    if (existingIds.has(id)) throw new Error(`すでに${SLUG}に入っています: ${id}`);
    const it = await prisma.itinerary.findUniqueOrThrow({ where: { id }, select: { title: true, status: true, nights: true } });
    if (it.status !== "published") throw new Error(`published ではありません: ${id} (${it.status})`);
    console.log(`  足す: [${it.nights}泊] ${it.title}`);
  }

  console.log(`\n[${SLUG}] (${existing.id})`);
  console.log(`  題: ${existing.title}\n   -> ${UPDATE.title}`);
  console.log(`  説明文: ${existing.description}\n   -> ${UPDATE.description}`);
  console.log(`  はじめの文: ${existing.lead}\n   -> ${UPDATE.lead}`);
  console.log(`  足す本数: ${ADD_ITINERARY_IDS.length}(今の${existing.items.length}本 -> ${existing.items.length + ADD_ITINERARY_IDS.length}本)`);

  if (!commit) return console.log("\n確認モードです。前提の確認OK。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.feature.update({ where: { id: existing.id }, data: { title: UPDATE.title, description: UPDATE.description, lead: UPDATE.lead } });
    let order = existing.items.length;
    for (const id of ADD_ITINERARY_IDS) {
      await tx.featureItem.create({ data: { featureId: existing.id, itineraryId: id, displayOrder: order++ } });
    }
  });
  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());
