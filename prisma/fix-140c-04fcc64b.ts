/**
 * #140 04fcc64bの直し(3回目)。企画運営・法務からの指摘にまとめて対応。
 *
 * 企画運営:
 * ①白瀧酒造(会社名・銘柄「上善如水」・試飲の案内)を削除。車で移動する日に
 *   試飲を勧めるのは飲酒運転に関わる。代わりに「越後湯沢駅のまわり」
 *   (温泉地らしい通りの散策)に差し替え。
 * ②岩原スキー場前駅(15分)は時間合わせの立ち寄りに見える→削除し、時間は
 *   岩原スキー場に回す(200→215分)。
 * ③座標: ゆきあそびパーク・SPAガーラの湯をOSMの実点に修正(ゲレンデは
 *   法務への申し送りのとおり、名前つきの点が見つからなかったため、
 *   最寄りのaerialway=station(無名)の点に変更)。
 * ④車: 「宿やこの近くで車を借りておくと便利です」をやめ、2日目の
 *   最初の文で「越後湯沢駅の近くでレンタカーを借りて」と明記。
 * ⑤「よいでしょう」→「〜でとりましょう」。
 *
 * 法務:
 * ①お酒と運転の一文は、白瀧酒造自体を削除したため不要に(企画運営の
 *   指摘で対応済み)。
 * ②SPAガーラの湯に入浴の一文(撮影・長湯・水分)を追加。
 * ③ゲレンデ・そりランドに安全の一文(コース選び・係の人の案内)を追加。
 * ④岩原スキー場の「もっとも古いスキー場の一つです」→同じ文に
 *   「〜の一つとされます」のぼかしを追加。
 * ⑤岩原スキー場前駅の誤った写真(越後湯沢温泉の看板)は、スポット自体を
 *   削除するため、写真もカスケードで削除される(Photo.spotIdの
 *   onDelete: Cascade)。
 * ⑥「冬の間だけ列車が停まる」の確認は、スポット自体を削除するため不要に。
 *
 * 新規2か所(越後湯沢駅のまわり・西口駅前広場足湯)はOSMの実点
 * (越後湯沢駅n3548915150、西口駅前広場足湯n8145140934、fee=no)で確認。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const GERENDE_MEMO =
  "スキーセンターから徒歩すぐ、ゴンドラでゲレンデへ向かいます。標高358メートルの山麓から、標高1181メートルの山頂まで一気に登るゴンドラを含め、リフトは全10基、コースは全16コースあります。山頂からは一面の雪山の景色が広がり、初級者から上級者まで、思い思いのコースで雪上のひとときを過ごせます。自分に合ったコースを選び、スキー場のきまりや係の人の案内に従いましょう。昼食は、スキーセンター内の食堂でとりましょう。この後は、ゴンドラで山麓へ戻り、ゆきあそびパークへ向かいましょう。";

const SPA_MEMO =
  "ゆきあそびパークから歩いてすぐ、SPAガーラの湯に着きます。スキー場の中にある日帰り温泉で、内風呂や露天風呂、サウナなど複数の浴槽があります。ほかの人を写さず、長湯は避けて、水分をとりながら入りましょう。一日雪の中で過ごした体を、ゆっくりと温めましょう。今夜は、越後湯沢の宿に泊まりましょう。";

const IWAPPARA_MEMO =
  "2日目の朝、越後湯沢駅の近くでレンタカーを借りて、車でおよそ10分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つとされます。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、はじめてスキーやスノーボードに挑戦する人にも向いています。自分に合ったコースを選び、スキー場のきまりや係の人の案内に従いましょう。思い思いのペースで、雪の斜面を滑ってみましょう。この後は、歩いてすぐ、そりランドへ向かいましょう。";

const SORILAND_MEMO =
  "岩原スキー場の中にある、そりランドに着きます。スキーやスノーボードをしない人も、ソリに乗って雪の斜面を滑り降りられる、家族で楽しめる施設です。自分に合ったコースを選び、スキー場のきまりや係の人の案内に従いましょう。周辺には食事処もあるので、ここで昼食をとりましょう。この後は、車でおよそ8分、越後湯沢駅のまわりへ向かいましょう。";

const ONSENGAI_MEMO =
  "そりランドから車でおよそ8分、越後湯沢駅のまわりに着きます。駅のまわりには、昔から名の知れた温泉地らしい、旅館や土産物店が並ぶ通りが続いています。レンタカーを返したら、歩いて通りをぶらぶらと歩き、雪国らしい土産物を探してみましょう。この後は、歩いてすぐ、西口駅前広場足湯へ向かいましょう。";

const ASHIYU_MEMO =
  "越後湯沢駅のまわりから歩いてすぐ、西口駅前広場足湯に着きます。駅の西口にある、無料の足湯です。1日中いつでも利用できるので、帰りの新幹線を待つ間、歩き疲れた足をゆっくり休ませましょう。ほかの人を写さないようにしましょう。見学を終えたら、歩いて越後湯沢駅へ向かい、帰りの新幹線に乗りましょう。";

async function main() {
  const day1Id = "cc8c5a88-cddf-4370-8845-ab5ec463618e";
  const day2Id = "cb0dbe03-1289-4449-b645-16aa9d8e8af7";

  const ekiId = "3c3f8f2d-4790-453a-8ce3-466e9cb0817e";
  const gerendeId = "745e8513-e48e-4d67-955a-1ced80e604d2";
  const yukiasobiId = "074dc552-2695-4bd3-950f-64ae4bd79975";
  const spaId = "50a33052-d758-47e2-99fa-798b45a36e30";

  const iwapparaEkiId = "eec2f277-aec0-48da-b7b3-cd6c54abdd72"; // 削除
  const iwapparaId = "7a4b9875-1fb5-428a-a467-a8cc8d65ba11";
  const soriId = "6447410c-db2c-40d1-a959-dc38b0f12ce4";
  const shiratakiId = "39a3aa31-286b-4d6a-939e-105e34970562"; // 越後湯沢駅のまわりに差し替え

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { id: ekiId, data: {} },
      { id: gerendeId, data: { lat: 36.9502335, lng: 138.7738765, memo: GERENDE_MEMO } },
      { id: yukiasobiId, data: { lat: 36.9511819, lng: 138.7993843 } },
      { id: spaId, data: { lat: 36.9508007, lng: 138.7996795, memo: SPA_MEMO } },
    ];
    await setDaySpotOrder(day1Id, day1, { tx });

    const day2: SpotOrderItem[] = [
      {
        id: iwapparaId,
        data: {
          visitTime: t(9, 0), stayDurationMin: 215, memo: IWAPPARA_MEMO,
          transitLegs: { deleteMany: {} },
        },
      },
      {
        id: soriId,
        data: {
          visitTime: t(12, 35), stayDurationMin: 100, memo: SORILAND_MEMO,
        },
      },
      {
        id: shiratakiId,
        data: {
          name: "越後湯沢駅のまわり", lat: 36.9358784, lng: 138.8094233,
          visitTime: t(14, 23), stayDurationMin: 105, memo: ONSENGAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "西口駅前広場足湯", lat: 36.9355507, lng: 138.8087301,
          visitTime: t(16, 9), stayDurationMin: 20, memo: ASHIYU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
    ];
    await setDaySpotOrder(day2Id, day2, { remove: [iwapparaEkiId], tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
