/**
 * #121 b2615800の直し(4回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営・法務共通:
 * 1. 三井アウトレットの文末が、削除したはずの「スパ&ホテル舞浜ユーラシア」
 *    のまま残っていた(宿泊施設名)。幕張メッセへのつなぎに修正
 * 2. 幕張メッセ75分(決まりA、催しのない日は外観を見るだけ)→35分に短縮。
 *    空いた時間に実在の行き先「検見川の浜」(稲毛海浜公園・いなげの浜・
 *    幕張の浜と同じ人工海浜)を追加
 * 3. 幕張メッセ「次ぐ規模を誇る」→「次ぐ規模とされる」に伝聞化
 * 4. 加曽利貝塚博物館105分(時間を合わせるための延長、決まりA)→95分に戻す。
 *    代わりにDay2へ「千葉市科学館(Qiball)」(平成19年(2007)開館、
 *    ja.wikipedia.org/wiki/千葉市科学館)を新規追加して16:30〜17:00に収める
 *
 * 座標(Nominatim):
 * - 検見川の浜: 35.6254472, 140.0517877 (osm_id 1588404484)
 * - 千葉市科学館: 35.6074473, 140.1223175 (osm_id 6886812265)
 *
 * チェックリストには、法務指摘により幕張海浜公園の座標(35.643185,
 * 140.041932)が「推定(公園の中のシェアサイクルの乗り場の点)」であることを
 * 明記する。
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const INAGE_FROM = "この後は、車でおよそ9分、幕張海浜公園へ向かいましょう。";
const INAGE_TO = "この後は、車でおよそ3分、検見川の浜へ向かいましょう。";

const KEMIGAWA_MEMO =
  "稲毛海浜公園から車でおよそ3分、検見川の浜に着きます。幕張の浜・いなげの浜とともに続く、人工海浜の一つです。ウインドサーフィンの愛好者に親しまれている浜で、海を眺めながら波打ち際を散策できます。こちらも遊泳はできないので、波打ち際には近づきすぎないようにしましょう。この後は、車でおよそ6分、幕張海浜公園へ向かいましょう。";

const KAIHIN_KOEN_FROM_OPENER = "稲毛海浜公園から車でおよそ9分、幕張海浜公園に着きます。";
const KAIHIN_KOEN_TO_OPENER = "検見川の浜から車でおよそ6分、幕張海浜公園に着きます。";

const OUTLET_FROM = "この後は、車でおよそ25分、浦安市の天然温泉の宿、スパ&ホテル舞浜ユーラシアへ向かいましょう。";
const OUTLET_TO = "この後は、車でおよそ3分、幕張メッセへ向かいましょう。";

const MESSE_MEMO =
  "三井アウトレットパーク幕張から車でおよそ3分、幕張メッセに着きます。平成元年(1989)に開館した、国内では東京ビッグサイトに次ぐ規模とされる展示施設です。建築家・槇文彦が設計した、全長516メートルにおよぶ柱のない空間が特徴で、国内外の見本市やコンサートなど、さまざまな催しが開かれています。催しのない日でも、外観の迫力ある建築を眺められます。今夜は、幕張や千葉の宿に泊まりましょう。";

const ART_MUSEUM_FROM = "この後は、車でおよそ15分、千葉神社へ向かいましょう。";
const ART_MUSEUM_TO = "この後は、車でおよそ7分、千葉市科学館へ向かいましょう。";

const KAGAKUKAN_MEMO =
  "千葉県立美術館から車でおよそ7分、千葉市科学館(Qiball)に着きます。平成19年(2007)に開館した科学館で、視覚や音、数の不思議を体験する「ワンダータウン」、くらしの技術を紹介する「テクノタウン」、宇宙や生命を紹介する「ジオタウン」などの展示があります。内径23メートルのドームスクリーンを持つプラネタリウムでは、1億個を超える星を映し出します。この後は、車でおよそ3分、千葉神社へ向かいましょう。";

const JINJA_FROM_OPENER = "千葉県立美術館から車でおよそ15分、千葉神社に着きます。";
const JINJA_TO_OPENER = "千葉市科学館から車でおよそ3分、千葉神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b2615800%'`);
  const itinId = rows[0].id;

  const days = await prisma.day.findMany({ where: { itineraryId: itinId }, orderBy: { dayNumber: "asc" } });
  const day1Spots = await prisma.spot.findMany({ where: { dayId: days[0].id }, orderBy: { orderNo: "asc" } });
  const day2Spots = await prisma.spot.findMany({ where: { dayId: days[1].id }, orderBy: { orderNo: "asc" } });

  const inage = day1Spots.find((s) => s.name === "稲毛海浜公園")!;
  const kaihinKoen = day1Spots.find((s) => s.name === "幕張海浜公園")!;
  const aeon = day1Spots.find((s) => s.name === "イオンモール幕張新都心")!;
  const outlet = day1Spots.find((s) => s.name === "三井アウトレットパーク幕張")!;
  const messe = day1Spots.find((s) => s.name === "幕張メッセ")!;

  const portTower = day2Spots.find((s) => s.name === "千葉ポートタワー")!;
  const portPark = day2Spots.find((s) => s.name === "千葉ポートパーク")!;
  const artMuseum = day2Spots.find((s) => s.name === "千葉県立美術館")!;
  const jinja = day2Spots.find((s) => s.name === "千葉神社")!;
  const koen = day2Spots.find((s) => s.name === "千葉公園")!;
  const kasori = day2Spots.find((s) => s.name === "加曽利貝塚博物館")!;

  if (!outlet.memo?.includes(OUTLET_FROM)) throw new Error("三井アウトレットの文言が想定外です");
  if (!artMuseum.memo?.includes(ART_MUSEUM_FROM)) throw new Error("千葉県立美術館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      days[0].id,
      [
        { id: inage.id, data: { memo: inage.memo!.replace(INAGE_FROM, INAGE_TO) } },
        {
          create: {
            name: "検見川の浜",
            memo: KEMIGAWA_MEMO,
            lat: 35.6254472,
            lng: 140.0517877,
            visitTime: t(10, 23),
            stayDurationMin: 35,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3, transitLine: null }] },
          },
        },
        {
          id: kaihinKoen.id,
          data: {
            memo: kaihinKoen.memo!.replace(KAIHIN_KOEN_FROM_OPENER, KAIHIN_KOEN_TO_OPENER),
            visitTime: t(11, 4),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6, transitLine: null }] },
          },
        },
        { id: aeon.id, data: { visitTime: t(12, 42) } },
        { id: outlet.id, data: { memo: outlet.memo!.replace(OUTLET_FROM, OUTLET_TO), visitTime: t(14, 22) } },
        { id: messe.id, data: { memo: MESSE_MEMO, visitTime: t(15, 55), stayDurationMin: 35 } },
      ],
      { tx }
    );

    await setDaySpotOrder(
      days[1].id,
      [
        { id: portTower.id, data: {} },
        { id: portPark.id, data: {} },
        { id: artMuseum.id, data: { memo: artMuseum.memo!.replace(ART_MUSEUM_FROM, ART_MUSEUM_TO) } },
        {
          create: {
            name: "千葉市科学館",
            memo: KAGAKUKAN_MEMO,
            lat: 35.6074473,
            lng: 140.1223175,
            visitTime: t(12, 7),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7, transitLine: null }] },
          },
        },
        {
          id: jinja.id,
          data: {
            memo: jinja.memo!.replace(JINJA_FROM_OPENER, JINJA_TO_OPENER),
            visitTime: t(13, 10),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3, transitLine: null }] },
          },
        },
        { id: koen.id, data: { visitTime: t(14, 10), stayDurationMin: 50 } },
        { id: kasori.id, data: { visitTime: t(15, 25), stayDurationMin: 95 } },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
