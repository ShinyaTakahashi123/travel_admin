/**
 * 初日・最終日の見直し #168 2cc9028d「富山県美術館と岩瀬の街並み、港町富山を巡る1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする。もとは車の区間があるのにレンタカーの入口がなく、初日の昼食の行もなかった。2日目は移動の時間を直す（終わりは今と同じ 16:34）
 * いまの初日（5か所）: 富山県美術館 9:30 → 環水公園 → 車8 → ガラス美術館 → 富山城址公園 → 高志の国文学館 15:12〜16:32（昼食の行なし）
 * 直した初日（5か所のまま）: JR富山駅に11時ごろ → 駅の近くでレンタカー（手続きに15分ほど）→ 車で約8分（OSRM 3分＋駐車）→ 富山県美術館 11:23〜12:43（館内のレストラン・カフェで昼食。
 *   館内に飲食店があることは museum.or.jp/museum/17673 ほか）→ 歩5 → 環水公園 12:48 → 歩5で車に戻り＋車12（OSRM 7分＋駐車）→ ガラス美術館 13:45 → 歩11 → 城址公園 14:56 → 歩10 → 高志の国文学館 15:51〜16:31
 *   滞在はどれも、もとより短い（美術館 90→80、環水公園 60→40、ガラス 90→60、城址 75→45、文学館 80→40）
 * 2日目: 中島閘門→カナル会館 OSRM 9分＋駐車で14分（10→14）、歩き（foot）カナル会館→森家 731m・10分（8→10）、森家→諏訪神社 6分（5→6）、諏訪神社→馬場家 6分（5→6）、
 *   馬場家→展望台 5分（3→5）、展望台→岩瀬浜駅 818m・11分（13→11）。岩瀬大町通り 120→112分で合わせ、岩瀬浜 15:39〜16:34 は今と同じ
 * 文: 各スポットの書き出しに分数を入れる（itinerary-rules 145）。「おすすめ」「ください」4か所を直す。宿の一文・2日目の行き方・帰りの一文
 * 座標（itinerary-rules 7章）: いまの点は地理院の番地（町名だけの点を含む）。OSM に名前の点があるので OSM にする:
 *   富山県美術館 way 522869869／環水公園 → メモにある node 10968875309「天門橋」／ガラス美術館 node 3769895563／高志の国文学館 way 540892146／中島閘門 node 3464122747（いまは約270m離れた町名の点）／
 *   カナル会館 way 204774856／岩瀬大町通り → メモにある「森家」way 405996745（いまは手で丸めた値）／岩瀬諏訪神社 → node 9655780654「岩瀬諏訪神社」（いまは約250m西の手で丸めた値）／
 *   馬場家 → node 9655821249「登録有形文化財 旧馬場家住宅」／富山港展望台 node 4081203436（いまは約300m離れた町名の点）／岩瀬浜 → メモの「岩瀬浜駅のすぐそば」の node 2519603002「岩瀬浜駅」（7章(b)。浜の名前の点はない）
 *   富山城址公園 → メモにある模擬天守の way 198247843「富山市郷土博物館」の Nominatim 値（公園の中心は使わない。itinerary-rules 371）。岩瀬浜は駅の点（メモが駅のそば。361）
 * タイトル・説明文・季節は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-168-2cc9028d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2cc9028d-6456-4f57-8ed1-9bbe7496e754";
const DAY1_ID = "de6dfa7b-1a25-47c3-996e-335257fb0505";
const DAY2_ID = "e4284b3c-2387-480a-91ea-f0946ffddff7";
const TAD = "a13e47b9-38e8-4db7-bea3-d35bf1f2895f";
const KANSUI = "e55af058-bf5a-4483-8eab-129602dd93d8";
const GLASS = "40af1a68-5088-4a77-97cd-7a4080f4047b";
const JOSHI = "bd5a87d7-14a1-4f9c-9015-54ed667caacd";
const KOSHI = "7e0a630f-a457-44ba-88f7-2a927440eff2";
const KOMON = "34f980f1-4f13-41a3-9ba2-6852b6ce2d70";
const CANAL = "09248ea0-4523-4249-9806-e39518ee0988";
const OMACHI = "ee6723ff-e5e2-450a-95a3-abd5f508afd0";
const SUWA = "28ad23bb-912d-4f37-a4d9-2caf52a4438f";
const BABA = "091d4b15-5c6b-4848-b5ba-b29c6e4290d2";
const TENBO = "35fe110f-7569-4ab3-ad53-e2919cabd96b";
const IWASEHAMA = "9dc7b1e2-7100-405e-babe-08b0498430d3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TAD]: [
    {
      from: "本日は、富山県美術館からスタートです。",
      to: "この旅は車でめぐります。JR富山駅に11時ごろ着いたら、駅の近くでレンタカーを借りて（手続きに15分ほど）、車で約8分。本日は、富山県美術館からスタートです。",
    },
    { from: "美術鑑賞とあわせて、建築や眺望まで存分に味わいましょう。", to: "美術鑑賞とあわせて、建築や眺望まで存分に味わいましょう。館内のレストラン・カフェで昼食にしましょう。" },
  ],
  [KANSUI]: [
    { from: "富山県美術館を見学したら、歩いて富岩運河環水公園へ向かいましょう。", to: "富山県美術館を見学したら、歩いて約5分の富岩運河環水公園へ向かいましょう。" },
    { from: "運河を望むテラス席でひと休みするのもおすすめです。", to: "運河を望むテラス席もあります。" },
    { from: "見学を終えたら、車で富山市ガラス美術館へ向かいましょう。", to: "見学を終えたら、美術館の駐車場の車に戻り、富山市ガラス美術館へ向かいましょう。" },
  ],
  [GLASS]: [
    {
      from: "富岩運河環水公園を見学したら、車で富山市ガラス美術館へ向かいましょう。",
      to: "富岩運河環水公園を見学したら、歩いて約5分で車に戻り、車で約12分の富山市ガラス美術館へ向かいましょう。",
    },
  ],
  [JOSHI]: [{ from: "富山市ガラス美術館を見学したら、歩いて富山城址公園へ向かいましょう。", to: "富山市ガラス美術館を見学したら、歩いて約11分の富山城址公園へ向かいましょう。" }],
  [KOSHI]: [
    { from: "富山城址公園を見学したら、歩いて高志の国文学館へ向かいましょう。", to: "富山城址公園を見学したら、歩いて約10分の高志の国文学館へ向かいましょう。" },
    { from: "今夜はこの近くの宿にご宿泊ください。", to: "この夜は、富山駅のあたりの宿に泊まりましょう。" },
  ],
  [KOMON]: [{ from: "2日目は、中島閘門からスタートです。", to: "2日目は、宿から車で約11分、中島閘門からスタートです。" }],
  [CANAL]: [{ from: "中島閘門を見学したら、車で岩瀬カナル会館へ向かいましょう。", to: "中島閘門を見学したら、車で約14分の岩瀬カナル会館へ向かいましょう。" }],
  [OMACHI]: [
    { from: "岩瀬カナル会館を見学したら、歩いて岩瀬大町通りへ向かいましょう。", to: "岩瀬カナル会館を見学したら、歩いて約10分の岩瀬大町通りへ向かいましょう。" },
    { from: "再開の時期は公式サイトで確かめてください。", to: "再開の時期は公式サイトで確かめましょう。" },
    { from: "港町ならではの落ち着いた町並みを、歩いてみてください。", to: "港町ならではの落ち着いた町並みを、歩いてみましょう。" },
  ],
  [SUWA]: [{ from: "岩瀬大町通りを散策したら、歩いて岩瀬諏訪神社へ向かいましょう。", to: "岩瀬大町通りを散策したら、歩いて約6分の岩瀬諏訪神社へ向かいましょう。" }],
  [BABA]: [
    { from: "岩瀬諏訪神社を参拝したら、歩いて馬場家へ向かいましょう。", to: "岩瀬諏訪神社を参拝したら、歩いて約6分の馬場家へ向かいましょう。" },
    { from: "詳しくは現地で確かめてください。", to: "詳しくは現地で確かめましょう。" },
  ],
  [TENBO]: [{ from: "馬場家を見学したら、歩いて富山港展望台へ向かいましょう。", to: "馬場家を見学したら、歩いて約5分の富山港展望台へ向かいましょう。" }],
  [IWASEHAMA]: [
    { from: "富山港展望台を見学したら、歩いて岩瀬浜へ向かいましょう。", to: "富山港展望台を見学したら、歩いて約11分の岩瀬浜へ向かいましょう。" },
    {
      from: "富山県美術館と岩瀬の街並み、港町富山を巡る旅は、これで終わりです。",
      to: "富山県美術館と岩瀬の街並み、港町富山を巡る旅は、これで終わりです。帰りは、岩瀬カナル会館のそばの車に戻り、車で約20分の富山駅へ向かって、レンタカーを返しましょう。",
    },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: TAD, h: 11, m: 23, stay: 80, legs: [] },
  { id: KANSUI, h: 12, m: 48, stay: 40, legs: [walk(5)] },
  { id: GLASS, h: 13, m: 45, stay: 60, legs: [walk(5), car(12)] },
  { id: JOSHI, h: 14, m: 56, stay: 45, legs: [walk(11)] },
  { id: KOSHI, h: 15, m: 51, stay: 40, legs: [walk(10)] },
];
const DAY2: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: KOMON, h: 9, m: 0, stay: 60, legs: [] },
  { id: CANAL, h: 10, m: 14, stay: 60, legs: [car(14)] },
  { id: OMACHI, h: 11, m: 24, stay: 112, legs: [walk(10)] },
  { id: SUWA, h: 13, m: 22, stay: 30, legs: [walk(6)] },
  { id: BABA, h: 13, m: 58, stay: 55, legs: [walk(6)] },
  { id: TENBO, h: 14, m: 58, stay: 30, legs: [walk(5)] },
  { id: IWASEHAMA, h: 15, m: 39, stay: 55, legs: [walk(11)] },
];

const COORDS: { id: string; from: [number, number]; to: [number, number] }[] = [
  { id: TAD, from: [36.711494, 137.211365], to: [36.710852, 137.210183] },
  { id: KANSUI, from: [36.708549, 137.21376], to: [36.709203, 137.212156] },
  { id: GLASS, from: [36.688713, 137.214706], to: [36.688346, 137.214941] },
  { id: JOSHI, from: [36.693214, 137.20842], to: [36.692753, 137.211466] },
  { id: KOSHI, from: [36.695053, 137.206284], to: [36.695502, 137.206391] },
  { id: KOMON, from: [36.724026, 137.222046], to: [36.725629, 137.219688] },
  { id: CANAL, from: [36.759396, 137.234406], to: [36.760139, 137.233597] },
  { id: OMACHI, from: [36.7575, 137.229], to: [36.756841, 137.228613] },
  { id: SUWA, from: [36.758, 137.2295], to: [36.758564, 137.232367] },
  { id: BABA, from: [36.756874, 137.228348], to: [36.757094, 137.22872] },
  { id: TENBO, from: [36.755455, 137.227905], to: [36.758094, 137.227551] },
  { id: IWASEHAMA, from: [36.761356, 137.23671], to: [36.761506, 137.233904] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== PLAN.map((p) => p.id).join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== DAY2.map((p) => p.id).join()) throw new Error("2日目の構成が想定と違います");
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
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
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
