/**
 * #328の続き。fix-328c実行後の再確認で3件を検出(自己チェック)。
 * 1) 竹下通りの書き出しが「明治神宮からは」のままで、実際の直前の
 *    スポット(明治神宮ミュージアム)と食い違っていた→修正。
 * 2) 表参道→根津美術館(直線距離およそ1.5km)をtransit10分と宣言して
 *    いたが速すぎた→18分に直した(表参道駅からの現地の案内でも
 *    8〜10分とされるが、座標間の直線距離とは経路が異なるため、
 *    安全側の時間にした)。
 * 3) 根津美術館→キャットストリートの間隔が実際は30分だったが、
 *    transitを15分と宣言していたため不一致だった→30分に直した。
 * あわせて、17:00を超えないよう根津美術館35分→30分、渋谷スクランブル
 * スクエア58分→40分に整えた(観覧自体は既存の内容で十分楽しめる長さ)。
 *
 * 法務2026-10-01 03:24の任意の提案: 竹下通りに人混みの注意書きを追加。
 *
 * 企画運営2026-10-01 03:25の指摘: 明治神宮・表参道の本文にある「太平洋
 * 戦争末期の東京大空襲で焼失」は不正確。「東京大空襲」は通常、
 * 昭和20年(1945)3月10日の空襲を指すが、明治神宮の社殿や表参道の
 * ケヤキが焼けたのはそのあとの4〜5月の空襲とされる(明治神宮公式の
 * 説明に準拠)。「東京大空襲」の語を使わず「昭和20年(1945)の空襲で
 * 焼失しましたが」に直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-328d-8d044992.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "8d044992-9b50-48ea-9beb-05be5076a217";

async function main() {
  const jingu = await prisma.spot.findFirstOrThrow({ where: { name: "明治神宮", day: { itineraryId: ITIN_ID } } });
  {
    const old = "太平洋戦争末期の東京大空襲で焼失しましたが、";
    const next = "昭和20年(1945)の空襲で焼失しましたが、";
    if (jingu.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: jingu.id }, { memo: jingu.memo.replace(old, next) });
      console.log("jingu updated");
    }
  }

  const omotesando = await prisma.spot.findFirstOrThrow({ where: { name: "表参道", day: { itineraryId: ITIN_ID } } });
  {
    const old = "太平洋戦争末期の東京大空襲で多くが焼失しましたが、";
    const next = "昭和20年(1945)の空襲で多くが焼失しましたが、";
    if (omotesando.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: omotesando.id }, { memo: omotesando.memo.replace(old, next) });
      console.log("omotesando updated");
    }
  }

  const takeshita = await prisma.spot.findFirstOrThrow({ where: { name: "竹下通り", day: { itineraryId: ITIN_ID } } });
  {
    const old = "明治神宮からは歩いておよそ12分です。竹下通りは、";
    const next =
      "明治神宮ミュージアムからは歩いておよそ12分です。人通りが多いので、はぐれないように気をつけましょう。竹下通りは、";
    if (takeshita.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: takeshita.id }, { memo: takeshita.memo.replace(old, next) });
      console.log("takeshita updated");
    }
  }

  const nezu = await prisma.spot.findFirstOrThrow({ where: { name: "根津美術館", day: { itineraryId: ITIN_ID } } });
  {
    const old = "表参道からは歩いておよそ10分です。";
    const next = "表参道からは歩いておよそ18分です。";
    const memo = nezu.memo?.includes(old) ? nezu.memo.replace(old, next) : nezu.memo;
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: nezu.id },
      { memo, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 25)), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 18 }
    );
    console.log("nezu updated");
  }

  const catstreet = await prisma.spot.findFirstOrThrow({ where: { name: "キャットストリート", day: { itineraryId: ITIN_ID } } });
  {
    const old = "根津美術館からは歩いておよそ15分です。";
    const next = "根津美術館からは歩いておよそ30分です。";
    const memo = catstreet.memo?.includes(old) ? catstreet.memo.replace(old, next) : catstreet.memo;
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: catstreet.id },
      { memo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 25)), transitMode: "walk", transitDurationMin: 30 }
    );
    console.log("catstreet updated");
  }

  const center = await prisma.spot.findFirstOrThrow({ where: { name: "渋谷センター街", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: center.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 40)) });
  console.log("center updated");

  const sky = await prisma.spot.findFirstOrThrow({ where: { name: "渋谷スクランブルスクエア", day: { itineraryId: ITIN_ID } } });
  await updateSpotInItinerary(ITIN_ID, { spotId: sky.id }, { visitTime: new Date(Date.UTC(1970, 0, 1, 16, 15)), stayDurationMin: 40 });
  console.log("sky updated");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
