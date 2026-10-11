/**
 * #152 22b14d35 の続き（しおりえ(制作補助2)）: 企画運営・法務の確認で1点を直す
 *   鷲羽山の「日本で最初の国立公園として知られる」は、瀬戸内海国立公園が雲仙・霧島とともに昭和9年に最初に指定された3つの一つなので、「日本で最初に指定された国立公園の一つ」にする
 *   出典: 環境省 env.go.jp/nature/nationalparks/list/setonaikai/「瀬戸内海国立公園は、昭和9（1934）年に雲仙、霧島とともに日本で最初に国立公園に指定されました。」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-152b-22b14d35.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "22b14d35-9cbe-40b0-a878-fcc19927489b";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from: string; to: string }[] = [
  {
    name: "鷲羽山",
    from: "日本で最初の国立公園として知られる瀬戸内海国立公園を代表する景勝地です。",
    to: "昭和9年（1934年）に雲仙・霧島とともに日本で最初に指定された国立公園の一つ、瀬戸内海国立公園を代表する景勝地です。",
  },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    const memo = s[0].memo ?? "";
    if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
    const next = memo.replace(p.from, p.to);
    console.log(`${p.name}:\n  ${next}\n`);
    return { id: s[0].id, memo: next };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: { memo: o.memo } });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
