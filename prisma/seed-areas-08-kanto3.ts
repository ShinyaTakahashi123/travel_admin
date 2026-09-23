/**
 * 公式しおりデータ登録・再開バッチ8（docs/specs/20260924-shiori-data-resume.md）
 * 公開0件エリア、関東地方の続き（最後）。
 * 対象: 栃木県 足利市・那須 / 群馬県 伊香保温泉・高崎 / 茨城県 つくば
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-08-kanto3.ts
 *   登録モード: npx tsx prisma/seed-areas-08-kanto3.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 栃木県 足利市
  // ============================================================
  {
    title: "日本最古の学校・足利学校と鑁阿寺、定番の足利さんぽ日帰りプラン",
    description: "日本最古の学校といわれる足利学校と、国宝の本堂を持つ鑁阿寺。歴史ある足利の中心部を巡る定番の日帰りプランです。",
    nights: 0,
    prefectureName: "栃木県",
    areaNames: ["足利市"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "城・史跡"],
    days: [
      [
        { name: "足利学校", wikiTitle: "足利学校", address: "足利市昌平町2338", time: "9:30", stay: 50, memo: "日本最古の学校といわれる史跡。江戸時代には「坂東の学校」と称された。" },
        { name: "鑁阿寺", wikiTitle: "鑁阿寺", address: "足利市家富町2220", time: "10:40", stay: 40, memo: "足利氏の館跡に建つ、国宝の本堂を持つ古刹。", transit: { mode: "walk", min: 5 } },
        { name: "足利公園", wikiTitle: "足利市", address: "足利市家富町", time: "11:35", stay: 30, memo: "織姫山の麓に広がる、市民に親しまれる公園。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "あしかがフラワーパークの大藤、絶景の花さんぽ日帰りプラン",
    description: "「世界の絶景」にも選ばれた、あしかがフラワーパークの大藤棚。四季を通じて花に彩られる、フォトジェニックなプランです。",
    nights: 0,
    prefectureName: "栃木県",
    areaNames: ["足利市"],
    tagNames: ["絶景"],
    purposeNames: ["花見・桜", "絶景・フォトスポット"],
    days: [
      [
        { name: "あしかがフラワーパーク", wikiTitle: "あしかがフラワーパーク", address: "足利市迫間町607", time: "9:30", stay: 150, memo: "樹齢150年を超える大藤で世界的に有名な花のテーマパーク（藤の見頃は例年4月中旬〜5月上旬）。" },
      ],
    ],
  },
  {
    title: "織姫神社の夜景と足利の街並み、大人の足利1泊2日",
    description: "縁結びの神社として人気の織姫神社から、夜景まで。定番観光に加えて、足利の街並みをじっくり楽しむ1泊2日プランです。",
    nights: 1,
    prefectureName: "栃木県",
    areaNames: ["足利市"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "夜景"],
    days: [
      [
        { name: "織姫神社", wikiTitle: "織姫神社", address: "足利市西宮町3889", time: "10:00", stay: 40, memo: "縁結びの神社として人気。足利の街を見下ろす高台に鎮座する。" },
        { name: "鑁阿寺", wikiTitle: "鑁阿寺", address: "足利市家富町2220", time: "11:10", stay: 40, memo: "国宝の本堂を持つ、足利氏ゆかりの古刹。", transit: { mode: "car", min: 10 } },
      ],
      [
        { name: "足利学校", wikiTitle: "足利学校", address: "足利市昌平町2338", time: "9:30", stay: 50, memo: "2日目の朝、静かな時間帯に日本最古の学校をじっくり見学。" },
      ],
    ],
  },

  // ============================================================
  // 栃木県 那須
  // ============================================================
  {
    title: "那須どうぶつ王国で動物とふれあう、家族で楽しむ那須日帰りプラン",
    description: "カピバラやスコティッシュフォールドなど、様々な動物とふれあえる那須どうぶつ王国。家族連れに人気の定番プランです。",
    nights: 0,
    prefectureName: "栃木県",
    areaNames: ["那須"],
    tagNames: ["家族旅行"],
    purposeNames: ["動物園・水族館"],
    days: [
      [
        { name: "那須どうぶつ王国", wikiTitle: "那須どうぶつ王国", address: "那須郡那須町大島1042-1", time: "9:30", stay: 180, memo: "カピバラやスコティッシュフォールドなど、様々な動物と間近でふれあえるテーマパーク。" },
      ],
    ],
  },
  {
    title: "茶臼岳ロープウェイと殺生石、那須高原の絶景と伝説を巡るプラン",
    description: "那須連山の主峰・茶臼岳へロープウェイで登り、九尾の狐伝説が残る殺生石を巡る、那須高原の自然と伝説を楽しむプランです。",
    nights: 0,
    prefectureName: "栃木県",
    areaNames: ["那須"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "自然"],
    days: [
      [
        { name: "那須ロープウェイ", wikiTitle: "那須ロープウェイ", address: "那須郡那須町大字湯本",  time: "9:30", stay: 70, memo: "那須連山の主峰・茶臼岳の9合目まで、約4分の空中散歩。" },
        { name: "殺生石", wikiTitle: "殺生石", address: "那須郡那須町大字湯本", time: "11:10", stay: 30, memo: "九尾の狐伝説で知られる、硫黄の香り漂う溶岩地帯。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "那須平成の森とフラワーワールド、高原リゾートでのんびり1泊2日",
    description: "皇室ゆかりの那須平成の森で森林浴を楽しみ、那須フラワーワールドで花畑を満喫する、高原リゾートらしいゆったりプランです。",
    nights: 1,
    prefectureName: "栃木県",
    areaNames: ["那須"],
    tagNames: ["家族旅行"],
    purposeNames: ["自然", "花見・桜"],
    days: [
      [
        { name: "那須平成の森", wikiTitle: "那須平成の森", address: "那須郡那須町高久丙3254", time: "10:00", stay: 90, memo: "皇室から那須町に下賜された、豊かな森を歩けるフィールド。" },
      ],
      [
        { name: "那須フラワーワールド", wikiTitle: "那須フラワーワールド", address: "那須郡那須町高久甲5341", time: "9:30", stay: 90, memo: "那須連山を背景に、四季折々の花々が咲き誇る花畑（見頃は例年6月〜9月）。" },
      ],
    ],
  },

  // ============================================================
  // 群馬県 伊香保温泉
  // ============================================================
  {
    title: "石段街と伊香保神社、定番の伊香保温泉さんぽ日帰りプラン",
    description: "365段の石段が続く石段街と、その頂に鎮座する伊香保神社。伊香保温泉の中心部を歩く、定番の日帰りプランです。",
    nights: 0,
    prefectureName: "群馬県",
    areaNames: ["伊香保温泉"],
    tagNames: ["温泉"],
    purposeNames: ["温泉", "神社"],
    days: [
      [
        { name: "石段街", wikiTitle: "伊香保温泉", address: "渋川市伊香保町伊香保", time: "10:00", stay: 60, memo: "365段の石段の両側に、土産物店や射的場が並ぶ温泉街のシンボル。" },
        { name: "伊香保神社", wikiTitle: "伊香保神社", address: "渋川市伊香保町伊香保1", time: "11:10", stay: 30, memo: "石段街の頂に鎮座する、温泉街を見守る古社。", transit: { mode: "walk", min: 10 } },
        { name: "河鹿橋", wikiTitle: "河鹿橋", address: "渋川市伊香保町伊香保", time: "11:50", stay: 20, memo: "朱塗りの太鼓橋。紅葉の名所としても知られる。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "伊香保グリーン牧場で動物とふれあう、家族で楽しむ高原プラン",
    description: "羊やアルパカなどの動物とふれあえる伊香保グリーン牧場を中心に、高原の爽やかな空気を満喫する、家族向けのプランです。",
    nights: 0,
    prefectureName: "群馬県",
    areaNames: ["伊香保温泉"],
    tagNames: ["家族旅行"],
    purposeNames: ["動物園・水族館", "高原・避暑"],
    days: [
      [
        { name: "伊香保グリーン牧場", wikiTitle: "伊香保グリーン牧場", address: "渋川市金井2844-1", time: "9:30", stay: 150, memo: "羊の大行進やアルパカとのふれあいが楽しめる、高原の牧場。" },
      ],
    ],
  },
  {
    title: "水沢うどんと石段の湯、伊香保温泉グルメ&湯めぐり1泊2日",
    description: "名物の水沢うどんを味わい、宿では石段街の外湯を楽しむ、伊香保温泉のグルメと温泉を両方満喫する1泊2日プランです。",
    nights: 1,
    prefectureName: "群馬県",
    areaNames: ["伊香保温泉"],
    tagNames: ["温泉", "グルメ"],
    purposeNames: ["温泉"],
    days: [
      [
        { name: "水沢うどん街", wikiTitle: "水沢うどん", address: "渋川市伊香保町水沢", time: "11:00", stay: 60, memo: "日本三大うどんの一つ、水沢うどんの老舗が集まる街道。", fallbackLatLng: [36.4903, 138.9433] },
        { name: "石段街", wikiTitle: "伊香保温泉", address: "渋川市伊香保町伊香保", time: "13:00", stay: 70, memo: "うどんのあとは、石段街をゆっくり散策してお土産探し。", transit: { mode: "car", min: 15 } },
      ],
      [
        { name: "河鹿橋", wikiTitle: "河鹿橋", address: "渋川市伊香保町伊香保", time: "9:30", stay: 30, memo: "2日目の朝、静かな朱色の橋を眺めながら散策。" },
      ],
    ],
  },

  // ============================================================
  // 群馬県 高崎
  // ============================================================
  {
    title: "高崎白衣大観音と少林山達磨寺、定番の高崎パワースポット日帰りプラン",
    description: "高崎のシンボル・白衣大観音と、だるま発祥の寺として知られる少林山達磨寺。高崎の信仰スポットを巡る定番プランです。",
    nights: 0,
    prefectureName: "群馬県",
    areaNames: ["高崎"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "パワースポット"],
    days: [
      [
        { name: "高崎白衣大観音", wikiTitle: "高崎白衣大観音", address: "高崎市石原町2710-1", time: "9:30", stay: 50, memo: "高さ41.8m、高崎のシンボルとして親しまれる巨大観音像。胎内巡りも可能。" },
        { name: "少林山達磨寺", wikiTitle: "達磨寺_(高崎市)", address: "高崎市鼻高町296", time: "11:00", stay: 40, memo: "縁起だるま発祥の寺として知られる、黄檗宗の古刹。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "群馬県立近代美術館と高崎城址、アートと歴史を楽しむ日帰りプラン",
    description: "緑豊かな群馬の森に建つ近代美術館と、高崎城の面影が残る城址公園。落ち着いた雰囲気で高崎の文化を楽しむプランです。",
    nights: 0,
    prefectureName: "群馬県",
    areaNames: ["高崎"],
    tagNames: ["定番観光"],
    purposeNames: ["美術館・博物館", "城・史跡"],
    days: [
      [
        { name: "群馬県立近代美術館", wikiTitle: "群馬県立近代美術館", address: "高崎市綿貫町992-1", time: "9:30", stay: 70, memo: "「群馬の森」の中に建つ、国内外の近代美術を紹介する美術館。" },
        { name: "高崎城址", wikiTitle: "高崎城", address: "高崎市高松町", time: "11:20", stay: 30, memo: "乾櫓や東門が復元された、高崎城の面影を伝える城址公園。", transit: { mode: "car", min: 20 } },
      ],
    ],
  },
  {
    title: "だるま絵付け体験と白衣大観音、高崎の伝統工芸を楽しむ1泊2日",
    description: "高崎名物・だるまの絵付け体験に挑戦し、白衣大観音にお参りする、ものづくりと信仰を楽しむじっくり型のプランです。",
    nights: 1,
    prefectureName: "群馬県",
    areaNames: ["高崎"],
    tagNames: ["定番観光"],
    purposeNames: ["ものづくり体験", "パワースポット"],
    days: [
      [
        { name: "少林山達磨寺", wikiTitle: "達磨寺_(高崎市)", address: "高崎市鼻高町296", time: "10:00", stay: 60, memo: "だるま発祥の寺で、絵付け体験にも挑戦（要予約、体験内容は公式サイトで確認）。" },
        { name: "高崎白衣大観音", wikiTitle: "高崎白衣大観音", address: "高崎市石原町2710-1", time: "12:00", stay: 50, memo: "午後は高崎のシンボル・白衣大観音へ。", transit: { mode: "car", min: 15 } },
      ],
      [
        { name: "群馬県立近代美術館", wikiTitle: "群馬県立近代美術館", address: "高崎市綿貫町992-1", time: "9:30", stay: 60, memo: "2日目は緑豊かな公園内の美術館でゆっくり過ごす。" },
      ],
    ],
  },

  // ============================================================
  // 茨城県 つくば
  // ============================================================
  {
    title: "筑波山ロープウェイと筑波山神社、定番のつくば絶景日帰りプラン",
    description: "「西の富士、東の筑波」と称される筑波山。ロープウェイで山頂へ登り、麓の筑波山神社にも参拝する定番プランです。",
    nights: 0,
    prefectureName: "茨城県",
    areaNames: ["つくば"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "神社"],
    days: [
      [
        { name: "筑波山神社", wikiTitle: "筑波山神社", address: "つくば市筑波1", time: "9:30", stay: 40, memo: "筑波山を御神体とする、関東屈指のパワースポット。" },
        { name: "筑波山ロープウェイ", wikiTitle: "筑波山ロープウェイ", address: "つくば市筑波", time: "10:30", stay: 90, memo: "女体山頂まで一気に登る、関東平野を一望できる空中散歩。", transit: { mode: "car", min: 8 } },
      ],
    ],
  },
  {
    title: "筑波宇宙センターとエキスポセンター、科学のまちつくばを学ぶ日帰り旅",
    description: "JAXAの筑波宇宙センターで本物のロケットを見学し、エキスポセンターで最新の科学技術を体験する、学びの多いプランです。",
    nights: 0,
    prefectureName: "茨城県",
    areaNames: ["つくば"],
    tagNames: ["家族旅行"],
    purposeNames: ["美術館・博物館"],
    days: [
      [
        { name: "筑波宇宙センター", wikiTitle: "筑波宇宙センター", address: "つくば市千現2丁目1-1", time: "9:30", stay: 90, memo: "JAXAの中核施設。実物大のロケットや「きぼう」の実験棟が見学できる。" },
        { name: "つくばエキスポセンター", wikiTitle: "つくばエキスポセンター", address: "つくば市吾妻2丁目9", time: "11:30", stay: 70, memo: "実物大のH-Ⅱロケットが目印の、科学館。プラネタリウムも人気。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "筑波山でご来光を、山頂ホテルに泊まる絶景1泊2日プラン",
    description: "筑波山の山頂近くに宿泊し、朝は雲海やご来光を狙う。夜と朝、両方の絶景を楽しむ、ワンランク上のつくばプランです。",
    nights: 1,
    prefectureName: "茨城県",
    areaNames: ["つくば"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "星空観察"],
    days: [
      [
        { name: "筑波山ケーブルカー", wikiTitle: "筑波山ケーブルカー", address: "つくば市筑波", time: "14:00", stay: 30, memo: "男体山側の山頂駅まで登るケーブルカーに乗車。" },
        { name: "筑波山神社", wikiTitle: "筑波山神社", address: "つくば市筑波1", time: "15:00", stay: 40, memo: "下山して、麓の神社にも参拝。", transit: { mode: "walk", min: 30 } },
      ],
      [
        { name: "筑波山ロープウェイ", wikiTitle: "筑波山ロープウェイ", address: "つくば市筑波", time: "5:30", stay: 60, memo: "早朝、ご来光や雲海を求めて女体山頂へ。天候により見られないことがある。" },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-08" });
