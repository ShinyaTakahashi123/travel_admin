import { list, del } from "@vercel/blob";
import { prisma } from "@/lib/prisma";

export type BlobInfo = { url: string; pathname: string; size: number; uploadedAt: Date };

export async function listAllBlobs(): Promise<BlobInfo[]> {
  const all: BlobInfo[] = [];
  let cursor: string | undefined;
  do {
    const r = await list({ cursor, limit: 1000 });
    all.push(...r.blobs);
    cursor = r.hasMore ? r.cursor : undefined;
  } while (cursor);
  return all;
}

/** DBから参照されている画像URL（スポット写真・しおりサムネイル・プランナー/ユーザーのアイコン） */
export async function referencedBlobUrls(): Promise<Set<string>> {
  const [photos, itineraries, planners, users] = await Promise.all([
    prisma.photo.findMany({ select: { url: true } }),
    prisma.itinerary.findMany({ where: { thumbnailUrl: { not: null } }, select: { thumbnailUrl: true } }),
    prisma.plannerAccount.findMany({ where: { iconUrl: { not: null } }, select: { iconUrl: true } }),
    prisma.userAccount.findMany({ where: { iconUrl: { not: null } }, select: { iconUrl: true } }),
  ]);
  return new Set([
    ...photos.map((p) => p.url),
    ...itineraries.map((i) => i.thumbnailUrl!),
    ...planners.map((p) => p.iconUrl!),
    ...users.map((u) => u.iconUrl!),
  ]);
}

export type CleanupResult = {
  dryRun: boolean;
  totalBlobs: number;
  totalBytes: number;
  referencedUrls: number;
  candidates: number;
  deleted: number;
  deletedBytes: number;
  aborted?: string;
};

/**
 * どこからも参照されていない画像を削除する（差し替え・削除された写真や、アップロード後に保存されなかった写真）。
 * 削除は取り消せないため、誤削除を防ぐ安全策を入れている:
 *  - アップロードから minAgeHours 未満の画像は対象外（編集中でまだ保存されていない写真や、
 *    seedスクリプトがアップロードしてからDBに登録するまでの間の画像を消さないため）
 *  - 参照中の画像が1件も取れなかった場合は中止（DB読み込みの不具合で全削除になるのを防ぐ）
 *  - 削除対象が全体の maxDeleteRatio を超える場合は中止（想定外の大量削除を防ぐ）
 *  - 1回の削除は maxDeletes 件まで（残りは次回以降に処理）
 */
export async function cleanupUnreferencedBlobs({
  dryRun = false,
  minAgeHours = 24,
  maxDeleteRatio = 0.3,
  maxDeletes = 200,
}: { dryRun?: boolean; minAgeHours?: number; maxDeleteRatio?: number; maxDeletes?: number } = {}): Promise<CleanupResult> {
  const blobs = await listAllBlobs();
  const refs = await referencedBlobUrls();
  const result: CleanupResult = {
    dryRun,
    totalBlobs: blobs.length,
    totalBytes: blobs.reduce((s, b) => s + b.size, 0),
    referencedUrls: refs.size,
    candidates: 0,
    deleted: 0,
    deletedBytes: 0,
  };

  if (refs.size === 0) return { ...result, aborted: "参照中の画像が0件のため中止しました" };

  const cutoff = Date.now() - minAgeHours * 60 * 60 * 1000;
  const candidates = blobs.filter((b) => !refs.has(b.url) && b.uploadedAt.getTime() < cutoff);
  result.candidates = candidates.length;

  if (candidates.length > blobs.length * maxDeleteRatio) {
    return { ...result, aborted: `削除対象が全体の${Math.round(maxDeleteRatio * 100)}%を超えるため中止しました` };
  }

  const targets = candidates.slice(0, maxDeletes);
  if (!dryRun) {
    for (let i = 0; i < targets.length; i += 50) await del(targets.slice(i, i + 50).map((b) => b.url));
  }
  result.deleted = targets.length;
  result.deletedBytes = targets.reduce((s, b) => s + b.size, 0);
  return result;
}
