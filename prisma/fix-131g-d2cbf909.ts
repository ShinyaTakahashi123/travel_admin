/**
 * #131 d2cbf909の直し(7回目)。企画運営(2026-10-11)の指摘4点+法務の
 * 座標指摘。
 *
 * 1. 金陵の郷の75分(決まりAの水増し)を40分に短縮。
 * 2. 表参道の昼食を10:54開始・90分→11:31開始(11:30以降)・60分に変更。
 *    朝に空いた時間には、鞘橋を新規に追加(f6221e55は「明治2年建立・
 *    登録有形文化財・そばから眺める」の切り口だったため、こちらは
 *    金倉川での禊(こんぴら参りの旅人が身を清めた川という伝承)と、
 *    橋脚を持たない「浮橋」という珍しい構造、神事のときだけ使われる
 *    ことを中心にした。出典: yousakana.jp/?p=13558ほかで禊の伝承、
 *    skr.mlit.go.jp/kasen資料で浮橋の構造を確認)。
 * 3. 表参道(昼食)の座標34.1867,133.8173は丸め値だった。法務の指摘
 *    どおり、参道沿いの公の施設「かがわ・こんぴら観光案内所」
 *    (OSM n10796924410、information=office、34.187074,133.818032、
 *    api.openstreetmap.org/api/0.6/node/10796924410を開いて確認)を
 *    推定の点として使用。
 * 4. 表参道→大門「歩いておよそ7分」は365段を上る時間として短すぎた。
 *    表参道入口から大門(365段)までは徒歩30〜40分という記述(複数の
 *    旅行サイトで確認)に基づき、35分に修正。
 *
 * これにより午後の時間が延びるため、高橋由一館・旭社の滞在を25分→
 * 20分に短縮して16:30〜17:00に収まるよう調整。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KINRYONOSATO_MEMO =
  "高灯籠から歩いておよそ8分、金陵の郷に着きます。江戸時代から続く地元の酒蔵が、蔵の一部を資料館として公開しています。昔の酒造りの道具や工程を、建物とあわせて見学できます。営業時間が限られるので、お出かけ前に公式で確かめましょう。この後は、歩いておよそ7分、鞘橋へ向かいましょう。";

const SAYABASHI_MEMO =
  "金陵の郷から歩いておよそ7分、金倉川のほとりに着きます。古くから「清めの川」とされ、こんぴら参りの旅人は、長旅の汚れをこの川で洗い流してから金刀比羅宮へ向かったと伝えられています。川に架かる鞘橋は、橋脚を持たずに浮いているように見える珍しい構造で、ふだんは渡ることができず、秋の例大祭などの神事のときだけ使われます。川のほとりで、こんぴら参りの旅人たちが身を清めた歴史に思いを馳せながら過ごしましょう。この後は、歩いておよそ6分、表参道へ向かいましょう。";

const OMOTESANDO_MEMO =
  "鞘橋から歩いておよそ6分、表参道に着きます。大門に向かう参道沿いには、うどん店や土産物店が並んでいます。この先、奥社までは長い石段が続き、食事のできる店もないので、ここで昼食をとっておきましょう。この後は、参道を歩いておよそ35分、365段の石段を上って大門へ向かいましょう。";

const DAIMON_MEMO =
  "表参道から参道を歩いておよそ35分、365段の石段を上って大門に着きます。入母屋造りの二階建ての門で、ここから先が金刀比羅宮の神域となり、俗世との境目を示しています。大門をくぐった先には、白い傘をさして並ぶ飴売り「五人百姓」の店があり、古くからこの五軒だけに境内での商いが許されてきたと伝えられています。この先、奥社までは長い石段が続きます。歩きやすい靴で、自分のペースで休みながら上り下りし、こまめに水分をとりましょう。この後は、石段を上っておよそ10分、高橋由一館へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd2cbf909%'`);
  const itinId = rows[0].id;

  const kinryonosato = await findSpotInItinerary(itinId, { spotName: "金陵の郷" });
  const omotesando = await findSpotInItinerary(itinId, { spotName: "表参道（昼食）" });
  const daimon = await findSpotInItinerary(itinId, { spotName: "大門" });
  const takahashiyuichikan = await findSpotInItinerary(itinId, { spotName: "高橋由一館" });
  const asahisha = await findSpotInItinerary(itinId, { spotName: "旭社" });
  const hongu = await findSpotInItinerary(itinId, { spotName: "本宮" });
  const tembodai = await findSpotInItinerary(itinId, { spotName: "展望台" });
  const okusha = await findSpotInItinerary(itinId, { spotName: "金刀比羅宮 奥社（厳魂神社）" });
  const takatouro = await findSpotInItinerary(itinId, { spotName: "高灯籠" });

  console.log("確認OK。dayId:", kinryonosato.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const items: SpotOrderItem[] = [
      { id: takatouro.id, data: {} },
      {
        id: kinryonosato.id,
        data: { memo: KINRYONOSATO_MEMO, stayDurationMin: 40 },
      },
      {
        create: {
          name: "鞘橋",
          memo: SAYABASHI_MEMO,
          lat: 34.1856427,
          lng: 133.8216501,
          visitTime: t(10, 20),
          stayDurationMin: 65,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
        },
      },
      {
        id: omotesando.id,
        data: {
          memo: OMOTESANDO_MEMO,
          lat: 34.187074,
          lng: 133.818032,
          visitTime: t(11, 31),
          stayDurationMin: 60,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6, transitLine: null }] },
        },
      },
      {
        id: daimon.id,
        data: {
          memo: DAIMON_MEMO,
          visitTime: t(13, 6),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 35, transitLine: null }] },
        },
      },
      {
        id: takahashiyuichikan.id,
        data: { visitTime: t(13, 36), stayDurationMin: 20 },
      },
      {
        id: asahisha.id,
        data: { visitTime: t(14, 6), stayDurationMin: 20 },
      },
      { id: hongu.id, data: { visitTime: t(14, 36) } },
      { id: tembodai.id, data: { visitTime: t(14, 58) } },
      { id: okusha.id, data: { visitTime: t(16, 8) } },
    ];
    await setDaySpotOrder(takatouro.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
