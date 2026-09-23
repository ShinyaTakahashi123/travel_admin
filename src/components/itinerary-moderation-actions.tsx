"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { hideItinerary, deleteItineraryAsAdmin } from "@/lib/actions";

export function ItineraryModerationActions({
  itineraryId,
  status,
}: {
  itineraryId: string;
  status: string;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleHide() {
    if (!confirm("このしおりを非公開にしますか？ユーザーサイトに表示されなくなります。")) return;
    startTransition(async () => {
      await hideItinerary(itineraryId);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("このしおりを削除しますか？この操作は取り消せません。")) return;
    startTransition(async () => {
      await deleteItineraryAsAdmin(itineraryId);
      router.push("/itineraries");
    });
  }

  return (
    <div className="flex gap-2.5">
      {status !== "private" && status !== "deleted" && (
        <button
          onClick={handleHide}
          disabled={isPending}
          className="bg-red-600 text-white rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
        >
          非公開にする
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="bg-white border border-red-300 text-red-600 rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
      >
        削除する
      </button>
    </div>
  );
}
