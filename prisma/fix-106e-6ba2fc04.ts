/**
 * #106 6ba2fc04の直し(3回目)。企画運営(2026-10-01 13:38)・法務
 * (2026-10-01 13:39)の指摘。
 *
 * 1. 加悦椿文化資料館(企画運営の再指摘): 「奥滝」も大字の中心と同種の
 *    扱いで、施設から0.74km離れており使えないとのこと。OSM・GSIとも
 *    この施設の番地レベルの点は得られなかったため、スポット自体を
 *    外し、実在の別の行き先に差し替えた。ちりめん街道のすぐそば
 *    (加悦駅舎から徒歩圏内)にOSM生APIで実在が確認できる「ちりめん
 *    織機展示・実演場」(35.5054558,135.0924815)を採用。
 * 2・3. 法務①③: 伊根の舟屋・ちりめん街道(ともに今も人が暮らす重要
 *    伝統的建造物群保存地区)に、住む人への一文を追加。伊根の舟屋は
 *    #78 c5aee4dbで法務確認済みの文言をそのまま使用。
 * 4. 法務②: 伊根の舟屋「漁村としては全国で初めて」→「全国で初めて
 *    とされる」
 * 5. 法務④: 加悦椿文化資料館の座標問題は3で解消(スポット自体を
 *    差し替えたため)。
 * 6. 法務⑤: 傘松公園の座標(35.5869,135.1947、丸めた値)を、OSM生API
 *    で確認した実在の点(35.5863367,135.1959354)に修正。
 * 7. 法務(できれば): 丹後由良の写真が、sourceUrl確認の結果、浜ではなく
 *    丹後由良駅の写真(File:Tango-Yura,_Kitakinki_Tango_Railway,
 *    _20080815.jpg)だったため削除(代わりの写真はWebSearchで見つから
 *    ず、浜の写真は今回見送り)。
 * あわせて、ちりめん街道の結び「お戻りください」(案内口調)も直した。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INE_FROM = "現在も約230軒の舟屋が軒を連ね、2005年には漁村としては全国で初めて、国の重要伝統的建造物群保存地区に選定されました。";
const INE_TO = "現在も約230軒の舟屋が軒を連ね、2005年には漁村としては全国で初めてとされる国の重要伝統的建造物群保存地区に選定されました。舟屋は今も人が暮らす住まいです。敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。";

const CHIRIMEN_FROM1 = "重要伝統的建造物群保存地区に指定された通りを歩きながら、ちりめん産業で栄えた町の面影を感じてみましょう。日本三景・天橋立を股のぞきで楽しむ丹後さんぽはこれで終わりです。帰りは、与謝野町内から、京都丹後鉄道の最寄り駅方面へお戻りください。";
const CHIRIMEN_TO1 = "重要伝統的建造物群保存地区に指定された通りを歩きながら、ちりめん産業で栄えた町の面影を感じてみましょう。今も人が暮らす町並みですので、家の敷地に入らず、静かに歩きましょう。日本三景・天橋立を股のぞきで楽しむ丹後さんぽはこれで終わりです。帰りは、与謝野町内の京都丹後鉄道の最寄り駅まで車で戻りましょう。";

const ORIMAKI_MEMO =
  "天橋立から車でおよそ25分、ちりめん織機展示・実演場に着きます。丹後ちりめんを織るための織機が展示され、実際の製織作業を見学できる施設です。ちりめん街道の一角にあり、丹後ちりめんが地域の基幹産業として栄えてきた歴史を、実際の道具を通して感じることができます。この後は、歩いておよそ4分、旧加悦鉄道加悦駅舎(加悦鉄道資料館)へ向かいましょう。";

const KAYAEKISHA_FROM = "加悦椿文化資料館から車でおよそ10分、旧加悦鉄道加悦駅舎(加悦鉄道資料館)に着きます。";
const KAYAEKISHA_TO = "ちりめん織機展示・実演場から歩いておよそ4分、旧加悦鉄道加悦駅舎(加悦鉄道資料館)に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const kasamatsu = await findSpotInItinerary(itinId, { spotName: "傘松公園" });
  const ine = await findSpotInItinerary(itinId, { spotName: "伊根の舟屋" });
  const yura = await findSpotInItinerary(itinId, { spotName: "丹後由良" });
  const amanohashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  const tsubaki = await findSpotInItinerary(itinId, { spotName: "加悦椿文化資料館" });
  const kayaekisha = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });
  const yuraPhoto = await prisma.photo.findFirst({ where: { spotId: yura.id } });

  if (!ine.memo!.includes(INE_FROM)) throw new Error("伊根の舟屋の文言が想定外です");
  if (!chirimen.memo!.includes(CHIRIMEN_FROM1)) throw new Error("ちりめん街道の文言が想定外です");
  if (!kayaekisha.memo!.includes(KAYAEKISHA_FROM)) throw new Error("加悦駅舎の文言が想定外です");
  if (!yuraPhoto || !yuraPhoto.sourceUrl?.includes("Tango-Yura")) throw new Error("丹後由良の写真の情報が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: kasamatsu.id, data: { lat: 35.5863367, lng: 135.1959354 } },
    { id: ine.id, data: { memo: ine.memo!.replace(INE_FROM, INE_TO) } },
    { id: yura.id, data: {} },
    { id: amanohashidate.id, data: {} },
    {
      create: {
        name: "ちりめん織機展示・実演場",
        address: "京都府与謝郡与謝野町加悦",
        lat: 35.5054558,
        lng: 135.0924815,
        memo: ORIMAKI_MEMO,
        visitTime: t(14, 29),
        stayDurationMin: 47,
        transitMode: "car",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
    { id: kayaekisha.id, data: { memo: kayaekisha.memo!.replace(KAYAEKISHA_FROM, KAYAEKISHA_TO), visitTime: t(15, 20), transitMode: "walk", transitDurationMin: 4 } },
    { id: chirimen.id, data: { memo: chirimen.memo!.replace(CHIRIMEN_FROM1, CHIRIMEN_TO1), visitTime: t(16, 0) } },
  ];

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx, remove: [tsubaki.id] });
    await tx.photo.delete({ where: { id: yuraPhoto.id } });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
