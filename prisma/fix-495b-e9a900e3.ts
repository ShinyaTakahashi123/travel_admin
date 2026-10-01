/**
 * #495 e9a900e3 の追いの直し（しおりえ(制作補助2)、2026-10-01 法務の指摘）
 * - 北浜alley の写真（commons Kitahama_alley04s3872.jpg）は1軒の店の入口（OPEN の札・メニューの板）を大きく写した店の看板の写真なので外す
 * - 大街道の写真（commons Ichiban-cho_Street_(Matsuyama_City)_20250416.jpg）も大きな店の看板が目立つので外す（法務の任意の提案）
 * どちらもこのしおりだけに付いていて、表紙ではない（表紙は栗林公園）。
 * 同じ写真がまた登録されないよう、photo-cache.json・photo-credit-cache.json の「北浜alley」「大街道商店街」のキーも消す（制作の手引き 1節）
 * Blob のファイルは手で消さない（Cron が使われなくなった画像を消す）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-495b-e9a900e3.ts [--commit]
 */
import { readFileSync, writeFileSync } from "fs";
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "e9a900e3-b17f-4078-bea9-406de0c438d6";
const PHOTOS: [string, string, string][] = [
  ["f8b8f510-3502-4253-9299-b3750679b4bb", "北浜alley", "Kitahama_alley04s3872"],
  ["dbdb1e1e-e40e-4333-bf6d-e5fe7e477563", "ロープウェー商店街・大街道", "Ichiban-cho_Street_"],
];
const CACHE_KEYS = ["北浜alley", "大街道商店街"];
const COMMIT = process.argv.includes("--commit");

function dropKeys(file: string) {
  const raw = readFileSync(file, "utf8");
  const obj = JSON.parse(raw) as Record<string, unknown>;
  const found = CACHE_KEYS.filter((k) => k in obj);
  for (const k of found) delete obj[k];
  return { found, text: JSON.stringify(obj, null, 2) + (raw.endsWith("\n") ? "\n" : "") };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { thumbnailUrl: true } });
  for (const [id, spotName, key] of PHOTOS) {
    const ph = await prisma.photo.findUniqueOrThrow({ where: { id }, include: { spot: { include: { day: true } } } });
    if (ph.spot?.name !== spotName || ph.spot.day.itineraryId !== ITINERARY_ID || !String(ph.sourceUrl).includes(key)) throw new Error(`写真が想定と違います: ${id}`);
    if (it.thumbnailUrl === ph.url) throw new Error("表紙がこの写真です");
    console.log(`外す: ${spotName} ${ph.sourceUrl}`);
  }
  const files = ["prisma/photo-cache.json", "prisma/photo-credit-cache.json"].map((f) => ({ f, ...dropKeys(f) }));
  for (const x of files) console.log(`${x.f}: 消すキー ${x.found.join("・") || "なし"}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.photo.deleteMany({ where: { id: { in: PHOTOS.map((p) => p[0]) } } });
  for (const x of files) if (x.found.length) writeFileSync(x.f, x.text, "utf8");
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
