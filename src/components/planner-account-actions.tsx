"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPlannerAccountStatus, setPlannerAccountLegalHold, deletePlannerAccount } from "@/lib/actions";

export function PlannerAccountActions({
  plannerId,
  status,
  legalHold,
  isSuperAdmin,
}: {
  plannerId: string;
  status: string;
  legalHold: boolean;
  isSuperAdmin: boolean;
}) {
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

  function handleToggleLegalHold() {
    const next = !legalHold;
    const message = next
      ? "手続き中(保全)の印を付けますか？付けると、本人は画面から退会できなくなります。"
      : "手続き中(保全)の印を外しますか？";
    if (!confirm(message)) return;
    startTransition(async () => {
      await setPlannerAccountLegalHold(plannerId, next);
      router.refresh();
    });
  }

  function handleDelete() {
    const message = legalHold
      ? "⚠️ このプランナーには手続き中(保全)の印が付いています。それでもこのプランナーアカウントを削除しますか？この操作は取り消せません。"
      : "このプランナーアカウントを削除しますか？この操作は取り消せません。";
    if (!confirm(message)) return;
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
        className="bg-white border border-red-300 text-red-600 rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
      >
        {status === "active" ? "利用停止にする" : "利用停止を解除"}
      </button>
      {isSuperAdmin && (
        <button
          onClick={handleToggleLegalHold}
          disabled={isPending}
          className="bg-white border border-border text-[#475569] rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
        >
          {legalHold ? "保全の印を外す" : "保全の印を付ける"}
        </button>
      )}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="bg-white border border-border text-[#475569] rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
      >
        削除する
      </button>
    </div>
  );
}
