/**
 * 台帳(place_master)への写真の追加・バッチ5(401〜500件目、あいうえお順)。
 * バッチ1〜4と同じやり方。送る前の見比べで、高城山展望台は元の候補(吉野山の桜の一般的な
 * 風景で、展望台そのものが写っていなかった)を除外し、展望台の建物が写った写真に
 * fix-placemaster-photos-batch7.tsで差し替える。
 */
import { prisma } from "../src/lib/prisma";
import fs from "fs";

const COMMIT = process.argv.includes("--commit");
const BATCH_SIZE = 100;
const BATCH_OFFSET = 400;
const SKIP_NAMES = new Set(["高城山展望台"]); // 建物が写っていない写真だったため、別のCommonsファイルに差し替える(fix-placemaster-photos-batch7.ts)

type CleanCandidate = {
  canonicalName: string;
  prefecture: string;
  cleanPhoto: { url: string; author: string | null; license: string | null; licenseUrl: string | null; sourceUrl: string | null };
};

async function main() {
  const all: CleanCandidate[] = JSON.parse(fs.readFileSync("_temp-clean-candidates.json", "utf8"));
  const batch = all.slice(BATCH_OFFSET, BATCH_OFFSET + BATCH_SIZE);
  console.log(`対象: ${batch.length}件(${BATCH_OFFSET + 1}〜${BATCH_OFFSET + batch.length}件目、あいうえお順)`);

  const prefectures = await prisma.area.findMany({ where: { level: "prefecture" }, select: { id: true, name: true } });
  const prefMap = new Map(prefectures.map((a) => [a.name, a.id]));

  let updated = 0, notFound = 0, alreadyHasPhoto = 0, skipped = 0;
  for (const c of batch) {
    if (SKIP_NAMES.has(c.canonicalName)) {
      console.log(`[この回はスキップ・別途差し替え] ${c.canonicalName}`);
      skipped++;
      continue;
    }
    const prefectureAreaId = prefMap.get(c.prefecture) || null;
    const place = await prisma.placeMaster.findFirst({ where: { name: c.canonicalName, prefectureAreaId } });
    if (!place) {
      console.log(`[見つからず] ${c.canonicalName}(${c.prefecture})`);
      notFound++;
      continue;
    }
    if (place.photoUrl) {
      console.log(`[既に写真あり・スキップ] ${c.canonicalName}`);
      alreadyHasPhoto++;
      continue;
    }
    console.log(`[確認OK] ${c.canonicalName}(${c.prefecture}) <- ${c.cleanPhoto.sourceUrl}`);
    updated++;
    if (COMMIT) {
      await prisma.placeMaster.update({
        where: { id: place.id },
        data: {
          photoUrl: c.cleanPhoto.url,
          photoAuthor: c.cleanPhoto.author,
          photoLicense: c.cleanPhoto.license,
          photoLicenseUrl: c.cleanPhoto.licenseUrl,
          photoSourceUrl: c.cleanPhoto.sourceUrl,
        },
      });
    }
  }
  console.log(`\n${COMMIT ? "COMMITTED" : "確認モード"}: 更新対象 ${updated}件 / 見つからず ${notFound}件 / 既に写真あり ${alreadyHasPhoto}件 / 別途差し替え ${skipped}件`);
}
main().finally(() => prisma.$disconnect());
