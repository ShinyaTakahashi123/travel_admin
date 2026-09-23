/**
 * 公式しおりデータ登録・再開バッチ2（docs/specs/20260924-shiori-data-resume.md）
 * 「3件」は既存の公開しおりと合算する方針（2026-09-24決定）のため、
 * 既存2件が公開中の5エリアに、コンセプトが重ならない1件ずつを追加する。
 * 対象: 北海道 富良野・美瑛 / 大阪府 梅田・大阪駅周辺 / 大阪府 難波・道頓堀 / 大阪府 天王寺・あべの / 奈良県 吉野
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-areas-02-kansai-hokkaido.ts
 *   登録モード: npx tsx prisma/seed-areas-02-kansai-hokkaido.ts --commit
 */
import { runHandmadeSeed, type HandmadeItinerary } from "./lib/handmade-gen";

const ITINERARIES: HandmadeItinerary[] = [
  // 既存2件（定番の丘めぐり日帰り／花畑フォトジェニック1泊2日）とは別に、ドライブ視点の1件を追加
  {
    title: "パッチワークの丘をレンタカーでドライブ、美瑛の絶景めぐり日帰り旅",
    description: "美瑛特有の「パッチワークの路」と呼ばれる丘陵地帯を、車で気ままに走り抜けるドライブプラン。定番とは違う美瑛の魅力を発見できます。",
    nights: 0,
    prefectureName: "北海道",
    areaNames: ["富良野・美瑛"],
    tagNames: ["絶景"],
    purposeNames: ["ドライブ", "絶景・フォトスポット"],
    days: [
      [
        { name: "美瑛の丘（パッチワークの路）", wikiTitle: "美瑛町", address: "上川郡美瑛町", time: "9:00", stay: 60, memo: "色とりどりの畑が織りなす、パッチワークのような丘陵地帯をドライブ。" },
        { name: "三愛の丘展望公園", wikiTitle: "美瑛町", address: "上川郡美瑛町大久保協生", time: "10:15", stay: 30, memo: "丘陵風景を360度見渡せる展望公園。", transit: { mode: "car", min: 15 } },
        { name: "拓真館", wikiTitle: "拓真館", address: "上川郡美瑛町美田", time: "11:00", stay: 30, memo: "風景写真の巨匠・前田真三のギャラリーで美瑛の魅力を再発見。", transit: { mode: "car", min: 15 } },
        { name: "青い池", wikiTitle: "青い池", address: "上川郡美瑛町白金", time: "11:55", stay: 40, memo: "ドライブの締めくくりに、神秘的な青い池へ。", transit: { mode: "car", min: 20 } },
      ],
    ],
  },
  // 既存2件（高層ビル街定番／グランフロント・中崎町さんぽ）とは別に、アート・緑視点の1件を追加
  {
    title: "東洋陶磁美術館と扇町公園、アートと緑を楽しむ梅田の穴場日帰り旅",
    description: "定番の高層ビルから少し離れて、世界屈指の陶磁コレクションを誇る美術館や、地元に愛される公園でゆったり過ごすプランです。",
    nights: 0,
    prefectureName: "大阪府",
    areaNames: ["梅田・大阪駅周辺"],
    tagNames: ["定番観光"],
    purposeNames: ["美術館・博物館"],
    days: [
      [
        { name: "大阪市立東洋陶磁美術館", wikiTitle: "大阪市立東洋陶磁美術館", address: "大阪市北区中之島1-1-26", time: "9:30", stay: 60, memo: "世界屈指の東洋陶磁コレクションを誇る美術館。" },
        { name: "グラングリーン大阪（うめきた公園）", wikiTitle: "グラングリーン大阪", address: "大阪市北区大深町", time: "11:00", stay: 50, memo: "大阪駅前に誕生した、都会のオアシスとなる大規模都市公園。", transit: { mode: "car", min: 8 } },
        { name: "扇町公園", wikiTitle: "扇町公園", address: "大阪市北区扇町2", time: "12:20", stay: 40, memo: "梅田の喧騒から少し離れた、市民に親しまれる緑豊かな公園。", transit: { mode: "walk", min: 20 } },
      ],
    ],
  },
  // 既存2件（食い倒れ定番／新世界レトロ夜景）とは別に、若者カルチャー視点の1件を追加
  {
    title: "アメリカ村で古着ハンティング、若者文化を楽しむミナミ散策プラン",
    description: "食い倒れだけじゃない、若者に人気のアメリカ村や大阪松竹座など、ミナミのカルチャーとエンタメを楽しむプランです。",
    nights: 0,
    prefectureName: "大阪府",
    areaNames: ["難波・道頓堀"],
    tagNames: ["学生旅行"],
    purposeNames: ["ショッピング"],
    days: [
      [
        { name: "アメリカ村", wikiTitle: "アメリカ村", address: "大阪市中央区西心斎橋1〜2丁目", time: "10:00", stay: 90, memo: "若者文化の発信地。古着屋やカフェが集まるエリアでお店巡り。" },
        { name: "心斎橋筋商店街", wikiTitle: "心斎橋筋商店街", address: "大阪市中央区心斎橋筋1〜2丁目", time: "11:40", stay: 50, memo: "アメ村から続くショッピングアーケードでランチとお買い物。", transit: { mode: "walk", min: 10 } },
        { name: "大阪松竹座", wikiTitle: "大阪松竹座", address: "大阪市中央区道頓堀1丁目9-19", time: "12:50", stay: 20, memo: "西洋建築とアール・デコが融合した、歴史ある劇場の外観を見学。", transit: { mode: "walk", min: 10 } },
        { name: "道頓堀", wikiTitle: "道頓堀", address: "大阪市中央区道頓堀1丁目", time: "13:20", stay: 40, memo: "最後は道頓堀川沿いを散策して締めくくる。", transit: { mode: "walk", min: 3 } },
      ],
    ],
  },
  // 既存2件（動物園中心1泊2日／ハルカス・四天王寺定番）とは別に、ショッピング・下町交通視点の1件を追加
  {
    title: "あべのキューズモールと路面電車、下町ショッピング日帰りプラン",
    description: "定番の大寺院や動物園から離れて、最新のショッピングモールと、下町を走るレトロな路面電車を楽しむ、街歩き中心のプランです。",
    nights: 0,
    prefectureName: "大阪府",
    areaNames: ["天王寺・あべの"],
    tagNames: ["定番観光"],
    purposeNames: ["ショッピング"],
    days: [
      [
        { name: "あべのキューズモール", wikiTitle: "あべのキューズモール", address: "大阪市阿倍野区阿倍野筋1丁目6-1", time: "10:00", stay: 90, memo: "天王寺・あべの地区最大級のショッピングモール。" },
        { name: "阪堺電車天王寺駅前停留場", wikiTitle: "阪堺電気軌道", address: "大阪市阿倍野区旭町1丁目", time: "11:40", stay: 30, memo: "「チンチン電車」の愛称で親しまれる、下町を走る路面電車に乗車体験。", transit: { mode: "walk", min: 10 }, fallbackLatLng: [34.6465, 135.5134] },
        { name: "桃ヶ池公園", wikiTitle: "桃ヶ池公園", address: "大阪市阿倍野区桃ケ池町1丁目", time: "12:40", stay: 30, memo: "路面電車を降りて、地元に愛される池のある公園でひと休み。", transit: { mode: "train", min: 10, line: "阪堺電気軌道上町線" } },
      ],
    ],
  },
  // 既存2件（一目千本の定番桜日帰り／金峯山寺・吉水神社1泊2日）とは別に、歴史・信仰視点の1件を追加
  {
    title: "南朝ゆかりの古刹めぐり、吉野の歴史をたどる日帰り旅",
    description: "桜のシーズン以外でも楽しめる、南朝の歴史ゆかりの寺社を巡るプラン。信仰と歴史の深い吉野山の魅力を静かに味わいます。",
    nights: 0,
    prefectureName: "奈良県",
    areaNames: ["吉野"],
    tagNames: ["紅葉"],
    purposeNames: ["お寺", "パワースポット"],
    days: [
      [
        { name: "如意輪寺", wikiTitle: "如意輪寺", address: "吉野郡吉野町吉野山1024", time: "9:30", stay: 35, memo: "南朝ゆかりの古刹。楠木正行の辞世の句でも知られる。" },
        { name: "吉水神社", wikiTitle: "吉水神社", address: "吉野郡吉野町吉野山579", time: "10:35", stay: 30, memo: "後醍醐天皇が一時居所とした、歴史ある書院づくりの神社。", transit: { mode: "walk", min: 25 } },
        { name: "金峯山寺", wikiTitle: "金峯山寺", address: "吉野郡吉野町吉野山2500", time: "11:35", stay: 45, memo: "修験道の総本山。国宝の蔵王堂で締めくくる。", transit: { mode: "walk", min: 15 } },
      ],
    ],
  },
];

runHandmadeSeed(ITINERARIES, { blobPrefix: "official-areas-02" });
