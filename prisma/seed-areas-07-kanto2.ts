/**
 * 公式しおりデータ登録・再開バッチ7（docs/specs/20260924-shiori-data-resume.md）
 * 公開0件エリア、関東地方の続き。
 * 対象: 埼玉県 さいたま市内・秩父 / 千葉県 成田・房総 / 茨城県 大洗
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-07-kanto2.ts
 *   登録モード: npx tsx prisma/seed-areas-07-kanto2.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 埼玉県 さいたま市内
  // ============================================================
  {
    title: "武蔵一宮氷川神社と大宮公園、さいたまの定番参拝日帰りプラン",
    description: "2kmにおよぶ参道で知られる武蔵一宮氷川神社と、隣接する大宮公園。さいたま市内の定番スポットを巡る日帰りプランです。",
    nights: 0,
    prefectureName: "埼玉県",
    areaNames: ["さいたま市内"],
    tagNames: ["定番観光"],
    purposeNames: ["神社"],
    days: [
      [
        { name: "武蔵一宮氷川神社", wikiTitle: "氷川神社", address: "さいたま市大宮区高鼻町1丁目407", time: "9:30", stay: 50, memo: "武蔵国一宮。2kmにおよぶ長い参道で知られる。" },
        { name: "大宮公園", wikiTitle: "大宮公園", address: "さいたま市大宮区高鼻町4丁目", time: "10:40", stay: 60, memo: "氷川神社に隣接する、桜の名所としても知られる県営公園。", transit: { mode: "walk", min: 10 } },
        { name: "大宮盆栽美術館", wikiTitle: "さいたま市大宮盆栽美術館", address: "さいたま市北区土呂町2丁目24-3", time: "12:10", stay: 50, memo: "世界でも珍しい、盆栽を専門に紹介する公立美術館。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "鉄道博物館で1日満喫、家族で楽しむさいたま鉄道の旅",
    description: "実物車両やシミュレーターが揃う鉄道博物館を中心に楽しむ、子どもから大人まで夢中になれる日帰りプランです。",
    nights: 0,
    prefectureName: "埼玉県",
    areaNames: ["さいたま市内"],
    tagNames: ["家族旅行"],
    purposeNames: ["テーマパーク", "美術館・博物館"],
    days: [
      [
        { name: "鉄道博物館", wikiTitle: "鉄道博物館_(さいたま市)", address: "さいたま市大宮区大成町3丁目47", time: "9:30", stay: 180, memo: "実物車両の展示やシミュレーター体験が充実した、鉄道ファン憧れの博物館。" },
        { name: "大宮盆栽美術館", wikiTitle: "さいたま市大宮盆栽美術館", address: "さいたま市北区土呂町2丁目24-3", time: "13:30", stay: 50, memo: "鉄道漬けの午前のあとは、静かな盆栽の世界でひと休み。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "さいたまスーパーアリーナと三橋総合公園、都市型リラックス1泊2日",
    description: "大規模イベント会場とグルメスポットが集まるエリアと、緑豊かな公園でのんびり。都会と自然のコントラストを楽しむプランです。",
    nights: 1,
    prefectureName: "埼玉県",
    areaNames: ["さいたま市内"],
    tagNames: ["家族旅行"],
    purposeNames: ["ショッピング", "自然"],
    days: [
      [
        { name: "さいたまスーパーアリーナ", wikiTitle: "さいたまスーパーアリーナ", address: "さいたま市中央区新都心8", time: "10:00", stay: 40, memo: "国内最大級の多目的アリーナ。周辺のけやきひろばも散策。" },
        { name: "武蔵一宮氷川神社", wikiTitle: "氷川神社", address: "さいたま市大宮区高鼻町1丁目407", time: "11:20", stay: 50, memo: "新都心から少し足を延ばして、由緒ある大社に参拝。", transit: { mode: "car", min: 15 } },
      ],
      [
        { name: "三橋総合公園", wikiTitle: "さいたま市", address: "さいたま市西区三橋6丁目", time: "9:30", stay: 70, memo: "広い芝生広場とアスレチックがある、家族連れに人気の公園。" },
      ],
    ],
  },

  // ============================================================
  // 埼玉県 秩父
  // ============================================================
  {
    title: "秩父神社と長瀞ライン下り、定番の秩父を巡る日帰りプラン",
    description: "秩父の総鎮守・秩父神社から、荒川の渓谷美を船で下る長瀞ライン下りまで。秩父観光の王道を1日で楽しむプランです。",
    nights: 0,
    prefectureName: "埼玉県",
    areaNames: ["秩父"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "自然"],
    days: [
      [
        { name: "秩父神社", wikiTitle: "秩父神社", address: "秩父市番場町1-3", time: "9:30", stay: 40, memo: "秩父の総鎮守。極彩色の彫刻が施された本殿が見どころ。" },
        { name: "長瀞岩畳", wikiTitle: "長瀞", address: "秩父郡長瀞町長瀞", time: "10:50", stay: 40, memo: "荒川沿いに広がる、国指定の天然記念物の岩畳。", transit: { mode: "car", min: 25 } },
        { name: "長瀞ライン下り", wikiTitle: "長瀞ライン下り", address: "秩父郡長瀞町長瀞489-2", time: "11:40", stay: 50, memo: "荒川の渓谷美を、船頭の竿さばきとともに下る舟下り。", transit: { mode: "car", min: 8 }, fallbackLatLng: [36.1156, 139.1078] },
      ],
    ],
  },
  {
    title: "三峯神社の霧海と気運、秩父のパワースポットを巡る1泊2日",
    description: "「関東最強のパワースポット」とも呼ばれる三峯神社。標高1100mの山中に鎮座する神社まで足を延ばす、じっくり型のプランです。",
    nights: 1,
    prefectureName: "埼玉県",
    areaNames: ["秩父"],
    tagNames: ["絶景"],
    purposeNames: ["パワースポット", "神社"],
    days: [
      [
        { name: "三峯神社", wikiTitle: "三峯神社", address: "秩父市三峰298-1", time: "10:30", stay: 90, memo: "標高1100mの山中に鎮座する、狼を眷属とする古社。運が良ければ雲海も。" },
      ],
      [
        { name: "秩父ミューズパーク", wikiTitle: "秩父ミューズパーク", address: "秩父市久那2359", time: "9:30", stay: 70, memo: "音楽堂やスポーツ施設が集まる、緑豊かな広域公園。" },
        { name: "秩父まつり会館", wikiTitle: "秩父夜祭", address: "秩父市番場町2-8", time: "11:10", stay: 40, memo: "日本三大曳山祭の一つ、秩父夜祭の豪華な屋台を常設展示。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "羊山公園の芝桜と秩父の街、絶景フォトジェニック日帰りプラン",
    description: "一面ピンクに染まる芝桜で有名な羊山公園を中心に、秩父の街並みも楽しむ、写真映え重視のプランです（芝桜の見頃は例年4月中旬〜5月上旬）。",
    nights: 0,
    prefectureName: "埼玉県",
    areaNames: ["秩父"],
    tagNames: ["絶景"],
    purposeNames: ["花見・桜", "絶景・フォトスポット"],
    days: [
      [
        { name: "羊山公園", wikiTitle: "羊山公園", address: "秩父市大宮6360", time: "9:30", stay: 70, memo: "「芝桜の丘」が広がる、秩父を代表するフォトスポット。" },
        { name: "秩父神社", wikiTitle: "秩父神社", address: "秩父市番場町1-3", time: "11:00", stay: 40, memo: "羊山公園から街に戻り、秩父の総鎮守に参拝。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },

  // ============================================================
  // 千葉県 成田
  // ============================================================
  {
    title: "成田山新勝寺と表参道、定番の門前町さんぽ日帰りプラン",
    description: "1000年以上の歴史を持つ成田山新勝寺と、鰻の名店が並ぶ表参道。成田観光の王道を歩く日帰りプランです。",
    nights: 0,
    prefectureName: "千葉県",
    areaNames: ["成田"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺"],
    days: [
      [
        { name: "成田山表参道", wikiTitle: "成田山表参道", address: "成田市仲町", time: "9:30", stay: 50, memo: "鰻の名店や土産物店が並ぶ、成田山への参道。" },
        { name: "成田山新勝寺", wikiTitle: "成田山新勝寺", address: "成田市成田1", time: "10:30", stay: 60, memo: "厄除けで全国に知られる、真言宗智山派の大本山。" , transit: { mode: "walk", min: 10 } },
        { name: "成田山公園", wikiTitle: "成田山公園", address: "成田市成田", time: "11:50", stay: 50, memo: "新勝寺に隣接する、四季折々の自然が美しい庭園。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "航空科学博物館と展望デッキ、空港の街・成田を満喫するファミリープラン",
    description: "成田国際空港に隣接する航空科学博物館と、離着陸を間近で見られる展望デッキ。飛行機好き親子におすすめのプランです。",
    nights: 0,
    prefectureName: "千葉県",
    areaNames: ["成田"],
    tagNames: ["家族旅行"],
    purposeNames: ["美術館・博物館"],
    days: [
      [
        { name: "航空科学博物館", wikiTitle: "航空科学博物館", address: "山武郡芝山町岩山111-3", time: "9:30", stay: 100, memo: "実物のジェットエンジンや操縦体験もできる、航空専門の博物館。" },
        { name: "成田国際空港展望デッキ", wikiTitle: "成田国際空港", address: "成田市古込1-1", time: "11:40", stay: 60, memo: "離着陸する飛行機を間近で見られる、無料の展望デッキ。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "門前町の老舗鰻店めぐり、成田山グルメを満喫する1泊2日",
    description: "参道に軒を連ねる老舗鰻店を食べ比べながら、新勝寺の朝の勤行にも参加する、じっくり型の成田グルメ旅です。",
    nights: 1,
    prefectureName: "千葉県",
    areaNames: ["成田"],
    tagNames: ["グルメ"],
    purposeNames: ["お寺", "祭り・イベント"],
    days: [
      [
        { name: "成田山表参道", wikiTitle: "成田山表参道", address: "成田市仲町", time: "11:00", stay: 90, memo: "食べ比べを楽しみながら、老舗鰻店が並ぶ参道をゆっくり歩く。" },
        { name: "成田山新勝寺", wikiTitle: "成田山新勝寺", address: "成田市成田1", time: "13:00", stay: 60, memo: "満腹のあとは、広い境内をゆっくり参拝。", transit: { mode: "walk", min: 10 } },
      ],
      [
        { name: "成田山公園", wikiTitle: "成田山公園", address: "成田市成田", time: "8:30", stay: 60, memo: "2日目の朝、静かな時間帯に庭園を散策。" },
      ],
    ],
  },

  // ============================================================
  // 千葉県 房総
  // ============================================================
  {
    title: "鴨川シーワールドとシャチのパフォーマンス、家族で楽しむ房総日帰りプラン",
    description: "シャチのパフォーマンスで有名な鴨川シーワールドを中心に楽しむ、家族連れに人気の定番房総プランです。",
    nights: 0,
    prefectureName: "千葉県",
    areaNames: ["房総"],
    tagNames: ["家族旅行"],
    purposeNames: ["動物園・水族館"],
    days: [
      [
        { name: "鴨川シーワールド", wikiTitle: "鴨川シーワールド", address: "鴨川市東町1464-18", time: "9:30", stay: 180, memo: "シャチのダイナミックなパフォーマンスで有名な、房総を代表する水族館。" },
      ],
    ],
  },
  {
    title: "濃溝の滝と養老渓谷、房総の絶景自然を巡る1泊2日",
    description: "神秘的な「亀岩の洞窟」で有名な濃溝の滝や、渓谷美が広がる養老渓谷。房総半島の豊かな自然を巡るプランです。",
    nights: 1,
    prefectureName: "千葉県",
    areaNames: ["房総"],
    tagNames: ["絶景"],
    purposeNames: ["自然", "絶景・フォトスポット"],
    days: [
      [
        { name: "濃溝の滝（亀岩の洞窟）", wikiTitle: "亀岩の洞窟", address: "君津市笹1954", time: "10:00", stay: 50, memo: "SNSで話題になった、光と水が織りなす神秘的な景観。" },
        { name: "養老渓谷", wikiTitle: "養老渓谷", address: "夷隅郡大多喜町薬師", time: "11:30", stay: 70, memo: "房総随一の渓谷美。粟又の滝など見どころが点在する。", transit: { mode: "car", min: 30 } },
      ],
      [
        { name: "養老渓谷", wikiTitle: "養老渓谷", address: "夷隅郡大多喜町薬師", time: "9:00", stay: 60, memo: "2日目の朝、渓谷沿いの遊歩道をもう一度散策。" },
      ],
    ],
  },
  {
    title: "鋸山の地獄のぞきと日本寺、絶景とスリルを楽しむ房総日帰りプラン",
    description: "断崖絶壁から突き出た「地獄のぞき」で知られる鋸山。日本寺の百尺観音や大仏も巡る、スリルと絶景のプランです。",
    nights: 0,
    prefectureName: "千葉県",
    areaNames: ["房総"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "お寺"],
    days: [
      [
        { name: "鋸山ロープウェー", wikiTitle: "鋸山_(千葉県)", address: "富津市金谷", time: "9:30", stay: 20, memo: "山頂駅まで一気に登る、絶景への近道。" },
        { name: "地獄のぞき", wikiTitle: "鋸山_(千葉県)", address: "富津市金谷", time: "10:00", stay: 40, memo: "断崖絶壁から突き出た岩場からの、スリル満点の絶景。", transit: { mode: "other", min: 10 }, fallbackLatLng: [35.1917, 139.8408] },
        { name: "日本寺（鋸山）", wikiTitle: "日本寺_(鋸南町)", address: "安房郡鋸南町鋸山", time: "11:00", stay: 60, memo: "日本一の大きさを誇る、百尺観音や大仏で知られる古刹。", transit: { mode: "other", min: 20 } },
      ],
    ],
  },

  // ============================================================
  // 茨城県 大洗
  // ============================================================
  {
    title: "大洗磯前神社と水族館、海と生き物を満喫する大洗日帰りプラン",
    description: "太平洋の海中に立つ鳥居で有名な大洗磯前神社と、サメの飼育種類数日本一を誇るアクアワールド大洗。大洗の海の魅力を凝縮したプランです。",
    nights: 0,
    prefectureName: "茨城県",
    areaNames: ["大洗"],
    tagNames: ["海・リゾート", "家族旅行"],
    purposeNames: ["動物園・水族館", "絶景・フォトスポット"],
    days: [
      [
        { name: "大洗磯前神社", wikiTitle: "大洗磯前神社", address: "東茨城郡大洗町磯浜町6890", time: "9:30", stay: 40, memo: "太平洋に面した海中の鳥居で有名な、絶景の神社。" },
        { name: "アクアワールド茨城県大洗水族館", wikiTitle: "アクアワールド茨城県大洗水族館", address: "東茨城郡大洗町磯浜町8252-3", time: "10:30", stay: 100, memo: "サメの飼育種類数日本一を誇る、大規模な水族館。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "大洗サンビーチとめんたいパーク、海水浴とグルメの1泊2日",
    description: "白い砂浜が続く大洗サンビーチでのんびり過ごし、めんたいパークで明太子づくしのグルメを楽しむ、リゾート感あふれるプランです。",
    nights: 1,
    prefectureName: "茨城県",
    areaNames: ["大洗"],
    tagNames: ["海・リゾート", "グルメ"],
    purposeNames: ["ビーチ・海水浴"],
    days: [
      [
        { name: "大洗サンビーチ", wikiTitle: "大洗サンビーチ", address: "東茨城郡大洗町磯浜町", time: "10:00", stay: 90, memo: "白い砂浜が続く、関東でも人気の海水浴場。" },
        { name: "めんたいパーク大洗", wikiTitle: "めんたいパーク大洗", address: "東茨城郡大洗町磯浜町8074-127", time: "12:00", stay: 60, memo: "明太子の製造工程を見学でき、試食も楽しめる工場見学施設。", transit: { mode: "car", min: 10 } },
      ],
      [
        { name: "大洗磯前神社", wikiTitle: "大洗磯前神社", address: "東茨城郡大洗町磯浜町6890", time: "9:00", stay: 40, memo: "2日目の朝は、日の出とともに海中鳥居を参拝。" },
      ],
    ],
  },
  {
    title: "大洗港のしらす漁と海鮮グルメ、地元の味を楽しむ日帰りプラン",
    description: "新鮮なしらすや海の幸が並ぶ大洗の漁港グルメを堪能する、食いしん坊向けの日帰りプランです。",
    nights: 0,
    prefectureName: "茨城県",
    areaNames: ["大洗"],
    tagNames: ["グルメ"],
    purposeNames: ["ビーチ・海水浴"],
    days: [
      [
        { name: "大洗海岸", wikiTitle: "大洗町", address: "東茨城郡大洗町磯浜町", time: "10:00", stay: 50, memo: "漁港近くの海岸を散策し、潮風を感じながらスタート。" },
        { name: "アクアワールド茨城県大洗水族館", wikiTitle: "アクアワールド茨城県大洗水族館", address: "東茨城郡大洗町磯浜町8252-3", time: "11:10", stay: 90, memo: "散策のあとは水族館で、大洗の海の生き物をじっくり観察。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-07" });
