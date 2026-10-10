/**
 * #66 1d0aa24f。企画運営の指摘: 滝沢公園90分は美人林の90分をそのまま移した
 * 水増し(決まりA)。30〜40分に短縮し、空いた時間は実在の行き先(諏訪神社、
 * 実在、湯沢町大字湯沢、川端康成「雪国」にも登場。OSM に施設単体の点がなく、
 * GSI住所検索の地区レベルの点を使用)を追加して埋める。清津峡→越後湯沢のバスは
 * 南越後交通バスの公式時刻表で確認し、28分に修正。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KIYOTSU_MEMO =
  "山の湯からバスでおよそ25分、清津峡渓谷トンネルに着きます。清津峡は、黒部峡谷・大杉谷とあわせて日本三大峡谷の一つといわれる渓谷で、柱状節理の岩肌が切り立つ迫力ある景観で知られています。渓谷沿いの遊歩道が崩落したことをきっかけに、安全に渓谷美を楽しめるよう整備されたのが、このトンネルです。トンネルの奥にある見晴らし所からは、四角く切り取られた渓谷の景色を、まるで一枚の絵のように眺めることができます。大雪のときは臨時で休むことがあるほか、混雑時には事前予約が必要になることもあるので、訪れる前に公式サイトで確かめましょう。この後は、バスでおよそ28分、越後湯沢へ戻り、滝沢公園へ向かいましょう。";

const TAKIZAWA_MEMO =
  "清津峡渓谷トンネルからバスでおよそ28分、越後湯沢の温泉通りを抜けた先にある滝沢公園に着きます。園内には「不動滝」と呼ばれる滝があり、緑に囲まれた遊歩道を歩きながら、湯沢の中心街からほど近い場所とは思えない、静かな渓流の景色を楽しめます。木々に囲まれたベンチで一休みするのもおすすめです。この後は、歩いておよそ8分、諏訪神社へ向かいましょう。";

const SUWA_MEMO =
  "滝沢公園から歩いておよそ8分、諏訪神社に着きます。湯沢の温泉街に鎮座する古社で、川端康成の小説『雪国』の文中にも登場することで知られています。境内は静かで、湯沢の温泉街の歴史を今に伝えるたたずまいです。静かに、敬意をもってお参りください。参道の周辺には、古くからの温泉旅館や土産物店が並ぶ通りも続いており、雪国の物語の舞台となった町並みを、あわせてゆっくりと歩いてみてください。ロープウェイからの絶景、名作の舞台となった温泉街、迫力の峡谷、そして町なかの滝と神社まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。お帰りは、越後湯沢駅からご利用ください。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "1d0aa24f-a0e8-4319-b97b-86952764c785", dayNumber: 1 } });

  const takizawa = await prisma.spot.findFirstOrThrow({ where: { name: "滝沢公園", dayId: day1.id } });

  const day1Spots: SpotOrderItem[] = [
    { id: "b5775660-0a09-4593-950c-cea944d2bbba", data: {} }, // 湯沢高原ロープウェイ
    { id: "ca0f640e-54de-486b-b7d2-bf429b61e3c3", data: {} }, // 雪国館
    { id: "8f1264a1-c2a1-4cc4-ac7a-7c3e4516b5a7", data: {} }, // 山の湯
    {
      id: "b6c01cba-1f1c-49bd-9324-0e753f4e68f8", // 清津峡渓谷トンネル
      data: { memo: KIYOTSU_MEMO, transitDurationMin: 25 },
    },
    {
      id: takizawa.id,
      data: { memo: TAKIZAWA_MEMO, visitTime: t(15, 7), stayDurationMin: 40, transitDurationMin: 28 },
    },
    {
      create: {
        name: "諏訪神社",
        address: "新潟県南魚沼郡湯沢町湯沢",
        lat: 36.944065,
        lng: 138.795273,
        memo: SUWA_MEMO,
        visitTime: t(15, 55),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
