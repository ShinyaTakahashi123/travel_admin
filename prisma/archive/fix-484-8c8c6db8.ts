/**
 * #484 8c8c6db8（丸亀 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜13:35（丸亀城 →（車）中津万象園 → うちわミュージアム）で、万象園とミュージアムの時刻が重なり、昼食の一言がなく、説明文に「日本一高い石垣」の言い切りがあった
 *   朝に讃岐塩屋の中津万象園とうちわミュージアム、電車で丸亀へ戻って昼食、港の太助灯籠から南へ歩いて資料館、丸亀城で締めくくる（戻らない。丸亀駅は乗り換えの駅として通る）
 *   丸亀駅前の猪熊弦一郎現代美術館は 2026年6月29日〜2027年3月31日（予定）の改修で休館なので入れない
 *   中津万象園 9:30〜10:45 →（歩き5分）丸亀うちわミュージアム 10:50〜11:45 →（歩き15分・予讃線 讃岐塩屋12:12→丸亀、計30分）丸亀駅前（新規・昼食）12:15〜13:20
 *   →（歩き5分）太助灯籠（新規）13:25〜13:45 →（歩き20分）丸亀市立資料館（新規）14:05〜14:55 →（歩き5分）丸亀城 15:00〜16:30
 *   電車: 丸亀 8:59 琴平行き（讃岐塩屋に9:02ごろ）、讃岐塩屋 12:12 高松行き（Yahoo!路線情報 https://transit.yahoo.co.jp/timetable/27751/2201 ・ https://transit.yahoo.co.jp/timetable/27707/2200 、平日）
 *   閉まる時刻: 中津万象園 9:30〜17:00（水曜定休）、うちわミュージアム 9:30〜17:00（水曜休館）、資料館 9:30〜16:30（月曜・祝日休館）、丸亀城天守 9:00〜16:30（入城16:00まで）。本文に時刻・曜日・料金は書かない
 * 本文の出典: 丸亀市 https://www.city.marugame.lg.jp/page/3065.html （万象園）・丸亀市観光協会 https://www.love-marugame.jp/spot/923 （大傘松・観潮楼）・三豊市観光交流局 https://www.mitoyo-kanko.com/facility/nakazubansyouen/ （讃岐塩屋駅から徒歩約15分）、
 *   丸亀うちわ https://marugameuchiwa.jp/museum ・丸亀市 https://www.city.marugame.lg.jp/page/3056.html （うちわの歴史・生産量）、太助灯籠 https://www.city.marugame.lg.jp/page/3067.html 、
 *   資料館 https://www.city.marugame.lg.jp/page/2857.html 、丸亀城 https://www.city.marugame.lg.jp/site/castle/2930.html ・ https://www.my-kagawa.jp/point/117/ ・ https://www.city.marugame.lg.jp/site/castle/7882.html （石垣の復旧）
 * 座標の出典: OSM（中津万象園 way 545623348／丸亀駅 バス停 node 8498024054／太助燈籠 node 10862212367／丸亀市立資料館 node 1423707275／丸亀城 node 1179835155）、
 *   丸亀うちわミュージアムは OSM に点がないので地理院の住所検索（丸亀市中津町25番地）34.286369,133.7686
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-484-8c8c6db8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8c8c6db8-2e32-4d3d-82c4-662914a2ee14";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION = "京極家2代藩主が築いた大名庭園・中津万象園と、丸亀うちわミュージアムから、金毘羅参りの港の目印だった太助灯籠、丸亀市立資料館を通って、「扇の勾配」の石垣で知られる丸亀城で締めくくる、電車と歩きでめぐる丸亀の日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["丸亀城", "中津万象園", "丸亀うちわミュージアム"].join()) throw new Error("構成が想定と違います");
  const [castle, garden, uchiwa] = day.spots;

  const order = [
    { id: garden.id, data: { visitTime: t(9, 30), stayDurationMin: 75, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.2854725, lng: 133.7682273, address: "香川県丸亀市中津町25-1",
      memo: "この旅は電車と歩きでめぐります。JR丸亀駅から予讃線でひと駅の讃岐塩屋駅へ行き、歩いて約15分の中津万象園へ。丸亀藩京極家2代藩主の京極高豊が、貞享5年（1688年）に築いた、約1万5千坪の池泉回遊式の大名庭園です。庭の中心には、京極家の出身地・近江の琵琶湖にならった池があり、近江八景を模した島々が浮かびます。朱塗りの邀月橋からの眺めや、樹齢600年とされる大傘松、国内に残るもっとも古い煎茶室とされる観潮楼も見どころです。池のまわりでは足元に気をつけましょう。休園日は公式の案内で確かめましょう。" } },
    { id: uchiwa.id, data: { visitTime: t(10, 50), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.286369, lng: 133.7686, address: "香川県丸亀市中津町25-1",
      memo: "庭園の北どなりの丸亀うちわミュージアムへ。丸亀うちわの歴史を伝えるうちわや、うちわづくりの模型人形、文献などを展示し、実演コーナーでは職人が伝統の技と工程を見せてくれる、うちわの総合博物館です。丸亀うちわは、江戸時代のはじめに金毘羅参りの土産として、朱赤に丸金印の渋うちわが作られたのが始まりとされ、丸亀藩が下級武士の内職として勧めたことで広まりました。今は全国のうちわの約9割がつくられ、国の伝統的工芸品に指定されています。休館日は公式の案内で確かめましょう。" } },
    { create: mk({ name: "丸亀駅前", h: 12, m: 15, stay: 65, mode: "train", min: 30, line: "JR予讃線", lat: 34.2910129, lng: 133.7929939, address: "香川県丸亀市浜町",
      memo: "ミュージアムから歩いて讃岐塩屋駅へ行き、予讃線で丸亀駅へ。駅の周りで昼食にしましょう。" }) },
    { create: mk({ name: "太助灯籠", h: 13, m: 25, stay: 20, mode: "walk", min: 5, lat: 34.29483, lng: 133.7933279, address: "香川県丸亀市福島町",
      memo: "駅から北へ歩いて約5分、丸亀港の太助灯籠へ。天保9年（1838年）に、江戸に住む人々が千人講でお金を出し合って建てた灯籠で、台座には「江戸講中」、側面には寄進者や世話人ら1,357人の名前が刻まれています。金毘羅参りの客でにぎわった丸亀港の目印で、参拝客はこの灯籠を目印に港へ入り、約12km先の琴平をめざしました。80両という大きな額を寄進した塩原太助の名にちなんで、この名で呼ばれています。" }) },
    { create: mk({ name: "丸亀市立資料館", h: 14, m: 5, stay: 50, mode: "walk", min: 20, lat: 34.285742, lng: 133.7983297, address: "香川県丸亀市一番丁",
      memo: "港から南へ歩いて、丸亀城の西のふもとの丸亀市立資料館へ。2階の常設展示室では、丸亀城と城下町の移り変わりと、生駒・山崎・京極の3つの家ゆかりの資料を中心に、丸亀の江戸時代の歴史を紹介しています。休館日は公式の案内で確かめましょう。" }) },
    { id: castle.id, data: { visitTime: t(15, 0), stayDurationMin: 90, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 34.2860216, lng: 133.8001009, address: "香川県丸亀市一番丁",
      memo: "資料館から、丸亀城へ。慶長2年（1597年）に生駒親正・一正の父子が築き始めた城で、一国一城令でいったん廃城となったのち、寛永20年（1643年）から山崎家治が築き直しました。今の天守は、京極家の時代の万治3年（1660年）に完成したもので、全国に12しか残っていない木造の天守のひとつとして、国の重要文化財です。内堀から天守へと積み重なる石垣は、「扇の勾配」と呼ばれる美しい曲線を描きます。平成30年に崩れた石垣は、今も復旧の工事が続いているので、見学できる範囲は公式の案内で確かめましょう。坂道や石段では足元に気をつけましょう。京極家ゆかりの庭と城をめぐる旅を、ここで締めくくりましょう。帰りは、歩いて約10分の丸亀駅から。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 中津万象園 9:30 → うちわミュージアム 10:50 →（電車）丸亀駅前（昼食）12:15 → 太助灯籠 13:25 → 資料館 14:05 → 丸亀城 15:00〜16:30");
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
