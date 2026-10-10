/**
 * チェックリスト #292 の修正記録(見直しの続き2、企画運営3点・法務1点)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 1. 決まりA: 片貝沼90分→45分、高湯通り120分→95分に短縮。
 * 2. 空いた時間は実在の行き先で埋めた:
 *    Day1: 湯女石(記念碑群、新規)を追加。国交省公式多言語解説データベース
 *    https://www.mlit.go.jp/tagengo-db/H30-00256.html で確認(蔵王温泉史跡
 *    めぐりマップに掲載。5つの記念碑が集められた場所で、「湯女石」は伝説を
 *    伝える碑、和歌を刻んだ石柱もある)。座標は特定できなかったため、高湯通り
 *    の代表点を暫定使用(コメントに記載)。
 *    Day2: うつぼ沼・目玉沼(新規)を追加。蔵王中央ロープウェイ運営会社公式
 *    https://zaochuoropeway.co.jp/jp/summer/sansaku.php で確認(「鬱蒼とした
 *    湿地の窪地に位置する畳一枚ほどのほんの一握りの沼」)。座標は特定できな
 *    かったため、片貝沼の代表点を暫定使用(コメントに記載)。
 * 3. 上湯・川原湯共同浴場(旅の最後)の結びの一文を、指示の口調に修正。
 * 4. 法務の指摘: 高湯通りの「共同浴場をのぞいてみたりしながら」を
 *    「共同浴場の湯小屋の外観を眺めたりしながら」に修正。
 *
 * 結果、Day1は7か所09:00〜16:39、Day2は7か所09:30〜16:34(いずれも窓内)。
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292c-44c030d6.ts
 * (実行済み。湯女石の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "44c030d6-8683-4c99-84eb-96159b2ce14b";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "湯女石(記念碑群)")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const okama = day1.spots.find((s) => s.name === "蔵王のお釜")!;
  const kattamine = day1.spots.find((s) => s.name === "刈田嶺神社")!;
  const zaoRopeway = day1.spots.find((s) => s.name === "蔵王ロープウェイ")!;
  const takayu = day1.spots.find((s) => s.name === "高湯通り")!;
  const suzukawa = day1.spots.find((s) => s.name === "酢川温泉神社")!;
  const shimoyu = day1.spots.find((s) => s.name === "下湯共同浴場")!;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: okama.id, data: {} },
        { id: kattamine.id, data: {} },
        { id: zaoRopeway.id, data: {} },
        {
          id: takayu.id,
          data: {
            stayDurationMin: 95,
            memo: takayu.memo!.replace("共同浴場をのぞいてみたりしながら", "共同浴場の湯小屋の外観を眺めたりしながら"),
          },
        },
        {
          create: {
            name: "湯女石(記念碑群)",
            address: "山形市蔵王温泉",
            lat: 38.1364,
            lng: 140.4008,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 29)),
            stayDurationMin: 25,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              // 座標は高湯通りの代表点を暫定使用(正確な設置場所の地図点が確認できるまでの間)
              "高湯通りからは歩いて5分ほどです。町の中心部近くには、5つの記念碑が集められた一角があります。「湯女石」は、愛する人とともに命を落とした男の言い伝えを今に伝える碑です。ほかにも、蔵王温泉を詠んだ和歌を刻んだ石柱が立てられています。温泉街の歴史に触れながら、ゆっくりとめぐってみましょう。",
          },
        },
        {
          id: suzukawa.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 4)),
            transitMode: "walk",
            transitDurationMin: 5,
            memo: suzukawa.memo!.replace(
              "高湯通りからは歩いて8分ほどです(229段の石段が続きます)。",
              "湯女石(記念碑群)からは歩いて5分ほどです(229段の石段が続きます)。"
            ),
          },
        },
        { id: shimoyu.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 29)) } },
      ],
      { tx }
    );

    const onsen = day2.spots.find((s) => s.name === "蔵王温泉大露天風呂")!;
    const chuoRopeway = day2.spots.find((s) => s.name === "蔵王中央ロープウェイ")!;
    const tenbodai = day2.spots.find((s) => s.name === "鳥兜山展望台")!;
    const dokko = day2.spots.find((s) => s.name === "どっこ沼")!;
    const katakai = day2.spots.find((s) => s.name === "片貝沼")!;
    const kyodo = day2.spots.find((s) => s.name === "上湯・川原湯共同浴場")!;

    await setDaySpotOrder(
      day2.id,
      [
        { id: onsen.id, data: {} },
        { id: chuoRopeway.id, data: {} },
        { id: tenbodai.id, data: {} },
        { id: dokko.id, data: {} },
        { id: katakai.id, data: { stayDurationMin: 45 } },
        {
          create: {
            name: "うつぼ沼・目玉沼",
            address: "山形市蔵王温泉(蔵王中央高原)",
            lat: 38.1606242,
            lng: 140.4233101,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 54)),
            stayDurationMin: 30,
            transitMode: "other",
            transitDurationMin: 15,
            memo:
              // 座標は片貝沼の代表点を暫定使用(同じ蔵王中央高原の散策路上にあり、正確な地図点が確認できるまでの間)
              "片貝沼からは、リフトと徒歩をあわせて15分ほどです。うつぼ沼・目玉沼は、鬱蒼とした湿地の窪地にある、畳一枚ほどのささやかな沼です。その奇妙な形が名前の由来になっています。ブナの原生林に囲まれた、静かなひとときを過ごしましょう。",
          },
        },
        {
          id: kyodo.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 49)),
            memo: kyodo
              .memo!.replace(
                "どっこ沼からは、リフトと徒歩をあわせて30分ほどです。",
                "うつぼ沼・目玉沼からは、リフトと徒歩をあわせて25分ほどです。"
              )
              .replace(
                "1泊2日、蔵王の火山の絶景と温泉街の湯めぐりを、心ゆくまでお楽しみください。",
                "蔵王の火山の絶景と温泉街をめぐった1泊2日を、ここで締めくくりましょう。"
              ),
            transitMode: "other",
            transitDurationMin: 25,
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
