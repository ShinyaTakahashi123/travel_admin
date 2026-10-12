/**
 * #113 79db7413の直し(3回目)。
 * 1. flow-check.cjsで五稜郭タワー(Day1最後・最終日ではない)に宿の
 *    一言がないとの指摘。追加する。
 * 2. 五稜郭公園・五稜郭タワーの本文に残っていた案内口調
 *    (「確かめてみてください」)を「確かめてみましょう」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KOEN_FROM = "次に訪れる五稜郭タワーからの俯瞰であらためてその形を確かめてみてください。";
const KOEN_TO = "次に訪れる五稜郭タワーからの俯瞰であらためてその形を確かめてみましょう。";

const TOWER_FROM = "先ほど歩いた堀の全景を、今度は上空から確かめてみてください。";
const TOWER_TO = "先ほど歩いた堀の全景を、今度は上空から確かめてみましょう。今夜は函館市内の宿に泊まり、旅の疲れを癒やしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '79db7413%'`);
  const itinId = rows[0].id;
  const koen = await findSpotInItinerary(itinId, { spotName: "五稜郭公園" });
  const tower = await findSpotInItinerary(itinId, { spotName: "五稜郭タワー" });

  if (!koen.memo!.includes(KOEN_FROM)) throw new Error("五稜郭公園の文言が想定外です");
  if (!tower.memo!.includes(TOWER_FROM)) throw new Error("五稜郭タワーの文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: koen.id }, { memo: koen.memo!.replace(KOEN_FROM, KOEN_TO) });
  await updateSpotInItinerary(itinId, { spotId: tower.id }, { memo: tower.memo!.replace(TOWER_FROM, TOWER_TO) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
