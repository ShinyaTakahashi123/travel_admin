/**
 * #456 e72b89e7（萩・松下村塾 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（松下村塾 09:30〜10:30）。午前は城下町の志士ゆかりの地、午後はバスで松陰神社のまわりへ（西から東へ進み、戻らない）
 *   木戸孝允旧宅（新規）9:25〜9:55 → 円政寺（新規）10:00 → 高杉晋作誕生地（新規）10:25 → 萩博物館（新規・昼食）11:00〜12:15
 *   →（萩循環まぁーるバス45分）松陰神社・松下村塾 13:00〜13:50 → 吉田松陰歴史館（新規）13:55 → 伊藤博文旧宅・別邸（新規）14:40
 *   → 玉木文之進旧宅（新規）15:30 → 吉田松陰誕生地（新規）16:00〜16:30、帰りは「松陰誕生地前」からバスで東萩駅へ
 *   萩の城下町や松陰神社は #441 とも重なるが、このしおりは「志士の足跡」をたどる主旨で組む（企画運営の了承: 行き先の重なりは問題なし）
 *   閉まる時刻: 木戸孝允旧宅・高杉晋作誕生地 9:00〜17:00、円政寺 8:00〜17:00、萩博物館 9:00〜17:00（入館16:30まで・不定休あり）、伊藤博文別邸 9:00〜17:00。本文に時刻・曜日は書かない
 *   まぁーるバスは約45分ごと
 * 本文の出典: 松陰神社 https://showin-jinja.or.jp/about/syokasonjuku/ ・/guide-map/rekishikan/ ・/access/ 、おいでませ山口へ https://yamaguchi-tourism.jp/spot/detail_14028.html （木戸孝允旧宅）・
 *   detail_13972.html（高杉晋作誕生地）・detail_17062.html（円政寺）・detail_14395.html（萩博物館）・detail_14027.html（伊藤博文旧宅）・detail_15411.html（伊藤博文別邸）・
 *   detail_15408.html（玉木文之進旧宅）・detail_15415.html（吉田松陰誕生地）、萩市 https://www.city.hagi.lg.jp/soshiki/49/1658.html （まぁーるバス）・/hagihaku/hikidashi/shinsaku/index.htm （高杉晋作資料室）
 * 座標の出典: OSM（円政寺 node 4333133137／萩博物館 relation 7974371／松下村塾 way 555592247／吉田松陰歴史館 way 555592242）、
 *   地理院の住所検索（木戸孝允旧宅「萩市呉服町二丁目37」34.412411,131.394348／高杉晋作誕生地「南古萩町23」34.411644,131.392883／伊藤博文旧宅「椿東1515」34.411201,131.417419／
 *   玉木文之進旧宅「椿東1584」34.412655,131.422043／吉田松陰誕生地「椿東1433」34.410221,131.424149。どれも OSM に点がないため）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-456-e72b89e7.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e72b89e7-2295-4d98-979e-1b4a4f59a75a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "城下町の木戸孝允旧宅、円政寺、高杉晋作誕生地、萩博物館をたずね、午後はバスで松陰神社へ。世界遺産の松下村塾と吉田松陰歴史館、伊藤博文旧宅・別邸、玉木文之進旧宅、吉田松陰誕生地まで、幕末の志士たちの足跡をたどる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "松下村塾") throw new Error("構成が想定と違います");
  const sonjuku = day.spots[0];

  const order = [
    { create: mk({ name: "木戸孝允旧宅", h: 9, m: 25, stay: 30, mode: null, min: null, lat: 34.412411, lng: 131.394348, address: "山口県萩市呉服町二丁目37",
      memo: "この旅はバスと歩きでめぐります。JR山陰本線の東萩駅から歩いて約25分で、城下町の木戸孝允旧宅へ。桂小五郎の名でも知られ、「維新の三傑」と詠われた木戸孝允が、20歳まで過ごした木造2階建て・瓦葺きの家です。" }) },
    { create: mk({ name: "円政寺", h: 10, m: 0, stay: 20, mode: "walk", min: 5, lat: 34.411359, lng: 131.39404, address: "山口県萩市南古萩町",
      memo: "旧宅から歩いてすぐの金毘羅社 円政寺へ。嘉永4年（1851年）ごろから約1年半、のちに初代総理大臣となる11歳の伊藤博文が預けられた寺で、幼い高杉晋作が家の人に連れられて、拝殿の大きな天狗の面を見せられたとも伝わります。境内には、幼いころの晋作や博文が遊んだといわれる木馬（神馬）が残っています。" + RESPECT }) },
    { create: mk({ name: "高杉晋作誕生地", h: 10, m: 25, stay: 25, mode: "walk", min: 5, lat: 34.411644, lng: 131.392883, address: "山口県萩市南古萩町23",
      memo: "円政寺から歩いて、高杉晋作誕生地へ。「幕末の風雲児」高杉晋作が生まれた家で、今は南側の半分が公開され、産湯に使ったと伝えられる井戸や、晋作の自作の句碑などがあります。" }) },
    { create: mk({ name: "萩博物館", h: 11, m: 0, stay: 75, mode: "walk", min: 10, lat: 34.413377, lng: 131.390598, address: "山口県萩市堀内355",
      memo: "城下町を西へ歩いて、萩博物館へ。萩の自然、歴史、文化を学べる施設で、吉田松陰や高杉晋作をはじめとする幕末維新の資料を展示し、館内には高杉晋作資料室もあります。館内のレストランで昼食にしましょう。休館日は公式の案内で確かめましょう。" }) },
    { id: sonjuku.id, data: { name: "松陰神社・松下村塾", visitTime: t(13, 0), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 45, transitLine: "萩循環まぁーるバス", lat: 34.41215, lng: 131.417335, address: "山口県萩市椿東1537",
      memo: "萩循環まぁーるバスを乗り継いで、松陰神社へ（バスは約45分ごとなので、時刻は前もって確かめましょう）。境内に残る松下村塾は、松陰の叔父・玉木文之進が天保13年（1842年）に自宅で開いた私塾に名づけたのが始まりです。松陰は安政4年（1857年）11月、杉家のとなりの小屋を改装した8畳1間の塾で教え始め、安政6年に亡くなるまでの約2年間に、久坂玄瑞や伊藤博文、吉田稔麿らが学びました。平成27年（2015年）に世界遺産になりました。" + RESPECT } },
    { create: mk({ name: "吉田松陰歴史館", h: 13, m: 55, stay: 40, mode: "walk", min: 5, lat: 34.41235, lng: 131.416759, address: "山口県萩市椿東1537（松陰神社境内）",
      memo: "松陰神社の境内にある吉田松陰歴史館へ。明治維新の中心人物となった吉田松陰の生涯を、70体以上のろう人形で20の場面に分けて再現し、音声で解説しています。" }) },
    { create: mk({ name: "伊藤博文旧宅・別邸", h: 14, m: 40, stay: 40, mode: "walk", min: 5, lat: 34.411201, lng: 131.417419, address: "山口県萩市椿東1515",
      memo: "神社から歩いてすぐの伊藤博文旧宅と別邸へ。旧宅は、初代内閣総理大臣・伊藤博文が14歳から13年間、両親と住んだ、木造茅葺き平屋建ての約29坪の小さな家です（外観のみ見学できます）。となりの別邸は、博文が明治40年（1907年）に東京府下の大井村（今の品川区）に建てた建物の一部を、萩市が譲り受けて移築したものです。" }) },
    { create: mk({ name: "玉木文之進旧宅", h: 15, m: 30, stay: 20, mode: "walk", min: 10, lat: 34.412655, lng: 131.422043, address: "山口県萩市椿東1584-1",
      memo: "別邸から東へ坂を上って、玉木文之進旧宅へ。松陰の叔父で、松下村塾を始めた玉木文之進の家です。文之進は松陰の師にあたり、乃木希典もこの家から明倫館に通いました。坂道では足元に気をつけましょう。" }) },
    { create: mk({ name: "吉田松陰誕生地", h: 16, m: 0, stay: 30, mode: "walk", min: 10, lat: 34.410221, lng: 131.424149, address: "山口県萩市椿東1433-1",
      memo: "さらに坂を上り、団子岩と呼ばれる高台の吉田松陰誕生地へ。松陰は天保元年（1830年）にここで生まれ、19歳ごろまで過ごしました。建物は残っていませんが、大正時代に置かれた間取りを示す敷石があり、「誕生之地」の石碑は塾生だった山県有朋の揮毫です。そばには、下田の海岸でペリー艦隊を望む松陰と金子重之助の銅像もあります。幕末の志士たちの足跡をたどる旅を、ここで締めくくりましょう。帰りは、「松陰誕生地前」のバス停からまぁーるバスで東萩駅へ。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 木戸 9:25 → 円政寺 10:00 → 高杉 10:25 → 萩博物館（昼食）11:00〜12:15 →（バス）松陰神社 13:00 → 歴史館 13:55 → 伊藤博文 14:40 → 玉木 15:30 → 誕生地 16:00〜16:30");
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
