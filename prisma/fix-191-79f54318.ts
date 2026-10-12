/**
 * #191 79f54318「新緑の奥入瀬渓流、マイナスイオンあふれる渓流歩き日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 4か所 09:30〜13:00 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ございます」）。石ヶ戸から歩いたあと銚子大滝へ「車」で移るなど、車の扱いもあいまいだった。
 *   タイトルの「マイナスイオン」は体への効き目をうたう言い方になるので外す。石ヶ戸の本文は 3b17f9a0 の文とほぼ同じなので書き直す。阿修羅の流れは OSM に点がないので、雲井の滝へ歩く道の途中の見どころとして書く
 * 車・路線バスと歩きの旅（JR新青森駅の近くでレンタカーを借りて返す）:
 *   奥入瀬渓流館 9:30 → 石ヶ戸（車をとめる）→ 雲井の滝（歩き、途中に阿修羅の流れ）→ 銚子大滝（歩き）→ 子ノ口（昼食）→ 路線バスで石ヶ戸へ戻り車で蔦温泉へ → 蔦沼 → 大町桂月の墓 16:42 → 新青森駅
 * タイトルを「新緑の奥入瀬渓流を歩き、子ノ口と蔦沼をめぐる日帰りプラン」に、季節は春のまま、説明文は書き直す
 * 奥入瀬のほかのしおり（d1e7bf32・3b17f9a0）の本文を読み、同じ言い回しにならないよう公式の文から書いた
 *   （石ヶ戸は名の由来を使わず瀬の流れ、雲井の滝は名の由来を使わず3段の滝と水量、子ノ口は水門と観光放流、渓流館は渓流で生まれた文学）。蔦沼と大町桂月の墓はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（十和田湖国立公園協会 towadako.or.jp、蔦温泉旅館 tsutaonsen.com）:
 *   ?page_id=297 蔦沼〜焼山（奥入瀬渓流館は四季の景観美や生態系、ここで生まれた文学にふれる施設・蔦温泉はブナの原生林に囲まれた一軒宿）／?page_id=287 奥入瀬渓流〜子ノ口（石ヶ戸の瀬は激しすぎずゆるすぎない流れ、
 *   5月中旬が撮影に向く・阿修羅の流れは奥入瀬を代表しテレビや雑誌、ポスターで紹介・雲井の滝は高さ20mで水量豊か、3段・銚子大滝は高さ7m、幅20m、本流でただ一つの滝で魚止めの滝・子ノ口の水門で観光放流・全長約14km）／
 *   ?page_id=55 奥入瀬渓流の四季（雪解け水、5月中旬に花と芽吹き）／?page_id=148 利用マナー（植物をとらない、決められた道と木道を歩く）／?page_id=18 施設（子ノ口の食堂）／
 *   tsutaonsen.com/faq/（蔦沼まではなだらかで整備された道・立ち寄り入浴は14:00まで）と /history/（久安3年に湯治小屋・大町桂月が紀行文「奥羽一周記」で十和田の名を全国に・桂月は蔦温泉に本籍を移し、1925年にこの地で生涯を閉じた・
 *   墓は宿の近く・1967年に蔦の森の自然研究路が完工）と トップページ（蔦沼は来るたびにご褒美がもらえる場所・春の芽吹き）
 * 座標: OSM — 奥入瀬渓流館 node 6161325321（visitor_centre）・石ヶ戸 node 2417882327（attraction）・雲井の滝 node 753051812・銚子大滝 node 7294281693（waterfall）・大町桂月の墓 node 7254085605（historic=tomb）
 *   （API で名前つき、桂月の墓は inscription に桂月の墓とある）／子ノ口橋 way 111063854（bridge:name=子ノ口橋、子ノ口の水門のある湖の出口の橋）・蔦沼 way 90767448（natural=water）（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-191-79f54318.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "79f54318-346f-4cd9-8e21-c26c4f044c1c";
const DAY1_ID = "61d31855-851f-428e-97b8-2a262a4a1656";
const ISHIGEDO = "5c92c0bd-935a-4852-a7bc-047137bd80ac";
const ASHURA = "fde33409-1d97-4047-b396-858e6e30c952";
const KUMOI = "ce2cd06e-b5ee-4ae6-b2b5-357568aec4c9";
const CHOSHI = "a2e18793-dfd7-4bea-b77f-b455d0537a41";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const car = (min: number) => ({ mode: "car" as const, min });
const bus = (min: number, line: string) => ({ mode: "bus" as const, min, line });
const BEAR = "クマが出ることもあるので、鈴を鳴らすなどして音を立て、決められた道を歩き、出会ったら静かに離れましょう。";
const PLANTS = "植物をとったり、遊歩道の外に踏み込んだりしないようにしましょう。";

const TITLE = "新緑の奥入瀬渓流を歩き、子ノ口と蔦沼をめぐる日帰りプラン";
const DESCRIPTION =
  "奥入瀬渓流館で渓流のことを知り、石ヶ戸から雲井の滝、銚子大滝へと、新緑の渓流沿いの遊歩道を歩いて十和田湖の子ノ口へ。昼食のあとは路線バスと車で蔦温泉へ移り、ブナの森に囲まれた蔦沼と、十和田を世に広めた文人・大町桂月の墓をたずねる春の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  cre("奥入瀬渓流館", { h: 9, m: 30, stay: 40, legs: [], lat: 40.5745801, lng: 140.9787529, address: "青森県十和田市奥瀬栃久保",
    memo: "この旅は車と路線バス、歩きでめぐります。JR新青森駅の近くでレンタカーを借りて、八甲田を越えて焼山へ。渓流歩きの前に、十和田・奥入瀬の四季の景色や、そこに暮らす生きもの、この渓流から生まれた文学にふれられる施設に立ち寄りましょう。奥入瀬渓流は全長約14kmあり、雪解けの水が流れる春から、5月の中ごろには足元に花が咲き、頭の上の木々が芽吹きはじめます。" }),
  upd(ISHIGEDO, { h: 10, m: 20, stay: 10, legs: [car(10)], lat: 40.5406131, lng: 140.978257, address: "青森県十和田市奥瀬",
    memo: "渓流館から車で約10分。ここに車をとめて、渓流沿いの遊歩道を上流へ歩きはじめます。石ヶ戸のあたりの瀬は、激しすぎずゆるすぎない流れで、新緑の5月の中ごろには写真を撮る人の多い場所です。遊歩道は車の通る国道と近いところもあるので、道を渡るときは車に気をつけましょう。" + BEAR }),
  upd(KUMOI, { h: 11, m: 30, stay: 15, legs: [walk(60)], lat: 40.520293, lng: 140.973099, address: "青森県十和田市奥瀬",
    memo: "石ヶ戸から渓流沿いを歩いて約60分。途中の「阿修羅の流れ」は、テレビや雑誌、ポスターでもよく紹介される奥入瀬を代表する流れで、岩をかむような白い流れを間近に見られます。雲井の滝は、高さ約20mの崖を3段になって落ちる、水量の多い滝です。" + PLANTS }, "雲井の滝（途中に阿修羅の流れ）"),
  upd(CHOSHI, { h: 13, m: 0, stay: 10, legs: [walk(75)], lat: 40.4886517, lng: 140.9511378, address: "青森県十和田市奥瀬",
    memo: "雲井の滝からさらに上流へ歩いて約75分。高さ約7m、幅約20mの滝で、奥入瀬渓流の本流にかかる滝はこれだけです。魚がこの滝より上へのぼれないことから「魚止めの滝」とも呼ばれます。滝のそばは岩が濡れて滑りやすいので、足元に気をつけましょう。" }),
  cre("子ノ口（昼食）", { h: 13, m: 30, stay: 50, legs: [walk(20)], lat: 40.4785078, lng: 140.9411645, address: "青森県十和田市奥瀬十和田湖畔子ノ口",
    memo: "銚子大滝から歩いて約20分、十和田湖から奥入瀬渓流が流れ出す子ノ口へ。湖の出口にある水門で水の量を調え、渓流の流れを保つ「観光放流」が行われています。湖のほとりに食堂があるので、ここで昼食にしましょう。" }),
  cre("蔦沼", { h: 15, m: 25, stay: 50, legs: [bus(25, "JRバス東北（子ノ口→石ヶ戸）"), car(25), walk(15)], lat: 40.6008787, lng: 140.9501044, address: "青森県十和田市奥瀬",
    memo: "子ノ口から路線バスで石ヶ戸へ戻り（約25分）、車で約25分の蔦温泉へ。宿のそばから歩いて約15分（あわせて約65分）。バスの本数は少ないので、時刻は公式の案内で確かめましょう。蔦温泉はブナの原生林に囲まれた一軒宿で、宿のまわりには1967年に完成した蔦の森の自然研究路が通っています。蔦沼までの道はなだらかで、春には森の木々が芽吹き、来るたびに違う表情を見せてくれます。" + BEAR + PLANTS }),
  cre("大町桂月の墓", { h: 16, m: 27, stay: 15, legs: [walk(12)], lat: 40.5963734, lng: 140.9564646, address: "青森県十和田市奥瀬",
    memo: "蔦沼から蔦温泉の方へ歩いて約12分。明治の文人・大町桂月は、紀行文で十和田の名を全国に知らせた人で、蔦温泉に本籍を移し、1925年にこの地で亡くなりました。墓は宿から少し離れた森の中にあります。亡くなった方をしのぶ場所ですので、静かに、敬意をもってお参りしましょう。帰りは、車で約1時間30分のJR新青森駅へ戻り、車を返しましょう。" }),
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
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [ISHIGEDO, ASHURA, KUMOI, CHOSHI].join()) throw new Error("構成が想定と違います");
  if (it.days[0].spots[1].photos.length) throw new Error("阿修羅の流れに写真があります");
  show("1日目", DAY1);
  console.log(`\nタイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, DAY1, { tx, remove: [ASHURA] });
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
