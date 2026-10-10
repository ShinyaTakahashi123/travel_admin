// DBの接続先が「本番」か「開発」かを確かめ、始めに表示するための仕組み。
// 開発環境(Neonのdevブランチ)への切り替えが終わるまでは、まだどのnpmスクリプトにも
// 組み込まない(仕様書 docs/specs/20260925-neon-dev-branch.md の8節の段取りで組み込む)。
//
// 使い方: NODE_OPTIONS=--require=./scripts/assert-db-target.cjs を付けて
// next dev / prisma / tsx を動かすと、その一番始めにこのファイルが読み込まれ、
// DATABASE_URLの接続先を確かめてから、あればそのまま処理を続ける。
//
// 判定のしかた(2026-09-27 企画運営・セキュリティの決定):
// - .envのSHIORIE_DEV_DB_HOSTと接続先のホスト名が一致する → 開発用として登録済み。続ける
// - 環境変数SHIORIE_TARGET=prod が明示されている → 本番として続ける(本番用の入口・npm run prod経由)
// - どちらでもない(=本番用のホスト名なのに目印がない、または未登録のホスト名) → 事故を防ぐため止める
//   (本番の名前を数え上げて止めるのではなく、開発用として登録されている名前だけを許可する
//   「許可リスト」方式にしている。セキュリティ2026-09-27: 本番の名前で止める方式だと、
//   想定外の本番ホスト名の変更に弱いため)
try {
  require("dotenv").config();
} catch {
  // dotenvが無い環境(本番のVercelなど)では何もしない
}

function maskHost(host) {
  // 接続先の文字列そのものは表示しない。ブランチを見分けられる程度(先頭部分)だけ出す
  if (!host) return "(不明)";
  return host.length > 12 ? `${host.slice(0, 12)}...` : host;
}

function main() {
  const dbUrl = process.env.DATABASE_URL;
  if (!dbUrl) return; // DATABASE_URL未設定はこのスクリプトの対象外(他のエラーに任せる)

  let host;
  try {
    host = new URL(dbUrl).hostname;
  } catch {
    return; // 形式が読み取れない場合は対象外
  }

  const target = process.env.SHIORIE_TARGET;
  const knownDevHost = process.env.SHIORIE_DEV_DB_HOST;

  if (target === "prod") {
    // SHIORIE_TARGET=prodの目印だけで信じず、実際の接続先が開発用として登録された
    // ホスト名と一致していないかも確かめる(一致していたら、.env.prodが読み込まれて
    // いない可能性が高い。目印と接続先が食い違ったまま「本番」と表示するのは危険なため)
    if (knownDevHost && host === knownDevHost) {
      console.error("");
      console.error("🔴 SHIORIE_TARGET=prod が指定されていますが、接続先は開発用として登録された");
      console.error("   ホスト名と同じです。.env.prodが正しく読み込まれているか確かめてください。");
      console.error("");
      process.exit(1);
    }
    console.log(`[接続先] 本番 (${maskHost(host)})`);
    return;
  }
  if (knownDevHost && host === knownDevHost) {
    console.log(`[接続先] 開発 (${maskHost(host)})`);
    return;
  }

  console.error("");
  console.error("🔴 このDBの接続先は「開発用」として登録されていません。");
  console.error("   本番を扱うときは、npm run prod -- <コマンド> のように「本番」と明示してください。");
  console.error("   開発用に切り替えたのに止まる場合は、.envのSHIORIE_DEV_DB_HOSTが");
  console.error("   正しいか確かめてください。");
  console.error("");
  process.exit(1);
}

main();
