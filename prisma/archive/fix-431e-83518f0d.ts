/**
 * #431 83518f0d の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 決まり4「行って戻るだけの順番にしない」・決まり8「バスがある区間にタクシーを使わない」）
 * 2日目の並べ替え: 二条市場 → さっぽろテレビ塔 → 札幌市時計台 →（北海道中央バス）サッポロビール博物館（このあたりで昼食）→（バス）すすきの → 豊平館 → 中島公園（7か所 09:00〜16:30）
 *   サッポロビール博物館へは、札幌駅北口から北海道中央バス［188］、札幌駅前・大通公園から［環88］（サッポロビール博物館 公式のアクセス）
 * 出典: サッポロビール博物館 アクセス https://www.sapporobeer.jp/brewery/s_museum/access/
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-431e-83518f0d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "83518f0d-2bb9-44db-a3f1-bf8193c73dcf";
const DAY2_ID = "d6460354-db24-4320-bc2e-ae73b71008f4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const want = ["二条市場", "さっぽろテレビ塔", "札幌市時計台", "すすきの", "サッポロビール博物館", "豊平館", "中島公園"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("2日目が想定と違います");
  const [nijo, tv, tokei, susukino, beer, hoheikan, nakajima] = day.spots;

  const beerMemo = rep(
    rep(beer.memo ?? "", "すすきのからタクシーでサッポロビール博物館へ。", "時計台から札幌駅へ歩き、北海道中央バスでサッポロビール博物館へ。"),
    "北海道の開拓とビールの歴史にふれたら、札幌の中心部へ戻りましょう。", "見学のあとは、このあたりで昼食にしましょう。");
  const susukinoMemo = rep(
    rep(susukino.memo ?? "", "時計台から南へ歩いて、すすきのへ。", "ビール博物館からバスで大通公園のほうへ戻り、南へ歩いてすすきのへ。"),
    "など、ラーメンの店が並ぶ一角もあるので、ここで昼食にしましょう。", "など、ラーメンの店が並ぶ一角もあります。");
  const hoheikanMemo = rep(hoheikan.memo ?? "", "ビール博物館からバスで札幌駅へ戻り、地下鉄南北線で中島公園駅へ。中島公園の中に建つ豊平館は、", "すすきのから南へ歩いて、中島公園の中に建つ豊平館へ。");

  const order = [
    { id: nijo.id, data: {} },
    { id: tv.id, data: {} },
    { id: tokei.id, data: {} },
    { id: beer.id, data: { memo: beerMemo, visitTime: t(11, 50), stayDurationMin: 75, transitMode: "bus", transitDurationMin: 20, transitLine: "北海道中央バス" } },
    { id: susukino.id, data: { memo: susukinoMemo, visitTime: t(13, 40), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 35, transitLine: "北海道中央バス" } },
    { id: hoheikan.id, data: { memo: hoheikanMemo, visitTime: t(14, 50), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 20, transitLine: null } },
    { id: nakajima.id, data: { visitTime: t(15, 45), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5 } },
  ];
  console.log(`ビール博物館: ${beerMemo}`);
  console.log(`すすきの: ${susukinoMemo}`);
  console.log(`豊平館: ${hoheikanMemo.slice(0, 80)}…`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY2_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
