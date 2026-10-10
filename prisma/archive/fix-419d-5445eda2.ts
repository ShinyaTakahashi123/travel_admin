/**
 * #419 5445eda2 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 16:30まで、昼食の時間、帰りの一言）
 * 1日目: …武蔵一宮氷川神社 → 氷川参道（大宮駅のあたりで昼食）→（ニューシャトル）鉄道博物館 14:15〜16:35
 *   昼食が鉄道博物館の13:35からで遅かったので、参道を歩いたあと大宮駅のあたりで昼食にし、鉄道博物館は昼食のあと14:15から（滞在は前の150分から140分に）
 *   鉄道博物館の名前の「（昼食）」を外し、最後に帰りの一言。説明文も合わせる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-419d-5445eda2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "5445eda2-d558-41e6-96ff-7a0987c42d2b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const sando = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "氷川参道" });
  const museum = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "鉄道博物館（昼食）" });
  const sandoMemo = rep(sando.memo ?? "", "散策しながら、大宮駅の方へ歩きましょう。", "散策しながら大宮駅の方へ歩き、駅のあたりで昼食にしましょう。");
  const museumMemo = rep(
    rep(museum.memo ?? "", "参道を歩いて大宮駅へ出て、ニューシャトルで鉄道博物館駅へ。", "昼食のあとは、大宮駅からニューシャトルで鉄道博物館駅へ。"),
    "駅弁屋や食堂車をテーマにしたレストランもあるので、ここで昼食にしましょう。", "駅弁屋や食堂車をテーマにしたレストランもあります。")
    + "さいたまの定番をめぐる旅を、ここで締めくくりましょう。帰りは、ニューシャトルで大宮駅へ戻ります。";
  const description = rep(it.description ?? "", "ケヤキ並木の氷川参道を歩いて、鉄道博物館で昼食と鉄道の展示を楽しむ、", "ケヤキ並木の氷川参道を歩いて大宮駅のあたりで昼食をとり、鉄道博物館で鉄道の展示を楽しむ、");
  console.log(`説明文: ${description}`);
  console.log(`参道: …${sandoMemo.slice(-40)}`);
  console.log(`鉄道博物館: ${museumMemo.slice(0, 40)}…${museumMemo.slice(-60)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: sando.id }, { memo: sandoMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: museum.id }, { name: "鉄道博物館", memo: museumMemo, visitTime: t(14, 15), stayDurationMin: 140, transitDurationMin: 15 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
