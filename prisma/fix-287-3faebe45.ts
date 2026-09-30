/**
 * チェックリスト #287 の修正記録(見直し)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * 本番でDay1の終了が15:10と、決まり2(16:30〜17:00)に届いていなかった。ユーザーの
 * 方針(「近くに実在の行き先が足りない」は例外にしない)にもとづき、実在するスポット
 * つつじヶ丘公園(ロープウェイのつつじヶ丘駅を中心とするエリア)をDay1の最後に追加。
 *
 * 事実確認(直接開いたURL):
 * - https://www.ibarakiguide.jp/spot.php?mode=detail&code=836
 *   (ツツジの名所、開花時期「4月下旬頃山麓より咲きだし、5月中旬頃には筑波山頂で
 *   見られます」)
 * - https://360navi.com/ibaraki/tsukuba/tsukuba-tsutsu/
 *   (ロープウェイ乗り場・登山口として利用される観光拠点、レストラン・土産物店・
 *   駐車場を完備)
 *
 * 既存の3か所(男体山山頂・女体山山頂・筑波山ロープウェイの各区間)にitinerary-audit.cjs
 * の「徒歩が遅すぎ(水増し?)」警告が出ていたが、公式サイト
 * https://mt-tsukuba.com/hiking/summit-connector/ で御幸ヶ原⇔男体山が300m/15分、
 * 御幸ヶ原⇔女体山が550m/15分と確認でき(男体山⇔女体山の850m/35分は御幸ヶ原経由の
 * 合算と一致)、実際の岩場の多い山道の公式所要時間に沿った値と判断。水増しではない
 * ため、時間は変更しない。
 *
 * つつじヶ丘公園の追加にともない、宿の一言を筑波山ロープウェイからつつじヶ丘公園
 * (Day1の新しい最後のスポット)へ移動。
 *
 * 座標はOSM Nominatim(つつじヶ丘, aerialway station)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287-3faebe45.ts
 * (実行済み。つつじヶ丘公園の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "つつじヶ丘公園")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const ropeway = day1.spots.find((s) => s.name === "筑波山ロープウェイ")!;
  const others = day1.spots.filter((s) => s.id !== ropeway.id);
  const yadoLine = "つつじヶ丘からは、今夜宿泊する山麓の宿へ向かいましょう。";
  const ropewayMemoWithoutYado = ropeway.memo!.replace(" " + yadoLine, "").replace(yadoLine, "");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        ...others.map((s) => ({ id: s.id, data: {} })),
        { id: ropeway.id, data: { memo: ropewayMemoWithoutYado } },
        {
          create: {
            name: "つつじヶ丘公園",
            address: "つくば市筑波",
            lat: 36.2198068,
            lng: 140.118879,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 13)),
            stayDurationMin: 80,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "筑波山ロープウェイの山麓側、つつじヶ丘駅を中心に広がるエリアです。名前のとおりツツジの名所として知られ、4月下旬から5月中旬ごろには一帯が彩られます。レストランや土産物店が並び、関東平野を見渡す眺めも楽しめます。 " +
              yadoLine,
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
