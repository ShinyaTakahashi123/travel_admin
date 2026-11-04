/**
 * 下書きファイルに書かれたWikimedia Commonsのファイル名から、実際の画像を取り直して
 * Vercel Blobへ保存する(register-draft.tsから使う)。出典・ライセンスは下書きの値をそのまま使う
 * (このファイルでは取得しない。下書きを書く人が確かめた値を信じる)。
 */
import { put } from "@vercel/blob";
import { toWebJpeg } from "./pilot-gen";

const UA = "shiorie-draft-register/1.0 (contact: st.83.53.abcd@gmail.com)";

function normalizeCommonsFile(name: string): string {
  return name.startsWith("File:") || name.startsWith("file:") ? name.slice(5) : name;
}

export async function fetchCommonsImageBuffer(commonsFile: string): Promise<Buffer> {
  const name = normalizeCommonsFile(commonsFile);
  const url = `https://commons.wikimedia.org/wiki/Special:FilePath/${encodeURIComponent(name)}?width=1600`;
  const res = await fetch(url, { headers: { "User-Agent": UA }, redirect: "follow" });
  if (!res.ok) throw new Error(`Commonsの画像が取得できません(${res.status}): ${commonsFile}`);
  return Buffer.from(await res.arrayBuffer());
}

export async function uploadDraftPhoto(commonsFile: string, blobPrefix: string, labelForFilename: string): Promise<string> {
  const original = await fetchCommonsImageBuffer(commonsFile);
  const jpeg = await toWebJpeg(original);
  const blob = await put(`${blobPrefix}/${encodeURIComponent(labelForFilename)}.jpg`, jpeg, {
    access: "public",
    addRandomSuffix: true,
  });
  return blob.url;
}
