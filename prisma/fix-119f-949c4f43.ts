/**
 * #119 949c4f43の直し(6回目)。企画運営(16:23)の指摘にもとづき、Day2も
 * 決まりA違反(滞在を延ばして時間を埋めていた)を直す。
 * 森きらら120→80分、九十九島パールシーリゾート100→70分、
 * 海きらら130→50分(#213での扱いにあわせる)に短縮。
 *
 * 【途中】縮めた分(森きらら-40・パールシー-30・海きらら-80=計150分)を
 * 埋める実在の行き先が、九十九島エリアでは見つけられなかった(OSMで
 * 座標が確認できる候補を展海峰・石岳展望台・森きらら・パールシー
 * リゾート・海きらら以外に探したが見つからず)。この回では、まず
 * 決まりA違反の解消(滞在短縮)のみを行い、Day2が16:30〜17:00に届か
 * ない状態(14:XXごろ終了)のまま報告する。来週、企画運営に相談して
 * 続きを進める。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const morikirara = await findSpotInItinerary(itinId, { spotName: "森きらら" });
  const pearlsea = await findSpotInItinerary(itinId, { spotName: "九十九島パールシーリゾート" });
  const umikirara = await findSpotInItinerary(itinId, { spotName: "海きらら" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: morikirara.id }, { stayDurationMin: 80 });
  await updateSpotInItinerary(itinId, { spotId: pearlsea.id }, { visitTime: t(12, 7), stayDurationMin: 70 });
  await updateSpotInItinerary(itinId, { spotId: umikirara.id }, { visitTime: t(13, 19), stayDurationMin: 50 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
