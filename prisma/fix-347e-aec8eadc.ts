/**
 * #347の続き。企画運営12:04の気づき(差し戻しではないが次に触るときに直す
 * よう指示)。季節をspring(4月中旬〜6月下旬)のみにしたため、美女平の
 * 「新緑や紅葉の季節には」の「紅葉」(秋)は時期が合わない。「新緑のころ
 * には」に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-347e-aec8eadc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "aec8eadc-75da-4179-8c8c-013bb4b3c01f";

async function main() {
  const bijodaira = await prisma.spot.findFirstOrThrow({ where: { name: "美女平", day: { itineraryId: ITIN_ID } } });

  const old = "新緑や紅葉の季節には、鳥のさえずりに包まれながら森林浴を楽しむこともできます。";
  const next = "新緑のころには、鳥のさえずりに包まれながら森林浴を楽しむこともできます。";

  if (!bijodaira.memo?.includes(old)) {
    if (bijodaira.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: bijodaira.id }, { memo: bijodaira.memo.replace(old, next) });
  console.log("bijodaira: autumn reference removed to match spring-only season");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
