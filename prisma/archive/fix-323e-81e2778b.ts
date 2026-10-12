/**
 * #323の続き。企画運営2026-10-01 01:23の2点。
 * 1) 帰りの一言: 湯之平展望所のメモ末尾に既にあり
 *    (「見学を終えたら、バスで桜島港まで戻り(およそ25分)、フェリーで
 *    鹿児島市街へ戻りましょう(およそ15分)。」fix-323cで追加済み)。
 *    バスの時刻を確認(ekitan.com、湯之平展望所発・桜島港行き、平日):
 *    16時10分・16時40分、17時10分(最終)。見学終了16:30の直後に乗れる
 *    16:40発は最終便ではなく、後続の17:10発も余裕がある。本文には
 *    時刻を書かず(決まり9)、変更は不要と判断。
 * 2) 烏島展望所→赤水展望広場(0.6km)は、30分間隔のバスを待つより徒歩
 *    10分の方が現実的なため、バス25分→徒歩10分に変更。浮いた15分は、
 *    赤水展望広場にある記念モニュメント「叫びの肖像」の説明を加えて
 *    実在の内容で埋めた(滞在40分→55分。決まりA、時間を延ばすだけの
 *    水増しではなく新しい実在内容を追加)。後続の湯之平展望所の時刻は
 *    結果として変わらない(15:50着・16:30終了のまま)。
 *
 * 事実確認(いずれも直接開いて確認):
 * - sakurajima.gr.jp/spot/4093.html: 赤水展望広場は平成16年(2004)の
 *   長渕剛のオールナイトコンサート跡地を整備。記念モニュメント
 *   「叫びの肖像」はおよそ50tの桜島溶岩を使用、彫刻家・大成浩が制作
 * - ekitan.com(湯之平展望所発・桜島港行き時刻表): 16:10・16:40・17:10
 *   (最終)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-323e-81e2778b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "81e2778b-4a9f-4594-93a2-1bde60bae8ca";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const karasujima = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "烏島展望所" } });
  {
    const old = "続いては、バスでおよそ25分の赤水展望広場へ向かいましょう。";
    const next = "続いては、歩いておよそ10分の赤水展望広場へ向かいましょう。";
    if (karasujima.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: karasujima.id }, { memo: karasujima.memo.replace(old, next) });
    }
  }

  const akamizu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "赤水展望広場" } });
  if (akamizu.transitMode !== "walk") {
    const newMemo =
      "烏島展望所からは歩いておよそ10分です。赤水展望広場は、平成16年(2004)に行われた、鹿児島出身の歌手・長渕剛によるオールナイトコンサートの跡地を整備してつくられた広場です。園内には、およそ50トンの桜島溶岩を使い、彫刻家・大成浩が制作した記念モニュメント「叫びの肖像」が置かれています。桜島に向かって声を上げる姿をかたどった作品で、訪れた人が桜島に向かって叫んでみることも呼びかけられています。錦江湾と桜島の眺めとあわせて、モニュメントを眺めてみましょう。続いては、次のバスまでの待ち時間を含めてバスでおよそ25分の湯之平展望所へ向かいましょう。";
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: akamizu.id },
      {
        memo: newMemo,
        visitTime: new Date(Date.UTC(1970, 0, 1, 14, 30)),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 10,
      }
    );
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: akamizu.id } });
    await prisma.spotTransitLeg.create({
      data: { spotId: akamizu.id, orderNo: 1, transitMode: "walk", transitDurationMin: 10 },
    });
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
