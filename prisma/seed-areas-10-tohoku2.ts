/**
 * 公式しおりデータ登録・再開バッチ10（docs/specs/20260924-shiori-data-resume.md）
 * 公開0件エリア、東北地方（その1）。
 * 対象: 宮城県 仙台市内・松島・蔵王 / 岩手県 盛岡・平泉・遠野 / 福島県 会津若松
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-10-tohoku2.ts
 *   登録モード: npx tsx prisma/seed-areas-10-tohoku2.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 宮城県 仙台市内
  // ============================================================
  {
    title: "仙台城跡と瑞鳳殿、伊達政宗ゆかりの史跡を巡る定番日帰りプラン",
    description: "独眼竜・伊達政宗が築いた仙台城跡と、絢爛豪華な廟所・瑞鳳殿。仙台観光の王道を巡る定番の日帰りプランです。",
    nights: 0,
    prefectureName: "宮城県",
    areaNames: ["仙台市内"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡"],
    days: [
      [
        { name: "仙台城跡", wikiTitle: "仙台城", address: "仙台市青葉区川内1", time: "9:30", stay: 60, memo: "伊達政宗が築いた仙台藩62万石の居城跡。伊達政宗騎馬像が目印。" },
        { name: "瑞鳳殿", wikiTitle: "瑞鳳殿", address: "仙台市青葉区霊屋下23-2", time: "11:00", stay: 40, memo: "伊達政宗の霊廟。桃山文化の様式を伝える絢爛豪華な廟建築。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "定禅寺通りと大崎八幡宮、杜の都・仙台の街並みさんぽプラン",
    description: "「杜の都」と呼ばれる仙台らしい、ケヤキ並木の定禅寺通りと、国宝の社殿を持つ大崎八幡宮。街歩き中心のプランです。",
    nights: 0,
    prefectureName: "宮城県",
    areaNames: ["仙台市内"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "自然"],
    days: [
      [
        { name: "定禅寺通り", wikiTitle: "定禅寺通", address: "仙台市青葉区国分町", time: "9:30", stay: 40, memo: "「杜の都」を象徴する、ケヤキ並木が美しい遊歩道。" },
        { name: "大崎八幡宮", wikiTitle: "大崎八幡宮", address: "仙台市青葉区八幡4丁目6-1", time: "10:40", stay: 40, memo: "現存する最古の権現造建築として、国宝に指定される社殿。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "仙台市博物館と牛たん通り、歴史とグルメを楽しむ1泊2日",
    description: "伊達家ゆかりの品々を展示する仙台市博物館を訪ね、名物の牛たんグルメも堪能する、仙台をじっくり楽しむ1泊2日プランです。",
    nights: 1,
    prefectureName: "宮城県",
    areaNames: ["仙台市内"],
    tagNames: ["グルメ"],
    purposeNames: ["美術館・博物館"],
    days: [
      [
        { name: "仙台市博物館", wikiTitle: "仙台市博物館", address: "仙台市青葉区川内26", time: "9:30", stay: 70, memo: "伊達家ゆかりの甲冑や史料を展示する、仙台城跡近くの博物館。" },
        { name: "仙台城跡", wikiTitle: "仙台城", address: "仙台市青葉区川内1", time: "11:10", stay: 50, memo: "博物館のあと、すぐそばの城跡へ。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "定禅寺通り", wikiTitle: "定禅寺通", address: "仙台市青葉区国分町", time: "9:30", stay: 50, memo: "2日目は、牛たん通りでの食事前にケヤキ並木を散策。" },
      ],
    ],
  },

  // ============================================================
  // 宮城県 松島
  // ============================================================
  {
    title: "五大堂と瑞巌寺、日本三景・松島の定番社寺めぐり日帰りプラン",
    description: "日本三景の一つ・松島。朱塗りの五大堂と、伊達家ゆかりの瑞巌寺を巡る、松島観光の定番プランです。",
    nights: 0,
    prefectureName: "宮城県",
    areaNames: ["松島"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "絶景・フォトスポット"],
    days: [
      [
        { name: "五大堂", wikiTitle: "五大堂", address: "宮城郡松島町松島字町内111", time: "9:30", stay: 30, memo: "松島のシンボル。朱塗りの橋を渡った先にある小さなお堂。" },
        { name: "瑞巌寺", wikiTitle: "瑞巌寺", address: "宮城郡松島町松島字町内91", time: "10:20", stay: 60, memo: "伊達政宗が再興した、東北地方屈指の禅寺。", transit: { mode: "walk", min: 10 } },
        { name: "円通院", wikiTitle: "円通院", address: "宮城郡松島町松島字町内67", time: "11:40", stay: 40, memo: "バラ庭園でも知られる、瑞巌寺に隣接する塔頭寺院。", transit: { mode: "walk", min: 5 } },
      ],
    ],
  },
  {
    title: "松島湾遊覧船と福浦橋、島めぐりの絶景クルーズプラン",
    description: "260余りの島々が浮かぶ松島湾を遊覧船で巡り、縁結びの橋・福浦橋も渡る。日本三景の絶景を海と陸から楽しむプランです。",
    nights: 0,
    prefectureName: "宮城県",
    areaNames: ["松島"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "自然"],
    days: [
      [
        { name: "松島湾遊覧船", wikiTitle: "松島湾", address: "宮城郡松島町松島字町内85", time: "9:30", stay: 60, memo: "260余りの島々が浮かぶ松島湾を、船上から一望できる遊覧船。" },
        { name: "福浦橋", wikiTitle: "福浦島", address: "宮城郡松島町松島字町内", time: "11:00", stay: 40, memo: "「出会い橋」とも呼ばれる、福浦島へと続く朱塗りの橋。", transit: { mode: "car", min: 8 } },
      ],
    ],
  },
  {
    title: "松島の夕景と瑞巌寺の紅葉、じっくり味わう1泊2日の旅",
    description: "定番スポットに加え、夕暮れどきの松島湾の絶景や、紅葉に彩られた瑞巌寺の参道まで。じっくり型の松島1泊2日プランです。",
    nights: 1,
    prefectureName: "宮城県",
    areaNames: ["松島"],
    tagNames: ["絶景", "紅葉"],
    purposeNames: ["お寺", "絶景・フォトスポット"],
    days: [
      [
        { name: "瑞巌寺", wikiTitle: "瑞巌寺", address: "宮城郡松島町松島字町内91", time: "10:00", stay: 70, memo: "杉並木の参道を歩き、伊達家ゆかりの禅寺を参拝（紅葉の見頃は例年11月中旬〜下旬）。" },
        { name: "五大堂", wikiTitle: "五大堂", address: "宮城郡松島町松島字町内111", time: "16:30", stay: 40, memo: "夕暮れどき、朱塗りの御堂と松島湾の景色を楽しむ。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "松島湾遊覧船", wikiTitle: "松島湾", address: "宮城郡松島町松島字町内85", time: "9:30", stay: 60, memo: "2日目の朝、澄んだ空気の中で島めぐりの遊覧船に乗る。" },
      ],
    ],
  },

  // ============================================================
  // 宮城県 蔵王
  // ============================================================
  {
    title: "御釜の絶景を望む、宮城側から登る蔵王エコーライン日帰りプラン",
    description: "宮城県側から蔵王エコーラインをドライブし、神秘的な火口湖・御釜を望む。雄大な蔵王連峰の絶景を楽しむプランです。",
    nights: 0,
    prefectureName: "宮城県",
    areaNames: ["蔵王"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "ドライブ"],
    days: [
      [
        { name: "蔵王エコーライン", wikiTitle: "蔵王エコーライン", address: "刈田郡蔵王町", time: "10:00", stay: 60, memo: "宮城・山形県境を結ぶ、蔵王連峰を貫くドライブルート。" },
        { name: "蔵王のお釜", wikiTitle: "御釜_(蔵王山)", address: "刈田郡蔵王町遠刈田温泉", time: "11:30", stay: 50, memo: "刈田岳の火口にできた、エメラルドグリーンの神秘的な湖。", transit: { mode: "car", min: 30 } },
      ],
    ],
  },
  {
    title: "遠刈田温泉の共同浴場めぐり、宮城蔵王の湯治文化を楽しむ日帰りプラン",
    description: "こけしの産地としても知られる遠刈田温泉。歴史ある共同浴場を巡り、蔵王山麓の湯治文化にふれるプランです。",
    nights: 0,
    prefectureName: "宮城県",
    areaNames: ["蔵王"],
    tagNames: ["温泉"],
    purposeNames: ["温泉"],
    days: [
      [
        { name: "遠刈田温泉", wikiTitle: "遠刈田温泉", address: "刈田郡蔵王町遠刈田温泉", time: "10:00", stay: 90, memo: "開湯400年の歴史を持つ、こけしの産地としても有名な温泉地。" },
        { name: "三階滝", wikiTitle: "三階滝_(宮城県)", address: "刈田郡蔵王町遠刈田温泉", time: "12:00", stay: 40, memo: "3段になって流れ落ちる、蔵王山麓の美しい滝。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "お釜と温泉、宮城蔵王を満喫するドライブ&湯めぐり1泊2日",
    description: "御釜の絶景ドライブと、遠刈田温泉での湯めぐり。宮城蔵王の自然と温泉、両方をじっくり楽しむ1泊2日プランです。",
    nights: 1,
    prefectureName: "宮城県",
    areaNames: ["蔵王"],
    tagNames: ["絶景", "温泉"],
    purposeNames: ["自然", "温泉"],
    days: [
      [
        { name: "蔵王のお釜", wikiTitle: "御釜_(蔵王山)", address: "刈田郡蔵王町遠刈田温泉", time: "10:30", stay: 50, memo: "蔵王エコーラインを走り、神秘的な火口湖へ。" },
        { name: "遠刈田温泉", wikiTitle: "遠刈田温泉", address: "刈田郡蔵王町遠刈田温泉", time: "15:00", stay: 60, memo: "下山後、こけしの里・遠刈田温泉でゆっくり過ごす。", transit: { mode: "car", min: 30 } },
      ],
      [
        { name: "三階滝", wikiTitle: "三階滝_(宮城県)", address: "刈田郡蔵王町遠刈田温泉", time: "9:30", stay: 40, memo: "2日目の朝、滝を眺めながら散策。" },
      ],
    ],
  },

  // ============================================================
  // 岩手県 盛岡
  // ============================================================
  {
    title: "盛岡城跡公園と中津川、定番の盛岡さんぽ日帰りプラン",
    description: "石垣が美しい盛岡城跡公園と、街の中心を流れる中津川。盛岡の中心部をゆったり歩く、定番の日帰りプランです。",
    nights: 0,
    prefectureName: "岩手県",
    areaNames: ["盛岡"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "自然"],
    days: [
      [
        { name: "盛岡城跡公園", wikiTitle: "盛岡城", address: "盛岡市内丸1", time: "9:30", stay: 60, memo: "南部氏の居城跡。「日本100名城」にも選ばれた、美しい石垣が残る公園。" },
        { name: "中津川", wikiTitle: "中津川_(岩手県)", address: "盛岡市内丸", time: "10:50", stay: 30, memo: "盛岡の街の中心を流れる清流。鮭が遡上することでも知られる。", transit: { mode: "walk", min: 10 }, fallbackLatLng: [39.7053, 141.1533] },
        { name: "盛岡八幡宮", wikiTitle: "盛岡八幡宮", address: "盛岡市八幡町13-1", time: "11:40", stay: 30, memo: "南部盛岡藩の総鎮守として崇敬されてきた神社。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "わんこそば挑戦と岩手県立美術館、盛岡グルメ&アートプラン",
    description: "盛岡名物・わんこそばに挑戦し、岩手県立美術館でアートに触れる。盛岡の「食」と「文化」を楽しむプランです。",
    nights: 0,
    prefectureName: "岩手県",
    areaNames: ["盛岡"],
    tagNames: ["グルメ"],
    purposeNames: ["美術館・博物館"],
    days: [
      [
        { name: "岩手県立美術館", wikiTitle: "岩手県立美術館", address: "盛岡市本宮字松幅12-3", time: "9:30", stay: 70, memo: "萬鉄五郎や松本竣介など、郷土ゆかりの作家の作品を展示。" },
        { name: "盛岡城跡公園", wikiTitle: "盛岡城", address: "盛岡市内丸1", time: "11:30", stay: 40, memo: "美術館のあと、市街地の盛岡城跡公園へ。名物わんこそばの店も近い。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "中津川沿いをのんびり、盛岡の街を味わい尽くす1泊2日",
    description: "中津川沿いの古い町並みや盛岡八幡宮など、定番スポットをじっくり時間をかけて巡る、盛岡をゆったり味わう1泊2日プランです。",
    nights: 1,
    prefectureName: "岩手県",
    areaNames: ["盛岡"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "自然"],
    days: [
      [
        { name: "盛岡八幡宮", wikiTitle: "盛岡八幡宮", address: "盛岡市八幡町13-1", time: "10:00", stay: 40, memo: "南部盛岡藩の総鎮守にじっくり参拝。" },
        { name: "中津川", wikiTitle: "中津川_(岩手県)", address: "盛岡市内丸", time: "11:10", stay: 60, memo: "川沿いの土蔵や古い町並みを、時間をかけて散策。", transit: { mode: "car", min: 15 }, fallbackLatLng: [39.7053, 141.1533] },
      ],
      [
        { name: "盛岡城跡公園", wikiTitle: "盛岡城", address: "盛岡市内丸1", time: "9:30", stay: 60, memo: "2日目の朝、静かな時間帯に石垣の城跡公園を散策。" },
      ],
    ],
  },

  // ============================================================
  // 岩手県 平泉
  // ============================================================
  {
    title: "中尊寺金色堂、世界遺産・平泉の黄金文化を巡る定番日帰りプラン",
    description: "奥州藤原氏の栄華を今に伝える、世界遺産・中尊寺の金色堂。平泉観光の中心となる定番の日帰りプランです。",
    nights: 0,
    prefectureName: "岩手県",
    areaNames: ["平泉"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "城・史跡"],
    days: [
      [
        { name: "中尊寺", wikiTitle: "中尊寺", address: "西磐井郡平泉町平泉衣関202", time: "9:30", stay: 100, memo: "奥州藤原氏三代の栄華を伝える、金色堂で有名な世界遺産の古刹。" },
      ],
    ],
  },
  {
    title: "毛越寺の浄土庭園、平安時代の美しい庭を歩く平泉さんぽ",
    description: "平安時代の面影を今に伝える、毛越寺の浄土庭園。中尊寺とは違った、静けさと美しさを楽しむプランです。",
    nights: 0,
    prefectureName: "岩手県",
    areaNames: ["平泉"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "自然"],
    days: [
      [
        { name: "毛越寺", wikiTitle: "毛越寺", address: "西磐井郡平泉町平泉字大沢58", time: "9:30", stay: 70, memo: "平安時代の姿を今に伝える、浄土庭園の傑作として知られる古刹。" },
      ],
    ],
  },
  {
    title: "中尊寺と毛越寺、世界遺産・平泉をじっくり巡る1泊2日",
    description: "中尊寺と毛越寺、平泉の二大世界遺産を1泊2日でじっくり巡る、奥州藤原氏の黄金文化を存分に味わうプランです。",
    nights: 1,
    prefectureName: "岩手県",
    areaNames: ["平泉"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "城・史跡"],
    days: [
      [
        { name: "中尊寺", wikiTitle: "中尊寺", address: "西磐井郡平泉町平泉衣関202", time: "10:00", stay: 100, memo: "初日は金色堂を中心に、中尊寺をじっくり見学。" },
      ],
      [
        { name: "毛越寺", wikiTitle: "毛越寺", address: "西磐井郡平泉町平泉字大沢58", time: "9:30", stay: 70, memo: "2日目は、平安時代の浄土庭園をゆっくり散策。" },
      ],
    ],
  },

  // ============================================================
  // 岩手県 遠野
  // ============================================================
  {
    title: "遠野ふるさと村で日本の原風景に出会う、定番の遠野日帰りプラン",
    description: "曲り家が点在する遠野ふるさと村で、懐かしい日本の農村風景を体感する。「遠野物語」の里を巡る定番プランです。",
    nights: 0,
    prefectureName: "岩手県",
    areaNames: ["遠野"],
    tagNames: ["定番観光"],
    purposeNames: ["自然"],
    days: [
      [
        { name: "遠野ふるさと村", wikiTitle: "遠野ふるさと村", address: "遠野市附馬牛町上附馬牛5-89-1", time: "9:30", stay: 120, memo: "江戸〜明治期の曲り家が移築された、遠野の原風景を体感できる施設。" },
      ],
    ],
  },
  {
    title: "カッパ淵と伝承園、遠野物語の民話の世界を歩くプラン",
    description: "河童伝説が残るカッパ淵と、遠野の昔話を伝える伝承園。柳田國男「遠野物語」の世界にふれる、ユニークなプランです。",
    nights: 0,
    prefectureName: "岩手県",
    areaNames: ["遠野"],
    tagNames: ["定番観光"],
    purposeNames: ["自然"],
    days: [
      [
        { name: "伝承園", wikiTitle: "伝承園", address: "遠野市土淵町土淵6-5-1", time: "9:30", stay: 60, memo: "南部曲り家を利用した、遠野の民話と生活文化を伝える施設。" },
        { name: "カッパ淵", wikiTitle: "カッパ淵", address: "遠野市土淵町土淵", time: "10:50", stay: 40, memo: "河童伝説が残る小川。今も河童捕獲許可証が発行される人気スポット。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "遠野物語の里をじっくり巡る、民話とオシラサマの1泊2日",
    description: "遠野ふるさと村からカッパ淵まで、遠野物語の舞台をじっくり巡る1泊2日。日本人の心のふるさとを訪ねるプランです。",
    nights: 1,
    prefectureName: "岩手県",
    areaNames: ["遠野"],
    tagNames: ["定番観光"],
    purposeNames: ["自然"],
    days: [
      [
        { name: "遠野ふるさと村", wikiTitle: "遠野ふるさと村", address: "遠野市附馬牛町上附馬牛5-89-1", time: "10:00", stay: 120, memo: "曲り家が並ぶ、遠野の原風景をゆっくり体感。" },
      ],
      [
        { name: "伝承園", wikiTitle: "伝承園", address: "遠野市土淵町土淵6-5-1", time: "9:00", stay: 50, memo: "2日目は、オシラサマを祀る御蚕神堂などを見学。" },
        { name: "カッパ淵", wikiTitle: "カッパ淵", address: "遠野市土淵町土淵", time: "10:20", stay: 40, memo: "遠野物語ゆかりの小川で、河童伝説に思いを馳せる。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },

  // ============================================================
  // 福島県 会津若松
  // ============================================================
  {
    title: "鶴ヶ城と七日町通り、定番の会津若松さんぽ日帰りプラン",
    description: "会津のシンボル・鶴ヶ城と、レトロな町並みが残る七日町通り。会津若松観光の王道を巡る定番プランです。",
    nights: 0,
    prefectureName: "福島県",
    areaNames: ["会津若松"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "ショッピング"],
    days: [
      [
        { name: "鶴ヶ城", wikiTitle: "若松城", address: "会津若松市追手町1-1", time: "9:30", stay: 90, memo: "幕末の戊辰戦争でも知られる、会津のシンボル的な城。赤瓦の天守が特徴。" },
        { name: "七日町通り", wikiTitle: "七日町通り_(会津若松市)", address: "会津若松市七日町", time: "11:20", stay: 60, memo: "大正・昭和レトロな建物が並ぶ、会津の伝統工芸品店が集まる通り。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "飯盛山と白虎隊、会津の悲劇の歴史をたどる日帰りプラン",
    description: "白虎隊士が自刃した飯盛山。幕末の会津戦争の悲劇を伝える史跡を訪ね、会津武家屋敷で藩士の暮らしにふれるプランです。",
    nights: 0,
    prefectureName: "福島県",
    areaNames: ["会津若松"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "パワースポット"],
    days: [
      [
        { name: "飯盛山", wikiTitle: "飯盛山_(福島県)", address: "会津若松市一箕町大字八幡字弁天下", time: "9:30", stay: 50, memo: "白虎隊十九士が自刃した地。鶴ヶ城を望む悲劇の舞台。" },
        { name: "会津武家屋敷", wikiTitle: "会津武家屋敷", address: "会津若松市東山町大字石山字松原200", time: "10:50", stay: 60, memo: "会津藩家老・西郷頼母邸を復元した、上級武士の暮らしを伝える屋敷。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "東山温泉に泊まる、鶴ヶ城と武家屋敷をめぐる会津1泊2日",
    description: "会津の奥座敷・東山温泉に宿泊しながら、鶴ヶ城や武家屋敷など会津若松の歴史スポットをじっくり巡る1泊2日プランです。",
    nights: 1,
    prefectureName: "福島県",
    areaNames: ["会津若松"],
    tagNames: ["温泉"],
    purposeNames: ["城・史跡", "温泉"],
    days: [
      [
        { name: "鶴ヶ城", wikiTitle: "若松城", address: "会津若松市追手町1-1", time: "10:00", stay: 90, memo: "会津のシンボル、鶴ヶ城をじっくり見学。" },
        { name: "東山温泉", wikiTitle: "東山温泉", address: "会津若松市東山町", time: "16:00", stay: 60, memo: "1300年の歴史を持つ、会津の奥座敷と呼ばれる温泉地。", transit: { mode: "car", min: 20 } },
      ],
      [
        { name: "飯盛山", wikiTitle: "飯盛山_(福島県)", address: "会津若松市一箕町大字八幡字弁天下", time: "9:30", stay: 50, memo: "2日目は、白虎隊ゆかりの史跡を訪ねる。" },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-10" });
