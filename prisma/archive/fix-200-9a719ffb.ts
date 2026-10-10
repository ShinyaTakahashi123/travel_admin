/**
 * #200 9a719ffb「石舞台と高松塚古墳、レンタサイクルで巡る飛鳥・古代ロマン日帰りプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 5か所 09:00〜13:00 で、終わりが早く、昼食の一言がなく、本文がすべてツアーガイドの話し方（「皆様」「ご案内します」「ございます」）。移動の手段が自転車なのに car になっていた
 * 自転車（移動の手段は other）: 飛鳥駅前営業所で借りる → 高松塚古墳 9:15 → 天武・持統天皇陵 → 亀石（新規）→ 橘寺 → 石舞台古墳 → 島庄（新規・昼食）→ 岡寺 → 酒船石遺跡（新規）→ 飛鳥寺（新規）→ 甘樫丘（新規）16:35
 *   → 橿原営業所（近鉄橿原神宮前駅の東口）で返す。営業所は9時〜17時、別の営業所でも返せる（乗り捨て） https://www.k-asuka.com/about/index.html
 * 本文の出典（docs/content/spot-memo-sources/奈良県.md と #492 で確認済みの事実を書き分け）:
 *   高松塚古墳（1972年発見・1974年国宝・石室ごと取り出して修理・壁画館で模写と模型）／天武・持統天皇陵 宮内庁 https://www.kunaicho.go.jp/visit/ryobo/040.html ／
 *   亀石 https://www.library.pref.nara.jp/nara_2010/0214.html ／橘寺 https://www.asukabito.or.jp/spot_17.html ／
 *   石舞台古墳 https://www.asuka-park.jp/area/ishibutai/tumulus/ （一辺約50mの方墳・特別史跡・石室に入れる）・2026年 世界遺産「飛鳥・藤原の宮都」／
 *   島庄の昼食（石舞台古墳の西どなりの農村レストラン・土産処） https://www.asukadeasobo.jp/visit/yumeichi/ ／岡寺 https://okadera3307.com/about/ ／
 *   酒船石遺跡 https://www.asukamura.jp/gyosei_bunkazai_shitei_1_sakafune2.html ／飛鳥寺 https://inori.nara-kankou.or.jp/inori/special/40shakanyorai/ ／甘樫丘 https://www.asukabito.or.jp/spot_4.html
 * 座標の出典: OSM — 高松塚壁画館 node 1423093823／天武・持統天皇陵 way 807692780／亀石 node 4469534110／橘寺 way 402546839／石舞台古墳 way 1455208274／岡寺 way 491841439／
 *   酒船石 node 6001946849／飛鳥寺 way 813386514／甘樫丘 node 12857755787。推定: 島庄の昼食は国土地理院の住所検索（島庄154、#492 と同じ点）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-200-9a719ffb.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9a719ffb-4a30-415f-bf49-b86c4c744759";
const DAY_ID = "7d5f2694-1d2b-43cf-a992-bb96e2b8e113";
const ID = {
  takamatsuzuka: "a4d93b8f-f79f-4900-b478-b98d0643141b",
  tenmu: "8ea823bb-6f72-41f9-98c7-f98670af0f93",
  ishibutai: "ae5693d8-264f-4462-b2d7-99a0f98e0a3c",
  okadera: "1b953c40-a7b3-4bbf-b440-d2890946e526",
  tachibana: "a42cf93b-b345-43c8-b3da-17414214ea8f",
};
const EXPECTED = [ID.takamatsuzuka, ID.tenmu, ID.ishibutai, ID.okadera, ID.tachibana];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const BIKE = "自転車は車に気をつけて、交通ルールを守って走りましょう。";

const DESCRIPTION =
  "近鉄飛鳥駅前でレンタサイクルを借りて、明日香村の史跡を自転車でめぐる日帰りプランです。高松塚古墳と天武・持統天皇陵、謎の石造物・亀石から、聖徳太子ゆかりの橘寺、巨石の石舞台古墳、岡寺、酒船石遺跡、日本で最初の本格的な仏教寺院とされる飛鳥寺をたずね、最後は甘樫丘から飛鳥の里を見渡します。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(ID.takamatsuzuka, { h: 9, m: 15, stay: 45, mode: null, min: null, lat: 34.4624561, lng: 135.8055508, address: "奈良県高市郡明日香村平田",
    memo: "この旅は自転車でめぐります。近鉄飛鳥駅前のレンタサイクルの営業所で自転車を借りて、約10分の高松塚古墳へ。1972年に極彩色の壁画が見つかって大きな話題となった古墳で、女子群像や男子群像、四神、天井の天文図などが描かれ、1974年に国宝に指定されました。壁画は保存のため石室ごと取り出して修理されていてふだんは見られませんが、となりの高松塚壁画館で、見つかったときの姿を再現した模写や石槨の模型を見学できます。" + BIKE }),
  upd(ID.tenmu, { h: 10, m: 10, stay: 20, mode: "other", min: 10, lat: 34.4684931, lng: 135.8079693, address: "奈良県高市郡明日香村野口",
    memo: "高松塚古墳から自転車で北へ約10分。天武天皇と持統天皇を葬った陵とされる「檜隈大内陵」で、宮内庁が管理しています。八角形の古墳とされ、中には入れません。拝所から、静かに、敬意をもってお参りしましょう。" }),
  cre("亀石", { h: 10, m: 40, stay: 15, mode: "other", min: 10, lat: 34.4711294, lng: 135.8115766, address: "奈良県高市郡明日香村川原",
    memo: "天武・持統天皇陵から自転車で東へ約10分。長さおよそ3.6mの花崗岩に、亀に似た顔が彫られた石造物です。何のために造られたのかははっきりせず、さまざまな説があります。奈良盆地が湖だったころの伝説があり、亀石が今の向きから西を向くと、あたり一帯が泥の海になるといわれています。" }),
  upd(ID.tachibana, { h: 11, m: 5, stay: 35, mode: "other", min: 10, lat: 34.4699277, lng: 135.8179119, address: "奈良県高市郡明日香村橘532",
    memo: "亀石から自転車で東へ約10分。聖徳太子が生まれたと伝えられる地で、太子ゆかりの七大寺の一つとされています。発掘調査では、金堂と塔が東西に並ぶ四天王寺式の伽藍配置だったことも分かりました。境内の「二面石」は、一方が穏やかな顔、もう一方が険しい顔で、人の心の善と悪を表しているといわれます。" + RESPECT }),
  upd(ID.ishibutai, { h: 11, m: 55, stay: 40, mode: "other", min: 15, lat: 34.4668488, lng: 135.8261444, address: "奈良県高市郡明日香村島庄254",
    memo: "橘寺から自転車で東へ約15分。一辺およそ50mの方墳で、国の特別史跡に指定され、2026年には世界遺産「飛鳥・藤原の宮都」の構成資産として登録されました。長い年月の間に盛り土が失われ、巨石を組み合わせた横穴式の石室がむき出しになった、独特の姿で知られます。埋葬されたのは蘇我馬子ではないかという説が有力ですが、はっきりとは分かっていません。石室の中にも入れます。古墳はお墓でもありますので、静かに見学しましょう。" }),
  cre("島庄", { h: 12, m: 40, stay: 55, mode: "walk", min: 5, lat: 34.467278, lng: 135.824097, address: "奈良県高市郡明日香村島庄",
    memo: "石舞台古墳の西どなりには、地元の野菜や古代米を使った料理を出す農村レストランと、旬の農産物や手づくりの工芸品を並べた土産処があります。ここで昼食にしましょう。" }),
  upd(ID.okadera, { h: 13, m: 50, stay: 45, mode: "other", min: 15, lat: 34.4716806, lng: 135.8283148, address: "奈良県高市郡明日香村岡806",
    memo: "島庄から自転車で北へ約15分。正式には龍蓋寺というお寺で、飛鳥時代の僧・義淵僧正が開いたと伝えられます。田畑を荒らす龍を義淵僧正が池に封じ、大きな石で蓋をしたという伝説が、龍蓋寺という名の由来とされます。日本で最初の厄除けの霊場とされ、西国三十三所の第七番札所でもあります。門前へは坂道が続くので、無理をせず自転車を押して上がりましょう。" + RESPECT }),
  cre("酒船石遺跡", { h: 14, m: 45, stay: 20, mode: "other", min: 10, lat: 34.475311, lng: 135.8235272, address: "奈良県高市郡明日香村岡",
    memo: "岡寺から自転車で北へ約10分。7世紀中ごろに造られたとみられる祭祀の遺跡で、表面に不思議な模様が刻まれた「酒船石」と呼ばれる石造物が、丘の上に残されています。近くでは湧水施設の遺構も見つかり、水にまつわる古代の祭祀の場だったと考えられていますが、何のために使われたのか、はっきりとは分かっていません。丘への坂道では足元に気をつけましょう。" }),
  cre("飛鳥寺", { h: 15, m: 15, stay: 35, mode: "other", min: 10, lat: 34.4786718, lng: 135.820198, address: "奈良県高市郡明日香村飛鳥682",
    memo: "酒船石遺跡から自転車で北へ約10分。蘇我馬子の発願で建てられた、日本で最初の本格的な仏教寺院と伝えられます。本尊の銅造釈迦如来坐像は「飛鳥大仏」として親しまれ、609年ごろに完成したと伝わる、日本最古級の仏像の一つです。" + RESPECT }),
  cre("甘樫丘", { h: 16, m: 0, stay: 35, mode: "other", min: 10, lat: 34.4817577, lng: 135.8145805, address: "奈良県高市郡明日香村豊浦",
    memo: "飛鳥寺から自転車で西へ約10分。『日本書紀』には、7世紀に蘇我蝦夷・入鹿の親子がこの丘のふもとに邸宅を構えていたと記されています。頂上の展望台からは、飛鳥の里と、大和三山と呼ばれる耳成山・畝傍山・天香久山、そして二上山までを見渡せます。一帯は国営飛鳥歴史公園として整えられています。丘へは歩いて上り、足元に気をつけましょう。見学のあとは、自転車で約15分の近鉄橿原神宮前駅の東口にある営業所で自転車を返し、近鉄で帰りましょう。借りた営業所と別の所で返せますが、返す時間は公式の案内で確かめておきましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== EXPECTED.join()) throw new Error("構成が想定と違います");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    const name = "id" in x ? `${Object.keys(ID).find((k) => ID[k as keyof typeof ID] === x.id)}(既存)` : (d.name as string);
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${name} ${String(d.memo).length}字`);
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
