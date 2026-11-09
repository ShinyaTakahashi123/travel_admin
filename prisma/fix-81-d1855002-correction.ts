/**
 * #81の訂正。法務の指摘で、唐人墓を外したことに伴う残り物を直す。
 * - 説明文の「唐人墓」を削除
 * - 八重山博物館のメモ「1日目に訪ねた唐人墓の」の「訪ねた」の前提を外す
 * - コンドイビーチの書き出しを「西桟橋から歩いて約12分」に直す
 *   (現在の並びは集落→西桟橋→コンドイビーチのため)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-81-d1855002-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-81-d1855002-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "d1855002-4a6f-49db-a684-3d014966ad0a";
const HAKUBUTSUKAN_ID = "c79a6a57-3408-41d0-b44d-21fa46bde6c1";
const KONDOI_ID = "891a9946-d22a-4d2a-8dfa-db46bd85bc9f";

const DESC_FIND = "最西端の御神崎、唐人墓、石垣やいま村へ。";
const DESC_REPLACE = "最西端の御神崎、石垣やいま村へ。";

const HAKUBUTSUKAN_FIND = "1日目に訪ねた唐人墓のもとになった事件で亡くなった人々の名などを刻んだ、陶製の唐人墓碑（市の文化財）も、ここに収められています。";
const HAKUBUTSUKAN_REPLACE =
  "唐人墓のもとになった事件で亡くなった人々の名などを刻んだ、陶製の唐人墓碑（市の文化財）も、ここに収められています。";

const KONDOI_FIND = "集落から歩いて、島の西岸のコンドイビーチへ。";
const KONDOI_REPLACE = "西桟橋から歩いて約12分、島の西岸のコンドイビーチへ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [itinerary, hakubutsukan, kondoi] = await Promise.all([
    prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HAKUBUTSUKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KONDOI_ID } }),
  ]);

  for (const [label, text, find] of [
    ["説明文", itinerary.description ?? "", DESC_FIND],
    ["八重山博物館", hakubutsukan.memo ?? "", HAKUBUTSUKAN_FIND],
    ["コンドイビーチ", kondoi.memo ?? "", KONDOI_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newDescription = itinerary.description!.replace(DESC_FIND, DESC_REPLACE);
  const newHakubutsukanMemo = hakubutsukan.memo!.replace(HAKUBUTSUKAN_FIND, HAKUBUTSUKAN_REPLACE);
  const newKondoiMemo = kondoi.memo!.replace(KONDOI_FIND, KONDOI_REPLACE);

  console.log("=== #81 訂正: 唐人墓を外した残り物を直す ===\n");
  console.log("説明文:", newDescription);
  console.log("\n八重山博物館:", newHakubutsukanMemo);
  console.log("\nコンドイビーチ:", newKondoiMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDescription } });
  await prisma.spot.update({ where: { id: HAKUBUTSUKAN_ID }, data: { memo: newHakubutsukanMemo } });
  await prisma.spot.update({ where: { id: KONDOI_ID }, data: { memo: newKondoiMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
