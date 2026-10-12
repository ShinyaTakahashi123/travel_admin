/**
 * #10 54f0fa20の直し(6回目)。企画運営(2026-10-11)の指摘。
 *
 * 1. 好古園120分(決まりA)を90分に短縮。
 * 2. Day2の2回目の「書写山ロープウェイ山麓駅」(12:31〜13:11、40分)は、
 *    下山後に長くいる理由がないため、独立したスポットから外し、開山堂の
 *    結びの一文(ロープウェイ下山+バス待ちの一言)とバスへの移動時間に
 *    まとめた。
 * 3. 空いた時間に実在の行き先を追加: Day1は「日本城郭研究センター」
 *    (姫路市立、姫路城の「昭和の大修理」資料を収蔵する無料の資料館、
 *    姫路城と好古園の間)、Day2は「手柄山温室植物園」(手柄山公園内、
 *    姫路市立の植物園、昭和55年(1980)開園)。いずれも#218・#232とは
 *    重ならない。
 *
 * 座標:
 * - 日本城郭研究センター: 34.835873, 134.687363(国土地理院、姫路市
 *   本町68番地の点、推定)
 * - 手柄山温室植物園: 34.8189133, 134.6754557(OSM node 4825233422)
 *
 * 出典: 日本城郭研究センターは神戸新聞・tabi-mag.jp/hg0336/で、
 * 手柄山温室植物園はtabi-mag.jp/hg0343/・hg0341/で確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HIMEJIJO_FROM = "お出かけ前に公式サイトで確かめましょう。";
const HIMEJIJO_TO = "お出かけ前に公式サイトで確かめましょう。この後は、歩いておよそ10分、日本城郭研究センターへ向かいましょう。";

const JOKAKU_MEMO =
  "姫路城から歩いておよそ10分、日本城郭研究センターに着きます。平成2年(1990)、姫路市制100周年を記念して建てられた、姫路市立の資料館です。姫路城の「昭和の大修理」で出土した瓦や金具などの資料や、城に関する研究報告書を収蔵・展示しています。この後は、歩いておよそ15分、好古園へ向かいましょう。";

const KOKOEN_FROM = "姫路城の南西に隣接する池泉回遊式庭園。";
const KOKOEN_TO = "日本城郭研究センターから歩いておよそ15分、好古園に着きます。姫路城の南西に隣接する池泉回遊式庭園。";

const KAIZANDO_FROM = "この後は、参道を戻ってロープウェイで下山し、山麓駅へ向かいます。";
const KAIZANDO_TO =
  "この後は、参道を戻ってロープウェイで下山しましょう。山麓駅でバスを待つ間、売店で少し休憩できます。そこからバスでおよそ45分、姫路市立水族館へ向かいましょう。";

const SUIZOKUKAN_FROM = "書写山ロープウェイ山麓駅からバスでおよそ30分、姫路市立水族館に着きます。";
const SUIZOKUKAN_TO = "開山堂から、ロープウェイでの下山とバスでおよそ45分、姫路市立水族館に着きます。";
const SUIZOKUKAN_END_FROM = "館内をゆっくりめぐったら、すぐそばの手柄山平和公園へ向かいましょう。";
const SUIZOKUKAN_END_TO = "館内をゆっくりめぐったら、歩いておよそ5分、手柄山温室植物園へ向かいましょう。";

const ONSHITSU_MEMO =
  "姫路市立水族館から歩いておよそ5分、手柄山温室植物園に着きます。昭和55年(1980)に開園した、手柄山公園内にある姫路市立の植物園で、2つの温室を中心に、熱帯・亜熱帯・砂漠の植物、合わせて120科1,500種、25,000点を育てています。大温室にはヤシの仲間や、マンゴーやバナナなどの熱帯の果樹、ラン、食虫植物などが、隣の小温室にはサボテンや多肉植物が並びます。四季折々の花壇やハーブ園、サギソウの栽培温室も見どころです。この後は、歩いておよそ5分、手柄山平和公園へ向かいましょう。";

const HEIWAKOEN_FROM = "水族館から歩いておよそ8分、手柄山平和公園に着きます。";
const HEIWAKOEN_TO = "手柄山温室植物園から歩いておよそ5分、手柄山平和公園に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;

  const otedori = await findSpotInItinerary(itinId, { spotName: "大手前通り" });
  const himejijo = await findSpotInItinerary(itinId, { spotName: "姫路城" });
  const kokoen = await findSpotInItinerary(itinId, { spotName: "好古園" });
  const otokoyama = await findSpotInItinerary(itinId, { spotName: "男山配水池公園" });
  const zoo = await findSpotInItinerary(itinId, { spotName: "姫路市立動物園" });
  const bungakukan = await findSpotInItinerary(itinId, { spotName: "姫路文学館" });

  const ropewayFirst = await prisma.spot.findFirst({
    where: { day: { itineraryId: itinId }, name: "書写山ロープウェイ山麓駅" },
    orderBy: { orderNo: "asc" },
  });
  const ropewaySecond = await prisma.spot.findFirst({
    where: { day: { itineraryId: itinId }, name: "書写山ロープウェイ山麓駅", id: { not: ropewayFirst!.id } },
  });
  const maniden = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });
  const suizokukan = await findSpotInItinerary(itinId, { spotName: "姫路市立水族館" });
  const heiwakoen = await findSpotInItinerary(itinId, { spotName: "手柄山平和公園" });

  if (!himejijo.memo?.includes(HIMEJIJO_FROM)) throw new Error("姫路城の文言が想定外です");
  if (!kokoen.memo?.includes(KOKOEN_FROM)) throw new Error("好古園の文言が想定外です");
  if (!kaizando.memo?.includes(KAIZANDO_FROM)) throw new Error("開山堂の文言が想定外です");
  if (!suizokukan.memo?.includes(SUIZOKUKAN_FROM) || !suizokukan.memo?.includes(SUIZOKUKAN_END_FROM)) throw new Error("水族館の文言が想定外です");
  if (!heiwakoen.memo?.includes(HEIWAKOEN_FROM)) throw new Error("手柄山平和公園の文言が想定外です");

  console.log("確認OK。Day1:", otedori.dayId, " Day2:", maniden.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // Day1
    const items1: SpotOrderItem[] = [
      { id: otedori.id, data: {} },
      { id: himejijo.id, data: { memo: himejijo.memo!.replace(HIMEJIJO_FROM, HIMEJIJO_TO) } },
      {
        create: {
          name: "日本城郭研究センター",
          memo: JOKAKU_MEMO,
          lat: 34.835873,
          lng: 134.687363,
          visitTime: t(11, 45),
          stayDurationMin: 30,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
      {
        id: kokoen.id,
        data: {
          memo: kokoen.memo!.replace(KOKOEN_FROM, KOKOEN_TO),
          visitTime: t(12, 30),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
        },
      },
      { id: otokoyama.id, data: { visitTime: t(14, 16) } },
      { id: zoo.id, data: { visitTime: t(15, 13) } },
      { id: bungakukan.id, data: { visitTime: t(16, 13) } },
    ];
    await setDaySpotOrder(otedori.dayId, items1, { tx });

    // Day2
    const items2: SpotOrderItem[] = [
      { id: ropewayFirst!.id, data: {} },
      { id: maniden.id, data: {} },
      { id: sannodo.id, data: {} },
      { id: kaizando.id, data: { memo: kaizando.memo!.replace(KAIZANDO_FROM, KAIZANDO_TO) } },
      {
        id: suizokukan.id,
        data: {
          memo: suizokukan.memo!.replace(SUIZOKUKAN_FROM, SUIZOKUKAN_TO).replace(SUIZOKUKAN_END_FROM, SUIZOKUKAN_END_TO),
          visitTime: t(12, 49),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 45, transitLine: null }] },
        },
      },
      {
        create: {
          name: "手柄山温室植物園",
          memo: ONSHITSU_MEMO,
          lat: 34.8189133,
          lng: 134.6754557,
          visitTime: t(14, 24),
          stayDurationMin: 50,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        id: heiwakoen.id,
        data: {
          memo: heiwakoen.memo!.replace(HEIWAKOEN_FROM, HEIWAKOEN_TO),
          visitTime: t(15, 19),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(maniden.dayId, items2, { remove: [ropewaySecond!.id], tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
