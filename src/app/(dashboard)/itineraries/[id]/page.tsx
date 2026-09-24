import { notFound } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  formatDate,
  formatDateTime,
  formatNights,
  ITINERARY_STATUS_LABEL,
  AUDIT_LOG_ACTION_LABEL,
} from "@/lib/format";
import { AdminDayTabs, type AdminDayData } from "@/components/admin-day-tabs";
import { ItineraryReviewActions } from "@/components/itinerary-review-actions";
import { ItineraryModerationActions } from "@/components/itinerary-moderation-actions";
import { ItineraryPhotoGallery, type GalleryPhoto } from "@/components/itinerary-photo-gallery";
import { REVIEW_CHECKLIST } from "@/lib/review-checklist";
import { computeReviewWarnings, type ReviewSpot } from "@/lib/review-warnings";

function formatSpotTime(time: Date | null): string | null {
  if (!time) return null;
  const h = time.getUTCHours();
  const m = time.getUTCMinutes();
  return `${h}:${String(m).padStart(2, "0")}`;
}

function spotTimeMinutes(time: Date | null): number | null {
  if (!time) return null;
  return time.getUTCHours() * 60 + time.getUTCMinutes();
}

export default async function ItineraryDetailAdminPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const itinerary = await prisma.itinerary.findUnique({
    where: { id },
    include: {
      plannerAccount: true,
      areas: { include: { area: true } },
      days: {
        orderBy: { dayNumber: "asc" },
        include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } },
      },
      comments: {
        orderBy: { createdAt: "desc" },
        take: 5,
        include: { userAccount: { select: { name: true } } },
      },
      _count: { select: { favorites: true, comments: true } },
    },
  });
  if (!itinerary) notFound();

  const [reports, plannerPastCount, plannerTotalFavorites, auditLogs] = await Promise.all([
    prisma.report.findMany({
      where: { targetType: "itinerary", targetId: id },
      orderBy: { createdAt: "desc" },
      include: { reporterUserAccount: { select: { name: true } } },
    }),
    prisma.itinerary.count({
      where: { plannerAccountId: itinerary.plannerAccountId, id: { not: id }, status: { not: "deleted" } },
    }),
    prisma.favorite.count({ where: { itinerary: { plannerAccountId: itinerary.plannerAccountId } } }),
    prisma.adminAuditLog.findMany({
      where: { targetType: "itinerary", targetId: id },
      orderBy: { createdAt: "desc" },
      include: { admin: { select: { name: true } } },
    }),
  ]);

  const days: AdminDayData[] = itinerary.days.map((day) => ({
    id: day.id,
    dayNumber: day.dayNumber,
    spots: day.spots.map((spot) => ({
      id: spot.id,
      name: spot.name,
      visitTimeLabel: formatSpotTime(spot.visitTime),
      stayDurationMin: spot.stayDurationMin,
      address: spot.address,
      memo: spot.memo,
      websiteUrl: spot.websiteUrl,
      hasLocation: spot.lat != null && spot.lng != null,
    })),
  }));

  const meta = ITINERARY_STATUS_LABEL[itinerary.status];
  const isPending = itinerary.status === "pending";
  const unreadReports = reports.filter((r) => r.status === "unread");

  // 審査の手助け(承認待ちのときだけ計算する)
  const reviewSpots: ReviewSpot[] = itinerary.days.flatMap((day) =>
    day.spots.map((spot) => ({
      dayNumber: day.dayNumber,
      orderNo: spot.orderNo,
      name: spot.name,
      memo: spot.memo,
      address: spot.address,
      lat: spot.lat != null ? Number(spot.lat) : null,
      lng: spot.lng != null ? Number(spot.lng) : null,
      visitTimeMinutes: spotTimeMinutes(spot.visitTime),
      transitDurationMin: spot.transitDurationMin,
    }))
  );
  const warnings = isPending
    ? computeReviewWarnings({ description: itinerary.description, spots: reviewSpots, dayCount: itinerary.days.length })
    : [];

  // 前回の却下理由(操作の記録から。再申請のしおりの確認用)
  const previousRejection = auditLogs.find((l) => l.action === "reject") ?? null;
  const previousRejectionReason =
    previousRejection && typeof (previousRejection.detail as Record<string, unknown> | null)?.reason === "string"
      ? ((previousRejection.detail as Record<string, unknown>).reason as string)
      : null;

  // 写真の一覧(スポット名つき、まとめて大きく見るため)
  const photos: GalleryPhoto[] = itinerary.days.flatMap((day) =>
    day.spots.flatMap((spot) =>
      spot.photos.map((photo) => ({
        id: photo.id,
        url: photo.url,
        spotName: spot.name,
        dayNumber: day.dayNumber,
      }))
    )
  );

  return (
    <div>
      <div className="text-sm text-muted-foreground mb-2">
        <Link href="/itineraries">しおり管理</Link> &gt;{" "}
        <span className="text-foreground font-bold">{itinerary.title}</span>
      </div>

      <div className="flex items-start justify-between mb-5 flex-wrap gap-3">
        <div>
          <div className="flex items-center gap-2 mb-1.5 flex-wrap">
            <div className="font-black text-xl">{itinerary.title}</div>
            <span
              className="text-sm font-bold px-2.5 py-0.5 rounded-full"
              style={{ background: meta.bg, color: meta.fg }}
            >
              {meta.label}
            </span>
            {unreadReports.length > 0 && (
              <span className="bg-red-100 text-red-600 text-sm font-bold px-2.5 py-0.5 rounded-full">
                通報 {unreadReports.length}件
              </span>
            )}
          </div>
          <div className="text-sm text-muted-foreground">
            T-{itinerary.id.slice(0, 4).toUpperCase()} ・ 投稿者:{" "}
            <Link href={`/planners/${itinerary.plannerAccountId}`} className="text-primary font-bold underline">
              {itinerary.plannerAccount.name}
            </Link>{" "}
            ・ エリア: {itinerary.areas.map((a) => a.area.name).join("・") || "未設定"} ・{" "}
            {formatNights(itinerary.nights)} ・{" "}
            {isPending
              ? `申請日: ${itinerary.submittedAt ? formatDateTime(itinerary.submittedAt) : "—"}`
              : itinerary.reviewedAt
                ? `公開日: ${formatDate(itinerary.reviewedAt)}`
                : ""}
          </div>
        </div>

        {isPending ? (
          <ItineraryReviewActions itineraryId={itinerary.id} title={itinerary.title} />
        ) : (
          <ItineraryModerationActions itineraryId={itinerary.id} status={itinerary.status} />
        )}
      </div>

      {isPending && previousRejectionReason && (
        <div className="bg-red-50 border border-red-200 rounded-2xl px-4.5 py-3.5 mb-5">
          <div className="text-sm font-bold text-red-700 mb-1">
            前回の却下理由({formatDateTime(previousRejection!.createdAt)})
          </div>
          <p className="text-sm text-red-700 whitespace-pre-wrap">{previousRejectionReason}</p>
        </div>
      )}

      {isPending && warnings.length > 0 && (
        <div className="bg-amber-50 border border-amber-300 rounded-2xl px-4.5 py-3.5 mb-5">
          <div className="text-sm font-bold text-amber-800 mb-1.5">自動で分かる注意(判断は行っていません)</div>
          <ul className="text-sm text-amber-800 list-disc pl-5 flex flex-col gap-0.5">
            {warnings.map((w, i) => (
              <li key={i}>{w}</li>
            ))}
          </ul>
        </div>
      )}

      {isPending && (
        <details className="bg-card border border-border rounded-2xl px-4.5 py-3.5 mb-5">
          <summary className="text-sm font-bold cursor-pointer select-none">審査のチェックリスト</summary>
          <div className="mt-3 flex flex-col gap-4">
            {REVIEW_CHECKLIST.map((group) => (
              <div key={group.category}>
                <div className="text-sm font-bold text-muted-foreground mb-1.5">{group.category}</div>
                <ul className="flex flex-col gap-1">
                  {group.items.map((item) => (
                    <li key={item.code} className="text-sm flex items-start gap-2">
                      <input type="checkbox" className="mt-1" />
                      <span>
                        <span className="font-bold text-muted-foreground">{item.code}</span> {item.text}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </details>
      )}

      <div className="flex gap-4 mb-5 flex-wrap">
        {[
          { label: "閲覧数", value: itinerary.viewCount.toLocaleString() },
          { label: "いいね数", value: itinerary._count.favorites },
          { label: "コメント数", value: itinerary._count.comments },
          {
            label: "通報件数",
            value: unreadReports.length,
            color: unreadReports.length > 0 ? "#DC2626" : undefined,
          },
        ].map((kpi) => (
          <div key={kpi.label} className="bg-card border border-border rounded-2xl px-4.5 py-4 flex-1 min-w-[130px]">
            <div className="text-sm text-muted-foreground font-bold mb-1">{kpi.label}</div>
            <div className="text-2xl font-black" style={{ color: kpi.color }}>
              {kpi.value}
            </div>
          </div>
        ))}
      </div>

      <div className="flex gap-4 flex-col md:flex-row">
        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 flex-1">
          <div
            className="h-[160px] rounded-lg bg-[#D6EEFB] mb-4"
            style={
              itinerary.thumbnailUrl
                ? { backgroundImage: `url(${itinerary.thumbnailUrl})`, backgroundSize: "cover", backgroundPosition: "center" }
                : undefined
            }
          />
          {itinerary.description && (
            <>
              <div className="font-black text-base mb-1.5">概要メモ</div>
              <p className="text-sm text-[#475569] leading-relaxed mb-4">{itinerary.description}</p>
            </>
          )}

          {isPending ? (
            <>
              <div className="font-black text-base mb-2.5">プランナーの過去実績</div>
              <p className="text-sm text-[#475569] leading-relaxed">
                過去の投稿数: {plannerPastCount}件
                <br />
                累計いいね数: {plannerTotalFavorites}
              </p>
            </>
          ) : (
            reports.length > 0 && (
              <>
                <div className="h-px bg-muted my-4" />
                <div className="font-black text-base mb-2.5">通報履歴</div>
                <div className="flex flex-col gap-2.5">
                  {reports.map((r) => (
                    <div
                      key={r.id}
                      className={`rounded-lg px-3 py-2.5 border ${
                        r.status === "unread" ? "bg-red-50 border-red-100" : "bg-muted border-muted"
                      }`}
                    >
                      <div className="flex justify-between text-sm font-bold mb-1">
                        <span>{r.reason}</span>
                        <span className="text-muted-foreground font-normal">{formatDate(r.createdAt)}</span>
                      </div>
                      <div className="text-sm text-[#64748B]">通報者: {r.reporterUserAccount.name}</div>
                    </div>
                  ))}
                </div>
              </>
            )
          )}
        </div>

        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 flex-[1.6]">
          <div className="font-black text-base mb-3">日程</div>
          <AdminDayTabs days={days} />
        </div>
      </div>

      {photos.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 mt-4">
          <div className="font-black text-base mb-3.5">写真一覧({photos.length}枚)</div>
          <ItineraryPhotoGallery photos={photos} />
        </div>
      )}

      {itinerary.comments.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 mt-4">
          <div className="font-black text-base mb-3.5">コメント一覧</div>
          <div className="flex flex-col gap-3">
            {itinerary.comments.map((c) => (
              <div key={c.id} className="flex items-center gap-2 text-base">
                <span className="font-bold">{c.userAccount.name}</span>
                <span className="text-sm text-muted-foreground">{formatDate(c.createdAt)}</span>
                <span className="text-[#475569]">{c.body}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {auditLogs.length > 0 && (
        <div className="bg-card border border-border rounded-2xl p-5 px-5.5 mt-4">
          <div className="font-black text-base mb-3.5">承認・却下などの経緯</div>
          <div className="flex flex-col gap-2.5">
            {auditLogs.map((log) => {
              const detail = (log.detail ?? {}) as Record<string, unknown>;
              const reason = typeof detail.reason === "string" ? detail.reason : null;
              return (
                <div key={log.id} className="border-l-2 border-border pl-3.5">
                  <div className="text-sm">
                    <span className="text-muted-foreground">{formatDateTime(log.createdAt)}</span>{" "}
                    <span className="font-bold">{log.admin.name}</span> が{" "}
                    <span className="font-bold">{AUDIT_LOG_ACTION_LABEL[log.action] ?? log.action}</span>
                  </div>
                  {reason && <div className="text-sm text-[#475569] mt-0.5 whitespace-pre-wrap">{reason}</div>}
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
