/**
 * #420 550bf094 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 最終日も16:30まで、宿・昼食・帰りの一言）
 *   - なんばグランド花月: 本文に会社名（吉本興業・吉本の芸人・吉本新喜劇）が入っていたので外す（書き方の決まり）
 *   - 道頓堀（1日目の最後）に宿の一言、新世界に昼食の一言
 *   - 2日目: 四天王寺のあと、天王寺公園の慶沢園（新規）15:40〜16:30、最後に帰りの一言。説明文も合わせる
 *   慶沢園は 9:30〜17:00（入園は閉園の30分前まで）・月曜休園（OSAKA-INFO）。本文に時刻・曜日は書かない
 * 本文の出典: OSAKA-INFO https://osaka-info.jp/spot/keitakuen-garden/ （慶沢園）
 * 座標の出典: OSM（慶沢園 way 765953897 34.649714,135.511346）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-420c-550bf094.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "550bf094-cd88-4920-8866-26c35fcba842";
const DAY2_ID = "b3f4b200-fe6c-4201-9354-eb65465e8a64";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const ngk = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "なんばグランド花月" });
  const ngkMemo = rep(rep(rep(ngk.memo ?? "",
    "吉本興業のお笑い文化の発信拠点となっている劇場", "大阪のお笑い文化の発信拠点となっている劇場"),
    "ベテランから若手まで、吉本の芸人のお笑いを生で見られ、「吉本新喜劇」は週替わりの新作が上演されています。", "ベテランから若手まで、芸人のお笑いを生で見られ、喜劇は週替わりの新作が上演されています。"),
    "レトロ調の館内", "レトロ調の館内");
  if (/吉本/.test(ngkMemo)) throw new Error("会社名が残っています");
  const doton = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "道頓堀" });
  const dotonMemo = rep(doton.memo ?? "", "夕方のにぎわいを楽しみながら、1日目を締めくくりましょう。", "夕方のにぎわいを楽しみながら、1日目を締めくくりましょう。今夜は大阪に泊まります。");

  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["心斎橋筋商店街", "アメリカ村", "難波八阪神社", "通天閣", "新世界", "四天王寺"].join()) throw new Error("2日目が想定と違います");
  const shin = day.spots[4];
  const shinMemo = rep(shin.memo ?? "", "串カツをかじったら、最後は四天王寺へ向かいましょう。", "串カツなどで昼食にしたら、四天王寺へ向かいましょう。");
  const description = rep(it.description ?? "", "最後は聖徳太子ゆかりの四天王寺へ。", "聖徳太子ゆかりの四天王寺にお参りし、最後は天王寺公園の日本庭園・慶沢園へ。");

  const order = [
    ...day.spots.slice(0, 4).map((s) => ({ id: s.id, data: {} })),
    { id: shin.id, data: { memo: shinMemo } },
    { id: day.spots[5].id, data: {} },
    { create: { name: "慶沢園", visitTime: t(15, 40), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 34.649714, lng: 135.511346, address: "大阪府大阪市天王寺区",
      memo: "四天王寺から歩いて、天王寺公園の中にある慶沢園へ。大正時代に、大阪の豪商・住友家の本邸の庭園として造られた、純日本風の林泉回遊式庭園です。大正15年（1926年）に、本邸とともに大阪市へ寄贈されました。中島を浮かべた大池を中心に、三方に築山を築いて変化のある景色をつくっています。大阪市の指定文化財です。休園日は公式の案内で確かめましょう。池のまわりでは足元に気をつけましょう。大阪の食い倒れと下町情緒をめぐる旅を、ここで締めくくりましょう。帰りは、天王寺駅から。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`花月: ${ngkMemo}`);
  console.log(`道頓堀: …${dotonMemo.slice(-40)}`);
  console.log(`新世界: …${shinMemo.slice(-40)}`);
  console.log("2日目: …四天王寺 14:25〜15:25 →（歩き15分）慶沢園 15:40〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: ngk.id }, { memo: ngkMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: doton.id }, { memo: dotonMemo }, { tx });
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
