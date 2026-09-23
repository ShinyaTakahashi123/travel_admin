/**
 * 公式しおりデータ登録・再開バッチ3（docs/specs/20260924-shiori-data-resume.md）
 * 対象: 神奈川県 横浜 / 神奈川県 鎌倉 / 埼玉県 川越 / 千葉県 幕張・千葉市内 / 茨城県 水戸
 * （公開0件エリア優先の方針により、関東地方の0件エリアから選定）
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-03-kanto.ts
 *   登録モード: npx tsx prisma/seed-areas-03-kanto.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 神奈川県 横浜
  // ============================================================
  {
    title: "みなとみらいの絶景と中華街グルメ、横浜港町さんぽ日帰りプラン",
    description: "横浜ランドマークタワーからの眺望と、活気あふれる中華街での食べ歩き。横浜観光の定番を効率よく巡る日帰りプランです。",
    nights: 0,
    prefectureName: "神奈川県",
    areaNames: ["横浜"],
    tagNames: ["定番観光"],
    purposeNames: ["絶景・フォトスポット", "ショッピング"],
    days: [
      [
        { name: "横浜ランドマークタワー", wikiTitle: "横浜ランドマークタワー", address: "横浜市西区みなとみらい2丁目2-1", time: "9:30", stay: 60, memo: "展望フロアから横浜の街並みとベイエリアを一望できる超高層ビル。" },
        { name: "横浜赤レンガ倉庫", wikiTitle: "横浜赤レンガ倉庫", address: "横浜市中区新港1丁目1", time: "11:00", stay: 60, memo: "明治期の保税倉庫を活用した、ショップやレストランが並ぶ人気スポット。", transit: { mode: "walk", min: 20 } },
        { name: "山下公園", wikiTitle: "山下公園", address: "横浜市中区山下町279", time: "12:30", stay: 30, memo: "海を望む、横浜港を代表する臨海公園。", transit: { mode: "walk", min: 20 } },
        { name: "横浜中華街", wikiTitle: "横浜中華街", address: "横浜市中区山下町", time: "13:10", stay: 80, memo: "日本最大級のチャイナタウン。食べ歩きグルメの宝庫。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "港の見える丘公園と元町、異国情緒あふれる横浜1泊2日",
    description: "定番のみなとみらいから少し足を延ばして、洋館が残る山手エリアと、おしゃれな元町商店街を巡る、横浜の「西洋」の顔を楽しむプランです。",
    nights: 1,
    prefectureName: "神奈川県",
    areaNames: ["横浜"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "ショッピング"],
    days: [
      [
        { name: "港の見える丘公園", wikiTitle: "港の見える丘公園", address: "横浜市中区山手町114", time: "9:30", stay: 40, memo: "ベイブリッジと港を一望できる、山手エリアの高台の公園。" },
        { name: "山手西洋館", wikiTitle: "山手 (横浜市)", address: "横浜市中区山手町", time: "10:30", stay: 60, memo: "異人館通りに点在する、明治〜昭和初期の洋館群。", transit: { mode: "walk", min: 10 }, fallbackLatLng: [35.4372, 139.6539] },
        { name: "元町商店街", wikiTitle: "元町・中華街駅", address: "横浜市中区元町", time: "12:00", stay: 90, memo: "おしゃれなセレクトショップやカフェが並ぶ、横浜屈指の商店街。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "横浜みなと博物館", wikiTitle: "横浜みなと博物館", address: "横浜市西区みなとみらい2丁目1-1", time: "9:30", stay: 50, memo: "横浜港の歴史と日本丸を紹介する博物館。" },
        { name: "横浜赤レンガ倉庫", wikiTitle: "横浜赤レンガ倉庫", address: "横浜市中区新港1丁目1", time: "10:50", stay: 60, memo: "最後にレンガ倉庫でショッピングと軽食を楽しむ。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },
  {
    title: "カップヌードルミュージアムと工場夜景、家族で楽しむ横浜体験プラン",
    description: "インスタントラーメンの歴史を学べる体験型ミュージアムと、横浜ならではの工場夜景クルーズ。定番観光とは一味違う、体験重視のプランです。",
    nights: 0,
    prefectureName: "神奈川県",
    areaNames: ["横浜"],
    tagNames: ["家族旅行"],
    purposeNames: ["テーマパーク", "夜景"],
    days: [
      [
        { name: "カップヌードルミュージアム横浜", wikiTitle: "カップヌードルミュージアム", address: "横浜市中区新港2丁目3-4", time: "10:00", stay: 100, memo: "自分だけのオリジナルカップヌードルが作れる、体験型ミュージアム。" },
        { name: "横浜赤レンガ倉庫", wikiTitle: "横浜赤レンガ倉庫", address: "横浜市中区新港1丁目1", time: "12:10", stay: 60, memo: "ミュージアムのすぐ近く。ランチとお土産探しに立ち寄る。", transit: { mode: "walk", min: 10 } },
        { name: "よこはまコスモワールド", wikiTitle: "よこはまコスモワールド", address: "横浜市中区新港2丁目8-1", time: "15:30", stay: 90, memo: "大観覧車が目印の遊園地。日没後は夜景も楽しめる。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },

  // ============================================================
  // 神奈川県 鎌倉
  // ============================================================
  {
    title: "大仏さまと江ノ電、鎌倉の定番社寺と海を巡る日帰りプラン",
    description: "鎌倉大仏や鶴岡八幡宮など、古都・鎌倉の定番スポットに加え、江ノ電に乗って海辺の景色も楽しむ王道プランです。",
    nights: 0,
    prefectureName: "神奈川県",
    areaNames: ["鎌倉"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "神社"],
    days: [
      [
        { name: "鶴岡八幡宮", wikiTitle: "鶴岡八幡宮", address: "鎌倉市雪ノ下2丁目1-31", time: "9:00", stay: 50, memo: "鎌倉のシンボル。源頼朝ゆかりの鎌倉最大の神社。" },
        { name: "小町通り", wikiTitle: "小町通り", address: "鎌倉市小町", time: "10:13", stay: 50, memo: "食べ歩きグルメや雑貨店が並ぶ、鎌倉駅前の賑やかな通り。", transit: { mode: "walk", min: 13 } },
        { name: "高徳院（鎌倉大仏）", wikiTitle: "高徳院", address: "鎌倉市長谷4丁目2-28", time: "11:40", stay: 40, memo: "国宝の鎌倉大仏で知られる浄土宗の寺院。", transit: { mode: "bus", min: 20, line: "江ノ電バス" } },
        { name: "長谷寺", wikiTitle: "長谷寺_(鎌倉市)", address: "鎌倉市長谷3丁目11-2", time: "12:40", stay: 40, memo: "海を望む眺望と、あじさいの名所としても知られる古刹。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "竹林と紫陽花、鎌倉の名庭と自然をゆったり巡る1泊2日",
    description: "報国寺の竹林や明月院の紫陽花など、鎌倉の四季を感じる庭園を中心に巡る、少しゆっくりめのプランです。",
    nights: 1,
    prefectureName: "神奈川県",
    areaNames: ["鎌倉"],
    tagNames: ["紅葉"],
    purposeNames: ["お寺", "自然"],
    days: [
      [
        { name: "報国寺", wikiTitle: "報国寺", address: "鎌倉市浄明寺2丁目7-4", time: "9:30", stay: 50, memo: "「竹の寺」として知られる、2000本の孟宗竹が茂る禅寺。" },
        { name: "杉本寺", wikiTitle: "杉本寺", address: "鎌倉市二階堂903", time: "10:50", stay: 30, memo: "鎌倉最古の寺と伝わる、苔むした石段が印象的な古刹。", transit: { mode: "walk", min: 15 } },
        { name: "鶴岡八幡宮", wikiTitle: "鶴岡八幡宮", address: "鎌倉市雪ノ下2丁目1-31", time: "11:50", stay: 40, memo: "鎌倉のシンボルに参拝し、ぼたん庭園も散策。", transit: { mode: "walk", min: 20 } },
      ],
      [
        { name: "明月院", wikiTitle: "明月院", address: "鎌倉市山ノ内189", time: "9:30", stay: 50, memo: "「あじさい寺」として有名。円窓から望む庭園も美しい（見頃は例年6月、公式サイトで確認）。" },
        { name: "円覚寺", wikiTitle: "円覚寺", address: "鎌倉市山ノ内409", time: "10:50", stay: 40, memo: "鎌倉五山第二位の禅宗の名刹。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "由比ヶ浜と稲村ヶ崎、江ノ電に揺られる鎌倉の海辺さんぽプラン",
    description: "定番の社寺めぐりから離れて、江ノ電の車窓とビーチの景色を楽しむ、海辺の鎌倉を満喫するプランです。",
    nights: 0,
    prefectureName: "神奈川県",
    areaNames: ["鎌倉"],
    tagNames: ["海・リゾート"],
    purposeNames: ["ビーチ・海水浴", "絶景・フォトスポット"],
    days: [
      [
        { name: "由比ヶ浜", wikiTitle: "由比ヶ浜", address: "鎌倉市由比ガ浜", time: "9:30", stay: 50, memo: "鎌倉を代表するビーチ。夏は海水浴客で賑わう。" },
        { name: "江ノ電（長谷〜鎌倉高校前）", wikiTitle: "江ノ島電鉄線", address: "鎌倉市", time: "10:40", stay: 30, memo: "海沿いを走る江ノ電の車窓からの景色を楽しむ乗車体験。", transit: { mode: "walk", min: 20 } },
        { name: "稲村ヶ崎", wikiTitle: "稲村ヶ崎", address: "鎌倉市稲村ガ崎1丁目", time: "11:40", stay: 40, memo: "富士山と江の島を一望できる、夕景の名所としても人気の岬。", transit: { mode: "train", min: 10, line: "江ノ島電鉄線" }, fallbackLatLng: [35.3086, 139.5342] },
      ],
    ],
  },

  // ============================================================
  // 埼玉県 川越
  // ============================================================
  {
    title: "蔵造りの町並みと時の鐘、小江戸・川越を歩く日帰りプラン",
    description: "「小江戸」と呼ばれる、蔵造りの建物が残る川越の中心部を巡る定番プラン。時の鐘やお菓子横丁など、江戸情緒を存分に楽しめます。",
    nights: 0,
    prefectureName: "埼玉県",
    areaNames: ["川越"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "ショッピング"],
    days: [
      [
        { name: "時の鐘", wikiTitle: "時の鐘_(川越市)", address: "川越市幸町15-7", time: "9:30", stay: 20, memo: "江戸時代から時を告げ続ける、川越のシンボル的な鐘楼。" },
        { name: "蔵造りの町並み", wikiTitle: "川越市", address: "川越市幸町周辺", time: "9:55", stay: 60, memo: "黒漆喰の蔵造りの商家が軒を連ねる、一番街の町並み。", transit: { mode: "walk", min: 5 } },
        { name: "菓子屋横丁", wikiTitle: "菓子屋横丁", address: "川越市元町2丁目", time: "11:10", stay: 40, memo: "昔ながらの駄菓子屋が並ぶ、レトロな路地。", transit: { mode: "walk", min: 10 } },
        { name: "川越氷川神社", wikiTitle: "川越氷川神社", address: "川越市宮下町2丁目11-3", time: "12:10", stay: 40, memo: "縁結びの神社として人気。風鈴回廊も有名（開催時期は公式サイトで確認）。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "喜多院と本丸御殿、川越の歴史と信仰をたどる日帰り旅",
    description: "定番の蔵造りの町並みから少し離れて、徳川家ゆかりの喜多院や、関東に現存する貴重な城郭建築・本丸御殿を巡る歴史プランです。",
    nights: 0,
    prefectureName: "埼玉県",
    areaNames: ["川越"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "城・史跡"],
    days: [
      [
        { name: "喜多院", wikiTitle: "喜多院", address: "川越市小仙波町1丁目20-1", time: "9:30", stay: 60, memo: "徳川家光誕生の間が残る、天台宗の名刹。五百羅漢でも有名。" },
        { name: "川越大師仲店通り", wikiTitle: "川越市", address: "川越市小仙波町周辺", time: "10:58", stay: 30, memo: "喜多院の参道に並ぶ、昔ながらの土産物店街。", transit: { mode: "walk", min: 13 } },
        { name: "川越城本丸御殿", wikiTitle: "川越城", address: "川越市郭町2丁目13-1", time: "11:48", stay: 40, memo: "関東地方で唯一現存する城郭御殿建築。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },
  {
    title: "小江戸の夜景とライトアップ、大人の川越さんぽ1泊2日",
    description: "昼の観光に加えて、夜のライトアップされた蔵造りの町並みも楽しむ、じっくり型の川越旅。地元のグルメも堪能します。",
    nights: 1,
    prefectureName: "埼玉県",
    areaNames: ["川越"],
    tagNames: ["グルメ"],
    purposeNames: ["夜景", "ショッピング"],
    days: [
      [
        { name: "蔵造りの町並み", wikiTitle: "川越市", address: "川越市幸町周辺", time: "10:00", stay: 60, memo: "昼の蔵造りの町並みをゆっくり散策。" },
        { name: "時の鐘", wikiTitle: "時の鐘_(川越市)", address: "川越市幸町15-7", time: "11:10", stay: 20, memo: "川越のシンボルを見学。", transit: { mode: "walk", min: 5 } },
        { name: "川越氷川神社", wikiTitle: "川越氷川神社", address: "川越市宮下町2丁目11-3", time: "17:30", stay: 40, memo: "夕方以降、ライトアップされた境内を訪れる。", transit: { mode: "walk", min: 20 } },
      ],
      [
        { name: "菓子屋横丁", wikiTitle: "菓子屋横丁", address: "川越市元町2丁目", time: "9:30", stay: 50, memo: "2日目は朝から駄菓子屋を巡ってお土産探し。" },
        { name: "喜多院", wikiTitle: "喜多院", address: "川越市小仙波町1丁目20-1", time: "10:40", stay: 50, memo: "最後に喜多院に参拝して旅を締めくくる。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },

  // ============================================================
  // 千葉県 幕張・千葉市内
  // ============================================================
  {
    title: "幕張メッセと海浜幕張、イベントと海辺の景色を楽しむ日帰りプラン",
    description: "幕張の海浜公園でのんびり過ごしながら、ショッピングモールやイベント施設が集まる幕張新都心エリアを巡るプランです。",
    nights: 0,
    prefectureName: "千葉県",
    areaNames: ["幕張・千葉市内"],
    tagNames: ["家族旅行"],
    purposeNames: ["ショッピング", "ビーチ・海水浴"],
    days: [
      [
        { name: "幕張海浜公園", wikiTitle: "幕張海浜公園", address: "千葉市美浜区ひび野2丁目", time: "9:30", stay: 70, memo: "東京湾を望む人工海浜が広がる、幕張のシンボル的な公園。" },
        { name: "イオンモール幕張新都心", wikiTitle: "イオンモール幕張新都心", address: "千葉市美浜区豊砂1-1", time: "11:00", stay: 90, memo: "国内最大級のショッピングモールでランチとお買い物。", transit: { mode: "car", min: 8 } },
        { name: "幕張メッセ", wikiTitle: "幕張メッセ", address: "千葉市美浜区中瀬2丁目1", time: "13:10", stay: 30, memo: "国内最大級のコンベンションセンター。外観だけでも一見の価値あり。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "千葉城と加曽利貝塚、千葉市の歴史と自然をたどる日帰り旅",
    description: "幕張エリアから少し離れて、千葉市中心部の史跡や、国内最大級の貝塚遺跡を巡る、歴史好きにおすすめのプランです。",
    nights: 0,
    prefectureName: "千葉県",
    areaNames: ["幕張・千葉市内"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "美術館・博物館"],
    days: [
      [
        { name: "千葉城（千葉市立郷土博物館）", wikiTitle: "千葉市立郷土博物館", address: "千葉市中央区亥鼻1丁目6-1", time: "9:30", stay: 50, memo: "模擬天守を利用した、千葉氏ゆかりの郷土博物館。" },
        { name: "加曽利貝塚", wikiTitle: "加曽利貝塚", address: "千葉市若葉区桜木8丁目33-1", time: "11:00", stay: 60, memo: "国内最大級の縄文時代の貝塚遺跡。特別史跡に指定。", transit: { mode: "car", min: 20 } },
        { name: "千葉神社", wikiTitle: "千葉神社", address: "千葉市中央区院内1丁目16-1", time: "12:30", stay: 30, memo: "妙見信仰の中心地として知られる、千葉の総鎮守。", transit: { mode: "car", min: 20 } },
      ],
    ],
  },
  {
    title: "海浜幕張の夜景クルーズと温浴施設、大人の幕張1泊2日リラックス旅",
    description: "昼は海辺の公園でのんびり、夜は温浴施設でリラックス。日常から少し離れて過ごす、癒し重視のプランです。",
    nights: 1,
    prefectureName: "千葉県",
    areaNames: ["幕張・千葉市内"],
    tagNames: ["温泉"],
    purposeNames: ["温泉", "ビーチ・海水浴"],
    days: [
      [
        { name: "幕張海浜公園", wikiTitle: "幕張海浜公園", address: "千葉市美浜区ひび野2丁目", time: "10:00", stay: 90, memo: "潮風を感じながら、東京湾を望む公園でゆったり過ごす。" },
        { name: "イオンモール幕張新都心", wikiTitle: "イオンモール幕張新都心", address: "千葉市美浜区豊砂1-1", time: "12:00", stay: 100, memo: "館内は広く、ランチや買い物をのんびり楽しめる。", transit: { mode: "car", min: 8 } },
      ],
      [
        { name: "千葉ポートタワー", wikiTitle: "千葉ポートタワー", address: "千葉市中央区中央港1丁目", time: "9:30", stay: 40, memo: "東京湾と富士山を一望できる、千葉港のシンボルタワー。" },
      ],
    ],
  },

  // ============================================================
  // 茨城県 水戸
  // ============================================================
  {
    title: "偕楽園と水戸城、日本三名園と徳川の歴史を巡る日帰りプラン",
    description: "日本三名園の一つ・偕楽園と、水戸黄門ゆかりの水戸城跡。梅の名所としても知られる水戸の定番観光地を巡るプランです。",
    nights: 0,
    prefectureName: "茨城県",
    areaNames: ["水戸"],
    tagNames: ["定番観光"],
    purposeNames: ["花見・桜", "城・史跡"],
    days: [
      [
        { name: "偕楽園", wikiTitle: "偕楽園", address: "水戸市見川1丁目", time: "9:30", stay: 80, memo: "日本三名園の一つ。梅の名所として知られる、広大な大名庭園（梅まつりは例年2〜3月、公式サイトで確認）。" },
        { name: "弘道館", wikiTitle: "弘道館", address: "水戸市三の丸1丁目6-29", time: "11:10", stay: 40, memo: "水戸藩の藩校。日本最大規模を誇った教育施設の遺構。", transit: { mode: "car", min: 15 } },
        { name: "水戸城跡（大手門）", wikiTitle: "水戸城", address: "水戸市三の丸2丁目", time: "12:00", stay: 30, memo: "復元された大手門が見どころの、水戸徳川家の居城跡。", transit: { mode: "walk", min: 8 } },
      ],
    ],
  },
  {
    title: "笠原水道と徳川ミュージアム、水戸黄門の足跡をたどる歴史日帰り旅",
    description: "定番の偕楽園から離れて、水戸徳川家ゆかりの品々を展示するミュージアムなど、より深く水戸の歴史を知るプランです。",
    nights: 0,
    prefectureName: "茨城県",
    areaNames: ["水戸"],
    tagNames: ["定番観光"],
    purposeNames: ["美術館・博物館", "城・史跡"],
    days: [
      [
        { name: "徳川ミュージアム", wikiTitle: "徳川ミュージアム", address: "水戸市見川1丁目1215-1", time: "9:30", stay: 70, memo: "水戸徳川家伝来の大名道具を展示する私立博物館。" },
        { name: "常磐神社", wikiTitle: "常磐神社", address: "水戸市常磐町1丁目3-1", time: "10:55", stay: 30, memo: "水戸光圀・斉昭を祀る神社。偕楽園に隣接。", transit: { mode: "walk", min: 15 } },
        { name: "水戸市立博物館", wikiTitle: "水戸市", address: "水戸市大町3丁目3-20", time: "11:45", stay: 40, memo: "水戸の歴史と文化を紹介する総合博物館。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "大洗の海の幸も。水戸から足を延ばす1泊2日満喫旅",
    description: "水戸城下の歴史散策に加えて、隣接する大洗で新鮮な海の幸と海辺の景色も楽しむ、欲張りな1泊2日プランです。",
    nights: 1,
    prefectureName: "茨城県",
    areaNames: ["水戸"],
    tagNames: ["グルメ"],
    purposeNames: ["城・史跡", "ビーチ・海水浴"],
    days: [
      [
        { name: "偕楽園", wikiTitle: "偕楽園", address: "水戸市見川1丁目", time: "9:30", stay: 70, memo: "日本三名園の一つをじっくり散策。" },
        { name: "水戸城跡（大手門）", wikiTitle: "水戸城", address: "水戸市三の丸2丁目", time: "11:00", stay: 40, memo: "復元された大手門と土塀を見学。", transit: { mode: "car", min: 15 } },
      ],
      [
        { name: "大洗磯前神社", wikiTitle: "大洗磯前神社", address: "東茨城郡大洗町磯浜町6890", time: "9:30", stay: 40, memo: "太平洋に面した海中の鳥居で有名な、絶景の神社。" },
        { name: "アクアワールド茨城県大洗水族館", wikiTitle: "アクアワールド茨城県大洗水族館", address: "東茨城郡大洗町磯浜町8252-3", time: "10:30", stay: 90, memo: "サメの飼育種類数日本一を誇る、大規模な水族館。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-03" });
