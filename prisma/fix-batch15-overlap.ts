/**
 * バッチ15で誤って「1件目+2件目の組み合わせ」になっていた7エリアの1泊2日プランを、
 * 実在する別スポットを使った独立コンセプトに差し替える自己修正スクリプト。
 * seed-areas-15-kyushu1.ts側は既に修正済み。ライブDBの既存レコードを更新する。
 */
import { prisma } from "../src/lib/prisma";
import { fetchAndUploadImage } from "./lib/pilot-gen";
import existingPhotoCache from "./photo-cache.json";

type Spot = { name: string; wikiTitle: string; address: string; lat: number; lng: number; memo: string; websiteUrl: string; time: string; stay: number; transit?: { mode: string; min: number; line?: string } };

function toUTCTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

const REPLACEMENTS: { oldTitle: string; newTitle: string; newDescription: string; days: Spot[][] }[] = [
  {
    oldTitle: "佐賀城公園の四季と歴史、じっくり満喫する1泊2日",
    newTitle: "佐賀県立博物館と旧古賀銀行、アートと明治レトロ建築を巡る1泊2日",
    newDescription: "佐賀の美術・工芸を紹介する佐賀県立博物館・美術館と、レトロな洋風建築が残る佐賀市歴史民俗館。城下町とは違う佐賀の表情を楽しむ1泊2日です。",
    days: [
      [{ name: "佐賀県立博物館・美術館", wikiTitle: "佐賀県立美術館", address: "佐賀市城内1丁目15-23", lat: 33.2495, lng: 130.2999, memo: "佐賀ゆかりの美術・工芸品を紹介する県立の博物館・美術館。", websiteUrl: "", time: "10:00", stay: 80 }],
      [{ name: "佐賀市歴史民俗館", wikiTitle: "佐賀市歴史民俗館", address: "佐賀市柳町2-9", lat: 33.2591, lng: 130.2988, memo: "2日目は、旧古賀銀行など明治〜大正期の洋風建築が残る一角を散策。", websiteUrl: "", time: "9:30", stay: 60 }],
    ],
  },
  {
    oldTitle: "有田と伊万里、二つの焼き物の里をはしごする1泊2日",
    newTitle: "有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史を学ぶ1泊2日",
    newDescription: "有田焼のルーツを伝える有田町歴史民俗資料館と、伊万里商人の暮らしを伝える陶器商家資料館。窯元通りとは違う、やきもの産業の歴史を学ぶ1泊2日です。",
    days: [
      [{ name: "有田町歴史民俗資料館", wikiTitle: "有田町", address: "西松浦郡有田町大樽1丁目4-1", lat: 33.2011, lng: 129.8730, memo: "有田焼400年の歴史と技術を伝える資料館。初日は有田焼の歴史を学ぶ。", websiteUrl: "", time: "10:00", stay: 60 }],
      [{ name: "伊万里市陶器商家資料館", wikiTitle: "伊万里市", address: "伊万里市伊万里町甲246", lat: 33.2716, lng: 129.8737, memo: "2日目は、江戸期に栄えた伊万里商人の商家建築を見学。", websiteUrl: "", time: "9:30", stay: 60 }],
    ],
  },
  {
    oldTitle: "朝市グルメと名護屋城跡、呼子の海と歴史を満喫する1泊2日",
    newTitle: "波戸岬の絶景と老舗酒蔵、呼子半島をドライブする1泊2日",
    newDescription: "玄界灘を一望する岬・波戸岬と、呼子に江戸期から続く老舗酒蔵。朝市や名護屋城跡とは違う、呼子半島の自然と酒どころを巡る1泊2日です。",
    days: [
      [{ name: "波戸岬", wikiTitle: "波戸岬", address: "唐津市鎮西町波戸1616-10", lat: 33.5557, lng: 129.8463, memo: "玄界灘を一望する、呼子半島の先端の岬。初日はここで海の絶景を楽しむ。", websiteUrl: "", time: "10:00", stay: 70 }],
      [{ name: "松浦一酒造", wikiTitle: "唐津市", address: "唐津市呼子町呼子1875", lat: 33.5379, lng: 129.8918, memo: "2日目は、江戸期創業の老舗酒蔵を見学し、地酒を味わう。", websiteUrl: "", time: "9:30", stay: 50 }],
    ],
  },
  {
    oldTitle: "地獄めぐりと竹瓦温泉、別府を隅々まで満喫する1泊2日",
    newTitle: "鶴見岳ロープウェイと明礬温泉、絶景と湯の花の別府1泊2日",
    newDescription: "別府湾を一望する鶴見岳ロープウェイと、藁葺き小屋で湯の花を作る明礬温泉。地獄めぐりや温泉街散策とは違う、別府の高台と山あいを楽しむ1泊2日です。",
    days: [
      [{ name: "別府ロープウェイ（鶴見岳）", wikiTitle: "別府ロープウェイ", address: "別府市大字南石垣字観海寺無番地", lat: 33.2739, lng: 131.4407, memo: "鶴見岳山頂まで登るロープウェイ。晴れた日は別府湾から四国まで見渡せる。", websiteUrl: "", time: "10:00", stay: 90 }],
      [{ name: "明礬温泉", wikiTitle: "明礬温泉", address: "別府市明礬", lat: 33.2803, lng: 131.5000, memo: "2日目は、藁葺き屋根の湯の花小屋が並ぶ、湯けむり漂う温泉地を散策。", websiteUrl: "", time: "9:30", stay: 60 }],
    ],
  },
  {
    oldTitle: "由布岳登山と金鱗湖、由布院の自然をじっくり楽しむ1泊2日",
    newTitle: "由布岳登山と金鱗湖、由布院の自然をじっくり楽しむ1泊2日",
    newDescription: "由布院のシンボル・由布岳の中腹まで登り、翌日は由布院盆地の産土神を祀る古社を訪ねる。金鱗湖周辺とは違う、静かな杜を歩く1泊2日です。",
    days: [
      [{ name: "由布岳", wikiTitle: "由布岳", address: "由布市湯布院町川上", lat: 33.2828, lng: 131.3903, memo: "「豊後富士」とも呼ばれる、由布院のシンボル的な山。中腹までのハイキングも人気。", websiteUrl: "", time: "9:00", stay: 150 }],
      [{ name: "宇奈岐日女神社", wikiTitle: "宇奈岐日女神社", address: "由布市湯布院町川上2220", lat: 33.2589, lng: 131.3617, memo: "2日目は、由布院盆地の産土神を祀る古社を訪ね、静かな杜を歩く。", websiteUrl: "", time: "9:30", stay: 40 }],
    ],
  },
  {
    oldTitle: "中津城下町と耶馬渓、歴史と絶景をめぐる中津1泊2日",
    newTitle: "なかはくと闇無浜神社、中津の歴史と信仰を深掘りする1泊2日",
    newDescription: "中津の歴史を丸ごと紹介する中津市歴史博物館（なかはく）と、海沿いに鎮座する古社・闇無浜神社。中津城や耶馬渓とは違う、中津の奥深さを味わう1泊2日です。",
    days: [
      [{ name: "中津市歴史博物館", wikiTitle: "中津市", address: "中津市二ノ丁1273-2", lat: 33.6068, lng: 131.1862, memo: "「なかはく」の愛称で親しまれる、中津の歴史を紹介する博物館。初日はここで中津の歴史を学ぶ。", websiteUrl: "", time: "10:00", stay: 60 }],
      [{ name: "闇無浜神社", wikiTitle: "中津市", address: "中津市大字角木537", lat: 33.6280, lng: 131.1690, memo: "2日目は、周防灘を望む海沿いに鎮座する古社を訪ねる。", websiteUrl: "", time: "9:30", stay: 40 }],
    ],
  },
  {
    oldTitle: "青島と鵜戸神宮、宮崎の海沿いパワースポットを巡る1泊2日",
    newTitle: "宮崎神宮とフローランテ宮崎、緑と花に包まれる1泊2日",
    newDescription: "神武天皇を祀る宮崎神宮の鎮守の杜と、四季の花が咲き誇るフローランテ宮崎。青島や博物館とは違う、宮崎市内の緑と花を楽しむ1泊2日です。",
    days: [
      [{ name: "宮崎神宮", wikiTitle: "宮崎神宮", address: "宮崎市神宮2丁目4-1", lat: 31.9385, lng: 131.4235, memo: "神武天皇を祀る、宮崎を代表する神社。初日は鎮守の杜をゆっくり歩く。", websiteUrl: "", time: "10:00", stay: 60 }],
      [{ name: "フローランテ宮崎", wikiTitle: "フローランテ宮崎", address: "宮崎市山崎町浜山414-16", lat: 31.9522, lng: 131.4517, memo: "2日目は、四季折々の花々が楽しめる都市公園を散策。", websiteUrl: "", time: "9:30", stay: 70 }],
    ],
  },
];

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");
  const imageCache = new Map<string, string | null>(Object.entries(existingPhotoCache as Record<string, string>));

  for (const r of REPLACEMENTS) {
    const it = await prisma.itinerary.findFirst({ where: { title: r.oldTitle } });
    if (!it) { console.log(`見つかりません: ${r.oldTitle}`); continue; }
    console.log(`\n■ ${r.oldTitle} → ${r.newTitle}`);
    for (const [i, day] of r.days.entries()) console.log(`  Day${i + 1}: ` + day.map((s) => `${s.time} ${s.name}`).join(" / "));
    if (!commit) continue;

    await prisma.day.deleteMany({ where: { itineraryId: it.id } });
    let thumbnailUrl: string | null = null;
    for (const [dayIndex, spots] of r.days.entries()) {
      const day = await prisma.day.create({ data: { itineraryId: it.id, dayNumber: dayIndex + 1 } });
      for (const [idx, s] of spots.entries()) {
        const url = await fetchAndUploadImage(imageCache, { name: s.name, address: s.address, lat: s.lat, lng: s.lng, memo: s.memo, websiteUrl: s.websiteUrl, wikiTitle: s.wikiTitle }, "official-areas-15-fix");
        if (!thumbnailUrl && url) thumbnailUrl = url;
        const spotRow = await prisma.spot.create({
          data: {
            dayId: day.id, orderNo: idx + 1, name: s.name, address: s.address, lat: s.lat, lng: s.lng,
            visitTime: toUTCTime(s.time), memo: s.memo, stayDurationMin: s.stay, websiteUrl: s.websiteUrl || null,
            transitMode: s.transit?.mode ?? null, transitDurationMin: s.transit?.min ?? null, transitLine: s.transit?.line ?? null,
          },
        });
        if (url) await prisma.photo.create({ data: { spotId: spotRow.id, url, caption: s.name } });
      }
    }
    await prisma.itinerary.update({ where: { id: it.id }, data: { title: r.newTitle, description: r.newDescription, thumbnailUrl: thumbnailUrl ?? it.thumbnailUrl } });
    console.log(`  更新完了`);
  }
  if (!commit) console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
}

main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
