import { prisma } from "../src/lib/prisma";
async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: "5e60c093-a2fe-4dde-818f-b53916e5e8b5" } });
  console.log("lat", spot.lat, "lng", spot.lng, "memo starts with:", spot.memo?.slice(0, 40));
}
main().finally(() => prisma.$disconnect());
