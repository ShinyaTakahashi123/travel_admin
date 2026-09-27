import Kuroshiro from "kuroshiro";
import KuromojiAnalyzer from "kuroshiro-analyzer-kuromoji";

// kuromojiの辞書読み込みに時間がかかるため、サーバーの1インスタンス内で使い回す
let kuroshiroPromise: Promise<Kuroshiro> | null = null;
function getKuroshiro(): Promise<Kuroshiro> {
  if (!kuroshiroPromise) {
    kuroshiroPromise = (async () => {
      const kuroshiro = new Kuroshiro();
      await kuroshiro.init(new KuromojiAnalyzer());
      return kuroshiro;
    })();
  }
  return kuroshiroPromise;
}

// kuroshiroが長音を表すのに使うマクロン付き母音を、URLで使えるASCIIに落とす(kōyō→koyo)
const MACRON_MAP: Record<string, string> = { ā: "a", ī: "i", ū: "u", ē: "e", ō: "o" };

function toAsciiSlug(text: string): string {
  const deMacroned = [...text].map((c) => MACRON_MAP[c] ?? c).join("");
  return deMacroned.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 名前からURL用の名前(候補)を1つ作る。ローマ字にできない・短すぎるときはnull
async function generateBaseSlug(name: string): Promise<string | null> {
  const trimmed = name.trim();
  if (!trimmed) return null;

  // 既に半角英数字主体の名前なら、変換せずそのまま使う
  if (/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug.length >= 2 ? slug : null;
  }

  try {
    const kuroshiro = await getKuroshiro();
    const romaji = await kuroshiro.convert(trimmed, { to: "romaji", mode: "spaced" });
    const slug = toAsciiSlug(romaji);
    return slug.length >= 2 ? slug : null;
  } catch (e) {
    console.error("generateBaseSlug: ローマ字変換に失敗", e instanceof Error ? e.name : e);
    return null;
  }
}

// 名前から重複しないURL用の名前を作る。ローマ字化できない・全候補が重複しているときは
// <prefix>-<番号>にフォールバックする(docs/specs/20260927-admin-managed-themes-features.md)
export async function generateUniqueSlug(
  name: string,
  prefix: "theme" | "feature",
  isTaken: (slug: string) => Promise<boolean>
): Promise<string> {
  const base = await generateBaseSlug(name);
  if (base && !(await isTaken(base))) return base;
  if (base) {
    for (let i = 2; i <= 50; i++) {
      const candidate = `${base}-${i}`;
      if (!(await isTaken(candidate))) return candidate;
    }
  }
  for (let i = 1; i <= 9999; i++) {
    const candidate = `${prefix}-${i}`;
    if (!(await isTaken(candidate))) return candidate;
  }
  throw new Error("URL用の名前の候補が尽きました");
}

// 管理者がURLを手で直したときの検証用(半角英小文字・数字・ハイフンのみ、2文字以上)
export function isValidSlugFormat(slug: string): boolean {
  return /^[a-z0-9][a-z0-9-]{1,62}[a-z0-9]$|^[a-z0-9]{2}$/.test(slug);
}
