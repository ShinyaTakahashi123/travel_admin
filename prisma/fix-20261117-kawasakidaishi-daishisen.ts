/**
 * 川崎大師(a640202e、承認待ち)の登録後の直し(内容確認1 2026-11-17)。
 * 大師線(川崎大師→京急川崎)の乗車時間を、時刻表(Yahoo!路線情報)の確かめにより5分→6分に直す。
 * 影響するのは、仲見世のメモ(結びの文)・稲毛神社の時刻(13:46→13:47)・メモ(書き出しの文)・
 * 大師線のleg(5→6分)・總持寺の時刻(15:11→15:12、滞在は変えない)の4点。下書きファイルも同時に直した
 * (sha256: c3b0d3865fb3f2d9252a8ce18f56d093922e79d97e9630736f3ec643fc7dd222)。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-20261117-kawasakidaishi-daishisen.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const commit = process.argv.includes("--commit");
const ITINERARY_ID = "a640202e-80a7-47c7-94bd-728ab553da59";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const NAKAMISE_MEMO =
  "瀋秀園から歩いておよそ8分、仲見世通りに着きます。くず餅や飴など、門前名物の店が並ぶ参道です。この近くで昼食にしましょう。この後は、川崎大師駅まで歩いておよそ11分、9分ほど待ってから大師線でおよそ6分、京急川崎駅から稲毛神社までは歩いておよそ9分(あわせておよそ35分)です。";
const INAGE_MEMO =
  "大師仲見世通りから川崎大師駅まで歩いておよそ11分、9分ほど待ってから大師線でおよそ6分、京急川崎駅から稲毛神社までは歩いておよそ9分(あわせておよそ35分)で着きます。武甕槌神(たけみかづちのかみ)をまつる、この土地の古社とされる神社です。天皇軍の戦勝を祈る社として建てられたと伝わり、景行天皇が東国をめぐったおりに、この社で難を避けたという話も残ります。かつては河崎山王社などと呼ばれていました。御神木の大銀杏は樹齢およそ一千年と推定されています。静かに、敬意をもってお参りしましょう。この後は、京急川崎駅まで歩いておよそ9分、5分ほど待ってから京急本線でおよそ5分、京急鶴見駅から總持寺までは歩いておよそ16分(あわせておよそ35分)です。";

async function main() {
  const it = await prisma.itinerary.findUnique({ where: { id: ITINERARY_ID }, select: { id: true, title: true, status: true } });
  if (!it) throw new Error("しおりが見つかりません");
  console.log(`■ ${it.title} (${it.status})`);

  const nakamise = await findSpotInItinerary(ITINERARY_ID, { spotName: "川崎大師仲見世通り" });
  const inage = await findSpotInItinerary(ITINERARY_ID, { spotName: "稲毛神社" });
  const sojiji = await findSpotInItinerary(ITINERARY_ID, { spotName: "總持寺" });

  const inageLegs = await prisma.spotTransitLeg.findMany({ where: { spotId: inage.id }, orderBy: { orderNo: "asc" } });
  const daishisenLeg = inageLegs.find((l) => l.transitLine === "大師線");
  if (!daishisenLeg) throw new Error("大師線のlegが見つかりません");
  console.log(`  稲毛神社の現在のtime: ${inage.visitTime}, 大師線leg(order${daishisenLeg.orderNo}): ${daishisenLeg.transitDurationMin}分`);
  console.log(`  總持寺の現在のtime: ${sojiji.visitTime}`);

  console.log("\n直す内容:");
  console.log("  仲見世: memo更新(大師線5分→6分、あわせて34分→35分)");
  console.log("  稲毛神社: time 13:46→13:47、memo更新、大師線leg 5分→6分");
  console.log("  總持寺: time 15:11→15:12(滞在100分は変えない)");

  if (!commit) return console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: nakamise.id }, data: { memo: NAKAMISE_MEMO } });
    await tx.spot.update({ where: { id: inage.id }, data: { memo: INAGE_MEMO, visitTime: t(13, 47) } });
    await tx.spotTransitLeg.update({ where: { id: daishisenLeg.id }, data: { transitDurationMin: 6 } });
    await tx.spot.update({ where: { id: sojiji.id }, data: { visitTime: t(15, 12) } });
  });
  console.log("書き込みました");
}

main().finally(() => prisma.$disconnect());
