/**
 * 公式しおりデータ登録・再開バッチ9（docs/specs/20260924-shiori-data-resume.md）
 * 公開0件エリア、関西地方。
 * 対象: 兵庫県 神戸・姫路 / 和歌山県 高野山・白浜・熊野古道 / 滋賀県 大津・琵琶湖・彦根・長浜
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-09-kansai2.ts
 *   登録モード: npx tsx prisma/seed-areas-09-kansai2.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 兵庫県 神戸
  // ============================================================
  {
    title: "北野異人館街とメリケンパーク、定番の神戸港町さんぽ日帰りプラン",
    description: "異国情緒あふれる北野異人館街から、神戸港のシンボル・メリケンパークまで。港町・神戸の魅力を1日で巡る定番プランです。",
    nights: 0,
    prefectureName: "兵庫県",
    areaNames: ["神戸"],
    tagNames: ["定番観光"],
    purposeNames: ["絶景・フォトスポット"],
    days: [
      [
        { name: "北野異人館街", wikiTitle: "北野異人館街", address: "神戸市中央区北野町", time: "9:30", stay: 90, memo: "明治〜大正期の洋館が並ぶ、神戸を代表する観光地。" },
        { name: "神戸北野天満神社", wikiTitle: "北野天満神社_(神戸市)", address: "神戸市中央区北野町3丁目12-1", time: "11:10", stay: 20, memo: "異人館街の高台に鎮座する、菅原道真公を祀る神社。", transit: { mode: "walk", min: 10 } },
        { name: "メリケンパーク", wikiTitle: "メリケンパーク", address: "神戸市中央区波止場町2", time: "12:10", stay: 50, memo: "神戸ポートタワーと「BE KOBE」モニュメントで有名な港の公園。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "南京町で食べ歩き、神戸中華街グルメを満喫する日帰りプラン",
    description: "日本三大中華街の一つ、南京町で食べ歩きグルメを楽しむ。神戸ハーバーランドの景色も合わせて満喫するプランです。",
    nights: 0,
    prefectureName: "兵庫県",
    areaNames: ["神戸"],
    tagNames: ["グルメ"],
    purposeNames: ["ショッピング"],
    days: [
      [
        { name: "南京町", wikiTitle: "南京町_(神戸市)", address: "神戸市中央区栄町通", time: "10:30", stay: 90, memo: "日本三大中華街の一つ。豚まんや小籠包の食べ歩きが人気。" },
        { name: "神戸ハーバーランド", wikiTitle: "神戸ハーバーランド", address: "神戸市中央区東川崎町1丁目", time: "12:30", stay: 60, memo: "商業施設が集まる、神戸港を望むウォーターフロントエリア。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },
  {
    title: "六甲山の夜景と有馬温泉、神戸の絶景と湯めぐり1泊2日",
    description: "「日本三大夜景」の一つに数えられる六甲山からの夜景と、日本三古泉の一つ・有馬温泉。神戸の絶景と温泉を両方楽しむプランです。",
    nights: 1,
    prefectureName: "兵庫県",
    areaNames: ["神戸"],
    tagNames: ["絶景", "温泉"],
    purposeNames: ["夜景", "温泉"],
    days: [
      [
        { name: "六甲山天覧台", wikiTitle: "六甲山", address: "神戸市灘区六甲山町一ケ谷", time: "16:00", stay: 90, memo: "「1000万ドルの夜景」と称される、日本三大夜景の一つ。" },
      ],
      [
        { name: "有馬温泉", wikiTitle: "有馬温泉", address: "神戸市北区有馬町", time: "10:00", stay: 90, memo: "日本三古泉の一つ。金泉・銀泉と呼ばれる2種類の湯が楽しめる。" },
      ],
    ],
  },

  // ============================================================
  // 兵庫県 姫路
  // ============================================================
  {
    title: "世界遺産・姫路城と好古園、白鷺城を巡る定番日帰りプラン",
    description: "「白鷺城」の愛称で親しまれる世界遺産・姫路城と、隣接する日本庭園・好古園。姫路観光の王道を巡る日帰りプランです。",
    nights: 0,
    prefectureName: "兵庫県",
    areaNames: ["姫路"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡"],
    days: [
      [
        { name: "姫路城", wikiTitle: "姫路城", address: "姫路市本町68", time: "9:30", stay: 120, memo: "日本初の世界文化遺産。純白の外観から「白鷺城」とも呼ばれる。" },
        { name: "好古園", wikiTitle: "好古園", address: "姫路市本町68", time: "11:50", stay: 50, memo: "姫路城の西隣に広がる、9つの庭園からなる池泉回遊式庭園。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "書寫山圓教寺、西の比叡山と呼ばれる古刹を訪ねる姫路の歴史旅",
    description: "ロープウェイで登る書寫山の中腹に建つ圓教寺。「西の比叡山」とも呼ばれる、映画のロケ地にもなった荘厳な古刹を巡るプランです。",
    nights: 0,
    prefectureName: "兵庫県",
    areaNames: ["姫路"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "パワースポット"],
    days: [
      [
        { name: "書寫山ロープウェイ", wikiTitle: "書写山ロープウェイ", address: "姫路市書写1005", time: "9:30", stay: 15, memo: "書寫山の中腹まで一気に登るロープウェイ。" },
        { name: "圓教寺", wikiTitle: "円教寺", address: "姫路市書写2968", time: "10:05", stay: 100, memo: "「西の比叡山」と呼ばれる、天台宗の名刹。映画「ラストサムライ」のロケ地にも。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },
  {
    title: "姫路城のライトアップと市立美術館、大人の姫路1泊2日",
    description: "昼と夜、両方の表情を見せる姫路城。夜のライトアップを楽しみ、翌日は赤レンガの美術館でアートに触れる、じっくり型のプランです。",
    nights: 1,
    prefectureName: "兵庫県",
    areaNames: ["姫路"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "美術館・博物館"],
    days: [
      [
        { name: "姫路城", wikiTitle: "姫路城", address: "姫路市本町68", time: "10:00", stay: 120, memo: "まずは昼間の姫路城をじっくり見学。" },
        { name: "姫路市立美術館", wikiTitle: "姫路市立美術館", address: "姫路市本町68-25", time: "18:30", stay: 40, memo: "夜はライトアップされた赤レンガの美術館と姫路城を眺める。", transit: { mode: "walk", min: 10 } },
      ],
      [
        { name: "好古園", wikiTitle: "好古園", address: "姫路市本町68", time: "9:30", stay: 50, memo: "2日目の朝、静かな時間帯に日本庭園を散策。" },
      ],
    ],
  },

  // ============================================================
  // 和歌山県 高野山
  // ============================================================
  {
    title: "金剛峯寺と壇上伽藍、真言密教の聖地・高野山を巡る定番日帰りプラン",
    description: "弘法大師空海が開いた真言密教の聖地・高野山。総本山金剛峯寺と壇上伽藍を巡る、定番の日帰りプランです。",
    nights: 0,
    prefectureName: "和歌山県",
    areaNames: ["高野山"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "パワースポット"],
    days: [
      [
        { name: "金剛峯寺", wikiTitle: "金剛峯寺", address: "伊都郡高野町高野山132", time: "9:30", stay: 60, memo: "高野山真言宗の総本山。日本最大級の石庭「蟠龍庭」も見どころ。" , fallbackLatLng: [34.2128, 135.5850] },
        { name: "壇上伽藍", wikiTitle: "壇上伽藍", address: "伊都郡高野町高野山152", time: "10:50", stay: 60, memo: "根本大塔や金堂が立ち並ぶ、高野山信仰の中心地。", transit: { mode: "walk", min: 10 }, fallbackLatLng: [34.2144, 135.5828] },
      ],
    ],
  },
  {
    title: "奥の院の杉並木と燈籠堂、弘法大師の御廟を訪ねる祈りの旅",
    description: "樹齢数百年の杉並木に、20万基を超える墓石や供養塔が並ぶ奥の院。弘法大師が今も瞑想を続けるとされる御廟までの参道を歩くプランです。",
    nights: 0,
    prefectureName: "和歌山県",
    areaNames: ["高野山"],
    tagNames: ["定番観光"],
    purposeNames: ["パワースポット", "自然"],
    days: [
      [
        { name: "奥の院", wikiTitle: "奥の院_(高野山)", address: "伊都郡高野町高野山550", time: "9:30", stay: 100, memo: "弘法大師御廟に続く、荘厳な杉並木の参道。20万基を超える墓石が並ぶ。" , fallbackLatLng: [34.2128, 135.5892] },
        { name: "徳川家霊台", wikiTitle: "徳川家霊台", address: "伊都郡高野町高野山", time: "11:30", stay: 20, memo: "徳川家康・秀忠を祀る、極彩色の美しい霊廟建築。", transit: { mode: "walk", min: 15 }, fallbackLatLng: [34.2144, 135.5878] },
      ],
    ],
  },
  {
    title: "宿坊に泊まり精進料理と朝の勤行を体験する、高野山1泊2日修行の旅",
    description: "高野山ならではの宿坊に宿泊し、精進料理と早朝の勤行を体験する、特別な1泊2日プラン。心静かに過ごす時間を提供します。",
    nights: 1,
    prefectureName: "和歌山県",
    areaNames: ["高野山"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "パワースポット"],
    days: [
      [
        { name: "壇上伽藍", wikiTitle: "壇上伽藍", address: "伊都郡高野町高野山152", time: "14:00", stay: 60, memo: "宿坊へのチェックイン前に、根本大塔などを参拝。" , fallbackLatLng: [34.2144, 135.5828] },
        { name: "金剛峯寺", wikiTitle: "金剛峯寺", address: "伊都郡高野町高野山132", time: "15:20", stay: 50, memo: "夕方、比較的静かな時間帯に総本山を参拝。", transit: { mode: "walk", min: 10 }, fallbackLatLng: [34.2128, 135.5850] },
      ],
      [
        { name: "奥の院", wikiTitle: "奥の院_(高野山)", address: "伊都郡高野町高野山550", time: "6:00", stay: 60, memo: "早朝の勤行のあと、澄んだ空気の中を奥の院まで散策。" , fallbackLatLng: [34.2128, 135.5892] },
      ],
    ],
  },

  // ============================================================
  // 和歌山県 白浜
  // ============================================================
  {
    title: "三段壁と千畳敷、白浜の絶景海岸を巡る定番日帰りプラン",
    description: "断崖絶壁が続く三段壁と、波の浸食でできた広大な千畳敷。白浜を代表する2つの絶景スポットを巡る定番プランです。",
    nights: 0,
    prefectureName: "和歌山県",
    areaNames: ["白浜"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット"],
    days: [
      [
        { name: "三段壁", wikiTitle: "三段壁", address: "西牟婁郡白浜町459", time: "9:30", stay: 50, memo: "高さ50mの断崖が2kmにわたって続く、迫力満点の景勝地。" },
        { name: "千畳敷", wikiTitle: "千畳敷_(白浜町)", address: "西牟婁郡白浜町2927-72", time: "10:50", stay: 40, memo: "波の浸食でできた、白い岩肌が広がる広大な奇岩景観。", transit: { mode: "car", min: 10 } },
        { name: "円月島", wikiTitle: "円月島", address: "西牟婁郡白浜町臨海", time: "11:50", stay: 30, memo: "中央に穴が開いた、白浜のシンボル的な島。夕日の名所。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },
  {
    title: "アドベンチャーワールドでパンダに会う、家族で楽しむ白浜日帰りプラン",
    description: "ジャイアントパンダに会えることで有名なアドベンチャーワールド。動物とふれあい、パフォーマンスも楽しめる、家族連れ向けのプランです。",
    nights: 0,
    prefectureName: "和歌山県",
    areaNames: ["白浜"],
    tagNames: ["家族旅行"],
    purposeNames: ["動物園・水族館", "テーマパーク"],
    days: [
      [
        { name: "アドベンチャーワールド", wikiTitle: "アドベンチャーワールド", address: "西牟婁郡白浜町堅田2399", time: "9:30", stay: 240, memo: "ジャイアントパンダをはじめ、様々な動物と出会えるテーマパーク。" },
      ],
    ],
  },
  {
    title: "白良浜と温泉、南紀白浜のリゾート気分を満喫する1泊2日",
    description: "白い砂浜が美しい白良浜での海水浴と、日本三古湯の一つ・白浜温泉。南国リゾートのような雰囲気を味わう1泊2日プランです。",
    nights: 1,
    prefectureName: "和歌山県",
    areaNames: ["白浜"],
    tagNames: ["海・リゾート", "温泉"],
    purposeNames: ["ビーチ・海水浴", "温泉"],
    days: [
      [
        { name: "白良浜", wikiTitle: "白良浜海水浴場", address: "西牟婁郡白浜町864-1", time: "10:00", stay: 120, memo: "真っ白な砂浜と青い海のコントラストが美しい、南紀白浜を代表するビーチ。" },
      ],
      [
        { name: "円月島", wikiTitle: "円月島", address: "西牟婁郡白浜町臨海", time: "9:30", stay: 30, memo: "2日目の朝、静かな時間帯に円月島を眺めながら散策。" },
      ],
    ],
  },

  // ============================================================
  // 和歌山県 熊野古道
  // ============================================================
  {
    title: "熊野本宮大社と大斎原、世界遺産・熊野古道の聖地を巡る日帰りプラン",
    description: "熊野三山の中心・熊野本宮大社と、かつて社殿があった大斎原の巨大な鳥居。熊野信仰の中心地を巡る定番プランです。",
    nights: 0,
    prefectureName: "和歌山県",
    areaNames: ["熊野古道"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "パワースポット"],
    days: [
      [
        { name: "熊野本宮大社", wikiTitle: "熊野本宮大社", address: "田辺市本宮町本宮1110", time: "9:30", stay: 50, memo: "熊野三山の中心。全国に4700社ある熊野神社の総本宮。" },
        { name: "大斎原", wikiTitle: "大斎原", address: "田辺市本宮町本宮", time: "10:40", stay: 40, memo: "高さ34mの日本一大きな鳥居がそびえる、熊野本宮大社の旧社地。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "熊野那智大社と那智の滝、絶景の熊野古道パワースポット旅",
    description: "落差133m、那智の滝を御神体とする飛瀧神社と、朱塗りの熊野那智大社。熊野古道随一の絶景を楽しむプランです。",
    nights: 0,
    prefectureName: "和歌山県",
    areaNames: ["熊野古道"],
    tagNames: ["絶景"],
    purposeNames: ["神社", "絶景・フォトスポット"],
    days: [
      [
        { name: "那智の滝", wikiTitle: "那智滝", address: "東牟婁郡那智勝浦町那智山", time: "9:30", stay: 40, memo: "落差133m、日本三名瀑の一つ。滝そのものが御神体として祀られる。" },
        { name: "熊野那智大社", wikiTitle: "熊野那智大社", address: "東牟婁郡那智勝浦町那智山1", time: "10:40", stay: 40, memo: "朱塗りの社殿が美しい、熊野三山の一つ。三重塔と滝の景観でも有名。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },
  {
    title: "熊野三山をすべて巡る、世界遺産・熊野古道じっくり1泊2日",
    description: "熊野本宮大社・熊野那智大社・熊野速玉大社の熊野三山をすべて巡る、熊野信仰を深く体感できる本格的な1泊2日プランです。",
    nights: 1,
    prefectureName: "和歌山県",
    areaNames: ["熊野古道"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "パワースポット"],
    days: [
      [
        { name: "熊野本宮大社", wikiTitle: "熊野本宮大社", address: "田辺市本宮町本宮1110", time: "9:30", stay: 50, memo: "熊野三山めぐりの最初に、熊野信仰の中心地へ。" },
        { name: "大斎原", wikiTitle: "大斎原", address: "田辺市本宮町本宮", time: "10:40", stay: 30, memo: "旧社地の大鳥居を参拝。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "熊野速玉大社", wikiTitle: "熊野速玉大社", address: "新宮市新宮1", time: "9:00", stay: 40, memo: "熊野川の河口近くに鎮座する、朱塗りの美しい神社。" },
        { name: "熊野那智大社", wikiTitle: "熊野那智大社", address: "東牟婁郡那智勝浦町那智山1", time: "11:00", stay: 50, memo: "最後に那智の滝を望む、熊野三山最後の一社へ。", transit: { mode: "car", min: 40 } },
      ],
    ],
  },

  // ============================================================
  // 滋賀県 大津・琵琶湖
  // ============================================================
  {
    title: "比叡山延暦寺と三井寺、世界遺産の古刹を巡る大津日帰りプラン",
    description: "世界遺産・比叡山延暦寺と、近江八景の一つに数えられる三井寺。琵琶湖を望む2つの名刹を巡る、大津観光の定番プランです。",
    nights: 0,
    prefectureName: "滋賀県",
    areaNames: ["大津・琵琶湖"],
    tagNames: ["定番観光"],
    purposeNames: ["お寺", "パワースポット"],
    days: [
      [
        { name: "比叡山延暦寺", wikiTitle: "延暦寺", address: "大津市坂本本町4220", time: "9:30", stay: 100, memo: "伝教大師最澄が開いた、天台宗の総本山。世界文化遺産にも登録。" },
        { name: "三井寺", wikiTitle: "園城寺", address: "大津市園城寺町246", time: "12:00", stay: 50, memo: "近江八景「三井の晩鐘」で知られる、天台寺門宗の総本山。", transit: { mode: "car", min: 20 } },
      ],
    ],
  },
  {
    title: "琵琶湖疏水とびわ湖大津館、湖畔の絶景さんぽ日帰りプラン",
    description: "京都に水を引く琵琶湖疏水の取水口や、湖畔に建つ洋館・びわ湖大津館。琵琶湖のほとりをゆったり散策するプランです。",
    nights: 0,
    prefectureName: "滋賀県",
    areaNames: ["大津・琵琶湖"],
    tagNames: ["絶景"],
    purposeNames: ["自然", "絶景・フォトスポット"],
    days: [
      [
        { name: "琵琶湖疏水", wikiTitle: "琵琶湖疏水", address: "大津市三井寺町", time: "9:30", stay: 40, memo: "琵琶湖の水を京都へ引く、明治期の一大土木事業の取水口。" },
        { name: "びわ湖大津館", wikiTitle: "びわ湖大津館", address: "大津市柳が崎5-35", time: "10:40", stay: 60, memo: "湖畔に建つ、バラ庭園が美しいヨーロッパ調の洋館。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "琵琶湖クルーズと大津の街、湖国をゆったり楽しむ1泊2日",
    description: "琵琶湖の雄大な景色を船から楽しみ、大津の街を歩く。湖国・滋賀の魅力をじっくり味わう1泊2日プランです。",
    nights: 1,
    prefectureName: "滋賀県",
    areaNames: ["大津・琵琶湖"],
    tagNames: ["絶景"],
    purposeNames: ["自然", "絶景・フォトスポット"],
    days: [
      [
        { name: "びわ湖大津館", wikiTitle: "びわ湖大津館", address: "大津市柳が崎5-35", time: "13:00", stay: 60, memo: "湖畔の洋館でランチと庭園散策。" },
        { name: "琵琶湖疏水", wikiTitle: "琵琶湖疏水", address: "大津市三井寺町", time: "14:30", stay: 40, memo: "取水口周辺の桜並木や運河沿いを散策。", transit: { mode: "car", min: 15 } },
      ],
      [
        { name: "三井寺", wikiTitle: "園城寺", address: "大津市園城寺町246", time: "9:30", stay: 50, memo: "2日目の朝、静かな境内で琵琶湖を見渡す。" },
      ],
    ],
  },

  // ============================================================
  // 滋賀県 彦根
  // ============================================================
  {
    title: "国宝・彦根城とひこにゃん、定番の彦根さんぽ日帰りプラン",
    description: "国宝5城の一つ・彦根城と、人気キャラクター「ひこにゃん」。城下町・彦根の定番観光を楽しむ日帰りプランです。",
    nights: 0,
    prefectureName: "滋賀県",
    areaNames: ["彦根"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡"],
    days: [
      [
        { name: "彦根城", wikiTitle: "彦根城", address: "彦根市金亀町1-1", time: "9:30", stay: 90, memo: "国宝5城の一つ。井伊家の居城として知られる美しい天守。" },
        { name: "玄宮園", wikiTitle: "玄宮園", address: "彦根市金亀町3", time: "11:10", stay: 40, memo: "彦根城の北東に広がる、大名庭園の名園。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "夢京橋キャッスルロードで食べ歩き、彦根の城下町グルメ日帰りプラン",
    description: "白壁と黒格子の町家が並ぶ夢京橋キャッスルロードで、近江牛や地元グルメを食べ歩く、彦根のグルメを満喫するプランです。",
    nights: 0,
    prefectureName: "滋賀県",
    areaNames: ["彦根"],
    tagNames: ["グルメ"],
    purposeNames: ["ショッピング"],
    days: [
      [
        { name: "夢京橋キャッスルロード", wikiTitle: "彦根市", address: "彦根市本町1丁目", time: "10:00", stay: 90, memo: "江戸時代の町並みを再現した、食べ歩きとお土産探しに人気の通り。" },
        { name: "彦根城", wikiTitle: "彦根城", address: "彦根市金亀町1-1", time: "12:00", stay: 80, memo: "食べ歩きのあと、国宝の天守を見学。", transit: { mode: "walk", min: 10 } },
      ],
    ],
  },
  {
    title: "彦根城の紅葉とライトアップ、じっくり型の彦根1泊2日",
    description: "紅葉の名所としても知られる彦根城と玄宮園。昼と夜、二つの表情をじっくり楽しむ、ゆったり型の1泊2日プランです。",
    nights: 1,
    prefectureName: "滋賀県",
    areaNames: ["彦根"],
    tagNames: ["紅葉"],
    purposeNames: ["城・史跡", "紅葉狩り"],
    days: [
      [
        { name: "彦根城", wikiTitle: "彦根城", address: "彦根市金亀町1-1", time: "10:00", stay: 90, memo: "昼間の彦根城をじっくり見学（紅葉の見頃は例年11月中旬〜下旬）。" },
        { name: "玄宮園", wikiTitle: "玄宮園", address: "彦根市金亀町3", time: "18:00", stay: 60, memo: "夜はライトアップされた庭園を鑑賞（開催時期は公式サイトで確認）。", transit: { mode: "walk", min: 10 } },
      ],
      [
        { name: "夢京橋キャッスルロード", wikiTitle: "彦根市", address: "彦根市本町1丁目", time: "9:30", stay: 60, memo: "2日目の朝は城下町をのんびり食べ歩き。" },
      ],
    ],
  },

  // ============================================================
  // 滋賀県 長浜
  // ============================================================
  {
    title: "長浜城と黒壁スクエア、豊臣秀吉ゆかりの城下町を歩く日帰りプラン",
    description: "豊臣秀吉が初めて城持ち大名となった長浜城と、レトロなガラス工芸の街・黒壁スクエア。長浜の歴史と文化を巡る定番プランです。",
    nights: 0,
    prefectureName: "滋賀県",
    areaNames: ["長浜"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "ショッピング"],
    days: [
      [
        { name: "長浜城歴史博物館", wikiTitle: "長浜城_(近江国)", address: "長浜市公園町10-10", time: "9:30", stay: 50, memo: "豊臣秀吉が初めて城持ち大名となった城を再建した、歴史博物館。" },
        { name: "黒壁スクエア", wikiTitle: "黒壁スクエア", address: "長浜市元浜町14-8", time: "10:50", stay: 90, memo: "黒漆喰の蔵造りが並ぶ、ガラス工芸で有名なレトロな街並み。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "慶雲館と豊国神社、長浜の歴史的建造物を巡る文化さんぽプラン",
    description: "迎賓館として建てられた慶雲館や、秀吉を祀る豊国神社。黒壁スクエアの喧騒から少し離れて、長浜の歴史を静かに辿るプランです。",
    nights: 0,
    prefectureName: "滋賀県",
    areaNames: ["長浜"],
    tagNames: ["定番観光"],
    purposeNames: ["城・史跡", "神社"],
    days: [
      [
        { name: "慶雲館", wikiTitle: "慶雲館_(長浜市)", address: "長浜市港町2-5", time: "9:30", stay: 40, memo: "明治天皇の行在所として建てられた、迎賓館建築。庭園も見事。" },
        { name: "豊国神社", wikiTitle: "豊国神社_(長浜市)", address: "長浜市南呉服町6-37", time: "10:40", stay: 30, memo: "長浜の町衆が秀吉を偲んで建てた神社。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
  {
    title: "黒壁スクエアと琵琶湖畔、長浜をじっくり満喫する1泊2日",
    description: "ガラス工芸体験や食べ歩きを楽しみながら、琵琶湖畔の景色も満喫する、長浜をじっくり味わう1泊2日プランです。",
    nights: 1,
    prefectureName: "滋賀県",
    areaNames: ["長浜"],
    tagNames: ["グルメ"],
    purposeNames: ["ものづくり体験", "ショッピング"],
    days: [
      [
        { name: "黒壁スクエア", wikiTitle: "黒壁スクエア", address: "長浜市元浜町14-8", time: "10:00", stay: 120, memo: "ガラス工芸の体験教室にも挑戦しながら、街並みをじっくり散策。" },
        { name: "長浜城歴史博物館", wikiTitle: "長浜城_(近江国)", address: "長浜市公園町10-10", time: "13:00", stay: 40, memo: "天守からは琵琶湖と長浜の街を一望できる。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "慶雲館", wikiTitle: "慶雲館_(長浜市)", address: "長浜市港町2-5", time: "9:30", stay: 40, memo: "2日目の朝は、静かな庭園でゆっくり過ごす。" },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-09" });
