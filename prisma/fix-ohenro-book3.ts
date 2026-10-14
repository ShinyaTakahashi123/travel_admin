/**
 * お遍路 本3(#10、22番〜33番に拡大、3日)。#9(22〜26番)の内容をコピーして
 * 本3に組み込み、#9自体は手を付けずに残す(企画運営の承認済み方針)。
 * #10自身の27〜33番は、本3の中で日をまたいで並べ直す。
 *
 * 【新しいスポットの座標の出どころ】企画運営から伝えられたOSM id、またはOSM
 * Nominatim/直接APIで確認した名前のある地物
 * - 室戸世界ジオパークセンター: 台帳に既存(id 16eea5fb、OSM由来、33.245761,134.176551)
 * - むろと廃校水族館: OSM way 1063469545 (33.325807, 134.195031)
 * - 御田八幡宮(吉良川の町並み): OSM way 1203436381 (33.331696, 134.100581)
 * - 道の駅キラメッセ室戸: OSM way 442740599 (33.3070321, 134.1100705)
 * - 伊尾木洞: OSM node 757367868 (33.4912988, 133.9333095)
 * - 野良時計: OSM node 5099519321 (33.5157497, 133.9117008、個人所有のため外から眺める)
 *
 * 【移動時間】OSRM実測を切り上げ。26→27番は実測30.3分(見込みの80分では
 * 足りなかった)
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-ohenro-book3.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-ohenro-book3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const BOOK10_ID = "ba669bf2-10a6-4994-8360-a83c633e88e8";
const OLD_DAY1_ID = "6990046b-7435-4ba1-a117-19287942651f"; // 27,28,29,30(今の#10day1)
const DAY3_ID = "6a716cec-90e8-4f00-ada6-72a2bc78cc79"; // 31,牧野,32,33(今の#10day2→新day3)

const SHINPOJI_ID = "733625f1-9ec6-4572-9090-ede6f45b675a"; // 27神峯寺
const DAINICHIJI_ID = "8713f03f-f4ce-484d-a26c-6577d81c8fcb"; // 28
const KOKUBUNJI_ID = "a8e7a5ba-c6a9-4cb1-abbf-1e98a4102437"; // 29
const ZENRAKUJI_ID = "03cf4881-a9c0-4a12-98e7-8b7043576312"; // 30

const OLD_TITLE = "【四国八十八か所 4】土佐・27番神峯寺〜33番雪蹊寺";
const NEW_TITLE = "【四国八十八か所 4】土佐・22番平等寺〜33番雪蹊寺";
const NEW_DESC =
  "四国霊場の第22番から第33番まで、阿波(徳島県)から土佐(高知県)へと県境を越え、弘法大師が悟りを得たと伝わる室戸岬の霊場から、土佐の海と山に抱かれた高知市周辺までをめぐる、車遍路の区切り打ち2泊3日です。四国八十八ヶ所は、弘法大師（空海）ゆかりの88の霊場をめぐる、四国遍路とも呼ばれる巡礼です。1番から順に回る「順打ち」、88番から逆に回る「逆打ち」のどちらでも構いません。納経所（本堂・大師堂のお参りのあと、納経帳などに朱印をいただく場所）の受付時間は、寺院ごとに異なり、変わることもあるので、お出かけ前に各寺院の公式の案内で確かめましょう。納経帳の朱印は、お参りの証としていただくものです。朱印や納経帳の売り買いはやめましょう。白衣や金剛杖などのお遍路装束は必須ではなく、普段の服装でもお参りできます。このしおりは、四国八十八ヶ所霊場会の公式の案内ではありません。";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  // #9(そのまま残す)から複製する元データを読み取り専用で取得
  const d9day1 = await prisma.day.findUnique({
    where: { id: "3c75a4bd-bcc5-47f9-a9cd-b41a78af9221" },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  const d9day2 = await prisma.day.findUnique({
    where: { id: "8d8cb10c-dba2-44d0-b0ea-c7dc4fe42401" },
    include: { spots: { orderBy: { orderNo: "asc" } } },
  });
  if (!d9day1 || !d9day2 || d9day1.spots.length !== 4 || d9day2.spots.length !== 3) {
    throw new Error("想定と違います(#9のデータ)");
  }
  const [s22, s23, s24, sOkuno] = d9day1.spots;
  const [sMuroto, s25, s26] = d9day2.spots;

  const book10 = await prisma.itinerary.findUnique({ where: { id: BOOK10_ID } });
  const titleOk = book10 && (book10.title === OLD_TITLE || book10.title === NEW_TITLE);
  if (!book10 || !titleOk) throw new Error("想定と違います(#10)");
  const oldDay1Still = await prisma.day.findUnique({ where: { id: OLD_DAY1_ID } });
  if (!oldDay1Still) throw new Error("想定と違います(古い日1が既にありません。やり直しの可能性)");

  console.log("[確認OK] #9(22〜26番)は複製のみで、#9自体は変更しない");
  console.log("[確認OK] #10を22〜33番・3日に組み替え、題・説明文を書きかえる");
  console.log(`  複製元: ${s22.name},${s23.name},${s24.name},${sOkuno.name} / ${sMuroto.name},${s25.name},${s26.name}`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  if (book10.title !== NEW_TITLE) {
    await prisma.itinerary.update({ where: { id: BOOK10_ID }, data: { title: NEW_TITLE, description: NEW_DESC, nights: 2 } });
  }

  // 既存の日1・日2を、新しい日1・日2を作る前に退避(dayNumberの一意制約を避ける)
  await prisma.day.update({ where: { id: OLD_DAY1_ID }, data: { dayNumber: 91 } });
  await prisma.day.update({ where: { id: DAY3_ID }, data: { dayNumber: 92 } });

  // --- 新しい日1 ---
  const newDay1 = await prisma.day.create({ data: { itineraryId: BOOK10_ID, dayNumber: 1 } });

  await prisma.spot.create({
    data: {
      dayId: newDay1.id, placeMasterId: s22.placeMasterId, orderNo: 1, name: s22.name, address: s22.address,
      lat: s22.lat, lng: s22.lng, memo: s22.memo, visitTime: t(9, 0), stayDurationMin: s22.stayDurationMin,
    },
  });
  const sp23 = await prisma.spot.create({
    data: {
      dayId: newDay1.id, placeMasterId: s23.placeMasterId, orderNo: 2, name: s23.name, address: s23.address,
      lat: s23.lat, lng: s23.lng, memo: s23.memo, visitTime: t(10, 0), stayDurationMin: s23.stayDurationMin,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sp23.id, orderNo: 1, transitMode: "car", transitDurationMin: 25 } });
  const sp24 = await prisma.spot.create({
    data: {
      dayId: newDay1.id, placeMasterId: s24.placeMasterId, orderNo: 3, name: s24.name, address: s24.address,
      lat: s24.lat, lng: s24.lng, memo: s24.memo, visitTime: t(12, 25), stayDurationMin: s24.stayDurationMin,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sp24.id, orderNo: 1, transitMode: "car", transitDurationMin: 95 } });
  const spOkuno = await prisma.spot.create({
    data: {
      dayId: newDay1.id, placeMasterId: sOkuno.placeMasterId, orderNo: 4, name: sOkuno.name, address: sOkuno.address,
      lat: sOkuno.lat, lng: sOkuno.lng,
      memo: sOkuno.memo!.replace("今夜は室戸市内の宿にご宿泊いただきます。", ""),
      visitTime: t(14, 29), stayDurationMin: sOkuno.stayDurationMin,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: spOkuno.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });
  const geoparkSpot = await prisma.spot.create({
    data: {
      dayId: newDay1.id, placeMasterId: "16eea5fb-ec85-4613-92dd-32ee8cbbfe26", orderNo: 5, name: "室戸世界ジオパークセンター",
      address: "高知県室戸市室戸岬町1810-2", lat: 33.245761, lng: 134.176551,
      memo: "室戸岬にある「室戸ユネスコ世界ジオパーク」のビジターセンターです。室戸岬の大地の成り立ちや、海岸段丘・奇岩などの見どころを、模型やパネルでわかりやすく紹介しています。この日は、このあたりの宿に泊まりましょう。",
      visitTime: t(14, 55), stayDurationMin: 95,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: geoparkSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 1 } });

  // --- 新しい日2 ---
  const newDay2 = await prisma.day.create({ data: { itineraryId: BOOK10_ID, dayNumber: 2 } });

  await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: s25.placeMasterId, orderNo: 1, name: s25.name, address: s25.address,
      lat: s25.lat, lng: s25.lng, memo: s25.memo, visitTime: t(9, 0), stayDurationMin: s25.stayDurationMin,
    },
  });
  const sp26 = await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: s26.placeMasterId, orderNo: 2, name: s26.name, address: s26.address,
      lat: s26.lat, lng: s26.lng, memo: s26.memo, visitTime: t(9, 55), stayDurationMin: s26.stayDurationMin,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: sp26.id, orderNo: 1, transitMode: "car", transitDurationMin: 15 } });

  const murotoPlace = await prisma.placeMaster.create({
    data: { name: "むろと廃校水族館", address: "高知県室戸市室戸岬町533-2", lat: 33.325807, lng: 134.195031, category: "museum", source: "ai_collected", positionSource: "nominatim" },
  });
  const murotoSpot = await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: murotoPlace.id, orderNo: 3, name: "むろと廃校水族館",
      address: murotoPlace.address, lat: murotoPlace.lat, lng: murotoPlace.lng,
      memo: "室戸市の旧室戸市立椎名小学校の校舎を生かした水族館です。2006年に廃校となった校舎を改修し、2018年に開館しました。教室だったスペースや、屋外の25mプールをそのまま生かし、室戸沖の海洋生物を中心に、約50種1000匹以上の魚を飼育・展示しています。プールにはウミガメやサメの姿もあります。",
      visitTime: t(10, 59), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: murotoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 19 } });

  const mitaPlace = await prisma.placeMaster.create({
    data: { name: "御田八幡宮", address: "高知県室戸市吉良川町甲", lat: 33.331696, lng: 134.100581, category: "shrine", source: "ai_collected", positionSource: "nominatim" },
  });
  const mitaSpot = await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: mitaPlace.id, orderNo: 4, name: "御田八幡宮",
      address: mitaPlace.address, lat: mitaPlace.lat, lng: mitaPlace.lng,
      memo: "室戸市吉良川町の鎮守・御田八幡宮です。この一帯には、1997年に国の重要伝統的建造物群保存地区に選定された町並みが残り、土佐漆喰の白壁に水切り瓦を施した、炭の集散地として栄えた時代の建物が今も立ち並びます。参道前には、保存地区の拠点「吉良川まちなみ館」があり、町並みの歴史を紹介しています。あわせて周辺を歩いてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
      visitTime: t(12, 16), stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: mitaSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 17 } });

  const kirameossePlace = await prisma.placeMaster.create({
    data: { name: "道の駅キラメッセ室戸", address: "高知県室戸市元", lat: 33.3070321, lng: 134.1100705, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const kirameseSpot = await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: kirameossePlace.id, orderNo: 5, name: "道の駅キラメッセ室戸・鯨館（昼食）",
      address: kirameossePlace.address, lat: kirameossePlace.lat, lng: kirameossePlace.lng,
      memo: "室戸市にある道の駅です。隣接する「キラメッセ室戸 鯨館」では、室戸の捕鯨の歴史や鯨の生態についての展示を見学できます。レストランもあるので、ここで昼食をとりましょう。",
      visitTime: t(12, 49), stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: kirameseSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 3 } });

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: SHINPOJI_ID } });
  await prisma.spot.update({
    where: { id: SHINPOJI_ID },
    data: { dayId: newDay2.id, orderNo: 6, visitTime: t(14, 20), stayDurationMin: 50 },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: SHINPOJI_ID, orderNo: 1, transitMode: "car", transitDurationMin: 31 } });

  const ioPlace = await prisma.placeMaster.create({
    data: { name: "伊尾木洞", address: "高知県安芸市伊尾木", lat: 33.4912988, lng: 133.9333095, category: "view", source: "ai_collected", positionSource: "nominatim" },
  });
  const ioSpot = await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: ioPlace.id, orderNo: 7, name: "伊尾木洞",
      address: ioPlace.address, lat: ioPlace.lat, lng: ioPlace.lng,
      memo: "安芸市伊尾木にある、波の浸食でできた海食洞です。暖地性のシダ植物が群生する「伊尾木洞シダ群落」として、国の天然記念物に指定されています。洞内には川が流れているので、濡れてもよい靴で歩きましょう。",
      visitTime: t(15, 29), stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: ioSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 19 } });

  const noraPlace = await prisma.placeMaster.create({
    data: { name: "野良時計", address: "高知県安芸市土居", lat: 33.5157497, lng: 133.9117008, category: "other", source: "ai_collected", positionSource: "nominatim" },
  });
  const noraSpot = await prisma.spot.create({
    data: {
      dayId: newDay2.id, placeMasterId: noraPlace.id, orderNo: 8, name: "野良時計",
      address: noraPlace.address, lat: noraPlace.lat, lng: noraPlace.lng,
      memo: "安芸市土居にある、明治20年ごろに地元の地主・畠中源馬が手作りで設置したと伝わる時計台です。国の登録有形文化財に指定されています。個人の住居の敷地内にあるため、中には入らず、道から眺めましょう。",
      visitTime: t(16, 5), stayDurationMin: 25,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: noraSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 6 } });

  // --- 日3(今の#10day2を再利用、28,29,30を移してくる) ---
  await prisma.day.update({ where: { id: DAY3_ID }, data: { dayNumber: 3 } });

  await prisma.spot.update({ where: { id: "f5a71628-1964-4eaa-bdde-e785d291128a" }, data: { orderNo: 94 } }); // 31竹林寺
  await prisma.spot.update({ where: { id: "23262495-c19b-4014-94b9-f20fa3f71946" }, data: { orderNo: 95 } }); // 牧野植物園
  await prisma.spot.update({ where: { id: "87d37385-2a42-4ac8-9787-656af9f66d8e" }, data: { orderNo: 96 } }); // 32禅師峰寺
  await prisma.spot.update({ where: { id: "3d0204ef-1dd0-4912-88ab-88728c025ca1" }, data: { orderNo: 97 } }); // 33雪蹊寺

  await prisma.spotTransitLeg.deleteMany({ where: { spotId: DAINICHIJI_ID } });
  await prisma.spot.update({ where: { id: DAINICHIJI_ID }, data: { dayId: DAY3_ID, orderNo: 1, visitTime: t(9, 0) } });
  await prisma.spot.update({ where: { id: KOKUBUNJI_ID }, data: { dayId: DAY3_ID, orderNo: 2, visitTime: t(9, 55) } });
  await prisma.spot.update({ where: { id: ZENRAKUJI_ID }, data: { dayId: DAY3_ID, orderNo: 3, visitTime: t(11, 5) } });

  const chikurinjiSpot = await prisma.spot.update({
    where: { id: "f5a71628-1964-4eaa-bdde-e785d291128a" },
    data: { orderNo: 4, visitTime: t(11, 54), stayDurationMin: 75 },
  });
  await prisma.spotTransitLeg.updateMany({ where: { spotId: chikurinjiSpot.id }, data: { transitDurationMin: 14 } });

  await prisma.spot.update({
    where: { id: "23262495-c19b-4014-94b9-f20fa3f71946" },
    data: { orderNo: 5, name: "牧野植物園（昼食）", visitTime: t(13, 14), stayDurationMin: 76 },
  });
  await prisma.spot.update({ where: { id: "87d37385-2a42-4ac8-9787-656af9f66d8e" }, data: { orderNo: 6, visitTime: t(14, 50) } });
  await prisma.spot.update({ where: { id: "3d0204ef-1dd0-4912-88ab-88728c025ca1" }, data: { orderNo: 7, visitTime: t(15, 50) } });

  // --- 古い日1を削除 ---
  await prisma.day.delete({ where: { id: OLD_DAY1_ID } });

  console.log("  COMMITTED");
}

main().finally(() => prisma.$disconnect());
