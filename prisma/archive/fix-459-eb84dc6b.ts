/**
 * #459 eb84dc6b（山口・中原中也 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（中原中也記念館 09:30〜10:20）。詩人の主旨で、山頭火の其中庵（小郡）→ 湯田温泉の中也ゆかり → 午後は山口の大内文化の町へ（戻らない）
 *   其中庵（新規）9:20〜9:50 →（歩きとJR山口線50分）中原中也記念館 10:40〜11:50 →（歩き5分）井上公園（新規・昼食）11:55〜12:55
 *   →（路線バスと歩き45分）瑠璃光寺五重塔・香山公園（新規）13:40〜14:55 →（竪小路を歩いて20分）龍福寺（新規）15:15〜15:55 →（歩き5分）十朋亭維新館（新規）16:00〜16:30
 *   午後の行き先は #428 と重なるが、行き先の重なりは問題ない（企画運営 9/30）
 *   閉まる時刻: 其中庵 9:00〜17:00（10〜4月）、中原中也記念館 9:00〜17:00（11〜4月、月曜・最終火曜休館）、十朋亭維新館（火曜休館）。本文に時刻・曜日は書かない
 *   山口市小郡文化資料館は公式サイトに接続できず確かめられないので使わない
 * 本文の出典: おいでませ山口へ https://yamaguchi-tourism.jp/spot/detail_12073.html （其中庵）・detail_12360.html（中原中也記念館）・detail_12254.html（井上公園）・detail_15401.html（瑠璃光寺五重塔）・
 *   detail_17326.html（一の坂川）・detail_15198.html（竪小路）、山口市観光 https://yamaguchi-city.jp/details/aa_kozan.html （香山公園）・ac_ryufuku.html（龍福寺）・ac_jipou.html（十朋亭維新館）
 * 座標の出典: OSM（中原中也記念館 node 1423654032／井上公園 way 316662360／瑠璃光寺五重塔 node 3018655868／龍福寺 way 555602672／維新史蹟 十朋亭 node 6813520227）、
 *   其中庵は OSM に点がないので地理院の住所検索（小郡下郷1811番地）34.098804,131.38829
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-459-eb84dc6b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "eb84dc6b-1b63-4e1d-9acf-a29fe5e05cb4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "種田山頭火が暮らした其中庵から、中原中也の生家跡に建つ記念館、中也の詩碑と山頭火の句碑が並ぶ湯田温泉の井上公園へ。午後は国宝・瑠璃光寺五重塔と香山公園、大内氏の館跡に建つ龍福寺、十朋亭維新館をたずね、山口が育んだ詩人と歴史をたどる日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "中原中也記念館") throw new Error("構成が想定と違います");
  const chuya = day.spots[0];

  const order = [
    { create: mk({ name: "其中庵", h: 9, m: 20, stay: 30, mode: null, min: null, lat: 34.098804, lng: 131.38829, address: "山口県山口市小郡下郷1811",
      memo: "この旅は電車・バスと歩きでめぐります。JR山陽本線の新山口駅から歩いて約20分で、其中庵へ。俳人・種田山頭火が昭和7年から13年まで過ごした庵を、当時親しく訪ねていた近木黎々火による見取り図をもとに、平成4年にこの場所に復元したもので、まわりは休憩所や東屋、水琴窟のある公園になっています。" }) },
    { id: chuya.id, data: { visitTime: t(10, 40), stayDurationMin: 70, transitMode: "train", transitDurationMin: 50, transitLine: "JR山口線", lat: 34.164779, lng: 131.457879, address: "山口県山口市湯田温泉1丁目",
      memo: "新山口駅へ戻り、JR山口線で湯田温泉駅へ。駅から歩いて約10分の中原中也記念館は、「汚れつちまつた悲しみに……」「サーカス」などの作品で知られる詩人・中原中也の生家跡に建つ記念館で、中也の30年の生涯と作品を、自筆の原稿や日記などの資料で紹介しています。休館日は公式の案内で確かめましょう。" } },
    { create: mk({ name: "井上公園", h: 11, m: 55, stay: 60, mode: "walk", min: 5, lat: 34.163362, lng: 131.456715, address: "山口県山口市湯田温泉2丁目5",
      memo: "記念館から歩いてすぐの井上公園へ。明治の政治家・井上馨の生家があった場所で、幕末の政変で都を追われた三条実美ら七卿の宿舎にもなりました。園内には、井上馨の銅像や七卿の碑のほか、中原中也の詩碑と種田山頭火の句碑があります。湯田温泉のあたりで昼食にしましょう。" }) },
    { create: mk({ name: "瑠璃光寺五重塔・香山公園", h: 13, m: 40, stay: 75, mode: "bus", min: 45, line: "路線バス", lat: 34.190176, lng: 131.47292, address: "山口県山口市香山町7-1",
      memo: "湯田温泉から路線バスで県庁前のあたりへ出て、香山公園の瑠璃光寺五重塔へ（バスの時刻は前もって確かめましょう）。五重塔は1442年、大内義弘を弔うために建てられた国宝で、大内文化の最高傑作と評され、日本三名塔の一つとされます。公園には、西郷隆盛・大久保利通と木戸孝允らが集った建物を再現した枕流亭や、藩主・毛利敬親が茶事にことよせて身分に関係なく会談をしたという茶室・露山堂、幕末の毛利家歴代の墓所もあります。" + RESPECT }) },
    { create: mk({ name: "龍福寺（大内氏館跡）", h: 15, m: 15, stay: 40, mode: "walk", min: 20, lat: 34.184406, lng: 131.47982, address: "山口県山口市大殿大路119",
      memo: "香山公園から、室町時代の町割りが今も残る竪小路を歩き、京都の鴨川に見立てられた一の坂川のそばを通って、大内氏の館の跡に建つ龍福寺へ。建永元年（1206年）に大内満盛が創建したと伝えられる寺で、弘治3年（1557年）に毛利隆元が、大内義隆の菩提寺として館の跡に再興しました。今の本堂は、大内氏の氏寺だった興隆寺の本堂を移したもので、国の重要文化財です。" + RESPECT }) },
    { create: mk({ name: "十朋亭維新館", h: 16, m: 0, stay: 30, mode: "walk", min: 5, lat: 34.182654, lng: 131.47983, address: "山口県山口市下竪小路112",
      memo: "龍福寺から歩いてすぐの十朋亭維新館へ。「明治維新策源の地 山口」の歴史にふれるミュージアムで、醤油の商いをしていた萬代家の十朋亭（市指定有形文化財）などを山口市が譲り受け、2018年に開館しました。幕末、萬代家は藩の役人たちの宿となり、桂小五郎や高杉晋作など多くの志士が訪れたと伝えられています。休館日は公式の案内で確かめましょう。山口が育んだ詩人と歴史をたどる旅を、ここで締めくくりましょう。帰りは、JR山口駅まで歩いて戻ります。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 其中庵 9:20 →（JR）中也記念館 10:40 → 井上公園（昼食）11:55 →（バス）瑠璃光寺 13:40 → 龍福寺 15:15 → 十朋亭 16:00〜16:30");
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
