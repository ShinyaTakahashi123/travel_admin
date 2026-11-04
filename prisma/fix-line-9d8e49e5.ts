/**
 * 9d8e49e5(高野山)の苅萱堂の区間の路線名から会社名を外す直し(2026-11-05、しおりえ(制作補助2))。
 * fix-koyasan-9d8e49e5.ts で、bus3 の路線名に会社名「南海りんかんバス」を入れて書き込んでいた(路線名の欄に会社名を書かない決まり。
 * e25ac636 で企画運営に指摘され、同じ誤りに気づいたもの)。路線名を消すだけで、時刻・区間の分・メモは変えない。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-line-9d8e49e5.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const SPOT_ID = "479b61f0-e08f-4a86-9c64-387ab537e249";
const NAME = "苅萱堂";
const LINE_OLD = "南海りんかんバス";

async function main() {
  const s = await prisma.spot.findUnique({ where: { id: SPOT_ID }, select: { name: true, day: { select: { itineraryId: true } } } });
  if (!s || s.name !== NAME || !s.day.itineraryId.startsWith("9d8e49e5")) throw new Error(`スポットが想定と違います: 「${s?.name}」`);
  const legs = await prisma.spotTransitLeg.findMany({ where: { spotId: SPOT_ID }, orderBy: { orderNo: "asc" }, select: { id: true, orderNo: true, transitMode: true, transitDurationMin: true, transitLine: true } });
  console.log(`■ ${NAME} の区間(今): ${legs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? `(${l.transitLine})` : ""}`).join("+")}`);
  const target = legs.filter((l) => l.transitLine === LINE_OLD);
  if (target.length !== 1 || target[0].transitMode !== "bus" || target[0].transitDurationMin !== 3) throw new Error(`直す区間が想定と違います: ${JSON.stringify(target)}`);
  console.log(`  直す: orderNo ${target[0].orderNo} bus3 の路線名「${LINE_OLD}」→(なし)`);
  console.log(`  直したあと: ${legs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.id !== target[0].id && l.transitLine ? `(${l.transitLine})` : ""}`).join("+")}`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.spotTransitLeg.update({ where: { id: target[0].id }, data: { transitLine: null } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
