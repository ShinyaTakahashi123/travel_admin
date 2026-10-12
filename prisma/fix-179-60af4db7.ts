/**
 * #179 60af4db7「瀬の本高原、くじゅう連山を望む絶景ドライブプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:40 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内するのは」）。
 *   もとの瀬の本高原の点は、菓子店（シェ・タニ）の建物の中心だったので、OSM の「やまなみハイウェイ展望所」の点に変える
 * 南小国町・阿蘇のほかのしおり（19410204・357983ef: 瀬の本高原・押戸石の丘・大観峰など）の本文を読み、使っていない話で書いた。
 *   九重町・竹田市・産山村の行き先（長者原、九重“夢”大吊橋、池山水源、扇棚田、くじゅう花公園）はほかのしおりにない。
 *   山吹水源・ヒゴタイ公園は OSM に点がないので入れない
 * 令和8年熊本地震のあと: 熊本県観光サイトは、阿蘇エリアの主な道路に大きな被害はなく通れる、産山村の水源やヒゴタイ公園も通常どおりと案内している（look/detail/701）。
 *   最初のスポットに、出かける前に道路や施設の最新の情報を確かめる一文を入れる
 * くじゅう花公園は冬のいちばん寒い時期は花がない（visit-kyushu）ので、季節は春・夏・秋にする
 * 車の旅（JR阿蘇駅の近くでレンタカーを借りて返す）:
 *   長者原（タデ原湿原）9:30 → 九重“夢”大吊橋 → 瀬の本高原（昼食）→ 池山水源 → 扇棚田 → くじゅう花公園 16:30 → JR阿蘇駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   国土交通省 多言語解説文 https://www.mlit.go.jp/tagengo-db/H30-01276.html 長者原（環境省 阿蘇くじゅう国立公園管理事務所: 6300年前の噴火の火山灰や岩屑で白水川がせき止められてできたタデ原湿原・
 *     湧水が豊富で湿性植物・三俣山、硫黄山、星生山のふもと・坊ガツルとともにラムサール条約の湿地・ビジターセンターが散策路の出発点）
 *   九重“夢”大吊橋 https://www.yumeooturihashi.com/（平成18年に開通・長さ390m、高さ173m、幅1.5m・歩道専用の吊橋で日本一の高さ・震動の滝の雄滝と雌滝・鳴子川渓谷の原生林・三俣山や涌蓋山）
 *   熊本県観光サイト https://kumamoto.guide/ — shugaku/programs/detail/196 瀬の本高原（南小国町の東端・標高約800m・南に阿蘇五岳、北に九重連山・中央をやまなみハイウェイ）／spots/detail/9001 瀬の本の
 *     ドライブイン（やまなみハイウェイの中間・1階に売店、2階のレストランは阿蘇の景色を眺めながらバイキング）／spots/detail/11847 池山水源（環境省の名水百選・樹齢200年を超える木々・水温13.5℃・毎分30トン・
 *     生活用水や農業用水）と同じページの扇棚田（標高820m・日本の棚田百選・文化庁の重要文化的景観）／look/detail/701（令和8年熊本地震のあとの阿蘇エリアの道路と産山村の観光地）
 *   くじゅう花公園 https://kuju-flower-park.com/（阿蘇くじゅう国立公園内・園内にレストランやカフェ）と九州観光機構 https://www.visit-kyushu.com/en/see-and-do/spots/kuju-flower-park/
 *     （500を超える種類の花と植物・冬のいちばん寒い時期を除いて丘を花が彩る・熱帯植物の温室）
 * 座標: OSM — 長者原ビジターセンター way 181697123（Nominatim の中心）・九重夢大吊橋 node 5603129029・やまなみハイウェイ展望所 node 7050638948・扇棚田展望所 node 11147679860・
 *   くじゅう花公園 node 5719405321（node は API で名前つき）／池山水源 node 5137757423（name:zh「池山水源」だけで、日本語の name の札はない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-179-60af4db7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "60af4db7-ce32-4458-839a-9545221488a7";
const DAY_ID = "6c3c8c9a-5c28-48b6-8201-397e389dc426";
const SENOMOTO = "9c2b8352-2a69-47c4-936d-b88a17de99c1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const car = (min: number) => ({ mode: "car" as const, min });
const VOLCANO = "出かける前に火山の情報を確かめましょう。";

const DESCRIPTION =
  "くじゅう連山のふもとの長者原でタデ原湿原を歩き、高さ173mの九重“夢”大吊橋で滝と渓谷を見下ろします。昼は瀬の本高原で阿蘇五岳とくじゅう連山を眺めながら昼食。午後は名水百選の池山水源、扇の形の扇棚田をめぐり、くじゅう花公園の花の丘を歩く、高原のドライブプランです。";
const SEASONS = ["spring", "summer", "autumn"];

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  cre("長者原（タデ原湿原）", { h: 9, m: 30, stay: 60, legs: [], lat: 33.1189582, lng: 131.2304318, address: "大分県玖珠郡九重町田野255-33",
    memo: "この旅は車でめぐります。JR阿蘇駅の近くでレンタカーを借りて、やまなみハイウェイを北へ、車で約50分。令和8年の熊本地震のあと、阿蘇エリアの主な道路は通れると案内されていますが、出かける前に、道路や施設の最新の情報を確かめましょう。長者原は、三俣山や硫黄山、星生山が連なるくじゅう連山のふもとの高原です。ビジターセンターの東に広がるタデ原湿原は、6300年前の噴火で出た火山灰や岩くずが白水川をせき止めてできた湿原で、湧き水が豊かで、水を好む草花が季節ごとに咲きます。坊ガツルとともに、ラムサール条約の湿地に登録されています。ビジターセンターで自然の展示を見てから、湿原の散策路を歩きましょう。くじゅう連山は今も活動している火山なので、" + VOLCANO + "木道では足元に気をつけましょう。" }),
  cre("九重“夢”大吊橋", { h: 10, m: 55, stay: 50, legs: [car(25)], lat: 33.174177, lng: 131.227066, address: "大分県玖珠郡九重町田野1208",
    memo: "長者原から北へ、車で約25分。平成18年に開通した、長さ390m、高さ173mの歩行者専用の吊橋で、歩道専用の吊橋としては日本一の高さとされます。橋の上からは、日本の滝百選の「震動の滝」の雄滝と雌滝が目の前に見え、足もとには鳴子川の渓谷の原生林が広がります。遠くには、三俣山や涌蓋山などのくじゅう連山も見渡せます。風のある日は橋が揺れるので、立ち止まるときは手すりにつかまりましょう。" }),
  upd(SENOMOTO, { h: 12, m: 25, stay: 60, legs: [car(40)], lat: 33.0856151, lng: 131.1930327, address: "熊本県阿蘇郡南小国町満願寺",
    memo: "大吊橋からやまなみハイウェイを南へ戻り、車で約40分。南小国町の東の端、標高約800mに見渡すかぎりの草原が広がる高原で、南には阿蘇五岳、北にはくじゅう連山が見えます。やまなみハイウェイの中ほどに建つドライブインの2階には、阿蘇の景色を眺めながら食事のできるレストランがあるので、ここで昼食にしましょう。食後は、近くの展望所から高原を見渡しましょう。阿蘇の中岳は今も活動している火山なので、" + VOLCANO }),
  cre("池山水源", { h: 13, m: 45, stay: 30, legs: [car(20)], lat: 33.0455706, lng: 131.1848769, address: "熊本県阿蘇郡産山村田尻14-1",
    memo: "瀬の本高原から南へ、車で約20分の産山村へ。環境省の名水百選に選ばれた水源で、樹齢200年を超える木々に囲まれた水面から、毎分約30トンの水が湧き出ています。水温は一年を通して約13.5℃です。地元では昔から暮らしや田畑の水として使われてきたので、水を汚さないようにしましょう。" }),
  cre("扇棚田", { h: 14, m: 25, stay: 25, legs: [car(10)], lat: 33.041548, lng: 131.2069444, address: "熊本県阿蘇郡産山村",
    memo: "池山水源から東へ、車で約10分。標高約820mの高原に、扇を広げたような地形を生かして作られた棚田で、日本の棚田百選に選ばれ、文化庁の重要文化的景観にもなっています。今も米が作られている田んぼなので、中には入らず、展望所から眺めましょう。" }),
  cre("くじゅう花公園", { h: 15, m: 0, stay: 90, legs: [car(10)], lat: 33.0475223, lng: 131.2442207, address: "大分県竹田市久住町久住4050",
    memo: "扇棚田から東へ、車で約10分。阿蘇くじゅう国立公園の中にある花の公園で、500種類を超える花や植物が、冬のいちばん寒い時期を除いて、丘をじゅうたんのように彩ります。熱帯の植物を集めた温室もあり、園内の道は歩きやすく整えられています。帰りは、車で約50分のJR阿蘇駅の近くでレンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== SENOMOTO) throw new Error("構成が想定と違います");
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
  console.log(`\n説明文: ${DESCRIPTION}\n季節: ${SEASONS.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, seasons: SEASONS as never } });
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
