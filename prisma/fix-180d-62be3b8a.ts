/**
 * #180 62be3b8a の続き（しおりえ(制作補助2)）: 法務の確認（2026-10-11 17:02、記録 4eaea58）で、華厳滝の「もっともよく知られる滝で」を同じ文の中でぼかす
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-180d-62be3b8a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "62be3b8a-f393-4595-b524-bf4e5fc2e9ed";
const FROM = "もっともよく知られる滝で、中禅寺湖から";
const TO = "もっともよく知られる滝とされ、中禅寺湖から";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "華厳の滝" } });
  if (s.length !== 1) throw new Error(`華厳の滝 ${s.length}件`);
  const memo = s[0].memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const neu = memo.replace(FROM, TO);
  console.log(neu);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: s[0].id }, data: { memo: neu } });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
