/**
 * #474 91dbe03a（阿蘇 日帰り）の見直し（しおりえ(制作補助2)、docs/specs/20260929-itinerary-4spots-9to16.md: 1日4か所以上・9時〜16:30）
 * もとは 1か所（大観峰 09:30〜10:30）で、本文はガイドの語り口だった
 *   阿蘇は路線バスが少なく、大観峰へのバスは土日祝だけなので、JR阿蘇駅前でレンタカーを借りてめぐる。阿蘇神社と門前町で昼食、午後は阿蘇山の草千里・火山博物館・米塚を通って駅へ戻る
 *   中岳火口は噴火警戒レベル2で火口から約1kmが立入規制中（2026年9月29日時点）なので入れない
 *   大観峰 9:10〜10:00 →（車25分）阿蘇神社（新規）10:25〜11:05 →（歩き3分）門前町商店街（新規・昼食）11:10〜12:20 →（車40分）草千里ヶ浜（新規）13:00〜14:00
 *   →（歩き5分）阿蘇火山博物館（新規）14:05〜14:55 →（車10分）米塚（新規）15:05〜15:25 →（車25分）道の駅阿蘇（新規）15:50〜16:30
 *   閉まる時刻: 阿蘇火山博物館 9:00〜17:00（入館16:30まで）、道の駅阿蘇 9:00〜18:00。本文に時刻・曜日は書かない
 * 本文の出典: 熊本県観光サイト https://kumamoto.guide/spots/detail/211 （大観峰・JR阿蘇駅前から車で約30分）、阿蘇市観光協会 https://www.asocity-kanko.jp/spot/daikanbou/ 、
 *   阿蘇市 https://www.city.aso.kumamoto.jp/education/cultural-property/list_of_cultural_property/asoshrine/ ・/list_of_cultural_property/komekusa/ 、道の駅阿蘇 https://www.aso-denku.jp/asokanko/monzenmachi/ 、
 *   阿蘇火山博物館 https://asomuse.jp/guide/ 、火口の規制 https://www.city.aso.kumamoto.jp/disaster/disaster/volcano_regulatory-information/
 * 座標の出典: OSM（大観峰展望所 way 477419441／阿蘇神社 way 412025724／阿蘇門前町商店街（門前仲町）way 1354414474／草千里展望台 node 1685739158／阿蘇火山博物館 way 244506566／米塚 node 2518325691／道の駅阿蘇 node 2276928200）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-474-91dbe03a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "91dbe03a-f372-4db4-92c6-c97ab9246310";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const DESCRIPTION = "阿蘇の北外輪山の大観峰から、カルデラと阿蘇五岳を一望。阿蘇神社にお参りして門前町で昼食をとり、午後は草千里ヶ浜と阿蘇火山博物館、米塚をめぐる、阿蘇の絶景と火山の日帰りドライブプランです。";

type C = { name: string; h: number; m: number; stay: number; mode: string | null; min: number | null; lat: number; lng: number; address: string; memo: string };
const mk = (c: C) => ({ name: c.name, visitTime: t(c.h, c.m), stayDurationMin: c.stay, transitMode: c.mode, transitDurationMin: c.min, transitLine: null, lat: c.lat, lng: c.lng, address: c.address, memo: c.memo });

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: { orderBy: { orderNo: "asc" } } } } } });
  if (it.days.length !== 1) throw new Error("日数が想定と違います");
  const day = it.days[0];
  if (day.spots.map((s) => s.name).join() !== "大観峰") throw new Error("構成が想定と違います");
  const daikanbo = day.spots[0];

  const order = [
    { id: daikanbo.id, data: { visitTime: t(9, 10), stayDurationMin: 50, transitMode: null, transitDurationMin: null, transitLine: null, lat: 32.995662, lng: 131.067095, address: "熊本県阿蘇市山田",
      memo: "この旅はレンタカーでめぐります。JR阿蘇駅前から車で約30分の大観峰へ。阿蘇の北外輪山にある標高約936mの展望所で、文豪・徳富蘇峰が名付けたといわれています。阿蘇のカルデラと阿蘇五岳、くじゅう連山までを360度見わたせ、阿蘇五岳の姿は横たわるお釈迦様に見えることから「涅槃像」と呼ばれます。秋から冬の朝には雲海が見られることもあります。展望所の柵の外には出ないようにしましょう。" } },
    { create: mk({ name: "阿蘇神社", h: 10, m: 25, stay: 40, mode: "car", min: 25, lat: 32.947708, lng: 131.116116, address: "熊本県阿蘇市",
      memo: "大観峰から外輪山を下りて、一の宮の阿蘇神社へ。阿蘇を開いた神・健磐龍命をはじめ十二の神をまつり、古くから肥後一の宮として崇敬されてきた神社です。社殿は天保6年（1835年）から嘉永3年（1850年）にかけて、肥後藩をあげて建てられたもので、楼門は九州最大の二重門といわれます。6棟の建物が国の重要文化財で、平成28年の熊本地震で被災しましたが、令和5年12月に楼門の復旧工事が終わりました。" + RESPECT }) },
    { create: mk({ name: "門前町商店街", h: 11, m: 10, stay: 70, mode: "walk", min: 3, lat: 32.949247, lng: 131.116757, address: "熊本県阿蘇市",
      memo: "阿蘇神社の参道のそばの門前町商店街へ。地元の工芸品や食べ物の店が並び、通りには「水基」と呼ばれる湧き水が置かれて、道行く人にふるまわれています。水基をめぐりながら歩き、このあたりで昼食にしましょう。" }) },
    { create: mk({ name: "草千里ヶ浜", h: 13, m: 0, stay: 60, mode: "car", min: 40, lat: 32.884969, lng: 131.050302, address: "熊本県阿蘇市",
      memo: "門前町から車で阿蘇山を上り、草千里ヶ浜へ。約3万年前の噴火でできた火口の跡で、直径約1kmの草原が広がります。米塚とあわせて、国の名勝と天然記念物に指定されています。草原の散策では、足元に気をつけましょう。" }) },
    { create: mk({ name: "阿蘇火山博物館", h: 14, m: 5, stay: 50, mode: "walk", min: 5, lat: 32.885529, lng: 131.052142, address: "熊本県阿蘇市赤水1930-1",
      memo: "草千里の前の阿蘇火山博物館へ。中岳の火口に置いたカメラの映像を生で見られるほか、火山のしくみを映像で紹介しています。見学のめやすは40〜50分です。中岳の火口は、火山の活動によって近づけないことがあるので、この旅では博物館から火口のようすを見ます。" }) },
    { create: mk({ name: "米塚", h: 15, m: 5, stay: 20, mode: "car", min: 10, lat: 32.905646, lng: 131.044407, address: "熊本県阿蘇市",
      memo: "阿蘇山を下る途中で、米塚をながめます。約3000年前にできた、頂上がすり鉢のようにくぼんだ円錐形の小さな火山で、阿蘇神社の神・健磐龍命が、収穫した米を積み上げてできたという神話が伝わります。車を止めるときは、道路のわきに止めず、決められた場所を使いましょう。" }) },
    { create: mk({ name: "道の駅阿蘇", h: 15, m: 50, stay: 40, mode: "car", min: 25, lat: 32.937012, lng: 131.080879, address: "熊本県阿蘇市黒川1440-1",
      memo: "山を下りて、JR阿蘇駅前の道の駅阿蘇へ。阿蘇のみやげをさがしたり、ひと休みしたりしましょう。阿蘇の絶景と火山をめぐる旅を、ここで締めくくりましょう。帰りは、レンタカーを返してJR阿蘇駅から。" }) },
  ];
  console.log(`説明文: ${DESCRIPTION}`);
  console.log("1日目: 大観峰 9:10 →（車）阿蘇神社 10:25 → 門前町（昼食）11:10 →（車）草千里 13:00 → 火山博物館 14:05 →（車）米塚 15:05 →（車）道の駅阿蘇 15:50〜16:30");
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
