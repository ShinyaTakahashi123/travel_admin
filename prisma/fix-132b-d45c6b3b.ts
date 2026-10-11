/**
 * #132 d45c6b3bの直し(2回目、自己点検)。御釜の「最初の噴火は鎌倉時代の
 * 初めごろと考えられており」が、itinerary-auditの「言い切り?」で
 * 引っかかった。「最初」に対する同じ文の中のぼかしが「と考えられて」
 * では認識されず(規定の語はとされ/ともいわれ/といわれ/と伝わ/と伝え)、
 * 「とされており」に修正する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const OKAMA_FROM = "最初の噴火は鎌倉時代の初めごろと考えられており、";
const OKAMA_TO = "最初の噴火は鎌倉時代の初めごろとされており、";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;

  const okama = await findSpotInItinerary(itinId, { spotName: "蔵王のお釜" });

  if (!okama.memo?.includes(OKAMA_FROM)) throw new Error("お釜の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: okama.id }, { memo: okama.memo!.replace(OKAMA_FROM, OKAMA_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
