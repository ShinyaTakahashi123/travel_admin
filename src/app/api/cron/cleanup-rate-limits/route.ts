import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron（vercel.json）から1日1回呼ばれる日次クリーンアップ。Vercel Hobbyプランの
// Cron Jobs数の上限内に収めるため、複数の定期削除処理をこの1本にまとめている:
// 1. 回数制限用の記録（RateLimitEvent）のうち24時間より古いものを削除（直近24時間分で十分なため）
// 2. 権利侵害の申告・開示請求への対応のため記録しているIPアドレス
//    （Comment.ipAddress / Request.ipAddress / Itinerary.submittedIp）のうち、
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
//    shared_link=削除・プランナーの利用停止・リンクを止めた(shared_link_token_hashがnullに
//    なった)のいずれかで見られなくなった扱い(2026-09-28セキュリティの指摘で
//    「リンクを止めただけなら残す」から変更)
//    ※ trip_spot.photo_urlは、Vercel Blobの「使われていない画像の削除」(cleanup-blobs、
//    src/lib/blob-cleanup.ts)の「使用中」判定には含めない。写真は元のPhotoの複製ではなく
//    URLの参照のみで、元のPhotoが消えれば「旅」側は写真なし表示になる仕様のため
//    (docs/specs/20260928-footprint-map-checkin.md 0節)。ここで含めてしまうと、本来削除
//    してよい画像がいつまでも消せなくなる
// ※ IPアドレスの値・メールアドレス・名前などの個人情報自体はログに出さない（件数のみ）
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rateLimitCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const ipCutoff = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);
  const deletedAccountCutoff = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);

  const [rateLimitEvents, comments, requests, itineraries] = await Promise.all([
    prisma.rateLimitEvent.deleteMany({ where: { createdAt: { lt: rateLimitCutoff } } }),
    prisma.comment.updateMany({
      where: { createdAt: { lt: ipCutoff }, ipAddress: { not: null } },
      data: { ipAddress: null },
    }),
    prisma.request.updateMany({
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

  const tripDescriptionsCleared = await prisma.$executeRaw`
    UPDATE trip
    SET description = NULL
    WHERE description IS NOT NULL
      AND NOT EXISTS (
        SELECT 1 FROM itinerary i
        JOIN planner_account p ON p.id = i.planner_account_id
        WHERE i.id = trip.original_itinerary_id
          AND (
            (trip.original_kind = 'copy' AND i.status <> 'deleted')
            OR (trip.original_kind = 'shared_link' AND i.status <> 'deleted' AND p.status <> 'suspended' AND i.shared_link_token_hash IS NOT NULL)
            OR (trip.original_kind NOT IN ('copy', 'shared_link') AND i.status = 'published' AND p.status <> 'suspended')
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
          JOIN planner_account p ON p.id = i.planner_account_id
          WHERE i.id = trip.original_itinerary_id
            AND (
              (trip.original_kind = 'copy' AND i.status <> 'deleted')
              OR (trip.original_kind = 'shared_link' AND i.status <> 'deleted' AND p.status <> 'suspended' AND i.shared_link_token_hash IS NOT NULL)
              OR (trip.original_kind NOT IN ('copy', 'shared_link') AND i.status = 'published' AND p.status <> 'suspended')
            )
        )
      )
  `;

  const result = {
    rateLimitEvents: rateLimitEvents.count,
    ipCleared: { comments: comments.count, requests: requests.count, itineraries: itineraries.count },
    deletedAccountRecordsPurged,
    auditLogsPurged: auditLogsPurged.count,
    tripContentCleared: { descriptions: tripDescriptionsCleared, spotContent: tripSpotContentCleared },
  };
  console.log("[cleanup-rate-limits]", JSON.stringify(result));
  return NextResponse.json(result);
}
