/**
 * #59 e58458ef 松島の夕景と瑞巌寺の紅葉、じっくり味わう1泊2日の旅。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e58458ef%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "瑞巌寺",
    "皆様、本日ご案内するのは瑞巌寺です。",
    "旅の始まりは瑞巌寺です。",
    "瑞巌寺(書き出し)"
  );
  await fixOne(
    "瑞巌寺",
    "参拝を終えたら、続いては、すぐそばの円通院へご案内いたします。",
    "参拝を終えたら、続いては、すぐそばの円通院へ向かいましょう。",
    "瑞巌寺(結び)"
  );
  await fixOne(
    "五大堂",
    "足元に気をつけながら朱塗りのすかし橋を渡り、軒下の蟇股に施された十二支の彫刻もあわせてお楽しみください。",
    "足元に気をつけながら朱塗りのすかし橋を渡り、軒下の蟇股に施された十二支の彫刻もあわせて眺めてみてください。",
    "五大堂"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
