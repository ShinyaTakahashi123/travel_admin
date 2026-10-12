/**
 * #97 3993afce の直し(5回目)。prayer-check.cjsで、大通寺・長浜八幡宮・舎那院・
 * 知善院・豊国神社の5か所に「配慮の一文なし」の指摘。いずれも今も参拝のある
 * 寺社のため、敬意を込めて参拝する一言を加える。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const edits: { spotName: string; from: string; to: string }[] = [
  {
    spotName: "大通寺",
    from: "長浜の旅のはじまりを感じてみてください。この後は、歩いておよそ8分、長浜八幡宮へ向かいましょう。",
    to: "長浜の旅のはじまりを感じてみてください。本堂にお参りする際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ8分、長浜八幡宮へ向かいましょう。",
  },
  {
    spotName: "長浜八幡宮",
    from: "始まりと伝えられています。この後は、歩いてすぐ、隣の舎那院へ向かいましょう。",
    to: "始まりと伝えられています。参拝の際は、鳥居の前で一礼するなど、敬意を持ってお参りしましょう。この後は、歩いてすぐ、隣の舎那院へ向かいましょう。",
  },
  {
    spotName: "舎那院",
    from: "神仏が共にあった時代の面影を感じてみてください。この後は、歩いておよそ11分、知善院へ向かいましょう。",
    to: "神仏が共にあった時代の面影を感じてみてください。本堂の前では、敬意を込めて手を合わせましょう。この後は、歩いておよそ11分、知善院へ向かいましょう。",
  },
  {
    spotName: "知善院",
    from: "長浜城の遺構をいまに伝える、静かな寺です。この後は、歩いておよそ6分、長浜曳山博物館へ向かいましょう。",
    to: "長浜城の遺構をいまに伝える、静かな寺です。本堂にお参りする際は、敬意を忘れずに。この後は、歩いておよそ6分、長浜曳山博物館へ向かいましょう。",
  },
  {
    spotName: "豊国神社",
    from: "長浜の人々が守り抜いた秀吉への信仰の跡を、静かに見て回ってみてください。",
    to: "長浜の人々が守り抜いた秀吉への信仰の跡に、敬意を込めて手を合わせてみてください。",
  },
];

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
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
