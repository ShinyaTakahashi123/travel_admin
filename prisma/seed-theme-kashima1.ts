/**
 * エリア「鹿島」（佐賀県）の非酒蔵しおり2本のうち1本目
 * docs/content/theme-sources/鹿島エリア.md、theme-series-progress.md参照。
 * 酒蔵めぐりシリーズ5本目（肥前浜宿）とあわせてエリアを3本にそろえるための2本のうちの1本目。
 * 祐徳稲荷神社をメインに構成。「日本三大稲荷」の位置づけは神社公式サイトの記載を根拠とした。
 * 座標は、本殿・楼門はOSM(Nominatim)の神社境内地の座標を使用。表参道・日本庭園・
 * 祐徳博物館・奥の院は境内周辺の近似値（本殿からの相対位置をもとに手動で指定）。
 *
 * 実行方法（本番環境では npm run prod -- を先頭に付ける）:
 *   npx tsx prisma/seed-theme-kashima1.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-theme-kashima1.ts --commit      … 登録モード（承認待ちで登録。同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-theme-kashima1.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "祐徳稲荷神社と表参道、日本庭園と奥の院をめぐる鹿島の日帰りプラン",
    description:
      "「日本三大稲荷」の一つに数えられるという祐徳稲荷神社を中心に、門前の表参道、四季の花が咲く日本庭園、有明海を見渡す奥の院までをめぐる、鹿島の日帰りプランです。",
    nights: 0,
    prefectureName: "佐賀県",
    areaNames: ["鹿島"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "絶景・フォトスポット"],
    days: [
      [
        {
          name: "表参道(門前商店街)",
          wikiTitle: "祐徳稲荷神社表参道",
          address: "佐賀県鹿島市古枝乙",
          time: "09:30",
          stay: 60,
          fallbackLatLng: [33.0718, 130.1081],
          memo: "祐徳稲荷神社へと続く、約400mの参道沿いに広がる門前商店街です。江戸時代から続くという趣のある店構えが並び、食事処や土産物店でにぎわいます。",
        },
        {
          name: "祐徳稲荷神社(本殿・楼門)",
          wikiTitle: "祐徳稲荷神社",
          address: "佐賀県鹿島市古枝乙1855",
          time: "10:35",
          stay: 60,
          transit: { mode: "walk", min: 5 },
          fallbackLatLng: [33.0743975, 130.1080648],
          websiteUrl: "https://www.yutokusan.jp/",
          memo: "貞享4年(1687)、肥前鹿島藩主・鍋島直朝の夫人であった花山院萬子媛が、朝廷の勅願所であった伏見稲荷から御分霊を勧請したことに始まると伝わる神社です。公式には、京都の伏見稲荷神社、茨城の笠間稲荷神社とあわせて「日本三大稲荷」の一つに数えられるとしています。石壁山の中腹、高さ18mの舞台造りの上に本殿が立ち、総漆塗り・極彩色の楼門とあわせて「鎮西日光」とも呼ばれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
        },
        {
          name: "日本庭園・祐徳博物館",
          wikiTitle: "祐徳稲荷神社日本庭園",
          address: "佐賀県鹿島市古枝乙",
          time: "11:40",
          stay: 60,
          transit: { mode: "walk", min: 5 },
          fallbackLatLng: [33.0748, 130.1071],
          memo: "神社に隣接する日本庭園では、アジサイやハナショウブ、ボタンなど四季折々の花が楽しめ、秋には紅葉の名所としても知られています。隣の祐徳博物館では、神社に伝わる宝物や、郷土の歴史資料を見学できます。",
        },
        {
          name: "奥の院",
          wikiTitle: "祐徳稲荷神社奥の院",
          address: "佐賀県鹿島市古枝乙",
          time: "13:00",
          stay: 70,
          transit: { mode: "walk", min: 20 },
          fallbackLatLng: [33.0774, 130.1091],
          memo: "本殿からさらに山道を登った先にある奥の院です。有明海を見渡す眺望が広がり、天気の良い日には遠くまで見渡せます。山道のため、歩きやすい靴で向かいましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
        },
      ],
    ],
  },
];

async function main() {
  await runHandmadeSeed(ITINERARIES, { blobPrefix: "official-kashima1", pending: true });
}
main();
