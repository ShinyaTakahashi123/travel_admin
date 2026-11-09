/**
 * 嵐山・嵯峨野の点のそろえ(2026-11-04)。企画運営・法務のOKに基づく。
 * 7642cfc7・94c6f1d5で決めた点に、ほかの3本(0582b3c4・96496141・071e87fd)をそろえる。
 * - 大河内山荘庭園→入場券売場node6875192885(35.016542,135.670234)
 * - 嵐山公園→バス停「嵐山公園」node1740834849(35.011834,135.677526、7章の例外)
 *
 * 点を動かした前後、計10区間をOSRM routed-footで測り直した結果(法務の実測、カッコ内は今の値):
 *   0582b3c4: 嵐電嵐山駅→嵐山公園 5.4分(6) / 御髪神社→大河内 2.0分(2) / 大河内→直指庵 35.9分(36) … いずれも今の値で足りている
 *   96496141: 大河内→福田美術館 12.0分(12) / 清凉寺→嵐山公園 18.6分(19) / 嵐山公園→モンキーパーク 1.9分(3) … 足りている
 *            トロッコ嵐山駅→大河内 2.2分(2) … 【短すぎるので直す】2→3分
 *   071e87fd: 竹林の道→大河内 1.4分(3) / 大河内→御髪神社 2.0分(4) / 嵐山公園→嵐電嵐山駅 5.4分(6) … 足りている
 *
 * 96496141のトロッコ嵐山駅→大河内山荘庭園だけ2→3分に直し、1分延びた分を大河内・福田美術館の
 * 着く時刻に反映する(どちらも上限内、滞在はのばさない)。この日は1日目(泊まりの初日)で
 * 1泊2日の最終日ではないため、終わりが1分遅くなっても決まりに反しない(16:37→16:38、16:30〜17:00の中)。
 * 0582b3c4・071e87fdは点のみの直しで、時刻・移動の分は変更しない。
 *
 * 【組み直しの候補・今回は扱わない】0582b3c4の大河内→直指庵の歩き36分(35.9分)は30分を超える
 * 徒歩区間。乗り物にするかどうかは、組み直しのときに検討する(一覧に記録)。
 *
 * 確認モードは、書き込むデータ(UPDATES)をスポットごとにそのまま出す形。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OOKOCHI_LAT = "35.016542";
const OOKOCHI_LNG = "135.670234";
const KOEN_LAT = "35.011834";
const KOEN_LNG = "135.677526";

const MEASUREMENTS = [
  { itin: "0582b3c4", leg: "嵐電嵐山駅→嵐山公園", measured: "5.4分", current: "6分", action: "変更なし" },
  { itin: "0582b3c4", leg: "御髪神社→大河内山荘庭園", measured: "2.0分", current: "2分", action: "変更なし" },
  { itin: "0582b3c4", leg: "大河内山荘庭園→直指庵", measured: "35.9分", current: "36分", action: "変更なし(30分超の候補として一覧に記録)" },
  { itin: "96496141", leg: "トロッコ嵐山駅→大河内山荘庭園", measured: "2.2分", current: "2分", action: "2→3分に直す" },
  { itin: "96496141", leg: "大河内山荘庭園→福田美術館", measured: "12.0分", current: "12分", action: "変更なし" },
  { itin: "96496141", leg: "清凉寺→嵐山公園", measured: "18.6分", current: "19分", action: "変更なし" },
  { itin: "96496141", leg: "嵐山公園→モンキーパーク", measured: "1.9分", current: "3分", action: "変更なし" },
  { itin: "071e87fd", leg: "竹林の道→大河内山荘庭園", measured: "1.4分", current: "3分", action: "変更なし" },
  { itin: "071e87fd", leg: "大河内山荘庭園→御髪神社", measured: "2.0分", current: "4分", action: "変更なし" },
  { itin: "071e87fd", leg: "嵐山公園→嵐電嵐山駅", measured: "5.4分", current: "6分", action: "変更なし" },
];

const POINT_ONLY: { id: string; label: string; before: { lat: string; lng: string }; after: { lat: string; lng: string } }[] = [
  {
    id: "83ac2d04-0945-4b57-a0d3-bd1c06b2949b",
    label: "0582b3c4 大河内山荘庭園",
    before: { lat: "35.016521", lng: "135.670248" },
    after: { lat: OOKOCHI_LAT, lng: OOKOCHI_LNG },
  },
  {
    id: "0c474033-e873-4ca2-8614-89c0566eeca4",
    label: "0582b3c4 嵐山公園",
    before: { lat: "35.011989", lng: "135.678226" },
    after: { lat: KOEN_LAT, lng: KOEN_LNG },
  },
  {
    id: "781892cd-dde1-42fa-9350-bf525ed3dee2",
    label: "96496141 嵐山公園",
    before: { lat: "35.011989", lng: "135.678226" },
    after: { lat: KOEN_LAT, lng: KOEN_LNG },
  },
  {
    id: "6ca1b985-250c-43c2-9a0a-6d0313db451d",
    label: "071e87fd 大河内山荘庭園",
    before: { lat: "35.016633", lng: "135.669586" },
    after: { lat: OOKOCHI_LAT, lng: OOKOCHI_LNG },
  },
  {
    id: "5d5195e5-abd5-476f-9af1-c6763dc3d3cb",
    label: "071e87fd 嵐山公園",
    before: { lat: "35.011989", lng: "135.678226" },
    after: { lat: KOEN_LAT, lng: KOEN_LNG },
  },
];

// 96496141: 点をそろえ + 移動2→3 + 着く時刻+1分(大河内・福田美術館)
const OOKOCHI_96496141_ID = "489b0d79-33ca-4ed0-8976-388f4d71b03e";
const FUKUDA_96496141_ID = "2a245abc-1ca3-46df-802b-e86b421766a3";
const OOKOCHI_96496141_MEMO_OLD =
  "トロッコ嵐山駅から歩いて約2分。昭和の映画スター・大河内傳次郎が私財を投じて築いた庭園です。1931年、34歳のときに造営を始め、亡くなる1962年まで約30年をかけて、庭師とともに一木一草にまで手を入れ続けたと伝えられています。園内の大乗閣は書院造・数寄屋造などを融合させた建物で、茶室「滴水庵」とともに国の登録有形文化財に指定されています。小倉山の南斜面から見渡す嵐山や京都市街の眺めは、俳優が惚れ込んだというのも納得の絶景です。";
const OOKOCHI_96496141_MEMO_NEW =
  "トロッコ嵐山駅から歩いて約3分。昭和の映画スター・大河内傳次郎が私財を投じて築いた庭園です。1931年、34歳のときに造営を始め、亡くなる1962年まで約30年をかけて、庭師とともに一木一草にまで手を入れ続けたと伝えられています。園内の大乗閣は書院造・数寄屋造などを融合させた建物で、茶室「滴水庵」とともに国の登録有形文化財に指定されています。小倉山の南斜面から見渡す嵐山や京都市街の眺めは、俳優が惚れ込んだというのも納得の絶景です。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const u of POINT_ONLY) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: u.id } });
    if (s.lat?.toString() !== u.before.lat || s.lng?.toString() !== u.before.lng) {
      throw new Error(`前提確認: ${u.label} の点が期待と不一致 (now ${s.lat},${s.lng})`);
    }
  }
  const ookochi96 = await prisma.spot.findUniqueOrThrow({ where: { id: OOKOCHI_96496141_ID }, include: { transitLegs: true } });
  if (ookochi96.lat?.toString() !== "35.016521" || ookochi96.lng?.toString() !== "135.670248") {
    throw new Error("前提確認: 96496141 大河内山荘庭園 の点が期待と不一致");
  }
  const ookochiVt = ookochi96.visitTime!.toISOString().slice(11, 16);
  if (ookochiVt !== "14:59") throw new Error(`前提確認: 96496141 大河内山荘庭園 のvisitTimeが期待と不一致 (now ${ookochiVt})`);
  const ookochiLeg = ookochi96.transitLegs[0];
  if (!ookochiLeg || ookochiLeg.transitDurationMin !== 2) throw new Error("前提確認: 96496141 大河内山荘庭園 の入りの移動分が期待と不一致");
  if (ookochi96.memo !== OOKOCHI_96496141_MEMO_OLD) throw new Error("前提確認: 96496141 大河内山荘庭園 のメモが期待と不一致");
  const fukuda = await prisma.spot.findUniqueOrThrow({ where: { id: FUKUDA_96496141_ID } });
  const fukudaVt = fukuda.visitTime!.toISOString().slice(11, 16);
  if (fukudaVt !== "15:52") throw new Error(`前提確認: 96496141 福田美術館 のvisitTimeが期待と不一致 (now ${fukudaVt})`);
  console.log("前提の確認OK。\n");

  console.log("=== 測り直した結果(法務の実測) ===");
  for (const m of MEASUREMENTS) {
    console.log(`  [${m.itin}] ${m.leg}: 実測${m.measured}(今${m.current}) → ${m.action}`);
  }

  console.log("\n=== 書き込むデータ(スポットごと) ===");
  for (const u of POINT_ONLY) {
    console.log(`  [${u.id}] ${u.label}: 点=${u.after.lat},${u.after.lng}(もとは${u.before.lat},${u.before.lng})`);
  }
  console.log(`  [${OOKOCHI_96496141_ID}] 96496141 大河内山荘庭園: 点=${OOKOCHI_LAT},${OOKOCHI_LNG} 着=15:00(14:59→) 区間=walk3(2→3) メモ=更新(書き出し「約2分」→「約3分」)`);
  console.log(`  [${FUKUDA_96496141_ID}] 96496141 福田美術館: 着=15:53(15:52→、滞在45は変更なし)`);
  console.log("\n  96496141の1日目(泊まりの初日)は、11:30始まり→福田美術館発16:38(16:30〜17:00に収まる、1分遅くなるのみ)\n");

  if (!commit) {
    console.log("確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const u of POINT_ONLY) {
      await tx.spot.update({ where: { id: u.id }, data: { lat: u.after.lat, lng: u.after.lng } });
    }
    await tx.spot.update({
      where: { id: OOKOCHI_96496141_ID },
      data: {
        lat: OOKOCHI_LAT,
        lng: OOKOCHI_LNG,
        visitTime: T(15, 0),
        memo: OOKOCHI_96496141_MEMO_NEW,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    });
    await tx.spot.update({ where: { id: FUKUDA_96496141_ID }, data: { visitTime: T(15, 53) } });
  });

  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
