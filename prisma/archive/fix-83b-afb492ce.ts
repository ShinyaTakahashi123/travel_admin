/**
 * #83 afb492ce（角館）法務の指摘: 角館武家屋敷通りに、通り沿いに今も人が暮らす屋敷が
 * あることへの配慮の一文を追加。
 */
import { updateSpotInItinerary, findSpotInItinerary } from "./lib/spot-lookup";
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN = "afb492ce-ab6d-4aeb-9879-5cea0ad0624b";

async function main() {
  const spot = await findSpotInItinerary(ITIN, { spotName: "角館武家屋敷通り" });
  const newMemo = spot.memo!.replace(
    "しだれ桜と黒板塀が織りなす「みちのくの小京都」の町並みを、ゆっくりと歩いて楽しんでください。",
    "今も人が暮らしている屋敷もあるので、公開されていない屋敷には入らず、静かに歩きましょう。しだれ桜と黒板塀が織りなす「みちのくの小京都」の町並みを、ゆっくりと歩いて楽しんでください。"
  );
  console.log("changed:", newMemo !== spot.memo);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITIN, { spotName: "角館武家屋敷通り" }, { memo: newMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
