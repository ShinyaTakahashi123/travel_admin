"use client";

import { useState, useTransition } from "react";
import { resendInvite } from "@/lib/actions";

export function ResendInviteButton({ adminId }: { adminId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    setError(null);
    startTransition(async () => {
      const result = await resendInvite(adminId);
      if (!result.ok) {
        setError(result.error);
        return;
      }
      setLink(`${window.location.origin}/invite/accept/${result.data.inviteToken}`);
    });
  }

  if (link) {
    return <span className="text-sm text-muted-foreground break-all">{link}</span>;
  }

  return (
    <div className="flex flex-col items-start gap-1">
      <button
        onClick={handleClick}
        disabled={isPending}
        className="text-sm font-bold text-primary disabled:opacity-50"
      >
        招待を再送信
      </button>
      {error && <span className="text-xs text-destructive">{error}</span>}
    </div>
  );
}
