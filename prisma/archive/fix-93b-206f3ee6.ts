/**
 * #93 206f3ee6 fix-93の直後の直し。遠見場に願成寺と同じ座標を使ってしまい、
 * itinerary-auditが「位置が前とほぼ同じ」を検出した。遠見場は願成寺から
 * 急な山道を15分ほど登った先にあるとの記述(うわじま観光ガイド)にもとづき、
 * 願成寺から山側へおよそ300m離れた、実際の登山道の方向に近い点に補正する
 * (九島内の正確なOSM点が見つからなかったため、GSIの字レベルの点からの
 * 推定であることを記録に残す)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '206f3ee6%'`);
  const itinId = rows[0].id;
  const tomiba = await findSpotInItinerary(itinId, { spotName: "遠見場" });
  console.log("現在の座標:", tomiba.lat, tomiba.lng);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: tomiba.id }, { lat: 33.234376, lng: 132.526769 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
