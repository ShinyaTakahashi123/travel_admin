/**
 * エリア「久留米・うきは」（福岡県）の非「いちご狩り」しおり2本のうち2本目
 * docs/content/theme-sources/久留米・うきはエリア.md 参照。
 * 既存の公開待ちしおり「うきはでいちご狩りと筑後吉井の白壁の町並みをめぐる日帰りプラン」
 * （春光園・筑後吉井の白壁の町並み・浮羽稲荷神社を使用、季節はwinter/spring）とスポットが
 * 重ならないよう、この本ではつづら棚田・弘農園（ぶどう・なし狩り、いちごは扱っていない）・
 * 道の駅うきはを扱う。ぶどう・なし狩りは例年8〜10月ごろが季節のため、
 * 「おすすめの季節」はsummer/autumnのみに設定した（既存いちご狩り本のwinter/springとは別の季節）。
 *
 * 実行方法（本番環境では npm run prod -- を先頭に付ける）:
 *   npx tsx prisma/seed-theme-ukiha1.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-theme-ukiha1.ts --commit      … 登録モード（承認待ちで登録。同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-theme-ukiha1.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "つづら棚田と弘農園のぶどう・なし狩り、道の駅うきはをめぐる日帰りプラン",
    description:
      "日本棚田百選のつづら棚田から、ぶどう・なし狩りの弘農園、地元の果物が並ぶ道の駅うきはまで、実りの季節のうきはを楽しむ日帰りプランです。",
    nights: 0,
    prefectureName: "福岡県",
    areaNames: ["久留米・うきは"],
    tagNames: ["定番観光", "味覚狩り"],
    purposeNames: ["自然", "絶景・フォトスポット"],
    days: [
      [
        {
          name: "つづら棚田",
          wikiTitle: "つづら棚田",
          address: "福岡県うきは市浮羽町新川3227",
          time: "09:00",
          stay: 60,
          fallbackLatLng: [33.282364, 130.802078],
          memo: "うきは市浮羽町の山あいに広がる、約7ヘクタール・およそ300枚の棚田です。石積みの多くは約400年前に積まれたものと伝わり、平成11年(1999)には農林水産省の「日本棚田百選」に選ばれました。田に水が張られる初夏や、稲穂が実る秋など、四季折々の表情が楽しめます。実際に稲作が行われている農地ですので、あぜ道や私有地には立ち入らず、道路や見晴らしの良い場所から静かに眺めましょう。",
        },
        {
          name: "弘農園",
          wikiTitle: "弘農園",
          address: "福岡県うきは市浮羽町山北2250-14",
          time: "10:20",
          stay: 130,
          transit: { mode: "car", min: 20 },
          fallbackLatLng: [33.334217, 130.820618],
          memo: "うきは市浮羽町山北にある観光農園で、ぶどう(巨峰・シャインマスカット・シナノスマイルなど)となし(幸水・豊水・新高など)の狩りを楽しめます。例年8月上旬〜10月中旬ごろが収穫期です。料金のしくみや営業状況は、季節により変わるので公式サイトで確かめてください。",
        },
        {
          name: "道の駅うきは",
          wikiTitle: "道の駅うきは",
          address: "福岡県うきは市浮羽町山北729-2",
          time: "12:35",
          stay: 90,
          transit: { mode: "car", min: 5 },
          fallbackLatLng: [33.3343, 130.8185],
          websiteUrl: "https://michinoeki-ukiha.com/",
          memo: "平成12年(2000)に開駅した、国道210号沿いの道の駅です。筑後平野を見渡す高台にあり、伝統的な「くど造り」をモチーフにした木造の建物が特徴です。直売所「物産館 西見台」には、地元の農家が育てた果物や野菜が並び、中でも果物が豊富な、果物の里・うきはらしい道の駅です。レストラン「きふね食堂」では郷土料理などを味わえ、隣接する観光交流施設「ウキハコ」では、うきは市の観光案内やレンタサイクルの貸し出しも行っています。営業時間は季節により変わるので、公式サイトで確かめてください。",
        },
      ],
    ],
  },
];

async function main() {
  await runHandmadeSeed(ITINERARIES, { blobPrefix: "official-ukiha1", pending: true });
}
main();
