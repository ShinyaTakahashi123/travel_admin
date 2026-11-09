/**
 * 初日・最終日の見直し #177 3bb9508b の続き（しおりえ(制作補助2)）
 * fld-177b で石手寺の点を仁王門にしたので、子規記念博物館→石手寺は foot 1,075m・14分。もとの20分のままは長すぎるので14分に（メモも）。
 * 空く6分は、放生園の滞在を 59→63分に戻して使う（法務 10/30）。2日目: 放生園 11:55〜12:58 → 湯築城跡 13:07〜14:02 → 子規記念博物館 14:07〜15:17 → 石手寺 15:31〜16:31
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-177c-3bb9508b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const HOJOEN = "ef83bc44-b254-4874-b4c7-7db5a4dd4dbe";
const YUZUKI = "754365a3-8e17-4fc5-a93a-c71acd7eaa06";
const SHIKIHAKU = "0184358b-4e20-4652-8eb4-7248932993cc";
const ISHITEJI = "c780d153-214f-4095-abf2-1f86b157faa2";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}` : "-");

// [id, いまの時刻(時,分), いまの滞在, 直した時刻(時,分), 直した滞在]
const PLAN: [string, number, number, number, number, number, number][] = [
  [HOJOEN, 11, 55, 59, 11, 55, 63],
  [YUZUKI, 13, 3, 55, 13, 7, 55],
  [SHIKIHAKU, 14, 3, 70, 14, 7, 70],
  [ISHITEJI, 15, 33, 60, 15, 31, 60],
];
const MEMO_FROM = "子規記念博物館から歩いて約20分。";
const MEMO_TO = "子規記念博物館から歩いて約14分。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: PLAN.map((p) => p[0]) } }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } });
  for (const [id, h, m, stay, nh, nm, nstay] of PLAN) {
    const s = spots.find((x) => x.id === id)!;
    if (hm(s.visitTime) !== hm(t(h, m)) || s.stayDurationMin !== stay) throw new Error(`${s.name}: いまの時刻が想定と違います（${hm(s.visitTime)} ${s.stayDurationMin}）`);
    console.log(`${s.name}: ${hm(s.visitTime)} 滞在${stay} → ${hm(t(nh, nm))} 滞在${nstay}`);
  }
  const ishi = spots.find((x) => x.id === ISHITEJI)!;
  if (ishi.transitLegs.length !== 1 || ishi.transitLegs[0].transitDurationMin !== 20) throw new Error("石手寺の移動が想定と違います");
  if ((ishi.memo ?? "").split(MEMO_FROM).length !== 2) throw new Error("石手寺のメモの置き換え元が見つかりません");
  console.log(`石手寺の歩き 20 → 14、メモ「${MEMO_FROM}」→「${MEMO_TO}」`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const [id, , , , nh, nm, nstay] of PLAN) await tx.spot.update({ where: { id }, data: { visitTime: t(nh, nm), stayDurationMin: nstay } });
    await tx.spotTransitLeg.update({ where: { id: ishi.transitLegs[0].id }, data: { transitDurationMin: 14 } });
    await tx.spot.update({ where: { id: ISHITEJI }, data: { memo: ishi.memo!.replace(MEMO_FROM, MEMO_TO) } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
