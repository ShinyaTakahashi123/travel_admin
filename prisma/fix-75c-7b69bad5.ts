/**
 * #75 7b69bad5。企画運営の指摘2点。
 * 1) 成相寺→旧三上家住宅の移動を、OSRMの車の時間(16分)ではなく、実際の乗継
 *    (成相寺→登山バス7分→傘松公園→ケーブルカー4分→府中→丹後海陸交通の
 *    路線バスで宮津市街まで約25分、丹海の公式サイトで確認)にもとづき、
 *    乗継の待ち時間も見込んでおよそ45分に修正。
 * 2) 旧三上家住宅の75分は商家見学としては長めのため、45分に短縮。着く時刻
 *    (15:52ごろ)は16:30の最終入館より前なので問題なし。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await (await import("../src/lib/prisma")).prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7b69bad5%'`);
  const itinId = rows[0].id;

  const nariaiji = await findSpotInItinerary(itinId, { spotName: "成相寺" });
  const nariaijiFrom = "この後は、バスでおよそ16分、山を下って旧三上家住宅へ向かいましょう。";
  const nariaijiTo = "この後は、登山バスとケーブルカー、路線バスを乗り継いでおよそ45分、山を下って旧三上家住宅へ向かいましょう。";
  if (!nariaiji.memo!.includes(nariaijiFrom)) throw new Error("一致しません(成相寺)");
  const nariaijiNewMemo = nariaiji.memo!.split(nariaijiFrom).join(nariaijiTo);

  const mikami = await findSpotInItinerary(itinId, { spotName: "旧三上家住宅" });
  const mikamiFrom = "成相寺からバスでおよそ16分、山を下って旧三上家住宅に着きます。";
  const mikamiTo = "成相寺から登山バスとケーブルカー、路線バスを乗り継いでおよそ45分、山を下って旧三上家住宅に着きます。";
  if (!mikami.memo!.includes(mikamiFrom)) throw new Error("一致しません(旧三上家住宅)");
  const mikamiNewMemo = mikami.memo!.split(mikamiFrom).join(mikamiTo);

  console.log("成相寺: OK");
  console.log("旧三上家住宅: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: nariaiji.id }, { memo: nariaijiNewMemo });
  await updateSpotInItinerary(itinId, { spotId: mikami.id }, { memo: mikamiNewMemo, visitTime: t(15, 52), stayDurationMin: 45, transitDurationMin: 45 });
  console.log("COMMITTED");
}
main();
