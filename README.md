# しおりえ - 管理者サイト（admin-site）

「しおりえ」プラットフォームの内部運営ツール。アカウント管理・ユーザー/プランナー一覧・
しおり承認・通報対応・マスタ管理などを行う。3サイト構成の詳細は
[../README.md](../README.md) を参照。

**このリポジトリは3リポジトリ中で唯一 `prisma migrate` を実行する「スキーマ所有者」。**
user-site / planner-site の `prisma/schema.prisma` は本リポジトリと常に同一内容を保つこと。

## セットアップ

```bash
npm install
cp .env.example .env   # DATABASE_URL 等を実値に置き換える
```

### DB初期化（初回のみ）

```bash
npm run db:migrate   # prisma migrate dev
```

マイグレーション実行後、`prisma/manual-constraints.sql` の内容を適用すること
（CHECK制約・pg_trgmトライグラムインデックスはPrismaのスキーマDSLで表現できないため、
`schema.prisma` からは生成されない。詳細はファイル冒頭のコメント参照）。

```bash
npm run db:seed      # 初回スーパー管理者・エリアマスタ・タグマスタを投入
```

`db:seed` を実行する前に `.env` の `SEED_SUPER_ADMIN_EMAIL` / `SEED_SUPER_ADMIN_PASSWORD`
を設定しておくこと（管理者サイトには招待フロー以外の自己登録手段が無いため、
初回のスーパー管理者だけはこのseedスクリプトで直接発行する）。

### 開発サーバー起動

```bash
npm run dev
```

[http://localhost:3002](http://localhost:3002) で確認できる。

## スキーマ変更時の運用

1. `prisma/schema.prisma` を変更
2. `npm run db:migrate` でマイグレーション生成・適用
3. 必要なら `prisma/manual-constraints.sql` を更新し、生成されたSQLに追記
4. 変更内容を `../docs/database-design.md` に反映
5. 同じ `schema.prisma` の内容を user-site / planner-site にもコピーし、
   各リポジトリで `npx prisma generate` を実行（migrateは実行しない）

## 技術スタック

Next.js 16 (App Router) / TypeScript / Tailwind CSS v4 / shadcn/ui / Prisma 6
(ARM64環境でのPrisma 7同梱`workerd`非対応のため6系に固定。さらにdriver adapters
(`@prisma/adapter-pg`)+`engineType = "client"`構成でネイティブquery engineバイナリにも
依存しない。詳細は[../README.md](../README.md)) / NextAuth.js v5(beta、
Credentialsのみ・Googleログイン無し) / PostgreSQL

## 主な認証仕様

- `Admin` テーブルを直接参照するCredentials認証のみ（Google連携無し）
- `status !== 'active'` のアカウント（招待中・無効化済み）はログイン不可
- セッションにはJWT戦略を使用（`@auth/prisma-adapter` は未使用。カスタムテーブル形状のため）
