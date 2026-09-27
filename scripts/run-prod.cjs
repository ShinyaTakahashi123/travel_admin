// npm run prod -- <コマンド> の実体。
//
// 最初、cross-env + dotenv-cli + NODE_OPTIONS(--require)を組み合わせていたが、
// NODE_OPTIONSはdotenv-cli自身のプロセス起動時にも先に効いてしまい、.env.prodで
// 上書きされる前の(開発用の).envの値を見て誤って止まってしまう不具合があった
// (2026-09-27、制作がnpm run prod -- npx tsx prisma/seed-theme-ohenro6.tsを
// 動かしたときに、接続先の表示自体が出ないことで発覚)。
//
// この1つのプロセスの中で「.env.prodを読み込む→SHIORIE_TARGET=prodを設定する→
// 接続先を確かめる→<コマンド>を実行する」の順を保証することで、順序の問題を避けている。
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "..", ".env.prod"), override: true });
process.env.SHIORIE_TARGET = "prod";
require("./assert-db-target.cjs");

const { spawnSync } = require("child_process");
const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("使い方: npm run prod -- <コマンド>");
  process.exit(1);
}
const result = spawnSync(args[0], args.slice(1), { stdio: "inherit", shell: true, env: process.env });
process.exit(result.status ?? 1);
