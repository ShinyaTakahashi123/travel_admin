/**
 * #28の直し(企画運営の指摘、2026-10-13)。御建神社→東広島市立美術館の
 * 0.6kmが「歩き5分」(速すぎ)になっていたため9分に直し、以降の時刻を4分ずつ
 * 後ろにずらす(終わりは16:30→16:34、16:30〜17:00の範囲内)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const DAY_ID = "8f9cdfb6-481b-4419-8bd9-3a6b433970db";

const SHIFT_MIN = 4;
const NAMES_IN_ORDER = ["東広島市立美術館", "白牡丹酒造", "賀茂鶴酒造", "西条駅周辺（昼食）", "福美人酒造", "賀茂泉酒造「酒泉館」", "安芸国分寺歴史公園"];

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY_ID }, include: { transitLegs: true } });
  const museum = spots.find((s) => s.name === "東広島市立美術館");
  const museumLeg = museum?.transitLegs[0];
  if (!museum || !museumLeg || museumLeg.transitDurationMin !== 5) throw new Error("想定と違います");

  console.log("[確認OK] 御建神社→美術館の移動を5分→9分に直す");
  for (const name of NAMES_IN_ORDER) {
    const s = spots.find((x) => x.name === name);
    if (!s?.visitTime) throw new Error("見つかりません: " + name);
    const newTime = new Date(s.visitTime.getTime() + SHIFT_MIN * 60000);
    console.log(`  ${name}: ${s.visitTime.toISOString().slice(11, 16)} → ${newTime.toISOString().slice(11, 16)}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spotTransitLeg.update({ where: { id: museumLeg.id }, data: { transitDurationMin: 9 } });
  for (const name of NAMES_IN_ORDER) {
    const s = spots.find((x) => x.name === name)!;
    await prisma.spot.update({ where: { id: s.id }, data: { visitTime: new Date(s.visitTime!.getTime() + SHIFT_MIN * 60000) } });
  }

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
