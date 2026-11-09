/**
 * #34 強羅・箱根、法務の本番確認(2026-10-30 20:21)の指摘2件。移動の分数(13分)と
 * 締めの文の分数が合っていなかった(箱根神社「19分」・ポーラ美術館「16分」)。
 * 文のみの直し、時刻・移動・座標は変更なし。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-34-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-34-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const JINJA_ID = "0a285b65-0c46-42ce-9b74-29db3c3608ce";
const POLA_ID = "24a6970d-413b-46ed-a419-76281978b78d";

const PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: JINJA_ID,
    label: "箱根神社(締め)",
    find: "この後は、歩いておよそ19分の成川美術館へ向かいましょう。",
    replace: "この後は、歩いておよそ13分の成川美術館へ向かいましょう。",
  },
  {
    id: POLA_ID,
    label: "ポーラ美術館(締め)",
    find: "この後は、タクシーでおよそ16分、今夜の宿がある強羅温泉へ向かいましょう。",
    replace: "この後は、タクシーでおよそ13分、今夜の宿がある強羅温泉へ向かいましょう。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(PAIRS.map((p) => p.id))];
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

  console.log("=== #34 法務指摘の文のみ直し(時刻・移動・座標変更なし) ===\n");
  for (const id of ids) {
    const p = PAIRS.find((pp) => pp.id === id)!;
    console.log(p.label + ": ..." + memoById.get(id)!.slice(-60));
  }

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })));

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
