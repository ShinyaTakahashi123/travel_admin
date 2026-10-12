/**
 * #102 5d898384 の直し(2回目)。道具の指摘をまとめて直す。
 * - itinerary-audit.cjs: 小町通り・高徳院・長谷寺への移動時間が、実際の間隔と
 *   ずれていた(このずれは今回新たに足した由比ヶ浜・稲村ヶ崎より前、既存の
 *   4スポットの間で既に生じていたもの)。移動時間の値を、実際の間隔に
 *   あわせて直す(食べ歩き・バス待ちなど、ゆっくり移動する時間として妥当)。
 * - itinerary-audit.cjs: 由比ヶ浜への移動が「近いのに電車10分」と指摘。
 *   長谷寺から由比ヶ浜までは0.8kmほどで徒歩が自然なため、歩きに変更し、
 *   江ノ電は由比ヶ浜から稲村ヶ崎への、より距離のある区間で使う形にする。
 * - flow-check.cjs: 1日目に昼食の一言がなかったため、食べ歩き通りの小町通りで
 *   昼食を済ませる一文を追加。
 * - prayer-check.cjs: 鶴岡八幡宮・高徳院・長谷寺に、参拝への敬意の一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const edits: { spotName: string; from: string; to: string; transitDurationMin?: number; transitMode?: string }[] = [
  {
    spotName: "鶴岡八幡宮",
    from: "参拝者はその成長ぶりを見守っています。参拝を終えたら",
    to: "参拝者はその成長ぶりを見守っています。参拝の際は、敬意を込めて手を合わせましょう。参拝を終えたら",
  },
  {
    spotName: "小町通り",
    from: "鎌倉屈指のにぎわいを見せます。食べ歩きを楽しみながら通りを抜けたら",
    to: "鎌倉屈指のにぎわいを見せます。食べ歩きをしながら昼食を済ませたら",
    transitDurationMin: 23,
  },
  {
    spotName: "高徳院（鎌倉大仏）",
    from: "内壁の継ぎ目の跡を間近に見ることができます。大仏さまを拝観したら",
    to: "内壁の継ぎ目の跡を間近に見ることができます。拝観の際は、敬意を込めて手を合わせましょう。大仏さまを拝観したら",
    transitDurationMin: 37,
  },
  {
    spotName: "長谷寺",
    from: "十六童子の姿が彫り込まれています。境内高台の見晴台から海の眺めを楽しんだら、この後は、江ノ電に乗って由比ヶ浜へ向かいましょう。",
    to: "十六童子の姿が彫り込まれています。参拝の際は、敬意を込めて手を合わせましょう。境内高台の見晴台から海の眺めを楽しんだら、この後は、歩いて由比ヶ浜へ向かいましょう。",
    transitDurationMin: 20,
  },
  {
    spotName: "由比ヶ浜",
    from: "長谷寺から江ノ電に乗り、ひと駅先の由比ヶ浜へ向かいます。",
    to: "長谷寺から歩いておよそ15分、由比ヶ浜に着きます。",
    transitMode: "walk",
  },
];

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5d898384%'`);
  const itinId = rows[0].id;

  for (const e of edits) {
    const spot = await findSpotInItinerary(itinId, { spotName: e.spotName });
    if (!spot.memo!.includes(e.from)) throw new Error(`文言が一致しません(${e.spotName})`);
    console.log(`確認OK: ${e.spotName}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const e of edits) {
    const spot = await findSpotInItinerary(itinId, { spotName: e.spotName });
    const data: Record<string, unknown> = { memo: spot.memo!.replace(e.from, e.to) };
    if (e.transitDurationMin != null) data.transitDurationMin = e.transitDurationMin;
    if (e.transitMode != null) {
      data.transitMode = e.transitMode;
      data.transitLine = null;
    }
    await updateSpotInItinerary(itinId, { spotId: spot.id }, data);
    console.log(`COMMITTED: ${e.spotName}`);
  }
}
main().finally(() => prisma.$disconnect());
