/**
 * #90 de041462 fix-90dの直し漏れ。霊山寺のメモに「静かに見守りましょう」と
 * 書いたが、prayer-checkの正規表現(敬意|手を合わせ)に一致せず、配慮の一文
 * なしと判定された。「敬意」の語を含む書き方に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM = "本尊の釈迦如来は、弘法大師が21日間の祈願の末に刻んだと伝えられています。白い衣のお遍路さんの姿を見かけたら、写真を撮ったりお参りの邪魔をしたりしないよう、静かに見守りましょう。";
const TO = "本尊の釈迦如来は、弘法大師が21日間の祈願の末に刻んだと伝えられています。境内では静かに、敬意をもってお参りください。白い衣のお遍路さんの姿を見かけたら、写真を撮ったりお参りの邪魔をしたりしないようにしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'de041462%'`);
  const itinId = rows[0].id;
  const ryozenji = await findSpotInItinerary(itinId, { spotName: "霊山寺" });
  if (!ryozenji.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: ryozenji.id }, { memo: ryozenji.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
