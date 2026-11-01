/**
 * 日帰りの座標の直し（A・B）: 007e9387（犬鳴山と淡輪ビーチ・日帰り）（しおりえ(制作補助2)、企画運営 11/02 の判断 (a)）
 * docs/content/20261102-daytrip-coord-scan.md の A 1・2
 * - 犬鳴山: 34.3789,135.3939（丸めた値。七宝瀧寺から北へ約4.5km）→ OSM「犬鳴山 七宝瀧寺」node2046192677 amenity=place_of_worship 34.3385234,135.3875613
 *   メモは七宝瀧寺の話。七宝瀧寺→湯元温泉荘・山乃湯は routed-foot 789m 10.5分（寺の前まで車は入れない）→ 車10を歩11に
 *   山乃湯 10:30→10:31、滞在 60→59（淡輪ときめきビーチ 11:58 はそのまま）
 * - 淡輪遊園 135.1791: OSM way388338272 の値 34.3350333,135.1790998 を6けたにすると 135.179100。正しい値なので直さない
 * - 会社の名前「南海ウイングバス」→「路線バス」（企画運営 11/02。消すだけ）
 * - 旅の足（バスで来て車で動く）・出典の要る文は、一覧の「組み直しが要るしおり」に残す（今回は直さない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-007e9387.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const INUNAKI = "bdd21618-4d99-471d-9bbd-fafe9b3d1ef3";
const YAMANOYU = "a4c2edc0-c73f-474e-aa64-8ff177112033";
const hm = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const fmt = (d: Date | null) => (d ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}` : "--:--");

const EDITS: Record<string, { from: string; to: string }[]> = {
  [INUNAKI]: [
    { from: "南海本線の泉佐野駅から南海ウイングバスに揺られること約25分、", to: "南海本線の泉佐野駅から路線バスに揺られること約25分、" },
    { from: "山の澄んだ空気を胸いっぱいに味わったら、次は湯元温泉荘・山乃湯へ向かいましょう。", to: "山の澄んだ空気を胸いっぱいに味わったら、歩いておよそ11分、湯元温泉荘・山乃湯へ向かいましょう。" },
  ],
  [YAMANOYU]: [{ from: "犬鳴山から車でおよそ10分、", to: "犬鳴山から歩いておよそ11分、" }],
};

async function main() {
  const a = await prisma.spot.findUniqueOrThrow({ where: { id: INUNAKI } });
  const b = await prisma.spot.findUniqueOrThrow({ where: { id: YAMANOYU }, include: { transitLegs: true } });
  if (Number(a.lat) !== 34.3789 || Number(a.lng) !== 135.3939) throw new Error(`${a.name}: いまの座標が想定と違います（${a.lat},${a.lng}）`);
  if (fmt(b.visitTime) !== "10:30" || b.stayDurationMin !== 60) throw new Error(`${b.name}: いまの時刻・滞在が想定と違います`);
  if (b.transitLegs.length !== 1 || b.transitLegs[0].transitMode !== "car" || b.transitLegs[0].transitDurationMin !== 10)
    throw new Error(`${b.name}: いまの移動が想定と違います（${JSON.stringify(b.transitLegs)}）`);
  const memo: Record<string, string> = {};
  for (const s of [a, b]) {
    let m = s.memo ?? "";
    for (const e of EDITS[s.id]) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 「${e.from}」が1か所ではありません`);
      m = m.replace(e.from, e.to);
    }
    memo[s.id] = m;
  }
  console.log(`■ ${a.name}\n  座標 ${a.lat},${a.lng} → 34.3385234,135.3875613`);
  for (const e of EDITS[INUNAKI]) console.log(`  「${e.from}」→「${e.to}」`);
  console.log(`  直したあとのメモ:\n  ${memo[INUNAKI]}`);
  console.log(`\n■ ${b.name}\n  時刻 10:30 → 10:31、滞在 60 → 59（11:30 に出て、車28で淡輪ときめきビーチ 11:58 はそのまま）\n  移動 車10 → 歩11`);
  for (const e of EDITS[YAMANOYU]) console.log(`  「${e.from}」→「${e.to}」`);
  console.log(`  直したあとのメモ:\n  ${memo[YAMANOYU]}`);
  const bad = Object.values(memo).join("").match(/ください|おすすめ|南海ウイング/g);
  if (bad) console.log(`\n  ⚠ 残っている言葉: ${bad.join("・")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: INUNAKI }, data: { lat: 34.3385234, lng: 135.3875613, memo: memo[INUNAKI] } }),
    prisma.spot.update({ where: { id: YAMANOYU }, data: { visitTime: hm(10, 31), stayDurationMin: 59, memo: memo[YAMANOYU] } }),
    prisma.spotTransitLeg.deleteMany({ where: { spotId: YAMANOYU } }),
    prisma.spotTransitLeg.create({ data: { spotId: YAMANOYU, orderNo: 1, transitMode: "walk", transitDurationMin: 11 } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
