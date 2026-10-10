/**
 * #477 b2a067e9（福井 春 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 2か所 09:30〜11:40（足羽山公園 →（車）足羽川桜並木）で、本文はガイドの語り口だった
 *   #457（福井市内）と足羽山公園が重なるので、この旅は「春の自然」を主旨に、足羽山と足羽川のあと、福井鉄道で鯖江の西山公園（桜・つつじ）へ足をのばす（戻らない）
 *   足羽山公園 9:10〜10:15 →（歩き5分）福井市自然史博物館（新規）10:20〜11:05 →（歩き15分）足羽川桜並木（昼食）11:20〜12:30
 *   →（歩きと福井鉄道40分）西山公園（新規）13:10〜14:25 →（歩き5分）西山動物園（新規）14:30〜15:10 →（歩き30分）めがねミュージアム（新規）15:40〜16:35
 *   閉まる時刻: 自然史博物館 9:00〜17:15（入館16:45まで・月曜休館）、めがねミュージアムの博物館 10:00〜17:00（水曜休館）。本文に時刻・曜日は書かない
 * 本文の出典: 福いろ https://fuku-iro.jp/spot/detail_10157.html （足羽山公園・福井駅から歩いて約25分）・/spot/detail_10156.html （足羽川桜並木）、福井市 https://www.city.fukui.lg.jp/kankou/bunka/sisetu/p004457.html （自然史博物館）、
 *   ふくいドットコム https://www.fuku-e.com/spot/detail_1535.html （西山公園・西山動物園）、鯖江市 https://www.city.sabae.fukui.jp/kanko/playing/nishiyama.html ・/kanko/sightseeing/museum.html 、
 *   めがねミュージアム https://www.megane.gr.jp/museum/access （鯖江駅から歩いて約10分）
 * 座標の出典: OSM（足羽山公園 node 4379171294／福井市自然史博物館 node 1420949314／足羽川の桜橋 way 1041564842／西山公園 way 543891213／西山動物園 node 2014668815／めがねミュージアム node 2232974462）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-477-b2a067e9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b2a067e9-a1ad-40ae-9d41-b68f9b7138c1";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION = "桜の名所の足羽山公園と自然史博物館から、約2.2km続く足羽川の桜並木へ。午後は福井鉄道の電車で鯖江へ足をのばし、桜とつつじの西山公園、レッサーパンダの西山動物園、めがねミュージアムをめぐる、春の福井の自然を楽しむ日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["足羽山公園", "足羽川桜並木"].join()) throw new Error("構成が想定と違います");
  const [park, sakura] = day.spots;

  const order = [
    { id: park.id, data: { visitTime: t(9, 10), stayDurationMin: 65, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.054616, lng: 136.205431, address: "福井県福井市足羽上町",
      memo: "この旅は歩きと福井鉄道の電車でめぐります。福井駅から歩いて約25分の足羽山公園へ。標高116.4mの足羽山に広がる公園で、福井の礎を築いたとされる継体天皇の像や、多くの古墳があります。春は約3,500本の桜が咲き、日本さくら名所100選に選ばれています。カピバラなどがいるミニ動物園もあります。坂道では足元に気をつけましょう。" } },
    { create: mk({ name: "福井市自然史博物館", h: 10, m: 20, stay: 45, mode: "walk", min: 5, lat: 36.056606, lng: 136.209403, address: "福井県福井市足羽上町147",
      memo: "足羽山の中の福井市自然史博物館へ。身近な自然や生きもの、星空まで、足羽山を中心に福井の自然史を紹介する博物館です。休館日は公式の案内で確かめましょう。" }) },
    { id: sakura.id, data: { visitTime: t(11, 20), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 36.061543, lng: 136.213589, address: "福井県福井市中央3丁目",
      memo: "足羽山を下りて、足羽川の桜並木へ。街の中心を流れる足羽川の堤防に、約600本の桜が約2.2kmにわたって続き、平成2年（1990年）に日本さくら名所100選に選ばれました。花月橋から新明里橋のあたりでは、ソメイヨシノの花のトンネルを歩けます。このあたりで昼食にしましょう。川沿いでは足元に気をつけましょう。" } },
    { create: mk({ name: "西山公園", h: 13, m: 10, stay: 75, mode: "train", min: 40, line: "福井鉄道", lat: 35.953657, lng: 136.180752, address: "福井県鯖江市桜町3丁目",
      memo: "足羽山公園口駅から福井鉄道の電車に乗り、西山公園駅へ。駅から歩いてすぐの西山公園は、約56haの広さと150年余りの歴史をもつ公園で、約5万株のつつじが咲く日本海側随一のつつじの名所とされ、5月にはつつじまつりが開かれます。春には約1,000本の桜も咲きます。" }) },
    { create: mk({ name: "西山動物園", h: 14, m: 30, stay: 40, mode: "walk", min: 5, lat: 35.950651, lng: 136.180897, address: "福井県鯖江市桜町3丁目",
      memo: "公園の中の西山動物園へ。レッサーパンダが人気の動物園です。動物に食べ物をあげたり、さくに手を入れたりしないようにしましょう。" }) },
    { create: mk({ name: "めがねミュージアム", h: 15, m: 40, stay: 55, mode: "walk", min: 30, lat: 35.942772, lng: 136.198843, address: "福井県鯖江市新横江2-3-4",
      memo: "西山公園から東へ歩いて、めがねミュージアムへ。福井・鯖江で作られた3,000種以上のめがねフレームが並び、3階のめがね博物館では、めがね作りの歴史を紹介しています。職人の手ほどきを受けるめがね作りの体験もあります。休館日は公式の案内で確かめましょう。春の福井の自然と、鯖江のものづくりにふれる旅を、ここで締めくくりましょう。帰りは、ハピラインふくいの鯖江駅まで歩いて約10分。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 足羽山公園 9:10 → 自然史博物館 10:20 → 足羽川桜並木（昼食）11:20 →（福井鉄道）西山公園 13:10 → 西山動物園 14:30 → めがねミュージアム 15:40〜16:35");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day.id, order as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
