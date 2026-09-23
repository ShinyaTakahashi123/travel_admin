import { prisma } from "@/lib/prisma";
import { MasterDataTabs } from "@/components/master-data-tabs";

export default async function MasterDataManagementPage() {
  const [prefectures, tags, areaItineraryCounts] = await Promise.all([
    prisma.area.findMany({
      where: { level: "prefecture" },
      orderBy: { displayOrder: "asc" },
      include: { children: { orderBy: { displayOrder: "asc" } } },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.itineraryArea.groupBy({ by: ["areaId"], _count: { _all: true } }),
  ]);

  const countByAreaId = new Map(areaItineraryCounts.map((c) => [c.areaId, c._count._all]));

  const plainPrefectures = prefectures.map((p) => ({
    id: p.id,
    name: p.name,
    children: p.children.map((c) => ({
      id: c.id,
      name: c.name,
      itineraryCount: countByAreaId.get(c.id) ?? 0,
    })),
  }));

  return (
    <div>
      <h1 className="text-lg font-black mb-4.5">マスタ管理</h1>
      <MasterDataTabs
        prefectures={plainPrefectures}
        tags={tags.map((t) => ({ id: t.id, name: t.name }))}
      />
    </div>
  );
}
