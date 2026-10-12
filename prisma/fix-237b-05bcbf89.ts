/**
 * #237 05bcbf89 の続き（しおりえ(制作補助2)）: 花嫁のれん館 → 一本杉通りの移動を、点のあいだが約0.2kmなので徒歩1分から3分に直す（一本杉通り 14:08〜15:00）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-237b-05bcbf89.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const DAY2 = "2194f791-6e0b-45fa-afb9-f1457af52fee";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2, name: "一本杉通り" }, include: { transitLegs: true } });
  const vt = s.visitTime!;
  console.log(`一本杉通り ${s.id} ${vt.getUTCHours()}:${vt.getUTCMinutes()} 滞${s.stayDurationMin} 移動${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+")}`);
  if (vt.getUTCHours() !== 14 || vt.getUTCMinutes() !== 6 || s.stayDurationMin !== 54) throw new Error("想定と違います");
  if (!COMMIT) return console.log("確認モードです。--commit で 14:08・滞在52分・徒歩3分にします。");
  await prisma.spot.update({
    where: { id: s.id },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 8)), stayDurationMin: 52, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] } },
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
