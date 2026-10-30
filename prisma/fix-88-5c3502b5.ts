/**
 * #88 金丸座と琴平の門前町、こんぴら参りと宇多津・多度津をめぐる1泊2日
 * (5c3502b5-0318-4f0d-bb31-797899970ef5) 初日・最終日の見直し。
 *
 * 初日: 入口(JR琴平駅)の到着時刻の記載がなく09:30開始だったため、入口10:30以降・徒歩10分
 * (実測、もとの値と一致)で1か所目を10:40に直す(+70分)。説明文の5か所すべてに名前があり
 * 外せないため、滞在の短縮(金陵の郷40→35・門前町50→45・金刀比羅宮120→97・海洋博物館
 * 60→50。金丸座は60分のまま)で吸収し、終了を16:57(16:30〜17:00)に収める。門前町→
 * 金刀比羅宮(785段の石段を上る)・金刀比羅宮→海洋博物館(石段を下る)は、実測の道のりルートが
 * 石段を考慮しないフラットな値(20.3分・14.1分)しか出ないため、もとの値(40分・30分)のまま
 * 変更しない。琴平海洋博物館は、OSM上の愛称「海の科学館」(way1160847109、Nominatim
 * 34.1863214,133.8178117)と一致しており、座標は変更しないが、メモに愛称を追記する。
 *
 * 座標: 桃陵公園(34.26794,133.745024)が公園全体の面の中心だったため、メモにある
 * 「カリヨン時計」の点(node、34.2698747,133.7479892)に直す。ゴールドタワーは、公式の
 * 住所(宇多津町浜一番丁8番)の地理院の点が今の値と約20mで一致するため、変更しない。
 *
 * 2日目(最終日): 時刻(09:30〜16:30)は決まりに合っているため変更しない。ゴールドタワーの
 * 帰りの一文(もと「歩いて約8分のJR宇多津駅」)が実測15.8分だったため、16分に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-88-5c3502b5.ts
 *   反映: npm run prod -- npx tsx prisma/fix-88-5c3502b5.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "b909e14a-b678-44dd-95be-5e7bb28fc9aa";

const KINRYO_ID = "e9baa936-6499-4030-a5ec-8a56611a9a85";
const KANAMARUZA_ID = "2c6091e9-44a5-4bb8-870f-196da00a9ba9";
const MONZENCHO_ID = "fc59bd80-c193-4b26-844a-8b031bf940b7";
const KONPIRA_ID = "932e5f21-d669-46ae-80ec-5cd1e5dc70ed";
const KAIYOHAKU_ID = "b40d1d1c-de93-4345-b12d-267393230076";
const TORYOKOEN_ID = "c8cede05-9789-427f-9db7-4548eb96dd22";
const GOLDTOWER_ID = "f94fc7ce-60ab-47d6-97bc-c71a4a364e66";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KINRYO_MEMO =
  "この旅は電車と歩きでめぐります。JR琴平駅に10:30ごろ着いたら、歩いて約10分の金陵の郷へ。金刀比羅宮の参道の入り口にある酒蔵の資料館で、酒造りを始めたころの寛政元年(1789年)の白壁の蔵を、そのままの姿に復元しています。大きな楠がそびえる「くすのき広場」を囲む「歴史館」と「文化館」では、江戸時代の酒造りの工程を、人形と当時の道具で再現しています。";

const KAIYOHAKU_FIND = "海の守り神のこんぴらさんにちなむ、船と海の博物館です。";
const KAIYOHAKU_REPLACE = "海の守り神のこんぴらさんにちなむ、船と海の博物館です(愛称「海の科学館」)。";

const GOLDTOWER_FIND = "帰りは、歩いて約8分のJR宇多津駅へ向かいましょう。";
const GOLDTOWER_REPLACE = "帰りは、歩いて約16分のJR宇多津駅へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [kaiyohaku, goldtower] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: KAIYOHAKU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GOLDTOWER_ID } }),
  ]);

  for (const [label, text, find] of [
    ["琴平海洋博物館", kaiyohaku.memo ?? "", KAIYOHAKU_FIND],
    ["ゴールドタワー", goldtower.memo ?? "", GOLDTOWER_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newKaiyohakuMemo = kaiyohaku.memo!.replace(KAIYOHAKU_FIND, KAIYOHAKU_REPLACE);
  const newGoldtowerMemo = goldtower.memo!.replace(GOLDTOWER_FIND, GOLDTOWER_REPLACE);

  console.log("=== #88 初日・最終日の見直し ===\n");
  console.log("--- 初日(5か所。内容変更なし、滞在のみ短縮) ---");
  console.log("1. 金陵の郷 10:40(35分、もとは40分、入口を追加):");
  console.log(KINRYO_MEMO);
  console.log("\n2. 旧金毘羅大芝居(金丸座) 11:25(60分、変更なし)");
  console.log("3. 琴平門前町 12:35(45分、もとは50分、昼食)");
  console.log("4. 金刀比羅宮 14:00(97分、もとは120分、石段の移動(40分)は変更なし)");
  console.log("5. 琴平海洋博物館(最後) 16:07(50分、もとは60分、終了16:57、愛称を追記):");
  console.log(newKaiyohakuMemo);

  console.log("\n--- 2日目(最終日、変更なし。ゴールドタワーの帰りの一文を直す) ---");
  console.log("桃陵公園の座標をカリヨン時計の点(34.2698747,133.7479892)に直す");
  console.log("ゴールドタワー:");
  console.log(newGoldtowerMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: KINRYO_ID, data: { visitTime: t(10, 40), stayDurationMin: 35, memo: KINRYO_MEMO, transitLegs: { deleteMany: {} } } },
    { id: KANAMARUZA_ID, data: { visitTime: t(11, 25), stayDurationMin: 60 } },
    { id: MONZENCHO_ID, data: { visitTime: t(12, 35), stayDurationMin: 45 } },
    { id: KONPIRA_ID, data: { visitTime: t(14, 0), stayDurationMin: 97 } },
    { id: KAIYOHAKU_ID, data: { visitTime: t(16, 7), stayDurationMin: 50, memo: newKaiyohakuMemo } },
  ]);

  await prisma.$transaction([
    prisma.spot.update({ where: { id: TORYOKOEN_ID }, data: { lat: 34.2698747, lng: 133.7479892 } }),
    prisma.spot.update({ where: { id: GOLDTOWER_ID }, data: { memo: newGoldtowerMemo } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
