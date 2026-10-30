/**
 * #93 上高地の訂正その4。法務が本番で5点を見つけた。
 * 1. 大正池のメモに昼食の一文が重なって残っていたため消す
 * 2. 昼食のメモの「持っていくのもよいでしょう」を言い切らない言い方に
 * 3. 田代池の書き出しを「昼食のあと、大正池のバス停のあたりから」に
 * 4. 田代池→田代橋穂高橋(18→15分)、田代橋穂高橋→小梨平(15→25分)の文をDBの値にそろえる
 * 5. 河童橋の「上高地でもっともにぎわうエリアです」の言い切りを直す
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-93-5b3004dc-correction4.ts
 *   反映: npm run prod -- npx tsx prisma/fix-93-5b3004dc-correction4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TAISHOIKE_ID = "26c82dcc-40d4-42ac-bf91-310d545fa2c9";
const TASHIROIKE_ID = "77ce6ac7-b372-49f6-9bca-115c3bfaf93c";
const TASHIROBASHI_ID = "c7535856-8757-4afd-adef-d32e93c197e7";
const KONASHIDAIRA_ID = "d7f3a0aa-1123-4191-bc44-3c3a1f6ca321";
const KAPPABASHI_ID = "488cafa7-f358-45bf-ac5c-61f6cedf8adb";

const TAISHOIKE_FIND =
  "この先は河童橋まで食事の場所が少ないので、大正池のあたりで昼食をとりましょう。松本などで買って持っていくのもよいでしょう。この後は、梓川沿いの林間コースを歩いて、田代池へ向かいましょう。";
const TAISHOIKE_REPLACE = "この後は、歩いてすぐ、昼食をとる大正池のバス停のあたりへ向かいましょう。";

const LUNCH_FIND =
  "この先は河童橋まで食事の場所が少ないので、ここで昼食をとりましょう。松本などで買って持っていくのもよいでしょう。この後は、梓川沿いの林間コースを歩いて、田代池へ向かいましょう。";
const LUNCH_REPLACE =
  "この先は河童橋まで食事の場所が少ないので、ここで昼食をとりましょう。松本などで買って持っていくこともできます。この後は、梓川沿いの林間コースを歩いて約16分の田代池へ向かいましょう。";

const TASHIROIKE_FIND = "大正池から歩いておよそ20分、田代池に着きます。";
const TASHIROIKE_REPLACE = "昼食のあと、大正池のバス停のあたりから歩いて約16分、田代池に着きます。";
const TASHIROIKE_FIND2 = "この後は、歩いておよそ18分、田代橋・穂高橋へ向かいましょう。";
const TASHIROIKE_REPLACE2 = "この後は、歩いておよそ15分、田代橋・穂高橋へ向かいましょう。";

const TASHIROBASHI_FIND = "田代池から歩いておよそ18分、田代橋・穂高橋に着きます。";
const TASHIROBASHI_REPLACE = "田代池から歩いておよそ15分、田代橋・穂高橋に着きます。";
const TASHIROBASHI_FIND2 = "この後は、歩いておよそ15分、小梨平へ向かいましょう。";
const TASHIROBASHI_REPLACE2 = "この後は、歩いておよそ25分、小梨平へ向かいましょう。";

const KONASHIDAIRA_FIND = "田代橋・穂高橋から歩いておよそ15分、小梨平に着きます。";
const KONASHIDAIRA_REPLACE = "田代橋・穂高橋から歩いておよそ25分、小梨平に着きます。";

const KAPPABASHI_FIND = "橋の周辺には売店や宿泊施設が集まり、上高地でもっともにぎわうエリアです。";
const KAPPABASHI_REPLACE = "橋の周辺には売店や宿泊施設が集まり、上高地でも特ににぎわうエリアです。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [taishoike, lunch, tashiroike, tashirobashi, konashidaira, kappabashi] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TAISHOIKE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { name: "大正池のあたりで昼食" } }),
    prisma.spot.findFirstOrThrow({ where: { id: TASHIROIKE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TASHIROBASHI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KONASHIDAIRA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KAPPABASHI_ID } }),
  ]);

  for (const [label, text, find] of [
    ["大正池", taishoike.memo ?? "", TAISHOIKE_FIND],
    ["昼食", lunch.memo ?? "", LUNCH_FIND],
    ["田代池", tashiroike.memo ?? "", TASHIROIKE_FIND],
    ["田代池(2)", tashiroike.memo ?? "", TASHIROIKE_FIND2],
    ["田代橋穂高橋", tashirobashi.memo ?? "", TASHIROBASHI_FIND],
    ["田代橋穂高橋(2)", tashirobashi.memo ?? "", TASHIROBASHI_FIND2],
    ["小梨平", konashidaira.memo ?? "", KONASHIDAIRA_FIND],
    ["河童橋", kappabashi.memo ?? "", KAPPABASHI_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に対象の文が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newTaishoikeMemo = taishoike.memo!.replace(TAISHOIKE_FIND, TAISHOIKE_REPLACE);
  const newLunchMemo = lunch.memo!.replace(LUNCH_FIND, LUNCH_REPLACE);
  const newTashiroikeMemo = tashiroike.memo!.replace(TASHIROIKE_FIND, TASHIROIKE_REPLACE).replace(TASHIROIKE_FIND2, TASHIROIKE_REPLACE2);
  const newTashirobashiMemo = tashirobashi.memo!.replace(TASHIROBASHI_FIND, TASHIROBASHI_REPLACE).replace(TASHIROBASHI_FIND2, TASHIROBASHI_REPLACE2);
  const newKonashidairaMemo = konashidaira.memo!.replace(KONASHIDAIRA_FIND, KONASHIDAIRA_REPLACE);
  const newKappabashiMemo = kappabashi.memo!.replace(KAPPABASHI_FIND, KAPPABASHI_REPLACE);

  console.log("=== #93 訂正その4 ===\n");
  console.log("大正池:", newTaishoikeMemo.slice(-60));
  console.log("昼食:", newLunchMemo);
  console.log("田代池:", newTashiroikeMemo.slice(0, 60), "...", newTashiroikeMemo.slice(-50));
  console.log("田代橋穂高橋:", newTashirobashiMemo.slice(0, 50), "...", newTashirobashiMemo.slice(-50));
  console.log("小梨平:", newKonashidairaMemo.slice(0, 50));
  console.log("河童橋:", newKappabashiMemo.slice(-80));

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: TAISHOIKE_ID }, data: { memo: newTaishoikeMemo } }),
    prisma.spot.update({ where: { id: lunch.id }, data: { memo: newLunchMemo } }),
    prisma.spot.update({ where: { id: TASHIROIKE_ID }, data: { memo: newTashiroikeMemo } }),
    prisma.spot.update({ where: { id: TASHIROBASHI_ID }, data: { memo: newTashirobashiMemo } }),
    prisma.spot.update({ where: { id: KONASHIDAIRA_ID }, data: { memo: newKonashidairaMemo } }),
    prisma.spot.update({ where: { id: KAPPABASHI_ID }, data: { memo: newKappabashiMemo } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
