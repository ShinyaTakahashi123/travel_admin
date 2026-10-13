/**
 * 承認待ちしおりの見直し・新しい地域の分#23(e8927e1c、石鎚神社と石鎚登山ロープウェイ)。
 * 企画運営の指示(2026-10-13)に沿って、朝のうちに山へ上がり、下りてから市街の
 * 3か所を回る順番に組み直す。
 *
 * 1. 石鎚登山ロープウェイ(既存スポットを改名・時刻短縮。中宮成就社とは分離)
 * 2. 石鎚神社 中宮成就社(新規、参拝のみ)
 * 3. 成就社のあたり（昼食）(新規。成就の集落の食事処エリア、店名は出さない。
 *   下山(山道を歩いて成就駅へ戻り、ロープウェイで下る)の時間も滞在時間に含める)
 * 4. 石鎚神社 口之宮本社(既存、時刻のみ後ろにずらす)
 * 5. 伊曽乃神社(新規。創祀年は資料により137年・158年の幅があるため「伝わる」で
 *   ぼかす。西条まつり最大の祭礼であることを公式・観光情報で確認)
 * 6. 武丈公園(新規。加茂川沿いの桜の名所、無料。#24の西条市考古歴史館とは
 *   同じ福武地区だが中身は別のため使用可と確認済み)
 *
 * ロープウェイの始発・運行時間はishizuchi.com(公式)で確認。成就駅から成就社まで
 * の徒歩時間は複数の観光情報で20〜25分とされており、既存メモの「徒歩のみで約25分」
 * と整合するためそのまま使用。山の天気が崩れやすいという話は、企画運営の指示通り
 * メモには書かない(内部の判断理由のため)。
 */
import { prisma } from "../src/lib/prisma";
import { uploadCommonsFile } from "./lib/commons-photo";

const COMMIT = process.argv.includes("--commit");
const BLOB_PREFIX = "newarea23-ishizuchi";

const ITIN_ID = "e8927e1c-6138-4102-b06f-d041ab191b68";
const DAY_ID = "96854358-7640-49c4-b132-e8fd4476f024";
const HONSHA_SPOT_ID = "d965042c-6d92-4d26-9c80-9e59e2c988cd";
const ROPEWAY_SPOT_ID = "56a4e551-a558-441a-a6e6-ab9da47461d2";
const ROPEWAY_PM_ID = "63e2cc1b-0eb8-4c31-86ca-4f7d4331ad39";

const NEW_DESCRIPTION =
  "ロープウェイで中宮成就社へ上り、西日本最高峰・石鎚山を神とあがめてきた信仰にふれます。下山後は、山麓の石鎚神社 口之宮本社、伊予国一宮格の伊曽乃神社、加茂川沿いの桜の名所・武丈公園をめぐる日帰りプランです。";

const ROPEWAY_MEMO =
  "山麓下谷駅(標高約454m)と山頂成就駅(標高約1,293m)を結ぶ、全長1,815m・高低差839mのロープウェイです。所要時間は約7分30秒で、石鎚山系の景色を楽しめます。運行時間は季節や曜日によって変わることがあるので、お出かけ前に公式サイトで確かめましょう。";

const JOJUSHA_MEMO =
  "山頂成就駅から山道を徒歩で約25分ほど歩くと、石鎚神社の中宮にあたる「成就社」(標高約1,450m)にたどり着きます。鎖場を含む山頂(天狗岳)への本格的な登山道とは分かれており、ここまでは一般的なハイキング道で、鎖場や岩登りはありません。石鎚山の山頂を目指す本格的な登山は、成就社からさらに数時間、鎖を使って登る難所が続くため、この先へ進む場合は登山の装備と経験が必要です。標高約1,450mの成就社は、麓より気温が低く天気も変わりやすいので、上着を持っていきましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const LUNCH_MEMO =
  "成就社の周辺には、宿坊を兼ねた旅館や食事処が集まっています。好みの店で昼食をとりましょう。四季折々の花や野鳥、晴れた日には瀬戸内海まで見渡せる展望も広がります。昼食のあとは、山道を歩いて山頂成就駅へ戻り、ロープウェイで下ります。";

const ISONO_MEMO =
  "天照大神と、国土開発の祖神とされる武国凝別命を祭神とする神社です。成務天皇7年(137)の創祀と伝わり、奈良時代には伊予国第一の大社として朝廷の崇敬も厚かったとされます。毎年10月15日・16日に行われる例大祭「西条まつり」は、だんじりとみこしを合わせて80台あまりが繰り出す、西条地方最大の祭礼として知られています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const BUJO_MEMO =
  "加茂川沿いに広がる、西条市を代表する桜の名所です。八堂山の麓から続く園内には、ソメイヨシノを中心に約100種、1,500本ほどの桜が植えられています。加茂川に架かる伊曽の橋からの眺めは特によいとされ、「四国の嵐山」とも呼ばれています。例年3月下旬から4月上旬ごろが見頃です。";

async function main() {
  const honsha = await prisma.spot.findUnique({ where: { id: HONSHA_SPOT_ID } });
  const ropeway = await prisma.spot.findUnique({ where: { id: ROPEWAY_SPOT_ID } });
  if (!honsha || !ropeway) throw new Error("想定と違います");

  const dupNames = ["石鎚神社 中宮成就社", "成就社のあたり", "伊曽乃神社", "武丈公園"];
  for (const n of dupNames) {
    const dup = await prisma.placeMaster.findFirst({ where: { name: { contains: n } } });
    if (dup) throw new Error("台帳が既に存在します(想定外): " + n);
  }

  console.log("[確認OK] 説明文を直す");
  console.log("[確認OK] ロープウェイと成就社を分離し、朝に山へ上がる順番に組み直す");
  console.log("[確認OK] 成就社のあたり（昼食）・伊曽乃神社・武丈公園を追加して16:30まで延ばす");

  const jojushaPhoto = await uploadCommonsFile(
    "Ishizuchi-jinja Joju-sha 石鎚神社成就社 Apr 21, 2015.jpg",
    "石鎚神社中宮成就社",
    BLOB_PREFIX
  );
  if (!jojushaPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(中宮成就社)");
  console.log("取得:", jojushaPhoto.url, jojushaPhoto.credit);

  const isonoPhoto = await uploadCommonsFile("Isono-jinja haiden.jpg", "伊曽乃神社", BLOB_PREFIX);
  if (!isonoPhoto) throw new Error("画像の取得・ライセンス確認に失敗しました(伊曽乃神社)");
  console.log("取得:", isonoPhoto.url, isonoPhoto.credit);

  if (!COMMIT) return console.log("\n確認モードです。--commit で取得・書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: honsha.placeMasterId! } }))!.prefectureAreaId;

  // 本社をいったん退避(orderNoの衝突を避ける)
  await prisma.spot.update({ where: { id: HONSHA_SPOT_ID }, data: { orderNo: 99 } });

  // 1. 石鎚登山ロープウェイ: 既存スポットを改名、orderNo1、9:30-10:00(30分)
  await prisma.placeMaster.update({ where: { id: ROPEWAY_PM_ID }, data: { name: "石鎚登山ロープウェイ" } });
  await prisma.spot.update({
    where: { id: ROPEWAY_SPOT_ID },
    data: { name: "石鎚登山ロープウェイ", orderNo: 1, memo: ROPEWAY_MEMO, visitTime: new Date(Date.UTC(1970, 0, 1, 9, 30)), stayDurationMin: 30 },
  });

  // 2. 石鎚神社 中宮成就社: orderNo2、ロープウェイ(9:30+30=10:00)から25分の徒歩で10:25着、60分滞在
  const jojushaPlace = await prisma.placeMaster.create({
    data: {
      name: "石鎚神社 中宮成就社", address: "愛媛県西条市西之川", lat: 33.7900456, lng: 133.1290434,
      prefectureAreaId, category: "shrine", isWideArea: false, isMemorial: false,
      photoUrl: jojushaPhoto.url, photoAuthor: jojushaPhoto.credit.author ?? null,
      photoLicense: jojushaPhoto.credit.license ?? null, photoLicenseUrl: jojushaPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: jojushaPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const jojushaSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: jojushaPlace.id, orderNo: 2, name: "石鎚神社 中宮成就社",
      address: "愛媛県西条市西之川", lat: 33.7900456, lng: 133.1290434,
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 25)), memo: JOJUSHA_MEMO, stayDurationMin: 60,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: jojushaSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 25 } });
  await prisma.photo.create({
    data: {
      spotId: jojushaSpot.id, url: jojushaPhoto.url, caption: "石鎚神社 中宮成就社",
      sourceUrl: jojushaPhoto.credit.sourceUrl ?? null, author: jojushaPhoto.credit.author ?? null,
      license: jojushaPhoto.credit.license ?? null, licenseUrl: jojushaPhoto.credit.licenseUrl ?? null,
    },
  });

  // 3. 成就社のあたり（昼食）: orderNo3、成就社(10:25+60=11:25)から5分で11:30着、
  //    85分滞在(昼食45分+下山[成就駅へ徒歩25分+ロープウェイ下り15分]を含む)
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "成就社のあたり", address: "愛媛県西条市西之川", lat: 33.7900456, lng: 133.1290434,
      prefectureAreaId, category: "townscape", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 3, name: "成就社のあたり（昼食）",
      address: "愛媛県西条市西之川", lat: 33.7900456, lng: 133.1290434,
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 30)), memo: LUNCH_MEMO, stayDurationMin: 85,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 5 } });

  // 4. 石鎚神社 口之宮本社: orderNo4、昼食(11:30+85=12:55)から30分(車・山麓への移動)で13:25着
  await prisma.spot.update({
    where: { id: HONSHA_SPOT_ID },
    data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 25)) },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: HONSHA_SPOT_ID, orderNo: 1, transitMode: "car", transitDurationMin: 30 } });

  // 5. 伊曽乃神社: orderNo5、本社(13:25+45=14:10)から10分で14:20着、50分滞在
  const isonoPlace = await prisma.placeMaster.create({
    data: {
      name: "伊曽乃神社", address: "愛媛県西条市中野甲1649", lat: 33.893341, lng: 133.186508,
      prefectureAreaId, category: "shrine", isWideArea: false, isMemorial: false,
      photoUrl: isonoPhoto.url, photoAuthor: isonoPhoto.credit.author ?? null,
      photoLicense: isonoPhoto.credit.license ?? null, photoLicenseUrl: isonoPhoto.credit.licenseUrl ?? null,
      photoSourceUrl: isonoPhoto.credit.sourceUrl ?? null, source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const isonoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: isonoPlace.id, orderNo: 5, name: "伊曽乃神社",
      address: "愛媛県西条市中野甲1649", lat: 33.893341, lng: 133.186508,
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)), memo: ISONO_MEMO, stayDurationMin: 50,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: isonoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 10 } });
  await prisma.photo.create({
    data: {
      spotId: isonoSpot.id, url: isonoPhoto.url, caption: "伊曽乃神社",
      sourceUrl: isonoPhoto.credit.sourceUrl ?? null, author: isonoPhoto.credit.author ?? null,
      license: isonoPhoto.credit.license ?? null, licenseUrl: isonoPhoto.credit.licenseUrl ?? null,
    },
  });

  // 6. 武丈公園: orderNo6、伊曽乃神社(14:20+50=15:10)から5分で15:15着、75分滞在(16:30終了)
  const bujoPlace = await prisma.placeMaster.create({
    data: {
      name: "武丈公園", address: "愛媛県西条市福武甲2128-1", lat: 33.8999965, lng: 133.1915813,
      prefectureAreaId, category: "park", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "osm", verifiedAt: new Date(),
    },
  });
  const bujoSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: bujoPlace.id, orderNo: 6, name: "武丈公園",
      address: "愛媛県西条市福武甲2128-1", lat: 33.8999965, lng: 133.1915813,
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 15)), memo: BUJO_MEMO, stayDurationMin: 75,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: bujoSpot.id, orderNo: 1, transitMode: "car", transitDurationMin: 5 } });

  console.log("  COMMITTED: 新しい地域#23 石鎚神社と石鎚登山ロープウェイ");
}
main().finally(() => prisma.$disconnect());
