/**
 * #112 f507e490 の追加の直し（しおりえ(制作補助2)、法務 10/30 17:23。文だけ、時刻は変えない）
 * 1. 旧司祭館の書き出しに「旧開智学校から歩いて約5分。」（移動5分）
 * 2. 碌山美術館の書き出しに行き方と分数（移動65分）。routed-foot: 旧司祭館→松本駅 1,655m・22.1分、穂高駅→碌山美術館 567m・7.6分。
 *    移動の欄（transitLine）の「徒歩約25分」「徒歩約7分」も、測った値の「約23分」「約8分」にそろえる
 * 3. 穂高駅前（昼食）の「碌山美術館から歩いて約7分」→ 移動10分にそろえて「約10分」
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-112b-f507e490.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const SHISAI = "ac1ceea6-9465-4ca4-b37d-5324ed1bddfe";
const ROKUZAN = "8a7456e3-179d-4bca-a087-ed5edc3fff3d";
const EKIMAE = "614bb173-fb98-487a-b789-d96588d16227";
const COMMIT = process.argv.includes("--commit");
const LINE_FROM = "JR大糸線（松本→穂高、約30分。旧司祭館から松本駅へ徒歩約25分、穂高駅から徒歩約7分）";
const LINE_TO = "JR大糸線（松本→穂高、約30分。旧司祭館から松本駅へ徒歩約23分、穂高駅から徒歩約8分）";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [SHISAI]: [{ from: "旧開智学校のとなりにある西洋館です。", to: "旧開智学校から歩いて約5分、すぐとなりにある西洋館です。" }],
  [ROKUZAN]: [
    {
      from: "安曇野出身の彫刻家・荻原守衛（碌山）の作品を伝える美術館です。",
      to: "旧司祭館から歩いて約23分で松本駅へ戻り、JR大糸線の電車で穂高駅へ。駅から歩いて約8分（あわせて約65分）。安曇野出身の彫刻家・荻原守衛（碌山）の作品を伝える美術館です。",
    },
  ],
  [EKIMAE]: [{ from: "碌山美術館から歩いて約7分、", to: "碌山美術館から歩いて約10分、" }],
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: Object.keys(MEMO_EDITS) } }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } });
  const by = (id: string) => spots.find((s) => s.id === id)!;
  const legs = by(ROKUZAN).transitLegs;
  if (legs.length !== 1 || legs[0].transitLine !== LINE_FROM || legs[0].transitDurationMin !== 65) throw new Error(`碌山美術館: 移動の欄が想定と違います（${JSON.stringify(legs)}）`);
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = by(id);
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m;
    console.log(`■ ${s.name}\n${m}`);
  }
  console.log(`移動の欄: ${LINE_FROM}\n  → ${LINE_TO}（65分は同じ）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [id, m] of Object.entries(memos)) await tx.spot.update({ where: { id }, data: { memo: m } });
    await tx.spotTransitLeg.update({ where: { id: legs[0].id }, data: { transitLine: LINE_TO } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
