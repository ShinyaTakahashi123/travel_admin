/**
 * #205 ac6501e9「空中庭園から天満宮へ。梅田の高層ビル街を楽しむプラン」の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md）
 * もとは 5か所 09:00〜15:15 で、タイトルの「空中庭園」「天満宮」が入っておらず、昼食の一言がなく、時刻が半端（9:55・11:41・13:10・14:13）で滞在も長すぎた。
 *   本文は案内の話し方（「一興」「お疲れさまでした」）で、確かめられない記述（自由亭ホテル・翠柳館、赤いクジラ、読者アンケート、中崎町の130軒など）が多かった。
 *   中崎町は公式の観光の出典が見つからないので外す（写真なし）
 * 歩きと地下鉄: 中之島公園 9:00 → 大阪市中央公会堂 → 梅田スカイビル 空中庭園展望台 → グラングリーン大阪（昼食）→ HEP FIVE観覧車（11時から）→（地下鉄）大阪くらしの今昔館
 *   → 天神橋筋商店街（南へ歩く）→ 大阪天満宮 16:30 → 南森町駅から
 * 本文の出典（大阪観光局 OSAKA-INFO ほか）: 中之島公園 https://osaka-info.jp/spot/nakanoshima-park/ （検索結果の要約: 1891年・大阪で最初の都市公園・約1.5km・10.6ha・約310品種3700株のバラ）／
 *   大阪市中央公会堂 https://osaka-chuokokaido.com/ （1913年着工・1918年竣工・岩本栄之助の寄附・ネオルネッサンス様式・2002年に公会堂建築として西日本で初めて重文）／
 *   空中庭園展望台 https://osaka-info.jp/special/universal/course01/spot08/ （地上173m・2008年に英紙で世界の建築トップ20）／
 *   グラングリーン大阪 https://www.mec.co.jp/news/detail/2026/04/23_mec260423_ggo （検索結果の要約: うめきた公園 約4.5万㎡・サウスパークとノースパーク）・飲食店 https://umekita.com/floor/ ／
 *   HEP FIVE観覧車 https://osaka-info.jp/spot/hep-five-ferris-wheel/ （検索結果の要約: 直径75m・地上106m・乗り場7階・52台・11時から）／
 *   大阪くらしの今昔館 https://osaka-info.jp/spot/osaka-museum-housing-living/ （検索結果の要約: 住まいの歴史と文化の専門博物館・1800年代の大坂の町を原寸大で再現・10〜17時・火曜休）／
 *   天神橋筋商店街 https://osaka-info.jp/spot/tenjimbashisuji-shopping-street/ （検索結果の要約: 約2.6km・約800店・歩いて約40分）／
 *   大阪天満宮 https://osaka-info.jp/spot/osakatenmangu/ （天暦3年(949)・菅原道真・七本の松の伝説・村上天皇・天満の氏神・学問と芸能の神・天神祭・9〜17時）
 * 座標の出典: OSM — 中之島公園 way 54037338／中央公会堂 way 162382613／梅田スカイビル relation 3389505／うめきた公園サウスパーク way 1147393995／HEP FIVE way 161451126／
 *   大阪くらしの今昔館 node 4419665990／天神橋筋商店街 way 1158379383（六丁目の北の端）／大阪天満宮 way 363304259
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-205-ac6501e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "ac6501e9-2927-429c-a6bc-d7185b8fe515";
const DAY_ID = "cfab92d1-9450-4de0-9f1a-c6034a07968a";
const ID = {
  nakanoshima: "3ef7a168-e73d-402b-b085-408e6abffe99",
  grangreen: "3f8d9788-41bd-4299-87f3-618c30f6b722",
  hep: "fa86aa0a-a783-4d5f-8477-0bfa545cc9d2",
  nakazaki: "f43ef89d-19ac-4c22-aa24-7fe7ef6b1e56",
  tenjinbashi: "f8abd278-f192-4a7d-be13-ee5e44915ec9",
};
const EXPECTED = [ID.nakanoshima, ID.grangreen, ID.hep, ID.nakazaki, ID.tenjinbashi];
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION =
  "水の都・中之島の公園と中央公会堂から歩き始め、地上173mの梅田スカイビル空中庭園展望台、緑の広がるグラングリーン大阪、HEP FIVEの赤い観覧車へ。午後は大阪くらしの今昔館で江戸時代の大坂の町にふれ、日本一長いといわれる天神橋筋商店街を歩いて、大阪天満宮で締めくくる日帰りプランです。";

type S = { h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string; lat: number; lng: number; address: string; memo: string };
const data = (s: S) => ({ visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode, transitDurationMin: s.min, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo });
const upd = (id: string, s: S) => ({ id, data: data(s) });
const cre = (name: string, s: S) => ({ create: { name, ...data(s) } });

const DAY = [
  upd(ID.nakanoshima, { h: 9, m: 0, stay: 40, mode: null, min: null, lat: 34.6923995, lng: 135.5077568, address: "大阪府大阪市北区中之島1丁目",
    memo: "この旅は歩きと地下鉄でめぐります。大阪メトロ淀屋橋駅から歩いて約5分。堂島川と土佐堀川にはさまれた中之島の東側にある公園で、明治24年（1891年）に開かれた、大阪で最初の都市公園とされます。川沿いに約1.5kmにわたって細長く続き、バラ園には約310品種のバラが植えられ、春と秋に花を咲かせます。水辺の道では足元に気をつけましょう。" }),
  cre("大阪市中央公会堂", { h: 9, m: 45, stay: 30, mode: "walk", min: 5, lat: 34.6935404, lng: 135.5040087, address: "大阪府大阪市北区中之島1-1-27",
    memo: "公園から西へ歩いて約5分。大阪市民の岩本栄之助の寄附をもとに、大正2年（1913年）に着工し、大正7年（1918年）に完成したネオルネッサンス様式の建物です。2002年には公会堂の建物として西日本で初めて国の重要文化財に指定されました。休館日は公式の案内で確かめましょう。" }),
  cre("梅田スカイビル 空中庭園展望台", { h: 10, m: 40, stay: 50, mode: "train", min: 25, line: "大阪メトロ御堂筋線（淀屋橋〜梅田）", lat: 34.7052927, lng: 135.4905349, address: "大阪府大阪市北区大淀中1-1-88",
    memo: "公会堂から淀屋橋駅へ戻り、地下鉄で梅田へ。駅から歩いて、あわせて約25分。2つの高層ビルを最上部でつないだ梅田スカイビルの屋上にある展望台で、地上173mから大阪の町並みを見渡せます。2008年にはイギリスの新聞で「世界の建築トップ20」の一つに選ばれたとされます。屋外の展望フロアでは、風の強い日は足元に気をつけましょう。" }),
  upd(ID.grangreen, { h: 11, m: 40, stay: 70, mode: "walk", min: 10, lat: 34.7036664, lng: 135.4923952, address: "大阪府大阪市北区大深町",
    memo: "スカイビルから歩いて約10分。JR大阪駅の北側に生まれた街で、道路をはさんでサウスパークとノースパークに分かれる「うめきた公園」は、あわせて約4.5万㎡の広さがあります。公園に面した建物には飲食店も入っているので、ここで昼食にしましょう。食後は芝生の広場や水辺を歩いてみましょう。" }),
  upd(ID.hep, { h: 13, m: 0, stay: 35, mode: "walk", min: 10, lat: 34.7040592, lng: 135.500379, address: "大阪府大阪市北区角田町5-15",
    memo: "グラングリーン大阪から歩いて約10分。梅田の商業ビルの上に架かる、直径75mの真っ赤な観覧車です。乗り場は7階で、ゴンドラはビルの屋上を抜けて地上106mまで上り、晴れた日は明石海峡まで見渡せるといわれます。" }),
  cre("大阪くらしの今昔館", { h: 13, m: 55, stay: 65, mode: "train", min: 20, line: "大阪メトロ谷町線・堺筋線（東梅田〜天神橋筋六丁目）", lat: 34.7104664, lng: 135.5114334, address: "大阪府大阪市北区天神橋6-4-20 住まい情報センタービル8階",
    memo: "HEP FIVEから地下鉄で天神橋筋六丁目へ、あわせて約20分。住まいの歴史と文化をテーマにした日本で初めての専門の博物館で、1800年代の大坂の町並みを原寸大で再現したフロアでは、通りを歩いたり道具にふれたりして、当時の暮らしを感じられます。休館日は公式の案内で確かめましょう。" }),
  upd(ID.tenjinbashi, { h: 15, m: 5, stay: 45, mode: "walk", min: 5, lat: 34.7095542, lng: 135.5112546, address: "大阪府大阪市北区天神橋6丁目〜1丁目",
    memo: "今昔館を出てすぐ、天神橋筋六丁目から商店街を南へ歩きます。天神橋筋商店街は約2.6kmにわたって続く、日本一長いともいわれるアーケードの商店街で、約800の店が並びます。食べ歩きやお土産探しを楽しみながら、大阪天満宮のある二丁目のあたりまで歩きましょう。人通りが多いので、まわりに気をつけて歩きましょう。" }),
  cre("大阪天満宮", { h: 16, m: 0, stay: 30, mode: "walk", min: 10, lat: 34.6960904, lng: 135.5127654, address: "大阪府大阪市北区天神橋2-1-8",
    memo: "商店街から歩いて約10分。天暦3年（949年）に始まったとされる神社で、太宰府へ向かう途中の菅原道真が立ち寄ったという地に、道真の死後、一夜にして七本の松が生えて夜ごとに光ったという話を村上天皇が聞き、道真をまつったのが始まりと伝えられます。「天満の天神さん」として親しまれる学問と芸能の神様で、夏には日本三大祭の一つともいわれる天神祭が行われます。" + RESPECT + "帰りは、歩いて約5分の地下鉄の南森町駅から帰りましょう。" }),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" }, include: { photos: true } } } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (it.days.length !== 1 || it.days[0].id !== DAY_ID || it.days[0].spots.map((s) => s.id).join() !== EXPECTED.join()) throw new Error("構成が想定と違います");
  if (it.days[0].spots.find((s) => s.id === ID.nakazaki)!.photos.length) throw new Error("中崎町に写真があります");
  let prevEnd = -1;
  for (const x of DAY) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    const gap = prevEnd < 0 ? "" : ` (前から${st - prevEnd}分・移動${d.transitDurationMin}分${st - prevEnd !== d.transitDurationMin ? " ⚠" : ""})`;
    const name = "id" in x ? `${Object.keys(ID).find((k) => ID[k as keyof typeof ID] === x.id)}(既存)` : (d.name as string);
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}${gap} ${name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  console.log(`\n説明文: ${DESCRIPTION}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY_ID, DAY, { remove: [ID.nakazaki], tx });
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
