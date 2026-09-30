/**
 * #85 c5aee4db 法務の指摘3点(2026-09-30 19:04)+企画運営の追加指摘(19:05)。
 * 1) 伊根の舟屋: 「選定されました」→「選定されたとされます」。住民配慮の一文を追加。
 * 2) 経ヶ岬灯台: 断崖注意の一文を追加。
 * 3) ちりめん街道: 住民配慮の一文を追加。
 * 4) 天橋立ビューランド→智恩寺の移動が「車でおよそ10分」のままだったが、
 *    実際は0.7kmで徒歩圏内(fix-85dで智恩寺側の書き出しは歩きに直したが、
 *    ビューランド側の結びを直し忘れていた)。歩いておよそ10分に統一。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;

  const ine = await findSpotInItinerary(itinId, { spotName: "伊根の舟屋" });
  const ineFrom1 = "国の重要伝統的建造物群保存地区に選定されました。";
  const ineTo1 = "国の重要伝統的建造物群保存地区に選定されたとされます。";
  const ineFrom2 = "舟をそのまま収納できる1階のつくりに、ここならではの暮らしぶりがうかがえます。";
  const ineTo2 = ineFrom2 + "舟屋は今も人が暮らす住まいです。敷地や舟屋の中に入らず、住民の方の暮らしに配慮しましょう。";
  if (!ine.memo!.includes(ineFrom1)) throw new Error("一致しません(伊根の舟屋-1)");
  if (!ine.memo!.includes(ineFrom2)) throw new Error("一致しません(伊根の舟屋-2)");
  const ineNewMemo = ine.memo!.split(ineFrom1).join(ineTo1).split(ineFrom2).join(ineTo2);

  const kyoga = await findSpotInItinerary(itinId, { spotName: "経ヶ岬灯台" });
  const kyogaFrom = "歩きやすい靴で、景色を楽しみながらゆっくり向かいましょう。";
  const kyogaTo = kyogaFrom + "灯台のまわりは断崖なので、柵の外に出たり崖に近づいたりしないようにしましょう。";
  if (!kyoga.memo!.includes(kyogaFrom)) throw new Error("一致しません(経ヶ岬灯台)");
  const kyogaNewMemo = kyoga.memo!.split(kyogaFrom).join(kyogaTo);

  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });
  const chirimenFrom = "当時の面影を残す町並みを、のんびりと歩いてみてください。";
  const chirimenTo = chirimenFrom + "今も人が暮らす町並みです。家の敷地に入ったり、住民の方を撮ったりしないようにしましょう。";
  if (!chirimen.memo!.includes(chirimenFrom)) throw new Error("一致しません(ちりめん街道)");
  const chirimenNewMemo = chirimen.memo!.split(chirimenFrom).join(chirimenTo);

  const viewland = await findSpotInItinerary(itinId, { spotName: "天橋立ビューランド" });
  const viewlandFrom = "この後は、車でおよそ10分、智恩寺へ向かいましょう。";
  const viewlandTo = "この後は、歩いておよそ10分、智恩寺へ向かいましょう。";
  if (!viewland.memo!.includes(viewlandFrom)) throw new Error("一致しません(天橋立ビューランド)");
  const viewlandNewMemo = viewland.memo!.split(viewlandFrom).join(viewlandTo);

  console.log("伊根の舟屋: OK");
  console.log("経ヶ岬灯台: OK");
  console.log("ちりめん街道: OK");
  console.log("天橋立ビューランド: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: ine.id }, { memo: ineNewMemo });
  await updateSpotInItinerary(itinId, { spotId: kyoga.id }, { memo: kyogaNewMemo });
  await updateSpotInItinerary(itinId, { spotId: chirimen.id }, { memo: chirimenNewMemo });
  await updateSpotInItinerary(itinId, { spotId: viewland.id }, { memo: viewlandNewMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
