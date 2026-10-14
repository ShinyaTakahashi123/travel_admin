/**
 * お遍路 本4(#11、34番〜39番に拡大、3日)。#12(38〜39番)の内容を#11に
 * 移し、#12自体は手を付けずに残す。#11自身は編集してよい(企画運営承認済み)。
 *
 * 【新しいスポットの座標の出どころ】企画運営が確認したOSM id
 * - 帷子崎展望所: OSM node 3957029814 (33.4157401, 133.4255331)
 * - 道の駅かわうその里すさき: OSM way 442742906 (33.387603, 133.27477)
 * - 道の駅なかとさ: OSM way 1168510071 (33.322319, 133.234813)
 * - 四万十川学遊館: OSM way 549286487 (32.989482, 132.915251)
 * - 四万十市立郷土資料館: OSM node 1423731922 (32.9969402, 132.930622)
 * - 道の駅めじかの里土佐清水: OSM way 441711916 (32.793666, 132.883385)
 * - 足摺宇和海国立公園竜串ビジターセンターうみのわ: OSM way 966116947 (32.791113, 132.863128)
 * - 道の駅すくも: OSM way 441713656 (32.9160503, 132.7127885)
 * (佐田沈下橋は一斗俵沈下橋と同種のため使わない)
 *
 * 移動時間はOSRM実測の切り上げ。
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book4.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book4.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const BOOK11_ID = "fcd98df3-e32a-46d9-b84b-c9020f53ec42";
const DAY1_ID = "6b70fb71-9b55-457a-803f-2d5043ab4172";
const DAY2_ID = "f0fb7689-0891-45f3-b6b6-7c8e66ebc07d";

const KATSURAHAMA_ID = "59b26b8c-31e7-4b3f-8e2d-f12971f2f70e";
const TANEMAJI_ID = "c6014e73-32b2-46b2-8057-42c3b1063133";
const KIYOTAKIJI_ID = "a555341e-a605-4d2e-8a0e-d02a515b5f1b";
const SHORYUJI_ID = "8fd11d0c-3461-4449-a871-3059022dfeda";
const KUREICHIBA_ID = "d50514bc-f30f-4909-a4bf-6ada6ef12cda";
const IWAMOTOJI_ID = "15549989-3ac0-4e45-a336-6935228647da";
const ITTOHYO_ID = "91c4f658-2094-4960-96d2-96aa4ee7ac41";

const KONGOFUKUJI_ID = "55eab58b-cc26-42fb-ae4b-d0fea6ba58f9";
const ASHIZURI_TODAI_ID = "f22745fa-e270-4395-aad5-adbbd1141336";
const HAKUSAN_ID = "9c2bfbba-e163-4d69-abda-a891320c2b10";
const MANJIRO_ID = "ca71aa3c-a53c-4fd6-ad90-dfecbb2a9579";
const ENKOJI_ID = "a0f96af0-7b90-44d2-bc32-5e7edc4eb9e8";
const KANYOJIMA_ID = "308169a9-e3e9-4935-82f9-942fdea4c002";
const ODODAN_ID = "d263181f-3686-4296-8b81-3757f9b99771";

const OLD_TITLE = "【四国八十八か所 5】土佐・34番種間寺〜37番岩本寺";
const NEW_TITLE = "【四国八十八か所 4】土佐・34番種間寺〜39番延光寺";
const NEW_DESC =
  "四国霊場の第34番から第39番まで、安産の祈りが伝わる種間寺から、四万十川の清流、四国最南端の足摺岬、宿毛湾の絶景まで、土佐の西部を広くめぐる、車遍路の区切り打ち2泊3日です。四国八十八ヶ所は、弘法大師（空海）ゆかりの88の霊場をめぐる、四国遍路とも呼ばれる巡礼です。1番から順に回る「順打ち」、88番から逆に回る「逆打ち」のどちらでも構いません。納経所（本堂・大師堂のお参りのあと、納経帳などに朱印をいただく場所）の受付時間は、寺院ごとに異なり、変わることもあるので、お出かけ前に各寺院の公式の案内で確かめましょう。納経帳の朱印は、お参りの証としていただくものです。朱印や納経帳の売り買いはやめましょう。白衣や金剛杖などのお遍路装束は必須ではなく、普段の服装でもお参りできます。このしおりは、四国八十八ヶ所霊場会の公式の案内ではありません。";

const SHORYUJI_MEMO_NO_LODGING =
  "大同元年(806)、唐からの帰国を前にした弘法大師が、恩師・恵果阿闍梨が住した長安の青龍寺への感謝を込め、密教を広めるにふさわしい地を求めて独鈷杵を東の空へ投げたところ、のちに四国を巡っていた大師がこの地の松の木にかかっているのを見つけ、恩師の寺と同じ名を付けて開いたと伝えられます。本尊の波切不動明王は、大師自身が刻んだと伝わる絶対秘仏です。仁王門から本堂までは170段の石段が続き、モンゴル出身の元横綱・朝青龍が高校時代にこの石段で鍛えたことが、四股名の由来の一つになったとも伝えられています。宇佐大橋を渡った先の岬にあり、サーフィンで知られる宇佐の海を望みます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const KUREICHIBA_MEMO_WITH_LODGING =
  "明治時代、漁師の妻たちがトロ箱ひとつで小魚を売り始めたのが起こりと伝わる、100年以上の歴史を持つ市場です。「かつおの国」中土佐町ならではの一本釣りのかつおをはじめ、地魚や乾物、惣菜などを商う20軒ほどの店が、アーケード街に軒を連ねています。昼までの市場で、店によって営業の時間や休みの日が違うので、訪れる前に公式の案内で確かめましょう。食べ歩きも楽しめます。この日は、このあたりの宿に泊まりましょう。";

const MANJIRO_MEMO_NO_LODGING =
  "足摺岬近くの中浜(現在の土佐清水市中浜)の漁師の子として生まれたジョン万次郎(中浜万次郎)の生涯を紹介する資料館です。万次郎は14歳のとき、漁の途中で遭難し、アメリカの捕鯨船に救助されました。その後アメリカで英語や航海術、造船技術などを学び、鎖国下の日本へ帰国したのちは、幕末の志士たちに欧米の知識を伝える役割を果たしました。館内には、万次郎ゆかりの品や、捕鯨・航海に関する資料が展示されています。近くには太平洋を見つめる万次郎の銅像も立っています。";

const ASHIZURI_TODAI_MEMO_WITH_LODGING =
  "大正3年(1914)に初点灯した白亜の灯台で、太平洋を270度にわたって見渡せます。老朽化により昭和35年(1960)に改築され、太平洋戦争末期には米軍機による機銃掃射を受けた記録も残っています。灯台からは全長約2kmの遊歩道が整備され、弘法大師にまつわる「足摺七不思議」の言い伝えが残る奇岩をたどりながら、足摺岬の東側にある展望地「天狗の鼻」まで歩くことができます。あたり一帯にはヤブツバキが群生し、2月下旬から3月上旬には赤い花が咲きそろいます。岬は四国最南端として親しまれていますが、地図の上での最南端は少し西に離れた「長碆」という岩場だとされています。遊歩道の足もとは岩場で滑りやすいところもあるので、気をつけて歩きましょう。この日は、このあたりの宿に泊まりましょう。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: BOOK11_ID } });
  const kureichiba = await prisma.spot.findUnique({ where: { id: KUREICHIBA_ID } });
  const hakusan = await prisma.spot.findUnique({ where: { id: HAKUSAN_ID } });
  if (!itin || (itin.title !== OLD_TITLE && itin.title !== NEW_TITLE)) throw new Error("想定と違います(itin)");
  if (!kureichiba || !hakusan) throw new Error("想定と違います(spot)");
  const alreadyMoved = kureichiba.dayId === DAY1_ID;

  console.log("[確認OK] 本4: 34〜39番・3日に組み替え");
  console.log(alreadyMoved ? "  (前回の途中まで実行済みの可能性: 久礼市場は既に日1)" : "  (未実行)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (itin.title !== NEW_TITLE) {
    await prisma.itinerary.update({ where: { id: BOOK11_ID }, data: { title: NEW_TITLE, description: NEW_DESC, nights: 2 } });
  }

  // --- 日1: 帷子崎展望所・かわうその里すさき・なかとさを追加、久礼市場を移動 ---
  await prisma.spot.update({ where: { id: SHORYUJI_ID }, data: { memo: SHORYUJI_MEMO_NO_LODGING } });

  const kataNode = await prisma.placeMaster.create({
    data: { name: "帷子崎展望所", address: "高知県須崎市", lat: 33.4157401, lng: 133.4255331, category: "view", source: "ai_collected", positionSource: "nominatim" },
  });
  const kataSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: kataNode.id, orderNo: 5, name: "帷子崎展望所",
      address: kataNode.address, lat: kataNode.lat, lng: kataNode.lng,
      memo: "須崎市にある、横波黒潮ラインの途中の展望地です。浦ノ内湾と太平洋を見渡せます。",
      visitTime: t(12, 53), stayDurationMin: 15,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kataSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 8 } });

  const kawausoPlace = await prisma.placeMaster.create({
    data: { name: "道の駅かわうその里すさき", address: "高知県須崎市", lat: 33.387603, lng: 133.27477, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const kawausoSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: kawausoPlace.id, orderNo: 6, name: "道の駅かわうその里すさき（昼食）",
      address: kawausoPlace.address, lat: kawausoPlace.lat, lng: kawausoPlace.lng,
      memo: "須崎市にある道の駅です。地元の農産物直売所や食事処があります。ここで昼食をとりましょう。",
      visitTime: t(13, 27), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kawausoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 19 } });

  const nakatosaPlace = await prisma.placeMaster.create({
    data: { name: "道の駅なかとさ", address: "高知県高岡郡中土佐町", lat: 33.322319, lng: 133.234813, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const nakatosaSpot = await prisma.spot.create({
    data: {
      dayId: DAY1_ID, placeMasterId: nakatosaPlace.id, orderNo: 7, name: "道の駅なかとさ",
      address: nakatosaPlace.address, lat: nakatosaPlace.lat, lng: nakatosaPlace.lng,
      memo: "中土佐町にある道の駅です。地元の特産品や海産物が並びます。",
      visitTime: t(14, 37), stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: nakatosaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: KUREICHIBA_ID } });
  await prisma.spot.update({
    where: { id: KUREICHIBA_ID },
    data: { dayId: DAY1_ID, orderNo: 8, visitTime: t(15, 10), stayDurationMin: 80, memo: KUREICHIBA_MEMO_WITH_LODGING },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: KUREICHIBA_ID, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });

  // --- 日2: 37,一斗俵を残し、学遊館・郷土資料館・めじかの里・うみのわを追加、38・足摺岬灯台を移動 ---
  await prisma.spotTransitLeg.deleteMany({ where: { spotId: IWAMOTOJI_ID } });
  await prisma.spot.update({ where: { id: IWAMOTOJI_ID }, data: { orderNo: 1, visitTime: t(9, 0), stayDurationMin: 40 } });
  await prisma.spot.update({ where: { id: ITTOHYO_ID }, data: { orderNo: 2, visitTime: t(10, 0), stayDurationMin: 25 } });

  const gakuyukanPlace = await prisma.placeMaster.create({
    data: { name: "四万十川学遊館", address: "高知県四万十市", lat: 32.989482, lng: 132.915251, category: "museum", source: "ai_collected", positionSource: "nominatim" },
  });
  const gakuyukanSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: gakuyukanPlace.id, orderNo: 3, name: "四万十川学遊館",
      address: gakuyukanPlace.address, lat: gakuyukanPlace.lat, lng: gakuyukanPlace.lng,
      memo: "四万十市にある、四万十川の自然や暮らしを紹介する施設です。",
      visitTime: t(11, 23), stayDurationMin: 35,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: gakuyukanSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 58 } });

  const kyodoPlace = await prisma.placeMaster.create({
    data: { name: "四万十市立郷土資料館", address: "高知県四万十市", lat: 32.9969402, lng: 132.930622, category: "museum", source: "ai_collected", positionSource: "nominatim" },
  });
  const kyodoSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: kyodoPlace.id, orderNo: 4, name: "四万十市立郷土資料館",
      address: kyodoPlace.address, lat: kyodoPlace.lat, lng: kyodoPlace.lng,
      memo: "四万十市の歴史や民俗資料を紹介する資料館です。",
      visitTime: t(12, 4), stayDurationMin: 20,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kyodoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 6 } });

  const mejikaPlace = await prisma.placeMaster.create({
    data: { name: "道の駅めじかの里土佐清水", address: "高知県土佐清水市", lat: 32.793666, lng: 132.883385, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const mejikaSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: mejikaPlace.id, orderNo: 5, name: "道の駅めじかの里土佐清水（昼食）",
      address: mejikaPlace.address, lat: mejikaPlace.lat, lng: mejikaPlace.lng,
      memo: "土佐清水市にある道の駅です。地元の食事処や売店があります。ここで昼食をとりましょう。",
      visitTime: t(12, 58), stayDurationMin: 34,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: mejikaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 34 } });

  const uminowaPlace = await prisma.placeMaster.create({
    data: { name: "足摺宇和海国立公園竜串ビジターセンターうみのわ", address: "高知県土佐清水市", lat: 32.791113, lng: 132.863128, category: "museum", source: "ai_collected", positionSource: "nominatim" },
  });
  const uminowaSpot = await prisma.spot.create({
    data: {
      dayId: DAY2_ID, placeMasterId: uminowaPlace.id, orderNo: 6, name: "足摺宇和海国立公園竜串ビジターセンターうみのわ",
      address: uminowaPlace.address, lat: uminowaPlace.lat, lng: uminowaPlace.lng,
      memo: "足摺宇和海国立公園・竜串にあるビジターセンターです。海中の生き物や竜串の景観を紹介しています。",
      visitTime: t(13, 34), stayDurationMin: 20,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: uminowaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 2 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: KONGOFUKUJI_ID } });
  await prisma.spot.update({ where: { id: KONGOFUKUJI_ID }, data: { dayId: DAY2_ID, orderNo: 7, visitTime: t(14, 15), stayDurationMin: 60 } });
  await prisma.spotTransitLeg.create({ data: { spotId: KONGOFUKUJI_ID, orderNo: 1, transitMode: "car", transitDurationMin: 21 } });

  await prisma.spot.update({
    where: { id: ASHIZURI_TODAI_ID },
    data: { dayId: DAY2_ID, orderNo: 8, visitTime: t(15, 25), stayDurationMin: 65, memo: ASHIZURI_TODAI_MEMO_WITH_LODGING },
  });
  // 足摺岬灯台の脚(38→灯台、徒歩10分)は既存のまま有効(ペアは変わらず)

  // --- 日3(新規): 白山洞門→ジョン万次郎資料館→39延光寺→すくも(昼食)→咸陽島→大堂海岸 ---
  const day3 = await prisma.day.create({ data: { itineraryId: BOOK11_ID, dayNumber: 3 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: HAKUSAN_ID } });
  await prisma.spot.update({ where: { id: HAKUSAN_ID }, data: { dayId: day3.id, orderNo: 1, visitTime: t(9, 0) } });

  await prisma.spot.update({ where: { id: MANJIRO_ID }, data: { dayId: day3.id, orderNo: 2, visitTime: t(9, 40), stayDurationMin: 71, memo: MANJIRO_MEMO_NO_LODGING } });
  // ジョン万次郎資料館の脚(白山洞門→資料館、15分)は既存のまま有効

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: ENKOJI_ID } });
  await prisma.spot.update({ where: { id: ENKOJI_ID }, data: { dayId: day3.id, orderNo: 3, visitTime: t(11, 30) } });
  await prisma.spotTransitLeg.create({ data: { spotId: ENKOJI_ID, orderNo: 1, transitMode: "car", transitDurationMin: 39 } });

  const sukumoPlace = await prisma.placeMaster.create({
    data: { name: "道の駅すくも", address: "高知県宿毛市", lat: 32.9160503, lng: 132.7127885, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const sukumoSpot = await prisma.spot.create({
    data: {
      dayId: day3.id, placeMasterId: sukumoPlace.id, orderNo: 4, name: "道の駅すくも（昼食）",
      address: sukumoPlace.address, lat: sukumoPlace.lat, lng: sukumoPlace.lng,
      memo: "宿毛市にある道の駅です。地元の食事処や売店があります。ここで昼食をとりましょう。",
      visitTime: t(13, 10), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sukumoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: KANYOJIMA_ID } });
  await prisma.spot.update({ where: { id: KANYOJIMA_ID }, data: { dayId: day3.id, orderNo: 5, visitTime: t(14, 19) } });
  await prisma.spotTransitLeg.create({ data: { spotId: KANYOJIMA_ID, orderNo: 1, transitMode: "car", transitDurationMin: 9 } });

  await prisma.spot.update({ where: { id: ODODAN_ID }, data: { dayId: day3.id, orderNo: 6, visitTime: t(15, 34) } });
  // 大堂海岸の脚(咸陽島→大堂海岸、25分)は既存のまま有効

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
