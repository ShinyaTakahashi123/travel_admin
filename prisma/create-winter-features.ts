/**
 * docs/specs/20261102-seasonal-and-local-content.md の冬の特集3つを、非公開(draft)で登録する。
 * 文は企画運営・法務のOK済み(2026-11-02)。公開はユーザーの了承のあと、企画運営が行う。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

type FeatureSpec = {
  title: string;
  slug: string;
  description: string;
  lead: string;
  closing: string;
  displayFromMonth: number;
  displayToMonth: number;
  itineraryIds: string[];
};

const features: FeatureSpec[] = [
  {
    title: "雪見の露天風呂と冬の味覚、温泉1泊2日モデルコース6選",
    slug: "winter-onsen-1paku2nichi",
    description:
      "雪見の露天風呂や冬の味覚など、冬だからこそ楽しめる温泉地をめぐる1泊2日のモデルコースを6つ紹介。日光・由布院・別府、越後湯沢、山形の銀山温泉、城崎、草津など、雪景色や冬の湯けむりを楽しめる行き先を集めました。",
    lead:
      "雪化粧した景色を眺めながら入る露天風呂や、冬だけの味覚。寒い季節だからこそ味わえる温泉地を、1泊2日で巡るモデルコースを集めました。防寒対策をしっかりして、雪ならではの静かな景色を楽しみましょう。見頃や営業期間は年によって変わるので、お出かけ前に各スポットの公式サイトで確認しましょう。",
    closing:
      "冬季休業やロープウェイの運休など、施設によっては冬に営業時間が変わることがあります。出かける前に、各スポットの公式サイトで最新の案内を確認しましょう。",
    displayFromMonth: 11,
    displayToMonth: 2,
    itineraryIds: [
      "8912b8d0-a38e-4f1e-a03c-4e277b490b03",
      "27e93f15-8dbe-4e72-81d5-7bcde9231b4e",
      "04fcc64b-72d2-4b60-8484-ca892ff27f12",
      "b461a3e0-87c6-48dd-b5e8-886ba0345df7",
      "6e2f29bb-45c2-494a-83c1-8e42e11552c1",
      "89522173-3b95-4393-a808-5ed5d465d85b",
    ],
  },
  {
    title: "初詣で新年を迎える、社寺めぐりの日帰りモデルコース5選",
    slug: "hatsumode-daytrip",
    description:
      "成田山新勝寺、伊勢神宮、太宰府天満宮、出雲大社、熱田神宮など、初詣で知られる社寺をめぐる日帰りのモデルコースを5つ紹介。新年の始まりに訪れたい、由緒ある社寺を集めました。",
    lead:
      "新しい年の始まりに、由緒ある社寺へお参りする初詣。成田山新勝寺や伊勢神宮、太宰府天満宮、出雲大社、熱田神宮など、各地で知られる社寺をめぐる日帰りのモデルコースを集めました。参拝の時間や授与所が、ふだんと変わることもあるので、出かける前に公式の案内で確かめましょう。どの社寺も今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
    closing:
      "三が日や松の内は、社寺によって参拝の受付時間が変わることがあります。出かける前に、公式の案内で確かめましょう。",
    displayFromMonth: 12,
    displayToMonth: 1,
    itineraryIds: [
      "708a13d8-bdd1-4525-9e63-88b12c57eedc",
      "c9b3ad40-531b-4085-a2ab-ebb0dd91cdc0",
      "3bc5f590-86df-44d2-8d07-4eeb8ab4b982",
      "21f198de-13f3-4521-bf40-6e6115c1e4d7",
      "d4fc7a52-9a79-4c7d-b11d-f805ee857a23",
    ],
  },
  {
    title: "雪まつりと雪景色、冬ならではの旅のモデルコース6選",
    slug: "yukimatsuri-fuyukeshiki",
    description:
      "弘前城雪燈籠まつり、さっぽろ雪まつりと小樽雪あかりの路、蔵王の樹氷、兼六園の雪吊り、函館山から望む雪景色、富良野・美瑛の冬景色など、冬ならではの景色を楽しむモデルコースを6つ紹介。",
    lead:
      "雪が積もった城下町や、キャンドルがともる運河、ロープウェイで行ける樹氷原。冬だけの景色と祭りを楽しむモデルコースを集めました。雪道や凍結した道があるので、歩きやすい靴と暖かい服装で出かけましょう。祭りの開催時期や、ロープウェイなどの運行状況は、天候などで中止や変更になることがあるので、公式の案内で確かめましょう。",
    closing:
      "雪まつりや雪あかりの路などの行事は、天候などで中止や変更になることがあります。出かける前に、主催者の公式サイトで最新の案内を確かめましょう。",
    displayFromMonth: 11,
    displayToMonth: 2,
    itineraryIds: [
      "a0c34490-4b62-4f3f-8162-5802cf5d401d",
      "180bc90c-02d3-4f11-a6ea-5866d0bd0da6",
      "ce594140-b602-4b84-9a15-7e1cda98c987",
      "b9644a96-7df9-49c3-9e53-143e26595368",
      "1c95d06d-e976-4728-8ccb-00d5d5690287",
      "03330540-baac-4c12-8b39-caa89a43bbcb",
    ],
  },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const f of features) {
    const existing = await prisma.feature.findUnique({ where: { slug: f.slug } });
    if (existing) throw new Error(`slug "${f.slug}" はすでに使われています(${existing.id})`);
    for (const id of f.itineraryIds) {
      await prisma.itinerary.findUniqueOrThrow({ where: { id } });
    }
    console.log(`\n[${f.title}] slug=${f.slug} from=${f.displayFromMonth} to=${f.displayToMonth} items=${f.itineraryIds.length}`);
  }

  if (!commit) {
    console.log("\n前提の確認OK(slug重複なし・しおりID全件実在)。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const f of features) {
      const feature = await tx.feature.create({
        data: {
          title: f.title,
          slug: f.slug,
          description: f.description,
          lead: f.lead,
          closing: f.closing,
          status: "draft",
          displayFromMonth: f.displayFromMonth,
          displayToMonth: f.displayToMonth,
        },
      });
      for (let i = 0; i < f.itineraryIds.length; i++) {
        await tx.featureItem.create({
          data: { featureId: feature.id, itineraryId: f.itineraryIds[i], displayOrder: i },
        });
      }
      console.log(`作成: ${feature.title} (${feature.id})`);
    }
  });
  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());
