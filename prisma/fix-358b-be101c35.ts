/**
 * #358の続き。企画運営(4点)・法務(3点、記録2b6fbac)の指摘に対応。
 *
 * 企画運営:
 * 1. 池田湖の座標が度分秒を丸めた値(31.233333,130.566667)だったため、OSM way
 *    41889339「池田湖」の中心(31.234872,130.563758)に変更(法務も同じ点を指摘)。
 * 2. 説明文「九州最大のカルデラ湖」→「九州最大とされるカルデラ湖」に変更。
 *    出典: https://tabi-mag.jp/kg0108/ (このページ自体は言い切りで書いているが、
 *    「最大」は地理的な比較の主張のため、しおりえの基準に合わせヘッジする)
 * 3. 「湖畔の施設では、体長2mを超える大うなぎも見学できます」の一文を削除。
 *    出典: https://tabi-mag.jp/ikedako-paradise/ により、池田湖パラダイスが
 *    2025年8月に廃業していることを確認(ウナギの引き渡し先を探している状態で、
 *    一般公開は行われていない)。
 * 4. 枚聞神社「慶長5年(1600)、島津義弘によって奉納」は年が誤りだったため修正。
 *    出典: https://tabi-mag.jp/kg0136 により、現存する社殿は「慶長15年(1610)に
 *    島津義弘が寄進し、天明7年(1787)に8代藩主・島津重豪が改築」と判明。
 *    創建年(和銅元年・708年)も同ページの記載に基づき追記。
 *
 * 法務:
 * ② 枚聞神社の座標を、OSM way 743827330「枚聞神社」(31.207873,130.539771)に変更
 *    (OSMを先に使う決まりのため。唐船峡はOSMに施設の点がないため番地のまま)。
 * ③ 西大山駅(ホームでは線路に近づかない・列車に注意)・長崎鼻(岬の先端は岩場、
 *    足元と波に注意)に、安全の一文を追加。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-358b-be101c35.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "be101c35-1b42-40e6-bed2-50f9380da4b3";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "九州最大のカルデラ湖・池田湖と";
  const newDesc = "九州最大とされるカルデラ湖・池田湖と";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: itin.description.replace(oldDesc, newDesc) } });
    console.log("説明文: 「九州最大」をヘッジ");
  } else {
    console.log("説明文: 既に対応済み");
  }

  const ikedako = await prisma.spot.findFirstOrThrow({ where: { name: "池田湖", day: { itineraryId: ITIN_ID } } });
  const unagi = "湖畔の施設では、体長2mを超える大うなぎも見学できます。";
  if (ikedako.lat?.toString() === "31.233333" || ikedako.memo?.includes(unagi)) {
    const newMemo = (ikedako.memo ?? "").replace(unagi, "");
    await updateSpotInItinerary(ITIN_ID, { spotId: ikedako.id }, {
      lat: 31.234872,
      lng: 130.563758,
      memo: newMemo,
    });
    console.log("池田湖: 座標をOSM実点に、大うなぎの一文を削除");
  } else {
    console.log("池田湖: 既に対応済み");
  }

  const nishioyama = await prisma.spot.findFirstOrThrow({ where: { name: "西大山駅", day: { itineraryId: ITIN_ID } } });
  const oldNishi = "「本土最南端の駅」と刻まれた石碑も建っています。ホームに立ち、";
  const newNishi = "「本土最南端の駅」と刻まれた石碑も建っています。無人駅のため、ホームでは線路に近づかず、列車の通過に気をつけましょう。ホームに立ち、";
  if (nishioyama.memo?.includes(oldNishi)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: nishioyama.id }, { memo: nishioyama.memo.replace(oldNishi, newNishi) });
    console.log("西大山駅: 安全の一文を追加");
  } else {
    console.log("西大山駅: 既に対応済み");
  }

  const hiraiki = await prisma.spot.findFirstOrThrow({ where: { name: "枚聞神社", day: { itineraryId: ITIN_ID } } });
  const oldHiraiki =
    "開聞岳の麓に鎮座する神社で、創建の時期は定かではないものの、古くから「薩摩国一宮」として信仰を集めてきました。開聞岳そのものを神体山として祀ってきたと伝えられ、航海安全の神として崇められています。現在の本殿は、慶長5年(1600)に島津義弘によって奉納されたもので、宝物館には、国の重要文化財に指定されている松梅蒔絵櫛笥などが収められています。";
  const newHiraiki =
    "開聞岳の麓に鎮座する神社で、和銅元年(708)の創建と伝えられ、古くから「薩摩国一宮」として信仰を集めてきました。開聞岳そのものを神体山として祀ってきたと伝えられ、航海安全の神として崇められています。現存する社殿は、慶長15年(1610)に島津義弘によって寄進され、天明7年(1787)に8代藩主・島津重豪によって改築されたものです。宝物館には、国の重要文化財に指定されている松梅蒔絵櫛笥などが収められています。";
  if (hiraiki.memo?.includes(oldHiraiki)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: hiraiki.id }, {
      memo: hiraiki.memo.replace(oldHiraiki, newHiraiki),
      lat: 31.207873,
      lng: 130.539771,
    });
    console.log("枚聞神社: 創建・本殿の年と寄進した人を修正、座標をOSM実点に変更");
  } else {
    console.log("枚聞神社: 既に対応済み");
  }

  const nagasakibana = await prisma.spot.findFirstOrThrow({ where: { name: "長崎鼻", day: { itineraryId: ITIN_ID } } });
  const oldNaga = "海と山が織りなす景色を一望できます。静かに、敬意をもって参拝しましょう。";
  const newNaga = "海と山が織りなす景色を一望できます。岬の先端は岩場になっているため、足元と波に気をつけましょう。静かに、敬意をもって参拝しましょう。";
  if (nagasakibana.memo?.includes(oldNaga)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: nagasakibana.id }, { memo: nagasakibana.memo.replace(oldNaga, newNaga) });
    console.log("長崎鼻: 安全の一文を追加");
  } else {
    console.log("長崎鼻: 既に対応済み");
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
