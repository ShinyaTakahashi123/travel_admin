import Link from "next/link";
import type { ReactNode } from "react";
import type { PageInfo } from "@/lib/pagination";

// 一覧画面のページ送りの共通部品。絞り込み・検索の条件(searchParams)は
// pageだけ書き換えて保つ。スマホの幅でも折り返して崩れないようにしている

type PaginationProps = {
  basePath: string;
  searchParams: Record<string, string | undefined>;
} & PageInfo;

function buildHref(basePath: string, searchParams: Record<string, string | undefined>, page: number): string {
  const params = new URLSearchParams();
  for (const [key, value] of Object.entries(searchParams)) {
    if (value !== undefined && key !== "page") params.set(key, value);
  }
  if (page > 1) params.set("page", String(page));
  const qs = params.toString();
  return qs ? `${basePath}?${qs}` : basePath;
}

// 現在ページの前後1つ・最初・最後を残し、間が空いたら「…」を挟む
function getPageNumbers(current: number, total: number): (number | "ellipsis")[] {
  if (total <= 7) return Array.from({ length: total }, (_, i) => i + 1);
  const keep = new Set<number>([1, total, current - 1, current, current + 1]);
  const sorted = [...keep].filter((p) => p >= 1 && p <= total).sort((a, b) => a - b);
  const result: (number | "ellipsis")[] = [];
  let prev = 0;
  for (const p of sorted) {
    if (prev && p - prev > 1) result.push("ellipsis");
    result.push(p);
    prev = p;
  }
  return result;
}

function PageLink({
  href,
  active,
  disabled,
  children,
}: {
  href: string;
  active?: boolean;
  disabled?: boolean;
  children: ReactNode;
}) {
  if (disabled) {
    return <span className="text-sm font-bold px-2.5 py-1 rounded-lg text-muted-foreground/40 select-none">{children}</span>;
  }
  return (
    <Link
      href={href}
      className={`text-sm font-bold px-2.5 py-1 rounded-lg ${
        active ? "bg-secondary text-secondary-foreground" : "text-foreground hover:bg-muted"
      }`}
    >
      {children}
    </Link>
  );
}

export function Pagination({ basePath, searchParams, page, totalPages, totalCount, pageSize }: PaginationProps) {
  if (totalCount === 0) return null;
  const from = (page - 1) * pageSize + 1;
  const to = Math.min(page * pageSize, totalCount);
  const pageNumbers = getPageNumbers(page, totalPages);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mt-4 flex-wrap">
      <div className="text-sm text-muted-foreground">
        全{totalCount.toLocaleString()}件中 {from.toLocaleString()}〜{to.toLocaleString()}件
      </div>
      {totalPages > 1 && (
        <nav className="flex items-center gap-1 flex-wrap justify-center" aria-label="ページ送り">
          <PageLink href={buildHref(basePath, searchParams, page - 1)} disabled={page <= 1}>
            前へ
          </PageLink>
          {pageNumbers.map((p, i) =>
            p === "ellipsis" ? (
              <span key={`ellipsis-${i}`} className="px-1.5 text-sm text-muted-foreground">
                …
              </span>
            ) : (
              <PageLink key={p} href={buildHref(basePath, searchParams, p)} active={p === page}>
                {p}
              </PageLink>
            )
          )}
          <PageLink href={buildHref(basePath, searchParams, page + 1)} disabled={page >= totalPages}>
            次へ
          </PageLink>
        </nav>
      )}
    </div>
  );
}
