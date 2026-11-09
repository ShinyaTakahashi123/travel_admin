/**
 * #92 幕張・稲毛の海辺と千葉みなとを巡る、のんびり千葉1泊2日の旅
 * (b2615800-6697-4162-9d87-099c34154241) 初日・最終日の見直し。
 *
 * 初日: 入口(JR稲毛海岸駅)の到着時刻・レンタカーの手続きの分け書きがなく09:00開始だったため、
 * 入口10:30+手続き15分+運転4分(実測)で1か所目(稲毛海浜公園)を10:49に直す。説明文には
 * 個々の公園・施設の名前がなく、昼食(イオンモール幕張新都心)が13:56と遅くなるため、企画運営の
 * 判断で順番を「稲毛海浜公園→検見川の浜→イオンモール(昼食)→幕張海浜公園→アウトレット」に
 * 組み替え、説明文に名前のない幕張メッセを外す(宿泊の一文はアウトレットに移す)。新しい順の
 * 車の移動は、OSRM実測+駐車の約5分で測り直す(検見川の浜→イオン7.2分→12分、イオン→幕張
 * 海浜公園3.3分→8分)。幕張海浜公園→アウトレットは、徒歩9分(実測)にして車は停めたままとする。
 * 延びた分は幕張海浜公園・アウトレットの滞在で吸収し(もとより長くしない)、終了を17:00に収める。
 *
 * 2日目(最終日): 時刻(09:30〜16:30)はもとから決まりに合っていた。千葉神社→千葉公園(車10分)
 * は実測2.0分で、閾値(2.0×1.5+5=8分)を超えるため7分(実測+駐車5分)に直す。千葉公園→加曽利
 * 貝塚博物館(車25分)は実測7.5分で、閾値(16.25分)を超えるため13分(実測+駐車5分)に直す。
 * 終了は16:30〜17:00の範囲内(16:45)に収まるため、滞在は変更しない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-92-b2615800.ts
 *   反映: npm run prod -- npx tsx prisma/fix-92-b2615800.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "04c72db7-45b6-4270-b249-091cdc3e8185";

const INAGE_ID = "dcd8b609-88fd-4bc0-a45f-46dc9f2b9afa";
const KEMIGAWA_ID = "d934fd85-61f9-4a34-8600-6e0ce0608ccb";
const MAKUHARI_PARK_ID = "f901a22c-4260-444d-94ad-ee1ddc623513";
const AEON_ID = "9d2dde3a-accf-47e0-ac2f-fb4396578a8f";
const OUTLET_ID = "a017bce3-7ebe-49ee-b2cc-c6a231b51113";
const MESSE_ID = "3381aa00-9611-456e-9cef-52585e9d3103";

const CHIBA_JINJA_ID = "a0aa2146-15ab-44b1-9848-2d3e45b842d3";
const CHIBA_KOEN_ID = "05cfae2a-5836-463b-9839-a631810acbc2";
const KASORI_ID = "24141223-416b-4c7d-952e-fc07e46fd8e9";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const INAGE_FIND = "JR稲毛海岸駅前でレンタカーを借りて、今日はまず稲毛海浜公園から始まります。";
const INAGE_REPLACE =
  "JR稲毛海岸駅に10:30ごろ着いたら、駅前でレンタカーを借りて(手続きに15分ほど)、車でおよそ4分の稲毛海浜公園から始まります。";
const INAGE_FIND2 = "この後は、車でおよそ3分、検見川の浜へ向かいましょう。";

const KEMIGAWA_FIND2 = "この後は、車でおよそ6分、幕張海浜公園へ向かいましょう。";
const KEMIGAWA_REPLACE2 = "この後は、車でおよそ12分、イオンモール幕張新都心へ向かいましょう。";

const AEON_FIND = "幕張海浜公園から車でおよそ8分、イオンモール幕張新都心に着きます。";
const AEON_REPLACE = "検見川の浜から車でおよそ12分、イオンモール幕張新都心に着きます。";
const AEON_FIND2 = "ここで昼食をとりましょう。この後は、車でおよそ10分、三井アウトレットパーク幕張へ向かいましょう。";
const AEON_REPLACE2 = "ここで昼食をとりましょう。この後は、車でおよそ8分、幕張海浜公園へ向かいましょう。";

const MAKUHARI_PARK_FIND = "検見川の浜から車でおよそ6分、幕張海浜公園に着きます。";
const MAKUHARI_PARK_REPLACE = "イオンモール幕張新都心から車でおよそ8分、幕張海浜公園に着きます。";
const MAKUHARI_PARK_FIND2 = "この後は、車でおよそ8分、イオンモール幕張新都心へ向かいましょう。";
const MAKUHARI_PARK_REPLACE2 = "この後は、歩いておよそ10分、三井アウトレットパーク幕張へ向かいましょう(車はこちらに置いたままで大丈夫です)。";

const OUTLET_FIND = "イオンモール幕張新都心から車でおよそ10分、三井アウトレットパーク幕張に着きます。";
const OUTLET_REPLACE = "幕張海浜公園から歩いておよそ10分、三井アウトレットパーク幕張に着きます。";
const OUTLET_FIND2 = "この後は、車でおよそ3分、幕張メッセへ向かいましょう。";
const OUTLET_REPLACE2 = "幕張海浜公園の駐車場に置いた車に戻り(歩いて約10分)、車で宿へ向かいましょう。今夜は、幕張や千葉の宿に泊まりましょう。";

const CHIBA_JINJA_FIND = "この後は、車でおよそ10分、千葉公園へ向かいましょう。";
const CHIBA_JINJA_REPLACE = "この後は、車でおよそ7分、千葉公園へ向かいましょう。";

const CHIBA_KOEN_FIND = "千葉神社から車でおよそ10分、千葉公園に着きます。";
const CHIBA_KOEN_REPLACE = "千葉神社から車でおよそ7分、千葉公園に着きます。";
const CHIBA_KOEN_FIND2 = "この後は、車でおよそ25分、加曽利貝塚博物館へ向かいましょう。";
const CHIBA_KOEN_REPLACE2 = "この後は、車でおよそ13分、加曽利貝塚博物館へ向かいましょう。";

const KASORI_FIND = "千葉公園から車でおよそ25分、加曽利貝塚博物館に着きます。";
const KASORI_REPLACE = "千葉公園から車でおよそ13分、加曽利貝塚博物館に着きます。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = { inage: INAGE_ID, kemigawa: KEMIGAWA_ID, aeon: AEON_ID, makuhariPark: MAKUHARI_PARK_ID, outlet: OUTLET_ID, chibaJinja: CHIBA_JINJA_ID, chibaKoen: CHIBA_KOEN_ID, kasori: KASORI_ID };
  const spots = Object.fromEntries(
    await Promise.all(Object.entries(ids).map(async ([key, id]) => [key, await prisma.spot.findFirstOrThrow({ where: { id } })]))
  ) as Record<keyof typeof ids, { memo: string | null }>;

  const checks: [string, string, string][] = [
    ["稲毛海浜公園", spots.inage.memo ?? "", INAGE_FIND],
    ["稲毛海浜公園(2)", spots.inage.memo ?? "", INAGE_FIND2],
    ["検見川の浜(2)", spots.kemigawa.memo ?? "", KEMIGAWA_FIND2],
    ["イオンモール", spots.aeon.memo ?? "", AEON_FIND],
    ["イオンモール(2)", spots.aeon.memo ?? "", AEON_FIND2],
    ["幕張海浜公園", spots.makuhariPark.memo ?? "", MAKUHARI_PARK_FIND],
    ["幕張海浜公園(2)", spots.makuhariPark.memo ?? "", MAKUHARI_PARK_FIND2],
    ["アウトレット", spots.outlet.memo ?? "", OUTLET_FIND],
    ["アウトレット(2)", spots.outlet.memo ?? "", OUTLET_FIND2],
    ["千葉神社", spots.chibaJinja.memo ?? "", CHIBA_JINJA_FIND],
    ["千葉公園", spots.chibaKoen.memo ?? "", CHIBA_KOEN_FIND],
    ["千葉公園(2)", spots.chibaKoen.memo ?? "", CHIBA_KOEN_FIND2],
    ["加曽利貝塚博物館", spots.kasori.memo ?? "", KASORI_FIND],
  ];
  for (const [label, text, find] of checks) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const m = {
    inage: spots.inage.memo!.replace(INAGE_FIND, INAGE_REPLACE),
    aeon: spots.aeon.memo!.replace(AEON_FIND, AEON_REPLACE).replace(AEON_FIND2, AEON_REPLACE2),
    makuhariPark: spots.makuhariPark.memo!.replace(MAKUHARI_PARK_FIND, MAKUHARI_PARK_REPLACE).replace(MAKUHARI_PARK_FIND2, MAKUHARI_PARK_REPLACE2),
    outlet: spots.outlet.memo!.replace(OUTLET_FIND, OUTLET_REPLACE).replace(OUTLET_FIND2, OUTLET_REPLACE2),
    kemigawa: spots.kemigawa.memo!.replace(KEMIGAWA_FIND2, KEMIGAWA_REPLACE2),
    chibaJinja: spots.chibaJinja.memo!.replace(CHIBA_JINJA_FIND, CHIBA_JINJA_REPLACE),
    chibaKoen: spots.chibaKoen.memo!.replace(CHIBA_KOEN_FIND, CHIBA_KOEN_REPLACE).replace(CHIBA_KOEN_FIND2, CHIBA_KOEN_REPLACE2),
    kasori: spots.kasori.memo!.replace(KASORI_FIND, KASORI_REPLACE),
  };

  console.log("=== #92 初日・最終日の見直し ===\n");
  console.log("--- 初日(並び替え。幕張メッセを外す) ---");
  console.log("1. 稲毛海浜公園 10:49(80分、変更なし。入口・手続きを追加):");
  console.log(m.inage.slice(0, 80));
  console.log("2. 検見川の浜 12:12(35分、変更なし)");
  console.log("3. イオンモール幕張新都心 12:59(90分、昼食、変更なし)");
  console.log("4. 幕張海浜公園 14:37(70分←90分、座標をマリンルート入口に直す)");
  console.log("5. 三井アウトレットパーク幕張(最後) 15:57(63分←90分、終了17:00):");
  console.log(m.outlet.slice(-60));

  console.log("\n--- 2日目(最終日、時刻は終了16:45に変わるが変更なし) ---");
  console.log("千葉神社→千葉公園: 10→7分、千葉公園→加曽利貝塚博物館: 25→13分");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      DAY1_ID,
      [
        { id: INAGE_ID, data: { visitTime: t(10, 49), stayDurationMin: 80, memo: m.inage } },
        { id: KEMIGAWA_ID, data: { visitTime: t(12, 12), stayDurationMin: 35, memo: m.kemigawa } },
        {
          id: AEON_ID,
          data: {
            visitTime: t(12, 59),
            stayDurationMin: 90,
            memo: m.aeon,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
          },
        },
        {
          id: MAKUHARI_PARK_ID,
          data: {
            visitTime: t(14, 37),
            stayDurationMin: 70,
            lat: 35.642521,
            lng: 140.041839,
            memo: m.makuhariPark,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
          },
        },
        {
          id: OUTLET_ID,
          data: {
            visitTime: t(15, 57),
            stayDurationMin: 63,
            memo: m.outlet,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
          },
        },
      ],
      { remove: [MESSE_ID], tx }
    );

    await tx.spot.update({ where: { id: CHIBA_JINJA_ID }, data: { memo: m.chibaJinja, lat: 35.611837, lng: 140.123814 } });
    await tx.spot.update({
      where: { id: CHIBA_KOEN_ID },
      data: {
        memo: m.chibaKoen,
        visitTime: t(14, 7),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
      },
    });
    await tx.spot.update({
      where: { id: KASORI_ID },
      data: {
        memo: m.kasori,
        visitTime: t(15, 10),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 13 }] },
      },
    });
    await tx.spot.update({
      where: { id: "60d63e2f-8d73-48bd-a52d-4cbc30bbd1f4" },
      data: { lat: 35.600161, lng: 140.098531 },
    });
    await tx.spot.update({
      where: { id: "2b0e6a8d-de55-4e20-867e-9c10529d6903" },
      data: { lat: 35.599787, lng: 140.098958 },
    });
    await tx.spot.update({
      where: { id: "dac52c77-3b20-4d54-8c7e-aaa451b89b2b" },
      data: { lat: 35.601571, lng: 140.101668 },
    });
  }, { timeout: 60000 });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
