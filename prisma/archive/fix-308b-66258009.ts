/**
 * チェックリスト #308 の修正記録(企画運営3点・法務1点)。
 * しおり「湯布院フローラルヴィレッジ、絵本の世界を体感するプラン」
 * (66258009-2007-49b0-a1b5-fdb3131a4b15)
 *
 * 企画運営の指摘:
 * 1. フローラルヴィレッジ(100→60分)・金鱗湖(90→35分)・狭霧台(55→25分)の
 *    滞在を縮め(決まりA)、空いた時間は実在の行き先2件で埋めた。
 *    - COMICO ART MUSEUM YUFUIN(node 14127434568、湯の坪街道沿い):
 *      建築家・隈研吾設計、平成29年(2017)開館。草間彌生・杉本博司・
 *      村上隆・奈良美智ら7作家の作品46点を常設展示。
 *      出典(直接開いたURL): https://www.visit-oita.jp/spots/detail/9272
 *      (大分県公式観光サイト)
 *    - 由布院空想の森アルテジオ(住所から国土地理院で座標を確認、
 *      「大分県由布市湯布院町川上1272」): 平成14年(2002)開館、美術と
 *      音楽をテーマにした美術館。マティスやジョン・ケージらの作品を、
 *      音楽とともに展示。
 *      出典: https://yufuin.gr.jp/spot/spot-1162/(由布院公式旅ガイド)
 * 2. 由布院駅→金鱗湖の移動(本文「徒歩20分」/時刻上「30分」の食い違い)を、
 *    COMICO ART MUSEUM YUFUINを間に挟むことで、徒歩10分+10分の実際の
 *    ルート(湯の坪街道経由)に一致させた。
 * 3. 移動手段(町なかは徒歩、神社・狭霧台はタクシー)を最初のスポットに
 *    明記。
 *
 * 法務の指摘: 金鱗湖の共同浴場「下ん湯」に入浴の配慮の一文を追加。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 * 縮めたスポット(フローラルヴィレッジ・金鱗湖・狭霧台)の滞在が、ほかの
 * 既存スポット(由布院駅・宇奈岐日女神社)に移っていないことを確認。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-308b-66258009.ts
 * (実行済み。COMICO ART MUSEUM YUFUINの有無で確認するため、再実行しても
 * 安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "66258009-2007-49b0-a1b5-fdb3131a4b15";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "COMICO ART MUSEUM YUFUIN")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const village = spots.find((s) => s.name === "湯布院フローラルヴィレッジ")!;
  const eki = spots.find((s) => s.name === "由布院駅")!;
  const kinrinko = spots.find((s) => s.name === "金鱗湖")!;
  const unagihime = spots.find((s) => s.name === "宇奈岐日女神社")!;
  const sagiridai = spots.find((s) => s.name === "狭霧台")!;

  const villageIntro = "この旅は、由布院の町なかを歩き、宇奈岐日女神社・狭霧台へはタクシーで向かいます。";
  const villageMemo = villageIntro + (village.memo ?? "");

  const kinrinkoOldBath = "湖畔には、茅葺き屋根が目印の共同浴場「下ん湯」があり、露天風呂に入りながら湖を眺めることもできます。";
  const kinrinkoNewBath =
    "湖畔には、茅葺き屋根が目印の共同浴場「下ん湯」があります。共同浴場なので、中をのぞいたり、ほかの入浴客を撮影したりしないようにしましょう。";
  const kinrinkoMemo = (kinrinko.memo ?? "")
    .replace("由布院駅からは、湯の坪街道の土産物店や甘味処が並ぶ通りを歩いて20分ほどです。", "COMICO ART MUSEUM YUFUINからは徒歩10分ほどです。")
    .replace(kinrinkoOldBath, kinrinkoNewBath);

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: village.id, data: { stayDurationMin: 60, memo: villageMemo } },
        { id: eki.id, data: {} },
        {
          create: {
            name: "COMICO ART MUSEUM YUFUIN",
            address: "大分県由布市湯布院町川上441-1",
            lat: 33.2652693,
            lng: 131.3615766,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 55)),
            stayDurationMin: 55,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "由布院駅からは、湯の坪街道を歩いて10分ほどです。COMICO ART MUSEUM YUFUINは、建築家・隈研吾が設計した現代美術館で、平成29年(2017)に開館しました。由布院の町並みに溶け込む焼杉の外壁が特徴の建物に、草間彌生、杉本博司、村上隆、奈良美智ら、7名の作家による46点の作品が常設展示されています。2階テラスにある奈良美智の彫刻作品「Your Dog」は、由布岳を背景にした撮影スポットとしても人気です。",
          },
        },
        {
          id: kinrinko.id,
          data: { stayDurationMin: 35, transitMode: "walk", transitDurationMin: 10, memo: kinrinkoMemo },
        },
        {
          create: {
            name: "由布院空想の森アルテジオ",
            address: "大分県由布市湯布院町川上1272",
            lat: 33.273884,
            lng: 131.369217,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 48)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 13,
            memo:
              "金鱗湖からは徒歩13分ほどです。由布院空想の森アルテジオは、平成14年(2002)に開館した、美術と音楽をテーマにした美術館です。名前はイタリア語の「arte(芸術)」と「gio(楽しみ)」を組み合わせた造語といわれています。マティスやジョン・ケージなど、絵と音を自由に横断した作家たちの作品を、館内に流れる音楽とともに鑑賞できます。くつろげるソファ席や、関連の書籍をそろえた読書室もあり、森の中でゆったりとした時間を過ごせます。",
          },
        },
        {
          id: unagihime.id,
          data: {
            transitMode: "taxi",
            memo: (unagihime.memo ?? "").replace(
              "金鱗湖からは車で8分ほどです。",
              "由布院空想の森アルテジオからは、タクシーで8分ほどです。"
            ),
          },
        },
        {
          id: sagiridai.id,
          data: {
            stayDurationMin: 30,
            transitMode: "taxi",
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "イギリスの絵本のような街並みを再現した湯布院フローラルヴィレッジ。動物とのふれあいも楽しめる、フォトジェニックなプランです。磯崎新設計の由布院駅、隈研吾設計のCOMICO ART MUSEUM YUFUIN、由布院を代表する金鱗湖、音楽と美術のアルテジオ、宇奈岐日女神社、由布院盆地を一望する狭霧台まで、由布院温泉の定番と穴場を一日で巡ります。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
