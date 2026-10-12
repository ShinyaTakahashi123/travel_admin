/**
 * #222 db3a13fc「来島海峡展望館、瀬戸内しまなみ海道の絶景を望む定番プラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1か所 09:30〜10:20 で、昼食・帰りの一言がなく、本文は案内の話し方（「皆様」「ご覧いただける」）。「最大10ノット」などの数字も出典が確かめられなかった
 * 車の旅（JR今治駅の近くでレンタカーを借りて返す）:
 *   来島海峡展望館 9:00 → 来島海峡急流観潮船（道の駅よしうみいきいき館から）→ タオル美術館（昼食）→ 栄福寺 → 今治城 16:30 → 今治駅
 *   #221（自転車で大島・伯方島・大三島）とは、観潮船の乗り場（いきいき館）だけが近い。文は別に書いた
 * 移動は spot_transit_leg（transitLegs）に書く
 * 本文の出典: 今治地方観光協会 https://www.oideya.gr.jp/spot-c/<名前>/ —
 *   itoyama（しまなみ海道今治側の拠点・来島海峡と来島海峡大橋を眼前に・糸山展望台から来島村上氏の拠点の来島）／
 *   tyoryu_yoshiumi（日本三大急潮の一つ・来島海峡大橋の下や来島・小島・馬島・波止浜の造船所・おおよそ45分・潮流で毎日変わる）／
 *   towelmuseum（笠松山の麓の朝倉・タオルの製造工程見学とタオルアート・約1万坪のヨーロピアンガーデン・レストランやカフェ）／
 *   57_eihukuji（本尊は阿弥陀如来・空海が海神供養をすると海から阿弥陀如来が現れたと伝わる・山里の静かな寺・お願い地蔵）／
 *   imabarijo（江戸時代初期に藤堂高虎・三重の堀・船入が今治港に・海水が出入りする堀と海の魚・昭和55年以降に天守や櫓を再建・内部は博物館や美術館・9:00〜17:00）
 *   来島海峡展望館 公式 https://gogo-shimanami.jp （来島海峡大橋の建設技術と村上海賊の展示室・9時〜18時、12〜2月は17時まで）
 * 座標: OSM — 来島海峡展望館 way 162654186（Nominatim の中心）／道の駅よしうみいきいき館 way 625735287（同）／タオル美術館 way 813332979（同）／
 *   栄福寺 node 4435546090・今治城 node 1423730110（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-222-db3a13fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "db3a13fc-e98e-4299-9f52-ca2842637553";
const DAY_ID = "64ac8ec3-cf4d-45f3-89fc-b129138f7b2d";
const TENBOU = "a699a0df-4c36-4981-bed9-05543cce4528";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const PRAY = "今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

const DESCRIPTION =
  "来島海峡展望館から来島海峡大橋と島々を眺め、観潮船で海峡の速い潮の流れを間近に体験します。昼はタオル美術館で食事とタオルのアートを楽しみ、四国霊場の栄福寺にお参りしたら、海水の堀をめぐらせた今治城で締めくくる、今治をレンタカーでめぐる日帰りプランです。";

type Leg = { mode: "walk" | "train" | "bus" | "car" | "taxi" | "other"; min: number; line?: string };
type S = { h: number; m: number; stay: number; legs: Leg[]; lat: number; lng: number; address: string; memo: string };
const legsCreate = (legs: Leg[]) => legs.map((l, i) => ({ orderNo: i + 1, transitMode: l.mode, transitDurationMin: l.min, transitLine: l.line ?? null }));
const base = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: { ...base(s), transitLegs: { deleteMany: {}, ...(s.legs.length ? { create: legsCreate(s.legs) } : {}) } } });
const cre = (name: string, s: S) => ({ create: { name, ...base(s), ...(s.legs.length ? { transitLegs: { create: legsCreate(s.legs) } } : {}) } });

const DAY: Array<ReturnType<typeof upd> | ReturnType<typeof cre>> = [
  upd(TENBOU, { h: 9, m: 0, stay: 45, legs: [], lat: 34.1140363, lng: 132.9776018, address: "愛媛県今治市小浦町2丁目5-2",
    memo: "この旅は車でめぐります。JR今治駅の近くでレンタカーを借りて、車で約15分の糸山公園へ。しまなみ海道の今治側の拠点にある展望館で、島々が点在する来島海峡と、海峡にかかる来島海峡大橋を目の前に眺められます。館内には、橋を架けた技術や村上海賊についての展示もあります。糸山の展望台からは、来島村上氏の拠点だった来島も望めます。" }),
  cre("来島海峡急流観潮船", { h: 10, m: 10, stay: 60, legs: [{ mode: "car", min: 25 }], lat: 34.1275706, lng: 133.0219715, address: "愛媛県今治市吉海町名4520-2（道の駅よしうみいきいき館）",
    memo: "来島海峡大橋を車で渡り、約25分で大島の道の駅よしうみいきいき館へ。ここから出る観潮船で、日本三大急潮のひとつに数えられる来島海峡の潮の流れを、すぐそばで体験できます。橋の下をくぐり、来島や小島、馬島のまわりから、波止浜の造船所のあたりまでをめぐる、おおよそ45分のコースです。運航の時刻は潮の流れで日によって変わるので、事前に確かめましょう。船の上では手すりにつかまり、揺れに気をつけましょう。" }),
  cre("タオル美術館", { h: 11, m: 55, stay: 110, legs: [{ mode: "car", min: 45 }], lat: 33.9696759, lng: 133.0330906, address: "愛媛県今治市朝倉上甲2930",
    memo: "大島から橋を戻り、車で約45分、笠松山のふもとの朝倉へ。今治のタオルをテーマにした美術館で、ギャラリーではタオルができるまでの工程や、タオルを使ったアート作品を見られます。約1万坪のヨーロピアンガーデンには、季節ごとの花が咲きます。館内のレストランやカフェで、昼食にしましょう。" }),
  cre("栄福寺", { h: 14, m: 5, stay: 35, legs: [{ mode: "car", min: 20 }], lat: 34.0297812, lng: 132.9781846, address: "愛媛県今治市玉川町八幡甲200",
    memo: "美術館から車で約20分、玉川町の山里へ。四国八十八箇所の第57番札所で、海の難事故を知った空海（弘法大師）が海の神を供養すると、静まった海から阿弥陀如来が現れ、それを本尊として寺が建てられたと伝えられています。入口では、お願い地蔵が迎えてくれます。" + PRAY }),
  cre("今治城", { h: 15, m: 0, stay: 90, legs: [{ mode: "car", min: 20 }], lat: 34.0633765, lng: 133.0068513, address: "愛媛県今治市通町3-1-3",
    memo: "栄福寺から車で約20分、今治の町なかへ。江戸時代のはじめ、築城の名手として知られる藤堂高虎が瀬戸内海に面した海岸に築いた城で、海の水が出入りする珍しい堀では、海の魚が泳ぐ姿を見られます。城の中にあった船入は、今の今治港へと受け継がれています。再建された天守や櫓の中は、博物館や美術館になっています。天守の階段や石垣のまわりでは、足元に気をつけましょう。帰りは、車で約5分のJR今治駅へ戻り、レンタカーを返しましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== TENBOU) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const legs = (d.transitLegs as { create?: { transitDurationMin: number; transitMode: string }[] } | undefined)?.create ?? [];
    const min = legs.reduce((a, l) => a + l.transitDurationMin, 0);
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${min}分${st - prevEnd !== min ? " ⚠" : ""})`;
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${legs.map((l) => l.transitMode).join("+") || "-"}${gap} ${"id" in x ? "来島海峡展望館(既存)" : d.name} ${String(d.memo).length}字`);
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
