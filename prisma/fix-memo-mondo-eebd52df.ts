/**
 * eebd52df の主水公園(雪国の碑)のメモの書き出しを直す小さな直し(2026-11-05、しおりえ(制作補助2))。法務の指摘(11/05 20:05)。
 * 「雪国館から歩いてすぐの公園です。」→「雪国館から歩いておよそ5分の公園です。」(「すぐ」は使わない言葉。区間は walk5)。
 * 時刻・区間・点・ほかの文は変えない。直す文がメモにちょうど1回でなければ止まる。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-memo-mondo-eebd52df.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const SPOT_ID = "402c16aa-ee5f-49e0-a526-8c77df3a52cf";
const FROM = "雪国館から歩いてすぐの公園です。";
const TO = "雪国館から歩いておよそ5分の公園です。";

async function main() {
  const s = await prisma.spot.findUnique({
    where: { id: SPOT_ID },
    select: { name: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { select: { transitMode: true, transitDurationMin: true } } },
  });
  if (!s || s.name !== "主水公園（雪国の碑）" || !s.day.itineraryId.startsWith("eebd52df")) throw new Error(`スポットが想定と違います「${s?.name}」`);
  const legs = s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
  if (legs !== "walk5") throw new Error(`区間が想定と違います ${legs}`);
  const memo = s.memo ?? "";
  if (memo.split(FROM).length - 1 !== 1) throw new Error("直す文が1か所ではありません");
  const next = memo.replace(FROM, TO);
  console.log(`■ eebd52df 主水公園（雪国の碑）(区間 ${legs})\n  前: ${memo}\n  後: ${next}`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { memo: next } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
