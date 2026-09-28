-- ユーザーサイトの会員とプランナーサイトのアカウントの連携 (docs/specs/20260928-account-link.md)

CREATE TABLE "account_link" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "user_account_id" UUID NOT NULL,
    "planner_account_id" UUID NOT NULL,
    "linked_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "account_link_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "account_link_user_account_id_key" ON "account_link"("user_account_id");
CREATE UNIQUE INDEX "account_link_planner_account_id_key" ON "account_link"("planner_account_id");

ALTER TABLE "account_link" ADD CONSTRAINT "account_link_user_account_id_fkey"
    FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_link" ADD CONSTRAINT "account_link_planner_account_id_fkey"
    FOREIGN KEY ("planner_account_id") REFERENCES "planner_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "account_link_nonce" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_hash" TEXT NOT NULL,
    "user_account_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "account_link_nonce_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "account_link_nonce_token_hash_key" ON "account_link_nonce"("token_hash");
CREATE INDEX "account_link_nonce_user_account_id_idx" ON "account_link_nonce"("user_account_id");

ALTER TABLE "account_link_nonce" ADD CONSTRAINT "account_link_nonce_user_account_id_fkey"
    FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE "account_link_receipt" (
    "id" UUID NOT NULL DEFAULT gen_random_uuid(),
    "token_hash" TEXT NOT NULL,
    "user_account_id" UUID NOT NULL,
    "planner_account_id" UUID NOT NULL,
    "created_at" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expires_at" TIMESTAMPTZ NOT NULL,
    "used_at" TIMESTAMPTZ,

    CONSTRAINT "account_link_receipt_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "account_link_receipt_token_hash_key" ON "account_link_receipt"("token_hash");
CREATE INDEX "account_link_receipt_user_account_id_idx" ON "account_link_receipt"("user_account_id");
CREATE INDEX "account_link_receipt_planner_account_id_idx" ON "account_link_receipt"("planner_account_id");

ALTER TABLE "account_link_receipt" ADD CONSTRAINT "account_link_receipt_user_account_id_fkey"
    FOREIGN KEY ("user_account_id") REFERENCES "user_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "account_link_receipt" ADD CONSTRAINT "account_link_receipt_planner_account_id_fkey"
    FOREIGN KEY ("planner_account_id") REFERENCES "planner_account"("id") ON DELETE CASCADE ON UPDATE CASCADE;
