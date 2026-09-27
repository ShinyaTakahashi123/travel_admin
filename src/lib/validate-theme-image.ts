import sharp from "sharp";
import { del } from "@vercel/blob";
import { fail, ActionError } from "@/lib/action-result";

const ALLOWED_FORMATS = ["jpeg", "png", "webp"];
const MAX_BYTES = 400 * 1024;

// アップロードされた画像(Vercel BlobのURL)が、形式・サイズの条件を満たすかサーバー側で
// 確かめる。クライアント側のcanvas再エンコードをすり抜けて直接アップロードAPIを叩かれた
// 場合の保険。public/themes/配下の既存の絵を選んだだけの相対パスは対象外(検証不要)
export async function assertValidThemeImageUrl(url: string): Promise<void> {
  if (!url.startsWith("https://")) return;

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
