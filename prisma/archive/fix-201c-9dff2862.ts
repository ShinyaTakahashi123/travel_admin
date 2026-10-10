/**
 * #201 9dff2862 の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘）
 * 1. めがね橋の55分は水増し（橋を眺めて道の駅の展示を見るだけ）なので25分に（15:35〜16:00）。空いた時間は、遠野駅へ戻る途中の市街地の
 *    実在の行き先「遠野蔵の道ギャラリー」（4〜11月は9時〜17時）を足す（16:30〜16:55、車30分）。帰りの一言はギャラリーへ移す
 *    出典: https://tonojikan.jp/tourism/tono-kuranomichi-gallery/ （蔵を生かしたギャラリー・昭和を思わせる休憩スペース・南部ばやしの衣装の展示・季節の写真展など・中央通り4-28）
 *    座標: OSM に点がないので、国土地理院の住所検索（中央通り4番28号の番地の点 39.331295,141.528061）
 * 2. 書き出しに移動の分数を入れる（道の駅・馬の里・八幡宮・五百羅漢・卯子酉神社・ふるさと村・伝承園）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-201c-9dff2862.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9dff2862-bb91-4d25-847e-62f2267f18de";
const DAY_IDS = ["4081ec1a-9f1e-4d2f-9461-43d88b071b9c", "3e842819-542c-4d9a-94b9-821093a3f5f8"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const REPS: [number, string, string, string][] = [
  [1, "道の駅遠野風の丘", "鍋倉公園から車で西へ。", "鍋倉公園から車で約20分、市街地の西へ。"],
  [1, "遠野馬の里", "道の駅から車で北東へ。", "道の駅から車で約20分、北東へ。"],
  [1, "遠野郷八幡宮", "馬の里から車で南へ。", "馬の里から車で約10分、南へ。"],
  [1, "五百羅漢", "八幡宮から車で市街地の西へ。", "八幡宮から車で約15分、市街地の西へ。"],
  [1, "卯子酉神社", "五百羅漢から車ですぐ。", "五百羅漢から車で約5分。"],
  [2, "遠野ふるさと村", "早池峯神社から車で南へ。", "早池峯神社から車で約15分、南へ。"],
  [2, "伝承園", "ふるさと村から車で土淵へ。", "ふるさと村から車で約15分、土淵へ。"],
];
const MEGANE_FROM = "見学のあとは、車で遠野駅へ戻ってレンタカーを返しましょう。返す時間は公式の案内で確かめておきましょう。";

const GALLERY = {
  name: "遠野蔵の道ギャラリー", visitTime: t(16, 30), stayDurationMin: 25, transitMode: "car", transitDurationMin: 30, transitLine: null,
  lat: 39.331295, lng: 141.528061, address: "岩手県遠野市中央通り4-28",
  memo: "めがね橋から車で約30分、遠野の市街地へ戻ります。蔵を生かしてつくられたギャラリーで、昭和を思わせる休憩スペースや、遠野の郷土芸能・南部ばやしの衣装の展示があり、奥のギャラリーでは季節に合わせた写真展などが開かれています。休館日は公式の案内で確かめましょう。見学のあとは、遠野駅の近くでレンタカーを返し、JRで帰りましょう。返す時間は公式の案内で確かめておきましょう。",
};

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.map((d) => d.id).join() !== DAY_IDS.join()) throw new Error("日の構成が想定と違います");
  const updates: { id: string; memo: string }[] = [];
  for (const [dn, name, a, b] of REPS) {
    const s = days[dn - 1].spots.find((x) => x.name === name);
    if (!s?.memo?.includes(a)) throw new Error(`${name}: 本文が想定と違います`);
    updates.push({ id: s.id, memo: s.memo.replace(a, b) });
    console.log(`${name}: ${a} → ${b}`);
  }
  const d2 = days[1].spots;
  const megane = d2[d2.length - 1];
  if (megane.name !== "めがね橋（宮守川橋梁）" || !megane.memo?.includes(MEGANE_FROM) || megane.stayDurationMin !== 55) throw new Error("めがね橋が想定と違います");
  const meganeMemo = megane.memo.replace(MEGANE_FROM, "");
  console.log(`\nめがね橋 15:35-16:00: ${meganeMemo}\n\n${GALLERY.name} 16:30-16:55: ${GALLERY.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      for (const u of updates) await tx.spot.update({ where: { id: u.id }, data: { memo: u.memo } });
      await setDaySpotOrder(DAY_IDS[1], [
        ...d2.slice(0, -1).map((s) => ({ id: s.id, data: {} })),
        { id: megane.id, data: { stayDurationMin: 25, memo: meganeMemo } },
        { create: GALLERY },
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
