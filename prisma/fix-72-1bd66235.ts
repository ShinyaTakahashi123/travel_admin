/**
 * #72(浦富海岸、山陰のリアス海岸を遊覧船で巡る1泊2日、1bd66235)の初日を、
 * docs/content/itinerary-rules.md(10/29仕様)に合わせて組み直す。最終日
 * (Day2)は09:00開始・8か所・16:57終了で、1泊2日の決まり(16:30-17:00・
 * 4か所以上)にすでに合うため時刻は変更しない(言葉づかい・座標のみ直す)。
 *
 * 【Day1(初日、11時ごろ〜・3か所以上・16:30〜17:00）】
 * 直す前は09:00開始・9か所、16:31終了(終了は決まりの範囲内)。開始を
 * 11:02に遅らせた分、ほかのスポットの滞在をバランスよく短くした
 * (移動時間は変えていない。山陰松島遊覧は実際の遊覧船の乗船時間なので
 * 滞在は変えていない)。1か所目に入口の一文(鳥取駅に10時30分ごろ着→
 * 駅の近くでレンタカーを借りて〔手続きに15分ほど〕→車で約17分。
 * OSRM実測15.7km/約17分。10:30+15分+17分=11:02)を追加(法務の指摘で、
 * レンタカー手続きの時間を分けて明記)。
 *
 * 【実在が確かめられず外したスポット】旧岩井学校舎(法務・企画運営の指摘)
 * OSM(岩井温泉のまわり100m)・文化遺産オンライン・岩美町や鳥取県の公式の
 * 観光案内のどこにも、この建物の記録が見つからなかった。座標も隣の
 * 岩井ゆかむり温泉(OSM node9976620325)と小数点以下6けたまで完全に同じ
 * 値になっていた。メモにあった「鳥取県内現存最古級の擬洋風建築」という
 * 記述も出典が見つからず、ほかの都道府県の「旧岩科学校」などと混ざった
 * おそれがある。確かめられた事実がないため、温泉側のメモにも事実は加えず
 * 外した。岩井廃寺塔跡→岩井ゆかむり温泉の移動は、直接の区間(OSRM実測
 * 833m/車で約2分)に直した。
 *
 * 【法務の指摘で直した時間の配分】外して浮いた23分を、いったん岩井ゆかむり
 * 温泉の滞在(40→63分)に全部回したが、もとの滞在(45分)を超えており決まりA
 * (滞在を延ばさない)に反するとの指摘を受けた。昼食(田後港)が13:30を
 * 過ぎない範囲で、今回短くした4か所に、もとの滞在までの範囲で戻した:
 * 田後港50→55分(もと75)・渚交流館37→45分(もと45、上限)・岩井廃寺塔跡
 * 15→20分(もと20、上限)・岩井ゆかむり温泉を63→45分(もと45、上限)に戻す。
 * (+5+8+5+5=23分、移動時間5・10・2分は無変更)
 *
 * 新しい時刻(Day1、11:02〜16:30、8か所): 浦富海岸11:02(50)→
 * 山陰松島遊覧11:57(50、乗船時間のため無変更)→鴨ヶ磯12:55(10)→
 * 城原海岸13:10(15)→田後港13:28(55、昼食)→渚交流館14:28(45)→
 * 岩井廃寺塔跡15:23(20)→岩井ゆかむり温泉15:45(45)
 *
 * 【言葉づかい(しおり全体を確認)】
 * 「〜てみてください」がDay1に5か所・Day2に5か所、「おすすめです」が
 * Day2に1か所、ガイド口調の「ください」(祈りの一文以外)がDay1の
 * 岩井ゆかむり温泉とDay2最後の鳥取民藝美術館の結びにあったため、すべて
 * 「〜しましょう」などの決まりの言い方に直した。
 * 岩井ゆかむり温泉では、効き目をうたう言い方(「疲れをゆっくりとほぐし
 * ましょう」)を削除し、入浴の安全の一文(ほかの入浴客を撮らない・長湯を
 * 避ける・水分をとる)を追加、宿の一文を「この夜は、〇〇の宿に泊まり
 * ましょう。」の形に、休館日の一文も営業時間を書かない形に直した。
 * 鳥取民藝美術館(旅の最後)の結びも、決まりの帰りの一文の形に直した。
 *
 * 【座標(7章、けたの少ない点の確認)】
 * 全17か所を確認し、Day2の5か所(鳥取砂丘・砂の美術館・白兎神社・
 * 鳥取城跡・仁風閣)が緯度・経度とも4けた以下だった。すべてOSMで確かめ、
 * 実在の場所と一致(砂の美術館はミュージアムの点、ほかは精度のみ上げる)
 * ことを確認し、座標を直した。
 * - 鳥取砂丘: Nominatim way55954342 35.5412997/134.2277259
 * - 砂の美術館: OSM node1420969865(tourism=museum) 35.5399654/134.2377849
 * - 白兎神社・白兎海岸: Nominatim way663796832 35.5241947/134.1147560
 * - 鳥取城跡: OSM node6098406250(historic=castle) 35.5100121/134.2411743
 * - 仁風閣: OSM node6166900797(tourism=museum) 35.5071732/134.2375138
 * また、岩井ゆかむり温泉の座標をOSM node9976620325(amenity=public_bath)
 * 35.5555423/134.3622349に精度を上げた。
 * 【要確認・今回は見送り】旧岩井学校舎の座標(35.555542/134.362235)は、
 * 隣の岩井ゆかむり温泉と小数点以下6けたまで完全に同じ値になっている。
 * OSMに旧岩井学校舎(旧岩井小学校)の点が見つからず、地理院地図でも住所を
 * 確認できなかったため、今回は座標を直さず、企画運営・法務に確認を
 * お願いする(チェックリストのメモに記載)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-72-1bd66235.ts
 *   反映: npm run prod -- npx tsx prisma/fix-72-1bd66235.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "02ae506e-4f82-465b-895f-31ae07b187eb";

const URADOME_ID = "4983ae59-3725-443b-9ac0-a3b21f8240a6"; // 浦富海岸
const CRUISE_ID = "da0ea19d-5ccf-4224-a871-bb429ca664b4"; // 山陰松島遊覧
const KAMOGAISO_ID = "b87e5154-f2d2-4eb3-b13a-9a618cc3fbd6"; // 鴨ヶ磯
const SHIROHARA_ID = "95e07ea9-9dfd-4fa7-a69e-44f398c7c8d3"; // 城原海岸
const TAJIRI_ID = "5d33c763-0b98-4616-8c8f-9db69cbc3cbb"; // 浦富海岸 田後港
const NAGISA_ID = "2a658dad-ae3b-4e1e-879c-ebfd3d75d06f"; // 岩美町立渚交流館
const IWAI_HAIJI_ID = "fdf4e393-eda5-4ae1-9913-5da06a703afa"; // 岩井廃寺塔跡
const IWAI_GAKKO_ID = "1b93e755-c494-4c95-8cb3-c323fe11d865"; // 旧岩井学校舎
const IWAI_ONSEN_ID = "c0d6958b-c01c-4793-9dc8-bb5b754b41ba"; // 岩井ゆかむり温泉

const SAKYU_ID = "f9cb3c08-035b-4d66-a604-494ff75efb31"; // 鳥取砂丘(Day2)
const SAND_MUSEUM_ID = "d69ea4cb-634d-41a8-b0e9-a6d78b45310d"; // 砂の美術館(Day2)
const HAKUTO_ID = "caf86db0-19ba-4bc5-9cf9-7788eedffaaa"; // 白兎神社・白兎海岸(Day2)
const CASTLE_ID = "0df911db-2114-4dea-ba67-5f28ea46b096"; // 鳥取城跡(Day2)
const MUSEUM_ID = "d1de6450-5420-4b58-9d94-49d385a5b4bd"; // 鳥取県立博物館(Day2)
const JINPUKAKU_ID = "e56afb0a-9c39-472d-a230-10fbdb006604"; // 仁風閣(Day2)
const WARABE_ID = "f70aca8e-8129-4206-959f-b16841141512"; // わらべ館(Day2)
const MINGEI_ID = "3ce74284-b894-4d6a-ab04-eaf0cd8b6a77"; // 鳥取民藝美術館(Day2)

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const URADOME_FIND = "山陰海岸国立公園を代表する景勝地、浦富海岸に着きます。";
const URADOME_REPLACE =
  "この旅は車でめぐります。鳥取駅に10時30分ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で約17分の浦富海岸へ。山陰海岸国立公園を代表する景勝地です。";

const CRUISE_FIND = "海上からの浦富海岸の迫力を楽しんでください。";
const CRUISE_REPLACE = "海上からの浦富海岸の迫力を楽しみましょう。";

const KAMOGAISO_FIND = "波の音を聞きながらゆっくりと眺めてみてください。";
const KAMOGAISO_REPLACE = "波の音を聞きながらゆっくりと眺めましょう。";

const SHIROHARA_FIND = "透明度の高い海を眺めてみてください。";
const SHIROHARA_REPLACE = "透明度の高い海を眺めましょう。";

const TAJIRI_FIND = "にぎやかな漁港の活気と、静かな漁村の暮らしぶりを、ゆっくりと味わってみてください。";
const TAJIRI_REPLACE = "にぎやかな漁港の活気と、静かな漁村の暮らしぶりを、ゆっくりと味わいましょう。";

const NAGISA_FIND = "浦富海岸の成り立ちや生き物について、展示を通して学んでみてください。";
const NAGISA_REPLACE = "浦富海岸の成り立ちや生き物について、展示を通して学びましょう。";

const IWAI_HAIJI_FIND1 = "静かに、敬意をもって見学し、この土地の古い歴史に思いをはせてみてください。";
const IWAI_HAIJI_REPLACE1 = "静かに、敬意をもって見学し、この土地の古い歴史に思いをはせましょう。";
const IWAI_HAIJI_FIND2 = "この後は、車でおよそ2分、旧岩井学校舎へ向かいましょう。";
const IWAI_HAIJI_REPLACE2 = "この後は、車でおよそ2分、岩井ゆかむり温泉へ向かいましょう。";

const IWAI_ONSEN_FIND1 = "旧岩井学校舎から歩いてすぐ、岩井ゆかむり温泉に着きます。";
const IWAI_ONSEN_REPLACE1 = "岩井廃寺塔跡から車で約2分、岩井ゆかむり温泉に着きます。";
const IWAI_ONSEN_FIND2 =
  "浴室では撮影しないようにしましょう。山陰最古級の湯につかりながら、今日一日の疲れをゆっくりとほぐしましょう。今夜は岩井温泉の宿でゆっくり休みましょう。訪れる前に、公式サイトで営業時間や休館日を確かめてください。";
const IWAI_ONSEN_REPLACE2 = "ほかの入浴客を撮らず、長湯を避けて、こまめに水分をとりましょう。休みの日は公式の案内で確かめましょう。この夜は、岩井温泉の宿に泊まりましょう。";

const SAKYU_FIND = "風と時間がつくり上げた、雄大な砂の造形をゆっくりと味わってみてください。";
const SAKYU_REPLACE = "風と時間がつくり上げた、雄大な砂の造形をゆっくりと味わいましょう。";

const SAND_MUSEUM_FIND = "一年ごとに姿を変える、儚くも壮大な砂の芸術を楽しんでみてください。";
const SAND_MUSEUM_REPLACE = "一年ごとに姿を変える、儚くも壮大な砂の芸術を楽しみましょう。";

const CASTLE_FIND = "緑に囲まれた久松公園として整備された城跡を、歴史に思いをはせながら散策してみてください。";
const CASTLE_REPLACE = "緑に囲まれた久松公園として整備された城跡を、歴史に思いをはせながら散策しましょう。";

const MUSEUM_FIND = "今日一日でめぐってきた土地の成り立ちを、あらためて振り返ってみるのもおすすめです。";
const MUSEUM_REPLACE = "今日一日でめぐってきた土地の成り立ちを、あらためて振り返りましょう。";

const JINPUKAKU_FIND = "鳥取城跡の緑を借景にしたこの洋館を、ゆっくりと味わってみてください。";
const JINPUKAKU_REPLACE = "鳥取城跡の緑を借景にしたこの洋館を、ゆっくりと味わいましょう。";

const WARABE_FIND = "童心にかえって、昔懐かしいおもちゃや音色を楽しんでみてください。";
const WARABE_REPLACE = "童心にかえって、昔懐かしいおもちゃや音色を楽しみましょう。";

const MINGEI_FIND1 = "実用の中に美を見いだす民藝の心にふれながら、鳥取の手仕事の奥深さを感じてみてください。";
const MINGEI_REPLACE1 = "実用の中に美を見いだす民藝の心にふれながら、鳥取の手仕事の奥深さを感じましょう。";
const MINGEI_FIND2 = "お帰りは、歩いておよそ3分のJR鳥取駅からご利用ください。";
const MINGEI_REPLACE2 = "帰りは、歩いておよそ3分のJR鳥取駅から帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [
    uradome, cruise, kamogaiso, shirohara, tajiri, nagisa, iwaiHaiji, iwaiGakko, iwaiOnsen,
    sakyu, sandMuseum, hakuto, castle, museum, jinpukaku, warabe, mingei,
  ] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: URADOME_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CRUISE_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KAMOGAISO_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHIROHARA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TAJIRI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NAGISA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IWAI_HAIJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IWAI_GAKKO_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IWAI_ONSEN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SAKYU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SAND_MUSEUM_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HAKUTO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CASTLE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MUSEUM_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: JINPUKAKU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: WARABE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MINGEI_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["浦富海岸", uradome, URADOME_FIND],
    ["山陰松島遊覧", cruise, CRUISE_FIND],
    ["鴨ヶ磯", kamogaiso, KAMOGAISO_FIND],
    ["城原海岸", shirohara, SHIROHARA_FIND],
    ["田後港", tajiri, TAJIRI_FIND],
    ["渚交流館", nagisa, NAGISA_FIND],
    ["岩井廃寺塔跡(1)", iwaiHaiji, IWAI_HAIJI_FIND1],
    ["岩井廃寺塔跡(2)", iwaiHaiji, IWAI_HAIJI_FIND2],
    ["岩井ゆかむり温泉(1)", iwaiOnsen, IWAI_ONSEN_FIND1],
    ["岩井ゆかむり温泉(2)", iwaiOnsen, IWAI_ONSEN_FIND2],
    ["鳥取砂丘", sakyu, SAKYU_FIND],
    ["砂の美術館", sandMuseum, SAND_MUSEUM_FIND],
    ["鳥取城跡", castle, CASTLE_FIND],
    ["鳥取県立博物館", museum, MUSEUM_FIND],
    ["仁風閣", jinpukaku, JINPUKAKU_FIND],
    ["わらべ館", warabe, WARABE_FIND],
    ["鳥取民藝美術館(1)", mingei, MINGEI_FIND1],
    ["鳥取民藝美術館(2)", mingei, MINGEI_FIND2],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newUradomeMemo = uradome.memo!.replace(URADOME_FIND, URADOME_REPLACE);
  const newCruiseMemo = cruise.memo!.replace(CRUISE_FIND, CRUISE_REPLACE);
  const newKamogaisoMemo = kamogaiso.memo!.replace(KAMOGAISO_FIND, KAMOGAISO_REPLACE);
  const newShiroharaMemo = shirohara.memo!.replace(SHIROHARA_FIND, SHIROHARA_REPLACE);
  const newTajiriMemo = tajiri.memo!.replace(TAJIRI_FIND, TAJIRI_REPLACE);
  const newNagisaMemo = nagisa.memo!.replace(NAGISA_FIND, NAGISA_REPLACE);
  const newIwaiHaijiMemo = iwaiHaiji.memo!.replace(IWAI_HAIJI_FIND1, IWAI_HAIJI_REPLACE1).replace(IWAI_HAIJI_FIND2, IWAI_HAIJI_REPLACE2);
  const newIwaiOnsenMemo = iwaiOnsen.memo!.replace(IWAI_ONSEN_FIND1, IWAI_ONSEN_REPLACE1).replace(IWAI_ONSEN_FIND2, IWAI_ONSEN_REPLACE2);

  const newSakyuMemo = sakyu.memo!.replace(SAKYU_FIND, SAKYU_REPLACE);
  const newSandMuseumMemo = sandMuseum.memo!.replace(SAND_MUSEUM_FIND, SAND_MUSEUM_REPLACE);
  const newCastleMemo = castle.memo!.replace(CASTLE_FIND, CASTLE_REPLACE);
  const newMuseumMemo = museum.memo!.replace(MUSEUM_FIND, MUSEUM_REPLACE);
  const newJinpukakuMemo = jinpukaku.memo!.replace(JINPUKAKU_FIND, JINPUKAKU_REPLACE);
  const newWarabeMemo = warabe.memo!.replace(WARABE_FIND, WARABE_REPLACE);
  const newMingeiMemo = mingei.memo!.replace(MINGEI_FIND1, MINGEI_REPLACE1).replace(MINGEI_FIND2, MINGEI_REPLACE2);

  console.log("=== #72 Day1(初日)直す前→直した後 ===\n");
  console.log(`[1] 浦富海岸 (id=${uradome.id})  新visitTime: 11:02  新stay: 50`);
  console.log("  新memo:", newUradomeMemo);
  console.log(`[2] 山陰松島遊覧 (id=${cruise.id}) 新visitTime: 11:57  新stay: 50(無変更、乗船時間)`);
  console.log("  新memo:", newCruiseMemo);
  console.log(`[3] 鴨ヶ磯 (id=${kamogaiso.id})  新visitTime: 12:55  新stay: 10`);
  console.log("  新memo:", newKamogaisoMemo);
  console.log(`[4] 城原海岸 (id=${shirohara.id})  新visitTime: 13:10  新stay: 15`);
  console.log("  新memo:", newShiroharaMemo);
  console.log(`[5] 田後港 (id=${tajiri.id})  新visitTime: 13:28  新stay: 55(もと75、昼食)`);
  console.log("  新memo:", newTajiriMemo);
  console.log(`[6] 渚交流館 (id=${nagisa.id})  新visitTime: 14:28  新stay: 45(もと45、上限)`);
  console.log("  新memo:", newNagisaMemo);
  console.log(`[7] 岩井廃寺塔跡 (id=${iwaiHaiji.id})  新visitTime: 15:23  新stay: 20(もと20、上限)`);
  console.log("  新memo:", newIwaiHaijiMemo);
  console.log(`[削除] 旧岩井学校舎 (id=${iwaiGakko.id}) — 実在が確かめられないため外す`);
  console.log(`[8] 岩井ゆかむり温泉 (id=${iwaiOnsen.id})  新visitTime: 15:45  新stay: 45(もと45、上限、〜16:30)  新座標: 35.5555423/134.3622349`);
  console.log("  新memo:", newIwaiOnsenMemo);
  console.log(
    "\nDay1 新しい時刻: 浦富海岸11:02(50)→山陰松島遊覧11:57(50)→鴨ヶ磯12:55(10)→城原海岸13:10(15)→田後港13:28(55、昼食)→渚交流館14:28(45)→岩井廃寺塔跡15:23(20)→岩井ゆかむり温泉15:45(45、〜16:30)"
  );
  console.log("\nDay2(最終日)は09:00開始・8か所・16:57終了で決まりに合うため時刻は変更しない(言葉づかい・座標のみ)。");

  console.log("\n=== Day2 言葉づかい・座標の直し ===");
  console.log(`[鳥取砂丘] (id=${sakyu.id})  新座標: 35.5412997/134.2277259`);
  console.log("  新memo:", newSakyuMemo);
  console.log(`[砂の美術館] (id=${sandMuseum.id})  新座標: 35.5399654/134.2377849`);
  console.log("  新memo:", newSandMuseumMemo);
  console.log(`[白兎神社・白兎海岸] (id=${hakuto.id}) — 本文無修正  新座標: 35.5241947/134.1147560`);
  console.log(`[鳥取城跡] (id=${castle.id})  新座標: 35.5100121/134.2411743`);
  console.log("  新memo:", newCastleMemo);
  console.log(`[鳥取県立博物館] (id=${museum.id}) — 座標無修正`);
  console.log("  新memo:", newMuseumMemo);
  console.log(`[仁風閣] (id=${jinpukaku.id})  新座標: 35.5071732/134.2375138`);
  console.log("  新memo:", newJinpukakuMemo);
  console.log(`[わらべ館] (id=${warabe.id}) — 座標無修正`);
  console.log("  新memo:", newWarabeMemo);
  console.log(`[鳥取民藝美術館] (id=${mingei.id}) — 座標無修正`);
  console.log("  新memo:", newMingeiMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: uradome.id, data: { visitTime: T(11, 2), stayDurationMin: 50, memo: newUradomeMemo } },
    { id: cruise.id, data: { visitTime: T(11, 57), memo: newCruiseMemo } },
    { id: kamogaiso.id, data: { visitTime: T(12, 55), stayDurationMin: 10, memo: newKamogaisoMemo } },
    { id: shirohara.id, data: { visitTime: T(13, 10), stayDurationMin: 15, memo: newShiroharaMemo } },
    { id: tajiri.id, data: { visitTime: T(13, 28), stayDurationMin: 55, memo: newTajiriMemo } },
    { id: nagisa.id, data: { visitTime: T(14, 28), stayDurationMin: 45, memo: newNagisaMemo } },
    { id: iwaiHaiji.id, data: { visitTime: T(15, 23), stayDurationMin: 20, memo: newIwaiHaijiMemo } },
    { id: iwaiOnsen.id, data: { visitTime: T(15, 45), stayDurationMin: 45, memo: newIwaiOnsenMemo, lat: 35.5555423, lng: 134.3622349 } },
  ], { remove: [IWAI_GAKKO_ID] });

  await prisma.spot.update({ where: { id: SAKYU_ID }, data: { memo: newSakyuMemo, lat: 35.5412997, lng: 134.2277259 } });
  await prisma.spot.update({ where: { id: SAND_MUSEUM_ID }, data: { memo: newSandMuseumMemo, lat: 35.5399654, lng: 134.2377849 } });
  await prisma.spot.update({ where: { id: HAKUTO_ID }, data: { lat: 35.5241947, lng: 134.1147560 } });
  await prisma.spot.update({ where: { id: CASTLE_ID }, data: { memo: newCastleMemo, lat: 35.5100121, lng: 134.2411743 } });
  await prisma.spot.update({ where: { id: MUSEUM_ID }, data: { memo: newMuseumMemo } });
  await prisma.spot.update({ where: { id: JINPUKAKU_ID }, data: { memo: newJinpukakuMemo, lat: 35.5071732, lng: 134.2375138 } });
  await prisma.spot.update({ where: { id: WARABE_ID }, data: { memo: newWarabeMemo } });
  await prisma.spot.update({ where: { id: MINGEI_ID }, data: { memo: newMingeiMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
