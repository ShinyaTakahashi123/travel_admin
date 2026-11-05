/**
 * 0d86de79 の万座毛の点を、2678aee0 と同じ OSM「万座毛」node2004524873(natural=cape・tourism=viewpoint、26.5053825,127.8503534)に
 * そろえる直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断(案A。行き先そのものの名前の点を使う、規則371行)。
 * - 今の点 26.505009,127.850256 は OSM のどの点とも一致しない(いちばん近い「像の鼻」viewpoint から約49m)。2678aee0 は直しなし。
 * - 測り直し(routing.openstreetmap.de routed-car): 万座毛→ブセナ海中公園 1260.4秒で、今の車25は短すぎる(下限 22+5=27)ので車27。
 *   万座毛は1か所目(入る区間なし)。のびた2分は万座毛の滞在を 50→48分にして合わせ、ブセナ海中公園の着き 10:45 から後はそのまま。
 *   メモの分: ブセナ海中公園の書き出し「車で約25分」→「約27分」。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-point-manzamo-0d86de79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const MANZAMO = "9ca5e93c-2fb5-4251-bb58-978e5647758f";
const BUSENA = "df018b69-3561-41e7-a533-77fc955b0432";
const FROM = "万座毛から海沿いを北へ、車で約25分。";
const TO = "万座毛から海沿いを北へ、車で約27分。";
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");

async function main() {
  const m = await prisma.spot.findUnique({ where: { id: MANZAMO }, select: { name: true, lat: true, lng: true, visitTime: true, stayDurationMin: true, day: { select: { itineraryId: true } } } });
  if (!m || m.name !== "万座毛" || !m.day.itineraryId.startsWith("0d86de79")) throw new Error(`万座毛が想定と違います「${m?.name}」`);
  if (String(m.lat) !== "26.505009" || String(m.lng) !== "127.850256" || hm(m.visitTime) !== "09:30" || m.stayDurationMin !== 50) throw new Error(`万座毛の今の値が想定と違います ${m.lat},${m.lng} ${hm(m.visitTime)} ${m.stayDurationMin}`);
  const b = await prisma.spot.findUnique({ where: { id: BUSENA }, select: { name: true, visitTime: true, memo: true, transitLegs: { select: { id: true, transitMode: true, transitDurationMin: true } } } });
  if (!b || b.name !== "ブセナ海中公園" || hm(b.visitTime) !== "10:45") throw new Error(`ブセナ海中公園が想定と違います「${b?.name}」${hm(b?.visitTime ?? null)}`);
  if (b.transitLegs.length !== 1 || b.transitLegs[0].transitMode !== "car" || b.transitLegs[0].transitDurationMin !== 25) throw new Error(`区間が想定と違います ${JSON.stringify(b.transitLegs)}`);
  const memo = b.memo ?? "";
  if (memo.split(FROM).length - 1 !== 1) throw new Error("直す文が1か所ではありません");
  const next = memo.replace(FROM, TO);
  console.log(`■ 0d86de79 万座毛\n  点 ${m.lat},${m.lng} → 26.505383,127.850353／着 09:30 のまま／滞在 50 → 48`);
  console.log(`■ 0d86de79 ブセナ海中公園\n  区間 car25 → car27／着 10:45 のまま(9:30+48+27)\n  文「${FROM}」→「${TO}」\n  直したあとのメモ: ${next}`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: MANZAMO }, data: { lat: "26.505383", lng: "127.850353", stayDurationMin: 48 } });
    await tx.spotTransitLeg.update({ where: { id: b.transitLegs[0].id }, data: { transitDurationMin: 27 } });
    await tx.spot.update({ where: { id: BUSENA }, data: { memo: next } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
