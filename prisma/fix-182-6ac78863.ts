/**
 * #182 6ac78863「大正池の神秘的な風景、枯れ木と穂高を望む上高地さんぽ」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ようこそ」）。説明文に開く時期の日付があった。
 * タイトルを内容に合わせて「大正池と岳沢湿原、上高地から乗鞍高原の水辺と滝をめぐる日帰りプラン」に変える
 * 上高地のほかのしおり（5b3004dc: 大正池・田代池・田代橋・小梨平・穂高神社奥宮・明神池・徳沢・河童橋・清水川・ウェストン碑・ビジターセンター、84dca3bf: 大正池・田代池・ウェストン碑・明神池・河童橋・VC・小梨平・
 *   インフォメーションセンター）で上高地の見どころの多くが書かれているので、上高地は午前だけにし、午後は乗鞍高原へ回る。本文はほかのしおりで使っていない話で書いた
 *   （大正池: 「梓湖」の呼び名・面積が半分以下に・土砂を取り除く作業、河童橋: 跳ね橋から吊り橋へ・芥川龍之介『河童』）。岳沢湿原・乗鞍高原（まいめの池・善五郎の滝・三本滝）はほかのしおりにない
 * 上高地は冬に閉じ、マイカー規制がある（沢渡からシャトルバス）ので、季節は春・夏・秋にする
 * 車とシャトルバスの旅（JR松本駅の近くでレンタカーを借りて返す。上高地は沢渡の駐車場からシャトルバス）:
 *   大正池 9:30 → 岳沢湿原 → 河童橋（昼食）→ 一の瀬草原 まいめの池 → 善五郎の滝 → 三本滝 16:40 → 松本駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   上高地公式ウェブサイト https://www.kamikochi.or.jp/learn/spots/11/ 大正池（大正4年の焼岳の噴火で溶岩や泥流が梓川をせき止めた・当時は「梓湖」とも・面積は半分以下に・立ち枯れの木が減った・
 *     土砂を取り除く浚渫作業・朝もや）／spots/49/ 焼岳（今も噴煙をたなびかせる活火山・事前に気象庁の火山情報を確認）／spots/1339/ 岳沢湿原（バスターミナルから河童橋を渡り梓川右岸の木道を約20分・
 *     岳沢と善六沢の流れが合う小さな湿原・サワラやチョウセンゴヨウの原生林・展望デッキから六百山と立ち枯れの木）／spots/1319/ 河童橋（跳ね橋から明治43年に吊り橋・名の由来は諸説・芥川龍之介の小説『河童』）／
 *     /enjoy/restaurants_cafes/（上高地のお食事・喫茶）
 *   長野県公式観光サイト Go NAGANO https://www.go-nagano.net/nature-and-outdoors/id22415 乗鞍高原（乗鞍岳の東の麓・中部山岳国立公園・標高1200〜1800m・一の瀬草原の「まいめの池」に乗鞍岳が映る・
 *     のりくらトレイルの善五郎の滝・三本滝は日本の滝百選で水源の異なる3本の滝が一か所に集まる・修験者の修行の場と伝わる・三本滝駐車場から約1.7kmの往復）
 * 座標: OSM — 大正池 way 439471453・まいめの池 way 355626545（Nominatim の中心）／河童橋ビューポイント node 4439868073・善五郎の滝 node 3621316221・三本滝 node 748620577（node は API で名前つき）／
 *   岳沢湿原 node 7119197685（name は英語の「Takezawa mash」だけ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-182-6ac78863.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6ac78863-2332-442e-a55e-a594941d8df1";
const DAY_ID = "3ac7a31f-2a78-47e8-aebd-58f1b235124f";
const TAISHO = "9fa35294-30b6-48b6-a233-978ec41c56a3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";

const TITLE = "大正池と岳沢湿原、上高地から乗鞍高原の水辺と滝をめぐる日帰りプラン";
const DESCRIPTION =
  "朝は上高地へ。焼岳と穂高を映す大正池から、木道の先の岳沢湿原を歩き、河童橋のたもとで昼食。午後は乗鞍高原へ車で回り、乗鞍岳を映すまいめの池、森の中の善五郎の滝、3本の流れが集まる三本滝をめぐる、北アルプスの水辺と滝の日帰りプランです。";
const SEASONS = ["spring", "summer", "autumn"];

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(TAISHO, { h: 9, m: 30, stay: 40, legs: [], lat: 36.2287261, lng: 137.6186512, address: "長野県松本市安曇上高地",
    memo: "この旅は車とシャトルバスでめぐります。JR松本駅の近くでレンタカーを借りて沢渡の駐車場まで約1時間、上高地はマイカーで入れないので、シャトルバスに乗りかえて約30分の大正池へ。大正4年の焼岳の噴火で、溶岩や泥流が梓川をせき止めてできた池で、できたころは広く、「梓湖」とも呼ばれていたようです。今は面積が半分以下になり、立ち枯れの木も減りましたが、流れ込む土砂を取り除く作業を続けて、景色が守られています。風のない朝は、焼岳や穂高連峰が水面に映ります。焼岳は今も噴煙を上げる活火山なので、出かける前に火山の情報を確かめましょう。" + BEAR }),
  cre("岳沢湿原", { h: 10, m: 40, stay: 40, legs: [bus(10, "上高地線シャトルバス（大正池→上高地バスターミナル）"), walk(20)], lat: 36.2544902, lng: 137.638172, address: "長野県松本市安曇上高地",
    memo: "大正池からバスで約10分の上高地バスターミナルへ。河童橋を渡り、梓川の右岸の木道を歩いて約20分。岳沢から流れてくる水と善六沢が合わさるあたりに広がる小さな湿原で、サワラやチョウセンゴヨウなどの原生林に囲まれ、透き通った湧き水が流れています。展望デッキからは、正面に六百山と立ち枯れの木を望めます。木道から外れないように歩きましょう。" }),
  cre("河童橋（昼食）", { h: 11, m: 35, stay: 50, legs: [walk(15)], lat: 36.2488431, lng: 137.6378376, address: "長野県松本市安曇上高地",
    memo: "岳沢湿原から木道を戻って約15分。梓川に架かる木の吊り橋で、もとは両岸から木材をせり出した跳ね橋でしたが、明治43年に吊り橋になりました。芥川龍之介の小説『河童』に上高地や河童橋が描かれたことで、名が広く知られるようになったといわれます。橋のまわりには食事や喫茶のできる施設が集まっているので、ここで昼食にしましょう。" }),
  cre("一の瀬草原 まいめの池", { h: 13, m: 35, stay: 60, legs: [walk(5), bus(30, "上高地線シャトルバス（上高地バスターミナル→沢渡）"), car(35)], lat: 36.1065842, lng: 137.6269349, address: "長野県松本市安曇",
    memo: "バスで沢渡の駐車場へ戻り、車で乗鞍高原へ（あわせて約70分）。乗鞍岳の東のふもと、標高1200〜1800mに広がる高原で、一の瀬草原には白樺の林や湿地、池が点在します。まいめの池は、風のない日に乗鞍岳が水面に映ることで知られる池です。草原の小道を歩き、池の水辺で乗鞍岳を眺めましょう。乗鞍岳も火山なので、出かける前に火山の情報を確かめましょう。" + BEAR }),
  cre("善五郎の滝", { h: 14, m: 55, stay: 30, legs: [car(5), walk(15)], lat: 36.1182814, lng: 137.6179345, address: "長野県松本市安曇",
    memo: "まいめの池から車で約5分、森の小道を歩いて約15分。乗鞍高原を代表する滝の一つで、清らかな流れが岩壁を落ちていきます。冬には滝が凍り、氷の滝になるといわれます。滝の近くは岩が濡れて滑りやすいので、足元に気をつけましょう。" + BEAR }),
  cre("三本滝", { h: 16, m: 10, stay: 30, legs: [walk(15), car(10), walk(20)], lat: 36.1184841, lng: 137.5940433, address: "長野県松本市安曇",
    memo: "善五郎の滝から駐車場へ戻り、車で約10分の三本滝駐車場へ。針葉樹の森の道を歩き、吊り橋を渡って約20分（あわせて約45分）。日本の滝百選に選ばれた滝で、水源の異なる3本の滝が一か所に集まり、それぞれ違う流れの姿を見せます。かつては修験者が修行した場所と伝えられます。森の道では足元に気をつけましょう。" + BEAR + "帰りは、駐車場まで歩いて戻り、車で約70分のJR松本駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== TAISHO) throw new Error("構成が想定と違います");
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
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION, seasons: SEASONS as never } });
      await setDaySpotOrder(DAY_ID, DAY, { tx });
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
