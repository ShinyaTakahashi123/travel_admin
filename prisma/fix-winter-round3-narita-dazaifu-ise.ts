/**
 * 冬の特集の追加の見直し(docs/content/20261102-winter-feature-rule-pass.md「追加の見直し」77931546)。
 * 終わりの文に移動の分がない箇所を直す(成田山6か所・太宰府1か所・伊勢1か所)。
 * 伊勢の説明文の「食べ歩き」も直す。文のみ、時刻・点・滞在・移動の分数そのものは変更しない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-round3-narita-dazaifu-ise.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-round3-narita-dazaifu-ise.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const edits: { spotId?: string; itineraryId?: string; field: "memo" | "description"; find: string; replace: string; label: string }[] = [
  // 成田山
  {
    spotId: "c7b410e3-6943-40d4-940a-e1ff780a645d",
    field: "memo",
    find: "参拝のあとは、境内奥に広がる成田山公園へ向かいましょう。",
    replace: "参拝のあとは、歩いておよそ3分、境内奥に広がる成田山公園へ向かいましょう。",
    label: "成田山新勝寺",
  },
  {
    spotId: "f5a5a4b6-10d5-4ea7-820a-ba22ca951903",
    field: "memo",
    find: "続いては成田山書道美術館へ向かいましょう。",
    replace: "続いては、歩いておよそ2分、成田山書道美術館へ向かいましょう。",
    label: "成田山公園",
  },
  {
    spotId: "0a51ea9a-835d-45ba-940e-49e2892b4e79",
    field: "memo",
    find: "続いては成田山表参道へ向かいましょう。",
    replace: "続いては、歩いておよそ12分、成田山表参道へ向かいましょう。",
    label: "成田山書道美術館",
  },
  {
    spotId: "d5cf73e2-4d90-4d23-a96d-13772cbbbdd2",
    field: "memo",
    find: "続いては電車で宗吾霊堂へ向かいましょう。",
    replace: "続いては、電車でおよそ15分、宗吾霊堂へ向かいましょう。",
    label: "成田山表参道",
  },
  {
    spotId: "fa3413e5-a16c-438f-bfaf-12aa4ddc2069",
    field: "memo",
    find: "続いては電車で佐倉城址公園へ向かいましょう。",
    replace: "続いては、電車でおよそ15分、佐倉城址公園へ向かいましょう。",
    label: "宗吾霊堂",
  },
  {
    spotId: "f00e17f1-9c09-42e3-b652-505985833dcb",
    field: "memo",
    find: "続いては佐倉武家屋敷通りへ向かいましょう。",
    replace: "続いては、歩いておよそ12分、佐倉武家屋敷通りへ向かいましょう。",
    label: "佐倉城址公園",
  },
  // 太宰府天満宮: 終わりの文そのものがないため新しく足す
  {
    spotId: "4505781e-2773-4cde-8632-0b5fc79c7c15",
    field: "memo",
    find: "今も学問成就を願う人々が絶えない神聖な場所ですので、静かに、敬意をもってお参りください。",
    replace: "今も学問成就を願う人々が絶えない神聖な場所ですので、静かに、敬意をもってお参りください。見学を終えたら、歩いておよそ10分、九州国立博物館へ向かいましょう。",
    label: "太宰府天満宮",
  },
  // 伊勢神宮内宮
  {
    spotId: "5b286d45-f6ac-4fd3-b388-9c7aa098390b",
    field: "memo",
    find: "参拝を終えたら、次はおかげ横丁へ歩いて向かいましょう。",
    replace: "参拝を終えたら、歩いておよそ15分、次はおかげ横丁へ向かいましょう。",
    label: "伊勢神宮内宮",
  },
  // 伊勢の説明文
  {
    itineraryId: "c9b3ad40-531b-4085-a2ab-ebb0dd91cdc0",
    field: "description",
    find: "外宮・内宮の参拝に加えて、おかげ横丁での食べ歩きや猿田彦神社の参拝もあわせて楽しむ、新年の始まりにふさわしいプランです。",
    replace: "外宮・内宮の参拝に加えて、おかげ横丁での食事や猿田彦神社の参拝もあわせて楽しむ、新年の始まりにふさわしいプランです。",
    label: "伊勢 説明文",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      for (const e of edits) {
        if (e.field === "memo") {
          const spot = await tx.spot.findUniqueOrThrow({ where: { id: e.spotId! } });
          if (!spot.memo?.includes(e.find)) throw new Error(`[想定と違います] ${e.label}のメモに対象の文がありません`);
          const newMemo = spot.memo.replace(e.find, e.replace);
          console.log(`\n=== ${e.label} ===`);
          console.log("直前:", spot.memo);
          console.log("直後:", newMemo);
          await tx.spot.update({ where: { id: e.spotId! }, data: { memo: newMemo } });
        } else {
          const it = await tx.itinerary.findUniqueOrThrow({ where: { id: e.itineraryId! } });
          if (!it.description?.includes(e.find)) throw new Error(`[想定と違います] ${e.label}が対象の文と違います`);
          const newDesc = it.description.replace(e.find, e.replace);
          console.log(`\n=== ${e.label} ===`);
          console.log("直前:", it.description);
          console.log("直後:", newDesc);
          await tx.itinerary.update({ where: { id: e.itineraryId! }, data: { description: newDesc } });
        }
      }

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
