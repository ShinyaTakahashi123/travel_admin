/**
 * #324 中津城と福澤諭吉旧居、定番の中津さんぽ日帰りプラン(84eb50c0)。
 * チェックリスト: 2か所09:30〜11:30で4か所未満・終了。
 *
 * 既存2スポットの過剰な丁寧語(「皆様」「ご案内するのは」「お楽しみください」
 * 「お楽しみいただけたことでしょう」)を直し、実在スポット5つを追加:
 * なかはく(中津市歴史博物館)・大江医家史料館・寺町(合元寺周辺の町並み)・
 * 自性寺(大雅堂)・村上医家史料館。
 *
 * 座標の出典(すべてNominatimで名称一致):
 * - 中津市歴史博物館: node 14026579501, 33.6053306,131.1846067
 * - 大江医家史料館: node 2237716791, 33.6042364,131.1920146
 * - 合元寺(赤壁寺、寺町の代表点): node 2237754365, 33.6029719,131.189783
 * - 自性寺: node 2237754373, 33.6029092,131.1800359
 * - 村上医家史料館: node 1423861563, 33.6019010,131.1849690
 *
 * 事実確認:
 * - 中津市歴史博物館(なかはく): 中津城の石垣側が総ガラス張り、無料ゾーンと
 *   企画展示室(city-nakatsu.jp・nakahaku.jp公式)。料金には触れない
 * - 大江医家史料館: 中津藩の御殿医・大江家の旧宅、「解体新書」関連資料、
 *   華岡青洲ゆかりの医療資料、薬草園(city-nakatsu.jp・visit-oita.jp公式)
 * - 寺町: 江戸期の町割りがそのまま残る、およそ12の寺院が並ぶ通り
 *   (city-nakatsu.jp公式)。合元寺(通称・赤壁寺)の壁の色の由来となった
 *   故事は、死者にまつわる内容のため本文では取り上げず、外観の特徴のみ
 *   紹介した
 * - 自性寺(大雅堂): 中津藩主・奥平家の菩提寺、池大雅の書画をおよそ50点
 *   常設展示(visit-oita.jp・nakatsuyaba.com公式)
 * - 村上医家史料館: 寛永17年(1640)開業、中津藩・奥平家の御典医、JR中津駅
 *   から徒歩10分、開館9:00〜17:00・最終入館16:30(city-nakatsu.jp公式)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-324-84eb50c0.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "84eb50c0-577b-428d-9200-80b8a8f2fedb";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const nakatsujo = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "中津城" } });
  const fukuzawa = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "福澤諭吉旧居・福澤記念館" } });

  const already = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "村上医家史料館" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const nakatsujoMemo = (nakatsujo.memo ?? "")
    .replace("皆様、本日ご案内するのは中津城です。", "中津城は、")
    .replace(
      "名将たちが手がけた石垣の歴史を感じながら、城内をご覧ください。",
      "名将たちが手がけた石垣の歴史を感じながら、城内を見学しましょう。続いては、歩いてすぐのなかはく(中津市歴史博物館)へ向かいましょう。"
    );

  const fukuzawaMemo = (fukuzawa.memo ?? "")
    .replace("続いてご案内するのは福澤諭吉旧居・福澤記念館です。", "なかはくからは歩いておよそ8分です。福澤諭吉旧居・福澤記念館は、")
    .replace(
      "中津が生んだ偉人の原点に触れる、静かなひとときをお楽しみください。中津城と福澤諭吉旧居、定番の中津さんぽ日帰りプランをお楽しみいただけたことでしょう。",
      "中津が生んだ偉人の原点に触れる、静かなひとときを過ごしましょう。到着前後で、このあたりで昼食をとりましょう。続いては、歩いてすぐの大江医家史料館へ向かいましょう。"
    );

  await setDaySpotOrder(day1.id, [
    { id: nakatsujo.id, data: { memo: nakatsujoMemo } },
    {
      create: {
        name: "なかはく",
        address: "中津市二ノ丁",
        lat: 33.6053306,
        lng: 131.1846067,
        visitTime: new Date(Date.UTC(1970, 0, 1, 10, 23)),
        stayDurationMin: 65,
        transitMode: "walk",
        transitDurationMin: 3,
        memo:
          "中津城からは歩いてすぐです。中津市歴史博物館(愛称・なかはく)は、黒田官兵衛が築いた石垣を間近に鑑賞できるよう、石垣側を総ガラス張りにした博物館です。常設展示室や企画展示室のほか、石垣シアターなど気軽に楽しめるコーナーもあり、中津の歴史を分かりやすく学ぶことができます。中津城の石垣の迫力を、館内からもあらためて眺めてみましょう。続いては、歩いておよそ8分の福澤諭吉旧居・福澤記念館へ向かいましょう。",
      },
    },
    { id: fukuzawa.id, data: { memo: fukuzawaMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 36)), stayDurationMin: 60 } },
    {
      create: {
        name: "大江医家史料館",
        address: "中津市諸町906",
        lat: 33.6042364,
        lng: 131.1920146,
        visitTime: new Date(Date.UTC(1970, 0, 1, 12, 40)),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 4,
        memo:
          "福澤諭吉旧居・福澤記念館からは歩いておよそ4分です。大江医家史料館は、中津藩の御殿医を代々務めた大江家の旧宅を活用した史料館です。「解体新書」に関する資料や、全身麻酔による乳がん摘出手術を初めて成功させた華岡青洲ゆかりの医療資料などが展示されています。敷地内には薬草園もあり、麻酔に使われたと伝わるマンドラゴラなど、珍しい薬草を見ることもできます。中津に息づいた蘭学と医学の歴史に、じっくりとふれてみましょう。続いては、歩いてすぐの寺町へ向かいましょう。",
      },
    },
    {
      create: {
        name: "寺町",
        address: "中津市新博多町",
        lat: 33.6029719,
        lng: 131.189783,
        visitTime: new Date(Date.UTC(1970, 0, 1, 13, 18)),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        memo:
          "大江医家史料館からは歩いてすぐです。寺町は、中津城の東側に広がる、江戸時代の町割りがそのまま残るエリアです。およそ12の寺院が軒を連ね、白壁の土蔵や、鮮やかな朱色の壁を持つ合元寺(通称・赤壁寺)など、趣の異なる寺院建築を見比べながら歩くことができます。城下町ならではの静かな町並みを、ゆっくりと散策してみましょう。続いては、歩いておよそ12分の自性寺へ向かいましょう。",
      },
    },
    {
      create: {
        name: "自性寺",
        address: "中津市島田本町",
        lat: 33.6029092,
        lng: 131.1800359,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 0)),
        stayDurationMin: 75,
        transitMode: "walk",
        transitDurationMin: 12,
        memo:
          "寺町からは歩いておよそ12分です。自性寺は、中津藩主・奥平家歴代の菩提寺です。江戸中期の画家・池大雅と親交のあった十二代住職のもとに大雅夫妻が滞在した際に描いたと伝わる書画、およそ50点が書院の襖に残されており、「大雅堂」とも呼ばれています。池大雅の書画をこれだけまとまった形で常設展示しているのは、全国でもここだけとされています。歴史ある寺院で、貴重な文人画の世界にふれてみましょう。続いては、歩いておよそ6分の村上医家史料館へ向かいましょう。",
      },
    },
    {
      create: {
        name: "村上医家史料館",
        address: "中津市諸町1780",
        lat: 33.601901,
        lng: 131.184969,
        visitTime: new Date(Date.UTC(1970, 0, 1, 15, 21)),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 6,
        memo:
          "自性寺からは歩いておよそ6分です。村上医家史料館は、寛永17年(1640)に初代・宗伯が諸町に医院を開いて以来、中津藩・奥平家の御典医を代々務めてきた村上家の史料館です。江戸時代から伝わる医学書や医療器具など、貴重な資料が展示されており、蘭学や医学の歴史に加え、この地が生んだ前野良沢や福澤諭吉ゆかりの学問の系譜をたどることができます。中津さんぽの締めくくりに、じっくりと見学しましょう。見学を終えたら、JR中津駅まで歩きましょう(およそ10分)。",
      },
    },
  ]);

  for (const [name, mode, min] of [
    ["なかはく", "walk", 3],
    ["福澤諭吉旧居・福澤記念館", "walk", 8],
    ["大江医家史料館", "walk", 4],
    ["寺町", "walk", 3],
    ["自性寺", "walk", 12],
    ["村上医家史料館", "walk", 6],
  ] as [string, string, number][]) {
    const s = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: s.id, orderNo: 1, transitMode: mode, transitDurationMin: min },
    });
  }

  const newDescription =
    "「奥平の城」として知られる中津城と、一万円札の顔・福澤諭吉が育った旧居。なかはくや大江医家史料館、寺町の町並み、大雅の書画で知られる自性寺、村上医家史料館まで、中津の歴史と偉人ゆかりの地を巡る定番プランです。";
  if (itin.description !== newDescription) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: newDescription } });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
