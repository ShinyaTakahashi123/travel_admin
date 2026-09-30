/**
 * チェックリスト #294 の修正記録(見直し2、企画運営の指摘: 決まりA違反の是正)。
 * しおり「三朝川の河原風呂、野趣あふれる混浴露天と温泉街1泊2日」
 * (476fb1d7-5930-48de-894f-98a40c9f9333)
 *
 * fix-294で「複数箇所を少し調整」としたのは、実質的に滞在を延ばす水増しだった
 * (決まりA違反)。指摘を受け、下記4か所をすべて元の長さに戻した:
 * 木造旅館街140→90分、上流の旅館町並み30→20分、倉吉白壁土蔵群110→90分、
 * 打吹公園55→45分。
 *
 * 空いた時間は実在の行き先で埋めた(座標はいずれもOverpass/OSMで確認、
 * 別の行き先の点の使い回しなし):
 *
 * Day1: 陣所の館(新規、三朝橋のたもと。Overpassでtourism=museum・Wikipedia
 * ありのノードを確認: id 6272358822, 鳥取県東伯郡三朝町三朝910-4)。三朝神社
 * の後に追加。出典(直接開いたURL):
 * https://ja.wikipedia.org/wiki/陣所の館
 * (毎年5月4日の「陣所」綱引き神事で使う重さ2トン・長さ80mの大綱を展示、
 * 三徳山投入堂の模型も展示、入場無料)
 * あわせて、すぐそばの「湯の街ギャラリー」(温泉本通り沿いに旅館・店舗の
 * 軒先を飾る展示が点在)にも触れた。宿の一言を三朝神社からここへ移動。
 *
 * Day2: 飛龍閣(新規、打吹公園内。Overpassでtourism=attraction・Wikipedia
 * ありのノードを確認: id 4505589850)。打吹公園の後に追加。
 * 出典: https://www.kurayoshi-kankou.jp/hiryukaku/
 * (明治37年[1904]倉吉町が建築、明治40年[1907]皇太子だったころの大正天皇の
 * 山陰行啓の宿舎に使用、国登録有形文化財、現在は外観見学のみ)
 *
 * 結果、Day1は8か所09:00〜16:33、Day2は6か所09:00〜16:33(いずれも窓内)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-294c-476fb1d7.ts
 * (実行済み。陣所の館の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "476fb1d7-5930-48de-894f-98a40c9f9333";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "陣所の館")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const misasabashi = day1.spots.find((s) => s.name === "三朝橋")!;
  const kawarafuro = day1.spots.find((s) => s.name === "三朝川 河原風呂")!;
  const machinami = day1.spots.find((s) => s.name === "三朝温泉 木造旅館街")!;
  const kabuyu = day1.spots.find((s) => s.name === "株湯")!;
  const koitanibashi = day1.spots.find((s) => s.name === "恋谷橋")!;
  const joryu = day1.spots.find((s) => s.name === "上流の歴史ある木造旅館の町並み")!;
  const jinja = day1.spots.find((s) => s.name === "三朝神社")!;

  const yadoLine = "今夜はこの近くの宿に宿泊します。";
  const jinjaMemoWithoutYado = jinja.memo!.replace(" " + yadoLine, "").replace(yadoLine, "");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: misasabashi.id, data: {} },
        { id: kawarafuro.id, data: {} },
        { id: machinami.id, data: { stayDurationMin: 90 } },
        { id: kabuyu.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 40)) } },
        { id: koitanibashi.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 13, 52)) } },
        {
          id: joryu.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 32)), stayDurationMin: 20 },
        },
        {
          id: jinja.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)), memo: jinjaMemoWithoutYado },
        },
        {
          create: {
            name: "陣所の館",
            address: "東伯郡三朝町三朝910-4",
            lat: 35.4104137,
            lng: 133.8929773,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 48)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "三朝神社からは歩いて8分ほどです。陣所の館は、三朝橋のたもとにある、入場無料の資料館です。毎年5月4日に行われる「花湯まつり」の綱引き神事「陣所」で使われる、重さおよそ2トン・長さ80mの大綱を間近に見ることができるほか、三徳山投入堂の模型も展示されています。すぐそばの温泉本通りには「湯の街ギャラリー」と呼ばれる、旅館や店舗の軒先を飾る小さな展示が点在し、そぞろ歩きながら見て回ることができます。 " +
              yadoLine,
          },
        },
      ],
      { tx }
    );

    const sanbutsuji = day2.spots.find((s) => s.name === "三佛寺本堂")!;
    const nageire = day2.spots.find((s) => s.name === "投入堂参拝登山")!;
    const shirakabe = day2.spots.find((s) => s.name === "倉吉白壁土蔵群")!;
    const uchibuki = day2.spots.find((s) => s.name === "打吹公園")!;
    const kurayoshihaku = day2.spots.find((s) => s.name === "倉吉博物館")!;

    await setDaySpotOrder(
      day2.id,
      [
        { id: sanbutsuji.id, data: {} },
        { id: nageire.id, data: {} },
        { id: shirakabe.id, data: { stayDurationMin: 90 } },
        {
          id: uchibuki.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 15)), stayDurationMin: 45 },
        },
        {
          create: {
            name: "飛龍閣",
            address: "倉吉市仲ノ町",
            lat: 35.4298348,
            lng: 133.8235205,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 3)),
            stayDurationMin: 25,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "打吹公園からはすぐです。飛龍閣は、明治37年(1904)に倉吉町が建てた建物で、明治40年(1907)、皇太子だったころの大正天皇が山陰を行啓した際、宿舎として使われました。地元の大工・山田市平によって建てられ、御座所や寝殿、浴室などが設けられています。国の登録有形文化財に指定されており、現在は一般公開されていませんが、芝庭越しに外観を眺めることができます。",
          },
        },
        {
          id: kurayoshihaku.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 33)),
            memo: kurayoshihaku.memo!.replace(
              "打吹公園からは歩いて5分ほどです。",
              "飛龍閣からは歩いて5分ほどです。"
            ),
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
