/**
 * #106 6ba2fc04の直し(6回目)。itinerary-audit.cjsで、天橋立→智恩寺の
 * 「歩いておよそ10分」が実際の距離(1.4km)に対して速すぎると判明
 * (1.4km/10分は時速8.4km、徒歩としては非現実的)。18分に直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HASHIDATE_FROM = "この後は、歩いておよそ10分、智恩寺へ向かいましょう。";
const HASHIDATE_TO = "この後は、歩いておよそ18分、智恩寺へ向かいましょう。";

const CHIONJI_FROM = "天橋立から歩いておよそ10分、文珠地区にある智恩寺に着きます。";
const CHIONJI_TO = "天橋立から歩いておよそ18分、文珠地区にある智恩寺に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6ba2fc04%'`);
  const itinId = rows[0].id;

  const hashidate = await findSpotInItinerary(itinId, { spotName: "天橋立" });
  const chionji = await findSpotInItinerary(itinId, { spotName: "智恩寺" });
  const orimaki = await findSpotInItinerary(itinId, { spotName: "ちりめん織機展示・実演場" });
  const kayaekisha = await findSpotInItinerary(itinId, { spotName: "旧加悦鉄道加悦駅舎（加悦鉄道資料館）" });
  const chirimen = await findSpotInItinerary(itinId, { spotName: "ちりめん街道" });

  if (!hashidate.memo!.includes(HASHIDATE_FROM)) throw new Error("天橋立の文言が想定外です");
  if (!chionji.memo!.includes(CHIONJI_FROM)) throw new Error("智恩寺の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hashidate.id }, { memo: hashidate.memo!.replace(HASHIDATE_FROM, HASHIDATE_TO) });
  await updateSpotInItinerary(itinId, { spotId: chionji.id }, { memo: chionji.memo!.replace(CHIONJI_FROM, CHIONJI_TO), transitDurationMin: 18 });
  await updateSpotInItinerary(itinId, { spotId: orimaki.id }, { visitTime: t(14, 45) });
  await updateSpotInItinerary(itinId, { spotId: kayaekisha.id }, { visitTime: t(15, 29) });
  await updateSpotInItinerary(itinId, { spotId: chirimen.id }, { visitTime: t(16, 9) });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
