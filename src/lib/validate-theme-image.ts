import sharp from "sharp";
import { del } from "@vercel/blob";
import { fail, ActionError } from "@/lib/action-result";
import { THEME_IMAGE_CATALOG } from "@/lib/theme-image-catalog";
import { THEME_IMAGE_UPLOAD_PREFIX } from "@/lib/theme-image-constants";

const ALLOWED_FORMATS = ["jpeg", "png", "webp"];
const MAX_BYTES = 400 * 1024;

// 自分(このアプリ)のVercel Blobの保存場所のホスト名を、BLOB_READ_WRITE_TOKEN
// (形式: vercel_blob_rw_<保存場所のID>_...)から取り出す。鍵から取ることで、
// 本番・開発用のどちらでも環境変数を増やさずに自動で合う(セキュリティ指摘2026-09-28、
// 「もう1点」: ホストを*.public.blob.vercel-storage.comで終わるかどうかだけで
// 判定すると、ほかの人のBlobの保存場所のtheme-images/配下のURLも通ってしまうため)
function ownBlobHost(): string | null {
  const token = process.env.BLOB_READ_WRITE_TOKEN;
  const match = token?.match(/^vercel_blob_rw_([a-zA-Z0-9]+)_/);
  return match ? `${match[1].toLowerCase()}.public.blob.vercel-storage.com` : null;
}

// アップロードされた画像(Vercel Blob)のURL、またはpublic/themes/配下の既存の絵を
// 選んだ相対パスが、テーマの絵として受け付けてよいものかサーバー側で確かめる。
// (セキュリティ指摘 2026-09-28)
// - httpsのURLは、行き先を限らず取得しに行くと、
//   (a) 同じBlob内の他の用途(プランナーの写真等)のURLを指しても取得・削除できてしまう
//   (b) ほかの人のBlobの保存場所・外部サイトのURLも通り、サーバーが任意の外部へ
//       取得しに行けてしまう(SSRF、持ち主に見た人のアクセスが記録される)
//   ため、ホストが自分のBlobの保存場所と完全に一致し、かつpathがTHEME_IMAGE_UPLOAD_PREFIXで
//   始まる場合だけ受け付ける。それ以外はfetch/delを一切行わず拒否する
// - 相対パスは、THEME_IMAGE_CATALOGにある値だけ受け付ける(一覧にない値の混入を防ぐ)
export async function assertValidThemeImageUrl(url: string): Promise<void> {
  if (!url.startsWith("https://")) {
    if (!THEME_IMAGE_CATALOG.some((img) => img.path === url)) {
      fail("用意されている絵の一覧にない画像です");
    }
    return;
  }

  let parsed: URL;
  try {
    parsed = new URL(url);
  } catch {
    fail("画像のURLが不正です");
  }
  const expectedHost = ownBlobHost();
  const isOwnBlobHost = expectedHost !== null && parsed.hostname.toLowerCase() === expectedHost;
  const isThemeImagePath = parsed.pathname.replace(/^\//, "").startsWith(THEME_IMAGE_UPLOAD_PREFIX);
  if (!isOwnBlobHost || !isThemeImagePath) {
    // fetch・delを行わずに拒否する(他用途・他人のBlobを取得・削除させない、外部URLに取得しに行かない)
    fail("この画像のURLは受け付けられません。アップロードからやり直してください");
  }

  let bytes: ArrayBuffer;
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
    bytes = await res.arrayBuffer();
  } catch {
    fail("画像の取得に失敗しました。もう一度アップロードしてください");
  }

  if (bytes.byteLength > MAX_BYTES) {
    await del(url).catch(() => {});
    fail("画像は400KB以下にしてください");
  }

  try {
    const meta = await sharp(Buffer.from(bytes)).metadata();
    if (!meta.format || !ALLOWED_FORMATS.includes(meta.format)) {
      await del(url).catch(() => {});
      fail("PNG・JPEG・WebPのいずれかの画像を選んでください");
    }
  } catch (e) {
    if (e instanceof ActionError) throw e;
    await del(url).catch(() => {});
    fail("この画像は読み込めませんでした。別の画像をお試しください");
  }
}
