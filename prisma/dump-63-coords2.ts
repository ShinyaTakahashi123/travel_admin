import { prisma } from "../src/lib/prisma";

const ids = [
  "45e6e8d9-23e6-457d-b745-7fa64300464d", // 流刑小屋
  "9f8162f8-fbf7-42f8-ad5e-10e41675b170", // 羽馬家住宅
  "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", // 五箇山和紙の里
];

async function main() {
  for (const id of ids) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id } });
    console.log(s.name, s.lat, s.lng);
  }
}
main();
