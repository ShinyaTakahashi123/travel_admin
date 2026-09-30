/**
 * チェックリスト #292 の修正記録(見直しの続き6、企画運営・法務の指摘)。
 * しおり「蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日」
 * (44c030d6-8683-4c99-84eb-96159b2ce14b)
 *
 * 企画運営の指摘: 座標の使い回しは不可(湯女石に高湯通りの点、うつぼ沼・目玉沼に
 * 片貝沼の点を使っていた)。OSMで探し直したが、湯女石・うつぼ沼・目玉沼はいずれも
 * OSMに点が見つからなかったため、手引きの例外どおり、OSMに点のある別の実在の
 * 行き先に差し替えた。
 *
 * Day1: 湯女石(記念碑群)を削除し、代わりに蔵王地蔵尊(地蔵山頂、OSM Nominatimで
 * 座標確認: tourism=attraction「蔵王地蔵尊」)を、蔵王ロープウェイの直後(同じ
 * 山頂エリア)に追加。高湯通り→酢川温泉神社は元の直行(徒歩8分)に戻した。
 * 法務の指摘(湯女石の心中を思わせる書き方)は、この差し替えにより解消。
 *
 * Day2: うつぼ沼・目玉沼を削除し、代わりに蔵王中央高原駅(蔵王スカイケーブル
 * 山頂駅、OSM Nominatimで座標確認)を追加。出典(直接開いたURL):
 * https://zaochuoropeway.co.jp/jp/summer/guide.php (延長1636m・高低差342m・
 * 所要8分)、https://zaochuoropeway.co.jp/jp/summer/spot.php (蔵王大権現:
 * 「農耕をはじめ諸産業の頼もしい水の神として慕われ」)。
 * あわせて、鳥兜山展望台の座標も蔵王中央ロープウェイの点を使い回していたため、
 * OSMで見つかった実際の「鳥兜駅」の点に修正。
 *
 * 決まり2: これによりDay2の終了も16:30〜17:00の窓内になるよう調整(滞在は
 * 延ばさず、実在の行き先の追加のみで対応)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-292g-44c030d6.ts
 * (実行済み。蔵王地蔵尊の有無で確認するため、再実行しても安全)
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

  if (day1.spots.some((s) => s.name === "蔵王地蔵尊")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  // === Day1 ===
  const okama = day1.spots.find((s) => s.name === "蔵王のお釜")!;
  const kattamine = day1.spots.find((s) => s.name === "刈田嶺神社")!;
  const zaoRopeway = day1.spots.find((s) => s.name === "蔵王ロープウェイ")!;
  const takayu = day1.spots.find((s) => s.name === "高湯通り")!;
  const suzukawa = day1.spots.find((s) => s.name === "酢川温泉神社")!;
  const shimoyu = day1.spots.find((s) => s.name === "下湯共同浴場")!;
  const yumeishi = day1.spots.find((s) => s.name === "湯女石(記念碑群)");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: okama.id, data: {} },
        { id: kattamine.id, data: {} },
        { id: zaoRopeway.id, data: {} },
        {
          create: {
            name: "蔵王地蔵尊",
            address: "山形市蔵王温泉(地蔵山頂)",
            lat: 38.1549074,
            lng: 140.4323885,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 38)),
            stayDurationMin: 25,
            memo:
              "蔵王地蔵尊は、地蔵山頂駅からほど近くに立つ、大きな石の地蔵尊です。もとは麓に安置されていましたが、大正時代に山頂に移されたと伝えられています。長い間、厳しい冬の風雪にさらされながらも山頂に立ち続け、蔵王を訪れる人々を見守ってきました。雪の重みで倒れそうになった際には、地元の人々の手で幾度も立て直されてきたといいます。静かに手を合わせましょう。",
          },
        },
        { id: takayu.id, data: {} },
        {
          id: suzukawa.id,
          data: {
            transitMode: "walk",
            transitDurationMin: 8,
            memo: suzukawa.memo!.replace(
              "湯女石(記念碑群)からは歩いて5分ほどです(229段の石段が続きます)。",
              "高湯通りからは歩いて8分ほどです(229段の石段が続きます)。"
            ),
          },
        },
        { id: shimoyu.id, data: {} },
      ],
      { tx, remove: yumeishi ? [yumeishi.id] : [] }
    );

    // === Day2 ===
    const onsen = day2.spots.find((s) => s.name === "蔵王温泉大露天風呂")!;
    const chuoRopeway = day2.spots.find((s) => s.name === "蔵王中央ロープウェイ")!;
    const tenbodai = day2.spots.find((s) => s.name === "鳥兜山展望台")!;
    const dokko = day2.spots.find((s) => s.name === "どっこ沼")!;
    const katakai = day2.spots.find((s) => s.name === "片貝沼")!;
    const kyodo = day2.spots.find((s) => s.name === "上湯・川原湯共同浴場")!;
    const utsubo = day2.spots.find((s) => s.name === "うつぼ沼・目玉沼");

    await setDaySpotOrder(
      day2.id,
      [
        { id: onsen.id, data: {} },
        { id: chuoRopeway.id, data: {} },
        {
          id: tenbodai.id,
          data: {
            // 蔵王中央ロープウェイの座標を使い回していたため、実際の「鳥兜駅」の点(OSM)に修正
            lat: 38.1657779,
            lng: 140.4152159,
          },
        },
        { id: dokko.id, data: {} },
        { id: katakai.id, data: {} },
        {
          create: {
            name: "蔵王中央高原駅",
            address: "山形市蔵王温泉",
            lat: 38.1708265,
            lng: 140.4160065,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 59)),
            stayDurationMin: 40,
            transitMode: "other",
            transitDurationMin: 20,
            memo:
              "片貝沼からは、リフトと徒歩をあわせて20分ほどです。蔵王中央高原駅は、蔵王温泉街の上の台駅と結ぶ蔵王スカイケーブルの山頂側の駅です。延長およそ1636m、高低差およそ342mを、8分ほどかけて結んでいます。駅前には、農業や産業の守り神として親しまれてきた蔵王大権現が祀られています。蔵王温泉街や、晴れた日には月山・朝日連峰の山並みを見渡すことができます。",
          },
        },
        {
          id: kyodo.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 49)),
            transitMode: "other",
            transitDurationMin: 10,
            memo: kyodo.memo!.replace(
              "うつぼ沼・目玉沼からは、リフトと徒歩をあわせて25分ほどです。",
              "蔵王中央高原駅からは、スカイケーブルで山麓へ下って10分ほどです。"
            ),
          },
        },
      ],
      { tx, remove: utsubo ? [utsubo.id] : [] }
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
