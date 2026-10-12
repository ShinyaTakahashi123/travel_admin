/**
 * #119 949c4f43の直し(4回目)。法務(16:23)の指摘のうち3点に対応。
 * ①(別途報告): パレスハウステンボス・ドムトールンの座標は、自分も
 *   OSMで名前の合う点を見つけられなかった。企画運営・法務に相談する
 * ②パレスハウステンボスとドムトールンに同じ写真(塔から見た街並み、
 *   ドムトールンからの眺め)が付いていた。パレスの写真ではないため、
 *   パレスの写真レコードを削除する(URLそのものはドムトールン側で
 *   引き続き使うため、元画像は消さずDBレコードのみ削除)
 * ③森きららの「動物たちとふれあえる体験」に、やさしくふれる・
 *   ふれたあと手を洗うの一文を追加
 * ④九十九島パールシーリゾートの遊覧船に、デッキの手すり・足元の
 *   一文を追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const MORIKIRARA_FROM = "動物たちとふれあえる体験プログラムも充実していて、家族連れにも親しまれています。";
const MORIKIRARA_TO =
  "動物たちとふれあえる体験プログラムも充実していて、家族連れにも親しまれています。ふれあいの際は、動物にやさしく接し、ふれたあとは手を洗うようにしましょう。";

const PEARLSEA_FROM = "白と木目を基調にした優雅な船体で、バリアフリーにも配慮されています。";
const PEARLSEA_TO =
  "白と木目を基調にした優雅な船体で、バリアフリーにも配慮されています。デッキに出るときは、手すりにつかまり、足元に注意しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const morikirara = await findSpotInItinerary(itinId, { spotName: "森きらら" });
  const pearlsea = await findSpotInItinerary(itinId, { spotName: "九十九島パールシーリゾート" });

  const photoRows: any[] = await prisma.$queryRawUnsafe(`select id::text from photo where spot_id=$1`, palace.id);

  if (!morikirara.memo!.includes(MORIKIRARA_FROM)) throw new Error("森きららの文言が想定外です");
  if (!pearlsea.memo!.includes(PEARLSEA_FROM)) throw new Error("九十九島パールシーリゾートの文言が想定外です");
  console.log("確認OK。削除対象の写真レコード数:", photoRows.length);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.photo.deleteMany({ where: { spotId: palace.id } });
  await updateSpotInItinerary(itinId, { spotId: morikirara.id }, { memo: morikirara.memo!.replace(MORIKIRARA_FROM, MORIKIRARA_TO) });
  await updateSpotInItinerary(itinId, { spotId: pearlsea.id }, { memo: pearlsea.memo!.replace(PEARLSEA_FROM, PEARLSEA_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
