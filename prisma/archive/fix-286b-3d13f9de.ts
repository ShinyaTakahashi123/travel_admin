/**
 * チェックリスト #286 の修正記録(見直し2、企画運営の指摘4点)。
 * しおり「宮崎神宮とフローランテ宮崎、緑と花に包まれる1泊2日」
 * (3d13f9de-a522-4db3-ac1d-35778ac017f1)
 *
 * flow-check.cjsで発見された4点を修正:
 *
 * 1. 宿の一言が、Day1開始時点の宮崎神宮の本文末に付いたままだった(「今夜は、この
 *    近くの宿に宿泊します。」)。これをDay1の実際の最後のスポットである橘公園の
 *    本文末に移動。宮崎神宮の本文からは削除。
 *
 * 2. 宮崎県護国神社の書き出しが「宮崎神宮からは徒歩3分ほどです」のまま残っていた
 *    (見直し1で宮崎県総合博物館を宮崎神宮と護国神社の間に挿入した際の取りこぼし)。
 *    実際の直前は宮崎県総合博物館のため、「宮崎県総合博物館からは徒歩5分ほどです」
 *    に修正(移動時間はDBの実測値5分のまま、書き出しの文言だけ差し替え)。
 *
 * 3. 平和台公園の書き出しが「宮崎県総合文化公園からは車で10分ほどです」のまま
 *    残っていた(実際の直前は宮崎県立美術館)。徒歩→車の乗り換え地点でもあるため、
 *    「宮崎県立美術館からは、ここで車に乗り換えて10分ほどです」のように、車に
 *    乗り換える一言を含めて書き換え。
 *
 * 4. 青島神社(旅の最後のスポット)に帰りの交通手段の一言がなかったため、本文末に
 *    「参拝を終えたら、車で宮崎市街・宮崎空港方面へ戻りましょう。」を追加。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-286b-3d13f9de.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "3d13f9de-a522-4db3-ac1d-35778ac017f1";

async function main() {
  // 1) 宿の一言: 宮崎神宮→橘公園
  const jingu = await findSpotInItinerary(ITIN_ID, { spotName: "宮崎神宮" });
  const jinguRow = await prisma.spot.findUniqueOrThrow({ where: { id: jingu.id } });
  const yadoLine = "今夜は、この近くの宿に宿泊します。";
  if (jinguRow.memo?.includes(yadoLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jingu.id }, {
      memo: jinguRow.memo.replace(yadoLine, "").trimEnd(),
    });
  }
  const tachibana = await findSpotInItinerary(ITIN_ID, { spotName: "橘公園" });
  const tachibanaRow = await prisma.spot.findUniqueOrThrow({ where: { id: tachibana.id } });
  if (tachibanaRow.memo && !tachibanaRow.memo.includes(yadoLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tachibana.id }, {
      memo: tachibanaRow.memo + " " + yadoLine,
    });
  }

  // 2) 宮崎県護国神社の書き出し修正
  const gokoku = await findSpotInItinerary(ITIN_ID, { spotName: "宮崎県護国神社" });
  const gokokuRow = await prisma.spot.findUniqueOrThrow({ where: { id: gokoku.id } });
  if (gokokuRow.memo?.startsWith("宮崎神宮からは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: gokoku.id }, {
      memo: gokokuRow.memo.replace("宮崎神宮からは徒歩3分ほどです。", "宮崎県総合博物館からは徒歩5分ほどです。"),
    });
  }

  // 3) 平和台公園の書き出し修正(徒歩→車の乗り換えを明記)
  const heiwadai = await findSpotInItinerary(ITIN_ID, { spotName: "平和台公園" });
  const heiwadaiRow = await prisma.spot.findUniqueOrThrow({ where: { id: heiwadai.id } });
  if (heiwadaiRow.memo?.startsWith("宮崎県総合文化公園からは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: heiwadai.id }, {
      memo: heiwadaiRow.memo.replace(
        "宮崎県総合文化公園からは車で10分ほどです。",
        "宮崎県立美術館からは、ここで車に乗り換えて10分ほどです。"
      ),
    });
  }

  // 4) 青島神社に帰りの一言を追加
  const aoshima = await findSpotInItinerary(ITIN_ID, { spotName: "青島神社" });
  const aoshimaRow = await prisma.spot.findUniqueOrThrow({ where: { id: aoshima.id } });
  const kaeriLine = "参拝を終えたら、車で宮崎市街・宮崎空港方面へ戻りましょう。";
  if (aoshimaRow.memo && !aoshimaRow.memo.includes(kaeriLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: aoshima.id }, {
      memo: aoshimaRow.memo + " " + kaeriLine,
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
