"use client";

import Link from "next/link";
import { useEffect, useState, useTransition } from "react";
import { markInquiryRead, markInquiryResponded, markInquiryUnresponded } from "@/lib/actions";
import { INQUIRY_STATUS_LABEL, INQUIRY_SOURCE_LABEL, formatDate } from "@/lib/format";

type PlainInquiry = {
  id: string;
  sourceSite: string;
  category: string;
  name: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
};

export function InquiryList({
  inquiries,
  unreadCount,
  initialSelectedId,
  categories,
  currentCategory,
  currentSource,
}: {
  inquiries: PlainInquiry[];
  unreadCount: number;
  initialSelectedId?: string;
  categories: string[];
  currentCategory: string;
  currentSource: string;
}) {
  const [selectedId, setSelectedId] = useState(initialSelectedId ?? inquiries[0]?.id);
  const [isPending, startTransition] = useTransition();
  const selected = inquiries.find((i) => i.id === selectedId);

  useEffect(() => {
    if (selected && selected.status === "unread") {
      startTransition(() => markInquiryRead(selected.id));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [selectedId]);

  function buildQuery(overrides: Record<string, string | undefined>) {
    const merged = { category: currentCategory, source: currentSource, ...overrides };
    const qs = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    const query = qs.toString();
    return query ? `/inquiries?${query}` : "/inquiries";
  }

  return (
    <div className="flex gap-6 items-start flex-col lg:flex-row">
      <div className="flex-1 w-full">
        <div className="text-xl font-black mb-4">
          お問い合わせ管理{" "}
          {unreadCount > 0 && <span className="text-base font-bold text-red-600">未読 {unreadCount}件</span>}
        </div>

        <div className="flex items-center gap-2 mb-4 flex-wrap">
          <span className="text-sm font-bold text-muted-foreground">カテゴリ:</span>
          <div className="flex gap-1.5 flex-wrap">
            <Link
              href={buildQuery({ category: undefined })}
              className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                !currentCategory ? "border-primary text-primary bg-secondary/40" : "border-border text-muted-foreground"
              }`}
            >
              すべて
            </Link>
            {categories.map((c) => (
              <Link
                key={c}
                href={buildQuery({ category: c })}
                className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                  currentCategory === c
                    ? "border-primary text-primary bg-secondary/40"
                    : "border-border text-muted-foreground"
                }`}
              >
                {c}
              </Link>
            ))}
          </div>
        </div>

        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-sm font-bold text-muted-foreground">サイト:</span>
          <div className="flex gap-1.5 flex-wrap">
            <Link
              href={buildQuery({ source: undefined })}
              className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                !currentSource ? "border-primary text-primary bg-secondary/40" : "border-border text-muted-foreground"
              }`}
            >
              すべて
            </Link>
            {Object.entries(INQUIRY_SOURCE_LABEL).map(([value, label]) => (
              <Link
                key={value}
                href={buildQuery({ source: value })}
                className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                  currentSource === value
                    ? "border-primary text-primary bg-secondary/40"
                    : "border-border text-muted-foreground"
                }`}
              >
                {label}
              </Link>
            ))}
          </div>
        </div>

        {inquiries.length === 0 ? (
          <p className="text-base text-muted-foreground">該当するお問い合わせはありません。</p>
        ) : (
          <div className="flex flex-col gap-2.5">
            {inquiries.map((i) => {
              const badge = INQUIRY_STATUS_LABEL[i.status];
              return (
                <button
                  key={i.id}
                  onClick={() => setSelectedId(i.id)}
                  className={`text-left bg-card border rounded-xl px-4 py-3.5 flex items-center gap-3.5 ${
                    i.id === selectedId ? "border-primary bg-secondary/40" : "border-border"
                  } ${i.status === "responded" ? "opacity-60" : ""}`}
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1 flex-wrap">
                      <span className="bg-muted text-muted-foreground text-sm font-bold px-2 py-0.5 rounded-full">
                        {i.category}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        {INQUIRY_SOURCE_LABEL[i.sourceSite] ?? i.sourceSite}
                      </span>
                    </div>
                    <div className="font-bold text-base truncate">{i.name} さん</div>
                    <div className="text-sm text-muted-foreground truncate">{i.message}</div>
                  </div>
                  <span
                    className="text-sm font-bold px-2.5 py-0.5 rounded-full whitespace-nowrap"
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
        <div className="w-full lg:w-[360px] flex-shrink-0 bg-card border border-border rounded-2xl p-5">
          <div className="text-sm font-bold text-muted-foreground mb-1.5">お問い合わせ詳細</div>
          <div className="flex items-center gap-2 mb-2.5 flex-wrap">
            <span className="bg-muted text-muted-foreground text-sm font-bold px-2 py-0.5 rounded-full">
              {selected.category}
            </span>
            <span className="text-sm text-muted-foreground">
              {INQUIRY_SOURCE_LABEL[selected.sourceSite] ?? selected.sourceSite}
            </span>
          </div>
          <div className="font-black text-base mb-1">{selected.name} さん</div>
          <div className="text-sm text-secondary-foreground mb-3.5">{selected.email}</div>
          <div className="text-sm text-[#3A5A50] leading-relaxed mb-3.5 whitespace-pre-wrap">
            {selected.message}
          </div>
          <div className="text-sm text-muted-foreground mb-4">
            受付日: {formatDate(new Date(selected.createdAt))}
          </div>
          <div className="flex flex-col gap-2.5">
            {selected.status === "responded" ? (
              <button
                disabled={isPending}
                onClick={() => startTransition(() => markInquiryUnresponded(selected.id))}
                className="bg-white border border-border rounded-lg py-2.5 font-bold text-base disabled:opacity-50"
              >
                未対応に戻す
              </button>
            ) : (
              <button
                disabled={isPending}
                onClick={() => startTransition(() => markInquiryResponded(selected.id))}
                className="bg-primary text-white rounded-lg py-2.5 font-bold text-base disabled:opacity-50"
              >
                対応済みにする
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
