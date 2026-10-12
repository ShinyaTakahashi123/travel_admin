/**
 * #355の続き。法務の指摘: 「有数」の言い切りが2か所(出雲弥生の森博物館「全国有数の
 * 弥生墳墓群」、出雲大社「国内でも有数の規模を持つ神社建築」)にあったため、
 * それぞれ伝聞の形に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-355g-bb5348fc.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "bb5348fc-c7db-472c-82fc-5ddb3db3253b";

async function main() {
  const yayoi = await prisma.spot.findFirstOrThrow({ where: { name: "出雲弥生の森博物館", day: { itineraryId: ITIN_ID } } });
  const old1 = "27基もの墳丘墓が密集する、全国有数の弥生墳墓群の世界を紹介しています。";
  const new1 = "27基もの墳丘墓が密集する、全国でも有数とされる弥生墳墓群の世界を紹介しています。";
  if (!yayoi.memo?.includes(old1)) throw new Error("出雲弥生の森博物館: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: yayoi.id }, { memo: yayoi.memo.replace(old1, new1) });

  const izumotaisha = await prisma.spot.findFirstOrThrow({ where: { name: "出雲大社", day: { itineraryId: ITIN_ID } } });
  const old2 = "地上からおよそ24mの高さを誇る、国内でも有数の規模を持つ神社建築として国宝に指定されています。";
  const new2 = "地上からおよそ24mの高さを誇る、国内でも有数とされる規模の神社建築として国宝に指定されています。";
  if (!izumotaisha.memo?.includes(old2)) throw new Error("出雲大社: anchor not found");
  await updateSpotInItinerary(ITIN_ID, { spotId: izumotaisha.id }, { memo: izumotaisha.memo.replace(old2, new2) });

  console.log("#355: 「有数」の言い切り2件を伝聞の形に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
