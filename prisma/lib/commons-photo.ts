/**
 * 写真がなくなったしおりの写真探し(docs/content/20261012-photo-fill.md)用の共通ロジック。
 * Wikipediaの記事のリード画像に頼らず、Wikimedia Commonsの特定のファイルを直接指定して
 * 取得・自由利用ライセンス確認・縮小・Blob保存を行う(pilot-gen.tsのfetchAndUploadImageは
 * 記事名(wikiTitle)経由のみのため、Commonsの検索で見つけた具体的なファイルを使うにはこちらを使う)。
 */
import { put } from "@vercel/blob";
import { toWebJpeg } from "./pilot-gen";

export type PhotoCredit = {
  sourceUrl?: string | null;
  author?: string | null;
  license?: string | null;
  licenseUrl?: string | null;
};

const REJECTED_LICENSE_HINTS = ["フェアユース", "fair use", "著作権法", "noncommercial", "nc", "nd", "no derivative"];
const FREE_LICENSES = [
  "cc by", "cc-by", "cc0", "public domain",
  "パブリックドメイン", "パブリック・ドメイン", "パブリック ドメイン",
  "attribution", "copyrighted free use",
];
function isFreeLicense(licenseShortName: string | undefined): boolean {
  if (!licenseShortName) return false;
  const l = licenseShortName.toLowerCase();
  // "cc by-nc" "cc by-nd" のような非営利・改変不可の派生ライセンスは拒否
  if (/\bnc\b|\bnd\b|noncommercial|non-commercial|no-?derivative/i.test(l)) return false;
  if (REJECTED_LICENSE_HINTS.some((r) => l.includes(r.toLowerCase()))) return false;
  return FREE_LICENSES.some((f) => l.includes(f));
}

function stripHtml(s: string | undefined): string | undefined {
  if (!s) return s;
  return s.replace(/<[^>]+>/g, "").trim() || undefined;
}

const UA = "shiorie-photofill/1.0 (contact: st.83.53.abcd@gmail.com)";

/** Commonsのファイル名(File:を含まない)から、imageinfo(url・ライセンス情報)を取得する */
export async function fetchCommonsImageInfo(
  fileTitle: string
): Promise<{ url: string; credit: PhotoCredit } | null> {
  const res = await fetch(
    `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(`File:${fileTitle}`)}&format=json`,
    { headers: { "User-Agent": UA } }
  );
  if (!res.ok) return null;
  const json = await res.json();
  const page: any = Object.values(json.query?.pages ?? {})[0];
  const ii = page?.imageinfo?.[0];
  if (!ii) return null;

  const meta = ii.extmetadata ?? {};
  const license = meta.LicenseShortName?.value as string | undefined;
  if (!isFreeLicense(license)) return null;

  return {
    url: ii.url as string,
    credit: {
      sourceUrl: ii.descriptionurl as string | undefined,
      author: stripHtml(meta.Artist?.value)?.slice(0, 100),
      license,
      licenseUrl: meta.LicenseUrl?.value as string | undefined,
    },
  };
}

/** Commonsのファイルを取得してBlobへ保存し、保存後のURLを返す */
export async function uploadCommonsFile(
  fileTitle: string,
  spotName: string,
  blobPrefix: string
): Promise<{ url: string; credit: PhotoCredit } | null> {
  const info = await fetchCommonsImageInfo(fileTitle);
  if (!info) return null;

  const imgRes = await fetch(info.url, { headers: { "User-Agent": UA } });
  if (!imgRes.ok) return null;
  const buf = await toWebJpeg(Buffer.from(await imgRes.arrayBuffer()));

  const blob = await put(`${blobPrefix}/${encodeURIComponent(spotName)}.jpg`, buf, {
    access: "public",
    addRandomSuffix: true,
  });
  return { url: blob.url, credit: info.credit };
}
