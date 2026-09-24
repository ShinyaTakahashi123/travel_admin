/**
 * スポット紹介文の見直し 第2段階（横展開）— 京都府（docs/specs/20260924-spot-memo-enrichment.md）
 * _kyoto-batch*.json（{itineraryId: [新しいmemo, ...]}、各しおりのDay/orderNo順）を読み込み、
 * 該当スポットのSpot.memoだけを更新する。他のフィールドは一切変更しない。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/update-spot-memos-kyoto.ts <batchファイル>
 *   登録モード: npx tsx prisma/update-spot-memos-kyoto.ts <batchファイル> --commit
 */
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

async function main() {
  const batchFile = process.argv[2];
  const commit = process.argv.includes("--commit");
  if (!batchFile) throw new Error("batchファイルを指定してください");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const batch: Record<string, string[]> = JSON.parse(fs.readFileSync(path.resolve(batchFile), "utf8"));

  let totalSpots = 0;
  const lengths: number[] = [];

  for (const [itineraryId, memos] of Object.entries(batch)) {
    const it = await prisma.itinerary.findUnique({
      where: { id: itineraryId },
      select: {
        title: true,
        plannerAccountId: true,
        status: true,
        days: {
          orderBy: { dayNumber: "asc" },
          select: { spots: { orderBy: { orderNo: "asc" }, select: { id: true, name: true, memo: true } } },
        },
      },
    });
    if (!it) throw new Error(`しおりが見つかりません: ${itineraryId}`);
    if (it.plannerAccountId !== "23329b17-06c7-4e3a-a026-c9f665f7b25d") {
      throw new Error(`しおりえ編集部のしおりではありません（プランナー作成の可能性）: ${itineraryId} ${it.title}`);
    }
    const spots = it.days.flatMap((d) => d.spots);
    if (spots.length !== memos.length) {
      throw new Error(`スポット数が一致しません: ${itineraryId} ${it.title}（DB:${spots.length}件 / batch:${memos.length}件）`);
    }

    console.log(`\n■ ${it.title} (${itineraryId})`);
    for (let i = 0; i < spots.length; i++) {
      const spot = spots[i];
      const newMemo = memos[i];
      const len = [...newMemo].length;
      lengths.push(len);
      totalSpots++;
      console.log(`  [${spot.name}] (${len}字)`);
      console.log(`    変更前: ${spot.memo}`);
      console.log(`    変更後: ${newMemo}`);
      if (commit) {
        await prisma.spot.update({ where: { id: spot.id }, data: { memo: newMemo } });
      }
    }
  }

  console.log(`\n=== 集計 ===`);
  console.log(`対象しおり数: ${Object.keys(batch).length}`);
  console.log(`対象スポット数: ${totalSpots}`);
  console.log(`字数の範囲: ${Math.min(...lengths)}字 〜 ${Math.max(...lengths)}字`);

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
  } else {
    console.log("\n登録しました。");
  }
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
