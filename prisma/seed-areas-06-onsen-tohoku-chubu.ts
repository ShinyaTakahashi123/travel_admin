/**
 * 公式しおりデータ登録・再開バッチ6（docs/specs/20260924-shiori-data-resume.md）
 * 紅葉・冬特集で各1件のみ公開だったエリアに、コンセプトが重ならない2件ずつを追加する。
 * 対象: 兵庫県 城崎温泉 / 山形県 山形市内・蔵王温泉・銀山温泉 / 岐阜県 高山・白川郷 / 群馬県 草津温泉 / 青森県 十和田・奥入瀬
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-06-onsen-tohoku-chubu.ts
 *   登録モード: npx tsx prisma/seed-areas-06-onsen-tohoku-chubu.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 兵庫県 城崎温泉（既存: 外湯めぐりと松葉ガニ、冬の1泊2日）
  // ============================================================
  {
    title: "柳並木と七つの外湯、城崎温泉ゆかたさんぽ日帰りプラン",
    description: "大谿川沿いの柳並木を眺めながら、ゆかたと下駄で外湯を巡る、城崎温泉の定番の楽しみ方を凝縮した日帰りプランです。",
    nights: 0,
    prefectureName: "兵庫県",
    areaNames: ["城崎温泉"],
    tagNames: ["温泉"],
    purposeNames: ["温泉"],
    days: [
      [
        { name: "御所の湯", wikiTitle: "城崎温泉", address: "豊岡市城崎町湯島", time: "10:00", stay: 60, memo: "城崎温泉を代表する外湯。京都御所を思わせる優雅な建物が特徴。", fallbackLatLng: [35.6256, 134.8153] },
        { name: "城崎温泉ロープウェイ", wikiTitle: "城崎温泉ロープウェイ", address: "豊岡市城崎町湯島806-1", time: "11:30", stay: 60, memo: "温泉街を見下ろす大師山山頂まで、空中散歩を楽しめる。", transit: { mode: "car", min: 8 } },
        { name: "一の湯", wikiTitle: "城崎温泉", address: "豊岡市城崎町湯島", time: "13:10", stay: 50, memo: "洞窟風呂が名物の外湯。歌舞伎座風の外観も見どころ。", transit: { mode: "walk", min: 20 }, fallbackLatLng: [35.6247, 134.8161] },
      ],
    ],
  },
  {
    title: "大師山温泉寺と玄武洞、城崎の自然とパワースポット1泊2日",
    description: "ロープウェイで大師山山頂の温泉寺へお参りし、玄武洞公園で柱状節理の絶景を楽しむ。温泉街だけでは味わえない城崎の自然を巡るプランです。",
    nights: 1,
    prefectureName: "兵庫県",
    areaNames: ["城崎温泉"],
    tagNames: ["絶景"],
    purposeNames: ["パワースポット", "自然"],
    days: [
      [
        { name: "城崎温泉ロープウェイ", wikiTitle: "城崎温泉ロープウェイ", address: "豊岡市城崎町湯島806-1", time: "10:00", stay: 20, memo: "大師山山頂へ向かうロープウェイに乗車。" },
        { name: "温泉寺（城崎）", wikiTitle: "温泉寺_(豊岡市)", address: "豊岡市城崎町湯島985", time: "10:30", stay: 40, memo: "山の中腹に建つ、城崎温泉発祥ゆかりの古刹。", transit: { mode: "other", min: 10 } },
        { name: "まんだら湯", wikiTitle: "城崎温泉", address: "豊岡市城崎町湯島", time: "12:00", stay: 50, memo: "下山後、こぢんまりとした趣ある外湯でひと休み。", transit: { mode: "other", min: 30 }, fallbackLatLng: [35.6262, 134.8158] },
      ],
      [
        { name: "玄武洞公園", wikiTitle: "玄武洞", address: "豊岡市赤石1362-1", time: "9:30", stay: 60, memo: "柱状節理の岩肌が広がる、国の天然記念物の洞窟群。" },
      ],
    ],
  },

  // ============================================================
  // 山形県 山形市内（既存: 雪の山寺と銀山温泉の夜、1泊2日）
  // ============================================================
  {
    title: "霞城公園と文翔館、山形市内の歴史建築を巡る定番日帰りプラン",
    description: "山形城跡の霞城公園と、大正ロマンあふれる旧県庁舎・文翔館。山形市内に残る歴史的な建物を巡る定番プランです。",
    nights: 0,
    prefectureName: "山形県",
    areaNames: ["山形市内"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "美術館・博物館"],
    days: [
      [
        { name: "霞城公園", wikiTitle: "山形城", address: "山形市霞城町1", time: "9:30", stay: 60, memo: "山形城跡に整備された公園。桜の名所としても知られる。" },
        { name: "山形県郷土館（文翔館）", wikiTitle: "山形県郷土館文翔館", address: "山形市旅篭町3丁目4-51", time: "10:50", stay: 50, memo: "大正時代の洋風建築。旧県庁舎・県会議事堂を復元・公開。", transit: { mode: "walk", min: 15 } },
        { name: "山形美術館", wikiTitle: "山形美術館", address: "山形市大手町1-63", time: "12:00", stay: 50, memo: "郷土ゆかりの作家の作品を中心に展示する美術館。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "山寺の千段石段と門前そば、山形の信仰と味を楽しむ日帰り旅",
    description: "雪のない季節でも見応えのある、山寺（立石寺）の千段の石段。参拝のあとは門前で名物の板そばを味わう、じっくり型のプランです。",
    nights: 0,
    prefectureName: "山形県",
    areaNames: ["山形市内"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "パワースポット"],
    days: [
      [
        { name: "山寺（立石寺）", wikiTitle: "立石寺", address: "山形市山寺4456-1", time: "9:30", stay: 120, memo: "松尾芭蕉も訪れた、断崖に建つ古刹。千段の石段を登り、奥之院を目指す。" },
        { name: "山寺日枝神社", wikiTitle: "立石寺", address: "山形市山寺", time: "12:01", stay: 20, memo: "山寺の麓に鎮座する、地域の鎮守社。", transit: { mode: "walk", min: 11 }, fallbackLatLng: [38.3167, 140.4364] },
      ],
    ],
  },

  // ============================================================
  // 山形県 蔵王温泉（既存: 樹氷原へロープウェイ、冬の日帰り）
  // ============================================================
  {
    title: "新緑の蔵王ロープウェイと大露天風呂、グリーンシーズンの蔵王日帰りプラン",
    description: "樹氷だけじゃない蔵王の魅力。新緑や高山植物が広がる夏山リフトの空中散歩と、開放感あふれる大露天風呂を楽しむプランです。",
    nights: 0,
    prefectureName: "山形県",
    areaNames: ["蔵王温泉"],
    tagNames: ["絶景", "温泉"],
    purposeNames: ["絶景・フォトスポット", "温泉"],
    days: [
      [
        { name: "蔵王ロープウェイ", wikiTitle: "蔵王ロープウェイ", address: "山形市蔵王温泉708-1", time: "9:30", stay: 90, memo: "新緑や高山植物を眺めながら、地蔵山頂駅まで空中散歩。" },
        { name: "蔵王温泉大露天風呂", wikiTitle: "蔵王温泉", address: "山形市蔵王温泉荒敷955", time: "12:00", stay: 60, memo: "強い酸性の硫黄泉が自慢の、開放的な大露天風呂。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "蔵王のお釜と高湯通り、火山と温泉街をめぐる蔵王1泊2日",
    description: "神秘的なエメラルドグリーンの火口湖「お釜」を眺め、宿では温泉街の高湯通りをゆっくり散策する、自然と湯めぐりを両立したプランです。",
    nights: 1,
    prefectureName: "山形県",
    areaNames: ["蔵王温泉"],
    tagNames: ["絶景", "温泉"],
    purposeNames: ["自然", "温泉"],
    days: [
      [
        { name: "蔵王のお釜", wikiTitle: "御釜_(蔵王山)", address: "山形市蔵王坊平", time: "10:30", stay: 50, memo: "刈田岳の火口にできた、神秘的なエメラルドグリーンの湖。" },
        { name: "高湯通り", wikiTitle: "蔵王温泉", address: "山形市蔵王温泉", time: "14:00", stay: 60, memo: "宿に戻り、共同浴場が点在する温泉街をゆっくり散策。", transit: { mode: "car", min: 40 }, fallbackLatLng: [38.1364, 140.4008] },
      ],
      [
        { name: "蔵王温泉大露天風呂", wikiTitle: "蔵王温泉", address: "山形市蔵王温泉荒敷955", time: "9:30", stay: 60, memo: "朝風呂で締めくくる、開放的な大露天風呂。" },
      ],
    ],
  },

  // ============================================================
  // 山形県 銀山温泉（既存: 山寺とセットの1泊2日夜景プラン）
  // ============================================================
  {
    title: "大正ロマンの木造旅館と白銀の滝、銀山温泉街さんぽ日帰りプラン",
    description: "小説の舞台のような木造多層旅館が立ち並ぶ、銀山温泉街を昼間じっくり散策する日帰りプラン。滝や共同浴場も巡ります。",
    nights: 0,
    prefectureName: "山形県",
    areaNames: ["銀山温泉"],
    tagNames: ["温泉"],
    purposeNames: ["温泉", "絶景・フォトスポット"],
    days: [
      [
        { name: "銀山温泉街", wikiTitle: "銀山温泉", address: "尾花沢市銀山新畑", time: "10:00", stay: 80, memo: "大正〜昭和初期の木造多層旅館が軒を連ねる、ノスタルジックな温泉街。" },
        { name: "白銀の滝", wikiTitle: "銀山温泉", address: "尾花沢市銀山新畑", time: "11:30", stay: 30, memo: "温泉街の奥にある、迫力ある2条の滝。", transit: { mode: "car", min: 8 }, fallbackLatLng: [38.5711, 140.5811] },
      ],
    ],
  },
  {
    title: "共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日",
    description: "昼と夜、両方の表情を楽しむ銀山温泉の旅。共同浴場でゆったり過ごし、日暮れとともに灯るガス灯の風景をじっくり味わいます。",
    nights: 1,
    prefectureName: "山形県",
    areaNames: ["銀山温泉"],
    tagNames: ["温泉"],
    purposeNames: ["温泉"],
    days: [
      [
        { name: "白銀の滝", wikiTitle: "銀山温泉", address: "尾花沢市銀山新畑", time: "10:00", stay: 30, memo: "温泉街の散策からスタート。", fallbackLatLng: [38.5711, 140.5811] },
        { name: "銀山温泉街", wikiTitle: "銀山温泉", address: "尾花沢市銀山新畑", time: "17:00", stay: 60, memo: "日暮れとともにガス灯が灯る温泉街を、宿の浴衣でそぞろ歩き。", transit: { mode: "walk", min: 15 }, fallbackLatLng: [38.5697, 140.5808] },
      ],
      [
        { name: "銀山温泉街", wikiTitle: "銀山温泉", address: "尾花沢市銀山新畑", time: "9:00", stay: 40, memo: "朝の静かな時間帯にもう一度、温泉街の景観を楽しむ。", fallbackLatLng: [38.5697, 140.5808] },
      ],
    ],
  },

  // ============================================================
  // 岐阜県 高山（既存: 白川郷とセットの冬1泊2日）
  // ============================================================
  {
    title: "さんまちと高山陣屋、飛騨の小京都を歩く定番日帰りプラン",
    description: "江戸時代の面影を残す古い町並み「さんまち」と、全国で唯一現存する陣屋建築。「飛騨の小京都」と呼ばれる高山の中心部を巡ります。",
    nights: 0,
    prefectureName: "岐阜県",
    areaNames: ["高山"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "ショッピング"],
    days: [
      [
        { name: "高山陣屋", wikiTitle: "高山陣屋", address: "高山市八軒町1丁目5", time: "9:30", stay: 50, memo: "江戸幕府の代官所・郡代役所として使われた、全国で唯一現存する陣屋。" },
        { name: "古い町並み（さんまち）", wikiTitle: "高山市", address: "高山市上三之町", time: "10:40", stay: 90, memo: "格子戸の商家が軒を連ねる、飛騨高山を代表する町並み。", transit: { mode: "walk", min: 10 } },
        { name: "宮川朝市", wikiTitle: "高山市", address: "高山市下三之町", time: "12:22", stay: 40, memo: "地元の農産物や民芸品が並ぶ、川沿いの朝市。", transit: { mode: "walk", min: 7 } },
      ],
    ],
  },
  {
    title: "酒蔵めぐりと飛騨高山まちの博物館、大人の高山グルメ1泊2日",
    description: "老舗酒蔵の飲み比べや、地元の歴史を学べる博物館を巡る、じっくり型の高山旅。飛騨牛グルメも楽しめます。",
    nights: 1,
    prefectureName: "岐阜県",
    areaNames: ["高山"],
    tagNames: ["グルメ"],
    purposeNames: ["酒蔵・ワイナリー巡り", "美術館・博物館"],
    days: [
      [
        { name: "飛騨高山まちの博物館", wikiTitle: "高山市", address: "高山市上一之町75", time: "9:30", stay: 50, memo: "高山の歴史と匠の技を紹介する、入場無料の博物館。", fallbackLatLng: [36.1421, 137.2519] },
        { name: "古い町並み（さんまち）", wikiTitle: "高山市", address: "高山市上三之町", time: "10:40", stay: 100, memo: "老舗酒蔵が並ぶ町並みで、飲み比べと飛騨牛グルメを楽しむ。", transit: { mode: "walk", min: 10 } },
      ],
      [
        { name: "宮川朝市", wikiTitle: "高山市", address: "高山市下三之町", time: "8:30", stay: 50, memo: "2日目の朝は、地元の人で賑わう朝市を散策。" },
      ],
    ],
  },

  // ============================================================
  // 岐阜県 白川郷（既存: 高山とセットの冬1泊2日）
  // ============================================================
  {
    title: "荻町合掌造り集落と展望台、世界遺産・白川郷を歩く定番日帰りプラン",
    description: "雪のない季節でも美しい、茅葺き屋根の合掌造り集落。展望台から集落全体を見下ろす、白川郷観光の王道プランです。",
    nights: 0,
    prefectureName: "岐阜県",
    areaNames: ["白川郷"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "自然"],
    days: [
      [
        { name: "荻町合掌造り集落", wikiTitle: "白川郷", address: "大野郡白川村荻町", time: "10:00", stay: 90, memo: "世界遺産に登録された、茅葺き屋根の合掌造り家屋が並ぶ集落。" },
        { name: "和田家", wikiTitle: "和田家", address: "大野郡白川村荻町997", time: "11:40", stay: 30, memo: "国指定重要文化財。集落最大規模の合掌造り家屋を見学。", transit: { mode: "walk", min: 10 } },
        { name: "城山天守閣展望台", wikiTitle: "白川郷", address: "大野郡白川村荻町", time: "12:30", stay: 30, memo: "集落全体を見下ろせる、白川郷随一のビュースポット。", transit: { mode: "car", min: 10 }, fallbackLatLng: [36.2597, 136.9033] },
      ],
    ],
  },
  {
    title: "合掌造り民家園と明善寺、白川郷の暮らしをじっくり学ぶ1泊2日",
    description: "実際に合掌造りの家屋に宿泊しながら、野外博物館や寺院を巡り、白川郷の暮らしと文化をじっくり学ぶ、滞在型のプランです。",
    nights: 1,
    prefectureName: "岐阜県",
    areaNames: ["白川郷"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "自然"],
    days: [
      [
        { name: "野外博物館合掌造り民家園", wikiTitle: "白川郷", address: "大野郡白川村荻町2499", time: "9:30", stay: 70, memo: "25棟の合掌造り家屋を移築・保存した、野外博物館。", fallbackLatLng: [36.2531, 136.8994] },
        { name: "明善寺郷土館", wikiTitle: "明善寺_(白川村)", address: "大野郡白川村荻町679", time: "11:00", stay: 30, memo: "本堂・庫裡ともに合掌造りという、珍しい寺院。", transit: { mode: "walk", min: 20 } },
      ],
      [
        { name: "荻町合掌造り集落", wikiTitle: "白川郷", address: "大野郡白川村荻町", time: "9:00", stay: 60, memo: "2日目の朝、人の少ない時間帯に集落をゆっくり散策。" },
      ],
    ],
  },

  // ============================================================
  // 群馬県 草津温泉（既存: 湯畑と雪見露天風呂、冬1泊2日）
  // ============================================================
  {
    title: "湯畑と西の河原公園、草津温泉街を歩く定番日帰りプラン",
    description: "もうもうと湯けむりが上がる湯畑を中心に、湯もみショーや西の河原公園の露天風呂を楽しむ、草津温泉の王道日帰りプランです。",
    nights: 0,
    prefectureName: "群馬県",
    areaNames: ["草津温泉"],
    tagNames: ["温泉"],
    purposeNames: ["温泉"],
    days: [
      [
        { name: "湯畑", wikiTitle: "湯畑", address: "吾妻郡草津町大字草津", time: "10:00", stay: 50, memo: "草津温泉のシンボル。湧き出る温泉が木樋を流れ落ちる光景は圧巻。" , fallbackLatLng: [36.6228, 138.5967] },
        { name: "光泉寺", wikiTitle: "光泉寺_(草津町)", address: "吾妻郡草津町大字草津478", time: "11:00", stay: 20, memo: "湯畑を見下ろす高台に建つ、草津温泉の守り寺。", transit: { mode: "walk", min: 5 }, fallbackLatLng: [36.6236, 138.5964] },
        { name: "西の河原公園", wikiTitle: "西の河原公園", address: "吾妻郡草津町大字草津521-3", time: "11:40", stay: 60, memo: "源泉が湧き出る渓流沿いの公園。無料の足湯もある。", transit: { mode: "walk", min: 15 }, fallbackLatLng: [36.6244, 138.5911] },
      ],
    ],
  },
  {
    title: "草津白根山のふもとと西の河原、自然を満喫する草津1泊2日",
    description: "硫黄の香り漂う殺生河原や、源泉が湧き出る西の河原公園など、草津白根山のふもとに広がる自然を楽しむプランです。山頂火口の「湯釜」は火山活動により立ち入りが規制されることがあり、アクセス道路の志賀草津道路（国道292号）も例年11月中旬〜4月下旬は冬季閉鎖されます。訪問前に必ず最新の規制状況を公式サイトで確認してください。",
    nights: 1,
    prefectureName: "群馬県",
    areaNames: ["草津温泉"],
    tagNames: ["絶景", "温泉"],
    purposeNames: ["自然", "絶景・フォトスポット"],
    days: [
      [
        { name: "殺生河原", wikiTitle: "草津白根山", address: "吾妻郡草津町大字草津", time: "10:00", stay: 40, memo: "硫黄の香り漂う、火山活動の跡が残る荒涼とした景観。天候や火山活動の状況により、これより先（山頂の湯釜方面）は立ち入り規制されることがある。志賀草津道路は例年11月中旬〜4月下旬は冬季閉鎖。" },
        { name: "西の河原公園", wikiTitle: "西の河原公園", address: "吾妻郡草津町大字草津521-3", time: "11:30", stay: 60, memo: "散策のあと、露天風呂で温まる。", transit: { mode: "car", min: 15 }, fallbackLatLng: [36.6244, 138.5911] },
      ],
      [
        { name: "湯畑", wikiTitle: "湯畑", address: "吾妻郡草津町大字草津", time: "9:30", stay: 50, memo: "2日目の朝は、湯けむり漂う湯畑をゆっくり散策。", fallbackLatLng: [36.6228, 138.5967] },
      ],
    ],
  },

  // ============================================================
  // 青森県 十和田・奥入瀬（既存: 紅葉の1泊2日）
  // ============================================================
  {
    title: "新緑の奥入瀬渓流、マイナスイオンあふれる渓流歩き日帰りプラン",
    description: "紅葉シーズン以外でも人気の高い、新緑の奥入瀬渓流。苔むした岩と清流が織りなす、渓流沿いの遊歩道を歩く日帰りプランです。",
    nights: 0,
    prefectureName: "青森県",
    areaNames: ["十和田・奥入瀬"],
    tagNames: ["絶景"],
    purposeNames: ["自然", "絶景・フォトスポット"],
    days: [
      [
        { name: "石ヶ戸", wikiTitle: "奥入瀬渓流", address: "十和田市奥瀬", time: "9:30", stay: 30, memo: "奥入瀬渓流歩きの起点となる休憩所。" },
        { name: "阿修羅の流れ", wikiTitle: "奥入瀬渓流", address: "十和田市奥瀬", time: "10:22", stay: 40, memo: "苔むした岩の間を白い飛沫を上げて流れる、渓流随一の景観。", transit: { mode: "walk", min: 22 } },
        { name: "雲井の滝", wikiTitle: "奥入瀬渓流", address: "十和田市奥瀬", time: "11:32", stay: 30, memo: "岩壁を7段になって流れ落ちる、優美な滝。", transit: { mode: "walk", min: 30 } },
        { name: "銚子大滝", wikiTitle: "奥入瀬渓流", address: "十和田市奥瀬", time: "12:30", stay: 30, memo: "「奥入瀬渓流の主瀑」と称される、渓流唯一の本流の滝。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "十和田神社と乙女の像、湖畔のパワースポットを巡る1泊2日",
    description: "神秘的な十和田湖に浮かぶパワースポット・十和田神社や、湖畔のシンボル「乙女の像」を巡る、信仰と絶景のプランです。",
    nights: 1,
    prefectureName: "青森県",
    areaNames: ["十和田・奥入瀬"],
    tagNames: ["絶景"],
    purposeNames: ["パワースポット", "絶景・フォトスポット"],
    days: [
      [
        { name: "十和田神社", wikiTitle: "十和田神社", address: "十和田市奥瀬十和田湖畔休屋", time: "10:00", stay: 40, memo: "十和田湖の守り神を祀る、深い杜に包まれたパワースポット。" },
        { name: "乙女の像", wikiTitle: "乙女の像", address: "十和田市奥瀬十和田湖畔休屋", time: "11:00", stay: 20, memo: "彫刻家・高村光太郎が手がけた、十和田湖畔のシンボル像。", transit: { mode: "walk", min: 15 } },
        { name: "十和田湖遊覧船", wikiTitle: "十和田湖", address: "十和田市奥瀬十和田湖畔休屋", time: "11:40", stay: 60, memo: "湖上から中山半島や御倉半島の景観を楽しむ遊覧船。", transit: { mode: "walk", min: 10 } },
      ],
      [
        { name: "子ノ口", wikiTitle: "十和田湖", address: "十和田市奥瀬十和田湖畔子ノ口", time: "9:30", stay: 30, memo: "奥入瀬渓流の起点。湖から渓流が流れ出す、静かな船着き場。" },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-06" });
