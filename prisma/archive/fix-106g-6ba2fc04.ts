/**
 * #106 6ba2fc04の直し(5回目)。企画運営(2026-10-01 13:49)の指摘2点。
 * 1. 伊根の舟屋(10:15〜11:08)の昼食は11:30より前になるため不可。
 *    丹後由良の昼食がなくなった分の62分も、浜と物語を見るだけなら
 *    水増しのため30分に戻す。昼食は、食事処が多い天橋立(文珠地区)に
 *    移した(伊根の舟屋の昼食の一文は削除)。
 * 2. ちりめん街道の30→37分(前回の縮めた分を他へ回す対応)は決まりAに
 *    反するため30分に戻した。
 * 1・2で早まった終わりの分(およそ39分)を埋めるため、実在の新しい
 * 行き先・智恩寺(天橋山智恩寺、通称「切戸の文殊」、日本三文殊の
 * ひとつ、大同3年808勅願・延喜4年904寺号下賜、本尊は重要文化財の
 * 秘仏文殊菩薩、多宝塔は室町期建立の重要文化財)を天橋立の南側
 * (文珠地区)に追加した。Nominatimで実在の点を確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INE_FROM = "敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。舟屋を改装した食事処も点在しているので、ここで昼食にしましょう。";
const INE_TO = "敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。";

const YURA_CHECK = "浜の西側には、幼い安寿が来る日も来る日も海水を汲んで運ばされたという「汐汲浜」が今も残り、物語の悲しい記憶をとどめています。この後は、車でおよそ15分、天橋立へ向かいましょう。";

const HASHIDATE_FROM = "砂州の中ほどまで歩き、股の間から振り返ると、天と海が入れ替わって見える不思議な眺めを味わえます。この後は、車でおよそ25分、ちりめん織機展示・実演場へ向かいましょう。";
const HASHIDATE_TO = "砂州の中ほどまで歩き、股の間から振り返ると、天と海が入れ替わって見える不思議な眺めを味わえます。南側の文珠地区には食事処が多く並んでいるので、ここで昼食にしましょう。この後は、歩いておよそ10分、智恩寺へ向かいましょう。";

const CHIONJI_MEMO =
  "天橋立から歩いておよそ10分、文珠地区にある智恩寺に着きます。「切戸の文殊」とも呼ばれ、奈良・安倍文殊院、山形・大聖寺とともに日本三文殊のひとつに数えられる寺です。伝承によれば大同3年(808)、平城天皇の勅願によって開かれ、延喜4年(904)に醍醐天皇から「天橋山智恩寺」の寺号を賜ったと伝えられています。本堂には、知恵を授ける文殊菩薩として知られる秘仏(国の重要文化財)が安置され、境内の多宝塔も室町時代に建てられた国の重要文化財です。参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ20分、ちりめん織機展示・実演場へ向かいましょう。";

const ORIMAKI_FROM_OPEN = "天橋立から車でおよそ25分、ちりめん織機展示・実演場に着きます。";
const ORIMAKI_TO_OPEN = "智恩寺から車でおよそ20分、ちりめん織機展示・実演場に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const kasamatsu = await findSpotInItinerary(itinId, { spotName: "傘松公園" });
  const ine = await findSpotInItinerary(itinId, { spotName: "伊根の舟屋" });
  const yura = await findSpotInItinerary(itinId, { spotName: "丹後由良" });
  const hashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  const orimaki = await findSpotInItinerary(itinId, { spotName: "ちりめん織機展示・実演場" });
  const kayaekisha = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });

  if (!ine.memo!.includes(INE_FROM)) throw new Error("伊根の舟屋の文言が想定外です");
  if (!yura.memo!.includes(YURA_CHECK)) throw new Error("丹後由良の文言が想定外です");
  if (!hashidate.memo!.includes(HASHIDATE_FROM)) throw new Error("天橋立の文言が想定外です");
  if (!orimaki.memo!.includes(ORIMAKI_FROM_OPEN)) throw new Error("織機展示の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: kasamatsu.id, data: {} },
    { id: ine.id, data: { memo: ine.memo!.replace(INE_FROM, INE_TO) } },
    { id: yura.id, data: { stayDurationMin: 30 } },
    { id: hashidate.id, data: { memo: hashidate.memo!.replace(HASHIDATE_FROM, HASHIDATE_TO), visitTime: t(12, 13) } },
    {
      create: {
        name: "智恩寺",
        address: "京都府宮津市字文珠466",
        lat: 35.5578771,
        lng: 135.1845313,
        memo: CHIONJI_MEMO,
        visitTime: t(13, 42),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    { id: orimaki.id, data: { memo: orimaki.memo!.replace(ORIMAKI_FROM_OPEN, ORIMAKI_TO_OPEN), visitTime: t(14, 37), transitMode: "car", transitDurationMin: 20 } },
    { id: kayaekisha.id, data: { visitTime: t(15, 21) } },
    { id: chirimen.id, data: { stayDurationMin: 30, visitTime: t(16, 1) } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
