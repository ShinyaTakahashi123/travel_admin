/**
 * 緊急修正: prisma/fix-ohenro-book1-round2.ts が、名前だけでスポットを検索した
 * ため(findFirst({where:{name:"大塚国際美術館"}}))、本1(#7)とは無関係の、
 * 公開中のしおり(day 5ba91aee、鳴門の渦潮・大塚国際美術館・鳴門市ドイツ館の
 * しおり)の「大塚国際美術館」(spot b3f71b69)を誤って上書きしてしまった
 * (visit 11:03→9:30、滞在225分→120分、メモも本1用の文に書き換わっていた)。
 *
 * 2026-10-12 21:35のバックアップから元の値を復元する。
 * 復元後、同じ日の他のスポット(鳴門の渦潮・渦の道・鳴門市ドイツ館・霊山寺)の
 * 時刻が、この復元によって元どおり矛盾なくつながることも確認する。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/URGENT-restore-b3f71b69.ts
 *   本登録     : npm run prod -- npx tsx prisma/URGENT-restore-b3f71b69.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "b3f71b69-da2a-4bc9-b00f-f7970fa9c7c3";

const ORIGINAL_VISIT_TIME = new Date(Date.UTC(1970, 0, 1, 11, 3));
const ORIGINAL_STAY_MIN = 225;
const ORIGINAL_MEMO =
  "渦の道から歩いておよそ7分、大塚国際美術館に着きます。世界26か国、1000点余りの西洋名画を、陶板に原寸大で再現した美術館です。はじめに訪れる「システィーナ・ホール」では、システィーナ礼拝堂の天井画と壁画を、壁や天井ごと環境展示として再現しており、実際にその場に居合わせたかのような臨場感を味わえます。屋外には、モネが自然光のもとで見てほしいと望んだという「大睡蓮」が、池を囲むように配置されています。モナ・リザやひまわり、ゲルニカなど、教科書でおなじみの名画も数多く並び、鑑賞ルートはおよそ4キロメートルにおよびます。館内にはレストランやカフェもあるので、ここで昼食にするとよいでしょう。じっくり見て回ると3時間以上かかることも多いので、時間に余裕を持って訪れましょう。休館日は公式サイトで確かめてから訪れましょう。この後は、タクシーでおよそ25分、鳴門市ドイツ館へ向かいましょう。この先は乗り継ぎの良い路線バスがないため、タクシーを利用します。";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot || spot.name !== "大塚国際美術館") throw new Error("想定と違います");

  console.log("[現状] visit=", spot.visitTime, "stay=", spot.stayDurationMin);
  console.log("[復元後の値] visit=11:03, stay=225分, メモを2026-10-12バックアップの内容に戻す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: SPOT_ID },
    data: { visitTime: ORIGINAL_VISIT_TIME, stayDurationMin: ORIGINAL_STAY_MIN, memo: ORIGINAL_MEMO },
  });

  console.log("  COMMITTED(復元しました)");
}

main().finally(() => prisma.$disconnect());
