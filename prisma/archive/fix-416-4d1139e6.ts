/**
 * チェックリスト #416 4d1139e6「名古屋港水族館と東山動植物園、家族で楽しむ名古屋1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目: 名古屋港水族館（昼食）→ 南極観測船ふじ → 名古屋海洋博物館・展望室（ポートビル）→（タクシー）リニア・鉄道館（4か所 09:30〜16:30）
 * 2日目: 東山動植物園（動物園・昼食）→ 東山植物園 → 東山スカイタワー →（地下鉄）FUJIなごや科学館（4か所 09:00〜16:10）
 * 既存の2か所はIDのまま直す（前の本文は案内役の話し言葉「皆様、…」で、確かめられない記述もあったので書き直す）。タイトルは内容に合っているのでそのまま
 * 既存の写真（水族館のまわり・動植物園の正門）は目で見て合っているので残す
 * 本文の出典（名古屋市観光情報「名古屋コンシェルジュ」）: 名古屋港水族館 https://www.nagoya-info.jp/spot/detail/5/ ／南極観測船ふじ https://www.nagoya-info.jp/spot/detail/10/ ／
 *   名古屋海洋博物館 https://www.nagoya-info.jp/spot/detail/8/ ／東山動植物園 https://www.nagoya-info.jp/spot/detail/4/ ／東山スカイタワー https://www.nagoya-info.jp/spot/detail/132/ ／
 *   FUJIなごや科学館 https://www.nagoya-info.jp/spot/detail/2/ ／リニア・鉄道館 https://museum.jr-central.co.jp/ ／水族館のレストラン https://www.nagoyaaqua.jp/ ／動植物園のフード https://www.higashiyama.city.nagoya.jp/
 * 座標の出典: Nominatim（名古屋港水族館 35.0909700,136.8780335／名古屋海洋博物館・南極観測船ふじ 35.0906642,136.8805282／リニア・鉄道館 35.0488735,136.8512061／
 *   東山スカイタワー 35.1567554,136.9788473／名古屋市科学館 35.1652420,136.8985990）、OSM/Overpass（東山動植物園正門 35.1588656,136.9741269／植物園門 35.1542575,136.9812394）
 *   ※名古屋海洋博物館（ポートビル）は、OSM（Nominatim・Overpass で「ポートビル」「海洋博物館」「展望」を検索）にも国土地理院の地名検索にも建物の点がなく、
 *     OSM の点は「名古屋海洋博物館・南極観測船ふじ」の1点だけだったので、ふじと同じ点のままにした（企画運営の了承、2026-09-30）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-416-4d1139e6.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d1139e6-04e2-4f29-af49-e411ec4a06f3";
const DAY1_ID = "63c591bb-74b5-4925-bce8-149c3c65de8a";
const DAY2_ID = "96f0a3ce-308c-4419-9058-4f1272d48fd0";
const AQUA_ID = "22b0e3f4-ed1e-4813-9905-02a4294fd614";
const ZOO_ID = "de175a60-d7cb-470c-b5c3-e02f2ed6996a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "1日目は、シャチやベルーガに会える名古屋港水族館から、南極観測船ふじ、港の博物館をめぐり、実物の車両が並ぶリニア・鉄道館へ。2日目は、飼育種類数日本一ともいわれる東山動植物園で動物と植物にふれ、東山スカイタワーからの眺めを楽しんで、世界最大級のプラネタリウムがあるFUJIなごや科学館へ。家族で楽しむ名古屋の1泊2日です。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, line: string | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string, dur: number, line: string | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: line, lat, lng, address, memo },
});

const day1 = [
  upd(AQUA_ID, 9, 30, 150, null, null, null, 35.09097, 136.878034,
    "日本最大級の水族館で、シャチやエンペラーペンギン、ウミガメの仲間や色とりどりの熱帯魚など、約500種・50,000匹の生き物に会えます。南館は「南極への旅」をテーマに、南極観測船ふじが日本から南極へ向かうコースに沿って5つの水域の生き物を紹介し、北館ではバンドウイルカやベルーガなどを展示しています。約3,000人が座れるスタンドのあるメインプールでは、パフォーマンスも行われています。館内のレストランで昼食にしましょう。休館日は公式の案内で確かめてから訪れましょう。",
    { name: "名古屋港水族館（昼食）" }),
  cre("南極観測船ふじ", 12, 10, 45, "walk", 5, null, 35.090664, 136.880528, "愛知県名古屋市港区港町1-9",
    "水族館から歩いてすぐ。わが国初の砕氷船とされ、18年間日本と南極を行き来した船で、今は名古屋港に当時の姿のまま係留され、「南極の博物館」に生まれ変わっています。食堂や医務室、乗組員の居室など、船内の各室は当時のまま再現され、ヘリコプターの格納庫を改造した展示室では、南極の自然や観測の歴史、基地での暮らしを紹介しています。船内は階段が急なところもあるので、子どもの手を引いて歩きましょう。"),
  cre("名古屋海洋博物館・展望室（ポートビル）", 13, 0, 45, "walk", 5, null, 35.090664, 136.880528, "愛知県名古屋市港区港町1-9",
    "ふじのすぐそば、ガーデンふ頭のシンボル「ポートビル」の3階と4階にある海の博物館です。3階では、港の役割や名古屋港の歴史を、実物やパノラマ模型で紹介し、船を操縦したり、ガントリークレーンを操作したりできるシミュレータもあります。4階では、大航海時代の帆船の模型などを展示しています。7階の展望室からも港を眺めましょう。"),
  cre("リニア・鉄道館", 14, 10, 140, "taxi", 25, null, 35.048874, 136.851206, "愛知県名古屋市港区金城ふ頭3-2-2",
    "ガーデンふ頭から車で約25分、金城ふ頭にある鉄道の博物館です。世界最高速度を記録した3つの車両をシンボルに、歴代の新幹線や在来線を含む39両の実物車両を展示しています。日本最大級の精緻な鉄道ジオラマや、子どもから大人まで楽しめる各種シミュレータもあり、新幹線や超電導リニアのしくみを体験しながら学べます。休館日は公式の案内で確かめてから訪れましょう。"),
];

const day2 = [
  upd(ZOO_ID, 9, 0, 180, null, null, null, 35.158866, 136.974127,
    "都会の中の豊かな自然に囲まれた動植物園で、小さなメダカから大きなアジアゾウまで、動物の飼育種類数は日本一ともいわれます。ニシローランドゴリラが暮らすゴリラ・チンパンジー舎や、アジアゾウ舎、コアラ舎、アジアの熱帯雨林エリアなど、展示施設もさまざまで、動物の生態や生息地の学習展示も豊富です。園内の食事処で昼食にしましょう。休園日は公式の案内で確かめてから訪れましょう。",
    { name: "東山動植物園（動物園・昼食）" }),
  cre("東山植物園", 12, 10, 60, "walk", 10, null, 35.154258, 136.981239, "愛知県名古屋市千種区東山元町3-70",
    "動物園から歩いて約10分。大温室や丘陵地の自然林を生かして、約7,000種の植物を展示しています。春は桜の回廊に約100品種1,000本の桜が咲き、秋は奥池や日本庭園を中心に約500本の木々が色づきます。椿園やバラ園、お花畑など、四季折々の花も楽しめます。"),
  cre("東山スカイタワー", 13, 20, 40, "walk", 10, null, 35.156755, 136.978847, "愛知県名古屋市千種区田代町瓶杁1-8",
    "植物園から歩いて約10分。名古屋市の市制100周年を記念して1989年に誕生したタワーで、高さ80mの丘の上に立つため、展望室は標高180mになります。晴れた日には、御嶽山や鈴鹿山脈、アルプスの山々も見渡せます。"),
  cre("FUJIなごや科学館", 14, 40, 90, "train", 30, "地下鉄東山線（東山公園→伏見）", 35.165242, 136.898599, "愛知県名古屋市中区栄2-17-1",
    "スカイタワーから地下鉄東山線で伏見駅へ。内径35mの世界最大級のプラネタリウムドーム「FUJIスカイドーム」を備えた総合科学館です。マイナス30度の部屋で極地を疑似体験したり、高さ9mの人工竜巻を見たりと、自然の驚異を体感できる大型展示をはじめ、約270種類の展示を楽しめます。休館日は公式の案内で確かめてから訪れましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== AQUA_ID || days[1].spots.map((s) => s.id).join() !== ZOO_ID
  ) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

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
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, day1, { tx });
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
