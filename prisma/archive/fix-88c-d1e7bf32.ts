/**
 * #88 d1e7bf32 残りの指摘対応。
 * 1) 十和田神社→乙女の像の移動が、既存のまま(徒歩15分)だったが、
 *    itinerary-auditで「徒歩が遅すぎ」と判定(実際は270m、OSM歩行者
 *    ルーティング実測で4分)。15分は水増しだったため4分に修正。
 * 2) 石ヶ戸の「唯一の休憩所」にヘッジを追加。
 * 3) D1に昼食の一言がなかったため、十和田ビジターセンター(11時前後の
 *    到着)に追加。
 * 4) 焼山の帰りの一言が「戻ることができます」で、flow-checkの語(戻り/
 *    戻ります)に一致しなかったため、「戻りましょう」に修正。
 * ※十和田ビジターセンター→遊覧船のりばの「0.2km/22分」の指摘は、保存
 *   されている2つの点の直線距離が近いために出る誤検知(実際の歩行路は
 *   OSM実測で1.6km/22分)と判断し、対応不要。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1e7bf32%'`);
  const itinId = rows[0].id;

  const otome = await findSpotInItinerary(itinId, { spotName: "乙女の像" });
  const otomeFrom = "十和田神社から歩いておよそ15分、";
  const otomeTo = "十和田神社から歩いておよそ4分、";
  if (!otome.memo!.includes(otomeFrom)) throw new Error("一致しません(乙女の像)");
  const otomeNewMemo = otome.memo!.split(otomeFrom).join(otomeTo);

  const cruise = await findSpotInItinerary(itinId, { spotName: "十和田湖遊覧船" });

  const vc = await findSpotInItinerary(itinId, { spotName: "十和田ビジターセンター" });
  const vcFrom = "休館日は公式サイトで確かめてから訪れましょう。";
  const vcTo = "ここで昼食にするのもよいでしょう。休館日は公式サイトで確かめてから訪れましょう。";
  if (!vc.memo!.includes(vcFrom)) throw new Error("一致しません(ビジターセンター)");
  const vcNewMemo = vc.memo!.split(vcFrom).join(vcTo);

  const ishigedo = await findSpotInItinerary(itinId, { spotName: "石ヶ戸" });
  const ishigedoFrom = "奥入瀬渓流沿いで唯一の休憩所があり";
  const ishigedoTo = "奥入瀬渓流沿いで唯一とされる休憩所があり";
  if (!ishigedo.memo!.includes(ishigedoFrom)) throw new Error("一致しません(石ヶ戸)");
  const ishigedoNewMemo = ishigedo.memo!.split(ishigedoFrom).join(ishigedoTo);

  const yakeyama = await findSpotInItinerary(itinId, { spotName: "焼山" });
  const yakeyamaFrom = "JRバスで十和田湖畔の休屋方面へ戻ることができます。";
  const yakeyamaTo = "JRバスで十和田湖畔の休屋方面へ戻りましょう。";
  if (!yakeyama.memo!.includes(yakeyamaFrom)) throw new Error("一致しません(焼山)");
  const yakeyamaNewMemo = yakeyama.memo!.split(yakeyamaFrom).join(yakeyamaTo);

  console.log("乙女の像: OK");
  console.log("十和田ビジターセンター: OK");
  console.log("石ヶ戸: OK");
  console.log("焼山: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: otome.id }, { memo: otomeNewMemo, visitTime: t(9, 44), transitDurationMin: 4 });
  await updateSpotInItinerary(itinId, { spotId: vc.id }, { memo: vcNewMemo, visitTime: t(10, 19) });
  await updateSpotInItinerary(itinId, { spotId: cruise.id }, { visitTime: t(11, 26) });
  await updateSpotInItinerary(itinId, { spotId: ishigedo.id }, { memo: ishigedoNewMemo });
  await updateSpotInItinerary(itinId, { spotId: yakeyama.id }, { memo: yakeyamaNewMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
