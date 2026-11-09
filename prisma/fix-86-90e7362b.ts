/**
 * #86 石打丸山の絶景テラスと苗場ドラゴンドラ、季節の絶景を楽しむ越後湯沢1泊2日
 * (90e7362b-8ee7-412d-895f-21fdea5187f8) 初日・最終日の見直し。
 *
 * 入口(JR越後湯沢駅10:30着+手続き15分+車約15分+ゴンドラ「サンライズエクスプレス」約7分=
 * 11:07)が丸ごと欠けていた。これで初日が時間超過するため、説明文に名前のない西福寺開山堂を
 * 外す(ほかの滞在はすべてもとのまま。魚沼の里→池田記念美術館を直接の道のりで測り直す、
 * 実測10分)。1か所目にあった宿の一文を外し、最後の池田記念美術館へ移す。2日目1か所目に
 * 宿からの行き方を追加。言葉づかい(ガイドの呼びかけ口調)を10か所ほど直す。移動の直し2か所
 * (苗場ドラゴンドラ→田代ロープウェー、田代湖→宿場の湯)。
 *
 * 座標: 田代湖は湖の中心でなく、田代ロープウェーの山の上の駅(線の端のノード、法務#164と同じ
 * 考え方)に。ザ・ヴェランダ石打丸山は、公式サイトで確かめたところ、ゴンドラ「サンライズ
 * エクスプレス」で山頂のグランドテラスへ上ると案内されているため、OSM way504529069
 * 「サンライズエクスプレス」の山頂側の端のノードに(法務の勧めのA案)。宿場の湯は建物の点に
 * 少し直す。
 *
 * 季節(seasons): ['autumn','spring'] だったが、ザ・ヴェランダ(7/18〜11/8)・苗場ドラゴンドラ
 * 紅葉(10/10〜11/8)・田代ロープウェー紅葉(10/10〜11/3)の3つがすべて動き、紅葉の説明が
 * 成り立つのは10/10〜11/3だけで、春は紅葉が起こらないため成り立たない。企画運営の判断で
 * ['autumn']のみに直し、説明文に運行期間の目安を追加する。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-86-90e7362b.ts
 *   反映: npm run prod -- npx tsx prisma/fix-86-90e7362b.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "90e7362b-8ee7-412d-895f-21fdea5187f8";
const DAY1_ID = "8b00f9a5-87e2-41b1-a7c5-2be71248e228";
const DAY2_ID = "d17656de-3eb2-47b4-ac47-0123f39313a2";

const VERANDA_ID = "a76b6f22-aef7-4583-b9f8-c0f676334e0b";
const YUKIGUNIKAN_ID = "37b57065-330b-46c3-a830-b0ca7bfc9f05";
const UNTOAN_ID = "c3cd42d6-fd9c-4b0c-881e-68d181d13bb2";
const UONUMA_ID = "a93af47a-691d-4d6b-b75d-1972a4aeacdc";
const SAIFUKUJI_ID = "e4420b41-5248-484d-9a6b-67653bf8052d";
const IKEDA_ID = "1a9754d8-9c8f-424e-8de6-fb2e626fa5a2";

const DRAGONDOLA_ID = "4281d1df-0ff5-463e-8c2a-3bcbbb287745";
const TASHIRO_ROPEWAY_ID = "7537983a-0182-4735-abdd-ca7719d58721";
const TASHIROKO_ID = "7613be58-2b67-45ce-8954-de04380fa8b8";
const SHUKUBA_ID = "5fb99580-a6c8-440d-8374-8e545510eea1";
const MITSUMATA_ID = "8290fcdc-4c56-462e-b3ee-db9065a50133";
const SUWA_ID = "510635b8-6035-4237-a8d6-653b74be72f8";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const DESCRIPTION =
  "夏から秋にかけて営業する石打丸山の絶景テラスと、紅葉で人気の苗場ドラゴンドラ。どちらも動いている、例年10月中旬から11月上旬ごろが目安です(運行期間は公式の案内で確かめましょう)。湯沢高原とは違う、季節ごとの絶景ゴンドラを楽しむ1泊2日です。";

const VERANDA_MEMO =
  "この旅は車でめぐります。JR越後湯沢駅に10:30ごろ着いたら、駅の近くでレンタカーを借りて(手続きに15分ほど)、車で約15分の石打丸山のリゾートセンターへ。そこからゴンドラ「サンライズエクスプレス」に乗り、山頂まで約7分でザ・ヴェランダ石打丸山に着きます。南魚沼市にある石打丸山スキー場が、令和4年(2022)に新たな夏の展望スポットとしてオープンさせたテラスです。例年、夏から秋にかけての期間限定でゴンドラが営業しており、山頂からは南魚沼の田園風景や山並みを見渡す大パノラマが広がります。営業期間や時間は年によって変わることがあるため、お出かけ前に公式サイトで確かめましょう。夜には、南魚沼の街明かりを一望できる「ナイトテラス」が特別な日に開催されることもあり、幻想的な夜景を楽しめる機会もあるのだそうです。冬とは全く違う、緑あふれる高原の絶景をゆっくり楽しみましょう。テラスのカフェやBBQで、ここで昼食にしましょう。この後は、ゴンドラで下り(およそ7分)、車でおよそ8分、雪国館へ向かいましょう。";

const YUKIGUNIKAN_FIND1 = "ザ・ヴェランダ石打丸山から車でおよそ10分、湯沢町歴史民俗資料館「雪国館」に着きます。";
const YUKIGUNIKAN_REPLACE1 = "ザ・ヴェランダ石打丸山からゴンドラで下り(およそ7分)、車でおよそ8分、湯沢町歴史民俗資料館「雪国館」に着きます。";
const YUKIGUNIKAN_FIND2 = "有名な書き出しで知られる物語の舞台に、思いをはせてみてください。";
const YUKIGUNIKAN_REPLACE2 = "有名な書き出しで知られる物語の舞台に、思いをはせてみましょう。";

const UONUMA_FIND1 = "ここで昼食にするのもおすすめです。お酒は20歳から。車を運転する人は飲まないでください。この後は、車でおよそ14分、西福寺開山堂へ向かいましょう。";
const UONUMA_REPLACE1 = "蔵元の見学やカフェ・そば処をゆっくり楽しみましょう。お酒は20歳から。車を運転する人は飲まないようにしましょう。この後は、車でおよそ10分、池田記念美術館へ向かいましょう。";

const IKEDA_FIND_OPEN = "西福寺開山堂から車でおよそ7分、南魚沼市浦佐にある池田記念美術館に着きます。";
const IKEDA_REPLACE_OPEN = "魚沼の里から車でおよそ10分、南魚沼市浦佐にある池田記念美術館に着きます。";
const IKEDA_FIND_CLOSE =
  "アート・文学・スポーツと幅広いテーマのコレクションをゆっくり楽しんでください。休館日は公式サイトで確かめてから訪れましょう。この後は、宿へ戻ってゆっくりお休みください。旅の1日目は、ここで終わりです。";
const IKEDA_REPLACE_CLOSE =
  "アート・文学・スポーツと幅広いテーマのコレクションをゆっくり楽しみましょう。休館日は公式サイトで確かめてから訪れましょう。見学を終えたら、宿へ戻りましょう。この夜は、石打丸山の近くの宿に泊まります。旅の1日目は、ここで終わりです。";

const DRAGONDOLA_MEMO =
  "旅の2日目は苗場ドラゴンドラからです。宿から車でおよそ35分です。苗場高原と田代高原を結ぶ全長5,481メートルのこのゴンドラは、単線自動循環式としては日本最長とされ、片道およそ25分をかけて、紅葉に染まる山々の上をゆっくりと進みます。眼下には清津川の渓谷や、エメラルドグリーンに輝く二居湖を望むことができ、山肌を埋め尽くす赤や黄色の紅葉が、まるで一枚の絵画のような景色を見せてくれます。ゴンドラが急な斜面を下る場面では、ちょっとしたスリルも味わえるのだそうです。標高差およそ425メートルを行き来しながら、四季の移ろいを空から感じる、贅沢な空中散歩を楽しみましょう。";

const TASHIROKO_FIND = "ゆっくり歩いて、標高1,400m級の高原の空気を味わってみてください。";
const TASHIROKO_REPLACE = "ゆっくり歩いて、標高1,400m級の高原の空気を味わってみましょう。";

const SHUKUBA_FIND = "ここで昼食をとるのもおすすめです。";
const SHUKUBA_REPLACE = "ここで昼食をとりましょう。";

const SUWA_FIND = "あわせてゆっくりと歩いてみてください。旅の2日目は、ここで終わりです。お帰りは、越後湯沢駅からご利用ください。";
const SUWA_REPLACE = "あわせてゆっくりと歩いてみましょう。旅の2日目は、ここで終わりです。帰りは、越後湯沢駅から帰りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [yukiguni, uonuma, ikeda, tashiroko, shukuba, suwa] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: YUKIGUNIKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: UONUMA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: IKEDA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TASHIROKO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHUKUBA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SUWA_ID } }),
  ]);

  for (const [label, text, find] of [
    ["雪国館(入口)", yukiguni.memo ?? "", YUKIGUNIKAN_FIND1],
    ["雪国館(締め)", yukiguni.memo ?? "", YUKIGUNIKAN_FIND2],
    ["魚沼の里", uonuma.memo ?? "", UONUMA_FIND1],
    ["池田記念美術館(入口)", ikeda.memo ?? "", IKEDA_FIND_OPEN],
    ["池田記念美術館(締め)", ikeda.memo ?? "", IKEDA_FIND_CLOSE],
    ["田代湖", tashiroko.memo ?? "", TASHIROKO_FIND],
    ["宿場の湯", shukuba.memo ?? "", SHUKUBA_FIND],
    ["諏訪神社", suwa.memo ?? "", SUWA_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newYukiguniMemo = yukiguni
    .memo!.replace(YUKIGUNIKAN_FIND1, YUKIGUNIKAN_REPLACE1)
    .replace(YUKIGUNIKAN_FIND2, YUKIGUNIKAN_REPLACE2);
  const newUonumaMemo = uonuma.memo!.replace(UONUMA_FIND1, UONUMA_REPLACE1);
  const newIkedaMemo = ikeda.memo!.replace(IKEDA_FIND_OPEN, IKEDA_REPLACE_OPEN).replace(IKEDA_FIND_CLOSE, IKEDA_REPLACE_CLOSE);
  const newTashirokoMemo = tashiroko.memo!.replace(TASHIROKO_FIND, TASHIROKO_REPLACE);
  const newShukubaMemo = shukuba.memo!.replace(SHUKUBA_FIND, SHUKUBA_REPLACE);
  const newSuwaMemo = suwa.memo!.replace(SUWA_FIND, SUWA_REPLACE);

  console.log("=== #86 初日・最終日の見直し ===\n");
  console.log("説明文(季節の目安を追加):");
  console.log(DESCRIPTION);
  console.log("\nseasons: ['autumn'] のみに直す");

  console.log("\n--- 初日(5か所。西福寺開山堂を外す) ---");
  console.log("1. ザ・ヴェランダ石打丸山 11:07(70分、入口を追加、座標をサンライズエクスプレス山頂側に直す、昼食を追加):");
  console.log(VERANDA_MEMO);
  console.log("\n2. 雪国館 12:32(35分、ゴンドラ下り7分+車8分に分ける):");
  console.log(newYukiguniMemo);
  console.log("\n3. 雲洞庵 13:27(40分、内容変更なし)");
  console.log("4. 魚沼の里 14:22(70分、昼食から見学・買い物に変更):");
  console.log(newUonumaMemo);
  console.log("\n5. 池田記念美術館(最後) 15:42(75分、終了16:57、宿の一文を追加):");
  console.log(newIkedaMemo);

  console.log(
    "\n--- 2日目(苗場ドラゴンドラ→田代ロープウェーの徒歩10→18分、田代湖→宿場の湯20→25分の直しで+13分。宿場の湯の滞在を120→107分に短くして、終了をもとと同じ16:34に収める) ---"
  );
  console.log("1. 苗場ドラゴンドラ 09:30(60分、宿からの行き方を追加):");
  console.log(DRAGONDOLA_MEMO);
  console.log("\n2. 田代ロープウェー 10:48(50分、座標変更なし。苗場ドラゴンドラからの徒歩を18分に直す)");
  console.log("3. 田代湖 11:58(40分、座標を田代ロープウェー山頂側の点に直す):");
  console.log(newTashirokoMemo);
  console.log("\n4. 宿場の湯 13:03(107分、もとは120分、座標を建物の点に直す、田代湖からの移動を25分に直す):");
  console.log(newShukubaMemo);
  console.log("\n5. 道の駅みつまた 15:30(25分、内容変更なし)");
  console.log("6. 諏訪神社(最後) 16:09(25分、終了16:34、もとと同じ):");
  console.log(newSuwaMemo);

  console.log("\n外す: 西福寺開山堂(説明文に名前なし)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: ITINERARY_ID },
      data: { description: DESCRIPTION, seasons: ["autumn"] },
    });

    await setDaySpotOrder(
      DAY1_ID,
      [
        {
          id: VERANDA_ID,
          data: {
            visitTime: t(11, 7),
            stayDurationMin: 70,
            lat: 36.974064,
            lng: 138.791167,
            memo: VERANDA_MEMO,
          },
        },
        {
          id: YUKIGUNIKAN_ID,
          data: {
            visitTime: t(12, 32),
            stayDurationMin: 35,
            memo: newYukiguniMemo,
            transitLegs: {
              deleteMany: {},
              create: [
                { orderNo: 1, transitMode: "other", transitDurationMin: 7 },
                { orderNo: 2, transitMode: "car", transitDurationMin: 8 },
              ],
            },
          },
        },
        { id: UNTOAN_ID, data: { visitTime: t(13, 27), stayDurationMin: 40 } },
        { id: UONUMA_ID, data: { visitTime: t(14, 22), stayDurationMin: 70, memo: newUonumaMemo } },
        {
          id: IKEDA_ID,
          data: {
            visitTime: t(15, 42),
            stayDurationMin: 75,
            memo: newIkedaMemo,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
          },
        },
      ],
      { remove: [SAIFUKUJI_ID], tx }
    );

    await setDaySpotOrder(
      DAY2_ID,
      [
        { id: DRAGONDOLA_ID, data: { visitTime: t(9, 30), stayDurationMin: 60, memo: DRAGONDOLA_MEMO } },
        {
          id: TASHIRO_ROPEWAY_ID,
          data: {
            visitTime: t(10, 48),
            stayDurationMin: 50,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 18 }] },
          },
        },
        {
          id: TASHIROKO_ID,
          data: { visitTime: t(11, 58), stayDurationMin: 40, lat: 36.847595, lng: 138.752446, memo: newTashirokoMemo },
        },
        {
          id: SHUKUBA_ID,
          data: {
            visitTime: t(13, 3),
            stayDurationMin: 107,
            lat: 36.843297,
            lng: 138.778671,
            memo: newShukubaMemo,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 25 }] },
          },
        },
        { id: MITSUMATA_ID, data: { visitTime: t(15, 30), stayDurationMin: 25 } },
        { id: SUWA_ID, data: { visitTime: t(16, 9), stayDurationMin: 25, memo: newSuwaMemo } },
      ],
      { tx }
    );
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
