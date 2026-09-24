import crypto from "crypto";
import { prisma } from "@/lib/prisma";

export const RATE_LIMIT_MESSAGE = "しばらく時間をおいてから、もう一度お試しください。";

// IPアドレスは平文で保存せずハッシュ化する。鍵なしのSHA-256だとIPv4は全数探索で
// 復元できてしまうため、AUTH_SECRETを鍵にしたHMACにする(保存先のサイトが違えば
// 鍵も違うため、サイトをまたいだハッシュ値の比較はできないが、レート制限の用途では問題ない)
export function hashIp(ip: string): string {
  return crypto.createHmac("sha256", process.env.AUTH_SECRET ?? "").update(ip).digest("hex");
}

// Vercelのヘッダーからクライアントの IP を取り出す
export function getClientIp(headers: Headers): string {
  const forwarded = headers.get("x-forwarded-for");
  if (forwarded) return forwarded.split(",")[0].trim();
  return headers.get("x-real-ip") ?? "unknown";
}

export function ipRateLimitKey(prefix: string, ip: string): string {
  return `${prefix}:ip:${hashIp(ip)}`;
}

export function emailRateLimitKey(prefix: string, email: string): string {
  return `${prefix}:email:${email.trim().toLowerCase()}`;
}

export function accountRateLimitKey(prefix: string, accountId: string): string {
  return `${prefix}:account:${accountId}`;
}

export async function recordRateLimitEvent(key: string): Promise<void> {
  await prisma.rateLimitEvent.create({ data: { key } });
}

export async function isRateLimited(key: string, limit: number, windowMinutes: number): Promise<boolean> {
  const since = new Date(Date.now() - windowMinutes * 60 * 1000);
  const count = await prisma.rateLimitEvent.count({ where: { key, createdAt: { gte: since } } });
  return count >= limit;
}
