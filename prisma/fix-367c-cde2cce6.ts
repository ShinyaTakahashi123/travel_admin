/**
 * #367の続き。prayer-check.cjsで、白山神社の紹介文に配慮の一文
 * (「敬意」「手を合わせ」)が見当たらないと出たため追記する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-367c-cde2cce6.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "93e13569-6bfe-4462-8f6e-3cbff8bb17e5";

async function main() {
  const hakusanjinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "白山神社" } });
  const oldText = "今も多くの人が参拝に訪れる祈りの場ですので、境内では静かにお参りください。";
  const newText = "今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。";
  if (!hakusanjinja.memo?.includes(oldText)) {
    console.log("already applied, skipping");
    return;
  }
  await prisma.spot.update({
    where: { id: hakusanjinja.id },
    data: { memo: hakusanjinja.memo.replace(oldText, newText) },
  });
  console.log("#367続き: 白山神社の配慮の一文に「敬意」を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
