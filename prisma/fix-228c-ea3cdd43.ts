/**
 * #228 ea3cdd43 の直し（しおりえ(制作補助2)、企画運営・法務の指摘 10/11）
 * - 会津武家屋敷: 150分は長いので95分（昼食・屋敷・資料館）に。絵付け体験は紹介だけにする（企画運営）
 * - 阿弥陀寺を14:40から40分にし、最後に七日町通りを足す（会津若松観光ナビ モデルコース https://www.aizukanko.com/course/778 ：
 *   藩政時代は日光・越後・米沢街道の主要道路が通る城下の西の玄関口・問屋や旅籠、料理屋が並んだ・蔵が建ち並ぶ大正浪漫の通り）
 *   座標は OSM の道路「七日町通り」way 44769537 の Nominatim の中心
 * - 飯盛山: 亡くなった人の年齢（16〜17歳）を書かない（法務）
 * - 東山温泉: 「奥羽三楽郷のひとつに数えられ」→「ひとつとされ」（法務）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-228c-ea3cdd43.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ea3cdd43-7a1b-42cd-9f79-74d123ffc6d9";
const DAY2 = "0f247ec5-61cc-432c-8c7b-9569815e25ea";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const BUS = "会津バス まちなか周遊バス";
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

function rep(memo: string, from: string, to: string, name: string) {
  if (!memo.includes(from)) throw new Error(`${name}: 本文が想定と違います: ${from}`);
  return memo.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  const all = it.days.flatMap((d) => d.spots);
  const get = (n: string) => { const s = all.filter((x) => x.name === n); if (s.length !== 1) throw new Error(`${n}: 見つかりません`); return s[0]; };
  const buke = get("会津武家屋敷"), amida = get("阿弥陀寺"), iimori = get("飯盛山"), higashi = get("東山温泉");
  const d2 = it.days[1].spots;
  if (it.days[1].id !== DAY2 || d2[d2.length - 1].id !== amida.id || d2.some((s) => s.name === "七日町通り")) throw new Error("構成が想定と違います");

  const bukeMemo = rep(buke.memo ?? "", "赤べこや起上り小法師の絵付けも体験できます。", "赤べこや起上り小法師の絵付けの体験もできます。", "武家屋敷");
  const amidaMemo = rep(amida.memo ?? "", PRAY + "帰りは、すぐそばのJR七日町駅から列車で会津若松駅へ向かいましょう。", PRAY, "阿弥陀寺");
  const iimoriMemo = rep(iimori.memo ?? "", "16〜17歳の少年たちで編成された", "少年たちで編成された", "飯盛山");
  const higashiMemo = rep(higashi.memo ?? "", "奥羽三楽郷のひとつに数えられ", "奥羽三楽郷のひとつとされ", "東山温泉");
  const nanoka = {
    name: "七日町通り", visitTime: t(15, 25), stayDurationMin: 65, lat: 37.5011455, lng: 139.9184378, address: "福島県会津若松市七日町",
    memo: "阿弥陀寺から歩いてすぐの通りへ（約5分）。藩政時代には日光・越後・米沢の街道が通る城下の西の玄関口で、問屋や旅籠、料理屋が軒を連ねていました。今も蔵や洋風の古い建物が並び、大正浪漫の雰囲気が残る通りを、ゆっくり歩いて楽しめます。通りには今も人が暮らし、商いをしているので、静かに歩きましょう。帰りは、通りの西の端のJR七日町駅から列車で会津若松駅へ向かいましょう。",
    transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
  };
  console.log(`武家屋敷: 12:40 滞在95分\n${bukeMemo}\n\n阿弥陀寺: 14:40 滞在40分 bus25\n${amidaMemo}\n\n七日町通り（新規）: 15:25 滞在65分 walk5\n${nanoka.memo}\n\n飯盛山: ${iimoriMemo}\n\n東山温泉: ${higashiMemo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.spot.update({ where: { id: iimori.id }, data: { memo: iimoriMemo } });
      await tx.spot.update({ where: { id: higashi.id }, data: { memo: higashiMemo } });
      await setDaySpotOrder(DAY2, [
        ...d2.filter((s) => s.id !== buke.id && s.id !== amida.id).map((s) => ({ id: s.id, data: {} })),
        { id: buke.id, data: { stayDurationMin: 95, memo: bukeMemo } },
        { id: amida.id, data: { visitTime: t(14, 40), stayDurationMin: 40, memo: amidaMemo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 25, transitLine: BUS }] } } },
        { create: nanoka },
      ], { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
