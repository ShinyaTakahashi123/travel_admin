/**
 * 企画運営2026-10-01 06:58の依頼。#258(19410204)・#262(1d72e477)・
 * #284(3bf609b2)に残っていた「パワースポット」を外す(法務指摘の書かない決まり)。
 * #251と同じ扱い。口調のみの直しのため法務の確認は不要。
 *
 * #258 押戸石の丘: 「パワースポットとして人気を集めています。」を削除
 * #262 青島: 「パワースポット」→「景勝地」
 * #284 タイトル: 「隠れたパワースポットを巡るプラン」→中身(縁結び・史跡)に合う形に変更
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-tone-powerspot-258-262-284.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ID_258 = "19410204-ff2e-4b5c-a3e6-dd0e7d9035d3";
const ID_262 = "1d72e477-16dd-49d7-92eb-89483314ab19";
const ID_284 = "3bf609b2-ae6f-44ac-8c77-801dc4c56157";

const NEW_TITLE_284 = "竈門神社と光明禅寺、太宰府の縁結びと史跡を巡るプラン";

async function main() {
  const oshidoishi = await prisma.spot.findFirstOrThrow({ where: { name: "押戸石の丘", day: { itineraryId: ID_258 } } });
  const old258 = "古代の祈りの場だったとも伝えられる不思議な石群が点在し、パワースポットとして人気を集めています。";
  const next258 = "古代の祈りの場だったとも伝えられる不思議な石群が点在しています。";
  if (!oshidoishi.memo?.includes(old258)) {
    console.log("258 already fixed");
  } else {
    await updateSpotInItinerary(ID_258, { spotId: oshidoishi.id }, { memo: oshidoishi.memo.replace(old258, next258) });
    console.log("258 fixed");
  }

  const aoshima = await prisma.spot.findFirstOrThrow({ where: { name: "青島", day: { itineraryId: ID_262 } } });
  const old262 = "本日は、宮崎を代表するパワースポット、青島からスタートです。";
  const next262 = "本日は、宮崎を代表する景勝地、青島からスタートです。";
  if (!aoshima.memo?.includes(old262)) {
    console.log("262 already fixed");
  } else {
    await updateSpotInItinerary(ID_262, { spotId: aoshima.id }, { memo: aoshima.memo.replace(old262, next262) });
    console.log("262 fixed");
  }

  const itin284 = await prisma.itinerary.findUniqueOrThrow({ where: { id: ID_284 } });
  if (itin284.title === NEW_TITLE_284) {
    console.log("284 already fixed");
  } else {
    await prisma.itinerary.update({ where: { id: ID_284 }, data: { title: NEW_TITLE_284 } });
    console.log("284 title fixed");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
