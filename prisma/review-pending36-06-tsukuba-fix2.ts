/**
 * #6の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. つくばエキスポセンターのメモから運営団体名を削除(#4と同じ)
 * 2. つくば駅前（昼食）→つくばエキスポセンターの移動(0.4km)が車10分だったため、
 *   徒歩5分に直し、それ以降の時刻も詰める(エキスポセンター14:25→14:20開始、
 *   JAXA15:35→15:30開始、終わり16:35→16:30)
 * 3. 地図と測量の科学館の「直径約22mの日本列島球体模型」は、gsi.go.jp(公式)で
 *   裏付けが見つからなかったため、大きさの数字を書かない表現に直す
 * 4. JAXAスペースドームの最終入館・見学終わりの時刻は公式でも明記がなかったが、
 *   開館時間(10:00-17:00)に対し、3で5分早まった新しい終わり(16:30)は17:00の
 *   30分前で余裕があることを確認
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const CHIZU_SPOT_ID = "c7f6cf3e-a23b-405b-ba22-6a3f8316e6ee";

async function main() {
  const ekimae = await prisma.spot.findFirst({ where: { name: "つくば駅前（昼食）" } });
  const expo = await prisma.spot.findFirst({ where: { name: "つくばエキスポセンター", dayId: ekimae?.dayId } });
  const jaxa = await prisma.spot.findFirst({ where: { name: "JAXA筑波宇宙センター", dayId: ekimae?.dayId } });
  const chizu = await prisma.spot.findUnique({ where: { id: CHIZU_SPOT_ID } });
  if (!ekimae?.memo || !expo?.memo || !jaxa || !chizu?.memo) throw new Error("想定と違います");

  const expoTransit = await prisma.spotTransitLeg.findFirst({ where: { spotId: expo.id, orderNo: 1 } });
  if (!expoTransit) throw new Error("移動データが見つかりません");

  const newEkimaeMemo = ekimae.memo + "つくばエキスポセンターへは、歩いて行ける距離です。";
  const newExpoMemo = expo.memo.replace(
    "公益財団法人つくば科学万博記念財団が運営する科学館です。",
    "科学館です。"
  );
  const newChizuMemo = chizu.memo.replace(
    "屋外には直径約22mの日本列島球体模型があり、上を歩いて地球の大きさや丸さを実感できます。",
    "屋外には、日本列島を地球の丸みのまま表した大きな模型があり、上を歩いて地球の大きさや丸さを実感できます。"
  );
  if (newExpoMemo === expo.memo || newChizuMemo === chizu.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] つくばエキスポセンターのメモから運営団体名を削除");
  console.log("[確認OK] つくば駅前→つくばエキスポセンターの移動を徒歩5分に直す(以降の時刻も詰める)");
  console.log("[確認OK] 地図と測量の科学館のメモから球体模型の数字を削除");
  console.log("新エキスポメモ:", newExpoMemo);
  console.log("新地図科学館メモ:", newChizuMemo);
  console.log("新しい時刻: エキスポ14:20-15:20、JAXA15:30-16:30");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: ekimae.id }, data: { memo: newEkimaeMemo } });
  await prisma.spotTransitLeg.update({ where: { id: expoTransit.id }, data: { transitMode: "walk", transitDurationMin: 5 } });
  await prisma.spot.update({
    where: { id: expo.id },
    data: { memo: newExpoMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)) },
  });
  await prisma.spot.update({ where: { id: jaxa.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 30)) } });
  await prisma.spot.update({ where: { id: chizu.id }, data: { memo: newChizuMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
