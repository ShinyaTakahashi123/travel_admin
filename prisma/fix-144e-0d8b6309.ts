/**
 * #144 0d8b6309の直し(5回目、法務の指摘)。五條新町は今も人が暮らす
 * 町並みのため、生活への配慮の一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FROM = "格子窓や虫籠窓など、当時の商家の意匠を眺めながら、通りをのんびりと歩いてみましょう。見学を終えたら、車でおよそ3分、JR五条駅へ向かい、レンタカーを返しましょう。";
const TO = "格子窓や虫籠窓など、当時の商家の意匠を眺めながら、通りをのんびりと歩いてみましょう。今も人が暮らす町並みなので、静かに歩き、家の敷地に入ったり住民の方を撮ったりしないようにしましょう。見学を終えたら、車でおよそ3分、JR五条駅へ向かい、レンタカーを返しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0d8b6309%'`);
  const itinId = rows[0].id;
  const shinmachi = await findSpotInItinerary(itinId, { spotName: "五條新町" });

  if (!shinmachi.memo?.includes(FROM)) throw new Error("五條新町の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: shinmachi.id }, data: { memo: shinmachi.memo!.replace(FROM, TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
