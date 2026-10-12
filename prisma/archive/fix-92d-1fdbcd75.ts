/**
 * #92 1fdbcd75 見直しの仕上げ。北海道大学・サッポロビール博物館の書き出しに
 * 話し言葉・宣伝口調("〜へ。"止め、"足を延ばしてみましょう"、"おすすめです")が
 * 残っていたため、他のスポットと同じ「前のスポットから[手段]で[時間]、
 * [スポット名]に着きます。」の形にそろえる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const HOKUDAI_FROM =
  "お腹を満たしたら、広々としたキャンパスが自慢の北海道大学へ。前身は";
const HOKUDAI_TO = "札幌市中央卸売市場場外市場から歩いておよそ20分、北海道大学に着きます。前身は";

const HOKUDAI_TAIL_FROM = "広い敷地なので、歩きやすい靴で訪れるのがおすすめです。";
const HOKUDAI_TAIL_TO = "広い敷地なので、歩きやすい靴で訪れましょう。この後は、地下鉄でおよそ15分、サッポロビール博物館へ向かいましょう。";

const BEER_FROM = "北大散策のあとは、サッポロビール博物館へ足を延ばしてみましょう。ビール博物館としては";
const BEER_TO = "北海道大学から地下鉄でおよそ15分、サッポロビール博物館に着きます。ビール博物館としては";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1fdbcd75%'`);
  const itinId = rows[0].id;

  const hokudai = await findSpotInItinerary(itinId, { spotName: "北海道大学" });
  const beer = await findSpotInItinerary(itinId, { spotName: "サッポロビール博物館" });

  const check = (memo: string | null, from: string, label: string) => {
    if (!memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(hokudai.memo, HOKUDAI_FROM, "北大冒頭");
  check(hokudai.memo, HOKUDAI_TAIL_FROM, "北大結び");
  check(beer.memo, BEER_FROM, "ビール博物館冒頭");

  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hokudai.id }, {
    memo: hokudai
      .memo!.replace(HOKUDAI_FROM, HOKUDAI_TO)
      .replace(HOKUDAI_TAIL_FROM, HOKUDAI_TAIL_TO),
  });
  await updateSpotInItinerary(itinId, { spotId: beer.id }, { memo: beer.memo!.replace(BEER_FROM, BEER_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
