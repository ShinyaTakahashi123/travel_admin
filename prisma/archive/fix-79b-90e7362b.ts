/**
 * #79 90e7362b fix-79で追加した2か所、flow-checkで見つかった不足を補う。
 * 池田記念美術館(D1・最終日ではない)に「宿の一言」、道の駅みつまた
 * (D2・最終日)に「帰りの一言」がなかったため追加。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await (await import("../src/lib/prisma")).prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;

  const ikeda = await findSpotInItinerary(itinId, { spotName: "池田記念美術館" });
  const ikedaFrom = "休館日は公式サイトで確かめてから訪れましょう。旅の1日目は、ここで終了です。";
  const ikedaTo = "休館日は公式サイトで確かめてから訪れましょう。この後は、宿へ戻ってゆっくりお休みください。旅の1日目は、ここで終了です。";
  if (!ikeda.memo!.includes(ikedaFrom)) throw new Error("一致しません(池田記念美術館)");
  const ikedaNewMemo = ikeda.memo!.split(ikedaFrom).join(ikedaTo);

  const mitsumata = await findSpotInItinerary(itinId, { spotName: "道の駅みつまた" });
  const mitsumataFrom = "定休日は公式サイトで確かめてから訪れましょう。旅の2日目は、ここで終了です。";
  const mitsumataTo = "定休日は公式サイトで確かめてから訪れましょう。お帰りは、関越自動車道などで安全運転でお帰りください。旅の2日目は、ここで終了です。";
  if (!mitsumata.memo!.includes(mitsumataFrom)) throw new Error("一致しません(道の駅みつまた)");
  const mitsumataNewMemo = mitsumata.memo!.split(mitsumataFrom).join(mitsumataTo);

  console.log("池田記念美術館: OK");
  console.log("道の駅みつまた: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: ikeda.id }, { memo: ikedaNewMemo });
  await updateSpotInItinerary(itinId, { spotId: mitsumata.id }, { memo: mitsumataNewMemo });
  console.log("COMMITTED");
}
main();
