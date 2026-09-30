/**
 * チェックリスト #296 の修正記録(見直し)。
 * しおり「湯田温泉、白狐伝説の名湯と足湯めぐりの定番日帰りプラン」
 * (4a6a640d-59e8-4365-8deb-915fcf898376)
 *
 * 本番で6か所09:30〜15:43と、決まり2(16:30〜17:00)に届いていないことが
 * 判明。実在する瑠璃光寺五重塔(国宝、山口市菜香亭の近く)を最後に追加。
 *
 * 出典(直接開いたURL): https://yamaguchi-city.jp/details/aa_ruri_tou.html
 * (山口市公式サイト。「25代大内義弘が香山公園に香積寺を建立。義弘の死後、
 * 26代の弟・盛見が兄の菩提を弔うため五重塔の造営を開始」「嘉吉2年(1442)頃
 * 落慶」「高さ31.2メートル」「日没から22:00までライトアップ」)
 *
 * 座標はOSM Nominatim(瑠璃光寺五重塔、amenity=place_of_worship)で確認。
 *
 * 山口市菜香亭(旅の最後ではなくなる)には帰りの一言がなかったため、
 * 瑠璃光寺五重塔(新しい旅の最後)に追加。
 *
 * 結果、7か所09:30〜16:33(窓内)。
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-296-4a6a640d.ts
 * (実行済み。瑠璃光寺五重塔の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "4a6a640d-59e8-4365-8deb-915fcf898376";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "瑠璃光寺五重塔")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const ashiyu = day1.spots.find((s) => s.name === "湯田温泉 白狐の足湯")!;
  const kitsuneashiato = day1.spots.find((s) => s.name === "狐の足あと")!;
  const chuya = day1.spots.find((s) => s.name === "中原中也記念館")!;
  const inoue = day1.spots.find((s) => s.name === "井上公園")!;
  const josei = day1.spots.find((s) => s.name === "常栄寺雪舟庭")!;
  const saikotei = day1.spots.find((s) => s.name === "山口市菜香亭")!;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: ashiyu.id, data: {} },
        { id: kitsuneashiato.id, data: {} },
        { id: chuya.id, data: {} },
        { id: inoue.id, data: {} },
        { id: josei.id, data: {} },
        { id: saikotei.id, data: {} },
        {
          create: {
            name: "瑠璃光寺五重塔",
            address: "山口市香山町",
            lat: 34.1901755,
            lng: 131.4729196,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 53)),
            stayDurationMin: 40,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "山口市菜香亭からは歩いて10分ほどです。瑠璃光寺五重塔は、日本三名塔の一つに数えられる国宝の塔です。応永の乱で戦死した大内氏25代義弘の菩提を弔うため、弟の26代盛見が建立を計画し、嘉吉2年(1442)頃に完成したと伝えられています。高さはおよそ31.2m。上層ほど塔身が細くなるすらりとした立ち姿と、檜皮葺屋根のやわらかな反りが特徴で、室町時代に山口で花開いた大内文化の最高傑作ともいわれています。塔が立つ境内は香山公園として整備され、四季折々の風情も楽しめます。 見学を終えたら、車や公共交通で山口駅・新山口駅方面へ戻りましょう。",
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
