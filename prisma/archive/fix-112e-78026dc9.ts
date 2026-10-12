/**
 * #112 78026dc9の直し(5回目)。法務(15:09)の指摘4点に対応。
 * ①宮島の鹿に一文(千畳閣、最初の中心部のスポット)
 * ②千畳閣(豊国神社)・五重塔に祈りの一文
 * ③宮島水族館「ふれあいの磯」に生き物への配慮の一文
 * ④紅葉谷公園の結びが「千畳閣へ」、大聖院の結びが「紅葉谷公園へ」の
 *   ままだった(前回の直しで書き出しだけ直し、結びを直し忘れていた)。
 *   紅葉谷公園→大聖院(8分)、大聖院→大願寺(6分)に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const SENJOKAKU_FROM = "吹き抜けの広々とした空間を、柱の間を歩きながら眺めてみましょう。この後は、歩いてすぐ、五重塔へ向かいましょう。";
const SENJOKAKU_TO =
  "吹き抜けの広々とした空間を、柱の間を歩きながら眺めてみましょう。今も神社として祀られていますので、参拝の際は敬意を込めて手を合わせましょう。宮島には野生の鹿が多く暮らしていますが、食べ物を与えたり、近づきすぎたりしないようにしましょう。この後は、歩いてすぐ、五重塔へ向かいましょう。";

const GOJUNOTO_FROM = "千畳閣の素朴な木組みとは対照的な、整った姿の塔を見比べてみましょう。この後は、歩いておよそ8分、紅葉谷公園へ向かいましょう。";
const GOJUNOTO_TO =
  "千畳閣の素朴な木組みとは対照的な、整った姿の塔を見比べてみましょう。今も信仰の対象となっていますので、敬意を込めて見学しましょう。この後は、歩いておよそ8分、紅葉谷公園へ向かいましょう。";

const MOMIJIDANI_FROM = "渓谷のせせらぎを聞きながら、静かな散策のひとときを過ごしましょう。この後は、歩いておよそ7分、千畳閣へ向かいましょう。";
const MOMIJIDANI_TO = "渓谷のせせらぎを聞きながら、静かな散策のひとときを過ごしましょう。この後は、歩いておよそ8分、大聖院へ向かいましょう。";

const TAISHOIN_FROM = "今も信仰の対象となっている寺院ですので、境内では静かに、敬意をもってお参りください。この後は、歩いておよそ8分、紅葉谷公園へ向かいましょう。";
const TAISHOIN_TO = "今も信仰の対象となっている寺院ですので、境内では静かに、敬意をもってお参りください。この後は、歩いておよそ6分、大願寺へ向かいましょう。";

const AQUARIUM_FROM = "生き物に直接触れられる「ふれあいの磯」など、瀬戸内の自然を身近に感じられる展示が揃っています。館内をゆっくりめぐって、瀬戸内海の豊かな生き物たちを楽しみましょう。";
const AQUARIUM_TO =
  "生き物に直接触れられる「ふれあいの磯」など、瀬戸内の自然を身近に感じられる展示が揃っています。生き物に触れるときはやさしく、触れたあとは手を洗うようにしましょう。館内をゆっくりめぐって、瀬戸内海の豊かな生き物たちを楽しみましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '78026dc9%'`);
  const itinId = rows[0].id;
  const senjokaku = await findSpotInItinerary(itinId, { spotName: "千畳閣" });
  const gojunoto = await findSpotInItinerary(itinId, { spotName: "五重塔" });
  const momijidani = await findSpotInItinerary(itinId, { spotName: "紅葉谷公園" });
  const taishoin = await findSpotInItinerary(itinId, { spotName: "大聖院" });
  const aquarium = await findSpotInItinerary(itinId, { spotName: "宮島水族館" });

  for (const [name, spot, from] of [
    ["千畳閣", senjokaku, SENJOKAKU_FROM],
    ["五重塔", gojunoto, GOJUNOTO_FROM],
    ["紅葉谷公園", momijidani, MOMIJIDANI_FROM],
    ["大聖院", taishoin, TAISHOIN_FROM],
    ["宮島水族館", aquarium, AQUARIUM_FROM],
  ] as const) {
    if (!spot.memo!.includes(from)) throw new Error(`${name}の文言が想定外です`);
  }
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: senjokaku.id }, { memo: senjokaku.memo!.replace(SENJOKAKU_FROM, SENJOKAKU_TO) });
  await updateSpotInItinerary(itinId, { spotId: gojunoto.id }, { memo: gojunoto.memo!.replace(GOJUNOTO_FROM, GOJUNOTO_TO) });
  await updateSpotInItinerary(itinId, { spotId: momijidani.id }, { memo: momijidani.memo!.replace(MOMIJIDANI_FROM, MOMIJIDANI_TO) });
  await updateSpotInItinerary(itinId, { spotId: taishoin.id }, { memo: taishoin.memo!.replace(TAISHOIN_FROM, TAISHOIN_TO) });
  await updateSpotInItinerary(itinId, { spotId: aquarium.id }, { memo: aquarium.memo!.replace(AQUARIUM_FROM, AQUARIUM_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
