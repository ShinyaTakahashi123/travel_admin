/**
 * #206 acb93a0f の追いの直し（しおりえ(制作補助2)、2026-10-01 自分の確かめ: itinerary-audit）
 * - 白浜から姫観音までは遊歩道を約0.9km歩くので、5分→15分に。御座石神社へは白浜まで歩いて戻る分を足して35分に。以降の時刻をずらす（終わり 16:45）
 * - 遊覧船「水深は423.4mと日本一の深さです」→「日本一の深さとされます」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-206b-acb93a0f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY_ID = "cb412991-fdf1-43da-b3e7-c568905e3424";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const PLAN: Record<string, [number, number, number | null, [string, string][]]> = {
  田沢湖遊覧船: [9, 0, null, [["水深は423.4mと日本一の深さです。", "水深は423.4mで、日本一の深さとされます。"]]],
  白浜と姫観音: [10, 10, 15, [["船を降りたら、湖岸の遊歩道を歩きます。", "船を降りたら、湖岸の遊歩道を北へ約15分歩きます。"]]],
  御座石神社: [11, 15, 35, [["白浜に戻って車に乗り、湖を時計回りに約20分、北岸の御座石へ。", "遊歩道を白浜まで歩いて戻り、車で湖を時計回りに約20分、北岸の御座石へ（あわせて約35分）。"]]],
  むらっこ物産館: [12, 10, 20, []],
  たつこ像: [13, 15, 5, []],
  "漢槎宮（浮木神社）": [13, 50, 5, []],
  思い出の潟分校: [14, 25, 15, []],
  県民の森: [15, 15, 20, []],
  姫塚公園: [16, 15, 20, []],
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
