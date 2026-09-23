/**
 * サンプルスポットデータ（データのみ・副作用なし）
 *
 * seed-sample-itineraries.ts（しおり新規投入）と backfill-spot-details.ts
 * （既存スポットへのmemo/websiteUrl反映）の両方から参照される共有データ。
 * このファイルは定数の定義のみを行い、DBへの書き込みなど実行時の副作用は持たない
 * （実行スクリプト側を import すると、そのファイル末尾の main() 実行まで
 * 巻き込んでしまうため、データはこのファイルに分離している）。
 *
 * ⚠️ 注意: 住所・緯度経度・memo（説明文）・websiteUrl（公式サイト）は開発用サンプルとして
 * AI(Claude)の一般知識およびWeb検索で実在を確認した上で設定しているが、いずれも
 * 開発用サンプルデータであることに変わりはない。requirements.md 4.4節の注意書きの通り、
 * 本番のスポットマスタとして採用する場合は改めて裏取りを推奨する。
 */

export type SpotSeed = {
  name: string;
  address: string;
  lat: number;
  lng: number;
  memo: string;
  websiteUrl: string;
};

export const SPOTS: Record<string, SpotSeed[]> = {
  京都府: [
    { name: "清水寺", address: "京都市東山区清水1丁目294", lat: 34.9948, lng: 135.785, memo: "京都を代表する古刹。清水の舞台からの絶景は必見です。", websiteUrl: "https://www.kiyomizudera.or.jp/" },
    { name: "伏見稲荷大社", address: "京都市伏見区深草薮之内町68", lat: 34.9671, lng: 135.7727, memo: "朱色の千本鳥居が続く、外国人にも人気の神社。", websiteUrl: "https://inari.jp/" },
    { name: "嵐山 竹林の小径", address: "京都市右京区嵯峨小倉山田淵山町", lat: 35.0094, lng: 135.6693, memo: "青々とした竹林に包まれる、幻想的な散策路。", websiteUrl: "https://ja.kyoto.travel/" },
    { name: "金閣寺", address: "京都市北区金閣寺町1", lat: 35.0394, lng: 135.7292, memo: "金箔が眩しい、京都随一の世界遺産。", websiteUrl: "https://www.shokoku-ji.jp/kinkakuji/" },
    { name: "祇園花見小路", address: "京都市東山区祇園町南側", lat: 35.0037, lng: 135.7756, memo: "町家が並ぶ風情ある通り。運が良ければ舞妓さんにも。", websiteUrl: "https://ja.kyoto.travel/" },
    { name: "天橋立", address: "宮津市文珠", lat: 35.5772, lng: 135.1884, memo: "日本三景のひとつ。股のぞきで見る「天に架かる橋」。", websiteUrl: "https://www.amanohashidate.jp/" },
    { name: "二条城", address: "京都市中京区二条通堀川西入二条城町541", lat: 35.0142, lng: 135.7481, memo: "徳川家ゆかりの世界遺産。豪華絢爛な障壁画が見どころ。", websiteUrl: "https://nijo-jocastle.city.kyoto.lg.jp/" },
    { name: "平等院", address: "宇治市宇治蓮華116", lat: 34.8894, lng: 135.8083, memo: "10円硬貨でおなじみ、鳳凰堂が美しい世界遺産。", websiteUrl: "https://www.byodoin.or.jp/" },
  ],
  大阪府: [
    { name: "大阪城", address: "大阪市中央区大阪城1-1", lat: 34.6873, lng: 135.5262, memo: "太閤秀吉ゆかりの名城。天守閣からの眺めは圧巻。", websiteUrl: "https://www.osakacastle.net/" },
    { name: "道頓堀", address: "大阪市中央区道頓堀1丁目", lat: 34.6687, lng: 135.5013, memo: "巨大看板が並ぶ、大阪ミナミのシンボルストリート。", websiteUrl: "http://www.dotonbori.or.jp/" },
    { name: "梅田スカイビル", address: "大阪市北区大淀中1-1-88", lat: 34.7054, lng: 135.4907, memo: "空中庭園展望台から360度の大阪の街並みを一望。", websiteUrl: "https://www.kuchu-teien.com/" },
    { name: "通天閣", address: "大阪市浪速区恵美須東1-18-6", lat: 34.6524, lng: 135.5063, memo: "新世界のシンボルタワー。展望台からの夜景も人気。", websiteUrl: "https://www.tsutenkaku.co.jp/" },
    { name: "海遊館", address: "大阪市港区海岸通1-1-10", lat: 34.6547, lng: 135.4287, memo: "ジンベエザメが泳ぐ、世界最大級の水族館。", websiteUrl: "https://www.kaiyukan.com/" },
    { name: "仁徳天皇陵古墳", address: "堺市堺区大仙町", lat: 34.5653, lng: 135.4823, memo: "世界最大級の前方後円墳。世界文化遺産にも登録。", websiteUrl: "https://www.sakai-tcb.or.jp/spot/detail/126" },
    { name: "新世界", address: "大阪市浪速区恵美須東", lat: 34.652, lng: 135.5068, memo: "通天閣を仰ぐレトロな下町。串カツ食べ歩きも人気。", websiteUrl: "https://osaka-info.jp/spot/shinsekai/" },
  ],
  東京都: [
    { name: "浅草寺", address: "台東区浅草2-3-1", lat: 35.7148, lng: 139.7967, memo: "雷門と仲見世通りで有名な、東京最古のお寺。", websiteUrl: "https://www.senso-ji.jp/" },
    { name: "東京スカイツリー", address: "墨田区押上1-1-2", lat: 35.7101, lng: 139.8107, memo: "高さ634mの電波塔。展望デッキからの眺望は圧巻。", websiteUrl: "https://www.tokyo-skytree.jp/" },
    { name: "渋谷スクランブル交差点", address: "渋谷区道玄坂", lat: 35.6595, lng: 139.7005, memo: "一度に数千人が行き交う、世界的に有名な交差点。", websiteUrl: "https://www.gotokyo.org/" },
    { name: "明治神宮", address: "渋谷区代々木神園町1-1", lat: 35.6764, lng: 139.6993, memo: "都心とは思えない緑に包まれた、初詣で有名な神社。", websiteUrl: "https://www.meijijingu.or.jp/" },
    { name: "お台場海浜公園", address: "港区台場1", lat: 35.6297, lng: 139.7746, memo: "レインボーブリッジを望む、人工のビーチ公園。", websiteUrl: "https://www.tptc.co.jp/park/01_02" },
    { name: "上野恩賜公園", address: "台東区上野公園", lat: 35.7141, lng: 139.7738, memo: "桜の名所として知られる、博物館・動物園も揃う公園。", websiteUrl: "https://www.kensetsu.metro.tokyo.lg.jp/jimusho/toubuk/ueno/" },
    { name: "井の頭恩賜公園", address: "武蔵野市御殿山1", lat: 35.7009, lng: 139.5704, memo: "ボート池を囲む緑豊かな公園。吉祥寺散策の起点に。", websiteUrl: "https://www.kensetsu.metro.tokyo.lg.jp/jimusho/seibuk/inokashira/" },
  ],
  北海道: [
    { name: "札幌時計台", address: "札幌市中央区北1条西2丁目", lat: 43.0621, lng: 141.3544, memo: "札幌のシンボル。今も時を刻み続ける現役の時計台。", websiteUrl: "https://sapporoshi-tokeidai.jp/" },
    { name: "小樽運河", address: "小樽市港町", lat: 43.1985, lng: 140.9945, memo: "ガス灯とレンガ倉庫が並ぶ、ノスタルジックな運河。", websiteUrl: "https://otaru.gr.jp/shop/otarucanal" },
    { name: "ファーム富田", address: "空知郡中富良野町基線北15号", lat: 43.4494, lng: 142.4739, memo: "一面に広がるラベンダー畑で有名な、北海道の観光農園。", websiteUrl: "https://www.farm-tomita.co.jp/" },
    { name: "青い池", address: "上川郡美瑛町白金", lat: 43.5673, lng: 142.6489, memo: "コバルトブルーに輝く、神秘的な池。", websiteUrl: "https://www.biei-hokkaido.jp/ja/shirogane-blue-pond" },
    { name: "函館山", address: "函館市函館山", lat: 41.7594, lng: 140.7104, memo: "「100万ドルの夜景」として名高い、函館のシンボル。", websiteUrl: "https://334.co.jp/" },
    { name: "五稜郭公園", address: "函館市五稜郭町44", lat: 41.7969, lng: 140.7565, memo: "星形の城郭が美しい、日本初の西洋式城塞。", websiteUrl: "https://www.goryokaku-tower.co.jp/" },
    { name: "大通公園", address: "札幌市中央区大通西", lat: 43.0598, lng: 141.355, memo: "札幌の街を東西に貫く、四季折々のイベント会場。", websiteUrl: "https://odori-park.jp/" },
  ],
  沖縄県: [
    { name: "首里城公園", address: "那覇市首里金城町1-2", lat: 26.217, lng: 127.7192, memo: "琉球王国の栄華を伝える、朱色の世界遺産。", websiteUrl: "https://oki-park.jp/shurijo/" },
    { name: "国際通り", address: "那覇市牧志", lat: 26.2158, lng: 127.6893, memo: "那覇随一の繁華街。お土産店や飲食店が軒を連ねる。", websiteUrl: "https://www.naha-navi.or.jp/" },
    { name: "沖縄美ら海水族館", address: "国頭郡本部町石川424", lat: 26.6941, lng: 127.8779, memo: "ジンベエザメが泳ぐ、世界屈指の規模を誇る水族館。", websiteUrl: "https://churaumi.okinawa/" },
    { name: "万座毛", address: "国頭郡恩納村恩納", lat: 26.5039, lng: 127.8547, memo: "象の鼻に似た奇岩と、エメラルドグリーンの海が広がる景勝地。", websiteUrl: "https://www.manzamo.jp/" },
    { name: "川平湾", address: "石垣市川平", lat: 24.4547, lng: 124.1456, memo: "「日本一美しい」とも称される、コバルトブルーの海。", websiteUrl: "https://www.kabiramarine.jp/" },
    { name: "阿波連ビーチ", address: "島尻郡座間味村阿波連", lat: 26.1667, lng: 127.2833, memo: "ケラマブルーの海が広がる、慶良間諸島屈指のビーチ。", websiteUrl: "https://www.vill.zamami.okinawa.jp/" },
    { name: "美浜アメリカンビレッジ", address: "中頭郡北谷町美浜", lat: 26.3125, lng: 127.7566, memo: "アメリカンな街並みが広がる、ショッピング&グルメスポット。", websiteUrl: "https://www.okinawa-americanvillage.com/" },
  ],
};
