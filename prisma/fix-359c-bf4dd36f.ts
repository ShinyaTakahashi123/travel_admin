/**
 * #359の続き。法務(記録38bf844)の3点指摘に対応。
 * ①丸亀町商店街の座標が、OSMで美容室1店の点そのものだったため、商店街
 *   way62159669「高松丸亀町商店街」の中心(34.343948,134.050073)に変更。
 * ②屋島寺の座標が、案内板(node11757109024)の点だったため、寺の境内
 *   way422803840「第84番札所 屋島寺」の中心(34.3573806,134.1011537)に変更。
 * ③安全の一文: 四国村(かずら橋は揺れるので綱を握ってゆっくり)、
 *   源平屋島古戦場展望台(崖の上のため手すりの外に出ない・足元に注意)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-359c-bf4dd36f.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bf4dd36f-c4db-4f50-bbd6-c0f763281a15";

async function main() {
  const marugame = await prisma.spot.findFirstOrThrow({ where: { name: "丸亀町商店街で昼食", day: { itineraryId: ITIN_ID } } });
  if (marugame.lat?.toString() === "34.343948") {
    console.log("丸亀町商店街: 既に対応済み");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: marugame.id }, { lat: 34.343948, lng: 134.050073 });
    console.log("丸亀町商店街: 座標を商店街の実点に修正");
  }

  const yashimaji = await prisma.spot.findFirstOrThrow({ where: { name: "屋島寺", day: { itineraryId: ITIN_ID } } });
  if (yashimaji.lat?.toString() === "34.3573806") {
    console.log("屋島寺: 既に対応済み");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: yashimaji.id }, { lat: 34.3573806, lng: 134.1011537 });
    console.log("屋島寺: 座標を境内の実点に修正");
  }

  const shikokumura = await prisma.spot.findFirstOrThrow({ where: { name: "四国村ミウゼアム", day: { itineraryId: ITIN_ID } } });
  const oldMura = "徳島・祖谷のかずら橋を再現した吊り橋も見どころの一つです。";
  const newMura = "徳島・祖谷のかずら橋を再現した吊り橋も見どころの一つですが、歩くとよく揺れるため、綱をしっかり握ってゆっくり渡りましょう。";
  if (shikokumura.memo?.includes(oldMura)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shikokumura.id }, { memo: shikokumura.memo.replace(oldMura, newMura) });
    console.log("四国村ミウゼアム: 安全の一文を追加");
  } else {
    console.log("四国村ミウゼアム: 既に対応済み");
  }

  const tenboudai = await prisma.spot.findFirstOrThrow({ where: { name: "源平屋島古戦場展望台", day: { itineraryId: ITIN_ID } } });
  const oldTenbo = "眼下に広がる瀬戸内海の景色とともに、合戦の歴史に思いを巡らせてみましょう。";
  const newTenbo = "崖の上に位置するため、手すりの外へは出ず、足元に気をつけましょう。眼下に広がる瀬戸内海の景色とともに、合戦の歴史に思いを巡らせてみましょう。";
  if (tenboudai.memo?.includes(oldTenbo)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tenboudai.id }, { memo: tenboudai.memo.replace(oldTenbo, newTenbo) });
    console.log("源平屋島古戦場展望台: 安全の一文を追加");
  } else {
    console.log("源平屋島古戦場展望台: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
