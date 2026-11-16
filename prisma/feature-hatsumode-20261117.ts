/**
 * 初詣の特集を強くする(docs/specs/20261117-hatsumode-feature.md)。
 * ユーザーの決定(企画運営の画面、2026-11-17 3時台)を受け、以下を行う:
 *  1. 既存の特集 hatsumode-daytrip に5本足し、題・説明文・はじめの文を10本向けに見直す(slugは変えない)
 *  2. 地域の特集を2つ新しく作る: hatsumode-tokyo・hatsumode-kyoto-nara
 * hatsumode-tokyoの題・説明文にあった「定番の社寺」は、言い切り・おすすめの言い方にあたるため
 * 「初詣で知られる社寺」に直した(企画運営2026-11-17の指摘)。
 *
 * 法務・内容確認1のOKのあとで --commit する。
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/feature-hatsumode-20261117.ts
 *   本登録     : npm run prod -- npx tsx prisma/feature-hatsumode-20261117.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const EXISTING_SLUG = "hatsumode-daytrip";
const EXISTING_UPDATE = {
  title: "初詣のモデルコース10選、新年に社寺をめぐる日帰り・1泊2日の旅のしおり",
  description:
    "明治神宮、伏見稲荷大社、住吉大社、鶴岡八幡宮、日光東照宮、成田山新勝寺、伊勢神宮、太宰府天満宮、出雲大社、熱田神宮など、初詣で知られる社寺をめぐる日帰り・1泊2日のモデルコースを10本紹介。新年の始まりに訪れたい、由緒ある社寺を集めました。",
  lead:
    "新しい年の始まりに、由緒ある社寺へお参りする初詣。明治神宮や伏見稲荷大社、住吉大社、鶴岡八幡宮、日光東照宮、成田山新勝寺、伊勢神宮、太宰府天満宮、出雲大社、熱田神宮など、各地で知られる社寺をめぐる日帰り・1泊2日のモデルコースを集めました。参拝の時間や授与所が、ふだんと変わることもあるので、出かける前に公式の案内で確かめましょう。どの社寺も今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
};
const EXISTING_ADD_ITINERARY_IDS = [
  "cf6ae961-1b58-486b-8b4f-fcae6f7e0516", // 明治神宮
  "27d28702-2f4b-4134-947c-b2725f9b90c0", // 伏見稲荷大社
  "e6eb7aab-6ea8-4039-90ee-6f45ccd39770", // 住吉大社
  "dba1a628-faa4-451e-94d2-73f6a09356e4", // 鶴岡八幡宮
  "3b74d624-6a42-4c82-8c6e-d93977d146a0", // 日光東照宮
];

const CLOSING = "三が日や松の内は、社寺によって参拝の受付時間が変わることがあります。出かける前に、公式の案内で確かめましょう。";

type NewFeature = { title: string; slug: string; description: string; lead: string; closing: string; displayFromMonth: number; displayToMonth: number; itineraryIds: string[] };
const NEW_FEATURES: NewFeature[] = [
  {
    title: "東京から行く初詣のモデルコース、都心と近郊の社寺をめぐる旅",
    slug: "hatsumode-tokyo",
    description:
      "明治神宮、浅草寺、鶴岡八幡宮、成田山新勝寺など、東京から日帰り・1泊2日で行ける初詣で知られる社寺をめぐるモデルコースを紹介。新年の始まりに、都心から近郊まで足を延ばしてお参りしたい社寺を集めました。",
    lead:
      "東京やその近郊には、初詣で知られる社寺がいくつもあります。明治神宮や浅草寺、鶴岡八幡宮、成田山新勝寺など、これらの社寺をめぐるモデルコースを集めました。参拝の時間や授与所が、ふだんと変わることもあるので、出かける前に公式の案内で確かめましょう。どの社寺も今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
    closing: CLOSING,
    displayFromMonth: 12,
    displayToMonth: 1,
    itineraryIds: [
      "cf6ae961-1b58-486b-8b4f-fcae6f7e0516", // 明治神宮
      "0c3184ff-3941-434a-807b-2285e927ce24", // 浅草寺
      "dba1a628-faa4-451e-94d2-73f6a09356e4", // 鶴岡八幡宮
      "bd51bb5e-0c5c-4b1e-98de-c6a125a64de5", // 成田山新勝寺
    ],
  },
  {
    title: "京都・奈良の初詣のモデルコース、古都の社寺をめぐる旅",
    slug: "hatsumode-kyoto-nara",
    description:
      "伏見稲荷大社、八坂神社、下鴨神社、東大寺・春日大社など、京都・奈良で知られる社寺をめぐる初詣のモデルコースを紹介。古都で新年の始まりを過ごす、日帰り・1泊2日の旅をまとめました。",
    lead:
      "京都・奈良には、初詣で知られる社寺が数多くあります。伏見稲荷大社や八坂神社、下鴨神社、東大寺・春日大社など、古都ならではの社寺をめぐるモデルコースを集めました。参拝の時間や授与所が、ふだんと変わることもあるので、出かける前に公式の案内で確かめましょう。どの社寺も今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
    closing: CLOSING,
    displayFromMonth: 12,
    displayToMonth: 1,
    itineraryIds: [
      "27d28702-2f4b-4134-947c-b2725f9b90c0", // 伏見稲荷大社
      "fcaa0edb-3539-47f5-ae75-4ee183f27044", // 八坂神社
      "b259c699-71d2-4923-84f4-cc6e2d6cecd3", // 下鴨神社
      "a37b8c79-85e0-4c3d-b2c6-94057033f31a", // 東大寺・春日大社
    ],
  },
];

async function main() {
  console.log(commit ? "=== 本登録モード ===" : "=== 確認モード(書き込みなし) ===");

  const existing = await prisma.feature.findUnique({ where: { slug: EXISTING_SLUG }, include: { items: true } });
  if (!existing) throw new Error(`既存の特集が見つかりません: ${EXISTING_SLUG}`);
  const existingItineraryIds = new Set(existing.items.map((i) => i.itineraryId));
  for (const id of EXISTING_ADD_ITINERARY_IDS) {
    if (existingItineraryIds.has(id)) throw new Error(`すでに${EXISTING_SLUG}に入っています: ${id}`);
    await prisma.itinerary.findUniqueOrThrow({ where: { id } });
  }
  console.log(`\n[既存を直す] ${EXISTING_SLUG} (${existing.id})`);
  console.log(`  題: ${existing.title}\n   -> ${EXISTING_UPDATE.title}`);
  console.log(`  説明文: ${existing.description}\n   -> ${EXISTING_UPDATE.description}`);
  console.log(`  はじめの文: ${existing.lead}\n   -> ${EXISTING_UPDATE.lead}`);
  console.log(`  足す本数: ${EXISTING_ADD_ITINERARY_IDS.length}(今の${existing.items.length}本 -> ${existing.items.length + EXISTING_ADD_ITINERARY_IDS.length}本)`);

  for (const f of NEW_FEATURES) {
    const dup = await prisma.feature.findUnique({ where: { slug: f.slug } });
    if (dup) throw new Error(`slug "${f.slug}" はすでに使われています(${dup.id})`);
    for (const id of f.itineraryIds) await prisma.itinerary.findUniqueOrThrow({ where: { id } });
    console.log(`\n[新規] ${f.title} slug=${f.slug} from=${f.displayFromMonth} to=${f.displayToMonth} items=${f.itineraryIds.length}`);
  }

  if (!commit) return console.log("\n確認モードです。前提の確認OK。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.feature.update({
      where: { id: existing.id },
      data: { title: EXISTING_UPDATE.title, description: EXISTING_UPDATE.description, lead: EXISTING_UPDATE.lead },
    });
    let order = existing.items.length;
    for (const id of EXISTING_ADD_ITINERARY_IDS) {
      await tx.featureItem.create({ data: { featureId: existing.id, itineraryId: id, displayOrder: order++ } });
    }
    console.log(`直しました: ${EXISTING_SLUG}`);

    for (const f of NEW_FEATURES) {
      const feature = await tx.feature.create({
        data: {
          title: f.title,
          slug: f.slug,
          description: f.description,
          lead: f.lead,
          closing: f.closing,
          status: "published",
          publishedAt: new Date(),
          displayFromMonth: f.displayFromMonth,
          displayToMonth: f.displayToMonth,
        },
      });
      for (let i = 0; i < f.itineraryIds.length; i++) {
        await tx.featureItem.create({ data: { featureId: feature.id, itineraryId: f.itineraryIds[i], displayOrder: i } });
      }
      console.log(`作成: ${feature.title} (${feature.id})`);
    }
  });
  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());
