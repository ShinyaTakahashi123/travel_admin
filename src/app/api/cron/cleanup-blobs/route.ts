import { NextResponse } from "next/server";
import { cleanupUnreferencedBlobs } from "@/lib/blob-cleanup";

// Vercel Cron（vercel.json）から1日1回呼ばれ、どこからも参照されていない画像を削除する。
// 手動で動作確認するときは ?dryRun=1 を付けると、削除せずに対象件数だけを返す。
export const maxDuration = 60;

export async function GET(request: Request) {
  // Vercel CronはCRON_SECRETが設定されていると「Authorization: Bearer <CRON_SECRET>」を付けて呼び出す
  const secret = process.env.CRON_SECRET;
  if (!secret || request.headers.get("authorization") !== `Bearer ${secret}`) {
    return NextResponse.json({ error: "unauthorized" }, { status: 401 });
  }

  const dryRun = new URL(request.url).searchParams.get("dryRun") === "1";
  const result = await cleanupUnreferencedBlobs({ dryRun });
  console.log("[cleanup-blobs]", JSON.stringify(result));
  return NextResponse.json(result);
}
