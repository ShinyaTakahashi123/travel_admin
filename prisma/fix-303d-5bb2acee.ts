/**
 * チェックリスト #303 の修正記録(企画運営2点・法務2点)。
 * しおり「清水寺と八坂神社、東福寺と伏見稲荷大社をめぐり御朱印をいただく
 * 京都1泊2日」(5bb2acee-21b8-4703-97e7-8ba1d3d4988c)
 *
 * 企画運営・法務の指摘:
 * 1. 二条城の開城時間は8:45〜16:00(閉城17:00)で、16:10着では決まり7に
 *    触れる。出典(直接開いたURL): https://nijo-jocastle.city.kyoto.lg.jp/
 *    (開城時間8時45分〜16時、閉城17時)。二条城を外し、西本願寺(5:30〜
 *    17:00、京都鉄道博物館から近い)に差し替えた。
 *    出典: https://www.hongwanji.kyoto/see/keidai.html (西本願寺公式。
 *    御影堂・阿弥陀堂・唐門・飛雲閣がいずれも国宝)
 * 2. 東寺の「高さおよそ55mは木造の建造物として日本一の高さを誇ります」
 *    →「木造の塔として日本一の高さとされます」に修正(建造物全体では
 *    なく塔に限定し、ヘッジ)。
 * 3. しおりのdescriptionに御朱印の案内(GOSHUIN_MANNER、法務指定文言)が
 *    抜けていたため追加。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-303d-5bb2acee.ts
 * (実行済み。西本願寺の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "5bb2acee-21b8-4703-97e7-8ba1d3d4988c";
const GOSHUIN_MANNER =
  "御朱印は、お参りした証としていただくものです。先にお参りを済ませてから、授与所でお願いしましょう。受付の時間や御朱印の種類、書き置き(紙でのお渡し)かどうかは寺社ごとに異なり、変わることもあるので、お出かけ前に各寺社の公式の案内で確かめてください。御朱印の売り買いはやめましょう。";

async function main() {
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day2.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "西本願寺")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const toji = spots.find((s) => s.name === "東寺")!;
  if (toji.memo?.includes("高さおよそ55mは木造の建造物として日本一の高さを誇ります。")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: toji.id }, {
      memo: toji.memo.replace(
        "高さおよそ55mは木造の建造物として日本一の高さを誇ります。",
        "高さおよそ55mの木造の塔として、日本一の高さとされます。"
      ),
    });
  }

  const nijojo = spots.find((s) => s.name === "二条城")!;
  const railwayMuseum = spots.find((s) => s.name === "京都鉄道博物館")!;
  const others = spots.filter((s) => s.id !== nijojo.id);

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        ...others.map((s) => ({ id: s.id, data: {} })),
        {
          create: {
            name: "西本願寺",
            address: "京都市下京区堀川通花屋町下ル本願寺門前町60",
            lat: 34.9918325,
            lng: 135.7510462,
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 5)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 15,
            memo:
              "京都鉄道博物館からは徒歩15分ほどです。西本願寺は、浄土真宗本願寺派の本山で、宗祖・親鸞聖人の教えを受け継ぐ寺院です。1994年、世界遺産に登録されています。親鸞聖人の木像を安置する御影堂と、阿弥陀如来の木像を安置する阿弥陀堂は、いずれも国宝で、寛永13年(1636)・宝暦10年(1760)の再建です。桃山時代の彫刻で飾られた国宝の唐門は、見とれて日が暮れることから「日暮らし門」とも呼ばれています。静かに、敬意をもってお参りください。見学を終えたら、徒歩やバスで京都駅へ戻りましょう。",
          },
        },
      ],
      { tx, remove: [nijojo.id] }
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

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description && !itin.description.includes(GOSHUIN_MANNER)) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: {
        description: itin.description.replace("二条城まで、", "西本願寺まで、") + GOSHUIN_MANNER,
      },
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
