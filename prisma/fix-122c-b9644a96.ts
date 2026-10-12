/**
 * #122 b9644a96の直し(3回目)。企画運営・法務(2026-10-11、法務記録f1b7b8b)の
 * 指摘を反映。
 *
 * 企画運営: 兼六園「中心の柱から数百本ともいわれる縄が放射状に張られ」は、
 * ぼかしても確かめられない数を書いていることに変わりないとの指摘。出典
 * (石川県公式・Wikipedia)でも本数が確認できなかったため、数を書かずに
 * 「中心の柱から縄が放射状に張られ」とする。
 *
 * 法務①: 主計町茶屋街・ひがし茶屋街は、今も人が暮らし茶屋が営まれている
 * 重伝建の町並みのため、敷地に入らない・住む人やお座敷へ向かう人を撮らない
 * 旨の一文を追加(#489と同じ扱い)。
 * 法務②座標: 兼六園は丸めた度分秒の値だったため、OSM way 50288147の中心
 * (36.562427, 136.662355)に。ひがし茶屋街もnode 2146147848「ひがし茶屋街」
 * (36.572556, 136.666676、約45mのずれ)に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KENROKUEN_FROM = "中心の柱から数百本ともいわれる縄が放射状に張られ、";
const KENROKUEN_TO = "中心の柱から縄が放射状に張られ、";

const KAZUEMACHI_FROM = "雪景色の石畳は、特に趣深い眺めです。";
const KAZUEMACHI_TO =
  "雪景色の石畳は、特に趣深い眺めです。今も人が暮らし、茶屋が営まれている町並みなので、家や茶屋の敷地には入らず、住む人やお座敷へ向かう人を撮ったりしないようにしましょう。";

const HIGASHI_FROM = "足元が滑りやすくなっていることもありますので、雪の日は歩きやすい靴で気をつけましょう。";
const HIGASHI_TO =
  "足元が滑りやすくなっていることもありますので、雪の日は歩きやすい靴で気をつけましょう。今も人が暮らし、茶屋が営まれている町並みなので、家や茶屋の敷地には入らず、住む人やお座敷へ向かう人を撮ったりしないようにしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b9644a96%'`);
  const itinId = rows[0].id;
  const kenrokuen = await findSpotInItinerary(itinId, { spotName: "兼六園" });
  const kazuemachi = await findSpotInItinerary(itinId, { spotName: "主計町茶屋街" });
  const higashi = await findSpotInItinerary(itinId, { spotName: "ひがし茶屋街" });

  if (!kenrokuen.memo?.includes(KENROKUEN_FROM)) throw new Error("兼六園の文言が想定外です");
  if (!kazuemachi.memo?.includes(KAZUEMACHI_FROM)) throw new Error("主計町茶屋街の文言が想定外です");
  if (!higashi.memo?.includes(HIGASHI_FROM)) throw new Error("ひがし茶屋街の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kenrokuen.id }, {
    memo: kenrokuen.memo!.replace(KENROKUEN_FROM, KENROKUEN_TO),
    lat: 36.562427,
    lng: 136.662355,
  });
  await updateSpotInItinerary(itinId, { spotId: kazuemachi.id }, { memo: kazuemachi.memo!.replace(KAZUEMACHI_FROM, KAZUEMACHI_TO) });
  await updateSpotInItinerary(itinId, { spotId: higashi.id }, {
    memo: higashi.memo!.replace(HIGASHI_FROM, HIGASHI_TO),
    lat: 36.572556,
    lng: 136.666676,
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
