/**
 * 初日・最終日の見直し #51 11ddbe6f「阿嘉島・ニシハマビーチ、静かな離島の絶景ビーチを楽しむ1泊2日」（しおりえ(制作補助2)、docs/specs/20261029-first-last-day-times.md。
 * 担当の移し替え 10/30、checklist 7行目・310a16a。企画運営・法務 10/30 の判断）
 * 船（座間味村の公式 8月の時刻表 https://www.vill.zamami.okinawa.jp/ship/2026/8/、季節は夏だけ）:
 *   泊港→阿嘉港の午前の便は 9:00（10:10着）と 10:00（11:30着）だけで、次は 13:00 → 入口が10:30より前になる例外。遅いほうの 10:00 の便（約1時間30分）にする
 *   帰りは阿嘉港 16:50 発の便（泊 18:10着）に 25分の余裕。メモに便名・時刻・船の種類は書かない
 * 自転車の分数は routing.openstreetmap.de の routed-bike の所要時間（duration）を切り上げた値（企画運営 10/30）。外地→中岳だけは、中岳への上り坂が続くので 26.0分＋4分
 * 1日目: とまりん 9:50 → 船90＋レンタサイクルの手続き10＋自転車13（展望台まで 1,575m・13.1分、展望台への階段を含む）→ ニシハマビーチ 11:53〜13:53（昼食は持参）→ 自転車14（1,722m・13.5分）→
 *   前浜ビーチ 14:07〜15:22 → 自転車2（255m・1.2分）→ 阿嘉ビーチ 15:24〜16:44（150→80）
 *   中岳展望台は2日目へ移す（ニシハマ→中岳が「1分」だったが 4.2km あった）
 * 2日目: 天城 9:30 〜 外地展望台 13:17〜14:47（もとのまま。宿の集落・阿嘉港から自転車5、1,023m・4.6分）→ 自転車30（6,405m・26.0分＋上り坂4）→ 中岳展望台 15:17〜15:47（30のまま）→
 *   自転車12（2,726m・11.8分）→ 御殿（ウルン）の木 15:59〜16:13（新しく足す）→ 自転車3（556m・2.2分）→ シロの像 16:16〜16:25（20→9）→ 阿嘉港 16:50 の船
 *   さんごゆんたく館は外す（OSM・地理院の番地に点がなく、いまの点は大字の中心）
 *   御殿の木の出典: 国土交通省 観光庁 多言語解説文データベース https://www.mlit.go.jp/tagengo-db/R2-00918.html（樹齢400年以上と推定、高さ約12m、種取祭、1998年村の天然記念物）
 * 点: ニシハマビーチ = メモに出てくる北浜（ニシバマ）展望台 node 616770161（もとの点は度分秒を変換したような値で中岳のそば。浜の relation の中心と名前のない道の点は使わない、企画運営・法務 10/30）、
 *   天城展望台 = node 5310653896、御殿の木 = node 12644841062
 * 文: 「よいでしょう」・言い残し（中岳・ゆんたく館）を直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-051-11ddbe6f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "11ddbe6f-a04e-447c-ac0f-d9d707a86485";
const TOMARIN = "f8c7c0a9-ba89-4d0f-b422-cf555e6f2b79";
const NISHI = "285b5c23-f8fc-4bba-ba0a-a4772b6057d0";
const NAKA = "f2ba14e5-38dd-4dea-a584-4430c565ff2b";
const MAE = "3d7586ca-5e4b-45b6-912b-640a31db1781";
const AKA = "b7131e55-c86c-4a53-812b-b22359c09dd5";
const AMA = "56ff8f8a-ef5a-42e2-bef3-479399f4b933";
const OHASHI = "ac05d7e2-f070-432c-b619-f9b0887e91bf";
const TAKARA = "ad6b4dcd-00a9-4e33-9b64-7e255c5ab812";
const GERUMA = "83cf0c8d-605e-4629-801f-162f5ed95b99";
const FUKA = "634900a6-473b-4c98-b938-d0ece643a819";
const YUNTAKU = "d2fb90ac-3465-466e-b20a-ccd4fe073b28";
const SHIRO = "282405a3-5797-47e3-a037-d0746afa2929";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const other = (min: number) => ({ mode: "other" as const, min });

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const timeLegs = (h: number, m: number, stay: number, legs: Leg[]) => ({
  visitTime: t(h, m),
  stayDurationMin: stay,
  transitLegs: { deleteMany: {}, ...(legs.length ? { create: legsCreate(legs) } : {}) },
});

const COORDS: Record<string, { from: [number, number]; to: [number, number] }> = {
  [NISHI]: { from: [26.199722, 127.280833], to: [26.200358, 127.287059] },
  [AMA]: { from: [26.1841, 127.2775], to: [26.189026, 127.276485] },
};

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [TOMARIN]: [
    {
      from: "那覇市の泊港旅客ターミナル「とまりん」から、阿嘉島行きの高速船に乗り込みます。乗船手続きを済ませたら出航です。この後は、高速船でおよそ50分、阿嘉島へ向かいましょう。",
      to: "那覇市の泊港旅客ターミナル「とまりん」から、阿嘉島へ渡る船に乗ります。島へ渡る船の便は限られ、時期によって運休もあるので、運航の日と時刻を公式の案内で確かめましょう。乗船手続きを済ませたら出航です。この後は、船でおよそ1時間30分、阿嘉港へ渡りましょう。",
    },
  ],
  [NISHI]: [
    {
      from: "とまりんから高速船とビーチまでの徒歩で1時間ほど、阿嘉港に着き、阿嘉島のメインビーチ、ニシハマビーチに着きます。",
      to: "阿嘉港に着いたら、港の近くでレンタサイクルを借りて（手続きに10分ほど）、レンタサイクルでおよそ13分、阿嘉島のメインビーチ、ニシハマビーチに着きます。",
    },
    { from: "海を見下ろしながらひと息つくのもよいでしょう。", to: "海を見下ろしながらひと息つきましょう。" },
    {
      from: "この後は、レンタサイクルでおよそ1分、中岳展望台へ向かいましょう。",
      to: "島には店が少ないので、昼食はあらかじめ用意しておき、浜のまわりで食べましょう。この後は、レンタサイクルでおよそ14分、前浜ビーチへ向かいましょう。",
    },
  ],
  [MAE]: [
    { from: "中岳展望台からレンタサイクルでおよそ6分、", to: "ニシハマビーチからレンタサイクルでおよそ14分、" },
    { from: "昼食は、島には店が少ないため、あらかじめ用意しておくと安心です。", to: "" },
    { from: "この後は、レンタサイクルでおよそ5分、阿嘉ビーチへ向かいましょう。", to: "この後は、レンタサイクルでおよそ2分、阿嘉ビーチへ向かいましょう。" },
  ],
  [AKA]: [
    { from: "前浜ビーチからレンタサイクルでおよそ5分、", to: "前浜ビーチからレンタサイクルでおよそ2分、" },
    { from: "夕方は、西向きの浜で夕日を眺めながら過ごすのもよいでしょう。今夜は阿嘉島の宿に泊まります。", to: "この夜は、阿嘉島の宿に泊まりましょう。" },
  ],
  [AMA]: [
    {
      from: "ニシハマビーチから一夜明け、今日は阿嘉島の集落を見渡せる天城(あまぐすく)展望台へ向かいます。",
      to: "ニシハマビーチから一夜明け、今日は宿のある集落の阿嘉港のあたりからレンタサイクルでおよそ5分、阿嘉島の集落を見渡せる天城(あまぐすく)展望台へ向かいます。",
    },
  ],
  [GERUMA]: [{ from: "橋のたもとで景色を眺めながら食べるのもよいでしょう。", to: "橋のたもとで、景色を眺めながら食べましょう。" }],
  [FUKA]: [{ from: "この後は、レンタサイクルでおよそ15分、さんごゆんたく館へ向かいましょう。", to: "この後は、レンタサイクルでおよそ30分、阿嘉島の中岳展望台へ向かいましょう。" }],
  [NAKA]: [
    {
      from: "ニシハマビーチからレンタサイクルですぐ、中岳展望台に着きます。",
      to: "外地展望台からレンタサイクルでおよそ30分、中岳展望台に着きます。中岳への上り坂が続くので、無理をせず、ときどき休みながら走りましょう。",
    },
    { from: "この後は、レンタサイクルでおよそ6分、前浜ビーチへ向かいましょう。", to: "この後は、レンタサイクルでおよそ12分、集落にある御殿（ウルン）の木へ向かいましょう。" },
  ],
  [SHIRO]: [
    { from: "さんごゆんたく館からレンタサイクルでおよそ8分、", to: "御殿（ウルン）の木からレンタサイクルでおよそ3分、" },
    {
      from: "阿嘉港から船で那覇へ戻りましょう。最終便の時刻は、事前に公式サイトで確かめておきましょう。",
      to: "見学を終えたら、レンタサイクルを返して、すぐそばの阿嘉港から船で那覇の泊港へ戻りましょう（およそ1時間20分）。帰りの船の便は限られるので、運航の日と時刻を公式の案内で確かめ、出港の25分前までには港に着いておきましょう。",
    },
  ],
};

const GOTEN = {
  name: "御殿（ウルン）の木",
  lat: 26.191301,
  lng: 127.281815,
  address: "沖縄県島尻郡座間味村阿嘉",
  memo:
    "中岳展望台からレンタサイクルでおよそ12分、阿嘉の集落にある御殿（ウルン）の木に着きます。樹齢400年以上と推定される古木で、高さはおよそ12メートル、枝葉が大きく広がっています。昭和のはじめごろまで、この木の下で、翌年の稲の種もみを農家に配る「種取祭」が行われていたとされ、島の人たちが大切に守ってきた木です。平成10年(1998)に座間味村の天然記念物に指定されました。集落の中なので、家の敷地に入らず、静かに見学しましょう。この後は、レンタサイクルでおよそ3分、シロの像へ向かいましょう。",
};

type Plan = { id: string; h: number; m: number; stay: number; legs: Leg[] }[];
const DAY1: Plan = [
  { id: TOMARIN, h: 9, m: 50, stay: 10, legs: [] },
  { id: NISHI, h: 11, m: 53, stay: 120, legs: [other(90), other(23)] },
  { id: MAE, h: 14, m: 7, stay: 75, legs: [other(14)] },
  { id: AKA, h: 15, m: 24, stay: 80, legs: [other(2)] },
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { transitLegs: { orderBy: { orderNo: "asc" } } } } } } } });
  console.log(`対象: ${it.title} [${it.status}] ${it.nights}泊 季節 ${it.seasons.join(",")}`);
  const [d1, d2] = it.days;
  if (d1.spots.map((s) => s.id).join() !== [TOMARIN, NISHI, NAKA, MAE, AKA].join()) throw new Error("1日目の構成が想定と違います");
  if (d2.spots.map((s) => s.id).join() !== [AMA, OHASHI, TAKARA, GERUMA, FUKA, YUNTAKU, SHIRO].join()) throw new Error("2日目の構成が想定と違います");
  const all = [...d1.spots, ...d2.spots];
  const hmOf = (d: Date | null | undefined) => (d ? hm(d.getUTCHours() * 60 + d.getUTCMinutes()) : "-");
  const fuka = all.find((s) => s.id === FUKA)!;
  if (hmOf(fuka.visitTime) !== "13:17" || fuka.stayDurationMin !== 90) throw new Error("外地展望台の時刻が想定と違います");
  for (const [id, c] of Object.entries(COORDS)) {
    const s = all.find((x) => x.id === id)!;
    if (Number(s.lat) !== c.from[0] || Number(s.lng) !== c.from[1]) throw new Error(`${s.name}: いまの座標が想定と違います（${s.lat},${s.lng}）`);
  }
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
    }
    for (const w of ["よいでしょう", "ゆんたく", "高速船", "ください"]) if (m.includes(w)) console.log(`  ⚠ ${s.name}: 「${w}」が残っています`);
    memos[id] = m;
  }
  console.log("\n1日目（直したあと）");
  for (const p of DAY1) {
    const s = all.find((x) => x.id === p.id)!;
    console.log(`${hm(p.h * 60 + p.m)}-${hm(p.h * 60 + p.m + p.stay)} ${p.legs.map((l) => l.mode + l.min).join("+") || "-"} ${s.name}（もと ${hmOf(s.visitTime)} 滞在${s.stayDurationMin}分）`);
  }
  console.log("\n2日目（直したあと）: 天城 9:30 〜 外地 13:17-14:47（もとのまま）/ 自転車30 15:17-15:47 中岳展望台（1日目から移す）/ 自転車12 15:59-16:13 御殿の木（足す）/ 自転車3 16:16-16:25 シロの像 / 外す: さんごゆんたく館");
  for (const [id, edits] of Object.entries(MEMO_EDITS)) for (const e of edits) console.log(`  ${all.find((x) => x.id === id)!.name} → ${e.to}`);
  console.log(`  御殿の木 ${GOTEN.lat},${GOTEN.lng} → ${GOTEN.memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const keep = (id: string) => ({ id, data: memos[id] !== undefined ? { memo: memos[id] } : {} });
  await prisma.$transaction(
    async (tx) => {
      // 中岳展望台を2日目へ移す（写真を残すため、作り直さずに日をかえる。orderNo は一時的に大きな番号）
      await tx.spot.update({ where: { id: NAKA }, data: { dayId: d2.id, orderNo: 9001 } });
      await setDaySpotOrder(
        d1.id,
        DAY1.map((p) => ({
          id: p.id,
          data: {
            ...timeLegs(p.h, p.m, p.stay, p.legs),
            ...(memos[p.id] !== undefined ? { memo: memos[p.id] } : {}),
            ...(COORDS[p.id] ? { lat: COORDS[p.id].to[0], lng: COORDS[p.id].to[1] } : {}),
          },
        })) as never,
        { tx }
      );
      await setDaySpotOrder(
        d2.id,
        [
          { id: AMA, data: { memo: memos[AMA], lat: COORDS[AMA].to[0], lng: COORDS[AMA].to[1] } },
          keep(OHASHI),
          keep(TAKARA),
          keep(GERUMA),
          keep(FUKA),
          { id: NAKA, data: { ...timeLegs(15, 17, 30, [other(30)]), memo: memos[NAKA] } },
          {
            create: {
              name: GOTEN.name,
              visitTime: t(15, 59),
              stayDurationMin: 14,
              transitLegs: { create: legsCreate([other(12)]) },
              lat: GOTEN.lat,
              lng: GOTEN.lng,
              address: GOTEN.address,
              memo: GOTEN.memo,
            },
          },
          { id: SHIRO, data: { ...timeLegs(16, 16, 9, [other(3)]), memo: memos[SHIRO] } },
        ] as never,
        { tx, remove: [YUNTAKU] }
      );
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
