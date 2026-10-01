/**
 * #116 8480e278の直し(10回目)。企画運営(15:46)の指摘2点。
 * 1. 会津民俗館の結びが組み替え前の「天鏡閣へ」のままだったため、
 *    実際の次のスポット(土津神社・車で9分)に直す
 * 2. 磐梯山噴火記念館は冬季(12〜3月)、開館時間が9:00〜16:00(最終入館
 *    15:30)に短縮され、かつ土日祝日・年末年始・春休み以外の平日は
 *    休館となる(https://www.jalan.net/kankou/spt_07402cc3290031709/ 等)。
 *    このしおりは最後の磐梯山噴火記念館を16:57に出る組み方のため、
 *    冬は開館時間にも曜日にも対応できない。季節からwinterを外す
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const MINZOKUKAN_FROM = "この後は、車でおよそ7分、天鏡閣へ向かいましょう。";
const MINZOKUKAN_TO = "この後は、車でおよそ9分、土津神社へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, seasons::text[] as seasons from itinerary where id::text like '8480e278%'`);
  const itinId = rows[0].id;
  const minzokukan = await findSpotInItinerary(itinId, { spotName: "会津民俗館" });

  console.log("現在の季節:", rows[0].seasons);
  if (!minzokukan.memo!.includes(MINZOKUKAN_FROM)) throw new Error("会津民俗館の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: minzokukan.id }, { memo: minzokukan.memo!.replace(MINZOKUKAN_FROM, MINZOKUKAN_TO) });
  await prisma.itinerary.update({ where: { id: itinId }, data: { seasons: { set: ["spring", "summer", "autumn"] } } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
