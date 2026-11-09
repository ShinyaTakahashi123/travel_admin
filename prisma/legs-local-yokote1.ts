/**
 * seed-local-yokote1.ts で登録した横手の日帰りプランの、2つの移動を区間に分ける（しおりえ(制作補助2)）。
 * handmade-gen は移動を1区間しか持てないため、登録のあとにこのスクリプトで分ける。
 *   旧石田理吉家: バス50分 → 歩18（石坂洋次郎文学記念館→横手市役所本庁舎前）＋バス31（羽後交通 横手・小安線）＋歩1（増田蔵の駅→旧石田理吉家）
 *   かまくら館:   バス50分 → 歩1（蔵の駅→増田蔵の駅）＋待ち11（15:24 発のバス）＋バス29（羽後交通 横手・小安線）＋歩9（横手駅東口→かまくら館）
 * あわせて、季節を春・夏・秋・冬の4つにする（handmade-gen は季節を付けられないため。企画運営 11/02）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/legs-local-yokote1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "内蔵の町・増田とまんが美術館、かまくら館をめぐる横手の日帰りプラン";
const COMMIT = process.argv.includes("--commit");
const LINE = "横手・小安線";
const PLAN: { spot: string; fromMin: number; legs: { mode: string; min: number; line?: string }[] }[] = [
  { spot: "旧石田理吉家", fromMin: 50, legs: [{ mode: "walk", min: 18 }, { mode: "bus", min: 31, line: LINE }, { mode: "walk", min: 1 }] },
  { spot: "かまくら館", fromMin: 50, legs: [{ mode: "walk", min: 1 }, { mode: "other", min: 11, line: "バスの待ち" }, { mode: "bus", min: 29, line: LINE }, { mode: "walk", min: 9 }] },
];

async function main() {
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE, status: "pending" }, select: { id: true, seasons: true } });
  console.log(`しおり ${it.id}`);
  const SEASONS = ["spring", "summer", "autumn", "winter"];
  console.log(`■ 季節: [${it.seasons.join(",")}] → [${SEASONS.join(",")}]`);
  const ops = [];
  for (const p of PLAN) {
    const s = await prisma.spot.findFirstOrThrow({ where: { name: p.spot, day: { itineraryId: it.id } }, include: { transitLegs: true } });
    if (s.transitLegs.length !== 1 || s.transitLegs[0].transitDurationMin !== p.fromMin) throw new Error(`${p.spot}: いまの移動が想定と違います（${JSON.stringify(s.transitLegs)}）`);
    const sum = p.legs.reduce((a, l) => a + l.min, 0);
    if (sum !== p.fromMin) throw new Error(`${p.spot}: 区間の合計 ${sum} が ${p.fromMin} と違います`);
    console.log(`■ ${p.spot}: ${s.transitLegs[0].transitMode}${p.fromMin} → ${p.legs.map((l) => `${l.mode}${l.min}${l.line ? `(${l.line})` : ""}`).join(" + ")}`);
    ops.push(prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } }));
    ops.push(prisma.spotTransitLeg.createMany({
      data: p.legs.map((l, i) => ({ spotId: s.id, orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null })),
    }));
  }
  ops.push(prisma.itinerary.update({ where: { id: it.id }, data: { seasons: SEASONS } }));
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ops);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
