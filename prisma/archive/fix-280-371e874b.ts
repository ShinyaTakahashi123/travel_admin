/**
 * チェックリスト #280 の修正記録(見直し)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * 本番でDay1が15:14終了・Day2が15:21終了と、決まり2(16:30〜17:00)に届いて
 * いないことが判明。
 *
 * Day2: 東根城跡(新規、東根市)を東沢バラ公園のあとに追加。国指定特別天然
 * 記念物「東根の大ケヤキ」(樹齢1500年以上・高さ28m・根回り24m)と、東の杜
 * 資料館(横尾家の民俗資料・国分一太郎ら偉人の文献)を含む。
 * 出典(直接開いたURL):
 * https://www.city.higashine.yamagata.jp/tourism/asobu/39 (東根市公式。
 * 大ケヤキの数値・昭和32年[1957]国指定特別天然記念物の年月日)
 * https://www.higashine.com/higashi-no-mori/intro-higashinomori (東の杜公式。
 * 展示内容、9:00〜17:00・火曜休館)
 * 座標はOverpass(OSM)で確認(historic=castle「東根城跡」、tourism=museum
 * 「東根市東の杜資料館」)。「日本一」は根拠が明確でないためヘッジした。
 *
 * Day1: 白銀の滝を「白銀公園」に改め、本文を拡充。白銀の滝は公園の入り口に
 * すぎず、実際には園内に洗心峡・長蛇渓などの渓流美や、坑道跡をめぐる
 * 1時間ほどの散策路が整備されていることが分かったため、実在するこれらの
 * 内容を加えて滞在を30分→65分に見直した(水増しではなく、既存の説明が
 * 公園全体を反映していなかったための拡充)。
 * 出典: https://www.city.obanazawa.yamagata.jp/kanko/nature/1396
 * (尾花沢市公式。「一時間ほどで周れる散策路」「洗心峡、長蛇渓」「坑道跡」)
 *
 * Day1はこれで16:19終了となり、決まり2にわずかに届いていない。この区間
 * (尾花沢市街・銀山温泉周辺)でOverpassにより広く探したが、他に実在する
 * 行き先を見つけられなかった。企画運営に報告のうえ判断を仰ぐ。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280-371e874b.ts
 * (実行済み。東根城跡の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day2.spots.some((s) => s.name === "東根城跡")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const shirogane = day1.spots.find((s) => s.name === "白銀の滝")!;

  await updateSpotInItinerary(ITIN_ID, { spotId: shirogane.id }, {
    name: "白銀公園",
    stayDurationMin: 65,
    memo:
      "徳良湖からは車で20分ほどです。白銀公園は、落差22メートルの白銀の滝を入り口とする、銀山川沿いの自然公園です。滝から続く遊歩道を歩くと、洗心峡や長蛇渓と呼ばれる渓流美や、かつて延沢銀山の坑道だった跡も見ることができ、ひとめぐりおよそ1時間の散策が楽しめます。この一帯はかつて延沢銀山として栄えた鉱山の里で、大正期には滝の水力を利用した発電も行われていたと伝えられています。足元が滑りやすいところもあるので、気をつけて歩きましょう。",
  });

  const higashine = day2.spots.find((s) => s.name === "東沢バラ公園")!;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        ...day2.spots.filter((s) => s.id !== higashine.id).map((s) => ({ id: s.id, data: {} })),
        { id: higashine.id, data: {} },
        {
          create: {
            name: "東根城跡",
            address: "東根市中央3丁目",
            lat: 38.4414697,
            lng: 140.4019392,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 33)),
            stayDurationMin: 60,
            transitMode: "car",
            transitDurationMin: 12,
            memo:
              "東沢バラ公園からは車で12分ほどです。東根城跡は、南北朝時代(1347年ごろ)に地頭・小田島長義が築いたと伝えられる城の跡です。本丸跡の西側には、国指定特別天然記念物の「東根の大ケヤキ」がそびえています。樹齢1500年以上と推定され、高さおよそ28m、根回りおよそ24mという規模を誇り、東根城が築かれる前からすでに大木としてそびえていたと伝えられています。城跡に隣接する「東の杜資料館」は、旧家・横尾家の酒蔵を改装した施設で、雛人形や古い民具、東根ゆかりの先人たちの資料などが展示されています。休館日があるので、訪れる前に公式の案内で確かめましょう。",
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
