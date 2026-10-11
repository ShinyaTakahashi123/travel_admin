/**
 * #168 50822458「宇和島市営闘牛場、勇壮な「牛の突きあい」の伝統文化に触れるプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:30 で、昼食と帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」）。闘牛はいつでも見られるような書き方だった
 * 闘牛場の座標（33.2311,132.5539）は OSM の闘牛場の建物から約1.7km西にずれていたので直す
 * 車の旅（JR宇和島駅前でレンタカーを借りて返す）:
 *   宇和島市営闘牛場 9:30 → 和霊神社 → 遊子水荷浦の段畑 → 宇和島駅前（昼食）→ 南楽園 → 岩松の町並み 16:30 → 宇和島駅
 * タイトル・季節はそのまま、説明文は書き直す
 * 宇和島のほかのしおり（e0408f7b・206f3ee6）の本文を読み、使っていない話で書いた（和霊神社は山家清兵衛の最期の話・和霊信仰の総本山・随神門の面でなく、神幸橋と空襲の跡）。
 *   宇和島城・天赦園・伊達博物館・歴史資料館・卯之町・開明学校はほかのしおりが使っているので入れない。段畑・南楽園・岩松の町並みはほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典（宇和島市観光物産協会 uwajima.org、宇和島市 city.uwajima.ehime.jp）:
 *   uwajima.org/spot/tougyujyou.html（闘牛場: 全国でも珍しいドーム型・直径20mの土俵・宇和島地方独特の民俗文化・年4回の定期大会・大会以外は営業時間内に無料で見学）／
 *   uwajima.org/spot/index3.html（和霊神社: 祭神の山家清兵衛は米沢の生まれで伊達秀宗のもと産業の拡充と民政の安定に力を尽くした・石造りの大鳥居・神幸橋は須賀川に架かる太鼓橋、宇和島空襲で崩れず焼夷弾の跡が残る）／
 *   city.uwajima.ehime.jp/site/sizen-bunka/163dannbata.html（遊子水荷浦の段畑: 平成19年に国の重要文化的景観・標高約60m、平均勾配約40度、50段余・石積みは平均1m以上・江戸後期のムギとサツマイモから、
 *   明治のクワ、サツマイモ、昭和30年以降の柑橘を経て今は主にジャガイモ・イワシ漁、真珠、ハマチ養殖と補い合ってきた）／
 *   uwajima.org/spot/nanrakuen.html（南楽園: 四国最大級の日本庭園・平成元年に日本の都市公園100選・池泉回遊式・山、里、町、海の景観・三万株の花菖蒲と梅、桜、つつじ・9:00〜17:00）／
 *   uwajima.org/spot/iwamatsu.html（岩松の町並み: 明治から昭和初期の建物の町並み・獅子文六の小説「てんやわんや」の舞台・臨江寺、西村酒造場など・令和5年に重要伝統的建造物群保存地区、全国127地区目、愛媛県で3地区目・岩松川沿い）
 * 座標: OSM — 宇和島市営闘牛場 way 1142031502（建物）・和霊神社 way 353620727（place_of_worship）・南楽園 way 905450754（park）・宇和島駅 way 377052723（駅の建物）（Nominatim の中心）／
 *   遊子水荷浦 node 4472133889（viewpoint）／岩松の町並みは町並みの点がないので、町の中の宇和島市津島支所 node 13904227391（townhall）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-168-50822458.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "50822458-9f50-4ab3-809d-f846108c75f8";
const DAY1_ID = "4bab28f3-e05a-4feb-8137-9b1ef575a9cc";
const TOGYU = "a605ec6a-d26b-4ffd-b735-ef97ee0510e0";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "宇和島の民俗文化・闘牛のドーム型の闘牛場と、空襲の跡が残る神幸橋の和霊神社から、海へ向かって「耕して天に至る」遊子水荷浦の段畑へ。宇和島で昼食をとり、四国最大級とされる日本庭園・南楽園と、小説の舞台になった岩松の町並みをめぐる、車でたどる宇和島の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(TOGYU, { h: 9, m: 30, stay: 30, legs: [], lat: 33.2273955, lng: 132.5726732, address: "愛媛県宇和島市和霊町496-2",
    memo: "この旅は車でめぐります。JR宇和島駅前でレンタカーを借りて、車で約5分。牛と牛が角を突き合わせる闘牛は、宇和島地方ならではの民俗文化とされ、ここは全国でも珍しいドーム型の闘牛場です。中の土俵は直径20mあります。闘牛の大会は年に4回で、大会のない日に中を見学できる時間は限られているので、公式の案内で確かめましょう。" }),
  cre("和霊神社", { h: 10, m: 5, stay: 30, legs: [car(5)], lat: 33.2299382, lng: 132.5653263, address: "愛媛県宇和島市和霊町1451",
    memo: "闘牛場から車で約5分。宇和島藩の初代藩主・伊達秀宗のもとで、産業を広げ、人々の暮らしを安定させることに力を尽くした山家清兵衛をまつる神社です。神社と和霊公園の間を流れる須賀川には、太鼓橋の「神幸橋」がかかっています。この橋は宇和島空襲のときに崩れずに残り、今も焼夷弾の跡が見られます。" + PRAY }),
  cre("遊子水荷浦の段畑", { h: 11, m: 15, stay: 60, legs: [car(40)], lat: 33.2030009, lng: 132.453481, address: "愛媛県宇和島市遊子",
    memo: "和霊神社から車で約40分、宇和海へ突き出した半島の先へ。急な斜面に石垣を積み上げた段々の畑で、平成19年（2007年）に国の重要文化的景観に選ばれました。いちばん高いところは海から約60m、平均の傾きは約40度で、50段あまりの畑が重なり、石垣の高さは平均1m以上あります。江戸時代の後期はムギやサツマイモ、その後クワや柑橘を経て、今はおもにジャガイモがつくられています。イワシ漁や真珠、ハマチの養殖と支え合いながら続いてきた暮らしの景色です。畑は今も耕されているので、畑の中には入らず、決められた道から眺めましょう。" }),
  cre("宇和島駅前（昼食）", { h: 12, m: 55, stay: 50, legs: [car(40)], lat: 33.2258123, lng: 132.5675121, address: "愛媛県宇和島市",
    memo: "段畑から車で約40分、宇和島の町へ戻ります。駅のまわりで昼食にしましょう。" }),
  cre("南楽園", { h: 14, m: 15, stay: 85, legs: [car(30)], lat: 33.1326052, lng: 132.5049902, address: "愛媛県宇和島市津島町近家甲1813",
    memo: "宇和島駅から車で約30分、南の津島町へ。四国最大級とされる日本庭園で、平成元年（1989年）に「日本の都市公園100選」に選ばれました。池のまわりを歩いてめぐる池泉回遊式の庭で、山・里・町・海の4つの景色が表されています。三万株の花菖蒲をはじめ、梅や桜、つつじなど、季節ごとの花が植えられています。開園の時間は公式の案内で確かめましょう。" }),
  cre("岩松の町並み", { h: 15, m: 50, stay: 40, legs: [car(10)], lat: 33.1263224, lng: 132.5217187, address: "愛媛県宇和島市津島町岩松",
    memo: "南楽園から車で約10分。岩松川に沿って、明治から昭和のはじめの建物が残る町並みで、令和5年（2023年）に国の重要伝統的建造物群保存地区に選ばれました。獅子文六の小説『てんやわんや』の舞台となった町です。大正時代の本堂がある臨江寺や、古い酒造場の建物などを眺めながら歩きましょう。今も人が暮らしている町なので、静かに歩きましょう。帰りは、宇和島駅まで車で約30分、レンタカーを返しましょう。" }),
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
  console.log(`対象: ${it.title} [${it.status}] 写真${it.days[0]?.spots[0]?.photos.length ?? 0}枚`);
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [TOGYU].join()) throw new Error("構成が想定と違います");
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
