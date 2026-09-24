/**
 * 写真の差し替え候補をWikimedia Commonsから探す（docs/specs/20260924-photo-credits.md B の続き）
 * DBは一切変更しない。研究結果と候補画像のサムネイルをスクラッチ領域に保存し、
 * 目視で確認したうえで別スクリプト（replace-remove-photos.ts）で反映する。
 *
 * 実行方法: npx tsx prisma/research-commons-replacements.ts
 */
import fs from "fs";
import path from "path";

const UA = "tabishiori-photo-credits-research/1.0 (contact: st.83.53.abcd@gmail.com)";
const OUT_DIR = process.argv[2] || "C:\\Users\\Shinya Takahashi\\AppData\\Local\\Temp\\claude\\c--03-ClaudeCode-01-study\\efd73cae-f55a-40cc-9f4e-e5a218346566\\scratchpad\\commons-candidates";

const NON_PHOTO_HINTS = /\.svg$|map|icon|logo|flag|symbol|pictogram|locator/i;
function looksLikeNonPhoto(fileName: string): boolean {
  return NON_PHOTO_HINTS.test(fileName);
}

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

function stripHtml(s: string | undefined): string | undefined {
  if (!s) return s;
  return s.replace(/<[^>]+>/g, "").trim() || undefined;
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

type Candidate = {
  fileTitle: string;
  localPath: string;
  width: number;
  height: number;
  license: string;
  author?: string;
  licenseUrl?: string;
  sourceUrl: string;
};

type ProblemItem = {
  key: string;
  wikiTitle: string | null;
  caption: string | null;
  status: string;
  photoIds: string[];
  candidates: Candidate[];
};

async function searchCommons(term: string, limit: number): Promise<string[]> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(
    term
  )}&srnamespace=6&format=json&srlimit=${limit}`;
  const data = await fetchJson(url);
  return (data.query?.search ?? []).map((s: any) => s.title as string);
}

async function getImageInfo(fileTitle: string): Promise<any> {
  const url = `https://commons.wikimedia.org/w/api.php?action=query&prop=imageinfo&iiprop=url|extmetadata|size&titles=${encodeURIComponent(
    fileTitle
  )}&format=json`;
  const data = await fetchJson(url);
  const pages = data.query?.pages ?? {};
  const page: any = Object.values(pages)[0];
  return page?.imageinfo?.[0];
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });

  const results: any[] = JSON.parse(
    fs.readFileSync(path.join(__dirname, "_photo-credits-research.json"), "utf8")
  );
  const problems = results.filter((r) => r.status !== "ok");
  console.log(`対象: ${problems.length}件`);

  const items: ProblemItem[] = [];
  let idx = 0;
  for (const p of problems) {
    idx++;
    const key = `${idx}_${(p.caption || p.wikiTitle || "unknown").replace(/[\\/:*?"<>|]/g, "_")}`;
    console.log(`\n[${idx}/${problems.length}] ${p.caption} (wikiTitle=${p.wikiTitle}, status=${p.status})`);

    const searchTerms = [p.caption, p.wikiTitle].filter((t): t is string => !!t);
    const seenTitles = new Set<string>();
    let fileTitles: string[] = [];
    for (const term of searchTerms) {
      try {
        const found = await searchCommons(term, 8);
        for (const t of found) if (!seenTitles.has(t)) { seenTitles.add(t); fileTitles.push(t); }
      } catch (e) {
        console.warn(`  検索失敗(${term}): ${(e as Error).message}`);
      }
      await sleep(150);
      if (fileTitles.length >= 8) break;
    }
    // 明らかな非写真ファイル名は除外
    fileTitles = fileTitles.filter((t) => !looksLikeNonPhoto(t)).slice(0, 6);

    const candidates: Candidate[] = [];
    for (const fileTitle of fileTitles) {
      if (candidates.length >= 3) break;
      try {
        const ii = await getImageInfo(fileTitle);
        if (!ii) continue;
        const meta = ii.extmetadata ?? {};
        const license = meta.LicenseShortName?.value as string | undefined;
        if (!isFreeLicense(license)) continue;
        if (looksLikeNonPhoto(fileTitle)) continue;
        if ((ii.width ?? 0) < 300 || (ii.height ?? 0) < 200) continue;

        const thumbUrl = `${ii.url}`;
        const buf = await fetchBuffer(thumbUrl);
        const ext = path.extname(fileTitle).toLowerCase() || ".jpg";
        const localName = `${key}__${candidates.length + 1}${ext}`;
        const localPath = path.join(OUT_DIR, localName);
        fs.writeFileSync(localPath, buf);

        candidates.push({
          fileTitle,
          localPath,
          width: ii.width,
          height: ii.height,
          license: license!,
          author: stripHtml(meta.Artist?.value)?.slice(0, 100),
          licenseUrl: meta.LicenseUrl?.value as string | undefined,
          sourceUrl: ii.descriptionurl as string,
        });
        console.log(`  候補: ${fileTitle} (${license}) -> ${localName}`);
      } catch (e) {
        console.warn(`  imageinfo失敗(${fileTitle}): ${(e as Error).message}`);
      }
      await sleep(150);
    }

    if (candidates.length === 0) console.log("  候補なし");

    items.push({
      key,
      wikiTitle: p.wikiTitle,
      caption: p.caption,
      status: p.status,
      photoIds: p.photoIds,
      candidates,
    });
  }

  fs.writeFileSync(
    path.join(__dirname, "_commons-replacement-candidates.json"),
    JSON.stringify(items, null, 1),
    "utf8"
  );
  console.log(`\n完了。候補ありの項目: ${items.filter((i) => i.candidates.length > 0).length}/${items.length}`);
  console.log(`候補画像の保存先: ${OUT_DIR}`);
  console.log(`一覧: prisma/_commons-replacement-candidates.json`);
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
