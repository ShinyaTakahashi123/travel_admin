/**
 * #119 949c4f43の直し(7回目)。史料館の滞在を60→80分にした際の下流の
 * 時刻のずれを直す(最後の直し)。
 * 史料館09:55(80分)→11:18 島瀬美術センター(55分)→12:33 旧佐世保
 * 無線電信所(40分)→13:18 西海橋(30分)→13:58 パレス(110分)→15:53
 * ドム(45分)→16:38終了。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const shimase = await findSpotInItinerary(itinId, { spotName: "佐世保市博物館島瀬美術センター" });
  const hario = await findSpotInItinerary(itinId, { spotName: "旧佐世保無線電信所" });
  const saikaibashi = await findSpotInItinerary(itinId, { spotName: "西海橋" });
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: shimase.id }, { visitTime: t(11, 18) });
  await updateSpotInItinerary(itinId, { spotId: hario.id }, { visitTime: t(12, 33) });
  await updateSpotInItinerary(itinId, { spotId: saikaibashi.id }, { visitTime: t(13, 18) });
  await updateSpotInItinerary(itinId, { spotId: palace.id }, { visitTime: t(13, 58) });
  await updateSpotInItinerary(itinId, { spotId: dom.id }, { visitTime: t(15, 53) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
