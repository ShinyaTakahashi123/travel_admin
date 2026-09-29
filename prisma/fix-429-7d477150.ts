/**
 * チェックリスト #429 7d477150「熊野本宮大社と大斎原、世界遺産・熊野古道の聖地を巡る日帰りプラン」の見直し（しおりえ(制作補助2)）
 * （本宮大社前から路線バス）発心門王子（新規）→（熊野古道・中辺路）伏拝王子（新規）→ 熊野本宮大社 →（昼食）→ 大斎原 →（バス）湯の峰温泉（新規）（5か所 09:00〜16:30）
 * タイトルの「熊野古道」に合わせ、熊野古道一の人気コースとされる発心門王子〜熊野本宮大社（約7km・約3時間、田辺市熊野ツーリズムビューロー）を歩く行程にする
 * 既存の2か所はIDのまま、本文を公式で確かめて書き直す（前の本文は「皆様、…」の話し言葉）:
 *   - 大斎原の大鳥居「日本一の規模」、本宮大社の「甦りの地」は開いた公式で確かめられないので外す
 * 写真: 熊野本宮大社の写真は合っているので残す（大斎原は写真なし）
 * 本文の出典: 熊野本宮大社 https://www.hongutaisha.jp/about ・八咫烏 https://www.hongutaisha.jp/2015/04/21/%e5%85%ab%e5%92%ab%e7%83%8f%e3%81%ab%e3%81%a4%e3%81%84%e3%81%a6/ ／
 *   熊野本宮観光協会 熊野本宮大社 https://www.hongu.jp/kumanokodo/hongu-taisya/ ・大斎原 https://www.hongu.jp/kumanokodo/hongu-taisya/ooyunohara/ ・
 *   熊野古道ウォークコース https://www.hongu.jp/kumanokodo/walk/ ・参詣道ルール https://www.hongu.jp/kumanokodo/sankeimichi-rule/ ・湯の峰温泉 https://www.hongu.jp/onsen/yunomine/ ／
 *   田辺市熊野ツーリズムビューロー おすすめコース https://www.tb-kumano.jp/kumano-kodo/suggested-walks/
 * 座標の出典: Nominatim（発心門王子のバス停 33.8617469,135.7206005／伏拝王子 33.8602049,135.7568176／熊野本宮大社 33.8403512,135.7736333／
 *   大斎原 33.8346547,135.7744110／湯の峰温泉 33.8286995,135.7575631）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-429-7d477150.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "7d477150-6dba-472c-8a1f-7ef6c5812428";
const DAY1_ID = "cc79ad7b-39bf-4e90-8d27-fe441d9c47e2";
const HONGU = "c8cc33e6-cef1-4616-b432-c99f86317edf";
const OOYUNOHARA = "7a8987c9-7daf-44a8-bd25-8fd6338cbfbd";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "熊野本宮大社の神域の入口とされる発心門王子から、熊野古道・中辺路を約7km歩いて熊野本宮大社へ。旧社地・大斎原の大鳥居を訪ね、最後は熊野詣の湯垢離場だった湯の峰温泉へ。熊野信仰の聖地を、歩いてめぐる日帰りプランです。";

const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const upd = (id: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, memo: string) => ({
  id,
  data: { visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, memo },
});
const cre = (name: string, h: number, m: number, stay: number, mode: string | null, dur: number | null, lat: number, lng: number, address: string, memo: string) => ({
  create: { name, visitTime: t(h, m), stayDurationMin: stay, transitMode: mode, transitDurationMin: dur, transitLine: null, lat, lng, address, memo },
});

const order = [
  cre("発心門王子", 9, 0, 15, null, null, 33.861747, 135.720601, "和歌山県田辺市本宮町",
    "熊野本宮大社前から路線バスで発心門王子へ向かい、ここから熊野古道を歩きます。発心門王子は、熊野本宮大社の神域の入口とされる場所です。発心門王子から熊野本宮大社までは約7km、歩いて約3時間の道のりで、美しい山里の集落と、石畳も残る上り下りの緩やかな古道を交互に歩く、熊野古道でいちばん人気のコースとされています。歩きやすい靴と飲み物を用意し、天候や体調を考えて、無理をせずに歩きましょう。道からはずれない、動植物をとらないなど、紀伊山地の参詣道のルールを守って歩きましょう。" + RESPECT),
  cre("伏拝王子", 10, 45, 15, "walk", 90, 33.860205, 135.756818, "和歌山県田辺市本宮町伏拝",
    "発心門王子から古道を歩いて伏拝王子へ。多くの参詣者が歩いたとされる中辺路で、難行苦行の道のりの末に、初めて熊野本宮大社を望む場所です。「伏拝王子」の名は、やっとたどり着いた熊野本宮大社を、伏して拝んだことに由来すると伝えられています。" + RESPECT),
  upd(HONGU, 12, 30, 50, "walk", 90, 33.840351, 135.773633,
    "伏拝王子から古道を歩いて、熊野本宮大社へ。熊野三山（本宮・速玉・那智の各大社）の中心で、全国に4700社以上ある熊野神社の総本宮です。社殿は崇神天皇65年（紀元前33年）に旧社地の大斎原に創建されたと、古い記録に記されています。明治22年（1889年）の水害で社殿の多くが流出し、流出を免れた上四社3棟を、明治24年（1891年）に今の場所に移しました。社殿は平成7年（1995年）に国の重要文化財に指定されています。本殿へは158段の石段が続きます。神武天皇を大和の橿原まで導いたと伝わる八咫烏は導きの神として信仰され、日本サッカー協会のマークにもなっています。" + RESPECT + "このあと、大社の近くで昼食にしましょう。"),
  upd(OOYUNOHARA, 14, 20, 40, "walk", 10, 33.834655, 135.774411,
    "熊野本宮大社から500mほど離れた旧社地・大斎原へ。熊野川・音無川・岩田川の合流点にある中洲で、明治22年（1889年）の大水害まで、約1万1千坪の境内に五棟十二社の社殿や楼門、神楽殿、能舞台などが並び、今の数倍の規模だったといわれます。江戸時代まで中洲へ渡る橋はなく、人々は歩いて川を渡り、音無川の冷たい水で最後の水垢離をして身を清めてから詣でたそうです。今は、流失した中四社・下四社をまつる石造の小祠が建っています。入口には、高さ約34m、幅約42mの大鳥居が立っています。" + RESPECT),
  cre("湯の峰温泉", 15, 20, 70, "bus", 20, 33.8287, 135.757563, "和歌山県田辺市本宮町湯峯",
    "本宮からバスで湯の峰温泉へ。4世紀ごろに熊野の国造・大阿刀足尼（おおあとのすくね）によって発見されたと伝わり、のちに歴代の上皇の熊野御幸で広く知られるようになった温泉で、日本最古の湯ともいわれます。熊野詣の人々は、ここで湯垢離を行って身を清め、旅の疲れをいやしました。日によって7回も湯の色が変わるといわれる岩風呂「つぼ湯」は、参詣道の一部として世界遺産に登録されています。川沿いの湯筒では、湧き出る温泉で卵や野菜をゆでることもできます。湯筒のお湯はとても熱いので、やけどに気をつけましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。"),
];

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, status: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  console.log(`対象: ${it.title} [${it.status}]`);
  if (days.length !== 1 || days[0].id !== DAY1_ID || days[0].spots.map((s) => s.id).join() !== [HONGU, OOYUNOHARA].join()) throw new Error("構成が想定と違います");
  const names: Record<string, string> = Object.fromEntries(days[0].spots.map((s) => [s.id, s.name]));

  console.log(`説明文: ${DESCRIPTION}`);
  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of order) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date;
    const st = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(st)}-${hm(st + (d.stayDurationMin as number))} ${d.transitMode ?? "-"}/${d.transitDurationMin ?? "-"}${prevEnd < 0 ? "" : ` (間${st - prevEnd}分)`} ${"id" in x ? names[x.id] + "(既存)" : d.name} ${String(d.memo).length}字`);
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
