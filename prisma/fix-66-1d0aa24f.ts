/**
 * #66 1d0aa24f（湯沢高原ロープウェイ）ユーザー決定「全部直す」の対象(現状14:39)。
 * 滞在を延ばさず(決まりA)、実在スポットを追加。清津峡渓谷トンネルのあとに美人林
 * (実在、十日町市松之山、樹齢100年ほどのブナ林、OSM node 3585987425、入場無料)を
 * 追加。移動時間はOSRM実測(24.3km/25分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KIYOTSU_MEMO_TO_BIJIN =
  "山の湯からバスでおよそ25分、清津峡渓谷トンネルに着きます。清津峡は、黒部峡谷・大杉谷とあわせて日本三大峡谷の一つといわれる渓谷で、柱状節理の岩肌が切り立つ迫力ある景観で知られています。渓谷沿いの遊歩道が崩落したことをきっかけに、安全に渓谷美を楽しめるよう整備されたのが、このトンネルです。トンネルの奥にある見晴らし所からは、四角く切り取られた渓谷の景色を、まるで一枚の絵のように眺めることができます。大雪のときは臨時で休むことがあるほか、混雑時には事前予約が必要になることもあるので、訪れる前に公式サイトで確かめましょう。この後は、車でおよそ25分、美人林へ向かいましょう。";

const BIJIN_MEMO =
  "清津峡渓谷トンネルから車でおよそ25分、美人林に着きます。樹齢およそ100年のブナが立ち並ぶ、およそ3ヘクタールの林で、すらりと伸びる木々の姿から「美人林」と呼ばれるようになったと伝えられています。新緑がまぶしい春や、黄金色に色づく秋はもちろん、雪に包まれる冬もかんじきを履いて歩けるなど、四季を通じて表情を変える林です。入園は無料で、木道や遊歩道が整備されています。積雪期は一部区間が閉鎖されることがあるので、訪れる前に公式サイトで確かめましょう。木漏れ日の中、静かにブナ林の散策を楽しんでみてください。ロープウェイからの絶景、名作の舞台となった温泉街、日本三大峡谷、そしてブナ林の散策まで、越後湯沢をめぐる今日の旅を、ここで締めくくってください。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "1d0aa24f-a0e8-4319-b97b-86952764c785", dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "b5775660-0a09-4593-950c-cea944d2bbba", data: {} }, // 湯沢高原ロープウェイ
    { id: "ca0f640e-54de-486b-b7d2-bf429b61e3c3", data: {} }, // 雪国館
    { id: "8f1264a1-c2a1-4cc4-ac7a-7c3e4516b5a7", data: {} }, // 山の湯
    {
      id: "b6c01cba-1f1c-49bd-9324-0e753f4e68f8", // 清津峡渓谷トンネル
      data: { memo: KIYOTSU_MEMO_TO_BIJIN },
    },
    {
      create: {
        name: "美人林",
        address: "新潟県十日町市松之山",
        lat: 37.1008159,
        lng: 138.619673,
        memo: BIJIN_MEMO,
        visitTime: t(15, 4),
        stayDurationMin: 90,
        transitMode: "car",
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
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
