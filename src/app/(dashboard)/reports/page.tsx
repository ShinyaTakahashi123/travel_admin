import { prisma } from "@/lib/prisma";
import { ReportList } from "@/components/report-list";

export default async function ReportManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ selected?: string }>;
}) {
  const { selected } = await searchParams;

  const reports = await prisma.report.findMany({
    orderBy: { createdAt: "desc" },
    include: { reporterUserAccount: { select: { name: true } } },
  });

  const unreadCount = reports.filter((r) => r.status === "unread").length;

  const itineraryIds = reports.filter((r) => r.targetType === "itinerary").map((r) => r.targetId);
  const commentIds = reports.filter((r) => r.targetType === "comment").map((r) => r.targetId);

  const [itineraries, comments] = await Promise.all([
    prisma.itinerary.findMany({
      where: { id: { in: itineraryIds } },
      select: { id: true, title: true, plannerAccount: { select: { name: true } } },
    }),
    prisma.comment.findMany({
      where: { id: { in: commentIds } },
      select: { id: true, body: true, userAccount: { select: { name: true } } },
    }),
  ]);
  const itineraryById = new Map(itineraries.map((i) => [i.id, i]));
  const commentById = new Map(comments.map((c) => [c.id, c]));

  const plain = reports.map((r) => {
    const target =
      r.targetType === "itinerary"
        ? itineraryById.get(r.targetId)
        : commentById.get(r.targetId);
    const targetTitle =
      r.targetType === "itinerary"
        ? itineraryById.get(r.targetId)?.title ?? "（削除済みのしおり）"
        : `コメント: 「${commentById.get(r.targetId)?.body.slice(0, 20) ?? "（削除済み）"}」`;
    const targetAuthor =
      r.targetType === "itinerary"
        ? itineraryById.get(r.targetId)?.plannerAccount.name
        : commentById.get(r.targetId)?.userAccount.name;

    return {
      id: r.id,
      targetType: r.targetType,
      targetId: r.targetId,
      targetTitle,
      targetAuthor: targetAuthor ?? null,
      reason: r.reason,
      status: r.status,
      createdAt: r.createdAt.toISOString(),
      reporterName: r.reporterUserAccount.name,
      canHide: r.targetType === "itinerary" && Boolean(target),
    };
  });

  return (
    <ReportList reports={plain} unreadCount={unreadCount} initialSelectedId={selected} />
  );
}
