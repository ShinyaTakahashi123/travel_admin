/**
 * #34の直し(企画運営の指摘、2026-10-13)。休暇村周辺180分は時間を埋める滞在と
 * 判断されたため、60〜70分ほどに短縮し、昼食を別スポットに分け、環境省の
 * 大久野島ビジターセンター(公式に準ずる環境省の資料[9:00-16:00、水曜休]で
 * 確認。時刻は本文に書かない)を追加する。南部・中部砲台跡は北部砲台跡と
 * 重ねすぎない判断で見送った。
 *
 * あわせて法務の指摘で、海水浴場に触れる文に安全の一言、島を出る前にフェリーの
 * 便を確かめる一言を追加する。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const DAY_ID = "022147fb-a64b-4afe-bf3e-14f06d1d9a10";
const SHIRYOKAN_SPOT_ID = "d843c422-eaa5-45c8-9e67-9799ea6b45d1";
const HATSUDENSHO_SPOT_ID = "79c4c8d0-2250-4da3-8893-40d34c2f4820";
const KYUKAMURA_SPOT_ID = "8d5ca93b-5849-47b1-8c28-afbbfd4faed8";

const VISITOR_CENTER_MEMO =
  "環境省が設置した、大久野島の自然を紹介する施設です。周辺の海や野鳥、植物など、島を取り巻く瀬戸内海の自然について、展示でわかりやすく学ぶことができます。";

const LUNCH_MEMO = "休暇村大久野島の周辺には、食事ができるお店があります。ここで昼食をとりましょう。";

const USAGI_MEMO =
  "大久野島には、野生化したウサギが多く暮らしています。野生の動物のため、抱き上げたり追いかけたりしないようにしましょう。ふれあいの決まりは変わることもあるので、島に着いたら掲示や公式の案内を確かめ、それに従いましょう。休暇村大久野島の周辺には、キャンプ場や海水浴場もあり、瀬戸内海の自然もゆっくりと楽しめます。海で泳ぐときは、遊泳期間・遊泳区域の中で、監視員がいる時間帯に楽しみましょう。帰りの船の便は限られるので、時刻を先に確かめてから島をあとにしましょう。";

async function main() {
  const shiryokan = await prisma.spot.findUnique({ where: { id: SHIRYOKAN_SPOT_ID } });
  const hatsudensho = await prisma.spot.findUnique({ where: { id: HATSUDENSHO_SPOT_ID } });
  const kyukamura = await prisma.spot.findUnique({ where: { id: KYUKAMURA_SPOT_ID } });
  if (!shiryokan || !hatsudensho || !kyukamura || kyukamura.stayDurationMin !== 180) throw new Error("想定と違います");

  const dup = await prisma.placeMaster.findFirst({ where: { name: "大久野島ビジターセンター" } });
  if (dup) throw new Error("台帳が既に存在します(想定外): 大久野島ビジターセンター");

  console.log("[確認OK] 大久野島ビジターセンターを追加(資料館のすぐ近く)");
  console.log("[確認OK] 休暇村周辺を昼食・うさぎ海辺の散策の2つに分け、合計180分→125分に短縮");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  const prefectureAreaId = (await prisma.placeMaster.findUnique({ where: { id: shiryokan.placeMasterId! } }))!.prefectureAreaId;

  const hatsudenshoLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: HATSUDENSHO_SPOT_ID } });
  const kyukamuraLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: KYUKAMURA_SPOT_ID } });
  if (!hatsudenshoLeg || !kyukamuraLeg) throw new Error("移動データが見つかりません");

  // 発電所跡以降をいったん退避(orderNoの衝突を避ける)
  const laterSpots = await prisma.spot.findMany({ where: { dayId: DAY_ID, orderNo: { gte: hatsudensho.orderNo } }, orderBy: { orderNo: "asc" } });
  for (const s of laterSpots) {
    await prisma.spot.update({ where: { id: s.id }, data: { orderNo: s.orderNo + 90 } });
  }

  // 大久野島ビジターセンター: orderNo3、資料館(10:46+40=11:26)から1分で11:27着、45分滞在
  const vcPlace = await prisma.placeMaster.create({
    data: {
      name: "大久野島ビジターセンター", address: "広島県竹原市忠海町大久野島", lat: 34.305383, lng: 132.994242,
      prefectureAreaId, category: "museum", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const vcSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: vcPlace.id, orderNo: 3, name: "大久野島ビジターセンター",
      address: "広島県竹原市忠海町大久野島", lat: 34.305383, lng: 132.994242,
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 27)), memo: VISITOR_CENTER_MEMO, stayDurationMin: 45,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: vcSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 1 } });

  // 発電所跡: orderNo4、ビジターセンター(11:27+45=12:12)から8分で12:20着、30分滞在(変更なし)
  await prisma.spot.update({ where: { id: HATSUDENSHO_SPOT_ID }, data: { orderNo: 4, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 20)) } });
  await prisma.spotTransitLeg.update({ where: { id: hatsudenshoLeg.id }, data: { transitDurationMin: 8 } });

  // 長浦毒ガス貯蔵庫跡: orderNo5、発電所跡(12:20+30=12:50)から13分で13:03着(変更なし、時刻のみ)
  const nagaura = laterSpots.find((s) => s.name === "長浦毒ガス貯蔵庫跡")!;
  const nagauraLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: nagaura.id } });
  await prisma.spot.update({ where: { id: nagaura.id }, data: { orderNo: 5, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 3)) } });
  await prisma.spotTransitLeg.update({ where: { id: nagauraLeg!.id }, data: { transitDurationMin: 13 } });

  // 北部砲台跡: orderNo6、長浦(13:03+30=13:33)から2分で13:35着、30分滞在(変更なし)
  const hokubu = laterSpots.find((s) => s.name === "北部砲台跡")!;
  const hokubuLeg = await prisma.spotTransitLeg.findFirst({ where: { spotId: hokubu.id } });
  await prisma.spot.update({ where: { id: hokubu.id }, data: { orderNo: 6, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 35)) } });
  await prisma.spotTransitLeg.update({ where: { id: hokubuLeg!.id }, data: { transitDurationMin: 2 } });

  // 休暇村大久野島周辺（昼食）: orderNo7、北部砲台跡(13:35+30=14:05)から11分で14:16着、55分滞在
  const lunchPlace = await prisma.placeMaster.create({
    data: {
      name: "休暇村大久野島周辺（昼食用）", address: "広島県竹原市忠海町大久野島", lat: Number(kyukamura.lat), lng: Number(kyukamura.lng),
      prefectureAreaId, category: "gourmet", isWideArea: false, isMemorial: false,
      source: "ai_collected", positionSource: "gsi", verifiedAt: new Date(),
    },
  });
  const lunchSpot = await prisma.spot.create({
    data: {
      dayId: DAY_ID, placeMasterId: lunchPlace.id, orderNo: 7, name: "休暇村大久野島周辺（昼食）",
      address: "広島県竹原市忠海町大久野島", lat: Number(kyukamura.lat), lng: Number(kyukamura.lng),
      visitTime: new Date(Date.UTC(1970, 0, 1, 14, 16)), memo: LUNCH_MEMO, stayDurationMin: 55,
    },
  });
  await prisma.spotTransitLeg.create({ data: { spotId: lunchSpot.id, orderNo: 1, transitMode: "walk", transitDurationMin: 11 } });

  // 休暇村大久野島周辺（うさぎ・海辺の散策）: orderNo8、昼食(14:16+55=15:11)から3分で15:14着、70分滞在(16:24終了)
  await prisma.spot.update({
    where: { id: KYUKAMURA_SPOT_ID },
    data: { orderNo: 8, name: "休暇村大久野島周辺（うさぎ・海辺の散策）", visitTime: new Date(Date.UTC(1970, 0, 1, 15, 14)), stayDurationMin: 70, memo: USAGI_MEMO },
  });
  await prisma.spotTransitLeg.update({ where: { id: kyukamuraLeg.id }, data: { transitDurationMin: 3 } });

  console.log("  COMMITTED: #34 組み直し完了(10:00〜16:24)");
}
main().finally(() => prisma.$disconnect());
