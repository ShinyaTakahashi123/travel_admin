/**
 * #411 2afa2584 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 最終日も16:30まで、宿・帰り・車の一言）
 * 2日目（車）: 樺崎八幡宮 → ココ・ファーム・ワイナリー → あしかがフラワーパーク（昼食）→ 栗田美術館 →（車25分）佐野厄除け大師（新規）（5か所 09:00〜16:30）
 *   1日目の最後（渡良瀬橋）に宿の一言、2日目の最初（樺崎八幡宮）に車の一言、最後に帰りの一言。説明文にも佐野厄除け大師を入れる
 * 本文の出典: 佐野市観光協会 https://sano-kankokk.jp/?sightseeing=03-2 （佐野厄除け大師）
 * 座標の出典: OSM/Overpass（佐野厄除け大師 way 77889922 36.310859,139.571891）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-411d-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const DAY2_ID = "64e974e3-6585-489c-9892-a7f9c54259e5";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const bridge = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "渡良瀬橋" });
  const bridgeMemo = rep(bridge.memo ?? "", "夕暮れの景色を楽しみましょう。", "夕暮れの景色を楽しみましょう。今夜は足利に泊まります。");
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["樺崎八幡宮", "ココ・ファーム・ワイナリー", "あしかがフラワーパーク（昼食）", "栗田美術館"].join()) throw new Error("2日目が想定と違います");
  const [kaba, coco, flower, kurita] = day.spots;
  const kabaMemo = "2日目は車（レンタカーなど）でめぐります。まずは樺崎八幡宮へ。" + (kaba.memo ?? "");
  const description = rep(it.description ?? "", "伊万里・鍋島の栗田美術館へ。", "伊万里・鍋島の栗田美術館、隣の佐野市の佐野厄除け大師へ。");

  const order = [
    { id: kaba.id, data: { memo: kabaMemo } },
    { id: coco.id, data: {} },
    { id: flower.id, data: {} },
    { id: kurita.id, data: {} },
    { create: { name: "佐野厄除け大師", visitTime: t(15, 45), stayDurationMin: 45, transitMode: "car", transitDurationMin: 25, transitLine: null, lat: 36.310859, lng: 139.571891, address: "栃木県佐野市金井上町2233",
      memo: "栗田美術館から車で、隣の佐野市の佐野厄除け大師へ。天慶7年（944年）に奈良の僧・宥尊上人が開いたとされる寺で、厄除けの元三慈恵大師をまつり、厄除けや方位除けの祈願が続けられています。徳川家康の遺骨を久能山から移す際に、この寺で一泊したと伝えられるなど、徳川幕府とのゆかりも深い寺です。お正月には大祭が行われます。" + RESPECT + "足利と佐野の歴史と文化をめぐる旅を、ここで締めくくりましょう。帰りは、レンタカーを返す場所まで安全運転で。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`渡良瀬橋: …${bridgeMemo.slice(-40)}`);
  console.log(`樺崎八幡宮: ${kabaMemo.slice(0, 50)}…`);
  console.log("2日目: 樺崎八幡宮 09:00 → ココ・ファーム → フラワーパーク（昼食）→ 栗田美術館 13:50〜15:20 →（車25分）佐野厄除け大師 15:45〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: bridge.id }, { memo: bridgeMemo }, { tx });
    await setDaySpotOrder(DAY2_ID, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
