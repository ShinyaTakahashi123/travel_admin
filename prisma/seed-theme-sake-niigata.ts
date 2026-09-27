/**
 * テーマ別シリーズ「酒蔵めぐり」6本のうち3本目（新潟市内）
 * docs/legal/20260927-sake-brewery-series-legal.md の決まりに従う（1本目と同じ、seed-theme-sake-nada.ts参照）。
 * エリアは既存の「新潟市内」を使用（新規作成不要）。
 * 企画運営の提案どおり今代司酒造を追加し、試飲は一日の最後（ぽんしゅ館）に置いた。
 * 移動はバス・徒歩のみ（車・自転車は使わない）。
 *
 * 実行方法（本番環境では npm run prod -- を先頭に付ける）:
 *   npx tsx prisma/seed-theme-sake-niigata.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-theme-sake-niigata.ts --commit      … 登録モード（承認待ちで登録。同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-theme-sake-niigata.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const SAKE_MANNER =
  "お酒を飲めるのは20歳になってからです。飲酒運転は法律で禁止されています。車を運転する方は試飲をひかえ、お土産に買って帰りましょう。妊娠中・授乳中の方の飲酒はおすすめしません。見学や試飲は、予約が必要な場合や有料の場合があり、内容も変わることがあるので、お出かけ前に各酒蔵の公式の案内で確かめてください。";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "沼垂テラスと今代司酒造、駅のぽんしゅ館をめぐる新潟市内の日帰りプラン",
    description: `かつての青果市場をリノベーションした沼垂テラス商店街から、明和4年(1767)創業と伝わる今代司酒造、新潟駅構内の利き酒処「ぽんしゅ館」まで、バスと徒歩でめぐる日帰りプランです。${SAKE_MANNER}`,
    nights: 0,
    prefectureName: "新潟県",
    areaNames: ["新潟市内"],
    tagNames: ["定番観光", "グルメ"],
    purposeNames: ["酒蔵・ワイナリー巡り", "ショッピング"],
    days: [
      [
        {
          name: "沼垂テラス商店街",
          wikiTitle: "沼垂テラス",
          address: "新潟県新潟市中央区沼垂東3-5",
          time: "09:30",
          stay: 100,
          fallbackLatLng: [37.920074, 139.069],
          memo: "かつては青果市場だった長屋をリノベーションした商店街です。昭和期には公設市場として、近郊の農家や魚屋が並ぶにぎわいを見せましたが、平成の大型スーパーの進出などで店じまいが進みました。2010年ごろから、若い店主たちが古い建物を生かして次々と店を開き、平成27年(2015)に「沼垂テラス」と名づけられました。パン屋・雑貨店・カフェなど、およそ30の店が並び、朝市などのイベントも行われています。",
        },
        {
          name: "今代司酒造",
          wikiTitle: "今代司酒造",
          address: "新潟県新潟市中央区鏡が岡1-1",
          time: "11:20",
          stay: 90,
          transit: { mode: "walk", min: 10 },
          fallbackLatLng: [37.915646, 139.071457],
          websiteUrl: "https://imayotsukasa.co.jp/",
          memo: "明和4年(1767)創業と伝わる酒蔵です。平成18年(2006)から、醸造アルコールを加えない全量純米仕込みに切り替えました。趣のある蔵の中を、蔵元や蔵人が酒造りや歴史の話を交えて案内してくれる見学があり、直売店では試飲もできます。車を運転する方は試飲をひかえましょう。",
        },
        {
          name: "ぽんしゅ館 新潟驛店 利き酒番所",
          wikiTitle: "新潟駅",
          address: "新潟県新潟市中央区花園1-96-47",
          time: "13:05",
          stay: 90,
          transit: { mode: "walk", min: 15 },
          fallbackLatLng: [37.912472, 139.062195],
          memo: "JR新潟駅構内にある利き酒処です。新潟県内すべての酒蔵の代表銘柄がそろい、コインを使って好きな銘柄を選び、おちょこ一杯ずつ試すしくみになっています。全国各地の塩をつまみに味わえるのも特徴です。今日一日の締めくくりに、車を運転する方は試飲をひかえ、そのまま新潟駅から帰路につきましょう。",
        },
      ],
    ],
  },
];

async function main() {
  await runHandmadeSeed(ITINERARIES, { blobPrefix: "official-sake-niigata", pending: true });
}
main();
