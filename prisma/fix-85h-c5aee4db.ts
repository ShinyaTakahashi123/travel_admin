/**
 * #85 c5aee4db fix-85fで加悦駅舎の移動時間を50→12分(車)に直したが、
 * visitTimeの再計算を忘れていた(itinerary-auditの「時刻の計算が合わない」
 * で発覚)。あわせて、移動時間が縮まった分、終了が16:30〜17:00の窓から
 * 外れてしまった(15:55relative)ため、水増しではなく実在の内容の範囲内で
 * 滞在を調整して埋め直す: 加悦駅舎(実在の鉄道資料館、写真・展示をじっくり
 * 見る分として58→70分)、ちりめん街道(700mの通りに宝巌寺・天満神社・吉祥寺
 * も点在するため、ゆっくり歩く分として35→50分)、旧尾藤家住宅(重要文化財の
 * 邸内をじっくり見る分として50→60分)に調整。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;

  const kaya = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });
  const bitoke = await findSpotInItinerary(itinId, { spotName: "旧尾藤家住宅" });

  console.log("加悦駅舎: visitTime 13:22, stay70分に変更予定");
  console.log("ちりめん街道: visitTime 14:37, stay50分に変更予定");
  console.log("旧尾藤家住宅: visitTime 15:32, stay60分に変更予定");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kaya.id }, { visitTime: t(13, 22), stayDurationMin: 70 });
  await updateSpotInItinerary(itinId, { spotId: chirimen.id }, { visitTime: t(14, 37), stayDurationMin: 50 });
  await updateSpotInItinerary(itinId, { spotId: bitoke.id }, { visitTime: t(15, 32), stayDurationMin: 60 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
