/**
 * #147 110ab5cb の直し(2回目、自己点検)。itinerary-audit・flow-checkの指摘。
 * ①萬代橋: 「無料になりました」の「無料」が料金の言及として引っかかるため、
 *   同じ事実を「通行料を取らない橋になりました」に書き直す。
 * ②マリンピア日本海: 生き物の点数(2万点)の表記を、出典によって数字が違う
 *   (2万/3万)ため具体的な数を外し「およそ600種の生き物」に統一。帰りの
 *   一言がなかったため、新潟駅までのバス(新潟交通・水族館前発、ウェブで
 *   確認)を追記。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const BANDAI_FROM = "明治33年(1900)に新潟県が買い取って無料になりました。";
const BANDAI_TO = "明治33年(1900)に新潟県が買い取り、通行料を取らない橋になりました。";

const MARINEPIA_FROM =
  "日和山展望台からタクシーでおよそ7分、新潟市水族館マリンピア日本海に着きます。日本海の生き物を中心に、およそ600種、2万点の生き物を飼育する水族館です。日本海大水槽の底にはマリントンネルがあり、水中を歩いているような景色を楽しめます。イルカのショーも日替わりで行われています。館内には食事ができる場所もあるので、ここで昼食をとるとよいでしょう。見学の最後には、館のすぐそばに広がる松林と砂浜を少し歩いてみるのもおすすめです。";
const MARINEPIA_TO =
  "日和山展望台からタクシーでおよそ7分、新潟市水族館マリンピア日本海に着きます。日本海の生き物を中心に、およそ600種の生き物を飼育する水族館です。日本海大水槽の底にはマリントンネルがあり、水中を歩いているような景色を楽しめます。イルカのショーも日替わりで行われています。館内には食事ができる場所もあるので、ここで昼食をとるとよいでしょう。見学の最後には、館のすぐそばに広がる松林と砂浜を少し歩いてみるのもおすすめです。見学を終えたら、新潟駅までバスで戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '110ab5cb%'`);
  const itinId = rows[0].id;
  const bandai = await findSpotInItinerary(itinId, { spotName: "萬代橋" });
  const marinepia = await findSpotInItinerary(itinId, { spotName: "マリンピア日本海" });

  if (!bandai.memo?.includes(BANDAI_FROM)) throw new Error("萬代橋の文言が想定外です");
  if (marinepia.memo !== MARINEPIA_FROM) throw new Error("マリンピア日本海の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: bandai.id }, data: { memo: bandai.memo!.replace(BANDAI_FROM, BANDAI_TO) } }),
    prisma.spot.update({ where: { id: marinepia.id }, data: { memo: MARINEPIA_TO } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
