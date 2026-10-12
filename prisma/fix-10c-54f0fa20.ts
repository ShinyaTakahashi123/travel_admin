/**
 * #10 54f0fa20の直し(3回目)。企画運営(2026-10-11)の指摘:
 * 1. Day1が16:29で終わっていた。滞在を延ばさず、好古園→男山配水池公園の
 *    移動を15分→16分にして16:30に。
 * 2. Day2の「書写山ロープウェイ山麓駅」(2か所とも)の座標が丸めた値
 *    だった。OSMの実点「書写」駅(node 309465913、34.8785758,134.6667264)
 *    に修正。今回触ったしおりの中の丸めなので、企画運営の指摘で対応。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;

  const otokoyama = await findSpotInItinerary(itinId, { spotName: "男山配水池公園" });
  const zoo = await findSpotInItinerary(itinId, { spotName: "姫路市立動物園" });
  const bungakukan = await findSpotInItinerary(itinId, { spotName: "姫路文学館" });
  const manidono = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const ropewayAll = await prisma.spot.findMany({ where: { dayId: manidono.dayId, name: "書写山ロープウェイ山麓駅" } });

  console.log("確認OK。山麓駅の件数:", ropewayAll.length);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(
    itinId,
    { spotId: otokoyama.id },
    { transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16, transitLine: null }] } }
  );
  await updateSpotInItinerary(itinId, { spotId: otokoyama.id }, { visitTime: t(13, 58) });
  await updateSpotInItinerary(itinId, { spotId: zoo.id }, { visitTime: t(14, 55) });
  await updateSpotInItinerary(itinId, { spotId: bungakukan.id }, { visitTime: t(15, 55) });

  for (const r of ropewayAll) {
    await prisma.spot.update({ where: { id: r.id }, data: { lat: 34.8785758, lng: 134.6667264 } });
  }

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
