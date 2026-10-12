/**
 * #90 de041462 fix-90の直後の直し。
 * 1) 観潮船の滞在80分(既存のまま引き継いでいた)は、実際のクルーズ所要時間
 *    (公式・複数の観光サイトで確認したところ約20〜25分)に比べて長すぎる
 *    水増しと判断し、乗船手続き等を含めて35分に修正。空いた45分は、大塚
 *    国際美術館の滞在(公式に「初訪問なら4〜5時間」との案内があった)に
 *    そのままあてた(180→225分)。
 * 2) itinerary-auditの「言い切り?」判定: 大塚国際美術館の「最初の展示室」、
 *    ドイツ館の「アジアで初めて演奏された」をヘッジする。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OTSUKA_FROM = "最初の展示室「システィーナ・ホール」では";
const OTSUKA_TO = "最初に訪れることになる「システィーナ・ホール」では";

const DOITSUKAN_FROM = "ベートーヴェンの交響曲第九番がアジアで初めて演奏された地としても知られています。";
const DOITSUKAN_TO = "ベートーヴェンの交響曲第九番がアジアで初めて演奏された地とされています。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'de041462%'`);
  const itinId = rows[0].id;

  const uzushio = await findSpotInItinerary(itinId, { spotName: "鳴門の渦潮（亀浦観潮船乗り場）" });
  const uzunomichi = await findSpotInItinerary(itinId, { spotName: "渦の道" });
  const otsuka = await findSpotInItinerary(itinId, { spotName: "大塚国際美術館" });
  const doitsukan = await findSpotInItinerary(itinId, { spotName: "鳴門市ドイツ館" });

  if (!otsuka.memo!.includes(OTSUKA_FROM)) throw new Error("一致しません(大塚国際美術館)");
  if (!doitsukan.memo!.includes(DOITSUKAN_FROM)) throw new Error("一致しません(ドイツ館)");

  console.log("すべて一致確認OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: uzushio.id }, { stayDurationMin: 35 });
  await updateSpotInItinerary(itinId, { spotId: uzunomichi.id }, { visitTime: t(10, 16) });
  await updateSpotInItinerary(itinId, { spotId: otsuka.id }, {
    memo: otsuka.memo!.replace(OTSUKA_FROM, OTSUKA_TO),
    stayDurationMin: 225,
    visitTime: t(11, 3),
  });
  await updateSpotInItinerary(itinId, { spotId: doitsukan.id }, {
    memo: doitsukan.memo!.replace(DOITSUKAN_FROM, DOITSUKAN_TO),
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
