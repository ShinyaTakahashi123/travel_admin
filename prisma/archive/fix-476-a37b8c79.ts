/**
 * #476 a37b8c79（奈良 御朱印 1泊2日）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30、最終日も16:30まで）
 * もとは 1日目 3か所 09:30〜14:10、2日目 2か所 09:30〜12:02。昼食の一言がなく、最上級の言い切りと結びの定型文が残っていた
 *   「御朱印をいただく」主旨なので社寺を中心に足す。1日目は奈良公園からならまち、2日目は西ノ京から平城宮跡と西大寺・秋篠寺へ（戻らない）
 *   1日目: 東大寺 9:10〜10:25 →（歩き10分）二月堂（新規）10:35〜11:00 →（歩き20分）春日大社 11:20〜12:10 →（歩き25分）ならまち（新規・昼食）12:35〜13:40
 *     →（歩き5分）元興寺（新規）13:45〜14:30 →（歩き15分）興福寺 14:45〜15:55 →（歩き5分）猿沢池（新規）16:00〜16:30。近鉄奈良駅のまわりに泊まる
 *   2日目: 薬師寺 9:10〜10:25 →（歩き10分）唐招提寺 10:35〜11:40 →（歩きと近鉄40分）朱雀門ひろば（新規・昼食）12:20〜13:20 →（歩き15分）第一次大極殿（新規）13:35〜14:25
 *     →（歩き20分）西大寺（新規）14:45〜15:30 →（歩きとバス20分）秋篠寺（新規）15:50〜16:30
 *   東大寺・春日大社・興福寺・薬師寺・唐招提寺の本文は、御朱印シリーズの中身を使い、書き出し・結び・言い切り・配慮の一文の形だけ直す
 *   閉まる時刻: 元興寺 9:00〜17:00（入館16:30まで）、第一次大極殿 9:00〜16:30（入館16:00まで・月曜休み）、西大寺 8:30〜16:30（受付16:00まで）、秋篠寺 9:30〜16:30。本文に時刻・曜日は書かない
 * 本文の出典: 東大寺 https://www.todaiji.or.jp/en/information/nigatsudo/ （二月堂）、文化遺産オンライン https://online.bunka.go.jp/heritages/detail/123264 、奈良市観光協会 https://narashikanko.or.jp/feature/naramachi ・/spot/detail_10110.html （猿沢池）・/spot/detail_10010.html （西大寺）・/spot/detail_10018.html （秋篠寺）、
 *   元興寺 https://gangoji-tera.or.jp/about/ 、駅探 https://ekitan.com/transit/route/sf-5212/st-5761 （近鉄奈良→西ノ京 約15分）、薬師寺 https://yakushiji.or.jp/access.html 、
 *   朱雀門ひろば https://www.suzakumon-heijokyo.com/ （大和西大寺駅から歩いて約20分・天平うまし館）、国営平城宮跡歴史公園 https://www.heijo-park.jp/tw/area/daigokuden/
 * 座標の出典: OSM（大仏殿 way 43558119／二月堂 way 354993353／春日大社 way 1134481286／ならまち格子の家 node 2447751651／元興寺 way 218642880／興福寺 way 1134439456／猿沢池 way 59465653／
 *   薬師寺 way 208682432／唐招提寺 way 218644927／天平うまし館 way 612418482／第一次大極殿 way 105145325／西大寺 way 211906944／秋篠寺 way 223321895）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-476-a37b8c79.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "a37b8c79-85e0-4c3d-b2c6-94057033f31a";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const OLD_RESPECT = "静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from.slice(0, 40)}`);
  return text.replace(from, to);
}

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 2) throw new Error("日数が想定と違います");
  const [d1, d2] = it.days;
  if (d1.spots.map((s) => s.name).join() !== ["東大寺", "春日大社", "興福寺"].join()) throw new Error("1日目が想定と違います");
  if (d2.spots.map((s) => s.name).join() !== ["薬師寺", "唐招提寺"].join()) throw new Error("2日目が想定と違います");
  const [todaiji, kasuga, kofukuji] = d1.spots;
  const [yakushiji, toshodaiji] = d2.spots;

  let todaijiMemo = rep(todaiji.memo ?? "", "JR・近鉄奈良駅からバスで約8分。", "この旅はバスと電車、歩きでめぐります。JR・近鉄奈良駅からバスで約8分の東大寺へ。");
  todaijiMemo = rep(todaijiMemo, "世界最大級の金銅仏で、", "世界最大級とされる金銅仏で、");
  todaijiMemo = rep(todaijiMemo, "それでも世界最大級の木造建築です。", "それでも世界最大級の木造建築とされます。");
  todaijiMemo = rep(todaijiMemo, OLD_RESPECT, RESPECT);
  let kasugaMemo = "二月堂から若草山のふもとを南へ歩いて、春日大社へ。" + (kasuga.memo ?? "");
  kasugaMemo = rep(kasugaMemo, OLD_RESPECT, RESPECT);
  let kofukujiMemo = "元興寺から北へ歩いて、興福寺へ。" + (kofukuji.memo ?? "");
  kofukujiMemo = rep(kofukujiMemo, "静かに、敬意をもってお参りください。今夜はこの近くの宿にご宿泊いただきます。", RESPECT);
  let yakushijiMemo = rep(yakushiji.memo ?? "", "近鉄西ノ京駅からすぐ。", "旅の2日目は、近鉄奈良駅から近鉄で大和西大寺駅へ出て乗りかえ、約15分の西ノ京駅へ。駅から歩いてすぐの薬師寺へ。");
  yakushijiMemo = rep(yakushijiMemo, "奈良時代から唯一現存する建物で国宝に指定されており、", "奈良時代から唯一残る建物とされ、国宝に指定されており、");
  yakushijiMemo = rep(yakushijiMemo, OLD_RESPECT, RESPECT);
  let toshodaijiMemo = "薬師寺から北へ歩いて、唐招提寺へ。" + (toshodaiji.memo ?? "");
  toshodaijiMemo = rep(toshodaijiMemo, "日本で初めて戒律を専門に学ぶ道場です。", "日本で初めての、戒律を専門に学ぶ道場とされます。");
  toshodaijiMemo = rep(toshodaijiMemo, "静かに、敬意をもってお参りください。東大寺と春日大社、薬師寺と唐招提寺をめぐり御朱印をいただく1泊2日をお楽しみいただけたことでしょう。", RESPECT);
  const description = rep(it.description ?? "", "唐招提寺をめぐり、奈良の社寺で御朱印をいただく1泊2日です。",
    "唐招提寺をめぐり、奈良の社寺で御朱印をいただく1泊2日です。二月堂や元興寺、平城宮跡の近くの西大寺・秋篠寺にも足をのばします。");

  const day1 = [
    { id: todaiji.id, data: { visitTime: t(9, 10), stayDurationMin: 75, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.689065, lng: 135.839873, memo: todaijiMemo } },
    { create: mk({ name: "東大寺 二月堂", h: 10, m: 35, stay: 25, mode: "walk", min: 10, lat: 34.689275, lng: 135.844268, address: "奈良県奈良市雑司町",
      memo: "大仏殿から東へ坂を上って、二月堂へ。毎年3月に行われる修二会（お水取り）の舞台となるお堂で、本尊は大小二体の十一面観音です。寛文7年（1667年）の修二会のさなかに焼け、2年後に再建された今のお堂は国宝です。石段では足元に気をつけましょう。" + RESPECT }) },
    { id: kasuga.id, data: { visitTime: t(11, 20), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 20, transitLine: null, lat: 34.680506, lng: 135.846075, memo: kasugaMemo } },
    { create: mk({ name: "ならまち", h: 12, m: 35, stay: 65, mode: "walk", min: 25, lat: 34.675024, lng: 135.830667, address: "奈良県奈良市",
      memo: "春日大社から西へ歩いて、ならまちへ。元興寺の境内だった土地に、江戸から明治のころの格子の町家が残る町で、家々の軒先には「身代わり申」と呼ばれる猿のお守りが下がっています。このあたりで昼食にしましょう。今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。" }) },
    { create: mk({ name: "元興寺", h: 13, m: 45, stay: 45, mode: "walk", min: 5, lat: 34.677632, lng: 135.831319, address: "奈良県奈良市",
      memo: "ならまちの中の元興寺へ。日本で最初の本格的な仏教寺院とされる飛鳥寺（法興寺）を起こりとし、718年の平城京への遷都にあわせて移されて、元興寺となりました。国宝の極楽堂と禅室の屋根には、飛鳥時代の瓦が今も使われていて、世界遺産「古都奈良の文化財」のひとつです。" + RESPECT }) },
    { id: kofukuji.id, data: { visitTime: t(14, 45), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 34.682974, lng: 135.831865, memo: kofukujiMemo } },
    { create: mk({ name: "猿沢池", h: 16, m: 0, stay: 30, mode: "walk", min: 5, lat: 34.681436, lng: 135.830949, address: "奈良県奈良市橋本町",
      memo: "興福寺から南へ下りて、猿沢池へ。周囲360mの池で、天平21年（749年）に、興福寺の放生会のための池として造られました。興福寺の五重塔と柳が水面に映る景色は「南都八景」のひとつとして知られます（五重塔は今、修理中です）。池のそばでは足元に気をつけましょう。奈良の社寺をめぐる1日目を、ここで締めくくりましょう。今夜は近鉄奈良駅のまわりに泊まります。" }) },
  ];
  const day2 = [
    { id: yakushiji.id, data: { visitTime: t(9, 10), stayDurationMin: 75, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.668563, lng: 135.784563, memo: yakushijiMemo } },
    { id: toshodaiji.id, data: { visitTime: t(10, 35), stayDurationMin: 65, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 34.675737, lng: 135.785348, memo: toshodaijiMemo } },
    { create: mk({ name: "平城宮跡 朱雀門ひろば", h: 12, m: 20, stay: 60, mode: "train", min: 40, line: "近鉄", lat: 34.685313, lng: 135.793456, address: "奈良県奈良市二条大路南4-6-1",
      memo: "唐招提寺から西ノ京駅へ戻り、近鉄で大和西大寺駅へ。駅から歩いて約20分の、平城宮跡の朱雀門ひろばへ。奈良時代に朱雀門の前にあった広場を再現した場所で、平城宮跡を紹介する平城宮いざない館や、食事と買い物ができる天平うまし館があります。このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "平城宮跡 第一次大極殿", h: 13, m: 35, stay: 50, mode: "walk", min: 15, lat: 34.693933, lng: 135.794242, address: "奈良県奈良市二条町",
      memo: "朱雀門から平城宮跡を北へ歩いて、復原された第一次大極殿へ。平城宮でいちばん大きな宮殿で、国の最も大切な儀式に使われたとされる建物です。休みの日は公式の案内で確かめましょう。広い平城宮跡では、日差しや足元に気をつけましょう。" }) },
    { create: mk({ name: "西大寺", h: 14, m: 45, stay: 45, mode: "walk", min: 20, lat: 34.693006, lng: 135.779879, address: "奈良県奈良市",
      memo: "平城宮跡から西へ歩いて、西大寺へ。称徳天皇の勅願で天平神護元年（765年）に創建された寺で、平安時代に衰えたのち、鎌倉時代に叡尊によって再興されました。今の本堂（重要文化財）や愛染堂などは、江戸時代中期に建てられたものです。叡尊が始めた大茶盛でも知られています。" + RESPECT }) },
    { create: mk({ name: "秋篠寺", h: 15, m: 50, stay: 40, mode: "bus", min: 20, line: "奈良交通バス", lat: 34.703633, lng: 135.776016, address: "奈良県奈良市秋篠町757",
      memo: "西大寺から大和西大寺駅の北口へ出て、押熊行きのバスで約6分の秋篠寺へ。奈良時代の末、780年ごろに光仁天皇の勅願で創建され、開山は善珠僧正と伝えられます。鎌倉時代に建て直された本堂には25体の仏像がまつられ、芸能の守り神とされる伎芸天（重要文化財）がよく知られています。" + RESPECT + "奈良の社寺をめぐる旅を、ここで締めくくりましょう。帰りは、バスで大和西大寺駅へ。" }) },
  ];
  console.log(`説明文: …${description.slice(90, 180)}`);
  console.log("1日目: 東大寺 9:10 → 二月堂 10:35 → 春日大社 11:20 → ならまち（昼食）12:35 → 元興寺 13:45 → 興福寺 14:45 → 猿沢池 16:00〜16:30（宿）");
  console.log("2日目: 薬師寺 9:10 → 唐招提寺 10:35 →（近鉄）朱雀門ひろば（昼食）12:20 → 大極殿 13:35 → 西大寺 14:45 →（バス）秋篠寺 15:50〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(d1.id, day1 as any, { tx });
    await setDaySpotOrder(d2.id, day2 as any, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
