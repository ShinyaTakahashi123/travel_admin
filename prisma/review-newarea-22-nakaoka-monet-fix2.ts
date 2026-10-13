/**
 * #22の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. モネの庭: 本文に日付・期間を書かない決まりのため、「12月から2月末は冬季休園」を
 *   「冬は休園の期間がある」に戻す
 * 2. 奈半利の町並み: 「藤村製絲株式会社倉庫」が会社名に見えるため「製糸会社の倉庫」に
 * 3. 伊尾木洞: 安芸市公式サイト(city.aki.kochi.jp/life/dtl.php?hdnKey=47)で裏を取った
 *   ところ、「幅約3m」は誤りで実際は「幅約4m」。「約40種類のシダ」も、公式サイトでは
 *   指定されているのは7種類(ホウビシダ・ホウライシダ・ノコギリシダ・コモチシダ・
 *   クリハラン・シロヤマゼンマイ・マツザカシダ)とされており、裏付けが取れなかった
 *   「約40種類」は使わず、確認できた7種類に直す。長さ約40m・高さ約5m・気温約20度・
 *   大正15年(1926)指定は、同じ公式サイトで確認が取れたためそのまま
 * 4. 中岡慎太郎館: 中岡慎太郎は坂本龍馬と同時に命を落としたのではなく、近江屋で
 *   襲われた2日後に死去しているため、「坂本龍馬とともに命を落としました」を
 *   「坂本龍馬とともに襲われ、命を落としました」に直す
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const monet = await prisma.spot.findFirst({ where: { name: "モネの庭マルモッタン" } });
  const nahari = await prisma.spot.findFirst({ where: { name: "奈半利の町並み（昼食）" } });
  const iokido = await prisma.spot.findFirst({ where: { name: "伊尾木洞" } });
  const nakaoka = await prisma.spot.findFirst({ where: { name: "中岡慎太郎館" } });
  if (!monet?.memo || !nahari?.memo || !iokido?.memo || !nakaoka?.memo) throw new Error("想定と違います");

  const newMonetMemo = monet.memo.replace(
    "12月から2月末は冬季休園となるので、訪れる前に公式サイトで開園状況を確かめましょう。",
    "冬は休園の期間があるため、訪れる前に公式サイトで開園状況を確かめましょう。"
  );
  const newNahariMemo = nahari.memo.replace("藤村製絲株式会社倉庫", "製糸会社の倉庫");
  const newIokidoMemo = iokido.memo.replace(
    "長さ約40m、幅約3m、高さ約5mあり、年間を通じて約20度に保たれています。この一帯の温度や湿度、地形がシダの生育に適しており、ホウビシダ、コモチシダなど約40種類ものシダが共生する、全国でも珍しい群落が見られます。",
    "延長約40m、幅約4m、高さ約5mあり、年間を通じて約20度に保たれています。ホウビシダ、ホウライシダ、ノコギリシダ、コモチシダ、クリハラン、シロヤマゼンマイ、マツザカシダの7種類のシダが群生しており、これらが天然記念物に指定されています。"
  );
  const newNakaokaMemo = nakaoka.memo.replace(
    "慶応3年(1867)、京都・近江屋で坂本龍馬とともに命を落としました。",
    "慶応3年(1867)、京都・近江屋で坂本龍馬とともに襲われ、命を落としました。"
  );

  if (
    newMonetMemo === monet.memo ||
    newNahariMemo === nahari.memo ||
    newIokidoMemo === iokido.memo ||
    newNakaokaMemo === nakaoka.memo
  ) {
    throw new Error("置換対象が見つかりません");
  }

  console.log("[確認OK] モネの庭の冬季休園の記述から日付を外す");
  console.log("[確認OK] 奈半利の町並みの「藤村製絲株式会社倉庫」を「製糸会社の倉庫」に");
  console.log("[確認OK] 伊尾木洞の幅(3m→4m)・シダの種類数(約40種類→確認できた7種類)を直す");
  console.log("[確認OK] 中岡慎太郎館の死去の記述を直す");
  console.log("新伊尾木洞メモ:", newIokidoMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: monet.id }, data: { memo: newMonetMemo } });
  await prisma.spot.update({ where: { id: nahari.id }, data: { memo: newNahariMemo } });
  await prisma.spot.update({ where: { id: iokido.id }, data: { memo: newIokidoMemo } });
  await prisma.spot.update({ where: { id: nakaoka.id }, data: { memo: newNakaokaMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
