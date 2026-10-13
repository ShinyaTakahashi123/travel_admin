/**
 * 法務・企画運営指摘(2026-10-13)の直し、テキストのみで済む3点。
 * 1. #22 中岡慎太郎館: 亡くなり方の書き方(「京都・近江屋で坂本龍馬とともに
 *    襲われ、命を落としました」)を「慶応3年(1867)、京都で亡くなりました。」に
 * 2. #25 高良大社: 「耳納連山の最西端」を同じ文でぼかす
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const NAKAOKA_ID = "6ed8adaa-aedd-4f6a-9ab5-354f7303deee";
const KORA_ID = "2a255442-adaa-40be-9a64-b591c2272a8c";

const NAKAOKA_MEMO_NEW =
  "坂本龍馬とともに活躍した幕末の志士・中岡慎太郎の生誕地に建つ資料館です。慎太郎は天保9年(1838)、この地の茅葺き屋根の家に生まれ、のちに坂本龍馬とともに薩長同盟の成立に力を尽くしましたが、慶応3年(1867)、京都で亡くなりました。館内では、幼少期から最期までの生涯を、映像やパネルで時代を追って紹介しています。すぐそばには、昭和42年(1967)に見取り図をもとに復元された生家も残されています。";

const KORA_MEMO_NEW =
  "耳納連山の最西端とされる高良山の中腹に鎮座する、筑後国一の宮です。履中天皇元年(400)の創建と伝わり、祭神は高良玉垂命とされています。現在の本殿・幣殿・拝殿は、万治3年(1660)、久留米藩3代藩主・有馬頼利の建立で、江戸初期の権現造としては九州最大規模とされ、国の重要文化財に指定されています。境内の山中には、国の天然記念物に指定された孟宗金明竹林もあります。境内からは筑後平野を見渡せます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

async function main() {
  const nakaoka = await prisma.spot.findUnique({ where: { id: NAKAOKA_ID } });
  const kora = await prisma.spot.findUnique({ where: { id: KORA_ID } });
  if (!nakaoka || !kora) throw new Error("想定と違います");

  console.log("[確認OK] 中岡慎太郎館: 亡くなり方の書き方を修正");
  console.log("[確認OK] 高良大社: 「耳納連山の最西端」を同じ文でぼかす");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: NAKAOKA_ID }, data: { memo: NAKAOKA_MEMO_NEW } });
  await prisma.spot.update({ where: { id: KORA_ID }, data: { memo: KORA_MEMO_NEW } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
