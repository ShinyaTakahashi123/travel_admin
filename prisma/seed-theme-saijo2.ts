/**
 * 西条エリア（愛媛県）の非「お遍路」しおり2本のうち2本目
 * docs/specs/20260925-theme-itineraries.md、docs/content/theme-series-progress.md 参照。
 * お遍路シリーズ10本目で「うちぬきの湧き水」（うちぬき広場）をすでに扱っているため、本文では取り上げていない。
 * 弘法水・アクアトピア・西条陣屋跡と郷土博物館・観光交流センターは、いずれも伊予西条駅周辺の徒歩圏内にあり、公共交通のみでも回れる構成にした。
 *
 * 実行方法（本番環境では npm run prod -- を先頭に付ける）:
 *   npx tsx prisma/seed-theme-saijo2.ts               … 確認モード（DBには書き込まない）
 *   npx tsx prisma/seed-theme-saijo2.ts --commit      … 登録モード（承認待ちで登録。同名のしおりが既にあればスキップ）
 *   npx tsx prisma/seed-theme-saijo2.ts --fill-photos … 登録済みしおりの写真が欠けているスポットに写真を補完
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  {
    title: "弘法水と西条陣屋跡、水と歴史の城下町をめぐる日帰りプラン",
    description:
      "弘法大師ゆかりの湧き水「弘法水」から、水辺の遊歩道アクアトピア、西条藩の歴史を伝える陣屋跡と郷土博物館まで、水の都・西条の城下町を歩く日帰りプランです。",
    nights: 0,
    prefectureName: "愛媛県",
    areaNames: ["西条"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "絶景・フォトスポット"],
    days: [
      [
        {
          name: "弘法水",
          wikiTitle: "弘法水",
          address: "愛媛県西条市神拝322",
          time: "09:30",
          stay: 40,
          fallbackLatLng: [33.912289, 133.179901],
          memo: "本通川が海に注ぐあたりに湧く、西条市を代表する「うちぬき」(自噴井)の一つです。弘法大師がこの地で杖を突いたところ水が湧き出たという言い伝えが残り、「弘法水」の名で親しまれています。西条市内には、石鎚山系にしみ込んだ雨水が自然に湧き出る「うちぬき」がおよそ3,000本あるとされ、環境省の名水百選にも選ばれています。",
        },
        {
          name: "アクアトピア",
          wikiTitle: "アクアトピア",
          address: "愛媛県西条市大町",
          time: "10:22",
          stay: 60,
          transit: { mode: "walk", min: 12 },
          fallbackLatLng: [33.919495, 133.181122],
          memo: "昭和60年(1985)、国から「アクアトピア(親水都市)」の指定を受けたことを機に整備された、市街地を流れる水路沿いの遊歩道です。観音水から旧西条藩陣屋跡の堀まで、約2.4kmにわたって水辺の風景が続き、豊かな湧水を生かした噴水があちこちに見られます。水路沿いをゆっくり歩きながら、水の都・西条ならではの町並みを楽しめます。",
        },
        {
          name: "西条陣屋跡と西条郷土博物館",
          wikiTitle: "西条陣屋",
          address: "愛媛県西条市明屋敷237-1",
          time: "11:25",
          stay: 75,
          transit: { mode: "walk", min: 3 },
          fallbackLatLng: [33.920254, 133.178757],
          memo: "寛永13年(1636)、伊勢神戸から移った一柳氏によって築かれた西条藩の陣屋跡です。一柳氏は寛文5年(1665)に改易となり、寛文10年(1670)、徳川家康の孫にあたる松平頼純が藩主となってからは、松平氏が10代・約200年にわたって西条藩三万石を治めました。今も鯉や鴨が泳ぐ堀が残っています。陣屋跡の一角に立つ西条郷土博物館では、陣屋の模型や藩札、大砲など、旧西条藩ゆかりの品々を無料で見学できます。",
        },
        {
          name: "西条市観光交流センター",
          wikiTitle: "西条市観光交流センター",
          address: "愛媛県西条市大町798-1",
          time: "13:00",
          stay: 60,
          transit: { mode: "walk", min: 20 },
          fallbackLatLng: [33.911625, 133.189255],
          memo: "JR伊予西条駅に隣接する観光案内施設です。西条まつりで実際に使われる「だんじり」の展示や、石鎚山の写真、うちぬきの水を試飲できるコーナーなどがあり、地場産品や鉄道グッズも販売しています。西条の自然・祭り・水の恵みを、まとめて感じられるスポットです。",
        },
      ],
    ],
  },
];

async function main() {
  await runHandmadeSeed(ITINERARIES, { blobPrefix: "official-saijo2", pending: true });
}
main();
