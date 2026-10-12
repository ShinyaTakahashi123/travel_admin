/**
 * チェックリスト #432 87674ca9「横山展望台と英虞湾、リアス海岸の真珠養殖の海を望む1泊2日」の見直し（しおりえ(制作補助2)）
 * 車の旅。1日目: 天の岩戸（新規）→ 横山展望台 →（昼食）→ 大王埼灯台（新規）→ 桐垣展望台（新規）→ 金比羅山展望台（新規）（5か所 09:00〜16:30）
 *        2日目: 英虞湾めぐりの遊覧船（賢島）→ 西山慕情が丘（新規）→ 志摩大橋（新規）→ ビン玉ロード（新規）（4か所 09:30〜13:10。帰る日）
 * 2日目の既存スポット「英虞湾（志摩マリンレジャー）」は、名前に運航会社の名前が入っているので、IDのまま「英虞湾めぐりの遊覧船（賢島）」に変え、座標も賢島の乗り場の点に直す
 * 既存の2か所の本文は、開いた公式で確かめられない記述（横山の標高・島の数・2018年のリニューアル、御木本幸吉と「真珠養殖発祥の地」、リアス地形のでき方、
 *   「真珠湾」の呼び名など）が多かったので、公式の説明で書き直す
 * 写真: 横山展望台・英虞湾の遊覧船の写真は合っているので残す
 * 本文の出典: 志摩市観光協会「絶景スポット」 https://www.kanko-shima.com/feature/bestscenicspots/ （横山展望台・大王埼灯台・桐垣展望台・金比羅山・西山慕情が丘・
 *   志摩大橋・ビン玉ロード・天の岩戸）、遊覧船 観光三重 https://www.kankomie.or.jp/report/610
 * 座標の出典: Nominatim（天の岩戸 34.4081089,136.7634474／横山展望台 34.3318666,136.7990173／大王埼灯台 34.2761539,136.8995292／桐垣展望台 34.2874687,136.8375924／
 *   志摩大橋 34.2653689,136.8148449／ビン玉ロード 34.2952368,136.7519395）、OSM/Overpass（金比羅山展望台 node 3708014750 34.2695784,136.7737563／
 *   遊覧船の乗り場 node 12548011111 34.3074155,136.8188539／西山慕情ヶ丘 node 4172848037 34.3015686,136.8288182）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-432-87674ca9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "87674ca9-f370-4383-9108-f19d9f510274";
const DAY1_ID = "1ef065ea-a1c3-4ada-ba5a-b10c9db79845";
const DAY2_ID = "25df8673-7102-42fa-9355-a28a394d5f07";
const YOKOYAMA = "7d1ea553-f8d9-4210-be08-981482599775";
const CRUISE = "ea8e69c6-d904-4bf3-9011-7af24ce1c647";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "日本神話ゆかりの天の岩戸から、英虞湾を一望する横山展望台、中を登れる大王埼灯台、夕日の名所の桐垣展望台、志摩半島でいちばん高いとされる金比羅山の展望台をめぐります。2日目は賢島から遊覧船で真珠の養殖いかだが浮かぶ英虞湾へ。西山慕情が丘、志摩大橋、漁具のビン玉が並ぶビン玉ロードを訪ねる、志摩半島のリアス海岸を楽しむ車の1泊2日です。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  cre("天の岩戸", 9, 0, 40, null, null, 34.408109, 136.763447, "三重県志摩市磯部町恵利原",
    "旅の始まりは、日本神話ゆかりの地として知られる天の岩戸へ。鳥居をくぐると杉木立に包まれた参道が続き、森の奥の岩戸のまわりには清らかな水が流れています。岩間から湧き出る岩清水は「日本名水百選」にも選ばれています。春には、志摩市の天然記念物のオオシマザクラが咲きます。" + RESPECT),
  {
    id: YOKOYAMA,
    data: {
      visitTime: t(10, 5), stayDurationMin: 65, transitMode: "car", transitDurationMin: 25, transitLine: null, lat: 34.331867, lng: 136.799017,
      memo: "天の岩戸から車で横山展望台へ。横山の山頂にある、英虞湾を眺める絶景スポットです。横山には5つの展望台が点在し、広いウッドデッキの「横山天空カフェテラス」、のんびりできる「木もれ日テラス」、ベンチで風を感じる「そよ風テラス」、5つの中でいちばん標高が高く、時期によっては富士山が見えることもある「みはらし展望台」、海に近い「英虞湾展望台」と、それぞれ違う景色を楽しめます。入り組んだ海岸線と大小の島々が織りなす英虞湾の眺めを楽しんだら、昼食にしましょう。",
    },
  },
  cre("大王埼灯台", 12, 40, 60, "car", 25, 34.276154, 136.899529, "三重県志摩市大王町波切54",
    "昼食のあとは、大王崎の岸壁に立つ大王埼灯台へ。海に突き出した断崖の上に建ち、荒々しい岩肌と広い海の景色は迫力満点です。全国でも珍しい、中を登れる「参観灯台」の一つで、頂上からは大王町の町並みと海を眺められます。白い灯台と石坂が織りなす町並みから、大王町は「絵描きの町」として親しまれ、近くの「八幡さん公園」には絵筆を持った画家の像が立ち、その視線の先に灯台と熊野灘が広がります。参観できる時間は公式の案内で確かめ、断崖の近くでは足元に気をつけましょう。"),
  cre("桐垣展望台", 13, 55, 40, "car", 15, 34.287469, 136.837592, "三重県志摩市大王町波切2199",
    "大王埼灯台から車で、ともやま公園の中にある桐垣展望台へ。海に近いウッドデッキから英虞湾を間近に眺められ、右手に賢島、前方に間崎島、左手に志摩半島が一望できます。夕日が海面をオレンジ色に染める景色でも知られる、夕日の名所です。"),
  cre("金比羅山展望台", 15, 0, 90, "car", 25, 34.269578, 136.773756, "三重県志摩市志摩町御座",
    "桐垣展望台から車で、志摩半島でいちばん標高が高いとされる金比羅山へ。山頂の展望台は、まわりに景色をさえぎるものがなく、360度の大パノラマの中に、英虞湾の入り組んだリアス海岸や点在する島々、遠く紀伊山地まで見渡せます。時期によっては英虞湾の向こうに富士山が見えることもあります。山頂まで続く遊歩道は歩きやすく整えられているので、景色を楽しみながらハイキングしましょう。今夜は賢島のあたりに泊まります。"),
];

const day2 = [
  {
    id: CRUISE,
    data: {
      name: "英虞湾めぐりの遊覧船（賢島）", address: "三重県志摩市阿児町神明",
      visitTime: t(9, 30), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.307416, lng: 136.818854,
      memo: "2日目は、近鉄の賢島駅の目の前にある乗り場から、遊覧船で英虞湾をめぐります（約50分）。英虞湾は、志摩市の特産の真珠や牡蠣などの養殖がさかんな、波の穏やかな内海です。コースの途中では、いくつもの小島や真珠の養殖いかだを見ることができ、真珠の工場に立ち寄って、アコヤ貝に核を入れる作業の実演を見学できる船もあります。前の日に展望台から眺めた英虞湾を、今度は海の上から間近に感じましょう。出航の時間は公式の案内で確かめましょう。",
    },
  },
  cre("西山慕情が丘", 10, 45, 30, "car", 10, 34.301569, 136.828818, "三重県志摩市阿児町立神",
    "賢島から車で西山慕情が丘へ。阿児町の高台にある展望スペースで、リアス海岸が織りなす海岸線と大小の島々が広がる英虞湾を一望できます。夕暮れどきの景色は「日本の夕陽百選」にも選ばれています。"),
  cre("志摩大橋", 11, 40, 25, "car", 25, 34.265369, 136.814845, "三重県志摩市志摩町和具",
    "英虞湾をまたぐ全長234mの、真珠のように白いアーチ橋です。志摩市のランドマークとして親しまれ、橋の上からはリアス海岸や周囲の山々など、英虞湾の景色を一望できます。橋には駐車場がないので、車を止める場所に気をつけましょう。"),
  cre("ビン玉ロード", 12, 30, 40, "car", 25, 34.295237, 136.75194, "三重県志摩市浜島町浜島1416-8",
    "浜島町の海沿いに続く散策道で、真珠養殖などの漁具として使われていたビン玉が並んでいます。一直線に伸びる遊歩道から、青い海や対岸の山々を眺めながら歩け、志摩の自然と漁業の文化を身近に感じられます。すぐ近くには、白い砂浜が広がる大矢浜もあります。志摩半島のリアス海岸をめぐる旅を、ここで締めくくりましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== YOKOYAMA || days[1].spots.map((s) => s.id).join() !== CRUISE) throw new Error("構成が想定と違います");

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [n, order] of [[1, day1], [2, day2]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`D${n} ${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? (d.name ?? "横山展望台") + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
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
