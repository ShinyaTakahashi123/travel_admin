/**
 * #461 f39d3e76（あしかがフラワーパーク 日帰り・春）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（フラワーパーク 09:30〜12:00 の150分）。午前はフラワーパークととなりの栗田美術館、JR両毛線で足利駅へ移って、午後は足利の史跡をめぐる
 *   あしかがフラワーパーク 9:10〜10:25 →（歩き10分）栗田美術館（新規）10:35〜11:35 →（JR両毛線と歩き35分）太平記館（新規・昼食）12:10〜13:10
 *   →（歩き5分）鑁阿寺（新規）13:15〜13:55 →（歩き5分）足利学校（新規）14:00〜14:50 →（歩き15分）足利織姫神社（新規）15:05〜15:50 →（歩き15分）渡良瀬橋（新規）16:05〜16:30
 *   #411 と行き先が重なるが、重なりは問題ない（企画運営 9/30）。本文は #411 で確かめた出典の事実を使う
 *   もとの本文にあった「日本初の女性樹木医」「日本で唯一選ばれた」などの確かめられない言い方は使わない。織姫神社の足利音頭の一節と「縁結び」も書かない
 *   開園時間は季節で変わる（藤の季節は早くなる）ので、本文は「公式の案内で」とする
 * 本文の出典（足利市観光協会）: あしかがフラワーパーク https://www.ashikaga-kankou.jp/spot/flower_park ・ https://www.ashikaga.co.jp/ ／栗田美術館 https://www.ashikaga-kankou.jp/spot/kurita_museum ／
 *   太平記館 https://www.ashikaga-kankou.jp/spot/taiheikikan ／鑁阿寺 https://www.ashikaga-kankou.jp/spot/bannaji ／足利学校 https://www.ashikaga-kankou.jp/spot/ashikagagakko ／
 *   織姫神社 https://www.ashikaga-kankou.jp/spot/orihime_jinjya ／渡良瀬橋 https://www.ashikaga-kankou.jp/spot/watarasebashi
 * 座標の出典: #411 と同じ（Nominatim: あしかがフラワーパーク 36.3138060,139.5198423／栗田美術館 36.3166595,139.5216088／鑁阿寺 36.3374074,139.4520880／渡良瀬橋 36.3335069,139.4441281、
 *   OSM/Overpass: 史跡足利学校 36.3359568,139.453623／太平記館駐車場 36.3349205,139.454499／織姫神社 36.3392505,139.444901）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-461-f39d3e76.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "f39d3e76-d71d-4b45-a8bb-bcee007b1265";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "春のあしかがフラワーパークで、大藤や白藤のトンネルなど藤の花を楽しみ、となりの栗田美術館で伊万里と鍋島の焼き物を鑑賞。午後は電車で足利の町へ移り、鑁阿寺、足利学校、足利織姫神社、渡良瀬橋をめぐる、花と歴史の日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "あしかがフラワーパーク") throw new Error("構成が想定と違います");
  const park = day.spots[0];

  const order = [
    { id: park.id, data: { visitTime: t(9, 10), stayDurationMin: 75, transitMode: null, transitDurationMin: null, transitLine: null, lat: 36.313806, lng: 139.519842, address: "栃木県足利市迫間町607",
      memo: "この旅は電車と歩きでめぐります。JR両毛線のあしかがフラワーパーク駅から歩いてすぐの、あしかがフラワーパークへ。樹齢160年におよぶ大藤と四季折々の花が楽しめる花の公園で、春には600畳敷きの藤棚の大藤や、長さ80mの白藤のトンネルなど、350本以上の藤が咲きます。開園時間は季節によって変わるので、公式の案内で確かめましょう。" } },
    { create: mk({ name: "栗田美術館", h: 10, m: 35, stay: 60, mode: "walk", min: 10, lat: 36.31666, lng: 139.521609, address: "栃木県足利市駒場町1542",
      memo: "フラワーパークから歩いて約10分。伊萬里・柿右衛門・鍋島を収蔵する陶磁の美術館で、3万坪の景勝地に、自然を生かした庭園と、本館や歴史館などの建物が建っています。江戸時代に肥前鍋島藩で作られた伊万里と鍋島だけを展示しているのが大きな特色です。休館日は公式の案内で確かめてから訪れましょう。" }) },
    { create: mk({ name: "太平記館", h: 12, m: 10, stay: 60, mode: "train", min: 35, line: "JR両毛線", lat: 36.334921, lng: 139.454499, address: "栃木県足利市伊勢町3丁目6-4",
      memo: "あしかがフラワーパーク駅からJR両毛線で足利駅へ出て、歩いて太平記館へ。足利観光の情報発信基地で、観光案内のほか、足利のお土産がそろい、館内の喫茶コーナーでは、片栗粉と玉ねぎで作る足利のご当地グルメ「足利シュウマイ」も味わえます。まわりの街なかで昼食にしましょう。" }) },
    { create: mk({ name: "鑁阿寺", h: 13, m: 15, stay: 40, mode: "walk", min: 5, lat: 36.337407, lng: 139.452088, address: "栃木県足利市家富町2220",
      memo: "太平記館から歩いてすぐの鑁阿寺へ。源姓足利氏2代目の足利義兼が、建久7年（1196年）に邸内に持仏堂を建て、守り本尊として大日如来をまつったのが始まりとされる寺です。3代目の義氏が堂塔伽藍を建てて、足利一門の氏寺としました。周囲に土塁と堀をめぐらしたほぼ正方形の寺域は、鎌倉時代の武家屋敷の面影を今に伝え、「足利氏宅跡」として国の史跡に指定されています。本堂（大御堂）は国宝です。" + RESPECT }) },
    { create: mk({ name: "足利学校", h: 14, m: 0, stay: 50, mode: "walk", min: 5, lat: 36.335957, lng: 139.453623, address: "栃木県足利市昌平町2338",
      memo: "鑁阿寺から歩いてすぐの足利学校へ。創建については、奈良時代の国学の遺制説、平安時代の小野篁説、鎌倉時代の足利義兼説などがあり、どれが正しいかは今も分かっていません。歴史が明らかになるのは室町時代中期で、関東管領の上杉憲実が学校を整え、16世紀の初めには生徒が三千人を数えたといわれ、フランシスコ・ザビエルによって海外にも紹介されました。今の姿は、江戸時代の姿を復元したものです。見学できない建物があることもあるので、公式の案内で確かめてから訪れましょう。" }) },
    { create: mk({ name: "足利織姫神社", h: 15, m: 5, stay: 45, mode: "walk", min: 15, lat: 36.339251, lng: 139.444901, address: "栃木県足利市西宮町3889",
      memo: "足利学校から歩いて約15分。1,300年の歴史をもつ機業地・足利の守護神がまつられる神社です。明治に建てられた社殿は火災で焼失し、昭和12年（1937年）に、当時では珍しい鉄筋コンクリートで今の社殿が完成しました。朱塗りのお宮が緑に映え、境内からは関東平野を一望できます。境内までは石段を上るので、足元に気をつけましょう。" + RESPECT }) },
    { create: mk({ name: "渡良瀬橋", h: 16, m: 5, stay: 25, mode: "walk", min: 15, lat: 36.333507, lng: 139.444128, address: "栃木県足利市通3丁目",
      memo: "織姫神社から歩いて約15分。足利の町を南北に分ける渡良瀬川にかかる橋のひとつで、夕日を背景にした渡良瀬川とトラス橋のシルエットは、歌手の森高千里さんの『渡良瀬橋』で広く知られるようになりました。川沿いでは足元や車に気をつけましょう。藤の花と足利の歴史をめぐる旅を、ここで締めくくりましょう。帰りは、JR足利駅か東武の足利市駅まで歩いて戻ります。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: フラワーパーク 9:10 → 栗田美術館 10:35 →（JR）太平記館（昼食）12:10 → 鑁阿寺 13:15 → 足利学校 14:00 → 織姫神社 15:05 → 渡良瀬橋 16:05〜16:30");
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
