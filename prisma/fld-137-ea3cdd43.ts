/**
 * 初日・最終日の見直し #137 ea3cdd43「東山温泉に泊まる、鶴ヶ城と武家屋敷をめぐる会津1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（5か所）: 鶴ヶ城 9:30 → 鶴ヶ城会館（昼食）→ 福島県立博物館 → 御薬園 → 東山温泉 15:50〜16:30
 * 直した初日（5か所のまま）: JR会津若松駅に11時ごろ → まちなか周遊バスで約20分 → 鶴ヶ城 11:20 → 鶴ヶ城会館（昼食 12:40〜）→ 博物館 → 御薬園 →（タクシー）→ 東山温泉 16:15〜16:55
 *   どこも外さない（説明文に全部出てくる）。移動の時間は延ばさず、滞在を短くした
 *   （鶴ヶ城 110→70分、鶴ヶ城会館 55→50分、博物館 85→70分、御薬園 60→55分、東山温泉 40分のまま）
 *   閉まる時刻（決まり7）: 福島県立博物館 9:30〜17:00・入館16:30まで、御薬園 8:30〜17:00・入園16:30まで → 博物館 14:50、御薬園 16:05 に出る
 *   御薬園→東山温泉: もとの「まちなか周遊バスで約30分」は合わない。あかべぇは 会津若松駅前→…→東山温泉駅→…→御薬園入口→…→会津若松駅前 の一方向の循環で、
 *     御薬園入口から東山温泉駅へは駅前をまわって乗り継ぐことになる（駅前の最終は16:15）（aizubus.com/rosen/machinaka-shuyu、2026年4月1日改正）。
 *     道のり約2.1km（OSRM）なので、タクシーで約10分にする
 * 座標（itinerary-rules 7章）: 2日目の会津藩主松平家墓所 37.485959,139.9581 → OSM way 212315664「松平家院内御廟」（landuse=cemetery）
 *   東山温泉は、OSM の「東山温泉駅」（バス停 node 2272244943）と同じ点で、温泉街の中心なのでそのまま
 * 2日目（企画運営 10/29「誤りだと分かったものは、今回いっしょに直して」）: 墓所→飯盛山の「バス停へ歩き、まちなか周遊バスで飯盛山下へ（あわせて約30分）」も、
 *   あかべぇは院内から飯盛山下へ駅前をまわる向きなので合わない。道のり約3.4km（OSRM）でタクシー約10分にする。
 *   飯盛山 10:20 から後ろは今のまま（最終日の終わりは変わらない）。墓所を 9:00→9:20 に（滞在50分のまま。移動が短くなった分、宿を出るのを遅くする）
 * 説明文:「バスと歩きの1泊2日」→「バスと歩き（一部タクシー）の1泊2日」（企画運営 10/29）。タイトル・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-137-ea3cdd43.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ea3cdd43-7a1b-42cd-9f79-74d123ffc6d9";
const DAY1_ID = "59083e54-a260-43ea-a353-da0991fce45c";
const CASTLE = "da31c53e-664a-476c-8296-c7090c41555b";
const KAIKAN = "7909c02c-0862-4fbc-bd8d-10e40cb01b63";
const MUSEUM = "7c3da7fd-636c-4fde-87e2-afbe48546da1";
const OYAKUEN = "dab2d6b5-b97c-4d00-af72-e363e0fc58da";
const ONSEN = "7f2a2f2e-4f62-47e2-8573-a96ea1df148b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const taxi = (min: number) => ({ mode: "taxi" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [CASTLE]: [{ from: "JR会津若松駅から、まちなか周遊バスで約20分の鶴ヶ城北口へ。", to: "JR会津若松駅に11時ごろ着いたら、まちなか周遊バスで約20分の鶴ヶ城北口へ。" }],
  [ONSEN]: [{ from: "御薬園からまちなか周遊バスで約30分、山あいの温泉街へ。", to: "御薬園からタクシーで約10分、山あいの温泉街へ。タクシーは、前もって呼んでおきましょう。" }],
};

const BOSHO = "3ae6d2e2-dd80-41df-a309-15337e622713";
const IIMORI = "d7d4ad4c-dfb6-4eb6-8795-6dba74557403";
const DAY2_MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [BOSHO]: [{ from: "この日もバスと歩きでめぐります。", to: "この日もバスと歩き（一部タクシー）でめぐります。" }],
  [IIMORI]: [
    {
      from: "墓所からバス停へ歩き、まちなか周遊バスで飯盛山下へ（あわせて約30分）。",
      to: "墓所からタクシーで飯盛山下へ（約10分）。タクシーは、宿で呼んでもらうか、前もって予約しておきましょう。",
    },
  ],
};
const DESC_FROM = "戊辰戦争の歴史をたどる、バスと歩きの1泊2日です。";
const DESC_TO = "戊辰戦争の歴史をたどる、バスと歩き（一部タクシー）の1泊2日です。";

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [{ id: BOSHO, from: [37.485959, 139.9581], to: [37.48511, 139.958595] }];

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: CASTLE, h: 11, m: 20, stay: 70, legs: [] },
  { id: KAIKAN, h: 12, m: 40, stay: 50, legs: [walk(10)] },
  { id: MUSEUM, h: 13, m: 40, stay: 70, legs: [walk(10)] },
  { id: OYAKUEN, h: 15, m: 10, stay: 55, legs: [walk(20)] },
  { id: ONSEN, h: 16, m: 15, stay: 40, legs: [taxi(10)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
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
  const allSpots = it.days.flatMap((d) => d.spots);
  for (const c of COORDS) {
    const s = allSpots.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`\n座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  const d2 = it.days[1];
  const memo2 = (id: string) => {
    let m = d2.spots.find((x) => x.id === id)?.memo ?? "";
    for (const e of DAY2_MEMO_EDITS[id]) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const b = d2.spots[0];
  const i2 = d2.spots[1];
  if (b?.id !== BOSHO || i2?.id !== IIMORI || !i2.visitTime || hm(i2.visitTime.getUTCHours() * 60 + i2.visitTime.getUTCMinutes()) !== "10:20" || b.stayDurationMin !== 50) throw new Error("2日目の構成が想定と違います");
  console.log(`\n2日目: 09:20-10:10 ${b.name}（もと 09:00）\n  本文: ${memo2(BOSHO)}\n10:20 taxi10 (前から10分) ${i2.name}（時刻は変えない）\n  本文: ${memo2(IIMORI)}\n（飯盛山から後ろは変えない）`);
  if ((it.description ?? "").split(DESC_FROM).length !== 2) throw new Error("説明文の置き換え元が見つかりません");
  const description = (it.description ?? "").replace(DESC_FROM, DESC_TO);
  console.log(`\n説明文（直したあと）: ${description}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
      await tx.spot.update({ where: { id: BOSHO }, data: { visitTime: t(9, 20), memo: memo2(BOSHO) } });
      await tx.spot.update({ where: { id: IIMORI }, data: { memo: memo2(IIMORI), transitLegs: { deleteMany: {}, create: legsCreate([taxi(10)]) } } });
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
      for (const c of COORDS) await tx.spot.update({ where: { id: c.id }, data: { lat: c.to[0], lng: c.to[1] } });
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
