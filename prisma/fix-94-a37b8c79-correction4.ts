/**
 * #94 訂正その4。法務の指摘で、書き出しの文に移動の分数を足す(決まり145)。
 * 秋篠寺のバスの便名(押熊行き)を外し、帰りの一文にも分数を足す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-94-a37b8c79-correction4.ts
 *   反映: npm run prod -- npx tsx prisma/fix-94-a37b8c79-correction4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const NIGATSUDO_ID = "0b0ba813-43f0-4c4e-b3b1-1f72fdb069dd";
const KASUGATAISHA_ID = "4d60a64f-b632-4082-8f09-368ffdd8490d";
const NARAMACHI_ID = "210616e9-bcdd-430d-a0d5-92d386ac130a";
const GANGOJI_ID = "f6543e24-be5f-447c-a46f-f08f9321b631";
const DAIGOKUDEN_ID = "6732ec67-2df1-420c-af0e-1f9e7dba333b";
const SAIDAIJI_ID = "a1487217-615c-4db1-886e-66e8fa19c64a";
const AKISHINODERA_ID = "83daf9b9-2449-470d-9c5a-dbf2d6e69282";

const PAIRS: { id: string; find: string; replace: string; label: string }[] = [
  {
    id: NIGATSUDO_ID,
    label: "二月堂",
    find: "昼食のあと、東大寺のあたりから坂を上って、二月堂へ。",
    replace: "昼食のあと、東大寺のあたりから坂を上って約9分、二月堂へ。",
  },
  {
    id: KASUGATAISHA_ID,
    label: "春日大社",
    find: "二月堂から若草山のふもとを南へ歩いて、春日大社へ。",
    replace: "二月堂から若草山のふもとを南へ歩いて約17分、春日大社へ。",
  },
  {
    id: NARAMACHI_ID,
    label: "ならまち",
    find: "春日大社から西へ歩いて、ならまちへ。",
    replace: "春日大社から西へ歩いて約25分、ならまちへ。",
  },
  {
    id: GANGOJI_ID,
    label: "元興寺",
    find: "ならまちの中の元興寺へ。",
    replace: "ならまちから歩いて約5分の元興寺へ。",
  },
  {
    id: DAIGOKUDEN_ID,
    label: "第一次大極殿",
    find: "朱雀門から平城宮跡を北へ歩いて、復原された第一次大極殿へ。",
    replace: "朱雀門から平城宮跡を北へ歩いて約19分、復原された第一次大極殿へ。",
  },
  {
    id: SAIDAIJI_ID,
    label: "西大寺",
    find: "平城宮跡から西へ歩いて、西大寺へ。",
    replace: "平城宮跡から西へ歩いて約20分、西大寺へ。",
  },
  {
    id: AKISHINODERA_ID,
    label: "秋篠寺(1)",
    find: "西大寺から大和西大寺駅の北口へ出て、押熊行きのバスで約6分の秋篠寺へ。",
    replace: "西大寺から大和西大寺駅の北口へ出て、歩きとバスであわせて約20分の秋篠寺へ。",
  },
  {
    id: AKISHINODERA_ID,
    label: "秋篠寺(2)",
    find: "帰りは、バスで大和西大寺駅へ。",
    replace: "帰りは、バスで約20分の大和西大寺駅へ向かいましょう。",
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

  console.log("=== #94 訂正その4: 書き出しに分数を足す ===\n");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 60));
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
