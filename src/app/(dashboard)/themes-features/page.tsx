import { prisma } from "@/lib/prisma";
import { themeWhereInputFromIds } from "@/lib/theme-query";
import { THEME_IMAGE_CATALOG } from "@/lib/theme-image-catalog";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { ThemeAdminPanel } from "@/components/theme-admin-panel";
import { FeatureAdminPanel } from "@/components/feature-admin-panel";

const MIN_THEME_COUNT = 6;

export default async function ThemesFeaturesPage() {
  const [themes, features, tags, purposeTags] = await Promise.all([
    prisma.theme.findMany({
      orderBy: { displayOrder: "asc" },
      include: {
        tags: { include: { tag: true } },
        purposeTags: { include: { purposeTag: true } },
      },
    }),
    prisma.feature.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        items: {
          orderBy: { displayOrder: "asc" },
          include: {
            itinerary: {
              select: { id: true, title: true, status: true, nights: true, primaryArea: { select: { name: true } } },
            },
          },
        },
      },
    }),
    prisma.tag.findMany({ orderBy: { name: "asc" } }),
    prisma.purposeTag.findMany({ orderBy: { name: "asc" } }),
  ]);

  const themeCounts = await Promise.all(
    themes.map((t) =>
      prisma.itinerary.count({
        where: themeWhereInputFromIds(
          t.tags.map((x) => x.tagId),
          t.purposeTags.map((x) => x.purposeTagId)
        ),
      })
    )
  );

  const plainThemes = themes.map((t, i) => ({
    id: t.id,
    name: t.name,
    slug: t.slug,
    intro: t.intro,
    imageUrl: t.imageUrl,
    seasons: t.seasons,
    displayOrder: t.displayOrder,
    status: t.status,
    tagIds: t.tags.map((x) => x.tagId),
    purposeTagIds: t.purposeTags.map((x) => x.purposeTagId),
    publishedCount: themeCounts[i],
  }));

  const plainFeatures = features.map((f) => ({
    id: f.id,
    title: f.title,
    slug: f.slug,
    description: f.description,
    lead: f.lead,
    closing: f.closing,
    status: f.status,
    displayFromMonth: f.displayFromMonth,
    displayToMonth: f.displayToMonth,
    items: f.items.map((item) => ({
      id: item.id,
      itineraryId: item.itineraryId,
      caption: item.caption,
      displayOrder: item.displayOrder,
      title: item.itinerary.title,
      areaName: item.itinerary.primaryArea?.name ?? null,
      nights: item.itinerary.nights,
      isPublished: item.itinerary.status === "published",
    })),
  }));

  return (
    <div>
      <h1 className="text-xl font-black mb-4.5">テーマ・特集</h1>
      <Tabs defaultValue="theme">
        <TabsList>
          <TabsTrigger value="theme">テーマ</TabsTrigger>
          <TabsTrigger value="feature">特集</TabsTrigger>
        </TabsList>
        <TabsContent value="theme">
          <ThemeAdminPanel
            themes={plainThemes}
            tags={tags.map((t) => ({ id: t.id, name: t.name }))}
            purposeTags={purposeTags.map((t) => ({ id: t.id, name: t.name }))}
            existingImages={THEME_IMAGE_CATALOG.map((img) => ({ path: img.path, name: img.name }))}
            minThemeCount={MIN_THEME_COUNT}
          />
        </TabsContent>
        <TabsContent value="feature">
          <FeatureAdminPanel features={plainFeatures} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
