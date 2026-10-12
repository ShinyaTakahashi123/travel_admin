/**
 * #341の続き。法務10:46の指摘2点に対応。
 * 1) 金剛福寺「本尊の三面千手観世音菩薩は、荒海を鎮める霊験があると
 *    伝えられています」はご利益の言い方のため削除。
 * 2) 見残し海岸のグラスボートに、乗船時の安全の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-341c-9fa55366.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9fa55366-7332-46b6-b356-205c9ed2b7fb";

async function main() {
  const kongofukuji = await prisma.spot.findFirstOrThrow({ where: { name: "金剛福寺", day: { itineraryId: ITIN_ID } } });
  const minokoshi = await prisma.spot.findFirstOrThrow({ where: { name: "見残し海岸", day: { itineraryId: ITIN_ID } } });

  const kongofukujiOld =
    "南国ならではの豊かな自然と信仰の空気を感じることができます。本尊の三面千手観世音菩薩は、荒海を鎮める霊験があると伝えられています。今も多くの遍路が訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。";
  const kongofukujiNext =
    "南国ならではの豊かな自然と信仰の空気を感じることができます。本尊には三面千手観世音菩薩が祀られています。今も多くの遍路が訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。";
  if (!kongofukuji.memo?.includes(kongofukujiOld)) throw new Error("kongofukuji anchor not found");

  const minokoshiOld = "陸路がなく、竜串からグラスボートに乗って海を渡ってたどり着きます。";
  const minokoshiNext =
    "陸路がなく、竜串からグラスボートに乗って海を渡ってたどり着きます。乗船の際は、係員の案内と指示に従い、安全に気をつけましょう。";
  if (!minokoshi.memo?.includes(minokoshiOld)) throw new Error("minokoshi anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: kongofukuji.id }, { memo: kongofukuji.memo.replace(kongofukujiOld, kongofukujiNext) });
  console.log("kongofukuji: 御利益 wording removed");

  await updateSpotInItinerary(ITIN_ID, { spotId: minokoshi.id }, { memo: minokoshi.memo.replace(minokoshiOld, minokoshiNext) });
  console.log("minokoshi: boat safety line added");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
