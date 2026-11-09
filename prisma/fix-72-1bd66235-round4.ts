/**
 * #72(浦富海岸、山陰のリアス海岸を遊覧船で巡る1泊2日、1bd66235)の、
 * 企画運営の指示による移動の再測り直しの直し(round4)。
 *
 * 【鳥取城跡の座標が間違っていた(法務の指摘)】鳥取城跡の点(node6098406250、
 * 35.510012,134.241174)は久松山の山頂近くで、メモの内容(「久松公園として
 * 整備された城跡を…散策」、滞在40分)とは合っていなかった(山頂まで登る
 * 時間は滞在に含まれていない)。メモに合わせ、ふもとの「久松公園」
 * (OSM way368529352のNominatim値)35.5074552/134.2383461に直した。
 *
 * 【道のりの再測り直し】docs/content/20261030-transit-recheck-67-73.md
 * に基づき、鳥取砂丘→砂の美術館(walk)を13分→21分に直す。さらに、
 * 鳥取城跡の座標を直したことで、白兎神社・白兎海岸→鳥取城跡(car)が
 * 20分→11分、鳥取城跡→鳥取県立博物館(walk)が8分→6分に短くなった。
 *
 * 移動が短くなった分は、決まりAのとおり滞在に回さず(延ばさず)、もとの
 * 滞在のままにしている。結果として最終日の終了は16:57→16:54と、今より
 * 早くなった(遅くなっていない)。
 *
 * 新しい時刻(Day2、09:00〜16:54、滞在はすべて無変更): 鳥取砂丘09:00(60)→
 * 砂の美術館10:21(60)→白兎神社・白兎海岸11:41(80)→鳥取城跡13:12(40)→
 * 鳥取県立博物館13:58(45)→仁風閣14:46(30)→わらべ館15:24(40)→
 * 鳥取民藝美術館16:19(35)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-72-1bd66235-round4.ts
 *   反映: npm run prod -- npx tsx prisma/fix-72-1bd66235-round4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SAND_MUSEUM_ID = "d69ea4cb-634d-41a8-b0e9-a6d78b45310d";
const HAKUTO_ID = "caf86db0-19ba-4bc5-9cf9-7788eedffaaa";
const CASTLE_ID = "0df911db-2114-4dea-ba67-5f28ea46b096";
const MUSEUM_ID = "d1de6450-5420-4b58-9d94-49d385a5b4bd";
const JINPUKAKU_ID = "e56afb0a-9c39-472d-a230-10fbdb006604";
const WARABE_ID = "f70aca8e-8129-4206-959f-b16841141512";
const MINGEI_ID = "3ce74284-b894-4d6a-ab04-eaf0cd8b6a77";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SAND_MUSEUM_FIND = "鳥取砂丘から歩いておよそ13分、砂の美術館に着きます。";
const SAND_MUSEUM_REPLACE = "鳥取砂丘から歩いておよそ21分、砂の美術館に着きます。";

const CASTLE_FIND = "白兎神社・白兎海岸から車でおよそ20分、鳥取城跡に着きます。";
const CASTLE_REPLACE = "白兎神社・白兎海岸から車でおよそ11分、鳥取城跡に着きます。";
const CASTLE_FIND2 = "この後は、歩いておよそ8分、鳥取県立博物館へ向かいましょう。";
const CASTLE_REPLACE2 = "この後は、歩いておよそ6分、鳥取県立博物館へ向かいましょう。";

const MUSEUM_FIND = "鳥取城跡から歩いておよそ8分、鳥取県立博物館に着きます。";
const MUSEUM_REPLACE = "鳥取城跡から歩いておよそ6分、鳥取県立博物館に着きます。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [sandMuseum, castle, museum] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: SAND_MUSEUM_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CASTLE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MUSEUM_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["砂の美術館", sandMuseum, SAND_MUSEUM_FIND],
    ["鳥取城跡(1)", castle, CASTLE_FIND],
    ["鳥取城跡(2)", castle, CASTLE_FIND2],
    ["鳥取県立博物館", museum, MUSEUM_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newSandMuseumMemo = sandMuseum.memo!.replace(SAND_MUSEUM_FIND, SAND_MUSEUM_REPLACE);
  const newCastleMemo = castle.memo!.replace(CASTLE_FIND, CASTLE_REPLACE).replace(CASTLE_FIND2, CASTLE_REPLACE2);
  const newMuseumMemo = museum.memo!.replace(MUSEUM_FIND, MUSEUM_REPLACE);

  console.log("=== #72 round4: 鳥取城跡の座標の訂正と、Day2移動の直し ===\n");
  console.log(`[鳥取砂丘] 新stay: 60(無変更)`);
  console.log(`[砂の美術館] 新visitTime: 10:21  新stay: 60(無変更)  新leg: walk/21分`);
  console.log("  新memo:", newSandMuseumMemo);
  console.log(`[白兎神社・白兎海岸] 新visitTime: 11:41  新stay: 80(無変更)`);
  console.log(`[鳥取城跡] 新visitTime: 13:12  新stay: 40(無変更)  新座標: 35.5074552/134.2383461(OSM Nominatim way368529352「久松公園」)  新leg: car/11分`);
  console.log("  旧lat/lng:", castle.lat, castle.lng);
  console.log("  新memo:", newCastleMemo);
  console.log(`[鳥取県立博物館] 新visitTime: 13:58  新stay: 45(無変更)  新leg: walk/6分`);
  console.log("  新memo:", newMuseumMemo);
  console.log(`[仁風閣] 新visitTime: 14:46  新stay: 30(無変更)`);
  console.log(`[わらべ館] 新visitTime: 15:24  新stay: 40(無変更)`);
  console.log(`[鳥取民藝美術館] 新visitTime: 16:19  新stay: 35(無変更、〜16:54)`);
  console.log(
    "\nDay2 新しい時刻: 鳥取砂丘09:00(60)→砂の美術館10:21(60)→白兎神社・白兎海岸11:41(80)→鳥取城跡13:12(40)→鳥取県立博物館13:58(45)→仁風閣14:46(30)→わらべ館15:24(40)→鳥取民藝美術館16:19(35、〜16:54)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: SAND_MUSEUM_ID },
    data: {
      visitTime: T(10, 21),
      memo: newSandMuseumMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
    },
  });
  await prisma.spot.update({ where: { id: HAKUTO_ID }, data: { visitTime: T(11, 41) } });
  await prisma.spot.update({
    where: { id: CASTLE_ID },
    data: {
      visitTime: T(13, 12),
      lat: 35.5074552,
      lng: 134.2383461,
      memo: newCastleMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 11 }] },
    },
  });
  await prisma.spot.update({
    where: { id: MUSEUM_ID },
    data: {
      visitTime: T(13, 58),
      memo: newMuseumMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
    },
  });
  await prisma.spot.update({ where: { id: JINPUKAKU_ID }, data: { visitTime: T(14, 46) } });
  await prisma.spot.update({ where: { id: WARABE_ID }, data: { visitTime: T(15, 24) } });
  await prisma.spot.update({ where: { id: MINGEI_ID }, data: { visitTime: T(16, 19) } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
