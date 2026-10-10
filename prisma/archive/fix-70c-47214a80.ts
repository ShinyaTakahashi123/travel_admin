/**
 * #70 47214a80 D1(現状15:39)。ユーザー決定「全部直す」の対象。滞在を延ばさず
 * (決まりA)、実在スポットを追加。大堂海岸のあとに柏島(実在、大月町、エメラルド
 * グリーンの海で知られる橋でつながる島、OSM way 130956543)を追加。移動時間は
 * OSRM実測(6.0km/9分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ODO_MEMO_TO_KASHIWA =
  "竜串グラスボート乗り場から車でおよそ40分、大月町の大堂海岸に着きます。切り立った白い岩肌の断崖が海岸線に連なり、断崖の縁に沿って整備された遊歩道を歩きながら、青い海と白い岩壁が織りなす大パノラマを眺めることができます。大堂山展望台まで登れば、柏島の島影まで見渡す360度の景色が広がります。周辺には「大堂お猿公園」もあり、およそ200匹の野生のニホンザルが暮らす姿を見られることもあります。断崖の縁には近づかず、遊歩道から眺めましょう。この後は、車でおよそ9分、柏島へ向かいましょう。";

const KASHIWA_MEMO =
  "大堂海岸から車でおよそ9分、橋を渡って柏島に着きます。黒潮と豊後水道の流れがぶつかる海域に浮かぶ小島で、抜群の透明度を誇るエメラルドグリーンの海は、まるで船が宙に浮いているように見えると評判です。多くの魚種が生息する海として、国内屈指のダイビングスポットとしても知られています。島内の集落を歩きながら、橋の上や岸辺から、透き通った海の色をゆっくりと眺めてみてください。竜串海岸から続いた足摺の海中美をめぐる旅も、ここで無事に終了です。今夜はこの近くの宿でゆっくり休みましょう。お疲れさまでした。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "47214a80-9c61-4b42-bc92-b382de9581eb", dayNumber: 1 } });

  const day1Spots: SpotOrderItem[] = [
    { id: "81397fdd-0843-431f-b70a-1d29dab8922f", data: {} }, // 竜串海岸
    { id: "9f6e7cb3-f520-4e09-8fa0-05203886b333", data: {} }, // 海のギャラリー
    { id: "ae5b6cd0-a4dc-42e4-8c01-79c607d56991", data: {} }, // 足摺海洋館SATOUMI
    { id: "e28e2334-4b4d-4bd7-9216-13ded80bc187", data: {} }, // 竜串グラスボート・見残し海岸
    {
      id: "fb050c23-3dfd-45c9-bc1f-4ab1097ee065", // 大堂海岸
      data: { memo: ODO_MEMO_TO_KASHIWA },
    },
    {
      create: {
        name: "柏島",
        address: "高知県幡多郡大月町柏島",
        lat: 32.7694919,
        lng: 132.6227034,
        memo: KASHIWA_MEMO,
        visitTime: t(15, 48),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 9,
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
