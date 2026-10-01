/**
 * #111 76714b9fの直し(6回目)。法務(14:54)の指摘のうち、①魚志楼・④雄島の
 * 言い切りは、直前のfix-111eですでに対応済み。残り4点に対応する。
 * ②あわら湯のまち広場の座標をOSM node 5598772146に修正
 * ③雄島の座標をOSM relation 8273220の中心(36.2517537, 136.1190402)に修正
 * ⑤安全の一文: 雄島(岩場・海辺)、越前松島(岩場・海食洞・石橋)、
 *   丸岡城(天守の急な階段)に追加
 * ⑥あわら湯のまち広場(足湯)に「ほかの人を撮らない・長く浸かりすぎない」
 *   の一文を追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const OSHIMA_FROM = "今も参拝の対象となっている神域ですので、静かに、敬意をもって島内を歩きましょう。";
const OSHIMA_TO = "今も参拝の対象となっている神域ですので、静かに、敬意をもって島内を歩きましょう。岩場や海沿いの道もあるので、足元に注意してください。";

const MATSUSHIMA_FROM = "さまざまな奇岩・景観を間近に歩いて楽しめます。";
const MATSUSHIMA_TO = "さまざまな奇岩・景観を間近に歩いて楽しめます。岩場や石橋は濡れていると滑りやすいので、足元に注意しながら歩きましょう。";

const MARUOKAJO_FROM = "独立式望楼型2重3階の天守からは、坂井平野ののどかな景色を見渡せます。";
const MARUOKAJO_TO = "独立式望楼型2重3階の天守からは、坂井平野ののどかな景色を見渡せます。天守内の階段は急で、当時のままの造りなので、手すりを使って慎重に上り下りしましょう。";

const YUNOMACHI_FROM = "総ひのき造りの足湯「芦湯」があり、2種類の源泉をかけ流しで楽しめます。";
const YUNOMACHI_TO = "総ひのき造りの足湯「芦湯」があり、2種類の源泉をかけ流しで楽しめます。足湯では、ほかの利用者が写り込まないように気をつけ、長く浸かりすぎないようにしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '76714b9f%'`);
  const itinId = rows[0].id;
  const oshima = await findSpotInItinerary(itinId, { spotName: "雄島" });
  const matsushima = await findSpotInItinerary(itinId, { spotName: "越前松島" });
  const maruokajo = await findSpotInItinerary(itinId, { spotName: "丸岡城" });
  const yunomachi = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });

  for (const [name, spot, from] of [
    ["雄島", oshima, OSHIMA_FROM],
    ["越前松島", matsushima, MATSUSHIMA_FROM],
    ["丸岡城", maruokajo, MARUOKAJO_FROM],
    ["あわら湯のまち広場", yunomachi, YUNOMACHI_FROM],
  ] as const) {
    if (!spot.memo!.includes(from)) throw new Error(`${name}の文言が想定外です`);
  }
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: oshima.id }, {
    memo: oshima.memo!.replace(OSHIMA_FROM, OSHIMA_TO),
    lat: 36.2517537,
    lng: 136.1190402,
  });
  await updateSpotInItinerary(itinId, { spotId: matsushima.id }, { memo: matsushima.memo!.replace(MATSUSHIMA_FROM, MATSUSHIMA_TO) });
  await updateSpotInItinerary(itinId, { spotId: maruokajo.id }, { memo: maruokajo.memo!.replace(MARUOKAJO_FROM, MARUOKAJO_TO) });
  await updateSpotInItinerary(itinId, { spotId: yunomachi.id }, {
    memo: yunomachi.memo!.replace(YUNOMACHI_FROM, YUNOMACHI_TO),
    lat: 36.2238433,
    lng: 136.1928361,
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
