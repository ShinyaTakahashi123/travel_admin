/**
 * #481 f7c8d402（盛岡 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜12:10（盛岡城跡公園 → 中津川 →（車）盛岡八幡宮）で、本文はガイドの語り口だった
 *   #409・#447 と重ならないよう、北山の報恩寺・三ツ石神社から南へ歩き、てがみ館・肴町・中津川・歴史文化館・城跡公園を通って、開運橋で締めくくる（戻らない）
 *   盛岡八幡宮（#409・#447 で使っている）は外す。重なるのは、タイトルの城跡公園・中津川のほかは、もりおか歴史文化館（#447）だけ
 *   報恩寺（新規）9:10〜10:00 →（歩き5分）三ツ石神社（新規）10:05〜10:30 →（歩き15分）盛岡てがみ館（新規）10:45〜11:35 →（歩き5分）肴町商店街（新規・昼食）11:40〜12:45
 *   →（歩き5分）中津川 12:50〜13:35 →（歩き5分）もりおか歴史文化館（新規）13:40〜14:50 →（歩き5分）盛岡城跡公園 14:55〜16:00 →（歩き15分）開運橋（新規）16:15〜16:30
 *   閉まる時刻: 報恩寺 9:00〜16:00、てがみ館 9:00〜18:00（第2火曜休館）、歴史文化館 9:00〜18:00／19:00（第3火曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: 報恩寺 https://www.odette.or.jp/kankou/factindex/houonji.pdf （盛岡駅前から本町通経由のバスで本町通一丁目、徒歩15分）・盛岡市 https://www.city.morioka.iwate.jp/kankou/kankou/1037106/rekishi/1009335/1009358/1009360.html （五百羅漢）、
 *   三ツ石神社 https://iwatetabi.jp/spots/4734/ ・ https://tabi-mag.jp/iw0020/ 、てがみ館 https://iwatetabi.jp/spots/4034/ 、肴町 https://iwatetabi.jp/spots/5822/ 、
 *   中津川 https://www.city.morioka.iwate.jp/kankou/kankou/1037106/rekishi/1009470/1009471.html （三つの橋）・ https://www.odette.or.jp/?p=1553 （鮭）、
 *   歴史文化館 https://www.morireki.jp/about/outline/ ・ https://www.morireki.jp/about/history/ ・ https://www.museum.or.jp/museum/17388 、
 *   盛岡城跡 https://www.city.morioka.iwate.jp/kankou/kankou/1037106/rekishi/1009470/1009471.html ・ https://www.city.morioka.iwate.jp/kurashi/midori/koen/1010491.html （石垣・啄木の歌碑）、開運橋 https://www.tohokukanko.jp/attractions/detail_1197.html
 * 座標の出典: OSM（報恩寺 node 8958725386／三ツ石神社 way 708401773／盛岡てがみ館 node 8853823349／肴町 node 6508761930／中の橋 way 51368703／もりおか歴史文化館 way 464456072／盛岡城 node 1945044787／開運橋 way 1207758358）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-481-f7c8d402.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f7c8d402-2e17-4228-a93f-df40e43c9f0e";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const HALL = "堂内では撮影せず、お寺の決まりに従いましょう。";

const DESCRIPTION = "五百羅漢の報恩寺と、「岩手」の名の起こりとされる三ツ石神社から、先人の手紙を集めた盛岡てがみ館、肴町での昼食、中津川の岸辺へ。歴史文化館と盛岡城跡公園で城下町の歩みをたどり、北上川の開運橋で締めくくる、歩いてめぐる盛岡の日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["盛岡城跡公園", "中津川", "盛岡八幡宮"].join()) throw new Error("構成が想定と違います");
  const [castle, river, hachiman] = day.spots;

  const order = [
    { create: mk({ name: "報恩寺", h: 9, m: 10, stay: 50, mode: null, min: null, lat: 39.7121754, lng: 141.1563083, address: "岩手県盛岡市名須川町31-5",
      memo: "この旅は歩きでめぐります。盛岡駅前から本町通経由のバスで本町通一丁目へ行き、歩いて約15分の報恩寺へ。室町時代のはじめに三戸で創建され、江戸時代のはじめに南部利直によって今の場所に移されたと伝えられる寺です。羅漢堂に納められた五百羅漢は、享保16年（1731年）から4年をかけて京都の仏師たちが作ったもので、今は499体が残り、盛岡市の文化財になっています。なかにはマルコ・ポーロやフビライ・ハンの像もあるといわれます。" + HALL + RESPECT }) },
    { create: mk({ name: "三ツ石神社", h: 10, m: 5, stay: 25, mode: "walk", min: 5, lat: 39.7090126, lng: 141.1543577, address: "岩手県盛岡市名須川町2-1",
      memo: "報恩寺から歩いて、東顕寺の裏手の三ツ石神社へ。境内に3つの大きな花崗岩が並びます。昔、この地で人々を悩ませた鬼が、三ツ石の神に捕らえられ、もう来ないという約束のしるしに岩に手形を押したと伝えられ、これが「岩手」の名の起こりとされています。鬼がいなくなったことを喜んだ人々が、石のまわりで踊ったのが、盛岡さんさ踊りの始まりという伝説も残ります。" + RESPECT }) },
    { create: mk({ name: "盛岡てがみ館", h: 10, m: 45, stay: 50, mode: "walk", min: 15, lat: 39.7000854, lng: 141.1546811, address: "岩手県盛岡市中ノ橋通1-1-10 プラザおでって6階",
      memo: "三ツ石神社から南へ歩いて、中津川のほとりのプラザおでって6階にある盛岡てがみ館へ。石川啄木、新渡戸稲造、後藤新平など、盛岡にゆかりのある人々の手紙を中心に、原稿や日記などを集めて展示している、全国でもめずらしい施設です。展示は企画展の形で入れ替わります。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "肴町商店街", h: 11, m: 40, stay: 65, mode: "walk", min: 5, lat: 39.697775, lng: 141.153892, address: "岩手県盛岡市肴町",
      memo: "てがみ館から歩いてすぐの肴町商店街へ。屋根におおわれたアーケードの商店街で、雨や雪の日も歩きやすく、さまざまな店が並びます。このあたりで昼食にしましょう。" }) },
    { id: river.id, data: { visitTime: t(12, 50), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 39.7006993, lng: 141.1544233, address: "岩手県盛岡市内丸",
      memo: "昼食のあとは、中の橋から中津川の岸辺を、下の橋の方へ歩きます。中津川には、江戸時代のはじめに上の橋・中の橋・下の橋が架けられ、城下町の両岸が結ばれました。10月から12月ごろには、北上川から上ってきた鮭の姿が見られることもあり、河口から約200kmという、日本でも長い距離の遡上といわれます。川辺では足元に気をつけましょう。" } },
    { create: mk({ name: "もりおか歴史文化館", h: 13, m: 40, stay: 70, mode: "walk", min: 5, lat: 39.7010437, lng: 141.1526167, address: "岩手県盛岡市内丸1-50",
      memo: "中津川から盛岡城跡公園のとなりの、もりおか歴史文化館へ。旧岩手県立図書館の建物を生かして、2011年に開館しました。1階では盛岡の祭りなど、まち歩きの情報を紹介し、2階では城下町の成り立ちと盛岡の近代化、南部家の資料を中心に展示しています。休館日は公式の案内で確かめましょう。" }) },
    { id: castle.id, data: { visitTime: t(14, 55), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 39.7001247, lng: 141.1502054, address: "岩手県盛岡市内丸1-37",
      memo: "歴史文化館から、盛岡城跡公園へ。慶長2年（1597年）に南部信直が築城を始めたと伝えられる盛岡城の跡で、明治のはじめに城の建物のほとんどは取り壊されましたが、城内とその周辺でとれた花崗岩の石垣が残り、国の史跡になっています。公園には、石川啄木の「不来方のお城の草に寝ころびて　空に吸はれし　十五の心」の歌碑もあります。石垣の上では、足元や高いところに気をつけましょう。" } },
    { create: mk({ name: "開運橋", h: 16, m: 15, stay: 15, mode: "walk", min: 15, lat: 39.7024366, lng: 141.1397509, address: "岩手県盛岡市大通三丁目",
      memo: "城跡公園から西へ歩いて、北上川にかかる開運橋へ。盛岡駅と街の中心を結ぶ橋で、晴れた日には岩手山の姿が見えることもあります。盛岡に転勤してきた人が「遠くへ来てしまった」と泣きながら渡り、去るときには「離れたくない」と泣きながら渡ることから、「二度泣き橋」とも呼ばれます。川と城下町をめぐる盛岡の旅を、ここで締めくくりましょう。帰りは、歩いて約5分の盛岡駅から。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 報恩寺 9:10 → 三ツ石神社 10:05 → てがみ館 10:45 → 肴町（昼食）11:40 → 中津川 12:50 → 歴史文化館 13:40 → 城跡公園 14:55 → 開運橋 16:15〜16:30（盛岡八幡宮は外す）");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx, remove: [hachiman.id] });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
