/**
 * #186 73d0b93a の続き（しおりえ(制作補助2)）: 法務の確認で、富岳風穴の座標を洞穴の入口 n7398711915（natural=cave_entrance、35.4775010,138.6575030）に戻す
 *   （fix-186b で使った n2098060090 は barrier=toll_booth（料金所）で、決まりでは使わない点のため。n7398711915 の末尾の 0 は桁の表示で、丸めではない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-186c-73d0b93a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "73d0b93a-5979-41c5-8d67-3cdf7bbbf1da";
const COMMIT = process.argv.includes("--commit");
const PLAN: { name: string; from?: string; to?: string; lat?: number; lng?: number }[] = [
  { name: "富岳風穴", lat: 35.477501, lng: 138.657503 },
];

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } } });
  const ops = PLAN.map((p) => {
    const s = spots.filter((x) => x.name === p.name);
    if (s.length !== 1) throw new Error(`${p.name} ${s.length}件`);
    let memo = s[0].memo ?? "";
    if (p.from !== undefined) {
      if (memo.split(p.from).length !== 2) throw new Error(`${p.name}: 直す文が見つからない`);
      memo = memo.replace(p.from, p.to!);
    }
    console.log(`${p.name}${p.lat ? ` 座標 ${s[0].lat},${s[0].lng} → ${p.lat},${p.lng}` : ""}:\n  ${memo}\n`);
    return { id: s[0].id, data: { memo, ...(p.lat ? { lat: p.lat, lng: p.lng } : {}) } };
  });
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const o of ops) await tx.spot.update({ where: { id: o.id }, data: o.data });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
