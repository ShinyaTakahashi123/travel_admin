/**
 * #78(北海道神宮とモエレ沼公園、自然と街を楽しむ札幌旅、2泊3日、
 * ab18b6d8)の初日・最終日の見直し。
 *
 * Day2(中日)は時刻の見直しの対象外だが、企画運営の指示で円山公園の
 * 座標を直した影響(下記)で、円山公園→北海道神宮の移動が5分以上変わった
 * ため、北海道神宮以降の時刻を+8分ずらした(終了は16:45→16:53。中日は
 * 終了時刻の決まりがないため、滞在は延ばさず、そのままずらしている)。
 *
 * Day1(初日)は09:00開始・16:45終了だったため、入口の一文を加え
 * (JR札幌駅10:30ごろ着→歩いて約23分→二条市場10:53着)、見どころは
 * 削らず滞在を短縮した。移動も測り直し: 二条市場→大通公園(walk)10分
 * →実測15.5分。16分に直す(ほかの区間は実測との差5分未満でほぼ一致、
 * 変更なし)。この日はもともと「歩いて〇分」の言葉を使わない書き方
 * なので、変えた区間も文中の分数は追加しない。
 *
 * 新しい時刻: 二条市場10:53(44)→大通公園11:53(38)→テレビ塔12:41(30)→
 * 狸小路13:21(53、昼食)→豊平館14:34(38)→中島公園15:17(46)→
 * すすきの16:18(42、〜17:00)
 *
 * Day3(最終日、2泊以上のため決まりは14:30〜17:00ではなく14:30〜15:00)
 * が現状09:00開始・16:45終了と大きく外れていたため、企画運営の判断で
 * 羊ヶ丘展望台を外した(市街地から遠く、最終日最後の移動として70分の
 * バス・地下鉄の乗り継ぎを要し、最終日の「帰りの時間を考える日」という
 * 性格にも合わないため。写真1枚は表紙には使われておらず、スポットの
 * 削除にともない消える)。
 *
 * 場外市場→北海道大学(walk)の移動も測り直し: 20分→実測36.3分
 * (2725m)。短すぎた。36分に直す。この区間も文中に分数を書かない
 * もとの書き方のままとする。
 *
 * 羊ヶ丘展望台を外し、北大までの移動を測り直した結果(+16分)、終了が
 * 15:11になり、決まりの14:30〜15:00を11分超えた。モエレ沼公園の滞在を
 * 70→55分(-15分)に短縮して14:56に収めた(見どころ・ほかの滞在は
 * 変更なし)。3日目を通じた旅の締めくくりとなるため、帰りの行き方
 * (バスで環状通東駅へ、地下鉄で札幌駅方面へ)を加えた。
 *
 * 新しい時刻: 場外市場09:00(50)→北海道大学10:26(60)→
 * サッポロビール博物館11:51(50)→モエレ沼公園14:01(55、〜14:56)
 *
 * 【説明文】羊ヶ丘展望台を外したことに伴い、しおりの説明文からも
 * 「羊ヶ丘展望台」の言葉を削除した。
 *
 * 【座標(法務の指摘、#143と同じ修正)】
 * - 中島公園: 公園内の名前のない点だった。メモに名前がある「八窓庵」
 *   (OSM way302546256)のNominatim値43.0469855,141.3531414に直す。
 *   前後の移動を測り直したが、実測との差5分未満でほぼ一致、変更なし
 * - 北海道大学: 構内の計算上の中心だった。正門そばの「エルムの森」
 *   (OSM way309551926)のNominatim値43.0708166,141.3474814に直す。
 *   場外市場からの移動を測り直したが、実測36.4分でもとの直し(36分)と
 *   ほぼ同じ、変更なし
 * - モエレ沼公園: 広い公園内の名前のない点だった。メモで見どころとして
 *   紹介している「モエレ山」(OSM node352943828)の値43.1221024,
 *   141.4260257に直す。ビール博物館からの移動への影響も小さく、変更なし
 * - 円山公園(札幌): 円山動物園の正門そばの点で、公園自体の点ではな
 *   かった。公園の中に名前のある入口の点が見つからないため、企画運営の
 *   判断(7章「同じ名前の駅・バス停の点」)で、地下鉄「円山公園」駅
 *   (node7809484249)の値43.0557606,141.3194466に直す。これにより
 *   円山公園→北海道神宮(walk)が5分→実測12.5分(938m)と5分以上変わった
 *   ため、北海道神宮以降の時刻を+8分ずらした(詳細は上記)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-78-ab18b6d8.ts
 *   反映: npm run prod -- npx tsx prisma/fix-78-ab18b6d8.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ab18b6d8-403b-44e1-b7e3-26d813a6e81f";
const DAY1_ID = "973859cc-cd52-4656-82af-525c6b9f5449";
const DAY3_ID = "d3be2559-b339-4831-85f6-158a371ae79d";

const NIJO_ID = "53ac62b4-1de8-4a5f-b838-bfa95bbbe9a7";
const ODORI_ID = "3da9229b-38d0-4dbd-82a1-27b7e06efa25";
const TVTOWER_ID = "38117af5-5922-4a2b-a7b0-742119a1fca7";
const TANUKI_ID = "bf5dac6e-6cf7-4506-8394-8bb561efdee6";
const TOYOHIRA_ID = "9c26fd83-1d61-4d49-bff6-3b1981d61f40";
const NAKAJIMA_ID = "09f0c02e-db9a-4277-9593-d251216c87b8"; // 八窓庵(way302546256)に座標修正
const SUSUKINO_ID = "8a519a5e-48c6-4287-b3d6-244b3af4894c";

const JOGAI_ID = "ed614713-d350-4f0b-b467-2aec774e3451";
const HOKUDAI_ID = "a9d5c55e-e4e1-4a8e-8cb1-65c3e9c3fb82";
const BEER_ID = "0f808132-256e-4f4a-8100-43b5f86c9bc7";
const MOERE_ID = "f2fc99ab-955e-4f5c-b7dd-0d29e9504616";
const HITSUJIGAOKA_ID = "3849f4d6-c15b-4b24-82bb-bd67bd9f153b";

const MARUYAMAKOEN_ID = "211cae30-7ef6-4a05-90ed-83e81bc15306";
const JINGU_ID = "b2f9339a-f56d-4b8e-87ef-ad9e4b845ae7";
const ZOO_ID = "e3dc9703-53e2-4e3e-8975-d7f7fd6c893e";
const SHIROIKOIBITO_ID = "b7734cb9-ec47-4df9-bb46-597ade7ce877";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NIJO_FIND = "札幌の旅は、朝から開いている二条市場からスタート。";
const NIJO_REPLACE = "JR札幌駅に10時30分ごろ着いたら、歩いて約23分の二条市場へ。";

const DESC_FIND =
  "場外市場と北海道大学、サッポロビール博物館、イサム・ノグチが設計したモエレ沼公園、羊ヶ丘展望台をめぐる3日目。";
const DESC_REPLACE = "場外市場と北海道大学、サッポロビール博物館、イサム・ノグチが設計したモエレ沼公園をめぐる3日目。";

const MOERE_FIND = "モエレ山の上り下りでは足元に気をつけましょう。";
const MOERE_REPLACE =
  "モエレ山の上り下りでは足元に気をつけましょう。旅の締めくくりは、ここモエレ沼公園です。来た道を戻ってバスで地下鉄「環状通東」駅へ、地下鉄で札幌駅方面へ向かいましょう。北海道神宮とモエレ沼公園、自然と街を楽しんだ3日間の旅は、ここで終わりです。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [itinerary, nijo, moere] = await Promise.all([
    prisma.itinerary.findFirstOrThrow({ where: { id: ITINERARY_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NIJO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MOERE_ID } }),
  ]);

  for (const [label, text, find] of [
    ["説明文", itinerary.description ?? "", DESC_FIND],
    ["二条市場", nijo.memo ?? "", NIJO_FIND],
    ["モエレ沼公園", moere.memo ?? "", MOERE_FIND],
  ] as const) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newDescription = itinerary.description!.replace(DESC_FIND, DESC_REPLACE);
  const newNijoMemo = nijo.memo!.replace(NIJO_FIND, NIJO_REPLACE);
  const newMoereMemo = moere.memo!.replace(MOERE_FIND, MOERE_REPLACE);

  console.log("=== #78 Day1: 初日の開始を10:53に、移動の測り直し ===\n");
  console.log("二条市場10:53(44)→大通公園11:53(38)→テレビ塔12:41(30)→狸小路13:21(53)→豊平館14:34(38)→中島公園15:17(46)→すすきの16:18(42、〜17:00)");
  console.log("  新memo(二条市場):", newNijoMemo);
  console.log("\n=== #78 Day3: 羊ヶ丘展望台を外し、移動を測り直す ===\n");
  console.log("場外市場09:00(50)→北海道大学10:26(60、leg36分)→サッポロビール博物館11:51(50、leg25分)→モエレ沼公園14:01(55、もと70、leg50分、〜14:56)");
  console.log("  新memo(モエレ沼公園):", newMoereMemo);
  console.log("\n説明文の直し:", newDescription);
  console.log("\n=== #78 Day2: 円山公園の座標直しに伴う時刻調整 ===");
  console.log("円山公園(駅)11:10(30、座標直し)→北海道神宮11:53(60、leg13分、もと5分)→円山動物園13:53(90)→白い恋人パーク15:58(55、〜16:53)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: newDescription } });

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: NIJO_ID, data: { visitTime: T(10, 53), stayDurationMin: 44, memo: newNijoMemo } },
      {
        id: ODORI_ID,
        data: {
          visitTime: T(11, 53),
          stayDurationMin: 38,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
        },
      },
      { id: TVTOWER_ID, data: { visitTime: T(12, 41), stayDurationMin: 30 } },
      { id: TANUKI_ID, data: { visitTime: T(13, 21), stayDurationMin: 53 } },
      { id: TOYOHIRA_ID, data: { visitTime: T(14, 34), stayDurationMin: 38 } },
      {
        id: NAKAJIMA_ID,
        data: { visitTime: T(15, 17), stayDurationMin: 46, lat: 43.0469855, lng: 141.3531414 },
      },
      { id: SUSUKINO_ID, data: { visitTime: T(16, 18), stayDurationMin: 42 } },
    ],
    { remove: [] }
  );

  await setDaySpotOrder(
    DAY3_ID,
    [
      { id: JOGAI_ID, data: {} },
      {
        id: HOKUDAI_ID,
        data: {
          visitTime: T(10, 26),
          lat: 43.0708166,
          lng: 141.3474814,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 36 }] },
        },
      },
      { id: BEER_ID, data: { visitTime: T(11, 51) } },
      {
        id: MOERE_ID,
        data: {
          visitTime: T(14, 1),
          stayDurationMin: 55,
          lat: 43.1221024,
          lng: 141.4260257,
          memo: newMoereMemo,
        },
      },
    ],
    { remove: [HITSUJIGAOKA_ID] }
  );

  await prisma.spot.update({
    where: { id: MARUYAMAKOEN_ID },
    data: {
      lat: 43.0557606,
      lng: 141.3194466,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "train", transitDurationMin: 20 }] },
    },
  });
  await prisma.spot.update({
    where: { id: JINGU_ID },
    data: {
      visitTime: T(11, 53),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
    },
  });
  await prisma.spot.update({ where: { id: ZOO_ID }, data: { visitTime: T(13, 53) } });
  await prisma.spot.update({ where: { id: SHIROIKOIBITO_ID }, data: { visitTime: T(15, 58) } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
