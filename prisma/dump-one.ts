import { prisma } from "../src/lib/prisma";

const SPOT_ID = process.argv[2];

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: SPOT_ID } });
  console.log(`=== ${s.name} ===\n${s.memo}`);
}
main();
