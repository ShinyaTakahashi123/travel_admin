/**
 * #312の続き2(企画運営の指摘、2026-09-30 19:15 JST)。
 * しおり「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」
 * (7133c8fe-1bb5-4d3f-b644-653c74f59419)
 *
 * Day2の終了が15:19で決まり2の窓(16:30〜17:00)に届いていなかった件。
 * かかしの里のさらに奥、東祖谷菅生にある奥祖谷二重かずら橋を追加した。
 * 男橋・女橋の2本のかずら橋で、西祖谷の「祖谷のかずら橋」(別のしおり
 * e4f374cbで使用)や大歩危とは異なる実在のスポット。
 * 出典: https://www.awanavi.jp/archives/spot/2092 (阿波ナビ公式。
 * 約800年前、平家一族が剣山・平家の馬場での訓練に通うため架設したと
 * いわれる。「シラクチカズラ」という高山植物で作られている)
 * 営業期間が4月〜11月(12月〜3月は冬季休業)のため、しおりのseasonsから
 * winterを外した。
 * 座標: NominatimでOSM名称一致(tourism=viewpoint「奥祖谷二重かずら橋」、
 * 33.8535806,134.0458633)。
 *
 * descriptionの「かずら橋や大歩危とは違う」は、奥祖谷二重かずら橋を含む
 * 内容に合わなくなったため、「西祖谷の祖谷のかずら橋や大歩危とはひと味
 * 違う」に書き直した(#300と同じ扱い)。
 *
 * かかしの里は最終スポットでなくなったため帰りの一言を外し、
 * 奥祖谷二重かずら橋の末尾に移した。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312f-7133c8fe.ts
 * (実行済み。奥祖谷二重かずら橋の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day2 = itin.days[1];

  const kakashi = day2.spots.find((s) => s.name === "天空の村・かかしの里")!;
  if (day2.spots.some((s) => s.name === "奥祖谷二重かずら橋")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const kakashiMemo = (kakashi.memo ?? "").replace(
    "住民の方の暮らしの場なので、家の敷地や畑に入らないようにしましょう。見学を終えたら、車で帰りましょう。",
    "住民の方の暮らしの場なので、家の敷地や畑に入らないようにしましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: kakashi.id }, { memo: kakashiMemo });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        ...day2.spots.map((s) => ({ id: s.id, data: {} })),
        {
          create: {
            name: "奥祖谷二重かずら橋",
            address: "三好市東祖谷菅生620",
            lat: 33.8535806,
            lng: 134.0458633,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 37)),
            stayDurationMin: 53,
            transitMode: "car",
            transitDurationMin: 18,
            memo:
              "天空の村・かかしの里からは車でおよそ18分です。奥祖谷二重かずら橋は、男橋・女橋と呼ばれる2本のかずら橋が並んで架かる、西祖谷の祖谷のかずら橋とは異なる実在のかずら橋です。シラクチカズラという高山に自生する植物で作られており、約800年前、平家一族が剣山・平家の馬場での訓練に通うため架設したといわれています。冬期は休業しているので、訪れる前に公式の案内で確かめましょう。2本のかずら橋を渡り、山深い祖谷の秘境らしい景観を味わってみましょう。見学を終えたら、車で帰りましょう。",
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      seasons: ["spring", "summer", "autumn"],
      description:
        "祖谷渓を見下ろす断崖の展望台と、山の斜面に家々が連なる落合集落、平家の伝承が残る奥祖谷二重かずら橋。西祖谷の祖谷のかずら橋や大歩危とはひと味違う、祖谷の秘境ぶりをじっくり味わう1泊2日です。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
