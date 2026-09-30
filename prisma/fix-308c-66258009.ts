/**
 * チェックリスト #308 の修正記録(企画運営2点)。
 * しおり「湯布院フローラルヴィレッジ、絵本の世界を体感するプラン」
 * (66258009-2007-49b0-a1b5-fdb3131a4b15)
 *
 * 1. 宇奈岐日女神社の滞在60→40分(参拝としては長めとの指摘)。空いた20分は
 *    実在の湯の坪街道(大分県由布市湯布院町川上湯の坪)を追加して埋めた。
 *    由布院駅から徒歩約10分、土産物店・飲食店が並ぶ目抜き通りで、1本
 *    入った大分川沿いは散策スポットとしても知られる。
 *    出典(直接開いたURL): https://www.visit-oita.jp/spots/detail/4357
 *    (大分県公式観光サイト)
 * 2. 決まり8のとおり、タクシー移動の理由を本文に明記(路線バスの便が
 *    少ないため)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-308c-66258009.ts
 * (実行済み。湯の坪街道の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "66258009-2007-49b0-a1b5-fdb3131a4b15";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "湯の坪街道")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const village = spots.find((s) => s.name === "湯布院フローラルヴィレッジ")!;
  const eki = spots.find((s) => s.name === "由布院駅")!;
  const comico = spots.find((s) => s.name === "COMICO ART MUSEUM YUFUIN")!;
  const kinrinko = spots.find((s) => s.name === "金鱗湖")!;
  const artegio = spots.find((s) => s.name === "由布院空想の森アルテジオ")!;
  const unagihime = spots.find((s) => s.name === "宇奈岐日女神社")!;
  const sagiridai = spots.find((s) => s.name === "狭霧台")!;

  const newIntro =
    "この旅は、由布院の町なかを歩き、宇奈岐日女神社・狭霧台へは、路線バスの便が少ないため、タクシーで向かいます。";
  const villageMemo = (village.memo ?? "").replace(
    "この旅は、由布院の町なかを歩き、宇奈岐日女神社・狭霧台へはタクシーで向かいます。",
    newIntro
  );

  const comicoMemo = (comico.memo ?? "").replace(
    "由布院駅からは、湯の坪街道を歩いて10分ほどです。",
    "湯の坪街道からは徒歩3分ほどです。"
  );

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: village.id, data: { memo: villageMemo } },
        { id: eki.id, data: {} },
        {
          create: {
            name: "湯の坪街道",
            address: "大分県由布市湯布院町川上湯の坪",
            lat: 33.2660923,
            lng: 131.3632115,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 58)),
            stayDurationMin: 20,
            transitMode: "walk",
            transitDurationMin: 13,
            memo:
              "由布院駅からは徒歩13分ほどです。湯の坪街道は、由布岳の麓に続く、由布院を代表する目抜き通りです。柚子胡椒など大分の特産品を扱う土産物店や、とり天などのご当地グルメがいただける飲食店が軒を連ね、食べ歩きをしながらの散策が楽しめます。通りから1本入った大分川沿いは、のどかな田園風景が広がる、静かな散策スポットとしても知られています。",
          },
        },
        { id: comico.id, data: { transitDurationMin: 3, memo: comicoMemo } },
        { id: kinrinko.id, data: {} },
        { id: artegio.id, data: {} },
        {
          id: unagihime.id,
          data: { stayDurationMin: 40 },
        },
        { id: sagiridai.id, data: {} },
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

  // visitTimeの再計算(フローラルヴィレッジ以降を順に積み上げ)
  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "湯布院フローラルヴィレッジ") {
      cursor = new Date(s.visitTime!.getTime() + s.stayDurationMin! * 60000);
      continue;
    }
    if (cursor == null) continue;
    const base: Date = cursor;
    const start: Date = new Date(base.getTime() + (s.transitDurationMin ?? 0) * 60000);
    if (s.visitTime?.getTime() !== start.getTime()) {
      await updateSpotInItinerary(ITIN_ID, { spotId: s.id }, { visitTime: start });
    }
    cursor = new Date(start.getTime() + (s.stayDurationMin ?? 0) * 60000);
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
