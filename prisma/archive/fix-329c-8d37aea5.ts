/**
 * #329の続き。法務2026-10-01 03:45の指摘: 水戸市立博物館の結びが
 * 「続いては、車でおよそ18分の笠原水道へ向かいましょう。」のまま
 * だった(fix-329bでcar→busに直した際の見落とし、自己チェック)。
 * 笠原水道の書き出し(バスを乗り継いでおよそ30分)に合わせて修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-329c-8d37aea5.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8d37aea5-fb1e-4b26-b2e7-0be27d21cd0f";

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({ where: { name: "水戸市立博物館", day: { itineraryId: ITIN_ID } } });
  const old = "続いては、車でおよそ18分の笠原水道へ向かいましょう。";
  const next = "続いては、水戸駅方面へ戻ってバスを乗り継ぎ、あわせておよそ30分の笠原水道へ向かいましょう。";
  if (museum.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!museum.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: museum.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
