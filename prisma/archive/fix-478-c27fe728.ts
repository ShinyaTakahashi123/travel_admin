/**
 * チェックリスト #478 c27fe728「海辺の絶景とデジタルアート、お台場を楽しむ旅」の見直し（しおりえ(制作補助2)、企画運営の指示で順番を早めて対応）
 * 日本科学未来館は2026年10月1日から2027年4月中旬まで全館休館のため外す（公式 https://www.miraikan.jst.go.jp/news/general/202503273938.html ）
 * 実物大ユニコーンガンダム立像は2026年8月31日で展示が終わったので、ダイバーシティの本文からガンダムを外す（公式 https://www.unicorn-gundam-statue.jp/ ）
 * 1日目: 潮風公園 → 南極観測船「宗谷」→ ダイバーシティ東京プラザ（昼食）→ フジテレビ本社ビル → アクアシティお台場 → お台場海浜公園 → 台場公園（7か所 09:00〜16:35）
 * 2日目: チームラボプラネッツ → 豊洲市場（見学と昼食）→（ゆりかもめ）東京ビッグサイト → 東京都水の科学館 → そなエリア東京（5か所 09:00〜16:35）
 * ダイバーシティとフジテレビは2日目から1日目へ移す（IDのまま）。既存の本文は一行だけの仮の文だったので書き直す。タイトルは未来館を含まないのでそのまま
 * 写真: 表紙（未来館の写真）をフジテレビの写真に替える。潮風公園・お台場海浜公園の撮影者の欄「Ryoma35988 (ja:利用者:Ryoma35988)」を「Ryoma35988」に直す。
 *   東京ビッグサイトの写真は駅の写真だったので、#418 で上げた建物の写真（Masahiko OHKUBO, CC BY 2.0）に替える
 * 本文の出典: はちたま https://www.tokyo-odaiba.net/genre/フジテレビ本社ビル/ ／チームラボ https://www.teamlab.art/jp/e/planets/ ／宗谷 https://funenokagakukan.or.jp/ ／
 *   そなエリア https://www.tokyorinkai-koen.jp/sonaarea/ ／豊洲市場 https://www.shijou.metro.tokyo.lg.jp/info/0/kenngaku/kenngaku1 ／水の科学館 https://www.mizunokagaku.jp/about/ ／
 *   お台場海浜公園（遊泳禁止）https://www.tptc.co.jp/park/01_02/qa ／ほかは #405・#418 と同じ
 * 座標の出典: Nominatim（潮風公園 35.6242241,139.7690910／宗谷 35.6190496,139.7736122／ダイバーシティ東京 35.6253160,139.7758804／フジテレビジョン 35.6271848,139.7751659／
 *   アクアシティお台場（施設内の通路の点）35.6271362,139.7727474／お台場海浜公園 35.6310840,139.7773535／台場公園 35.6335286,139.7715386／
 *   チームラボ プラネッツ 35.6493800,139.7897280／豊洲市場(7街区) 35.6421477,139.7827183／東京ビッグサイト 35.6297628,139.7939817／
 *   水の科学館 35.6308222,139.7855104／そなエリア東京 35.6351622,139.7942160）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-478-c27fe728.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "c27fe728-37c2-4ca0-9bac-06451d485ff2";
const DAY1_ID = "0fa1e254-2331-4a0a-ac5d-afb0ae492259";
const DAY2_ID = "a44ce9cd-7fce-461a-b7ab-5e1172d98bae";
const MIRAIKAN_ID = "91760bb6-e62c-4237-a548-1b34d3c54872";
const SHIOKAZE_ID = "e24e6a97-9c8c-4795-a2bb-9758283cb865";
const DAIBA_ID = "a1644012-183c-459e-a851-02e6db4b5d16";
const KAIHIN_ID = "3bc09d38-5804-4696-bd99-45a9adfaa7a3";
const AQUA_ID = "6bf10dfe-2107-430e-ba69-73afaf3d0552";
const DIVER_ID = "e00604cc-e9a1-4b67-94a4-1d7132069f0c";
const FUJI_ID = "588e2d3c-ead0-4016-927e-11e4b9a7a673";
const BIGSIGHT_ID = "19fc7936-fdcd-49de-b938-f10ed38491b0";
const TOYOSU_ID = "2675d7ea-0cce-49c5-b953-ab751eec2008";
const TEAMLAB_ID = "a960129e-1879-47c5-86c6-e780c18443c1";
const BIGSIGHT_PHOTO = {
  url: "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/fix-418/tokyo-big-sight-0LJ9qmhE1xDAYXOi5Bz7icpPrWN5Up.jpg",
  sourceUrl: "https://commons.wikimedia.org/wiki/File:Tokyo_Big_Sight_exterior_2024-02-12.jpg",
  author: "Masahiko OHKUBO",
  license: "CC BY 2.0",
  licenseUrl: "https://creativecommons.org/licenses/by/2.0",
};
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "1日目は海沿いの潮風公園から、南極観測船「宗谷」を見学し、昼食のあとはフジテレビの球体展望室から臨海のパノラマを。お台場海浜公園の砂浜と、砲台の跡が残る台場公園を歩きます。2日目は水に入るミュージアム・チームラボプラネッツでアートに没入し、豊洲市場で見学と昼食。午後は東京ビッグサイトを眺め、東京都水の科学館とそなエリア東京で水と防災を学ぶ、お台場の海とアートを楽しむ1泊2日です。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(SHIOKAZE_ID, 9, 0, 45, null, null, null, 35.624224, 139.769091,
    "臨海副都心の西側にある海沿いの公園です。レインボーブリッジを背景にした東京港の景色や、対岸のコンテナ埠頭の大型のコンテナ船、ガントリークレーンを望めます。朝の海を眺めながら、のんびり歩いて旅を始めましょう。"),
  cre("南極観測船「宗谷」", 10, 0, 60, "walk", 10, 35.61905, 139.773612, "東京都江東区青海2丁目地先",
    "潮風公園から歩いて約10分、船の科学館の前に係留されている船です。1938年に耐氷型の貨物船として造られ、太平洋戦争を経験したあと、1956年から1962年まで日本で初めての南極観測船として6回の南極観測に活躍しました。1978年に巡視船として退役し、翌年からここで保存展示されています。操舵室や船長室、観測隊員の居住区などを見学できます。船内は急な階段や狭い通路があり、雨の日は床が滑りやすいので気をつけましょう。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(DIVER_ID, 11, 15, 70, "walk", 15, null, 35.625316, 139.77588,
    "宗谷から歩いて約15分、青海にある商業施設です。飲食店やショップが集まっているので、ここで昼食をとり、ひと休みしましょう。",
    { name: "ダイバーシティ東京プラザ（昼食）" }),
  upd(FUJI_ID, 12, 35, 70, "walk", 10, null, 35.627185, 139.775166,
    "ダイバーシティから歩いて約10分。球体の展望室「はちたま」などユニークな外観で、お台場のシンボルになっている放送局の建物です。「はちたま」からは、レインボーブリッジや東京タワー、東京スカイツリーなど東京の景色を海越しに眺められ、冬の天気の良い日には富士山も望めます。「フジテレビギャラリー」など、一般に開放されているエリアもあります。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(AQUA_ID, 13, 50, 40, "walk", 5, null, 35.627136, 139.772747,
    "フジテレビから歩いてすぐ、台場にある商業施設です。お土産を選んだり、ひと休みしたりしてから、海辺へ向かいましょう。"),
  upd(KAIHIN_ID, 14, 40, 50, "walk", 10, null, 35.631084, 139.777354,
    "アクアシティお台場から歩いて約10分。台場公園と一体となって入り江を囲み、砂浜や磯が広がる公園です。砂浜や芝生からのんびり海を眺めたり、展望デッキやスカイウォークからレインボーブリッジを望んだりできます。夕暮れや夜景の美しさでも知られています。お台場海浜公園は遊泳禁止なので、海には入らず、砂浜から眺めを楽しみましょう。"),
  upd(DAIBA_ID, 15, 40, 55, "walk", 10, null, 35.633529, 139.771539,
    "お台場海浜公園から歩いて約10分。国の史跡である「品川台場」の第三台場を、公園として開放したものです。海岸沿いの高台には砲台跡が、園内の中央には陣屋跡や火薬庫跡、かまど跡が残り、2017年には隣の第六台場とともに「品川台場」として続日本100名城に選ばれました。催しの準備などで入れない期間があるので、公式の案内で確かめてから訪れましょう。"),
];

const day2 = [
  upd(TEAMLAB_ID, 9, 0, 90, null, null, null, 35.64938, 139.789728,
    "ゆりかもめの新豊洲駅から歩いてすぐ。「水に入るミュージアム」をうたうアートミュージアムで、巨大な作品群の中に、ほかの人と一緒に身体ごと没入して楽しみます。水の作品は裸足になって体験し、大人でも膝丈まで水にぬれる場所があるので、ひざまでまくれる服装で行きましょう。現地ではチケットを販売していないので、事前に公式サイトで入場の日時を決めてチケットを買っておきましょう。休みの日は公式の案内で確かめてから訪れましょう。"),
  upd(TOYOSU_ID, 10, 45, 120, "walk", 15, null, 35.642148, 139.782718,
    "チームラボプラネッツから歩いて約15分。首都圏の生鮮食品の流通を担う中央卸売市場で、一般の人も見学エリアを歩けます。見学通路からはマグロの卸売場を見下ろせ、巨大なクロマグロのオブジェや、市場を走るターレの実物、市場の歴史の展示もあります。飲食のエリアもあるので、ここで昼食にしましょう。見学の時間内に営業を終える店もあり、市場が休みの日は見学もできないので、開場日は公式の案内で確かめてから訪れましょう。"),
  upd(BIGSIGHT_ID, 13, 5, 30, "train", 20, "ゆりかもめ（市場前→東京ビッグサイト）", 35.629763, 139.793982,
    "豊洲市場からゆりかもめで東京ビッグサイト駅へ。1996年に開業した、国内で最大のコンベンション施設とされる会場で、数多くの見本市や展示会の会場として使われてきました。有明のランドマークとなっている独特な形の建物を、外からじっくり眺めてみましょう。催しの日はとても混み合うので、人の流れに気をつけて歩きましょう。"),
  cre("東京都水の科学館", 13, 45, 70, "walk", 10, 35.630822, 139.78551, "東京都江東区有明3-1-8",
    "東京ビッグサイトから歩いて約10分。水がどこで生まれ、どこを流れて私たちのところまで来るのかを、科学の目で紹介する体感型のミュージアムです。映像シアターで「水の旅」を体感したり、水の性質を使った体験装置や実験ショーを楽しんだりでき、プロジェクションマッピングを使った給水所の見学ツアーもあります。水遊びができる広場もあるので、着替えやタオルがあると安心です。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("そなエリア東京", 15, 5, 90, "walk", 10, 35.635162, 139.794216, "東京都江東区有明3-8-35",
    "水の科学館から歩いて約10分、東京臨海広域防災公園の中にある防災体験学習施設です。地震のあと、支援が届くまでの時間を生き抜く知恵を学ぶ体験学習ツアー「東京直下72hTOUR」を中心に、被災地や避難所の様子を再現した実物大のジオラマ展示や、首都直下地震について紹介するコーナーがあります。入場の受付は閉館の少し前までなので、遅くならないように向かいましょう。休館日は公式の案内で確かめてから訪れましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true, thumbnailUrl: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== `${MIRAIKAN_ID},${SHIOKAZE_ID},${DAIBA_ID},${KAIHIN_ID},${AQUA_ID}` ||
    days[1].spots.map((s) => s.id).join() !== `${DIVER_ID},${FUJI_ID},${BIGSIGHT_ID},${TOYOSU_ID},${TEAMLAB_ID}`
  ) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));
  const ryoma = await prisma.photo.findMany({ where: { spotId: { in: [SHIOKAZE_ID, KAIHIN_ID] } } });
  if (ryoma.length !== 2 || ryoma.some((p) => p.author !== "Ryoma35988 (ja:利用者:Ryoma35988)")) throw new Error("潮風公園・海浜公園の写真の撮影者が想定と違います");
  const bsPhoto = await prisma.photo.findMany({ where: { spotId: BIGSIGHT_ID } });
  if (bsPhoto.length !== 1 || !bsPhoto[0].sourceUrl?.includes("Tokyo_Big_Sight_Station")) throw new Error("ビッグサイトの写真が想定と違います");
  const fujiPhoto = await prisma.photo.findFirstOrThrow({ where: { spotId: FUJI_ID } });
  console.log(`表紙: ${it.thumbnailUrl}\n→ ${fujiPhoto.url}`);
  console.log(`説明文: ${DESCRIPTION}`);

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, order] of [["1日目", day1], ["2日目", day2]] as const) {
    console.log(`--- ${label}`);
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
      prevEnd = st + (d.stayDurationMin as number);
    }
  }
  console.log(`削除: ${names[MIRAIKAN_ID]}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION, thumbnailUrl: fujiPhoto.url } });
      for (const p of ryoma) await tx.photo.update({ where: { id: p.id }, data: { author: "Ryoma35988" } });
      await tx.photo.update({ where: { id: bsPhoto[0].id }, data: BIGSIGHT_PHOTO });
      await tx.spot.update({ where: { id: DIVER_ID }, data: { dayId: DAY1_ID, orderNo: 9501 } });
      await tx.spot.update({ where: { id: FUJI_ID }, data: { dayId: DAY1_ID, orderNo: 9502 } });
      await setDaySpotOrder(DAY1_ID, day1, { tx, remove: [MIRAIKAN_ID] });
      await setDaySpotOrder(DAY2_ID, day2, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
