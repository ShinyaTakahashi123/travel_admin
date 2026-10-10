/**
 * #416 4d1139e6 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 16:30〜17:00まで、決まり8「電車・バスがある区間はタクシーにしない」、宿・帰りの一言）
 * 1日目: …名古屋海洋博物館・展望室 →（地下鉄名港線・JR・あおなみ線 約55分）リニア・鉄道館 14:40〜16:40（宿の一言を足す）
 * 2日目: …FUJIなごや科学館 →（歩き15分）大須観音（新規）15:55〜16:30（帰りの一言）
 *   ガーデンふ頭→金城ふ頭は、水上バスは便が少なく運航日も確かめきれないので、電車に（名古屋港駅→金山駅は地下鉄名港線、金山→名古屋はJR、名古屋→金城ふ頭はあおなみ線で片道24分）
 * 本文の出典: リニア・鉄道館 アクセス https://museum.jr-central.co.jp/access/ 、名古屋港水族館 アクセス https://nagoyaaqua.jp/access/ 、
 *   名古屋コンシェルジュ https://www.nagoya-info.jp/spot/detail/13/ （大須観音）
 * 座標の出典: OSM（大須観音 way 923032216 35.159701,136.899248）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-416c-4d1139e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d1139e6-04e2-4f29-af49-e411ec4a06f3";
const DAY1_ID = "63c591bb-74b5-4925-bce8-149c3c65de8a";
const DAY2_ID = "96f0a3ce-308c-4419-9058-4f1272d48fd0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("構成が想定と違います");
  const d1 = days[0].spots, d2 = days[1].spots;
  if (d1[3]?.name !== "リニア・鉄道館" || d1.length !== 4) throw new Error("1日目が想定と違います");
  if (d2[3]?.name !== "FUJIなごや科学館" || d2.length !== 4) throw new Error("2日目が想定と違います");
  const linear = d1[3], sci = d2[3];
  const linearMemo = rep(
    rep(linear.memo ?? "", "ガーデンふ頭から車で約25分、金城ふ頭にある鉄道の博物館です。", "名古屋港駅から地下鉄名港線で金山駅へ、JRで名古屋駅に出て、あおなみ線で金城ふ頭駅へ（約55分）。駅から歩いてすぐの、金城ふ頭にある鉄道の博物館です。"),
    "休館日は公式の案内で確かめてから訪れましょう。", "休館日は公式の案内で確かめてから訪れましょう。今夜は名古屋に泊まります。");
  const description = rep(it.description ?? "", "世界最大級ともいわれるプラネタリウムがあるFUJIなごや科学館へ。", "世界最大級ともいわれるプラネタリウムがあるFUJIなごや科学館、最後は大須観音へ。");

  const day1 = [
    ...d1.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: linear.id, data: { memo: linearMemo, visitTime: t(14, 40), stayDurationMin: 120, transitMode: "train", transitDurationMin: 55, transitLine: "地下鉄名港線・JR・あおなみ線" } },
  ];
  const day2 = [
    ...d2.map((s) => ({ id: s.id, data: {} })),
    { create: { name: "大須観音", visitTime: t(15, 55), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 35.159701, lng: 136.899248, address: "愛知県名古屋市中区大須",
      memo: "科学館から南へ歩いて、大須観音へ。正式には北野山真福寺宝生院という真言宗の寺で、もとは美濃の大須にあったものが、慶長17年（1612年）に徳川家康によって今の地に移されました。本堂は戦災で焼失し、昭和45年（1970年）に再建されています。大須文庫には、国宝の古事記の写本をはじめ、およそ15,000冊が収められています。" + RESPECT + "家族で楽しんだ名古屋の旅を、ここで締めくくりましょう。帰りは、すぐそばの地下鉄 大須観音駅から。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`リニア: ${linearMemo.slice(0, 70)}…${linearMemo.slice(-25)}`);
  console.log("1日目: …海洋博物館 13:00〜13:45 →（電車55分）リニア・鉄道館 14:40〜16:40");
  console.log("2日目: …FUJIなごや科学館 14:10〜15:40 →（歩き15分）大須観音 15:55〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(DAY1_ID, day1, { tx });
    await setDaySpotOrder(DAY2_ID, day2, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
