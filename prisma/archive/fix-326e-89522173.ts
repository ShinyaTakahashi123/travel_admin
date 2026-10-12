/**
 * #326の続き。光泉寺の書き出しが「白旗源泉からは」となっていたが、
 * 実際のスポット名は「白旗の湯」のため、名称を揃えた(自己チェック)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326e-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const kousenji = await prisma.spot.findFirstOrThrow({
    where: { name: "光泉寺", day: { itineraryId: ITIN_ID } },
  });
  const old = "白旗源泉からは歩いておよそ3分です。";
  const next = "白旗の湯からは歩いておよそ3分です。";
  if (kousenji.memo?.includes(next)) {
    console.log("already applied, skipping");
    return;
  }
  if (!kousenji.memo?.includes(old)) {
    throw new Error("expected text not found");
  }
  await updateSpotInItinerary(ITIN_ID, { spotId: kousenji.id }, { memo: kousenji.memo.replace(old, next) });
  console.log("updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
