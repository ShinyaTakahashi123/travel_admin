/**
 * #126 c898c3d9の直し(3回目)。自己点検で気づいた修正: 言い切りの語(三名・
 * 最大・初めて)に対する伝聞の語が、同じ文の中にない箇所が2つあった
 * (偕楽園「日本三名園の一つに数えられる」、アクアワールド「県内最大級の
 * 水族館で」「日本で初めて繁殖に成功した種」)。audit.cjsはメモ全体での
 * 判定のため検知しなかったが、法務の基準(#360の指摘、同じ文の中に伝聞の
 * 語が必要)に合わせ、同じ文の中に伝聞の語を入れる。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const KAIRAKUEN_FROM = "日本三名園の一つに数えられる大名庭園です。";
const KAIRAKUEN_TO = "日本三名園の一つとされる大名庭園です。";

const AQUA_FROM1 = "県内最大級の水族館で、";
const AQUA_TO1 = "県内最大級とされる水族館で、";
const AQUA_FROM2 = "日本で初めて繁殖に成功した種も少なくありません。";
const AQUA_TO2 = "日本で初めて繁殖に成功したとされる種も少なくありません。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c898c3d9%'`);
  const itinId = rows[0].id;
  const kairakuen = await findSpotInItinerary(itinId, { spotName: "偕楽園" });
  const aqua = await findSpotInItinerary(itinId, { spotName: "アクアワールド茨城県大洗水族館" });

  if (!kairakuen.memo?.includes(KAIRAKUEN_FROM)) throw new Error("偕楽園の文言が想定外です");
  if (!aqua.memo?.includes(AQUA_FROM1) || !aqua.memo?.includes(AQUA_FROM2)) throw new Error("アクアワールドの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: kairakuen.id }, { memo: kairakuen.memo!.replace(KAIRAKUEN_FROM, KAIRAKUEN_TO) });
  await updateSpotInItinerary(
    itinId,
    { spotId: aqua.id },
    { memo: aqua.memo!.replace(AQUA_FROM1, AQUA_TO1).replace(AQUA_FROM2, AQUA_TO2) }
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
