/**
 * #70 47214a80 D2(現状14:36)。ユーザー決定「全部直す」の対象。滞在を延ばさず
 * (決まりA)、実在スポットを2件追加。
 * 大岐海岸(実在、土佐清水市、サーフィン・アカウミガメの浜、OSM way 389572324)を
 * 日の最初に追加。移動時間はOSRM実測(8.9km/8分)。
 * 万次郎足湯(実在、白山洞門から徒歩2分・OSM node 2569428192、白山洞門の本文で
 * 既に言及されていた施設)を白山洞門のあとに追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OKI_MEMO =
  "旅の2日目は、大岐海岸から始めます。真っ白な砂浜と緑の松林が1.6kmにわたって弧を描く美しい海岸で、足摺国立公園の東の玄関口ともいわれています。近年はサーフスポットとしても人気を集めているほか、絶滅危惧種のアカウミガメが産卵のために上陸することでも知られています。朝の澄んだ空気の中、白い砂浜をのんびりと歩いてみてください。この後は、車でおよそ8分、ジョン万次郎の資料館へ向かいましょう。";

const JOHN_MANJIRO_MEMO_OPENER_FROM = "旅の2日目はジョン万次郎資料館からスタートです。";
const JOHN_MANJIRO_MEMO_OPENER_TO = "大岐海岸から車でおよそ8分、ジョン万次郎資料館に着きます。";

const HAKUSAN_MEMO_CLOSER_FROM = "足摺の荒々しい海岸美を、ゆっくりと眺めてみてください。この後は、車でおよそ5分、金剛福寺へ向かいましょう。";
const HAKUSAN_MEMO_CLOSER_TO = "足摺の荒々しい海岸美を、ゆっくりと眺めてみてください。この後は、歩いておよそ2分、万次郎足湯へ向かいましょう。";

const ASHIYU_MEMO =
  "白山洞門から歩いておよそ2分、万次郎足湯に着きます。階段状に4つの浴槽が並ぶ足湯施設で、全面ガラス張りの窓からは、青い空と太平洋、そして日本有数の大きさを誇る白山洞門を一望できます。利用は無料(タオルは有料で購入できます)です。歩き疲れた足を、大パノラマを眺めながら休めてみてください。この後は、車でおよそ5分、金剛福寺へ向かいましょう。";

const KONGOFUKUJI_MEMO_OPENER_FROM = "白山洞門から車でおよそ5分、四国最南端の足摺岬に建つ金剛福寺に着きます。";
const KONGOFUKUJI_MEMO_OPENER_TO = "万次郎足湯から車でおよそ5分、四国最南端の足摺岬に建つ金剛福寺に着きます。";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "47214a80-9c61-4b42-bc92-b382de9581eb", dayNumber: 2 } });

  const johnManjiro = await prisma.spot.findUniqueOrThrow({ where: { id: "d68b111e-a317-403c-ab7a-83d2a865f517" } });
  if (!johnManjiro.memo!.includes(JOHN_MANJIRO_MEMO_OPENER_FROM)) throw new Error("一致しません(ジョン万次郎資料館)");
  const johnManjiroNewMemo = johnManjiro.memo!.split(JOHN_MANJIRO_MEMO_OPENER_FROM).join(JOHN_MANJIRO_MEMO_OPENER_TO);

  const hakusan = await prisma.spot.findUniqueOrThrow({ where: { id: "3c56a4b2-1af0-4d32-ac41-e323cf4b379d" } });
  if (!hakusan.memo!.includes(HAKUSAN_MEMO_CLOSER_FROM)) throw new Error("一致しません(白山洞門)");
  const hakusanNewMemo = hakusan.memo!.split(HAKUSAN_MEMO_CLOSER_FROM).join(HAKUSAN_MEMO_CLOSER_TO);

  const kongofukuji = await prisma.spot.findUniqueOrThrow({ where: { id: "16eb35dd-5c29-4ec7-911d-f29956fde192" } });
  if (!kongofukuji.memo!.includes(KONGOFUKUJI_MEMO_OPENER_FROM)) throw new Error("一致しません(金剛福寺)");
  const kongofukujiNewMemo = kongofukuji.memo!.split(KONGOFUKUJI_MEMO_OPENER_FROM).join(KONGOFUKUJI_MEMO_OPENER_TO);

  const day2Spots: SpotOrderItem[] = [
    {
      create: {
        name: "大岐海岸",
        address: "高知県土佐清水市大岐",
        lat: 32.819197,
        lng: 132.950644,
        memo: OKI_MEMO,
        visitTime: t(9, 0),
        stayDurationMin: 75,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      id: "d68b111e-a317-403c-ab7a-83d2a865f517", // ジョン万次郎資料館
      data: { memo: johnManjiroNewMemo, visitTime: t(10, 23), stayDurationMin: 50, transitMode: "car", transitDurationMin: 8 },
    },
    { id: "8eaee671-8d0f-476e-a023-fde6bb6ac543", data: { visitTime: t(11, 23), stayDurationMin: 35 } }, // 中浜
    { id: "d2c28316-82aa-46fb-b631-c70b9add2080", data: { visitTime: t(12, 6), stayDurationMin: 60 } }, // 唐人駄場遺跡
    {
      id: "3c56a4b2-1af0-4d32-ac41-e323cf4b379d", // 白山洞門
      data: { memo: hakusanNewMemo, visitTime: t(13, 14), stayDurationMin: 35 },
    },
    {
      create: {
        name: "万次郎足湯",
        address: "高知県土佐清水市足摺岬482-1",
        lat: 32.7245506,
        lng: 133.0141058,
        memo: ASHIYU_MEMO,
        visitTime: t(13, 51),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      id: "16eb35dd-5c29-4ec7-911d-f29956fde192", // 金剛福寺
      data: { memo: kongofukujiNewMemo, visitTime: t(14, 26), stayDurationMin: 50, transitMode: "car", transitDurationMin: 5 },
    },
    { id: "693fc254-ce6e-480c-b829-8add99be1951", data: { visitTime: t(15, 26), stayDurationMin: 65 } }, // 足摺岬
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
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
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
