import { redirect } from "next/navigation";
import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { getActiveAdmin } from "@/lib/admin-guard";
import { formatDateTime, AUDIT_LOG_ACTION_LABEL, AUDIT_LOG_TARGET_TYPE_LABEL } from "@/lib/format";

const TARGET_TYPES = ["itinerary", "user_account", "planner_account", "admin", "report", "inquiry"];

function targetHref(targetType: string, targetId: string): string | null {
  switch (targetType) {
    case "itinerary":
      return `/itineraries/${targetId}`;
    case "user_account":
      return `/users/${targetId}`;
    case "planner_account":
      return `/planners/${targetId}`;
    case "admin":
      return `/accounts/${targetId}/edit`;
    case "report":
      return `/reports?selected=${targetId}`;
    case "inquiry":
      return `/inquiries?selected=${targetId}`;
    default:
      return null;
  }
}

export default async function AuditLogPage({
  searchParams,
}: {
  searchParams: Promise<{ action?: string; targetType?: string; from?: string; to?: string }>;
}) {
  const admin = await getActiveAdmin();
  if (!admin) redirect("/login");
  if (admin.role !== "super") redirect("/");

  const { action, targetType, from, to } = await searchParams;

  const logs = await prisma.adminAuditLog.findMany({
    where: {
      action: action || undefined,
      targetType: targetType || undefined,
      createdAt: {
        gte: from ? new Date(`${from}T00:00:00+09:00`) : undefined,
        lte: to ? new Date(`${to}T23:59:59+09:00`) : undefined,
      },
    },
    orderBy: { createdAt: "desc" },
    take: 200,
    include: { admin: { select: { name: true } } },
  });

  const actions = Array.from(new Set(logs.map((l) => l.action))).sort();

  function buildQuery(overrides: Record<string, string | undefined>) {
    const merged = { action, targetType, from, to, ...overrides };
    const qs = new URLSearchParams();
    Object.entries(merged).forEach(([k, v]) => {
      if (v) qs.set(k, v);
    });
    const query = qs.toString();
    return query ? `/audit-log?${query}` : "/audit-log";
  }

  return (
    <div>
      <div className="text-xl font-black mb-1">操作の記録</div>
      <p className="text-sm text-muted-foreground mb-5">
        承認・却下・利用停止・削除などの操作の記録です（スーパー管理者のみ閲覧できます。新しい順に最大200件）。
      </p>

      <div className="flex items-center gap-3 mb-5 flex-wrap">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-bold text-muted-foreground">種類:</span>
          <Link
            href={buildQuery({ targetType: undefined })}
            className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
              !targetType ? "border-primary text-primary bg-secondary/40" : "border-border text-muted-foreground"
            }`}
          >
            すべて
          </Link>
          {TARGET_TYPES.map((t) => (
            <Link
              key={t}
              href={buildQuery({ targetType: t })}
              className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                targetType === t ? "border-primary text-primary bg-secondary/40" : "border-border text-muted-foreground"
              }`}
            >
              {AUDIT_LOG_TARGET_TYPE_LABEL[t] ?? t}
            </Link>
          ))}
        </div>
      </div>

      {actions.length > 0 && (
        <div className="flex items-center gap-2 mb-5 flex-wrap">
          <span className="text-sm font-bold text-muted-foreground">操作:</span>
          <Link
            href={buildQuery({ action: undefined })}
            className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
              !action ? "border-primary text-primary bg-secondary/40" : "border-border text-muted-foreground"
            }`}
          >
            すべて
          </Link>
          {actions.map((a) => (
            <Link
              key={a}
              href={buildQuery({ action: a })}
              className={`text-sm font-bold rounded-full px-3 py-1.5 border ${
                action === a ? "border-primary text-primary bg-secondary/40" : "border-border text-muted-foreground"
              }`}
            >
              {AUDIT_LOG_ACTION_LABEL[a] ?? a}
            </Link>
          ))}
        </div>
      )}

      <form className="flex items-end gap-2.5 mb-5 flex-wrap" action="/audit-log" method="get">
        {action && <input type="hidden" name="action" value={action} />}
        {targetType && <input type="hidden" name="targetType" value={targetType} />}
        <div>
          <div className="text-xs font-bold text-muted-foreground mb-1">期間(から)</div>
          <input
            type="date"
            name="from"
            defaultValue={from ?? ""}
            className="border border-input rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <div>
          <div className="text-xs font-bold text-muted-foreground mb-1">期間(まで)</div>
          <input
            type="date"
            name="to"
            defaultValue={to ?? ""}
            className="border border-input rounded-lg px-3 py-2 text-sm"
          />
        </div>
        <button type="submit" className="bg-white border border-border rounded-lg px-4 py-2 font-bold text-sm">
          絞り込む
        </button>
      </form>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-muted">
              {["日時", "管理者", "操作", "対象"].map((h) => (
                <th key={h} className="text-left text-sm text-muted-foreground font-bold px-4 py-2.5">
                  {h}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 && (
              <tr>
                <td colSpan={4} className="text-center text-sm text-muted-foreground px-4 py-6">
                  記録がありません。
                </td>
              </tr>
            )}
            {logs.map((log) => {
              const href = targetHref(log.targetType, log.targetId);
              const detail = (log.detail ?? {}) as Record<string, unknown>;
              const title = typeof detail.title === "string" ? detail.title : null;
              return (
                <tr key={log.id} className="border-t border-muted">
                  <td className="text-sm px-4 py-3 whitespace-nowrap">{formatDateTime(log.createdAt)}</td>
                  <td className="text-sm px-4 py-3 whitespace-nowrap">{log.admin.name}</td>
                  <td className="text-sm px-4 py-3 whitespace-nowrap">{AUDIT_LOG_ACTION_LABEL[log.action] ?? log.action}</td>
                  <td className="text-sm px-4 py-3">
                    <span className="text-muted-foreground mr-1.5">
                      {AUDIT_LOG_TARGET_TYPE_LABEL[log.targetType] ?? log.targetType}
                    </span>
                    {href ? (
                      <Link href={href} className="text-primary font-bold underline">
                        {title ?? `${log.targetId.slice(0, 8)}...`}
                      </Link>
                    ) : (
                      (title ?? `${log.targetId.slice(0, 8)}...`)
                    )}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}
