/**
 * #353の続き。法務15:04の4点・企画運営15:04の2点(15:05で2は取り消し、
 * 法務の点と合わせて対応)に対応。
 *
 * 1. 民家園の座標: 法務が発見したOSMの民家園そのものの点(way 662319019、
 *    日本語名は誤って「荻町集落2」だが、英語名"Gasshozukuri Minkaen
 *    Outdoor Museum"・tourism=museum・公式サイトshirakawago-minkaen.jp
 *    と一致)の中心、36.2550209,136.9015303に修正。
 * 2. 塩硝の館は、令和8年(2026)7月30日の火災による被害で、復旧工事のため
 *    休館中であることが判明(南砺市が2026年度補正予算で復旧費を計上)。
 *    「紹介しています」という現在形の案内を削除し、塩硝の製法そのものの
 *    歴史的事実の記述にとどめた(事実自体は変わらないため)。
 *    出典: 北日本新聞(webun.jp)の報道
 * 3. 菅沼集落に、今も人が暮らす集落である旨の配慮の一文を追加。
 * 4. 明善寺「村内でも最大級の合掌造り建築の一つです」を「〜一つとされて
 *    います」に修正。
 *
 * あわせて企画運営15:04の指摘で、菅沼集落140分(2時間20分)を70分に短縮し、
 * 浮いた時間に実在の相倉集落(新規、五箇山地方、菅沼より規模の大きい
 * 合掌造り集落)を追加。
 *
 * 【神田家の「今もご家族が暮らす」の出どころ(法務への回答)】
 * 検索で複数のサイトを確認したところ、神田家は和田家の次男・和田佐治衛門が
 * 分家して構えた家で、現在も子孫が住んでおり、観光施設として公開して
 * いるとの記載が複数の情報源で一致していた。個別の一次情報(公式サイト等)
 * までは確認できておらず、二次情報の一致による確認にとどまる旨、報告で
 * 申し添える。
 *
 * 事実確認:
 * - 相倉集落: 合掌造り家屋20棟ほどが現存(一部資料では23棟)、菅沼よりも
 *   規模が大きいとされる。平成7年(1995)、荻町・菅沼とともに世界遺産に
 *   登録。駐車場から段々畑の小道を5分ほど上ると、集落を見渡せる展望
 *   スポットがある。
 *   出典: https://www.info-toyama.com/stories/gassho-style
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-353c-b991287e.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY2_ID = "8eca1d8b-3a0f-4456-b6d6-3cda73868695";

const MINKAEN_ID = "4dffce3e-9971-497a-beef-24f57c65404d";
const MEIZENJI_ID = "38b25bdb-2d4a-4d59-b2eb-7959afe92056";
const DEAIBASHI_ID = "6aefdd32-5288-4838-8d12-f0420b3d2aa9";
const OGIMACHI_ID = "e6e6ac10-fda1-4ea3-bd4c-aa7c055ae713";
const KANDAKE_ID = "52de25d1-860d-4c14-bedc-810e5465d8dc";
const HACHIMAN_ID = "5c94b3b0-34ee-405e-8093-df308bb8da1a";
const SUGANUMA_ID = "9b1965ca-e1d8-4495-989b-04d1f3eb22ca";
const MICHINOEKI_ID = "4ba39cd2-9d4f-4ca8-8058-51cc8440eb89";

async function main() {
  const already = await prisma.spot.findFirst({ where: { dayId: DAY2_ID, name: "相倉集落" } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const meizenji = await prisma.spot.findUniqueOrThrow({ where: { id: MEIZENJI_ID } });
  const meizenjiNewMemo = meizenji.memo!.replace(
    "村内でも最大級の合掌造り建築の一つです。",
    "村内でも最大級の合掌造り建築の一つとされています。"
  );
  if (meizenjiNewMemo === meizenji.memo) throw new Error("明善寺: 置換に失敗");

  const suganumaMemo =
    "白川八幡神社を参拝したら、車でおよそ28分の菅沼集落へ向かいましょう。富山県南砺市の五箇山地方にある、合掌造り家屋9棟が残る小さな集落です。平成7年(1995)、荻町集落とともに「白川郷・五箇山の合掌造り集落」として世界遺産に登録されました。荻町よりも規模が小さく、静かな山あいの集落の雰囲気を味わえます。駐車場からは、エレベーターとトンネルを通って集落へ下ります。集落内の五箇山民俗館は、菅沼でもっとも古いとされる合掌造り家屋を活用した資料館で、およそ200点の生活道具や、屋根裏の構造を見学できます。五箇山では、合掌造りの家の囲炉裏の下に穴を掘り、藁やヨモギなどを混ぜて数年がかりで発酵させる独自の製法で塩硝(焔硝、火薬の原料)が作られ、加賀藩のもとでおよそ300年にわたって続いた産業だったと伝えられています。今も人が暮らす集落ですので、住まいの敷地には立ち入らないようにしましょう。荻町とはまた違う、山あいの合掌造り集落の静けさを味わいましょう。見学を終えたら、車でおよそ9分の相倉集落へ向かいましょう。";

  const ainokuraMemo =
    "菅沼集落を見学したら、車でおよそ9分の相倉集落へ向かいましょう。同じ五箇山地方にある、20棟ほどの合掌造り家屋が残る集落で、菅沼よりも規模が大きいとされています。平成7年(1995)、荻町・菅沼とともに世界遺産に登録されました。駐車場から段々畑の小道を5分ほど上ると、集落全体を見渡せる展望スポットがあります。今も人が暮らす集落ですので、住まいの敷地には立ち入らないようにしましょう。菅沼とはまた違う、相倉ならではの合掌造り集落の表情を味わいましょう。見学を終えたら、車でおよそ26分の道の駅白川郷へ向かいましょう。";

  const michinoeki = await prisma.spot.findUniqueOrThrow({ where: { id: MICHINOEKI_ID } });
  const michinoekiNewMemo = michinoeki.memo!.replace("菅沼集落を見学したら、", "相倉集落を見学したら、");
  if (michinoekiNewMemo === michinoeki.memo) throw new Error("道の駅白川郷: 書き出しの置換に失敗");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: MINKAEN_ID }, data: { lat: 36.2550209, lng: 136.9015303 } });
    await tx.spot.update({ where: { id: MEIZENJI_ID }, data: { memo: meizenjiNewMemo } });

    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: DEAIBASHI_ID, data: {} },
        { id: OGIMACHI_ID, data: {} },
        { id: KANDAKE_ID, data: {} },
        { id: HACHIMAN_ID, data: {} },
        { id: SUGANUMA_ID, data: { memo: suganumaMemo, stayDurationMin: 70 } },
        {
          create: {
            name: "相倉集落",
            address: "富山県南砺市相倉",
            lat: 36.430688,
            lng: 136.914051,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 47)),
            stayDurationMin: 75,
            transitMode: "car",
            transitDurationMin: 9,
            memo: ainokuraMemo,
          },
        },
        {
          id: MICHINOEKI_ID,
          data: { memo: michinoekiNewMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 16, 28)), transitMode: "car", transitDurationMin: 26 },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("#353: 民家園の座標・塩硝の館の休館・菅沼の配慮一文・明善寺のヘッジ・相倉集落の追加に対応完了");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
