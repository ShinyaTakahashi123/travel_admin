/**
 * #352の続き。企画運営14:33の3点・法務14:34の3点に対応。
 *
 * 【企画運営】
 * 1. 護佐丸の墓は中城城跡の城郭内ではなく、城郭の東およそ200mの台城(久場)
 *    にあることが判明(「城内には…護佐丸の墓もあります」は誤り)。本文を
 *    城外の記述に修正。
 *    出典: https://kojodan.jp/castle/105/ (「城郭の200メートルほど東には
 *    護佐丸の墓があります」)
 * 2. 安良波公園・アラハビーチ→中城城跡の「車でおよそ12分」は、実際の
 *    道のり(北谷町から北中城村・中城村までの一般的な所要時間20〜30分)を
 *    踏まえ、25分に修正。後続の時刻も再計算。
 * 3. 中城城跡の駐車場に停めた車で中村家住宅まで歩いたため、帰りの一言に
 *    「中城城跡の駐車場まで歩いて戻り」を追加。
 *
 * 【法務】
 * ① 表紙(itinerary.thumbnailUrl)が、スポットの写真を差し替えたあとも
 *    解体済みの観覧車の旧写真のままだった判明(スポット写真とは別の
 *    固定フィールドのため、連動して更新されない)。fix-352dで新規保存した
 *    Depot Islandの写真URLに更新。
 * ② 石垣の上からの眺めに、高さ・足元注意の一言と、城内の拝所への
 *    「静かに、敬意をもって」の配慮の一文を追加。
 * ③ 中城城跡の座標26.283934,127.80116は、実は案内板のOSM点(node
 *    12423476558)だったと法務の指摘で判明。正しい「中城城跡」のOSM点
 *    (node 11030950726、26.285886,127.803547)に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-352g-b81511f9.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "b81511f9-78dc-4833-99a4-ab6ed8662c71";

async function main() {
  const araha = await prisma.spot.findFirstOrThrow({ where: { name: "安良波公園・アラハビーチ", day: { itineraryId: ITIN_ID } } });
  const nakagusuku = await prisma.spot.findFirstOrThrow({ where: { name: "中城城跡", day: { itineraryId: ITIN_ID } } });
  const nakamura = await prisma.spot.findFirstOrThrow({ where: { name: "中村家住宅", day: { itineraryId: ITIN_ID } } });

  if (nakagusuku.transitDurationMin === 25) {
    console.log("already applied, skipping");
    return;
  }

  const arahaOld = "見学を終えたら、車でおよそ12分の中城城跡へ向かいましょう。";
  const arahaNext = "見学を終えたら、車でおよそ25分の中城城跡へ向かいましょう。";
  if (araha.memo?.includes(arahaOld)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: araha.id }, { memo: araha.memo.replace(arahaOld, arahaNext) });
  }

  let nakagusukuNewMemo = nakagusuku.memo!.replace(
    "安良波公園・アラハビーチを見学したら、車でおよそ12分の中城城跡へ向かいましょう。",
    "安良波公園・アラハビーチを見学したら、車でおよそ25分の中城城跡へ向かいましょう。"
  );
  nakagusukuNewMemo = nakagusukuNewMemo.replace(
    "城内には、生活用水に使われたとされる大きな井戸「大井戸(ウフガー)」や、名将として知られた城主・護佐丸の墓もあります。",
    "城内には、生活用水に使われたとされる大きな井戸「大井戸(ウフガー)」があります。城郭の東およそ200mには、名将として知られた城主・護佐丸の墓(台城)もあります。"
  );
  nakagusukuNewMemo = nakagusukuNewMemo.replace(
    "石垣の上からは、太平洋と東シナ海の両方を見渡すことができます。",
    "石垣の上からは、太平洋と東シナ海の両方を見渡すことができますが、高さがありますので、足元に十分気をつけましょう。城内には今も拝まれている拝所がありますので、静かに、敬意をもって見学しましょう。"
  );
  if (!nakagusukuNewMemo.includes("車でおよそ25分")) throw new Error("中城城跡: 書き出しの置換に失敗");
  if (!nakagusukuNewMemo.includes("台城")) throw new Error("中城城跡: 護佐丸の墓の記述の置換に失敗");
  if (!nakagusukuNewMemo.includes("足元に十分気をつけましょう")) throw new Error("中城城跡: 高さ注意の一言の追加に失敗");
  if (!nakagusukuNewMemo.includes("敬意をもって")) throw new Error("中城城跡: 配慮の一文の追加に失敗");

  const nakamuraOld = "帰りは、借りたレンタカーで那覇空港まで戻りましょう。";
  const nakamuraNext = "帰りは、中城城跡の駐車場まで歩いて戻り、借りたレンタカーで那覇空港まで戻りましょう。";
  if (!nakamura.memo?.includes(nakamuraOld)) throw new Error("中村家住宅: 帰りの一言の anchor が見つからない");

  const THUMBNAIL_URL =
    "https://wcusx5jx7xunweql.public.blob.vercel-storage.com/official-areas-17/mihama-depot-island-u119HGlSu9oGWymjL2jwDWtHrgbPcO.jpg";

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: nakagusuku.id },
      data: {
        memo: nakagusukuNewMemo,
        transitDurationMin: 25,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 35)),
        lat: 26.285886,
        lng: 127.803547,
      },
    }),
    prisma.spot.update({
      where: { id: nakamura.id },
      data: { memo: nakamura.memo!.replace(nakamuraOld, nakamuraNext), visitTime: new Date(Date.UTC(1970, 0, 1, 16, 4)) },
    }),
    prisma.itinerary.update({ where: { id: ITIN_ID }, data: { thumbnailUrl: THUMBNAIL_URL } }),
  ]);

  console.log("#352: 護佐丸の墓の記述・移動時間25分・駐車場の案内・高さ注意/拝所の配慮・座標・表紙を修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
