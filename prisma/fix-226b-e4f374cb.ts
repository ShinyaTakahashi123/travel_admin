/**
 * #226 e4f374cb の移動の直し（しおりえ(制作補助2)）
 * 大歩危峡まんなか→道の駅大歩危は約0.3kmなので、車15分→歩いて約5分にする（まんなかの滞在を95分、道の駅を13:10から60分にし、あとの時刻は変えない）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-226b-e4f374cb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "e4f374cb-4d71-42af-8aff-c698e55962e2";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const FROM = "大歩危峡まんなかから車で約15分。";
const TO = "大歩危峡まんなかから歩いて約5分。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: { in: ["大歩危峡まんなか", "道の駅大歩危 妖怪屋敷と石の博物館"] } } });
  const man = spots.find((s) => s.name === "大歩危峡まんなか");
  const eki = spots.find((s) => s.name === "道の駅大歩危 妖怪屋敷と石の博物館");
  if (!man || !eki || !(eki.memo ?? "").includes(FROM)) throw new Error("構成が想定と違います");
  const memo = eki.memo!.replace(FROM, TO);
  console.log(`まんなか: 11:30 滞在95分\n道の駅: 13:10 滞在60分 walk5\n${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: man.id }, data: { stayDurationMin: 95 } }),
    prisma.spot.update({ where: { id: eki.id }, data: { visitTime: t(13, 10), stayDurationMin: 60, memo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] } } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
