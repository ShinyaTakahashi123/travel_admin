/**
 * 公式しおりデータ登録・再開バッチ1（docs/specs/20260924-shiori-data-resume.md）
 * 対象: 京都府 天橋立・丹後 / 北海道 函館 / 大阪府 堺・泉南 / 奈良県 奈良市内 / 奈良県 飛鳥
 * 各エリア3件、コンセプトを分けて手作りルートで登録する。
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-01-kansai-nara.ts
 *   登録モード: npx tsx prisma/seed-areas-01-kansai-nara.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 京都府 天橋立・丹後
  // ============================================================
  {
    title: "股のぞきで有名な天橋立、南北の絶景を1日で巡るプラン",
    description: "日本三景・天橋立の名物ビューポイントを南北両側から楽しむ、定番の日帰りプランです。天橋立ビューランドと傘松公園、2つの「股のぞき」を体験できます。",
    nights: 0,
    prefectureName: "京都府",
    areaNames: ["天橋立・丹後"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "神社"],
    days: [
      [
        { name: "智恩寺（文殊堂）", wikiTitle: "智恩寺_(宮津市)", address: "宮津市文珠", time: "9:00", stay: 30, memo: "日本三文殊の一つ。天橋立観光の起点となる古刹。" },
        { name: "天橋立ビューランド", wikiTitle: "天橋立ビューランド", address: "宮津市文珠", time: "9:45", stay: 60, memo: "南側から天橋立を見下ろす展望リフト・モノレール。股のぞきの発祥地。", transit: { mode: "other", min: 10 } },
        { name: "天橋立（松並木散策）", wikiTitle: "天橋立", address: "宮津市文珠〜大垣", time: "11:15", stay: 70, memo: "白砂青松の松並木を歩いて渡る、天橋立随一の体験。徒歩またはレンタサイクルで北側へ。", transit: { mode: "other", min: 15 } },
        { name: "元伊勢籠神社", wikiTitle: "籠神社", address: "宮津市大垣430", time: "12:55", stay: 30, memo: "丹後国一宮。天橋立の北の付け根に鎮座する格式高い神社。", transit: { mode: "car", min: 5 } },
        { name: "傘松公園", wikiTitle: "傘松公園", address: "宮津市大垣130", time: "13:35", stay: 50, memo: "北側から見る「股のぞき」の名所。ケーブルカーまたはリフトで登る。", transit: { mode: "other", min: 5 } },
      ],
    ],
  },
  {
    title: "伊根の舟屋と丹後の海を満喫する、1泊2日のんびり漁村旅",
    description: "天橋立から少し足を延ばして、日本海に浮かぶ舟屋の里・伊根や、鳴き砂で有名な琴引浜まで。丹後半島の海辺をゆったり巡る旅です。",
    nights: 1,
    prefectureName: "京都府",
    areaNames: ["天橋立・丹後"],
    tagNames: ["海・リゾート", "絶景"],
    purposeNames: ["ビーチ・海水浴", "絶景・フォトスポット"],
    days: [
      [
        { name: "伊根の舟屋", wikiTitle: "伊根町", address: "与謝郡伊根町平田", time: "9:30", stay: 60, memo: "1階が船のガレージという独特の舟屋が並ぶ、日本を代表する漁村風景。", osmQuery: "伊根の舟屋" },
        { name: "舟屋の里公園", wikiTitle: "伊根町", address: "与謝郡伊根町平田507", time: "10:50", stay: 40, memo: "伊根湾と舟屋群を高台から一望できる展望公園。", transit: { mode: "car", min: 5 }, osmQuery: "舟屋の里公園" },
        { name: "経ヶ岬灯台", wikiTitle: "経ヶ岬灯台", address: "京丹後市丹後町袖志", time: "12:10", stay: 40, memo: "丹後半島最北端、日本海を見渡す白亜の灯台。", transit: { mode: "car", min: 35 } },
        { name: "琴引浜", wikiTitle: "琴引浜", address: "京丹後市網野町掛津", time: "13:40", stay: 50, memo: "歩くと鳴き砂の音がする、全国有数の美しい海岸。", transit: { mode: "car", min: 30 } },
      ],
      [
        { name: "丹後由良", wikiTitle: "丹後由良駅", address: "宮津市由良", time: "9:30", stay: 40, memo: "小説「山椒大夫」の舞台としても知られる静かな海水浴場。" },
        { name: "天橋立", wikiTitle: "天橋立", address: "宮津市文珠〜大垣", time: "10:40", stay: 60, memo: "帰り際にもう一度、松並木の中を散策して締めくくる。", transit: { mode: "car", min: 20 } },
        { name: "智恩寺（文殊堂）", wikiTitle: "智恩寺_(宮津市)", address: "宮津市文珠", time: "11:50", stay: 30, memo: "最後に知恵の仏様にお参りして、旅の無事を感謝する。", transit: { mode: "car", min: 5 } },
      ],
    ],
  },
  {
    title: "元伊勢と丹後国分寺、歴史とパワースポットを訪ねる日帰り旅",
    description: "天橋立の定番観光地から少し離れて、元伊勢と呼ばれる籠神社や、山あいの古寺・成相寺など、丹後の歴史と信仰の跡をたどるプランです。",
    nights: 0,
    prefectureName: "京都府",
    areaNames: ["天橋立・丹後"],
    tagNames: ["絶景"],
    purposeNames: ["神社", "パワースポット"],
    days: [
      [
        { name: "元伊勢籠神社", wikiTitle: "籠神社", address: "宮津市大垣430", time: "9:00", stay: 35, memo: "伊勢神宮以前に天照大神を祀ったと伝わる、元伊勢の一社。" },
        { name: "成相寺", wikiTitle: "成相寺", address: "宮津市成相寺339", time: "9:55", stay: 50, memo: "西国三十三所の霊場で、天橋立を一望できる山寺。", transit: { mode: "car", min: 15 } },
        { name: "傘松公園", wikiTitle: "傘松公園", address: "宮津市大垣130", time: "11:10", stay: 40, memo: "成相寺からの帰り道に立ち寄る、北側の股のぞき展望台。", transit: { mode: "car", min: 10 } },
        { name: "丹後国分寺跡", wikiTitle: "丹後国分寺跡", address: "宮津市国分", time: "12:15", stay: 30, memo: "天橋立を見下ろす高台に残る、奈良時代の寺院跡。", transit: { mode: "car", min: 10 } },
        { name: "智恩寺（文殊堂）", wikiTitle: "智恩寺_(宮津市)", address: "宮津市文珠", time: "13:10", stay: 30, memo: "最後は知恵の文殊様に参拝して締めくくる。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },

  // ============================================================
  // 北海道 函館
  // ============================================================
  {
    title: "五稜郭と函館山、定番の絶景と歴史を1日で巡るプラン",
    description: "星形の五稜郭と、日本三大夜景の一つ函館山。函館観光の王道スポットを効率よく回る日帰りプランです。",
    nights: 0,
    prefectureName: "北海道",
    areaNames: ["函館"],
    tagNames: ["絶景"],
    purposeNames: ["城・史跡", "夜景"],
    days: [
      [
        { name: "五稜郭公園", wikiTitle: "五稜郭", address: "函館市五稜郭町44", time: "9:30", stay: 50, memo: "星形の特徴的な城郭跡。桜の名所としても有名。" },
        { name: "五稜郭タワー", wikiTitle: "五稜郭タワー", address: "函館市五稜郭町43-9", time: "10:30", stay: 40, memo: "五稜郭の星形を上から一望できる展望タワー。", transit: { mode: "walk", min: 5 } },
        { name: "金森赤レンガ倉庫", wikiTitle: "金森赤レンガ倉庫", address: "函館市末広町14-12", time: "12:00", stay: 60, memo: "明治期の倉庫群を活用した、ショップやレストランが並ぶベイエリア。", transit: { mode: "bus", min: 20, line: "函館市電" } },
        { name: "旧函館区公会堂", wikiTitle: "旧函館区公会堂", address: "函館市元町11-13", time: "13:30", stay: 40, memo: "コロニアル様式の華やかな洋館。元町の高台に建つ。", transit: { mode: "walk", min: 10 } },
        { name: "函館山", wikiTitle: "函館山", address: "函館市函館山", time: "16:30", stay: 90, memo: "「世界三大夜景」の一つに数えられる、函館随一の絶景。ロープウェイで山頂へ。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "朝市の海鮮とレトロな街並み、函館グルメさんぽ1泊2日",
    description: "函館朝市の海鮮丼から始まり、異国情緒あふれる元町の教会群、湯の川温泉での一泊まで。函館の「食」と「街歩き」を楽しむプランです。",
    nights: 1,
    prefectureName: "北海道",
    areaNames: ["函館"],
    tagNames: ["温泉"],
    purposeNames: ["温泉", "夜景"],
    days: [
      [
        { name: "函館朝市", wikiTitle: "函館朝市", address: "函館市若松町9-19", time: "8:30", stay: 60, memo: "新鮮な海鮮丼やイカ釣り体験が楽しめる、函館名物の朝市。" },
        { name: "函館ハリストス正教会", wikiTitle: "函館ハリストス正教会", address: "函館市元町3-13", time: "10:10", stay: 30, memo: "「ガンガン寺」の愛称で親しまれる、異国情緒あふれる教会。", transit: { mode: "bus", min: 20, line: "函館市電" } },
        { name: "八幡坂", wikiTitle: "函館市", address: "函館市末広町", time: "10:53", stay: 30, memo: "港を一直線に見下ろす、函館を代表する坂道の景観。", transit: { mode: "walk", min: 13 }, fallbackLatLng: [41.7717, 140.7144] },
        { name: "金森赤レンガ倉庫", wikiTitle: "金森赤レンガ倉庫", address: "函館市末広町14-12", time: "11:40", stay: 60, memo: "海沿いの倉庫群でランチとお土産探しを楽しむ。", transit: { mode: "walk", min: 10 } },
        { name: "湯の川温泉", wikiTitle: "湯の川温泉", address: "函館市湯川町", time: "16:00", stay: 60, memo: "函館空港にも近い、道南を代表する温泉街。宿でゆっくり過ごす。", transit: { mode: "bus", min: 30, line: "函館市電" } },
      ],
      [
        { name: "トラピスチヌ修道院", wikiTitle: "トラピスチヌ修道院", address: "函館市上湯川町346", time: "9:30", stay: 40, memo: "日本初の女子観想修道院。美しいマリア像と庭園が見どころ。" },
        { name: "立待岬", wikiTitle: "立待岬", address: "函館市住吉町", time: "10:40", stay: 30, memo: "津軽海峡を望む、石川啄木ゆかりの景勝地。", transit: { mode: "car", min: 20 } },
        { name: "函館山", wikiTitle: "函館山", address: "函館市函館山", time: "11:30", stay: 40, memo: "昼間の函館山からも、港町の街並みが一望できる。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "大沼公園まで足をのばす、自然とグルメの函館たっぷり1泊2日",
    description: "定番の街歩きに加えて、郊外の大沼国定公園でのんびり自然を楽しむ、少し違った函館の魅力を発見するプランです。",
    nights: 1,
    prefectureName: "北海道",
    areaNames: ["函館"],
    tagNames: ["絶景", "家族旅行"],
    purposeNames: ["自然", "城・史跡"],
    days: [
      [
        { name: "大沼国定公園", wikiTitle: "大沼国定公園", address: "亀田郡七飯町大沼町1023", time: "9:30", stay: 100, memo: "駒ヶ岳を望む湖沼群。サイクリングや遊覧船が楽しめる。宿からJR函館本線で約40分。" },
        { name: "五稜郭公園", wikiTitle: "五稜郭", address: "函館市五稜郭町44", time: "13:00", stay: 50, memo: "大沼から函館市街に戻り、星形の城郭跡を散策。", transit: { mode: "train", min: 40, line: "JR函館本線" } },
        { name: "五稜郭タワー", wikiTitle: "五稜郭タワー", address: "函館市五稜郭町43-9", time: "14:00", stay: 40, memo: "五稜郭の全景を上空から眺める。", transit: { mode: "walk", min: 5 } },
      ],
      [
        { name: "函館朝市", wikiTitle: "函館朝市", address: "函館市若松町9-19", time: "8:30", stay: 50, memo: "2日目の朝は市場で海鮮の朝ごはん。" },
        { name: "旧函館区公会堂", wikiTitle: "旧函館区公会堂", address: "函館市元町11-13", time: "10:00", stay: 40, memo: "元町の洋館群を散策し、函館の異国情緒を味わう。", transit: { mode: "bus", min: 15, line: "函館市電" } },
        { name: "金森赤レンガ倉庫", wikiTitle: "金森赤レンガ倉庫", address: "函館市末広町14-12", time: "11:10", stay: 60, memo: "最後にベイエリアでお土産を買って旅を締めくくる。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },

  // ============================================================
  // 大阪府 堺・泉南
  // ============================================================
  {
    title: "世界遺産・百舌鳥古墳群と刃物の街、堺の歴史を巡る日帰りプラン",
    description: "仁徳天皇陵古墳をはじめとする世界遺産の古墳群と、伝統の堺打刃物。古代から続く「堺」の歴史を定番スポットで辿ります。",
    nights: 0,
    prefectureName: "大阪府",
    areaNames: ["堺・泉南"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡"],
    days: [
      [
        { name: "仁徳天皇陵古墳（大仙古墳）", wikiTitle: "仁徳天皇陵古墳", address: "堺市堺区大仙町", time: "9:00", stay: 40, memo: "世界最大級の墳墓とされる、百舌鳥古墳群の中心的存在。" },
        { name: "堺市博物館", wikiTitle: "堺市博物館", address: "堺市堺区百舌鳥夕雲町2丁200-1", time: "9:55", stay: 50, memo: "古墳や堺の歴史を分かりやすく紹介する博物館。", transit: { mode: "walk", min: 12 } },
        { name: "南宗寺", wikiTitle: "南宗寺", address: "堺市堺区南旅篭町東3丁1-2", time: "11:30", stay: 40, memo: "千利休ゆかりの禅寺。枯山水の庭園でも知られる。", transit: { mode: "bus", min: 25 } },
        { name: "さかい利晶の杜", wikiTitle: "さかい利晶の杜", address: "堺市堺区宿院町西2丁1-1", time: "12:30", stay: 40, memo: "千利休と与謝野晶子、二人の堺の偉人を紹介する文化施設。", transit: { mode: "walk", min: 10 } },
        { name: "堺伝統産業会館", wikiTitle: "堺市", address: "堺市堺区宿院町西2丁1-1", time: "13:25", stay: 40, memo: "堺打刃物や線香など、伝統工芸品を紹介・販売する施設。", transit: { mode: "car", min: 5 } },
      ],
    ],
  },
  {
    title: "関空の絶景とアウトレット、海辺の泉南をのんびり楽しむ日帰り旅",
    description: "堺から少し南へ。関西国際空港を望む夕日の名所や、海辺のアウトレットモールでショッピングを楽しむ、海と買い物のプランです。",
    nights: 0,
    prefectureName: "大阪府",
    areaNames: ["堺・泉南"],
    tagNames: ["海・リゾート"],
    purposeNames: ["ビーチ・海水浴", "ショッピング"],
    days: [
      [
        { name: "二色の浜公園", wikiTitle: "二色の浜公園", address: "貝塚市二色南町", time: "9:30", stay: 60, memo: "白砂の海岸が続く、大阪府内屈指の海浜公園。" },
        { name: "水間寺", wikiTitle: "水間寺", address: "貝塚市水間638", time: "11:00", stay: 40, memo: "厄除け観音として親しまれる、日本最古の厄除け寺の一つ。", transit: { mode: "car", min: 15 } },
        { name: "りんくう公園", wikiTitle: "りんくう公園", address: "泉佐野市りんくう往来北1", time: "12:30", stay: 40, memo: "関西国際空港を望む、夕日の名所としても人気の公園。", transit: { mode: "car", min: 20 } },
        { name: "りんくうプレミアム・アウトレット", wikiTitle: "りんくうプレミアム・アウトレット", address: "泉佐野市りんくう往来南3-28", time: "13:25", stay: 90, memo: "関西国際空港近くにある、海沿いの大型アウトレットモール。", transit: { mode: "walk", min: 12 } },
      ],
    ],
  },
  {
    title: "犬鳴山と淡輪ビーチ、泉南の自然と絶景を満喫する日帰りプラン",
    description: "修験道の山・犬鳴山の渓流と、透明度抜群の淡輪ときめきビーチ。泉南エリアの自然の豊かさを感じるプランです。",
    nights: 0,
    prefectureName: "大阪府",
    areaNames: ["堺・泉南"],
    tagNames: ["海・リゾート"],
    purposeNames: ["自然", "ビーチ・海水浴"],
    days: [
      [
        { name: "犬鳴山", wikiTitle: "犬鳴山", address: "泉佐野市大木", time: "9:00", stay: 80, memo: "七宝滝寺を中心とする、修験道の山として知られる景勝地。渓流沿いのハイキングも楽しめる。", fallbackLatLng: [34.3789, 135.3939] },
        { name: "淡輪ときめきビーチ", wikiTitle: "岬町", address: "泉南郡岬町淡輪", time: "11:30", stay: 70, memo: "大阪府内でも屈指の透明度を誇る、人気の海水浴場。", transit: { mode: "car", min: 30 } },
        { name: "りんくう公園", wikiTitle: "りんくう公園", address: "泉佐野市りんくう往来北1", time: "13:10", stay: 40, memo: "帰り道、関西国際空港を望む夕景スポットに立ち寄る。", transit: { mode: "car", min: 20 } },
      ],
    ],
  },

  // ============================================================
  // 奈良県 奈良市内
  // ============================================================
  {
    title: "大仏さまと鹿に会える、奈良公園・東大寺の定番日帰りプラン",
    description: "奈良観光の王道、東大寺の大仏と奈良公園の鹿。初めての奈良で外せない定番スポットを効率よく巡ります。",
    nights: 0,
    prefectureName: "奈良県",
    areaNames: ["奈良市内"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "神社"],
    days: [
      [
        { name: "東大寺", wikiTitle: "東大寺", address: "奈良市雑司町406-1", time: "9:00", stay: 60, memo: "奈良の大仏で知られる、世界最大級の木造建築を持つ寺院。" },
        { name: "奈良公園", wikiTitle: "奈良公園", address: "奈良市登大路町30", time: "10:15", stay: 40, memo: "1200頭以上の鹿が暮らす、奈良を代表する広大な公園。", transit: { mode: "walk", min: 8 } },
        { name: "春日大社", wikiTitle: "春日大社", address: "奈良市春日野町160", time: "11:10", stay: 45, memo: "朱塗りの社殿と数千基の灯籠が並ぶ、世界遺産の神社。", transit: { mode: "walk", min: 15 } },
        { name: "興福寺", wikiTitle: "興福寺", address: "奈良市登大路町48", time: "12:40", stay: 40, memo: "五重塔が奈良のシンボルとなっている、藤原氏ゆかりの寺院。", transit: { mode: "walk", min: 20 } },
        { name: "猿沢池", wikiTitle: "猿沢池", address: "奈良市登大路町49", time: "13:30", stay: 20, memo: "興福寺の五重塔を水面に映す、奈良を代表する景勝地。", transit: { mode: "walk", min: 5 } },
      ],
    ],
  },
  {
    title: "町家とカフェ、奈良町をぶらり歩く1泊2日ゆったり旅",
    description: "定番の大仏詣でに加えて、風情ある奈良町の町家やカフェ、少し足を延ばした西ノ京の古寺まで。ゆっくり奈良を味わう旅です。",
    nights: 1,
    prefectureName: "奈良県",
    areaNames: ["奈良市内"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "美術館・博物館"],
    days: [
      [
        { name: "奈良国立博物館", wikiTitle: "奈良国立博物館", address: "奈良市登大路町50", time: "9:30", stay: 60, memo: "仏教美術を中心とした、日本有数のコレクションを誇る博物館。" },
        { name: "興福寺", wikiTitle: "興福寺", address: "奈良市登大路町48", time: "10:50", stay: 30, memo: "国宝の五重塔と阿修羅像で知られる古刹。", transit: { mode: "walk", min: 10 } },
        { name: "猿沢池", wikiTitle: "猿沢池", address: "奈良市登大路町49", time: "11:30", stay: 15, memo: "興福寺の五重塔を水面に映す、奈良町の入口。", transit: { mode: "walk", min: 5 } },
        { name: "奈良町（ならまち）", wikiTitle: "奈良町", address: "奈良市中院町周辺", time: "12:00", stay: 90, memo: "格子造りの町家が残る旧市街地。カフェや雑貨店を巡りながらランチ。", transit: { mode: "walk", min: 10 }, fallbackLatLng: [34.6775, 135.83] },
        { name: "元興寺", wikiTitle: "元興寺", address: "奈良市中院町11", time: "13:45", stay: 30, memo: "飛鳥時代創建の古刹。世界最古級の瓦が今も屋根に残る。", transit: { mode: "walk", min: 6 } },
      ],
      [
        { name: "唐招提寺", wikiTitle: "唐招提寺", address: "奈良市五条町13-46", time: "9:30", stay: 50, memo: "唐僧・鑑真が創建した、優美な金堂で知られる世界遺産の寺。" },
        { name: "薬師寺", wikiTitle: "薬師寺", address: "奈良市西ノ京町457", time: "10:50", stay: 50, memo: "白鳳伽藍の美しさで知られる、法相宗の大本山。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "依水園と般若寺、奈良の穴場庭園と花の寺を訪ねる日帰り旅",
    description: "定番スポットから少し離れて、東大寺の借景を活かした名庭園や、秋にコスモスが咲く「花の寺」など、静かな奈良の魅力を発見するプランです。",
    nights: 0,
    prefectureName: "奈良県",
    areaNames: ["奈良市内"],
    tagNames: ["紅葉"],
    purposeNames: ["美術館・博物館", "花見・桜"],
    days: [
      [
        { name: "依水園", wikiTitle: "依水園", address: "奈良市水門町74", time: "9:30", stay: 50, memo: "東大寺の借景を活かした、江戸期と明治期の二つの庭園。" },
        { name: "東大寺", wikiTitle: "東大寺", address: "奈良市雑司町406-1", time: "10:40", stay: 50, memo: "庭園の後は大仏殿へ。静かな時間帯を狙って参拝。", transit: { mode: "walk", min: 10 } },
        { name: "般若寺", wikiTitle: "般若寺", address: "奈良市般若寺町221", time: "12:10", stay: 40, memo: "秋のコスモスで有名な、「コスモス寺」の愛称を持つ古刹（見頃は例年9〜10月、公式サイトで確認）。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },

  // ============================================================
  // 奈良県 飛鳥
  // ============================================================
  {
    title: "石舞台と高松塚古墳、レンタサイクルで巡る飛鳥・古代ロマン日帰りプラン",
    description: "古代日本の中心地だった明日香村。巨石の石舞台古墳や極彩色壁画の高松塚古墳など、定番の史跡をレンタサイクルで効率よく巡ります。",
    nights: 0,
    prefectureName: "奈良県",
    areaNames: ["飛鳥"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡"],
    days: [
      [
        { name: "高松塚古墳", wikiTitle: "高松塚古墳", address: "高市郡明日香村平田", time: "9:00", stay: 40, memo: "極彩色の壁画が発見されたことで一躍有名になった古墳。" },
        { name: "天武・持統天皇陵", wikiTitle: "天武・持統天皇陵", address: "高市郡明日香村野口", time: "9:55", stay: 20, memo: "夫婦で合葬された、日本初の八角形の天皇陵。", transit: { mode: "car", min: 8 } },
        { name: "石舞台古墳", wikiTitle: "石舞台古墳", address: "高市郡明日香村島庄254", time: "10:35", stay: 40, memo: "巨石を組み上げた、日本最大級の石室を持つ古墳。", transit: { mode: "car", min: 8 } },
        { name: "岡寺", wikiTitle: "岡寺", address: "高市郡明日香村岡806", time: "11:35", stay: 35, memo: "日本最初の厄除け霊場として信仰を集める古刹。", transit: { mode: "car", min: 5 } },
        { name: "橘寺", wikiTitle: "橘寺", address: "高市郡明日香村橘532", time: "12:30", stay: 30, memo: "聖徳太子生誕の地とされる古刹。", transit: { mode: "walk", min: 13 } },
      ],
    ],
  },
  {
    title: "甘樫丘の絶景と謎の石造物、飛鳥をじっくり歩く1泊2日",
    description: "1日目は甘樫丘からの絶景と飛鳥寺、2日目は亀石や酒船石など飛鳥ならではの「謎の石造物」を巡る、じっくり型のプランです。",
    nights: 1,
    prefectureName: "奈良県",
    areaNames: ["飛鳥"],
    tagNames: ["学生旅行"],
    purposeNames: ["自然", "城・史跡"],
    days: [
      [
        { name: "甘樫丘", wikiTitle: "甘樫丘", address: "高市郡明日香村豊浦", time: "9:00", stay: 40, memo: "飛鳥の里を一望できる丘。大和三山も見渡せる。" },
        { name: "飛鳥寺", wikiTitle: "飛鳥寺", address: "高市郡明日香村飛鳥682", time: "10:00", stay: 30, memo: "日本最古の本格的寺院。飛鳥大仏が今も本尊として佇む。", transit: { mode: "walk", min: 15 } },
        { name: "奈良文化財研究所飛鳥資料館", wikiTitle: "飛鳥資料館", address: "高市郡明日香村奥山601", time: "10:55", stay: 45, memo: "飛鳥時代の出土品や資料を展示する専門博物館。", transit: { mode: "walk", min: 10 } },
      ],
      [
        { name: "亀石", wikiTitle: "亀石_(明日香村)", address: "高市郡明日香村川原", time: "9:30", stay: 15, memo: "亀の形をした、飛鳥の数ある謎の石造物の一つ。" },
        { name: "酒船石遺跡", wikiTitle: "酒船石", address: "高市郡明日香村岡", time: "10:00", stay: 25, memo: "用途不明の謎めいた石造物が残る、古代の遺構。", transit: { mode: "walk", min: 15 } },
        { name: "飛鳥京跡", wikiTitle: "飛鳥京跡", address: "高市郡明日香村岡", time: "10:40", stay: 25, memo: "飛鳥時代の宮殿跡と伝わる、発掘調査が進む史跡。", transit: { mode: "walk", min: 10 } },
        { name: "橘寺", wikiTitle: "橘寺", address: "高市郡明日香村橘532", time: "11:30", stay: 30, memo: "最後に聖徳太子生誕の地とされる古刹に参拝。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "石舞台の夜間ライトアップも。明日香村の自然を満喫する1泊2日",
    description: "定番史跡に加えて、田園風景の中をゆったり歩く飛鳥ならではの自然を楽しむプラン。石舞台古墳は季節によって夜間ライトアップも行われます（開催有無は公式サイトで確認）。",
    nights: 1,
    prefectureName: "奈良県",
    areaNames: ["飛鳥"],
    tagNames: ["家族旅行"],
    purposeNames: ["自然", "お寺"],
    days: [
      [
        { name: "石舞台古墳", wikiTitle: "石舞台古墳", address: "高市郡明日香村島庄254", time: "9:30", stay: 40, memo: "巨石を組み上げた日本最大級の石室。周辺は公園として整備されている。" },
        { name: "橘寺", wikiTitle: "橘寺", address: "高市郡明日香村橘532", time: "10:30", stay: 30, memo: "聖徳太子生誕の地とされる古刹。", transit: { mode: "walk", min: 15 } },
        { name: "岡寺", wikiTitle: "岡寺", address: "高市郡明日香村岡806", time: "11:15", stay: 35, memo: "日本最初の厄除け霊場。石段の参道と紅葉も見どころ。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "甘樫丘", wikiTitle: "甘樫丘", address: "高市郡明日香村豊浦", time: "9:00", stay: 45, memo: "2日目は朝の澄んだ空気の中、丘からの眺めを楽しむ。" },
        { name: "高松塚古墳", wikiTitle: "高松塚古墳", address: "高市郡明日香村平田", time: "10:10", stay: 30, memo: "壁画で有名な古墳。周辺は公園として整備され、散策にも良い。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-01" });
