/**
 * チェックリスト #388 ebe67d3c「夢京橋キャッスルロードで食べ歩き、彦根の城下町グルメ日帰りプラン」の見直し（しおりえ(制作補助2)）
 * 彦根城 → 彦根城博物館 → 玄宮園 → 夢京橋キャッスルロード（昼食・食べ歩き）→ 四番町スクエア → 龍潭寺 → 清凉寺（7か所 09:00〜16:30、徒歩）
 * 既存の2か所はIDのまま直す。説明文の更新と並べ替えを1つのトランザクションで行う
 * 座標の出典: OSM/Overpass（「重要文化財 国宝 彦根城天守」案内板 35.27657,136.25222／彦根城博物館 35.27562,136.25362／玄宮園 35.27823,136.25406／
 *   夢京橋キャッスルロード 35.27106,136.25154／四番町スクエア 35.26960,136.25137／龍潭寺 35.28279,136.26645）、Nominatim（清凉寺 landuse=religious 35.282002,136.2655155）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-388-ebe67d3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ebe67d3c-6449-41d9-ba8f-c951cb74f968";
const DAY1_ID = "5ffac0de-7665-4318-93e4-42c9050dcb10";
const YUME_ID = "5d59a977-65bc-4450-8dbc-ddb43294c70d";
const CASTLE_ID = "6404a335-6858-416d-b66f-3aaeafade414";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "国宝の天守がそびえる彦根城と、井伊家の大名文化を伝える博物館・庭園をめぐり、白壁と黒格子の町家が並ぶ夢京橋キャッスルロードで食べ歩き。午後は大正ロマンの四番町スクエアから、佐和山のふもとの井伊家ゆかりのお寺まで、彦根の城下町を歩いて楽しむ日帰りプランです。";

const MEMO_CASTLE =
  "JR彦根駅から歩いて約15分。関ヶ原の戦いのあと、初代藩主・井伊直政の遺志を継いで1603年に築城が始まり、1622年に完成した城です。天守は大津城の天守を移したものと伝えられ、築城には石田三成の居城だった佐和山城の石垣や建物が移されたという言い伝えも残ります。1952年に天守は国宝に指定され、国宝の天守をもつ5つの城の一つに数えられます。自然の形の石を積み上げた「牛蒡積み」と呼ばれる石垣も見どころです。天守の中の階段はとても急なので、手すりを持ってゆっくり上り下りしましょう。";

const MEMO_YUME =
  "玄宮園から城のお堀に架かる京橋を渡って歩いて約20分。白壁と黒格子の町家風にそろえた建物が並ぶ通りで、江戸時代の城下町をイメージした町並みになっています。古さと新しさが同居する「OLD NEW TOWN」をテーマに、和菓子や洋菓子の店、地元ならではの品を扱う店が軒を連ね、近江牛を使った料理などを味わえる店もあります。ここで昼食をとり、食べ歩きを楽しみましょう。食べ歩きのときは、ごみを持ち帰り、店先や通りを汚さないようにしましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; dur: number; lat: number; lng: number; address: string; memo: string };

const MID: NewSpot[] = [
  {
    name: "彦根城博物館", h: 10, m: 30, stay: 50, dur: 10, lat: 35.27562, lng: 136.25362, address: "滋賀県彦根市金亀町1-1",
    memo:
      "天守から城山を下りて歩いて約10分、彦根藩の政庁だった表御殿を復元した博物館です。1987年に開館し、藩主だった井伊家に伝わる美術工芸品や古文書を中心に展示しています。藩主の暮らしの場だった「奥向き」は伝統的な木造建築で再現され、江戸時代に建てられた能舞台も、発掘の成果や絵図をもとに元の場所に移されています。休館日は公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "玄宮園", h: 11, m: 30, stay: 40, dur: 10, lat: 35.27823, lng: 136.25406, address: "滋賀県彦根市金亀町",
    memo:
      "博物館から歩いて約10分、彦根城の北側にある大名庭園です。延宝5年（1677年）、4代藩主・井伊直興がつくった池泉回遊式の庭で、中国・唐の玄宗皇帝の離宮になぞらえたといわれます。大きな池のまわりに、近江八景を模した景色が配され、池の島や入り江に架かる9つの橋を渡りながら景色の移り変わりを楽しめます。池越しに見上げる天守の姿も見どころです。国の名勝に指定されています。",
  },
];

const AFTER: NewSpot[] = [
  {
    name: "四番町スクエア", h: 13, m: 45, stay: 30, dur: 5, lat: 35.2696, lng: 136.25137, address: "滋賀県彦根市本町1丁目",
    memo:
      "夢京橋キャッスルロードから歩いてすぐ。大正時代の市場から始まった一角で、2005年に「大正ロマン」をテーマに生まれ変わりました。レトロな洋風の建物とガス灯の並ぶ町並みに、食事処や店が入っています。江戸の城下町の雰囲気の夢京橋とは違う時代の空気を感じながら、ひと休みしましょう。",
  },
  {
    name: "龍潭寺", h: 14, m: 45, stay: 60, dur: 30, lat: 35.28279, lng: 136.26645, address: "滋賀県彦根市古沢町",
    memo:
      "四番町スクエアから佐和山のふもとへ歩いて約30分。井伊家の祖先ゆかりの遠江（今の静岡県）の龍潭寺から、井伊家が彦根に移ったのにともない、元和元年（1615年）にこの地に移された井伊家の菩提寺です。方丈の56面のふすま絵は、松尾芭蕉の弟子・森川許六の作と伝えられます。枯山水の「ふだらくの庭」と、池泉の庭の2つの庭があり、「庭の寺」とも呼ばれます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
  {
    name: "清凉寺", h: 15, m: 50, stay: 40, dur: 5, lat: 35.282002, lng: 136.265516, address: "滋賀県彦根市古沢町",
    memo:
      "龍潭寺から歩いてすぐ。2代藩主・井伊直孝が、父で初代藩主の井伊直政の墓所として開いたお寺で、井伊家の菩提寺の一つです。境内は、石田三成の重臣・島左近の屋敷があった場所と伝えられ、関ヶ原の戦いで亡くなった人々の供養も行われてきました。お寺に伝わる「七不思議」の話も残ります。墓所や境内は祈りの場ですので、静かに、敬意をもってお参りください。帰りは彦根駅まで歩いて約25分です。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: "walk", transitDurationMin: s.dur, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== `${YUME_ID},${CASTLE_ID}`) throw new Error("構成が想定と違います");

  const order = [
    { id: CASTLE_ID, data: { visitTime: t(9, 0), stayDurationMin: 80, transitMode: null, transitDurationMin: null, transitLine: null, lat: 35.27657, lng: 136.25222, memo: MEMO_CASTLE } },
    ...MID.map(toCreate),
    { id: YUME_ID, data: { visitTime: t(12, 30), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 35.27106, lng: 136.25154, memo: MEMO_YUME } },
    ...AFTER.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (x.id === CASTLE_ID ? "彦根城(既存)" : "夢京橋キャッスルロード(既存)") : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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
