/**
 * #221 d66711cc の追いの直し（しおりえ(制作補助2)）
 * - 多々羅大橋: 道の駅からの距離が約1.2kmなので、歩きを10分→15分に（13:05着・滞在35分で、次の時刻は変えない）
 * - 大山祇神社宝物館: 書き出しに移動の分数（約5分）を入れ、神社の宝物を収める建物なので、静かに見学する一言を足す
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-221b-d66711cc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "d66711cc-25fd-406e-b98d-3155df878f5c";
const TATARA = "e744e586-8b19-449a-bfe7-5a5ededc0fe3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const QUIET = "神社に奉納された宝物を収める建物なので、静かに見学しましょう。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: true } } } });
  const spots = it.days.flatMap((d) => d.spots);
  const tatara = spots.find((s) => s.id === TATARA)!;
  const hou = spots.filter((s) => s.name === "大山祇神社宝物館");
  if (!tatara || hou.length !== 1) throw new Error("構成が想定と違います");
  const oldMemo = tatara.memo ?? "";
  const newMemo = oldMemo.replace("道の駅から歩いて約10分。", "道の駅から歩いて約15分。");
  if (newMemo === oldMemo || (hou[0].memo ?? "").includes(QUIET)) throw new Error("本文が想定と違います");
  const houMemo = (hou[0].memo ?? "").replace("境内から歩いてすぐ。", "境内から歩いて約5分。") + QUIET;
  if (!houMemo.startsWith("境内から歩いて約5分。")) throw new Error("宝物館の本文が想定と違います");
  console.log(`多々羅大橋: 13:05 滞在35分 walk15\n${newMemo}\n\n宝物館: ${houMemo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: TATARA }, data: { visitTime: t(13, 5), stayDurationMin: 35, memo: newMemo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] } } }),
    prisma.spot.update({ where: { id: hou[0].id }, data: { memo: houMemo } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
