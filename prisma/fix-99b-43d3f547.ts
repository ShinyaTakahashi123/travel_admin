/**
 * #99 43d3f547 の直し(2回目)。flow-check.cjs で「D1最後(萬福寺)に宿の一言なし」
 * 「D2最後(伏見稲荷大社)に帰りの一言なし」、prayer-check.cjsで8か所(平等院・
 * 宇治上神社・三室戸寺・萬福寺・御香宮神社・藤森神社・石峰寺・伏見稲荷大社)に
 * 「配慮の一文なし」の指摘。いずれも実在の内容として自然な一文を足す。
 * (寺田屋は「寺」の字を含むがお寺ではない旅籠のため、prayer-checkの対象外と判断)
 * audit.cjsが平等院の「10円硬貨」を料金の記載として拾っているが、これは
 * 拝観料ではなく硬貨の意匠についての事実の記述のため、直さずそのままとした。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const edits: { spotName: string; from: string; to: string }[] = [
  {
    spotName: "平等院",
    from: "朝の静けさの中、池に姿を映す鳳凰堂の眺めを楽しんでみてください。",
    to: "朝の静けさの中、池に姿を映す鳳凰堂の眺めを楽しんでみてください。堂内を拝観する際は、敬意を込めて静かに過ごしましょう。",
  },
  {
    spotName: "宇治上神社",
    from: "支援を受けながら整えられてきたと伝えられ、あわせて世界遺産に登録されています。",
    to: "支援を受けながら整えられてきたと伝えられ、あわせて世界遺産に登録されています。参拝の際は、世界遺産の社殿に敬意を込めて手を合わせましょう。",
  },
  {
    spotName: "三室戸寺",
    from: "本堂までの石段を上りながら、四季折々の花と向き合う時間を、ゆっくりと過ごせる寺です。",
    to: "本堂までの石段を上りながら、四季折々の花と向き合う時間を、ゆっくりと過ごせる寺です。本堂にお参りする際は、敬意を込めて手を合わせましょう。",
  },
  {
    spotName: "萬福寺",
    from: "広い境内には、他にも法堂・斎堂・伽藍堂など見どころが点在し、ひとつひとつじっくりと見て回れます。",
    to: "広い境内には、他にも法堂・斎堂・伽藍堂など見どころが点在し、ひとつひとつじっくりと見て回れます。参拝の際は、敬意を込めて手を合わせましょう。1日目はここまでです。今夜は宇治の宿に泊まります。",
  },
  {
    spotName: "御香宮神社",
    from: "国の重要文化財に指定されています。界隈で昼食を済ませてから、藤森神社へ向かいましょう。",
    to: "国の重要文化財に指定されています。参拝の際は、敬意を込めて手を合わせましょう。界隈で昼食を済ませてから、藤森神社へ向かいましょう。",
  },
  {
    spotName: "藤森神社",
    from: "奉納される勇壮な「駈馬神事」でも知られています。",
    to: "奉納される勇壮な「駈馬神事」でも知られています。参拝の際は、敬意を込めて手を合わせましょう。",
  },
  {
    spotName: "石峰寺",
    from: "若冲自身の墓もこの寺にあります。",
    to: "若冲自身の墓もこの寺にあります。五百羅漢像やお墓を巡る際は、敬意を持って静かに歩きましょう。",
  },
  {
    spotName: "伏見稲荷大社",
    from: "時間に余裕があれば、四ツ辻までの参道を上り、伏見の街を見渡す眺めを楽しむのもおすすめです。",
    to: "時間に余裕があれば、四ツ辻までの参道を上り、伏見の街を見渡す眺めを楽しむのもおすすめです。参拝の際は、敬意を込めて手を合わせましょう。帰りは、JR稲荷駅や京阪伏見稲荷駅をご利用ください。",
  },
];

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '43d3f547%'`);
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
