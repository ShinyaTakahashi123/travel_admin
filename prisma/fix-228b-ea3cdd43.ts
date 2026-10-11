/**
 * #228 ea3cdd43 の追いの直し（しおりえ(制作補助2)）
 * - 鶴ヶ城→鶴ヶ城会館は約0.3kmなので、歩き15分→10分（会館を11:30から55分に）
 * - さざえ堂: かつて三十三観音参りのお堂だったので（出典 aizukanko spot/138）、静かに見学する一文を足す
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-228b-ea3cdd43.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "ea3cdd43-7a1b-42cd-9f79-74d123ffc6d9";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const spots = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: { in: ["鶴ヶ城会館", "さざえ堂"] } } });
  const kaikan = spots.find((s) => s.name === "鶴ヶ城会館");
  const sazae = spots.find((s) => s.name === "さざえ堂");
  const F1 = "天守から城の北へ歩いて約15分、北出丸の入口へ。";
  const T1 = "天守から城の北へ歩いて約10分、北出丸の入口へ。";
  const F2 = "国の重要文化財に指定されています。";
  const T2 = "国の重要文化財に指定されています。かつては中に三十三観音が祀られ、お参りするためのお堂だったので、静かに見学しましょう。";
  if (!kaikan || !sazae || !(kaikan.memo ?? "").includes(F1) || !(sazae.memo ?? "").includes(F2)) throw new Error("構成が想定と違います");
  const m1 = kaikan.memo!.replace(F1, T1);
  const m2 = sazae.memo!.replace(F2, T2);
  console.log(`鶴ヶ城会館: 11:30 滞在55分 walk10\n${m1}\n\nさざえ堂: ${m2}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: kaikan.id }, data: { visitTime: t(11, 30), stayDurationMin: 55, memo: m1, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] } } }),
    prisma.spot.update({ where: { id: sazae.id }, data: { memo: m2 } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
