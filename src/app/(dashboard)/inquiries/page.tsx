import { prisma } from "@/lib/prisma";
import { InquiryList } from "@/components/inquiry-list";

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
  searchParams: Promise<{ selected?: string; category?: string; source?: string }>;
}) {
  const { selected, category, source } = await searchParams;

  const inquiries = await prisma.inquiry.findMany({
    where: {
      category: category || undefined,
      sourceSite: source || undefined,
    },
    orderBy: { createdAt: "desc" },
  });

  const unreadCount = inquiries.filter((i) => i.status === "unread").length;

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
    />
  );
}
