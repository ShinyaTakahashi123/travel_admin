/**
 * #342の続き。prayer-checkの判定語は「敬意」「手を合わせ」のみ(法務・企画運営の
 * 過去の指摘で「配慮」「静かに」は誤検知のため判定語から外されている)。
 * 弘前昇天教会の「節度をもって」は判定語に含まれずヒットしなかったため、
 * 「敬意」を含む表現に直す。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-342d-a0c34490.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "a0c34490-4b62-4f3f-8162-5802cf5d401d";

async function main() {
  const church = await prisma.spot.findFirstOrThrow({ where: { name: "弘前昇天教会", day: { itineraryId: ITIN_ID } } });

  const old = "今も礼拝が続く現役の教会ですので、見学の際は静かに、節度をもって見て回りましょう。";
  const next = "今も礼拝が続く現役の教会ですので、見学の際は静かに、敬意をもって見て回りましょう。";

  if (church.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: church.id }, { memo: church.memo.replace(old, next) });
    console.log("church wording updated to include 敬意");
  } else if (church.memo?.includes(next)) {
    console.log("already fixed, skipping");
  } else {
    throw new Error("anchor not found");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
