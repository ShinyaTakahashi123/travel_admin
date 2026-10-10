/**
 * #351の続き。企画運営15:28の度分秒・丸めの点検依頼への対応。
 *
 * 霞城公園（山形城跡）の座標(38.2556,140.3281)は、OSMの実POI
 * (way 728946713「霞城公園」、wikidata Q11660827、中心
 * 38.2554928,140.3283821)から約27m離れており、丸め/推定の値と
 * 判断して実POIの座標に修正した。
 *
 * あわせて点検を依頼された次の2件は、OSMの実POIと数m差で
 * ほぼ一致していたため、修正不要と確認した(対応不要):
 * - 山形美術館(38.255869,140.3324) ≒ way 262671458(38.2558875,140.3323997、差約2m)
 * - 安良波公園・アラハビーチ(26.3039,127.758917、#352)
 *   ≒ way 189830739「安良波公園」(26.3039504,127.7589449、差約6m)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-351h-b461a3e0.ts
 */
import { prisma } from "../src/lib/prisma";

const KAJOKOEN_ID = "6c3d9355-885a-4c25-bcd0-e18788de65b9";

async function main() {
  const spot = await prisma.spot.findUniqueOrThrow({ where: { id: KAJOKOEN_ID } });
  if (spot.lat?.toString() === "38.2554928") {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: KAJOKOEN_ID },
    data: { lat: 38.2554928, lng: 140.3283821 },
  });
  console.log("霞城公園（山形城跡）の座標をOSM実POI(way 728946713)に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
