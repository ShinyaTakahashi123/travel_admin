"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { revokeSharedLinkAsAdmin } from "@/lib/actions";

// 権利侵害などの申告への対応で、限定公開リンクを管理者が止める。今の「非公開にする」は
// もともと非公開のコピーには効かないため、別の操作として用意している
export function RevokeSharedLinkButton({ itineraryId }: { itineraryId: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    if (!confirm("限定公開リンクを止めますか？今のリンクは使えなくなります。")) return;
    startTransition(async () => {
      const result = await revokeSharedLinkAsAdmin(itineraryId);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="bg-white border border-amber-300 text-amber-700 rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
    >
      限定公開リンクを止める
    </button>
  );
}
