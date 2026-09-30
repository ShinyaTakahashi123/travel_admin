/**
 * チェックリスト #287 の修正記録(3巡目、Day2)。
 * しおり「筑波山の絶景をケーブルカーとロープウェイで、山麓の宿に泊まる1泊2日プラン」
 * (3faebe45-b4a5-4861-a8a8-78532fb6210d)
 *
 * 本番でDay2の終了が16:08と、決まり2(16:30〜17:00)に届いていなかった。実在する
 * 地図と測量の科学館(国土地理院、つくば市北郷1)を平沢官衙遺跡とつくばエキスポ
 * センターの間に追加。
 *
 * 事実確認(直接開いたURL):
 * - https://www.gsi.go.jp/MUSEUM/ (施設概要)
 * - https://www.gsi.go.jp/MUSEUM/p02.html (入館無料、開館時間9:30〜16:30・
 *   受付16:00まで、休館日は毎週月曜・年末年始、展示エリア[オリエンテーション
 *   ルーム・常設展示室・特別展示室・地球ひろば・地図のギャラリー])
 *
 * 決まり7(閉館時刻の確認): 受付は16:00までだが、この科学館は11:20到着の予定
 * (日中)のため問題なし。1泊2日の締めくくりとして既存の地質標本館(16:55終了)に
 * 配置する案もあったが、地質標本館は受付終了時刻の記載がなく、地図と測量の科学館
 * は16:00受付終了が明確なため、日の後半ではなく中間(平沢官衙遺跡のあと)に配置した。
 *
 * 座標はGSI住所検索(茨城県つくば市北郷1番地)で確認。
 *
 * あわせて、地質標本館(Day2の最後、旅全体の最後)に帰りの交通手段の一言を追加
 * (flow-check.cjsの「帰りの一言なし」指摘)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-287c-3faebe45.ts
 * (実行済み。地図と測量の科学館の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "3faebe45-b4a5-4861-a8a8-78532fb6210d";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day2 = itin.days[1];

  if (day2.spots.some((s) => s.name === "地図と測量の科学館")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const hokujo = day2.spots.find((s) => s.name === "北条の町並み")!;
  const hirasawa = day2.spots.find((s) => s.name === "平沢官衙遺跡")!;
  const expo = day2.spots.find((s) => s.name === "つくばエキスポセンター")!;
  const jaxa = day2.spots.find((s) => s.name === "筑波宇宙センター")!;
  const chishitsu = day2.spots.find((s) => s.name === "地質標本館")!;

  const kaeriLine = "見学を終えたら、車でつくば駅・首都圏方面へ戻りましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: hokujo.id, data: {} },
        { id: hirasawa.id, data: {} },
        {
          create: {
            name: "地図と測量の科学館",
            address: "つくば市北郷1",
            lat: 36.104961,
            lng: 140.085052,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 20)),
            stayDurationMin: 45,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "平沢官衙遺跡からは車で15分ほどです。地図と測量の科学館は、国土地理院が運営する、地図と測量の歴史や仕組み、最新の技術を紹介する博物館です。常設展示室や地球ひろば、地図のギャラリーなど、複数の展示エリアに分かれており、入館は無料です。休館日があるので、訪れる前に公式の案内で確かめましょう。",
          },
        },
        { id: expo.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 12, 12)), transitMode: "car", transitDurationMin: 7 } },
        { id: jaxa.id, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)) } },
        {
          id: chishitsu.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 55)),
            memo: chishitsu.memo + " " + kaeriLine,
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day2.id } });
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
