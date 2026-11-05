/**
 * 1a32349e(港の見える丘公園と元町、異国情緒あふれる横浜1泊2日)の2日目の直し(2026-11-05、しおりえ(制作補助2))。
 * docs/specs/20261105-facility-rework.md(会社・店の施設を行き先にしない)。企画運営の指示: カップヌードルミュージアムの置きかえと、館内の昼食の置きかえだけ。
 * - カップヌードルミュージアム 横浜(1社の体験施設。館内で昼食)を外し、昼食を「万国橋のあたりで昼食」(バス停「万国橋・ワールドポーターズ前」
 *   node2299117932 35.4523771,139.6392295。380行の順でバス停。スポットの名前は橋の名前にし、建物の名前は書かない)に置きかえる
 * - 区間(routing.openstreetmap.de routed-foot): 赤レンガ倉庫→昼食 562.2秒で歩10、昼食→横浜美術館 1064.0秒で歩18
 * - 時刻: 昼食 12:24・45。横浜美術館から後は 13分早くなる(13:40→13:27 …、終わり 16:57→16:44。1泊2日の最終日で、もとより遅くしない・16:30〜17:00 の中)
 * - メモ: 赤レンガ倉庫の結び、横浜美術館の書き出しを直す
 * - 法務(11/05 20:26)・企画運営の頼みで、同じ台本で言いかえ(事実は足さない・時刻は変えない):
 *   説明文の「定番の」「おしゃれな」を外す。1日目 元町商店街の「人気の」「洗練された」と、明治7年・ハマトラの文を元町の公式 https://www.motomachi.or.jp/history/ に合わせる、山手西洋館の「飽きません」「効率よく回れます」、
 *   2日目 象の鼻パークの「絶好のビューポイント」を言いかえる。横浜赤レンガ倉庫は344行の町並みの例外で「横浜赤レンガ倉庫のあたり」に改名し、
 *   「商業・文化施設…ショップやレストランが並ぶ姿」を「2000年から2002年にかけて内部が改修され、2002年に今の赤レンガ倉庫として開かれました」に(横浜市の赤レンガ倉庫の年表
 *   https://www.city.yokohama.lg.jp/kanko-bunka/minato/taikan/asobu/spot/red-renga/rekishi/history.html の2002年の開館)。
 *   点は tourism=attraction の名前つきの点 node10216454044 のまま。前後の文の名前も合わせる
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-yokohama-1a32349e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_PREFIX = "1a32349e";
const DAY_ID = "d75d5d6a-2f74-4477-9ff4-56ce5fbc0ee0";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (d: Date | null) => (d ? d.toISOString().slice(11, 16) : "--:--");
type Leg = { orderNo: number; transitMode: string; transitDurationMin: number };
const legs = (...xs: [string, number][]): Leg[] => xs.map(([mode, min], i) => ({ orderNo: i + 1, transitMode: mode, transitDurationMin: min }));
const L = (...xs: [string, number][]) => ({ deleteMany: {}, create: legs(...xs) });
const C = (...xs: [string, number][]) => ({ create: legs(...xs) });

// 2日目の今の並び [id, 名前, 着, 滞在, 区間]
const NOW: [string, string, string, number, string][] = [
  ["2d7d31f0-0b9a-4cac-a5cc-5a563b24323b", "大さん橋", "09:00", 25, ""],
  ["5100c4e6-f5c0-4147-92e7-f3d1162c5027", "象の鼻パーク", "09:36", 25, "walk11"],
  ["6b7c3cd7-8f97-4f10-a626-47c646e90b48", "横浜市開港記念会館", "10:09", 20, "walk8"],
  ["7ad84103-e6af-484a-ac5d-d8fc6df553b1", "神奈川県立歴史博物館", "10:38", 30, "walk9"],
  ["f0445e67-7fd0-4850-b3b2-3e10cee90e24", "横浜赤レンガ倉庫", "11:24", 50, "walk16"],
  ["aea607b4-c6f1-4659-844d-787b362b63cd", "カップヌードルミュージアム 横浜", "12:25", 60, "walk11"],
  ["9d566d0f-3838-4903-9e11-31d7a7d51751", "横浜美術館", "13:40", 60, "walk15"],
  ["5f8e669d-7618-4975-8cc0-f025bc6d25f2", "ドックヤードガーデン", "14:47", 20, "walk7"],
  ["491c9f6b-c202-490a-9893-c8d340bcd990", "帆船日本丸", "15:11", 30, "walk4"],
  ["ce5b39ba-6a08-4ce0-99f5-9cf1a0928821", "横浜みなと博物館", "15:45", 50, "walk4"],
  ["8ab3eeb1-2921-42a4-86d3-cdb42e164864", "汽車道", "16:37", 20, "walk2"],
];
const CUPNOODLE = NOW[5][0];
const REDBRICK = NOW[4][0];
const MUSEUM = NOW[6][0];
const RB_FROM = "この後は、歩いておよそ11分、カップヌードルミュージアム横浜へ向かいましょう。";
const RB_TO = "この後は、歩いておよそ10分、万国橋のあたりへ向かいましょう。";
const MU_FROM = "カップヌードルミュージアム横浜から歩いておよそ15分、";
const MU_TO = "万国橋のあたりから歩いておよそ18分、";
const LUNCH =
  "横浜赤レンガ倉庫のあたりから歩いておよそ10分、万国橋のあたりに着きます。このあたりで昼食にしましょう。この後は、歩いておよそ18分、横浜美術館へ向かいましょう。";

// 法務(11/05 20:26)・企画運営の頼みで、同じ台本で直す文(言いかえだけ。事実は足さない・時刻は変えない)
const RB_NAME_OLD = "横浜赤レンガ倉庫";
const RB_NAME_NEW = "横浜赤レンガ倉庫のあたり"; // 344行の町並みの例外。点は tourism=attraction node10216454044 のまま
const DESC_REPS: [string, string][] = [["定番のみなとみらいから少し足を延ばして、洋館が残る山手エリアと、おしゃれな元町商店街を巡る、", "みなとみらいから少し足を延ばして、洋館が残る山手エリアと元町商店街を巡る、"]];
const MOTOMACHI = "836e5d24-66c7-4948-a3bc-1e48c2d17ec5";
const YAMATE = "5b5656a0-9850-4926-b6b1-d5b66465ddaf";
const ZOU = NOW[1][0];
const HISTMUSEUM = NOW[3][0];
const REPS: Record<string, [string, string][]> = {
  [MOTOMACHI]: [
    [
      "花屋や洋服屋、婦人帽子屋、西洋家具屋、パン屋といった、外国人向けの商売が自然と増えていきました。",
      "外国人向けの商売を始める人が自然と増え、大正のはじめには、花屋や洋服屋、婦人帽子屋、西洋家具屋、パン屋などが並ぶ町になりました。",
    ],
    [
      "そうした異国情緒あふれる歴史を背景に、1970年代から80年代には女子大生に人気のファッション『ハマトラ』の発祥地としても知られるようになりました。",
      "やがて、山手の女子学生たちの装いが雑誌で『ハマトラ』と名づけて紹介され、その流行で元町は全国に知られるようになりました。",
    ],
    ["今も洗練された洋品店やカフェが並ぶ通りを、", "今も洋品店や飲食店が並ぶ通りを、"],
  ],
  [YAMATE]: [
    ["当時の暮らしぶりの違いが見えてきて飽きません。", "当時の暮らしぶりの違いが見えてきます。"],
    ["事前に見学したい建物を決めておくと効率よく回れます。", "事前に見学したい建物を決めておきましょう。"],
  ],
  [ZOU]: [["横浜港を象徴する景色を360度見渡せる、絶好のビューポイントです。", "横浜港を象徴する景色を360度見渡せる場所です。"]],
  [HISTMUSEUM]: [["この後は、歩いておよそ16分、横浜赤レンガ倉庫へ向かいましょう。", "この後は、歩いておよそ16分、横浜赤レンガ倉庫のあたりへ向かいましょう。"]],
  [REDBRICK]: [
    ["神奈川県立歴史博物館から歩いておよそ16分、横浜赤レンガ倉庫に着きます。", "神奈川県立歴史博物館から歩いておよそ16分、横浜赤レンガ倉庫のあたりに着きます。"],
    ["そして2002年、商業・文化施設として生まれ変わり、今のようにショップやレストランが並ぶ姿になりました。", "そして2000年から2002年にかけて内部が改修され、2002年に今の赤レンガ倉庫として開かれました。"],
  ],
};

const count = (s: string, sub: string) => s.split(sub).length - 1;
function applyReps(memo: string, reps: [string, string][], name: string) {
  for (const [a, b] of reps) {
    if (count(memo, a) !== 1) throw new Error(`${name}: 直す文が1か所ではありません「${a}」(${count(memo, a)})`);
    memo = memo.replace(a, b);
  }
  return memo;
}

async function main() {
  const spots = await prisma.spot.findMany({
    where: { dayId: DAY_ID },
    orderBy: { orderNo: "asc" },
    select: { id: true, name: true, visitTime: true, stayDurationMin: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { orderBy: { orderNo: "asc" }, select: { transitMode: true, transitDurationMin: true } }, photos: { select: { id: true } } },
  });
  if (!spots.length || !spots[0].day.itineraryId.startsWith(ITIN_PREFIX)) throw new Error("日が想定と違います");
  const now = spots.map((s) => [s.id, s.name, hm(s.visitTime), s.stayDurationMin, s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+")]);
  if (JSON.stringify(now) !== JSON.stringify(NOW)) throw new Error(`2日目が想定と違います: ${JSON.stringify(now)}`);
  if (spots.find((s) => s.id === CUPNOODLE)!.photos.length) throw new Error("外すスポットに写真があります");
  const rb = spots.find((s) => s.id === REDBRICK)!, mu = spots.find((s) => s.id === MUSEUM)!;
  if (count(rb.memo ?? "", RB_FROM) !== 1 || count(mu.memo ?? "", MU_FROM) !== 1) throw new Error("直す文が想定と違います");
  if (rb.name !== RB_NAME_OLD) throw new Error("赤レンガ倉庫の名前が想定と違います");
  const rbMemo = applyReps((rb.memo ?? "").replace(RB_FROM, RB_TO), REPS[REDBRICK], "赤レンガ倉庫");
  const muMemo = (mu.memo ?? "").replace(MU_FROM, MU_TO);
  const zouMemo = applyReps(spots.find((s) => s.id === ZOU)!.memo ?? "", REPS[ZOU], "象の鼻パーク");
  const histMemo = applyReps(spots.find((s) => s.id === HISTMUSEUM)!.memo ?? "", REPS[HISTMUSEUM], "神奈川県立歴史博物館");
  if ([rbMemo, muMemo, LUNCH].some((m) => m.includes("カップヌードル"))) throw new Error("カップヌードルが残ります");
  // 1日目の2か所と説明文
  const it = await prisma.itinerary.findUnique({ where: { id: spots[0].day.itineraryId }, select: { id: true, description: true } });
  const descNew = applyReps(it!.description ?? "", DESC_REPS, "説明文");
  const day1: { id: string; name: string; memo: string }[] = [];
  for (const id of [MOTOMACHI, YAMATE]) {
    const s = await prisma.spot.findUnique({ where: { id }, select: { name: true, memo: true, day: { select: { itineraryId: true, dayNumber: true } } } });
    if (!s || s.day.itineraryId !== it!.id || s.day.dayNumber !== 1) throw new Error(`1日目のスポットが想定と違います ${id}`);
    day1.push({ id, name: s.name, memo: applyReps(s.memo ?? "", REPS[id], s.name) });
  }
  const left = [descNew, rbMemo, zouMemo, histMemo, ...day1.map((d) => d.memo)].join("").match(/定番|おしゃれ|人気|洗練|飽き|効率よく|絶好|ショップ|レストラン/g);
  if (left) throw new Error(`直したあとに残る言葉: ${left}`);
  console.log(`説明文 → ${descNew}`);
  for (const d of day1) console.log(`■ 1日目 ${d.name}(言いかえ)\n  メモ: ${d.memo}`);

  const keep = (i: number): SpotOrderItem => ({ id: NOW[i][0], data: {} });
  const items: { label: string; item: SpotOrderItem }[] = [
    { label: "大さん橋(そのまま)", item: keep(0) },
    { label: "象の鼻パーク(「絶好のビューポイント」を言いかえ)", item: { id: ZOU, data: { memo: zouMemo } } },
    { label: "横浜市開港記念会館(そのまま)", item: keep(2) },
    { label: "神奈川県立歴史博物館(結びの行き先の名前だけ)", item: { id: HISTMUSEUM, data: { memo: histMemo } } },
    { label: "横浜赤レンガ倉庫のあたり(改名。344行の町並みの例外。店の文を外す。結びを直す)", item: { id: REDBRICK, data: { name: RB_NAME_NEW, memo: rbMemo } } },
    { label: "万国橋のあたりで昼食(新規。バス停 node2299117932)", item: { create: { name: "万国橋のあたりで昼食", lat: "35.452377", lng: "139.63923", visitTime: T(12, 24), stayDurationMin: 45, memo: LUNCH, transitLegs: C(["walk", 10]) } } },
    { label: "横浜美術館(13:40→13:27、歩15→歩18、書き出しを直す)", item: { id: MUSEUM, data: { visitTime: T(13, 27), memo: muMemo, transitLegs: L(["walk", 18]) } } },
    { label: "ドックヤードガーデン(14:47→14:34)", item: { id: NOW[7][0], data: { visitTime: T(14, 34) } } },
    { label: "帆船日本丸(15:11→14:58)", item: { id: NOW[8][0], data: { visitTime: T(14, 58) } } },
    { label: "横浜みなと博物館(15:45→15:32)", item: { id: NOW[9][0], data: { visitTime: T(15, 32) } } },
    { label: "汽車道(16:37→16:24。終わり 16:44)", item: { id: NOW[10][0], data: { visitTime: T(16, 24) } } },
  ];
  for (const { label, item } of items) {
    const d = ("id" in item ? item.data : item.create) as Record<string, unknown>;
    const cur = "id" in item ? spots.find((s) => s.id === item.id) : undefined;
    const vt = d.visitTime instanceof Date ? hm(d.visitTime) : hm(cur?.visitTime ?? null);
    const st = (d.stayDurationMin as number | undefined) ?? cur?.stayDurationMin;
    const lg = d.transitLegs as { create?: Leg[] } | undefined;
    const ls = lg?.create ? lg.create.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") : cur ? cur.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+") || "(なし)" : "";
    console.log(`■ ${label}\n  着 ${vt}／滞在 ${st}／区間 ${ls}${d.lat ? `／点 ${d.lat},${d.lng}` : ""}${d.memo ? `\n  メモ: ${d.memo}` : ""}`);
  }
  console.log("■ [外す] カップヌードルミュージアム 横浜(写真なし)\n\n  11:24+50+10=12:24 昼食、+45+18=13:27 横浜美術館。終わり 汽車道 16:24+20=16:44");
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: it!.id }, data: { description: descNew } });
      for (const d of day1) await tx.spot.update({ where: { id: d.id }, data: { memo: d.memo } });
      await setDaySpotOrder(DAY_ID, items.map((r) => r.item), { tx, remove: [CUPNOODLE] });
    },
    { timeout: 60000 }
  );
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
