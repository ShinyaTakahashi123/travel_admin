/**
 * 初日・最終日の見直し #126 3993afce「黒壁スクエアと琵琶湖畔、長浜をじっくり満喫する1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（10か所）: 大通寺 8:40 → 長浜八幡宮 → 舎那院 → 知善院 → 長浜曳山博物館 → 黒壁スクエア（昼食）→ 黒壁ガラス館 → 黒壁オルゴール館 → 豊国神社 → 車で国友鉄砲の里資料館 16:14〜16:54
 * 直した初日（8か所）: JR長浜駅に11時ごろ → 歩いて大通寺 11:10 → 知善院 → 長浜曳山博物館 → 黒壁スクエア（昼食）→ 黒壁ガラス館 → 黒壁オルゴール館 → 豊国神社 → 長浜八幡宮 16:11〜16:46 → 長浜の町の宿
 *   入口と1か所目（企画運営 10/29）: 入口はJR長浜駅、大通寺まで歩いて約10分（rurubu.jp/andmore/spot/80025560「JR長浜駅→徒歩10分」、営業時間10〜16時）
 *   舎那院は外す（朝の行き先で、2日目は今のままで入れる時間がない）。長浜八幡宮は1日の最後に回す
 *   国友鉄砲の里資料館は外す: 1日目はほかがすべて歩きで、ここだけ車になる（決まり8）。タイトル・説明文には出てこない
 *   移動の時間は延ばさず、滞在を短くした（大通寺 65→45分、知善院 25→20分、曳山博物館 58→40分、黒壁スクエア 90→60分、オルゴール館 35→30分）
 *   豊国神社→長浜八幡宮は直線で約880m、歩いて約13分
 * 2日目: 豊公園→ヤンマーミュージアムの「車8分」を「歩き約10分」に（座標で約730m。歩きの旅に車が混ざっていたため。企画運営 10/29 の指示）。
 *   ヤンマーミュージアム 14:58→15:00、長浜びわこ大仏 16:08→16:10（滞在はそのまま）
 *   法務 10/29 の任意の指摘も一緒に: 竹生島「日本三弁天の一つに数えられています」→「…数えられるといわれます」、びわこ大仏「徒歩またはバスでどうぞ」→「歩くかバスで戻りましょう」
 * 説明文・タイトルは変えない。外す2か所に写真はない
 * 本文は、つなぎの文だけを置き換える（ほかの文は 9/29 の見直し #97 で法✅企✅になったまま）。大通寺の「旅のはじまりを感じてみてください」は「ください」を使わない決まりに合わないので外す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-126-3993afce.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "3993afce-33aa-41f0-adb0-fff0997cb126";
const DAY1_ID = "d2261bd0-2688-4041-b792-a25041ab728e";
const DAITSU = "d1fac054-8f49-46c9-8393-f3c2019b0bf2";
const HACHIMAN = "8b3afe78-c22a-424d-b766-2d13e33811f4";
const SHANA = "88ac430c-b9db-459d-967c-35833dc7d6f3";
const CHIZEN = "b9003dc0-580c-463d-88d4-c22b20d23fdb";
const HIKIYAMA = "7a2ce1d8-1e61-45a1-b0cc-8af455fda4b9";
const KUROKABE = "ef256fca-14cd-42d9-a310-55cc5df27c8a";
const GLASS = "ffb74525-4a67-42d8-8e6b-26db0a72a403";
const ORGEL = "fd6499be-8086-41d1-b858-3210ccd3f35e";
const HOKOKU = "e2586b2d-c588-45f3-8a8e-95ebef4ba1df";
const KUNITOMO = "57d4ef55-b94e-4f8c-a9af-130b15423e05";
const DAY2_ID = "f97582fb-7cd9-4f2f-a50f-a78cab72274e";
const TOYO = "8033beb5-c892-468d-9211-dfb76365482e";
const YANMAR = "669c659e-a713-4264-a0c0-04be8d5c0c61";
const DAIBUTSU = "a4c45f34-9446-48e1-a62e-c44f5c169fe9";
const CHIKUBU = "f996e863-8a8c-43d0-bcd5-096fcfa90146";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [DAITSU]: [
    { from: "旅の1日目は、大通寺から始まります。", to: "この旅は歩いてめぐります。JR長浜駅に11時ごろ着いたら、歩いて約10分の大通寺から旅を始めます。" },
    { from: "歴史ある伽藍と庭園を眺めながら、長浜の旅のはじまりを感じてみてください。", to: "" },
    { from: "この後は、歩いておよそ8分、長浜八幡宮へ向かいましょう。", to: "この後は、歩いておよそ5分、知善院へ向かいましょう。" },
  ],
  [CHIZEN]: [{ from: "舎那院から歩いておよそ11分、知善院に着きます。", to: "大通寺から歩いておよそ5分、知善院に着きます。" }],
  [HOKOKU]: [{ from: "この後は、車でおよそ12分、国友鉄砲の里資料館へ向かいましょう。", to: "この後は、歩いておよそ13分、長浜八幡宮へ向かいましょう。" }],
  [HACHIMAN]: [
    { from: "大通寺から歩いておよそ8分、長浜八幡宮に着きます。", to: "豊国神社から歩いておよそ13分、長浜八幡宮に着きます。" },
    { from: "この後は、歩いてすぐ、隣の舎那院へ向かいましょう。", to: "1日目はここまでです。今夜は長浜の町の宿に泊まります。" },
  ],
};

// 2日目: 移動の手段だけを直す（行き先・順番・滞在は変えない）
const DAY2_EDITS: { id: string; h?: number; m?: number; legs?: Leg[]; memo?: { from: string; to: string } }[] = [
  {
    id: CHIKUBU,
    memo: { from: "日本三弁天の一つに数えられています。", to: "日本三弁天の一つに数えられるといわれます。" },
  },
  { id: TOYO, memo: { from: "この後は、車でおよそ8分、ヤンマーミュージアムへ向かいましょう。", to: "この後は、歩いておよそ10分、ヤンマーミュージアムへ向かいましょう。" } },
  { id: YANMAR, h: 15, m: 0, legs: [walk(10)], memo: { from: "豊公園から車でおよそ8分、ヤンマーミュージアムに着きます。", to: "豊公園から歩いておよそ10分、ヤンマーミュージアムに着きます。" } },
  { id: DAIBUTSU, h: 16, m: 10, memo: { from: "帰りは、JR長浜駅から徒歩またはバスでどうぞ。", to: "帰りは、JR長浜駅へ、歩くかバスで戻りましょう。" } },
];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: DAITSU, h: 11, m: 10, stay: 45, legs: [] },
  { id: CHIZEN, h: 12, m: 0, stay: 20, legs: [walk(5)] },
  { id: HIKIYAMA, h: 12, m: 26, stay: 40, legs: [walk(6)] },
  { id: KUROKABE, h: 13, m: 11, stay: 60, legs: [walk(5)] },
  { id: GLASS, h: 14, m: 13, stay: 40, legs: [walk(2)] },
  { id: ORGEL, h: 14, m: 55, stay: 30, legs: [walk(2)] },
  { id: HOKOKU, h: 15, m: 28, stay: 30, legs: [walk(3)] },
  { id: HACHIMAN, h: 16, m: 11, stay: 35, legs: [walk(13)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [DAITSU, HACHIMAN, SHANA, CHIZEN, HIKIYAMA, KUROKABE, GLASS, ORGEL, HOKOKU, KUNITOMO].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === SHANA || x.id === KUNITOMO)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = PLAN.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: memoOf(p.id) } : {}) } }));
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const p of PLAN) {
    const st = p.h * 60 + p.m;
    const min = p.legs.reduce((a, l) => a + l.min, 0);
    const s = d1.spots.find((x) => x.id === p.id)!;
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n外すスポット: ${SHANA}（舎那院）・${KUNITOMO}（国友鉄砲の里資料館）`);
  console.log(`\n説明文は変えない: ${it.description}`);
  const d2 = it.days[1];
  if (d2.id !== DAY2_ID) throw new Error("2日目が想定と違います");
  const DAY2 = DAY2_EDITS.map((e) => {
    const s = d2.spots.find((x) => x.id === e.id);
    if (!s) throw new Error(`2日目に ${e.id} がありません`);
    let memo: string | undefined;
    if (e.memo) {
      if ((s.memo ?? "").split(e.memo.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません`);
      memo = s.memo!.replace(e.memo.from, e.memo.to);
    }
    return { s, e, memo };
  });
  console.log("\n2日目（移動の手段だけ直す）");
  for (const { s, e, memo } of DAY2) {
    const st = e.h !== undefined ? e.h * 60 + e.m! : s.visitTime!.getUTCHours() * 60 + s.visitTime!.getUTCMinutes();
    console.log(`\n${hm(st)}-${hm(st + (s.stayDurationMin ?? 0))}${e.h !== undefined ? "" : "(時刻は変えない)"} ${e.legs ? e.legs.map((l) => l.mode + l.min).join("+") : "(移動は変えない)"} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${memo ? "\n  本文: " + memo : ""}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [SHANA, KUNITOMO] });
      for (const { e, memo } of DAY2)
        await tx.spot.update({
          where: { id: e.id },
          data: { ...(e.h !== undefined ? { visitTime: t(e.h, e.m!) } : {}), ...(memo ? { memo } : {}), ...(e.legs ? { transitLegs: { deleteMany: {}, create: legsCreate(e.legs) } } : {}) },
        });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
