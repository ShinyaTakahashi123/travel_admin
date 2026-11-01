/**
 * 企画運営経由のユーザー指示（2026-11-02、「冬の特集3つと、大洲・横手のしおりを公開して」）。
 * 法務の最後の確認済みコミット 63a2ad8 の内容を公開する。
 *  - 特集 winter-onsen-1paku2nichi・hatsumode-daytrip・yukimatsuri-fuyukeshiki を
 *    draft→published
 *  - しおり 5ce1979f（大洲）・24d89ab2（横手）を pending→published
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const FEATURE_SLUGS = ["winter-onsen-1paku2nichi", "hatsumode-daytrip", "yukimatsuri-fuyukeshiki"];
const ITIN_IDS = ["5ce1979f-5a9d-4e9b-9f6f-8a24a0dc637d", "24d89ab2-9ba9-4b01-90aa-f4e1072a8091"];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const features = await prisma.feature.findMany({ where: { slug: { in: FEATURE_SLUGS } } });
  if (features.length !== FEATURE_SLUGS.length) throw new Error("特集が3本見つかりません");
  for (const f of features) {
    if (f.status !== "draft") throw new Error(`${f.slug}: statusがdraftではありません(${f.status})`);
  }

  const itins = await prisma.itinerary.findMany({ where: { id: { in: ITIN_IDS } } });
  if (itins.length !== ITIN_IDS.length) throw new Error("しおりが2本見つかりません");
  for (const i of itins) {
    if (i.status !== "pending") throw new Error(`${i.title}: statusがpendingではありません(${i.status})`);
  }

  console.log("\n[公開するもの]");
  for (const f of features) console.log(`特集 ${f.slug}: draft → published`);
  for (const i of itins) console.log(`しおり ${i.title}: pending → published`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const f of features) {
      await tx.feature.update({ where: { id: f.id }, data: { status: "published" } });
    }
    for (const i of itins) {
      await tx.itinerary.update({ where: { id: i.id }, data: { status: "published" } });
    }
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
