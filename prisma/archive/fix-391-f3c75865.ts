/**
 * チェックリスト #391 f3c75865「三内丸山遺跡で縄文時代にタイムスリップ、青森の歴史探訪プラン」の見直し（しおりえ(制作補助2)）
 * 三内丸山遺跡 → 青森県立美術館 →（市営バス）青森魚菜センター（昼食）→ ねぶたの家 ワ・ラッセ → 八甲田丸 → A-FACTORY（6か所 09:00〜16:50）
 * 既存の1か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」だったので書き直す。説明文の「日本最大級」も外す）
 * 座標の出典: OSM/Overpass（三内丸山遺跡 archaeological_site 40.811035,140.697764／青森県立美術館 40.807292,140.700886／青森魚菜センター 40.825912,140.735848／
 *   ねぶたの家 ワ・ラッセ 40.829534,140.735926／青函連絡船メモリアルシップ八甲田丸 40.831644,140.736451／A-FACTORY 40.830227,140.735155）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-391-f3c75865.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f3c75865-519e-4488-8677-d4d9a3b45ec5";
const DAY1_ID = "df789679-dd61-43d6-89bd-ab323542e302";
const SANNAI_ID = "8bd6c4bd-0777-4089-9a98-94dc67dea9a3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界遺産の三内丸山遺跡で縄文時代の大きなむらの跡を歩き、遺跡の発掘現場から着想を得た県立美術館へ。午後は青森駅の近くに移り、市場の「のっけ丼」で昼食をとってから、ねぶた祭の歴史を伝えるワ・ラッセ、青函連絡船の八甲田丸、りんごの工房のあるA-FACTORYをめぐる、青森の歴史にふれる日帰りプランです。";

const MEMO_SANNAI =
  "青森駅からバスで約30分。今から約5900年前から4200年前まで、長い期間にわたって人々が暮らした縄文時代の大規模な集落の跡です。たくさんの竪穴建物や掘立柱建物の跡、大人や子どもの墓、幅約12m・長さ420mにわたる道の跡などが見つかりました。直径約1mのクリの木の柱6本で建てられた大型掘立柱建物や、大型竪穴建物が復元され、当時のむらの大きさを実感できます。出土品のうち1958点が国の重要文化財に指定され、「さんまるミュージアム」などで見られます。2000年に国の特別史跡に、2021年に「北海道・北東北の縄文遺跡群」の一つとして世界文化遺産に登録されました。休館日は公式の案内で確かめてから訪れましょう。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode: string; dur: number; line?: string; lat: number; lng: number; address: string; memo: string };

const AFTER: NewSpot[] = [
  {
    name: "青森県立美術館", h: 11, m: 0, stay: 75, mode: "walk", dur: 10, lat: 40.807292, lng: 140.700886, address: "青森県青森市安田",
    memo:
      "三内丸山遺跡のとなり、歩いて約10分の美術館です。2006年に開館し、建築家・青木淳が、三内丸山遺跡の発掘現場から着想を得て設計しました。発掘のトレンチ（溝）のように、地面が幾何学的に切り込まれているのが特徴です。四層吹き抜けの大きなホールには、マルク・シャガールがバレエ「アレコ」のために描いた舞台背景画が展示され、屋外には奈良美智の高さ約8.5mの立体作品《あおもり犬》がいます。展示替えなどで休館する期間があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "青森魚菜センター", h: 13, m: 0, stay: 50, mode: "bus", dur: 45, line: "青森市営バス（県立美術館前→青森駅前、約30分）",
    lat: 40.825912, lng: 140.735848, address: "青森県青森市古川1-11-16",
    memo:
      "美術館の前からバスで青森駅へ戻り、駅から歩いて約5分。地元で「古川市場」の名で親しまれている市場です。案内所で食事券を買い、ご飯を受け取ってから、市場の中の店をめぐって、刺身や総菜など好きな具をのせて自分だけの丼をつくる「のっけ丼」で昼食にしましょう。ご飯がなくなると終わることがあり、定休日もあるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "ねぶたの家 ワ・ラッセ", h: 14, m: 0, stay: 60, mode: "walk", dur: 10, lat: 40.829534, lng: 140.735926, address: "青森県青森市安方",
    memo:
      "市場から歩いて約10分、青森駅のすぐそばの海辺にある、青森ねぶた祭を1年を通して体感できる施設です。実際に祭りに出た大型のねぶた4台が展示され、間近で見るとその大きさと色あざやかさに圧倒されます。祭りの始まりや歴史、ねぶたづくりの技も紹介されています。囃子の演奏やハネトの体験ができる日もあるので、祭りの熱気を感じてみましょう。",
  },
  {
    name: "青函連絡船メモリアルシップ八甲田丸", h: 15, m: 5, stay: 60, mode: "walk", dur: 5, lat: 40.831644, lng: 140.736451, address: "青森県青森市柳川1-112-15地先",
    memo:
      "ワ・ラッセから海沿いを歩いて約5分。1964年に就航し、1988年に青函トンネルの開業で青函連絡船が終わるまで、青森と函館を結んだ船です。歴代の青函連絡船の中で最も長い23年7か月にわたって運航されました。1階の車両甲板には、船で海を渡っていた鉄道車両が当時のまま展示され、昭和の青森駅前の町並みを再現した展示もあります。冬は休館日があるので、公式の案内で確かめてから訪れましょう。",
  },
  {
    name: "A-FACTORY", h: 16, m: 10, stay: 40, mode: "walk", dur: 5, lat: 40.830227, lng: 140.735155, address: "青森県青森市柳川",
    memo:
      "八甲田丸から歩いてすぐ、三角屋根が6つ並ぶ建物の中に、青森の食べ物を集めた市場と、りんごのお酒・シードルの工房がある施設です。工房では、醸造の様子をガラス越しに見学できます。りんごやホタテなど青森の名産を使った菓子や食品も並ぶので、旅の最後にお土産を選びましょう。お酒は20歳から。車を運転する人は飲まないでください。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.dur, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== SANNAI_ID) throw new Error("構成が想定と違います");

  const order = [
    { id: SANNAI_ID, data: { visitTime: t(9, 0), stayDurationMin: 110, transitMode: null, transitDurationMin: null, transitLine: null, lat: 40.811035, lng: 140.697764, memo: MEMO_SANNAI } },
    ...AFTER.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "三内丸山遺跡(既存)" : d.name} ${String(d.memo).length}字`);
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
