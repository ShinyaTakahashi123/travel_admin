/**
 * 新しい公式しおりの下書きファイル(JSON)を確認する道具(⚠ の一覧を出す。DBには書き込まない)。
 * 使い方: npx tsx prisma/check-draft.ts prisma/drafts/<ファイル名>.json [--no-similar]
 *   --no-similar … 似たしおりの確認(本番/開発の読み取りが要る)を飛ばす
 * 似たしおりの確認を本番と比べたいときは npm run prod -- を付ける(読み取りのみ)。
 * 仕様書: docs/specs/20261104-itinerary-draft-and-checker.md
 */
import { readFileSync } from "node:fs";
import { validateDraftShape } from "./lib/draft-schema";
import { runChecks, sha256OfFile } from "./lib/draft-checker";

async function main() {
  const args = process.argv.slice(2).filter((a) => a !== "--no-similar");
  const skipSimilar = process.argv.includes("--no-similar");
  const file = args[0];
  if (!file) {
    console.error("使い方: npx tsx prisma/check-draft.ts prisma/drafts/<ファイル名>.json [--no-similar]");
    process.exit(1);
  }

  const raw = readFileSync(file, "utf8");
  const data = JSON.parse(raw);
  const draft = validateDraftShape(data);

  console.log(`■ ${draft.title}（${draft.nights === 0 ? "日帰り" : `${draft.nights}泊${draft.nights + 1}日`}）`);
  const warnings = await runChecks(draft, { skipSimilar });

  if (warnings.length === 0) {
    console.log("\n⚠ なし");
  } else {
    console.log(`\n⚠ ${warnings.length}件`);
    warnings.forEach((w, i) => console.log(`  ${i + 1}. ${w}`));
  }

  const sha256 = sha256OfFile(file);
  console.log(`\nsha256: ${sha256}`);
  process.exitCode = warnings.length === 0 ? 0 : 1;
}

main().catch((e) => {
  console.error("エラー:", e?.message ?? e);
  process.exit(1);
});
