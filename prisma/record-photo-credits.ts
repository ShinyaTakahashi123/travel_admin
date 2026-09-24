/**
 * 写真の出典（撮影者・ライセンス）の記録（docs/specs/20260924-photo-credits.md B）
 * research-photo-credits.ts の調査結果（_photo-credits-research.json）のうち、
 * status="ok"（自由利用ライセンス確認済み）のものだけをPhotoに記録する。
 * ライセンスが自由利用でない/確認できないものは対象外（別途、差し替え・削除で対応）。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/record-photo-credits.ts
 *   登録モード: npx tsx prisma/record-photo-credits.ts --commit
 */
import fs from "fs";
import path from "path";
import { prisma } from "../src/lib/prisma";

type PhotoResult = {
  photoIds: string[];
  url: string;
  caption: string | null;
  wikiTitle: string | null;
  status: string;
  sourceUrl?: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
};

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const results: PhotoResult[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "_photo-credits-research.json"), "utf8")
  );
  const okResults = results.filter((r) => r.status === "ok");
  const totalPhotos = okResults.reduce((sum, r) => sum + r.photoIds.length, 0);
  console.log(`対象（status=ok）: ${okResults.length}画像 / Photo ${totalPhotos}件`);

  // ライセンスの内訳
  const byLicense = new Map<string, number>();
  for (const r of okResults) byLicense.set(r.license ?? "(不明)", (byLicense.get(r.license ?? "(不明)") ?? 0) + 1);
  console.log("\nライセンス内訳（画像数）:");
  for (const [license, count] of [...byLicense.entries()].sort((a, b) => b[1] - a[1])) {
    console.log(`  ${license}: ${count}件`);
  }

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  let updated = 0;
  for (const r of okResults) {
    await prisma.photo.updateMany({
      where: { id: { in: r.photoIds } },
      data: {
        sourceUrl: r.sourceUrl ?? null,
        author: r.author ?? null,
        license: r.license ?? null,
        licenseUrl: r.licenseUrl ?? null,
      },
    });
    updated += r.photoIds.length;
  }
  console.log(`\n記録しました: ${updated}件（Photo）`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
