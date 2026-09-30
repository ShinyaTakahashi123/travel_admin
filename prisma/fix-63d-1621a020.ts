/**
 * #63 1621a020（五箇山・白川郷）fix-63cで、野外博物館合掌造り民家園の座標を
 * 更新し忘れていた(memoやvisitTime等は直したが、lat/lngが誤った旧座標「合掌村」
 * のまま残っていた)。itinerary-audit・flow-checkの「徒歩が速すぎ/遅すぎ」の
 * 警告で発覚。正しい座標(36.255081, 136.9023)と、それに合わせた前後の移動時間・
 * 時刻に修正する。
 */
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "1621a020-b8f3-41ff-bb67-270b99f0782d";

async function main() {
  const minkaen = await findSpotInItinerary(ITIN, { spotName: "野外博物館合掌造り民家園" });
  console.log("民家園 現在lat/lng:", minkaen.lat, minkaen.lng, "→ 36.255081, 136.9023");
  console.log("民家園 現在visitTime/dur:", minkaen.visitTime?.toISOString().slice(11, 16), minkaen.transitDurationMin, "→ 14:38 / 6");

  const meisenji = await findSpotInItinerary(ITIN, { spotName: "明善寺" });
  const meisenjiFrom = "この後は、歩いておよそ7分、野外博物館合掌造り民家園へ向かいましょう。";
  const meisenjiTo = "この後は、歩いておよそ6分、野外博物館合掌造り民家園へ向かいましょう。";
  if (!meisenji.memo!.includes(meisenjiFrom)) throw new Error("一致しません(明善寺)");
  const newMeisenjiMemo = meisenji.memo!.split(meisenjiFrom).join(meisenjiTo);

  const minkaenFrom = "明善寺から歩いておよそ7分、庄川を渡った先にある野外博物館合掌造り民家園に着きます。";
  const minkaenTo = "明善寺から歩いておよそ6分、庄川を渡った先にある野外博物館合掌造り民家園に着きます。";
  if (!minkaen.memo!.includes(minkaenFrom)) throw new Error("一致しません(民家園)");
  const newMinkaenMemo = minkaen.memo!.split(minkaenFrom).join(minkaenTo);

  const tenshukaku = await findSpotInItinerary(ITIN, { spotName: "天守閣展望台" });
  console.log("天守閣展望台 現在visitTime:", tenshukaku.visitTime?.toISOString().slice(11, 16), "→ 16:11");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(ITIN, { spotId: minkaen.id }, {
    lat: 36.255081,
    lng: 136.9023,
    memo: newMinkaenMemo,
    visitTime: t(14, 38),
    transitDurationMin: 6,
  });
  await updateSpotInItinerary(ITIN, { spotId: meisenji.id }, { memo: newMeisenjiMemo });
  await updateSpotInItinerary(ITIN, { spotId: tenshukaku.id }, { visitTime: t(16, 11) });
  console.log("COMMITTED");
}
main();
