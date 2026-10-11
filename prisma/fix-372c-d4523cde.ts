/**
 * #372の続き。fix-372bで移動時間の数字を直したが、本文の「歩いて〇分ほど」
 * の書き出しが古い数字のまま残っていた(直し漏れ)。あわせて、きぼーるの
 * 「千葉県内最大」に同一文のヘッジがなかったため追加する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-372c-d4523cde.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "305fcdd7-999d-4c5b-9e64-79445ec2bf41";

async function main() {
  const jinja = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉神社" } });
  const kibo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "きぼーる" } });
  const bijutsukan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "千葉市美術館" } });

  if (!jinja.memo?.includes("千葉城から歩いて5分ほど")) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: jinja.id },
    data: { memo: jinja.memo.replace("千葉城から歩いて5分ほど", "千葉城から歩いて13分ほど") },
  });

  const kiboNew = (kibo.memo ?? "")
    .replace("千葉神社から歩いて3分ほど", "千葉神社から歩いて6分ほど")
    .replace(
      "この中に千葉県内最大、直径23メートルのプラネタリウムが入っています。",
      "この中に千葉県内最大とされる、直径23メートルのプラネタリウムが入っています。"
    );
  await prisma.spot.update({ where: { id: kibo.id }, data: { memo: kiboNew } });

  await prisma.spot.update({
    where: { id: bijutsukan.id },
    data: { memo: bijutsukan.memo?.replace("きぼーるから歩いて2分ほど", "きぼーるから歩いて4分ほど") },
  });

  console.log("#372続き: 書き出しの移動時間の直し漏れ3件、きぼーるのヘッジを修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
