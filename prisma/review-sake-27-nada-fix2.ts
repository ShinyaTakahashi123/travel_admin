/**
 * #27の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. 沢の鶴資料館の「全国で初めてとなる」を「全国で初めてとされる」にぼかす。
 *   神戸市公式サイト(city.kobe.lg.jp)で「免震システムを施して復興」の事実は
 *   確認できたが、「全国初」の部分は沢の鶴の公式サイト(sawanotsuru.co.jp)にも
 *   記述がなく、裏付けが取れなかった(配信記事のみの情報)
 * 2. 櫻正宗記念館「櫻宴」をスポット名「（昼食）」付きにし、メモの終わりに
 *   「ここで昼食をとりましょう。」を追加(店名は出さない)
 * 3. 白鶴酒造資料館の最後の文を、案内口調・車の話を外した形に直す
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

async function main() {
  const sawanotsuru = await prisma.spot.findFirst({ where: { name: "沢の鶴資料館" } });
  const sakuramasamune = await prisma.spot.findFirst({ where: { name: "櫻正宗記念館「櫻宴」" } });
  const hakutsuru = await prisma.spot.findFirst({ where: { name: "白鶴酒造資料館" } });
  if (!sawanotsuru?.memo || !sakuramasamune?.memo || !hakutsuru?.memo) throw new Error("想定と違います");

  const newSawanotsuruMemo = sawanotsuru.memo.replace(
    "木造建築物としては全国で初めてとなる免震システムが採用されています。",
    "木造建築物としては全国で初めてとされる免震システムが採用されています。"
  );
  const newSakuramasamuneMemo = sakuramasamune.memo + "ここで昼食をとりましょう。";
  const newHakutsuruMemo = hakutsuru.memo.replace(
    "見学のあとは、日本酒などを試飲できます。今日一日の締めくくりに、車を運転する方は試飲をひかえ、そのまま最寄り駅から帰路につきましょう。",
    "見学のあとは、試飲もできます。最寄り駅から帰路につきましょう。"
  );
  if (newSawanotsuruMemo === sawanotsuru.memo || newHakutsuruMemo === hakutsuru.memo) throw new Error("置換対象が見つかりません");

  console.log("[確認OK] 沢の鶴資料館の「全国初」をぼかす");
  console.log("[確認OK] 櫻正宗記念館「櫻宴」を（昼食）にし、昼食の一文を追加");
  console.log("[確認OK] 白鶴酒造資料館の最後の文を直す");
  console.log("新白鶴メモ:", newHakutsuruMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: sawanotsuru.id }, data: { memo: newSawanotsuruMemo } });
  await prisma.spot.update({
    where: { id: sakuramasamune.id },
    data: { name: "櫻正宗記念館「櫻宴」（昼食）", memo: newSakuramasamuneMemo },
  });
  await prisma.spot.update({ where: { id: hakutsuru.id }, data: { memo: newHakutsuruMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
