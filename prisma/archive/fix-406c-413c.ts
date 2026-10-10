/**
 * #406 0c3184ff・#413 4051e181 の言葉の直し（しおりえ(制作補助2)、2026-10-01 企画運営の言葉の点検）
 * - #406 上野東照宮「出世や勝利、健康長寿にご利益があるとされています」→ 健康に効くような書き方はしない（法務の決まり）
 *     →「出世や勝利を願う人がお参りする神社として知られています」
 * - #413 題名「天岩戸神社と天安河原、日本神話のパワースポットを巡るプラン」→「パワースポット」は使わない言葉
 *     →「天岩戸神社と天安河原、日本神話の舞台を巡るプラン」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-406c-413c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const IT406 = "0c3184ff";
const IT413 = "4051e181";
const COMMIT = process.argv.includes("--commit");
const O406 = "出世や勝利、健康長寿にご利益があるとされています。";
const N406 = "出世や勝利を願う人がお参りする神社として知られています。";
const O413 = "天岩戸神社と天安河原、日本神話のパワースポットを巡るプラン";
const N413 = "天岩戸神社と天安河原、日本神話の舞台を巡るプラン";

async function fullId(id8: string) {
  const rows = await prisma.$queryRawUnsafe<{ id: string }[]>(`select id::text id from itinerary where id::text like $1`, id8 + "%");
  if (rows.length !== 1) throw new Error(`${id8} が1件に決まりません`);
  return rows[0].id;
}

async function main() {
  const id406 = await fullId(IT406);
  const s = await findSpotInItinerary(id406, { dayNumber: 1, spotName: "上野東照宮" });
  if (!s.memo?.includes(O406)) throw new Error("#406 本文が想定と違います");
  const id413 = await fullId(IT413);
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: id413 }, select: { title: true } });
  if (it.title !== O413) throw new Error("#413 題名が想定と違います");
  console.log(`#406 上野東照宮: ${O406} → ${N406}\n#413 題名: ${O413} → ${N413}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(id406, { dayNumber: 1, spotId: s.id }, { memo: s.memo!.replace(O406, N406) }, { tx });
    await tx.itinerary.update({ where: { id: id413 }, data: { title: N413 } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
