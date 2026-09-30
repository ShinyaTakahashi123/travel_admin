/**
 * #488 7d685f8a（唐津 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 3か所 09:30〜13:10（唐津城 →（車）虹の松原 →（車）旧唐津銀行本店）で、昼食の一言がなく、「日本三大松原の中では唯一」などの言い切りがあった
 *   電車と歩き。朝に筑肥線で虹の松原、唐津へ戻って唐津神社・旧唐津銀行本店、駅前で昼食、旧高取邸・旧大島邸を通って、唐津城で締めくくる（唐津駅は乗り換え・昼食の拠点として通る）
 *   曳山展示場は建て替えのため仮の場所で開館中（新しい展示場は2027年春の予定）で、場所が変わるので入れない
 *   虹の松原 8:55〜10:00（唐津 8:41→虹ノ松原）→（虹ノ松原 10:03→唐津、歩き15分、計30分）唐津神社（新規）10:30〜10:55 →（歩き10分）旧唐津銀行本店 11:05〜11:50
 *   →（歩き10分）唐津駅前（新規・昼食）12:00〜13:00 →（歩き15分）旧高取邸（新規）13:15〜14:15 →（歩き5分）旧大島邸（新規）14:20〜15:05 →（歩き15分）唐津城 15:20〜16:30
 *   電車: Yahoo!路線情報 https://transit.yahoo.co.jp/timetable/28378/2480 （唐津 8:41）・ https://transit.yahoo.co.jp/timetable/28407/2481 （虹ノ松原 10:03）、平日
 *   閉まる時刻: 唐津城 9:00〜17:00（入館16:40まで）、旧唐津銀行 9:00〜18:00、旧高取邸 9:30〜17:00（月曜休館）、旧大島邸 9:00〜17:00（月曜休館）。本文に時刻・曜日・料金は書かない
 * 本文の出典: 唐津観光協会 https://www.karatsu-kankou.jp/spots/detail/1/ （虹の松原）・/spots/detail/189/ （唐津神社・駅から徒歩15分）・/sp/spots/detail/195/ （旧高取邸）・/sp/spots/detail/458/ （旧大島邸）・/spots/detail/181/ （唐津城・駅から20分）、
 *   唐津市 https://www.city.karatsu.lg.jp/page/3845.html （旧唐津銀行）・/page/3849.html （旧大島邸）・/page/1041.html （唐津城）
 * 座標の出典: OSM（虹ノ松原駅 node 7816772436（松原の入口の点として）／唐津神社 way 494797820／旧唐津銀行本店 way 494802389／唐津駅 node 778185118／旧高取家住宅 way 1161705831／旧大島邸 way 1161705837／唐津城 way 500427895）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-488-7d685f8a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7d685f8a-acdf-44e2-b17b-3e607bc41bb3";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "初代唐津藩主・寺沢広高が植えた虹の松原を朝に歩き、唐津くんちの唐津神社、辰野金吾が監修した旧唐津銀行本店へ。昼食のあと、炭鉱王の旧高取邸、唐津銀行を創った大島小太郎の旧大島邸を訪ね、「舞鶴城」とも呼ばれる唐津城で締めくくる、電車と歩きでめぐる唐津の日帰りプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["唐津城", "虹の松原", "旧唐津銀行本店"].join()) throw new Error("構成が想定と違います");
  const [castle, pines, bank] = day.spots;

  const order = [
    { id: pines.id, data: { visitTime: t(8, 55), stayDurationMin: 65, transitMode: null, transitDurationMin: null, transitLine: null, lat: 33.4410618, lng: 130.0162027, address: "佐賀県唐津市",
      memo: "この旅は電車と歩きでめぐります。JR唐津駅から筑肥線で虹ノ松原駅へ。駅を降りるとすぐ、虹の松原です。唐津藩の初代藩主・寺沢広高が、防風・防潮の林として植えたのが始まりで、唐津湾沿いに虹の弧のように、全長約4.5km、幅約500mにわたって続く松は、約100万本といわれます。三保の松原、気比の松原とともに日本三大松原のひとつとされ、国の特別名勝に指定されています。松原の中の道では、車や自転車に気をつけましょう。" } },
    { create: mk({ name: "唐津神社", h: 10, m: 30, stay: 25, mode: "train", min: 30, line: "JR筑肥線", lat: 33.4521798, lng: 129.96959, address: "佐賀県唐津市南城内3-13",
      memo: "虹ノ松原駅から電車で唐津駅へ戻り、歩いて約15分の唐津神社へ。奈良時代に建てられたと伝わる神社で、住吉三神と神田宗次公をまつります。天平勝宝7年（755年）に、領主の神田宗次が海辺で宝鏡を見つけたことから、「唐津大明神」の称号を賜ったと伝わります。11月の唐津くんちは、この神社の秋の例大祭で、14台の曳山が町を巡ります。" + RESPECT }) },
    { id: bank.id, data: { visitTime: t(11, 5), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 33.4487116, lng: 129.9711211, address: "佐賀県唐津市本町",
      memo: "神社から歩いて、旧唐津銀行本店へ。明治45年（1912年）に完成した銀行の本店で、工学博士・辰野金吾の監督のもと、その弟子にあたる清水組の田中実が設計しました。赤煉瓦に白い御影石をまぜ、屋根に小さな塔やドームを載せた、「辰野式」と呼ばれる意匠が特徴です。平成9年まで銀行として使われたのち唐津市に寄贈され、保存修理を経て平成23年から公開されています。" } },
    { create: mk({ name: "唐津駅前", h: 12, m: 0, stay: 60, mode: "walk", min: 10, lat: 33.4462729, lng: 129.9677507, address: "佐賀県唐津市",
      memo: "旧唐津銀行から歩いて唐津駅の方へ。駅の周りで昼食にしましょう。" }) },
    { create: mk({ name: "旧高取邸", h: 13, m: 15, stay: 60, mode: "walk", min: 15, lat: 33.4543357, lng: 129.97216, address: "佐賀県唐津市北城内5-40",
      memo: "駅から北へ歩いて、旧高取邸へ。杵島炭鉱の経営者として知られる高取伊好の、明治後期ごろに建てられた木造の邸宅で、国の重要文化財です。和風を基調としながら洋館も備え、邸内には能舞台もあります。杉戸絵や、七宝焼の引戸の金具、欄間の意匠も見どころです。休館日は公式の案内で確かめましょう。" }) },
    { create: mk({ name: "旧大島邸", h: 14, m: 20, stay: 45, mode: "walk", min: 5, lat: 33.45259, lng: 129.9707619, address: "佐賀県唐津市南城内4-23",
      memo: "高取邸から歩いてすぐの旧大島邸へ。明治18年に佐賀銀行の前身となる唐津銀行を創立するなど、唐津の近代化に尽くした大島小太郎の旧宅です。主屋は明治26年（1893年）ごろの完成と考えられ、もとは西に約300m離れた場所にありましたが、解体ののち、今の南城内に復元されました。休館日は公式の案内で確かめましょう。" }) },
    { id: castle.id, data: { visitTime: t(15, 20), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 33.4535132, lng: 129.9781934, address: "佐賀県唐津市東城内",
      memo: "旧大島邸から東へ歩いて、唐津城へ。豊臣秀吉の家臣・寺沢広高が、慶長7年（1602年）から7年をかけて築いた城で、東西に伸びる松原が、両翼を広げた鶴のように見えることから「舞鶴城」とも呼ばれます。築城のころは天守閣がなく、今の天守閣は昭和41年（1966年）に文化観光施設として建てられたもので、中は唐津藩の資料や唐津焼などを展示する郷土博物館です。展望所からは、玄界灘と虹の松原、松浦川と城下町の眺めが楽しめます。石段では足元に気をつけましょう。松原と城下町をめぐる唐津の旅を、ここで締めくくりましょう。帰りは、歩いて約20分の唐津駅から。" } },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 虹の松原 8:55 →（電車）唐津神社 10:30 → 旧唐津銀行 11:05 → 唐津駅前（昼食）12:00 → 旧高取邸 13:15 → 旧大島邸 14:20 → 唐津城 15:20〜16:30");
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
