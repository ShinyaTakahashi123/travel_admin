/**
 * #128 c9b3ad40の直し(6回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営:
 * 1. 昼食がおかげ横丁(14:27〜)で遅すぎた。神宮徴古館見学のあと、
 *    倭姫文化の森・外宮参道周辺で昼食をとる形に変更(11:30〜13:30の
 *    範囲内に)。おかげ横丁の昼食の一文は外す。
 * 2. 猿田彦神社70分は長め。35分に短縮し、時刻を16:30〜17:00に合わせる。
 *
 * 法務:
 * ① 神宮徴古館の座標(国土地理院の番地の点、建物から約350mずれ)を、
 *    OSMの名前つきの点(n1420999015「神宮徴古館・農業館」
 *    34.485915,136.724860)に修正。
 * ② 倭姫宮の文中「歩いておよそ8分」が、fix-128eで22分に直した
 *    移動時間と合っていなかった(データと文の不一致)。「22分」に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const CHOKOKAN_FROM = "この後は、バスでおよそ15分、内宮へ向かいましょう。";
const CHOKOKAN_TO = "この後は、周辺で昼食をとってから、バスでおよそ15分、内宮へ向かいましょう。";

const OKAGE_FROM = "町並みを歩きながら、ここで昼食をとり、名物を味わってみましょう。";
const OKAGE_TO = "町並みを歩きながら、名物を味わってみましょう。";

const YAMATOHIME_FROM = "外宮から歩いておよそ8分、倭姫宮に着きます。";
const YAMATOHIME_TO = "外宮から歩いておよそ22分、倭姫宮に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c9b3ad40%'`);
  const itinId = rows[0].id;

  const chokokan = await findSpotInItinerary(itinId, { spotName: "神宮徴古館" });
  const naiku = await findSpotInItinerary(itinId, { spotName: "伊勢神宮内宮" });
  const okage = await findSpotInItinerary(itinId, { spotName: "おかげ横丁" });
  const sarutahiko = await findSpotInItinerary(itinId, { spotName: "猿田彦神社" });
  const yamatohime = await findSpotInItinerary(itinId, { spotName: "倭姫宮" });

  if (!chokokan.memo?.includes(CHOKOKAN_FROM)) throw new Error("神宮徴古館の文言が想定外です");
  if (!okage.memo?.includes(OKAGE_FROM)) throw new Error("おかげ横丁の文言が想定外です");
  if (!yamatohime.memo?.includes(YAMATOHIME_FROM)) throw new Error("倭姫宮の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(
    itinId,
    { spotId: chokokan.id },
    { memo: chokokan.memo!.replace(CHOKOKAN_FROM, CHOKOKAN_TO), stayDurationMin: 95, lat: 34.485915, lng: 136.72486 }
  );
  await updateSpotInItinerary(itinId, { spotId: yamatohime.id }, { memo: yamatohime.memo!.replace(YAMATOHIME_FROM, YAMATOHIME_TO) });
  await updateSpotInItinerary(itinId, { spotId: naiku.id }, { visitTime: t(13, 17) });
  await updateSpotInItinerary(
    itinId,
    { spotId: okage.id },
    { memo: okage.memo!.replace(OKAGE_FROM, OKAGE_TO), visitTime: t(15, 2) }
  );
  await updateSpotInItinerary(itinId, { spotId: sarutahiko.id }, { visitTime: t(16, 10), stayDurationMin: 35 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
