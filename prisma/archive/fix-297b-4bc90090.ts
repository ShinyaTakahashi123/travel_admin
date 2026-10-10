/**
 * チェックリスト #297 の修正記録(見直し)。
 * しおり「日光東照宮と輪王寺、二荒山神社をめぐり御朱印をいただく日帰りプラン」
 * (4bc90090-102a-4b9d-bae8-31abe8f12f23)
 *
 * 本番で6か所09:00〜15:50と、決まり2(16:30〜17:00)に届いていないことが
 * 判明。実在する滝尾神社(二荒山神社の別宮)を、二荒山神社と憾満ヶ淵の間に
 * 追加。
 *
 * 出典(直接開いたURL): https://www.nikko-kankou.org/spot/24
 * (日光市公式観光サイト。「二荒山神社本社の西約1キロ」「祭神は田心姫命」
 * 「本殿裏には『三本杉』という巨木」「運試しの鳥居」「子種石」「縁結びの笹」)
 *
 * 座標はOSM Nominatim(滝尾神社、amenity=place_of_worship、日光市山内)で確認。
 * 未舗装の山道のため、足元に気をつける一文を追加。
 *
 * 憾満ヶ淵(旅の最後)に帰りの一言を追加。
 *
 * 結果、7か所09:00〜16:53(窓内)。
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-297b-4bc90090.ts
 * (実行済み。滝尾神社の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "4bc90090-102a-4b9d-bae8-31abe8f12f23";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "滝尾神社")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const shinkyo = day1.spots.find((s) => s.name === "神橋")!;
  const rinnoji = day1.spots.find((s) => s.name === "日光山輪王寺")!;
  const toshogu = day1.spots.find((s) => s.name === "日光東照宮")!;
  const taiyuin = day1.spots.find((s) => s.name === "大猷院")!;
  const futarasan = day1.spots.find((s) => s.name === "日光二荒山神社")!;
  const kanmangafuchi = day1.spots.find((s) => s.name === "憾満ヶ淵")!;

  const kaeriLine = "見学を終えたら、バスや徒歩で日光駅方面へ戻りましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: shinkyo.id, data: {} },
        { id: rinnoji.id, data: {} },
        { id: toshogu.id, data: {} },
        { id: taiyuin.id, data: {} },
        { id: futarasan.id, data: {} },
        {
          create: {
            name: "滝尾神社",
            address: "日光市山内",
            lat: 36.7653722,
            lng: 139.5920315,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 5)),
            stayDurationMin: 35,
            transitMode: "walk",
            transitDurationMin: 20,
            memo:
              "日光二荒山神社からは、未舗装の山道を歩いて20分ほどです。滝尾神社は、二荒山神社本社の西およそ1kmの森の中に鎮座する、二荒山神社の別宮です。二荒山神社の主祭神・大己貴命の妃神である田心姫命を祀り、弘仁11年(820)、弘法大師が創建したと伝えられています。本殿裏には、田心姫命が降臨したと伝わる「三本杉」の巨木があり、神聖な雰囲気が漂います。小さな穴に石を3回投げ、一つでも通れば良いことがあるという「運試しの鳥居」や、子宝・安産にご利益があるという「子種石」、縁結びの信仰を集める「縁結びの笹」など、見どころも点在しています。山道は歩きやすい靴で、足元に気をつけながら歩きましょう。静かに、敬意をもってお参りください。",
          },
        },
        {
          id: kanmangafuchi.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 8)),
            transitMode: "walk",
            transitDurationMin: 28,
            memo: kanmangafuchi.memo!.replace(
              "二荒山神社からは歩いて20分ほどです。",
              "滝尾神社からは歩いて28分ほどです。"
            ) + " " + kaeriLine,
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
