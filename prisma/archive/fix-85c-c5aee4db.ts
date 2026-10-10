/**
 * #85 c5aee4db 残りの指摘対応。
 * 1) 天橋立ビューランド→智恩寺が「車で10分」だが実際は0.7kmしかなく
 *    (itinerary-auditの「近いのにcar10分」)、車では近すぎて不自然。同じ文珠
 *    エリア内のため徒歩(10分)に変更。
 * 2) 成相寺・籠神社に配慮の一文がなかったため追加(prayer-check)。丹後国分寺跡
 *    (廃寺の史跡)にも一言追加。
 * ※「車と公共交通が混在」の指摘は、1日目(車)と2日目(バス・ケーブルカー・
 *   徒歩)が別の日であるための誤検知(道具が日をまたいで手段を集計している)。
 *   各日の中では手段は一貫しているため、対応不要と判断。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c5aee4db%'`);
  const itinId = rows[0].id;

  const chionji = await findSpotInItinerary(itinId, { spotName: "智恩寺" });

  const narisho = await findSpotInItinerary(itinId, { spotName: "成相寺" });
  const narishoFrom = "「願いが成り合う寺」として「成相寺」と名づけられたといわれています。境内の梵鐘は「撞かずの鐘」と呼ばれ、鋳造の際に起きた悲しい出来事を悼み、以来撞くことをやめたという言い伝えが残されています。";
  const narishoTo = narishoFrom + "静かに、敬意をもってお参りください。";
  if (!narisho.memo!.includes(narishoFrom)) throw new Error("一致しません(成相寺)");
  const narishoNewMemo = narisho.memo!.split(narishoFrom).join(narishoTo);

  const kono = await findSpotInItinerary(itinId, { spotName: "籠神社" });
  const konoFrom = "天照大神と豊受大神がともに祀られたのはこの地だけとされ、奥宮の眞名井神社とあわせて、伊勢神宮のルーツともいえる由緒を今に伝えています。";
  const konoTo = konoFrom + "静かに、敬意をもってお参りください。";
  if (!kono.memo!.includes(konoFrom)) throw new Error("一致しません(籠神社)");
  const konoNewMemo = kono.memo!.split(konoFrom).join(konoTo);

  const kokubunji = await findSpotInItinerary(itinId, { spotName: "丹後国分寺跡" });
  const kokubunjiFrom = "かつてこの地に大きな伽藍があったことに思いをはせながら歩いてみてください。";
  const kokubunjiTo = "かつてこの地に大きな伽藍があったことに思いをはせながら、静かに歩いてみてください。";
  if (!kokubunji.memo!.includes(kokubunjiFrom)) throw new Error("一致しません(丹後国分寺跡)");
  const kokubunjiNewMemo = kokubunji.memo!.split(kokubunjiFrom).join(kokubunjiTo);

  console.log("智恩寺: transitMode/transitDurationMin更新予定");
  console.log("成相寺: OK");
  console.log("籠神社: OK");
  console.log("丹後国分寺跡: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: chionji.id }, { transitMode: "walk", transitDurationMin: 10 });
  await updateSpotInItinerary(itinId, { spotId: narisho.id }, { memo: narishoNewMemo });
  await updateSpotInItinerary(itinId, { spotId: kono.id }, { memo: konoNewMemo });
  await updateSpotInItinerary(itinId, { spotId: kokubunji.id }, { memo: kokubunjiNewMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
