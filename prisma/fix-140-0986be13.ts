/**
 * #140 0986be13の直し。もとは銀山温泉街・白銀の滝の2か所(10:00〜12:00)
 * のみで4か所未満、終始案内役の話し方。
 * 既存の371e874b(共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり
 * 1泊2日)が、白銀公園(=白銀の滝)・延沢銀山遺跡・和楽足湯・
 * 十分一番所跡・徳良湖・しろがね湯を使用済みのため、同じ場所を使う
 * 和楽足湯・延沢銀山遺跡・十分一番所跡は、371e874bとは別の事実・
 * 切り口で執筆(371e874b=旅館の窓明かりを眺める足湯/康正年間開坑・
 * 人口20〜30万人の伝承、本案=無料・源泉そのままの湯温/延澤満定・
 * 寛永11年の幕府直轄化・人口1.5万人という tabi-mag.jp/yg0021/ で
 * 確認した史実)。4か所を追加し5か所に。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MACHI_MEMO =
  "銀山温泉街に着きます。江戸時代初期に栄えた延沢銀山の名前にちなんで名付けられたこの温泉地には、大正から昭和初期にかけて建てられた、洋風の意匠を取り入れた木造多層の旅館が、銀山川の両岸に軒を連ねています。窓辺の手すりや外壁の装飾には、当時の職人たちのこだわりが今も息づいており、まるで大正時代にタイムスリップしたかのような、ノスタルジックな町並みが広がります。カメラを片手に、レトロな旅館の建ち並ぶ通りをゆっくりと歩いて楽しみましょう。冬の夕方以降は、混雑を防ぐため、日帰りの人の立ち入りが予約制になる時期があります。お出かけ前に、尾花沢市や銀山温泉の公式の案内で確かめましょう。この後は、歩いてすぐ、和楽足湯へ向かいましょう。";

const ASHIYU_MEMO =
  "銀山温泉街から歩いてすぐ、和楽足湯に着きます。温泉街の入り口、銀山川のほとりにある無料の足湯です。源泉をそのまま使っているので、少し熱めのお湯です。歩き疲れた足を、ここでひと休みさせましょう。この後は、歩いておよそ4分、白銀の滝へ向かいましょう。";

const TAKI_MEMO =
  "和楽足湯から歩いておよそ4分、白銀の滝に着きます。川の上流にある落差22メートルの滝で、大小2筋の水流が織りなす、迫力ある姿が魅力です。この一帯はかつて延沢銀山として栄えた鉱山の里で、大正期には滝の水力を利用した発電も行われていたと伝えられています。足元が滑りやすいところもあるので、気をつけて歩きましょう。このあたりには食事処もあるので、昼食をとりましょう。木造多層の旅館街とはまた違う、鉱山とともに歩んできた銀山温泉のもうひとつの表情を感じてみましょう。この後は、歩いておよそ2分、延沢銀山遺跡へ向かいましょう。";

const GINZAN_MEMO =
  "白銀の滝から歩いておよそ2分、延沢銀山遺跡に着きます。国の史跡に指定されている鉱山跡です。戦国時代末期、この地を治めた延沢城主・延澤満定が開発したと考えられており、寛永11年(1634)には江戸幕府の直轄となりました。寛永8年(1631)ごろから翌年にかけてが最盛期で、銀山町の人口はおよそ1万5千人を数えるほどにぎわいましたが、元禄2年(1689)の大崩落により、坑道に水が入り込み、閉山に至りました。温泉街の奥に残る坑口は、今も見学することができます。足元に気をつけながら、銀山温泉という地名の由来となった鉱山の歴史を、じかに感じてみましょう。この後は、歩いておよそ20分、十分一番所跡へ向かいましょう。";

const JUUBU_MEMO =
  "延沢銀山遺跡から歩いておよそ20分、十分一番所跡に着きます。江戸時代、延沢方面へ向かう荷物には、ここで品物の価格の十分の一が税として課せられていたと伝えられている、銀山温泉の入り口にあたる史跡です。今はさら地になっていますが、温泉街の歴史を物語る場所です。静かに見学しましょう。見学を終えたら、歩いて銀山温泉街へ戻り、帰りのバスや車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0986be13%'`);
  const itinId = rows[0].id;
  const machi = await findSpotInItinerary(itinId, { spotName: "銀山温泉街" });
  const taki = await findSpotInItinerary(itinId, { spotName: "白銀の滝" });

  console.log("dayId:", machi.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1: SpotOrderItem[] = [
    { id: machi.id, data: { visitTime: t(9, 0), stayDurationMin: 155, memo: MACHI_MEMO } },
    {
      create: {
        name: "和楽足湯", lat: 38.57007, lng: 140.53049, visitTime: t(11, 36), stayDurationMin: 40, memo: ASHIYU_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
      },
    },
    {
      id: taki.id,
      data: {
        visitTime: t(12, 20), stayDurationMin: 80, memo: TAKI_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      create: {
        name: "延沢銀山遺跡", lat: 38.5674, lng: 140.5328, visitTime: t(13, 42), stayDurationMin: 80, memo: GINZAN_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      create: {
        name: "十分一番所跡", lat: 38.57558, lng: 140.51602, visitTime: t(15, 22), stayDurationMin: 70, memo: JUUBU_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
      },
    },
  ];
  await setDaySpotOrder(machi.dayId, day1);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
