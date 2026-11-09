import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron（vercel.json）から1日1回呼ばれる日次クリーンアップ。Vercel Hobbyプランの
// Cron Jobs数の上限内に収めるため、複数の定期削除処理をこの1本にまとめている:
// 1. 回数制限用の記録（RateLimitEvent）のうち24時間より古いものを削除（直近24時間分で十分なため）
// 2. 権利侵害の申告・開示請求への対応のため記録しているIPアドレス
//    （Comment.ipAddress / Itinerary.submittedIp）のうち、
//    記録から6か月を過ぎたものをnullにする（投稿・しおり本体は消さない）
// 3. 退会後の保存記録（DeletedAccountRecord）のうち、退会から6か月を過ぎ、
//    legalHold(保全の印)が付いていないものは、明細(items)を削除しメール・名前をnullにする
//    （件数用に利用者/プランナーの別・退会日時だけ残す）
// 4. 管理者の操作の記録（AdminAuditLog）のうち、3年を過ぎ、legalHold(保全の印)が
//    付いていないものを削除する
// 5. 「旅」(Trip/TripSpot)のうち、元のしおりが見られなくなったものの、写した文章・写真
//    (description・スポットのメモ・写真のURLと出典)を空にする(スポット名・住所・位置・
//    チェックイン・スタンプは残す。法務2026-09-28決定B・同日の追加判断。会員が旅のページを
//    開いたときにも同じ処理をするが、開かないまま放置された「旅」の文章も、削除依頼の
//    実効性のためここで確実に消す)。「見られなくなった」の基準はtrip.original_kindで
//    種類ごとに違う(src/lib/trip-availability.tsのisOriginalAvailableと同じ判定をSQLで表現):
//    published=statusがpublishedでなくなったら／copy=本人が削除するまで見られる／
//    shared_link=元のしおりがstatus='draft'で、プランナーが利用停止でなく、リンクが
//    有効(shared_link_token_hashが旅を作った時点のものと同じ)、のすべてを満たすときだけ
//    見られる扱い(許可リスト形式。2026-10-25セキュリティ指摘: 限定公開リンクの対象を
//    一から作ったしおりにも広げたため、「deletedでなければよい」という拒否リスト形式だと、
//    審査中・却下・公開中に変わった後も古いリンクで見え続けてしまう)
//    ※ trip_spot.photo_urlは、Vercel Blobの「使われていない画像の削除」(cleanup-blobs、
//    src/lib/blob-cleanup.ts)の「使用中」判定には含めない。写真は元のPhotoの複製ではなく
//    URLの参照のみで、元のPhotoが消えれば「旅」側は写真なし表示になる仕様のため
//    (docs/specs/20260928-footprint-map-checkin.md 0節)。ここで含めてしまうと、本来削除
//    してよい画像がいつまでも消せなくなる
// 6. アカウントの連携(docs/specs/20260928-account-link.md)の使い捨ての合言葉(AccountLinkNonce)・
//    受け取りの印(AccountLinkReceipt)のうち、期限切れのものを削除する(3節)
// ※ IPアドレスの値・メールアドレス・名前などの個人情報自体はログに出さない（件数のみ）
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  // アカウント統合(段階3)の当日、スキーマ適用(itinerary.planner_account_idの参照先が
  // user_accountへ付け替わる)のあと、移しかえスクリプトがまだ終わっていない間は、
  // 既存の行のplanner_account_idの値がまだ古いPlannerAccountのIDのままで、
  // user_accountのどの行とも一致しない。この状態でこのCronが動くと、下の生SQL(NOT EXISTS)が
  // ほぼ全件に真と判定し、旅の記録(description・メモ・写真)を誤って消してしまう
  // (2026-11-09、セキュリティ指摘)。そのため、動き始めにこの不一致を確かめ、1件でもあれば
  // 何もせず終わる(安全のため、この回のCronは丸ごと見送る。日次なので翌日また動く)
  const orphanedItineraryCount = await prisma.$queryRaw<{ count: bigint }[]>`
    SELECT count(*) AS count FROM itinerary i
    WHERE NOT EXISTS (SELECT 1 FROM user_account u WHERE u.id = i.planner_account_id)
  `;
  if (Number(orphanedItineraryCount[0]?.count ?? 0) > 0) {
    console.warn(
      "[cleanup-rate-limits] アカウント統合の移しかえが途中の可能性があるため、何もせず終了します。" +
        `user_accountに無いplanner_account_idを持つitinerary: ${orphanedItineraryCount[0].count}件`
    );
    return NextResponse.json({ skipped: "account_unification_migration_in_progress", orphanedItineraryCount: Number(orphanedItineraryCount[0].count) });
  }

  const rateLimitCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const ipCutoff = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
  const deletedAccountCutoff = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);

  const [rateLimitEvents, comments, itineraries] = await Promise.all([
    prisma.rateLimitEvent.deleteMany({ where: { createdAt: { lt: rateLimitCutoff } } }),
    prisma.comment.updateMany({
      where: { createdAt: { lt: ipCutoff }, ipAddress: { not: null } },
      data: { ipAddress: null },
    }),
    prisma.itinerary.updateMany({
      where: { submittedAt: { lt: ipCutoff }, submittedIp: { not: null } },
      data: { submittedIp: null },
    }),
  ]);

  const staleAccountRecords = await prisma.deletedAccountRecord.findMany({
    where: { deletedAt: { lt: deletedAccountCutoff }, legalHold: false, email: { not: null } },
    select: { id: true },
  });
  let deletedAccountRecordsPurged = 0;
  if (staleAccountRecords.length > 0) {
    const ids = staleAccountRecords.map((r) => r.id);
    await prisma.$transaction([
      prisma.deletedAccountRecordItem.deleteMany({ where: { recordId: { in: ids } } }),
      prisma.deletedAccountRecord.updateMany({ where: { id: { in: ids } }, data: { email: null, name: null } }),
    ]);
    deletedAccountRecordsPurged = ids.length;
  }

  const auditLogCutoff = new Date(Date.now() - 3 * 365 * 24 * 60 * 60 * 1000);
  const auditLogsPurged = await prisma.adminAuditLog.deleteMany({
    where: { createdAt: { lt: auditLogCutoff }, legalHold: false },
  });

  // 2026-10-25のアカウント統合で、itinerary.planner_account_idの参照先がplanner_account
  // からuser_accountへ付け替わった(段階3)。生SQLはPrismaのリレーションを経由しないため、
  // ここは手で直す必要がある。プランナー機能だけの利用停止(planner_suspended_at)も見る
  // (2026-11-09、セキュリティ指摘)
  const tripDescriptionsCleared = await prisma.$executeRaw`
    UPDATE trip
    SET description = NULL
    WHERE description IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM itinerary i
        JOIN user_account p ON p.id = i.planner_account_id
        WHERE i.id = trip.original_itinerary_id
          AND (
            (trip.original_kind = 'copy' AND i.status <> 'deleted')
            OR (trip.original_kind = 'shared_link' AND i.status = 'draft' AND p.status <> 'suspended' AND p.planner_suspended_at IS NULL AND i.shared_link_token_hash IS NOT NULL AND i.shared_link_token_hash = trip.original_shared_link_token_hash)
            OR (trip.original_kind NOT IN ('copy', 'shared_link') AND i.status = 'published' AND p.status <> 'suspended' AND p.planner_suspended_at IS NULL)
          )
      )
  `;
  const tripSpotContentCleared = await prisma.$executeRaw`
    UPDATE trip_spot
    SET memo = NULL, photo_url = NULL, photo_author = NULL, photo_license = NULL, photo_license_url = NULL, photo_source_url = NULL
    WHERE (memo IS NOT NULL OR photo_url IS NOT NULL)
      AND trip_id IN (
        SELECT trip.id FROM trip
        WHERE NOT EXISTS (
          SELECT 1 FROM itinerary i
          JOIN user_account p ON p.id = i.planner_account_id
          WHERE i.id = trip.original_itinerary_id
            AND (
              (trip.original_kind = 'copy' AND i.status <> 'deleted')
              OR (trip.original_kind = 'shared_link' AND i.status = 'draft' AND p.status <> 'suspended' AND p.planner_suspended_at IS NULL AND i.shared_link_token_hash IS NOT NULL AND i.shared_link_token_hash = trip.original_shared_link_token_hash)
              OR (trip.original_kind NOT IN ('copy', 'shared_link') AND i.status = 'published' AND p.status <> 'suspended' AND p.planner_suspended_at IS NULL)
            )
        )
      )
  `;

  const now = new Date();
  const [accountLinkNoncesPurged, accountLinkReceiptsPurged] = await Promise.all([
    prisma.accountLinkNonce.deleteMany({ where: { expiresAt: { lt: now } } }),
    prisma.accountLinkReceipt.deleteMany({ where: { expiresAt: { lt: now } } }),
  ]);

  const result = {
    rateLimitEvents: rateLimitEvents.count,
    ipCleared: { comments: comments.count, itineraries: itineraries.count },
    deletedAccountRecordsPurged,
    auditLogsPurged: auditLogsPurged.count,
    tripContentCleared: { descriptions: tripDescriptionsCleared, spotContent: tripSpotContentCleared },
    accountLinkExpiredPurged: { nonces: accountLinkNoncesPurged.count, receipts: accountLinkReceiptsPurged.count },
  };
  console.log("[cleanup-rate-limits]", JSON.stringify(result));
  return NextResponse.json(result);
}
