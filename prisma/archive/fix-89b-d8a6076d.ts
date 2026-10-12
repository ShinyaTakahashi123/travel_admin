/**
 * #89 d8a6076d fix-89の直後の直し。
 * 1) 猊鼻渓の「岩手県で最初に国の名勝に指定されました」がitinerary-auditで
 *    「言い切り?」と判定(「最初」)。「とされます」でヘッジする。
 * 2) 達谷窟毘沙門堂はお堂・岩面大仏など信仰の対象がある場所のため、
 *    prayer-checkの指摘どおり配慮の一文を追加する。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const GEIBIKEI_FROM = "岩手県で最初に国の名勝に指定されました。";
const GEIBIKEI_TO = "岩手県で最初に国の名勝に指定されたとされます。";

const TAKKOKU_FROM = "拝観時間は公式サイトで確かめてから訪れましょう。";
const TAKKOKU_TO = "今も信仰の場として大切にされているので、静かに、敬意をもってお参りください。拝観時間は公式サイトで確かめてから訪れましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd8a6076d%'`);
  const itinId = rows[0].id;

  const geibikei = await findSpotInItinerary(itinId, { spotName: "猊鼻渓" });
  if (!geibikei.memo!.includes(GEIBIKEI_FROM)) throw new Error("一致しません(猊鼻渓)");
  const geibikeiNewMemo = geibikei.memo!.replace(GEIBIKEI_FROM, GEIBIKEI_TO);

  const takkoku = await findSpotInItinerary(itinId, { spotName: "達谷窟毘沙門堂" });
  if (!takkoku.memo!.includes(TAKKOKU_FROM)) throw new Error("一致しません(達谷窟)");
  const takkokuNewMemo = takkoku.memo!.replace(TAKKOKU_FROM, TAKKOKU_TO);

  console.log("猊鼻渓: OK / 達谷窟毘沙門堂: OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: geibikei.id }, { memo: geibikeiNewMemo });
  await updateSpotInItinerary(itinId, { spotId: takkoku.id }, { memo: takkokuNewMemo });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
