/**
 * #26(258b3878)の滞在の水増し解消(企画運営指摘、2026-10-13)。つづら棚田と
 * 新川田篭の町並み(127分)を短縮し、空いた時間にうきは市吉井町の実在の行き先
 * 「水神社」を追加する。水神社は居蔵の館のすぐそば(約280m)にある、天保13年
 * (1842)建立の小さな神社(出典: OSM way 1214002950、Wikidata Q141717088。
 * 座標は一致を確認)。居蔵の館(1番目)の次、調音の滝公園の前に挿入する。
 * つづら棚田と新川田篭の町並みは127分→108分(2つの内容を見るための時間は
 * 残しつつ、新しい行き先の分を差し引く)。9:30〜16:30は変わらず。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "258b3878-0458-417b-be90-76bd7b12ed23";
const DAY_ID = "49402151-658e-46b0-8e52-ece5a1098171";

const CHOON_ID = "9601df4c-92f0-485f-ba10-1d919a8e3e37";
const EKI_UKIHA_ID = "5bda41e2-6fbd-4ca9-9dcf-48e08ce2e203";
const SHUNKOEN_ID = "cdbfeb40-0555-4632-ba5d-ef5220a7fe3f";
const TSUZURA_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";

const CHOON_LEG_ID = "7e30aefd-bdb2-45ab-9a75-d1343535db0d"; // 居蔵の館→調音の滝公園(直す)

const OLD_DESC =
  "商家建築「居蔵の館」と調音の滝公園から、地元の果物が並ぶ道の駅うきは、ぶどう・なし狩りの春光園、日本棚田百選のつづら棚田と重要伝統的建造物群保存地区・新川田篭の集落まで、実りの季節のうきはを楽しむ日帰りプランです。";
const NEW_DESC =
  "商家建築「居蔵の館」や水神社のある吉井の町並み、調音の滝公園から、地元の果物が並ぶ道の駅うきは、ぶどう・なし狩りの春光園、日本棚田百選のつづら棚田と重要伝統的建造物群保存地区・新川田篭の集落まで、実りの季節のうきはを楽しむ日帰りプランです。";

const MIZUJINJA_NAME = "水神社";
const MIZUJINJA_LAT = 33.3448811;
const MIZUJINJA_LNG = 130.7567534;
const MIZUJINJA_MEMO =
  "吉井の町並みの一角に鎮座する、天保13年(1842)建立の小さな神社です。地域の水を見守る神様として、今も大切にされています。静かに、敬意を込めて手を合わせましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("説明文が想定と違います");

  const choon = await prisma.spot.findUnique({ where: { id: CHOON_ID } });
  const ekiUkiha = await prisma.spot.findUnique({ where: { id: EKI_UKIHA_ID } });
  const shunkoen = await prisma.spot.findUnique({ where: { id: SHUNKOEN_ID } });
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_ID } });
  if (!choon || !ekiUkiha || !shunkoen || !tsuzura) throw new Error("想定と違います");

  console.log("[確認OK] 説明文を書きかえ(水神社を追加)");
  console.log("[確認OK] 水神社を追加: orderNo2、座標", MIZUJINJA_LAT, MIZUJINJA_LNG);
  console.log("[確認OK] 調音の滝公園のorderNo: 2→3、visitTime→10:53、leg(水神社→)13分");
  console.log("[確認OK] 道の駅うきは（昼食）のorderNo: 3→4、visitTime→11:53");
  console.log("[確認OK] 春光園のorderNo: 4→5、visitTime→12:56");
  console.log("[確認OK] つづら棚田と新川田篭の町並みのorderNo: 5→6、visitTime→14:42、滞在", tsuzura.stayDurationMin, "→108分");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });

  // orderNoの衝突を避けるため、先に大きな値へ退避
  await prisma.spot.update({ where: { id: CHOON_ID }, data: { orderNo: 92 } });
  await prisma.spot.update({ where: { id: EKI_UKIHA_ID }, data: { orderNo: 93 } });
  await prisma.spot.update({ where: { id: SHUNKOEN_ID }, data: { orderNo: 94 } });
  await prisma.spot.update({ where: { id: TSUZURA_ID }, data: { orderNo: 95 } });

  const place = await prisma.placeMaster.create({
    data: { name: MIZUJINJA_NAME, lat: MIZUJINJA_LAT, lng: MIZUJINJA_LNG, positionSource: "osm", source: "ai_collected" },
  });
  const mizujinja = await prisma.spot.create({
    data: {
      dayId: DAY_ID,
      placeMasterId: place.id,
      orderNo: 2,
      name: MIZUJINJA_NAME,
      lat: MIZUJINJA_LAT,
      lng: MIZUJINJA_LNG,
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 25)),
      memo: MIZUJINJA_MEMO,
      stayDurationMin: 15,
    },
  });
  await prisma.spotTransitLeg.create({
    data: { spotId: mizujinja.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 },
  });

  // 調音の滝公園のleg(もと居蔵の館→調音の滝公園)を水神社→調音の滝公園に変更
  await prisma.spotTransitLeg.update({ where: { id: CHOON_LEG_ID }, data: { transitDurationMin: 13 } });

  await prisma.spot.update({ where: { id: CHOON_ID }, data: { orderNo: 3, visitTime: new Date(Date.UTC(1970, 0, 1, 10, 53)) } });
  await prisma.spot.update({ where: { id: EKI_UKIHA_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 11, 53)) } });
  await prisma.spot.update({ where: { id: SHUNKOEN_ID }, data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 56)) } });
  await prisma.spot.update({
    where: { id: TSUZURA_ID },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 42)), stayDurationMin: 108 },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
