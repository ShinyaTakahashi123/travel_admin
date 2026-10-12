/**
 * #417 4d4d7a06 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 16:30〜17:00まで・最終日も、宿・昼食・帰りの一言）
 * 1日目: …熱乃湯 → 白根神社 →（歩き10分）地蔵の湯（新規）16:00〜16:30（宿の一言）
 * 2日目（車）: 光泉寺 → 温泉図書館 → 嫗仙の滝 → ベルツ記念館（昼食の一言）→（車35分）やんば見放台（新規）→（車10分）やんば天明泥流ミュージアム（新規）（6か所 09:00〜16:30）
 *   ミュージアムは 9:00〜16:30（入館16:00まで）・水曜休館（長野原町）。15:15着で間に合う。本文に時刻・曜日は書かない
 *   長野原草津口駅の方へ向かう帰り道に寄る形
 * 本文の出典: 草津温泉観光協会 https://www.kusatsu-onsen.ne.jp/kankou/1099.php （地蔵の湯）、長野原町観光情報 https://naganohara.com/tourist/tourist-423/ （やんば見放台）・
 *   https://naganohara.com/tourist/tourist-901/ （やんば天明泥流ミュージアム）
 * 座標の出典: OSM（地蔵の湯 node 13665325547 36.622754,138.598369／やんば見放台 node 13185796888 36.5571597,138.7107434／やんば天明泥流ミュージアム node 13531172941 36.5438271,138.6798238）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-417b-4d4d7a06.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4d4d7a06-3c87-44a4-93cc-0c9fc0905ac6";
const DAY1_ID = "f3f3ba41-0906-4dd3-954b-5558c0fd85ea";
const DAY2_ID = "0ef7124a-a0cf-4843-882f-a0ad8fb7c275";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("構成が想定と違います");
  const d1 = days[0].spots, d2 = days[1].spots;
  if (d1[d1.length - 1].name !== "白根神社" || d2.map((s) => s.name).join() !== ["草津山光泉寺", "草津町温泉図書館", "嫗仙の滝", "草津ベルツ記念館"].join()) throw new Error("構成が想定と違います");
  const bel = d2[3];
  const belMemo = rep(bel.memo ?? "", "「草津の恩人」として今も町民に尊敬されています。", "「草津の恩人」として今も町民に尊敬されています。このあと、温泉街で昼食にしましょう。");
  const description = rep(it.description ?? "", "「草津の恩人」ベルツ博士の記念館へ。", "「草津の恩人」ベルツ博士の記念館を訪ね、帰り道に八ッ場ダムを望むやんば見放台と、やんば天明泥流ミュージアムに立ち寄ります。");

  const day1 = [
    ...d1.map((s) => ({ id: s.id, data: {} })),
    { create: { name: "地蔵の湯", visitTime: t(16, 0), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 36.622754, lng: 138.598369, address: "群馬県吾妻郡草津町草津",
      memo: "白根神社から温泉街を歩いて、地蔵の湯へ。地蔵源泉のやや白濁したお湯の共同浴場で、前の広場には足湯や顔湯、手洗乃湯もあります。共同湯は地元の人の生活のために設けられ、地元の人たちが管理しているお風呂なので、マナーを守って利用しましょう。" + BATH + "今夜は草津温泉に泊まります。" } },
  ];
  const day2 = [
    ...d2.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: bel.id, data: { memo: belMemo } },
    { create: { name: "やんば見放台", visitTime: t(14, 25), stayDurationMin: 40, transitMode: "car", transitDurationMin: 35, transitLine: null, lat: 36.55716, lng: 138.710743, address: "群馬県吾妻郡長野原町川原畑",
      memo: "昼食のあとは、車で長野原町の八ッ場ダムの方へ。やんば見放台は、ダムの左岸の少し高い丘から、ダムの堤体やダム湖を見下ろせる展望台です。自然と調和した八ッ場ダムの堤体や、ダムによって生まれた八ッ場あがつま湖、湖に架かる八ッ場大橋などが一度に見渡せます。" } },
    { create: { name: "やんば天明泥流ミュージアム", visitTime: t(15, 15), stayDurationMin: 75, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 36.543827, lng: 138.679824, address: "群馬県吾妻郡長野原町林1464-3",
      memo: "見放台から車で、やんば天明泥流ミュージアムへ。1783年（天明3年）の浅間山の大噴火と、それによって八ッ場を襲った「天明泥流」の脅威、当時の人々の暮らしを伝えるミュージアムです。ダム建設に伴う発掘調査で見つかった家屋や畑の遺物、生活道具などが数多く展示され、「天明泥流体感シアター」では、噴火から泥流が村を飲み込むまでを体感できます。休館日は公式の案内で確かめましょう。草津の自然と温泉街、八ッ場の歴史をめぐる旅を、ここで締めくくりましょう。帰りは、レンタカーを返す場所まで安全運転で。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`ベルツ: …${belMemo.slice(-40)}`);
  console.log("1日目: …白根神社 15:15〜15:50 →（歩き10分）地蔵の湯 16:00〜16:30");
  console.log("2日目: …ベルツ記念館 12:20〜13:00 →（昼食）→（車35分）やんば見放台 14:25〜15:05 →（車10分）ミュージアム 15:15〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(DAY1_ID, day1, { tx });
    await setDaySpotOrder(DAY2_ID, day2, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
