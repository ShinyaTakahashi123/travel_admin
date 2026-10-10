/**
 * #114 7d354df2の直し(2回目)。itinerary-audit.cjsで、既存(私の変更前
 * から入っていた)2件の時刻のずれが見つかった。
 * ① 鑁阿寺: 足利学校の終わり(10:20)と鑁阿寺のvisitTime(10:40)の間が
 *    20分あるのに、transitDurationMinは5分のままだった。visitTimeを
 *    10:25に直す。
 * ② 足利公園: 鑁阿寺→足利公園のtransitDurationMinが15分だったが、
 *    実際の距離(0.4km)には遅すぎた(徒歩時速1.6km)。6分に直し、
 *    visitTimeも連動して直す。
 * あわせて、①②の直しに連動して、今回新しく追加した織姫神社以降の
 * visitTimeも再計算した。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7d354df2%'`);
  const itinId = rows[0].id;

  const bannaji = await findSpotInItinerary(itinId, { spotName: "鑁阿寺" });
  const koen = await findSpotInItinerary(itinId, { spotName: "足利公園" });
  const orihime = await findSpotInItinerary(itinId, { spotName: "織姫神社" });
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "足利市立美術館" });
  const flowerpark = await findSpotInItinerary(itinId, { spotName: "あしかがフラワーパーク" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: bannaji.id }, { visitTime: t(10, 25) });
  await updateSpotInItinerary(itinId, { spotId: koen.id }, { visitTime: t(11, 11), transitDurationMin: 6 });
  await updateSpotInItinerary(itinId, { spotId: orihime.id }, { visitTime: t(11, 46) });
  await updateSpotInItinerary(itinId, { spotId: bijutsukan.id }, { visitTime: t(12, 26) });
  await updateSpotInItinerary(itinId, { spotId: flowerpark.id }, { visitTime: t(13, 31) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
