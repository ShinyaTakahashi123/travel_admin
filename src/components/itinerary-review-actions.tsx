"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from "@/components/ui/dialog";
import { approveItinerary, rejectItinerary } from "@/lib/actions";
import { UNEXPECTED_ERROR_MESSAGE } from "@/lib/action-result";
import { REJECTION_GREETING, REJECTION_CLOSING, REJECTION_TEMPLATES } from "@/lib/review-checklist";

function composeReason(selectedLabels: Set<string>): string {
  const bodies = REJECTION_TEMPLATES.filter((t) => selectedLabels.has(t.label)).map((t) => t.body);
  if (bodies.length === 0) return "";
  return [REJECTION_GREETING, ...bodies, REJECTION_CLOSING].join("\n\n");
}

export function ItineraryReviewActions({ itineraryId, title }: { itineraryId: string; title: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [selectedTemplates, setSelectedTemplates] = useState<Set<string>>(new Set());
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function toggleTemplate(label: string) {
    setSelectedTemplates((prev) => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      // 選んだひな形から、書き出し・文面・締めをまとめて文面を組み立て直す
      // (あとから自由に書き換えられるので、選び直すとその時点の内容で上書きする)
      setReason(composeReason(next));
      return next;
    });
  }

  function handleApprove() {
    if (!confirm("このしおりを承認して公開しますか？")) return;
    setError(null);
    startTransition(async () => {
      try {
        const result = await approveItinerary(itineraryId);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push("/itineraries");
      } catch {
        setError(UNEXPECTED_ERROR_MESSAGE);
      }
    });
  }

  function handleReject() {
    setError(null);
    startTransition(async () => {
      try {
        const result = await rejectItinerary(itineraryId, reason);
        if (!result.ok) {
          setError(result.error);
          return;
        }
        router.push("/itineraries");
      } catch {
        setError(UNEXPECTED_ERROR_MESSAGE);
      }
    });
  }

  return (
    <div className="flex gap-2.5">
      <Dialog>
        <DialogTrigger className="bg-white border border-red-300 text-red-600 rounded-lg px-5 py-2.5 font-bold text-base">
          却下する
        </DialogTrigger>
        <DialogContent className="sm:max-w-[560px]">
          <DialogHeader>
            <DialogTitle>しおりを却下する</DialogTitle>
            <DialogDescription>
              「{title}」を却下します。理由はプランナーサイトに表示されます。
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm font-bold text-muted-foreground mb-2">
                却下理由のひな形（複数選べます。選ぶと下の入力欄に文面が入ります）
              </div>
              <div className="flex gap-2 flex-wrap">
                {REJECTION_TEMPLATES.map((t) => (
                  <button
                    key={t.label}
                    type="button"
                    onClick={() => toggleTemplate(t.label)}
                    className={`text-sm font-bold px-3.5 py-1.5 rounded-full border ${
                      selectedTemplates.has(t.label)
                        ? "bg-secondary border-[#C7CBFA] text-secondary-foreground"
                        : "border-border bg-white"
                    }`}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground mb-2">
                却下理由（プランナーに表示されます。「〇〇」の部分は書き換えてください）
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={8}
                className="w-full border border-input rounded-lg px-3 py-2.5 text-base"
              />
            </div>
            {error && <p className="text-sm text-destructive">{error}</p>}

            <DialogFooter>
              <button
                onClick={handleReject}
                disabled={isPending || !reason.trim()}
                className="bg-red-600 text-white rounded-lg px-5.5 py-2.5 font-bold text-base disabled:opacity-50"
              >
                却下を確定する
              </button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>
      <button
        onClick={handleApprove}
        disabled={isPending}
        className="bg-green-600 text-white rounded-lg px-5.5 py-2.5 font-black text-base disabled:opacity-50"
      >
        承認する
      </button>
    </div>
  );
}
