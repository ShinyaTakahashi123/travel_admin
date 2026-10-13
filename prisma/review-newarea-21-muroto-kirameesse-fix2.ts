/**
 * #21の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. キラメッセ室戸: 店名(「楽市」「食遊」)を削除。スポット名を「キラメッセ室戸（昼食）」
 *   にし(台帳の名前も合わせる)、メモの終わりを「ここで昼食をとりましょう。」に
 * 2. 室戸岬灯台のメモの言い切り口調を「灯台のそばからは、太平洋を見渡せます。」に直す
 * 3. 室戸世界ジオパークセンターのメモの主語を補う(「室戸ジオパークは、平成23年…」)
 * 4. ジオパークセンター→室戸岬灯台の移動(徒歩5分)を車に直す。GSIの標高APIで確認した
 *   ところ、ジオパークセンター(海沿い)は標高9.6m、室戸岬灯台は標高143.3mで、点どうしは
 *   約200mしか離れていないが高低差が大きい。tabi-mag.jp(ko0025)によると、バス停
 *   「室戸岬」から灯台までは徒歩約30分とされ、最御崎寺の駐車場(灯台のすぐそば、県道
 *   203号「室戸スカイライン」沿い)まで車で上がるのが現実的なルートと判断し、車10分に
 *   直す(灯台の開始時刻を15:50→16:05、終わりを16:30→16:35に調整)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const kirameesse = await prisma.spot.findFirst({ where: { name: "キラメッセ室戸" } });
  const geo = await prisma.spot.findFirst({ where: { name: "室戸世界ジオパークセンター" } });
  const todai = await prisma.spot.findFirst({ where: { name: "室戸岬灯台" } });
  if (!kirameesse?.memo || !geo?.memo || !todai) throw new Error("想定と違います");

  const todaiTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: todai.id, orderNo: 1 } });
  if (!todaiTransit) throw new Error("移動データが見つかりません");

  const newKirameesseMemo = kirameesse.memo
    .replace("地元の海産物や特産品を扱う直売所「楽市」と、地魚料理が楽しめるレストラン「食遊」を備えた道の駅です。", "地元の海産物や特産品を扱う直売所と、地魚料理が楽しめるレストランを備えた道の駅です。")
    .replace("ここでお昼を楽しんでから、次に向かいましょう。", "ここで昼食をとりましょう。");
  const newTodaiMemo = todai.memo!.replace("内部は通常非公開ですが、灯台から望む太平洋の眺めは必見です。", "内部は通常非公開ですが、灯台のそばからは、太平洋を見渡せます。");
  const newGeoMemo = geo.memo.replace("平成23年(2011)、ユネスコの世界ジオパークネットワークへの加盟が認定されました。", "室戸ジオパークは、平成23年(2011)に、ユネスコの世界ジオパークネットワークへの加盟が認定されました。");

  if (newKirameesseMemo === kirameesse.memo || newTodaiMemo === todai.memo || newGeoMemo === geo.memo) {
    throw new Error("置換対象が見つかりません");
  }

  const kirameessePm = await prisma.placeMaster.findUnique({ where: { id: kirameesse.placeMasterId! } });
  if (!kirameessePm || kirameessePm.name !== "キラメッセ室戸") throw new Error("キラメッセ室戸の台帳が想定と違います");

  console.log("[確認OK] キラメッセ室戸のメモから店名を削除し、スポット名・台帳名を「キラメッセ室戸（昼食）」に");
  console.log("[確認OK] 室戸岬灯台のメモの言い切り口調を直す");
  console.log("[確認OK] 室戸世界ジオパークセンターのメモに主語を補う");
  console.log("[確認OK] ジオパークセンター→室戸岬灯台の移動を車10分に直す(16:05-16:35)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.placeMaster.update({ where: { id: kirameessePm.id }, data: { name: "キラメッセ室戸（昼食）" } });
  await prisma.spot.update({ where: { id: kirameesse.id }, data: { name: "キラメッセ室戸（昼食）", memo: newKirameesseMemo } });
  await prisma.spot.update({ where: { id: geo.id }, data: { memo: newGeoMemo } });
  await prisma.spotTransitLeg.update({ where: { id: todaiTransit.id }, data: { transitMode: "car", transitDurationMin: 10 } });
  await prisma.spot.update({
    where: { id: todai.id },
    data: { memo: newTodaiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 16, 5)) },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
