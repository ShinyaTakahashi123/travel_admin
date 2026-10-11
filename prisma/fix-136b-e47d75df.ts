/**
 * #136 e47d75dfの直し(2回目、自己点検)。
 * ①下田公園の「日本で最初に開港した港の一つとなった」(もとの未確認の
 *   文からそのまま残っていた)に、同じ文の中のぼかしがなかった
 *   (itinerary-auditの「言い切り?」で発覚)。
 * ②Day1に昼食の一言がなかった(flow-checkの「1日目に昼食の一言なし」
 *   で発覚)。堂ヶ島の結びに食事処の一言を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const SHIMODAPARK_FROM = "日本で最初に開港した港の一つとなった下田の歴史を伝える公園です。";
const SHIMODAPARK_TO = "日本で最初に開港した港の一つとされる下田の歴史を伝える公園です。";

const DOGASHIMA_FROM = "遊覧船に乗って、自然が生み出した神秘の洞窟を眺めましょう。この後は、歩いておよそ7分、三四郎島のトンボロへ向かいましょう。";
const DOGASHIMA_TO = "遊覧船に乗って、自然が生み出した神秘の洞窟を眺めましょう。このあたりには食事処も多いので、ここで昼食をとりましょう。この後は、歩いておよそ7分、三四郎島のトンボロへ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e47d75df%'`);
  const itinId = rows[0].id;
  const shimodapark = await findSpotInItinerary(itinId, { spotName: "下田公園" });
  const dogashima = await findSpotInItinerary(itinId, { spotName: "堂ヶ島" });

  if (!shimodapark.memo?.includes(SHIMODAPARK_FROM)) throw new Error("下田公園の文言が想定外です");
  if (!dogashima.memo?.includes(DOGASHIMA_FROM)) throw new Error("堂ヶ島の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: shimodapark.id }, data: { memo: shimodapark.memo!.replace(SHIMODAPARK_FROM, SHIMODAPARK_TO) } }),
    prisma.spot.update({ where: { id: dogashima.id }, data: { memo: dogashima.memo!.replace(DOGASHIMA_FROM, DOGASHIMA_TO) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
