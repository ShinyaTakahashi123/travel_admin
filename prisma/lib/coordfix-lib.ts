/**
 * 日帰りの座標の直し（docs/content/20261102-daytrip-coord-scan.md）の共通の道具（しおりえ(制作補助2)）。
 * 1本のしおりについて、点・時刻・滞在・移動・メモ・路線の欄の直しを、いまの値を確かめたうえで1つのトランザクションで書き込む。
 * 確認モード（引数なし）では、直す前と後、直したあとのメモの全文を出す。--commit で書き込む。
 */
import { prisma } from "../../src/lib/prisma";

export type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string | null };
export type SpotFix = {
  id: string;
  label: string; // 確認用のスポット名（DB の名前と一致すること）
  point?: { from: [number, number]; to: [number, number]; source: string };
  time?: { from: string; to: string };
  stay?: { from: number; to: number };
  legs?: { from: Leg[]; to: Leg[] };
  memo?: { from: string; to: string }[];
};

const fmt = (d: Date | null) => (d ? `${String(d.getUTCHours()).padStart(2, "0")}:${String(d.getUTCMinutes()).padStart(2, "0")}` : "--:--");
const toDate = (hm: string) => {
  const [h, m] = hm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m));
};
const legStr = (ls: Leg[]) => ls.map((l) => `${l.mode}${l.min}${l.line ? `(${l.line})` : ""}`).join("+") || "-";

export async function runCoordFix(itineraryId: string, fixes: SpotFix[]) {
  const COMMIT = process.argv.includes("--commit");
  const ops = [];
  console.log(`しおり ${itineraryId}`);
  for (const f of fixes) {
    const s = await prisma.spot.findUniqueOrThrow({
      where: { id: f.id },
      include: { day: true, transitLegs: { orderBy: { orderNo: "asc" } } },
    });
    if (s.day.itineraryId !== itineraryId) throw new Error(`${f.label}: 別のしおりのスポットです`);
    if (s.name !== f.label) throw new Error(`${f.label}: DB の名前は「${s.name}」です`);
    const data: Record<string, unknown> = {};
    console.log(`\n■ ${s.name}`);
    if (f.point) {
      if (Number(s.lat) !== f.point.from[0] || Number(s.lng) !== f.point.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
      data.lat = f.point.to[0];
      data.lng = f.point.to[1];
      console.log(`  座標 ${s.lat},${s.lng} → ${f.point.to[0]},${f.point.to[1]}（${f.point.source}）`);
    }
    if (f.time) {
      if (fmt(s.visitTime) !== f.time.from) throw new Error(`${s.name}: いまの時刻が想定と違います（${fmt(s.visitTime)}）`);
      data.visitTime = toDate(f.time.to);
      console.log(`  時刻 ${f.time.from} → ${f.time.to}`);
    }
    if (f.stay) {
      if (s.stayDurationMin !== f.stay.from) throw new Error(`${s.name}: いまの滞在が想定と違います（${s.stayDurationMin}）`);
      data.stayDurationMin = f.stay.to;
      console.log(`  滞在 ${f.stay.from} → ${f.stay.to}`);
    }
    if (f.legs) {
      const now: Leg[] = s.transitLegs.map((l) => ({ mode: l.transitMode as Leg["mode"], min: l.transitDurationMin ?? 0, line: l.transitLine }));
      if (legStr(now) !== legStr(f.legs.from)) throw new Error(`${s.name}: いまの移動が想定と違います（${legStr(now)}）`);
      console.log(`  移動 ${legStr(f.legs.from)} → ${legStr(f.legs.to)}`);
      ops.push(prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } }));
      ops.push(
        prisma.spotTransitLeg.createMany({
          data: f.legs.to.map((l, i) => ({ spotId: s.id, orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null })),
        }),
      );
    }
    if (f.memo) {
      let m = s.memo ?? "";
      for (const e of f.memo) {
        if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 「${e.from}」が1か所ではありません`);
        m = m.replace(e.from, e.to);
        console.log(`  「${e.from}」→「${e.to}」`);
      }
      data.memo = m;
      console.log(`  直したあとのメモ:\n  ${m}`);
      const bad = m.match(/ください|おすすめ|よいでしょう/g);
      if (bad) console.log(`  ⚠ このメモに残っている言葉: ${bad.join("・")}（今回は直さない）`);
    }
    if (Object.keys(data).length) ops.push(prisma.spot.update({ where: { id: s.id }, data }));
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(ops);
  console.log("\n書き込みました。");
}

export function main(itineraryId: string, fixes: SpotFix[]) {
  runCoordFix(itineraryId, fixes)
    .catch((e) => {
      console.error("エラー:", e?.code, e?.message?.slice(0, 600));
      process.exit(1);
    })
    .finally(() => prisma.$disconnect());
}
