/**
 * 写真の出典（撮影者・ライセンス）の調査（docs/specs/20260924-photo-credits.md B）
 * DBは一切変更しない。結果をJSONファイルに出力する。
 *
 * 手順:
 * 1. prisma/*.ts の seedスクリプトから { name, address, wikiTitle } の対応表を作る
 * 2. 各Photoのspot(name+address)から使われたwikiTitleを特定する
 * 3. ファイル名から、地図アイコン・ロゴ等の非写真画像をあらかじめ除外する
 * 4. Wikipedia summary APIで現在の代表画像を取得し、保存済み画像と16×16グレースケールの
 *    画素差分で比較して「取り込み後に代表画像が変わっていないか」を確かめる（縦横比だけでは
 *    同じ比率の別写真を誤って「同じ」と判定してしまうため、画素の中身まで比較する）
 * 5. 一致すれば imageinfo API で Artist・LicenseShortName・LicenseUrl・ファイルページURLを取得
 * 6. 自由利用ライセンス（CC BY / CC BY-SA / CC0 / パブリックドメイン / Attribution /
 *    Copyrighted free use。フェアユース・著作権法の引用規定などは対象外）かどうか判定する
 *
 * 実行方法: npx tsx prisma/research-photo-credits.ts
 * （--commitオプションはない。DB書き込みは行わない）
 */
import fs from "fs";
import path from "path";
import sharp from "sharp";
import { prisma } from "../src/lib/prisma";

const UA = "tabishiori-photo-credits-research/1.0 (contact: st.83.53.abcd@gmail.com)";
const PRISMA_DIR = __dirname;

type Triple = { name: string; address: string; wikiTitle: string; file: string };

function extractTriples(): Triple[] {
  const files = fs.readdirSync(PRISMA_DIR).filter((f) => f.endsWith(".ts"));
  const triples: Triple[] = [];
  for (const file of files) {
    const content = fs.readFileSync(path.join(PRISMA_DIR, file), "utf8");
    const re = /\{\s*name:\s*"((?:[^"\\]|\\.)*)"[^}]{0,400}?\}/g;
    let m: RegExpExecArray | null;
    while ((m = re.exec(content)) !== null) {
      const block = m[0];
      const nameMatch = /name:\s*"((?:[^"\\]|\\.)*)"/.exec(block);
      const addrMatch = /address:\s*"((?:[^"\\]|\\.)*)"/.exec(block);
      const wikiMatch = /wikiTitle:\s*"((?:[^"\\]|\\.)*)"/.exec(block);
      if (nameMatch && wikiMatch) {
        triples.push({ name: nameMatch[1], address: addrMatch ? addrMatch[1] : "", wikiTitle: wikiMatch[1], file });
      }
    }
  }
  return triples;
}

function resolveWikiTitle(triples: Triple[], name: string, address: string | null): string | null {
  const candidates = triples.filter((t) => t.name === name);
  if (candidates.length === 0) return null;
  const addrMatch = candidates.find((t) => t.address === (address ?? ""));
  if (addrMatch) return addrMatch.wikiTitle;
  const counts = new Map<string, number>();
  for (const c of candidates) counts.set(c.wikiTitle, (counts.get(c.wikiTitle) ?? 0) + 1);
  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0];
}

async function fetchJson(url: string): Promise<any> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return res.json();
}

async function fetchBuffer(url: string): Promise<Buffer> {
  const res = await fetch(url, { headers: { "User-Agent": UA } });
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  return Buffer.from(await res.arrayBuffer());
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function stripHtml(s: string | undefined): string | undefined {
  if (!s) return s;
  return s.replace(/<[^>]+>/g, "").trim() || undefined;
}

// 地図アイコン・ロゴ等、実写真ではない代表画像が使われているケースを検出するための簡易ヒューリスティック
const NON_PHOTO_HINTS = /\.svg$|map|icon|logo|flag|symbol|pictogram|locator/i;
function looksLikeNonPhoto(fileName: string): boolean {
  return NON_PHOTO_HINTS.test(fileName);
}

// 「フェアユース」「著作権法の引用規定」などを根拠にした無許諾の掲載は対象外。
// それ以外（CC BY系・CC0・パブリックドメイン・Attribution・Copyrighted free use）は自由利用として扱う。
const REJECTED_LICENSE_HINTS = ["フェアユース", "fair use", "著作権法"];
const FREE_LICENSES = [
  "cc by", "cc-by", "cc0", "public domain",
  "パブリックドメイン", "パブリック・ドメイン", "パブリック ドメイン",
  "attribution", "copyrighted free use",
];
function isFreeLicense(licenseShortName: string | undefined): boolean {
  if (!licenseShortName) return false;
  const l = licenseShortName.toLowerCase();
  if (REJECTED_LICENSE_HINTS.some((r) => l.includes(r.toLowerCase()))) return false;
  return FREE_LICENSES.some((f) => l.includes(f));
}

/** 2枚の画像を16×16グレースケールに縮小し、画素ごとの平均絶対差(0〜255)を返す */
async function pixelDiff(bufA: Buffer, bufB: Buffer): Promise<number> {
  const [a, b] = await Promise.all([
    sharp(bufA).resize(16, 16, { fit: "fill" }).grayscale().raw().toBuffer(),
    sharp(bufB).resize(16, 16, { fit: "fill" }).grayscale().raw().toBuffer(),
  ]);
  let sum = 0;
  const len = Math.min(a.length, b.length);
  for (let i = 0; i < len; i++) sum += Math.abs(a[i] - b[i]);
  return sum / len;
}

type PhotoResult = {
  photoIds: string[];
  url: string;
  caption: string | null;
  wikiTitle: string | null;
  status: "no_wikititle" | "summary_fetch_failed" | "image_changed" | "imageinfo_failed" | "not_free_license" | "likely_not_a_photo" | "ok";
  sourceUrl?: string;
  author?: string;
  license?: string;
  licenseUrl?: string;
  pixelDiff?: number;
};

async function main() {
  const triples = extractTriples();
  console.log(`seedスクリプトから抽出したユニークspot名: ${new Set(triples.map((t) => t.name)).size}件`);

  const photos = await prisma.photo.findMany({
    select: { id: true, url: true, caption: true, spot: { select: { name: true, address: true } } },
  });
  console.log(`Photo総数: ${photos.length}`);

  const byUrl = new Map<string, { photoIds: string[]; caption: string | null; spotName: string; spotAddress: string | null }>();
  for (const p of photos) {
    const e = byUrl.get(p.url);
    if (e) e.photoIds.push(p.id);
    else byUrl.set(p.url, { photoIds: [p.id], caption: p.caption, spotName: p.spot.name, spotAddress: p.spot.address });
  }
  console.log(`ユニークURL数: ${byUrl.size}`);

  const results: PhotoResult[] = [];
  const imageinfoCache = new Map<string, any>();
  let i = 0;
  for (const [url, info] of byUrl) {
    i++;
    if (i % 25 === 0) console.log(`  進捗: ${i}/${byUrl.size}`);

    const wikiTitle = resolveWikiTitle(triples, info.spotName, info.spotAddress);
    if (!wikiTitle) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle: null, status: "no_wikititle" });
      continue;
    }

    let summary: any;
    try {
      summary = await fetchJson(`https://ja.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(wikiTitle)}`);
    } catch {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "summary_fetch_failed" });
      await sleep(100);
      continue;
    }
    const orig = summary.originalimage;
    if (!orig?.source) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "summary_fetch_failed" });
      await sleep(100);
      continue;
    }

    const withoutQuery = orig.source.split("?")[0];
    const segments = decodeURIComponent(withoutQuery).split("/");
    let rawFileName: string | null = null;
    if (segments.includes("thumb") && segments.length >= 2) {
      rawFileName = segments[segments.length - 2];
    } else {
      const last = segments[segments.length - 1];
      if (/\.(?:jpg|jpeg|png|gif|svg|webp)$/i.test(last)) rawFileName = last;
    }
    if (!rawFileName) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "imageinfo_failed" });
      await sleep(100);
      continue;
    }
    if (looksLikeNonPhoto(rawFileName)) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "likely_not_a_photo" });
      await sleep(100);
      continue;
    }

    // 保存済み画像と現在のWikipedia画像、両方の中身を取得して画素差分を比較
    let diff: number;
    try {
      const [storedBuf, currentBuf] = await Promise.all([fetchBuffer(url), fetchBuffer(orig.source)]);
      diff = await pixelDiff(storedBuf, currentBuf);
    } catch {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "summary_fetch_failed" });
      await sleep(100);
      continue;
    }
    if (diff > 20) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "image_changed", pixelDiff: diff });
      await sleep(100);
      continue;
    }

    const fileTitle = `File:${rawFileName}`;
    let pageData = imageinfoCache.get(fileTitle);
    if (!pageData) {
      try {
        const infoRes = await fetchJson(
          `https://ja.wikipedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata&titles=${encodeURIComponent(fileTitle)}&format=json`
        );
        const pages = infoRes.query?.pages ?? {};
        pageData = Object.values(pages)[0];
        imageinfoCache.set(fileTitle, pageData);
      } catch {
        results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "imageinfo_failed", pixelDiff: diff });
        await sleep(100);
        continue;
      }
    }

    const ii = (pageData as any)?.imageinfo?.[0];
    if (!ii) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "imageinfo_failed", pixelDiff: diff });
      await sleep(100);
      continue;
    }
    const meta = ii.extmetadata ?? {};
    const author = stripHtml(meta.Artist?.value)?.slice(0, 100);
    const license = meta.LicenseShortName?.value as string | undefined;
    const licenseUrl = meta.LicenseUrl?.value as string | undefined;
    const sourceUrl = ii.descriptionurl as string | undefined;

    if (!isFreeLicense(license)) {
      results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "not_free_license", author, license, licenseUrl, sourceUrl, pixelDiff: diff });
      await sleep(100);
      continue;
    }

    results.push({ photoIds: info.photoIds, url, caption: info.caption, wikiTitle, status: "ok", author, license, licenseUrl, sourceUrl, pixelDiff: diff });
    await sleep(100);
  }

  const byStatus = new Map<string, number>();
  for (const r of results) byStatus.set(r.status, (byStatus.get(r.status) ?? 0) + 1);
  console.log("\n=== 集計 ===");
  for (const [status, count] of byStatus) console.log(`  ${status}: ${count}件`);

  const totalPhotos = results.reduce((sum, r) => sum + (r.status !== "ok" ? r.photoIds.length : 0), 0);
  console.log(`\n対応が必要なPhoto件数（差し替え/削除対象）: ${totalPhotos}件`);

  fs.writeFileSync(path.join(PRISMA_DIR, "_photo-credits-research.json"), JSON.stringify(results, null, 1), "utf8");
  console.log("\n結果を _photo-credits-research.json に保存しました。");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
