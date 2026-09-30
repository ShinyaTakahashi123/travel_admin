/**
 * #432 87674ca9 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」、帰りの一言、各日の昼食）
 * 2日目（車）: 英虞湾めぐりの遊覧船（賢島）→ 西山慕情が丘 → 志摩大橋 → ビン玉ロード →（浜島で昼食）→ 伊雑宮（新規）→ 伊勢神宮 内宮（新規）（6か所 09:30〜16:30）
 *   内宮・別宮の参拝時間は、いちばん短い10〜12月でも午後5時まで（神宮 公式）。本文に時刻は書かない
 * 本文の出典: 伊勢神宮 https://www.isejingu.or.jp/about/naiku/ （内宮）・https://www.isejingu.or.jp/about/outerbetsugu/ （伊雑宮・参拝時間）
 * 座標の出典: OSM/Overpass（伊勢神宮 内宮 way 555110597 34.456840,136.724025／伊雑宮 境内の案内板「皇大神宮別宮 伊雑宮」node 7660246408 34.380084,136.810024。
 *   伊雑宮の社殿そのものの点は OSM にないので、境内の案内板の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-432b-87674ca9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "87674ca9-f370-4383-9108-f19d9f510274";
const DAY2_ID = "25df8673-7102-42fa-9355-a28a394d5f07";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.map((s) => s.name).join() !== ["英虞湾めぐりの遊覧船（賢島）", "西山慕情が丘", "志摩大橋", "ビン玉ロード"].join()) throw new Error("2日目が想定と違います");
  const bin = day.spots[3];
  const m = bin.memo ?? "";
  // 最後の一文（旅の結び）を、昼食の一言に置き換える
  const idx = m.lastIndexOf("。", m.length - 2);
  const oldTail = m.slice(idx + 1);
  if (!/締めくくり|旅/.test(oldTail)) throw new Error(`ビン玉ロードの最後の文が想定と違います: ${oldTail}`);
  const binMemo = m.slice(0, idx + 1) + "このあと、浜島のあたりで昼食にしましょう。";

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: bin.id, data: { memo: binMemo } },
    { create: { name: "伊雑宮", visitTime: t(14, 35), stayDurationMin: 30, transitMode: "car", transitDurationMin: 35, transitLine: null, lat: 34.380084, lng: 136.810024, address: "三重県志摩市磯部町上之郷",
      memo: "昼食のあとは、車で志摩市磯部町の伊雑宮へ。天照大御神の御魂をまつる内宮の別宮で、「いぞうぐう」とも呼ばれます。古くから「遙宮（とおのみや）」として崇敬を集め、地元の人々によって海の幸・山の幸の豊かな実りが祈られてきました。毎年6月に行われる御田植式は、「磯部の御神田（おみた）」の名で国の重要無形民俗文化財に指定され、日本三大御田植祭の一つとされています。" + RESPECT } },
    { create: { name: "伊勢神宮 内宮", visitTime: t(15, 35), stayDurationMin: 55, transitMode: "car", transitDurationMin: 30, transitLine: null, lat: 34.45684, lng: 136.724025, address: "三重県伊勢市宇治館町",
      memo: "旅の締めくくりは、伊勢市の伊勢神宮 内宮へ。正式には皇大神宮といい、およそ2000年前、垂仁天皇の御代から五十鈴川のほとりにまつられている、天照大御神をおまつりするお宮です。入口の宇治橋を渡り、玉砂利を敷き詰めた長い参道を進んで、正宮へお参りしましょう。参拝できる時間は季節によって変わるので、公式の案内で確かめましょう。" + RESPECT + "英虞湾の海と伊勢の森をめぐった旅を、ここで締めくくりましょう。帰りも安全運転で。" } },
  ];
  console.log(`ビン玉ロードの最後（前）: ${oldTail}`);
  console.log(`ビン玉ロードの最後（後）: …${binMemo.slice(-40)}`);
  console.log("2日目: 遊覧船 09:30 → 西山慕情が丘 → 志摩大橋 → ビン玉ロード 12:30〜13:10 →（浜島で昼食）→（車35分）伊雑宮 14:35〜15:05 →（車30分）伊勢神宮 内宮 15:35〜16:30");
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
