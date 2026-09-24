import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron（vercel.json）から1日1回呼ばれ、回数制限用の記録（RateLimitEvent）のうち
// 24時間より古いものを削除する（直近24時間分あれば十分なため）
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const cutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const result = await prisma.rateLimitEvent.deleteMany({ where: { createdAt: { lt: cutoff } } });
  console.log("[cleanup-rate-limits]", JSON.stringify(result));
  return NextResponse.json(result);
}
