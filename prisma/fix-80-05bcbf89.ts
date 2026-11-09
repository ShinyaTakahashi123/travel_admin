/**
 * #80(巌門と和倉温泉、能登金剛の絶景と海辺の名湯を楽しむ1泊2日、
 * 05bcbf89)の初日・最終日の見直し。
 *
 * 【遠い場所の初日(企画運営・法務確認済み)】金沢駅からのと里山海道を
 * 北へ約80分かかる車の旅で、10:30着+手続き15分+80分=12:10となり、
 * 11:45を超えるため「遠い場所の例外」を適用する。1か所目の時刻に
 * 上限はないが、3か所以上・昼食13:30ごろ・終了16:30〜17:00は守る。
 *
 * 【3スポットを外す(企画運営の判断)】もとの内容(legs90分+stays345分=
 * 435分)のままでは、1か所目が12:05ごろになる遠い場所の初日の計算上、
 * 終了が16:30〜17:00に収まらない。タイトル・説明文に名前が出てこない
 * 旧福浦灯台・機具岩・世界一長いベンチ(いずれも写真0枚)を外し、巌門を
 * 1か所目にした。
 *
 * 【地震後の状況の確認(企画運営の指示、2026-10-30)】残す5か所と
 * のと里山海道の通行について確認した: のと里山海道は夜間の除雪・工事
 * 規制の記録はあるが全面通行止めの情報はなし。巌門クルーズは運航再開
 * 済み(メモの記載どおり)。道の駅とぎ海街道は公式サイト(togi-
 * michinoeki.com)で今も仮設店舗として営業中と確認(メモの記載どおり)。
 * 妙成寺は2024年半ばに拝観再開の記事あり、重大な休止情報はなし。
 * 氣多大社・千里浜なぎさドライブウェイも休止情報はなし。
 *
 * 【新しい時刻(Day1)】移動を測り直し(巌門→道の駅とぎ海街道、直接の
 * 区間で実測7.0分→約10分、道の駅→妙成寺、直接の区間で実測21.5分→
 * 約30分)、滞在を少しずつ短縮して16:30〜17:00の範囲(17:00ちょうど)に
 * 収めた:
 * 巌門12:05(50)→道の駅とぎ海街道13:05(45、昼食)→妙成寺14:20(45)→
 * 氣多大社15:15(45)→千里浜なぎさドライブウェイ16:15(45、〜17:00)
 *
 * 【Day2】水族館→ガラス美術館(car)15分→実測4.8分。決まりの「実測×
 * 1.5+5=12.2分」を超えていたため10分に直す。浮いた5分は、最終日は
 * 今より遅くならない決まりのため、1か所目(のとじま水族館)の開始を
 * 9:00→9:05に遅らせて吸収した(決まりの順②)。結果、ガラス美術館
 * 以降の時刻は今と同じ(終了16:30、変更なし)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-80-05bcbf89.ts
 *   反映: npm run prod -- npx tsx prisma/fix-80-05bcbf89.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "c0eed546-ee12-4ff5-8b78-b5dddd8be887";

const TODAI_ID = "831b1d60-d6eb-4505-95f1-ea46b3c2ffaf";
const GANMON_ID = "f5d07825-8510-4a8a-a7df-e30802150382";
const HATAGUIWA_ID = "d1dd2f76-b31b-44f5-9244-9df7bd5f5b39";
const MICHINOEKI_ID = "61a2e567-6c4d-4035-a7cd-70817f75b3e1";
const BENCH_ID = "5915f336-1e48-446d-98bd-225343ff9470";
const MYOJOJI_ID = "0834f880-c5e0-4980-8478-21683fe1818e";
const KETA_ID = "39940746-665c-40be-807d-5b0aadceca4c";
const CHIRIHAMA_ID = "56590f42-cd51-4525-b34a-092b6b6df317";

const SUIZOKUKAN_ID = "76bbf81d-2169-4626-921e-6bf838b11077";
const GLASS_ID = "ffb2ecd9-8c26-4806-9065-e7a681f08f72";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const GANMON_MEMO =
  "この旅は車でめぐります。金沢駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、のと里山海道を北へ、車で約80分。地震のあと、道路の通行止めや復旧の工事が続いているところもあるので、出かける前に道路の情報を確かめ、復旧に取り組む地域の人たちの迷惑にならないようにしましょう。荒波が岩をけずってできた洞門で、幅約6m、高さ約15m、奥行き約60mの大きな穴が海に向かって開いています。断崖と奇岩が続く能登金剛の中でも、いちばんの見どころとされる場所です。春から秋は約20分の遊覧船が出ていて、海の上から洞門や鷹の巣岩などの岩を間近に見られます（冬のあいだは運休します。運航は公式の案内で確かめましょう）。船に乗るときは、係の人の案内に従いましょう。地震で傷んだ船も直され、海に戻っています。岩場や階段は滑りやすいので、足元に気をつけましょう。";

const MICHINOEKI_FIND = "機具岩から車で約5分。";
const MICHINOEKI_REPLACE = "巌門から車で約10分。";

const MYOJOJI_FIND = "車へ歩いて戻り、海沿いを南へ車で約35分（あわせて約40分）。";
const MYOJOJI_REPLACE = "道の駅とぎ海街道から車で約30分。";

const GLASS_FIND = "水族館から車で約15分。";
const GLASS_REPLACE = "水族館から車で約10分。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [michinoeki, myojoji, glass] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: MICHINOEKI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MYOJOJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GLASS_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["道の駅とぎ海街道", michinoeki, MICHINOEKI_FIND],
    ["妙成寺", myojoji, MYOJOJI_FIND],
    ["石川県能登島ガラス美術館", glass, GLASS_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newMichinoekiMemo = michinoeki.memo!.replace(MICHINOEKI_FIND, MICHINOEKI_REPLACE);
  const newMyojojiMemo = myojoji.memo!.replace(MYOJOJI_FIND, MYOJOJI_REPLACE);
  const newGlassMemo = glass.memo!.replace(GLASS_FIND, GLASS_REPLACE);

  console.log("=== #80 Day1: 3スポットを外し、巌門を1か所目にする ===\n");
  console.log("[旧福浦灯台][機具岩][世界一長いベンチ] 削除(写真0枚)");
  console.log(`[巌門] 新visitTime: 12:05  新stay: 50(もと60)`);
  console.log("  新memo:", GANMON_MEMO);
  console.log(`[道の駅とぎ海街道] 新visitTime: 13:05  新stay: 45(もと50)  新leg: car/10分`);
  console.log("  新memo:", newMichinoekiMemo);
  console.log(`[妙成寺] 新visitTime: 14:20  新stay: 45(もと50)  新leg: car/30分`);
  console.log("  新memo:", newMyojojiMemo);
  console.log(`[氣多大社] 新visitTime: 15:15  新stay: 45(もと50、leg無変更10分)`);
  console.log(`[千里浜なぎさドライブウェイ] 新visitTime: 16:15  新stay: 45(もと50、leg無変更15分、〜17:00)`);
  console.log(
    "\nDay1 新しい時刻: 巌門12:05(50)→道の駅とぎ海街道13:05(45、昼食)→妙成寺14:20(45)→氣多大社15:15(45)→千里浜16:15(45、〜17:00)"
  );
  console.log("\n=== #80 Day2: 水族館→ガラス美術館の移動の直し ===\n");
  console.log("のとじま水族館09:05(100、もと09:00)→石川県能登島ガラス美術館10:55(50、leg10分、もと15分)→以降は無変更(〜16:30)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: GANMON_ID, data: { visitTime: T(12, 5), stayDurationMin: 50, memo: GANMON_MEMO, transitLegs: { deleteMany: {} } } },
      {
        id: MICHINOEKI_ID,
        data: {
          visitTime: T(13, 5),
          stayDurationMin: 45,
          memo: newMichinoekiMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
        },
      },
      {
        id: MYOJOJI_ID,
        data: {
          visitTime: T(14, 20),
          stayDurationMin: 45,
          memo: newMyojojiMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 30 }] },
        },
      },
      { id: KETA_ID, data: { visitTime: T(15, 15), stayDurationMin: 45 } },
      { id: CHIRIHAMA_ID, data: { visitTime: T(16, 15), stayDurationMin: 45 } },
    ],
    { remove: [TODAI_ID, HATAGUIWA_ID, BENCH_ID] }
  );

  await prisma.spot.update({ where: { id: SUIZOKUKAN_ID }, data: { visitTime: T(9, 5) } });
  await prisma.spot.update({
    where: { id: GLASS_ID },
    data: {
      memo: newGlassMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
    },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
