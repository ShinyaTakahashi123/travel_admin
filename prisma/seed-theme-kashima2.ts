/**
 * エリア「鹿島」（佐賀県）の非酒蔵しおり2本のうち2本目
 * docs/content/theme-sources/鹿島エリア.md、theme-series-progress.md参照。
 * 酒蔵めぐりシリーズ5本目（肥前浜宿）とは別の切り口として、旭ヶ岡公園(鹿島城跡)と
 * 道の駅鹿島(有明海の干潟)を扱った。このしおりは酒蔵めぐりシリーズの対象外のため、
 * 「車を使わない」決まりは適用せず、旭ヶ岡公園と道の駅鹿島の間は車移動とした。
 *
 * 実行方法（本番環境では npm run prod -- を先頭に付ける）:
 *   npx tsx prisma/seed-theme-kashima2.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-theme-kashima2.ts --commit      … 登録モード（承認待ちで登録。同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-theme-kashima2.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "旭ヶ岡公園と道の駅鹿島、鹿島城跡と有明海の干潟をめぐる日帰りプラン",
    description:
      "鹿島藩の政庁が置かれた鹿島城の跡地・旭ヶ岡公園から、有明海の広大な干潟を望む道の駅鹿島までをめぐる、鹿島の日帰りプランです。",
    nights: 0,
    prefectureName: "佐賀県",
    areaNames: ["鹿島"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "自然"],
    days: [
      [
        {
          name: "旭ヶ岡公園(鹿島城跡)",
          wikiTitle: "鹿島城_(肥前国)",
          address: "佐賀県鹿島市高津原",
          time: "09:30",
          stay: 75,
          fallbackLatLng: [33.1036993, 130.0934763],
          memo: "鹿島藩の政庁が置かれた鹿島城の跡地です。文化2年(1805)に移転の許可を得て、文化4年(1807)に築城されました。明治7年(1874)の佐賀の乱の際の火災で焼失し、城跡の東側が公園として整備されました。大正3年(1914)には、九州で初めての夜桜の電飾が設置されたと伝わり、佐賀県内有数の桜の名所として知られています。",
        },
        {
          name: "干潟展望館・干潟交流館なな海",
          wikiTitle: "道の駅鹿島",
          address: "佐賀県鹿島市大字音成甲4427-6",
          time: "11:03",
          stay: 110,
          transit: { mode: "car", min: 18 },
          fallbackLatLng: [33.0748313, 130.1455489],
          memo: "有明海の広大な干潟を望む展望施設です。2階の観察デッキからは干潟の様子を一望でき、隣接する干潟交流館「なな海」では、ムツゴロウなど有明海ならではの生き物を展示するミニ水族館を見学できます。4〜10月ごろには、干潟の上を滑る「潟スキー」などの干潟体験も行われています。参加方法や貸出用具については、公式の案内で確かめてください。",
        },
        {
          name: "物産館千菜市",
          wikiTitle: "道の駅鹿島千菜市",
          address: "佐賀県鹿島市大字音成甲4427-6",
          time: "12:56",
          stay: 70,
          transit: { mode: "walk", min: 3 },
          fallbackLatLng: [33.0748313, 130.1455489],
          memo: "道の駅鹿島の直売所です。ムツゴロウやクチゾコ、ワラスボなど、有明海ならではの珍しい魚介類を使った加工品をはじめ、地元でとれた野菜や果物が並びます。",
        },
      ],
    ],
  },
];

async function main() {
  await runHandmadeSeed(ITINERARIES, { blobPrefix: "official-kashima2", pending: true });
}
main();
