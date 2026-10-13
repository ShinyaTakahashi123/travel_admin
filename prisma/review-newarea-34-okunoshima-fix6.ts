/**
 * #34の直し(企画運営の指摘、2026-10-13)。
 * 1. 昼食の時刻が11:30〜13:30の枠を外れていたため、順番を入れかえ(灯台→資料館→
 *    ビジターセンター→昼食→発電所跡→長浦貯蔵庫跡→北部砲台跡→うさぎ海辺の散策)、
 *    昼食を12時台に
 * 2. 休暇村の2スポット(昼食・うさぎ海辺の散策)の座標が同じだったため、散策の
 *    ほうは大久野島キャンプ場(OSMで確認できる実在の点、海水浴場に近いエリア)
 *    の座標に変更
 * 3. ビジターセンターに休館日の注意を追加
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "022147fb-a64b-4afe-bf3e-14f06d1d9a10";
const VC_NAME = "大久野島ビジターセンター";
const LUNCH_NAME = "休暇村大久野島周辺（昼食）";
const USAGI_NAME = "休暇村大久野島周辺（うさぎ・海辺の散策）";
const HATSUDENSHO_SPOT_ID = "79c4c8d0-2250-4da3-8893-40d34c2f4820";

const CAMPSITE_LAT = 34.3055024;
const CAMPSITE_LNG = 132.9975722;

const VC_NOTE = "休館日があるため、訪れる前に公式の案内で確かめましょう。";

async function main() {
  const vc = await prisma.spot.findFirst({ where: { name: VC_NAME, dayId: DAY_ID } });
  const lunch = await prisma.spot.findFirst({ where: { name: LUNCH_NAME, dayId: DAY_ID } });
  const usagi = await prisma.spot.findFirst({ where: { name: USAGI_NAME, dayId: DAY_ID } });
  const hatsudensho = await prisma.spot.findUnique({ where: { id: HATSUDENSHO_SPOT_ID } });
  if (!vc?.memo || !lunch || !usagi || !hatsudensho) throw new Error("想定と違います");
  if (vc.memo.includes(VC_NOTE)) throw new Error("ビジターセンターに既に一文があります(想定外)");

  const newVcMemo = vc.memo + VC_NOTE;

  console.log("[確認OK] 昼食をビジターセンターの直後(12時台)に移動");
  console.log("[確認OK] うさぎ・海辺の散策をキャンプ場の座標に変更");
  console.log("[確認OK] ビジターセンターに休館日の注意を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const vcLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: vc.id } });
  const lunchLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: lunch.id } });
  const hatsudenshoLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: HATSUDENSHO_SPOT_ID } });
  const usagiLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: usagi.id } });
  if (!vcLeg || !lunchLeg || !hatsudenshoLeg || !usagiLeg) throw new Error("移動データが見つかりません");

  await prisma.spot.update({ where: { id: vc.id }, data: { memo: newVcMemo } });

  // 発電所跡・長浦・北部砲台跡をいったん退避(orderNoの衝突を避ける)
  const middleSpots = await prisma.spot.findMany({
    where: { dayId: DAY_ID, orderNo: { gte: hatsudensho.orderNo, lt: usagi.orderNo } },
    orderBy: { orderNo: "asc" },
  });
  for (const s of middleSpots) {
    await prisma.spot.update({ where: { id: s.id }, data: { orderNo: s.orderNo + 90 } });
  }

  // 昼食: orderNo4、ビジターセンター(11:27+45=12:12)から4分で12:16着、55分滞在(変更なし)
  await prisma.spot.update({ where: { id: lunch.id }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 16)) } });
  await prisma.spotTransitLeg.update({ where: { id: lunchLeg.id }, data: { transitDurationMin: 4 } });

  // 発電所跡: orderNo5、昼食(12:16+55=13:11)から10分で13:21着、30分滞在(変更なし)
  await prisma.spot.update({ where: { id: HATSUDENSHO_SPOT_ID }, data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 21)) } });
  await prisma.spotTransitLeg.update({ where: { id: hatsudenshoLeg.id }, data: { transitDurationMin: 10 } });

  // 長浦毒ガス貯蔵庫跡: orderNo6、発電所跡(13:21+30=13:51)から13分で14:04着(変更なし)
  const nagaura = middleSpots.find((s) => s.name === "長浦毒ガス貯蔵庫跡")!;
  await prisma.spot.update({ where: { id: nagaura.id }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 4)) } });

  // 北部砲台跡: orderNo7、長浦(14:04+30=14:34)から2分で14:36着(変更なし)
  const hokubu = middleSpots.find((s) => s.name === "北部砲台跡")!;
  await prisma.spot.update({ where: { id: hokubu.id }, data: { orderNo: 7, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 36)) } });

  // うさぎ・海辺の散策: orderNo8(変更なし)、北部砲台跡(14:36+30=15:06)から14分で15:20着、座標をキャンプ場に変更
  await prisma.spot.update({
    where: { id: usagi.id },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 20)), lat: CAMPSITE_LAT, lng: CAMPSITE_LNG },
  });
  await prisma.spotTransitLeg.update({ where: { id: usagiLeg.id }, data: { transitDurationMin: 14 } });

  console.log("  COMMITTED: #34 昼食を12時台に移動、座標を修正(10:00〜16:30)");
}
main().finally(() => prisma.$disconnect());
