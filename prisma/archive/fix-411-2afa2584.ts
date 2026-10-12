/**
 * チェックリスト #411 2afa2584「織姫神社の夜景と足利の街並み、大人の足利1泊2日」の見直し（しおりえ(制作補助2)）
 * 1日目（歩き）: 鑁阿寺 → 史跡足利学校 → 太平記館（昼食）→ 足利市立美術館 → 足利織姫神社 → 草雲美術館 → 渡良瀬橋（7か所 09:00〜16:30）
 * 2日目（車）: 樺崎八幡宮 → ココ・ファーム・ワイナリー → あしかがフラワーパーク（昼食）→ 栗田美術館（4か所 09:00〜16:20）
 * 既存の3か所はIDのまま直す（前の本文は長い案内文で、確かめられない記述もあったので書き直す）。足利学校は2日目から1日目へ移す
 * タイトルの「夜景」は昼の行程に合わないので、内容に合わせて変える（企画運営の了承済み）
 * 織姫神社の座標（36.389302,139.42082）は5km ほど北の別の場所だったので直す
 * 既存の写真（鑁阿寺の本堂・足利学校の学校門）は目で見て合っているので残す
 * 本文の出典（足利市観光協会）: 鑁阿寺 https://www.ashikaga-kankou.jp/spot/bannaji ／足利学校 https://www.ashikaga-kankou.jp/spot/ashikagagakko ／
 *   太平記館 https://www.ashikaga-kankou.jp/spot/taiheikikan ／足利市立美術館 https://www.ashikaga-kankou.jp/spot/municipal_museum ／
 *   織姫神社 https://www.ashikaga-kankou.jp/spot/orihime_jinjya ／草雲美術館 https://www.ashikaga-kankou.jp/spot/souun_museum ／
 *   渡良瀬橋 https://www.ashikaga-kankou.jp/spot/watarasebashi ／樺崎八幡宮 https://www.ashikaga-kankou.jp/spot/kabasaki ／
 *   ココ・ファーム・ワイナリー https://www.ashikaga-kankou.jp/spot/coco_farm_winery ／あしかがフラワーパーク https://www.ashikaga-kankou.jp/spot/flower_park ・ https://www.ashikaga.co.jp/ ／
 *   栗田美術館 https://www.ashikaga-kankou.jp/spot/kurita_museum
 * 座標の出典: Nominatim（鑁阿寺 36.3374074,139.4520880／草雲美術館 36.3355746,139.4325516／渡良瀬橋 36.3335069,139.4441281／
 *   あしかがフラワーパーク 36.3138060,139.5198423／栗田美術館 36.3166595,139.5216088）、OSM/Overpass（史跡足利学校 36.3359568,139.453623／
 *   太平記館は太平記館駐車場の点 36.3349205,139.454499／足利市立美術館 36.3340528,139.4503402／織姫神社 36.3392505,139.444901／
 *   樺崎八幡宮 36.3618228,139.4948884／ココ・ファーム・ワイナリーはバス停「ココファーム入口」の点 36.3710123,139.4690645）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-411-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const DAY1_ID = "2fed77f6-4130-4743-a92b-8044a48829aa";
const DAY2_ID = "64e974e3-6585-489c-9892-a7f9c54259e5";
const ORIHIME_ID = "5ca11f97-8e6c-4aed-a934-9d082205751d";
const BANNAJI_ID = "b73aca80-7b51-4ece-a31a-6e953d00feca";
const GAKKO_ID = "3c09b161-b312-45d8-936f-9559b3709f9a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "鑁阿寺と足利学校、フラワーパークまで巡る大人の足利1泊2日";
const DESCRIPTION =
  "1日目は足利氏ゆかりの鑁阿寺と史跡足利学校から、織物の町の守り神・織姫神社、幕末の画家の草雲美術館を歩いてめぐり、夕暮れの渡良瀬橋へ。2日目は車で、足利義兼ゆかりの樺崎八幡宮と、山のぶどう畑のふもとのワイナリーを訪ね、あしかがフラワーパークで花を楽しんで、伊万里・鍋島の栗田美術館へ。足利の歴史と文化をじっくり味わう1泊2日です。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string, extra: Record<string, unknown> = {}) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo, ...extra },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const day1 = [
  upd(BANNAJI_ID, 9, 0, 50, null, null, 36.337407, 139.452088,
    "源姓足利氏2代目の足利義兼が、建久7年（1196年）に邸内に持仏堂を建て、守り本尊として大日如来をまつったのが始まりとされる寺です。3代目の義氏が堂塔伽藍を建てて、足利一門の氏寺としました。周囲に土塁と堀をめぐらしたほぼ正方形の寺域は、鎌倉時代の武家屋敷の面影を今に伝え、「足利氏宅跡」として国の史跡に指定されています。本堂（大御堂）は国宝です。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  upd(GAKKO_ID, 9, 55, 60, "walk", 5, 36.335957, 139.453623,
    "鑁阿寺から歩いてすぐ。創建については、奈良時代の国学の遺制説、平安時代の小野篁説、鎌倉時代の足利義兼説などがあり、どれが正しいかは今も分かっていません。歴史が明らかになるのは室町時代中期で、関東管領の上杉憲実が学校を整え、16世紀の初めには生徒が三千人を数えたといわれ、フランシスコ・ザビエルによって海外にも紹介されました。今の姿は、江戸時代の姿を復元したものです。茅葺屋根の葺き替え工事で見学できない建物もあるので、公式の案内で確かめてから訪れましょう。"),
  cre("太平記館（昼食）", 11, 0, 70, "walk", 5, 36.334921, 139.454499, "栃木県足利市伊勢町3丁目6-4",
    "足利学校から歩いてすぐの、足利観光の情報発信基地です。観光案内のほか、足利のお土産がそろい、館内の喫茶コーナーでは、片栗粉と玉ねぎで作る足利のご当地グルメ「足利シュウマイ」も味わえます。まわりの街なかで昼食にしましょう。"),
  cre("足利市立美術館", 12, 20, 60, "walk", 10, 36.334053, 139.45034, "栃木県足利市通2丁目14-7",
    "太平記館から歩いて約10分。国内の優れた美術品の鑑賞の場として、また両毛地域が輩出した美術家の作品を身近に味わえる場として親しまれている美術館で、住宅と一緒になった全国的にも珍しい都市型美術館です。休館日は公式の案内で確かめてから訪れましょう。"),
  upd(ORIHIME_ID, 13, 35, 60, "walk", 15, 36.339251, 139.444901,
    "市立美術館から歩いて約15分。「足利来るなら織姫様の 赤いお宮を目じるしに」と足利音頭に歌われる神社で、1,300年の歴史をもつ機業地・足利の守護神がまつられ、産業振興と縁結びの神様として親しまれています。明治に建てられた社殿は火災で焼失し、昭和12年（1937年）に、当時では珍しい鉄筋コンクリートで今の社殿が完成しました。朱塗りのお宮が緑に映え、境内からは関東平野を一望できます。境内までは石段を上るので、足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。",
    { name: "足利織姫神社" }),
  cre("草雲美術館", 14, 55, 50, "walk", 20, 36.335575, 139.432552, "栃木県足利市緑町2丁目3768",
    "織姫神社から歩いて約20分。足利が生んだ幕末の勤皇画家・田崎草雲の遺作や遺品を展示する美術館です。草雲は最初の帝室技芸員としても知られ、海外でも高く評価されています。足利公園の南端にあり、となりには草雲が画室や住まいとして使った白石山房があります。休館日は公式の案内で確かめてから訪れましょう。"),
  cre("渡良瀬橋", 16, 0, 30, "walk", 15, 36.333507, 139.444128, "栃木県足利市通3丁目",
    "草雲美術館から歩いて約15分。足利の町を南北に分ける渡良瀬川にかかる橋のひとつで、沈む夕日を背景にした渡良瀬川とトラス橋のシルエットは、歌手の森高千里さんの『渡良瀬橋』に歌われて広く知られるようになりました。橋の北側のたもとには『渡良瀬橋の歌碑』があります。川沿いでは足元や車に気をつけて、夕暮れの景色を楽しみましょう。"),
];

const day2 = [
  cre("樺崎八幡宮", 9, 0, 40, null, null, 36.361823, 139.494888, "栃木県足利市樺崎町1723",
    "鑁阿寺の開基・足利義兼が、身内の菩提のために創建した樺崎寺跡（国の史跡）の中にある神社です。3代目の義氏がお堂を建て、八幡を勧請して義兼を合わせてまつったのが始まりといわれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"),
  cre("ココ・ファーム・ワイナリー", 10, 0, 45, "car", 10, 36.371012, 139.469065, "栃木県足利市田島町611",
    "樺崎八幡宮から車で約10分。1950年代に開かれた山のぶどう畑のふもとにあるワイナリーで、100%日本のぶどうからワインを造っています。自家畑では除草剤や化学肥料を使わず、醸造場での発酵も天然の野生酵母が中心です。ワインショップからは、ぶどう畑や醸造タンクも眺められます。お酒は20歳から。車を運転する人は飲まないでください。"),
  cre("あしかがフラワーパーク（昼食）", 11, 10, 180, "car", 25, 36.313806, 139.519842, "栃木県足利市迫間町607",
    "ココ・ファームから車で約25分。樹齢160年におよぶ大藤と四季折々の花が楽しめる花の公園で、春には600畳敷きの藤棚の大藤や、長さ80mの白藤のトンネルなど、350本以上の藤が咲きます。初夏にはバラや花菖蒲、夏にはアジサイやスイレン、秋にはアメジストセージが園内を彩り、秋から冬にかけてはイルミネーション「光の花の庭」も開かれます。園内のレストランで昼食にしましょう。レストランが貸切の日もあり、営業時間も季節で変わるので、公式の案内で確かめておきましょう。"),
  cre("栗田美術館", 14, 20, 120, "walk", 10, 36.31666, 139.521609, "栃木県足利市駒場町1542",
    "フラワーパークから歩いて約10分。伊萬里・柿右衛門・鍋島を収蔵する陶磁の美術館で、3万坪の景勝地に、自然を生かした庭園と、本館や歴史館などの建物が建っています。江戸時代に肥前鍋島藩で作られた伊万里と鍋島だけを展示しているのが大きな特色です。休館日は公式の案内で確かめてから訪れましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (
    days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID ||
    days[0].spots.map((s) => s.id).join() !== `${ORIHIME_ID},${BANNAJI_ID}` ||
    days[1].spots.map((s) => s.id).join() !== `${GAKKO_ID}`
  ) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days.flatMap((d) => d.spots).map((s) => [s.id, s.name]));

  console.log(`タイトル: ${TITLE}\n説明文: ${DESCRIPTION}`);
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
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE, description: DESCRIPTION } });
      await tx.spot.update({ where: { id: GAKKO_ID }, data: { dayId: DAY1_ID, orderNo: 9501 } });
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
