/**
 * #9 b7c6d2e1 立山黒部アルペンルートで行く、絶景の高原バス旅日帰りプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const FROM =
  "皆様、標高およそ2,450メートル、立山黒部アルペンルートの中核をなす室堂平へようこそ。目の前には雄山をはじめとする立山連峰が雄大にそびえ、澄んだ空気の中にその稜線がくっきりと浮かび上がります。1971年の全線開通以来、多くの旅人を高山の絶景へと導いてきたこの地は、季節ごとに違う表情を見せてくれるのも魅力のひとつ。夏には高山植物や雷鳥、秋には草紅葉、春には雪の大谷と、訪れるたびに新しい発見があります。すぐそばの「みくりが池」は、日本アルプスの中でも屈指の透明度と深さを誇るといわれる高山湖で、静かな水面に立山連峰を映す姿は息をのむ美しさです。皆様、どうぞしばしお時間を忘れて、この大パノラマを心ゆくまでお楽しみください。";
const TO =
  "標高およそ2,450メートル、立山黒部アルペンルートの中核をなす室堂平に着きます。目の前には雄山をはじめとする立山連峰が雄大にそびえ、澄んだ空気の中にその稜線がくっきりと浮かび上がります。1971年の全線開通以来、多くの旅人を高山の絶景へと導いてきたこの地は、季節ごとに違う表情を見せてくれるのも魅力のひとつ。夏には高山植物や雷鳥、秋には草紅葉、春には雪の大谷と、訪れるたびに新しい発見があります。すぐそばの「みくりが池」は、日本アルプスの中でも屈指の透明度と深さを誇るといわれる高山湖で、静かな水面に立山連峰を映す姿は息をのむ美しさです。時間を忘れて、この大パノラマをゆっくり眺めてみてください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b7c6d2e1%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "室堂平" });
  if (!spot.memo!.includes(FROM)) throw new Error("一致しません");
  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(FROM, TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
