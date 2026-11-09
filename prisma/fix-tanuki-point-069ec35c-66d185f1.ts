/**
 * 069ec35c・66d185f1 の田貫湖の点を、aea12c13 と同じ北岸の眺めの点 node12599162701(tourism=viewpoint、35.3457664,138.5585977)に
 * そろえる直し(2026-11-05、しおりえ(制作補助2))。企画運営の依頼(同じ場所は同じ点)。
 * - 区間は測り直し(routing.openstreetmap.de routed-car)、どれも規則383行の範囲の中なので、区間の分と時刻は変えない:
 *   069ec35c 音止の滝→田貫湖 594.4秒(車15〜20)に今の車20、田貫湖→道の駅 朝霧高原 672.6秒(車17〜22)に今の車20。
 *   66d185f1 道の駅朝霧高原→田貫湖 666.5秒(車17〜22)に今の車18、田貫湖→人穴富士講遺跡 567.3秒(車15〜20)に今の車16。
 * - メモの分と出発地の直し(測り直しで見つけたずれ):
 *   069ec35c 田貫湖の書き出し「白糸ノ滝から車で約20分」→「音止の滝から車で約20分」(1つ前の行き先は音止の滝)。
 *   66d185f1 田貫湖の結び「車でおよそ26分、人穴富士講遺跡へ」→「車でおよそ16分、」(区間は車16。人穴の書き出しも16分)。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-tanuki-point-069ec35c-66d185f1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const LAT = "35.345766";
const LNG = "138.558598";

type Fix = { itin: string; spotId: string; name: string; oldLat: string; oldLng: string; from: string; to: string };
const FIXES: Fix[] = [
  {
    itin: "069ec35c", spotId: "681c2c6f-b324-400f-8b7c-6189b7274b95", name: "田貫湖", oldLat: "35.344103", oldLng: "138.561279",
    from: "白糸ノ滝から車で約20分、", to: "音止の滝から車で約20分、",
  },
  {
    itin: "66d185f1", spotId: "f2f15e6d-f5ca-4dec-a5b9-1bc017bc4459", name: "田貫湖", oldLat: "35.341225", oldLng: "138.559327",
    from: "この後は、車でおよそ26分、人穴富士講遺跡へ向かいましょう。", to: "この後は、車でおよそ16分、人穴富士講遺跡へ向かいましょう。",
  },
];

const count = (s: string, sub: string) => s.split(sub).length - 1;

async function main() {
  const plans: { f: Fix; memo: string }[] = [];
  for (const f of FIXES) {
    const s = await prisma.spot.findUnique({ where: { id: f.spotId }, select: { name: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } } } });
    if (!s || s.name !== f.name || !s.day.itineraryId.startsWith(f.itin)) throw new Error(`${f.itin}: スポットが想定と違います「${s?.name}」`);
    if (String(s.lat) !== f.oldLat || String(s.lng) !== f.oldLng) throw new Error(`${f.itin}: 今の点が想定と違います ${s.lat},${s.lng}`);
    const memo = s.memo ?? "";
    if (count(memo, f.from) !== 1) throw new Error(`${f.itin}: 直す文が1か所ではありません(${count(memo, f.from)})`);
    const next = memo.replace(f.from, f.to);
    plans.push({ f, memo: next });
    console.log(`■ ${f.itin} ${f.name}\n  点 ${f.oldLat},${f.oldLng} → ${LAT},${LNG}\n  文「${f.from}」→「${f.to}」\n  直したあとのメモ: ${next}`);
  }
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const { f, memo } of plans) await tx.spot.update({ where: { id: f.spotId }, data: { lat: LAT, lng: LNG, memo } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
