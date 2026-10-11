/**
 * #134 e0181f83の直し(2回目、自己点検)。
 * fix-134で「獅子岩展望台」に使った座標(34.2796894,132.3197576)は、
 * 実際には弥山山頂のすぐそば(弥山山頂展望台から20mほど)の点で、
 * ロープウエーの終点「獅子岩駅」とは別の場所(獅子岩駅はそこから
 * 西へ約500m、OSMのaerialway=station/「獅子岩」の点34.2795786,
 * 132.3251865)だった。audit の「位置が前とほぼ同じ」で発覚。
 * スポット名・本文・座標を、実際の獅子岩駅(ロープウエー終点)に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const OLD_MEMO =
  "紅葉谷駅から宮島ロープウエーで榧谷駅を経て、およそ14分、山上の獅子岩駅に着きます。駅のすぐそばにある獅子岩展望台からは、瀬戸内海に浮かぶ島々を見渡せます。すぐ近くには、ライオンの姿に見えるとされる巨岩「獅子岩」もあります。ここから弥山山頂までは、さらに徒歩での登山となります。この後は、弥山本堂・霊火堂を経て、歩いておよそ30分、弥山山頂展望台へ向かいましょう。";

const NEW_MEMO =
  "紅葉谷駅から宮島ロープウエーで榧谷駅を経て、およそ14分、山上の終点・獅子岩駅に着きます。駅のすぐそばには、ライオンの姿に見えるとされる巨岩「獅子岩」があります。ここから弥山山頂までは、さらに徒歩での登山となります。この後は、弥山本堂・霊火堂や獅子岩展望台を経て、歩いておよそ30分、弥山山頂展望台へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'e0181f83%'`);
  const itinId = rows[0].id;
  const shishiiwa = await findSpotInItinerary(itinId, { spotName: "獅子岩展望台" });

  if (shishiiwa.memo !== OLD_MEMO) throw new Error("獅子岩展望台の本文が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({
    where: { id: shishiiwa.id },
    data: { name: "獅子岩駅", lat: 34.2795786, lng: 132.3251865, memo: NEW_MEMO },
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
