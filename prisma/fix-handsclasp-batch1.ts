/**
 * 法務の指摘(2026-10-13、記録6c583d2)。公開中のしおりの墓所・慰霊碑・慰霊塔の
 * 前で「手を合わせましょう」と求める文を、10/11の決まり(法務#154、墓所で
 * 手を合わせる動作を求めない)に合わせて直す。全6か所。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const fixes: { spotId: string; label: string; old: string; new: string }[] = [
  {
    spotId: "3ae6d2e2-dd80-41df-a309-15337e622713",
    label: "ea3cdd43 会津藩主松平家墓所",
    old: "お墓の前では、静かに、敬意をもって手を合わせましょう。",
    new: "墓所のまわりでは、静かに過ごしましょう。",
  },
  {
    spotId: "d7d4ad4c-dfb6-4eb6-8795-6dba74557403",
    label: "ea3cdd43 飯盛山",
    old: "お墓の前では、静かに、敬意をもって手を合わせましょう。",
    new: "墓所のまわりでは、静かに過ごしましょう。",
  },
  {
    spotId: "592ec25b-a973-4b7e-9f01-877f51d548b5",
    label: "fb532960 平和記念公園",
    old: "慰霊碑や碑の前では、静かに手を合わせましょう。",
    new: "慰霊碑や碑のまわりでは、静かに過ごしましょう。",
  },
  {
    spotId: "e58d2a6b-c6ce-4cf0-8086-d608cabf272c",
    label: "3155fabf 平和記念公園",
    old: "慰霊碑の前では、静かに、敬意をもって手を合わせましょう。",
    new: "慰霊碑のまわりでは、静かに過ごしましょう。",
  },
  {
    spotId: "73a07396-1946-43a5-b4fa-35b62b0c00e2",
    label: "54f0fa20 手柄山平和公園",
    old: "慰霊塔の前では、静かに手を合わせましょう。",
    new: "慰霊塔のまわりでは、静かに過ごしましょう。",
  },
  {
    spotId: "0a33963e-fecf-4814-be96-d95cd8b4f0a3",
    label: "bb5348fc 出雲阿国の墓",
    old: "静かに手を合わせましょう。",
    new: "墓のまわりでは、静かに過ごしましょう。",
  },
];

async function main() {
  const prepared: { spotId: string; label: string; newMemo: string }[] = [];
  for (const f of fixes) {
    const spot = await prisma.spot.findUnique({ where: { id: f.spotId } });
    if (!spot?.memo) throw new Error("見つかりません: " + f.label);
    if (!spot.memo.includes(f.old)) throw new Error("置換対象が見つかりません: " + f.label);
    const newMemo = spot.memo.replace(f.old, f.new);
    prepared.push({ spotId: f.spotId, label: f.label, newMemo });
    console.log("[確認OK]", f.label);
    console.log("  新:", newMemo);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (const p of prepared) {
    await prisma.spot.update({ where: { id: p.spotId }, data: { memo: p.newMemo } });
  }
  console.log("  COMMITTED: 6件");
}
main().finally(() => prisma.$disconnect());
