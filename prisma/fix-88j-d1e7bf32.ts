/**
 * #88 d1e7bf32 企画運営(21:40)・法務(21:35)の追加指摘に対応。
 * 1) 大湯環状列石の「11月は16時までとなる年もある」(具体的な時刻)を削除し、
 *    「見学できる時間は季節によって変わるので、公式の案内で確かめてから
 *    訪れましょう。」に。縄文時代の墓と考えられる遺跡であることを踏まえ、
 *    柵・石にふれない旨の配慮の一文を追加。宿へ戻る一言に、タクシーの目安
 *    時間(OSRM実測30.4分を山道として約40分に)を追加。
 * 2) ぷらっと→ビジターセンターの「22分/0.2km」を、企画運営から2度目の
 *    指摘があったため、休屋内の近い施設どうしとして実際の道のりに近い
 *    5分に修正。浮いた17分は、企画運営の指示どおり昼食の枠(ぷらっとの
 *    滞在)を実際の長さにする形で使い、55→72分に。VCの開始時刻(12:24)は
 *    変えていないため、後続の時刻には影響しない。
 * 3) タイトルの「三つの展望台」は、2日目に瞰湖台を加えたため数が合わない
 *    (実際は御鼻部山・紫明亭・発荷峠・瞰湖台の4つ)。数を外した表現に変更。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TITLE = "十和田湖の遊覧船と展望台めぐり、奥入瀬渓流を歩く1泊2日";

const OYU_FROM =
  "見学できる時間は季節によって変わり、11月は16時までとなる年もあるので、訪れる時期によっては早めの到着を心がけましょう。帰りもタクシーで、宿のある十和田湖畔まで戻りましょう。";
const OYU_TO =
  "縄文時代のお墓と考えられている遺跡です。柵の中に入ったり、石にふれたりせず、敬意をもって見学しましょう。見学できる時間は季節によって変わるので、公式の案内で確かめてから訪れましょう。帰りもタクシーでおよそ40分、宿のある十和田湖畔まで戻りましょう。";

const PLATTO_TO_VC_STAY = 72; // 55→72(浮いた17分を昼食に)
const PLATTO_TO_VC_TRANSIT = 5; // 22→5

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;

  const platto = await findSpotInItinerary(itinId, { spotName: "十和田湖観光交流センター「ぷらっと」" });
  const oyu = await findSpotInItinerary(itinId, { spotName: "大湯環状列石" });

  if (!oyu.memo!.includes(OYU_FROM)) throw new Error("一致しません(大湯環状列石)");
  const oyuNewMemo = oyu.memo!.replace(OYU_FROM, OYU_TO);

  console.log("ぷらっと: OK / 大湯環状列石: OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE } });
    await tx.spot.update({ where: { id: platto.id }, data: { stayDurationMin: PLATTO_TO_VC_STAY } });
  }, { timeout: 60000 });
  await updateSpotInItinerary(itinId, { spotId: oyu.id }, { memo: oyuNewMemo });

  // ぷらっと→VCの移動時間はVC側のtransitDurationMinで管理されている
  await updateSpotInItinerary(itinId, { spotId: (await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" })).id }, {
    transitMode: "walk",
    transitDurationMin: PLATTO_TO_VC_TRANSIT,
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
