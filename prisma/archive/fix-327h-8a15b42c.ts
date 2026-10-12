/**
 * #327 キツネと動物ふれあい、みやぎ蔵王キツネ村を満喫する家族旅1泊2日
 * 企画運営の再調査(10/1)で発覚した、つなぎのずれ修正。2か所(ともにDay2)。
 * 1. 蔵王酪農センターの結びが、実際の次(神の湯・車12分)ではなく、
 *    「遠刈田温泉・車10分」になっていた(行き先名・分数とも誤り)。
 * 2. みやぎ蔵王こけし館の結びが「3分」だが、実際の次(新地こけしの里)の
 *    記録・本文は「6分」。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-327h-8a15b42c.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8a15b42c-8c4a-44cc-8aa1-97e4c32bd761";

async function main() {
  const rakuno = await prisma.spot.findFirstOrThrow({ where: { name: "蔵王酪農センター", day: { itineraryId: ITIN_ID } } });
  const kokeshikan = await prisma.spot.findFirstOrThrow({ where: { name: "みやぎ蔵王こけし館", day: { itineraryId: ITIN_ID } } });

  const old1 = "続いては、車でおよそ10分の遠刈田温泉へ向かいましょう。";
  const next1 = "続いては、車でおよそ12分の神の湯へ向かいましょう。";
  if (!rakuno.memo?.includes(old1)) {
    if (!rakuno.memo?.includes(next1)) throw new Error("蔵王酪農センター: anchor not found");
    console.log("蔵王酪農センター: already fixed, skipping");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: rakuno.id }, { memo: rakuno.memo.replace(old1, next1) });
    console.log("蔵王酪農センター: closer fixed → 神の湯(車12分)");
  }

  const old2 = "続いては、歩いておよそ3分の新地こけしの里へ向かいましょう。";
  const next2 = "続いては、歩いておよそ6分の新地こけしの里へ向かいましょう。";
  if (!kokeshikan.memo?.includes(old2)) {
    if (!kokeshikan.memo?.includes(next2)) throw new Error("みやぎ蔵王こけし館: anchor not found");
    console.log("みやぎ蔵王こけし館: already fixed, skipping");
  } else {
    await updateSpotInItinerary(ITIN_ID, { spotId: kokeshikan.id }, { memo: kokeshikan.memo.replace(old2, next2) });
    console.log("みやぎ蔵王こけし館: closer fixed → 新地こけしの里(徒歩6分)");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
