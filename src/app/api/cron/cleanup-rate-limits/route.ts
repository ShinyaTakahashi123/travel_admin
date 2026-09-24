import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

// Vercel Cron（vercel.json）から1日1回呼ばれる日次クリーンアップ。Vercel Hobbyプランの
// Cron Jobs数の上限内に収めるため、複数の定期削除処理をこの1本にまとめている:
// 1. 回数制限用の記録（RateLimitEvent）のうち24時間より古いものを削除（直近24時間分で十分なため）
// 2. 権利侵害の申告・開示請求への対応のため記録しているIPアドレス
//    （Comment.ipAddress / Request.ipAddress / Itinerary.submittedIp）のうち、
//    記録から6か月を過ぎたものをnullにする（投稿・しおり本体は消さない）
// ※ IPアドレスの値自体はログに出さない（件数のみ）
export const maxDuration = 60;

export async function GET(request: Request) {
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const rateLimitCutoff = new Date(Date.now() - 24 * 60 * 60 * 1000);
  const ipCutoff = new Date(Date.now() - 6 * 30 * 24 * 60 * 60 * 1000);

  const [rateLimitEvents, comments, requests, itineraries] = await Promise.all([
    prisma.rateLimitEvent.deleteMany({ where: { createdAt: { lt: rateLimitCutoff } } }),
    prisma.comment.updateMany({
      where: { createdAt: { lt: ipCutoff }, ipAddress: { not: null } },
      data: { ipAddress: null },
    }),
    prisma.request.updateMany({
      where: { createdAt: { lt: ipCutoff }, ipAddress: { not: null } },
      data: { ipAddress: null },
    }),
    prisma.itinerary.updateMany({
      where: { submittedAt: { lt: ipCutoff }, submittedIp: { not: null } },
      data: { submittedIp: null },
    }),
  ]);

  const result = {
    rateLimitEvents: rateLimitEvents.count,
    ipCleared: { comments: comments.count, requests: requests.count, itineraries: itineraries.count },
  };
  console.log("[cleanup-rate-limits]", JSON.stringify(result));
  return NextResponse.json(result);
}
