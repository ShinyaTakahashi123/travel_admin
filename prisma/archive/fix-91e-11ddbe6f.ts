/**
 * #91 11ddbe6f fix-91dの直し漏れ。flow-checkで2件検出。
 * 1) さんごゆんたく館(D2の最後から2番目)に「旅の締めくくりに」という、
 *    最終スポットのような結びの言葉が入っていた。実際の最後はシロの像
 *    なので削除する。
 * 2) シロの像(実際の最後)の結びが「事前に公式サイトで確かめておきましょう」
 *    のみで、flow-checkの帰りの一言の語(帰り/戻り等)に一致しなかった。
 *    「阿嘉港から船で那覇へ戻りましょう」を追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const SANGO_FROM = "旅の締めくくりに、慶良間の海のことをあらためて学んでみましょう。";
const SANGO_TO = "慶良間の海のことをあらためて学んでみましょう。";

const SHIRO_FROM = "阿嘉港からの最終便の時刻は、事前に公式サイトで確かめておきましょう。";
const SHIRO_TO = "阿嘉港から船で那覇へ戻りましょう。最終便の時刻は、事前に公式サイトで確かめておきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;

  const sango = await findSpotInItinerary(itinId, { spotName: "さんごゆんたく館" });
  const shiro = await findSpotInItinerary(itinId, { spotName: "シロの像" });

  if (!sango.memo!.includes(SANGO_FROM)) throw new Error("一致しません(さんごゆんたく館)");
  if (!shiro.memo!.includes(SHIRO_FROM)) throw new Error("一致しません(シロの像)");

  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: sango.id }, { memo: sango.memo!.replace(SANGO_FROM, SANGO_TO) });
  await updateSpotInItinerary(itinId, { spotId: shiro.id }, { memo: shiro.memo!.replace(SHIRO_FROM, SHIRO_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
