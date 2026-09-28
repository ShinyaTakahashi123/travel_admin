import { fail } from "@/lib/action-result";

// 自分(このアプリ)のVercel Blobの保存場所のホスト名を、BLOB_READ_WRITE_TOKEN
// (形式: vercel_blob_rw_<保存場所のID>_...)から取り出す(validate-theme-image.tsと同じ方式。
// セキュリティ指摘2026-09-28: ホストを*.public.blob.vercel-storage.comで終わるかどうかだけで
// 判定すると、ほかの人のBlobの保存場所のURLも通ってしまうため)
function ownBlobHost(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const match = token?.match(/^vercel_blob_rw_([a-zA-Z0-9]+)_/);
  return match ? `${match[1].toLowerCase()}.public.blob.vercel-storage.com` : null;
}

// 台帳の写真のURLが、自分のBlobの保存場所のものかサーバー側で確かめる(仕様書4節3:
// テーマの絵と同じ確かめ)。台帳の写真は、制作がスポットの既存の写真をそのまま指す
//運用を想定しているため、特定のフォルダには絞らず、ホストの一致だけを見る
export function assertValidPlaceMasterPhotoUrl(url: string | null | undefined): void {
  if (!url) return; // 写真は任意
  if (!url.startsWith("https://")) fail("画像のURLが不正です");
  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail("画像のURLが不正です");
  }
  const expectedHost = ownBlobHost();
  const isOwnBlobHost = expectedHost !== null && parsed.hostname.toLowerCase() === expectedHost;
  if (!isOwnBlobHost) {
    fail("この画像のURLは受け付けられません(自分の保存場所の画像のみ使えます)");
  }
}

const ALLOWED_PHOTO_LICENSES = ["パブリックドメイン", "CC0", "CC BY", "CC BY-SA"];

// 台帳の写真のライセンスは、商用利用・加工ができるものだけを受け付ける
// (NC=非営利のみ・ND=改変禁止は入れない。法務2026-09-28確認)
export function assertValidPlaceMasterPhotoLicense(license: string | null | undefined): void {
  if (!license) return;
  const normalized = license.trim();
  const isAllowed = ALLOWED_PHOTO_LICENSES.some(
    (allowed) => normalized === allowed || normalized.startsWith(`${allowed} `) || normalized.startsWith(`${allowed}(`)
  );
  if (!isAllowed) {
    fail("写真のライセンスは、パブリックドメイン・CC0・CC BY・CC BY-SAのいずれかにしてください(NC・NDは使えません)");
  }
}
