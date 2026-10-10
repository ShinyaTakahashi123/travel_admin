/**
 * #349の続き。fix-349で鵜戸神宮の結びだけ直し、書き出し「皆様、本日ご案内
 * するのは鵜戸神宮です」(禁止語+もう先頭スポットではないのに前のスポット
 * への言及がない)を直し忘れていた。サンメッセ日南からのつなぎに直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-349b-af30d135.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "af30d135-b7e7-4a4e-b6f1-dec242afcdb9";

async function main() {
  const udo = await prisma.spot.findFirstOrThrow({ where: { name: "鵜戸神宮", day: { itineraryId: ITIN_ID } } });

  const old =
    "皆様、本日ご案内するのは鵜戸神宮です。太平洋の荒波が刻んだ断崖の洞窟の中に、朱塗りの本殿が埋め込まれるように建つ、全国でも珍しい神社です。";
  const next =
    "サンメッセ日南からは、車でおよそ8分です。鵜戸神宮は、太平洋の荒波が刻んだ断崖の洞窟の中に、朱塗りの本殿が埋め込まれるように建つ、全国でも珍しい神社です。";

  if (!udo.memo?.includes(old)) {
    if (udo.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: udo.id }, { memo: udo.memo.replace(old, next) });
  console.log("udo opener fixed");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
