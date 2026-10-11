/**
 * #169 531bd99f「犬山城と有楽苑。現存最古とされる天守と国宝茶室をめぐる日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜13:55 で、昼食と帰りの一言がなく、本町通りの座標は丸めた値（35.3833,136.9425）で写真もなかった
 * 本町通り・どんでん館・旧磯部家住宅は OSM に名前つきの点がない（国土地理院も大字の点だけ）ので、本町通りのスポットは犬山駅前の昼食に変える
 * 歩きと名鉄の旅（名鉄犬山遊園駅・犬山駅から。帰りは犬山遊園駅から）:
 *   犬山城 9:30 → 針綱神社 → 有楽苑 → 犬山駅前（昼食）→ 城とまちミュージアム → からくりミュージアム → 犬山成田山 16:30 → 犬山遊園駅
 * タイトル・季節（四季）はそのまま、説明文は書き直す。冬も犬山城・有楽苑（9時30分〜17時）・城とまち・からくり・成田山は開いている
 * 犬山のほかのしおり（cd007650）の本文を読み、使っていない話で書いた（犬山城は織田信康の築城と白帝城の名でなく、後堅固の城・成瀬家・天守のつくり・国宝の指定と白帝文庫。
 *   針綱神社は城の守り神・犬山祭でなく、名栗町から今の地へ移ったことと犬の奉納の言い伝え。有楽苑は有楽斎・国宝指定の年・移築の年でなく、3つの国宝茶室・旧正伝院書院・元庵と弘庵）
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   犬山城 inuyama-castle.jp/about/（木曽川沿いの小高い山の後堅固の城・元和3年に成瀬正成が拝領し幕末まで城主・正成の時代に天守を改良・望楼型三重四階地下二階・最上階は高欄と廻縁がまわる望楼・
 *   昭和10年に国宝、昭和27年に再指定・平成16年に犬山城白帝文庫の所有）と inuyama-castle.jp の営業案内（9時〜17時、最終入場16時30分、検索結果）／
 *   針綱神社 aichinow.pref.aichi.jp/spots/detail/2366/（1000年以上鎮座・安産、子授け、八方除、厄除、長寿の神として崇敬・織田信康が手彫りの犬を奉納・名栗町にあった寛永12年に犬山祭が始まったとされる）と
 *   aichinow の検索結果（明治15年に今の場所へ）／有楽苑 aichinow.pref.aichi.jp/spots/detail/179/（現存する国宝の茶室は3つで如庵はその一つ、ほかは京都の妙喜庵待庵と龍光院密庵・重要文化財の旧正伝院書院・
 *   古図から復元した元庵・新築の弘庵・如庵が京都にあったころの庭を再現・9時30分〜17時、入苑16時30分まで・水曜と年末年始休苑）／
 *   城とまちミュージアム・からくりミュージアム city.inuyama.aichi.jp/kurashi/bunka/1001052/1001054/1001055.html（江戸時代を中心に犬山の歴史と文化・城下町を再現したジオラマ・南館に山車からくりの古人形と座敷からくり、
 *   からくり人形の操作実演、九代玉屋庄兵衛の製作公開・9時〜17時）／犬山成田山 aichinow.pref.aichi.jp/spots/detail/301/（昭和28年に本堂を建て開創・成田山新勝寺の名古屋別院・本尊は不動明王・
 *   中部地方最大の不動尊信仰の中心・犬山遊園駅から徒歩約10分）と同ページの検索結果（参拝6:30〜17:30）
 * 座標: OSM — 犬山城 way 234510746（historic=castle）・有楽苑 way 458703791（garden）・成田山 way 1549889312（place_of_worship）（Nominatim の中心）／針綱神社 node 964921968（place_of_worship）・
 *   文化史料館 node 1423992232（OSM の名前は「文化史料館」）・からくりミュージアムは OSM の名前「Imasen Inuyama Karakuri Museum Tamaya Shobei Workshop」（name:ja「ｶﾗｸﾘ展示館」）の node 4317966890（museum）・
 *   犬山駅 node 6063546671（station）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-169-531bd99f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "531bd99f-23ef-4302-8482-a71b80044b85";
const DAY1_ID = "1f89cb96-1243-4b6d-9f7b-930500ff8868";
const CASTLE = "4e435925-9e1e-4ab1-8f79-09439ed2a346";
const HONMACHI = "e13001e7-a59d-472e-b0a7-ba9728a4775c";
const URAKU = "1f58d14d-a8c1-4a62-bee4-14f10ce4d872";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "現存最古とされる天守の犬山城から、城のふもとの針綱神社、国宝茶室「如庵」の有楽苑へ。犬山駅のあたりで昼食をとり、城下町の歴史を伝える城とまちミュージアムとからくりの展示を見て、犬山成田山へ。木曽川のほとりの城下町を歩いてめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(CASTLE, { h: 9, m: 30, stay: 80, legs: [], lat: 35.3883304, lng: 136.9392776, address: "愛知県犬山市犬山北古券65-2",
    memo: "この旅は歩いてめぐります。名鉄犬山遊園駅から歩いて約15分。木曽川沿いの小高い山の上に建ち、背後を川に守られた「後堅固の城」です。元和3年（1617年）に尾張徳川家の重臣・成瀬正成がこの城を与えられ、成瀬家が幕末まで城主をつとめました。天守は三重四階・地下二階で、最上階は、手すりのついた縁がまわりをめぐる望楼になっています。昭和10年（1935年）に国宝となり、今は公益財団法人の犬山城白帝文庫が持っています。天守の中の階段は急なので、手すりを持ってゆっくり上り下りしましょう。入場の時間は公式の案内で確かめましょう。" }),
  cre("針綱神社", { h: 10, m: 55, stay: 25, legs: [walk(5)], lat: 35.387327, lng: 136.9398404, address: "愛知県犬山市犬山北古券",
    memo: "天守から城山を下りて歩いて約5分。1000年以上この地にまつられてきたと伝わる神社で、安産や子授け、長寿の神として信仰を集めてきました。織田信長の叔父・織田信康が、手彫りの犬を納めて安産と長寿を祈ったという言い伝えが残ります。かつては城下の名栗町にまつられていました。" + PRAY }),
  upd(URAKU, { h: 11, m: 30, stay: 60, legs: [walk(10)], lat: 35.388007, lng: 136.9422273, address: "愛知県犬山市犬山御門先1",
    memo: "針綱神社から東へ歩いて約10分。今に残る国宝の茶室は3つあり、ここにある「如庵」はそのうちの一つで、ほかは京都にある待庵と密庵です。庭には、国の重要文化財の旧正伝院書院や、古い図をもとに復元した茶室「元庵」、新しく建てた茶室「弘庵」も配され、如庵が京都にあったころの庭の姿をできるだけ再現しています。休苑日は公式の案内で確かめましょう。" }),
  upd(HONMACHI, { h: 12, m: 45, stay: 50, legs: [walk(15)], lat: 35.3802772, lng: 136.9457636, address: "愛知県犬山市",
    memo: "有楽苑から南へ、城下町を抜けて犬山駅のあたりまで歩いて約15分。駅のまわりで昼食にしましょう。" }, "犬山駅前（昼食）"),
  cre("城とまちミュージアム", { h: 13, m: 50, stay: 50, legs: [walk(15)], lat: 35.3856326, lng: 136.9392176, address: "愛知県犬山市犬山北古券8",
    memo: "犬山駅から城下町を北へ歩いて約15分。犬山市文化史料館の展示館で、武家と町人の文化が花ひらいた江戸時代を中心に、犬山の歴史と文化を紹介しています。江戸時代の城下町を再現したジオラマを見ると、午前中に歩いた町の成り立ちがよくわかります。休館日は公式の案内で確かめましょう。" }),
  cre("からくりミュージアム", { h: 14, m: 42, stay: 33, legs: [walk(2)], lat: 35.3854034, lng: 136.9392384, address: "愛知県犬山市犬山北古券8",
    memo: "城とまちミュージアムのとなり。山車に載せるからくりの古い人形や、座敷で楽しむからくりを展示していて、からくり人形を動かして見せる実演や、からくり人形師の九代目・玉屋庄兵衛による製作の様子も見られます。実演の時間は公式の案内で確かめましょう。" }),
  cre("犬山成田山", { h: 15, m: 35, stay: 55, legs: [walk(20)], lat: 35.3885758, lng: 136.9489222, address: "愛知県犬山市犬山北白山平5",
    memo: "からくりミュージアムから東へ歩いて約20分。千葉の成田山新勝寺の名古屋別院で、昭和28年（1953年）に本堂が建てられて開かれました。本尊は不動明王で、交通安全や商売繁昌を願う人の信仰を集めてきました。中部地方で最も大きな不動尊の信仰の中心とされます。" + PRAY + "帰りは、名鉄犬山遊園駅まで歩いて約10分です。" }),
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [CASTLE, HONMACHI, URAKU].join()) throw new Error("構成が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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
