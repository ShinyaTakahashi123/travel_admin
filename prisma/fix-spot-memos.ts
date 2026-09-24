/**
 * スポット紹介文のピンポイント修正（企画運営・法務からの事実確認指摘への対応）
 * _kyoto-fix*.json（[{itineraryId, spotName, newMemo}, ...]）を読み込み、該当スポットのmemoだけを更新する。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/fix-spot-memos.ts <fixファイル>
 *   登録モード: npx tsx prisma/fix-spot-memos.ts <fixファイル> --commit
 */
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

type Fix = { itineraryId: string; spotName: string; newMemo: string };

async function main() {
  const fixFile = process.argv[2];
  const commit = process.argv.includes("--commit");
  if (!fixFile) throw new Error("fixファイルを指定してください");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const fixes: Fix[] = JSON.parse(fs.readFileSync(path.resolve(fixFile), "utf8"));
  let updated = 0;

  for (const fix of fixes) {
    const it = await prisma.itinerary.findUnique({
      where: { id: fix.itineraryId },
      select: {
        title: true,
        days: { select: { spots: { where: { name: fix.spotName }, select: { id: true, memo: true } } } },
      },
    });
    if (!it) throw new Error(`しおりが見つかりません: ${fix.itineraryId}`);
    const spots = it.days.flatMap((d) => d.spots);
    if (spots.length !== 1) {
      throw new Error(`スポットが一意に特定できません: ${fix.itineraryId} ${it.title} / ${fix.spotName}（${spots.length}件）`);
    }
    const spot = spots[0];
    console.log(`\n■ ${it.title} / ${fix.spotName} (${[...fix.newMemo].length}字)`);
    console.log(`  変更前: ${spot.memo}`);
    console.log(`  変更後: ${fix.newMemo}`);
    if (commit) {
      await prisma.spot.update({ where: { id: spot.id }, data: { memo: fix.newMemo } });
    }
    updated++;
  }

  console.log(`\n対象件数: ${updated}`);
  if (!commit) console.log("確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
  else console.log("登録しました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
