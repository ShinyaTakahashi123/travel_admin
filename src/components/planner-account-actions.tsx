"use client";

import { useTransition } from "react";
import { useRouter } from "next/navigation";
import { setPlannerCapabilitySuspended, setUserAccountLegalHold, removePlannerRole, deleteUserAccount } from "@/lib/actions";

export function PlannerAccountActions({
  plannerId,
  plannerSuspended,
  legalHold,
  isOfficial,
  isSuperAdmin,
}: {
  plannerId: string;
  plannerSuspended: boolean;
  legalHold: boolean;
  isOfficial: boolean;
  isSuperAdmin: boolean;
}) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  function handleToggleCapability() {
    const next = !plannerSuspended;
    const message = next
      ? "プランナーの機能(しおりの作成・編集・公開)だけを止めますか？会員としてのログイン等はそのまま使えます。"
      : "プランナーの機能の停止を解除しますか？";
    if (!confirm(message)) return;
    startTransition(async () => {
      const result = await setPlannerCapabilitySuspended(plannerId, next);
      if (!result.ok) {
        alert(result.error);
        return;
      }
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
      const result = await setUserAccountLegalHold(plannerId, next);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      router.refresh();
    });
  }

  function handleRemoveRole() {
    const message =
      "プランナーの役割を外しますか？このプランナーが持つしおりはすべて削除され、会員としてはそのまま残ります。この操作は取り消せません。";
    if (!confirm(message)) return;
    startTransition(async () => {
      const result = await removePlannerRole(plannerId);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      router.push("/planners");
    });
  }

  function handleDelete() {
    const message = legalHold
      ? "⚠️ このアカウントには手続き中(保全)の印が付いています。それでもこのアカウント(会員・プランナー両方)を削除しますか？この操作は取り消せません。"
      : "このアカウント(会員・プランナー両方)を削除しますか？この操作は取り消せません。";
    if (!confirm(message)) return;
    startTransition(async () => {
      const result = await deleteUserAccount(plannerId);
      if (!result.ok) {
        alert(result.error);
        return;
      }
      router.push("/planners");
    });
  }

  return (
    <div className="flex gap-2.5 flex-wrap">
      {!isOfficial && (
        <button
          onClick={handleToggleCapability}
          disabled={isPending}
          className="bg-white border border-red-300 text-red-600 rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
        >
          {plannerSuspended ? "プランナー機能の停止を解除" : "プランナー機能だけ止める"}
        </button>
      )}
      {isSuperAdmin && (
        <button
          onClick={handleToggleLegalHold}
          disabled={isPending}
          className="bg-white border border-border text-[#475569] rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
        >
          {legalHold ? "保全の印を外す" : "保全の印を付ける"}
        </button>
      )}
      {!isOfficial && (
        <button
          onClick={handleRemoveRole}
          disabled={isPending}
          className="bg-white border border-border text-[#475569] rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
        >
          プランナーの役割を外す
        </button>
      )}
      {!isOfficial && (
        <button
          onClick={handleDelete}
          disabled={isPending}
          className="bg-white border border-border text-[#475569] rounded-lg px-4.5 py-2.5 font-bold text-sm disabled:opacity-50"
        >
          アカウントを削除する
        </button>
      )}
    </div>
  );
}
