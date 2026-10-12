import { prisma } from "../src/lib/prisma";

const ids = [
  "9f057b8f-e033-4f46-ac41-15a830364c4d", // りんくう公園
  "f4923d36-7887-4cd9-8c0d-eb7db4f6d781", // 二色の浜公園
  "aceda76b-85ea-478d-b65e-518e9358de51", // 堺伝統産業会館
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(`=== ${s.name} ===\n${s.memo}\n`);
  }
}
main();
