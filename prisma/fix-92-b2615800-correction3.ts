/**
 * #92 千葉の訂正その3。法務の指摘で、幕張海浜公園の点を、見浜園の交差点の信号から
 * 庭園そのもの(way1222912385、Nominatim35.6430808,140.0394009、約160m北東)に直す。
 * イオンモールからの移動は変更なし(実測4.2分、もとの8分のまま)。見浜園からアウトレットへの
 * 徒歩は実測10.9分で、11分に直す(13分から2分短縮)。この分、アウトレットの滞在を63分
 * (61分から2分戻す)にして、終了を17:00に保つ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-92-b2615800-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-92-b2615800-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const MAKUHARI_PARK_ID = "f901a22c-4260-444d-94ad-ee1ddc623513";
const OUTLET_ID = "a017bce3-7ebe-49ee-b2cc-c6a231b51113";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const MAKUHARI_FIND = "この後は、歩いておよそ13分、三井アウトレットパーク幕張へ向かいましょう(車はこちらに置いたままで大丈夫です)。";
const MAKUHARI_REPLACE = "この後は、歩いておよそ11分、三井アウトレットパーク幕張へ向かいましょう(車はこちらに置いたままで大丈夫です)。";

const OUTLET_FIND = "幕張海浜公園から歩いておよそ13分、三井アウトレットパーク幕張に着きます。";
const OUTLET_REPLACE = "幕張海浜公園から歩いておよそ11分、三井アウトレットパーク幕張に着きます。";
const OUTLET_FIND2 = "幕張海浜公園の駐車場に置いた車に戻り(歩いて約13分)、車で宿へ向かいましょう。";
const OUTLET_REPLACE2 = "幕張海浜公園の駐車場に置いた車に戻り(歩いて約11分)、車で宿へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [makuhariPark, outlet] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: MAKUHARI_PARK_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: OUTLET_ID } }),
  ]);

  for (const [label, text, find] of [
    ["幕張海浜公園", makuhariPark.memo ?? "", MAKUHARI_FIND],
    ["アウトレット", outlet.memo ?? "", OUTLET_FIND],
    ["アウトレット(2)", outlet.memo ?? "", OUTLET_FIND2],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newMakuhariMemo = makuhariPark.memo!.replace(MAKUHARI_FIND, MAKUHARI_REPLACE);
  const newOutletMemo = outlet.memo!.replace(OUTLET_FIND, OUTLET_REPLACE).replace(OUTLET_FIND2, OUTLET_REPLACE2);

  console.log("=== #92 訂正その3: 見浜園の座標を庭園そのものに直す ===\n");
  console.log("幕張海浜公園: 35.6430808,140.0394009(見浜園、庭園そのもの)");
  console.log("アウトレット: 15:57着(63分←61分)、移動11分、終了17:00");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: MAKUHARI_PARK_ID },
      data: { lat: 35.6430808, lng: 140.0394009, memo: newMakuhariMemo },
    }),
    prisma.spot.update({
      where: { id: OUTLET_ID },
      data: {
        visitTime: t(15, 57),
        stayDurationMin: 63,
        memo: newOutletMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 11 }] },
      },
    }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
