/**
 * 温泉6本(冬の温泉1泊2日)の冬季休業の確かめで見つかった1件。企画運営の判断どおりに直す。
 *   - 04fcc64b 越後湯沢: 岩原スキー場(Day2)に、GALA湯沢と同じ形の営業期間の一文がなかった。
 *     公式サイト(iwa-ppara.com)・新潟県公式観光サイト(niigata-kankou.or.jp)で
 *     「営業期間：2025年12月20日〜2026年3月29日」を確認。その年の予定の日付は書かず、
 *     「例年12月下旬から3月下旬ごろ」の形に(法務、2026-11-02)
 *   - 89522173 草津温泉スキー場: 滑る前提のスポットではないため、企画運営の判断で一文は足さない
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

type Fix = { id: string; name: string; oldMemo: string; newMemo: string };

const fixes: Fix[] = [
  {
    id: "132a0000-0000-0000-0000-000000000000", // placeholder, overwritten below
    name: "岩原スキー場",
    oldMemo:
      "2日目の朝、越後湯沢駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ18分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つとされます。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、はじめてスキーやスノーボードに挑戦する人にも向いています。場内には、全長634メートルという大きなソリのコース「そりランド」もあり、スキーやスノーボードをしない人も、雪の斜面を滑り降りて楽しめます。自分に合ったコースを選び、スキー場のきまりや係の人の案内に従いましょう。周辺には食事処もあるので、ここで昼食をとりましょう。この後は、車でおよそ19分、雪国館へ向かいましょう。",
    newMemo:
      "2日目の朝、越後湯沢駅の近くでレンタカーを借りて（手続きに15分ほど）、車でおよそ18分、岩原スキー場に着きます。昭和6年(1931)に開業した、湯沢町でもっとも古いスキー場の一つとされます。営業期間は例年12月下旬から3月下旬ごろまでです。出かける前に公式サイトで確かめましょう。飯士山の中腹に広がる、幅およそ600メートルの一枚斜面が特徴で、傾斜も緩やかなため、はじめてスキーやスノーボードに挑戦する人にも向いています。場内には、全長634メートルという大きなソリのコース「そりランド」もあり、スキーやスノーボードをしない人も、雪の斜面を滑り降りて楽しめます。自分に合ったコースを選び、スキー場のきまりや係の人の案内に従いましょう。周辺には食事処もあるので、ここで昼食をとりましょう。この後は、車でおよそ19分、雪国館へ向かいましょう。",
  },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  for (const f of fixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, memo: f.oldMemo } });
    console.log(`\n[${f.name}] (${spot.id})\n旧: ${f.oldMemo}\n\n新: ${f.newMemo}`);
    (f as any).resolvedId = spot.id;
  }
  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.$transaction(async (tx) => {
    for (const f of fixes) {
      await tx.spot.update({ where: { id: (f as any).resolvedId }, data: { memo: f.newMemo } });
    }
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
