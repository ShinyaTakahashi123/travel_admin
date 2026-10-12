/**
 * #66 1d0aa24f。企画運営の指摘(決まり8): 歩き・バスの旅なのに清津峡から急に
 * 「レンタカーなどで」美人林(25km先)へ向かう形になっていた。美人林を外し、
 * 清津峡からバスで越後湯沢へ戻ったあと、駅から徒歩圏の実在スポット・滝沢公園
 * (実在、湯沢町、不動滝と遊歩道のある公園、OSM way 471883690)を追加する。
 * 帰りの一言も「越後湯沢駅から」に修正。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KIYOTSU_MEMO =
  "山の湯からバスでおよそ25分、清津峡渓谷トンネルに着きます。清津峡は、黒部峡谷・大杉谷とあわせて日本三大峡谷の一つといわれる渓谷で、柱状節理の岩肌が切り立つ迫力ある景観で知られています。渓谷沿いの遊歩道が崩落したことをきっかけに、安全に渓谷美を楽しめるよう整備されたのが、このトンネルです。トンネルの奥にある見晴らし所からは、四角く切り取られた渓谷の景色を、まるで一枚の絵のように眺めることができます。大雪のときは臨時で休むことがあるほか、混雑時には事前予約が必要になることもあるので、訪れる前に公式サイトで確かめましょう。この後は、バスでおよそ25分、越後湯沢へ戻り、滝沢公園へ向かいましょう。";

const TAKIZAWA_MEMO =
  "清津峡渓谷トンネルからバスでおよそ25分、越後湯沢の温泉通りを抜けた先にある滝沢公園に着きます。園内には「不動滝」と呼ばれる滝があり、緑に囲まれた遊歩道を歩きながら、湯沢の中心街からほど近い場所とは思えない、静かな渓流の景色を楽しめます。木々に囲まれたベンチで一休みするのもおすすめです。ロープウェイからの絶景、名作の舞台となった温泉街、日本三大峡谷、そして町なかの滝まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。お帰りは、越後湯沢駅からご利用ください。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "1d0aa24f-a0e8-4319-b97b-86952764c785", dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "b5775660-0a09-4593-950c-cea944d2bbba", data: {} }, // 湯沢高原ロープウェイ
    { id: "ca0f640e-54de-486b-b7d2-bf429b61e3c3", data: {} }, // 雪国館
    { id: "8f1264a1-c2a1-4cc4-ac7a-7c3e4516b5a7", data: {} }, // 山の湯
    {
      id: "b6c01cba-1f1c-49bd-9324-0e753f4e68f8", // 清津峡渓谷トンネル
      data: { memo: KIYOTSU_MEMO },
    },
    {
      create: {
        name: "滝沢公園",
        address: "新潟県南魚沼郡湯沢町湯沢",
        lat: 36.9378482,
        lng: 138.8016649,
        memo: TAKIZAWA_MEMO,
        visitTime: t(15, 4),
        stayDurationMin: 90,
        transitMode: "bus",
        transitDurationMin: 25,
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
    await setDaySpotOrder(day1.id, day1Spots, { tx, remove: ["46b3d6f6-71e2-4be7-94fd-16be38ce621e"] });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
