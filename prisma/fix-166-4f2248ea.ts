/**
 * #166 4f2248ea「博物館明治村、明治の建築を移築保存した野外博物館プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜12:30 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）
 * 明治村は冬（12〜2月）の開村が10:00〜16:00で、9:30〜16:30 が組めないので、企画運営の判断（案A）で季節から冬を外し、春・夏・秋にする
 * 8月は開村が10:00なので、朝はとなりの入鹿池から始めて10時に入村する
 * 歩きの旅（名鉄犬山駅から岐阜バスで明治村へ。帰りも同じ）:
 *   入鹿池 9:30 → 西郷從道邸 → 聖ヨハネ教会堂 → 三重県庁舎 → 博物館明治村（昼食。既存のスポット）→ 品川燈台 → 呉服座 → 帝国ホテル中央玄関 → 森鷗外・夏目漱石住宅 16:30 → 正門
 * タイトルはそのまま、説明文は書き直す
 * 明治村のほかのしおり（cd007650）の本文を読み、使っていない話で書いた（帝国ホテルはライトの設計・重要文化財の数・SLと市電でなく、竣工の日・移した部分・大谷石の装飾・吹き抜け）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   開村時間: aichinow.pref.aichi.jp/spots/detail/22/（愛知県の観光サイト。4〜7月・9〜11月・3月 9:30〜17:00、8月 10:00〜17:00、12〜2月 10:00〜16:00、入村は閉村の30分前まで、夏季・冬季に不定期の休村日、
 *   名鉄犬山駅から岐阜バスで「明治村」）。公式 meijimura.com/guide/open/ は時間が画面の中で読み込まれる形で、文字では読めなかった
 *   入鹿池: city.inuyama.aichi.jp/shisei/shokai/1005454/1005980.html（江戸時代につくられた人工池・日本有数の貯水量・平成27年度に世界かんがい施設遺産・サクラとツツジの名所）
 *   建物（博物館明治村の公式 meijimura.com/sight/<建物名>/）: 西郷從道邸（西郷隆盛の弟・從道の接客用の木造洋館・明治22年に明治天皇の行幸・フランス人レスカスの関与と伝わる・
 *   2階の暖炉の額縁は瀬戸焼で日本三景と富士山・軽い銅板の屋根など耐震の工夫）／聖ヨハネ教会堂（日本聖公会京都五条教会堂・ロマネスクをもとにゴシックをまじえる・2階が会堂・京都の風土に合わせた竹のすだれの天井・
 *   設計はアメリカ人建築家ガーディナー）／三重県庁舎（県令岩村定高の発案・明治13年に明治天皇の行幸・昭和39年まで使用・間口54m・左右対称と2層のベランダ・大工の清水義八の設計・木目塗り）／
 *   品川燈台（観音崎・野島崎についで明治3年に点灯・品川沖の第二台場・フランス人ヴェルニーの設計・現存するわが国最古の洋式灯台・風見の方位がフランス語）／呉服座（大阪府池田市の芝居小屋・明治25年に移築して呉服座と改名・
 *   太鼓櫓・まわり舞台・奈落・歌舞伎や落語のほか演説会にも使われた）／帝国ホテル中央玄関（大正12年の竣工が関東大震災の当日・昭和42年の解体まで使われた・客室棟の中央玄関部分を移築、前面の池も再現・
 *   大谷石とスクラッチレンガ・3階までの吹き抜け）／森鴎外・夏目漱石住宅（明治20年ごろの建築・明治23年に森鷗外が借りて1年余り・明治36〜39年に夏目漱石が住み『吾輩は猫である』を発表・中廊下の起源）
 * 座標: OSM — 入鹿池 way 54516501（reservoir、Nominatim の中心）・西郷従道邸 way 493547890・聖ヨハネ教会堂 way 493561190・三重県庁舎 way 493562287・呉服座 way 234852345・帝国ホテル中央玄関 way 234851918・
 *   森鷗外・夏目漱石住宅 way 493557929（建物、Nominatim の中心）／品川燈台 node 746458514（lighthouse）／博物館明治村 node 13565830658（村の点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-166-4f2248ea.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4f2248ea-f024-4a28-9377-bf9131da664a";
const DAY1_ID = "68ff4a69-7f1e-46e6-88c6-23e3c458770f";
const MURA = "46ec5f32-16a5-4473-8817-b60639281997";
const SEASONS = ["spring", "summer", "autumn"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });

const DESCRIPTION =
  "入鹿池のほとりから明治村へ。西郷從道邸、聖ヨハネ教会堂、三重県庁舎と明治の洋風建築を見て、村の中で昼食をとり、日本最古の洋式灯台とされる品川燈台、芝居小屋の呉服座、帝国ホテル中央玄関、森鷗外と夏目漱石が住んだ家をめぐる、明治の建物を歩いてたどる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;
const ADDR = "愛知県犬山市内山1";

const DAY1: X[] = [
  cre("入鹿池", { h: 9, m: 30, stay: 25, legs: [], lat: 35.3449708, lng: 136.9964077, address: "愛知県犬山市",
    memo: "この旅は歩いてめぐります。名鉄犬山駅から岐阜バスで明治村へ（約20分）。入村の前に、明治村のとなりに広がる入鹿池のほとりへ。江戸時代につくられた人工の池で、日本有数の水をたくわえ、平成27年度に「世界かんがい施設遺産」に登録されました。春はサクラやツツジの名所としても知られます。明治村の開村の時間は月によって違うので、公式の案内で確かめましょう。" }),
  cre("西郷從道邸", { h: 10, m: 5, stay: 40, legs: [walk(10)], lat: 35.3401038, lng: 136.9902002, address: ADDR,
    memo: "入村して歩いて約10分。西郷隆盛の弟で、陸軍と海軍の大臣をつとめた西郷從道が、客をもてなすために建てた木造の洋館で、明治22年（1889年）には明治天皇も訪れました。2階の暖炉の額縁は瀬戸焼で、日本三景と富士山が描かれています。屋根には軽い銅板を使うなど、地震に強くする工夫もされています。" }),
  cre("聖ヨハネ教会堂", { h: 10, m: 50, stay: 30, legs: [walk(5)], lat: 35.339093, lng: 136.9890263, address: ADDR,
    memo: "西郷從道邸から歩いて約5分。京都の五条にあった日本聖公会の教会堂で、アメリカ人の建築家ガーディナーが設計しました。赤レンガの外観は、ロマネスク様式をもとにゴシックの飾りをまじえたもので、正面の左右に高い塔が立ちます。2階の会堂の天井には、京都の気候に合わせた竹のすだれが張られ、光を受けて明るい空間になっています。" }),
  cre("三重県庁舎", { h: 11, m: 25, stay: 30, legs: [walk(5)], lat: 35.3408825, lng: 136.9891261, address: ADDR,
    memo: "教会堂から歩いて約5分。明治時代の三重県令の発案で建てられた洋風の県庁舎で、明治13年（1880年）には明治天皇も訪れ、昭和39年（1964年）まで使われました。間口は54mあり、玄関を中心に左右対称で、正面には2層のベランダがめぐります。設計したのは県の大工・清水義八で、扉や窓の枠には、ペンキで高価な木の木目を描く「木目塗り」が使われています。" }),
  upd(MURA, { h: 12, m: 5, stay: 50, legs: [walk(10)], lat: 35.3445252, lng: 136.9907992, address: ADDR,
    memo: "三重県庁舎から歩いて約10分。村の中には食事のできる店がいくつかあるので、このあたりで昼食にしましょう。" }, "博物館明治村（昼食）"),
  cre("品川燈台", { h: 13, m: 5, stay: 25, legs: [walk(10)], lat: 35.3415977, lng: 136.9941302, address: ADDR,
    memo: "歩いて約10分。観音崎、野島崎についで明治3年（1870年）に明かりがともった灯台で、品川沖の第二台場に建てられていました。フランス人のヴェルニーが設計し、レンズなどもフランスから取り寄せたため、頂上の風見の方位はフランス語の頭文字で示されています。今に残る日本で最も古い洋式の灯台とされます。" }),
  cre("呉服座", { h: 13, m: 45, stay: 35, legs: [walk(15)], lat: 35.3450703, lng: 136.9895567, address: ADDR,
    memo: "品川燈台から北へ歩いて約15分。大阪府池田市にあった芝居小屋で、明治25年（1892年）に移されたときに「呉服座」と名を改めました。正面には太鼓櫓が突き出し、中には人の力で回すまわり舞台や、床下の通路の奈落があります。歌舞伎や落語のほか、政治の演説会にも使われました。" }),
  cre("帝国ホテル中央玄関", { h: 14, m: 30, stay: 60, legs: [walk(10)], lat: 35.347254, lng: 136.9887186, address: ADDR,
    memo: "呉服座から北へ歩いて約10分。東京・内幸町にあった帝国ホテルは、大正12年（1923年）の竣工の日が関東大震災の当日で、昭和42年（1967年）に取り壊しが始まるまで使われました。ここに移されたのは客室棟の中央玄関の部分で、建物の前にあった池も再現されています。中は3階までの吹き抜けで、彫刻をほどこした大谷石や、すかし模様のテラコッタが、光と影をつくり出します。" }),
  cre("森鷗外・夏目漱石住宅", { h: 15, m: 50, stay: 40, legs: [walk(20)], lat: 35.3404204, lng: 136.9905451, address: ADDR,
    memo: "帝国ホテルから南へ、正門の方へ歩いて約20分。明治20年（1887年）ごろに建てられた和風の借家で、明治23年（1890年）に森鷗外が1年あまり暮らし、明治36年（1903年）から明治39年までは夏目漱石が住んで、ここで『吾輩は猫である』を発表しました。台所から座敷へ続く短い中廊下には、今の住まいにつながる工夫が見られます。帰りは、正門から岐阜バスで犬山駅へ戻りましょう。" }),
];

function show(label: string, DAY: X[]) {
  console.log(`\n${label}`);
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? x.id.slice(0, 8) + "(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}] 季節 ${it.seasons.join(",")}`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [MURA].join()) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: SEASONS as never } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx });
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
