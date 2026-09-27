/**
 * テーマ別シリーズ「酒蔵めぐり」6本のうち6本目・最終本（石川・金沢）
 * docs/legal/20260927-sake-brewery-series-legal.md の決まりに従う（1本目と同じ、seed-theme-sake-nada.ts参照）。
 * エリアは既存の「金沢」を使用（新規作成不要）。既存の公開中4本（21世紀美術館・にし茶屋街、
 * ひがし茶屋街・近江町市場、兼六園・金沢城公園、兼六園の雪吊り）とスポットが重ならないよう、
 * 長町武家屋敷跡・主計町茶屋街・福光屋という別の切り口でまとめた。
 * 移動はバス・徒歩のみ（車・自転車は使わない）。試飲は一日の最後の福光屋に置いた。
 * 他の5本での指摘を踏まえ、試飲スポットの滞在は最初から60分程度の適度な長さにした。
 *
 * 実行方法（本番環境では npm run prod -- を先頭に付ける）:
 *   npx tsx prisma/seed-theme-sake-kanazawa.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-theme-sake-kanazawa.ts --commit      … 登録モード（承認待ちで登録。同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-theme-sake-kanazawa.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const SAKE_MANNER =
  "お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合や有料の場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめてください。";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "長町武家屋敷跡と主計町茶屋街、老舗蔵元・福光屋をめぐる金沢の日帰りプラン",
    description: `加賀藩士の屋敷跡が続く長町武家屋敷跡、浅野川沿いの主計町茶屋街から、寛永2年(1625)創業と伝わる金沢最古参の蔵元・福光屋まで、バスと徒歩でめぐる日帰りプランです。${SAKE_MANNER}`,
    nights: 0,
    prefectureName: "石川県",
    areaNames: ["金沢"],
    tagNames: ["定番観光"],
    purposeNames: ["酒蔵・ワイナリー巡り", "城・史跡"],
    days: [
      [
        {
          name: "長町武家屋敷跡",
          wikiTitle: "長町武家屋敷跡",
          address: "石川県金沢市長町",
          time: "09:30",
          stay: 100,
          fallbackLatLng: [36.565193, 136.650711],
          memo: "加賀藩の中級・上級藩士の屋敷が集まっていた一帯です。土塀と石畳の路地が続き、藩政時代の情緒を今に伝えています。地域を流れる大野庄用水は、藩政時代からの用水路です。今も人が暮らす町並みのため、ほとんどの屋敷は公開されておらず、家の敷地に入らず、外観を楽しみながら静かに散策しましょう。",
        },
        {
          name: "主計町茶屋街",
          wikiTitle: "主計町茶屋街",
          address: "石川県金沢市主計町",
          time: "11:30",
          stay: 75,
          transit: { mode: "bus", min: 20 },
          fallbackLatLng: [36.572338, 136.663589],
          memo: "浅野川沿いに広がる、金沢三茶屋街の一つです。にし茶屋街・ひがし茶屋街より遅く、明治から昭和戦前期にかけて茶屋町として栄えました。平成20年(2008)、国の重要伝統的建造物群保存地区に選定されています。「主計町」という町名は、いったん失われたのち、平成11年(1999)に全国で初めて旧町名として復活したことでも知られています。今も人が暮らし、営業する町並みですので、家の敷地に入らず、静かに散策しましょう。",
        },
        {
          name: "福光屋(SAKE SHOP福光屋 金沢店)",
          wikiTitle: "福光屋",
          address: "石川県金沢市石引2-8-3",
          time: "13:05",
          stay: 65,
          transit: { mode: "bus", min: 20 },
          fallbackLatLng: [36.553719, 136.672333],
          websiteUrl: "https://www.fukumitsuya.co.jp/sake-shop/kanazawa/",
          memo: "寛永2年(1625)創業と伝わる、金沢で最も古い歴史を持つ蔵元です。店内には酒蔵見学のコースや、純米造りの日本酒をテイスティングできる唎き酒コース、BARコーナーがあります。車を運転する方は試飲をひかえましょう。今日一日の締めくくりに、お気に入りの一本をお土産に選びましょう。",
        },
      ],
    ],
  },
];

async function main() {
  await runHandmadeSeed(ITINERARIES, { blobPrefix: "official-sake-kanazawa", pending: true });
}
main();
