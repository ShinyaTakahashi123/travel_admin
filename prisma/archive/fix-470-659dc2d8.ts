/**
 * #470 659dc2d8（伊勢 御朱印 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 4か所 09:00〜14:30（外宮 →（バス）内宮 → 猿田彦神社 →（車）二見興玉神社）で、昼食の一言がなく、猿田彦神社→二見が車だった
 *   猿田彦神社を外宮と内宮の間に入れ（戻らない）、内宮のあとおはらい町で昼食、二見へは周遊バス（決まり8）。午後は御塩殿神社と河崎の町並みで16:30まで（決まり3）
 *   外宮 9:00〜10:00 →（バス10分）猿田彦神社 10:10〜10:50 →（歩き15分）内宮 11:05〜12:15 →（歩き5分）おはらい町・おかげ横丁（新規・昼食）12:20〜13:25
 *   →（周遊バスと歩き35分）二見興玉神社 14:00〜14:50 →（歩き25分）御塩殿神社（新規）15:15〜15:35 →（歩きとJR参宮線45分）伊勢河崎商人館（新規）16:20〜16:55
 *   賓日館は2026年3月から長期休館のため入れない。本文に時刻・曜日は書かない
 *   外宮・内宮・猿田彦神社・二見興玉神社の本文は、書き出し・結びと配慮の一文だけを直し、中身はそのまま使う
 * 本文の出典: 猿田彦神社 https://www.sarutahikojinja.or.jp/ （三重交通バス 猿田彦神社前）、伊勢志摩観光ナビ https://www.iseshima-kanko.jp/feature/isezingu_%20gourmet_souvenir （おはらい町・おかげ横丁）・/spot/1234 （御塩殿神社）・/spot/1257 （伊勢河崎商人館）、
 *   三重交通 https://www.sanco.co.jp/shuttle/shuttle03-01/post-9/ （CANばす 内宮前・夫婦岩東口）、伊勢市 https://www.city.ise.mie.jp/cul_spo_edu/culture/shisetsu/syouninkan/index.html
 * 座標の出典: OSM（伊勢神宮 外宮 way 688114973／猿田彦神社 way 688373744／伊勢神宮 内宮 way 555110597／おかげ横丁 way 115254673／二見興玉神社 relation 9591959／伊勢河崎商人館 node 2028461919）、
 *   御塩殿神社は OSM に点がないので地理院の住所検索（二見町荘2019番地）34.510246,136.770813
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-470-659dc2d8.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "659dc2d8-336e-4031-9439-ba48d93e9e08";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from.slice(0, 30)}`);
  return text.replace(from, to);
}

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; line?: string | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: c.line ?? null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== ["伊勢神宮 外宮（豊受大神宮）", "伊勢神宮 内宮（皇大神宮）", "猿田彦神社", "二見興玉神社"].join()) throw new Error("構成が想定と違います");
  const [geku, naiku, saruta, futami] = day.spots;

  const description = rep(it.description ?? "", "二見興玉神社をめぐり、伊勢の社寺で御朱印をいただく日帰りプランです。", "二見興玉神社をめぐって伊勢の社寺で御朱印をいただき、おはらい町での昼食や御塩殿神社、河崎の蔵の町並みも楽しむ日帰りプランです。");
  const gekuMemo = rep(geku.memo ?? "", "静かに、敬意をもってお参りください。", RESPECT);
  let sarutaMemo = "外宮前から三重交通バスで猿田彦神社前へ。" + (saruta.memo ?? "");
  sarutaMemo = rep(sarutaMemo, "静かに、敬意をもってお参りください。", RESPECT);
  let naikuMemo = "猿田彦神社から歩いて、宇治橋を渡って内宮へ。" + (naiku.memo ?? "");
  naikuMemo = rep(naikuMemo, "静かに、敬意をもってお参りください。", RESPECT);
  let futamiMemo = "内宮前から周遊バスで夫婦岩東口へ出て、二見興玉神社へ。" + (futami.memo ?? "");
  futamiMemo = rep(futamiMemo, "この故事にならい、先に二見興玉神社から回ってから外宮・内宮へ向かう順にしてもかまいません。", "");
  futamiMemo = rep(futamiMemo, "静かに、敬意をもってお参りください。伊勢神宮の外宮・内宮と猿田彦神社、二見興玉神社をめぐり御朱印をいただく日帰りプランをお楽しみいただけたことでしょう。", RESPECT + "海辺では足元や波に気をつけましょう。");

  const order = [
    { id: geku.id, data: { visitTime: t(9, 0), stayDurationMin: 60, transitMode: null, transitDurationMin: null, transitLine: null, lat: 34.487352, lng: 136.703698, memo: gekuMemo } },
    { id: saruta.id, data: { visitTime: t(10, 10), stayDurationMin: 40, transitMode: "bus", transitDurationMin: 10, transitLine: "三重交通バス", lat: 34.467359, lng: 136.720204, memo: sarutaMemo } },
    { id: naiku.id, data: { visitTime: t(11, 5), stayDurationMin: 70, transitMode: "walk", transitDurationMin: 15, transitLine: null, lat: 34.45689, lng: 136.722978, memo: naikuMemo } },
    { create: mk({ name: "おはらい町・おかげ横丁", h: 12, m: 20, stay: 65, mode: "walk", min: 5, lat: 34.462449, lng: 136.722912, address: "三重県伊勢市宇治中之切町",
      memo: "宇治橋を戻って、内宮の鳥居前町のおはらい町へ。宇治橋の近くから約800m続く石畳の参道で、切妻・入母屋・妻入りの建物が軒を連ねます。その中ほどのおかげ横丁は1993年に開かれ、移築・再現された約50軒の店が並びます。このあたりで昼食にしましょう。" }) },
    { id: futami.id, data: { visitTime: t(14, 0), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 35, transitLine: "伊勢二見鳥羽周遊バス", lat: 34.508343, lng: 136.788801, memo: futamiMemo } },
    { create: mk({ name: "御塩殿神社", h: 15, m: 15, stay: 20, mode: "walk", min: 25, lat: 34.510246, lng: 136.770813, address: "三重県伊勢市二見町荘",
      memo: "二見浦の海沿いを西へ歩いて、御塩殿神社へ。伊勢神宮に奉納する塩「堅塩」を、古来より変わらない方法で作り続けている社で、境内には御塩を作る施設があり、神社の塩田「御塩浜」から運ばれた鹹水を煮詰めて、古式にのっとって御塩が作られています。" + RESPECT }) },
    { create: mk({ name: "伊勢河崎商人館", h: 16, m: 20, stay: 35, mode: "train", min: 45, line: "JR参宮線", lat: 34.496939, lng: 136.717526, address: "三重県伊勢市河崎2丁目25-32",
      memo: "二見浦駅からJR参宮線で伊勢市駅へ戻り、歩いて河崎の伊勢河崎商人館へ。江戸時代から伊勢と伊勢を訪れる人々の暮らしをまかなった問屋街の、代表的な商家を修復した施設で、勢田川に面した蔵が並び、伊勢と河崎の歴史と文化を展示しています。対岸から見る蔵の町並みも見ごたえがあります。休館日は公式の案内で確かめましょう。伊勢の社と町をめぐる旅を、ここで締めくくりましょう。帰りは、伊勢市駅まで歩いて戻ります。" }) },
  ];
  console.log(`説明文: ${description}`);
  console.log(`猿田彦: ${sarutaMemo.slice(0, 60)}…`);
  console.log(`二見: …${futamiMemo.slice(-120)}`);
  console.log("1日目: 外宮 9:00 →（バス）猿田彦 10:10 → 内宮 11:05 → おはらい町（昼食）12:20 →（周遊バス）二見 14:00 → 御塩殿 15:15 →（JR）河崎商人館 16:20〜16:55");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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
