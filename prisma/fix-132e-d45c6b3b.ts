/**
 * #132 d45c6b3bの直し(5回目)。企画運営(2026-10-11)の指摘+法務の座標
 * 指摘。
 *
 * 白石城を追加。既存の8a15b42c(キツネと動物ふれあい…)の白石城の文
 * (「慶長7年以降、片倉氏代々居城。一国一城令の例外。明治時代に解体、
 * 平成7年に木造で復元」という概要的な書き方)では使っていない、戊辰
 * 戦争での降伏から明治7年(1874)の取り壊しという具体的な経緯、発掘
 * 調査に基づき文政6年(1823)再建後の姿を復元したこと、吉野産ヒノキを
 * 使ったこと、120年ぶりの再建であることを中心に書いた(出典:
 * triptojapan.com/ja/places/shiroishi-castle、検索結果に基づく複数の
 * 旅行サイトの記述で確認)。
 *
 * あわせて、8a15b42cが使っていない鎌先温泉(永享元年/1428発見、
 * 切り傷の湯、大正時代の木造建築が残る湯治場、news.allabout.co.jp/
 * articles/o/115920/で確認)も追加し、16:30〜17:00に収めた。
 *
 * 法務の指摘(記録740f487)で、弥治郎こけし村の座標(国土地理院の
 * 大字「福岡八宮」の点、こけし村から約5km離れていた)を、OSMのバス停
 * 「弥次郎こけし村」(n2285307562、38.035461,140.574475、
 * api.openstreetmap.org/api/0.6/node/2285307562を開いて確認、推定)に
 * 修正。座標が変わったことで、刈田嶺神社奥宮→弥治郎こけし村の距離が
 * 約9.3km→約15.1kmに伸び、弥治郎こけし村→鎌先温泉の距離は約4.9km→
 * 約1.2kmに縮んだため、移動時間も合わせて見直す(前者は65分に、
 * 後者は3分に)。
 *
 * 座標(OSM): 白石城 38.0026467,140.6171465(building)、鎌先温泉
 * 38.0251255,140.5765602(バス停の点、推定)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KATTAMINEJINJA_END_FROM = "見学を終えたら、車でおよそ55分、弥治郎こけし村へ向かいましょう。";
const KATTAMINEJINJA_END_TO = "見学を終えたら、車でおよそ65分、弥治郎こけし村へ向かいましょう。";

const YAJIRO_START_FROM = "刈田嶺神社奥宮から車でおよそ55分、弥治郎こけし村に着きます。";
const YAJIRO_START_TO = "刈田嶺神社奥宮から車でおよそ65分、弥治郎こけし村に着きます。";

const YAJIRO_END_FROM = "見学を終えたら、車でおよそ20分、白石蔵王駅方面へ戻りましょう。";
const YAJIRO_END_TO = "見学を終えたら、車でおよそ3分、鎌先温泉へ向かいましょう。";

const KAMASAKI_MEMO =
  "弥治郎こけし村から車でおよそ3分、鎌先温泉に着きます。永享元年(1428)、農民が鍬の先で掘り当てたという言い伝えから「鎌先」の名がついたとされる、600年近い歴史を持つ湯治場です。切り傷によく効く湯として知られ、谷あいに宿が並ぶ一帯には、大正時代の木造建築も残り、昔ながらの湯治場の風情が漂います。レトロな街並みを散策してみましょう。この後は、車でおよそ10分、白石城へ向かいましょう。";

const SHIROISHIJO_MEMO =
  "鎌先温泉から車でおよそ10分、白石城に着きます。仙台藩の重臣・片倉氏が、関ヶ原の戦いのあとから明治維新まで260年近く居城とした城です。戊辰戦争で新政府軍に降伏したことにより明治7年(1874)に取り壊されましたが、平成7年(1995)、発掘調査に基づいて、文政6年(1823)の再建後の姿を史実に忠実に、吉野産のヒノキを使った木造で復元されました。解体から120年ぶりの再建です。天守にあたる三階櫓からは、益岡公園と白石の街並みを見渡すことができます。この後は、白石蔵王駅方面へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;

  const echoline = await findSpotInItinerary(itinId, { spotName: "蔵王エコーライン" });
  const takimidai = await findSpotInItinerary(itinId, { spotName: "滝見台" });
  const komakusadaira = await findSpotInItinerary(itinId, { spotName: "駒草平" });
  const okama = await findSpotInItinerary(itinId, { spotName: "蔵王のお釜" });
  const kattaminejinja = await findSpotInItinerary(itinId, { spotName: "刈田嶺神社奥宮" });
  const yajiro = await findSpotInItinerary(itinId, { spotName: "弥治郎こけし村" });

  if (!kattaminejinja.memo?.includes(KATTAMINEJINJA_END_FROM)) throw new Error("刈田嶺神社奥宮の文言が想定外です");
  if (!yajiro.memo?.includes(YAJIRO_START_FROM)) throw new Error("弥治郎こけし村の書き出しが想定外です");
  if (!yajiro.memo?.includes(YAJIRO_END_FROM)) throw new Error("弥治郎こけし村の結びが想定外です");

  console.log("確認OK。dayId:", echoline.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const items: SpotOrderItem[] = [
      { id: echoline.id, data: {} },
      { id: takimidai.id, data: {} },
      { id: komakusadaira.id, data: {} },
      { id: okama.id, data: {} },
      {
        id: kattaminejinja.id,
        data: { memo: kattaminejinja.memo!.replace(KATTAMINEJINJA_END_FROM, KATTAMINEJINJA_END_TO) },
      },
      {
        id: yajiro.id,
        data: {
          memo: yajiro.memo!.replace(YAJIRO_START_FROM, YAJIRO_START_TO).replace(YAJIRO_END_FROM, YAJIRO_END_TO),
          lat: 38.03546,
          lng: 140.574475,
          visitTime: t(14, 17),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 65, transitLine: null }] },
        },
      },
      {
        create: {
          name: "鎌先温泉",
          memo: KAMASAKI_MEMO,
          lat: 38.0251255,
          lng: 140.5765602,
          visitTime: t(15, 20),
          stayDurationMin: 30,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3, transitLine: null }] },
        },
      },
      {
        create: {
          name: "白石城",
          memo: SHIROISHIJO_MEMO,
          lat: 38.0026467,
          lng: 140.6171465,
          visitTime: t(16, 0),
          stayDurationMin: 45,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(echoline.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
