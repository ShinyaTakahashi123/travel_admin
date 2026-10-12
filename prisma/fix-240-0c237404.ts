/**
 * #240 0c237404「抱返り渓谷の新緑と絶景、田沢湖近くの渓谷トレッキング」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜11:10 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」）。
 *   説明文の「東北の耶馬渐」は誤字。抱返り渓谷の座標（39.5828,140.7639）は渓谷から東へ約10kmずれていたので、入口の抱返り神社の点に直す
 *   写真は紅葉の神の岩橋（2020年11月1日）で、春だけのしおりと季節が合わないので外し、表紙も外す（場所は合っているので写真の控えは残す）
 * 仙北市のほかのしおり（c10810bd・acb93a0f・7f8fb644・afb492ce: 角館の武家屋敷通り・樺細工伝承館・安藤醸造・新潮社記念文学館、田沢湖の遊覧船・たつこ像・御座石神社など）と
 *   行き先が重ならないように、抱返り・白岩・角館の田町と外町の商家・大沼・田沢湖の西岸を選んだ
 * 車の旅（JR角館駅の近くでレンタカーを借りて返す）:
 *   抱返り渓谷 9:00 → 雲巌寺 → 西宮家（昼食・蔵の食事処）→ 外町 → 大沼公園 → 田沢湖クニマス未来館 → かたまえ山森林公園 16:30 → 角館駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   仙北市 https://www.city.semboku.akita.jp/sightseeing/spot/<名前>.html — 05_dakigaeri 抱返り渓谷（名前の由来・玉川中流の約10kmの渓谷・回顧の滝・飯村少年碑まで約40分の散策・
 *     クマの出没が多く必ず2人以上・遊歩道の金属パイプを叩いて知らせる）／05_kaiko 回顧の滝（落差約30m・何度も振り返って見たくなる・入口から徒歩約30分）／
 *     05_ungan 雲巌寺（1450年の創建・山門は秋田県有形文化財・仁王像はドンパン節の作者の作・白岩焼の千体仏）／05_oonuma 大沼公園（広い沼・6月初旬のカキツバタ・春の桜、初夏のツツジ）／
 *     04_katamaeyama かたまえ山森林公園（田沢湖の西岸・山の幸資料館・フィールドアスレチック）
 *   仙北市 https://www.city.semboku.akita.jp/sightseeing/travel/details/02-shoka.html 西宮家（田町武家屋敷の一角・佐竹氏の直臣今宮家の家臣の家柄・明治、大正期の米蔵、北蔵、前蔵、がっこ蔵、文庫蔵、母屋の6棟・
 *     一部の蔵は食事や喫茶、買い物の空間）、たてつ家（町屋造り・明治33年・蔵、日本庭園、座敷）
 *   田沢湖・角館観光協会 https://tazawako-kakunodate.com/ — spots/6048 抱返り渓谷（東北の耶馬渓・神の岩橋）／course/13179 抱返り渓谷の散策（神の岩橋は秋田県で最も古いつり橋・
 *     11月下旬〜4月中旬は通行止め・砂利道やぬれた所は足元に注意）／spots/5999 外町（商人町・土蔵が多く残り店やレストランに・たてつ家は外町史料館として先祖の生活用品を無料公開）
 *   田沢湖クニマス未来館: 仙北市 https://www.city.semboku.akita.jp/sightseeing/miraikan.html （所在地）と、東北観光推進機構 https://www.tohokukanko.jp/attractions/detail_1007279.html
 *     （2017年7月1日開館・田沢湖固有のクニマスは1940年に玉川の酸性水の導入で絶滅、2010年に西湖で再発見・生きたクニマス、漁具や丸木舟の展示）、検索結果の開館時間 9:00〜16:00・火曜休館
 * 座標: OSM — 抱返り神社 way 465156578・雲巌寺 way 1559855701・史料館たてつ way 797047638・大沼公園 relation 10732682・田沢湖クニマス未来館 way 446785311・
 *   かたまえ山森林公園 way 594201535（Nominatim の中心）／あきた角館西宮家 node 2598170801（API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-240-0c237404.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "0c237404-68b3-458c-bd13-edf7f6a0c6f4";
const DAY_ID = "088fe651-ef0f-4d65-8c63-9920c77158d4";
const DAKIGAERI = "53abbd5e-1551-4094-811b-3630b9187dcb";
const AUTUMN_PHOTO = "69c85754-8ded-47e4-99a1-a094325a1335";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "「東北の耶馬渓」とも呼ばれる抱返り渓谷で、新緑の中を回顧の滝まで歩き、白岩の古い寺と、角館の田町・外町に残る商家の蔵へ。午後は大沼の水辺から田沢湖の西岸に回り、クニマスの物語にふれる、レンタカーの日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(DAKIGAERI, { h: 9, m: 0, stay: 100, legs: [], lat: 39.6091234, lng: 140.6529046, address: "秋田県仙北市田沢湖卒田",
    memo: "この旅は車でめぐります。JR角館駅の近くでレンタカーを借りて、車で約15分。田沢湖から角館へ流れる玉川の中ほどに続く、長さ約10kmの渓谷です。昔は道がとても狭く、すれ違う人が互いに抱きかかえるようにしなければ通れなかったことから、この名がついたといわれます。入口の赤いつり橋・神の岩橋を渡り、青い流れと岩壁、新緑の木々を眺めながら遊歩道を約30分歩くと、落差約30mの回顧の滝に着きます。何度も振り返って見たくなるほど美しいことから、この名がつきました。このあたりではクマがよく出るので、1人では歩かず必ず2人以上で行動し、遊歩道にある金属のパイプをたたいて、人がいることを知らせましょう。砂利道やぬれた所は滑りやすいので、歩きやすい靴で出かけましょう。遊歩道は冬の間（11月下旬〜4月中旬）は通れません。" }),
  cre("雲巌寺", { h: 10, m: 55, stay: 30, legs: [car(15)], lat: 39.5840354, lng: 140.6153648, address: "秋田県仙北市角館町白岩前郷33",
    memo: "渓谷から車で約15分、白岩の集落へ。室町時代の1450年に開かれたとされる寺で、山門は秋田県の有形文化財です。山門の仁王像は、民謡「ドンパン節」をつくった人の作で、地元の焼き物・白岩焼の千体仏も見られます。" + PRAY }),
  cre("西宮家", { h: 11, m: 40, stay: 50, legs: [car(15)], lat: 39.5929836, lng: 140.5648311, address: "秋田県仙北市角館町田町上丁11-1",
    memo: "寺から車で約15分、角館の田町へ（近くの駐車場に停めて歩きます）。武家屋敷が並ぶ田町の一角にある、秋田藩の重臣に仕えた家柄の屋敷で、明治から大正にかけて建てられた米蔵や文庫蔵、母屋など6棟が残ります。今は蔵の一部が食事や喫茶、買い物を楽しめる場所になっているので、ここで昼食にしましょう。" }),
  cre("外町", { h: 12, m: 35, stay: 35, legs: [walk(5)], lat: 39.5940576, lng: 140.562587, address: "秋田県仙北市角館町",
    memo: "西宮家から歩いて約5分。武家屋敷の内町に対して、商人たちが暮らした町で、古い商家や土蔵が多く残り、今は店やレストランとして使われているものもあります。明治33年に建てられた町屋造りの「たてつ家」は、外町史料館として、昔の暮らしの道具を見せています。蔵や日本庭園、座敷も見られます。今も人が暮らし、商いをしている町なので、静かに歩きましょう。" }),
  cre("大沼公園", { h: 13, m: 35, stay: 30, legs: [walk(5), car(20)], lat: 39.6383867, lng: 140.6067345, address: "秋田県仙北市田沢湖梅沢",
    memo: "車へ歩いて戻り、北へ車で約20分（あわせて約25分）。広い沼のほとりの公園で、春は桜、初夏にはツツジが咲き、6月の初めには、数ヘクタールにわたって自生するカキツバタが花をつけます。水辺をひと回りして、ひと休みしましょう。" }),
  cre("田沢湖クニマス未来館", { h: 14, m: 35, stay: 50, legs: [car(30)], lat: 39.7001636, lng: 140.6628376, address: "秋田県仙北市田沢湖潟字ヨテコ沢4",
    memo: "大沼から車で約30分、田沢湖の西岸へ。田沢湖だけにすんでいた魚・クニマスは、1940年に玉川の酸性の水が湖に引き入れられたあと姿を消しましたが、2010年に山梨県の西湖で再発見されました。2017年に開かれたこの館では、生きたクニマスの展示のほか、昔の漁具や丸木舟などで、田沢湖の歴史と湖畔の暮らしを伝えています。休館日は公式の案内で確かめましょう。" }),
  cre("かたまえ山森林公園", { h: 15, m: 35, stay: 55, legs: [car(10)], lat: 39.7169245, lng: 140.6257224, address: "秋田県仙北市西木町西明寺字潟尻",
    memo: "未来館から車で約10分。田沢湖の西岸の山にある森林公園で、湖を望む眺めと、森の中の散策を楽しめます。山の幸を紹介する資料館やアスレチックもあります。森の中でもクマに気をつけ、2人以上で歩きましょう。帰りは、車で約50分のJR角館駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== DAKIGAERI) throw new Error("構成が想定と違います");
  if (!it.days[0].spots[0].photos.some((p) => p.id === AUTUMN_PHOTO)) throw new Error("紅葉の写真が見つかりません");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "抱返り渓谷(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}\n紅葉の写真を外し、表紙も外す: ${AUTUMN_PHOTO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: null } });
      await tx.photo.delete({ where: { id: AUTUMN_PHOTO } });
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
