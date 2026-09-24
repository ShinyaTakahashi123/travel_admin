/**
 * 写真の差し替え・削除（docs/specs/20260924-photo-credits.md B の続き）
 * _photo-replace-decisions.json（目視確認のうえ手作業で作成）を読み込み、
 * 差し替え(replace)は新しい画像をBlobに保存してPhoto.url+出典4項目を更新、
 * 削除(remove)はPhotoレコードを削除する(サムネイルに使われていた場合は差し替える)。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/replace-remove-photos.ts
 *   登録モード: npx tsx prisma/replace-remove-photos.ts --commit
 */
import fs from "fs";
import path from "path";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { prisma } from "../src/lib/prisma";

const UA = "shiorie-photo-replace/1.0 (contact: st.83.53.abcd@gmail.com)";

type ReplaceDecision = {
  action: "replace";
  photoIds: string[];
  oldUrl: string;
  caption: string | null;
  candidateFileTitle: string;
  candidateLocalPath: string; // 目視確認用にダウンロード済みのローカルファイル
  sourceUrl: string;
  author?: string;
  license: string;
  licenseUrl?: string;
};
type RemoveDecision = {
  action: "remove";
  photoIds: string[];
  oldUrl: string;
  caption: string | null;
  reason: string;
};
type Decision = ReplaceDecision | RemoveDecision;

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const decisions: Decision[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "_photo-replace-decisions.json"), "utf8")
  );
  const replaces = decisions.filter((d): d is ReplaceDecision => d.action === "replace");
  const removes = decisions.filter((d): d is RemoveDecision => d.action === "remove");
  const replacePhotoCount = replaces.reduce((s, d) => s + d.photoIds.length, 0);
  const removePhotoCount = removes.reduce((s, d) => s + d.photoIds.length, 0);
  console.log(`差し替え: ${replaces.length}画像 / Photo ${replacePhotoCount}件`);
  console.log(`削除: ${removes.length}画像 / Photo ${removePhotoCount}件`);
  console.log(`削除の内訳:`);
  for (const d of removes) console.log(`  - ${d.caption ?? "(caption未設定)"}: ${d.reason}`);

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  let replaced = 0;
  for (const d of replaces) {
    const buf = fs.existsSync(d.candidateLocalPath)
      ? fs.readFileSync(d.candidateLocalPath)
      : await fetchBuffer(d.sourceUrl);
    const jpeg = await toWebJpeg(buf);
    const blob = await put(`commons-replacement/${encodeURIComponent(d.caption ?? "photo")}.jpg`, jpeg, {
      access: "public",
      addRandomSuffix: true,
    });
    await prisma.photo.updateMany({
      where: { id: { in: d.photoIds } },
      data: {
        url: blob.url,
        sourceUrl: d.sourceUrl,
        author: d.author ?? null,
        license: d.license,
        licenseUrl: d.licenseUrl ?? null,
      },
    });
    // このURLがしおりのサムネイルに使われていた場合は、新しいURLに差し替える
    const updated = await prisma.itinerary.updateMany({
      where: { thumbnailUrl: d.oldUrl },
      data: { thumbnailUrl: blob.url },
    });
    replaced += d.photoIds.length;
    console.log(`差し替え完了: ${d.caption} -> ${blob.url}（サムネイル更新: ${updated.count}件）`);
  }

  let removed = 0;
  for (const d of removes) {
    // このURLをサムネイルにしているしおりは、同じしおりの別の写真に差し替える（なければnull）
    const affectedItineraries = await prisma.itinerary.findMany({
      where: { thumbnailUrl: d.oldUrl },
      select: { id: true },
    });
    for (const it of affectedItineraries) {
      const nextPhoto = await prisma.photo.findFirst({
        where: { spot: { day: { itineraryId: it.id } }, url: { not: d.oldUrl } },
        orderBy: [{ spot: { day: { dayNumber: "asc" } } }, { spot: { orderNo: "asc" } }],
        select: { url: true },
      });
      // update()は更新後の全列を返そうとし、本番未適用のマイグレーション分の列でP2022になることがあるため、
      // 返り値を使わないupdateMany()にする(admin-site/prisma/backup-db.tsと同じ回避策)。
      await prisma.itinerary.updateMany({ where: { id: it.id }, data: { thumbnailUrl: nextPhoto?.url ?? null } });
    }
    await prisma.photo.deleteMany({ where: { id: { in: d.photoIds } } });
    removed += d.photoIds.length;
    console.log(`削除完了: ${d.caption}（サムネイル差し替え: ${affectedItineraries.length}件）`);
  }

  console.log(`\n差し替え: ${replaced}件、削除: ${removed}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
