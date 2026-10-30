/**
 * #87 運河の街・小樽と積丹ブルーを満喫する海辺の旅 (c36653a4-5028-4cd1-8a44-da82c154eebf)
 * 初日・最終日の見直し。
 *
 * 初日: 入口(JR小樽駅)の到着時刻の記載がなく09:00開始だったため、入口10:30以降が必要になる。
 * 説明文の7か所すべてに名前があり外せないため、企画運営の判断で、旧手宮線をスポートとしては
 * 外し、「小樽駅から旧手宮線の線路跡を歩いて総合博物館へ」という入口の行き方として総合博物館の
 * 書き出しに統合する(説明文の「旧手宮線」の記載はそのまま成り立つ)。線路跡沿いの道のりを
 * 実測(35.9分→36分)。総合博物館→運河も実測より短すぎたため直す(20→27分)。これらの遅れを、
 * 滞在の短縮(博物館70→50・芸術村80→52・寿司屋通り60→50・運河35→30・堺町通り35→30・
 * 天狗山50→45、企画運営の目安どおり)で吸収し、終了を17:00に収める。
 *
 * 2日目(最終日): おたる水族館→美国・黄金岬の移動がもと70分だったが、実測39.1分
 * (閾値58.65分)で直す必要があり、44分に直す。この短縮で終了が16:30を下回るため、決まりの
 * 順番②で1か所目(おたる水族館)の開始を09:00→09:30(1泊2日最終日の決まりの範囲内)に遅らせ、
 * さらに神威岬の滞在を95→91分に少しだけ短くして、終了をもとと同じ16:30に収める。
 * レンタカーの文言も、手続き15分+車8分(実測)に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-87-c36653a4.ts
 *   反映: npm run prod -- npx tsx prisma/fix-87-c36653a4.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "6b8e35bc-9417-4008-987b-e1f27db1ed79";
const DAY2_ID = "1f5c565f-16be-4d4e-916c-a4d98f359c6c";

const TEMIYASEN_ID = "3c2be376-50cf-4d54-bed8-c8c1f6edc39d";
const HAKUBUTSUKAN_ID = "97d471c6-4ad6-4ec5-b2ce-040f73941304";
const UNGA_ID = "99614ea6-6032-49f0-83f0-441fccd9271f";
const SUSHIYA_ID = "f9854291-6550-4e14-bbea-24bb1229f21a";
const GEIJUTSUMURA_ID = "59ea05e8-cae2-4f46-845f-4e232ca07b66";
const SAKAIMACHI_ID = "f3a85017-084d-43d8-9c9b-fd52641f46ca";
const TENGUYAMA_ID = "436f54d1-a07b-4d55-8d52-03748b587c10";

const SUIZOKUKAN_ID = "bf0babb6-fe02-4eb7-823a-ee7edcce4d01";
const BIKUNI_ID = "46b582a6-2033-4672-9ae3-1c7fec6d7e67";
const SHAKOTAN_ID = "d64914a8-f1be-48bb-9a39-0969c53984ee";
const KAMUI_ID = "e466293c-e58e-464c-ac04-b69dad67a58a";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const HAKUBUTSUKAN_MEMO =
  "この日は歩きと路線バスでめぐります。JR小樽駅に10:30ごろ着いたら、寿司屋通りから続く旧国鉄手宮線の跡を生かした約1.6kmの散策路を歩いて、北海道の鉄道が始まった手宮にある総合博物館まで約36分です。手宮線は、1880年に北海道で初めて開通したとされる官営幌内鉄道の一部で、幌内の炭鉱から小樽港へ石炭を運んでいましたが、1985年に廃線になりました。線路や踏切、遮断機がそのまま残り、2018年には北海道遺産「小樽の鉄道遺産」に選ばれています。線路の上では足元に気をつけて歩きましょう。1885年に建てられ、日本で最も古いとされる機関車庫三号は国の重要文化財です。屋外には約50両の実物の車両が並び、1909年にアメリカで造られた蒸気機関車「アイアンホース号」が客車を引いて走る日もあります。運行日や休館日は公式の案内で確かめましょう。";

const UNGA_FIND = "博物館から南へ歩いて約20分。";
const UNGA_REPLACE = "博物館から南へ歩いて約27分。";

const SUIZOKUKAN_FIND = "JR小樽駅のそばでレンタカーを借りて、車で約20分の祝津へ。";
const SUIZOKUKAN_REPLACE = "JR小樽駅のそばでレンタカーを借りて(手続きに15分ほど)、車で約8分の祝津へ。";

const BIKUNI_FIND = "水族館から海沿いを車で約1時間10分、積丹半島の美国へ。";
const BIKUNI_REPLACE = "水族館から海沿いを車で約44分、積丹半島の美国へ。";

const KAMUI_FIND = "帰りは、小樽まで車で約2時間です。";
const KAMUI_REPLACE = "帰りは、小樽まで車で約1時間20分です。JR小樽駅のそばでレンタカーを返しましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [unga, suizokukan, bikuni, kamui] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: UNGA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SUIZOKUKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: BIKUNI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KAMUI_ID } }),
  ]);

  for (const [label, text, find] of [
    ["小樽運河", unga.memo ?? "", UNGA_FIND],
    ["おたる水族館", suizokukan.memo ?? "", SUIZOKUKAN_FIND],
    ["美国・黄金岬", bikuni.memo ?? "", BIKUNI_FIND],
    ["神威岬", kamui.memo ?? "", KAMUI_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newUngaMemo = unga.memo!.replace(UNGA_FIND, UNGA_REPLACE);
  const newSuizokukanMemo = suizokukan.memo!.replace(SUIZOKUKAN_FIND, SUIZOKUKAN_REPLACE);
  const newBikuniMemo = bikuni.memo!.replace(BIKUNI_FIND, BIKUNI_REPLACE);
  const newKamuiMemo = kamui.memo!.replace(KAMUI_FIND, KAMUI_REPLACE);

  console.log("=== #87 初日・最終日の見直し ===\n");
  console.log("--- 初日(6か所。旧手宮線をスポットとしては外し、入口の行き方に統合) ---");
  console.log("1. 小樽市総合博物館 11:06(50分、もとは70分、入口+旧手宮線の内容を追加):");
  console.log(HAKUBUTSUKAN_MEMO);
  console.log("\n2. 小樽運河 12:23(30分、もとは35分、移動20→27分):");
  console.log(newUngaMemo);
  console.log("\n3. 小樽寿司屋通り 13:08(50分、もとは60分、昼食、内容変更なし)");
  console.log("4. 小樽芸術村 14:08(52分、もとは80分、内容変更なし)");
  console.log("5. 堺町通り商店街 15:10(30分、もとは35分、内容変更なし)");
  console.log("6. 天狗山(最後) 16:15(45分、もとは50分、終了17:00、内容変更なし)");

  console.log("\n--- 2日目(最終日、変更なし。おたる水族館→美国の移動を直す) ---");
  console.log("1. おたる水族館 09:30(90分、もとは09:00開始、レンタカーの文言を直す):");
  console.log(newSuizokukanMemo);
  console.log("\n2. 美国・黄金岬 11:44(80分、移動70→44分):");
  console.log(newBikuniMemo);
  console.log("\n3. 積丹岬(島武意海岸) 13:24(70分、内容変更なし)");
  console.log(
    "4. 神威岬(最後) 14:59(91分、もとは95分、終了16:30、もとと同じ、帰りの一文を約1時間20分に直す。海沿いの国道229号はOSRMが短く出るため、実際の目安の範囲で丸める):"
  );
  console.log(newKamuiMemo);

  console.log("\n外す: 旧手宮線(スポットとしては外し、総合博物館の書き出しで行き方として紹介)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: HAKUBUTSUKAN_ID, data: { visitTime: t(11, 6), stayDurationMin: 50, memo: HAKUBUTSUKAN_MEMO, transitLegs: { deleteMany: {} } } },
      {
        id: UNGA_ID,
        data: {
          visitTime: t(12, 23),
          stayDurationMin: 30,
          memo: newUngaMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 27 }] },
        },
      },
      { id: SUSHIYA_ID, data: { visitTime: t(13, 8), stayDurationMin: 50 } },
      { id: GEIJUTSUMURA_ID, data: { visitTime: t(14, 8), stayDurationMin: 52 } },
      { id: SAKAIMACHI_ID, data: { visitTime: t(15, 10), stayDurationMin: 30 } },
      { id: TENGUYAMA_ID, data: { visitTime: t(16, 15), stayDurationMin: 45 } },
    ],
    { remove: [TEMIYASEN_ID] }
  );

  await setDaySpotOrder(
    DAY2_ID,
    [
      { id: SUIZOKUKAN_ID, data: { visitTime: t(9, 30), stayDurationMin: 90, memo: newSuizokukanMemo } },
      {
        id: BIKUNI_ID,
        data: {
          visitTime: t(11, 44),
          stayDurationMin: 80,
          memo: newBikuniMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 44 }] },
        },
      },
      { id: SHAKOTAN_ID, data: { visitTime: t(13, 24), stayDurationMin: 70 } },
      { id: KAMUI_ID, data: { visitTime: t(14, 59), stayDurationMin: 91, memo: newKamuiMemo } },
    ],
    {}
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
