/**
 * 初日・最終日の見直し #128 62be3b8a「中禅寺湖と華厳の滝、奥日光の絶景自然を満喫する1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（7か所）: 華厳の滝 9:30 → 中宮祠 → 中禅寺湖のほとり（昼食）→ 遊覧船 → イタリア大使館別荘 → 英国大使館別荘 → 立木観音 15:41〜16:31
 * 直した初日（7か所のまま）: 日光駅に10時半ごろ → バスで中宮祠 11:25 → 中禅寺湖のほとり（昼食）→ 遊覧船 → イタリア大使館別荘 → 英国大使館別荘 → 立木観音 → 華厳の滝 16:03〜16:43 → 中禅寺温泉の宿
 *   説明文に7か所すべてが出てくるので、外さずに順番を変える（華厳の滝を最後にする。中禅寺温泉のバス停のそばで、宿にも近い）
 *   入口と1か所目（企画運営 10/29）: 駅から遠いので、入口に10時半ごろ着く形にした。東武日光駅・JR日光駅から湯元温泉行きのバスで約53分、「二荒山神社中宮祠」から歩いて1分
 *     出典: rurubu.jp/andmore/spot/80006821（東武日光駅・JR日光駅から東武バスで53分、二荒山神社中宮祠バス停から徒歩1分）
 *   閉まる時刻（季節は春・夏・秋なので11月も入る。決まり7）:
 *     立木観音 4〜10月 8:00〜17:00、11月 8:00〜16:00、受付は30分前まで（fun-japan.jp/tw/articles/10248。輪王寺の公式 rinnoji.or.jp/information.html は中禅寺だけの時刻を書いていない）→ 15:13 に着く（法務 10/29: 受付の締め切りに余裕を持たせるため英国大使館別荘を縮めた）
 *     イタリア・英国大使館別荘記念公園 5/1〜11/10 は17:00まで、4月と11/11〜30 は16:00まで（pref.tochigi.lg.jp/d04/27eikoku/kaienbi.html）→ 14:53 に出る
 *     中宮祠 4〜10月 8:00〜17:00、11〜3月 9:00〜16:00（tenki.jp/leisure/3/12/58/45402/。rurubu は11・3月は9〜16時。公式 futarasan.jp は開けなかった）→ 11:25〜11:55
 *     華厳の滝のエレベーター 3/1〜11/30 8:00〜17:00（公式 kegon.jp/info/）→ 16:03 に着く
 *   立木観音→華厳の滝は、道のりで約1.6km（OSRM）なので歩いて約20分
 *   移動の時間は延ばさず、滞在を短くした（中宮祠 40→30分、昼食 50→45分、イタリア 60→35分、英国 60→25分、立木観音 50→30分、華厳の滝 50→40分）
 * 説明文: 1日目の順番に合わせて「華厳滝と男体山のふもとの二荒山神社中宮祠から、…立木観音をめぐって中禅寺温泉に泊まります」を直す。タイトルはそのまま
 * 企画運営 10/29: 中宮祠の書き出しに紅葉のころのいろは坂の混雑の一文を足した
 * prayer-check の2件（中禅寺湖のほとり（昼食）・遊覧船）は誤検知（祈りの場ではない。名前の「中禅寺」に当たったもの）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-128-62be3b8a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "62be3b8a-f393-4595-b524-bf4e5fc2e9ed";
const DAY1_ID = "63755d73-2d79-46e2-8012-4255fcd056a5";
const KEGON = "cc82836a-12c1-49cd-9198-e2d4b34ac48e";
const CHUGUSHI = "598c346c-d57c-4bbb-92fe-4acb2835035f";
const LUNCH = "ac2aeb2b-b2a7-4774-96cc-996f6b6ae018";
const BOAT = "cd3ed8c8-faa8-4625-83f9-9a56e3b988e4";
const ITALY = "2a8f2cdd-9fae-47d4-93be-d0d8b3841e44";
const BRITISH = "37b4dfa4-55f9-4e11-92b2-3684b91beaef";
const TACHIKI = "cfb23202-190e-439a-b36c-85f59e4c9033";
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

const DESC_FROM = "1日目は、華厳滝と男体山のふもとの二荒山神社中宮祠から、遊覧船で中禅寺湖を渡り、国際避暑地の歴史を伝えるイタリアと英国の大使館別荘記念公園、立木観音をめぐって中禅寺温泉に泊まります。";
const DESC_TO = "1日目は、男体山のふもとの二荒山神社中宮祠から、遊覧船で中禅寺湖を渡り、国際避暑地の歴史を伝えるイタリアと英国の大使館別荘記念公園、立木観音をめぐって、華厳滝を見てから中禅寺温泉に泊まります。";

const STAY_LINES = "この日は、中禅寺温泉の宿に泊まりましょう。中禅寺温泉のお湯は、湯元温泉から12km余りを引いてきたものです。宿のお風呂では、ほかの人を写さず、長湯を避けて、こまめに水分をとりましょう。";
const KEGON_LAST = "初夏には滝のまわりをイワツバメが飛び交い、冬には「十二滝」と呼ばれる細い小滝が凍って、滝全体が青い氷に彩られます。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [CHUGUSHI]: [
    {
      from: "華厳滝から湖沿いに西へ歩いて約18分。",
      to: "この旅はバスと船、歩きでめぐります。東武日光駅かJR日光駅に10時半ごろ着いたら、湯元温泉行きのバスでいろは坂を上り、約53分の「二荒山神社中宮祠」で降りて、すぐの神社から旅を始めます。バスの時刻は公式の案内で確かめましょう。紅葉のころは、いろは坂が混んで、バスが大きく遅れることがあります。",
    },
  ],
  [TACHIKI]: [{ from: STAY_LINES, to: "この後は、歌ヶ浜を戻り、華厳滝へ歩いて約20分。" }],
  [KEGON]: [
    {
      from: "この旅はバスと船、歩きでめぐります。東武日光駅かJR日光駅から中禅寺温泉行きのバスでいろは坂を上り、約50分。バス停から歩いて約5分。",
      to: "立木観音から歌ヶ浜を戻り、湖の東の端へ歩いて約20分。",
    },
    { from: KEGON_LAST, to: KEGON_LAST + "エレベーターの時間は季節で変わるので、公式の案内で確かめましょう。" + STAY_LINES },
  ],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: CHUGUSHI, h: 11, m: 25, stay: 30, legs: [] },
  { id: LUNCH, h: 12, m: 5, stay: 45, legs: [walk(10)] },
  { id: BOAT, h: 12, m: 55, stay: 10, legs: [walk(5)] },
  { id: ITALY, h: 13, m: 48, stay: 35, legs: [{ mode: "other", min: 40, line: "中禅寺湖遊覧船" }, walk(3)] },
  { id: BRITISH, h: 14, m: 28, stay: 25, legs: [walk(5)] },
  { id: TACHIKI, h: 15, m: 13, stay: 30, legs: [walk(20)] },
  { id: KEGON, h: 16, m: 3, stay: 40, legs: [walk(20)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [KEGON, CHUGUSHI, LUNCH, BOAT, ITALY, BRITISH, TACHIKI].join()) throw new Error("1日目の構成が想定と違います");
  const italyLeg = d1.spots.find((s) => s.id === ITALY)!.transitLegs[0];
  if (italyLeg?.transitMode !== "other" || italyLeg.transitLine !== "中禅寺湖遊覧船") throw new Error("遊覧船の区間が想定と違います");
  if (!it.description?.includes(DESC_FROM)) throw new Error("説明文の置き換え元が見つかりません");
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
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min + (l.line ? `(${l.line})` : "")).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n説明文: ${it.description.replace(DESC_FROM, DESC_TO)}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO) } });
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx });
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
