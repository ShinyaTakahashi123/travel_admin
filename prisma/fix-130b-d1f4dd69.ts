/**
 * #130 d1f4dd69の直し(2回目、自己点検)。fix-130で書いた亀石・橘寺の文が、
 * 27a60951(同じ明日香村の既存しおり)の文とかなり近い構成・言い回しに
 * なっていたため、報告前に気づいて書き直す。
 *
 * 橘寺は27a60951が「七大寺・四天王寺式伽藍・二面石(善悪)」を中心に
 * 書いていたため、本尊の聖徳太子坐像(重要文化財)・三光石・蓮華塚・
 * 往生院の天井画を中心にし、二面石は脇に回した(出典:
 * news.mynavi.jp/article/20211224-2238196/、tabi-mag.jp/na0079/)。
 * 亀石は同じ伝説(西を向くと泥の海)が避けられないため、文の構成と
 * 言い回しを変えた。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KAMEISHI_FROM =
  "地元には「この亀が西を向いたとき、奈良盆地は泥の海になる」という言い伝えも残っており、飛鳥ならではの不思議な魅力を感じられるスポットです。";
const KAMEISHI_TO =
  "亀が今の東向きから西へ向きを変えると、このあたり一面が泥の海に沈むという言い伝えも残っており、飛鳥ならではの不思議な魅力を感じられるスポットです。";

const TACHIBANADERA_MEMO =
  "亀石から歩いておよそ8分、橘寺に着きます。聖徳太子がお生まれになったと伝えられる地に建つ寺で、正式には仏頭山上宮皇院菩提寺という名を持っています。本堂にあたる太子殿には、室町時代につくられた重要文化財の聖徳太子坐像が本尊として祀られています。境内には、お告げを聞いた聖徳太子に日・月・星の光が差したという伝説の石「三光石」や、大化の改新の際に田畑の基準として使われたという塚「蓮華塚」も残されています。すぐそばの往生院では、天井を埋める260枚の花の天井画を見ることができ、全国から奉納された一枚一枚を眺めて歩くのも見どころです。参道近くの「二面石」も、一方は穏やかな顔、もう一方は険しい顔を持つ、飛鳥らしい石造物として知られています。太子ゆかりの祈りの場でもありますので、敬意を持ってお参りしましょう。この後は、歩いておよそ6分、飛鳥京跡へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd1f4dd69%'`);
  const itinId = rows[0].id;

  const kameishi = await findSpotInItinerary(itinId, { spotName: "亀石" });
  const tachibanadera = await findSpotInItinerary(itinId, { spotName: "橘寺" });

  if (!kameishi.memo?.includes(KAMEISHI_FROM)) throw new Error("亀石の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kameishi.id }, { memo: kameishi.memo!.replace(KAMEISHI_FROM, KAMEISHI_TO) });
  await updateSpotInItinerary(itinId, { spotId: tachibanadera.id }, { memo: TACHIBANADERA_MEMO });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
