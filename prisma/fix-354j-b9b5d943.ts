/**
 * #354の続き。企画運営10/11 9:44・法務10/11 10:05(記録bf97983)の指摘に対応(Day2・Day3分)。
 *
 * 【法務の指摘】
 * - 国際通りの写真(Kokusai-dori08s3s4440.jpg、看板とキャラクターが大きく写る)を削除。
 * - 国際通りの座標(26.217954,127.693141)は出どころの点が見つからなかった。実在する
 *   OSMの点「国際通り右入口」(node 4443291005、tourism=attraction)26.2176273,127.6922070
 *   に修正。
 * - 波の上ビーチの座標が、実点(way 51392303の中心)から約16mずれていた。
 *   26.221294,127.672152に修正。
 * - 瀬長島「1977年に本土復帰にともない返還」は誤り(本土復帰は1972年、瀬長島の返還は
 *   1977年で別の出来事)。「1977年に米軍から返還され」に修正。
 *
 * 【企画運営の指摘】
 * - 波上護国寺の結びが、次に向かうのが福州園のままだった(実際は天尊廟・天妃宮)。
 * - 旧海軍司令部壕「旅の最後に訪れるのは」は、後ろに瀬長島があるので誤り。
 * - 瀬長島「夕暮れどきには、海に沈む夕日を眺めることもできます」は、16:30に出る旅
 *   なので夕日を見る旅のように読める(#50と同じ扱い)。伝える事実のみの書き方に直した。
 * - 奥武山公園「製糖や農業の技術を伝えたことから」は、蔡温(治水・林業・政治家)には
 *   当てはまらない。3人に共通する「産業の発展に尽くした」に修正。
 *   出典: https://ja.wikipedia.org/wiki/世持神社
 *
 * 福州園の食事処(福州園GARDEN)が実在することは、公式サイトで確認済み
 * (https://www.fksn-okinawa.jp/)。沖宮の「1908年に安里八幡宮の隣へ」は
 * https://ja.wikipedia.org/wiki/沖宮 に記載あり。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-354j-b9b5d943.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const KOKUSAIDORI_ID = "6bee409b-61ad-482e-891c-1e8ca00d2d05";
const BEACH_ID = "1ae5b3e0-71a4-4bfb-9fb6-834a01e18120";
const GOKOKUJI_ID = "185d7d98-865c-4329-b1df-79f079b71df3";
const KAIGUNGOU_ID = "726117bc-9e18-4bfc-9263-da63c6191ccc";

async function main() {
  const kokusaidori = await prisma.spot.findUniqueOrThrow({ where: { id: KOKUSAIDORI_ID } });
  if (kokusaidori.lat?.toString() !== "26.217627") {
    await prisma.photo.deleteMany({ where: { spotId: KOKUSAIDORI_ID } });
    await updateSpotInItinerary(ITIN_ID, { spotId: KOKUSAIDORI_ID }, { lat: 26.2176273, lng: 127.692207 });
    console.log("国際通り: 写真を削除、座標を実点に修正");
  } else {
    console.log("国際通り: 既に対応済み");
  }

  const beach = await prisma.spot.findUniqueOrThrow({ where: { id: BEACH_ID } });
  if (beach.lat?.toString() !== "26.221294") {
    await updateSpotInItinerary(ITIN_ID, { spotId: BEACH_ID }, { lat: 26.221294, lng: 127.672152 });
    console.log("波の上ビーチ: 座標を実点に修正");
  } else {
    console.log("波の上ビーチ: 既に対応済み");
  }

  const gokokuji = await prisma.spot.findUniqueOrThrow({ where: { id: GOKOKUJI_ID } });
  const old1 = "この後は、歩いて十数分の中国庭園・福州園へ向かいます。";
  const new1 = "見学を終えたら、すぐそばの天尊廟・天妃宮へ向かいましょう。";
  if (gokokuji.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: GOKOKUJI_ID }, { memo: gokokuji.memo.replace(old1, new1) });
    console.log("波上護国寺: 結びを修正");
  } else {
    console.log("波上護国寺: 既に対応済み(またはanchor不一致、要確認)");
  }

  const kaigungou = await prisma.spot.findUniqueOrThrow({ where: { id: KAIGUNGOU_ID } });
  const old2 = "奥武山公園駅から路線バスで15分ほど、旅の最後に訪れるのは旧海軍司令部壕です。";
  const new2 = "奥武山公園駅から路線バスで15分ほど、次に訪れるのは旧海軍司令部壕です。";
  if (kaigungou.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: KAIGUNGOU_ID }, { memo: kaigungou.memo.replace(old2, new2) });
    console.log("旧海軍司令部壕: 書き出しを修正");
  } else {
    console.log("旧海軍司令部壕: 既に対応済み(またはanchor不一致、要確認)");
  }

  const senaga = await prisma.spot.findFirstOrThrow({ where: { name: "瀬長島ウミカジテラス", day: { itineraryId: ITIN_ID } } });
  const old3 = "夕暮れどきには、海に沈む夕日を眺めることもできます。";
  const new3 = "夕日の眺めでも知られています。";
  const old4 = "1977年に本土復帰にともない返還され、現在のリゾート地としての姿に生まれ変わりました。";
  const new4 = "1977年に米軍から返還され、現在のリゾート地としての姿に生まれ変わりました。";
  if (senaga.memo?.includes(old3) || senaga.memo?.includes(old4)) {
    const next = (senaga.memo ?? "").replace(old3, new3).replace(old4, new4);
    await updateSpotInItinerary(ITIN_ID, { spotId: senaga.id }, { memo: next });
    console.log("瀬長島: 夕日の一文・1977年の事実を修正");
  } else {
    console.log("瀬長島: 既に対応済み(またはanchor不一致、要確認)");
  }

  const ounoyama = await prisma.spot.findFirstOrThrow({ where: { name: "奥武山公園", day: { itineraryId: ITIN_ID } } });
  const old5 = "製糖や農業の技術を伝えたことから「沖縄三大恩人」といわれる";
  const new5 = "沖縄の産業の発展に尽くしたとして「沖縄三大恩人」といわれる";
  if (ounoyama.memo?.includes(old5)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ounoyama.id }, { memo: ounoyama.memo.replace(old5, new5) });
    console.log("奥武山公園: 蔡温の説明を修正");
  } else {
    console.log("奥武山公園: 既に対応済み(またはanchor不一致、要確認)");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
