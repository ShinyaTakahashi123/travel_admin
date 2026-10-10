/**
 * #332の続き。fix-332dで歴史民俗館の滞在を90→45分に縮めた際、下流の
 * 旧古賀家・旧牛島家の時刻を再計算し忘れていたための自己修正(時刻の
 * 計算が合わない、をitinerary-audit.cjsで発見)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-332e-980d1330.ts
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "980d1330-f50d-4601-a865-f0b803f3c60c";
const U = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const upd = async (name: string, visitTime: Date) => {
    const s = await prisma.spot.findFirstOrThrow({ where: { name, day: { itineraryId: ITIN_ID } } });
    await prisma.spot.update({ where: { id: s.id }, data: { visitTime } });
    console.log("updated", name);
  };
  await upd("旧古賀家", U(9, 47));
  await upd("旧牛島家", U(10, 29));
  await upd("旧三省銀行", U(11, 1));
  await upd("龍造寺八幡宮", U(11, 52));
  await upd("与賀神社", U(12, 44));
  await upd("神野公園", U(14, 29));
  await upd("佐賀県庁展望ホール", U(15, 54));
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
