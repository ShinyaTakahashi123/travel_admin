/**
 * #85 c5aee4db 企画運営の指摘(2026-09-30 19:10)。fix-85hで加悦駅舎・
 * ちりめん街道・旧尾藤家住宅の滞在を延ばして時刻を合わせたのは「延ばして
 * 合わせない・移さない」に反する(今日3回目の同じ指摘)。3か所とも元の長さ
 * (58分・35分・50分)に戻し、空いた時間は与謝野町立古墳公園(実在、蛭子山
 * 古墳・作山古墳の復元整備とはにわ資料館、OSM way 1111677552「与謝野町
 * 古墳公園」)を加悦駅舎のあとに新規追加して埋めた。移動はOSRM実測
 * (加悦駅舎→古墳公園1.1km/5分、古墳公園→ちりめん街道1.2km/4分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KOFUN_MEMO =
  "加悦鉄道資料館から車でおよそ5分、与謝野町立古墳公園に着きます。国史跡に指定された蛭子山古墳・作山古墳を復元整備した公園で、古墳時代の空間をしのぶことができます。蛭子山古墳は丹後地方でも大きな前方後円墳で、格子越しに舟形石棺を見学できます。隣接するはにわ資料館では、両古墳から出土した埴輪や装飾品などが展示されており、実際の土器や石にふれられるコーナーもあります。休館日は公式サイトで確かめてから訪れましょう。この後は、車でおよそ4分、ちりめん街道へ向かいましょう。";

const CHIRIMEN_FROM_UPDATE = "加悦鉄道資料館から歩いておよそ5分、ちりめん街道に着きます。";
const CHIRIMEN_TO_UPDATE = "与謝野町立古墳公園から車でおよそ4分、ちりめん街道に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const kaya = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });
  const bitoke = await findSpotInItinerary(itinId, { spotName: "旧尾藤家住宅" });
  const narisho = await findSpotInItinerary(itinId, { spotName: "成相寺" });
  const kasamatsu = await findSpotInItinerary(itinId, { spotName: "傘松公園" });
  const kono = await findSpotInItinerary(itinId, { spotName: "籠神社" });
  const tanba = await findSpotInItinerary(itinId, { spotName: "天橋立" });

  if (!chirimen.memo!.includes(CHIRIMEN_FROM_UPDATE)) throw new Error("一致しません(ちりめん街道)");
  const chirimenNewMemo = chirimen.memo!.split(CHIRIMEN_FROM_UPDATE).join(CHIRIMEN_TO_UPDATE);

  const KAYA_FROM_UPDATE = "この後は、歩いておよそ5分、ちりめん街道へ向かいましょう。";
  const KAYA_TO_UPDATE = "この後は、車でおよそ5分、与謝野町立古墳公園へ向かいましょう。";
  if (!kaya.memo!.includes(KAYA_FROM_UPDATE)) throw new Error("一致しません(加悦駅舎)");
  const kayaNewMemo = kaya.memo!.split(KAYA_FROM_UPDATE).join(KAYA_TO_UPDATE);

  const day2Spots: SpotOrderItem[] = [
    { id: narisho.id, data: {} },
    { id: kasamatsu.id, data: {} },
    { id: kono.id, data: {} },
    { id: tanba.id, data: {} },
    {
      id: kaya.id, // 旧加悦鉄道加悦駅舎
      data: { memo: kayaNewMemo, stayDurationMin: 58 }, // 元の長さに戻す
    },
    {
      create: {
        name: "与謝野町立古墳公園",
        address: "京都府与謝郡与謝野町字明石2341",
        lat: 35.5064478,
        lng: 135.1050229,
        memo: KOFUN_MEMO,
        visitTime: t(14, 25),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      id: chirimen.id, // ちりめん街道
      data: { memo: chirimenNewMemo, visitTime: t(15, 9), stayDurationMin: 35, transitMode: "car", transitDurationMin: 4 }, // 元の長さに戻す
    },
    {
      id: bitoke.id, // 旧尾藤家住宅
      data: { visitTime: t(15, 49), stayDurationMin: 50 }, // 元の長さに戻す
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    [narisho.id]: 67,
    [kasamatsu.id]: 41,
    [kono.id]: 67,
    [tanba.id]: 50,
  };
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
