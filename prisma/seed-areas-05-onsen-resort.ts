/**
 * 公式しおりデータ登録・再開バッチ5（docs/specs/20260924-shiori-data-resume.md）
 * 紅葉特集(seed-koyo-2026.ts)で各1件のみ公開だったエリアに、コンセプトが重ならない2件ずつを追加する。
 * 対象: 神奈川県 箱根 / 栃木県 日光 / 長野県 軽井沢 / 山梨県 富士五湖 / 静岡県 熱海
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-05-onsen-resort.ts
 *   登録モード: npx tsx prisma/seed-areas-05-onsen-resort.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // ============================================================
  // 神奈川県 箱根（既存: 登山電車で巡る紅葉1泊2日）
  // ============================================================
  {
    title: "彫刻の森美術館と芦ノ湖クルーズ、箱根の芸術と絶景を楽しむ日帰りプラン",
    description: "野外彫刻の美術館から、海賊船での芦ノ湖クルーズまで。箱根ならではのアートと自然を一日で楽しむ定番プランです。",
    nights: 0,
    prefectureName: "神奈川県",
    areaNames: ["箱根"],
    tagNames: ["絶景"],
    purposeNames: ["美術館・博物館", "絶景・フォトスポット"],
    days: [
      [
        { name: "彫刻の森美術館", wikiTitle: "彫刻の森美術館", address: "足柄下郡箱根町二ノ平1121", time: "9:30", stay: 90, memo: "箱根の山々を背景に野外彫刻が並ぶ、日本初の野外美術館。" },
        { name: "大涌谷", wikiTitle: "大涌谷", address: "足柄下郡箱根町仙石原", time: "11:40", stay: 50, memo: "今も噴煙を上げる活火山の跡地。黒たまごが名物。", transit: { mode: "bus", min: 30, line: "箱根登山バス" } },
        { name: "箱根海賊船（桃源台港）", wikiTitle: "芦ノ湖", address: "足柄下郡箱根町元箱根", time: "13:00", stay: 40, memo: "芦ノ湖を渡る、海賊船をモチーフにした遊覧船。", transit: { mode: "bus", min: 15, line: "箱根登山バス" } },
        { name: "箱根神社", wikiTitle: "箱根神社", address: "足柄下郡箱根町元箱根80-1", time: "13:50", stay: 30, memo: "湖上に立つ鳥居で知られる、箱根の総鎮守。", transit: { mode: "other", min: 10 } },
      ],
    ],
  },
  {
    title: "強羅温泉でのんびり、箱根美術館と庭園めぐり1泊2日",
    description: "登山電車の終点・強羅エリアに宿泊し、庭園美術館や公園をゆったり巡る、温泉重視のリラックスプランです。",
    nights: 1,
    prefectureName: "神奈川県",
    areaNames: ["箱根"],
    tagNames: ["温泉"],
    purposeNames: ["温泉", "自然"],
    days: [
      [
        { name: "箱根美術館", wikiTitle: "箱根美術館", address: "足柄下郡箱根町強羅1300", time: "10:00", stay: 60, memo: "苔庭と陶磁器のコレクションで知られる、静かな美術館。" },
        { name: "強羅公園", wikiTitle: "強羅公園", address: "足柄下郡箱根町強羅1300", time: "11:20", stay: 60, memo: "フランス式整型庭園が広がる、噴水が美しい公園。", transit: { mode: "walk", min: 10 } },
        { name: "強羅温泉", wikiTitle: "強羅温泉", address: "足柄下郡箱根町強羅", time: "15:00", stay: 60, memo: "宿に入り、温泉でゆっくり旅の疲れを癒す。", transit: { mode: "car", min: 8 } },
      ],
      [
        { name: "長安寺", wikiTitle: "長安寺_(箱根町)", address: "足柄下郡箱根町強羅1320", time: "9:30", stay: 30, memo: "五百羅漢像が並ぶ、静かな山寺。", fallbackLatLng: [35.2394, 139.0508] },
        { name: "恩賜箱根公園", wikiTitle: "恩賜箱根公園", address: "足柄下郡箱根町元箱根171", time: "10:40", stay: 40, memo: "旧箱根離宮跡に整備された、芦ノ湖畔の公園。", transit: { mode: "bus", min: 25, line: "箱根登山バス" } },
      ],
    ],
  },

  // ============================================================
  // 栃木県 日光（既存: いろは坂から奥日光へ紅葉1泊2日）
  // ============================================================
  {
    title: "日光東照宮と輪王寺、世界遺産の社寺を巡る定番日帰りプラン",
    description: "「日光を見ずして結構と言うなかれ」と称される、絢爛豪華な日光東照宮を中心に、世界遺産の社寺群を巡る王道プランです。",
    nights: 0,
    prefectureName: "栃木県",
    areaNames: ["日光"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "お寺"],
    days: [
      [
        { name: "神橋", wikiTitle: "神橋", address: "日光市上鉢石町", time: "9:00", stay: 20, memo: "朱塗りの美しい橋。日光山の玄関口として知られる聖地。" },
        { name: "日光山輪王寺", wikiTitle: "輪王寺", address: "日光市山内2300", time: "9:30", stay: 40, memo: "三仏堂に本尊を祀る、日光山最大の寺院。", transit: { mode: "walk", min: 10 } },
        { name: "日光東照宮", wikiTitle: "日光東照宮", address: "日光市山内2301", time: "10:30", stay: 70, memo: "眠り猫や陽明門で知られる、徳川家康を祀る絢爛豪華な神社。", transit: { mode: "walk", min: 10 } },
        { name: "日光二荒山神社", wikiTitle: "日光二荒山神社", address: "日光市山内2307", time: "12:00", stay: 30, memo: "日光の氏神を祀る、縁結びでも知られる古社。", transit: { mode: "walk", min: 5 } },
      ],
    ],
  },
  {
    title: "中禅寺湖と華厳の滝、奥日光の絶景自然を満喫する1泊2日",
    description: "紅葉シーズン以外でも美しい、中禅寺湖畔と華厳の滝の景観をじっくり楽しむプラン。新緑や夏の避暑にもおすすめです。",
    nights: 1,
    prefectureName: "栃木県",
    areaNames: ["日光"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "自然"],
    days: [
      [
        { name: "華厳の滝", wikiTitle: "華厳滝", address: "日光市中宮祠", time: "10:30", stay: 40, memo: "落差97mの豪快な滝。エレベーターで滝つぼ近くまで降りられる。" },
        { name: "中禅寺湖", wikiTitle: "中禅寺湖", address: "日光市中宮祠", time: "11:40", stay: 60, memo: "男体山の噴火でできた、標高1269mの高原の湖。遊覧船も楽しめる。", transit: { mode: "car", min: 8 } },
      ],
      [
        { name: "竜頭ノ滝", wikiTitle: "竜頭ノ滝", address: "日光市中宮祠", time: "9:30", stay: 40, memo: "二筋に分かれて流れ落ちる、竜の頭のような形の滝。" },
        { name: "戦場ヶ原", wikiTitle: "戦場ヶ原", address: "日光市中宮祠", time: "10:40", stay: 70, memo: "湿原を歩く自然研究路が整備された、雄大な高原。", transit: { mode: "car", min: 10 } },
      ],
    ],
  },

  // ============================================================
  // 長野県 軽井沢（既存: 雲場池の紅葉さんぽ日帰り）
  // ============================================================
  {
    title: "旧軽井沢銀座とアウトレット、軽井沢ショッピング&避暑日帰りプラン",
    description: "教会が点在する旧軽井沢の街並みから、大型アウトレットモールまで。ショッピングを中心に楽しむ、定番の軽井沢プランです。",
    nights: 0,
    prefectureName: "長野県",
    areaNames: ["軽井沢"],
    tagNames: ["定番観光"],
    purposeNames: ["ショッピング", "高原・避暑"],
    days: [
      [
        { name: "旧軽井沢銀座通り", wikiTitle: "軽井沢町", address: "北佐久郡軽井沢町軽井沢", time: "9:30", stay: 70, memo: "別荘族に愛されてきた、老舗店が並ぶメインストリート。" },
        { name: "軽井沢聖パウロカトリック教会", wikiTitle: "軽井沢聖パウロカトリック教会", address: "北佐久郡軽井沢町軽井沢179", time: "10:50", stay: 25, memo: "堀辰雄の小説にも登場する、三角屋根が印象的な教会。", transit: { mode: "car", min: 8 } },
        { name: "旧三笠ホテル", wikiTitle: "旧三笠ホテル", address: "北佐久郡軽井沢町軽井沢1339-342", time: "11:35", stay: 30, memo: "「軽井沢の迎賓館」と呼ばれた、純西洋式木造ホテルの先駆け。", transit: { mode: "car", min: 10 } },
        { name: "軽井沢・プリンスショッピングプラザ", wikiTitle: "軽井沢・プリンスショッピングプラザ", address: "北佐久郡軽井沢町軽井沢", time: "12:30", stay: 100, memo: "国内最大級のアウトレットモールでランチとお買い物。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "白糸の滝とタリアセン、自然を感じる軽井沢1泊2日リゾート旅",
    description: "マイナスイオンあふれる白糸の滝や、塩沢湖畔のリゾート施設タリアセンなど、軽井沢の自然をじっくり楽しむプランです。",
    nights: 1,
    prefectureName: "長野県",
    areaNames: ["軽井沢"],
    tagNames: ["絶景"],
    purposeNames: ["自然", "高原・避暑"],
    days: [
      [
        { name: "白糸の滝", wikiTitle: "白糸の滝_(軽井沢町)", address: "北佐久郡軽井沢町長倉", time: "9:30", stay: 40, memo: "幅70mにわたり、絹糸のように流れ落ちる美しい滝。" },
        { name: "雲場池", wikiTitle: "雲場池", address: "北佐久郡軽井沢町軽井沢", time: "11:00", stay: 40, memo: "「スワンレイク」の愛称で親しまれる、静かな湖。", transit: { mode: "car", min: 20 } },
      ],
      [
        { name: "軽井沢タリアセン", wikiTitle: "塩沢湖", address: "北佐久郡軽井沢町塩沢818", time: "9:30", stay: 90, memo: "塩沢湖畔に広がる、美術館や庭園が集まるリゾート施設。" },
      ],
    ],
  },

  // ============================================================
  // 山梨県 富士五湖（既存: もみじ回廊と富士山の紅葉日帰り）
  // ============================================================
  {
    title: "富士山を一望、大石公園と河口湖の定番絶景スポット日帰りプラン",
    description: "河口湖畔の花公園や展望スポットから、雄大な富士山の姿を楽しむ定番プラン。四季を通じて富士山ビューを満喫できます。",
    nights: 0,
    prefectureName: "山梨県",
    areaNames: ["富士五湖"],
    tagNames: ["絶景"],
    purposeNames: ["絶景・フォトスポット", "自然"],
    days: [
      [
        { name: "大石公園", wikiTitle: "河口湖", address: "南都留郡富士河口湖町大石", time: "9:30", stay: 50, memo: "季節の花と富士山を一緒に楽しめる、河口湖北岸の公園。" },
        { name: "久保田一竹美術館", wikiTitle: "久保田一竹美術館", address: "南都留郡富士河口湖町河口2255", time: "10:50", stay: 50, memo: "独自の染色技法「一竹辻が花」の作品を展示する美術館。", transit: { mode: "car", min: 15 } },
        { name: "河口湖〜富士山パノラマロープウェイ", wikiTitle: "河口湖天上山公園", address: "南都留郡富士河口湖町浅川1163-1", time: "12:10", stay: 60, memo: "山頂から富士山と河口湖を一望できる、天上山への空中散歩。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "西湖・本栖湖も。五つの湖を巡る富士五湖のんびりドライブ1泊2日",
    description: "定番の河口湖から足を延ばして、静かな西湖や、千円札の図柄でも有名な本栖湖まで。富士五湖をぐるりと巡るドライブプランです。",
    nights: 1,
    prefectureName: "山梨県",
    areaNames: ["富士五湖"],
    tagNames: ["絶景", "家族旅行"],
    purposeNames: ["ドライブ", "自然"],
    days: [
      [
        { name: "新倉山浅間公園", wikiTitle: "新倉山浅間公園", address: "富士吉田市新倉3353-1", time: "9:30", stay: 50, memo: "五重塔と富士山を一緒に望める、忠霊塔の絶景スポット。" },
        { name: "西湖いやしの里根場", wikiTitle: "西湖いやしの里根場", address: "南都留郡富士河口湖町西湖根場2710", time: "11:00", stay: 60, memo: "茅葺き屋根の集落を再現した、昔ながらの里山風景。", transit: { mode: "car", min: 30 } },
      ],
      [
        { name: "本栖湖", wikiTitle: "本栖湖", address: "南都留郡富士河口湖町本栖", time: "9:30", stay: 60, memo: "千円札の図柄にも採用された、富士五湖で最も透明度の高い湖。" },
      ],
    ],
  },

  // ============================================================
  // 静岡県 熱海（既存: 梅と花火の温泉街、冬の日帰り旅）
  // ============================================================
  {
    title: "来宮神社とMOA美術館、熱海の定番パワースポット&アート日帰りプラン",
    description: "巨大な楠で知られるパワースポット・来宮神社と、黄金の茶室でも有名なMOA美術館。熱海の信仰とアートを巡る定番プランです。",
    nights: 0,
    prefectureName: "静岡県",
    areaNames: ["熱海"],
    tagNames: ["定番観光"],
    purposeNames: ["神社", "美術館・博物館"],
    days: [
      [
        { name: "来宮神社", wikiTitle: "来宮神社", address: "熱海市西山町43-1", time: "9:30", stay: 50, memo: "樹齢2000年超の大楠で知られる、熱海随一のパワースポット。" },
        { name: "MOA美術館", wikiTitle: "MOA美術館", address: "熱海市桃山町26-2", time: "10:50", stay: 80, memo: "国宝「紅白梅図屏風」などを収蔵する、相模灘を望む美術館。", transit: { mode: "car", min: 10 } },
        { name: "熱海城", wikiTitle: "熱海城", address: "熱海市曽我山1993", time: "12:40", stay: 40, memo: "天守閣からの眺望が人気の、昭和レトロな観光城。", transit: { mode: "car", min: 15 } },
      ],
    ],
  },
  {
    title: "熱海サンビーチと商店街、温泉街グルメを楽しむ1泊2日リラックス旅",
    description: "熱海銀座の商店街で食べ歩きをしながら、サンビーチでのんびり。海と温泉、両方を楽しむ王道の熱海旅です。",
    nights: 1,
    prefectureName: "静岡県",
    areaNames: ["熱海"],
    tagNames: ["温泉", "グルメ"],
    purposeNames: ["温泉", "ビーチ・海水浴"],
    days: [
      [
        { name: "熱海サンビーチ", wikiTitle: "熱海サンビーチ", address: "熱海市渚町", time: "10:00", stay: 50, memo: "ヤシの木が並ぶ、南国リゾートのような雰囲気のビーチ。" },
        { name: "熱海銀座商店街", wikiTitle: "熱海市", address: "熱海市銀座町", time: "11:10", stay: 80, memo: "干物や温泉まんじゅうなど、食べ歩きグルメが揃う商店街。", transit: { mode: "walk", min: 15 } },
      ],
      [
        { name: "熱海梅園", wikiTitle: "熱海梅園", address: "熱海市梅園町8-11", time: "9:30", stay: 60, memo: "早咲きの梅で知られる日本庭園。四季を通じて緑豊か。" },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-05" });
