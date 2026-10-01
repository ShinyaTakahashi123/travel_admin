/**
 * #347の続き。企画運営11:55・11:56、法務11:55の指摘に対応。
 * 1) 帰り方が誤り。黒部ダムから「往路と同じルートで立山駅へ」は、公式の
 *    最終の乗り継ぎに間に合わない(アルペンルートは片道の通り抜けが通常の
 *    回り方)。関電トンネル電気バスで扇沢へ抜け、扇沢からバスで信濃大町駅
 *    へ出て帰る形に修正。
 * 2) 美女平の書き出しに、電鉄富山駅から立山駅までの行き方(富山地方鉄道
 *    立山線、およそ1時間)を追加。
 * 3) 美女平の70分が水増しに見えるため、実在の「美女平自然探勝路」内回り
 *    コース(およそ2km、公式の所要時間1時間)を名前と時間つきで明記。
 * 4) 季節をspring(4月中旬〜6月下旬)のみに修正(雪の大谷の時期に限定され、
 *    アルペンルート自体も冬季は閉鎖されるため)。
 * 5) 説明文で「雪の大谷」と「黒部ダムの観光放水」を同時に見られるように
 *    読めたため、時期が異なる旨を明記。
 * 6) 室堂の「地獄谷」に、火山ガスによる立入規制の注意を追加。
 * 7) (できれば)黒部ダムに、人数を書かない慰霊の一文を追加。
 * 8) 室堂についていた写真(DaikanboView.jpg、実際は大観峰の眺め)を大観峰に
 *    付け替え(表紙=thumbnailUrlはURLが変わらないためそのまま)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-347d-aec8eadc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "aec8eadc-75da-4179-8c8c-013bb4b3c01f";
const MISATTRIBUTED_PHOTO_ID = "ead28fe9-6595-4a69-9aab-84600ebd6d3b";
const DAIKANBO_SPOT_ID = "c77376d0-a058-4409-915a-3eb61c945b32";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.seasons.length === 1 && itin.seasons[0] === "spring") {
    console.log("already applied, skipping");
    return;
  }

  const bijodaira = await prisma.spot.findFirstOrThrow({ where: { name: "美女平", day: { itineraryId: ITIN_ID } } });
  const murodo = await prisma.spot.findFirstOrThrow({ where: { name: "室堂", day: { itineraryId: ITIN_ID } } });
  const kurobedam = await prisma.spot.findFirstOrThrow({ where: { name: "黒部ダム", day: { itineraryId: ITIN_ID } } });

  const bijodairaOld =
    "立山黒部アルペンルートをめぐる旅は、美女平からスタートです。立山駅からケーブルカーでおよそ7分の道のりです。標高およそ1,000mに広がるブナやタテヤマスギの原生林に囲まれた高原で、「森林浴の森100選」にも選ばれています。駅前に立つ、ひときわ大きな「美女杉」や、屋上の展望テラスからの眺めも見どころです。ブナ坂へと続く遊歩道を少し歩けば、新緑や紅葉の季節には、鳥のさえずりに包まれながら森林浴を楽しむこともできます。";
  const bijodairaNext =
    "立山黒部アルペンルートをめぐる旅は、美女平からスタートです。電鉄富山駅から富山地方鉄道立山線でおよそ1時間の立山駅まで進み、そこからケーブルカーでおよそ7分の道のりです。標高およそ1,000mに広がるブナやタテヤマスギの原生林に囲まれた高原で、「森林浴の森100選」にも選ばれています。駅前に立つ、ひときわ大きな「美女杉」や、屋上の展望テラスからの眺めも見どころです。駅から整備されている美女平自然探勝路の内回りコース(およそ2km、公式の所要時間は1時間)を歩けば、新緑や紅葉の季節には、鳥のさえずりに包まれながら森林浴を楽しむこともできます。";
  if (!bijodaira.memo?.includes(bijodairaOld)) throw new Error("bijodaira anchor not found");

  const murodoOld =
    "間欠的に噴気を上げる「地獄谷」の展望スポットもあり、室堂ターミナル内外には食事処も揃っているので、ここで昼食をとるとよいでしょう。";
  const murodoNext =
    "間欠的に噴気を上げる「地獄谷」の展望スポットもあります。地獄谷のまわりは火山ガスが出ているため、立ち入りが規制されることがあり、現地の案内に従いましょう。室堂ターミナル内外には食事処も揃っているので、ここで昼食をとるとよいでしょう。";
  if (!murodo.memo?.includes(murodoOld)) throw new Error("murodo anchor not found");

  const kurobedamOld =
    "地下水や土砂の噴出に見舞われるなど、当時の技術の粋を尽くした「世紀の大工事」と呼ばれ、多くの人々の労苦の末に完成しました。堤の高さはおよそ186mで、日本一の高さとされています。谷を堰き止める巨大な堤体と、そこから見渡す立山連峰の景色は圧巻です。夏の観光放水期間には、大量の水が勢いよく放たれる豪快な姿を見ることもできます。雄大な自然と人の営みが織りなす絶景を、心ゆくまで味わいましょう。雪の大谷ウォークと黒部ダム、立山黒部アルペンルートをめぐる旅は、ここで終わりです。帰りは、往路と同じルートをたどって立山駅まで戻ります。アルペンルートの移動だけでもおよそ2時間半かかるため、時間に余裕を持って出発しましょう。";
  const kurobedamNext =
    "地下水や土砂の噴出に見舞われるなど、当時の技術の粋を尽くした「世紀の大工事」と呼ばれ、多くの人々の労苦の末に完成しました。工事では多くの方が亡くなり、ダムのそばには慰霊碑が建てられています。堤の高さはおよそ186mで、日本一の高さとされています。谷を堰き止める巨大な堤体と、そこから見渡す立山連峰の景色は圧巻です。夏の観光放水期間には、大量の水が勢いよく放たれる豪快な姿を見ることもできます。雄大な自然と人の営みが織りなす絶景を、心ゆくまで味わいましょう。雪の大谷ウォークと黒部ダム、立山黒部アルペンルートをめぐる旅は、ここで終わりです。立山駅への戻りは最終の乗り継ぎに間に合わないため、関電トンネル電気バスでおよそ16分の扇沢へ抜け、扇沢からは路線バスで信濃大町駅まで出て、そこから帰路につきましょう。";
  if (!kurobedam.memo?.includes(kurobedamOld)) throw new Error("kurobedam anchor not found");

  await updateSpotInItinerary(ITIN_ID, { spotId: bijodaira.id }, { memo: bijodaira.memo.replace(bijodairaOld, bijodairaNext) });
  console.log("bijodaira: access + named trail course added");

  await updateSpotInItinerary(ITIN_ID, { spotId: murodo.id }, { memo: murodo.memo.replace(murodoOld, murodoNext) });
  console.log("murodo: jigokudani regulation caution added");

  await updateSpotInItinerary(ITIN_ID, { spotId: kurobedam.id }, { memo: kurobedam.memo.replace(kurobedamOld, kurobedamNext) });
  console.log("kurobedam: memorial line + correct one-way return added");

  const descOld =
    "春の風物詩・雪の大谷の大雪壁を歩き、日本一の高さとされる黒部ダムで、迫力の観光放水を見る。立山黒部の雄大なスケールを体感するプランです（雪の大谷は例年4〜6月限定）。";
  const descNext =
    "春の風物詩・雪の大谷の大雪壁を歩き、日本一の高さとされる黒部ダムを訪ねる。立山黒部の雄大なスケールを体感するプランです（雪の大谷は例年4月中旬〜6月下旬限定。黒部ダムの観光放水は例年6月下旬〜10月中旬で、雪の大谷とは時期が異なります）。";
  if (!itin.description?.includes(descOld)) throw new Error("description anchor not found");

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: { description: itin.description.replace(descOld, descNext), seasons: ["spring"] },
  });
  console.log("description fixed and seasons set to spring only");

  await prisma.photo.update({
    where: { id: MISATTRIBUTED_PHOTO_ID },
    data: { spotId: DAIKANBO_SPOT_ID, caption: "大観峰" },
  });
  console.log("misattributed photo reassigned from murodo to daikanbo");

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
