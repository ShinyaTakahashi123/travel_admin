/**
 * 初日・最終日の見直し #159 7a65702f「山口県立山口博物館と瑠璃光寺五重塔、湯田温泉近郊1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。2日目は歩きの時間が道のりと合っていなかったので直し、終わりが早くなるぶんは決まり②で始まりを遅くする
 * いまの初日（7か所）: 山口博物館 9:00 → 山口大神宮 → サビエル記念聖堂 →（昼食）→ 県立美術館 → バス → 中原中也記念館 → 井上公園 → 湯田温泉 16:00〜16:45
 * 直した初日（7か所のまま）: JR山口駅に11時ごろ → 歩いて約20分（1,355m・19分）→ 博物館 11:19 → 大神宮 12:20 → サビエル記念聖堂 12:58〜13:23 →
 *   （町なかで昼食。もとと同じく、次の美術館までのあいだ）→ 県立美術館 14:23 → バス30分（もとのまま）→ 中原中也記念館 15:33 → 井上公園 16:08 → 湯田温泉 16:26〜16:56
 *   歩き（routing.openstreetmap.de の foot）: 博物館→大神宮 772m・11分（10→11）、大神宮→サビエル 897m・13分（15→13）、サビエル→美術館 660m・9分（すぐ→9）、
 *     中也記念館→井上公園 301m・5分（すぐ→5）、井上公園→湯田温泉 526m・8分（5→8）
 *   閉まる時刻: 中原中也記念館は 17:00 まで（冬）。15:33 に着く
 *   滞在はどれも、もとより短い（博物館 80→50、大神宮 30→25、サビエル 35→25、美術館 75→40、中也 45→30、井上公園 20→10、湯田温泉 45→30）
 * 2日目: 歩き（foot）五重塔→墓所 224m・3分（5→3）、墓所→洞春寺 5分、洞春寺→八坂神社 901m・13分（10→13）、八坂→龍福寺 425m・6分（10→6）、
 *   龍福寺→十朋亭 254m・4分（10→4。あいだの昼食60分はそのまま）、十朋亭→菜香亭 744m・10分（20→10）、菜香亭→豊栄神社 19m・1分（5→1）。
 *   滞在は変えない。直すと終わりが16:07になるので、決まり②で1か所目の五重塔を 9:00→9:23 にして、豊栄神社・野田神社 15:45〜16:30（今と同じ）
 * 座標（itinerary-rules 7章）: 井上公園 → 公園の面の中心をやめ、園内の node 13664334708「何遠亭」（井上馨ゆかりの建物）／
 *   湯田温泉 → JR湯田温泉駅の点をやめ、メモの白狐の言い伝えに合う node 12993970612「湯田温泉駅前足湯(白狐の湯)」／
 *   萩藩主毛利家墓所 → 墓地の面の中心をやめ、node 6814983558「史跡 萩藩主毛利家墓所」（案内板）／瑠璃光寺五重塔 → node 3018655868（いまは約75m南）
 *   ほかは確かめたうえでそのまま（博物館・サビエル・美術館・龍福寺・菜香亭・野田神社＝OSM way の Nominatim の中心、大神宮・中也記念館・洞春寺・八坂神社・十朋亭＝OSM node）
 * 「見学してください」2か所を直す（企画運営 10/30）: サビエル記念聖堂→「見学しましょう」、毛利家墓所→「墓所のまわりでは、静かに過ごしましょう。」（お墓の一文の決まり）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-159-7a65702f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7a65702f-5c0b-4b5b-a3b7-922d2f9ed73e";
const DAY1_ID = "a6e8e0de-2382-4c47-9ddf-78e622e508cb";
const DAY2_ID = "fc49fe4c-47ff-4e71-9d45-ea251094e3fe";
const HAKUBUTSU = "e2a70d13-4853-4a9a-9d36-c543cc0fb42a";
const DAIJINGU = "ad3c3835-4877-4d5a-822b-2d4239f5d3f2";
const XAVIER = "825c807e-df87-4e17-b5c2-3a33b2e038fa";
const BIJUTSU = "24afd7df-7d18-4de5-af0a-962b3d0ade79";
const CHUYA = "de544b83-4701-41da-b6e0-55313ccc7e02";
const INOUE = "ae3f2a53-5719-4fa0-8a40-f3a7142a36ac";
const YUDA = "e2fd1a6c-6406-45cf-8f34-1a14467f7086";
const GOJUNOTO = "6a6c4a6e-46b5-4c24-b9c0-61bd649701bb";
const BOSHO = "f3122d29-9d9e-468b-8d8d-ffc4fc2ec969";
const TOSHUNJI = "a9e5e016-df44-4f89-90d7-4e46ebd321e5";
const YASAKA = "c01ca7ac-9e6f-46c4-ac92-c8aea3672ede";
const RYUFUKUJI = "c3ecb689-f6c1-4e13-8896-1c3132900b40";
const JIPPOTEI = "52174517-1b1b-4b97-b7b4-406f6023ed47";
const SAIKOTEI = "2240820b-b6a9-4df7-bfe0-8d67a131d0c5";
const TOYOSAKA = "7b97b581-a0b4-49d6-8731-597317e6f683";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [HAKUBUTSU]: [{ from: "旅の始まりは山口県立山口博物館へ。", to: "この旅は歩きとバスでめぐります。JR山口駅に11時ごろ着いたら、歩いて約20分で、旅の始まりの山口県立山口博物館へ。" }],
  [DAIJINGU]: [{ from: "博物館から歩いて約10分。", to: "博物館から歩いて約11分。" }],
  [XAVIER]: [
    { from: "山口大神宮から歩いて約15分。", to: "山口大神宮から歩いて約13分。" },
    {
      from: "見学できる時間は公式の案内で確かめ、今も祈りが続く場所ですので、静かに、敬意をもって見学してください。",
      to: "見学できる時間は公式の案内で確かめましょう。今も祈りが続く場所ですので、静かに、敬意をもって見学しましょう。",
    },
  ],
  [BOSHO]: [{ from: "今も祈りが続く場所ですので、静かに、敬意をもって見学してください。", to: "墓所のまわりでは、静かに過ごしましょう。" }],
  [BIJUTSU]: [{ from: "サビエル記念聖堂から歩いてすぐ。", to: "サビエル記念聖堂から歩いて約9分。" }],
  [INOUE]: [{ from: "記念館から歩いてすぐの井上公園へ。", to: "記念館から歩いて約5分の井上公園へ。" }],
  [YASAKA]: [{ from: "洞春寺から歩いて約10分。", to: "洞春寺から歩いて約13分。" }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: HAKUBUTSU, h: 11, m: 19, stay: 50, legs: [] },
  { id: DAIJINGU, h: 12, m: 20, stay: 25, legs: [walk(11)] },
  { id: XAVIER, h: 12, m: 58, stay: 25, legs: [walk(13)] },
  { id: BIJUTSU, h: 14, m: 23, stay: 40, legs: [walk(9)] },
  { id: CHUYA, h: 15, m: 33, stay: 30, legs: [bus(30, "路線バス")] },
  { id: INOUE, h: 16, m: 8, stay: 10, legs: [walk(5)] },
  { id: YUDA, h: 16, m: 26, stay: 30, legs: [walk(8)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: GOJUNOTO, h: 9, m: 23, stay: 50, legs: [] },
  { id: BOSHO, h: 10, m: 16, stay: 30, legs: [walk(3)] },
  { id: TOSHUNJI, h: 10, m: 51, stay: 30, legs: [walk(5)] },
  { id: YASAKA, h: 11, m: 34, stay: 30, legs: [walk(13)] },
  { id: RYUFUKUJI, h: 12, m: 10, stay: 40, legs: [walk(6)] },
  { id: JIPPOTEI, h: 13, m: 54, stay: 50, legs: [walk(4)] },
  { id: SAIKOTEI, h: 14, m: 54, stay: 50, legs: [walk(10)] },
  { id: TOYOSAKA, h: 15, m: 45, stay: 45, legs: [walk(1)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: INOUE, from: [34.163362, 131.456715], to: [34.163143, 131.457036] },
  { id: YUDA, from: [34.159875, 131.460407], to: [34.159712, 131.45998] },
  { id: BOSHO, from: [34.188927, 131.47117], to: [34.18884, 131.471418] },
  { id: GOJUNOTO, from: [34.189516, 131.473074], to: [34.190176, 131.47292] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
  const chuya = d1.spots.find((s) => s.id === CHUYA)!;
  if (chuya.transitLegs.length !== 1 || chuya.transitLegs[0].transitLine !== "路線バス" || chuya.transitLegs[0].transitDurationMin !== 30) throw new Error("中也記念館のバスが想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const apply = (id: string, edits: { from: string; to: string }[]) => {
    let m = all.find((s) => s.id === id)?.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: typeof PLAN, spots: typeof d1.spots) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = spots.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
      if (MEMO_EDITS[p.id]) for (const e of MEMO_EDITS[p.id]) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", PLAN, d1.spots);
  show("2日目（直したあと）", DAY2, d2.spots);
  for (const c of COORDS) {
    const s = all.find((x) => x.id === c.id);
    if (!s || Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${c.id}: いまの座標が想定と違います（${s?.lat},${s?.lng}）`);
    console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${c.to.join(",")}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: typeof PLAN) => plan.map((p) => ({ id: p.id, data: { ...timeLegs(p.h, p.m, p.stay, p.legs), ...(MEMO_EDITS[p.id] ? { memo: apply(p.id, MEMO_EDITS[p.id]) } : {}) } }));
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(PLAN) as never, { tx });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
