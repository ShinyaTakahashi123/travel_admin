/**
 * #41 c898c3d9 の追加の直し（しおりえ(制作補助2)、法務 10/30 19:47・企画運営 10/30。点2か所と、それに合わせた歩き・時刻・文）
 * 偕楽園: 庭園の面の中心 → メモの「好文亭」way 382405576（historic=building）の東の頂点 node 3856031522（36.37435,140.4529934。api/0.6/node で確認。法務 10/30 19:50）
 * 弘道館: 弘道館公園の面の中心 → 「正庁」relation 10302996（企画運営の判断）の外側の way 296862076 の、正門に近い頂点 node 3006723171（36.375315,140.4774873）。メモに正庁の一文を足す
 *   https://kodokan-ibaraki.jp/about/「創建当時から残る正門・正庁・至善堂が重要文化財指定を受け、藩校当時の姿を今に伝えています。」
 * routed-foot: 偕楽園下有料駐車場→好文亭 471m 6.3分（7のまま）、好文亭→常磐神社 313m 4.2分（5のまま）、正庁→大手門 89m 1.2分（3→2）
 * routed-car: 歴史館→正庁 3.5km 6.5分（12のまま）、正庁→芸術館 1.8km 2.9分（8のまま）
 * 時刻: 偕楽園 11:05 はそのまま。大手門 15:34〜16:03（27→29、もと40以下）、芸術館 16:13 はそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-041b-c898c3d9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const KAIRAKU = "bd205e9d-ec09-423e-97dd-5958d9de6c00";
const KODOKAN = "19ccc65a-5d12-45e4-832e-f10fa71668c7";
const OTEMON = "702b1edf-cc5a-46d4-8ef2-31f621942857";
const GEIJUTSU = "197e80f9-abfc-4e35-bd4f-4fe1e3240730";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [KAIRAKU]: { from: [36.375135, 140.453545], to: [36.37435, 140.4529934] },
  [KODOKAN]: { from: [36.375925, 140.47716], to: [36.375315, 140.4774873] },
};
const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KODOKAN]: [
    { from: "総合的な学びの場でした。", to: "総合的な学びの場でした。創建当時から残る正庁・至善堂・正門は国の重要文化財で、藩校当時の姿を今に伝えています。" },
    { from: "歩いておよそ3分、水戸城跡の大手門へ向かいましょう。", to: "歩いておよそ2分、水戸城跡の大手門へ向かいましょう。" },
  ],
  [OTEMON]: [
    { from: "弘道館から歩いておよそ3分、", to: "弘道館から歩いておよそ2分、" },
    { from: "歩いておよそ3分で弘道館のそばにとめた車に戻り、", to: "歩いておよそ2分で弘道館のそばにとめた車に戻り、" },
  ],
  [GEIJUTSU]: [{ from: "歩きと車であわせておよそ11分、", to: "歩きと車であわせておよそ10分、" }],
};
const TIME_LEGS: Record<string, { h: number; m: number; stay: number; legs: { mode: "walk" | "car"; min: number }[] }> = {
  [OTEMON]: { h: 15, m: 34, stay: 29, legs: [{ mode: "walk", min: 2 }] },
  [GEIJUTSU]: { h: 16, m: 13, stay: 45, legs: [{ mode: "walk", min: 2 }, { mode: "car", min: 8 }] },
};

async function main() {
  const ids = [KAIRAKU, KODOKAN, OTEMON, GEIJUTSU];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } });
  const by = (id: string) => spots.find((s) => s.id === id)!;
  for (const [id, c] of Object.entries(COORDS)) {
    const s = by(id);
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const k = by(KODOKAN);
  if (k.visitTime?.getUTCHours() !== 14 || k.visitTime.getUTCMinutes() !== 37 || k.stayDurationMin !== 55) throw new Error("弘道館の時刻が想定と違います");
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    let m = by(id).memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${by(id).name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m;
  }
  for (const id of ids) {
    const s = by(id);
    const tl = TIME_LEGS[id];
    const old = `${s.visitTime?.toISOString().slice(11, 16)} 滞在${s.stayDurationMin} ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+")}`;
    console.log(`■ ${s.name}（いま ${old}${tl ? ` → ${String(tl.h).padStart(2, "0")}:${String(tl.m).padStart(2, "0")} 滞在${tl.stay} ${tl.legs.map((l) => l.mode + l.min).join("+")}` : ""}）`);
    if (COORDS[id]) console.log(`  座標 ${COORDS[id].from.join(",")} → ${COORDS[id].to.join(",")}`);
    console.log(memos[id]);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const id of ids) {
      const tl = TIME_LEGS[id];
      await tx.spot.update({
        where: { id },
        data: {
          memo: memos[id],
          ...(COORDS[id] ? { lat: COORDS[id].to[0], lng: COORDS[id].to[1] } : {}),
          ...(tl
            ? {
                visitTime: t(tl.h, tl.m),
                stayDurationMin: tl.stay,
                transitLegs: { deleteMany: {}, create: tl.legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: null })) },
              }
            : {}),
        },
      });
    }
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
