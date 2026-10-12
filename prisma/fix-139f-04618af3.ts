/**
 * #139 04618af3の直し(6回目)。法務の指摘。
 * ①東後畑棚田の座標が、OSMの「油谷後畑」のnodeではなく、県道の上の
 *   点だった誤り。実際の「東後畑棚田」のnode(designation=nature)に
 *   修正し、元乃隅神社までの時間も4→3分に修正。
 * ②道の駅北浦街道ほうほくの座標が、名前のない生活道路のそばで、
 *   実際の道の駅から約3.4km離れていた誤り。「北浦街道 豊北」の
 *   Nominatim中心に修正(移動時間は4分で合致)。
 * ③長門湯本温泉の入浴の一文に「ほかの人を写さず」を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const HIGASHIUSHIROBATA_FROM = "この後は、車でおよそ4分、元乃隅神社へ向かいましょう。";
const HIGASHIUSHIROBATA_TO = "この後は、車でおよそ3分、元乃隅神社へ向かいましょう。";

const NAGATOYUMOTO_FROM = "長湯は避けて、水分をとりながら入りましょう。";
const NAGATOYUMOTO_TO = "ほかの人を写さず、長湯は避けて、水分をとりながら入りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const higashiushirobata = await findSpotInItinerary(itinId, { spotName: "東後畑棚田" });
  const michinoeki = await findSpotInItinerary(itinId, { spotName: "道の駅北浦街道ほうほく" });
  const nagatoyumoto = await findSpotInItinerary(itinId, { spotName: "長門湯本温泉" });

  if (!higashiushirobata.memo?.includes(HIGASHIUSHIROBATA_FROM)) throw new Error("東後畑棚田の文言が想定外です");
  if (!nagatoyumoto.memo?.includes(NAGATOYUMOTO_FROM)) throw new Error("長門湯本温泉の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: higashiushirobata.id },
      data: {
        lat: 34.40749, lng: 131.0627199,
        memo: higashiushirobata.memo!.replace(HIGASHIUSHIROBATA_FROM, HIGASHIUSHIROBATA_TO),
      },
    }),
    prisma.spot.update({ where: { id: michinoeki.id }, data: { lat: 34.3106394, lng: 130.8888588 } }),
    prisma.spot.update({
      where: { id: nagatoyumoto.id },
      data: { memo: nagatoyumoto.memo!.replace(NAGATOYUMOTO_FROM, NAGATOYUMOTO_TO) },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
