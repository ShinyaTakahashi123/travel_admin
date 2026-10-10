// 一覧画面のページ送り(ページネーション)の共通ロジック。
// URLの?pageを読み取り、DBのskip/takeに変換する。範囲外のページ番号は
// 最後のページか1ページ目に寄せる(エラーにしない。仕様書2026-09-27)

export const ADMIN_PAGE_SIZE = 50;

export type PageInfo = {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  skip: number;
  take: number;
};

function parsePageParam(pageParam: string | undefined): number {
  const n = Number(pageParam);
  if (!Number.isInteger(n) || n < 1) return 1;
  return n;
}

export function buildPageInfo(pageParam: string | undefined, totalCount: number, pageSize: number): PageInfo {
  const totalPages = Math.max(1, Math.ceil(totalCount / pageSize));
  const requested = parsePageParam(pageParam);
  const page = Math.min(Math.max(requested, 1), totalPages);
  return { page, pageSize, totalCount, totalPages, skip: (page - 1) * pageSize, take: pageSize };
}
