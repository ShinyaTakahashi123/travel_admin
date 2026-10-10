/**
 * チェックリスト #293 の修正記録(見直し)。
 * しおり「四万十川と沈下橋、『日本最後の清流』を望む定番日帰りプラン」
 * (44e8538a-315e-4ab9-8ed5-1451de24b872)
 *
 * 本番で四万十川学遊館あきついおの滞在が180分となっていた。実際の見学所要
 * 時間は30〜60分ほど(複数の観光サイトで確認)で、決まりA(水増し禁止)に反する
 * ため60分に短縮。空いた時間は実在の行き先で埋めた:
 *
 * 一條神社(新規、佐田沈下橋の近く。土佐一条氏の遺徳をしのぶ神社)
 * 出典(直接開いたURL): https://www.city.shimanto.lg.jp/site/scp/1372.html
 * (四万十市公式。「文久2年[1862]に創建され、現在の社殿は昭和19年[1944]に
 * 建立」「教房の父、兼良を始め、土佐一條氏歴代の霊」「いちじょこさん」の愛称)
 *
 * 四万十市立郷土博物館(新規、為松公園・中村城跡)
 * 出典: https://www.city.shimanto.lg.jp/soshiki/36/1681.html
 * (四万十市公式。「中世から続く史跡中村城跡の中にあるお城の姿をした博物館」
 * 「川とともに生きるまち」がテーマ)
 *
 * 座標はいずれもOSM Nominatimで確認(一條神社・四万十市立郷土資料館)。
 *
 * あきついお(旅の最後)に、帰りの交通手段の一言を追加。
 *
 * 結果、7か所09:00〜16:35(窓内)。
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-293-44e8538a.ts
 * (実行済み。一條神社の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "44e8538a-315e-4ab9-8ed5-1451de24b872";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "一條神社")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const takase = day1.spots.find((s) => s.name === "高瀬沈下橋")!;
  const sanri = day1.spots.find((s) => s.name === "三里沈下橋")!;
  const yakatabune = day1.spots.find((s) => s.name === "屋形船 四万十の碧")!;
  const sada = day1.spots.find((s) => s.name === "佐田沈下橋")!;
  const akituio = day1.spots.find((s) => s.name === "四万十川学遊館あきついお")!;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: takase.id, data: {} },
        { id: sanri.id, data: {} },
        { id: yakatabune.id, data: {} },
        { id: sada.id, data: {} },
        {
          create: {
            name: "一條神社",
            address: "四万十市中村本町一丁目",
            lat: 32.9933223,
            lng: 132.9342096,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 40)),
            stayDurationMin: 30,
            transitMode: "car",
            transitDurationMin: 5,
            memo:
              "佐田沈下橋からは車で5分ほどです。一條神社は、応仁の乱を避けて中村に下向した前関白・一条教房を祖とする土佐一条氏の遺徳をしのび、地元有志によって建立された神社です。教房の父・一条兼良をはじめ、土佐一条氏歴代の霊が祀られています。創建は文久2年(1862)で、現在の社殿は昭和19年(1944)の建立です。地元では「いちじょこさん」の愛称で親しまれています。静かに、敬意をもってお参りしましょう。",
          },
        },
        {
          create: {
            name: "四万十市立郷土博物館",
            address: "四万十市中村本町二丁目",
            lat: 32.9969402,
            lng: 132.930622,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 10,
            memo:
              "一條神社からは歩いて10分ほどです。四万十市立郷土博物館は、中村城跡が残る為松公園の一角に建つ、城の形をした資料館です。四万十川とともに歩んできたこの土地の自然・歴史・文化を、「川とともに生きるまち」をテーマに紹介しています。天守閣風の建物からは、四万十川や市街地を見渡すこともできます。休館日があるので、訪れる前に公式の案内で確かめましょう。",
          },
        },
        {
          id: akituio.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 35)),
            stayDurationMin: 60,
            transitMode: "car",
            transitDurationMin: 10,
            memo:
              "四万十市立郷土博物館からは車で10分ほどです。四万十川学遊館あきついおは、四万十市トンボ自然公園にある、トンボと魚の博物館です。とんぼ館では、トンボの標本や生態を紹介し、さかな館では、四万十川に生息するアカメなど、国内外の淡水魚・汽水魚をあわせておよそ120種500尾展示しています。トンボ自然公園には池や湿地をめぐる散策路もあり、四万十川の自然を身近に感じることができます。休館日があるので、訪れる前に公式の案内で確かめましょう。 見学を終えたら、車で四万十市街・中村駅方面へ戻りましょう。",
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
