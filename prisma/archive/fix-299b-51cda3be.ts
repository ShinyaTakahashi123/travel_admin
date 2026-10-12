/**
 * チェックリスト #299 の修正記録(2巡目、法務指摘4点)。
 * しおり「花と丘の絶景を巡る、富良野・美瑛のフォトジェニック旅」
 * (51cda3be-9832-4e7b-ac74-42bb780ebb89)
 *
 * 1. 写真の誤添付: 四季彩の丘の写真(Wikimedia Commons「四季彩の丘-01.JPG」、Captain76)が、
 *    美瑛の丘(パッチワークの路)・三愛の丘展望公園にも誤って付いていたため、その2か所
 *    から削除(四季彩の丘自身の写真はそのまま)。
 * 2. 美瑛の丘(パッチワークの路): 畑は農家の方の土地であるという注意を追加。
 * 3. ニングルテラス: 喫茶店「珈琲 森の時計」の店名を削除し、店名を出さない表現に修正。
 * 4. 麓郷の森: 「青い池から林道を進むと着く」という書き方が、実際の経路(道道経由の
 *    車移動、検索で確認)と異なっていたため、「青い池から車で1時間ほど、山あいの道を
 *    抜けて着くのが」に修正。
 *
 * itinerary-audit.cjs・prayer-check.cjs 再確認済み(問題なし)。法✅(cba69c7)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-299b-51cda3be.ts
 * (実行済み。各処理は現在の内容を確かめてから行うため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "51cda3be-9832-4e7b-ac74-42bb780ebb89";
const MISMATCHED_SOURCE = "https://commons.wikimedia.org/wiki/File:%E5%9B%9B%E5%AD%A3%E5%BD%A9%E3%81%AE%E4%B8%98-01.JPG";

async function main() {
  const patchwork = await findSpotInItinerary(ITIN_ID, { spotName: "美瑛の丘（パッチワークの路）" });
  const sanai = await findSpotInItinerary(ITIN_ID, { spotName: "三愛の丘展望公園" });

  for (const spotId of [patchwork.id, sanai.id]) {
    const photo = await prisma.photo.findFirst({ where: { spotId, sourceUrl: MISMATCHED_SOURCE } });
    if (photo) await prisma.photo.delete({ where: { id: photo.id } });
  }

  const patchworkRow = await prisma.spot.findUniqueOrThrow({ where: { id: patchwork.id } });
  if (!patchworkRow.memo?.includes("畑は農家の方の土地")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: patchwork.id },
      {
        memo: patchworkRow.memo!.replace(
          "少し車を停めて丘を歩いてみると、また違う角度からの一枚に出会えることもあります。",
          "少し車を停めて丘を歩いてみると、また違う角度からの一枚に出会えることもあります。畑は農家の方の土地なので中には入らず、車は決められた駐車場に停めましょう。"
        ),
      }
    );
  }

  const ningle = await findSpotInItinerary(ITIN_ID, { spotName: "新富良野プリンスホテル・ニングルテラス" });
  const ningleRow = await prisma.spot.findUniqueOrThrow({ where: { id: ningle.id } });
  if (ningleRow.memo?.includes("珈琲 森の時計")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: ningle.id },
      {
        memo: ningleRow.memo.replace(
          "なかでも『優しい時間』のロケ地だった喫茶店「珈琲 森の時計」は、撮影後も変わらず営業を続けています。",
          "なかでも『優しい時間』のロケ地だった喫茶店も、撮影後から変わらず営業を続けています。"
        ),
      }
    );
  }

  const rokugo = await findSpotInItinerary(ITIN_ID, { spotName: "麓郷の森" });
  const rokugoRow = await prisma.spot.findUniqueOrThrow({ where: { id: rokugo.id } });
  if (rokugoRow.memo?.includes("林道を進むと着く")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: rokugo.id },
      { memo: rokugoRow.memo.replace("青い池から林道を進むと着くのが", "青い池から車で1時間ほど、山あいの道を抜けて着くのが") }
    );
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
