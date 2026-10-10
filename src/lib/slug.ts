import * as wanakana from "wanakana";

function toAsciiSlug(text: string): string {
  return text.toLowerCase().replace(/[^a-z0-9]/g, "");
}

// 名前(または管理者が入力したヒント)からURL用の名前(候補)を1つ作る。
// 漢字が含まれ自動で変換できないときはnull(呼び出し側で<prefix>-<番号>にする)。
// kuroshiro+kuromoji(辞書が約17MBあり、Vercelの関数の大きさを増やす)は使わず、
// かな→ローマ字だけの軽いwanakanaを使う(2026-09-28 企画運営の指摘で変更)
function generateBaseSlug(name: string, hint?: string): string | null {
  const trimmedHint = hint?.trim();
  if (trimmedHint) {
    const slug = /^[a-zA-Z0-9\s\-_]+$/.test(trimmedHint)
      ? toAsciiSlug(trimmedHint)
      : toAsciiSlug(wanakana.toRomaji(trimmedHint));
    if (slug.length >= 2) return slug;
  }

  const trimmed = name.trim();
  if (!trimmed) return null;

  if (/^[a-zA-Z0-9\s\-_]+$/.test(trimmed)) {
    const slug = trimmed
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/^-+|-+$/g, "");
    return slug.length >= 2 ? slug : null;
  }

  const romaji = wanakana.toRomaji(trimmed);
  // wanakanaは漢字を変換できずそのまま残すため、非ASCII文字が残っていれば
  // 変換できなかったと判断する
  if (/[^\x00-\x7F]/.test(romaji)) return null;
  const slug = toAsciiSlug(romaji);
  return slug.length >= 2 ? slug : null;
}

// 名前から重複しないURL用の名前を作る。管理者が入力欄に何か書いていれば(hint)
// それを優先する。ローマ字化できない・全候補が重複しているときは
// <prefix>-<番号>にフォールバックする(docs/specs/20260927-admin-managed-themes-features.md)
export async function generateUniqueSlug(
  name: string,
  prefix: "theme" | "feature",
  isTaken: (slug: string) => Promise<boolean>,
  hint?: string
): Promise<string> {
  const base = generateBaseSlug(name, hint);
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
