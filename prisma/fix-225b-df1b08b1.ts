/**
 * #225 df1b08b1 の移動の分数の直し（しおりえ(制作補助2)）
 * 大間港→弁慶のはさみ岩、道遊の割戸→佐渡奉行所跡はどちらも約0.7kmなので、車の移動を約10分→約5分にする（あとの時刻は変えず、滞在を5分のばす）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-225b-df1b08b1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "df1b08b1-02e9-4397-a71e-46c51bebbf88";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const EDITS = [
  { name: "弁慶のはさみ岩", h: 14, m: 35, stay: 25, from: "大間港から車で約10分、", to: "大間港から車で約5分、" },
  { name: "佐渡奉行所跡", h: 15, m: 50, stay: 50, from: "割戸から車で約10分、", to: "割戸から車で約5分、" },
];

async function main() {
  const ops = [];
  for (const e of EDITS) {
    const spots = await prisma.spot.findMany({ where: { name: e.name, day: { itineraryId: ITINERARY_ID } } });
    if (spots.length !== 1 || !(spots[0].memo ?? "").includes(e.from)) throw new Error(`${e.name}: 構成が想定と違います`);
    const memo = spots[0].memo!.replace(e.from, e.to);
    console.log(`${e.name}: ${e.h}:${String(e.m).padStart(2, "0")} 滞在${e.stay}分 car5\n${memo}\n`);
    ops.push(prisma.spot.update({ where: { id: spots[0].id }, data: { visitTime: t(e.h, e.m), stayDurationMin: e.stay, memo, transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5, transitLine: null }] } } }));
  }
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ops);
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
