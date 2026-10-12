/**
 * #362の続き。企画運営(4点)・法務(3点、記録ac49426)の指摘に対応。
 *
 * 企画運営:
 * 1. 塩見縄手の文が、公開中の#b2185337(松江堀川めぐり)の文とほぼ同じだったため、
 *    塩見小兵衛の名の由来・「日本の道100選」の指定という別の事実を使って書き直す。
 * 2. 島根県立美術館の夕日の書き方: 16:40に旅が終わるため、今日の訪問で見られると
 *    読めないよう、美術館の一般的な特徴(夕日の眺めで知られる)として書き直す
 *    (#357の稲佐山と同じ考え方)。
 * 3. 説明文の「山陰地方唯一の現存天守」にヘッジを追加。
 * 4. 松江城の書き出しに、JR松江駅からの具体的な行き方(レイクラインバス・バス停名・
 *    徒歩時間)を追加。
 *
 * 法務:
 * ① 堀川遊覧船に、乗船時の安全の一文(身を乗り出さない・屋根を下げるときは頭に注意)を追加。
 * ② 松江城に、天守内の階段が急であることへの注意を追加。
 * ③ 松江城の座標が度分秒を変換した値だったため、OSM way299654325の中心
 *    (35.475141,133.050762)に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-362b-c62de963.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "c62de963-b78f-4a3e-ad13-e321047ac38e";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "国宝に指定された、山陰地方唯一の現存天守・松江城。";
  const newDesc = "国宝に指定された、山陰地方唯一とされる現存天守・松江城。";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(oldDesc, newDesc) } });
    console.log("説明文: 「唯一」にヘッジを追加");
  } else {
    console.log("説明文: 既に対応済み");
  }

  const matsuejo = await prisma.spot.findFirstOrThrow({ where: { name: "松江城", day: { itineraryId: ITIN_ID } } });
  const oldOpen = "松江の旅は松江城から始まります。";
  const newOpen = "JR松江駅から、ぐるっと松江レイクラインで約10分の「国宝松江城(大手前)」バス停から歩いて1分ほど、松江の旅は松江城から始まります。";
  const oldStairs = "城下町・松江の歴史を存分に感じられます。";
  const newStairs = "城下町・松江の歴史を存分に感じられます。天守内部の階段は急なため、足元に気をつけて上り下りしましょう。";
  if (matsuejo.memo?.includes(oldOpen) || matsuejo.lat?.toString() === "35.475139") {
    let newMemo = matsuejo.memo ?? "";
    if (newMemo.includes(oldOpen)) newMemo = newMemo.replace(oldOpen, newOpen);
    if (newMemo.includes(oldStairs)) newMemo = newMemo.replace(oldStairs, newStairs);
    await updateSpotInItinerary(ITIN_ID, { spotId: matsuejo.id }, {
      memo: newMemo,
      lat: 35.475141,
      lng: 133.050762,
    });
    console.log("松江城: 書き出し・階段の注意・座標を修正");
  } else {
    console.log("松江城: 既に対応済み");
  }

  const shiomi = await prisma.spot.findFirstOrThrow({ where: { name: "塩見縄手で昼食", day: { itineraryId: ITIN_ID } } });
  const oldShiomi =
    "松江歴史館から歩いて3分ほど、お昼は塩見縄手で食事をとりましょう。松江城の北側の堀に沿って続く、武家屋敷が並ぶ通りです。昔ながらの町並みを眺めながら、食事処で一休みしましょう。お腹を満たしたら、歩いて武家屋敷へ向かいましょう。";
  const newShiomi =
    "松江歴史館から歩いて3分ほど、お昼は塩見縄手で食事をとりましょう。かつてこの道沿いに住んでいた中級武士・塩見小兵衛が、後に町奉行へ栄進したことから、この名で呼ばれるようになったと伝えられています。黒板塀の侍屋敷と、堀端に並ぶ老松が織りなす町並みは、「日本の道100選」にも選ばれています。食事処で一休みしながら、城下町らしい風情を味わいましょう。お腹を満たしたら、歩いて武家屋敷へ向かいましょう。";
  if (shiomi.memo === oldShiomi) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shiomi.id }, { memo: newShiomi });
    console.log("塩見縄手: 他のしおりと重なる文を書き直し");
  } else {
    console.log("塩見縄手: 既に対応済み");
  }

  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { name: "島根県立美術館", day: { itineraryId: ITIN_ID } } });
  const oldBi = "美術館の建物自体も、宍道湖の夕景を楽しめるように設計されており、タイミングが合えば、湖に沈む夕日を眺めることもできます。";
  const newBi = "美術館の建物自体も、宍道湖に面したガラス張りのロビーが特徴で、宍道湖の夕日の眺めでも知られています。";
  if (bijutsukan.memo?.includes(oldBi)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: bijutsukan.id }, { memo: bijutsukan.memo.replace(oldBi, newBi) });
    console.log("島根県立美術館: 夕日の書き方を修正");
  } else {
    console.log("島根県立美術館: 既に対応済み");
  }

  const yuransen = await prisma.spot.findFirstOrThrow({ where: { name: "堀川遊覧船", day: { itineraryId: ITIN_ID } } });
  const oldYuran = "船頭さんの案内を聞きながら、堀川ならではの景色をゆっくりと味わいましょう。";
  const newYuran = "船頭さんの案内に従い、身を乗り出さないようにしましょう。屋根を下げるときは、頭に気をつけましょう。堀川ならではの景色をゆっくりと味わいましょう。";
  if (yuransen.memo?.includes(oldYuran)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: yuransen.id }, { memo: yuransen.memo.replace(oldYuran, newYuran) });
    console.log("堀川遊覧船: 安全の一文を追加");
  } else {
    console.log("堀川遊覧船: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
