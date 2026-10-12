/**
 * 台帳(place_master)への写真の追加・バッチ2(101〜200件目、あいうえお順)。
 * バッチ1(add-place-master-photos-batch1.ts)と同じやり方。
 */
import { prisma } from "../src/lib/prisma";
import fs from "fs";

const COMMIT = process.argv.includes("--commit");
const BATCH_SIZE = 100;
const BATCH_OFFSET = 100;

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

  let updated = 0, notFound = 0, alreadyHasPhoto = 0;
  for (const c of batch) {
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
  console.log(`\n${COMMIT ? "COMMITTED" : "確認モード"}: 更新対象 ${updated}件 / 見つからず ${notFound}件 / 既に写真あり ${alreadyHasPhoto}件`);
}
main().finally(() => prisma.$disconnect());
