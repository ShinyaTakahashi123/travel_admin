/**
 * #95 訂正その2。法務の本番確認(2026-10-30)の指摘に対応する、文言だけの直し。
 *
 * 1. 青蓮院に宿泊の一文を入れる
 * 2. 東福寺に、宿からの行き方の一文を入れる(決まり70)
 * 3. 西本願寺の帰りの一文に、測った分数(歩いて約17分、routed-footで実測)を入れる
 * 4. 六波羅蜜寺・八坂神社・伏見稲荷大社の書き出しに、前のスポットと分数を入れる(決まり145)
 * 5. 説明文の「確かめてください」を「確かめましょう」に直す
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-95-5bb2acee-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-95-5bb2acee-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5bb2acee-21b8-4703-97e7-8ba1d3d4988c";
const SEIRYUIN_ID = "ba02838b-355b-43b7-9dad-2fa8ff3405e9";
const TOFUKUJI_ID = "c0eb670e-4e45-4fee-92c7-777576cc0474";
const NISHIHONGANJI_ID = "21ef4e50-d143-48d2-b962-e6c7d8f17a25";
const ROKUHARAMITSUJI_ID = "77513450-eb9e-4092-8dff-b96de2fcade4";
const YASAKAJINJA_ID = "848ca4f7-8c85-4172-b265-d6aa00d98824";
const FUSHIMIINARI_ID = "8b587b78-5be8-46b6-a2db-b5875b502c60";

const SPOT_PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: SEIRYUIN_ID,
    label: "青蓮院(宿泊の一文)",
    find: "今夜はこの近くの宿にご宿泊いただきます。",
    replace: "この夜は、京都駅のあたりの宿に泊まりましょう。",
  },
  {
    id: TOFUKUJI_ID,
    label: "東福寺(宿からの行き方)",
    find: "JR・京阪東福寺駅から徒歩約10分。",
    replace: "2日目は、宿からJRか京阪で東福寺駅へ。駅から歩いて約10分。",
  },
  {
    id: NISHIHONGANJI_ID,
    label: "西本願寺(帰りの一文)",
    find: "見学を終えたら、徒歩やバスで京都駅へ戻りましょう。",
    replace: "見学を終えたら、歩いて約17分の京都駅から帰りましょう。",
  },
  {
    id: ROKUHARAMITSUJI_ID,
    label: "六波羅蜜寺(書き出し)",
    find: "天暦5年(951)、醍醐天皇の皇子とも伝えられる空也上人が開いた西光寺を前身とする寺院です。",
    replace: "清水寺からは徒歩16分ほどです。天暦5年(951)、醍醐天皇の皇子とも伝えられる空也上人が開いた西光寺を前身とする寺院です。",
  },
  {
    id: YASAKAJINJA_ID,
    label: "八坂神社(書き出し)",
    find: "社伝では、斉明天皇2年(656)、高麗から渡来した使節が素戔嗚尊を祀ったのが始まりと伝えられ、",
    replace: "六波羅蜜寺からは徒歩15分ほどです。社伝では、斉明天皇2年(656)、高麗から渡来した使節が素戔嗚尊を祀ったのが始まりと伝えられ、",
  },
  {
    id: FUSHIMIINARI_ID,
    label: "伏見稲荷大社(書き出し)",
    find: "和銅4年(711)、この地の豪族・秦伊呂具が、稲荷山の三ヶ峰に稲荷大神を祀ったのが始まりと伝えられる、",
    replace: "東福寺からは電車で15分ほどです。和銅4年(711)、この地の豪族・秦伊呂具が、稲荷山の三ヶ峰に稲荷大神を祀ったのが始まりと伝えられる、",
  },
];

const DESCRIPTION_FIND = "お出かけ前に各寺社の公式の案内で確かめてください。";
const DESCRIPTION_REPLACE = "お出かけ前に各寺社の公式の案内で確かめましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(SPOT_PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  const itinerary = await prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } });
  let description = itinerary.description ?? "";

  for (const p of SPOT_PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  if (!description.includes(DESCRIPTION_FIND)) {
    console.log(`[想定と違います] 説明文に「${DESCRIPTION_FIND}」が見つかりません。処理を中止します。`);
    return;
  }

  for (const p of SPOT_PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }
  description = description.replace(DESCRIPTION_FIND, DESCRIPTION_REPLACE);

  console.log("=== #95 訂正その2 ===\n");
  for (const p of SPOT_PAIRS) {
    console.log(`[${p.label}]`);
    console.log(memoById.get(p.id)!.slice(0, 80));
    console.log();
  }
  console.log("[説明文]");
  console.log(description);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    ...ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })),
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
