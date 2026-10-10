/**
 * #316の続き(企画運営・法務の指摘、2026-09-30 20:46〜20:50 JST)。
 * 1. 雄島の30分の中に昼食の時間が実際には無かった(散策で終わって
 *    しまう)。福浦橋(80分、実際は45〜50分ほどで足りる)を50分に縮め、
 *    その分(30分)を観瀾亭に回して、観瀾亭で昼食をとる形に組み直した。
 * 2. 五大堂の「東北地方に現存する最古の桃山建築として」のヘッジを、
 *    fix-316dで別の対応(法務指摘(1)と混同)を行った際にコードへの反映を
 *    忘れていた。ここで直す。
 * 3. 雄島に、供養の碑や祠が多く残る島である旨と、配慮・足元の一文を
 *    追加。
 *
 * 新しい時刻: 12:33雄島(30、散策のみ)→13:09観瀾亭(75、昼食込み)→
 * 14:28松島湾遊覧船(65)→15:41福浦橋(50)→16:31終了。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-316e-73f0b468.ts
 * (実行済み。福浦橋の滞在時間で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "73f0b468-46de-471e-9d7c-4e24bf3e1b10";

async function main() {
  const fukuura = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "福浦橋" },
  });
  if (fukuura.stayDurationMin !== 80) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  // 雄島: 昼食の一言を削除・配慮と足元の一文を追加
  const shimajima = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "雄島" },
  });
  const shimajimaMemo = (shimajima.memo ?? "").replace(
    "赤い橋を渡って島に入り、木々に囲まれた静かな散策路を歩いてみましょう。この先の海岸通り沿いには食事処が多いので、このあたりで昼食をとりましょう。",
    "供養の碑や祠が多く残る島です。静かに、敬意をもって歩きましょう。岩場や海沿いでは足元に気をつけましょう。赤い橋を渡って島に入り、木々に囲まれた静かな散策路を歩いてみましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: shimajima.id }, { memo: shimajimaMemo });

  // 五大堂: ヘッジ漏れを修正
  const godaido = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "五大堂" },
  });
  const godaidoMemo = (godaido.memo ?? "").replace(
    "東北地方に現存する最古の桃山建築として、",
    "東北地方に現存する最古の桃山建築とされ、"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: godaido.id }, { memo: godaidoMemo });

  // 観瀾亭: 昼食の案内を追加し、滞在を75分に
  const kanrantei = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "観瀾亭" },
  });
  const kanranteiMemo = (kanrantei.memo ?? "")
    .replace(
      "雄島からは歩いておよそ6分です。",
      "雄島からは歩いておよそ6分です。この先の海岸通り沿いには食事処が多いので、先に昼食をとりましょう。"
    )
    .replace(
      "伊達家の歴史に思いをはせながら、ひと休みしてみましょう。",
      "昼食のあとは、伊達家の歴史に思いをはせながら、ひと休みしてみましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: kanrantei.id }, {
    stayDurationMin: 75,
    memo: kanranteiMemo,
  });

  // 松島湾遊覧船: 時刻カスケード(+30分)
  const cruise = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "松島湾遊覧船" },
  });
  await updateSpotInItinerary(ITIN_ID, { spotId: cruise.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 28)),
  });

  // 福浦橋: 滞在短縮・時刻カスケード
  await updateSpotInItinerary(ITIN_ID, { spotId: fukuura.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 41)),
    stayDurationMin: 50,
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
