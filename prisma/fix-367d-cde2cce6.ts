/**
 * #367の続き。本文の事実確認で見つかった2点を直す。
 *
 * - 白山神社: 「新潟駅からバスでおよそ12分」は誤り。実際は萬代橋ラインで
 *   およそ15分、「市役所前」下車・徒歩1分(JR東日本系メディアの記事で確認)。
 * - 新潟市美術館: 所蔵作品を「日本画や版画」としていたが、実際はピカソ・
 *   クレーなど海外の巨匠から草間彌生ら新潟ゆかりの作家まで5000点超を所蔵
 *   (公式サイト系の記事で確認)。本文を実際の所蔵内容に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-367d-cde2cce6.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "93e13569-6bfe-4462-8f6e-3cbff8bb17e5";

async function main() {
  const hakusanjinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山神社" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "新潟市美術館" } });

  const busOld = "新潟駅からバスでおよそ12分、新潟の旅は白山神社から始まります。";
  const busNew = "新潟駅からバスでおよそ15分、新潟の旅は白山神社から始まります。";
  const colOld = "日本画や版画、新潟にゆかりのある作家の作品などを所蔵しています。";
  const colNew = "ピカソやクレーなど国内外の巨匠の作品から、新潟にゆかりのある作家の作品まで、5000点を超えるコレクションを所蔵しています。";

  if (!hakusanjinja.memo?.includes(busOld) && !bijutsukan.memo?.includes(colOld)) {
    console.log("already applied, skipping");
    return;
  }

  if (hakusanjinja.memo?.includes(busOld)) {
    await prisma.spot.update({
      where: { id: hakusanjinja.id },
      data: { memo: hakusanjinja.memo.replace(busOld, busNew) },
    });
  }
  if (bijutsukan.memo?.includes(colOld)) {
    await prisma.spot.update({
      where: { id: bijutsukan.id },
      data: { memo: bijutsukan.memo.replace(colOld, colNew) },
    });
  }

  console.log("#367続き: 白山神社のバス時間(12分→15分)、新潟市美術館の所蔵作品の説明を事実に合わせて修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
