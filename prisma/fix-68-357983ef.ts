/**
 * 法務(2026-10-01 00:14)の指摘。#68 357983ef 満願寺と満願寺温泉。
 * 記録: docs/content/legal-review/見直し-1日4か所.md 最後の節(e7fca92)
 * - 門前町商店街: 「不老長寿の水として親しまれています」(効き目の言い方)を外す
 * - 黒川温泉: 「入湯手形も販売」の「販売」を外し、入浴の撮影・長湯の一文を足す
 * - 満願寺温泉館: 「長湯を避けて、こまめに水分をとりましょう。」を足す
 * - 下城の大イチョウ: 「母乳の出が良くなるという言い伝えから」(体の効き目)を外す
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '357983ef%'`);
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
    "門前町商店街",
    "阿蘇の伏流水を汲める水汲み場が20か所以上点在しており、不老長寿の水として親しまれています。",
    "阿蘇の伏流水を汲める水汲み場が20か所以上点在しています。",
    "門前町商店街"
  );
  await fixOne(
    "黒川温泉",
    "1枚で3つの露天風呂を巡れる「入湯手形」も販売されており、気になる方は立ち寄ってみてください。",
    "1枚で3つの露天風呂を巡れる「入湯手形」もあります。入浴中の撮影は控え、長湯をしすぎないようにしましょう。",
    "黒川温泉"
  );
  await fixOne(
    "満願寺温泉館",
    "地元の方の生活の場でもありますので、譲り合って静かに入浴し、浴室では撮影しないようにしましょう。",
    "地元の方の生活の場でもありますので、譲り合って静かに入浴し、浴室では撮影しないようにしましょう。長湯を避けて、こまめに水分をとりましょう。",
    "満願寺温泉館"
  );
  await fixOne(
    "下城の大イチョウ",
    "母乳の出が良くなるという言い伝えから「ちちこぶさん」の愛称でも親しまれています。",
    "地元では「ちちこぶさん」の愛称でも親しまれています。",
    "下城の大イチョウ"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
