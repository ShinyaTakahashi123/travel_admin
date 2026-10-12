/**
 * チェックリスト #420 550bf094「道頓堀の夜景と新世界のレトロ感、なにわ食い倒れ旅」の見直し（しおりえ(制作補助2)）
 * 終わりの時刻が14時台だったので、1日目に上方浮世絵館、2日目に四天王寺を足す（既存の10か所の本文は、つなぎの文だけ直す）
 * 1日目: なんばグランド花月 → 千日前道具屋筋商店街 → 黒門市場 → 法善寺横丁 → 上方浮世絵館 → 道頓堀（6か所 09:00〜16:30）
 * 2日目: 心斎橋筋商店街 → アメリカ村 → 難波八阪神社 → 通天閣 → 新世界 → 四天王寺（6か所 09:00〜15:25）
 * タイトルの「夜景」は、道頓堀を夕方までに訪れる行程に合わないので外す。説明文の「夜の道頓堀」も直す
 * 難波八阪神社に配慮の一文を足す（prayer-check で見つかったため）
 * 本文の出典: 上方浮世絵館 https://osaka-info.jp/spot/kamigata-ukiyoe-museum/ ／四天王寺 https://www.shitennoji.or.jp/history.html ・ https://www.shitennoji.or.jp/access.html
 * 座標の出典: Nominatim（上方浮世絵館 34.6679702,135.5022045／四天王寺 34.6547194,135.5167979）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-420-550bf094.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "550bf094-cd88-4920-8866-26c35fcba842";
const DAY1_ID = "9aa06298-19c5-4656-b9eb-bc33b57ca9c6";
const DAY2_ID = "b3f4b200-fe6c-4201-9354-eb65465e8a64";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "道頓堀と新世界のレトロ感、なにわ食い倒れ旅";
const DESCRIPTION =
  "1日目はなんばグランド花月の笑いから千日前道具屋筋商店街、黒門市場、法善寺横丁、上方の役者絵を集めた上方浮世絵館、道頓堀まで。2日目は心斎橋筋商店街やアメリカ村、難波八阪神社、通天閣、新世界をめぐり、最後は聖徳太子ゆかりの四天王寺へ。大阪の食い倒れとレトロな下町情緒を味わう1泊2日です。";

// 既存本文のつなぎの文の置き換え [スポット名, 置き換え前, 置き換え後]
const EDITS: [string, string, string][] = [
  ["法善寺横丁", "次は道頓堀そのものへ向かいましょう。", "次は、すぐそばの上方浮世絵館へ向かいましょう。"],
  ["道頓堀", "法善寺横丁から歩いて、1日目の締めくくりは道頓堀です。", "上方浮世絵館から歩いて、1日目の締めくくりは道頓堀です。"],
  ["難波八阪神社", "参拝を終えたら、次は通天閣へ向かいましょう。", "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。参拝を終えたら、次は通天閣へ向かいましょう。"],
  ["新世界", "旅の締めくくりは、通天閣のお膝元、新世界です。", "通天閣から歩いてすぐ、お膝元の新世界です。"],
  ["新世界", "串カツをかじって、2日間の大阪ミナミ旅を締めくくってください。", "串カツをかじったら、最後は四天王寺へ向かいましょう。"],
];

const UKIYOE = {
  create: {
    name: "上方浮世絵館", visitTime: t(14, 10), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 2, transitLine: null,
    lat: 34.66797, lng: 135.502205, address: "大阪府大阪市中央区難波1-6-4",
    memo: "法善寺の西側の角地に建つ、上方の役者絵を中心に収蔵・展示する浮世絵の美術館です。江戸時代後半の文化・文政期に人気を集めた三代目中村歌右衛門や七代目片岡仁左衛門などの役者絵を集めていて、4階建て、1フロアがおよそ60平方メートルのこぢんまりとした館内に、収蔵品のなかから30点ほどを展示しています。道頓堀の芝居小屋のにぎわいを感じてから、道頓堀へ向かいましょう。休館日は公式の案内で確かめてから訪れましょう。",
  },
};
const SHITENNOJI = {
  create: {
    name: "四天王寺", visitTime: t(14, 25), stayDurationMin: 60, transitMode: "walk", transitDurationMin: 20, transitLine: null,
    lat: 34.654719, lng: 135.516798, address: "大阪府大阪市天王寺区四天王寺1-11-18",
    memo: "新世界から歩いて約20分。推古天皇元年（593年）に建立されたと伝わる寺で、聖徳太子ゆかりの寺として知られています。中門・五重塔・金堂・講堂を南から北へ一直線に並べ、回廊で囲む伽藍配置は「四天王寺式伽藍配置」と呼ばれ、日本で最も古い建築様式の一つとされています。境内には聖徳太子の御霊をまつる聖霊院（太子殿）や、国宝・重要文化財を所蔵する宝物館もあります。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
  },
};

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  const d1 = days[0].spots.map((s) => s.name).join();
  const d2 = days[1].spots.map((s) => s.name).join();
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    d1 !== "なんばグランド花月,千日前道具屋筋商店街,黒門市場,法善寺横丁,道頓堀" || d2 !== "心斎橋筋商店街,アメリカ村,難波八阪神社,通天閣,新世界") throw new Error("構成が想定と違います");
  const memos: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.name, s.memo ?? ""]));
  for (const [name, o, n] of EDITS) {
    if (!memos[name].includes(o)) throw new Error(`本文が想定と違います: ${name}`);
    memos[name] = memos[name].replace(o, n);
  }
  const keep = (s: { id: string; name: string }, extra: Record<string, unknown> = {}) => ({ id: s.id, data: { memo: memos[s.name], ...extra } });
  const [kagetsu, doguya, kuromon, hozenji, dotonbori] = days[0].spots;
  const [shinsaibashi, amemura, yasaka, tsutenkaku, shinsekai] = days[1].spots;
  const day1 = [keep(kagetsu), keep(doguya), keep(kuromon), keep(hozenji), UKIYOE,
    keep(dotonbori, { visitTime: t(15, 5), stayDurationMin: 85, transitMode: "walk", transitDurationMin: 5 })];
  const day2 = [keep(shinsaibashi), keep(amemura), keep(yasaka), keep(tsutenkaku), keep(shinsekai), SHITENNOJI];

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
  for (const [name, , n] of EDITS) console.log(`${name}: …${n}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
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
