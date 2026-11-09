/**
 * 初日・最終日の見直し #59 44c030d6「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目）
 * 車の分数は OSRM（もとの値は ×1.5＋5 の内側ならそのまま。新しい区間は切り上げ＋5）。歩きは routed-foot
 * 1日目: 山形駅 10:30ごろ → レンタカー（手続き15分）→ 車41（OSRM 35.2。もとは入口の一文がなかった）→ 刈田岳山頂の駐車場 → 歩6（390m）→ 蔵王のお釜 11:32 →
 *   歩6（415m。もと8）→ 刈田嶺神社 12:28 → 歩4（289m）→【新】蔵王山頂レストハウス 13:02〜13:37（昼食。宮城県 https://www.pref.miyagi.jp/soshiki/kankou/r5zaou-kurikoma.html
 *   「レストランと売店」、冬季休業）→ 車32（OSRM 26.5）→ 高湯通り 14:09（95→70）→ 歩8（229段の石段。foot routing は 301m・4分だが石段を見込んでもとのまま）→
 *   酢川温泉神社 15:27 → 歩5 → 下湯共同浴場 15:52〜16:52（75→60）
 *   蔵王ロープウェイ・蔵王地蔵尊は外す（タイトル・説明文にない。お釜からでは収まらない。蔵王ロープウェイの写真1枚も外れる）
 * 2日目（終わり 16:55 はもとのまま）: 宿（高湯通りのまわり）→ 歩12（862m）→ 大露天風呂 9:30 → 歩14（1,051m。もと12）→ 蔵王中央ロープウェイ（温泉駅）10:44 →
 *   other8 → 鳥兜山展望台 11:22 → other10 → どっこ沼 12:12（昼食。お弁当）→ other20 → 片貝沼 13:47 → other20 → 蔵王中央高原駅 14:52 →
 *   スカイケーブル8＋歩5（上の台駅→上湯 333m。もとは合わせて10）→ 上湯・川原湯共同浴場 15:25（35→30）→ 車30（OSRM 20.8）→ 霞城公園 16:25〜16:55 →
 *   車10（OSRM 4.9）で山形駅、レンタカーを返す
 * 点: 昼食＝OSM バス停「蔵王刈田山頂」node 12179535101（レストハウス way 854811459 から約25m。店ではない名前の点）／高湯通り＝way 27084810 の node 297158412／
 *   蔵王中央ロープウェイ＝OSM「温泉駅」aerialway=station way 310732763（いまは近くの宿の点）／どっこ沼＝way 765938412 の node 7153545975／
 *   片貝沼＝way 855913471 の node 7981336777（どちらも沼の way の中心だった）／霞城公園＝OSM「最上義光之像」node 9934750443（いまは公園の way の中心。メモの騎馬像）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-059-44c030d6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";
const DAY1_ID = "2fac19bf-ba6e-4930-a877-b19ead220866";
const DAY2_ID = "f1342377-51d0-498e-b61a-3b47093308ca";
const OKAMA = "2f4c9ad3-f742-43c6-bcbb-19201010e322";
const KATTA = "baff037a-c0f8-4a8e-ab3f-816b2cac5ba8";
const ZRW = "ec2b445a-51d1-45bf-9593-914d33263c63";
const JIZO = "f1911d46-567f-486a-9945-76949bc8e7c0";
const TAKAYU = "43875b50-b5be-4956-b3dd-04104281dfba";
const SUKAWA = "69e00c68-5ce0-4d21-97cf-c7611dea198b";
const SHIMO = "a1e5a4b0-286a-413a-a009-fab536740d2d";
const ROTEN = "19b31084-9914-4a8a-80d6-021c342ada2e";
const CRW = "ae1add1b-bfb3-4496-b656-fb81529d56e4";
const TORI = "ae3082cd-8181-486f-8265-0c4194e3964a";
const DOKKO = "30065eb8-8275-4223-b795-b644503b1e16";
const KATAGAI = "4c10cc44-2420-4052-962d-a638b9504d1c";
const CHUO = "0deef066-2b39-4821-8099-bbef5d84402e";
const KAMI = "2dcbe011-7acc-4d6e-ace8-68ea27aa99f0";
const KAJO = "c8d54f90-9cfc-4c43-8580-320f73990f01";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const other = (min: number) => ({ mode: "other" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [TAKAYU]: { from: [38.167871, 140.39601], to: [38.16781, 140.395846] },
  [CRW]: { from: [38.164078, 140.393845], to: [38.164846, 140.395669] },
  [DOKKO]: { from: [38.169177, 140.418454], to: [38.169519, 140.41864] },
  [KATAGAI]: { from: [38.160624, 140.42331], to: [38.160543, 140.422806] },
  [KAJO]: { from: [38.255577, 140.328241], to: [38.255211, 140.329993] },
};

const PRAY_TO = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";
const BATH_TO = "長湯を避けて、こまめに水分をとりましょう。";

// 1日目に足す昼食の場所
const LUNCH = "new-resthouse";
const LUNCH_SPOT = {
  name: "蔵王山頂レストハウス",
  lat: 38.128102,
  lng: 140.446169,
  memo:
    "刈田嶺神社から歩いておよそ4分、刈田岳山頂の駐車場のそばにある蔵王山頂レストハウスに着きます。レストランと売店があるので、ここで昼食をとりましょう。冬の間は休業するので、営業期間を公式の案内で確かめましょう。食事を終えたら、車でおよそ32分、山形県側の蔵王温泉へ向かいましょう。",
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [OKAMA]: [
    {
      from: "蔵王のお釜は、刈田岳・熊野岳・五色岳",
      to: "山形駅に10時半ごろ着いたら、駅前でレンタカーを借りて（手続きに15分ほど）、車でおよそ41分、刈田岳山頂の駐車場へ向かいます。山頂へ向かう道は、冬のあいだや夜は通れないので、通れる期間と時間を公式の案内で確かめましょう。蔵王のお釜は、刈田岳・熊野岳・五色岳",
    },
    { from: "刈田岳山頂駐車場から歩いて3分ほどでお釜の展望台に着きます。", to: "刈田岳山頂の駐車場から歩いておよそ6分でお釜の展望台に着きます。" },
    { from: "春から秋にかけてだけ訪れることのできる絶景です。", to: "春から秋にかけてだけ訪れることのできる絶景です。この後は、歩いておよそ6分、刈田嶺神社へ向かいましょう。" },
  ],
  [KATTA]: [
    { from: "お釜からは歩いて8分ほどです。", to: "お釜からは歩いておよそ6分です。" },
    { from: "蔵王を見守ってきた山頂の社に、静かに手を合わせましょう。", to: `蔵王を見守ってきた山頂の社です。${PRAY_TO}この後は、歩いておよそ4分、蔵王山頂レストハウスへ向かいましょう。` },
  ],
  [TAKAYU]: [
    { from: "蔵王ロープウェイで山麓へ戻り、歩いて11分ほどです。", to: "蔵王山頂レストハウスからは、車でおよそ32分です。" },
    { from: "通り沿いには飲食店も並んでいるので、ここで昼食をとりましょう。", to: "この後は、歩いておよそ8分、酢川温泉神社へ向かいましょう。" },
  ],
  [SUKAWA]: [
    { from: "石段に気をつけながら、静かに手を合わせましょう。", to: `石段に気をつけて歩きましょう。${PRAY_TO}この後は、歩いておよそ5分、下湯共同浴場へ向かいましょう。` },
  ],
  [SHIMO]: [
    { from: "入浴の際は、ほかの入浴客を撮らないようにしましょう。", to: `入浴の際は、ほかの入浴客を撮らないようにしましょう。${BATH_TO}` },
    { from: "今夜は蔵王温泉に宿泊しましょう。", to: "この夜は、高湯通りのまわりの宿に泊まりましょう。" },
  ],
  [ROTEN]: [
    { from: "蔵王温泉大露天風呂は、開湯1900年", to: "高湯通りのまわりの宿から歩いておよそ12分、蔵王温泉大露天風呂に着きます。蔵王温泉大露天風呂は、開湯1900年" },
    {
      from: "入浴の際は、ほかの入浴客を撮らないようにしましょう。",
      to: `入浴の際は、ほかの入浴客を撮らないようにしましょう。${BATH_TO}この後は、歩いておよそ14分、蔵王中央ロープウェイの温泉駅へ向かいましょう。`,
    },
  ],
  [CRW]: [
    { from: "大露天風呂からは歩いて12分ほどです。", to: "大露天風呂からは歩いておよそ14分です。" },
    { from: "ここから、蔵王中央高原の散策へ向かいましょう。", to: "山の上で昼食をとるので、乗る前に温泉街でお弁当を用意しておきましょう。ここから、蔵王中央高原の散策へ向かいましょう。" },
  ],
  [TORI]: [{ from: "蔵王中央ロープウェイで鳥兜駅まで登ります。", to: "蔵王中央ロープウェイでおよそ8分、鳥兜駅まで登ります。" }],
  [DOKKO]: [{ from: "ここで昼食をとることもできます。", to: "用意してきたお弁当で、ここで昼食をとりましょう。" }],
  [KAMI]: [
    { from: "蔵王中央高原駅からは、スカイケーブルで山麓へ下って10分ほどです。", to: "蔵王中央高原駅からは、スカイケーブルで山麓の上の台駅へ下り、歩く時間とあわせておよそ13分です。" },
    { from: "入浴の際は、ほかの入浴客を撮らないようにしましょう。", to: `入浴の際は、ほかの入浴客を撮らないようにしましょう。${BATH_TO}` },
  ],
  [KAJO]: [{ from: "見学を終えたら、車で山形市街・山形空港方面へ戻りましょう。", to: "見学を終えたら、車でおよそ10分の山形駅の近くでレンタカーを返し(返す手続きに15分ほど)、帰りましょう。" }],
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: OKAMA, h: 11, m: 32, stay: 50, legs: [] },
  { id: KATTA, h: 12, m: 28, stay: 30, legs: [walk(6)] },
  { id: LUNCH, h: 13, m: 2, stay: 35, legs: [walk(4)] },
  { id: TAKAYU, h: 14, m: 9, stay: 70, legs: [car(32)] },
  { id: SUKAWA, h: 15, m: 27, stay: 20, legs: [walk(8)] },
  { id: SHIMO, h: 15, m: 52, stay: 60, legs: [walk(5)] },
];
const DAY2: Plan = [
  { id: ROTEN, h: 9, m: 30, stay: 60, legs: [] },
  { id: CRW, h: 10, m: 44, stay: 30, legs: [walk(14)] },
  { id: TORI, h: 11, m: 22, stay: 40, legs: [other(8)] },
  { id: DOKKO, h: 12, m: 12, stay: 75, legs: [other(10)] },
  { id: KATAGAI, h: 13, m: 47, stay: 45, legs: [other(20)] },
  { id: CHUO, h: 14, m: 52, stay: 20, legs: [other(20)] },
  { id: KAMI, h: 15, m: 25, stay: 30, legs: [other(8), walk(5)] },
  { id: KAJO, h: 16, m: 25, stay: 30, legs: [car(30)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.id !== DAY1_ID || d1.spots.map((s) => s.id).join() !== [OKAMA, KATTA, ZRW, JIZO, TAKAYU, SUKAWA, SHIMO].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.id !== DAY2_ID || d2.spots.map((s) => s.id).join() !== [ROTEN, CRW, TORI, DOKKO, KATAGAI, CHUO, KAMI, KAJO].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
    }
    memos[id] = m.replace(/ {2,}/g, " ").trim();
  }
  all.push({ ...LUNCH_SPOT, id: LUNCH, visitTime: null, stayDurationMin: null, transitLegs: [] } as never);
  const kept = [...DAY1, ...DAY2].map((p) => memos[p.id] ?? all.find((x) => x.id === p.id)!.memo ?? "");
  for (const w of ["ください", "おすすめ", "よいでしょう", "地蔵", "手を合わせ", "ほど", "ホテル", "旅館"])
    kept.forEach((m, i) => m.includes(w) && console.log(`  ⚠ ${all.find((x) => x.id === [...DAY1, ...DAY2][i].id)!.name}: 「${w}」が残っています`));
  console.log(`新しい昼食の場所: ${LUNCH_SPOT.name}（${LUNCH_SPOT.lat},${LUNCH_SPOT.lng}）\n  ${LUNCH_SPOT.memo}`);
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const show = (label: string, plan: Plan) => {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const p of plan) {
      const st = p.h * 60 + p.m;
      const min = p.legs.reduce((a, l) => a + l.min, 0);
      const s = all.find((x) => x.id === p.id)!;
      console.log(`${hm(st)}-${hm(st + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"}${prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分 ${s.transitLegs.map((l) => l.transitMode + l.transitDurationMin).join("+") || "-"}）`);
      if (COORDS[p.id]) console.log(`  座標 ${COORDS[p.id].from.join(",")} → ${COORDS[p.id].to.join(",")}`);
      for (const e of MEMO_EDITS[p.id] ?? []) console.log(`  → ${e.to}`);
      prevEnd = st + p.stay;
    }
  };
  show("1日目（直したあと）", DAY1);
  show("2日目（直したあと）", DAY2);
  console.log("\n外す: 蔵王ロープウェイ（写真1枚もいっしょに外れる）・蔵王地蔵尊（1日目）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const items = (plan: Plan) =>
    plan.map((p) =>
      p.id === LUNCH
        ? {
            create: {
              name: LUNCH_SPOT.name,
              visitTime: t(p.h, p.m),
              stayDurationMin: p.stay,
              transitLegs: { create: legsCreate(p.legs) },
              lat: LUNCH_SPOT.lat,
              lng: LUNCH_SPOT.lng,
              address: "刈田郡蔵王町刈田岳山頂",
              memo: LUNCH_SPOT.memo,
            },
          }
        : {
            id: p.id,
            data: {
              ...timeLegs(p.h, p.m, p.stay, p.legs),
              ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
              ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
            },
          }
    );
  await prisma.$transaction(
    async (tx) => {
      await setDaySpotOrder(DAY1_ID, items(DAY1) as never, { tx, remove: [ZRW, JIZO] });
      await setDaySpotOrder(DAY2_ID, items(DAY2) as never, { tx });
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
