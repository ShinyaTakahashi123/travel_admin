/**
 * #65 1bd66235（浦富海岸・鳥取）自分で見つけた既存の不具合。城原海岸→田後港の
 * 本文(両側とも「11分」)が、実際の移動記録(車3分)と食い違っていた。
 * 座標間の直線距離はおよそ0.8kmで、車3分の方が実態に近いと判断し、本文を3分に修正。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "1bd66235-42eb-4312-a2c0-d013aba8775f";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "城原海岸",
    "この後は、車でおよそ11分、田後港へ向かいましょう。",
    "この後は、車でおよそ3分、田後港へ向かいましょう。"
  );
  await replaceMemo(
    "浦富海岸 田後港",
    "城原海岸から車でおよそ11分、田後港に着きます。",
    "城原海岸から車でおよそ3分、田後港に着きます。"
  );

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  console.log("COMMITTED");
}
main();
