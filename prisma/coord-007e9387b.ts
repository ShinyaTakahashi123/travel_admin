/**
 * 日帰りの座標の直し（A）: 007e9387 のつづき（しおりえ(制作補助2)、企画運営 11/02「淡輪ときめきビーチの5けたの点も A として直す」）
 * - 淡輪ときめきビーチ: 34.31694,135.14214（小数5けた。点は深日の岬町役場 node1422993393 から4m、浜から約4km西）
 *   → OSM「淡輪海水浴場」（alt_name=ときめきビーチ）natural=beach way478824892 の陸側の頂点 node4717666959 34.3363035,135.1869828
 *   （浜の面の中心は「広い場所の中心」になるため使わない。入口の道が浜の線につながっていないので、浜の中ほどの陸側の頂点）
 * - 山乃湯→ビーチ: routed-car 27.3km 36.6分。もとの28分は短すぎる → 37＋駐車5＝42分。ビーチ 11:58→12:12、滞在 70→56（せんなん里海公園 13:13 はそのまま）
 *   ビーチ→せんなん里海公園: routed-car 1.1km 4.2分（もとの車5のまま）
 * - メモ: 山乃湯の最後の文と、ビーチの最後の文に分を書く（法務 11/02）。ビーチの最初の文 28→42。「おすすめのスポットです」を消す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/coord-007e9387b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const YAMANOYU = "a4c2edc0-c73f-474e-aa64-8ff177112033";
const BEACH = "d2db7717-8341-450b-8d3a-68de0d503559";
const TO: [number, number] = [34.3363035, 135.1869828];
const fmt = (d: Date | null) => (d ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}` : "--:--");

const EDITS: Record<string, { from: string; to: string }[]> = {
  [YAMANOYU]: [{ from: "続いては淡輪ときめきビーチへ向かいましょう。", to: "続いては、車でおよそ42分、淡輪ときめきビーチへ向かいましょう。" }],
  [BEACH]: [
    { from: "湯元温泉荘・山乃湯から車でおよそ28分、", to: "湯元温泉荘・山乃湯から車でおよそ42分、" },
    {
      from: "淡路島の方へ沈んでいく夕日を眺めることもでき、写真好きの方にもおすすめのスポットです。",
      to: "淡路島の方へ沈んでいく夕日を眺めることもできます。",
    },
    { from: "潮風を感じながら少し足を伸ばして、次はすぐそばのせんなん里海公園へ向かいましょう。", to: "潮風を感じながら少し足を伸ばして、車でおよそ5分、すぐそばのせんなん里海公園へ向かいましょう。" },
  ],
};

async function main() {
  const y = await prisma.spot.findUniqueOrThrow({ where: { id: YAMANOYU } });
  const b = await prisma.spot.findUniqueOrThrow({ where: { id: BEACH }, include: { transitLegs: true } });
  if (Number(b.lat) !== 34.31694 || Number(b.lng) !== 135.14214) throw new Error(`${b.name}: いまの座標が想定と違います（${b.lat},${b.lng}）`);
  if (fmt(b.visitTime) !== "11:58" || b.stayDurationMin !== 70) throw new Error(`${b.name}: いまの時刻・滞在が想定と違います`);
  if (b.transitLegs.length !== 1 || b.transitLegs[0].transitMode !== "car" || b.transitLegs[0].transitDurationMin !== 28)
    throw new Error(`${b.name}: いまの移動が想定と違います（${JSON.stringify(b.transitLegs)}）`);
  const memo: Record<string, string> = {};
  for (const s of [y, b]) {
    let m = s.memo ?? "";
    for (const e of EDITS[s.id]) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 「${e.from}」が1か所ではありません`);
      m = m.replace(e.from, e.to);
    }
    memo[s.id] = m;
  }
  console.log(`■ ${y.name}（メモだけ）`);
  for (const e of EDITS[YAMANOYU]) console.log(`  「${e.from}」→「${e.to}」`);
  console.log(`  直したあとのメモ:\n  ${memo[YAMANOYU]}`);
  console.log(`\n■ ${b.name}\n  座標 ${b.lat},${b.lng} → ${TO[0]},${TO[1]}\n  時刻 11:58 → 12:12、滞在 70 → 56（13:08 に出て、車5でせんなん里海公園 13:13 はそのまま）\n  移動 車28 → 車42`);
  for (const e of EDITS[BEACH]) console.log(`  「${e.from}」→「${e.to}」`);
  console.log(`  直したあとのメモ:\n  ${memo[BEACH]}`);
  const bad = Object.values(memo).join("").match(/ください|おすすめ|よいでしょう/g);
  if (bad) console.log(`\n  ⚠ 残っている言葉: ${bad.join("・")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: YAMANOYU }, data: { memo: memo[YAMANOYU] } }),
    prisma.spot.update({ where: { id: BEACH }, data: { lat: TO[0], lng: TO[1], visitTime: new Date(Date.UTC(1970, 0, 1, 12, 12)), stayDurationMin: 56, memo: memo[BEACH] } }),
    prisma.spotTransitLeg.update({ where: { id: b.transitLegs[0].id }, data: { transitDurationMin: 42 } }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
