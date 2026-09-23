/**
 * 公式しおりデータ登録・再開バッチ4（docs/specs/20260924-shiori-data-resume.md）
 * 公開2件のエリアに、既存と被らないコンセプトの1件を追加する。
 * 対象: 東京都 浅草・上野／渋谷・原宿／お台場・臨海副都心／吉祥寺・三鷹、福岡県 福岡市内／太宰府／門司港
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-04-tokyo-fukuoka.ts
 *   登録モード: npx tsx prisma/seed-areas-04-tokyo-fukuoka.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // 既存2件（雷門・スカイツリー定番／参道とパンダ）とは別に、水辺と裏路地の下町散策視点を追加
  {
    title: "隅田川と谷中銀座、下町の裏路地を歩く浅草・上野さんぽプラン",
    description: "定番の雷門や仲見世通りから少し離れて、隅田川沿いの公園や、猫の街としても知られる谷中銀座商店街を歩く、しっとり下町散策プランです。",
    nights: 0,
    prefectureName: "東京都",
    areaNames: ["浅草・上野"],
    tagNames: ["定番観光"],
    purposeNames: ["自然", "美術館・博物館"],
    days: [
      [
        { name: "隅田公園", wikiTitle: "隅田公園", address: "台東区花川戸1丁目", time: "9:30", stay: 40, memo: "隅田川沿いに広がる桜の名所。スカイツリーの眺めも良い。" },
        { name: "上野東照宮", wikiTitle: "上野東照宮", address: "台東区上野公園9-88", time: "10:40", stay: 30, memo: "金色殿で知られる、徳川家康を祀る絢爛豪華な神社。", transit: { mode: "train", min: 20, line: "東京メトロ銀座線" } },
        { name: "不忍池", wikiTitle: "不忍池", address: "台東区上野公園", time: "11:20", stay: 25, memo: "夏には一面に蓮の花が咲く、上野公園内の池。", transit: { mode: "walk", min: 10 } },
        { name: "谷中銀座商店街", wikiTitle: "谷中銀座商店街", address: "台東区谷中3丁目", time: "12:12", stay: 60, memo: "昔ながらの下町情緒が残る、猫の街としても有名な商店街。", transit: { mode: "walk", min: 22 }, fallbackLatLng: [35.7255, 139.7669] },
      ],
    ],
  },
  // 既存2件（スクランブル交差点定番／渋谷スカイと明治神宮）とは別に、大人のアート・ショッピング視点を追加
  {
    title: "表参道と根津美術館、大人のショッピング&アートさんぽプラン",
    description: "若者文化の渋谷・原宿から少し離れて、けやき並木の美しい表参道や、名庭園を持つ美術館を巡る、落ち着いた大人向けのプランです。",
    nights: 0,
    prefectureName: "東京都",
    areaNames: ["渋谷・原宿"],
    tagNames: ["定番観光"],
    purposeNames: ["ショッピング", "美術館・博物館"],
    days: [
      [
        { name: "根津美術館", wikiTitle: "根津美術館", address: "港区南青山6丁目5-1", time: "9:30", stay: 60, memo: "表参道近くにある、日本・東洋の古美術品と名庭園を持つ美術館。" },
        { name: "表参道", wikiTitle: "表参道", address: "渋谷区神宮前", time: "10:54", stay: 60, memo: "けやき並木が美しい、ハイブランドが立ち並ぶ通り。", transit: { mode: "walk", min: 14 } },
        { name: "キャットストリート", wikiTitle: "キャットストリート", address: "渋谷区神宮前", time: "12:10", stay: 40, memo: "セレクトショップが並ぶ、原宿と渋谷をつなぐ裏通り。", transit: { mode: "walk", min: 10 } },
        { name: "渋谷ヒカリエ", wikiTitle: "渋谷ヒカリエ", address: "渋谷区渋谷2丁目21-1", time: "13:10", stay: 40, memo: "アートやカルチャー発信拠点も併設する複合商業施設で締めくくる。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  // 既存2件（レインボーブリッジ・ガンダム定番／デジタルアート）とは別に、科学・市場のファミリー視点を追加
  {
    title: "科学未来館と豊洲市場、家族で学んで食べるお台場ベイエリアプラン",
    description: "最先端の科学技術を体感できる日本科学未来館と、新鮮な魚介が味わえる豊洲市場。学びと食を両方楽しめる、家族連れにおすすめのプランです。",
    nights: 0,
    prefectureName: "東京都",
    areaNames: ["お台場・臨海副都心"],
    tagNames: ["家族旅行"],
    purposeNames: ["美術館・博物館", "動物園・水族館"],
    days: [
      [
        { name: "日本科学未来館", wikiTitle: "日本科学未来館", address: "江東区青海2丁目3-6", time: "9:30", stay: 100, memo: "最先端の科学技術を体感できる、宇宙飛行士も館長を務めた科学館。" },
        { name: "東京ビッグサイト", wikiTitle: "東京ビッグサイト", address: "江東区有明3丁目11-1", time: "11:30", stay: 20, memo: "逆さピラミッドの外観が印象的な、国内最大級の展示場を外から見学。", transit: { mode: "car", min: 8 } },
        { name: "豊洲市場", wikiTitle: "豊洲市場", address: "江東区豊洲6丁目6-1", time: "12:30", stay: 70, memo: "新鮮な魚介と競りの見学が楽しめる、東京の台所でランチ。", transit: { mode: "car", min: 15 } },
        { name: "潮風公園", wikiTitle: "潮風公園", address: "品川区東八潮1-1", time: "14:00", stay: 30, memo: "海沿いを散策できる、スポーツやピクニックが楽しめる公園。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  // 既存2件（井の頭公園・ジブリ定番／自然と文学のんびり）とは別に、商店街グルメ視点を追加
  {
    title: "ハモニカ横丁と吉祥寺サンロード、食べ歩きで楽しむ商店街さんぽ",
    description: "定番の公園散策から少し離れて、狭い路地に飲食店がひしめくハモニカ横丁や、賑やかな商店街を食べ歩く、グルメ重視のプランです。",
    nights: 0,
    prefectureName: "東京都",
    areaNames: ["吉祥寺・三鷹"],
    tagNames: ["家族旅行"],
    purposeNames: ["ショッピング"],
    days: [
      [
        { name: "武蔵野八幡宮", wikiTitle: "武蔵野八幡宮", address: "武蔵野市吉祥寺本町1丁目1-25", time: "10:00", stay: 25, memo: "吉祥寺の総鎮守として親しまれる、静かな杜の神社。" },
        { name: "吉祥寺サンロード商店街", wikiTitle: "吉祥寺サンロード商店街", address: "武蔵野市吉祥寺本町1丁目", time: "10:40", stay: 60, memo: "吉祥寺駅前から続く、アーケード付きの商店街。", transit: { mode: "walk", min: 5 } },
        { name: "ハモニカ横丁", wikiTitle: "ハモニカ横丁", address: "武蔵野市吉祥寺本町1丁目1", time: "11:50", stay: 70, memo: "戦後の闇市の名残を残す、狭い路地に飲食店が並ぶ一角でランチ。", transit: { mode: "walk", min: 5 } },
      ],
    ],
  },
  // 既存2件（屋台・タワー定番／櫛田神社と中洲）とは別に、公園・離島の自然視点を追加
  {
    title: "大濠公園と能古島、福岡の自然と離島をのんびり楽しむプラン",
    description: "定番の屋台街から少し離れて、大きな池を囲む大濠公園や、フェリーで渡る離島・能古島でのんびり自然を満喫するプランです。",
    nights: 0,
    prefectureName: "福岡県",
    areaNames: ["福岡市内"],
    tagNames: ["グルメ"],
    purposeNames: ["自然", "離島"],
    days: [
      [
        { name: "大濠公園", wikiTitle: "大濠公園", address: "福岡市中央区大濠公園1-2", time: "9:30", stay: 60, memo: "大きな池を中心に整備された、市民の憩いの都市公園。" },
        { name: "福岡市博物館", wikiTitle: "福岡市博物館", address: "福岡市早良区百道浜3丁目1-1", time: "11:00", stay: 50, memo: "国宝「金印」を収蔵する、福岡の歴史と文化を伝える博物館。", transit: { mode: "car", min: 20 } },
        { name: "ベイサイドプレイス博多", wikiTitle: "ベイサイドプレイス博多", address: "福岡市博多区築港本町13-6", time: "12:20", stay: 40, memo: "能古島行きの船が出る、博多港のウォーターフロント施設でランチ。", transit: { mode: "car", min: 25 } },
        { name: "能古島", wikiTitle: "能古島", address: "福岡市西区能古", time: "13:20", stay: 90, memo: "博多湾に浮かぶ、花と自然が楽しめる離島。フェリーで10分。", transit: { mode: "other", min: 10 } },
      ],
    ],
  },
  // 既存2件（天満宮参道／天満宮と博物館）とは別に、パワースポット・自然視点を追加
  {
    title: "竈門神社と光明禅寺、太宰府の隠れたパワースポットを巡るプラン",
    description: "定番の天満宮参拝に加えて、縁結びで人気の竈門神社や、苔むした庭が美しい光明禅寺など、静かな太宰府の魅力を発見するプランです。",
    nights: 0,
    prefectureName: "福岡県",
    areaNames: ["太宰府"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "パワースポット"],
    days: [
      [
        { name: "竈門神社", wikiTitle: "竈門神社", address: "太宰府市内山883", time: "9:30", stay: 50, memo: "宝満山の麓に鎮座する、縁結びで人気の神社。" },
        { name: "太宰府天満宮", wikiTitle: "太宰府天満宮", address: "太宰府市宰府4丁目7-1", time: "10:50", stay: 50, memo: "参拝のあと、奥の天開稲荷社まで足を延ばす。", transit: { mode: "car", min: 10 } },
        { name: "光明禅寺", wikiTitle: "光明禅寺", address: "太宰府市宰府2丁目16-1", time: "12:10", stay: 30, memo: "「苔寺」とも呼ばれる、枯山水庭園が美しい禅寺。", transit: { mode: "walk", min: 10 } },
        { name: "坂本八幡宮", wikiTitle: "坂本八幡宮", address: "太宰府市坂本3丁目14-23", time: "12:55", stay: 25, memo: "元号「令和」の典拠となった万葉集の梅花の宴の舞台。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  // 既存2件（レトロ洋館定番／関門海峡絶景）とは別に、鉄道・アート視点を追加
  {
    title: "旧門司三井倶楽部と出光美術館、大正ロマン建築をめぐるアート散策",
    description: "門司港レトロの中でも、歴史的建築と美術館に焦点を当てたプラン。はね橋の可動を見られるタイミングも狙い目です。",
    nights: 0,
    prefectureName: "福岡県",
    areaNames: ["門司港"],
    tagNames: ["絶景"],
    purposeNames: ["美術館・博物館", "鉄道旅"],
    days: [
      [
        { name: "門司港駅", wikiTitle: "門司港駅", address: "北九州市門司区西海岸1丁目5-31", time: "9:30", stay: 30, memo: "国の重要文化財に指定された、ネオ・ルネサンス様式の木造駅舎。" },
        { name: "旧門司三井倶楽部", wikiTitle: "旧門司三井倶楽部", address: "北九州市門司区港町7-1", time: "10:15", stay: 40, memo: "アインシュタインも宿泊した、大正期の社交倶楽部建築。", transit: { mode: "walk", min: 5 } },
        { name: "出光美術館（門司）", wikiTitle: "出光美術館_(門司)", address: "北九州市門司区東港町2-3", time: "11:10", stay: 50, memo: "出光興産創業者のコレクションを展示する美術館。", transit: { mode: "walk", min: 15 } },
        { name: "ブルーウィングもじ", wikiTitle: "ブルーウィングもじ", address: "北九州市門司区港町4", time: "12:15", stay: 30, memo: "日本最大級の歩行者専用はね橋。1日数回跳ね上がる（時刻は公式サイトで確認）。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-04" });
