/**
 * #348の続き。企画運営12:21の指摘対応。中岳火口の座標を「中岳山頂」
 * (OSM peak、131.0970)にしたが、山頂は実際の火口見学場所(展望所・駐車場)
 * から東に約1km離れていて車では行けない。実際に訪れる場所である
 * 「阿蘇山上ターミナル」のOSM実点(bus_station、32.8799877,131.0744910)に
 * 修正する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-348d-aecf9d8c.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "aecf9d8c-3848-46e0-bed7-131c1c98851d";

async function main() {
  const nakadake = await prisma.spot.findFirstOrThrow({ where: { name: "阿蘇山上（中岳火口）", day: { itineraryId: ITIN_ID } } });

  if (nakadake.lat?.toNumber() === 32.8799877) {
    console.log("already fixed, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: nakadake.id },
    data: { lat: 32.8799877, lng: 131.074491 },
  });
  console.log("nakadake coordinates fixed to 阿蘇山上ターミナル (OSM bus_station point)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
