/**
 * #341の続き。企画運営09:35の指摘2点に対応。
 * 1) 足摺岬に、朝の行き方(中村駅前でレンタカーを借り、車でおよそ57分)が
 *    なかったため追加。足摺岬の先端でレンタカーを借りられるわけではないため、
 *    金剛福寺の「ここから先はレンタカーで巡ります」の一文も削除(車は最初の
 *    足摺岬から使っている旨に統一)。
 * 2) 海のギャラリーの結びを、中村駅までの戻り方(車でおよそ45分、駅前で
 *    レンタカーを返却してから列車で帰路)に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-341b-9fa55366.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9fa55366-7332-46b6-b356-205c9ed2b7fb";

async function main() {
  const ashizuri = await prisma.spot.findFirstOrThrow({ where: { name: "足摺岬", day: { itineraryId: ITIN_ID } } });
  const ashizuriOld = "足摺岬は、四国の最南端に位置し、";
  const ashizuriNext = "中村駅前でレンタカーを借り、車でおよそ57分の足摺岬へ向かいます。足摺岬は、四国の最南端に位置し、";
  if (!ashizuri.memo?.includes(ashizuriOld)) throw new Error("ashizuri anchor not found");
  const ashizuriMemo = ashizuri.memo.includes(ashizuriNext) ? ashizuri.memo : ashizuri.memo.replace(ashizuriOld, ashizuriNext);

  const kongofukuji = await prisma.spot.findFirstOrThrow({ where: { name: "金剛福寺", day: { itineraryId: ITIN_ID } } });
  const kongofukujiOld = "今も多くの遍路が訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。ここから先はレンタカーで巡ります。続いては、車でおよそ8分の唐人駄場遺跡へ向かいましょう。";
  const kongofukujiNext = "今も多くの遍路が訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。続いては、車でおよそ8分の唐人駄場遺跡へ向かいましょう。";
  const kongofukujiMemo = kongofukuji.memo?.includes(kongofukujiOld)
    ? kongofukuji.memo.replace(kongofukujiOld, kongofukujiNext)
    : kongofukuji.memo;

  const umiGallery = await prisma.spot.findFirstOrThrow({ where: { name: "海のギャラリー", day: { itineraryId: ITIN_ID } } });
  const umiOld = "足摺岬、四国最南端の断崖と灯台を望む定番日帰りプランは、ここで終わりです。帰りは、車で土佐清水市街まで戻り、そこから高知方面へ帰路につきましょう。";
  const umiNext = "足摺岬、四国最南端の断崖と灯台を望む定番日帰りプランは、ここで終わりです。帰りは、車でおよそ45分の中村駅まで戻り、駅前でレンタカーを返却してから、列車で帰路につきましょう。";
  if (!umiGallery.memo?.includes(umiOld)) throw new Error("umi gallery closing text not found");
  const umiMemo = umiGallery.memo.includes(umiNext) ? umiGallery.memo : umiGallery.memo.replace(umiOld, umiNext);

  await updateSpotInItinerary(ITIN_ID, { spotId: ashizuri.id }, { memo: ashizuriMemo });
  console.log("ashizuri access line added");
  await updateSpotInItinerary(ITIN_ID, { spotId: kongofukuji.id }, { memo: kongofukujiMemo });
  console.log("kongofukuji redundant car-intro removed");
  await updateSpotInItinerary(ITIN_ID, { spotId: umiGallery.id }, { memo: umiMemo });
  console.log("umi gallery return line fixed");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
