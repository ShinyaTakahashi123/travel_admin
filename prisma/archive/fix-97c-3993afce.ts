/**
 * #97 3993afce の直し(3回目)。fix-97b で長浜城歴史博物館への移動時間を11分→8分に
 * 直したが、visitTime(13:06)は竹生島の終了(12:55)から11分後のままだったため、
 * itinerary-audit.cjsで「時刻の計算が合わない(間11分/移動8分)」と指摘された。
 * 移動時間を実際の間隔どおり11分に戻す(長浜港から長浜城歴史博物館までは
 * およそ600m、徒歩11分は妥当な速さ)。メモ文中の「歩いておよそ8分」も11分に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "長浜港から歩いておよそ8分、長浜城歴史博物館に着きます。";
const TO = "長浜港から歩いておよそ11分、長浜城歴史博物館に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;
  const castle = await findSpotInItinerary(itinId, { spotName: "長浜城歴史博物館" });
  console.log("現在のtransitDurationMin:", castle.transitDurationMin);
  if (castle.transitDurationMin !== 8) throw new Error("想定外の値です(transitDurationMin)");
  if (!castle.memo!.includes(FROM)) throw new Error("想定外の値です(memo)");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: castle.id }, {
    transitDurationMin: 11,
    memo: castle.memo!.replace(FROM, TO),
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
