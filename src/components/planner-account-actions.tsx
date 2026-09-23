"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPlannerAccountStatus, deletePlannerAccount } from "@/lib/actions";

export function PlannerAccountActions({ plannerId, status }: { plannerId: string; status: string }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggleStatus() {
    const next = status === "active" ? "suspended" : "active";
    const message = next === "suspended" ? "このプランナーを利用停止にしますか？" : "利用停止を解除しますか？";
    if (!confirm(message)) return;
    startTransition(async () => {
      await setPlannerAccountStatus(plannerId, next);
      router.refresh();
    });
  }

  function handleDelete() {
    if (!confirm("このプランナーアカウントを削除しますか？この操作は取り消せません。")) return;
    startTransition(async () => {
      await deletePlannerAccount(plannerId);
      router.push("/planners");
    });
  }

  return (
    <div className="flex gap-2.5">
      <button
        onClick={handleToggleStatus}
        disabled={isPending}
        className="bg-white border border-red-300 text-red-600 rounded-lg px-4.5 py-2.5 font-bold text-xs disabled:opacity-50"
      >
        {status === "active" ? "利用停止にする" : "利用停止を解除"}
      </button>
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="bg-white border border-border text-[#475569] rounded-lg px-4.5 py-2.5 font-bold text-xs disabled:opacity-50"
      >
        削除する
      </button>
    </div>
  );
}
