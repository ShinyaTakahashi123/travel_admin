/**
 * サンプルしおり用にBlobへ保存した写真（Wikipediaの元画像そのまま・1枚数MB〜十数MB）を、
 * 横幅1280pxのJPEGに縮小して差し替える。Blob容量（Hobbyは1GB）の節約と表示速度の改善が目的。
 *
 * 対象はseedスクリプトが使うフォルダ（SEED_FOLDERS）のみ。プランナー・ユーザーが
 * アップロードした写真（itineraries/, planners/ など）には触れない。
 *
 * 1枚ごとに「縮小版を保存 → DBの参照先（Photo.url / Itinerary.thumbnailUrl）を切り替え → 元画像を削除」
 * の順で処理するため、途中で止まってもサイトの表示は崩れず、再実行すれば続きから処理される。
 * 最後に、対象フォルダ内でどこからも参照されていない画像を削除する。
 *
 * 実行方法:
 *   npx tsx --env-file=.env prisma/shrink-seed-images.ts           … 確認モード（何も変更しない）
 *   npx tsx --env-file=.env prisma/shrink-seed-images.ts --commit  … 実行
 */
import { readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { list, put, del } from "@vercel/blob";
import { prisma } from "../src/lib/prisma";
import { toWebJpeg } from "./lib/pilot-gen";

const SEED_FOLDERS = ["batch2", "pilot-launch", "koyo-2026"];
// これ以下のサイズの画像は縮小済みとみなして対象外にする
const SIZE_THRESHOLD = 500 * 1024;

type BlobInfo = { url: string; pathname: string; size: number };

async function listAll(): Promise<BlobInfo[]> {
  const all: BlobInfo[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ cursor, limit: 1000 });
    all.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return all;
}

async function referencedUrls(): Promise<Set<string>> {
  const refs = new Set<string>();
  for (const p of await prisma.photo.findMany({ select: { url: true } })) refs.add(p.url);
  for (const i of await prisma.itinerary.findMany({ select: { thumbnailUrl: true } })) if (i.thumbnailUrl) refs.add(i.thumbnailUrl);
  for (const p of await prisma.plannerAccount.findMany({ select: { iconUrl: true } })) if (p.iconUrl) refs.add(p.iconUrl);
  for (const u of await prisma.userAccount.findMany({ select: { iconUrl: true } })) if (u.iconUrl) refs.add(u.iconUrl);
  return refs;
}

const mb = (bytes: number) => `${(bytes / 1048576).toFixed(1)} MB`;

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "実行モード" : "確認モード（何も変更しません）");

  const inSeedFolder = (b: BlobInfo) => SEED_FOLDERS.includes(b.pathname.split("/")[0]);
  const all = await listAll();
  const refs = await referencedUrls();
  const targets = all.filter((b) => inSeedFolder(b) && refs.has(b.url) && b.size > SIZE_THRESHOLD);
  const orphans = all.filter((b) => inSeedFolder(b) && !refs.has(b.url));
  console.log(`全体: ${all.length}枚 ${mb(all.reduce((s, b) => s + b.size, 0))}`);
  console.log(`縮小対象: ${targets.length}枚 ${mb(targets.reduce((s, b) => s + b.size, 0))}`);
  console.log(`未参照（削除対象）: ${orphans.length}枚 ${mb(orphans.reduce((s, b) => s + b.size, 0))}`);
  if (!commit) return;

  const cachePath = join(process.cwd(), "prisma", "photo-cache.json");
  const cache: Record<string, string> = JSON.parse(readFileSync(cachePath, "utf8"));

  let before = 0;
  let after = 0;
  async function shrinkOne(blob: BlobInfo): Promise<number> {
    const res = await fetch(blob.url);
    if (!res.ok) throw new Error(`取得失敗 ${res.status}`);
    const small = await toWebJpeg(Buffer.from(await res.arrayBuffer()));
    const newPath = blob.pathname.replace(/-[A-Za-z0-9]{30}\.[a-z]+$/, "").replace(/\.[a-z]+$/, "") + ".jpg";
    const uploaded = await put(newPath, small, { access: "public", addRandomSuffix: true });

    await prisma.photo.updateMany({ where: { url: blob.url }, data: { url: uploaded.url } });
    await prisma.itinerary.updateMany({ where: { thumbnailUrl: blob.url }, data: { thumbnailUrl: uploaded.url } });
    for (const [k, v] of Object.entries(cache)) if (v === blob.url) cache[k] = uploaded.url;
    await del(blob.url);
    return small.length;
  }

  for (const [i, blob] of targets.entries()) {
    // 通信が途中で切れることがあるため、1枚ごとに最大3回まで再試行する。
    // どの段階で失敗しても、残った不要な画像は最後の未参照画像の削除で片付く。
    let smallSize: number | null = null;
    for (let attempt = 1; attempt <= 3 && smallSize === null; attempt++) {
      try {
        smallSize = await shrinkOne(blob);
      } catch (e) {
        console.warn(`  失敗(${attempt}回目): ${blob.pathname} - ${(e as Error).message}`);
        await new Promise((r) => setTimeout(r, 3000 * attempt));
      }
    }
    if (smallSize === null) continue;

    before += blob.size;
    after += smallSize;
    if ((i + 1) % 20 === 0 || i === targets.length - 1) {
      console.log(`  ${i + 1}/${targets.length}枚 完了（${mb(before)} → ${mb(after)}）`);
      writeFileSync(cachePath, JSON.stringify(cache));
    }
  }
  writeFileSync(cachePath, JSON.stringify(cache));

  // 縮小中に参照が変わっている可能性があるため、削除直前に参照状況を取り直す
  const latestRefs = await referencedUrls();
  const latestOrphans = (await listAll()).filter((b) => inSeedFolder(b) && !latestRefs.has(b.url));
  for (let i = 0; i < latestOrphans.length; i += 50) await del(latestOrphans.slice(i, i + 50).map((b) => b.url));
  console.log(`未参照の画像を削除: ${latestOrphans.length}枚`);

  const final = await listAll();

  // 中断のタイミングによっては、削除済み画像のURLがキャッシュに残るため取り除く
  const existing = new Set(final.map((b) => b.url));
  const cleaned = Object.fromEntries(Object.entries(cache).filter(([, v]) => existing.has(v)));
  console.log(`写真キャッシュ: ${Object.keys(cache).length}件 → ${Object.keys(cleaned).length}件`);
  writeFileSync(cachePath, JSON.stringify(cleaned));

  console.log(`完了: ${final.length}枚 ${mb(final.reduce((s, b) => s + b.size, 0))}`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
