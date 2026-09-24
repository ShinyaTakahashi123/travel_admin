/**
 * 上高地3件の開山期間・マイカー規制の注記追加（企画運営からの指摘対応）
 * 既に公開済みのため、説明文とメモをライブDBに直接反映する。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/fix-kamikochi-season.ts
 *   登録モード: npx tsx prisma/fix-kamikochi-season.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const FIXES: {
  title: string;
  newDescription: string;
  spotFix?: { spotName: string; newMemo: string };
}[] = [
  {
    title: "河童橋と穂高連峰、上高地の定番絶景を楽しむ日帰りプラン",
    newDescription:
      "梓川に架かる河童橋から望む穂高連峰。上高地観光の定番プランです。例年4月下旬〜11月中旬の開山期間のみ訪問でき、マイカー規制のため沢渡・平湯からバスかタクシーで入ります。",
    spotFix: {
      spotName: "河童橋",
      newMemo:
        "梓川に架かる、上高地のシンボル的な木造の吊り橋。穂高連峰の絶景で知られる。例年4月下旬〜11月中旬の開山期間のみ通行可（マイカー規制、沢渡・平湯からバス・タクシーで入る）。時期は公式サイトで要確認。",
    },
  },
  {
    title: "大正池の神秘的な風景、枯れ木と穂高を望む上高地さんぽ",
    newDescription:
      "大正時代の焼岳の噴火でできた大正池。水没した木々と穂高連峰が織りなす、幻想的な風景を楽しむプランです。例年4月下旬〜11月中旬の開山期間のみで、マイカーは規制され沢渡・平湯からバス・タクシーで向かいます。",
    spotFix: {
      spotName: "大正池",
      newMemo:
        "1915年の焼岳噴火でできた、立ち枯れの木々が幻想的な池。例年4月下旬〜11月中旬の開山期間のみ訪問可（マイカー規制、沢渡・平湯からバス・タクシーで入る）。時期は公式サイトで要確認。",
    },
  },
  {
    title: "明神池と穂高神社奥宮、上高地の静寂を歩く1泊2日",
    newDescription:
      "神秘的な明神池と、その畔に鎮座する穂高神社奥宮。定番の河童橋周辺よりも静かな上高地の奥地を歩く1泊2日です。例年4月下旬〜11月中旬の開山期間のみ訪問でき、マイカー規制のため沢渡・平湯からバスかタクシーで入ります。",
    spotFix: {
      spotName: "穂高神社奥宮",
      newMemo:
        "梓川沿いの遊歩道を歩いて到着する、穂高神社の奥宮。例年4月下旬〜11月中旬の開山期間のみ、マイカー規制のため沢渡・平湯からバス・タクシーで入る。時期は公式サイトで要確認。",
    },
  },
];

async function main() {
  for (const fix of FIXES) {
    const itinerary = await prisma.itinerary.findFirst({
      where: { title: fix.title },
      include: { days: { include: { spots: true } } },
    });
    if (!itinerary) {
      console.log(`[見つからず] ${fix.title}`);
      continue;
    }
    console.log(`\n=== ${fix.title} ===`);
    console.log(`旧description: ${itinerary.description}`);
    console.log(`新description: ${fix.newDescription}`);

    let spotId: string | null = null;
    if (fix.spotFix) {
      for (const day of itinerary.days) {
        const spot = day.spots.find((s) => s.name === fix.spotFix!.spotName);
        if (spot) {
          spotId = spot.id;
          console.log(`旧memo(${spot.name}): ${spot.memo}`);
          console.log(`新memo(${spot.name}): ${fix.spotFix!.newMemo}`);
        }
      }
      if (!spotId) console.log(`[スポット見つからず] ${fix.spotFix.spotName}`);
    }

    if (COMMIT) {
      await prisma.itinerary.update({
        where: { id: itinerary.id },
        data: { description: fix.newDescription },
      });
      if (spotId && fix.spotFix) {
        await prisma.spot.update({
          where: { id: spotId },
          data: { memo: fix.spotFix.newMemo },
        });
      }
      console.log("→ 更新しました");
    }
  }

  if (!COMMIT) {
    console.log("\n(確認モードのみ。--commit で実際に反映します)");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
