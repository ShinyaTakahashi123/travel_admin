/**
 * #215 c10810bd の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営・法務の指摘）
 * 企画運営: 新潮社記念文学館の55分は長い → 35分にし、空いた時間に武家屋敷通りの公開されている屋敷を足す。
 *   西宮家は公式の観光協会のページがなく（お店の扱い）、蔵のレストランや店が中心なので入れず、OSM の点と公式のページがある次の2軒にする:
 *   岩橋家 https://tazawako-kakunodate.com/spots/6061/ （芦名氏の重臣・のち佐竹北家・江戸末期に改造・茅葺きから木羽葺き・中級武士の典型的な間取り・樹齢300年前後と推定される柏の木・入館無料）
 *     座標 OSM node 2598170929「武家屋敷岩橋家」
 *   松本家 https://tazawako-kakunodate.com/spots/6066/ （県指定有形文化財・今宮家組下・門柱2本と柴垣の簡素な形式・建築は幕末ごろといわれる・茅葺き・春から秋はイタヤ細工の実演・
 *     公開 4月10日〜11月10日 9:00〜16:00・入館無料）座標 OSM node 2598309158「武家屋敷松本家」
 *   樺細工伝承館 14:15〜15:05（50分）→ 岩橋家 15:10〜15:30 → 松本家 15:35〜15:55 →（田町を歩いて20分）新潮社記念文学館 16:15〜16:50
 * 法務: 石黒家の「唯一」を伝聞（〜とされる）に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-215b-c10810bd.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY_ID = "a38df1a2-c02e-4010-9187-ed0c0549f8d2";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const HOMES = "今も人が暮らす家が並ぶ通りです。家の敷地に入ったり、住む人を撮ったりしないようにしましょう。";
const ISHI_FROM = "角館の武家屋敷の中で唯一、直系の子孫の家族が今も母屋に住み続けている屋敷で、";
const ISHI_TO = "角館の武家屋敷の中で唯一、直系の子孫の家族が今も母屋に住み続けているとされる屋敷で、";
const BUN_FROM = "伝承館から、町の南の田町の武家屋敷通りを通って、歩いて約20分。";
const BUN_TO = "松本家から、町の南の田町の武家屋敷通りを通って、歩いて約20分。";
const IWAHASHI = {
  name: "岩橋家", visitTime: t(15, 10), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null,
  lat: 39.598668, lng: 140.5627876, address: "秋田県仙北市角館町東勝楽丁3-1",
  memo: "伝承館から歩いて約5分。芦名氏の重臣で、芦名氏が絶えたあとは佐竹北家に仕えた家柄の屋敷です。江戸時代の終わりに改造され、屋根も茅葺きから木羽葺きに変わって今の形になりました。角館の中級武士の屋敷の典型的な間取りを残し、樹齢300年前後と推定される柏の木がこの家のしるしです。" + HOMES,
};
const MATSUMOTO = {
  name: "松本家", visitTime: t(15, 35), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 5, transitLine: null,
  lat: 39.5982059, lng: 140.5613494, address: "秋田県仙北市角館町小人町4",
  memo: "岩橋家から歩いて約5分。佐竹氏の国替えとともに秋田へ移ってきた家柄の屋敷で、県の有形文化財に指定されています。門柱を2本立て、柴垣で囲んだ簡素な屋敷で、建てられたのは幕末ごろといわれ、茅葺きの屋根に武家の面影を残します。春から秋には、イタヤ細工の実演も行われています。公開の期間と時間は公式の案内で確かめましょう。",
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
  const names = spots.map((s) => s.name).join();
  if (names !== "桧木内川堤,武家屋敷通り（内町）,石黒家,角館歴史村・青柳家,平福記念美術館,角館樺細工伝承館,新潮社記念文学館") throw new Error(`構成が想定と違います: ${names}`);
  const by = Object.fromEntries(spots.map((s) => [s.name, s]));
  if (!by["石黒家"].memo?.includes(ISHI_FROM) || !by["新潮社記念文学館"].memo?.startsWith(BUN_FROM)) throw new Error("本文が想定と違います");
  const items = [
    ...spots.slice(0, 2).map((s) => ({ id: s.id, data: {} })),
    { id: by["石黒家"].id, data: { memo: by["石黒家"].memo!.replace(ISHI_FROM, ISHI_TO) } },
    { id: by["角館歴史村・青柳家"].id, data: {} },
    { id: by["平福記念美術館"].id, data: {} },
    { id: by["角館樺細工伝承館"].id, data: { stayDurationMin: 50 } },
    { create: IWAHASHI },
    { create: MATSUMOTO },
    { id: by["新潮社記念文学館"].id, data: { visitTime: t(16, 15), stayDurationMin: 35, memo: by["新潮社記念文学館"].memo!.replace(BUN_FROM, BUN_TO) } },
  ];
  console.log("伝承館 14:15〜15:05 → 岩橋家 15:10〜15:30 → 松本家 15:35〜15:55 → 文学館 16:15〜16:50\n石黒家: …" + ISHI_TO);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY_ID, items as never, { tx }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
