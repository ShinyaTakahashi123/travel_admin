/**
 * #55 66782e35の直し(4回目)。企画運営(2026-10-01 13:25)の指摘:
 * fix-55b/55cで相差海女文化資料館→神明神社(石神さん)の分数を、
 * 両者の文章がもともと一致していた「5分」にそろえたが、2点間の実際の
 * 距離(約0.7km)からすると5分では速すぎるとの指摘。実際の時間(10分)に
 * 直し、結び・書き出しの文章もそろえる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SATSUKI_FROM = "この後は、歩いておよそ5分、女性の願いを一つだけ叶えてくれるという「石神さん」へ向かいましょう。";
const SATSUKI_TO = "この後は、歩いておよそ10分、女性の願いを一つだけ叶えてくれるという「石神さん」へ向かいましょう。";

const JINJA_FROM = "相差海女文化資料館から歩いておよそ5分、神明神社の境内にある「石神さん」に着きます。";
const JINJA_TO = "相差海女文化資料館から歩いておよそ10分、神明神社の境内にある「石神さん」に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66782e35%'`);
  const itinId = rows[0].id;
  const satsuki = await findSpotInItinerary(itinId, { spotName: "相差海女文化資料館" });
  const jinja = await findSpotInItinerary(itinId, { spotName: "神明神社(石神さん)" });

  if (!satsuki.memo!.includes(SATSUKI_FROM)) throw new Error("相差海女文化資料館の文言が想定外です");
  if (!jinja.memo!.includes(JINJA_FROM)) throw new Error("神明神社の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: satsuki.id }, { memo: satsuki.memo!.replace(SATSUKI_FROM, SATSUKI_TO) });
  await updateSpotInItinerary(itinId, { spotId: jinja.id }, { memo: jinja.memo!.replace(JINJA_FROM, JINJA_TO), visitTime: t(16, 36), transitDurationMin: 10 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
