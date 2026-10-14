/**
 * #12(14e1c69b)復元時に、写真が複製されていなかった不具合の修正
 * (企画運営指摘、2026-10-14)。#11(fcd98df3)側の対応するスポットの写真を、
 * 同じ画像・同じ出典表示で#12側にも複製する(#11の写真行は消さない)。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-book12-photos.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-book12-photos.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

// [#11側のspotId, #12側のspotId]
const PAIRS: [string, string][] = [
  ["55eab58b-cc26-42fb-ae4b-d0fea6ba58f9", "d0113123-7c6c-4f11-a9e9-1a7a12d74668"], // 金剛福寺
  ["f22745fa-e270-4395-aad5-adbbd1141336", "02e5846a-5c97-4b41-b41a-07c0dcba08eb"], // 足摺岬灯台
  ["9c2bfbba-e163-4d69-abda-a891320c2b10", "183c07a6-5d1d-48e0-92bd-c332bad1bd43"], // 白山洞門
  ["ca71aa3c-a53c-4fd6-ad90-dfecbb2a9579", "2722058e-3ca1-4dc6-8e77-c93a21d78efc"], // ジョン万次郎資料館
  ["a0f96af0-7b90-44d2-bc32-5e7edc4eb9e8", "a3849334-7551-4d5d-bb5d-b71b64b6e9c6"], // 延光寺
  ["308169a9-e3e9-4935-82f9-942fdea4c002", "e0975119-49cb-4710-9e99-4c219f41a7c6"], // 咸陽島
  ["d263181f-3686-4296-8b81-3757f9b99771", "bc67c878-7b5c-4e48-afc3-f870ae156a0c"], // 大堂海岸
];

async function main() {
  let okCount = 0;
  for (const [fromId, toId] of PAIRS) {
    const fromSpot = await prisma.spot.findUnique({ where: { id: fromId }, include: { photos: true } });
    const toSpot = await prisma.spot.findUnique({ where: { id: toId }, include: { photos: true } });
    if (!fromSpot || !toSpot) throw new Error(`想定と違います(${fromId} -> ${toId})`);
    if (toSpot.photos.length !== 0) {
      console.log(`[スキップ] ${toSpot.name}(${toId}) には既に写真があります(${toSpot.photos.length}件)`);
      continue;
    }
    if (fromSpot.photos.length === 0) {
      console.log(`[NG] ${fromSpot.name}(${fromId}) に写真がありません`);
      continue;
    }
    for (const p of fromSpot.photos) {
      console.log(`[確認OK] ${fromSpot.name}: ${p.url} を複製 → ${toSpot.name}(${toId})`);
      if (COMMIT) {
        await prisma.photo.create({
          data: {
            spotId: toId, url: p.url, caption: p.caption, sourceUrl: p.sourceUrl,
            author: p.author, license: p.license, licenseUrl: p.licenseUrl, sourcePhotoId: p.id,
          },
        });
      }
    }
    okCount++;
  }
  console.log(`\n対象: ${okCount} / ${PAIRS.length}`);
  if (!COMMIT) console.log("確認モードです。--commit で書き込みます。");
  else console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
