/**
 * #361の続き。企画運営(4点)・法務(5点、記録4e4d8f3)の指摘に対応。
 *
 * 企画運営:
 * 1・法務⑤. 安房で昼食の座標が屋久杉自然館(way772120363)と同じ点だったため、
 *    OSM node589064759「安房」(30.319918,130.65387)に変更。
 * 2. 屋久杉自然館の最後「今夜はこの近くの宿に宿泊します」→「今夜は安房の宿に
 *    泊まりましょう」に変更(自然館の周りは山の中のため、町の名前を明記)。
 * 3. ヤクスギランド: 5コースを紹介したあと、このしおりが210分コースを歩く
 *    前提であることを明記(#219の白谷雲水峡と同じ形)。
 * 4. 尾の間温泉「46度前後という高温の湯」: 出典を確かめられなかったため
 *    「熱めの湯」に変更。
 *
 * 法務:
 * ① 尾の間温泉に入浴マナー(撮影しない・長湯を避ける・水分をとる)と、
 *    熱さへの注意の一文を追加。
 * ② 中間ガジュマル「少し車を停めて」は県道上のため、「道路に車を停めず、
 *    近くの停められる場所から歩いて眺め、車に気をつけましょう」に変更。
 * ③ 安全の一文: 大川の滝(滝つぼ周りの岩は滑りやすい)、ヤクスギランド
 *    (80分コースより先は足元に注意・雨具)。
 * ④ ヤクスギランド: ヤクシマザル・ヤクシカへの注意(エサをあげない・
 *    近づきすぎない)を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-361c-c4c63223.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "c4c63223-3f2b-4c45-a93e-030a42ff13a9";

async function main() {
  const okawa = await prisma.spot.findFirstOrThrow({ where: { name: "大川の滝", day: { itineraryId: ITIN_ID } } });
  const oldOkawa = "屋久島の雄大な自然の迫力をゆっくり眺めましょう。";
  const newOkawa = "屋久島の雄大な自然の迫力をゆっくり眺めましょう。滝つぼの周りの岩は滑りやすいため、足元に気をつけましょう。";
  if (okawa.memo?.includes(oldOkawa)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: okawa.id }, { memo: okawa.memo.replace(oldOkawa, newOkawa) });
    console.log("大川の滝: 安全の一文を追加");
  } else {
    console.log("大川の滝: 既に対応済み");
  }

  const nakama = await prisma.spot.findFirstOrThrow({ where: { name: "中間ガジュマル", day: { itineraryId: ITIN_ID } } });
  const oldNakama = "少し車を停めて、巨木が作り出す不思議な空間を眺めてみましょう。";
  const newNakama = "道路に車を停めず、近くの停められる場所から歩いて眺め、通行する車に気をつけましょう。";
  if (nakama.memo?.includes(oldNakama)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: nakama.id }, { memo: nakama.memo.replace(oldNakama, newNakama) });
    console.log("中間ガジュマル: 車の停め方の書き方を修正");
  } else {
    console.log("中間ガジュマル: 既に対応済み");
  }

  const anbouLunch = await prisma.spot.findFirstOrThrow({ where: { name: "安房で昼食", day: { itineraryId: ITIN_ID } } });
  if (anbouLunch.lat?.toString() !== "30.319918") {
    await updateSpotInItinerary(ITIN_ID, { spotId: anbouLunch.id }, { lat: 30.319918, lng: 130.65387 });
    console.log("安房で昼食: 座標を町内の実点に修正");
  } else {
    console.log("安房で昼食: 既に対応済み");
  }

  const onoaida = await prisma.spot.findFirstOrThrow({ where: { name: "尾の間温泉", day: { itineraryId: ITIN_ID } } });
  const oldOnoaida = "46度前後という高温の湯が特徴です。タオルや石鹸は用意されていないため、持参して利用しましょう。屋内の浴場なので、天候を気にせず一年を通して楽しめます。ひと汗かいたら、しっかりと温まって、旅の疲れを癒やしましょう。";
  const newOnoaida = "熱めの湯が特徴です。タオルや石鹸は用意されていないため、持参して利用しましょう。屋内の浴場なので、天候を気にせず一年を通して楽しめます。地元の人も利用する浴場なので、ほかの入浴客を撮影しない、長湯を避ける、水分をとるなど、マナーに気をつけましょう。湯の熱さに無理をせず、ゆっくりと温まって、旅の疲れを癒やしましょう。";
  if (onoaida.memo?.includes(oldOnoaida)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: onoaida.id }, { memo: onoaida.memo.replace(oldOnoaida, newOnoaida) });
    console.log("尾の間温泉: 温度の書き方・マナー・安全の一文を修正");
  } else {
    console.log("尾の間温泉: 既に対応済み");
  }

  const yakusugiland = await prisma.spot.findFirstOrThrow({ where: { name: "ヤクスギランド", day: { itineraryId: ITIN_ID } } });
  const oldYaku =
    "体力や時間に応じて選ぶことができます。30分・50分コースは舗装された歩きやすい道ですが、80分コースより先は、木の根や岩の上を歩く本格的なトレッキングコースとなります。屋久杉の巨木が点在する原生林の中を歩けば、樹齢数千年ともいわれる悠久の自然の営みを、肌で感じることができます。昨日訪れた大川の滝の迫力とはまた違う、";
  const newYaku =
    "体力や時間に応じて選ぶことができます。ここでは210分のコースを歩く時間をとっています。30分・50分コースは舗装された歩きやすい道ですが、80分コースより先は、木の根や岩の上を歩く本格的なトレッキングコースとなるため、足元に気をつけましょう。山の天気は変わりやすいため、雨具を用意しておくと安心です。屋久杉の巨木が点在する原生林の中を歩けば、樹齢数千年ともいわれる悠久の自然の営みを、肌で感じることができます。ヤクシマザルやヤクシカに出会うこともありますが、エサをあげたり、近づきすぎたりしないようにしましょう。昨日訪れた大川の滝の迫力とはまた違う、";
  if (yakusugiland.memo?.includes(oldYaku)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: yakusugiland.id }, { memo: yakusugiland.memo.replace(oldYaku, newYaku) });
    console.log("ヤクスギランド: コース明記・足元・雨具・野生動物の注意を追加");
  } else {
    console.log("ヤクスギランド: 既に対応済み");
  }

  const shizenkan = await prisma.spot.findFirstOrThrow({ where: { name: "屋久杉自然館", day: { itineraryId: ITIN_ID } } });
  const oldShizenkan = "今夜はこの近くの宿に宿泊します。";
  const newShizenkan = "今夜は安房の宿に泊まりましょう。";
  if (shizenkan.memo?.includes(oldShizenkan)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shizenkan.id }, { memo: shizenkan.memo.replace(oldShizenkan, newShizenkan) });
    console.log("屋久杉自然館: 宿の一文を町の名前入りに修正");
  } else {
    console.log("屋久杉自然館: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
