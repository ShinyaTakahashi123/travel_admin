/**
 * チェックリスト #386 e8cf096c「境港水産物直売センター、日本有数の水揚げ港の海の幸プラン」の見直し（しおりえ(制作補助2)）
 * 水木しげるロード → 水木しげる記念館 → 境港水産物直売センター（昼食）→ 境台場公園 → 海とくらしの史料館 → 夢みなとタワー → みなと温泉ほのかみ（7か所 09:00〜16:45）
 * 既存の直売センターはIDのまま直す（座標は国土地理院の「鳥取県境港市」の代表点だったので、OSMの建物の点に直す）
 * 座標の出典: OSM/Overpass（水木しげるロード 35.54547,133.22677／境港水産物直売センター 35.54536,133.24663／境台場公園 35.54683,133.24257／SANKO夢みなとタワー 35.51962,133.25957／みなと温泉ほのかみ 35.51984,133.26015）、
 *   Nominatim（水木しげる記念館 35.5463776,133.2312404／海とくらしの史料館 35.5472166,133.2418153）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-386-e8cf096c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "e8cf096c-6df2-469c-9335-e3825c7b12af";
const DAY1_ID = "44202b7b-dab3-4cf1-94b4-3bd77cc73813";
const CHOKUBAI_ID = "060d094d-08fc-4d78-bf4a-25ac97fc5d37";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "妖怪のブロンズ像が並ぶ水木しげるロードと記念館から、港のそばの直売センターで海の幸の昼食へ。幕末の台場の跡や、魚のはく製が並ぶ「水の無い水族館」、港を見渡すタワーをめぐり、最後は温泉でひと休みする、境港を歩く日帰りプランです。";

const MEMO_CHOKUBAI =
  "水木しげる記念館から歩いて約20分、境港の岸壁のそばにある直売センターです。山陰旋網漁業協同組合が運営し、老朽化した施設を建て替えて、2022年4月に新しくオープンしました。館内には鮮魚店を中心に、飲食店や土産物店が並び、境港に水揚げされる紅ズワイガニや本マグロ、干物などが店先に並びます。飲食店もあるので、ここで海の幸の昼食にしましょう。店先の呼び込みの声を聞きながら、港町ならではのにぎわいを楽しんでください。";

type NewSpot = { name: string; h: number; m: number; stay: number; mode?: string; dur?: number; line?: string; lat: number; lng: number; address: string; memo: string };

const BEFORE: NewSpot[] = [
  {
    name: "水木しげるロード", h: 9, m: 0, stay: 50, lat: 35.54547, lng: 133.22677, address: "鳥取県境港市",
    memo:
      "JR境線の境港駅を出るとすぐ始まる通りです。境港出身の漫画家・水木しげるの作品に登場する妖怪たちのブロンズ像が、駅から水木しげる記念館までの約800mの両側に並んでいます。1993年に誕生し、2018年には大規模なリニューアルで歩道が広げられ、妖怪の像もゾーンに分けて並べ直されました。お気に入りの妖怪を探しながら、ゆっくり歩いてみましょう。歩道は観光客でにぎわうので、写真を撮るときはほかの人の通行のじゃまにならないようにしましょう。",
  },
  {
    name: "水木しげる記念館", h: 9, m: 55, stay: 70, mode: "walk", dur: 5, lat: 35.546378, lng: 133.23124, address: "鳥取県境港市本町5",
    memo:
      "水木しげるロードの東の端にある記念館です。2024年4月にリニューアルオープンし、床面積が広がって展示も充実しました。境港で過ごした少年時代、戦争の体験、漫画家として、そして妖怪研究家としての歩みを、テーマごとの展示でたどれます。ロードで出会った妖怪たちの背景を知ると、町歩きがいっそう楽しくなります。",
  },
];

const AFTER: NewSpot[] = [
  {
    name: "境台場公園", h: 12, m: 40, stay: 40, mode: "walk", dur: 5, lat: 35.54683, lng: 133.24257, address: "鳥取県境港市花町",
    memo:
      "直売センターのすぐ近くにある公園です。幕末の文久3年（1863年）、鳥取藩が領内の大事な港に築いた8つの台場（砲台）の一つで、その中でも規模が大きく、重装備の台場だったといわれます。土を三段に盛り上げた土塁に砲座が置かれ、地元の農民が延べ4万人以上動員されて、1年ほどで築かれました。1988年に国の史跡に指定され、今は約240本の桜が咲く花見の名所として、地元の人々に「お台場」と呼ばれ親しまれています。",
  },
  {
    name: "海とくらしの史料館", h: 13, m: 25, stay: 60, mode: "walk", dur: 5, lat: 35.547217, lng: 133.241815, address: "鳥取県境港市花町8-3",
    memo:
      "境台場公園から歩いてすぐ、明治時代の酒蔵を改修して1994年に開館した資料館です。約700種・4000点の魚やカニなどのはく製を収蔵し、「水の無い水族館」とも呼ばれています。大きなマンボウやリュウグウノツカイ、ホホジロザメなど、海の生き物の大きさを間近で実感できます。境港の漁業と暮らしを伝える民俗資料もあわせて見学しましょう。",
  },
  {
    name: "夢みなとタワー", h: 14, m: 40, stay: 50, mode: "taxi", dur: 15, lat: 35.51962, lng: 133.25957, address: "鳥取県境港市竹内団地255-3",
    memo:
      "市内を回っていた路線バスは予約制の乗合バスに変わったので、ここへはタクシーでおよそ15分（予約制の乗合バスを使う場合は公式の案内で確かめてください）。1997年の「山陰・夢みなと博覧会」のシンボルとして建てられた高さ43mのタワーで、ガラス張りの外壁と、白い鉄の柱と輪を組み合わせた骨組みが特徴です。最上階の展望室からは、境港の港とまわりの海や山並みを360度見渡せます。",
  },
  {
    name: "みなと温泉ほのかみ", h: 15, m: 35, stay: 70, mode: "walk", dur: 5, lat: 35.51984, lng: 133.26015, address: "鳥取県境港市竹内団地",
    memo:
      "夢みなとタワーのとなりにある日帰り温泉です。露天風呂や大浴場があり、港町を歩いた一日の疲れをゆっくりいやせます。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。休館日があるので、公式の案内で確かめてから訪れましょう。帰りはタクシーか予約制の乗合バスで、境港駅や米子鬼太郎空港へ向かいます。",
  },
];

function toCreate(s: NewSpot) {
  return { create: { name: s.name, visitTime: t(s.h, s.m), stayDurationMin: s.stay, transitMode: s.mode ?? null, transitDurationMin: s.dur ?? null, transitLine: s.line ?? null, lat: s.lat, lng: s.lng, address: s.address, memo: s.memo } };
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== CHOKUBAI_ID) throw new Error("構成が想定と違います");

  const order = [
    ...BEFORE.map(toCreate),
    { id: CHOKUBAI_ID, data: { visitTime: t(11, 25), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 35.54536, lng: 133.24663, memo: MEMO_CHOKUBAI } },
    ...AFTER.map(toCreate),
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? "境港水産物直売センター(既存)" : d.name} ${String(d.memo).length}字`);
    prevEnd = st + (d.stayDurationMin as number);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
      await setDaySpotOrder(DAY1_ID, order, { tx });
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
