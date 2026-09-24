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

const QUICK_REASONS = ["転載・著作権の疑い", "情報の誤り", "不適切な写真", "スパム・宣伝目的"];

export function ItineraryReviewActions({ itineraryId, title }: { itineraryId: string; title: string }) {
  const router = useRouter();
  const [reason, setReason] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

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
        <DialogContent className="sm:max-w-[480px]">
          <DialogHeader>
            <DialogTitle>しおりを却下する</DialogTitle>
            <DialogDescription>
              「{title}」を却下します。理由はプランナーサイトに表示されます。
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col gap-4">
            <div>
              <div className="text-sm font-bold text-muted-foreground mb-2">
                却下理由（よく使う理由）
              </div>
              <div className="flex gap-2 flex-wrap">
                {QUICK_REASONS.map((r) => (
                  <button
                    key={r}
                    type="button"
                    onClick={() => setReason(r)}
                    className={`text-sm font-bold px-3.5 py-1.5 rounded-full border ${
                      reason === r ? "bg-secondary border-[#C7CBFA] text-secondary-foreground" : "border-border bg-white"
                    }`}
                  >
                    {r}
                  </button>
                ))}
              </div>
            </div>
            <div>
              <div className="text-sm font-bold text-muted-foreground mb-2">
                却下理由（プランナーに表示されます）
              </div>
              <textarea
                value={reason}
                onChange={(e) => setReason(e.target.value)}
                rows={4}
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
