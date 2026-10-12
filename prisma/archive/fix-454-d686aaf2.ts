/**
 * #454 d686aaf2（出雲・稲佐の浜 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（稲佐の浜 15:38〜16:38）。出雲大社から日御碕へ足を延ばし、夕方に稲佐の浜と奉納山公園で締めくくる
 *   出雲大社（新規）9:00〜10:15 →（歩き5分）古代出雲歴史博物館（新規）10:20〜11:30 →（歩き10分）神門通り（新規・昼食）11:40〜12:40
 *   →（一畑バス30分）日御碕神社（新規）13:10〜13:50 →（歩き10分）出雲日御碕灯台（新規）14:00〜14:50 →（一畑バス30分）稲佐の浜 15:20〜16:00
 *   →（歩き10分）奉納山公園（新規）16:10〜16:30、帰りは出雲大社前駅まで歩く
 *   古代出雲歴史博物館は改修のため休館していたが、10月1日にリニューアルオープン（しまね観光ナビ）。9:00〜18:00（11〜2月は17:00）・第1・3火曜休館
 *   出雲日御碕灯台の参観は 9:00〜12:00／13:00〜16:30（3〜9月の土日などは17:00まで）。本文に時刻・曜日は書かない
 *   もとの本文は案内役の話し言葉だったので、開いたページの事実だけで書き直す
 * 本文の出典: 出雲観光協会 https://izumo-kankou.gr.jp/676 （出雲大社）・/213 （稲佐の浜）・/678 （日御碕神社）・https://www.izumo-kankou.gr.jp/677 （出雲日御碕灯台）・/212 （奉納山公園）、
 *   しまね観光ナビ https://www.kankou-shimane.com/destination/20313 （古代出雲歴史博物館）
 * 座標の出典: OSM（出雲大社 way 52958212／島根県立古代出雲歴史博物館 way 413140682／神門通り way 52510005／日御碕神社 way 1219746865／出雲日御碕灯台 way 454970181／
 *   稲佐の浜 way 719127122（beach）／奉納山公園 way 682613344）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-454-d686aaf2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "d686aaf2-9cd1-4c2a-a27f-87e042f9d717";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "出雲大社と古代出雲歴史博物館をたずね、門前の神門通りで昼食。バスで島根半島の西の端・日御碕へ足を延ばして日御碕神社と出雲日御碕灯台をめぐり、夕方は国譲り神話の舞台・稲佐の浜と、浜を見下ろす奉納山公園へ。神話の地・出雲を歩く日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "稲佐の浜") throw new Error("構成が想定と違います");
  const inasa = day.spots[0];

  const order = [
    { create: mk({ name: "出雲大社", h: 9, m: 0, stay: 75, mode: null, min: null, lat: 35.399803, lng: 132.685151, address: "島根県出雲市大社町杵築東",
      memo: "この旅は電車・バスと歩きでめぐります。一畑電車の出雲大社前駅から歩いて約10分で出雲大社へ。「だいこく様」として親しまれる大国主大神をまつる神社で、今の本殿は延享元年（1744年）に造営された、高さ約24mの国宝です。神楽殿の正面には、長さ13.6m、重さ5.2tの、日本最大級とされる大しめ縄が掛かっています。お参りは、二礼・四拍手・一礼が作法です。" + RESPECT }) },
    { create: mk({ name: "島根県立古代出雲歴史博物館", h: 10, m: 20, stay: 70, mode: "walk", min: 5, lat: 35.398783, lng: 132.68856, address: "島根県出雲市大社町杵築東",
      memo: "出雲大社のすぐ東隣の、島根県立古代出雲歴史博物館へ。荒神谷遺跡の358本の銅剣や加茂岩倉遺跡の39個の銅鐸（どちらも国宝）、出雲大社本殿の巨大な宇豆柱（重要文化財）などを展示しています。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "神門通り", h: 11, m: 40, stay: 60, mode: "walk", min: 10, lat: 35.394157, lng: 132.686827, address: "島根県出雲市大社町杵築南",
      memo: "博物館から、出雲大社の門前の通り・神門通りへ。このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "日御碕神社", h: 13, m: 10, stay: 40, mode: "bus", min: 30, line: "一畑バス", lat: 35.429558, lng: 132.629416, address: "島根県出雲市大社町日御碕",
      memo: "神門通りのそばの出雲大社バスターミナルから、一畑バスで約20分、島根半島の西の端の日御碕へ。『出雲国風土記』に「美佐伎社」と記される神社で、下の宮「日沉宮」と上の宮「神の宮」の上下二社をあわせて日御碕神社と呼びます。今の社殿は、3代将軍・徳川家光の命で寛永11年（1634年）に松江藩主の京極忠高が着手し、1644年に松平直政が完成させたもので、上下の二社とも権現造りの社殿と境内の石造物が、国の重要文化財に指定されています。" + RESPECT }) },
    { create: mk({ name: "出雲日御碕灯台", h: 14, m: 0, stay: 50, mode: "walk", min: 10, lat: 35.433743, lng: 132.629271, address: "島根県出雲市大社町日御碕",
      memo: "神社から歩いて、出雲日御碕灯台へ。明治36年（1903年）に設置された灯台で、地面から塔頂までの高さは43.65m、石造の灯台としては日本一の高さとされます。令和4年（2022年）に国の重要文化財に指定されました。内部の163段のらせん階段を上ると展望台があり、日本海や島根半島、晴れた日には隠岐諸島も望めます。参観できる時間は公式の案内で確かめましょう。階段や展望台では足元に気をつけましょう。" }) },
    { id: inasa.id, data: { visitTime: t(15, 20), stayDurationMin: 40, transitMode: "bus", transitDurationMin: 30, transitLine: "一畑バス", lat: 35.395781, lng: 132.673611, address: "島根県出雲市大社町杵築北",
      memo: "日御碕からバスで戻り、稲佐の浜へ。出雲大社の西方約1kmにある、国譲り・国引きの神話で知られる浜です。浜の屏風岩は、高天原からの使者・武甕槌神が、この岩を背に大国主大神と国譲りの話し合いをしたと伝わる場所で、地元で「べんてんさん」と親しまれる丸い弁天島がひときわ目を引きます。旧暦10月10日に、全国の八百万の神々をお迎えする場所としても知られています。" + RESPECT + "波打ち際では足元に気をつけましょう。" } },
    { create: mk({ name: "奉納山公園", h: 16, m: 10, stay: 20, mode: "walk", min: 10, lat: 35.401395, lng: 132.675946, address: "島根県出雲市大社町杵築北",
      memo: "浜から歩いて、奉納山公園へ。昭和30年に完成した公園で、標高75mの頂上の展望台からは、大社の町並みや、国引き神話の稲佐の浜から三瓶山までを一望できます。中世の廻国聖が全国66か所の聖地に経筒を埋めたことが、奉納山の名の由来です。山の中腹には、昭和11年に歌舞伎界の名門などの寄付で建てられた出雲阿国の記念塔もあります。石段では足元に気をつけましょう。神話の地・出雲をめぐる旅を、ここで締めくくりましょう。帰りは、出雲大社前駅まで歩いて戻ります。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 出雲大社 9:00 → 博物館 10:20 → 神門通り（昼食）11:40 →（バス）日御碕神社 13:10 → 灯台 14:00 →（バス）稲佐の浜 15:20 → 奉納山公園 16:10〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
