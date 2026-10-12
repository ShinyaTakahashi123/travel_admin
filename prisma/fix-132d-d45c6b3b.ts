/**
 * #132 d45c6b3bの直し(4回目、自己点検)。fix-132cで蔵王エコーラインの
 * 座標を法務指摘の実点に修正した結果、滝見台との実際の距離が0.5kmと
 * 判明(もとの誤った座標が15km離れた山形側の点だったため、25分という
 * 移動時間は、実際には合わなくなっていた)。itinerary-auditの「近いのに
 * car25分」で発見し、8分に修正する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ECHOLINE_END_FROM = "この後は、車でおよそ25分、滝見台へ向かいましょう。";
const ECHOLINE_END_TO = "この後は、車でおよそ8分、滝見台へ向かいましょう。";

const TAKIMIDAI_START_FROM = "蔵王エコーラインを車でおよそ25分、滝見台に着きます。";
const TAKIMIDAI_START_TO = "蔵王エコーラインを車でおよそ8分、滝見台に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;

  const echoline = await findSpotInItinerary(itinId, { spotName: "蔵王エコーライン" });
  const takimidai = await findSpotInItinerary(itinId, { spotName: "滝見台" });
  const komakusadaira = await findSpotInItinerary(itinId, { spotName: "駒草平" });
  const okama = await findSpotInItinerary(itinId, { spotName: "蔵王のお釜" });
  const kattaminejinja = await findSpotInItinerary(itinId, { spotName: "刈田嶺神社奥宮" });
  const yajiro = await findSpotInItinerary(itinId, { spotName: "弥治郎こけし村" });

  if (!echoline.memo?.includes(ECHOLINE_END_FROM)) throw new Error("蔵王エコーラインの文言が想定外です");
  if (!takimidai.memo?.includes(TAKIMIDAI_START_FROM)) throw new Error("滝見台の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: echoline.id }, { memo: echoline.memo!.replace(ECHOLINE_END_FROM, ECHOLINE_END_TO) });
  await updateSpotInItinerary(
    itinId,
    { spotId: takimidai.id },
    {
      memo: takimidai.memo!.replace(TAKIMIDAI_START_FROM, TAKIMIDAI_START_TO),
      visitTime: t(9, 38),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8, transitLine: null }] },
    }
  );
  await updateSpotInItinerary(itinId, { spotId: komakusadaira.id }, { visitTime: t(10, 42) });
  await updateSpotInItinerary(itinId, { spotId: okama.id }, { visitTime: t(11, 42) });
  await updateSpotInItinerary(itinId, { spotId: kattaminejinja.id }, { visitTime: t(12, 37) });
  await updateSpotInItinerary(itinId, { spotId: yajiro.id }, { visitTime: t(14, 7) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
