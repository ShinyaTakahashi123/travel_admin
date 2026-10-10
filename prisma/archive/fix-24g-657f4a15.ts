/**
 * #24 657f4a15（箱根）企画運営の指摘（2026-09-30 10:47）。
 * 箱根駅伝ミュージアムは平日16:30閉館・入館16:00まで(公式 https://www.hakoneekidenmuseum.jp/guide/ )。
 * fix-24eの16:17着では平日入れないため、企画運営の案どおりDay2を並べ替える:
 * 長安寺→箱根神社→成川美術館→杉並木→元箱根港(船)→箱根町港→箱根駅伝ミュージアム→箱根関所→恩賜箱根公園(最後)
 * 箱根関所は冬季(12〜2月)16:30閉館・入場16:00まで(要確認済み)。新しい到着は14:37のため問題なし。
 * 元箱根港の本文「湖上から旅を締めくくりましょう」は、もう最後ではないため「湖の上からの
 * 景色を楽しみましょう」に修正。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NAGAAN_ID = "a1432995-7481-44d9-9d62-8381472c1471";
const HAKONE_JINJA_ID = "0a285b65-0c46-42ce-9b74-29db3c3608ce";
const NARUKAWA_ID = "0e6b3d0f-b48b-41dd-a170-c69f292dea72";
const ONSHI_PARK_ID = "96f93780-8bb2-467d-a1c4-e763e868fbdb";
const SEKISHO_ID = "fc8689df-4801-4f5f-931c-38f5cbac1c56";
const SUGINAMIKI_ID = "e780a452-83ff-4280-bba4-0947b926776c";
const MOTOHAKONE_ID = "f22acc13-7c76-4477-a911-d650e14941ed";
const HAKONEMACHIKO_ID = "37e757ef-59c2-4d97-9926-f971a9b0a0de";
const EKIDEN_ID = "098da4a6-621a-4671-b936-f323f9cd9e7e";

const MOTOHAKONE_MEMO =
  "箱根旧街道杉並木から歩いておよそ5分、元箱根港に着きます。ここから芦ノ湖遊覧船に乗り、湖上から景色を楽しみましょう。港からは、湖畔に立つ箱根神社の「平和の鳥居」を湖の上から眺められるほか、天気が良ければ、芦ノ湖の向こうに富士山の姿を望むこともできます。乗り場で少し待ったのち、箱根町港までのおよそ10分間の船旅を楽しんでください。";

const HAKONEMACHIKO_MEMO =
  "元箱根港から芦ノ湖遊覧船でおよそ10分、箱根町港に着きます。船を降りたら、湖畔の遊歩道を少し歩いてみましょう。山側から歩いてきた元箱根・箱根関所のあたりを、今度は湖の上から眺めた余韻とともに振り返ることができます。この後は、歩いてすぐの箱根駅伝ミュージアムへ向かいましょう。";

const EKIDEN_MEMO =
  "箱根町港から歩いてすぐ、箱根駅伝ミュージアムに着きます。芦ノ湖のほとりに立つミュージアムで、箱根駅伝の歴代大会の名シーンを記録した写真や、選手が愛用した品々などを展示しています。旅の終盤に、箱根の山々を舞台にした駅伝の歴史にふれてみてください。営業時間は曜日によって異なるので、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ5分、箱根関所へ向かいましょう。";

const SEKISHO_MEMO =
  "箱根駅伝ミュージアムから歩いておよそ5分、箱根関所に着きます。江戸時代、東海道の要衝として「入り鉄砲に出女」を取り締まった関所を復元した史跡で、当時の建物のようすを間近で見ることができます。冬の時期(12月〜2月)は閉まる時間が早くなるので、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ6分、恩賜箱根公園へ向かいましょう。";

const ONSHI_PARK_MEMO =
  "箱根関所から歩いておよそ6分、旅の締めくくりは恩賜箱根公園です。かつて皇室の避暑地として使われた離宮の跡地を整備した公園で、芦ノ湖畔の湖畔展望館からは、湖の向こうに富士山を望む景色が広がります。園内の施設によっては閉まる時間が早いこともあるので、公式サイトで確かめておくと安心です。長安寺から箱根神社、成川美術館、芦ノ湖遊覧船とめぐった箱根の旅も、ここでゆっくりと締めくくってください。この後は、バスなどで箱根湯本駅方面へ向かいましょう。";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({
    where: { spots: { some: { id: NAGAAN_ID } } },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });

  const spots: SpotOrderItem[] = [
    { id: NAGAAN_ID, data: {} },
    { id: HAKONE_JINJA_ID, data: {} },
    { id: NARUKAWA_ID, data: {} },
    { id: SUGINAMIKI_ID, data: { visitTime: t(12, 27), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 3 } },
    { id: MOTOHAKONE_ID, data: { memo: MOTOHAKONE_MEMO, visitTime: t(13, 17), stayDurationMin: 10, transitMode: "walk", transitDurationMin: 5 } },
    { id: HAKONEMACHIKO_ID, data: { memo: HAKONEMACHIKO_MEMO, visitTime: t(13, 37), stayDurationMin: 20, transitMode: "other", transitDurationMin: 10 } },
    { id: EKIDEN_ID, data: { memo: EKIDEN_MEMO, visitTime: t(14, 2), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 5 } },
    { id: SEKISHO_ID, data: { memo: SEKISHO_MEMO, visitTime: t(14, 37), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5 } },
    { id: ONSHI_PARK_ID, data: { memo: ONSHI_PARK_MEMO, visitTime: t(15, 43), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 6 } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    if (d.visitTime) {
      const vt = d.visitTime as Date;
      const st = (d.stayDurationMin as number) ?? 0;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
