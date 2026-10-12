/**
 * #248 11c84229「国宝・彦根城とひこにゃん、定番の彦根さんぽ日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 2か所 09:30〜11:50 で、昼食・朝の行き方・帰りの一言がなく、本文は案内の話し方（「皆様」「ご案内いたします」「ご堪能ください」）。説明文の「国宝5城の一つ」は確かめていないので書かない
 * 彦根市のほかのしおり（77b83773・4d332b95・ebe67d3c: 彦根城・玄宮園・夢京橋キャッスルロード・彦根城博物館・四番町スクエア・龍潭寺・清凉寺・佐和山城跡）の本文を読み、
 *   使っていない話で書いた。77b83773 の彦根城・玄宮園の本文は、このしおりのもとの本文とほぼ同じなので、ここでは全部書き直した
 *   （彦根城: 天守の18の破風と天秤櫓、玄宮園: 天守を見上げる庭、龍潭寺: 佐和山を背にした東庭）。宗安寺・長寿院・天寧寺はほかのしおりにない
 *   埋木舎は12月20日〜2月末に休館するので入れなかった
 * 歩きの旅（JR彦根駅から歩いてめぐり、JR彦根駅に戻る）:
 *   彦根城 9:00 → 玄宮園 → 宗安寺 → 夢京橋キャッスルロード（昼食）→ 龍潭寺 → 長寿院 → 天寧寺 16:30 → 彦根駅
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典:
 *   彦根市 https://www.city.hikone.lg.jp/kakuka/kikakushinko/10/4/2_2/5/1/28218.html （天守の破風は18で、現存12天守で最も多い・高さは姫路城天守の約半分）／
 *     https://www.city.hikone.lg.jp/kakuka/kanko_bunka/5/hikonefilmcomission/roke-syonsyokai/hikonejohikonejosyuhen/22098.html 天秤櫓（廊下橋を中心に左右対称・この形は彦根城だけ）／
 *     https://www.city.hikone.lg.jp/kakuka/kanko_bunka/5/3/4_1/21928.html ひこにゃん（毎日、彦根城周辺に登場して観光客を出迎える）／
 *     https://www.city.hikone.lg.jp/kakuka/toshi_seisaku/15/4/3/4221.html 宗安寺（赤門は慶長8年に佐和山城の朱塗りの正門を移したと伝わる・本堂は元禄15年に長浜城の御殿を移したと伝わる）／
 *     https://www.city.hikone.lg.jp/kakuka/kanko_bunka/8/2_2/4637.html 龍潭寺（佐和山を背景にした東庭・書院からの鑑賞と池泉回遊式・方丈の襖絵56枚は森川許六の作とされる・許六は蕉門十哲の俳人で絵も学んだ）／
 *     https://www.city.hikone.lg.jp/kakuka/kanko_bunka/5/hikonefilmcomission/roke-syonsyokai/temple_shrine/25410.html 天寧寺（11代藩主直中のとき懺悔と供養のために建立・京都の名工の木造五百羅漢・城と城下町を一望する丘・石庭）
 *   彦根観光協会 https://www.hikoneshi.com/sightseeing/article/ohorabenzaiten 長寿院（4代藩主直興が日光東照宮を修造した大工を使って建てた権現造りの本堂・「彦根日光」・山門の扉が額縁となり彦根城が真正面に）
 *   夢京橋キャッスルロード https://yumekyobashi.jp/ （白壁と紅殻に煤を混ぜた黒格子・いぶし瓦・暮らしの見え隠れする町）・https://yumekyobashi.jp/shoplist/ （「味わう お食事・菓子店」24店）
 *   彦根城公式 https://hikonecastle.com/information.html （8:30〜17:00・天守と玄宮園の最終入場16:30）
 * 座標: OSM — 彦根城（天守）way 363244224・玄宮園 way 585543133・宗安寺 way 1070665202・夢京橋キャッスルロード way 180831396（Nominatim の中心）／龍潭寺 node 4389652283（API で名前つき）／
 *   国土地理院の番地の点 — 長寿院（古沢町1139番地）・天寧寺（里根町232番地）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-248-11c84229.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "11c84229-c8b8-4d6e-88ea-6fe27e538abf";
const DAY_ID = "aabaabf3-d8b7-42a3-a0b4-e6bda8146e7e";
const CASTLE = "86bab74a-573d-4c9d-8c01-e1f093347660";
const GENKYU = "e47785c5-9fc7-46ad-9cb5-303fbc380560";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const walk = (min: number) => ({ mode: "walk" as const, min });
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "18もの破風で飾られた国宝・彦根城の天守と、ひこにゃんが出迎える城のまわりを歩き、天守を見上げる玄宮園へ。昼は城下町の夢京橋キャッスルロードで食事をとり、午後は佐和山のふもとの龍潭寺や「彦根日光」と呼ばれる長寿院、五百羅漢の天寧寺をめぐる、歩いて楽しむ彦根の日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(CASTLE, { h: 9, m: 0, stay: 100, legs: [], lat: 35.276483, lng: 136.2518607, address: "滋賀県彦根市金亀町1-1",
    memo: "この旅は歩いてめぐります。JR彦根駅から歩いて約15分。国宝の天守は、高さは姫路城の天守のおよそ半分ですが、屋根を飾る破風が18もあり、今に残る12の天守の中で最も多いとされます。戦いのためというより、見た目の華やかさのためのものと考えられています。天守へ向かう途中の天秤櫓は、廊下橋を中心に左右がそろった形の櫓で、この形は彦根城だけとされます。城のまわりには、彦根市のキャラクター・ひこにゃんが毎日姿を見せます。登場の時間や場所は変わることがあるので、公式の案内で確かめましょう。天守の階段は急なので、手すりにつかまって上り下りしましょう。" }),
  upd(GENKYU, { h: 10, m: 50, stay: 40, legs: [walk(10)], lat: 35.2783831, lng: 136.2540432, address: "滋賀県彦根市金亀町3",
    memo: "天守から城山を下りて歩いて約10分。池のまわりを歩きながら景色の移り変わりを楽しむ大名庭園で、池の向こうの木々の上に、さっき上った天守を見上げられます。池にかかる橋を渡り、どの場所から天守がいちばん美しく見えるか、歩きながら探してみましょう。" }),
  cre("宗安寺", { h: 11, m: 45, stay: 25, legs: [walk(15)], lat: 35.2707613, lng: 136.2505345, address: "滋賀県彦根市本町2丁目",
    memo: "玄宮園から城の南の城下町へ、歩いて約15分。表門は「赤門」と呼ばれ、慶長8年（1603年）に佐和山城の朱塗りの正門を移したものと伝えられます。本堂も、江戸時代の火事のあと、長浜城の御殿を移したものと伝えられています。" + PRAY }),
  cre("夢京橋キャッスルロード", { h: 12, m: 15, stay: 60, legs: [walk(5)], lat: 35.2710421, lng: 136.251558, address: "滋賀県彦根市本町1丁目",
    memo: "宗安寺から歩いてすぐ。白壁に、紅殻に煤を混ぜた黒い格子、いぶし瓦の屋根をそろえた町並みの通りで、食事の店や菓子の店が多く並ぶので、ここで昼食にしましょう。暮らしの気配も残る通りなので、静かに歩きましょう。" }),
  cre("龍潭寺", { h: 13, m: 40, stay: 60, legs: [walk(25)], lat: 35.2827945, lng: 136.2664548, address: "滋賀県彦根市古沢町",
    memo: "城下町から佐和山のふもとへ、歩いて約25分。東の庭は、佐和山を背にして山すその斜面に築かれ、すそをめぐるように池が配された庭で、書院から眺めても、池のまわりを歩いても楽しめます。方丈の56枚のふすまには、彦根藩士の子に生まれ、松尾芭蕉の門人の俳人として知られ、絵も学んだ森川許六が描いたとされる絵が残ります。" + PRAY }),
  cre("長寿院", { h: 14, m: 50, stay: 30, legs: [walk(10)], lat: 35.284252, lng: 136.265564, address: "滋賀県彦根市古沢町1139",
    memo: "龍潭寺から歩いて約10分。大洞弁財天とも呼ばれる寺で、4代藩主・井伊直興が、日光東照宮を修理した大工たちに建てさせた権現造りの本堂から、「彦根日光」と呼ばれています。山門の扉が額縁のようになって、その先に彦根城が真正面に見えます。石段が続くので、足元に気をつけましょう。" + PRAY }),
  cre("天寧寺", { h: 15, m: 45, stay: 45, legs: [walk(25)], lat: 35.267406, lng: 136.271042, address: "滋賀県彦根市里根町232",
    memo: "長寿院から南へ、歩いて約25分。彦根城と城下町を見渡す丘の上の寺で、11代藩主・井伊直中のときに、さまざまな出来事への懺悔と供養のために建てられました。京都の名工に彫らせた木造の五百羅漢が並び、一体ずつ違う表情を見られます。釈迦と十六羅漢になぞらえて石を置いた石庭もあります。" + PRAY + "帰りは、歩いて約20分のJR彦根駅へ向かいましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== [CASTLE, GENKYU].join()) throw new Error("構成が想定と違います");
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
