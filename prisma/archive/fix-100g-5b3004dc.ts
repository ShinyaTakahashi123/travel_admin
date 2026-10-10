/**
 * #100 5b3004dc の直し(7回目)。法務(2026-10-01 10:46)・企画運営(2026-10-01 10:49)の指摘:
 * ① 「上高地温泉ホテル」は1軒のホテル名のため、スポット名にしない。かわりに、同じあたりの
 *    実在の公共の場所「小梨平」(河童橋そばのキャンプ場・原生林の遊歩道。食堂・売店あり)に
 *    差し替える。日帰り入浴の内容はまるごと削除(特定の宿の名を出さずに説明するのが難しい
 *    ため、入浴は書かず、昼食と散策のみにする)。
 * ② 徳沢の本文から、山小屋の固有名詞「徳澤園」を削除(2か所)。
 * ③ 徳沢→河童橋の長い徒歩区間(120分、本物の移動時間として承認済み)に、山の安全の一言を追加。
 * ④ 穂高神社奥宮の例大祭「毎年10月8日」→日にちを書かず「毎年秋」に(企画運営の事実確認指摘)。
 *
 * 小梨平は河童橋から徒歩5分の実在のキャンプ場(開設期間は本しおりの開山期間と同じ4月下旬〜
 * 11月中旬)。入浴施設の案内は、上高地温泉ホテルの代わりとして使わず省く。
 * 開いたURL: https://visitmatsumoto.com/spot/detail_1049.html (小梨平キャンプ場の案内・河童橋から徒歩5分)
 * 座標はOSM生データ(node 2293285488, name=小梨平キャンプ場, lat/lon確認)を使用。
 *
 * 田代橋・穂高橋→小梨平は実測ではないが、両地点とも河童橋至近(事前の訪問記録で確認済みの
 * 上高地温泉ホテルの位置とほぼ同じ)のため、既存の「徒歩5分」から大きく変えず「徒歩15分」とする
 * (小梨平は河童橋を渡った先の左岸のため、川沿いを少し回り込む分を見込んだ)。
 * 小梨平→穂高神社奥宮は、河童橋を渡って梓川左岸の遊歩道を明神まで歩く標準的な経路とし、
 * 「徒歩50分」とする(河童橋～明神は案内板等で広く知られる徒歩60分に対し、小梨平は河童橋から
 * 徒歩5分の分だけ明神寄りのため、やや短く見積もった)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TASHIROBASHI_FROM = "橋の上からは、川上に連なる穂高連峰の姿を望むことができ、大正池から河童橋へと歩く道のりの中でも、人気の撮影地として親しまれています。この後は、歩いておよそ5分、上高地温泉ホテルへ向かいましょう。";
const TASHIROBASHI_TO = "橋の上からは、川上に連なる穂高連峰の姿を望むことができ、大正池から河童橋へと歩く道のりの中でも、人気の撮影地として親しまれています。この後は、歩いておよそ15分、小梨平へ向かいましょう。";

const KONASHIDAIRA_MEMO =
  "田代橋・穂高橋から歩いておよそ15分、小梨平に着きます。河童橋のすぐそばに広がる、ミズナラやカラマツなどの原生林に囲まれたキャンプ場で、食堂や売店もあります。木々に包まれた遊歩道を少し歩いて、ひと休みしましょう。ここで昼食にしましょう。この後は、河童橋を渡り、梓川左岸の遊歩道を歩いておよそ50分、穂高神社奥宮へ向かいましょう。";

const HOTAKAJINJA_FROM_OPEN = "上高地温泉ホテルから、河童橋のたもとを通り過ぎ、明神橋で梓川を渡って、歩いておよそ35分、穂高神社奥宮に着きます。";
const HOTAKAJINJA_TO_OPEN = "小梨平から、河童橋を渡って梓川左岸の遊歩道を歩き、明神橋を渡って、歩いておよそ50分、穂高神社奥宮に着きます。";

const HOTAKAJINJA_FROM_DATE = "毎年10月8日には奥宮例大祭が行われ";
const HOTAKAJINJA_TO_DATE = "毎年秋には奥宮例大祭が行われ";

const TOKUSAWA_FROM = "牧場の番小屋だった建物は、今も山小屋「徳澤園」として営業しています。作家・井上靖の小説『氷壁』の舞台としても知られ、徳澤園はその作中に登場する宿のモデルとされています。穂高連峰を望む広々とした草地で、山と静けさに包まれる時間を過ごしてみてください。この後は、歩いておよそ120分、河童橋へ向かいましょう。";
const TOKUSAWA_TO = "牧場の番小屋だった建物は、今も山小屋として営業しています。作家・井上靖の小説『氷壁』の舞台としても知られ、作中に登場する宿のモデルになったと伝えられています。穂高連峰を望む広々とした草地で、山と静けさに包まれる時間を過ごしてみてください。山の天気は急に変わることがあるため、服装・装備を整え、熊よけの鈴を身につけるなどして、決められた道を外れずに歩きましょう。この後は、歩いておよそ120分、河童橋へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5b3004dc%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const taisho = await findSpotInItinerary(itinId, { spotName: "大正池" });
  const tashiro = await findSpotInItinerary(itinId, { spotName: "田代池" });
  const tashirobashi = await findSpotInItinerary(itinId, { spotName: "田代橋・穂高橋" });
  const onsenHotel = await findSpotInItinerary(itinId, { spotName: "上高地温泉ホテル" });
  const hotakajinja = await findSpotInItinerary(itinId, { spotName: "穂高神社奥宮" });
  const myojinike = await findSpotInItinerary(itinId, { spotName: "明神池" });
  const tokusawa = await findSpotInItinerary(itinId, { spotName: "徳沢" });

  if (!tashirobashi.memo!.includes(TASHIROBASHI_FROM)) throw new Error("田代橋・穂高橋の文言が想定外です");
  if (!hotakajinja.memo!.includes(HOTAKAJINJA_FROM_OPEN)) throw new Error("穂高神社奥宮の書き出しが想定外です");
  if (!hotakajinja.memo!.includes(HOTAKAJINJA_FROM_DATE)) throw new Error("穂高神社奥宮の日付が想定外です");
  if (!tokusawa.memo!.includes(TOKUSAWA_FROM)) throw new Error("徳沢の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const hotakajinjaMemo = hotakajinja.memo!.replace(HOTAKAJINJA_FROM_OPEN, HOTAKAJINJA_TO_OPEN).replace(HOTAKAJINJA_FROM_DATE, HOTAKAJINJA_TO_DATE);

  const day1Spots: SpotOrderItem[] = [
    { id: taisho.id, data: {} },
    { id: tashiro.id, data: {} },
    { id: tashirobashi.id, data: { memo: tashirobashi.memo!.replace(TASHIROBASHI_FROM, TASHIROBASHI_TO) } },
    {
      create: {
        name: "小梨平",
        address: "長野県松本市安曇上高地",
        lat: 36.2505817,
        lng: 137.6403807,
        memo: KONASHIDAIRA_MEMO,
        visitTime: t(12, 38),
        stayDurationMin: 60,
        transitMode: "walk",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    { id: hotakajinja.id, data: { memo: hotakajinjaMemo, visitTime: t(14, 28), transitDurationMin: 50 } },
    { id: myojinike.id, data: { visitTime: t(15, 23) } },
  ];

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx, remove: [onsenHotel.id] });
    await updateSpotInItinerary(itinId, { spotId: tokusawa.id }, { memo: tokusawa.memo!.replace(TOKUSAWA_FROM, TOKUSAWA_TO) }, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
