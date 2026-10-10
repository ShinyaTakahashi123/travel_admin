import { prisma } from "../src/lib/prisma";

const ids = [
  "9f057b8f-e033-4f46-ac41-15a830364c4d", // りんくう公園
  "6795bdab-e26e-4901-a07e-13d681d9cf57", // outlet (to be replaced)
  "f4923d36-7887-4cd9-8c0d-eb7db4f6d781", // 二色の浜公園
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(s.name, s.lat, s.lng, "visit=", s.visitTime, "stay=", s.stayDurationMin, "mode=", s.transitMode, "tdur=", s.transitDurationMin);
  }
}
main();
