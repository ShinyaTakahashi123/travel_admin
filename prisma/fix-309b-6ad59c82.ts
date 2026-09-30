/**
 * チェックリスト #309 の修正記録(企画運営2点・法務3点)。
 * しおり「エンジェルロード、潮が引くと現れる砂の道を歩くプラン」
 * (6ad59c82-04f7-40ae-87ff-959dc70801cc)
 *
 * 企画運営・法務の指摘(重なる部分は1回で対応):
 * 1. 最初のスポット(エンジェルロード)に移動手段の案内を追加。
 * 2. しおりのdescriptionの「世界一狭い土渕海峡」を、本文と合わせて
 *    「ギネス世界記録に認定された土渕海峡」にヘッジ(法務指定の形)。
 * 3. 小豆島オリーブ公園の「日本のオリーブ栽培発祥の地に開かれた公園」に
 *    「とされる」を追加。
 * 4. 中山千枚田に、農地への立ち入りに関する配慮の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-309b-6ad59c82.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6ad59c82-04f7-40ae-87ff-959dc70801cc";

async function main() {
  const angel = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "エンジェルロード" } });
  const intro = "この旅は車でめぐります。土庄の町なかは車を置いて歩きます。";
  if (angel.memo && !angel.memo.startsWith(intro)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: angel.id }, { memo: intro + angel.memo });
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "世界一狭い土渕海峡、";
  const newDesc = "ギネス世界記録に認定された土渕海峡、";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: { description: itin.description.replace(oldDesc, newDesc) },
    });
  }

  const olive = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "小豆島オリーブ公園" } });
  const oldOlive = "日本のオリーブ栽培発祥の地に開かれた公園です。";
  const newOlive = "日本のオリーブ栽培発祥の地とされる場所に開かれた公園です。";
  if (olive.memo?.includes(oldOlive)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: olive.id }, { memo: olive.memo.replace(oldOlive, newOlive) });
  }

  const tanada = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "中山千枚田" } });
  const fieldCaution = "農家の方の田んぼなので、あぜ道や田に入らず、道から眺めましょう。";
  if (tanada.memo && !tanada.memo.includes(fieldCaution)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tanada.id }, { memo: `${tanada.memo} ${fieldCaution}` });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
