/**
 * #187 760fe248「松本城と旧開智学校、国宝がそろう城下町をめぐる日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 3か所 09:30〜14:15 で、昼食の一言と帰りの一言がなかった。松本城の本文の「烏城」は、松本城の公式サイト（matsumoto-castle.jp）が「誤り」としているので外す。
 *   「現存12天守で唯一の平城」の言い切りも外す。中町通りの写真は本町通り（松本市本町.jpg）の写真なので外す
 * 歩きの旅（JR松本駅から歩いて、帰りも歩いて松本駅へ）:
 *   松本城 9:30 → 旧開智学校 → 中町通り（昼食）→ 源智の井戸 → 松本市立博物館 → 四柱神社 → 松本市美術館 16:30 → 松本駅
 * タイトルと季節はそのまま、説明文は書き直す
 * 松本のほかのしおり（f507e490・fa3afe40・f7ff855f）の本文を読み、使っていない話で書いた
 *   （松本城: 平地の城と三重の堀・1594年の天守の完成、開智学校: 左右非対称・伝統の材料で洋風に・色ガラスと塔屋の部屋、中町: リノベーションの店、
 *    市立博物館: 8つのテーマとパノラミックラウンジ、四柱神社: 緑の小路となわて通りのカエル、美術館: 学びの森のコンセプトと4つの場・田中一光のシンボルマーク）。源智の井戸はほかのしおりにない
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   国土交通省 多言語解説文 mlit.go.jp/tagengo-db/R4-00169.html 松本城と城下町（1590年に石川数正・1594年に康長が大天守、乾小天守、渡櫓などを完成・平地の城と同心円状の堀・3重の堀・三の丸に上級家臣）／
 *   matsu-haku.com/kaichi/midokoro 旧開智学校（天使と龍の彫刻・左右非対称・漆喰で石の模様・廊下は木、壁は漆喰、天井は紙・外国から輸入した色ガラス・塔屋の部屋と明治の鐘）／
 *   go-nagano.net/tradition-and-culture/id20562 長野県公式観光サイト「松本城から10分圏内」（中町通り: 城と駅の中ほど、リノベーションのカフェやご当地グルメ・源智の井戸: 城下町以前からの飲用水、毎分約200リットル、
 *   珍しい硬水、まつもと城下町湧水群は平成の名水百選・なわて通り: カエルの街、女鳥羽川のカジカガエル・四柱神社: 四柱の神をまつるのは全国的にも珍しい、緑の小路と紅葉）／
 *   matsumoto-city-museum.jp/exhibitions・/facility 松本市立博物館（2023年10月に移転新築・8つのテーマ「お城のあるまち」「にぎわう商都」（あめ市）ほか・3階のパノラミックラウンジ）／
 *   matsumoto-artmuse.jp/about/profile/ 松本市美術館（2002年4月開館・「心をひらく学びの森の美術館」・鑑賞、表現、学習、交流の場・シンボルマークは田中一光、2つのMは山（北アルプス）と美術館）
 * 座標: OSM — 松本城 way 300077872・旧開智学校 way 703211783・中町通り way 149397114・松本市立博物館 node 10801004187・四柱神社 way 553159088・松本市美術館 way 1040428833（Nominatim の中心）／
 *   源智の井戸 node 4448555792（man_made=water_well、API で名前つき）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-187-760fe248.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "760fe248-33c4-4988-b824-9c6ab65c9b42";
const DAY1_ID = "26131392-074f-4706-8220-6891f9d81330";
const CASTLE = "ea414b34-4910-4f3a-92d5-6de7f97b35a7";
const KAICHI = "c797323d-d48f-4e1f-9b5d-ca092d0b9a0d";
const NAKAMACHI = "4bccce99-28eb-49d6-8c31-13572b19f744";
const REMOVE_PHOTOS = ["1db34f2c-e7a6-45ca-bc0e-a141e414d4db"];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "国宝の松本城で平地の城の守りを見学し、国宝の旧開智学校へ。中町通りで昼食をとり、湧き水の源智の井戸、松本市立博物館、四柱神社をめぐって、松本市美術館で締めくくる、駅から歩いて楽しむ城下町の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S, name?: string) => ({ id, data: { ...(name ? { name } : {}), ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });
type X = ReturnType<typeof upd> | ReturnType<typeof cre>;

const DAY1: X[] = [
  upd(CASTLE, { h: 9, m: 30, stay: 100, legs: [], lat: 36.2386353, lng: 137.9688709, address: "長野県松本市丸の内4-1",
    memo: "この旅は歩いてめぐります。JR松本駅のお城口から歩いて約20分。1590年にこの地を治めることになった石川数正が城と城下町づくりを始め、数正のあと、子の康長が1594年に大天守や乾小天守、渡櫓などを完成させたといわれます。山の上ではなく平地に築かれた城で、自然の守りがないぶん、天守のある本丸を内堀、二の丸を外堀、三の丸をいちばん外側の堀と、堀が三重に取り囲んでいました。天守群は国宝です。天守の中の階段は急なので、手すりを持ってゆっくり上り下りしましょう。入場の時間は公式の案内で確かめましょう。" }),
  upd(KAICHI, { h: 11, m: 20, stay: 60, legs: [walk(10)], lat: 36.2430494, lng: 137.9682435, address: "長野県松本市開智2-4-12",
    memo: "松本城の北へ歩いて約10分。明治のはじめに建てられた国宝の校舎で、玄関の上の天使と龍の彫刻が、この建物のしるしです。西洋の建物をお手本にしながら、正面は左右対称ではなく、石のように見える模様も漆喰で描かれています。中に入ると、廊下は木、壁は漆喰、天井は紙と、日本の伝統の材料で洋風の雰囲気に仕上げられているのがわかります。外国から取り寄せた色ガラスの窓や、色ガラスに囲まれた塔の上の部屋、明治に時を告げた鐘も見どころです。休館日は公式の案内で確かめましょう。" }),
  upd(NAKAMACHI, { h: 12, m: 35, stay: 50, legs: [walk(15)], lat: 36.2337986, lng: 137.9714588, address: "長野県松本市中央3丁目",
    memo: "旧開智学校から南へ歩いて約15分。松本城と松本駅のちょうど中ほどにある、城下町として栄えた通りです。古い建物を生かしたカフェや、松本の味を出す店が並ぶので、ここで昼食にしましょう。今も人が暮らし、商いをしている通りなので、静かに歩きましょう。" }, "中町通り（昼食）"),
  cre("源智の井戸", { h: 13, m: 30, stay: 15, legs: [walk(5)], lat: 36.2324058, lng: 137.9728533, address: "長野県松本市中央3丁目",
    memo: "中町通りから南へ歩いて約5分。城下町ができる前から飲み水として使われてきた井戸で、今も毎分約200リットルの水がわき出ています。軟水の多い日本では珍しい硬水の湧き水で、この井戸をはじめとする「まつもと城下町湧水群」は、平成の名水百選に選ばれています。水をくみに来る地元の人も多いので、じゃまにならないようにしましょう。" }),
  cre("松本市立博物館", { h: 13, m: 53, stay: 60, legs: [walk(8)], lat: 36.2352771, lng: 137.9690178, address: "長野県松本市大手3-2-21",
    memo: "源智の井戸から北西へ歩いて約8分。常設展は、時代の順ではなく「お城のあるまち」「にぎわう商都」など8つのテーマで、松本の人と町を紹介しています。商都のコーナーでは、城下町の商いの祭り「あめ市」も取り上げられています。3階のパノラミックラウンジからは、松本の町を広く見渡せます。休館日は公式の案内で確かめましょう。" }),
  cre("四柱神社", { h: 14, m: 58, stay: 20, legs: [walk(5)], lat: 36.2348929, lng: 137.970364, address: "長野県松本市大手3-3-20",
    memo: "博物館から、長屋風の店が並ぶなわて通りを抜けて約5分。なわて通りは「カエルの街」とされ、昔は近くの女鳥羽川に、きれいな水を好むカジカガエルがすんでいたといわれます。四柱神社は、その名のとおり4柱の神をまつる神社で、このようなまつり方は全国でも珍しいとされます。境内には木々や花の植えられた緑の小道があり、秋には紅葉が色づきます。" + PRAY }),
  cre("松本市美術館", { h: 15, m: 30, stay: 60, legs: [walk(12)], lat: 36.2315567, lng: 137.9766471, address: "長野県松本市中央4-2-22",
    memo: "四柱神社から東へ歩いて約12分。2002年に開かれた美術館で、「心をひらく学びの森の美術館」をかかげ、作品を見るだけでなく、表現し、学び、人と交わる場として親しまれています。松本出身の草間彌生の作品も紹介されています。美術館のシンボルマークはデザイナーの田中一光によるもので、2つの「M」は、北アルプスの山と美術館を表しています。休館日は公式の案内で確かめましょう。帰りは、松本駅まで歩いて約12分です。" }),
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
  if (it.days.length !== 1 || it.days[0].id !== DAY1_ID || it.days[0].spots.map((s) => s.id).join() !== [CASTLE, KAICHI, NAKAMACHI].join()) throw new Error("構成が想定と違います");
  const nk = it.days[0].spots[2].photos;
  if (nk.map((p) => p.id).join() !== REMOVE_PHOTOS.join() || nk.some((p) => p.url === it.thumbnailUrl)) throw new Error("外す写真が想定と違います");
  show("1日目", DAY1);
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await tx.photo.deleteMany({ where: { id: { in: REMOVE_PHOTOS } } });
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
