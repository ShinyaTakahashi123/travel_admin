import { prisma } from "@/lib/prisma";
import { PlaceMasterForm } from "@/components/place-master-form";
import { emptyPlaceMasterForm } from "@/lib/place-master-form-value";

export default async function NewPlaceMasterPage() {
  const prefectures = await prisma.area.findMany({
    where: { level: "prefecture" },
    orderBy: { displayOrder: "asc" },
    select: { id: true, name: true },
  });

  return (
    <div>
      <h1 className="text-xl font-black mb-4.5">台帳に追加</h1>
      <PlaceMasterForm initial={emptyPlaceMasterForm()} prefectures={prefectures} />
    </div>
  );
}
