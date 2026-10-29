/**
 * 初日・最終日の見直し #124 b461a3e0「雪の山寺と、ガス灯がともる銀山温泉の夜」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日: 山寺 8:30 → 山寺芭蕉記念館 → 大石田町立歴史民俗資料館（昼食）→ 芭蕉・清風歴史資料館 → タクシーで銀山温泉 14:57〜16:32
 * 直した初日（4か所）: 山寺（立石寺）11:00 → 山寺の門前（昼食）→ 山寺芭蕉記念館 → 電車と路線バスで銀山温泉 15:50〜16:40 → 温泉街の宿
 *   大石田町立歴史民俗資料館・芭蕉・清風歴史資料館は外す（2日目は今のままで入れる時間がない）。見どころの山寺・銀山温泉は残す
 *   銀山温泉は冬に共同駐車場が閉まり日帰り客はシャトルバスになる（企画運営・法務 10/26 の指摘）ので、タクシーをやめて大石田駅からの路線バスにする
 *   法務 10/29 19:53: 冬の交通の言い方を出典どおりに弱め、乗りかえの待ちの一文を足した
 * 説明文: 「午後は銀山温泉へ」→「夕方は銀山温泉へ」。タイトルはそのまま
 * 出典: 立石寺 rissyakuji.jp（貞観2年、慈覚大師円仁）・山形市の資料（約1000段）・山形県の観光サイト yamagatakanko.com（1015段）／
 *   山寺芭蕉記念館 city.yamagata-yamagata.lg.jp/shisetsu/bunkasports/1008032/1005880.html（市制施行100周年と芭蕉・おくのほそ道300周年の記念）／
 *   銀山温泉 ginzanonsen.jp/ginzan/historyspa.html（延沢銀山に由来、大正末期〜昭和初期の木造多層の旅館）・city.obanazawa.yamagata.jp/kanko/kankochi/1346
 *   （冬は共同駐車場が閉鎖、日帰り客は大正ろまん館の駐車場からシャトルバス）・ginzanonsen.jp/access/ と同市のページ（大石田駅から路線バス 銀山線）
 * 座標: 昼食は OSM の山寺駅 node 3585108742（railway=station）。ほかは今の座標のまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-124-b461a3e0.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b461a3e0-87c6-48dd-b5e8-886ba0345df7";
const DAY1_ID = "5c704619-9dae-4341-8f20-5fd93f3c205d";
const YAMADERA = "48d424b5-9b19-4766-b351-6a6579a82148";
const BASHO = "53bff0b7-6e99-4111-8c15-c0277a878909";
const OISHIDA = "a665b6d5-0628-49e2-9263-277d3222b7cb";
const SEIFU = "e45e9fcf-db0b-4736-8ee3-74d8a436e81e";
const GINZAN = "50daa482-cf8e-4551-9ac0-eca54c71f578";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const train = (min: number, line: string) => ({ mode: "train" as const, min, line });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });

const DESC_FROM = "1日目は雪をまとった山寺（立石寺）の石段を上り、午後は銀山温泉へ。";
const DESC_TO = "1日目は雪をまとった山寺（立石寺）の石段を上り、夕方は銀山温泉へ。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

// 本文は、今の本文の決まった部分だけを置き換える（ほかの文は変えない）
const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [YAMADERA]: [
    {
      from: "山形駅からJR仙山線でおよそ20分、山寺駅から歩いて5分ほどの立石寺(山寺)からスタートです。",
      to: "山形駅からJR仙山線でおよそ20分。山寺駅に11時ごろ着いたら、歩いて5分ほどの立石寺(山寺)から旅を始めます。",
    },
    { from: "参拝を終えたら、歩いておよそ5分の山寺芭蕉記念館へ向かいましょう。", to: "参拝を終えたら、ふもとの門前で昼食にしましょう。" },
  ],
  [BASHO]: [
    { from: "立石寺を参拝したら、歩いておよそ5分の山寺芭蕉記念館へ向かいましょう。", to: "昼食のあと、歩いておよそ5分の山寺芭蕉記念館へ。" },
    {
      from: "見学を終えたら、山寺駅からJR線を乗り継いで大石田町立歴史民俗資料館へ向かいましょう。",
      to: "見学を終えたら、山寺駅からJR仙山線で山形駅へ戻り、山形新幹線で大石田駅へ。駅から路線バスに乗りかえて、銀山温泉へ向かいましょう（あわせて約2時間）。乗りかえの待ち時間で、もっとかかることがあります。",
    },
  ],
  [GINZAN]: [
    {
      from: "芭蕉・清風歴史資料館を見学したら、タクシーで銀山温泉へ向かいましょう。",
      to: "大石田駅から路線バスで約40分。冬は温泉街の近くの駐車場が閉まり、日帰りの人は離れた駐車場からシャトルバスで向かう形になるので、電車とバスで向かうのが安心です。バスの時刻は公式の案内で確かめましょう。",
    },
  ],
};

const LUNCH_MEMO =
  "立石寺から石段を下り、ふもとへ。山寺駅のあたりで昼食にしましょう。今も人が暮らしている門前町なので、静かに歩きましょう。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [YAMADERA, BASHO, OISHIDA, SEIFU, GINZAN].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === OISHIDA || x.id === SEIFU)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  if (!it.description?.includes(DESC_FROM)) throw new Error("説明文の置き換え元が見つかりません");
  const memo = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id]) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const DAY1 = [
    { id: YAMADERA, data: { ...timeLegs(11, 0, 100, []), memo: memo(YAMADERA) } },
    {
      create: {
        name: "山寺の門前（昼食）",
        ...timeLegs(12, 45, 40, [walk(5)]),
        transitLegs: { create: legsCreate([walk(5)]) },
        lat: 38.3095946,
        lng: 140.434729,
        address: "山形県山形市山寺",
        memo: LUNCH_MEMO,
      },
    },
    { id: BASHO, data: { ...timeLegs(13, 30, 30, [walk(5)]), memo: memo(BASHO) } },
    {
      id: GINZAN,
      data: {
        ...timeLegs(15, 50, 50, [walk(10), train(20, "JR仙山線（山寺→山形）"), train(40, "山形新幹線（山形→大石田）"), bus(40, "路線バス 銀山線（大石田駅→銀山温泉）")]),
        memo: memo(GINZAN),
      },
    },
  ];
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const x of DAY1) {
    const d = ("id" in x ? x.data : x.create) as { visitTime: Date; stayDurationMin: number; memo: string; transitLegs: { create?: { transitDurationMin: number; transitMode: string; transitLine: string | null }[] } };
    const st = d.visitTime.getUTCHours() * 60 + d.visitTime.getUTCMinutes();
    const legs = d.transitLegs.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const name = "id" in x ? d1.spots.find((s) => s.id === x.id)!.name : (x.create as { name: string }).name;
    console.log(`\n${hm(st)}-${hm(st + d.stayDurationMin)} ${legs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? "(" + l.transitLine + ")" : ""}`).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${name}\n  ${d.memo}`);
    prevEnd = st + d.stayDurationMin;
  }
  console.log(`\n外すスポット: ${OISHIDA}（大石田町立歴史民俗資料館）・${SEIFU}（芭蕉・清風歴史資料館）`);
  console.log(`\n説明文: ${it.description.replace(DESC_FROM, DESC_TO)}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO) } });
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [OISHIDA, SEIFU] });
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
