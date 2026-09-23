"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { resolveReportHideItinerary, dismissReport } from "@/lib/actions";
import { REPORT_STATUS_LABEL } from "@/lib/format";
import { formatDate } from "@/lib/format";

type PlainReport = {
  id: string;
  targetType: string;
  targetId: string;
  targetTitle: string;
  targetAuthor: string | null;
  reason: string;
  status: string;
  createdAt: string;
  reporterName: string;
  canHide: boolean;
};

export function ReportList({
  reports,
  unreadCount,
  initialSelectedId,
}: {
  reports: PlainReport[];
  unreadCount: number;
  initialSelectedId?: string;
}) {
  const router = useRouter();
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? reports[0]?.id);
  const [isPending, startTransition] = useTransition();
  const selected = reports.find((r) => r.id === selectedId);

  function handleHide() {
    if (!selected) return;
    if (!confirm("対象のしおりを非公開にしますか？")) return;
    startTransition(async () => {
      await resolveReportHideItinerary(selected.id);
      router.refresh();
    });
  }

  function handleDismiss() {
    if (!selected) return;
    startTransition(async () => {
      await dismissReport(selected.id);
      router.refresh();
    });
  }

  return (
    <div className="flex gap-6 items-start flex-col lg:flex-row">
      <div className="flex-1 w-full">
        <div className="text-lg font-black mb-5">
          通報管理{" "}
          {unreadCount > 0 && <span className="text-sm font-bold text-red-600">未対応 {unreadCount}件</span>}
        </div>

        {reports.length === 0 ? (
          <p className="text-sm text-muted-foreground">通報はありません。</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {reports.map((r) => {
              const badge = REPORT_STATUS_LABEL[r.status];
              return (
                <button
                  key={r.id}
                  onClick={() => setSelectedId(r.id)}
                  className={`text-left bg-card border rounded-xl px-4 py-3.5 flex items-center gap-3.5 ${
                    r.id === selectedId ? "border-primary bg-secondary/40" : "border-border"
                  } ${r.status !== "unread" ? "opacity-60" : ""}`}
                >
                  <svg
                    width="18"
                    height="18"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke={r.status === "unread" ? "#DC2626" : "#94A3B8"}
                    strokeWidth="1.6"
                    className="flex-shrink-0"
                  >
                    <path d="M12 2a1 1 0 0 1 1 1v1.06A7 7 0 0 1 19 11v3.5l1.5 2.5h-17L5 14.5V11a7 7 0 0 1 6-6.94V3a1 1 0 0 1 1-1z" />
                    <path d="M9.5 19a2.5 2.5 0 0 0 5 0" />
                  </svg>
                  <div className="flex-1 min-w-0">
                    <div className="font-bold text-[13px] truncate">{r.targetTitle}</div>
                    <div className="text-[11px] text-muted-foreground">
                      対象: {r.targetType === "itinerary" ? "しおり" : "コメント"} ・ 通報者: {r.reporterName} ・{" "}
                      {formatDate(new Date(r.createdAt))}
                    </div>
                  </div>
                  <span
                    className="text-[11px] font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
                    style={{ background: badge.bg, color: badge.fg }}
                  >
                    {badge.label}
                  </span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {selected && (
        <div className="w-full lg:w-[340px] flex-shrink-0 bg-card border border-border rounded-2xl p-5">
          <div className="text-[11px] font-bold text-muted-foreground mb-1.5">通報詳細</div>
          <div className="font-black text-sm mb-2.5">{selected.targetTitle}</div>
          <div className="text-xs text-[#64748B] mb-3.5 leading-relaxed">通報理由: {selected.reason}</div>
          <div className="text-[11px] text-muted-foreground mb-4">
            {selected.targetAuthor && <>投稿者: {selected.targetAuthor} ・ </>}
            通報者: {selected.reporterName} ・ 通報日: {formatDate(new Date(selected.createdAt))}
          </div>
          {selected.status === "unread" && (
            <div className="flex flex-col gap-2.5">
              {selected.canHide && (
                <button
                  onClick={handleHide}
                  disabled={isPending}
                  className="bg-red-600 text-white rounded-lg py-2.5 font-bold text-[13px] disabled:opacity-50"
                >
                  対象のしおりを非公開にする
                </button>
              )}
              {selected.targetType === "itinerary" && (
                <Link
                  href={`/itineraries/${selected.targetId}`}
                  className="text-center bg-white border border-border rounded-lg py-2.5 font-bold text-[13px]"
                >
                  しおりの詳細を見る
                </Link>
              )}
              <button
                onClick={handleDismiss}
                disabled={isPending}
                className="bg-white border border-border rounded-lg py-2.5 font-bold text-[13px] text-muted-foreground disabled:opacity-50"
              >
                問題なし（却下する）
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
