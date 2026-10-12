/**
 * #471 7da7343c（出雲 御朱印 日帰り）の組み直し（しおりえ(制作補助2)、企画運営の依頼 9/30 19:47）
 *   fix-471 で #454 と道順・本文をそっくり同じにしたが、同じ中身のしおりが2本並ぶので、「御朱印をいただく」主旨で社寺を中心に組み直す。本文は #454 から写さず書き直す
 *   #454 と重なる博物館・灯台・奉納山公園は1つまで → 古代出雲歴史博物館だけ残し、灯台と奉納山公園を外す。命主社と万九千神社・立虫神社を足す
 *   出雲大社 9:00〜10:15 →（歩き5分）命主社（新規）10:20〜10:40 →（歩き5分）古代出雲歴史博物館 10:45〜11:45 →（歩き10分）神門通り（昼食）11:55〜12:55
 *   →（一畑バス30分）日御碕神社 13:25〜14:10 →（一畑バス25分）稲佐の浜 14:35〜15:05 →（歩きと一畑電車70分）万九千神社・立虫神社（新規）16:15〜16:45
 *   北島國造館は OSM に点がなく、地理院の住所検索の点も建物から離れるので入れない
 * 本文の出典: 出雲観光協会 https://izumo-kankou.gr.jp/676 （出雲大社）・https://www.izumo-kankou.gr.jp/254 （命主社）・https://izumo-kankou.gr.jp/2936 （万九千神社・立虫神社）・/678 （日御碕神社）・/213 （稲佐の浜）、
 *   しまね観光ナビ https://www.kankou-shimane.com/destination/20313 （古代出雲歴史博物館）。日御碕神社・稲佐の浜は、もとの御朱印シリーズの本文の事実を使い、書き出し・結び・年中行事の日付を直す
 * 座標の出典: OSM（出雲大社 way 52958212／命主社 way 470731133／古代出雲歴史博物館 way 413140682／神門通り way 52510005／日御碕神社 way 1219746865／稲佐の浜 way 719127122／万九千神社 way 424250975）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-471b-7da7343c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7da7343c-0d38-4c30-8818-42ba7d184d2b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  const day = it.days[0];
  const want = ["出雲大社", "島根県立古代出雲歴史博物館", "神門通り", "日御碕神社", "出雲日御碕灯台", "稲佐の浜", "奉納山公園"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("構成が想定と違います");
  const [taisha, museum, shinmon, hinomisaki, lighthouse, inasa, honozan] = day.spots;

  const order = [
    { id: taisha.id, data: { visitTime: t(9, 0), stayDurationMin: 75,
      memo: "この旅は電車・バスと歩きでめぐります。一畑電車の出雲大社前駅から歩いて約10分の出雲大社へ。主祭神は、だいこく様として親しまれる大国主大神です。毎年旧暦の10月には、全国の八百万の神々が出雲に集まるとされ、この地では神在月と呼びます。延享元年（1744年）に造営された御本殿は、大社造りと呼ばれる古い神社建築の様式で、国宝です。ふだんは、御祭神にいちばん近づける八足門の前からお参りします。お参りは二礼・四拍手・一礼で、先にお参りを済ませてから、御朱印をお願いしましょう。" + RESPECT } },
    { create: mk({ name: "命主社", h: 10, m: 20, stay: 20, mode: "walk", min: 5, lat: 35.401014, lng: 132.68869, address: "島根県出雲市大社町杵築東",
      memo: "出雲大社から東へ歩いて、摂社の命主社へ。正式な名前は神魂伊能知奴志神社で、世界のはじまりの造化三神の一柱、神皇産霊神をまつっています。社の前には、推定樹齢1000年といわれる、高さ17mのムクの巨木がそびえます。1665年、社の裏の大きな石の下から銅戈と勾玉が見つかり、どちらも国の重要文化財に指定されています。" + RESPECT }) },
    { id: museum.id, data: { visitTime: t(10, 45), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 5,
      memo: "命主社から、出雲大社の東側の古代出雲歴史博物館へ。出雲大社や古代の出雲の歴史を紹介する博物館で、国宝の銅剣・銅鐸や、かつての巨大な本殿を支えた宇豆柱などを間近に見られます。お参りした社の歴史を知ってから、午後の社めぐりへ向かいましょう。休館日は公式の案内で確かめましょう。" } },
    { id: shinmon.id, data: { visitTime: t(11, 55), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 10,
      memo: "博物館から、出雲大社の門前町の神門通りへ。参道沿いに食事処やみやげ物の店が並ぶ通りで、このあたりで昼食にしましょう。午後は、通りのそばの出雲大社バスターミナルからバスに乗ります。" } },
    { id: hinomisaki.id, data: { visitTime: t(13, 25), stayDurationMin: 45, transitMode: "bus", transitDurationMin: 30, transitLine: "一畑バス",
      memo: "出雲大社バスターミナルから一畑バスで、島根半島の西の端の日御碕神社へ。天照大御神をまつる下の宮「日沉宮」と、素盞嗚尊をまつる上の宮「神の宮」の二社からなる神社で、『出雲国風土記』に「美佐伎社」と記される古社です。伊勢神宮が「日本の昼を守る」のに対し、この社は「日本の夜を守る」ようにとの勅命で名づけられたと伝えられています。3代将軍・徳川家光の命で建てられた社殿は、国の重要文化財です。上の宮へは石段を上るので、足元に気をつけましょう。" + RESPECT } },
    { id: inasa.id, data: { visitTime: t(14, 35), stayDurationMin: 30, transitMode: "bus", transitDurationMin: 25, transitLine: "一畑バス",
      memo: "日御碕からバスで戻り、稲佐の浜へ。『古事記』『日本書紀』に伝わる国譲り神話の舞台とされる浜で、大国主大神と天照大御神の使者・建御雷神が、国譲りについて話し合ったと伝えられています。旧暦の10月（今の暦ではおおむね11月ごろ）には、全国から出雲に集まる神々をこの浜で迎える神迎祭が行われます。沖の弁天島が浜の目印です。" + RESPECT + "波打ち際では足元に気をつけましょう。" } },
    { create: mk({ name: "万九千神社・立虫神社", h: 16, m: 15, stay: 30, mode: "train", min: 70, line: "一畑電車", lat: 35.374653, lng: 132.787123, address: "島根県出雲市斐川町併川",
      memo: "稲佐の浜から出雲大社前駅まで歩き、一畑電車で大津町駅へ。駅から歩いて約18分の万九千神社へ。国造りの神々と八百万の神をまつる神社で、神在月に全国から出雲に集まった神々が最後に立ち寄り、神議りと宴を催して、ここから旅立つと伝えられています。同じ境内の立虫神社は、もとは斐伊川の中洲にあり、寛文10年（1670年）ごろ洪水のためにこの地へ移されました。" + RESPECT + "出雲の神々ゆかりの社をめぐる旅を、ここで締めくくりましょう。帰りは、大津町駅から一畑電車で電鉄出雲市駅へ。" }) },
  ];
  console.log("1日目: 出雲大社 9:00 → 命主社 10:20 → 博物館 10:45 → 神門通り（昼食）11:55 →（バス）日御碕神社 13:25 →（バス）稲佐の浜 14:35 →（一畑電車）万九千神社 16:15〜16:45");
  console.log(`外すスポット: ${lighthouse.name}・${honozan.name}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  const description = (it.description ?? "").replace("、古代出雲歴史博物館や出雲日御碕灯台、奉納山公園もたずねる日帰りプランです。", "、命主社や、神々が旅立つと伝わる万九千神社もたずねる日帰りプランです。");
  if (description === it.description) throw new Error("説明文が想定と違います");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(day.id, order as any, { tx, remove: [lighthouse.id, honozan.id] });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
