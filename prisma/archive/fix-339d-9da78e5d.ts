import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "../prisma/lib/spot-lookup";
const ITIN_ID = "9da78e5d-1fdd-415d-bd06-46c13d62d732";
async function main() {
  const s = await prisma.spot.findFirstOrThrow({ where: { name: "由布院ステンドグラス美術館", day: { itineraryId: ITIN_ID } } });
  const old = "由布院ステンドグラス美術館は、日本で初めての本格的なステンドグラス専門美術館です。";
  const next = "由布院ステンドグラス美術館は、日本で初めての本格的なステンドグラス専門美術館とされています。";
  if (!s.memo?.includes(old)) { console.log("already fixed"); return; }
  await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { memo: s.memo.replace(old, next) });
  console.log("hedge added");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
