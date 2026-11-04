/**
 * 新しい公式しおりの下書きファイルを、まとめて本番に「承認待ち（非公開）」で登録する道具。
 * 公開は、これまでどおりユーザーの了承のあと(別の作業)。本番で動かすのは制作(企画運営・法務のOK後)。
 *
 * 使い方:
 *   確認モード: npx tsx prisma/register-draft.ts <下書き.json> <sha256> [<下書き2.json> <sha256-2> ...]
 *   登録モード: 上と同じ引数に --commit を付ける
 *   本番に書き込むときは npm run prod -- を先頭に付ける。付けなければ開発用のDB
 *
 * 仕様書: docs/specs/20261104-itinerary-draft-and-checker.md 3節
 */
import { readFileSync } from "node:fs";
import { prisma } from "../src/lib/prisma";
import { validateDraftShape, type DraftItinerary } from "./lib/draft-schema";
import { runChecks, sha256OfFile } from "./lib/draft-checker";
import { buildItineraryCreateData, readBackAndCompare, renderPreview, resolveLookups, type PhotoUrlResolver } from "./lib/draft-register-lib";
import { uploadDraftPhoto } from "./lib/draft-photos";

type Pair = { file: string; sha256: string; draft: DraftItinerary };

async function loadAndVerify(file: string, expectedSha256: string): Promise<{ pair: Pair; errors: string[] }> {
  const errors: string[] = [];
  const actualSha256 = sha256OfFile(file);
  if (actualSha256 !== expectedSha256) {
    errors.push(`${file}: sha256が一致しません(引数${expectedSha256} / ファイル${actualSha256})。OKを出した版と違うので止めます`);
  }
  const data = JSON.parse(readFileSync(file, "utf8"));
  const draft = validateDraftShape(data);
  const warnings = await runChecks(draft);
  if (warnings.length > 0) {
    errors.push(`${file}: 確認の道具が ⚠ ${warnings.length}件を出しています`);
    warnings.forEach((w) => errors.push(`  - ${w}`));
  }
  return { pair: { file, sha256: expectedSha256, draft }, errors };
}

const COMMIT_ONLY_PLACEHOLDER = "(アップロード前。--commitで取得します)";

function dryRunPhotoResolver(): PhotoUrlResolver {
  return async () => COMMIT_ONLY_PLACEHOLDER;
}

function commitPhotoResolver(blobPrefix: string): PhotoUrlResolver {
  const cache = new Map<string, string | null>();
  return async (commonsFile: string, label: string) => {
    const key = commonsFile;
    if (cache.has(key)) return cache.get(key)!;
    try {
      const url = await uploadDraftPhoto(commonsFile, blobPrefix, label);
      cache.set(key, url);
      return url;
    } catch (e) {
      console.warn(`  画像取得失敗: ${commonsFile}(${(e as Error).message})`);
      cache.set(key, null);
      return null;
    }
  };
}

async function main() {
  const commit = process.argv.includes("--commit");
  const rawArgs = process.argv.slice(2).filter((a) => a !== "--commit");
  if (rawArgs.length === 0 || rawArgs.length % 2 !== 0) {
    console.error("使い方: npx tsx prisma/register-draft.ts <下書き.json> <sha256> [...] [--commit]");
    process.exit(1);
  }
  const fileShaPairs: [string, string][] = [];
  for (let i = 0; i < rawArgs.length; i += 2) fileShaPairs.push([rawArgs[i], rawArgs[i + 1]]);

  console.log(commit ? "登録モードで実行します" : "確認モードで実行します(DBには書き込みません)");

  const results = await Promise.all(fileShaPairs.map(([file, sha]) => loadAndVerify(file, sha)));
  const allErrors = results.flatMap((r) => r.errors);
  if (allErrors.length > 0) {
    console.error("\n登録できません:");
    allErrors.forEach((e) => console.error(`  ${e}`));
    process.exitCode = 1;
    await prisma.$disconnect();
    return;
  }

  const blobPrefix = "drafts";
  const photoResolver = commit ? commitPhotoResolver(blobPrefix) : dryRunPhotoResolver();

  for (const { pair } of results) {
    const { draft, file } = pair;
    const existing = await prisma.itinerary.findFirst({ where: { title: draft.title } });
    if (existing) {
      console.log(`\n■ ${draft.title}: 既に同じ題のしおりがあります(${existing.id.slice(0, 8)}[${existing.status}])。スキップします`);
      continue;
    }
    const lookups = await resolveLookups(draft);
    const createData = await buildItineraryCreateData(draft, lookups, photoResolver);
    renderPreview(createData);

    if (!commit) continue;

    const created = await prisma.itinerary.create({ data: createData as any, select: { id: true } });
    console.log(`  → 登録しました(${file}): id=${created.id}  状態=承認待ち(非公開)`);

    const diffs = await readBackAndCompare(created.id, draft);
    if (diffs.length === 0) {
      console.log("  読み戻し: 下書きファイルと一致しています");
    } else {
      console.log(`  読み戻し: ${diffs.length}件の違いがあります`);
      diffs.forEach((d) => console.log(`    - ${d}`));
    }
  }

  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
  await prisma.$disconnect();
}

main().catch((e) => {
  console.error("エラー:", e?.message ?? e);
  process.exitCode = 1;
  return prisma.$disconnect();
});
