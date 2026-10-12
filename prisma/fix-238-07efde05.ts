/**
 * #238 07efde05「河津七滝と修善寺、伊豆の渓谷と古湯を巡るプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜12:40 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「お楽しみください」）。
 *   河津七滝の座標はバス停（河津七滝温泉）の点だったので、滝（初景滝）の点に直す
 * 車の旅（JR三島駅の近くでレンタカーを借りて返す）:
 *   河津七滝 9:30 → 浄蓮の滝 → 道の駅天城越え（昼食・昭和の森会館）→ 修善寺温泉（独鈷の湯・竹林の小径）→ 修禅寺 → 指月殿 16:30 → 三島駅
 *   伊豆市・河津町のほかのしおりはなく（地域名でも確かめた）、同じ名前のスポットの本文と重ならない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   伊豆半島ジオパーク https://izugeopark.org/geosites/kamadaru/ （登り尾南火山の溶岩が覆いかぶさる釜滝・柱状節理・遊歩道は滝の飛沫で滑りやすい）と、
 *     検索結果の https://izugeopark.org/geosites/ebidaru/ （エビ滝だけ登り尾南火山とは別の溶岩で柱状節理がない）／
 *     静岡新聞 https://www.at-s.com/spot/article/137696 （7つの滝の名前・「ななだる」・全長850mの遊歩道・踊り子と学生の像）
 *   伊豆市観光情報サイト https://kanko.city.izu.shizuoka.jp/sightseeing/<名前>/ —
 *     jourenfalls 浄蓮の滝（日本の滝100選・高さ25m、幅7m・玄武岩の崖・ハイコモチシダ・下流のわさび田）／
 *     amagigoe 道の駅天城越え（レストラン・売店・わさび）／showanomori 昭和の森会館（天城山の動植物の展示・伊豆近代文学博物館・井上靖旧邸・第3水曜休館）／
 *     tokkonoyu 独鈷の湯（807年に空海が独鈷杵で岩を打ち湧き出た・伊豆最古の温泉街といわれる・見学のみ）／
 *     bamboo-gove-path 竹林の小径（平成6年から3年かけて整えた桂川沿いの散策道・円形のベンチ）／
 *     shuzenji-temple 修禅寺（807年に弘法大師が開いたと伝わる・範頼の幽居、頼家の最期・宝物殿「瑞宝蔵」に空海ゆかりの品と政子の寄進品）
 *   指月殿: 修善寺温泉観光協会 https://www.shuzenji-kankou.com/history-top.html （伊豆最古の木造建築といわれ、北条政子が頼家の冥福を祈って建てた）
 * 座標: OSM — 初景滝 node 735223034・浄蓮の滝 node 4443685389・修禅寺 node 4470730097・指月殿 node 5321377187（node は API で名前つきを確かめた）／
 *   道の駅天城越え way 388705200・独鈷の湯公園 way 548862758（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-238-07efde05.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "07efde05-b25f-4251-a8e3-c12e4918bfb1";
const DAY_ID = "26415f4b-e455-47a9-87f1-bcfc25c4b0a2";
const NANADARU = "ef11e742-860e-4825-a7b0-b6421a863062";
const SHUZENJI_ONSEN = "cc162b5d-fe02-47be-bb66-2a001a073160";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "火山の溶岩がつくった河津七滝の7つの滝を歩いてめぐり、天城の浄蓮の滝と道の駅へ。午後は修善寺温泉の独鈷の湯と竹林の小径を歩き、修禅寺と指月殿で源氏ゆかりの歴史にふれる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(NANADARU, { h: 9, m: 30, stay: 90, legs: [], lat: 34.7982669, lng: 138.9322858, address: "静岡県賀茂郡河津町梨本",
    memo: "この旅は車でめぐります。JR三島駅の近くでレンタカーを借りて、天城峠を越えて車で約80分。河津川に沿って並ぶ、釜滝・エビ滝・蛇滝・初景滝・カニ滝・出合滝・大滝の7つの滝の総称で、「ななだる」と読みます。約850mの遊歩道で順にめぐれます。多くの滝は近くの登り尾南火山から流れ出た溶岩にかかっていて、エビ滝を除く6つの滝では、溶岩が冷えて縮むときにできた柱のような岩「柱状節理」が見られます。遊歩道沿いには、小説『伊豆の踊子』ゆかりの踊り子と学生の像も立っています。遊歩道は滝のしぶきで滑りやすいところがあるので、足元に気をつけて歩きましょう。" }),
  cre("浄蓮の滝", { h: 11, m: 25, stay: 35, legs: [car(25)], lat: 34.8718704, lng: 138.9221185, address: "静岡県伊豆市湯ケ島",
    memo: "七滝から国道414号を北へ、車で約25分（冬は峠道の凍結に気をつけましょう）。狩野川の上流にかかる、高さ25m、幅7mの滝で、日本の滝100選に選ばれています。木々に囲まれた玄武岩の崖を水が落ち、崖には天然記念物のシダ・ハイコモチシダが茂ります。滝の下流の沢沿いには、段になったわさび田も見られます。滝のまわりは水しぶきで濡れているので、足元に気をつけましょう。" }),
  cre("道の駅天城越え", { h: 12, m: 10, stay: 80, legs: [car(10)], lat: 34.8558299, lng: 138.922182, address: "静岡県伊豆市湯ケ島892-6",
    memo: "浄蓮の滝から車で約10分。天城の森の中にある道の駅で、レストランがあるので、ここで昼食にしましょう。同じ敷地の昭和の森会館には、天城山の動物や植物を紹介する森の情報館と、伊豆近代文学博物館があり、庭には作家・井上靖の旧邸も移されています。休館の日は公式の案内で確かめましょう。" }),
  upd(SHUZENJI_ONSEN, { h: 13, m: 55, stay: 55, legs: [car(25)], lat: 34.9702012, lng: 138.9277769, address: "静岡県伊豆市修善寺",
    memo: "道の駅から車で約25分、修善寺温泉の駐車場に停めて歩きます。温泉街の中を流れる桂川のほとりに、修善寺温泉の始まりとされる「独鈷の湯」があります。平安時代のはじめ、この地を訪れた空海（弘法大師）が、病気の父の体を洗う少年の孝行に心を打たれ、手にした仏具・独鈷杵で川の岩を打つと湯が湧き出たと伝わり、修善寺温泉は伊豆で最も古い温泉街といわれています。今は見るだけで、入ることはできません。近くには、平成のはじめに桂川沿いに整えられた竹林の小径があり、竹林の中にある円形のベンチでひと休みできます。温泉街には人が暮らしているので、静かに歩きましょう。" }),
  cre("修禅寺", { h: 14, m: 53, stay: 52, legs: [walk(3)], lat: 34.9715281, lng: 138.9275728, address: "静岡県伊豆市修善寺964",
    memo: "独鈷の湯から歩いて約3分。平安時代のはじめに弘法大師が開いたと伝わる、修善寺温泉の始まりの寺です。鎌倉時代には、源範頼や2代将軍の源頼家がこの地に移され、源氏の悲しい歴史の舞台にもなりました。宝物殿「瑞宝蔵」では、空海ゆかりの品や、北条政子が寄せた品などを見られます。宝物殿の時間は公式の案内で確かめましょう。" + PRAY }),
  cre("指月殿", { h: 15, m: 50, stay: 40, legs: [walk(5)], lat: 34.9693833, lng: 138.9280189, address: "静岡県伊豆市修善寺",
    memo: "修禅寺から桂川を渡って、歩いて約5分。修善寺で亡くなった源頼家の冥福を祈って、母の北条政子が建てたとされる経堂で、伊豆に残る木造の建物では最も古いといわれています。亡くなった人をしのぶ場所なので、静かに見学しましょう。" + PRAY + "帰りは、車で約50分のJR三島駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [NANADARU, SHUZENJI_ONSEN].join()) throw new Error("構成が想定と違います");
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
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
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
