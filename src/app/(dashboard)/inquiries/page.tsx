import { prisma } from "@/lib/prisma";
import { InquiryList } from "@/components/inquiry-list";
import { buildPageInfo, ADMIN_PAGE_SIZE } from "@/lib/pagination";

const CATEGORIES = [
  "ご要望",
  "ご質問",
  "不具合の報告",
  "アカウントについて",
  "退会（アカウントの削除）のご依頼",
  "掲載内容について",
  "権利侵害・削除のご依頼",
  "その他",
];

export default async function InquiryManagementPage({
  searchParams,
}: {
  searchParams: Promise<{ selected?: string; category?: string; source?: string; page?: string }>;
}) {
  const { selected, category, source, page: pageParam } = await searchParams;

  const where = {
    category: category || undefined,
    sourceSite: source || undefined,
  };

  const totalCount = await prisma.inquiry.count({ where });
  const pageInfo = buildPageInfo(pageParam, totalCount, ADMIN_PAGE_SIZE);
  // 未読の件数は、ページを分ける前と同じになるよう、一覧とは別に数える(仕様書2026-09-27)
  const unreadCount = await prisma.inquiry.count({ where: { ...where, status: "unread" } });

  const inquiries = await prisma.inquiry.findMany({
    where,
    orderBy: [{ createdAt: "desc" }, { id: "asc" }],
    skip: pageInfo.skip,
    take: pageInfo.take,
  });

  const plain = inquiries.map((i) => ({
    id: i.id,
    sourceSite: i.sourceSite,
    category: i.category,
    name: i.name,
    email: i.email,
    message: i.message,
    status: i.status,
    createdAt: i.createdAt.toISOString(),
  }));

  return (
    <InquiryList
      inquiries={plain}
      unreadCount={unreadCount}
      initialSelectedId={selected}
      categories={CATEGORIES}
      currentCategory={category ?? ""}
      currentSource={source ?? ""}
      pageInfo={pageInfo}
    />
  );
}
