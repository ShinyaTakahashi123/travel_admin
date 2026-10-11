/**
 * #10 54f0fa20の直し(5回目)。企画運営(2026-10-11)の指摘。
 *
 * 1. 口調: 既存の文も含め、案内役の言い方(ぜひ・〜てください・おすすめです・
 *    よいでしょう)をサイト標準(〜しましょう)に統一。
 * 2. 姫路市立動物園の「象」: 姫路市公式の報道で、2代目「姫子」が
 *    2020年10月24日に死んで以来、象は不在(後継の確保が困難で、
 *    特別史跡内のため施設拡張が難しく、2029年度めどに移転を検討中。
 *    神戸新聞 kobe-np.co.jp/news/sougou/202207/sp/0015443325.shtml で
 *    確認)。象の記述を外し、実際にいる動物(キリン・ライオンなど)に
 *    差し替え。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const HIMEJIJO_FROM = "お出かけ前に公式サイトで確認してください。";
const HIMEJIJO_TO = "お出かけ前に公式サイトで確かめましょう。";

const KOKOEN_FROM = "庭園を眺めながら昼食をとるのもおすすめです。";
const KOKOEN_TO = "庭園を眺めながら昼食をとることもできます。";

const ZOO_FROM = "象やキリンといった定番の動物から、ふれあい広場での小動物との触れ合いまで楽しめます。";
const ZOO_TO = "キリンやライオンといった定番の動物から、ふれあい広場での小動物との触れ合いまで楽しめます。";

const BUNGAKUKAN_FROM = "姫路の旅1日目の締めくくりに、静かな時間を過ごしてください。";
const BUNGAKUKAN_TO = "姫路の旅1日目の締めくくりに、静かな時間を過ごしましょう。";

const KAIZANDO_FROM = "今にも軒を持ち上げそうな力士の姿を、ぜひ間近で見上げてみてください。";
const KAIZANDO_TO = "今にも軒を持ち上げそうな力士の姿を、間近で見上げてみましょう。";

const ROPEWAY_FROM = "軽食をとったり、土産物を眺めたりするのもよいでしょう。";
const ROPEWAY_TO = "軽食をとったり、土産物を眺めたりしましょう。";

const HEIWAKOEN_FROM = "緑豊かな公園を、姫路の旅2日間の締めくくりに、静かに歩いてみてください。";
const HEIWAKOEN_TO = "緑豊かな公園を、姫路の旅2日間の締めくくりに、静かに歩いてみましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;

  const himejijo = await findSpotInItinerary(itinId, { spotName: "姫路城" });
  const kokoen = await findSpotInItinerary(itinId, { spotName: "好古園" });
  const zoo = await findSpotInItinerary(itinId, { spotName: "姫路市立動物園" });
  const bungakukan = await findSpotInItinerary(itinId, { spotName: "姫路文学館" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });
  const heiwakoen = await findSpotInItinerary(itinId, { spotName: "手柄山平和公園" });
  const ropewaySecond = await prisma.spot.findFirst({
    where: { day: { itineraryId: itinId }, name: "書写山ロープウェイ山麓駅", memo: { contains: ROPEWAY_FROM } },
  });

  if (!himejijo.memo?.includes(HIMEJIJO_FROM)) throw new Error("姫路城の文言が想定外です");
  if (!kokoen.memo?.includes(KOKOEN_FROM)) throw new Error("好古園の文言が想定外です");
  if (!zoo.memo?.includes(ZOO_FROM)) throw new Error("動物園の文言が想定外です");
  if (!bungakukan.memo?.includes(BUNGAKUKAN_FROM)) throw new Error("文学館の文言が想定外です");
  if (!kaizando.memo?.includes(KAIZANDO_FROM)) throw new Error("開山堂の文言が想定外です");
  if (!heiwakoen.memo?.includes(HEIWAKOEN_FROM)) throw new Error("手柄山平和公園の文言が想定外です");
  if (!ropewaySecond) throw new Error("ロープウェイ山麓駅(2回目)の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: himejijo.id }, { memo: himejijo.memo!.replace(HIMEJIJO_FROM, HIMEJIJO_TO) });
  await updateSpotInItinerary(itinId, { spotId: kokoen.id }, { memo: kokoen.memo!.replace(KOKOEN_FROM, KOKOEN_TO) });
  await updateSpotInItinerary(itinId, { spotId: zoo.id }, { memo: zoo.memo!.replace(ZOO_FROM, ZOO_TO) });
  await updateSpotInItinerary(itinId, { spotId: bungakukan.id }, { memo: bungakukan.memo!.replace(BUNGAKUKAN_FROM, BUNGAKUKAN_TO) });
  await updateSpotInItinerary(itinId, { spotId: kaizando.id }, { memo: kaizando.memo!.replace(KAIZANDO_FROM, KAIZANDO_TO) });
  await updateSpotInItinerary(itinId, { spotId: heiwakoen.id }, { memo: heiwakoen.memo!.replace(HEIWAKOEN_FROM, HEIWAKOEN_TO) });
  await prisma.spot.update({ where: { id: ropewaySecond.id }, data: { memo: ropewaySecond.memo!.replace(ROPEWAY_FROM, ROPEWAY_TO) } });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
