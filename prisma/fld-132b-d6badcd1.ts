/**
 * #132 d6badcd1 の続き（しおりえ(制作補助2)、2026-10-29）: 天鼓林・石門をスポットから外し、前後のスポットのメモの中で紹介する
 *   理由: どちらも OSM・地理院に名前つきの点がなく、まわり300m以内に使える名前つきの地物もない（いちばん近いバス停も約410m・約304m）。
 *   企画運営の答え（案A）: 300mの線は曲げない。タイトルに「天鼓林と石門」があるので、メモの中で名前を出して、もとの中身を書き移す
 *   天鼓林 → 長潭橋のメモの終わりに。石門（と長田円右衛門の碑）→ 仙娥滝のメモの書き出しに
 *   移動: 長潭橋→覚円峰は、もとの長潭橋→天鼓林（歩き40分）＋天鼓林→覚円峰（歩き35分）をあわせた歩き75分。覚円峰→仙娥滝は、もとの10分＋5分で歩き15分（延ばしていない）
 *   滞在: ロープウェイ 40→50分（もとの80分より短い）、水晶街道 25→30分（もとの40分より短い）。影絵の森美術館は戻さない
 *   ロープウェイ: 3月（春）は下り終発16:30（gltjp.com/ja/directory/item/16341/）→ 15:55 に下りる。4〜11月は下り終発17:30
 *   初日の行き先は6か所（甲府駅のまわり（昼食）・長潭橋・覚円峰・仙娥滝・ロープウェイ・水晶街道）。外す2か所に写真なし
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-132b-d6badcd1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d6badcd1-3d74-443c-acff-931643910c69";
const DAY1_ID = "3e01d47d-6e98-4493-bab3-15a125fa43ac";
const LUNCH = "29d7e33d-cc1d-4f48-9108-9d834011dae1";
const CHOTAN = "952adf7b-f29c-4ad2-ae6c-05fa049fa301";
const TENKO = "a4fb873b-1da8-4959-86fe-625233cad9a3";
const KAKUEN = "ab0f65e9-43b7-4ea1-9a6d-fbecae1a465e";
const SEKIMON = "3f165b93-b4a0-428a-a6be-86258e00a8ba";
const SENGA = "3d99e920-75b8-4ce6-8503-17b0ec37153a";
const ROPEWAY = "fda3e0e6-c156-45b9-b4ff-37f148fbdd84";
const SUISHO = "56ba6813-df24-4e24-b44a-8882d0582a83";
const COMMIT = process.argv.includes("--commit");
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

const CHOTAN_LAST = "橋の上から、これから分け入る谷の入口を眺めてから出発しましょう。";
const TENKO_TEXT =
  "遊歩道を40分ほど上ったところには、山梨県の天然記念物に指定されている天鼓林があります。林の中の決まった場所で足を強く踏み鳴らすと、地面の下から鼓を打つような音が返ってくることで知られる林です。こうした音が聞こえる林は、岩盤の固い奥秩父の山々に見られるといわれ、昇仙峡のものはとりわけ音がよく響くとされています。トイレもあるので、渓谷歩きのひと休みにもちょうどよいところです。林を傷めないよう、道から外れずに音を確かめてみましょう。";
const SENGA_HEAD = "石門をくぐって昇仙橋を渡ると、渓谷のいちばん奥にかかる仙娥滝に着きます。";
const SEKIMON_TEXT =
  "覚円峰から少し上ると、道ばたに長田円右衛門の碑が立っています。江戸時代の天保年間、地元の円右衛門が親族や村々の協力を得て、9年の歳月をかけてこの荒川沿いに「御岳新道」を切り開き、それが今の昇仙峡の道のもとになったと伝えられています。碑を過ぎた先にあるのが石門です。巨大な花崗岩が寄り合ってできた天然のアーチで、よく見ると岩の先端どうしはわずかに離れているのに、崩れずに今の姿を保っています。道はこの門の下をくぐって続くので、頭上の岩や足元の段差に気をつけて通り抜けましょう。石門をくぐって昇仙橋を渡ると、覚円峰から歩いて約15分で、渓谷のいちばん奥にかかる仙娥滝に着きます。";

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [CHOTAN]: [{ from: CHOTAN_LAST, to: CHOTAN_LAST + TENKO_TEXT }],
  [KAKUEN]: [{ from: "天鼓林から遊歩道をさらに上ると、", to: "長潭橋から天鼓林をへて、渓谷沿いの遊歩道を約1時間15分上ると、" }],
  [SENGA]: [{ from: SENGA_HEAD, to: SEKIMON_TEXT }],
};

const PLAN: { id: string; h: number; m: number; stay: number; legs: Leg[] }[] = [
  { id: LUNCH, h: 11, m: 15, stay: 40, legs: [] },
  { id: CHOTAN, h: 12, m: 25, stay: 15, legs: [bus(30, "山梨交通バス（甲府駅南口→昇仙峡口）")] },
  { id: KAKUEN, h: 13, m: 55, stay: 20, legs: [walk(75)] },
  { id: SENGA, h: 14, m: 30, stay: 20, legs: [walk(15)] },
  { id: ROPEWAY, h: 15, m: 5, stay: 50, legs: [other(15)] },
  { id: SUISHO, h: 16, m: 10, stay: 30, legs: [other(15)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const d1 = it.days[0];
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [LUNCH, CHOTAN, TENKO, KAKUEN, SEKIMON, SENGA, ROPEWAY, SUISHO].join()) throw new Error("1日目の構成が想定と違います");
  for (const s of d1.spots.filter((x) => x.id === TENKO || x.id === SEKIMON)) if (s.photos.length) throw new Error(`外すスポットに写真があります: ${s.name}`);
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
    console.log(`\n${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（いま ${s.visitTime ? hm(s.visitTime.getUTCHours() * 60 + s.visitTime.getUTCMinutes()) : "-"} 滞在${s.stayDurationMin}分）${MEMO_EDITS[p.id] ? "\n  本文: " + memoOf(p.id) : "（本文は変えない）"}`);
    prevEnd = st + p.stay;
  }
  console.log(`\n外すスポット: ${TENKO}（天鼓林）・${SEKIMON}（石門）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => setDaySpotOrder(DAY1_ID, DAY1 as never, { tx, remove: [TENKO, SEKIMON] }), { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
