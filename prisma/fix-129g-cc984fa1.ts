/**
 * #129 cc984fa1の直し(7回目)。自己点検:
 * - 開山堂の「書写山での拝観の締めくくりに」が、文末の結びの一文と
 *   紛らわしく、flow-check.cjsに「途中に結び」として検出された。
 *   ほかのスポットと同じ言い回し(「今も祈りの場ですので」)に統一。
 * - 斑鳩寺に参拝の配慮の一文がなかった(prayer-check.cjsの指摘)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KAIZANDO_FROM = "書写山での拝観の締めくくりに、敬意を持って参拝しましょう。";
const KAIZANDO_TO = "今も祈りの場ですので、敬意を持って参拝しましょう。";

const IKARUGA_FROM = "本堂や三重塔をめぐりながら、聖徳太子ゆかりの古刹のたたずまいを楽しみましょう。";
const IKARUGA_TO = "本堂や三重塔をめぐりながら、敬意を持って、聖徳太子ゆかりの古刹のたたずまいを楽しみましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });
  const ikaruga = await findSpotInItinerary(itinId, { spotName: "斑鳩寺" });

  if (!kaizando.memo?.includes(KAIZANDO_FROM)) throw new Error("開山堂の文言が想定外です");
  if (!ikaruga.memo?.includes(IKARUGA_FROM)) throw new Error("斑鳩寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kaizando.id }, { memo: kaizando.memo!.replace(KAIZANDO_FROM, KAIZANDO_TO) });
  await updateSpotInItinerary(itinId, { spotId: ikaruga.id }, { memo: ikaruga.memo!.replace(IKARUGA_FROM, IKARUGA_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
