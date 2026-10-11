/**
 * #149 158f73faの直し(5回目、自己点検)。prayer-checkで温泉寺に配慮の
 * 一文が見当たらないと検出されたため、祈りの一文を追加する(寺であるため)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "境内には、この伝説を伝える石碑が立っています。この後は、歩いておよそ3分、加恵瑠神社へ向かいましょう。";
const TO = "境内には、この伝説を伝える石碑が立っています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ3分、加恵瑠神社へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '158f73fa%'`);
  const itinId = rows[0].id;
  const onsenji = await findSpotInItinerary(itinId, { spotName: "温泉寺" });

  if (!onsenji.memo?.includes(FROM)) throw new Error("温泉寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: onsenji.id }, data: { memo: onsenji.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
