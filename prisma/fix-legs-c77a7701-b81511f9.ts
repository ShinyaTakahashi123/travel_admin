/**
 * 車の区間が1分短かった2か所の直し(2026-11-04、しおりえ(制作補助2))。企画運営の新しい確認の道具で見つかったもの。
 * - c77a7701 ポートタワー・セリオン→土崎みなと歴史伝承館: OSRM 120.9秒(2.02分) → ceil 3＋5＝8(今 7)
 * - b81511f9 北谷町立博物館→安良波公園・アラハビーチ: OSRM 302.5秒(5.04分) → ceil 6＋5＝11(今 10)
 * 区間を1分延ばし、その行き先の書き出しと前の行き先の結びの「車でおよそN分」を直す。後ろの行き先の時刻を1分ずつ遅らせ、滞在は縮めない。
 * c77a7701 は終わりが 16:31、b81511f9 は 16:33(中村家には 15:48 に着き、最終入場 16:40 より前)
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-legs-c77a7701-b81511f9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date) => d.toISOString().slice(11, 16);

type MemoFix = { from: string; to: string };
type SpotFix = { id: string; name: string; time?: [string, Date]; leg?: { mode: string; from: number; to: number }; memo?: MemoFix[] };
type Plan = { itin: string; fixes: SpotFix[] };

const PLANS: Plan[] = [
  {
    itin: "c77a7701",
    fixes: [
      { id: "70391ca4-81b3-4c45-bfdb-e134e5fdde6a", name: "ポートタワー・セリオンの展望室", memo: [{ from: "この後は、車でおよそ7分、土崎みなと歴史伝承館へ", to: "この後は、車でおよそ8分、土崎みなと歴史伝承館へ" }] },
      {
        id: "81d1d228-e823-4557-9133-2e7638d326dd", name: "土崎みなと歴史伝承館", time: ["13:35", T(13, 36)], leg: { mode: "car", from: 7, to: 8 },
        memo: [{ from: "ポートタワー・セリオンから車でおよそ7分、", to: "ポートタワー・セリオンから車でおよそ8分、" }],
      },
      { id: "9e6c7b8d-777f-43d8-b2d7-9cbfe62663e9", name: "千秋公園", time: ["14:50", T(14, 51)] },
    ],
  },
  {
    itin: "b81511f9",
    fixes: [
      { id: "a092ee80-3290-4c84-b22e-081870087bda", name: "北谷町立博物館", memo: [{ from: "この後は、車でおよそ10分、安良波公園・アラハビーチへ", to: "この後は、車でおよそ11分、安良波公園・アラハビーチへ" }] },
      {
        id: "45573490-d3ad-4870-9212-f4a5ae334b01", name: "安良波公園・アラハビーチ", time: ["10:30", T(10, 31)], leg: { mode: "car", from: 10, to: 11 },
        memo: [{ from: "北谷町立博物館から車でおよそ10分、", to: "北谷町立博物館から車でおよそ11分、" }],
      },
      { id: "891fcc3a-c304-47c5-a668-6f939d3cd71f", name: "北谷公園のあたりで昼食", time: ["11:32", T(11, 33)] },
      { id: "f09075c0-a91f-4699-b215-ecf43989506a", name: "サンセットビーチ", time: ["12:19", T(12, 20)] },
      { id: "d993206a-08c3-4ca6-a9cc-aa467ebdac56", name: "普天満宮", time: ["13:21", T(13, 22)] },
      { id: "e64b6ecc-f2d9-4af2-9a61-d8183eef098a", name: "中城城跡", time: ["14:05", T(14, 6)] },
      { id: "932ef8de-6ec0-454b-bad5-beafd67d4ddc", name: "中村家住宅", time: ["15:47", T(15, 48)] },
    ],
  },
];

async function main() {
  type Op = { id: string; data: { visitTime?: Date; memo?: string }; legId?: string; legTo?: number };
  const ops: Op[] = [];
  for (const plan of PLANS) {
    console.log(`=== ${plan.itin}`);
    for (const f of plan.fixes) {
      const s = await prisma.spot.findUnique({ where: { id: f.id }, select: { name: true, visitTime: true, stayDurationMin: true, memo: true, day: { select: { itineraryId: true } } } });
      if (!s || s.name !== f.name || !s.day.itineraryId.startsWith(plan.itin)) throw new Error(`スポットが想定と違います: ${f.id} 想定「${f.name}」 実際「${s?.name}」`);
      const op: Op = { id: f.id, data: {} };
      let line = `■ ${f.name}（滞在 ${s.stayDurationMin} はそのまま）`;
      if (f.time) {
        const cur = s.visitTime ? hm(s.visitTime) : "--:--";
        if (cur !== f.time[0]) throw new Error(`${f.name} の時刻が想定と違います: ${cur}`);
        op.data.visitTime = f.time[1];
        line += `\n  着 ${cur} → ${hm(f.time[1])}`;
      }
      if (f.leg) {
        const legs = await prisma.spotTransitLeg.findMany({ where: { spotId: f.id }, select: { id: true, orderNo: true, transitMode: true, transitDurationMin: true } });
        if (legs.length !== 1 || legs[0].transitMode !== f.leg.mode || legs[0].transitDurationMin !== f.leg.from) throw new Error(`${f.name} の区間が想定と違います: ${JSON.stringify(legs)}`);
        op.legId = legs[0].id;
        op.legTo = f.leg.to;
        line += `\n  区間 ${f.leg.mode}${f.leg.from} → ${f.leg.mode}${f.leg.to}`;
      }
      if (f.memo) {
        let memo = s.memo ?? "";
        for (const m of f.memo) {
          if (memo.split(m.from).length !== 2) throw new Error(`${f.name} のメモに「${m.from}」がちょうど1回ありません`);
          memo = memo.replace(m.from, m.to);
          line += `\n  メモ「${m.from}」→「${m.to}」`;
        }
        op.data.memo = memo;
        line += `\n  直したあとのメモ: ${memo}`;
      }
      console.log(line);
      ops.push(op);
    }
  }
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      for (const op of ops) {
        if (Object.keys(op.data).length) await tx.spot.update({ where: { id: op.id }, data: op.data });
        if (op.legId) await tx.spotTransitLeg.update({ where: { id: op.legId }, data: { transitDurationMin: op.legTo } });
      }
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
