"use client";

import { useState, useTransition } from "react";
import { resendInvite } from "@/lib/actions";

export function ResendInviteButton({ adminId }: { adminId: string }) {
  const [link, setLink] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  function handleClick() {
    startTransition(async () => {
      const { inviteToken } = await resendInvite(adminId);
      setLink(`${window.location.origin}/invite/accept/${inviteToken}`);
    });
  }

  if (link) {
    return <span className="text-sm text-muted-foreground break-all">{link}</span>;
  }

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className="text-sm font-bold text-primary disabled:opacity-50"
    >
      招待を再送信
    </button>
  );
}
