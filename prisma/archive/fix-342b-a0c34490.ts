/**
 * #342の続き。flow-checkで「昼食の一言なし」が出た。藤田記念庭園の文に
 * 「大正浪漫喫茶室」の案内はあったが「昼食」の語がなかったため追記する。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-342b-a0c34490.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a0c34490-4b62-4f3f-8162-5802cf5d401d";

async function main() {
  const fujita = await prisma.spot.findFirstOrThrow({ where: { name: "藤田記念庭園", day: { itineraryId: ITIN_ID } } });

  const old = "洋館内の「大正浪漫喫茶室」で、暖かい飲み物やアップルパイを味わいながら、ひと息つくとよいでしょう。";
  const next = "洋館内の「大正浪漫喫茶室」で昼食をとりながら、暖かい飲み物やアップルパイも味わって、ひと息つくとよいでしょう。";
  if (!fujita.memo?.includes(old)) {
    if (fujita.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: fujita.id }, { memo: fujita.memo.replace(old, next) });
  console.log("lunch wording added");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
