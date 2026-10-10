/**
 * #97 3993afce の直し(9回目)。法務(2026-10-01 10:46)・企画運営(2026-10-01 10:49)
 * の指摘:
 * ① 黒壁ガラス館「ガラス工芸の展示・販売館」→「販売」は書かない決まりのため、
 *    「ガラス工芸の展示館」に直す
 * ② 竹生島(宝厳寺・都久夫須麻神社)に、祈りの一文と、急な石段の安全の一文を追加
 * ③ ヤンマーミュージアムから長浜びわこ大仏への移動が、本文(車10分)と
 *    長浜びわこ大仏側の本文・実際のtransit_mode(徒歩12分)で食い違っていた
 *    (fix-97hでびわこ大仏側は直したが、ヤンマーミュージアム側の文言を
 *    直し忘れていた)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const GARASUKAN_FROM = "先ほど歩いてきた明治33年(1900)建築の旧第百三十国立銀行長浜支店を活用した、ガラス工芸の展示・販売館です。";
const GARASUKAN_TO = "先ほど歩いてきた明治33年(1900)建築の旧第百三十国立銀行長浜支店を活用した、ガラス工芸の展示館です。";

const CHIKUBU_FROM = "龍神拝所から鳥居に向かって素焼きの皿を投げる「かわらけ投げ」でも知られています。船を降りてからの上陸時間はおよそ90分で、急な石段を上りながら、湖に浮かぶ島ならではの静けさを味わえます。";
const CHIKUBU_TO = "龍神拝所から鳥居に向かって素焼きの皿を投げる「かわらけ投げ」でも知られています。参拝の際は、敬意を込めて手を合わせましょう。船を降りてからの上陸時間はおよそ90分で、急な石段が続くため、足元に気をつけながら、湖に浮かぶ島ならではの静けさを味わえます。";

const YANMAR_FROM = "この後は、車でおよそ10分、長浜びわこ大仏へ向かいましょう。";
const YANMAR_TO = "この後は、歩いておよそ12分、長浜びわこ大仏へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;

  const garasukan = await findSpotInItinerary(itinId, { spotName: "黒壁ガラス館" });
  const chikubu = await findSpotInItinerary(itinId, { spotName: "竹生島" });
  const yanmar = await findSpotInItinerary(itinId, { spotName: "ヤンマーミュージアム" });

  if (!garasukan.memo!.includes(GARASUKAN_FROM)) throw new Error("黒壁ガラス館の文言が想定外です");
  if (!chikubu.memo!.includes(CHIKUBU_FROM)) throw new Error("竹生島の文言が想定外です");
  if (!yanmar.memo!.includes(YANMAR_FROM)) throw new Error("ヤンマーミュージアムの文言が想定外です");
  console.log("確認OK: 3件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: garasukan.id }, { memo: garasukan.memo!.replace(GARASUKAN_FROM, GARASUKAN_TO) });
  await updateSpotInItinerary(itinId, { spotId: chikubu.id }, { memo: chikubu.memo!.replace(CHIKUBU_FROM, CHIKUBU_TO) });
  await updateSpotInItinerary(itinId, { spotId: yanmar.id }, { memo: yanmar.memo!.replace(YANMAR_FROM, YANMAR_TO) });
  console.log("COMMITTED: 3件");
}
main().finally(() => prisma.$disconnect());
