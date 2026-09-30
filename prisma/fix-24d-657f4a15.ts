/**
 * #24 657f4a15（箱根）Day2の芦ノ湖遊覧船を実際の航路・所要時間に合わせて直す。
 * 元箱根港→箱根町港は片道10分(公式で確認)。60分の周遊はできないため、
 * 元箱根港(乗船待ち)→箱根町港(下船後の散策、バスで帰路へ)の2スポットに分ける。
 * 「海側から」→「湖の上から」に修正。決まり3(帰り方)として、箱根町港から
 * バスで箱根湯本駅方面へ向かう一言を追加。
 * 箱根町港の座標は箱根関所とほぼ同じ湖畔のため、箱根関所の座標を代替アンカーに使用。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MOTOHAKONE_ID = "f22acc13-7c76-4477-a911-d650e14941ed";

const MOTOHAKONE_MEMO =
  "箱根旧街道杉並木から歩いておよそ5分、元箱根港に着きます。ここから芦ノ湖遊覧船に乗り、湖上から旅を締めくくりましょう。港からは、湖畔に立つ箱根神社の「平和の鳥居」を湖の上から眺められるほか、天気が良ければ、芦ノ湖の向こうに富士山の姿を望むこともできます。乗り場でしばらく待ったのち、箱根町港までのおよそ10分間の船旅を楽しんでください。";

const HAKONEMACHIKO_MEMO =
  "元箱根港から芦ノ湖遊覧船でおよそ10分、箱根町港に着きます。船を降りたら、湖畔の遊歩道を少し歩いてみましょう。山側から歩いてきた元箱根・箱根関所のあたりを、今度は湖の上から眺めた余韻とともに振り返ることができます。強羅の美術館めぐりから芦ノ湖のほとりまで、一泊二日の箱根の旅も、ここでゆっくりと締めくくってください。この後は、箱根町港からバスに乗り、箱根湯本駅方面へ向かいましょう。バスの時刻は、公式サイトで確かめておくと安心です。";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({
    where: { spots: { some: { id: MOTOHAKONE_ID } } },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });

  const spots: SpotOrderItem[] = [
    ...day2.spots.filter((s) => s.id !== MOTOHAKONE_ID).map((s) => ({ id: s.id, data: {} })),
    { id: MOTOHAKONE_ID, data: { memo: MOTOHAKONE_MEMO, visitTime: t(15, 32), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
    { create: { name: "箱根町港", address: "神奈川県足柄下郡箱根町箱根", lat: 35.192206, lng: 139.026353, memo: HAKONEMACHIKO_MEMO, visitTime: t(16, 7), stayDurationMin: 35, transitMode: "other", transitDurationMin: 10, transitLine: null } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("Day2 spots(既存, before edit):", day2.spots.map((s) => `${s.name}@${s.visitTime?.toISOString().slice(11, 16)}(stay${s.stayDurationMin})`).join(" | "));

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
