/**
 * タグ「冬の旅」の新設と、冬が主題の既存しおりへの付与
 * docs/specs/20260924-theme-winter.md A
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/add-winter-tag.ts
 *   登録モード: npx tsx prisma/add-winter-tag.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TAG_NAME = "冬の旅";

// 企画運営確認済みの8件 + 光の王国（ハウステンボス、例年10月〜5月ごろ開催のため冬も含む）
const TARGET_IDS = [
  "d8ccb730-d487-4621-a610-a02f8af8f68a", // 雪の金閣寺と北野の梅。冬の京都・洛北をめぐる日帰り旅
  "180bc90c-02d3-4f11-a6ea-5866d0bd0da6", // さっぽろ雪まつりと小樽雪あかりの路。冬の北海道を満喫する旅
  "b461a3e0-87c6-48dd-b5e8-886ba0345df7", // 雪の山寺と、ガス灯がともる銀山温泉の夜
  "ce594140-b602-4b84-9a15-7e1cda98c987", // 樹氷原へロープウェイで空中散歩。冬の蔵王日帰り旅
  "6e2f29bb-45c2-494a-83c1-8e42e11552c1", // 外湯めぐりと松葉ガニ。冬の城崎温泉でゆかた散歩
  "177ea052-e17b-4922-8151-54de866305f5", // 梅と花火と温泉街。冬の熱海を楽しむ日帰り旅
  "89522173-3b95-4393-a808-5ed5d465d85b", // 湯畑の湯けむりと雪見の露天風呂。冬の草津でゆったり湯めぐり
  "0534e5d3-5ada-405b-8781-ed4c0414dc75", // 雪の白川郷と飛騨高山。冬の合掌造り集落をめぐる旅
  "bd3ec175-b1cc-43be-9169-ec9e31ecc71a", // 光の王国、日本最大級のイルミネーションを楽しむ夜プラン
];

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const its = await prisma.itinerary.findMany({
    where: { id: { in: TARGET_IDS } },
    select: { id: true, title: true, tags: { select: { tag: { select: { name: true } } } } },
  });
  const found = new Set(its.map((it) => it.id));
  const missing = TARGET_IDS.filter((id) => !found.has(id));
  if (missing.length > 0) console.log(`\n⚠️ 見つからないID: ${missing.join(", ")}`);

  console.log(`\n対象: ${its.length}件`);
  for (const it of its) {
    const already = it.tags.some((t) => t.tag.name === TAG_NAME);
    console.log(`  ${already ? "(既に付与済み)" : ""}${it.title}`);
  }

  const existingTag = await prisma.tag.findFirst({ where: { name: TAG_NAME } });
  console.log(`\nTag「${TAG_NAME}」: ${existingTag ? "既存" : "新規作成"}`);

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  const tag = existingTag ?? (await prisma.tag.create({ data: { name: TAG_NAME } }));
  await prisma.itineraryTag.createMany({
    data: TARGET_IDS.filter((id) => found.has(id)).map((itineraryId) => ({ itineraryId, tagId: tag.id })),
    skipDuplicates: true,
  });

  const count = await prisma.itinerary.count({ where: { status: "published", tags: { some: { tag: { name: TAG_NAME } } } } });
  console.log(`\n付与しました。タグ「${TAG_NAME}」の公開しおり件数: ${count}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
