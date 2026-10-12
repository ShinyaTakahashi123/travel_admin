/**
 * #346の続き。法務11:43の指摘2点+できれば1点に対応。
 * 1) 陣馬の滝「マイナスイオンを浴びながら」(効能の言い方)を外す。
 * 2) 陣馬の滝(水遊び)・白糸の滝(水しぶき)に、足元の安全の一言を追加。
 *    陣馬の滝には子どもから目を離さない旨も追加。
 * 3) (できれば)白糸の滝(富士講の霊場)に、静かに味わう一言を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-346c-aea12c13.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "aea12c13-249f-43de-9ed7-e36492da4f64";

async function main() {
  const jinba = await prisma.spot.findFirstOrThrow({ where: { name: "陣馬の滝", day: { itineraryId: ITIN_ID } } });
  const shiraito = await prisma.spot.findFirstOrThrow({ where: { name: "白糸の滝", day: { itineraryId: ITIN_ID } } });

  const jinbaOld =
    "夏には水遊びを楽しむ人の姿も見られる、知る人ぞ知る清流のスポットです。マイナスイオンを浴びながら、富士山の恵みの水が流れ落ちる涼やかな景色を楽しみましょう。";
  const jinbaNext =
    "夏には水遊びを楽しむ人の姿も見られる、知る人ぞ知る清流のスポットです。滝のまわりの岩は濡れて滑りやすいので足元に気をつけ、水遊びをするときは子どもから目を離さないようにしましょう。富士山の恵みの水が流れ落ちる涼やかな景色を楽しみましょう。";
  if (!jinba.memo?.includes(jinbaOld)) throw new Error("jinba anchor not found");

  const shiraitoOld = "水しぶきを浴びながら、富士山の恵みが生み出す清らかな水の景色を眺めてみましょう。";
  const shiraitoNext =
    "滝のまわりの岩は濡れて滑りやすいので、足元に気をつけましょう。富士講の信者たちが祈りを捧げた霊場でもありますので、静かに景色を味わいましょう。";
  if (!shiraito.memo?.includes(shiraitoOld)) throw new Error("shiraito anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: jinba.id }, { memo: jinba.memo.replace(jinbaOld, jinbaNext) });
  console.log("jinba: effectiveness claim removed, safety line added");

  await updateSpotInItinerary(ITIN_ID, { spotId: shiraito.id }, { memo: shiraito.memo.replace(shiraitoOld, shiraitoNext) });
  console.log("shiraito: safety + quiet-reverence line added");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
