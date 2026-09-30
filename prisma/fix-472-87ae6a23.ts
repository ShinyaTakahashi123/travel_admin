/**
 * #472 87ae6a23（青森 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜12:10（ワ・ラッセ →（車）青森県立美術館）で、本文はガイドの語り口だった
 *   午前は青森駅まわり（ワ・ラッセ・八甲田丸・アスパムで昼食）、午後は市営バスで県立美術館と三内丸山遺跡へ（戻らない）
 *   ワ・ラッセ 9:10〜10:20 →（歩き5分）八甲田丸（新規）10:25〜11:30 →（歩き5分）アスパム（新規・昼食）11:35〜12:40
 *   →（歩きと市営バス30分）青森県立美術館 13:10〜14:25 →（歩き10分）さんまるミュージアム（新規）14:35〜15:25 →（歩き5分）三内丸山遺跡（新規）15:30〜16:30
 *   閉まる時刻: 美術館 9:30〜17:00（入館16:30まで・第2・第4月曜休館）、さんまるミュージアム 9:00〜17:00、八甲田丸 11〜3月は17:00まで（月曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: Amazing AOMORI https://aomori-tourism.com/spot/detail_3698.html （ワ・ラッセ）・/spot/detail_4.html （アスパム）、八甲田丸 https://aomori-hakkoudamaru.com/hakkodamaru.html ・/shipguidance.html 、
 *   青森県立美術館 https://www.aomori-museum.jp/visit/ 、三内丸山遺跡 https://sannaimaruyama.pref.aomori.jp/information/museum/ ・/information/access/ 、https://jomon-japan.jp/learn/jomon-sites/sannai-maruyama
 * 座標の出典: OSM（ねぶたの家 ワ・ラッセ way 138098524／八甲田丸 way 138098525／アスパム way 755972188／青森県立美術館 node 318411516／さんまるミュージアム node 12997708549／三内丸山遺跡 way 651501082）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-472-87ae6a23.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "87ae6a23-3462-45da-b81d-577f5869957b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION = "大型ねぶたを展示するワ・ラッセ、青函連絡船の八甲田丸、展望台のあるアスパムと、青森駅のまわりをめぐり、午後はバスで奈良美智の《あおもり犬》がいる青森県立美術館と、世界遺産の三内丸山遺跡へ。ねぶたとアート、縄文にふれる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["ねぶたの家ワ・ラッセ", "青森県立美術館"].join()) throw new Error("構成が想定と違います");
  const [warasse, museum] = day.spots;

  const order = [
    { id: warasse.id, data: { visitTime: t(9, 10), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null, lat: 40.829572, lng: 140.735946, address: "青森県青森市安方1丁目1-1",
      memo: "この旅は歩きとバスでめぐります。JR青森駅から歩いて1分の、ねぶたの家 ワ・ラッセへ。2階まで吹き抜けになった1階のねぶたホールに、実際に祭りに出陣した大型ねぶた4台を常設で展示しています。2階では、ねぶた祭の起源や歴史、ねぶたの制作の技術や作風、題材の移り変わりを紹介しています。" } },
    { create: mk({ name: "青函連絡船メモリアルシップ八甲田丸", h: 10, m: 25, stay: 65, mode: "walk", min: 5, lat: 40.83159, lng: 140.736385, address: "青森県青森市柳川1丁目",
      memo: "ワ・ラッセから海沿いを歩いて、八甲田丸へ。青函連絡船は、明治41年（1908年）から昭和63年（1988年）までの80年間、青森港と函館港を結びました。八甲田丸は歴代55隻のなかで現役の期間がいちばん長かったとされる船で、ほぼ就航当時の状態で保存されています。1階の車両甲板には郵便車など9両の鉄道車両が並び、4階のブリッジでは舵や通信機器にふれられます。船内の階段では足元に気をつけましょう。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "青森県観光物産館アスパム", h: 11, m: 35, stay: 65, mode: "walk", min: 5, lat: 40.829763, lng: 140.741007, address: "青森県青森市安方1丁目1-40",
      memo: "八甲田丸から歩いて、青森の頭文字「A」をイメージした三角形の建物、アスパムへ。13階の展望台からは、地上51mから青森の街や港、八甲田の山々を見わたせます。2階ではねぶた祭の360度のパノラマ映像や、津軽こぎん刺しの実演、1階には青森のみやげが並びます。このあたりで昼食にしましょう。" }) },
    { id: museum.id, data: { visitTime: t(13, 10), stayDurationMin: 75, transitMode: "bus", transitDurationMin: 30, transitLine: "青森市営バス", lat: 40.807292, lng: 140.700886, address: "青森県青森市安田近野185",
      memo: "青森駅前から青森市営バスの三内丸山遺跡行きに乗り、県立美術館前で降ります（約20分）。青森県立美術館は、建築家・青木淳が設計し、となりの三内丸山遺跡の発掘現場の「トレンチ」から発想を得たとされる美術館です。4層吹き抜けのアレコホールには、マルク・シャガールがバレエ「アレコ」のために描いた舞台背景画が飾られています。奈良美智の《あおもり犬》（高さ8.5m）は、館内のガラス越しに一年中見られます。休館日は公式の案内で確かめましょう。" } },
    { create: mk({ name: "さんまるミュージアム", h: 14, m: 35, stay: 50, mode: "walk", min: 10, lat: 40.808924, lng: 140.697563, address: "青森県青森市三内丸山",
      memo: "美術館から歩いて、三内丸山遺跡センターのさんまるミュージアムへ。遺跡から出土した約1,700点の遺物を展示していて、そのうち約620点が重要文化財です。大型板状土偶やヒスイ製大珠、クリの大型木柱などを間近に見られます。" }) },
    { create: mk({ name: "三内丸山遺跡", h: 15, m: 30, stay: 60, mode: "walk", min: 5, lat: 40.811001, lng: 140.697562, address: "青森県青森市三内丸山",
      memo: "ミュージアムから外へ出て、特別史跡の三内丸山遺跡を歩きます。縄文時代の大規模な拠点集落の跡で、直径約1mのクリの柱6本の大型掘立柱建物の跡や、大型竪穴建物、盛土などが見られます。2021年には「北海道・北東北の縄文遺跡群」のひとつとして世界遺産に登録されました。ねぶたとアート、縄文にふれる旅を、ここで締めくくりましょう。帰りは、三内丸山遺跡前から青森市営バスで青森駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: ワ・ラッセ 9:10 → 八甲田丸 10:25 → アスパム（昼食）11:35 →（市営バス）美術館 13:10 → さんまるミュージアム 14:35 → 三内丸山遺跡 15:30〜16:30");
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
