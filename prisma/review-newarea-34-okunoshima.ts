/**
 * 承認待ちしおりの見直し・新しい地域の分#34(281700ca、大久野島、毒ガスの歴史と
 * 瀬戸内の自然、広島)。法務の事前の注意点(2026-10-13)に沿って進める。
 *
 * 既存4か所(灯台40分・毒ガス資料館40分・発電所跡30分・休暇村周辺120分、
 * 10:00開始[フェリー利用のため])は4か所以上を満たすが14:14終了。
 *
 * 1. 毒ガス資料館: 被害の人数・病気や亡くなり方の細かい様子を削除し、法務の
 *    例文に沿って書き直す。結びは「静かに、敬意をもって見学しましょう」
 * 2. 発電所跡: 「建物には入らず、近づかない」の一言を追加(「廃墟」「探検」
 *    「映える」等の言い方はもともとなし)
 * 3. 休暇村大久野島周辺: エサやりの決まりは公式で確認できなかったため記述を
 *    削除し、「抱き上げない・追いかけない」の一言を追加
 * 4. 新スポット2か所、同じ歴史の場所として同じ配慮で追加:
 *    - 長浦毒ガス貯蔵庫跡(島内最大規模とされる貯蔵庫跡。観光情報サイト複数で
 *      確認)
 *    - 北部砲台跡(明治33年[1900]完成、芸予要塞で最初に着工された砲台と伝わる。
 *      観光情報サイト複数で確認)
 * フェリーの時刻・料金は書かない(既存の説明文で対応済み)。「毒ガス島」
 * 「うさぎ島」は本文中では使っていない(タイトルの括弧書きのみ)ことを確認済み。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "022147fb-a64b-4afe-bf3e-14f06d1d9a10";
const SHIRYOKAN_SPOT_ID = "d843c422-eaa5-45c8-9e67-9799ea6b45d1";
const HATSUDENSHO_SPOT_ID = "79c4c8d0-2250-4da3-8893-40d34c2f4820";
const KYUKAMURA_SPOT_ID = "8d5ca93b-5849-47b1-8c28-afbbfd4faed8";

const SHIRYOKAN_MEMO =
  "昭和2年(1927)、この島は旧陸軍による毒ガス製造の拠点となり、昭和20年(1945)の終戦まで、毒ガスの製造が行われました。当時は国内の地図から島の存在が消されたとされ、長くその実態は伏せられていました。この資料館は、戦争の時代に毒ガスがつくられ、働いた人々に大きな被害が出た歴史を伝えるために、昭和63年(1988)に開館しました。今も歴史を伝える場所ですので、静かに、敬意をもって見学しましょう。";

const HATSUDENSHO_MEMO =
  "毒ガスを製造する電力をまかなうために建てられた発電所の跡です。壁だけが残る姿から、当時の様子をしのぶことができます。老朽化が進んでいるため、建物には入らず、近づかないようにしましょう。柵の外から見学し、現地の案内に従いましょう。";

const NAGAURA_MEMO =
  "島内で最大規模だったとされる、毒ガスの貯蔵庫の跡です。山かげに築かれており、戦後は進駐軍の手で、残っていた毒ガスの処分が行われたと伝わります。老朽化が進んでいるため、建物には入らず、近づかないようにしましょう。今も歴史を伝える場所ですので、静かに見学しましょう。";

const HOKUBU_MEMO =
  "明治33年(1900)に完成した、芸予要塞の砲台跡です。対岸の忠海側の海峡を守るため、芸予要塞の中で最初に工事が始まった砲台と伝わります。老朽化が進んでいるため、建物には入らず、近づかないようにしましょう。";

const KYUKAMURA_MEMO =
  "大久野島には、野生化したウサギが多く暮らしています。野生の動物のため、抱き上げたり追いかけたりしないようにしましょう。ふれあいの決まりは変わることもあるので、島に着いたら掲示や公式の案内を確かめ、それに従いましょう。休暇村大久野島の周辺には、キャンプ場や海水浴場もあり、瀬戸内海の自然もゆっくりと楽しめます。";

async function main() {
  const shiryokan = await prisma.spot.findUnique({ where: { id: SHIRYOKAN_SPOT_ID } });
  const hatsudensho = await prisma.spot.findUnique({ where: { id: HATSUDENSHO_SPOT_ID } });
  const kyukamura = await prisma.spot.findUnique({ where: { id: KYUKAMURA_SPOT_ID } });
  if (!shiryokan || !hatsudensho || !kyukamura) throw new Error("想定と違います");

  console.log("[確認OK] 毒ガス資料館のメモを法務の例文に沿って書き直す");
  console.log("[確認OK] 発電所跡に「近づかない」の一言を追加");
  console.log("[確認OK] 休暇村周辺のエサやり記述を削除し「抱き上げない・追いかけない」を追加");
  console.log("[確認OK] 長浦毒ガス貯蔵庫跡・北部砲台跡を追加");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: shiryokan.placeMasterId! } }))!.prefectureAreaId;

  const kyukamuraLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: KYUKAMURA_SPOT_ID } });
  if (!kyukamuraLeg) throw new Error("移動データが見つかりません");

  await prisma.spot.update({ where: { id: SHIRYOKAN_SPOT_ID }, data: { memo: SHIRYOKAN_MEMO } });
  await prisma.spot.update({ where: { id: HATSUDENSHO_SPOT_ID }, data: { memo: HATSUDENSHO_MEMO } });

  // 休暇村周辺をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: KYUKAMURA_SPOT_ID }, data: { orderNo: 93 } });

  // 長浦毒ガス貯蔵庫跡: orderNo4、発電所跡(11:34+30=12:04)から13分で12:17着、30分滞在
  const nagauraPlace = await prisma.placeMaster.create({
    data: {
      name: "長浦毒ガス貯蔵庫跡", address: "広島県竹原市忠海町大久野島", lat: 34.3130641, lng: 132.9900921,
      prefectureAreaId, category: "landmark", isWideArea: false, isMemorial: true,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const nagauraSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: nagauraPlace.id, orderNo: 4, name: "長浦毒ガス貯蔵庫跡",
      address: "広島県竹原市忠海町大久野島", lat: 34.3130641, lng: 132.9900921,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 17)), memo: NAGAURA_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: nagauraSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 13 } });

  // 北部砲台跡: orderNo5、長浦(12:17+30=12:47)から2分で12:49着、30分滞在
  const hokubuPlace = await prisma.placeMaster.create({
    data: {
      name: "北部砲台跡", address: "広島県竹原市忠海町大久野島", lat: 34.3134485, lng: 132.9912080,
      prefectureAreaId, category: "landmark", isWideArea: false, isMemorial: true,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const hokubuSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: hokubuPlace.id, orderNo: 5, name: "北部砲台跡",
      address: "広島県竹原市忠海町大久野島", lat: 34.3134485, lng: 132.9912080,
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 49)), memo: HOKUBU_MEMO, stayDurationMin: 30,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: hokubuSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 2 } });

  // 休暇村大久野島周辺: orderNo6、北部砲台跡(12:49+30=13:19)から11分で13:30着、180分滞在(16:30終了)
  await prisma.spot.update({
    where: { id: KYUKAMURA_SPOT_ID },
    data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 30)), stayDurationMin: 180, memo: KYUKAMURA_MEMO },
  });
  await prisma.spotTransitLeg.update({ where: { id: kyukamuraLeg.id }, data: { transitDurationMin: 11 } });

  console.log("  COMMITTED: #34 大久野島(10:00〜16:30)");
}
main().finally(() => prisma.$disconnect());
