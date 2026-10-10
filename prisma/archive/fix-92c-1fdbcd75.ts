/**
 * #92 1fdbcd75 flow-checkで2件検出。
 * 1) 1日目に昼食の一言がない。サッポロビール博物館(11:56〜12:58、窓の中)に
 *    追加する。
 * 2) 円山公園(最後の場所、日帰り)に帰りの一言がない。地下鉄「円山公園駅」が
 *    すぐそばにあるため、そこから戻る一言を追加する。あわせて、口調が
 *    やや話し言葉的だった部分もふつうの書き方に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const BEER_FROM = "見学のあとに有料のガイドツアーへ申し込めば、工場直送のできたてビールを味わうこともできます。";
const BEER_TO =
  "見学のあとにガイドツアーへ申し込めば、工場直送のできたてビールを味わうこともできます。館内の売店やレストランで昼食にするのもよいでしょう。";

const MARUYAMA_FROM =
  "1日さんぽの締めくくりは、緑豊かな円山公園でのんびり過ごしましょう。ここはもともと";
const MARUYAMA_TO = "緑豊かな円山公園に着きます。ここはもともと";

const MARUYAMA_TAIL_FROM = "散策で気持ちよく汗を流したら、今日1日の札幌さんぽもここで締めくくりです。";
const MARUYAMA_TAIL_TO = "地下鉄東西線「円山公園駅」から戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '1fdbcd75%'`);
  const itinId = rows[0].id;

  const beer = await findSpotInItinerary(itinId, { spotName: "サッポロビール博物館" });
  const maruyama = await findSpotInItinerary(itinId, { spotName: "円山公園（札幌）" });

  const check = (memo: string | null, from: string, label: string) => {
    if (!memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(beer.memo, BEER_FROM, "ビール博物館");
  check(maruyama.memo, MARUYAMA_FROM, "円山公園冒頭");
  check(maruyama.memo, MARUYAMA_TAIL_FROM, "円山公園結び");

  console.log("OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: beer.id }, { memo: beer.memo!.replace(BEER_FROM, BEER_TO) });
  await updateSpotInItinerary(itinId, { spotId: maruyama.id }, {
    memo: maruyama
      .memo!.replace(MARUYAMA_FROM, MARUYAMA_TO)
      .replace(MARUYAMA_TAIL_FROM, MARUYAMA_TAIL_TO),
  });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
