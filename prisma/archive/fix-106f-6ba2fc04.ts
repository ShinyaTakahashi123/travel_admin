/**
 * #106 6ba2fc04の直し(4回目)。企画運営(2026-10-01 13:44)・法務
 * (2026-10-01 13:45)の指摘。
 * 1. 天橋立の結び「加悦椿文化資料館へ」→差し替え先「ちりめん織機展示・
 *    実演場」に修正。
 * 2. 傘松公園に朝の行き方(天橋立駅でレンタカー)を追加。伊根の舟屋に
 *    書き出し「傘松公園から車でおよそ30分」を追加。
 * 3. 帰りの「京都丹後鉄道の最寄り駅まで車で戻りましょう」を、2で借りた
 *    天橋立駅で返す形に修正。
 * 4. 丹後由良(OSM生APIで食事処0件と確認)の昼食の一言を外し、食事処が
 *    実在する(OSM生APIで14件確認)伊根の舟屋に移した。
 * 5. ちりめん織機展示・実演場の47分は長めとの指摘。公式の見学目安は
 *    見つからなかったため、小規模な展示・実演施設として40分に縮め、
 *    空いた時間はちりめん街道の滞在(複数の歴史的建造物が並ぶ通りを
 *    実際に歩く長さ、30→37分)で埋めた(新しい行き先の追加ではなく、
 *    既存の滞在を実際の長さに合わせる形)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KASAMATSU_FROM = "天橋立を北側から見下ろす展望公園です。";
const KASAMATSU_TO = "天橋立駅でレンタカーを借り、ケーブルカー・リフト乗り場まで車でおよそ10分、山上へ上がって旅の始まりは傘松公園です。天橋立を北側から見下ろす展望公園です。";

const INE_FROM = "1階が船のガレージ、2階が住居という、全国的にも珍しい建築様式の家並みが海際に立ち並ぶ漁村です。";
const INE_TO = "傘松公園から車でおよそ30分、伊根の舟屋に着きます。1階が船のガレージ、2階が住居という、全国的にも珍しい建築様式の家並みが海際に立ち並ぶ漁村です。";
const INE_FROM2 = "敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。";
const INE_TO2 = "敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。舟屋を改装した食事処も点在しているので、ここで昼食にしましょう。";

const YURA_FROM = "伊根の舟屋から車でおよそ20分、丹後由良に着きます。若狭湾に面したこの浜は、森鷗外の小説『山椒大夫』の舞台とされる地です。人買いにさらわれた姉弟・安寿と厨子王が、この地の長者・山椒大夫のもとで苦役を強いられたという物語が伝わっています。浜の西側には、幼い安寿が来る日も来る日も海水を汲んで運ばされたという「汐汲浜」が今も残り、物語の悲しい記憶をとどめています。ここで昼食にしましょう。この後は、車でおよそ15分、天橋立へ向かいましょう。";
const YURA_TO = "伊根の舟屋から車でおよそ20分、丹後由良に着きます。若狭湾に面したこの浜は、森鷗外の小説『山椒大夫』の舞台とされる地です。人買いにさらわれた姉弟・安寿と厨子王が、この地の長者・山椒大夫のもとで苦役を強いられたという物語が伝わっています。浜の西側には、幼い安寿が来る日も来る日も海水を汲んで運ばされたという「汐汲浜」が今も残り、物語の悲しい記憶をとどめています。この後は、車でおよそ15分、天橋立へ向かいましょう。";

const HASHIDATE_FROM = "この後は、車でおよそ25分、加悦椿文化資料館へ向かいましょう。";
const HASHIDATE_TO = "この後は、車でおよそ25分、ちりめん織機展示・実演場へ向かいましょう。";

const CHIRIMEN_FROM = "帰りは、与謝野町内の京都丹後鉄道の最寄り駅まで車で戻りましょう。";
const CHIRIMEN_TO = "帰りは、天橋立駅まで車で戻り、レンタカーを返却しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;

  const kasamatsu = await findSpotInItinerary(itinId, { spotName: "傘松公園" });
  const ine = await findSpotInItinerary(itinId, { spotName: "伊根の舟屋" });
  const yura = await findSpotInItinerary(itinId, { spotName: "丹後由良" });
  const hashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  const orimaki = await findSpotInItinerary(itinId, { spotName: "ちりめん織機展示・実演場" });
  const kayaekisha = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });

  if (!kasamatsu.memo!.includes(KASAMATSU_FROM)) throw new Error("傘松公園の文言が想定外です");
  if (!ine.memo!.includes(INE_FROM)) throw new Error("伊根の舟屋の文言①が想定外です");
  if (!ine.memo!.includes(INE_FROM2)) throw new Error("伊根の舟屋の文言②が想定外です");
  if (!yura.memo!.includes(YURA_FROM)) throw new Error("丹後由良の文言が想定外です");
  if (!hashidate.memo!.includes(HASHIDATE_FROM)) throw new Error("天橋立の文言が想定外です");
  if (!chirimen.memo!.includes(CHIRIMEN_FROM)) throw new Error("ちりめん街道の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const ineMemo = ine.memo!.replace(INE_FROM, INE_TO).replace(INE_FROM2, INE_TO2);

  await updateSpotInItinerary(itinId, { spotId: kasamatsu.id }, { memo: kasamatsu.memo!.replace(KASAMATSU_FROM, KASAMATSU_TO) });
  await updateSpotInItinerary(itinId, { spotId: ine.id }, { memo: ineMemo });
  await updateSpotInItinerary(itinId, { spotId: yura.id }, { memo: yura.memo!.replace(YURA_FROM, YURA_TO) });
  await updateSpotInItinerary(itinId, { spotId: hashidate.id }, { memo: hashidate.memo!.replace(HASHIDATE_FROM, HASHIDATE_TO) });
  await updateSpotInItinerary(itinId, { spotId: orimaki.id }, { stayDurationMin: 40, visitTime: t(14, 29) });
  await updateSpotInItinerary(itinId, { spotId: kayaekisha.id }, { visitTime: t(15, 13) });
  await updateSpotInItinerary(itinId, { spotId: chirimen.id }, { memo: chirimen.memo!.replace(CHIRIMEN_FROM, CHIRIMEN_TO), stayDurationMin: 37, visitTime: t(15, 53) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
