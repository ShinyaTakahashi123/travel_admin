/**
 * 法務(2026-10-01 13:26・13:29)指摘の3件を直す。
 * #105 66d185f1: ①あさぎり温泉 風の湯に入浴の一文 ②まかいの牧場・
 *   富士ミルクランドに動物ふれあいの一文(#100の入浴・動物の決まりと同じ)
 * #110 76319c13: 氷川丸「横浜船渠(現在のJMU横浜事業所)」の、今の会社名
 *   の部分を削除
 * #43 68209eb1: 産田神社「陰部に大やけどを負って亡くなった」(亡くなり方)
 *   を削除
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

type Fix = { itinPrefix: string; spotName: string; from: string; to: string };

const FIXES: Fix[] = [
  {
    itinPrefix: "66d185f1",
    spotName: "あさぎり温泉 風の湯",
    from: "岩塩を使った岩塩風呂などもあり、牧場めぐりで歩き疲れた体をゆっくりと休められます。",
    to: "岩塩を使った岩塩風呂などもあり、牧場めぐりで歩き疲れた体をゆっくりと休められます。浴場では、ほかの方が写らないよう撮影は控え、長湯を避けて水分をとりながら楽しみましょう。",
  },
  {
    itinPrefix: "66d185f1",
    spotName: "まかいの牧場",
    from: "乳搾りや子牛へのミルクやり、バターやチーズづくりなど、食にまつわる体験も豊富にそろっています。",
    to: "乳搾りや子牛へのミルクやり、バターやチーズづくりなど、食にまつわる体験も豊富にそろっています。動物とのふれあいや乳搾りは係の人の案内に従い、さわったあとは手を洗いましょう。",
  },
  {
    itinPrefix: "66d185f1",
    spotName: "富士ミルクランド",
    from: "動物とのふれあいや乳搾り体験もでき、敷地内には乳製品のショップやレストラン、花畑なども点在しています。",
    to: "動物とのふれあいや乳搾り体験もでき、ふれあいの際は係の人の案内に従い、さわったあとは手を洗いましょう。敷地内には乳製品のショップやレストラン、花畑なども点在しています。",
  },
  {
    itinPrefix: "76319c13",
    spotName: "氷川丸",
    from: "昭和5年(1930)、横浜船渠(現在のJMU横浜事業所)で建造された貨客船で、",
    to: "昭和5年(1930)、横浜船渠で建造された貨客船で、",
  },
  {
    itinPrefix: "68209eb1",
    spotName: "産田神社",
    from: "多くの神々を生んだイザナミノミコトは、最後にこの火の神を生んだ際、陰部に大やけどを負って亡くなったと日本書紀に記されており、",
    to: "多くの神々を生んだイザナミノミコトは、この火の神を生んだのちに亡くなったと日本書紀に記されており、",
  },
];

async function main() {
  let ok = 0;
  for (const fix of FIXES) {
    const label = `${fix.itinPrefix}/${fix.spotName}`;
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${fix.itinPrefix}%'`);
    if (!rows.length) { console.error(`NG: ${label}: itinerary not found`); continue; }
    const itinId = rows[0].id;
    const spot = await findSpotInItinerary(itinId, { spotName: fix.spotName });
    if (!spot.memo!.includes(fix.from)) { console.error(`NG: ${label}: 文言が想定外です`); continue; }
    console.log(`確認OK: ${label}`);
    if (COMMIT) {
      await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(fix.from, fix.to) });
      console.log(`COMMITTED: ${label}`);
    }
    ok++;
  }
  console.log(`\n合計 ${FIXES.length}件、成功 ${ok}件`);
  if (!COMMIT) console.log("確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
