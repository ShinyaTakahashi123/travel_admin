/**
 * 法務(2026-10-01 00:14)の指摘。#79 90e7362b 石打丸山・苗場ドラゴンドラ。
 * 記録: docs/content/legal-review/見直し-1日4か所.md 最後の節(e7fca92)
 * - 魚沼の里: 会社名・銘柄・蔵の名前(八海醸造・八海山・第二浩和蔵・
 *   深沢原蒸溜所)を外す
 * - 西福寺開山堂: 「拝観料」の語を外す
 * - 宿場の湯: 入浴の撮影・長湯の一文を足す
 * - 道の駅みつまた: 「和豚もち豚」(銘柄)を外す
 * - 雪国館: 『雪国』冒頭の一文まるごとの引用(川端康成は1972年没で著作権が
 *   存続)を避け、「有名な書き出しで知られる物語」にする
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "魚沼の里",
    "地酒「八海山」で知られる八海醸造が手がける、雪国の暮らしと文化を体感できる複合施設で、実際に酒を仕込む製造蔵「第二浩和蔵」や、ウイスキーやジンをつくる「深沢原蒸溜所」を見学できるほか、カフェやそば処、売店なども点在しています。",
    "地酒の蔵元が手がける、雪国の暮らしと文化を体感できる複合施設で、実際に酒を仕込む製造蔵や、ウイスキーやジンをつくる蒸溜所を見学できるほか、カフェやそば処、売店なども点在しています。",
    "魚沼の里"
  );
  await fixOne(
    "西福寺開山堂",
    "拝観時間・拝観料・ガイドの申し込みは公式サイトで確かめてから訪れましょう。",
    "拝観時間・ガイドの申し込みは公式サイトで確かめてから訪れましょう。",
    "西福寺開山堂"
  );
  await fixOne(
    "宿場の湯",
    "ゴンドラとロープウェーでの空中散歩や湖畔の散策で歩いた足を、ゆっくりと休められます。ここで昼食をとるのもおすすめです。",
    "ゴンドラとロープウェーでの空中散歩や湖畔の散策で歩いた足を、ゆっくりと休められます。入浴中の撮影は控え、長湯をしすぎないようにしましょう。ここで昼食をとるのもおすすめです。",
    "宿場の湯"
  );
  await fixOne(
    "道の駅みつまた",
    "地元でとれた野菜や特産品が並ぶ直売所や、和豚もち豚を使ったもつ煮が名物のレストランなどが集まっていて、足湯にも立ち寄れます。",
    "地元でとれた野菜や特産品が並ぶ直売所や、もつ煮が名物のレストランなどが集まっていて、足湯にも立ち寄れます。",
    "道の駅みつまた"
  );
  await fixOne(
    "雪国館",
    "「国境の長いトンネルを抜けると雪国であった」の書き出しで知られる物語の舞台に、思いをはせてみてください。",
    "有名な書き出しで知られる物語の舞台に、思いをはせてみてください。",
    "雪国館"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
