import { notFound } from "next/navigation";
import { prisma } from "@/lib/prisma";
import { PlaceMasterForm } from "@/components/place-master-form";

export default async function EditPlaceMasterPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;

  const [place, prefectures] = await Promise.all([
    prisma.placeMaster.findUnique({ where: { id }, include: { aliases: true } }),
    prisma.area.findMany({ where: { level: "prefecture" }, orderBy: { displayOrder: "asc" }, select: { id: true, name: true } }),
  ]);
  if (!place) notFound();

  return (
    <div>
      <h1 className="text-xl font-black mb-4.5">台帳を編集: {place.name}</h1>
      <PlaceMasterForm
        initial={{
          id: place.id,
          name: place.name,
          reading: place.reading ?? "",
          address: place.address ?? "",
          lat: place.lat != null ? String(place.lat) : "",
          lng: place.lng != null ? String(place.lng) : "",
          prefectureAreaId: place.prefectureAreaId ?? "",
          category: place.category ?? "",
          isWideArea: place.isWideArea,
          isMemorial: place.isMemorial,
          stayDurationMin: place.stayDurationMin != null ? String(place.stayDurationMin) : "",
          websiteUrl: place.websiteUrl ?? "",
          photoUrl: place.photoUrl ?? "",
          photoAuthor: place.photoAuthor ?? "",
          photoLicense: place.photoLicense ?? "",
          photoLicenseUrl: place.photoLicenseUrl ?? "",
          photoSourceUrl: place.photoSourceUrl ?? "",
          positionSource: place.positionSource ?? "",
          aliases: place.aliases.map((a) => a.alias),
        }}
        prefectures={prefectures}
      />
    </div>
  );
}
