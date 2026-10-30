/**
 * #103 白石、法務の本番確認(2026-10-30 17:59)の指摘。文だけの直し。
 * 神の湯→刈田嶺神社(里宮)の歩き2分が、書き出し・締めで「すぐ」になっていたため
 * 「約2分」に直す。企画運営の【書き込み可】#103(文)を受けて書き込む。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-103-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-103-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const KAMINOYU_ID = "0cb807e1-8914-43f5-b2d3-416313af6ff5";
const KARITAMINE_ID = "1b28f7e6-10fb-4ea2-b64c-ecfa28ac8128";

const PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: KAMINOYU_ID,
    label: "神の湯(締め)",
    find: "続いては、歩いてすぐの刈田嶺神社(里宮)へ向かいましょう。",
    replace: "続いては、歩いておよそ2分の刈田嶺神社(里宮)へ向かいましょう。",
  },
  {
    id: KARITAMINE_ID,
    label: "刈田嶺神社(里宮)の書き出し",
    find: "神の湯からは歩いてすぐです。",
    replace: "神の湯からは歩いておよそ2分です。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = PAIRS.map((p) => p.id);
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  for (const p of PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #103 法務指摘(文のみ) ===\n");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(-90));
    console.log();
  }

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })));

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
