/**
 * #428 7a65702f（山口 1泊2日）1日目の後半の直し（しおりえ(制作補助2)、企画運営の指示 9/30 18:08）
 *   もとは 県立美術館 13:00〜14:30 →（タクシー20分）湯田温泉 14:50〜16:30（100分）で、タクシー（決まり8: バス・JRがある）と長い滞在（決まりA）になっていた
 *   → 県立美術館 13:00〜14:15 →（路線バス30分）中原中也記念館（新規）14:45〜15:30 →（歩き5分）井上公園（新規）15:35〜15:55 →（歩き5分）湯田温泉 16:00〜16:45（宿の一言）
 *   中原中也記念館は 9:00〜17:00（11〜4月、月曜・最終火曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: おいでませ山口へ https://yamaguchi-tourism.jp/spot/detail_12360.html （中原中也記念館）・detail_12254.html（井上公園）
 * 座標の出典: OSM（中原中也記念館 node 1423654032／井上公園 way 316662360）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-428f-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITINERARY_ID, dayNumber: 1 }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  const want = ["山口県立山口博物館", "山口大神宮", "山口サビエル記念聖堂", "山口県立美術館", "湯田温泉"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const [haku, daijingu, xavier, kenbi, yuda] = day.spots;
  const yudaMemo = rep(yuda.memo ?? "", "美術館からタクシーで湯田温泉へ。", "井上公園から、湯田温泉の温泉街を歩きます。");
  const description = rep(it.description ?? "", "県立美術館をめぐり、湯田温泉に泊まります。", "県立美術館をめぐり、湯田温泉では中原中也記念館と井上公園をたずねて、湯田温泉に泊まります。");

  const order = [
    { id: haku.id, data: {} },
    { id: daijingu.id, data: {} },
    { id: xavier.id, data: {} },
    { id: kenbi.id, data: { stayDurationMin: 75 } },
    { create: { name: "中原中也記念館", visitTime: t(14, 45), stayDurationMin: 45, transitMode: "bus", transitDurationMin: 30, transitLine: "路線バス", lat: 34.164779, lng: 131.457879, address: "山口県山口市湯田温泉1丁目",
      memo: "美術館から路線バスで湯田温泉へ（バスの時刻は前もって確かめましょう）。中原中也記念館は、「汚れつちまつた悲しみに……」「サーカス」などの作品で知られる詩人・中原中也の生家跡に建つ記念館で、中也の30年の生涯と作品を、自筆の原稿や日記などの資料で紹介しています。休館日は公式の案内で確かめましょう。" } },
    { create: { name: "井上公園", visitTime: t(15, 35), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.163362, lng: 131.456715, address: "山口県山口市湯田温泉2丁目5",
      memo: "記念館から歩いてすぐの井上公園へ。明治の政治家・井上馨の生家があった場所で、幕末の政変で都を追われた三条実美ら七卿の宿舎にもなりました。園内には、井上馨の銅像や七卿の碑、中原中也の詩碑、種田山頭火の句碑があります。" } },
    { id: yuda.id, data: { visitTime: t(16, 0), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null, memo: yudaMemo } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`湯田温泉: ${yudaMemo.slice(0, 40)}…`);
  console.log("1日目: …県立美術館 13:00〜14:15 →（バス30分）中也記念館 14:45〜15:30 → 井上公園 15:35〜15:55 → 湯田温泉 16:00〜16:45");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
