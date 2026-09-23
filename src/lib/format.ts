export function formatDate(date: Date): string {
  return `${date.getFullYear()}/${String(date.getMonth() + 1).padStart(2, "0")}/${String(
    date.getDate()
  ).padStart(2, "0")}`;
}

export function formatDateTime(date: Date): string {
  return `${formatDate(date)} ${String(date.getHours()).padStart(2, "0")}:${String(
    date.getMinutes()
  ).padStart(2, "0")}`;
}

export function formatNights(nights: number): string {
  if (nights <= 0) return "日帰り";
  return `${nights}泊${nights + 1}日`;
}

export const ITINERARY_STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  draft: { label: "下書き", bg: "#FEF3C7", fg: "#B45309" },
  pending: { label: "承認待ち", bg: "#FFEDD5", fg: "#C2410C" },
  published: { label: "公開中", bg: "#DCFCE7", fg: "#16A34A" },
  rejected: { label: "却下", bg: "#FEE2E2", fg: "#DC2626" },
  private: { label: "非公開", bg: "#F1F5F9", fg: "#64748B" },
  deleted: { label: "削除済み", bg: "#F1F5F9", fg: "#64748B" },
};

export const ACCOUNT_STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  active: { label: "有効", bg: "#DCFCE7", fg: "#16A34A" },
  suspended: { label: "利用停止", bg: "#FEE2E2", fg: "#DC2626" },
};

export const ADMIN_STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  invited: { label: "招待中", bg: "#FEF3C7", fg: "#B45309" },
  active: { label: "有効", bg: "#DCFCE7", fg: "#16A34A" },
  disabled: { label: "無効化済み", bg: "#FEE2E2", fg: "#DC2626" },
};

export const REPORT_STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  unread: { label: "未対応", bg: "#FEE2E2", fg: "#DC2626" },
  resolved: { label: "対応済み", bg: "#F1F5F9", fg: "#64748B" },
  dismissed: { label: "却下", bg: "#F1F5F9", fg: "#64748B" },
};
