/**
 * 冬の特集の見直し、2回目の直し(法務が一覧で見落としていた3点、2026-11-02 02:53)。
 * 成田山(708a13d8)の説明文(にぎわう・食べ歩き)、太宰府(3bc5f590)の「すぐそば」2か所(分がない)。
 * いずれも文のみの直し、時刻・点・滞在は変更しない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const NARITA_ID = "708a13d8-bdd1-4525-9e63-88b12c57eedc";
const NARITA_DESC_FIND = "毎年多くの参拝客でにぎわう成田山新勝寺への初詣。表参道の食べ歩きとあわせて、新年の始まりを祈願するプランです。";
const NARITA_DESC_REPLACE = "成田山新勝寺への初詣と、表参道での昼食をあわせて、新年の始まりを祈るプランです。";

const HAKUBUTSUKAN_SPOT_ID = "6e569715-1bd2-4dbd-bed8-1da016a20c4b";
const HAKUBUTSUKAN_FIND = "すぐそばの太宰府天満宮参道へ向かいましょう。";
const HAKUBUTSUKAN_REPLACE = "この後は、歩いておよそ12分、太宰府天満宮参道へ向かいましょう。";

const KANZEONJI_SPOT_ID = "ab8f7336-09c5-4e53-a8bd-fa9c0764b452";
const KANZEONJI_FIND = "すぐそばの太宰府政庁跡へ向かいましょう。";
const KANZEONJI_REPLACE = "この後は、歩いておよそ18分、太宰府政庁跡へ向かいましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      const narita = await tx.itinerary.findUniqueOrThrow({ where: { id: NARITA_ID } });
      const hakubutsukan = await tx.spot.findUniqueOrThrow({ where: { id: HAKUBUTSUKAN_SPOT_ID } });
      const kanzeonji = await tx.spot.findUniqueOrThrow({ where: { id: KANZEONJI_SPOT_ID } });

      if (!narita.description?.includes(NARITA_DESC_FIND)) throw new Error("[想定と違います] 成田山の説明文が想定と違います");
      if (!hakubutsukan.memo?.includes(HAKUBUTSUKAN_FIND)) throw new Error("[想定と違います] 九州国立博物館のメモに対象の文がありません");
      if (!kanzeonji.memo?.includes(KANZEONJI_FIND)) throw new Error("[想定と違います] 観世音寺のメモに対象の文がありません");

      const newDesc = narita.description.replace(NARITA_DESC_FIND, NARITA_DESC_REPLACE);
      const newHakubutsukanMemo = hakubutsukan.memo.replace(HAKUBUTSUKAN_FIND, HAKUBUTSUKAN_REPLACE);
      const newKanzeonjiMemo = kanzeonji.memo!.replace(KANZEONJI_FIND, KANZEONJI_REPLACE);

      console.log("=== 成田山 説明文 ===");
      console.log("直前:", narita.description);
      console.log("直後:", newDesc);

      console.log("\n=== 九州国立博物館 ===");
      console.log("直前:", hakubutsukan.memo);
      console.log("直後:", newHakubutsukanMemo);

      console.log("\n=== 観世音寺 ===");
      console.log("直前:", kanzeonji.memo);
      console.log("直後:", newKanzeonjiMemo);

      await tx.itinerary.update({ where: { id: NARITA_ID }, data: { description: newDesc } });
      await tx.spot.update({ where: { id: HAKUBUTSUKAN_SPOT_ID }, data: { memo: newHakubutsukanMemo } });
      await tx.spot.update({ where: { id: KANZEONJI_SPOT_ID }, data: { memo: newKanzeonjiMemo } });

      if (!commit) {
        console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
        throw new Error("DRY_RUN_ROLLBACK");
      }
    },
    { timeout: 60000 }
  ).catch((e) => {
    if (e.message === "DRY_RUN_ROLLBACK") return;
    throw e;
  });

  if (commit) console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
