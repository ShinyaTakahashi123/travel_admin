/**
 * #497 d1855002 の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営・法務の指摘）
 * 企画運営: 3日目の最後「石垣港離島ターミナル周辺」は港での滞在（決まりA）なので、実在の行き先「730記念碑」に替える。帰りの一言はそこへ
 *   出典: 石垣市観光交流協会 https://yaeyama.or.jp/730%E8%A8%98%E5%BF%B5%E7%A2%91/ （1978年7月30日に右側通行から左側通行へ・米軍の占領下で右側通行・1972年5月15日の復帰後も約6年続いた・美崎町3）
 *   座標: OSM node 550001513（730記念碑）。もとのスポットと写真（石垣港の写真）は外す（写真は Cascade で消える。写真の控えのキーは石垣港として正しいので残す）
 * 法務: ①「ユーグレナモール」は通りの名前を会社名にしたもの（ネーミングライツ）なので書かない ②権現堂「唯一残るとされる」 ③やいま村に動物の一文
 *   （任意）水牛車に乗り降りの一文
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-497c-d1855002.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d1855002-4a6f-49db-a684-3d014966ad0a";
const DAY3_ID = "cb90dd3c-90e1-4d8c-b579-775526d3a2d9";
const PORT_ID = "45396cb5-eea5-45c8-b8c2-83d52d99c5f1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const EDITS: { dayNumber: number; spotName: string; from: string; to: string }[] = [
  { dayNumber: 3, spotName: "石垣市公設市場", from: "アーケードの商店街・ユーグレナモールの中にある市場で", to: "アーケードの商店街の中にある市場で" },
  { dayNumber: 3, spotName: "桃林寺・権現堂", from: "唯一残る近世の社寺建築として", to: "唯一残るとされる近世の社寺建築として" },
  { dayNumber: 1, spotName: "石垣やいま村", from: "カンムリワシの保護展示もあります。", to: "カンムリワシの保護展示もあります。動物とふれあうときは、係員の案内に従いましょう。" },
  { dayNumber: 2, spotName: "水牛車観光", from: "水牛に引かれた車に乗り、赤瓦の集落の中をゆっくりめぐりましょう。", to: "水牛に引かれた車に乗り、赤瓦の集落の中をゆっくりめぐりましょう。水牛を驚かせないよう、乗り降りは案内に従いましょう。" },
];

const MONUMENT = {
  name: "730記念碑",
  visitTime: t(16, 15), stayDurationMin: 30, transitMode: "car", transitDurationMin: 10, transitLine: null,
  lat: 24.3382501, lng: 124.1577436, address: "沖縄県石垣市美崎町3",
  memo: "祈念館から車で、市街地の中心の730交差点へ。交差点のわきに立つ730（ななさんまる）記念碑は、1978年7月30日に、車の通行が右側から左側に変わったことを記念して建てられました。戦後、沖縄は米軍の占領下で右側通行となり、1972年5月15日に日本に復帰したあとも、約6年のあいだ右側通行が続いていました。近くのアーケードの商店街では、お土産も探せます。交差点のまわりは車の通りが多いので、歩道から見学しましょう。このあとはレンタカーを返して、新石垣空港から帰りの飛行機に乗りましょう。",
};

async function main() {
  const plan: { id: string; memo: string; name: string }[] = [];
  for (const e of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: e.dayNumber, spotName: e.spotName });
    if (!s.memo?.includes(e.from)) throw new Error(`本文が想定と違います: ${e.spotName}`);
    plan.push({ id: s.id, memo: s.memo.replace(e.from, e.to), name: e.spotName });
  }
  const day3 = await prisma.spot.findMany({ where: { dayId: DAY3_ID }, orderBy: { orderNo: "asc" }, select: { id: true, name: true } });
  if (day3.length !== 8 || day3[7].id !== PORT_ID) throw new Error("3日目の構成が想定と違います");
  for (const p of plan) console.log(`\n${p.name}: ${p.memo}`);
  console.log(`\n3日目の最後: ${day3[7].name} を外し、${MONUMENT.name} 16:15-16:45（車10分）を入れる\n${MONUMENT.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      for (const p of plan) await tx.spot.update({ where: { id: p.id }, data: { memo: p.memo } });
      await setDaySpotOrder(DAY3_ID, [...day3.slice(0, 7).map((s) => ({ id: s.id, data: {} })), { create: MONUMENT }], { remove: [PORT_ID], tx });
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
