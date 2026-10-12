/**
 * #72 55a33667（熱海リラックス旅）ユーザー決定「全部直す」の対象(現状D1 15:13・
 * D2 14:25、以前は企画運営が了承した「帰る日」の例外だった)。滞在を延ばさず
 * (決まりA)、実在スポットを追加。
 * D1: 伊豆山神社・走り湯のあとに姫の沢公園(実在、熱海市伊豆山、花と緑の総合
 * 公園、OSM node 4400709144)を追加。移動時間はOSRM実測(7.0km/14分)。
 * D2: 熱海城のあとにACAO FOREST(実在、旧アカオハーブ&ローズガーデン、13の
 * テーマガーデンからなる大規模庭園、OSM way 565243254)を追加。移動時間は
 * OSRM実測(1.0km/2分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const IZUSAN_MEMO_TO_HIME =
  "来宮神社から車でおよそ10分、伊豆山神社・走り湯に着きます。「伊豆」の地名発祥の地とも伝えられる古社で、源頼朝と北条政子が結ばれた場所として、縁結びの神社としても親しまれています。本殿は海抜およそ170mの高台にあり、海辺の走り湯までは837段の石段で結ばれています。走り湯は、奈良時代に発見されたと伝わる全国でも珍しい横穴式の源泉で、湧き出た湯が海岸へ飛ぶように流れ落ちる様子からこの名がついたと伝えられています。石段は段数が多く、勾配もあるので、歩きやすい靴で、足元に気をつけながら参拝してください。静かに、敬意をもってお参りください。この後は、車でおよそ14分、姫の沢公園へ向かいましょう。";

const HIME_MEMO =
  "伊豆山神社・走り湯から車でおよそ14分、姫の沢公園に着きます。市街地中心部から北西へおよそ5kmの高台に広がる、花と緑を四季を通じて楽しめる総合公園です。春はツツジやフジ、初夏はアジサイ、秋は紅葉と、季節ごとに異なる表情を見せてくれます。本格的なアスレチック広場やハイキングコースも整備されていて、体を動かしながら自然を満喫することもできます。熱海の市街地とは一味違う、緑豊かな山あいの空気を、ゆっくりと味わってみてください。熱海サンビーチから続いた、海と温泉街グルメを楽しむ1日目のリラックス旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。";

const ATAMIJO_MEMO_TO_ACAO =
  "MOA美術館から車でおよそ10分、錦ヶ浦の高台に建つ熱海城に着きます。昭和34年(1959)、熱海の観光施設として建てられた鉄筋コンクリート造の建物で、実際に城があったわけではなく、日本の城郭を模して造られた展望施設です。地上43m・海抜160mに位置する展望天守閣からは、熱海市街や相模灘はもちろん、晴れた日には伊豆大島や初島、遠く房総半島までを見渡せます。館内には、江戸時代の文化にふれられる展示コーナーや、浮世絵・城郭資料を紹介するコーナーもあります。この後は、車でおよそ2分、ACAO FORESTへ向かいましょう。";

const ACAO_MEMO =
  "熱海城から車でおよそ2分、ACAO FOREST(旧アカオハーブ&ローズガーデン)に着きます。相模湾を見下ろす丘陵地に広がる、13のテーマガーデンからなる大規模な庭園です。バラをはじめとする季節の花々やハーブ、宿根草が織りなす景色を、熱海の海と空を借景に楽しめます。敷地内には、建築家・隈研吾が設計した、海を望むカフェ「COEDA HOUSE」もあります。園内は起伏があるので、歩きやすい靴でお越しください。熱海サンビーチの散策から続いた、海と温泉、そして絶景をめぐる1泊2日のリラックス旅も、ここで無事に終了です。お疲れさまでした。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "55a33667-b603-4efa-ad4f-2b5f8e8e2f47", dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "55a33667-b603-4efa-ad4f-2b5f8e8e2f47", dayNumber: 2 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "105f8c2c-1f6b-482c-b551-cd4967b13764", data: {} }, // 熱海サンビーチ
    { id: "c5706530-0b0c-41f5-95c1-5e08bc7db7c9", data: {} }, // 親水公園・ムーンテラス
    { id: "fd9b4413-f07e-4f40-b5ff-0f0ce42e891b", data: {} }, // 熱海銀座商店街
    { id: "a9ac0ea8-9f86-4e66-930b-12c4d766589f", data: {} }, // 起雲閣
    { id: "02833b6f-21d5-46a8-a5fe-5f9641ac996b", data: {} }, // 来宮神社
    {
      id: "8c9944a8-331b-4ee8-ab90-e2a498dd1ac2", // 伊豆山神社・走り湯
      data: { memo: IZUSAN_MEMO_TO_HIME },
    },
    {
      create: {
        name: "姫の沢公園",
        address: "静岡県熱海市伊豆山字姫の沢1164",
        lat: 35.1176783,
        lng: 139.0498928,
        memo: HIME_MEMO,
        visitTime: t(15, 27),
        stayDurationMin: 75,
        transitMode: "car",
        transitDurationMin: 14,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "e549660b-0300-44fa-87e7-d488c0a3b4d9", data: {} }, // 旧日向別邸
    { id: "1094b5e0-5abe-4b1b-ae8a-7770fb97f34a", data: {} }, // 熱海梅園
    { id: "5e6f65ab-4e5c-48b0-b3ab-ae8b434f3efc", data: {} }, // MOA美術館
    {
      id: "b6581430-f851-4675-bb8b-adac4fef24ec", // 熱海城
      data: { memo: ATAMIJO_MEMO_TO_ACAO },
    },
    {
      create: {
        name: "ACAO FOREST",
        address: "静岡県熱海市上多賀1027-8",
        lat: 35.0799126,
        lng: 139.0725549,
        memo: ACAO_MEMO,
        visitTime: t(14, 27),
        stayDurationMin: 135,
        transitMode: "car",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, order] of [["D1", day1Spots], ["D2", day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${label} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
