/**
 * 初日・最終日の見直し #132 d6badcd1「天鼓林と石門、昇仙峡を歩いて上り甲府の町もめぐる1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md）
 * 1泊2日。初日を11時ごろからにする（最終日は1泊2日なので今のまま）
 * いまの初日（9か所）: 長潭橋 9:00 → 天鼓林 → 羅漢寺 → 覚円峰 → 石門 → 仙娥滝 → 影絵の森美術館（昼食）→ ロープウェイ → 水晶街道 16:10〜16:50
 * 直した初日（8か所）: 甲府駅に11時ごろ → 甲府駅のまわり（昼食）11:15 → バスで長潭橋 → 天鼓林 → 覚円峰 → 石門 → 仙娥滝 → ロープウェイ → 水晶街道 16:30〜16:55 → 甲府駅周辺の宿
 *   企画運営 10/29 の答え（案B）: 渓谷の途中には食事の店がなく（OSM で長潭橋のまわり・遊歩道を調べた）、滝上に着くのは14時ごろになるので、
 *     入口の近くの場所（甲府駅のまわりの昼食）を1か所目にする。昼食は11:15に始まる。店の名前は書かない
 *   羅漢寺・昇仙峡 影絵の森美術館は外す（説明文に出てこない。写真なし）
 *   ロープウェイ（決まり7）: 12月〜3月は上り終発16:10・下り終発16:30、4〜11月は上り終発17:10・下り終発17:30、20分おき（gltjp.com/ja/directory/item/16341/。
 *     公式 shousenkyo-r.jp は開けなかった。nap-camp.com/mag/spot/104595 も 12〜3月は16:30まで）→ 15:35 に上り、16:15 に下りる
 *   昼食の座標は OSM の甲府駅 way 226739377（railway=station）の点
 *   天鼓林→覚円峰は、もとの羅漢寺→覚円峰と同じ歩き35分（羅漢寺への寄り道がなくなる分は短くしない）
 *   移動の時間は延ばさず、滞在を短くした（長潭橋 20→15分、天鼓林 30→15分、覚円峰 25→20分、石門 20→15分、仙娥滝 25→20分、ロープウェイ 80→40分、水晶街道 40→25分）
 * 企画運営 10/29: ロープウェイの弥三郎岳の2文（往復40分で行けない）を外す。滝上→甲府駅のバスの冬の最終便は確かめられなかった
 *   （山梨交通の時刻表のページが開けない）ので、水晶街道の最後を「帰りのバスの最終便の時刻を、公式の案内で確かめましょう。」にする（法務 10/29 の文面）。山梨交通 ykbus.jp/route_bus/route_sp_info/shosenkyo/ では滝上発 16:22・17:32 が載っているが、×（土休日運休）・△（冬季）の注記がどの便か読み取れない
 * 説明文: 「昇仙峡を一日かけて歩いて上ります。午後はロープウェイで」→「昇仙峡を歩いて上り、そのあとロープウェイで」。タイトルはそのまま
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-132-d6badcd1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d6badcd1-3d74-443c-acff-931643910c69";
const DAY1_ID = "3e01d47d-6e98-4493-bab3-15a125fa43ac";
const CHOTAN = "952adf7b-f29c-4ad2-ae6c-05fa049fa301";
const TENKO = "a4fb873b-1da8-4959-86fe-625233cad9a3";
const RAKAN = "45966675-c68d-425e-b6d2-a128973ababe";
const KAKUEN = "ab0f65e9-43b7-4ea1-9a6d-fbecae1a465e";
const SEKIMON = "3f165b93-b4a0-428a-a6be-86258e00a8ba";
const SENGA = "3d99e920-75b8-4ce6-8503-17b0ec37153a";
const KAGEE = "6e586c96-b4c6-4cc7-8320-9be11bf08e68";
const ROPEWAY = "fda3e0e6-c156-45b9-b4ff-37f148fbdd84";
const SUISHO = "56ba6813-df24-4e24-b44a-8882d0582a83";
const COMMIT = process.argv.includes("--commit");
// 冬（12〜2月ごろ）は滝上から甲府駅へのバスがない（NAVITIME 2027-01-13 は滝上発の便がなく、天神森まで歩いて1時間）ので、季節から冬を外す（企画運営 10/29）
const SEASONS = ["spring", "summer", "autumn"] as const;
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const other = (min: number) => ({ mode: "other" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const DESC_FROM = "長潭橋から仙娥滝まで昇仙峡を一日かけて歩いて上ります。午後はロープウェイで山上のパノラマ台へ。";
const DESC_TO = "長潭橋から仙娥滝まで昇仙峡を歩いて上り、そのあとロープウェイで山上のパノラマ台へ。";

const LUNCH_MEMO =
  "この旅はバスと歩き、ロープウェイでめぐります。甲府駅に11時ごろ着いたら、駅のまわりで昼食にしましょう。昇仙峡の渓谷を歩く途中では食事がとりにくいので、ここで食べてから向かいます。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [CHOTAN]: [
    { from: "甲府駅南口のバスターミナルから山梨交通バスで約30分、昇仙峡口で降りてすぐです。", to: "昼食のあと、甲府駅南口のバスターミナルから山梨交通バスで約30分、昇仙峡口で降りてすぐです。バスの時刻は公式の案内で確かめましょう。" },
    { from: "今日はこの渓谷を一日かけて歩いて上ります。", to: "ここから、この渓谷を歩いて上ります。" },
  ],
  [KAKUEN]: [{ from: "羅漢寺から遊歩道をさらに上ると", to: "天鼓林から遊歩道をさらに上ると" }],
  [SUISHO]: [{ from: "便が多くないので、帰りの時刻は公式の時刻表で確かめておきましょう。", to: "帰りのバスは本数が少ないので、最終便の時刻を公式の案内で確かめましょう。冬から春先にかけては、滝上を夕方に出るバスがないことがあります。" }],
  [ROPEWAY]: [
    { from: "時間に余裕があれば、羅漢寺山の頂・弥三郎岳まで歩いてみましょう。片道20分ほどです。", to: "" },
    { from: "弥三郎岳の頂上付近は岩場なので、歩きやすい靴で、無理をせず足元に気をつけて。", to: "" },
    {
      from: "強風などで運休することがあるので、お出かけ前に公式の案内を確かめてください。",
      to: "冬は運転の終わる時刻が早くなり、強風などで運休することもあるので、お出かけ前に公式の案内を確かめましょう。",
    },
  ],
};

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true, transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [CHOTAN, TENKO, RAKAN, KAKUEN, SEKIMON, SENGA, KAGEE, ROPEWAY, SUISHO].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === RAKAN || x.id === KAGEE)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
  if (!it.description?.includes(DESC_FROM)) throw new Error("説明文の置き換え元が見つかりません");
  const memoOf = (id: string) => {
    let m = d1.spots.find((s) => s.id === id)!.memo ?? "";
    for (const e of MEMO_EDITS[id] ?? []) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    return m;
  };
  const ex = (id: string, h: number, m: number, stay: number, legs: Leg[]) => ({ id, data: { ...timeLegs(h, m, stay, legs), ...(MEMO_EDITS[id] ? { memo: memoOf(id) } : {}) } });
  // ロープウェイ・水晶街道の移動は、もとの区間（other 15分）をそのまま使う
  const DAY1 = [
    {
      create: {
        name: "甲府駅のまわり（昼食）",
        ...timeLegs(11, 15, 40, []),
        transitLegs: undefined,
        lat: 35.66738,
        lng: 138.569067,
        address: "山梨県甲府市丸の内",
        memo: LUNCH_MEMO,
      },
    },
    ex(CHOTAN, 12, 25, 15, [bus(30, "山梨交通バス（甲府駅南口→昇仙峡口）")]),
    ex(TENKO, 13, 20, 15, [walk(40)]),
    ex(KAKUEN, 14, 10, 20, [walk(35)]),
    ex(SEKIMON, 14, 40, 15, [walk(10)]),
    ex(SENGA, 15, 0, 20, [walk(5)]),
    ex(ROPEWAY, 15, 35, 40, [other(15)]),
    ex(SUISHO, 16, 30, 25, [other(15)]),
  ];
  console.log("\n1日目（直したあと）");
  let prevEnd = -1;
  for (const x of DAY1) {
    const d = ("id" in x ? x.data : "create" in x ? x.create : null) as { visitTime: Date; stayDurationMin: number; memo?: string; transitLegs?: { create?: { transitDurationMin: number; transitMode: string; transitLine: string | null }[] } };
    const st = d.visitTime.getUTCHours() * 60 + d.visitTime.getUTCMinutes();
    const legs = d.transitLegs?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const s = "id" in x ? d1.spots.find((y) => y.id === x.id)! : null;
    const name = s ? s.name : "create" in x ? x.create.name : "";
    console.log(`\n${hm(st)}-${hm(st + d.stayDurationMin)} ${legs.map((l) => `${l.transitMode}${l.transitDurationMin}${l.transitLine ? "(" + l.transitLine + ")" : ""}`).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${name}${s ? `（もと ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分 移動${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）` : "（新しく足す）"}${d.memo ? "\n  本文: " + d.memo : "（本文は変えない）"}`);
    prevEnd = st + d.stayDurationMin;
  }
  console.log(`\n外すスポット: ${RAKAN}（羅漢寺）・${KAGEE}（昇仙峡 影絵の森美術館）`);
  console.log(`\n説明文: ${it.description.replace(DESC_FROM, DESC_TO)}`);
  if (it.seasons.join() !== "spring,summer,autumn,winter") throw new Error(`季節が想定と違います: ${it.seasons.join()}`);
  console.log(`\n季節: ${it.seasons.join(",")} → ${SEASONS.join(",")}`);
  console.log("\n2日目は変えない（1泊2日の最終日）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(DESC_FROM, DESC_TO), seasons: [...SEASONS] } });
      await setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [RAKAN, KAGEE] });
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
