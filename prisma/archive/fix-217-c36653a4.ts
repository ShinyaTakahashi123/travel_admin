/**
 * #217 c36653a4「運河の街・小樽と積丹ブルーを満喫する海辺の旅」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 1日目 5か所 09:00〜14:13・2日目 5か所 09:00〜16:02 で、終わりが早く、昼食の行がなかった。
 *   小樽オルゴール堂本館（オルゴールの専門店）と旧小樽倉庫（洋菓子店の店舗）はお店の紹介になるので外す。
 *   確かめられない言い方（「〜なんです」「〜ですよ」の口調、国内最大級の専門店、など）が多かった。座標の多くが丸めた値だった
 * 1日目（歩きと路線バス）: 旧手宮線 9:00 → 小樽市総合博物館 → 小樽運河 → 小樽寿司屋通り（昼食）→ 小樽芸術村 → 堺町通り商店街 →（バス）小樽天狗山 16:55
 * 2日目（レンタカー、小樽駅のそばで借りる）: おたる水族館 9:00 → 美国・黄金岬（昼食）→ 積丹岬（島武意海岸）→ 神威岬 16:30 → 小樽へ
 *   #498（小樽・積丹・余市）と行き先が重なるので、文は別に書いた
 * 本文の出典: 北海道公式 HOKKAIDO LOVE! https://www.visit-hokkaido.jp/spot/detail_<番号>.html —
 *   手宮線跡地 10528（寿司屋通りから総合博物館まで・1880年の官営幌内鉄道・石炭・1985年廃線・約1.6km・2018年 北海道遺産）／
 *   小樽市総合博物館 10108（鉄道発祥地・手宮・1885年の機関車庫三号は日本最古で重要文化財・約50両・1909年製のアイアンホース号・9:30〜17:00・火曜休）／
 *   小樽運河 10040（1923年完成・小型船・幅40mの北運河・ガス灯）／小樽寿司屋通り 10107（花園銀座商店街とサンモール一番街の間・寿司の店）／
 *   小樽芸術村 10539（歴史的建造物4棟・ステンドグラス美術館 約140点・似鳥美術館・旧三井銀行小樽支店・休館日）／
 *   小樽天狗山ロープウェイ 10038（約4分・標高532.4m・小樽市街と石狩湾・積丹半島・北海道三大夜景・天狗山神社・9:00〜21:00）／
 *   おたる水族館 10113（北海道最大・約250種5,000点・海獣公園）／積丹岬 10340（島武意海岸・日本の渚百選・シララの小道・女郎子岩・エゾカンゾウ）／
 *   神威岬 10342（高さ80mの断崖・チャレンカの小道 約770m・約20分・300度・入口ゲートは時期と天候で変わる）／
 *   堺町通り商店街 https://otaru-sakaimachi.com/ ／黄金岬・美国 積丹観光協会 https://www.kanko-shakotan.jp/spot/ （美国港の先・遊歩道410m・展望台）・https://www.kanko-shakotan.jp/food/
 * 座標: OSM — 旧手宮線は手宮線跡地 way 38939644 の中ほどの点 node 462786424（Nominatim がこの way を返さないため、way の実在の点）／総合博物館 way 438955552（Nominatim の中心）／
 *   小樽運河 way 205065355（同）／寿司屋通り way 38939785（同）／小樽芸術村 node 9423069277／堺町通り way 205065353（同）／天狗山ロープウェイ山頂駅 way 260292980（同）／
 *   おたる水族館 way 473908898（同）／黄金岬 node 5603040047／島武意海岸 node 3092235147／神威岬 node 2676941120（node は API で名前つきを確かめた）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-217-c36653a4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c36653a4-5028-4cd1-8a44-da82c154eebf";
const DAY1 = "6b8e35bc-9417-4008-987b-e1f27db1ed79";
const DAY2 = "1f5c565f-16be-4d4e-916c-a4d98f359c6c";
const ID = {
  temiya: "3c2be376-50cf-4d54-bed8-c8c1f6edc39d",
  tengu: "436f54d1-a07b-4d55-8d52-03748b587c10",
  sakai: "f3a85017-084d-43d8-9c9b-fd52641f46ca",
  orgel: "ff4015e1-57bd-4108-830f-38da26219291",
  unga: "99614ea6-6032-49f0-83f0-441fccd9271f",
  letao: "8a1ae2a9-69bb-4f7c-a123-b0b6f5dce188",
  aqua: "bf0babb6-fe02-4eb7-823a-ee7edcce4d01",
  bikuni: "46b582a6-2033-4672-9ae3-1c7fec6d7e67",
  shakotan: "d64914a8-f1be-48bb-9a39-0969c53984ee",
  kamui: "e466293c-e58e-464c-ac04-b69dad67a58a",
};
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;

const DESCRIPTION =
  "1日目は小樽を歩き、鉄道の跡の旧手宮線と総合博物館から、運河、寿司屋通りでの昼食、小樽芸術村、堺町通りをめぐって、夕方は天狗山から街と海を見渡します。2日目はレンタカーで、おたる水族館から積丹半島へ。美国の黄金岬、島武意海岸、神威岬と、積丹ブルーの海をたどる1泊2日です。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string; name?: string };
const data = (s: S) => ({ ...(s.name ? { name: s.name } : {}), visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { ...data(s), name } });

const D1 = [
  upd(ID.temiya, { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 43.1980729, lng: 140.9990624, address: "北海道小樽市色内",
    memo: "この日は歩きと路線バスでめぐります。JR小樽駅から歩いて約10分。寿司屋通りから小樽市総合博物館まで続く、旧国鉄手宮線の跡を生かした約1.6kmの散策路です。手宮線は、1880年に北海道で初めて開通した官営幌内鉄道の一部で、幌内の炭鉱から小樽港へ石炭を運んでいましたが、1985年に廃線になりました。線路や踏切、遮断機がそのまま残り、2018年には北海道遺産「小樽の鉄道遺産」に選ばれています。線路の上では足元に気をつけて歩きましょう。" }),
  cre("小樽市総合博物館", { h: 9, m: 55, stay: 70, mode: "walk", min: 15, lat: 43.2113568, lng: 141.0014406, address: "北海道小樽市手宮",
    memo: "線路跡をたどって北へ歩いて約15分。北海道の鉄道が始まった手宮にある博物館で、1885年に建てられ、日本で最も古いとされる機関車庫三号は国の重要文化財です。屋外には約50両の実物の車両が並び、1909年にアメリカで造られた蒸気機関車「アイアンホース号」が客車を引いて走る日もあります。運行日や休館日は公式の案内で確かめましょう。" }),
  upd(ID.unga, { h: 11, m: 25, stay: 35, mode: "walk", min: 20, lat: 43.2020231, lng: 141.0006005, address: "北海道小樽市港町",
    memo: "博物館から南へ歩いて約20分。1923年に完成した運河で、かつては港に届いた荷物を運ぶ小さな船で賑わいました。今も当時の40mの幅を残す北運河と、散策路が整えられた区間があり、緩やかに曲がる水路に沿って石造りの倉庫が並びます。夕暮れにはガス灯がともります。水辺では足元に気をつけましょう。" }),
  cre("小樽寿司屋通り", { h: 12, m: 15, stay: 60, mode: "walk", min: 15, lat: 43.1941253, lng: 140.9987053, address: "北海道小樽市稲穂",
    memo: "運河から歩いて約15分。花園銀座商店街とサンモール一番街の間の通りで、寿司の店が軒を連ねています。ここで昼食にしましょう。" }),
  cre("小樽芸術村", { h: 13, m: 25, stay: 80, mode: "walk", min: 10, lat: 43.197399, lng: 141.001508, address: "北海道小樽市色内",
    memo: "寿司屋通りから歩いて約10分。運河のそばの歴史的な建物4棟を生かした芸術の施設です。ステンドグラス美術館では、19世紀後半から20世紀初めに英国の教会を飾っていた約140点の作品が並び、銀行だった建物を生かした似鳥美術館や旧三井銀行小樽支店では、高い吹き抜けやルネサンス様式の天井の装飾を見られます。休館日は公式の案内で確かめましょう。" }),
  upd(ID.sakai, { h: 14, m: 55, stay: 35, mode: "walk", min: 10, lat: 43.194351, lng: 141.0060723, address: "北海道小樽市堺町",
    memo: "芸術村から歩いて約10分。古い石造りや煉瓦造りの建物を生かした店が並ぶ通りで、ガラスの細工やお菓子の店などをのぞきながら歩けます。人通りが多いので、まわりに気をつけて歩きましょう。" }),
  upd(ID.tengu, { h: 16, m: 5, stay: 50, mode: "bus", min: 35, line: "路線バス（天狗山線）", lat: 43.171959, lng: 140.9721032, address: "北海道小樽市最上2-16-15",
    memo: "堺町通りから小樽駅前へ戻り、路線バスで天狗山ロープウェイの山麓へ行き、ロープウェイで約4分（あわせて約35分）。標高532.4mの山頂からは、小樽の市街地や港、石狩湾が箱庭のように広がり、晴れた日には積丹半島まで見渡せます。夜は、函館山・藻岩山とともに「北海道三大夜景」のひとつに数えられる夜景も広がります。山頂の天狗山神社では、静かにお参りしましょう。帰りはロープウェイとバスで小樽駅へ戻り、この夜は小樽の宿に泊まりましょう。" }),
];

const D2 = [
  upd(ID.aqua, { h: 9, m: 0, stay: 90, mode: null, min: null, lat: 43.237007, lng: 141.0114018, address: "北海道小樽市祝津3-303",
    memo: "この日はレンタカーでめぐります。JR小樽駅のそばでレンタカーを借りて、車で約20分の祝津へ。北海道最大とされる水族館で、約250種5,000点の生きものが暮らしています。海を仕切っただけのプールで飼育する「海獣公園」では、アザラシやトド、セイウチが、野生に近い姿を見せてくれます。季節によって営業の時間が変わるので、公式の案内で確かめましょう。" }),
  upd(ID.bikuni, { name: "美国・黄金岬", h: 11, m: 40, stay: 80, mode: "car", min: 70, lat: 43.3031736, lng: 140.6013495, address: "北海道積丹郡積丹町美国町",
    memo: "水族館から海沿いを車で約1時間10分、積丹半島の美国へ。美国港の先から海へ突き出した黄金岬には約410mの遊歩道があり、展望台から海を見渡せます。夏はウニの季節で、港のまわりには食事の店もあるので、ここで昼食にしましょう。遊歩道の坂や階段では足元に気をつけましょう。" }),
  upd(ID.shakotan, { name: "積丹岬（島武意海岸）", h: 13, m: 20, stay: 70, mode: "car", min: 20, lat: 43.3730966, lng: 140.4774482, address: "北海道積丹郡積丹町入舸町",
    memo: "美国から車で約20分。積丹岬の島武意海岸は、日本の渚百選に選ばれた海岸で、展望台からは海底の岩まで見えるほど澄んだ「積丹ブルー」の海が広がります。シララの小道と呼ばれる遊歩道を進むと、沖に向かって立つ女性の姿に見えるといわれる女郎子岩があり、悲しい伝説が語り継がれています。初夏には断崖にエゾカンゾウの花が咲きます。崖のそばでは足元に気をつけましょう。" }),
  upd(ID.kamui, { h: 14, m: 55, stay: 95, mode: "car", min: 25, lat: 43.3335697, lng: 140.3466923, address: "北海道積丹郡積丹町神岬町",
    memo: "積丹岬から車で約25分、半島の北西の先へ。高さ80mの断崖に囲まれた岬で、駐車場から先端へは、アップダウンのある約770mの遊歩道「チャレンカの小道」が続き、約20分歩くと、周囲300度を見渡せる先端に着きます。入口のゲートは時期や天候によって開く時間が変わるので、公式の案内で確かめましょう。風の強い日は、足元に十分気をつけましょう。帰りは、小樽まで車で約2時間です。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  const ids = it.days.map((d) => d.spots.map((s) => s.id).join());
  if (it.days[0].id !== DAY1 || it.days[1].id !== DAY2 || ids[0] !== [ID.temiya, ID.tengu, ID.sakai, ID.orgel, ID.unga].join() || ids[1] !== [ID.letao, ID.aqua, ID.bikuni, ID.shakotan, ID.kamui].join())
    throw new Error("構成が想定と違います");
  const names = Object.fromEntries(it.days.flatMap((d) => d.spots.map((s) => [s.id, s.name])));
  for (const [label, day] of [["1日目", D1], ["2日目", D2]] as const) {
    console.log(`\n${label}`);
    let prevEnd = -1;
    for (const x of day) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${"id" in x ? (d.name ?? names[x.id]) + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  const removedPhotos = it.days.flatMap((d) => d.spots.filter((s) => s.id === ID.orgel || s.id === ID.letao).flatMap((s) => s.photos.map((p) => p.sourceUrl)));
  console.log(`\n外す: 小樽オルゴール堂本館・旧小樽倉庫（写真 ${removedPhotos.length}枚も一緒に外れる: ${removedPhotos.join(" , ")}）\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1, D1, { remove: [ID.orgel], tx });
      await setDaySpotOrder(DAY2, D2, { remove: [ID.letao], tx });
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
