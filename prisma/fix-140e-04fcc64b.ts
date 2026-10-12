/**
 * #140 04fcc64bの直し(5回目)。企画運営からの指摘2点・タイトルの直しと、
 * 法務からの指摘3点をまとめて対応。
 *
 * 企画運営:
 * ①越後湯沢駅のまわり(105分)が「ぶらぶら歩く」で延ばした時間合わせ
 *   だったため40〜45分に短縮。空いた時間に湯沢町歴史民俗資料館
 *   「雪国館」を追加(eebd52dfが使用済みだが、eebd52dfは川端康成の
 *   小説『雪国』・ヒロイン駒子という切り口なのに対し、本案は昭和初期の
 *   住まいの再現・蓑や雪靴などの除雪道具という、豪雪地の暮らしの知恵
 *   だけの切り口で執筆し、文学の話には触れない)。
 * ②そりランドは、公式サイト・観光記事を調べてもゲレンデ内の正確な
 *   位置(第何ゲレンデ等)が分からず、岩原スキー場と別のOSMの点も
 *   見つからなかったため、企画運営が示した代替案のとおり、そりランド
 *   (全長634mのソリコース)を岩原スキー場の文にまとめ、独立した
 *   スポットとしては削除。
 * ③タイトルを「GALA湯沢と岩原でスキー、越後湯沢温泉に泊まる雪国の
 *   1泊2日」に変更(2日目の岩原スキー場がタイトルに表れていなかった
 *   ため)。
 *
 * 法務:
 * ④ゲレンデの座標(名前のないaerialway=station)は決まりでは使えない
 *   指摘を受け、OSMのn12662292008「高津倉山」(natural=peak、
 *   36.9437707,138.7695283、標高1180.9m。本文の「標高1181メートルの
 *   山頂」と一致)に修正。
 * ⑤ゆきあそびパークの座標(出どころ不明)を、前回のガーラ湯沢駅の点
 *   n9013930719(36.9502508,138.7995543)に戻す。
 * ⑥説明文の「酒蔵めぐり」が、白瀧酒造を外した今の内容と合わないため
 *   「岩原スキー場でのスキー」に書き換え。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "GALA湯沢と岩原でスキー、越後湯沢温泉に泊まる雪国の1泊2日";
const DESCRIPTION =
  "新幹線駅直結のスキー場・GALA湯沢での雪遊びと、岩原スキー場でのスキーで味わう、雪国ならではの冬を満喫する1泊2日プランです。";

const IWAPPARA_MEMO =
  "2日目の朝、越後湯沢駅の近くでレンタカーを借りて、車でおよそ10分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つとされます。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、はじめてスキーやスノーボードに挑戦する人にも向いています。場内には、全長634メートルという大きなソリのコース「そりランド」もあり、スキーやスノーボードをしない人も、雪の斜面を滑り降りて楽しめます。自分に合ったコースを選び、スキー場のきまりや係の人の案内に従いましょう。周辺には食事処もあるので、ここで昼食をとりましょう。この後は、車でおよそ9分、雪国館へ向かいましょう。";

const YUKIGUNIKAN_MEMO =
  "岩原スキー場から車でおよそ9分、湯沢町歴史民俗資料館「雪国館」に着きます。昭和の初めごろの住まいを再現した展示や、雪に閉ざされる冬を生き抜くために使われてきた蓑や雪靴、除雪の道具など、豪雪地ならではの暮らしの知恵を伝える品々が並びます。スキー場で雪と遊んだあとに、この土地の人々が昔から雪とどう向き合ってきたかを知ることができます。休館日は公式サイトで確かめましょう。この後は、歩いておよそ7分、越後湯沢駅のまわりへ向かいましょう。";

const ONSENGAI_MEMO =
  "雪国館から歩いておよそ7分、越後湯沢駅のまわりに着きます。駅のまわりには、昔から名の知れた温泉地らしい、旅館や土産物店が並ぶ通りが続いています。レンタカーを返したら、歩いて通りを少し歩き、雪国らしい土産物を探してみましょう。この後は、歩いてすぐ、西口駅前広場足湯へ向かいましょう。";

async function main() {
  const day2Id = "cb0dbe03-1289-4449-b645-16aa9d8e8af7";

  const iwapparaId = "7a4b9875-1fb5-428a-a467-a8cc8d65ba11";
  const soriId = "6447410c-db2c-40d1-a959-dc38b0f12ce4"; // 削除、岩原の文に統合
  const onsengaiId = "39a3aa31-286b-4d6a-939e-105e34970562";
  const gerendeId = "745e8513-e48e-4d67-955a-1ced80e604d2";
  const yukiasobiId = "074dc552-2695-4bd3-950f-64ae4bd79975";
  const ashiyuId = "702c4cd0-2b47-4767-9e03-d57322709ad0";

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: "04fcc64b-72d2-4b60-8484-ca892ff27f12" },
      data: { title: TITLE, description: DESCRIPTION },
    });
    await tx.spot.update({ where: { id: gerendeId }, data: { lat: 36.9437707, lng: 138.7695283 } });
    await tx.spot.update({ where: { id: yukiasobiId }, data: { lat: 36.9502508, lng: 138.7995543 } });

    const day2: SpotOrderItem[] = [
      {
        id: iwapparaId,
        data: { stayDurationMin: 330, memo: IWAPPARA_MEMO },
      },
      {
        create: {
          name: "雪国館", lat: 36.93897, lng: 138.80558,
          visitTime: t(14, 39), stayDurationMin: 50, memo: YUKIGUNIKAN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9 }] },
        },
      },
      {
        id: onsengaiId,
        data: {
          visitTime: t(15, 36), stayDurationMin: 45, memo: ONSENGAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
        },
      },
      {
        id: ashiyuId,
        data: { visitTime: t(16, 22) },
      },
    ];
    await setDaySpotOrder(day2Id, day2, { remove: [soriId], tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
