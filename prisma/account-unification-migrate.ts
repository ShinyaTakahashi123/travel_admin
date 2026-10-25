/**
 * 会員とプランナーのアカウント統合、移しかえスクリプト。
 * docs/specs/20261025-account-unification-detailed.md 2・2-4・2-4-1・3節のとおり。
 *
 * 実行方法:
 *   npx tsx prisma/account-unification-migrate.ts        (確認モード。件数のみ)
 *   npx tsx prisma/account-unification-migrate.ts --commit (実際に書き換える)
 *
 * 実行の前提:
 * - migration 20261025210000(Itinerary等の外部キーをUserAccountへ付け替え、NOT VALID)が
 *   適用済みであること
 * - 開発用DBでの練習は、必ずNeonの「親から作り直す」の直後に行うこと(3-4節)
 *
 * 【2026-10-25の事故を受けた設計】
 * - PlannerAccountの行は、どのケースでも削除しない(段階9まで)。削除するのは
 *   AccountLink(本人確認済みの連携。消費済みの印として扱うため、他に参照されず安全)だけ
 * - 処理の前後で、しおり関連の件数が1件でも減っていたら、トランザクションごと中断する
 *
 * 各PlannerAccountの行を、次の4つに分類する(仕様書2-4節のとおり):
 *   A. AccountLinkで本人確認済みの組 → 会員側の行へまとめる(Itinerary等のFK値を
 *      会員側のidへ更新。PlannerAccountの行自体は残す)
 *   B. googleIdが一致する組(Aと同格に扱ってよい。セキュリティ指摘2026-10-25)→ 同様
 *   C. 同じメールアドレスの会員が別にいる(未連携・未確認) → legacyEmailへ退避し、
 *      プランナー自身のIDをそのままUserAccountの行として使う(仕様書2-4-1節)
 *   D. 重複なし(単独) → プランナー自身のIDをそのままUserAccountの行として使う
 */
import { createHash, randomBytes } from "crypto";
import { prisma } from "../src/lib/prisma";
import { sendMail } from "../src/lib/mail";

require("../scripts/assert-db-target.cjs");

const MIGRATED_EMAIL_DOMAIN = "migrated.invalid";
const PLANNER_SITE_URL = process.env.PLANNER_SITE_URL ?? "https://planner.shiorietrip.com";

function placeholderEmail(plannerAccountId: string): string {
  return `planner-${plannerAccountId}@${MIGRATED_EMAIL_DOMAIN}`;
}

// セキュリティ指摘2026-10-25: しおり関連の件数を処理の前後で見張る対象
const SENTINEL_MODELS = [
  "itinerary",
  "day",
  "spot",
  "photo",
  "spotTransitLeg",
  "favorite",
  "comment",
  "report",
  "shareLog",
  "pageView",
  "trip",
  "tripSpot",
  "checkin",
  "prefectureVisit",
  "featureItem",
  "deletedAccountRecord",
  "deletedAccountRecordItem",
  "accountLink",
  "plannerServiceArea",
  "plannerSpecialtyTag",
] as const;

type SentinelCounts = Record<(typeof SENTINEL_MODELS)[number], number>;

async function countSentinels(client: { [K in (typeof SENTINEL_MODELS)[number]]: { count: () => Promise<number> } }): Promise<SentinelCounts> {
  const entries = await Promise.all(SENTINEL_MODELS.map(async (m) => [m, await client[m].count()] as const));
  return Object.fromEntries(entries) as SentinelCounts;
}

async function classify() {
  const planners = await prisma.plannerAccount.findMany();
  const users = await prisma.userAccount.findMany({ select: { id: true, email: true, googleId: true } });
  const accountLinks = await prisma.accountLink.findMany();

  const userByEmail = new Map(users.map((u) => [u.email.toLowerCase(), u]));
  const userByGoogleId = new Map(users.filter((u) => u.googleId).map((u) => [u.googleId as string, u]));
  const linkedUserIdByPlannerId = new Map(accountLinks.map((l) => [l.plannerAccountId, l.userAccountId]));

  const caseA: { planner: (typeof planners)[number]; targetUserAccountId: string }[] = [];
  const caseB: { planner: (typeof planners)[number]; targetUserAccountId: string }[] = [];
  const caseC: (typeof planners)[number][] = [];
  const caseD: (typeof planners)[number][] = [];

  for (const p of planners) {
    const linkedUserId = linkedUserIdByPlannerId.get(p.id);
    if (linkedUserId) {
      caseA.push({ planner: p, targetUserAccountId: linkedUserId });
      continue;
    }
    const googleMatch = p.googleId ? userByGoogleId.get(p.googleId) : undefined;
    if (googleMatch) {
      caseB.push({ planner: p, targetUserAccountId: googleMatch.id });
      continue;
    }
    const emailMatch = userByEmail.get(p.email.toLowerCase());
    if (emailMatch) {
      caseC.push(p);
      continue;
    }
    caseD.push(p);
  }

  return { caseA, caseB, caseC, caseD };
}

async function main() {
  const commit = process.argv.includes("--commit");
  console.log("モード:", commit ? "実際に書き換えます" : "確認のみ(件数を数えます。--commitで実行)");

  const { caseA, caseB, caseC, caseD } = await classify();

  console.log("分類結果(メールアドレス・パスワードのハッシュは表示しません):");
  console.log({
    "A. AccountLink確認済み": caseA.length,
    "B. googleId一致": caseB.length,
    "C. 未解消の重複→legacyEmailへ退避": caseC.length,
    "D. 重複なし→そのまま会員化": caseD.length,
  });

  if (!commit) {
    await prisma.$disconnect();
    return;
  }

  // セキュリティ指摘2026-10-25夜: RESEND_API_KEYが無いと、sendMail(src/lib/mail.ts)が
  // 宛先・本文(回復の生の合言葉を含む)をそのままconsole.logへ出す。ケースCが1件以上あるのに
  // この状態で--commitすると、本番実行時に会話の記録・ログへ本物のメールアドレスと
  // 使える回復リンクが残ってしまうため、その前に止める
  if (caseC.length > 0 && !process.env.RESEND_API_KEY) {
    console.error(
      `🔴 ケースC(未解消の重複)が${caseC.length}件ありますが、RESEND_API_KEYが設定されていません。` +
        "このまま進めると、お知らせメールの宛先・回復リンクがログに出力されてしまうため中止します。" +
        "RESEND_API_KEYを設定してから、もう一度実行してください。"
    );
    process.exit(1);
  }

  const before = await countSentinels(prisma);

  const result = await prisma.$transaction(
    async (tx) => {
      let mergedAB = 0;
      let convertedC = 0;
      let convertedD = 0;
      const caseCNotifications: { legacyEmail: string; rawToken: string }[] = [];

      // A・B: 会員側の行へまとめる。PlannerAccountの行は削除しない
      for (const { planner: p, targetUserAccountId } of [...caseA, ...caseB]) {
        await tx.userAccount.update({
          where: { id: targetUserAccountId },
          data: {
            isPlanner: true,
            isOfficial: p.isOfficial || undefined,
            // 法務指摘2026-10-25(2-5節): プランナー自身が公開用に入力した値は、
            // 会員の非公開のgender/age/homeAreaIdとは別のplanner専用の列へ移す
            plannerGender: p.gender,
            plannerAge: p.age,
            plannerHomeAreaId: p.homeAreaId,
          },
        });
        await tx.itinerary.updateMany({ where: { plannerAccountId: p.id }, data: { plannerAccountId: targetUserAccountId } });
        // 複合主キー(plannerAccountId, areaId/tagId)の衝突を避けるため、まず会員側の
        // 既存分を確認してから、重複しない分だけ付け替える(今のデータでは会員側に
        // 既存のserviceAreas/specialtyTagsは無い想定だが、念のため)
        const existingAreaIds = new Set(
          (await tx.plannerServiceArea.findMany({ where: { plannerAccountId: targetUserAccountId }, select: { areaId: true } })).map(
            (r) => r.areaId
          )
        );
        const sourceAreas = await tx.plannerServiceArea.findMany({ where: { plannerAccountId: p.id } });
        for (const row of sourceAreas) {
          if (!existingAreaIds.has(row.areaId)) {
            await tx.plannerServiceArea.create({ data: { plannerAccountId: targetUserAccountId, areaId: row.areaId } });
          }
        }
        await tx.plannerServiceArea.deleteMany({ where: { plannerAccountId: p.id } });

        const existingTagIds = new Set(
          (await tx.plannerSpecialtyTag.findMany({ where: { plannerAccountId: targetUserAccountId }, select: { tagId: true } })).map(
            (r) => r.tagId
          )
        );
        const sourceTags = await tx.plannerSpecialtyTag.findMany({ where: { plannerAccountId: p.id } });
        for (const row of sourceTags) {
          if (!existingTagIds.has(row.tagId)) {
            await tx.plannerSpecialtyTag.create({ data: { plannerAccountId: targetUserAccountId, tagId: row.tagId } });
          }
        }
        await tx.plannerSpecialtyTag.deleteMany({ where: { plannerAccountId: p.id } });

        // 連携(AccountLink)は、本人確認済みの組をまとめ終えた印として削除してよい
        // (この表自体がPlannerAccountを参照しているだけで、しおり等は参照していないため、
        // 削除してもCascadeで失われるデータは無い)
        await tx.accountLink.deleteMany({ where: { plannerAccountId: p.id } });
        mergedAB++;
      }

      // D: 重複なし。プランナー自身のIDをそのままUserAccountの行にする
      for (const p of caseD) {
        await tx.userAccount.create({
          data: {
            id: p.id,
            name: p.name,
            email: p.email,
            passwordHash: p.passwordHash,
            googleId: p.googleId,
            iconUrl: p.iconUrl,
            profile: p.profile,
            // 法務指摘2026-10-25(2-5節): gender/age/homeAreaIdは会員の非公開情報用の列。
            // Dは会員の行が無い新規会員化なので、ここは空にし、プランナー自身が公開用に
            // 入力した値はplannerGender/plannerAge/plannerHomeAreaIdへ移す
            gender: null,
            age: null,
            homeAreaId: null,
            status: p.status,
            plannerGender: p.gender,
            plannerAge: p.age,
            plannerHomeAreaId: p.homeAreaId,
            // セキュリティ指摘2026-10-25: 会員化にあたり、プランナー側のパスワード再設定
            // トークンは持ち越さない(Cと同じ扱いに統一)
            resetToken: null,
            resetTokenExpiresAt: null,
            passwordChangedAt: p.passwordChangedAt,
            legalHold: p.legalHold,
            isPlanner: true,
            isOfficial: p.isOfficial,
            createdAt: p.createdAt,
          },
        });
        convertedD++;
      }

      // C: 未解消の重複。legacyEmailへ退避し、isPendingRecoveryをtrueにする
      for (const p of caseC) {
        const rawToken = randomBytes(32).toString("hex");
        const tokenHash = createHash("sha256").update(rawToken).digest("hex");
        const tokenExpiresAt = new Date(Date.now() + 30 * 24 * 60 * 60 * 1000); // 30日(2-4-1節7)

        await tx.userAccount.create({
          data: {
            id: p.id,
            name: p.name,
            email: placeholderEmail(p.id),
            legacyEmail: p.email,
            passwordHash: p.passwordHash,
            googleId: null,
            legacyGoogleId: p.googleId,
            iconUrl: p.iconUrl,
            profile: p.profile,
            // 法務指摘2026-10-25(2-5節): Dと同じ理由でgender/age/homeAreaIdは空にし、
            // プランナー公開用の値はplannerGender/plannerAge/plannerHomeAreaIdへ移す
            gender: null,
            age: null,
            homeAreaId: null,
            status: p.status,
            plannerGender: p.gender,
            plannerAge: p.age,
            plannerHomeAreaId: p.homeAreaId,
            resetToken: null,
            resetTokenExpiresAt: null,
            passwordChangedAt: p.passwordChangedAt,
            legalHold: p.legalHold,
            isPlanner: true,
            isOfficial: p.isOfficial,
            isPendingRecovery: true,
            legacyEmailRecoveryToken: tokenHash,
            legacyEmailRecoveryTokenExpiresAt: tokenExpiresAt,
            createdAt: p.createdAt,
          },
        });
        // 合言葉の生の値は、トランザクション成功後にまとめてメール送信する
        // (トランザクション内で送ると、ロールバック時に送信済みメールだけ残ってしまうため)
        caseCNotifications.push({ legacyEmail: p.email, rawToken });
        convertedC++;
      }

      // 件数の見張り(セキュリティ指摘2026-10-25): しおり関連の件数が1件でも
      // 減っていたら、エラーを投げてトランザクションごと中断する
      const after = await countSentinels(tx as unknown as Parameters<typeof countSentinels>[0]);
      for (const model of SENTINEL_MODELS) {
        if (after[model] < before[model]) {
          throw new Error(
            `見張りに引っかかりました: ${model}の件数が${before[model]}→${after[model]}に減少。処理を中断します(コミットしません)。`
          );
        }
      }

      return { mergedAB, convertedC, convertedD, before, after, caseCNotifications };
    },
    { timeout: 60000 }
  );

  console.log("完了:", {
    "A・B(まとめ)": result.mergedAB,
    "D(単独→会員化)": result.convertedD,
    "C(退避→回復待ち)": result.convertedC,
  });
  console.log("見張りの件数(前後、一致または増加のみ):", { before: result.before, after: result.after });

  // Cのお知らせメール(2-4-1節4)は、トランザクションの成功後にまとめて送る。
  // 1件失敗しても残りの送信は続ける(全体を失敗させない)。宛先はログに出さない
  let notifiedCount = 0;
  let caseCIndex = 0;
  for (const { legacyEmail, rawToken } of result.caseCNotifications) {
    caseCIndex++;
    try {
      const url = `${PLANNER_SITE_URL}/account-link/recover-planner?token=${rawToken}`;
      await sendMail({
        to: legacyEmail,
        subject: "【しおりえ】プランナーアカウントのご確認のお願い",
        text: `しおりえをご利用いただきありがとうございます。

ご利用中のプランナーのアカウントは、しおりえのアカウント統合に伴い、
現在このメールアドレスでのログインができない状態です。

下のリンクから、ご本人確認のうえ会員アカウントと結び付けてください。
このお手続きが済むまで、プランナーとしてのしおりの編集・公開はできません。
しおりの閲覧・公開状態・著作権は変わりません。

お手続きの前でも、しおりの非公開・削除、退会、個人情報の開示・削除のご希望は、
このメールアドレスからお問い合わせページにご連絡いただければ承ります。

${url}

このリンクは30日間有効です。期限が切れた場合は、お手続き画面から再送できます。

なお、このメールアドレスでは会員のご登録もあります。心当たりがない場合は、
お問い合わせ、またはパスワードの再設定をご利用ください。

ご不明な点がございましたら、お問い合わせページ（https://shiorietrip.com/contact ）からご連絡ください。

しおりえ運営事務局`,
      });
      notifiedCount++;
    } catch {
      // エラーの中身(宛先・本文を含みうる)はログに出さない(セキュリティ指摘2026-10-25夜)
      console.error(`[account-unification-migrate] Cの${caseCIndex}件目: 送れませんでした`);
    }
  }
  console.log("Cのお知らせメール送信件数:", notifiedCount, "/", result.caseCNotifications.length);

  await prisma.$disconnect();
}

main().catch(async (e) => {
  console.error("中断しました:", e instanceof Error ? e.message : e);
  await prisma.$disconnect();
  process.exit(1);
});
