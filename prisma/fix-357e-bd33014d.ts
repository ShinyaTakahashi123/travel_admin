/**
 * #357の続き。法務10/11 11:22(記録781809d)の指摘5点に対応。
 * (④稲佐山のレストラン店名は、企画運営対応のfix-357dで既に削除済み。
 * 法務の確認時点がfix-357d反映前だったとみられるため、変更なし)
 *
 * ①日本二十六聖人記念館: 「処刑されました」(亡くなり方)を外し、事実のみに。
 * ②大浦天主堂: 「西坂で殉教した26人の聖人に捧げるため」→「西坂の二十六聖人に
 *   捧げるため」(人数を数える言い方を避け、名称として扱う)。
 * ③眼鏡橋: 「日本最古のアーチ式石橋です」→「とされます」に伝聞化。
 * ⑤座標を実点に修正: 眼鏡橋→way496841322(32.747165,129.880102)、
 *   稲佐山→node4641487651「稲佐山」(32.753426,129.849338)、
 *   出島→way484294967「出島和蘭商館跡」(32.743662,129.872547)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-357e-bd33014d.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bd33014d-d57d-49c2-b7a7-3c34456fa368";

async function main() {
  const kinenkan = await prisma.spot.findFirstOrThrow({ where: { name: "日本二十六聖人記念館", day: { itineraryId: ITIN_ID } } });
  const old1 = "慶長元年(1597)、ここ西坂で、宣教師や信徒ら26人が、キリスト教を禁じた豊臣秀吉の命により処刑されました。";
  const new1 = "慶長元年(1597)、ここ西坂で、宣教師や信徒らが、キリスト教を禁じた豊臣秀吉の命により命を落としました。";
  if (kinenkan.memo?.includes(old1)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kinenkan.id }, { memo: kinenkan.memo.replace(old1, new1) });
    console.log("日本二十六聖人記念館: 亡くなり方の書き方を修正");
  } else {
    console.log("日本二十六聖人記念館: 既に対応済み");
  }

  const oura = await prisma.spot.findFirstOrThrow({ where: { name: "大浦天主堂", day: { itineraryId: ITIN_ID } } });
  const old2 = "西坂で殉教した26人の聖人に捧げるため、";
  const new2 = "西坂の二十六聖人に捧げるため、";
  if (oura.memo?.includes(old2)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: oura.id }, { memo: oura.memo.replace(old2, new2) });
    console.log("大浦天主堂: 人数の書き方を修正");
  } else {
    console.log("大浦天主堂: 既に対応済み");
  }

  const megane = await prisma.spot.findFirstOrThrow({ where: { name: "眼鏡橋", day: { itineraryId: ITIN_ID } } });
  const old3 = "日本最古のアーチ式石橋です。";
  const new3 = "日本最古のアーチ式石橋とされます。";
  if (megane.memo?.includes(old3)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: megane.id }, {
      memo: megane.memo.replace(old3, new3),
      lat: 32.747165,
      lng: 129.880102,
    });
    console.log("眼鏡橋: 言い切りを伝聞に、座標を実点に修正");
  } else {
    console.log("眼鏡橋: 既に対応済み");
  }

  const inasayama = await prisma.spot.findFirstOrThrow({ where: { name: "稲佐山", day: { itineraryId: ITIN_ID } } });
  if (inasayama.lat?.toString() !== "32.753426") {
    await updateSpotInItinerary(ITIN_ID, { spotId: inasayama.id }, { lat: 32.753426, lng: 129.849338 });
    console.log("稲佐山: 座標を実点に修正");
  } else {
    console.log("稲佐山: 既に対応済み");
  }

  const dejima = await prisma.spot.findFirstOrThrow({ where: { name: "出島", day: { itineraryId: ITIN_ID } } });
  if (dejima.lat?.toString() !== "32.743662") {
    await updateSpotInItinerary(ITIN_ID, { spotId: dejima.id }, { lat: 32.743662, lng: 129.872547 });
    console.log("出島: 座標を実点に修正");
  } else {
    console.log("出島: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
