/**
 * #101 猪苗代、法務の指摘(2026-10-30 16:53)。バスの分数(周遊バス約20分・約15分・帰りの約10分)が
 * 出典のない見積もりだったため、いずれもタクシーに変更する(OSRM+5)。
 *
 * - 会津若松駅→七日町通り: タクシー約9分(OSRM 4.19分+5)。七日町通りの着legを
 *   train(30,JR磐越西線)+taxi(9)の2本に分ける
 * - 七日町→鶴ヶ城: タクシー約10分(OSRM 4.90分+5。もとのbus15を置き換え)
 * - 御薬園→会津若松駅(帰り): タクシー約9分(法務の実測、OSRM 4.87分+5相当)
 *
 * 時刻の再計算: 七日町通り13:43→13:32、鶴ヶ城14:53→14:37、御薬園16:20→16:04。
 * 終了16:50→16:34(もとの終わりより早い。16:30〜17:00の範囲内)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-101-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-101-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const NANOKAMACHI_ID = "8c2ecf6d-e0da-4f73-995e-cc2236320e15";
const TSURUGAJO_ID = "c9c23a9c-fe73-43a8-9fc2-3fac6957689f";
const OYAKUEN_ID = "ceea85b2-4254-41c1-9c9f-f6c1c8fae2f6";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const NANOKAMACHI_MEMO_OLD =
  "猪苗代駅からJR磐越西線で約30分の会津若松駅へ出て、周遊バスで約20分、七日町へ。時刻は公式の案内で確かめましょう。七日町通りは、毎月7のつく日に市が立ったことから名づけられた町で、江戸時代には越後・米沢・日光へ向かう街道が通る、会津の城下の西の玄関口でした。問屋や旅籠が並んでにぎわった通りには、明治から昭和のはじめに建てられた蔵や洋館、木造の商家が今も残り、大正のころを思わせるレトロな町並みを歩けます。蔵や商家の店先をのぞきながら、ゆっくり歩きましょう。";
const NANOKAMACHI_MEMO_NEW =
  "猪苗代駅からJR磐越西線で約30分の会津若松駅へ出て、タクシーで約9分、七日町へ。七日町通りは、毎月7のつく日に市が立ったことから名づけられた町で、江戸時代には越後・米沢・日光へ向かう街道が通る、会津の城下の西の玄関口でした。問屋や旅籠が並んでにぎわった通りには、明治から昭和のはじめに建てられた蔵や洋館、木造の商家が今も残り、大正のころを思わせるレトロな町並みを歩けます。蔵や商家の店先をのぞきながら、ゆっくり歩きましょう。";

const TSURUGAJO_MEMO_OLD =
  "七日町から周遊バスで約15分、鶴ヶ城へ。1384年に蘆名直盛が築いた館が始まりで、文禄2年（1593年）に蒲生氏郷が石垣と天守をもつ本格的な城に改め、町の名を黒川から若松に、城の名を鶴ヶ城としたと伝えられます。幕末の戊辰戦争では、会津藩の人々がこの城にこもって新政府軍と戦いました。明治7年（1874年）に建物はすべて取り壊され、今の天守は1965年に再建されたもの。2011年には、幕末のころと同じ赤瓦にふき替えられています。石垣の上や天守の階段では、足元に気をつけましょう。";
const TSURUGAJO_MEMO_NEW =
  "七日町からタクシーで約10分、鶴ヶ城へ。1384年に蘆名直盛が築いた館が始まりで、文禄2年（1593年）に蒲生氏郷が石垣と天守をもつ本格的な城に改め、町の名を黒川から若松に、城の名を鶴ヶ城としたと伝えられます。幕末の戊辰戦争では、会津藩の人々がこの城にこもって新政府軍と戦いました。明治7年（1874年）に建物はすべて取り壊され、今の天守は1965年に再建されたもの。2011年には、幕末のころと同じ赤瓦にふき替えられています。石垣の上や天守の階段では、足元に気をつけましょう。";

const OYAKUEN_MEMO_OLD =
  "鶴ヶ城から歩いて約20分。室町時代に蘆名氏がこの地の霊泉のほとりに別荘を建てたのが始まりと伝わる庭園で、国の名勝「会津松平氏庭園」に指定されています。江戸時代には、藩主が人々を病から救おうと薬草園を設け、のちに朝鮮人参の栽培を広めたことが「御薬園」の名の由来です。心の字をかたどったといわれる池をめぐる回遊式の庭で、今も園内では薬草が育てられています。入園できる時間は公式の案内で確かめましょう。帰りは周遊バスで約10分の会津若松駅へ。時刻は公式の案内で確かめましょう。2日間の旅はここまでです。";
const OYAKUEN_MEMO_NEW =
  "鶴ヶ城から歩いて約20分。室町時代に蘆名氏がこの地の霊泉のほとりに別荘を建てたのが始まりと伝わる庭園で、国の名勝「会津松平氏庭園」に指定されています。江戸時代には、藩主が人々を病から救おうと薬草園を設け、のちに朝鮮人参の栽培を広めたことが「御薬園」の名の由来です。心の字をかたどったといわれる池をめぐる回遊式の庭で、今も園内では薬草が育てられています。入園できる時間は公式の案内で確かめましょう。見学を終えたら、タクシーでおよそ9分の会津若松駅へ向かいましょう。この区間は、タクシーを使うと便利です。2日間の旅はここまでです。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [NANOKAMACHI_ID, TSURUGAJO_ID, OYAKUEN_ID];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  const checks: [string, string, string][] = [
    [NANOKAMACHI_ID, "七日町通り", NANOKAMACHI_MEMO_OLD],
    [TSURUGAJO_ID, "鶴ヶ城", TSURUGAJO_MEMO_OLD],
    [OYAKUEN_ID, "御薬園", OYAKUEN_MEMO_OLD],
  ];
  for (const [id, label, old] of checks) {
    if (memoById.get(id) !== old) {
      console.log(`[想定と違います] ${label} のメモが想定と一致しません。処理を中止します。`);
      return;
    }
  }

  console.log("=== #101 法務指摘その2(バスの分数をタクシーに) ===\n");
  console.log("七日町通り 13:32 (55分、電車30+タクシー9)");
  console.log("鶴ヶ城   14:37 (67分、タクシー10)");
  console.log("御薬園   16:04 (30分、徒歩20) → 終了16:34\n");
  console.log("[七日町通り]\n" + NANOKAMACHI_MEMO_NEW + "\n");
  console.log("[鶴ヶ城]\n" + TSURUGAJO_MEMO_NEW + "\n");
  console.log("[御薬園]\n" + OYAKUEN_MEMO_NEW + "\n");

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: NANOKAMACHI_ID },
      data: { visitTime: t(13, 32), memo: NANOKAMACHI_MEMO_NEW },
    });
    await tx.spotTransitLeg.deleteMany({ where: { spotId: NANOKAMACHI_ID } });
    await tx.spotTransitLeg.create({
      data: { spotId: NANOKAMACHI_ID, orderNo: 1, transitMode: "train", transitDurationMin: 30, transitLine: "JR磐越西線（猪苗代→会津若松）" },
    });
    await tx.spotTransitLeg.create({
      data: { spotId: NANOKAMACHI_ID, orderNo: 2, transitMode: "taxi", transitDurationMin: 9, transitLine: null },
    });

    await tx.spot.update({
      where: { id: TSURUGAJO_ID },
      data: { visitTime: t(14, 37), memo: TSURUGAJO_MEMO_NEW },
    });
    await tx.spotTransitLeg.updateMany({
      where: { spotId: TSURUGAJO_ID },
      data: { transitMode: "taxi", transitDurationMin: 10, transitLine: null },
    });

    await tx.spot.update({
      where: { id: OYAKUEN_ID },
      data: { visitTime: t(16, 4), memo: OYAKUEN_MEMO_NEW },
    });
  }, { timeout: 60000 });

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
