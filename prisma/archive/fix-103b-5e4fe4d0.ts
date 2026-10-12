/**
 * #103 5e4fe4d0 の直し(2回目)。
 * - itinerary-audit.cjsで、あわら湯のまち広場の「無料の足湯」が料金の記載として
 *   指摘された。金額の有無にかかわらず料金に触れない決まりのため、「無料の」を外す。
 * - flow-check.cjsで、1日目に昼食の一言がないと指摘された。東尋坊の土産物店で
 *   食事ができる一文を、昼食と分かる書き方に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const edits: { spotName: string; from: string; to: string }[] = [
  {
    spotName: "あわら湯のまち広場",
    from: "散策の合間に、無料の足湯で旅の疲れを癒やしてみてください。",
    to: "散策の合間に、足湯で旅の疲れを癒やしてみてください。",
  },
  {
    spotName: "東尋坊",
    from: "遊覧船に乗って海から断崖を見上げたり、崖沿いの土産物店で越前がにや海鮮を味わったりと、思い思いに過ごせます。",
    to: "遊覧船に乗って海から断崖を見上げたり、崖沿いの土産物店で越前がにや海鮮の昼食を味わったりと、思い思いに過ごせます。",
  },
];

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  for (const e of edits) {
    const spot = await findSpotInItinerary(itinId, { spotName: e.spotName });
    if (!spot.memo!.includes(e.from)) throw new Error(`一致しません(${e.spotName})`);
    console.log(`確認OK: ${e.spotName}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  for (const e of edits) {
    const spot = await findSpotInItinerary(itinId, { spotName: e.spotName });
    await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(e.from, e.to) });
    console.log(`COMMITTED: ${e.spotName}`);
  }
}
main().finally(() => prisma.$disconnect());
