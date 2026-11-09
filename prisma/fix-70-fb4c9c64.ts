/**
 * #70(有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史を学ぶ1泊2日、
 * fb4c9c64)の初日を、docs/content/itinerary-rules.md(10/29仕様)に合わせて
 * 組み直す。最終日(Day2)は09:00開始・7か所・15:42-16:32終了で、1泊2日の
 * 決まり(16:30-17:00・4か所以上)にすでに合うため変更しない。
 *
 * 【Day1(初日、11時ごろ〜・3か所以上・16:30〜17:00）】
 * 直す前は09:00開始・9か所、16:38終了(終了は決まりの範囲内)。見どころ
 * (タイトル・説明文にある有田町歴史民俗資料館)は残し、ほかの8か所も
 * すべて残した(どれも説明文には名前が無いが、すべてやきもの関連の見
 * どころで、削らずに時間を圧縮して収まったため)。開始を11:06に遅らせた
 * 分、各スポットの滞在をバランスよく短くした(移動時間は変えていない)。
 * 1か所目に入口の一文(上有田駅に10時50分ごろ着→歩いて約16分)を追加。
 *
 * 新しい時刻(Day1、11:06〜16:55、9か所): 有田町歴史民俗資料館11:06(50)→
 * 泉山磁石場12:00(20)→陶山神社12:36(30)→トンバイ塀のある裏通り13:11(15)→
 * 有田陶磁美術館13:28(35)→佐賀県立九州陶磁文化館14:23(35)→
 * 武雄温泉楼門15:18(15)→武雄神社15:48(20)→御船山楽園16:19(36)
 *
 * 【言葉づかい(「〜てみてください」「おすすめです」「お泊まりください」を
 * 使わない決まり。しおり全体が対象のため、Day1の全スポットをまとめて
 * 確認・修正した)】
 * - 有田町歴史民俗資料館「学んでみてください。」→「学びましょう。」
 * - 泉山磁石場「確かめてみてください。」→「確かめましょう。」
 * - トンバイ塀「歩いてみてください。」→「歩きましょう。」
 * - 有田陶磁美術館「感じてみてください。」→「感じましょう。」、
 *   「お昼をとるのもおすすめです。」→「お昼をとりましょう。」
 * - 佐賀県立九州陶磁文化館「見学してみてください。」→「見学しましょう。」
 * - 武雄温泉楼門「味わってみてください。」→「味わいましょう。」
 * - 御船山楽園「散策してみてください。今夜はこの近くの宿にお泊まり
 *   ください。1日目はここで終わりです。」→「散策しましょう。この夜は、
 *   武雄温泉のあたりの宿に泊まりましょう。」(決まりの宿の一文の形に。
 *   「1日目はここで終わりです」は、旅の最後ではない日の締めの言葉のため削除)
 * Day2は言葉づかいの問題なし(確認済み)。
 *
 * 【座標(7章、けたの少ない点の確認)】
 * Day1・Day2の全座標を確認し、緯度・経度とも4けた以下の点が5つあった。
 * すべてOSMで確かめ、実在の場所と一致(真の位置は変わらず精度のみ上げる)
 * ことを確認した:
 * - 泉山磁石場: Nominatim way174440799 33.1939448/129.9101704
 * - 陶山神社: Nominatim node3755901803 33.1889412/129.8992894
 * - 有田陶磁美術館: Nominatim node3755776811 33.1904701/129.8987623
 * - 伊萬里神社(Day2): Nominatim way958202793「伊万里神社」33.2764428/
 *   129.8819523(境内の社殿そのものの建物にはOSMで名前が付いていないため、
 *   名前のある境内全体の点を使用)
 * - 鍋島藩窯公園(Day2): Nominatim way1219538226 33.2339001/129.8917185
 *
 * 【法務の指摘で直した3点(本物の場所と違っていた点)】
 * ① 有田町歴史民俗資料館: 隣の「有田町出土文化財管理センター」(way174462061)
 *    の上で、資料館から約84m離れていた → node1423805646「有田町歴史民俗
 *    資料館東館」(tourism=museum) 33.195076/129.91104 に直す。
 * ② 伊万里鍋島焼会館(Day2): 大川内山のバス停(node4378744090)の点だった。
 *    会館はOSMに無いため、住所「伊万里市大川内町乙1806」の地理院の番地の
 *    点 33.233318/129.891739 に直す(チェックリストに「OSMになし・地理院の
 *    番地」と記載)。
 * ③ 伊万里・有田焼伝統産業会館(Day2): ②の鍋島焼会館の番地(乙1806)の点に
 *    なっていた(②と③が入れかわった形)。伝統産業会館の住所は大川内町
 *    丙221-2で、OSM node7254755076「伊万里・有田焼伝統産業会館」
 *    (tourism=museum) 33.2362425/129.8921391 に直す。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-70-fb4c9c64.ts
 *   反映: npm run prod -- npx tsx prisma/fix-70-fb4c9c64.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "a9775adb-3c0f-4c78-bce9-1bdda17da7ec";

const SHIRYOKAN_ID = "6e5da1a8-aa7a-4d2f-adfb-94b782c4c565"; // 有田町歴史民俗資料館
const IZUMIYAMA_ID = "973486a2-7a46-4338-a167-3b392f8e0c09"; // 泉山磁石場
const SUEYAMA_ID = "c5d6f32a-ffd1-4d09-928c-0cc344f59695"; // 陶山神社
const TONBAI_ID = "5a2aa44b-fa53-4503-873b-1061948a2772"; // トンバイ塀のある裏通り
const BIJUTSUKAN_ID = "f86a8a34-3737-4d98-b07f-e399828f6cf4"; // 有田陶磁美術館
const KYUSHU_ID = "a52f9940-5b4f-4d0e-84c5-72efa5dc6887"; // 佐賀県立九州陶磁文化館
const ROMON_ID = "fa0bf3d8-f69e-4b5f-98d3-627e699bae7c"; // 武雄温泉楼門
const TAKEO_ID = "4ba26a30-e076-4797-91f9-d6e4bb323b6a"; // 武雄神社
const MIFUNEYAMA_ID = "4b2b9c43-2a15-41bc-a096-4e6abd520564"; // 御船山楽園

const IMARI_SHRINE_ID = "e744d089-834b-4906-83d7-f7698615e57d"; // 伊萬里神社(Day2、座標のみ)
const HANYO_PARK_ID = "e0ab5c7f-a3c3-4384-a724-8e7a58d665e7"; // 鍋島藩窯公園(Day2、座標のみ)
const NABESHIMA_KAIKAN_ID = "a98d9881-f3f0-488c-ab42-3cfc02fd308e"; // 伊万里鍋島焼会館(Day2、座標のみ)
const DENTOSANGYO_ID = "987b1f3d-528f-46b5-8cc0-bd87cdab4a0c"; // 伊万里・有田焼伝統産業会館(Day2、座標のみ)

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHIRYOKAN_GATEWAY = "上有田駅に10時50分ごろ着いたら、歩いて約16分の有田町歴史民俗資料館へ。";
const SHIRYOKAN_FIND = "1日目は、有田町歴史民俗資料館からです。元和2年";
const SHIRYOKAN_REPLACE = `1日目は、有田町歴史民俗資料館からです。${SHIRYOKAN_GATEWAY}元和2年`;
const SHIRYOKAN_FIND2 = "学んでみてください。";
const SHIRYOKAN_REPLACE2 = "学びましょう。";

const IZUMIYAMA_FIND = "確かめてみてください。";
const IZUMIYAMA_REPLACE = "確かめましょう。";

const TONBAI_FIND = "路地をゆっくり歩いてみてください。";
const TONBAI_REPLACE = "路地をゆっくり歩きましょう。";

const BIJUTSUKAN_FIND1 = "感じてみてください。";
const BIJUTSUKAN_REPLACE1 = "感じましょう。";
const BIJUTSUKAN_FIND2 = "お昼をとるのもおすすめです。";
const BIJUTSUKAN_REPLACE2 = "お昼をとりましょう。";

const KYUSHU_FIND = "見学してみてください。";
const KYUSHU_REPLACE = "見学しましょう。";

const ROMON_FIND = "味わってみてください。";
const ROMON_REPLACE = "味わいましょう。";

const MIFUNEYAMA_FIND = "園内をゆっくりと散策してみてください。今夜はこの近くの宿にお泊まりください。1日目はここで終わりです。";
const MIFUNEYAMA_REPLACE = "園内をゆっくりと散策しましょう。この夜は、武雄温泉のあたりの宿に泊まりましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [shiryokan, izumiyama, sueyama, tonbai, bijutsukan, kyushu, romon, takeo, mifuneyama, imariShrine, hanyoPark, nabeshimaKaikan, dentosangyo] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: SHIRYOKAN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IZUMIYAMA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SUEYAMA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TONBAI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: BIJUTSUKAN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KYUSHU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: ROMON_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TAKEO_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MIFUNEYAMA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IMARI_SHRINE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HANYO_PARK_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NABESHIMA_KAIKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: DENTOSANGYO_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["有田町歴史民俗資料館(1)", shiryokan, SHIRYOKAN_FIND],
    ["有田町歴史民俗資料館(2)", shiryokan, SHIRYOKAN_FIND2],
    ["泉山磁石場", izumiyama, IZUMIYAMA_FIND],
    ["トンバイ塀のある裏通り", tonbai, TONBAI_FIND],
    ["有田陶磁美術館(1)", bijutsukan, BIJUTSUKAN_FIND1],
    ["有田陶磁美術館(2)", bijutsukan, BIJUTSUKAN_FIND2],
    ["佐賀県立九州陶磁文化館", kyushu, KYUSHU_FIND],
    ["武雄温泉楼門", romon, ROMON_FIND],
    ["御船山楽園", mifuneyama, MIFUNEYAMA_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newShiryokanMemo = shiryokan.memo!.replace(SHIRYOKAN_FIND, SHIRYOKAN_REPLACE).replace(SHIRYOKAN_FIND2, SHIRYOKAN_REPLACE2);
  const newIzumiyamaMemo = izumiyama.memo!.replace(IZUMIYAMA_FIND, IZUMIYAMA_REPLACE);
  const newTonbaiMemo = tonbai.memo!.replace(TONBAI_FIND, TONBAI_REPLACE);
  const newBijutsukanMemo = bijutsukan.memo!.replace(BIJUTSUKAN_FIND1, BIJUTSUKAN_REPLACE1).replace(BIJUTSUKAN_FIND2, BIJUTSUKAN_REPLACE2);
  const newKyushuMemo = kyushu.memo!.replace(KYUSHU_FIND, KYUSHU_REPLACE);
  const newRomonMemo = romon.memo!.replace(ROMON_FIND, ROMON_REPLACE);
  const newMifuneyamaMemo = mifuneyama.memo!.replace(MIFUNEYAMA_FIND, MIFUNEYAMA_REPLACE);

  console.log("=== #70 Day1(初日)直す前→直した後 ===\n");
  console.log(`[1] 有田町歴史民俗資料館 (id=${shiryokan.id})  新visitTime: 11:06  新stay: 50  新座標: 33.195076/129.91104(旧座標は隣の管理センターの上、法務指摘)`);
  console.log("  新memo:", newShiryokanMemo);
  console.log(`[2] 泉山磁石場 (id=${izumiyama.id})  新visitTime: 12:00  新stay: 20  新座標: 33.1939448/129.9101704`);
  console.log("  新memo:", newIzumiyamaMemo);
  console.log(`[3] 陶山神社 (id=${sueyama.id}) — 本文無修正  新visitTime: 12:36  新stay: 30  新座標: 33.1889412/129.8992894`);
  console.log(`[4] トンバイ塀のある裏通り (id=${tonbai.id})  新visitTime: 13:11  新stay: 15`);
  console.log("  新memo:", newTonbaiMemo);
  console.log(`[5] 有田陶磁美術館 (id=${bijutsukan.id})  新visitTime: 13:28  新stay: 35  新座標: 33.1904701/129.8987623`);
  console.log("  新memo:", newBijutsukanMemo);
  console.log(`[6] 佐賀県立九州陶磁文化館 (id=${kyushu.id})  新visitTime: 14:23  新stay: 35`);
  console.log("  新memo:", newKyushuMemo);
  console.log(`[7] 武雄温泉楼門 (id=${romon.id})  新visitTime: 15:18  新stay: 15(無変更)`);
  console.log("  新memo:", newRomonMemo);
  console.log(`[8] 武雄神社 (id=${takeo.id}) — 本文無修正  新visitTime: 15:48  新stay: 20`);
  console.log(`[9] 御船山楽園 (id=${mifuneyama.id})  新visitTime: 16:19  新stay: 36(〜16:55)`);
  console.log("  新memo:", newMifuneyamaMemo);
  console.log("\nDay1 新しい時刻: 有田町歴史民俗資料館11:06(50)→泉山磁石場12:00(20)→陶山神社12:36(30)→トンバイ塀13:11(15)→有田陶磁美術館13:28(35)→九州陶磁文化館14:23(35)→武雄温泉楼門15:18(15)→武雄神社15:48(20)→御船山楽園16:19(36、〜16:55)");
  console.log("\nDay2(最終日)は09:00開始・7か所・16:32終了で決まりに合うため変更なし。");

  console.log("\n=== 座標の精度上げ(けたの少ない点をOSMの値に) ===");
  console.log(`[Day2] 伊萬里神社 (id=${imariShrine.id})`);
  console.log("  旧lat/lng:", imariShrine.lat, imariShrine.lng, " → 新lat/lng: 33.2764428 / 129.8819523 (OSM Nominatim way958202793「伊万里神社」)");
  console.log(`[Day2] 鍋島藩窯公園 (id=${hanyoPark.id})`);
  console.log("  旧lat/lng:", hanyoPark.lat, hanyoPark.lng, " → 新lat/lng: 33.2339001 / 129.8917185 (OSM Nominatim way1219538226)");
  console.log(`[Day2] 伊万里鍋島焼会館 (id=${nabeshimaKaikan.id}) — 法務指摘(バス停の点だった)`);
  console.log("  旧lat/lng:", nabeshimaKaikan.lat, nabeshimaKaikan.lng, " → 新lat/lng: 33.233318 / 129.891739 (OSMになし・地理院の番地「伊万里市大川内町乙1806」)");
  console.log(`[Day2] 伊万里・有田焼伝統産業会館 (id=${dentosangyo.id}) — 法務指摘(鍋島焼会館の番地の点と入れかわっていた)`);
  console.log("  旧lat/lng:", dentosangyo.lat, dentosangyo.lng, " → 新lat/lng: 33.2362425 / 129.8921391 (OSM node7254755076「伊万里・有田焼伝統産業会館」)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: shiryokan.id, data: { visitTime: T(11, 6), stayDurationMin: 50, memo: newShiryokanMemo, lat: 33.195076, lng: 129.91104 } },
    { id: izumiyama.id, data: { visitTime: T(12, 0), stayDurationMin: 20, memo: newIzumiyamaMemo, lat: 33.1939448, lng: 129.9101704 } },
    { id: sueyama.id, data: { visitTime: T(12, 36), stayDurationMin: 30, lat: 33.1889412, lng: 129.8992894 } },
    { id: tonbai.id, data: { visitTime: T(13, 11), stayDurationMin: 15, memo: newTonbaiMemo } },
    { id: bijutsukan.id, data: { visitTime: T(13, 28), stayDurationMin: 35, memo: newBijutsukanMemo, lat: 33.1904701, lng: 129.8987623 } },
    { id: kyushu.id, data: { visitTime: T(14, 23), stayDurationMin: 35, memo: newKyushuMemo } },
    { id: romon.id, data: { visitTime: T(15, 18), memo: newRomonMemo } },
    { id: takeo.id, data: { visitTime: T(15, 48), stayDurationMin: 20 } },
    { id: mifuneyama.id, data: { visitTime: T(16, 19), stayDurationMin: 36, memo: newMifuneyamaMemo } },
  ]);

  await prisma.spot.update({ where: { id: IMARI_SHRINE_ID }, data: { lat: 33.2764428, lng: 129.8819523 } });
  await prisma.spot.update({ where: { id: HANYO_PARK_ID }, data: { lat: 33.2339001, lng: 129.8917185 } });
  await prisma.spot.update({ where: { id: NABESHIMA_KAIKAN_ID }, data: { lat: 33.233318, lng: 129.891739 } });
  await prisma.spot.update({ where: { id: DENTOSANGYO_ID }, data: { lat: 33.2362425, lng: 129.8921391 } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
