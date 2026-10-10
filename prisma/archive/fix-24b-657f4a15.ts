/**
 * #24 657f4a15（強羅温泉でのんびり、箱根美術館と庭園めぐり1泊2日）
 * ユーザー決定「全部直す」により、これまで許容していたDay2終了15:27の短さも直す。
 * 箱根旧街道杉並木のあとに芦ノ湖遊覧船(元箱根港、新規)を追加し16:32に。
 * 座標: Nominatim確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SUGINAMIKI_ID = "e780a452-0000-0000-0000-000000000000"; // resolved below

const SUGINAMIKI_MEMO_NEW =
  "箱根関所から歩いておよそ10分、箱根旧街道杉並木に着きます。江戸時代、東海道を行き交う旅人を強い日差しや雪から守るために植えられたと伝えられる杉並木で、樹齢400年近い大杉が今も往時の街道の面影を伝えています。当時の石畳の一部も残る道を、静かな杉木立に包まれながら歩けば、江戸の旅人になった気分を味わえます。この後は、歩いておよそ5分、元箱根港へ向かいましょう。";

const CRUISE_MEMO =
  "箱根旧街道杉並木から歩いておよそ5分、元箱根港に着きます。ここから芦ノ湖遊覧船に乗り、湖上から旅を締めくくりましょう。湖畔に立つ箱根神社の「平和の鳥居」を海側から眺められるほか、天気が良ければ、芦ノ湖の向こうに富士山の姿を望むこともできます。箱根町港や桃源台港を経由する航路を一巡りすれば、山側から歩いてきた元箱根・箱根関所の景色を、今度は湖の上から振り返ることができます。強羅の美術館めぐりから芦ノ湖のほとりまで、一泊二日の箱根の旅を、この湖上のひとときでゆっくりと締めくくってください。";

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: { contains: "強羅温泉でのんびり" } },
    select: { id: true },
  });
  const day2 = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id, dayNumber: 2 },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  const suginamiki = day2.spots.find((s) => s.name === "箱根旧街道杉並木");
  if (!suginamiki) throw new Error("箱根旧街道杉並木が見つかりません");

  const spots: SpotOrderItem[] = [
    ...day2.spots.filter((s) => s.id !== suginamiki.id).map((s) => ({ id: s.id, data: {} })),
    { id: suginamiki.id, data: { memo: SUGINAMIKI_MEMO_NEW } },
    { create: { name: "元箱根港(芦ノ湖遊覧船)", address: "神奈川県足柄下郡箱根町元箱根139", lat: 35.200948, lng: 139.030531, memo: CRUISE_MEMO, visitTime: t(15, 32), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5, transitLine: null } },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("Day2 spots:", day2.spots.map((s) => `${s.name}@${s.visitTime?.toISOString().slice(11, 16)}(stay${s.stayDurationMin})`).join(" | "));

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
