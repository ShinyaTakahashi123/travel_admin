/**
 * #26(258b3878)の3か所の差し替え・統合(企画運営・法務の判断、2026-10-13)。
 * 1. 吉井歴史民俗資料館 → 居蔵の館(OSM way 1214002192)。うきは市教育委員会
 *    生涯学習課が管理、明治時代の商家建築であることをcrossroadfukuoka.jp/spot/12803
 *    で確認。いちご狩り#5の筑後吉井の白壁の町並みの文章とは別の、建物自体の
 *    由来を書く
 * 2. 弘農園 → 春光園(いちご狩り#5と同じ実点、OSM node 5543219421)に差し替え。
 *    ぶどう(7品種)・なし(5品種)狩りを行っていることをjalan.netの掲載情報で確認
 * 3. つづら棚田・新川田篭の町並みを1つに統合(「つづら棚田と新川田篭の町並み」)。
 *    新川田篭地区にOSM・国土地理院とも番地の手がかりがなく、つづら棚田は同じ
 *    「新川田篭」地区内にあるため、つづら棚田の実点(OSM node 5982047189)に
 *    まとめる
 * あわせて、しおりの題・説明を書きかえ(6か所→5か所)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "258b3878-0458-417b-be90-76bd7b12ed23";
const REKISHI_ID = "ef991f1d-a925-4c5c-b8f4-666fb36fbf2c";
const CHOON_ID = "9601df4c-92f0-485f-ba10-1d919a8e3e37";
const KONOEN_ID = "cdbfeb40-0555-4632-ba5d-ef5220a7fe3f";
const TSUZURA_ID = "3c228fa7-1389-4627-8a91-4c2c0e24ad12";
const TAGORO_ID = "28745320-83ec-4a0f-9808-0190c1c37192";

const OLD_TITLE = "つづら棚田と弘農園のぶどう・なし狩り、道の駅うきはをめぐる日帰りプラン";
const NEW_TITLE = "つづら棚田と春光園のぶどう・なし狩り、道の駅うきはをめぐる日帰りプラン";
const OLD_DESC =
  "吉井歴史民俗資料館と調音の滝公園から、地元の果物が並ぶ道の駅うきは、ぶどう・なし狩りの弘農園、日本棚田百選のつづら棚田、重要伝統的建造物群保存地区・新川田篭の集落まで、実りの季節のうきはを楽しむ日帰りプランです。";
const NEW_DESC =
  "商家建築「居蔵の館」と調音の滝公園から、地元の果物が並ぶ道の駅うきは、ぶどう・なし狩りの春光園、日本棚田百選のつづら棚田と重要伝統的建造物群保存地区・新川田篭の集落まで、実りの季節のうきはを楽しむ日帰りプランです。";

const IGURA_NAME = "居蔵の館";
const IGURA_LAT = 33.3440299;
const IGURA_LNG = 130.7596046;
const IGURA_MEMO =
  "精蝋業で財をなした大地主の分家で、銀行の経営にも携わった商家が暮らした、明治時代の屋敷です。館内では、当時の暮らしぶりを伝える部屋や調度品を見学できます。休館日があるため、訪れる前に公式の案内で確かめましょう。";

const SHUNKOEN_NAME = "春光園";
const SHUNKOEN_LAT = 33.3355378;
const SHUNKOEN_LNG = 130.8313406;
const SHUNKOEN_MEMO =
  "うきは市浮羽町山北にある観光農園で、ぶどう(7品種)となし(5品種)の狩りを楽しめます。ぶどう狩りは7月中旬ごろから9月中旬ごろまで、なし狩りは8月ごろから10月下旬ごろまでが目安です。営業状況は季節により変わるので、園の公式の案内で確かめましょう。";

const TSUZURA_NEW_NAME = "つづら棚田と新川田篭の町並み";
const TSUZURA_NEW_MEMO =
  "うきは市浮羽町の山あいに広がる、約7ヘクタール・およそ300枚の棚田です。石積みの多くは約400年前に積まれたものと伝わり、平成11年(1999)には農林水産省の「日本棚田百選」に選ばれました。田に水が張られる初夏や、稲穂が実る秋など、四季折々の表情が楽しめます。このあたり一帯の「新川田篭」地区は、平成24年(2012)に国の重要伝統的建造物群保存地区に選定されており、井手を利用した稲作が営まれる谷あいの集落に、近世以降の寄棟造の茅葺き主屋や、明治時代以降の入母屋造の瓦葺き主屋が残っています。国の重要文化財に指定された、くど造り民家「平川家住宅」もこの地区にありますが、内部の見学は予約制です。実際に稲作が行われ、今も人が暮らす地域ですので、あぜ道や家の敷地には入らず、道路や見晴らしの良い場所から静かに眺めましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.title !== OLD_TITLE || itin.description !== OLD_DESC) throw new Error("しおりの題・説明が想定と違います");

  const rekishi = await prisma.spot.findUnique({ where: { id: REKISHI_ID } });
  const choon = await prisma.spot.findUnique({ where: { id: CHOON_ID } });
  const konoen = await prisma.spot.findUnique({ where: { id: KONOEN_ID } });
  const tsuzura = await prisma.spot.findUnique({ where: { id: TSUZURA_ID } });
  const tagoro = await prisma.spot.findUnique({ where: { id: TAGORO_ID } });
  if (!rekishi || !choon || !konoen || !tsuzura || !tagoro) throw new Error("想定と違います");

  const legChoon = await prisma.spotTransitLeg.findFirst({ where: { spotId: CHOON_ID } });
  const legKonoen = await prisma.spotTransitLeg.findFirst({ where: { spotId: KONOEN_ID } });
  const legTsuzura = await prisma.spotTransitLeg.findFirst({ where: { spotId: TSUZURA_ID } });
  if (!legChoon || !legKonoen || !legTsuzura) throw new Error("移動データが見つかりません");

  console.log("[確認OK] 題・説明を書きかえ");
  console.log("[確認OK] 吉井歴史民俗資料館→居蔵の館:", rekishi.lat, rekishi.lng, "→", IGURA_LAT, IGURA_LNG);
  console.log("[確認OK] 弘農園→春光園:", konoen.lat, konoen.lng, "→", SHUNKOEN_LAT, SHUNKOEN_LNG);
  console.log("[確認OK] つづら棚田に新川田篭の町並みを統合");
  console.log("[確認OK] leg 居蔵の館→調音の滝公園:", legChoon.transitDurationMin, "→ 14分");
  console.log("[確認OK] leg 道の駅うきは→春光園:", legKonoen.transitDurationMin, "→ 3分");
  console.log("[確認OK] leg 春光園→つづら棚田:", legTsuzura.transitDurationMin, "→ 26分");
  console.log("[確認OK] つづら棚田の滞在:", tsuzura.stayDurationMin, "→ 127分(新川田篭の町並みを削除、9:30〜16:30はそのまま)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: NEW_TITLE, description: NEW_DESC } });

  // 1. 居蔵の館
  if (rekishi.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: rekishi.placeMasterId }, data: { name: IGURA_NAME, lat: IGURA_LAT, lng: IGURA_LNG, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: REKISHI_ID }, data: { name: IGURA_NAME, lat: IGURA_LAT, lng: IGURA_LNG, memo: IGURA_MEMO } });
  await prisma.spotTransitLeg.update({ where: { id: legChoon.id }, data: { transitDurationMin: 14 } });
  await prisma.spot.update({ where: { id: CHOON_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 10, 34)) } });

  // 2. 春光園
  if (konoen.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: konoen.placeMasterId }, data: { name: SHUNKOEN_NAME, lat: SHUNKOEN_LAT, lng: SHUNKOEN_LNG, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: KONOEN_ID }, data: { name: SHUNKOEN_NAME, lat: SHUNKOEN_LAT, lng: SHUNKOEN_LNG, memo: SHUNKOEN_MEMO } });
  await prisma.spotTransitLeg.update({ where: { id: legKonoen.id }, data: { transitDurationMin: 3 } });
  await prisma.spot.update({ where: { id: KONOEN_ID }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 37)) } });

  // 3. つづら棚田に新川田篭の町並みを統合、新川田篭の町並みを削除
  const tagoroPlaceId = tagoro.placeMasterId;
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: TAGORO_ID } });
  await prisma.photo.deleteMany({ where: { spotId: TAGORO_ID } });
  await prisma.spot.delete({ where: { id: TAGORO_ID } });
  if (tagoroPlaceId) {
    const stillUsed = await prisma.spot.findFirst({ where: { placeMasterId: tagoroPlaceId } });
    if (!stillUsed) await prisma.placeMaster.delete({ where: { id: tagoroPlaceId } }).catch(() => {});
  }
  await prisma.spotTransitLeg.update({ where: { id: legTsuzura.id }, data: { transitDurationMin: 26 } });
  await prisma.spot.update({
    where: { id: TSUZURA_ID },
    data: { name: TSUZURA_NEW_NAME, memo: TSUZURA_NEW_MEMO, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 23)), stayDurationMin: 127 },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
