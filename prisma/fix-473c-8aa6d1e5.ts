/**
 * #473 8aa6d1e5 の追いの直し（しおりえ(制作補助2)、企画運営の指摘 9/30 20:08）
 *   山本有三記念館: 吉祥寺の宿からの朝の行き方を書く（三鷹市 https://www.city.mitaka.lg.jp/c_faq/061/061515.html 「JR三鷹駅南口から徒歩12分」）
 *   禅林寺: 「静かに」が2回続くので1つにまとめる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-473c-8aa6d1e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8aa6d1e5-c110-4e37-b4fa-916fc19c8417";
const COMMIT = process.argv.includes("--commit");

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const yuzo = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "三鷹市山本有三記念館" });
  const zen = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "禅林寺" });
  const yuzoMemo = rep(yuzo.memo ?? "", "旅の2日目は、玉川上水沿いの三鷹市山本有三記念館へ。", "旅の2日目は、吉祥寺駅からJR中央線でひと駅の三鷹駅へ。南口から歩いて約12分の、玉川上水沿いの三鷹市山本有三記念館へ。");
  const zenMemo = rep(zen.memo ?? "", "墓所のまわりでは静かに見学しましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。", "今も祈りが続く場所ですので、墓所のまわりでも静かに、敬意をもってお参りください。");
  console.log(yuzoMemo.slice(0, 90));
  console.log(zenMemo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: yuzo.id }, { memo: yuzoMemo }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: zen.id }, { memo: zenMemo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
