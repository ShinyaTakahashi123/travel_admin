/**
 * #340の続き。法務10:46・企画運営10:49の指摘対応。
 * 1) 天開稲荷社「九州でも屈指の霊験あらたかな神社として」はご利益の言い方
 *    のため外し、「古くから信仰を集めてきた稲荷社と伝えられています」に。
 * 2) 観世音寺「太宰府でも屈指の古刹です」にヘッジを追加。
 * 3) 光明禅寺の開山年「弘安6年(1283)」は誤り(開山者・鉄牛円心は同じだが、
 *    実際の開山は文永10年(1273)。#493でも文永10年(1273)としており、公式
 *    情報(太宰府市観光情報サイト等)でも文永10年と確認)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-340i-9f58d4de.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9f58d4de-de1f-4ee2-9719-0aeadfc7fd0f";

async function main() {
  const tenkai = await prisma.spot.findFirstOrThrow({ where: { name: "天開稲荷社", day: { itineraryId: ITIN_ID } } });
  const kanzeonji = await prisma.spot.findFirstOrThrow({ where: { name: "観世音寺", day: { itineraryId: ITIN_ID } } });
  const komyozenji = await prisma.spot.findFirstOrThrow({ where: { name: "光明禅寺", day: { itineraryId: ITIN_ID } } });

  const tenkaiOld = "九州でも屈指の霊験あらたかな神社として、古くから信仰を集めてきたと伝えられています。";
  const tenkaiNext = "古くから信仰を集めてきた稲荷社と伝えられています。";
  if (!tenkai.memo?.includes(tenkaiOld)) throw new Error("tenkai anchor not found");

  const kanzeonjiOld = "太宰府でも屈指の古刹です。";
  const kanzeonjiNext = "太宰府でも屈指の古刹とされています。";
  if (!kanzeonji.memo?.includes(kanzeonjiOld)) throw new Error("kanzeonji anchor not found");

  const komyozenjiOld = "鎌倉時代の弘安6年(1283)、鉄牛円心によって開かれた";
  const komyozenjiNext = "鎌倉時代の文永10年(1273)、鉄牛円心によって開かれた";
  if (!komyozenji.memo?.includes(komyozenjiOld)) throw new Error("komyozenji anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: tenkai.id }, { memo: tenkai.memo.replace(tenkaiOld, tenkaiNext) });
  console.log("tenkai: 御利益 wording removed");

  await updateSpotInItinerary(ITIN_ID, { spotId: kanzeonji.id }, { memo: kanzeonji.memo.replace(kanzeonjiOld, kanzeonjiNext) });
  console.log("kanzeonji: hedge added");

  await updateSpotInItinerary(ITIN_ID, { spotId: komyozenji.id }, { memo: komyozenji.memo.replace(komyozenjiOld, komyozenjiNext) });
  console.log("komyozenji: year corrected to 文永10年(1273)");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
