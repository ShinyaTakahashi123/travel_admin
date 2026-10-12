/**
 * #128 c9b3ad40の直し(2回目)。prayer-check.cjsの指摘: 二見興玉神社・外宮・
 * 内宮・猿田彦神社の4か所に、参拝の配慮の一文(判定語「敬意」「手を合わせ」)
 * がなかった。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FUTAMI_FROM = "波打ち際は足元が滑りやすいので、気をつけて歩きましょう。";
const FUTAMI_TO = "波打ち際は足元が滑りやすいので、気をつけて歩きましょう。ほかの参拝者への敬意を持ってお参りしましょう。";

const GEKU_FROM = "御正宮をはじめ、別宮もあわせて参拝しましょう。";
const GEKU_TO = "御正宮をはじめ、別宮もあわせて、敬意を持って参拝しましょう。";

const NAIKU_FROM = "清らかな杜の空気を感じながら正宮まで進み、日頃の感謝を伝える気持ちでお参りしましょう。";
const NAIKU_TO = "清らかな杜の空気を感じながら正宮まで進み、敬意を持ってお参りしましょう。";

const SARUTAHIKO_FROM = "伊勢参りの締めくくりに、これからの道が開けるよう祈りましょう。";
const SARUTAHIKO_TO = "伊勢参りの締めくくりに、敬意を持って手を合わせましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;

  const futami = await findSpotInItinerary(itinId, { spotName: "二見興玉神社" });
  const geku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮外宮" });
  const naiku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮内宮" });
  const sarutahiko = await findSpotInItinerary(itinId, { spotName: "猿田彦神社" });

  if (!futami.memo?.includes(FUTAMI_FROM)) throw new Error("二見興玉神社の文言が想定外です");
  if (!geku.memo?.includes(GEKU_FROM)) throw new Error("外宮の文言が想定外です");
  if (!naiku.memo?.includes(NAIKU_FROM)) throw new Error("内宮の文言が想定外です");
  if (!sarutahiko.memo?.includes(SARUTAHIKO_FROM)) throw new Error("猿田彦神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: futami.id }, { memo: futami.memo!.replace(FUTAMI_FROM, FUTAMI_TO) });
  await updateSpotInItinerary(itinId, { spotId: geku.id }, { memo: geku.memo!.replace(GEKU_FROM, GEKU_TO) });
  await updateSpotInItinerary(itinId, { spotId: naiku.id }, { memo: naiku.memo!.replace(NAIKU_FROM, NAIKU_TO) });
  await updateSpotInItinerary(itinId, { spotId: sarutahiko.id }, { memo: sarutahiko.memo!.replace(SARUTAHIKO_FROM, SARUTAHIKO_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
