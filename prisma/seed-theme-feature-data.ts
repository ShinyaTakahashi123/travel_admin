/**
 * 今までプログラムの中に直接書いていたテーマ・特集(THEMES/FEATURES)をDBに移す
 * docs/specs/20260927-admin-managed-themes-features.md 4.
 *
 * - 今の11テーマ・3特集は、今までと同じ内容・同じURL(slug)で「公開」として登録する
 * - お遍路・酒蔵めぐりは、まだ内容の確認(法務)が済んでいないため「下書き」で登録する
 *   (docs/content/theme-series-progress.md「公開は年明け」、企画運営2026-09-28指示)
 * - 何度実行しても安全(既にある同じslugのテーマ・特集は追加しない)
 *
 * 実行方法:
 *   確認モード: npx tsx prisma/seed-theme-feature-data.ts
 *   登録モード: npx tsx prisma/seed-theme-feature-data.ts --commit
 */
import { prisma } from "../src/lib/prisma";

// 接続先(本番/開発)の表示と確かめ(企画運営2026-09-27)。Next.jsアプリ本体からは読み込まれない
require("../scripts/assert-db-target.cjs");

type ThemeSeed = {
  slug: string;
  name: string;
  tagNames: string[];
  purposeTagNames: string[];
  intro: string;
  seasons: string[]; // "spring"|"summer"|"autumn"|"winter"
  status: "draft" | "published";
};

const THEMES: ThemeSeed[] = [
  {
    slug: "koyo",
    name: "紅葉",
    tagNames: ["紅葉"],
    purposeTagNames: ["紅葉狩り"],
    seasons: ["autumn"],
    status: "published",
    intro:
      "山や渓谷、古都の庭園が赤や黄色に染まる紅葉の季節。例年の見頃は、北海道・東北の山あいで10月上旬ごろから始まり、関東・関西の街なかでは11月中旬〜12月上旬ごろまで楽しめます。紅葉の名所をめぐるモデルコースを、地方ごとにまとめました。見頃は年によって前後するので、お出かけ前に最新の色づき情報も確認してください。",
  },
  {
    slug: "winter",
    name: "冬の旅",
    tagNames: ["冬の旅"],
    purposeTagNames: ["ウィンタースポーツ"],
    seasons: ["winter"],
    status: "published",
    intro:
      "雪化粧した古都や合掌造りの集落、湯けむりの温泉街、雪まつりやイルミネーション。寒い季節だからこそ出会える景色を楽しむ、冬の旅のモデルコースを地方ごとにまとめました。雪の多い地域では、交通機関の運休や道路の通行止めがあるので、お出かけ前に最新の情報を確認してください。",
  },
  {
    slug: "onsen",
    name: "温泉",
    tagNames: ["温泉"],
    purposeTagNames: ["温泉"],
    seasons: ["winter"],
    status: "published",
    intro:
      "湯けむりの温泉街をそぞろ歩き、日帰り入浴や宿でゆっくりくつろぐ。全国の温泉地をめぐるモデルコースを、地方ごとにまとめました。温泉街の散策スポットや、立ち寄りやすい日帰り湯も確認できます。",
  },
  {
    slug: "zekkei",
    name: "絶景",
    tagNames: ["絶景"],
    purposeTagNames: ["絶景・フォトスポット"],
    seasons: [],
    status: "published",
    intro:
      "海や山、滝や湖、街を見下ろす展望台。思わず写真を撮りたくなる絶景スポットをめぐるモデルコースを、地方ごとにまとめました。訪れる時間帯のコツや、移動手段もあわせて確認できます。",
  },
  {
    slug: "gourmet",
    name: "グルメ",
    tagNames: ["グルメ"],
    purposeTagNames: [],
    seasons: [],
    status: "published",
    intro:
      "市場の海鮮、ご当地の名物料理、食べ歩きの商店街。その土地ならではの味を楽しむモデルコースを、地方ごとにまとめました。観光と食事を組み合わせた回り方の参考にどうぞ。",
  },
  {
    slug: "family",
    name: "家族旅行",
    tagNames: ["家族旅行"],
    purposeTagNames: ["動物園・水族館", "テーマパーク"],
    seasons: [],
    status: "published",
    intro:
      "動物園や水族館、テーマパーク、体験施設など、子どもと一緒に楽しめるスポットをめぐるモデルコースを、地方ごとにまとめました。移動時間や滞在時間の目安もあるので、無理のない日程づくりに役立ちます。",
  },
  {
    slug: "solo",
    name: "一人旅",
    tagNames: ["一人旅"],
    purposeTagNames: [],
    seasons: [],
    status: "published",
    intro:
      "自分のペースで、行きたい場所へ。一人でも気兼ねなく楽しめる街歩きや寺社めぐり、景色を眺める旅のモデルコースを、地方ごとにまとめました。",
  },
  {
    slug: "beach",
    name: "海・リゾート",
    tagNames: ["海・リゾート"],
    purposeTagNames: ["ビーチ・海水浴", "離島"],
    seasons: ["summer"],
    status: "published",
    intro:
      "青い海と白い砂浜、島めぐりやマリンアクティビティ。海辺の景色を楽しむモデルコースを、地方ごとにまとめました。海水浴や船の運航は季節によって変わるので、事前に確認してお出かけください。",
  },
  {
    slug: "sakura",
    name: "桜・花見",
    tagNames: [],
    purposeTagNames: ["花見・桜"],
    seasons: ["spring"],
    status: "published",
    intro:
      "春を彩る桜の名所をめぐるモデルコースを、地方ごとにまとめました。例年の見頃は、九州・関東で3月下旬ごろ、東北・北海道では4月下旬〜5月ごろです。開花は年によって前後するので、最新の開花情報もあわせて確認してください。",
  },
  {
    slug: "castle",
    name: "お城めぐり",
    tagNames: ["お城めぐり"],
    purposeTagNames: [],
    seasons: [],
    status: "published",
    intro:
      "天守を仰ぎ、石垣や堀をめぐり、城下町を歩く。江戸時代以前から天守が残る城、再建された天守、石垣や堀が残る城跡まで、城下町の町並みや庭園、ご当地の名物と組み合わせたお城めぐりのモデルコースを、地方ごとにまとめました。修理や工事で見学できる範囲が変わることがあるので、お出かけ前に各城の公式サイトで確かめてください。",
  },
  {
    slug: "goshuin",
    name: "御朱印めぐり",
    tagNames: ["御朱印"],
    purposeTagNames: [],
    seasons: [],
    status: "published",
    intro:
      "寺社をお参りし、その証として御朱印をいただく旅。鎌倉・京都・奈良・伊勢・出雲・日光など、1〜2日で無理なく巡れる寺社の組み合わせを、地方ごとにまとめました。御朱印は、先にお参りを済ませてから授与所でお願いするものです。受付の時間や御朱印の種類、書き置きかどうかは寺社ごとに異なるので、お出かけ前に各寺社の公式の案内で確かめてください。寺社は今も祈りの場です。境内では静かにお参りし、御朱印の売り買いはやめましょう。",
  },
  // 以下2つは内容(紹介文)の法務確認がまだのため下書き。しおり自体もstatus: pending
  // (docs/content/theme-series-progress.md「公開は年明け」)。絵は画像作成が用意済み
  // (img/theme-henro c8d8346)。紹介文は仮のたたき台で、公開前に見直しが必要
  {
    slug: "henro",
    name: "お遍路",
    tagNames: ["お遍路"],
    purposeTagNames: [],
    seasons: ["spring", "autumn"],
    status: "draft",
    intro:
      "四国に点在する八十八か所の霊場をめぐる、祈りと歩みの旅。車で区切って回る1泊2日のモデルコースを、札所の番号順にまとめました。（下書き・公開前に紹介文の見直しが必要）",
  },
  {
    slug: "sake-brewery",
    name: "酒蔵めぐり",
    tagNames: [],
    purposeTagNames: ["酒蔵・ワイナリー巡り"],
    seasons: [],
    status: "draft",
    intro:
      "白壁の蔵元をめぐり、蔵見学や試飲を楽しむ旅。全国の酒どころのモデルコースを、地方ごとにまとめました。（下書き・公開前に紹介文の見直しが必要）",
  },
];

type FeatureSeed = {
  slug: string;
  title: string;
  description: string;
  lead: string;
  closing: string | null;
  publishedAt: string;
  items: { itineraryId: string; caption: string }[];
};

const FEATURES: FeatureSeed[] = [
  {
    slug: "tokyo-daytrip-koyo",
    title: "東京から日帰りで行ける紅葉のモデルコース6選",
    description:
      "東京から日帰りで行ける紅葉の名所を、時刻・移動手段つきのモデルコースで紹介。河口湖のもみじ回廊、軽井沢、昇仙峡、那須、長瀞など、10月下旬〜11月に見頃を迎えるスポットをまとめました。",
    lead: "泊まりがけでなくても、紅葉は楽しめます。東京から電車や高速バスで日帰りできる紅葉の名所を、訪れる時刻や移動手段まで分かるモデルコースで集めました。山あいの名所は10月下旬ごろから、湖畔や渓谷は11月に入ってから見頃を迎えることが多いので、行く時期に合わせて選んでみてください。見頃は年によって前後するので、お出かけ前に最新の色づき情報も確認しましょう。",
    closing: "ほかの地方の紅葉は「紅葉のモデルコース・旅のしおり」で、地方ごとにまとめて紹介しています。",
    publishedAt: "2026-09-24",
    items: [
      {
        itineraryId: "5c281775-cb3b-404d-8339-d5f03fc2cf72",
        caption:
          "紅葉のトンネルが続く河口湖のもみじ回廊と、五重塔と富士山を一緒に望む新倉山浅間公園をめぐる日帰りプラン。例年の見頃は11月上旬〜中旬で、富士山と紅葉を一度に楽しめます。",
      },
      {
        itineraryId: "02840020-5297-4b7d-9853-ea2eeaf4b5ab",
        caption: "水面に紅葉が映る雲場池から、旧軽井沢の教会、白糸の滝へ。新幹線なら東京から約1時間で、例年10月下旬〜11月上旬が見頃です。",
      },
      {
        itineraryId: "416d4fb5-5d59-4886-97f2-e36c88377b52",
        caption: "仙娥滝や覚円峰など、奇岩と渓流が続く昇仙峡を歩く定番プラン。渓谷の紅葉は例年10月下旬〜11月中旬ごろが見頃です。",
      },
      {
        itineraryId: "de637e2a-f51b-41e1-a874-69fde15d5972",
        caption: "昇仙峡ロープウェイで山の上のパノラマ台へ。天気がよければ富士山も望める、景色を楽しみたい人向けのプランです。",
      },
      {
        itineraryId: "6cb325f3-c8d4-4bcf-a4c2-26e15aad9d6c",
        caption: "那須ロープウェイで茶臼岳へ上り、殺生石の伝説にもふれる那須高原の日帰りプラン。山の上は街より早く、例年10月上旬ごろから色づき始めます。",
      },
      {
        itineraryId: "b0b18b71-d709-4122-a5ed-effd5296f6a3",
        caption: "秩父神社にお参りして、長瀞ライン下りへ。舟の上から見上げる渓谷の紅葉は、例年11月中旬〜下旬が見頃です。",
      },
    ],
  },
  {
    slug: "kyoto-koyo",
    title: "京都の紅葉めぐりモデルコース5選｜嵐山・東山・大原",
    description:
      "京都の紅葉名所をめぐるモデルコースを5つ紹介。嵯峨野・嵐山、永観堂と哲学の道、東福寺と大原、比叡山など、回り方と移動時間が分かるしおりで、例年11月中旬〜下旬の見頃に備えましょう。",
    lead: "古都の寺社と庭園が赤や黄色に染まる京都の紅葉。例年の見頃は11月中旬〜下旬ごろで、見頃の週末はどこも混み合います。回る順番と移動時間をあらかじめ決めておくと、限られた時間でも名所をしっかり楽しめます。エリアごとに歩いて回れるモデルコースを集めました。",
    closing: "見頃の週末は、寺社の拝観やバスが混み合います。朝早めの出発と、電車・徒歩中心の回り方がおすすめです。",
    publishedAt: "2026-09-24",
    items: [
      {
        itineraryId: "94c6f1d5-12c3-43b8-997f-6f157c8d11f3",
        caption: "天龍寺の庭園から竹林の小径を抜け、小倉山のふもとの常寂光寺・祇王寺へ。嵯峨野の紅葉を歩いてめぐる日帰りプランです。",
      },
      {
        itineraryId: "77a2f819-ec53-4d8c-a0d9-b736a3e35f1e",
        caption: "「もみじの永観堂」から南禅寺、哲学の道へと続く東山の紅葉さんぽ。歩いて回れる範囲に名所が集まっています。",
      },
      {
        itineraryId: "b7de8da7-4621-4e87-bc5c-38071741fcba",
        caption: "通天橋から眺める東福寺の紅葉と、山里の風情が残る大原を2日間でじっくり。混雑を避けて朝から回りたい人におすすめです。",
      },
      {
        itineraryId: "26d252e6-106f-49b2-9b2f-90d29fa04455",
        caption: "比叡山延暦寺と三井寺をめぐる、京都から足を延ばす大津の日帰りプラン。山の上は市街地より早く色づくことが多い場所です。",
      },
      {
        itineraryId: "27d28702-2f4b-4134-947c-b2725f9b90c0",
        caption: "伏見稲荷大社の千本鳥居を歩いて、宇治へ。抹茶の香りも楽しめる、京都南部の欲張り散策プランです。",
      },
    ],
  },
  {
    slug: "november-3renkyu-koyo",
    title: "11月の3連休に行きたい、紅葉の1泊2日モデルコース6選",
    description:
      "11月の3連休（2026年は11月21日〜23日）に行きたい、紅葉の名所をめぐる1泊2日のモデルコースを紹介。箱根、松島、宮島、彦根、京都など、例年この時期に見頃を迎える場所を集めました。",
    lead: "2026年の11月は、21日（土）から23日（月・祝）が3連休。関東・関西の街なかや、海辺の名所で紅葉が見頃を迎えるころです。1泊2日なら、紅葉の名所に温泉や夜のライトアップを組み合わせて、ゆっくり楽しめます。人気の宿は早めに埋まるので、行き先が決まったら予約はお早めに。",
    closing: "見頃やライトアップの期間は年によって変わります。お出かけ前に、各スポットの公式サイトで最新情報を確認してください。",
    publishedAt: "2026-09-24",
    items: [
      {
        itineraryId: "bbf0c72e-356a-4ba4-a0d8-d1079aa32493",
        caption: "箱根登山電車で紅葉の山へ。箱根美術館の苔庭、大涌谷、芦ノ湖をめぐる1泊2日。箱根の紅葉は例年11月上旬〜下旬です。",
      },
      {
        itineraryId: "657f4a15-8f20-4d44-ac20-fa757f002d63",
        caption: "強羅温泉に泊まって、箱根美術館と庭園をゆっくりめぐる、のんびり派の1泊2日。温泉と紅葉を両方楽しみたい人に。",
      },
      {
        itineraryId: "e58458ef-7755-49bc-8828-7b35e20a8244",
        caption: "日本三景・松島の夕景と、瑞巌寺の紅葉を味わう1泊2日。松島の紅葉は例年11月上旬〜下旬ごろです。",
      },
      {
        itineraryId: "78026dc9-a399-4d83-b4aa-3e2353a9fe4f",
        caption: "大聖院と紅葉谷公園をめぐる宮島の1泊2日。泊まると、日帰り客が帰ったあとの静かな島を楽しめます。",
      },
      {
        itineraryId: "77b83773-6635-47f0-a22b-ec99cf45b91e",
        caption: "彦根城の紅葉とライトアップを、じっくり味わう1泊2日。城下町の散策もあわせて楽しめます。",
      },
      {
        itineraryId: "b7de8da7-4621-4e87-bc5c-38071741fcba",
        caption: "東福寺の通天橋と大原の里をめぐる、京都の紅葉を満喫する2日間。見頃の京都は混むので、朝早めの行動がおすすめです。",
      },
    ],
  },
];

// 特集の「関連リンク」(今はプログラム内で「紅葉のテーマ」を指すリンクだけ持っていた)
const FEATURE_RELATED_LINKS: Record<string, { href: string; label: string }[]> = {
  "tokyo-daytrip-koyo": [{ href: "/theme/koyo", label: "紅葉のモデルコース・旅のしおり" }],
  "kyoto-koyo": [
    { href: "/theme/koyo", label: "紅葉のモデルコース・旅のしおり" },
    { href: "/area/kyoto", label: "京都のモデルコース・旅のしおり" },
  ],
  "november-3renkyu-koyo": [
    { href: "/theme/koyo", label: "紅葉のモデルコース・旅のしおり" },
    { href: "/theme/onsen", label: "温泉のモデルコース・旅のしおり" },
  ],
};

async function main() {
  const commit = process.argv.includes("--commit");
  console.log(commit ? "登録モードで実行します" : "確認モードで実行します（DBには書き込みません）");

  const allTagNames = Array.from(new Set(THEMES.flatMap((t) => t.tagNames)));
  const allPurposeTagNames = Array.from(new Set(THEMES.flatMap((t) => t.purposeTagNames)));
  const [tags, purposeTags, existingThemes, existingFeatures] = await Promise.all([
    prisma.tag.findMany({ where: { name: { in: allTagNames } } }),
    prisma.purposeTag.findMany({ where: { name: { in: allPurposeTagNames } } }),
    prisma.theme.findMany({ select: { slug: true } }),
    prisma.feature.findMany({ select: { slug: true } }),
  ]);
  const tagIdByName = new Map(tags.map((t) => [t.name, t.id]));
  const purposeTagIdByName = new Map(purposeTags.map((t) => [t.name, t.id]));
  const existingThemeSlugs = new Set(existingThemes.map((t) => t.slug));
  const existingFeatureSlugs = new Set(existingFeatures.map((f) => f.slug));

  console.log("\n=== テーマ ===");
  const missingTagNames = allTagNames.filter((n) => !tagIdByName.has(n));
  const missingPurposeTagNames = allPurposeTagNames.filter((n) => !purposeTagIdByName.has(n));
  if (missingTagNames.length > 0) console.log(`⚠️ 見つからないTag: ${missingTagNames.join(", ")}`);
  if (missingPurposeTagNames.length > 0) console.log(`⚠️ 見つからないPurposeTag: ${missingPurposeTagNames.join(", ")}`);

  for (const [i, theme] of THEMES.entries()) {
    const already = existingThemeSlugs.has(theme.slug);
    console.log(
      `  ${already ? "(既にあるためスキップ)" : `${i + 1}件目として登録`} /theme/${theme.slug} 「${theme.name}」(${theme.status})`
    );
  }

  console.log("\n=== 特集 ===");
  const allItineraryIds = FEATURES.flatMap((f) => f.items.map((i) => i.itineraryId));
  const foundItineraries = await prisma.itinerary.findMany({
    where: { id: { in: allItineraryIds } },
    select: { id: true },
  });
  const foundItineraryIds = new Set(foundItineraries.map((i) => i.id));
  const missingItineraryIds = allItineraryIds.filter((id) => !foundItineraryIds.has(id));
  if (missingItineraryIds.length > 0) console.log(`⚠️ 見つからないしおりID: ${missingItineraryIds.join(", ")}`);

  for (const feature of FEATURES) {
    const already = existingFeatureSlugs.has(feature.slug);
    console.log(`  ${already ? "(既にあるためスキップ)" : "登録"} /feature/${feature.slug} 「${feature.title}」(${feature.items.length}本)`);
  }

  if (!commit) {
    console.log("\n確認モードのため、ここで終了します。問題なければ --commit を付けて実行してください。");
    return;
  }

  let themeDisplayOrder = 0;
  for (const theme of THEMES) {
    themeDisplayOrder += 1;
    if (existingThemeSlugs.has(theme.slug)) continue;
    await prisma.theme.create({
      data: {
        name: theme.name,
        slug: theme.slug,
        intro: theme.intro,
        seasons: theme.seasons,
        status: theme.status,
        displayOrder: themeDisplayOrder,
        tags: { create: theme.tagNames.flatMap((n) => (tagIdByName.has(n) ? [{ tagId: tagIdByName.get(n)! }] : [])) },
        purposeTags: {
          create: theme.purposeTagNames.flatMap((n) =>
            purposeTagIdByName.has(n) ? [{ purposeTagId: purposeTagIdByName.get(n)! }] : []
          ),
        },
      },
    });
  }

  for (const feature of FEATURES) {
    if (existingFeatureSlugs.has(feature.slug)) continue;
    const validItems = feature.items.filter((i) => foundItineraryIds.has(i.itineraryId));
    await prisma.feature.create({
      data: {
        title: feature.title,
        slug: feature.slug,
        description: feature.description,
        lead: feature.lead,
        closing: feature.closing,
        status: "published",
        publishedAt: new Date(feature.publishedAt),
        items: {
          create: validItems.map((item, index) => ({
            itineraryId: item.itineraryId,
            caption: item.caption,
            displayOrder: index + 1,
          })),
        },
        related: {
          create: (FEATURE_RELATED_LINKS[feature.slug] ?? []).map((link, index) => ({
            href: link.href,
            label: link.label,
            displayOrder: index + 1,
          })),
        },
      },
    });
  }

  console.log("\n登録しました。");
  console.log(`テーマ: ${await prisma.theme.count()}件、特集: ${await prisma.feature.count()}件`);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
