/**
 * #326の続き。fix-326bで光泉寺のvisitTimeを12:08に更新するつもり
 * だったが、already1ガードによりfix-326b本体の再実行では適用されず
 * (白旗の湯が既に存在するため日1のブロックがスキップされる)、別途
 * 当てた臨時パッチがスコープなし検索で誤って#384の光泉寺を書き換えて
 * しまったため、#326自身の光泉寺はまだ11:49のままだった(fix-384c参照)。
 * itineraryIdで絞った形で、#326自身の光泉寺だけを直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326c-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const kousenji = await prisma.spot.findFirstOrThrow({
    where: { name: "光泉寺", day: { itineraryId: ITIN_ID } },
  });
  const beforeMin = kousenji.visitTime!.getUTCHours() * 60 + kousenji.visitTime!.getUTCMinutes();
  console.log("before:", beforeMin);

  if (beforeMin !== 728) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: kousenji.id },
      { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 8)) }
    );
    console.log("updated to 12:08");
  } else {
    console.log("already correct, skipping");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
