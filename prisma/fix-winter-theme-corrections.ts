/**
 * 企画運営からの事実確認指摘を反映する修正スクリプト
 * 1. 麓郷の森（冬季閉鎖）を含む旧「白銀の青い池ライトアップ」しおりを削除
 *    （タイトル変更後のニングルテラス版は既にseed-winter-theme.tsで作成済み）
 * 2. タイトルが変わらなかった3件（神戸ルミナリエ/湯西川温泉かまくら祭り/弘前城）の
 *    メモ文言を、seed-winter-theme.ts側の修正と同じ内容に更新
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/fix-winter-theme-corrections.ts
 *   登録モード: npx tsx prisma/fix-winter-theme-corrections.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const OLD_TITLE_TO_DELETE = "白銀の青い池ライトアップ、冬の富良野・美瑛を楽しむプラン";

const MEMO_FIXES: { itineraryTitle: string; spotName: string; newMemo: string }[] = [
  {
    itineraryTitle: "神戸ルミナリエと冬の夜景、光あふれる神戸を楽しむプラン",
    spotName: "神戸ルミナリエ",
    newMemo: "阪神・淡路大震災の鎮魂と復興への祈りを込めた光の回廊。近年は1月下旬〜2月上旬ごろに開催されています（開催時期は公式サイトで要確認）。",
  },
  {
    itineraryTitle: "雪の奥日光と湯西川温泉かまくら祭り、冬の日光プラン",
    spotName: "湯西川温泉かまくら祭り",
    newMemo: "雪原に小さなかまくらとろうそくの灯りが並ぶ、幻想的な冬の祭り。例年1月下旬〜2月ごろの開催です（開催時期は公式サイトで要確認）。",
  },
  {
    itineraryTitle: "弘前城雪燈籠まつりと津軽の冬、雪あかりの城下町プラン",
    spotName: "弘前城（弘前公園）",
    newMemo: "雪灯籠やミニかまくらが園内を彩る「弘前城雪燈籠まつり」の会場。例年2月中旬ごろの開催で、夕方からのライトアップが見どころです（開催時期は公式サイトで要確認）。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  // 1. 旧「青い池ライトアップ」しおりの削除
  const oldIt = await prisma.itinerary.findFirst({ where: { title: OLD_TITLE_TO_DELETE } });
  console.log(`\n■ 削除対象: ${OLD_TITLE_TO_DELETE}`);
  console.log(oldIt ? `  id=${oldIt.id}（見つかりました）` : "  見つかりません（既に削除済みの可能性）");

  // 2. メモ文言の修正
  console.log("\n■ メモ修正対象:");
  const spotUpdates: { spotId: string; itineraryTitle: string; spotName: string; oldMemo: string | null; newMemo: string }[] = [];
  for (const fix of MEMO_FIXES) {
    const it = await prisma.itinerary.findFirst({
      where: { title: fix.itineraryTitle },
      include: { days: { include: { spots: true } } },
    });
    if (!it) { console.log(`  見つかりません: ${fix.itineraryTitle}`); continue; }
    const spot = it.days.flatMap((d) => d.spots).find((s) => s.name === fix.spotName);
    if (!spot) { console.log(`  スポットが見つかりません: ${fix.itineraryTitle} / ${fix.spotName}`); continue; }
    console.log(`  ${fix.itineraryTitle} / ${fix.spotName}`);
    console.log(`    旧: ${spot.memo}`);
    console.log(`    新: ${fix.newMemo}`);
    spotUpdates.push({ spotId: spot.id, itineraryTitle: fix.itineraryTitle, spotName: fix.spotName, oldMemo: spot.memo, newMemo: fix.newMemo });
  }

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  if (oldIt) {
    await prisma.itinerary.delete({ where: { id: oldIt.id } });
    console.log(`\n削除しました: ${OLD_TITLE_TO_DELETE}`);
  }

  for (const u of spotUpdates) {
    await prisma.spot.update({ where: { id: u.spotId }, data: { memo: u.newMemo } });
  }
  console.log(`メモを更新しました: ${spotUpdates.length}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
