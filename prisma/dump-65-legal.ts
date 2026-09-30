import { prisma } from "../src/lib/prisma";

const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITIN }, include: { spots: true } });
  for (const d of days) {
    for (const s of d.spots) {
      if (["岩美町立渚交流館", "鳥取県立博物館", "仁風閣", "岩井廃寺塔跡"].includes(s.name) || s.name.includes("白兎")) {
        console.log(`=== ${s.name} ${s.id} ===\n${s.memo}\n`);
      }
    }
  }
}
main();
