/**
 * #51 24469e72（いわき）企画運営の指摘4点(11:35に依頼、報告が漏れていたため今回対応)。
 * 1) 塩屋埼灯台: 美空ひばり「みだれ髪」の歌詞の直接引用「塩屋の岬」をやめ、歌手と曲名のみに。
 * 2) さはこの湯: 「新たなシンボル」という言い切りを和らげ、日の最後(単日プラン)に
 *    帰りの一言を追加。
 * 3) アクアマリンふくしま: 「車でお越しの場合は」の唐突な一文を削除。
 * 4) 説明文: 「ハワイアンズとは違う」という他施設との比較表現を削除。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const ITIN = "24469e72-101c-4fcc-99e3-2d736d0c8ffb";

async function replaceMemo(name: string, from: string, to: string) {
  const spot = await findSpotInItinerary(ITIN, { spotName: name });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${name}): ${from}`);
  const newMemo = spot.memo!.split(from).join(to);
  console.log(`${name}: OK`);
  if (COMMIT) await updateSpotInItinerary(ITIN, { spotId: spot.id }, { memo: newMemo });
}

async function main() {
  await replaceMemo(
    "塩屋埼灯台",
    "故・美空ひばりの名曲「みだれ髪」の歌詞に「塩屋の岬」と歌われたことから「ひばり灯台」の愛称でも親しまれ",
    "故・美空ひばりの名曲「みだれ髪」で歌われたことから「ひばり灯台」の愛称でも親しまれ"
  );
  await replaceMemo(
    "さはこの湯",
    "「火の見櫓」を配置したいわき湯本温泉の新たなシンボルです。",
    "「火の見櫓」を配置した、いわき湯本温泉を代表する建物の一つです。"
  );
  await replaceMemo(
    "さはこの湯",
    "ほかの入浴客を撮影したり、施設の決まりに反したりしないようにしましょう。",
    "ほかの入浴客を撮影したり、施設の決まりに反したりしないようにしましょう。お帰りは、JR常磐線「湯本駅」(徒歩およそ10分)からご利用ください。"
  );
  await replaceMemo(
    "アクアマリンふくしま",
    "小名浜港にあるアクアマリンふくしまは、平成12年(2000)に開館した水族館です。車でお越しの場合は、専用駐車場に車を置いて見学しましょう。",
    "小名浜港にあるアクアマリンふくしまは、平成12年(2000)に開館した水族館です。"
  );

  const DESC_FROM = "黒潮と親潮が出会う「潮目の海」を再現したアクアマリンふくしま。ハワイアンズとは違う、いわきの海の生き物と出会うプランです。";
  const DESC_TO = "黒潮と親潮が出会う「潮目の海」を再現したアクアマリンふくしまで、いわきの海の生き物と出会うプランです。";
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN } });
  if (!itin.description!.includes(DESC_FROM)) throw new Error("一致しません(説明文)");
  console.log("説明文: OK");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITIN }, data: { description: itin.description!.split(DESC_FROM).join(DESC_TO) } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
