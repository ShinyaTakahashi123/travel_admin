/**
 * #134 e0181f83の直し(6回目)。企画運営の最終指摘3点。
 * ①清盛神社の「西の松原…海を見渡せる静かな一角です」が78026dc9と
 *   ほぼ同じ文のため削除。②多宝塔の「五重塔と見比べ」は、五重塔が
 *   令和8年12月まで修理中で見られないため削除し、別の事実(眺め)に
 *   差し替え。③産業会館の「販売」の言い方を外す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KIYOMORI_FROM =
  "多宝塔から歩いておよそ4分、清盛神社に着きます。祀られているのは平清盛で、久安2年(1146)に安芸守となり、保元・平治の乱を経て、仁安2年(1167)には武士として初めて太政大臣になったとされる人物です。「西の松原」と呼ばれる松林の中にあり、海を見渡せる静かな一角です。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ9分、町家通りへ向かいましょう。";
const KIYOMORI_TO =
  "多宝塔から歩いておよそ4分、清盛神社に着きます。祀られているのは平清盛で、久安2年(1146)に安芸守となり、保元・平治の乱を経て、仁安2年(1167)には武士として初めて太政大臣になったとされる人物です。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ9分、町家通りへ向かいましょう。";

const TAHOTO_FROM =
  "大聖院から坂道を歩いておよそ5分、多宝塔に着きます。下層が方形、上層が円形という形の、二重の塔です。近くに立つ五重塔とは違う、もう一つの塔の形を見比べてみましょう。石段や坂道が続きますので、足元に気をつけましょう。この後は、歩いておよそ4分、清盛神社へ向かいましょう。";
const TAHOTO_TO =
  "大聖院から坂道を歩いておよそ5分、多宝塔に着きます。下層が方形、上層が円形という形の、二重の塔です。空海が修行したという伝承の残る弥山を望む高台に立ち、瀬戸内海を見渡せます。石段や坂道が続きますので、足元に気をつけましょう。この後は、歩いておよそ4分、清盛神社へ向かいましょう。";

const SANGYO_FROM = "を展示・販売する、体験型の観光施設です。";
const SANGYO_TO = "を展示し、ものづくりの体験もできる、体験型の観光施設です。";

const MACHIYA_FROM =
  "令和3年(2021)、国の重要伝統的建造物群保存地区に選定されました。宮島の商家の町並みを眺めながら、ゆっくり歩いてみましょう。";
const MACHIYA_TO =
  "令和3年(2021)、国の重要伝統的建造物群保存地区に選定されました。今も人が暮らしている町なので、静かに歩きましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e0181f83%'`);
  const itinId = rows[0].id;
  const kiyomori = await findSpotInItinerary(itinId, { spotName: "清盛神社" });
  const tahoto = await findSpotInItinerary(itinId, { spotName: "多宝塔" });
  const sangyo = await findSpotInItinerary(itinId, { spotName: "宮島伝統産業会館" });
  const machiya = await findSpotInItinerary(itinId, { spotName: "町家通り" });

  if (kiyomori.memo !== KIYOMORI_FROM) throw new Error("清盛神社の文言が想定外です");
  if (tahoto.memo !== TAHOTO_FROM) throw new Error("多宝塔の文言が想定外です");
  if (!sangyo.memo?.includes(SANGYO_FROM)) throw new Error("産業会館の文言が想定外です");
  if (!machiya.memo?.includes(MACHIYA_FROM)) throw new Error("町家通りの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: kiyomori.id }, data: { memo: KIYOMORI_TO } }),
    prisma.spot.update({ where: { id: tahoto.id }, data: { memo: TAHOTO_TO } }),
    prisma.spot.update({ where: { id: sangyo.id }, data: { memo: sangyo.memo!.replace(SANGYO_FROM, SANGYO_TO) } }),
    prisma.spot.update({ where: { id: machiya.id }, data: { memo: machiya.memo!.replace(MACHIYA_FROM, MACHIYA_TO) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
