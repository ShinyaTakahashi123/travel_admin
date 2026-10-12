/**
 * #475 9754ee3c（別府 1泊2日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30、最終日も16:30まで）
 * もとは 1日目 1か所（別府ロープウェイ 10:00〜11:30）、2日目 1か所（明礬温泉 09:30〜10:30）で、本文はガイドの語り口。明礬温泉の写真は別府タワーで場所違い
 *   説明文の「別府の高台と山あい」を生かし、1日目は鶴見岳と志高湖、午後は竹細工と竹瓦温泉。2日目は明礬の湯の花小屋から鉄輪へ下り、午後は高崎山とうみたまごへ（戻らない）
 *   1日目: 別府ロープウェイ 9:10〜9:20 →（ロープウェイ10分）鶴見岳の山上（新規）9:30〜10:45 →（ロープウェイとバス25分）志高湖（新規・昼食）11:10〜12:25
 *     →（バス60分）別府市竹細工伝統産業会館（新規）13:25〜14:35 →（バスと歩き25分）竹瓦温泉（新規）15:00〜16:00 →（歩き3分）竹瓦小路（新規）16:05〜16:30。別府駅のまわりに泊まる
 *   2日目: 明礬温泉の湯の花小屋 9:20〜10:20 →（バスと歩き30分）湯けむり展望台（新規）10:50〜11:20 →（歩き15分）鉄輪温泉 いでゆ坂（新規・昼食）11:35〜12:45
 *     →（歩き5分）鉄輪むし湯（新規）12:50〜13:40 →（バス55分）高崎山自然動物園（新規）14:35〜15:35 →（歩き5分）うみたまご（新規）15:40〜16:30
 *   閉まる時刻: ロープウェイ 9:00〜17:30（冬は17:00）、竹細工会館 8:30〜17:00（月曜休館）、高崎山 9:00〜17:00（入園16:30まで）、うみたまご 9:00〜18:00（11〜2月は17:00）。本文に時刻・曜日は書かない
 *   別府海浜砂湯は運営が変わった可能性があり確かめられないので入れない。神楽女湖は志高湖から片道23分で行き帰りになるので入れない
 * 本文の出典: 別府たび https://beppu-tourism.com/spot/beppu-ropeway/ 、るるぶ https://rurubu.jp/andmore/spot/80040512 （JR別府駅から亀の井バスで20分）、大分県 https://www.visit-oita.jp/spots/detail/4516 （志高湖）、
 *   別府市 https://www.city.beppu.oita.jp/sisetu/sangyou_kankou/06syoukou_06-02takezaiku.html ・/sisetu/shieionsen/detail4.html （竹瓦温泉）・/sisetu/sangyou_kankou/yukemuri.html ・/sisetu/shieionsen/detail11.html （鉄輪むし湯）、
 *   るるぶ https://rurubu.jp/andmore/spot/80040539 （竹瓦小路）、みょうばん湯の里 https://yuno-hana.jp/jp/facility/index01.html 、文化遺産オンライン https://online.bunka.go.jp/heritages/detail/204163 、
 *   高崎山 https://www.takasakiyama.jp/access/ 、https://www.visit-oita.jp/spots/detail/4631 、うみたまご https://www.visit-oita.jp/spots/detail/4634
 * 座標の出典: OSM（別府高原駅 way 414389349／鶴見山上駅 way 412728446／志高湖 way 156303870／竹瓦温泉 way 338231731／竹瓦小路 way 1388877995／湯の華採取見学 node 6594460185／
 *   湯けむり展望台 node 4171954631／いでゆ坂 way 61291094／鉄輪むし湯 way 427361851／高崎山自然動物園 node 7041677485／うみたまご way 182406175）、竹細工伝統産業会館は地理院の住所検索（東荘園八丁目2番13号）
 * 写真: 明礬温泉の写真（別府タワー・場所違い）を外し、湯の花小屋の写真を付ける
 *   https://commons.wikimedia.org/wiki/File:Myoban_Onsen_01.jpg（STA3816、CC BY-SA 3.0。説明「Myoban Onsen, Beppu, Oita, Japan」。わら葺きの湯の花小屋。人は写っていない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-475-9754ee3c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { put } from "@vercel/blob";
import { toWebJpeg } from "./lib/pilot-gen";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9754ee3c-be4b-4db8-838f-348335a26701";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";
const PAGE = "https://commons.wikimedia.org/wiki/File:Myoban_Onsen_01.jpg";
const IMAGE = "https://commons.wikimedia.org/wiki/Special:FilePath/Myoban_Onsen_01.jpg";

const DESCRIPTION = "1日目は別府ロープウェイで鶴見岳の山上へ上り、高原の志高湖でひと息。午後は別府の竹細工にふれ、竹瓦温泉と竹瓦小路へ。2日目は藁葺きの湯の花小屋が並ぶ明礬温泉から、湯けむり展望台、鉄輪の温泉街とむし湯へ下り、高崎山とうみたまごで締めくくる、別府の高台と山あい、湯けむりの1泊2日です。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  if (it.days.length !== 2) throw new Error("日数が想定と違います");
  const [d1, d2] = it.days;
  if (d1.spots.map((s) => s.name).join() !== "別府ロープウェイ（鶴見岳）") throw new Error("1日目が想定と違います");
  if (d2.spots.map((s) => s.name).join() !== "明礬温泉") throw new Error("2日目が想定と違います");
  const ropeway = d1.spots[0];
  const myoban = d2.spots[0];
  if (myoban.photos.length !== 1 || !(myoban.photos[0].sourceUrl ?? "").includes("Beppu_Tower")) throw new Error("明礬温泉の写真が想定と違います");

  const day1 = [
    { id: ropeway.id, data: { name: "別府ロープウェイ", visitTime: t(9, 10), stayDurationMin: 10, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.277905, lng: 131.448718, address: "大分県別府市大字南立石",
      memo: "この旅はバスと歩き、ロープウェイでめぐります。JR別府駅から亀の井バスで約20分の、別府ロープウェイの別府高原駅へ。九州最大級の101人乗りのゴンドラで、標高1,375mの鶴見岳の山上まで約10分で上ります。" } },
    { create: mk({ name: "鶴見岳の山上", h: 9, m: 30, stay: 75, mode: "other", min: 10, lat: 33.285217, lng: 131.433255, address: "大分県別府市",
      memo: "山上では、七福神めぐりの道を歩きながら、別府の街や由布岳、くじゅう連山、晴れた日には中国地方や四国までの眺めを楽しめます。山の上は下より気温が低いので、上着を持っていきましょう。山道では足元に気をつけましょう。" }) },
    { create: mk({ name: "志高湖", h: 11, m: 10, stay: 75, mode: "bus", min: 25, line: "亀の井バス", lat: 33.263503, lng: 131.455502, address: "大分県別府市大字別府",
      memo: "ロープウェイで下り、亀の井バスで志高湖へ。鶴見岳の南東の山腹、海抜600mにある高原の湖で、湖ではボートが楽しめ、春の桜や秋の紅葉も見どころです。湖のほとりで昼食にしましょう。水辺では足元に気をつけましょう。" }) },
    { create: mk({ name: "別府市竹細工伝統産業会館", h: 13, m: 25, stay: 70, mode: "bus", min: 60, line: "亀の井バス", lat: 33.298382, lng: 131.484818, address: "大分県別府市東荘園8丁目2-13",
      memo: "志高湖から亀の井バスで別府駅へ戻り、バスを乗りついで竹細工伝産館前へ。別府の伝統の竹細工を紹介する施設で、展示室で作品や歴史を見られるほか、予約をすれば竹細工の体験もできます。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "竹瓦温泉", h: 15, m: 0, stay: 60, mode: "bus", min: 25, line: "亀の井バス", lat: 33.277449, lng: 131.505976, address: "大分県別府市元町16-23",
      memo: "バスで別府駅へ戻り、歩いて約10分の竹瓦温泉へ。明治12年（1879年）に開かれた市営の温泉で、今の建物は昭和13年（1938年）に建てられた、唐破風の大きな屋根が目印です。ふつうの湯のほか、温泉で温めた砂に横たわる砂湯もあります。休みの日は公式の案内で確かめましょう。" + BATH }) },
    { create: mk({ name: "竹瓦小路", h: 16, m: 5, stay: 25, mode: "walk", min: 3, lat: 33.276747, lng: 131.505945, address: "大分県別府市元町",
      memo: "竹瓦温泉のすぐそばの竹瓦小路へ。竹瓦温泉へ来る人が雨にぬれないようにと、大正10年（1921年）に作られた、現存する日本最古の木造アーケードとされます。別府の高台と温泉をめぐる1日目を、ここで締めくくりましょう。今夜は別府駅のまわりに泊まります。" }) },
  ];
  const day2 = [
    { id: myoban.id, data: { name: "明礬温泉の湯の花小屋", visitTime: t(9, 20), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.319424, lng: 131.454123, address: "大分県別府市明礬",
      memo: "旅の2日目は、別府駅から亀の井バスの立命館アジア太平洋大学行きで約30分、地蔵湯前で降りて、明礬温泉のみょうばん湯の里へ。わら・かや・竹・木だけで建てた湯の花小屋で、江戸時代から300年続く方法で湯の花を作っていて、その技術は国の重要無形民俗文化財に指定されています。小屋の見学ができます。" } },
    { create: mk({ name: "湯けむり展望台", h: 10, m: 50, stay: 30, mode: "bus", min: 30, line: "亀の井バス", lat: 33.315694, lng: 131.485301, address: "大分県別府市鉄輪東",
      memo: "明礬からバスで鉄輪へ下り、歩いて湯けむり展望台へ。鉄輪の温泉街から立ちのぼる湯けむりを一望できる展望台です。住宅地の中にあるので、まわりの住民の方に配慮して静かに見学しましょう。" }) },
    { create: mk({ name: "鉄輪温泉 いでゆ坂", h: 11, m: 35, stay: 70, mode: "walk", min: 15, lat: 33.315898, lng: 131.477592, address: "大分県別府市鉄輪",
      memo: "展望台から坂を下って、鉄輪温泉の中心のいでゆ坂へ。湯けむりが上がる石畳の坂道で、このあたりで昼食にしましょう。坂が多いので、足元に気をつけましょう。" }) },
    { create: mk({ name: "鉄輪むし湯", h: 12, m: 50, stay: 50, mode: "walk", min: 5, lat: 33.316376, lng: 131.478066, address: "大分県別府市鉄輪上1組",
      memo: "いでゆ坂の鉄輪むし湯へ。建治2年（1276年）に一遍上人が開いたといわれる蒸し湯で、温泉の熱で温めた約8畳の石室に、清流沿いにしか育たない薬草・石菖を敷き、その上に横たわります。休みの日は公式の案内で確かめましょう。" + BATH }) },
    { create: mk({ name: "高崎山自然動物園", h: 14, m: 35, stay: 60, mode: "bus", min: 55, line: "亀の井バス・大分交通バス", lat: 33.258259, lng: 131.532793, address: "大分県大分市",
      memo: "鉄輪からバスで別府駅へ戻り、大分交通バスの大分駅行きで約15分、高崎山へ。野生のニホンザルを間近で見られる自然動物園で、エサの時間には多くのサルが寄せ場に集まります。寄せ場へは、さるっこレールで上れます。サルにはさわったり、食べ物を見せたりしないようにしましょう。" }) },
    { create: mk({ name: "大分マリーンパレス水族館うみたまご", h: 15, m: 40, stay: 50, mode: "walk", min: 5, lat: 33.258969, lng: 131.53564, address: "大分県大分市",
      memo: "高崎山のふもと、道をはさんだうみたまごへ。高崎山と別府湾にはさまれた水族館で、大回遊水槽では豊後水道の魚が泳ぎ、セイウチのパフォーマンスも人気です。別府の高台と山あい、湯けむりをめぐる旅を、ここで締めくくりましょう。帰りは、バスで別府駅か大分駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: ロープウェイ 9:10 → 鶴見岳 9:30 →（バス）志高湖（昼食）11:10 →（バス）竹細工会館 13:25 →（バス）竹瓦温泉 15:00 → 竹瓦小路 16:05〜16:30（宿）");
  console.log("2日目: 湯の花小屋 9:20 →（バス）湯けむり展望台 10:50 → いでゆ坂（昼食）11:35 → むし湯 12:50 →（バス）高崎山 14:35 → うみたまご 15:40〜16:30");
  console.log(`外す写真: ${myoban.photos[0].sourceUrl}／付ける写真: ${PAGE}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const res = await fetch(IMAGE, { headers: { "User-Agent": "shiorie-content-tool/1.0" } });
  if (!res.ok) throw new Error(`画像の取得に失敗: ${res.status}`);
  const blob = await put("fix-475/myoban-yunohana.jpg", await toWebJpeg(Buffer.from(await res.arrayBuffer())), { access: "public", addRandomSuffix: true });
  console.log("画像を保存しました:", blob.url);
  await prisma.$transaction(async (tx) => {
    await tx.photo.delete({ where: { id: myoban.photos[0].id } });
    await tx.photo.create({ data: { spotId: myoban.id, url: blob.url, sourceUrl: PAGE, author: "STA3816", license: "CC BY-SA 3.0", licenseUrl: "https://creativecommons.org/licenses/by-sa/3.0/" } });
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(d1.id, day1 as any, { tx });
    await setDaySpotOrder(d2.id, day2 as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
