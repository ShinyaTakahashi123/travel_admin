import Link from "next/link";
import { prisma } from "@/lib/prisma";
import { buildPageInfo, ADMIN_PAGE_SIZE } from "@/lib/pagination";
import { Pagination } from "@/components/ui/pagination";
import { PLACE_MASTER_CATEGORY_LABELS } from "@/lib/place-master-categories";

export default async function PlaceMasterListPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string; page?: string }>;
}) {
  const { q, page: pageParam } = await searchParams;

  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { address: { contains: q, mode: "insensitive" as const } },
          { aliases: { some: { alias: { contains: q, mode: "insensitive" as const } } } },
        ],
      }
    : {};

  const totalCount = await prisma.placeMaster.count({ where });
  const pageInfo = buildPageInfo(pageParam, totalCount, ADMIN_PAGE_SIZE);

  const places = await prisma.placeMaster.findMany({
    where,
    orderBy: [{ updatedAt: "desc" }, { id: "asc" }],
    skip: pageInfo.skip,
    take: pageInfo.take,
    include: {
      prefectureArea: { select: { name: true } },
      _count: { select: { spots: true } },
    },
  });

  return (
    <div>
      <div className="flex items-center justify-between flex-wrap gap-2.5 mb-4.5">
        <h1 className="text-xl font-black">スポットの台帳</h1>
        <Link
          href="/place-master/new"
          className="bg-primary text-white text-sm font-bold px-4 py-2 rounded-lg"
        >
          台帳に追加
        </Link>
      </div>

      <form className="flex items-center gap-2 bg-card border border-border rounded-lg px-3 py-1.5 mb-4.5 max-w-md">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94A3B8" strokeWidth="2">
          <circle cx="11" cy="11" r="7" />
          <path d="M21 21l-4.3-4.3" />
        </svg>
        <input
          name="q"
          defaultValue={q}
          placeholder="名前・住所・別名で検索"
          className="text-sm outline-none placeholder:text-muted-foreground flex-1"
        />
      </form>

      <div className="bg-card border border-border rounded-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full border-collapse min-w-[760px]">
            <thead>
              <tr>
                {["名前", "都道府県", "種類", "滞在目安", "印", "使用数", "最後に確認", ""].map((h) => (
                  <th key={h} className="text-left text-sm text-muted-foreground font-bold px-3.5 pb-2.5">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {places.map((place) => (
                <tr key={place.id} className="border-t border-muted">
                  <td className="text-base px-3.5 py-3">
                    {place.name}
                    {place.reading && (
                      <span className="text-sm text-muted-foreground ml-1.5">({place.reading})</span>
                    )}
                  </td>
                  <td className="text-base px-3.5 py-3">{place.prefectureArea?.name ?? "—"}</td>
                  <td className="text-base px-3.5 py-3">
                    {place.category ? (PLACE_MASTER_CATEGORY_LABELS[place.category] ?? place.category) : "—"}
                  </td>
                  <td className="text-base px-3.5 py-3">
                    {place.stayDurationMin != null ? `${place.stayDurationMin}分` : "—"}
                  </td>
                  <td className="px-3.5 py-3">
                    <div className="flex gap-1 flex-wrap">
                      {place.isWideArea && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-blue-100 text-blue-700">
                          広い場所
                        </span>
                      )}
                      {place.isMemorial && (
                        <span className="text-xs font-bold px-2 py-0.5 rounded-full bg-slate-200 text-slate-700">
                          慰霊
                        </span>
                      )}
                    </div>
                  </td>
                  <td className="text-base px-3.5 py-3">{place._count.spots}件</td>
                  <td className="text-base px-3.5 py-3">
                    {place.verifiedAt ? place.verifiedAt.toISOString().slice(0, 10) : "—"}
                  </td>
                  <td className="px-3.5 py-3">
                    <Link href={`/place-master/${place.id}/edit`} className="text-sm font-bold text-primary">
                      編集
                    </Link>
                  </td>
                </tr>
              ))}
              {places.length === 0 && (
                <tr>
                  <td colSpan={8} className="text-center text-base text-muted-foreground py-8">
                    該当する台帳はありません。
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
      <Pagination basePath="/place-master" searchParams={{ q }} {...pageInfo} />
    </div>
  );
}
