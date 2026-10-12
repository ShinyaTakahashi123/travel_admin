/**
 * #425 6e2f29bb の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 2日目: 城崎温泉ロープウェイ → 温泉寺 → 鴻の湯 → 地蔵湯 →（昼食）→ 極楽寺（新規）→（バス）日和山海岸（新規）→ 城崎マリンワールド（新規）（7か所 09:10〜16:30）
 *   さとの湯は建て替えで2024年4月から長期休業中（豊岡市）なので入れない
 *   城崎マリンワールドは今日の営業 9:30〜16:30、入場は閉館の30分前まで、休園日あり（公式）。15:05着で間に合う。本文には時刻を書かない
 *   城崎温泉駅・地蔵湯公園前から日和山へは全但バス（約10分）
 * 本文の出典: 城崎温泉観光協会 https://kinosaki-spa.gr.jp/facility/gokurakuji/ （極楽寺）・/facility/hiyoriyama-kaigan/ （日和山海岸）、城崎マリンワールド https://www.marineworld.hiyoriyama.co.jp/ 、
 *   豊岡市 https://www.city.toyooka.lg.jp/kanko/1025164/1025178.html （さとの湯 長期休業）、バス: ジョルダン 全但バス 城崎・日和山線
 * 座標の出典: 地理院の住所検索（極楽寺「城崎町湯島801」35.623489,134.806549）、OSM/Overpass（日和山（マリンワールド）バス停 node 7947246375 35.655224,134.825798）、
 *   Nominatim（城崎マリンワールド 35.6557822,134.8240505）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-425c-6e2f29bb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6e2f29bb-45c2-494a-83c1-8e42e11552c1";
const DAY2_ID = "aa643f2b-6bf0-406f-a4b1-a44cf0c234f8";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["城崎温泉ロープウェイ", "温泉寺", "鴻の湯", "地蔵湯"].join()) throw new Error("2日目が想定と違います");
  const jizo = day.spots[3];
  const from = "旅の最後の湯で温まってから、城崎温泉駅へ向かいましょう。";
  if (!jizo.memo?.includes(from)) throw new Error("地蔵湯の本文が想定と違います");
  const jizoMemo = jizo.memo.replace(from, "湯で温まったら、温泉街で昼食にしましょう。");

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: jizo.id, data: { memo: jizoMemo } },
    { create: { name: "極楽寺", visitTime: t(13, 30), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 35.623489, lng: 134.806549, address: "兵庫県豊岡市城崎町湯島801",
      memo: "昼食のあとは、温泉街の西南のすみ、ロープウェイ乗り場の手前の奥まったところにある極楽寺へ。阿弥陀如来を本尊とする寺で、応永年間（1394〜1427年）のころに金山明昶という禅師が開いたと伝えられています。境内には枯山水の石庭があり、寺の裏には、道智上人が修行の際に手にしていた独鈷で壁をついて得たといわれる清水「独鈷水」が湧いています。" + RESPECT } },
    { create: { name: "日和山海岸", visitTime: t(14, 30), stayDurationMin: 30, transitMode: "bus", transitDurationMin: 30, transitLine: null, lat: 35.655224, lng: 134.825798, address: "兵庫県豊岡市瀬戸",
      memo: "極楽寺から温泉街を歩いてバス停へ向かい、全但バスで日和山海岸へ（乗車は約10分）。円山川の河口から竹野海岸の東まで続くリアス式海岸で、山陰海岸国立公園に指定されています。沖に浮かぶ無人島「後ヶ島（のちがしま）」は、浦島太郎が玉手箱を開けた場所という言い伝えが残る島です。海岸の岩場や柵のない場所では、足元に気をつけましょう。" } },
    { create: { name: "城崎マリンワールド", visitTime: t(15, 5), stayDurationMin: 85, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 35.655782, lng: 134.824051, address: "兵庫県豊岡市瀬戸",
      memo: "旅の締めくくりは、日和山海岸に面した城崎マリンワールドへ。イルカやアシカのショー、アジ釣りなどの体験が楽しめる水族館で、日和山海岸について知ることができる「日和山海岸ミュージアム」もあります。ショーや体験の時間は日によって変わり、休園日もあるので、公式の案内で確かめてから出かけましょう。帰りは、バスで城崎温泉駅へ戻ります。" } },
  ];
  console.log("2日目: ロープウェイ 09:10 → 温泉寺 → 鴻の湯 → 地蔵湯 11:55〜12:40 →（昼食）→ 極楽寺 13:30〜14:00 →（バス）日和山海岸 14:30〜15:00 → 城崎マリンワールド 15:05〜16:30");
  console.log(`地蔵湯の最後: …${jizoMemo.slice(-50)}`);
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
