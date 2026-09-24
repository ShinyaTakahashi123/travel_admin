// サーバー(Vercel)はUTCで動作するため、getFullYear()等のローカル時刻系メソッドを
// そのまま使うと日本時間の0〜9時台が前日の日付になってしまう。日本にはサマータイムが
// ないため、常に+9時間した上でUTC系メソッドで読み出せば日本時間になる。
const JST_OFFSET_MS = 9 * 60 * 60 * 1000;

function toJst(date: Date): Date {
  return new Date(date.getTime() + JST_OFFSET_MS);
}

export function formatDate(date: Date): string {
  const d = toJst(date);
  return `${d.getUTCFullYear()}/${String(d.getUTCMonth() + 1).padStart(2, "0")}/${String(
    d.getUTCDate()
  ).padStart(2, "0")}`;
}

export function formatDateTime(date: Date): string {
  const d = toJst(date);
  return `${formatDate(date)} ${String(d.getUTCHours()).padStart(2, "0")}:${String(
    d.getUTCMinutes()
  ).padStart(2, "0")}`;
}

// 日次集計（本日のPV・日次推移）を日本時間の0時区切りにするためのヘルパー
export function toJstDateKey(date: Date): string {
  return toJst(date).toISOString().slice(0, 10);
}

// 今日（日本時間）からdaysAgo日前の日付キー（YYYY-MM-DD、日本時間基準）
export function jstDateKeyDaysAgo(daysAgo: number): string {
  const d = toJst(new Date());
  d.setUTCDate(d.getUTCDate() - daysAgo);
  return d.toISOString().slice(0, 10);
}

// 日本時間での日付キー（YYYY-MM-DD）が指す「その日の0時（日本時間）」に対応するUTC時刻
export function jstMidnightUtc(dateKey: string): Date {
  return new Date(`${dateKey}T00:00:00+09:00`);
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

export const INQUIRY_STATUS_LABEL: Record<string, { label: string; bg: string; fg: string }> = {
  unread: { label: "未読", bg: "#FEE2E2", fg: "#DC2626" },
  read: { label: "既読", bg: "#FEF3C7", fg: "#B45309" },
  responded: { label: "対応済み", bg: "#F1F5F9", fg: "#64748B" },
};

export const INQUIRY_SOURCE_LABEL: Record<string, string> = {
  user: "ユーザーサイト",
  planner: "プランナーサイト",
};
