/**
 * #203 a71cf39b の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit）
 * - 松山城→二之丸史跡庭園は、登城道を歩いて下りる道のりで約15分（20分は長い）。萬翠荘へは約10分（0.4km）
 * - 時刻を詰めて、伊佐爾波神社 16:00〜16:30 に
 * - 伊佐爾波神社「日本三大八幡造りの一つに数えられ」→「一つに数えられるともいわれ」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-203b-a71cf39b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY_ID = "f28cbea4-eb15-4ad0-8474-38dc69fce91f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN: Record<string, [number, number, number | null, [string, string][]]> = {
  松山城: [9, 0, null, []],
  二之丸史跡庭園: [10, 55, 15, [["ロープウェイで下り、城山の南西のふもとへ歩いて約20分。", "帰りは城山の南西の登城道を歩いて下り、ふもとまで約15分。"]]],
  萬翠荘: [11, 40, 10, [["庭園から歩いて約15分。", "庭園から歩いて約10分。"]]],
  大街道: [12, 25, 10, []],
  坂の上の雲ミュージアム: [13, 35, 10, []],
  子規記念博物館: [15, 0, 25, []],
  伊佐爾波神社: [16, 0, 10, [["日本三大八幡造りの一つに数えられ、", "日本三大八幡造りの一つに数えられるともいわれ、"]]],
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, orderBy: { orderNo: "asc" } });
  if (spots.map((s) => s.name).join() !== Object.keys(PLAN).join()) throw new Error("構成が想定と違います");
  const items = spots.map((s) => {
    const [h, m, min, reps] = PLAN[s.name];
    let memo = s.memo ?? "";
    for (const [a, b] of reps) {
      if (!memo.includes(a)) throw new Error(`${s.name}: 本文が想定と違います`);
      memo = memo.replace(a, b);
    }
    console.log(`${h}:${String(m).padStart(2, "0")} +${s.stayDurationMin} ${s.transitMode ?? "-"}/${min ?? "-"} ${s.name}`);
    return { id: s.id, data: { visitTime: t(h, m), transitDurationMin: min, memo } };
  });
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await setDaySpotOrder(DAY_ID, items);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
