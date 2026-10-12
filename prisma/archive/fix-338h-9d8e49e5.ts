/**
 * #338の続き。法務10:46の指摘対応。
 * 1) 壇上伽藍・根本大塔「大同元年(816)に着工され」は誤り。大同元年は806年で、
 *    816年は弘仁7年。正しくは「弘仁7年(816)に着工され」(金剛峯寺・開創の
 *    年とも対応)。
 * 2) 壇上伽藍(金堂・御影堂など今も祈りの場)に祈りの一文がなかったため追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-338h-9d8e49e5.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9d8e49e5-829f-44b3-b59f-8a8de36db689";

async function main() {
  const danjo = await prisma.spot.findFirstOrThrow({ where: { name: "壇上伽藍・根本大塔", day: { itineraryId: ITIN_ID } } });

  const old =
    "中心に立つ根本大塔は、大同元年(816)に着工され、真然大徳によって仁和2年(876)に完成した、多宝塔としては日本で最初のものと伝えられています。現在の建物は、弘法大師御入定1100年を記念して昭和12年(1937)に再建された鉄筋コンクリート造りで、堂内には、大日如来を中心に金剛界四仏や十六大菩薩を配した、立体曼荼羅が安置されています。隣接する金堂や、西塔、御影堂など、朱色の堂塔が点在する境内を、ゆっくりと巡ってみましょう。続いては、歩いておよそ4分の高野山霊宝館へ向かいましょう。";
  const next =
    "中心に立つ根本大塔は、弘仁7年(816)に着工され、真然大徳によって仁和2年(876)に完成した、多宝塔としては日本で最初のものと伝えられています。現在の建物は、弘法大師御入定1100年を記念して昭和12年(1937)に再建された鉄筋コンクリート造りで、堂内には、大日如来を中心に金剛界四仏や十六大菩薩を配した、立体曼荼羅が安置されています。隣接する金堂や、西塔、御影堂など、朱色の堂塔が点在する境内を、ゆっくりと巡ってみましょう。金堂や御影堂は今も法要が営まれる祈りの場ですので、静かに、敬意をもってお参りください。続いては、歩いておよそ4分の高野山霊宝館へ向かいましょう。";

  if (!danjo.memo?.includes(old)) {
    if (danjo.memo?.includes(next)) {
      console.log("already fixed, skipping");
      return;
    }
    throw new Error("anchor not found");
  }

  await updateSpotInItinerary(ITIN_ID, { spotId: danjo.id }, { memo: danjo.memo.replace(old, next) });
  console.log("year corrected and courtesy line added");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
