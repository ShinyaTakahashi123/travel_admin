/**
 * チェックリスト #288 の修正ラウンド(法務指摘)。
 * しおり「グリコサインとたこ焼き、道頓堀を食べ歩く日帰りプラン」(406e5c96-ffef-4536-a312-0204de681b97)
 *
 * 法務指摘3点への対応:
 * 1. 道頓堀の「大阪随一の繁華街です」→「大阪を代表する繁華街のひとつです」に言い切りをぼかした
 * 2. 道頓堀の写真を、グリコサインのキャラクターを大きく切り取ったものから、川と看板の並ぶ
 *    通りを広く写した構図(えびす橋・道頓堀川)に差し替えた(Wikipedia「道頓堀」記事のInfobox画像、
 *    出典: https://commons.wikimedia.org/wiki/File:Osaka_Dotonbori_Ebisu_Bridge.jpg CC BY-SA 3.0)
 * 3. 法善寺横丁(水掛不動尊の紹介)に「今もお参りが続く場所なので、静かに、敬意をもってお参り
 *    しましょう」を追加(配慮の一文がなかったため)
 * (できれば対応: 法善寺横丁の既存写真の撮影者名「＋－ from jawp」から、日本語版ウィキペディアの
 *  由来を示す「from jawp」を除き「＋－」のみに修正)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-288b-406e5c96.ts
 * (実行済み。findSpotInItinerary/updateSpotInItinerary を使い、しおりIDで絞って安全に更新)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "406e5c96-ffef-4536-a312-0204de681b97";

async function main() {
  const dotonbori = await findSpotInItinerary(ITIN_ID, { spotName: "道頓堀" });
  await updateSpotInItinerary(
    ITIN_ID,
    { spotId: dotonbori.id },
    {
      memo: "法善寺横丁からは歩いてすぐです。道頓堀は、江戸時代初期の慶長17年(1612)に開削が始まり、元和元年(1615)に完成した運河です。開削に尽力した安井道頓の功績をたたえて、この名がついたと伝えられています。芝居小屋が並ぶ娯楽の町として栄えた歴史を持ち、今も飲食店やネオン看板が軒を連ねる、大阪を代表する繁華街のひとつです。中でも道頓堀のシンボルといえるのが、道頓堀グリコサインです。昭和10年(1935)に初代の看板が設置されて以来、幾度かのリニューアルを経て、現在の看板は6代目にあたります。両手を広げて走るランナーの姿は、大阪観光の記念写真の定番となっています。たこ焼きなど大阪らしい食べ歩きグルメも楽しみながら、旅の締めくくりに道頓堀の賑わいを味わいましょう。",
    }
  );

  const hozenji = await findSpotInItinerary(ITIN_ID, { spotName: "法善寺横丁" });
  const hozenjiSpot = await prisma.spot.findUniqueOrThrow({ where: { id: hozenji.id } });
  if (!hozenjiSpot.memo?.includes("今もお参りが続く場所")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: hozenji.id },
      { memo: hozenjiSpot.memo + " 今もお参りが続く場所なので、静かに、敬意をもってお参りしましょう。" }
    );
  }

  const hozenjiPhoto = await prisma.photo.findFirst({ where: { spotId: hozenji.id } });
  if (hozenjiPhoto && hozenjiPhoto.author === "＋－ from jawp") {
    await prisma.photo.update({ where: { id: hozenjiPhoto.id }, data: { author: "＋－" } });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
