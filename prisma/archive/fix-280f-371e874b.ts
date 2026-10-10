/**
 * チェックリスト #280 の修正記録(続き、企画運営からの候補で1日目を16:30台に)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * 企画運営の指摘: 徳良湖の30→55分は延ばした形なので45分にし、そのぶんを
 * 実在の行き先で埋める。Overpassで銀山温泉周辺1.5kmに見つかった候補のうち、
 * 出典がしっかり確認できた次の2件を追加した(正楽寺・山の神神社は見送り。
 * 正楽寺は信頼できる出典が見つからず、山の神神社は内容が本しおりの書き方に
 * 合わないため)。
 *
 * 1. 十分一番所跡(node 5055334526, 38.57558,140.51602): 徳良湖と白銀公園の
 *    間に追加。江戸時代、延沢方面への入り口で、通過する荷物に十分の一の税が
 *    課せられていたという史跡。
 *    出典(直接開いたURL): https://www.city.obanazawa.yamagata.jp/kanko/kankochi/1346
 *    (尾花沢市公式。「十分一番所跡...銀山温泉入り口...延沢方面への入り口...
 *    物品価格の十分の一の役が徴されました」)
 *
 * 2. 和楽足湯(node 11576588614, 38.57007,140.53049): しろがね湯と銀山温泉街の
 *    間に追加。温泉街の入り口、銀山川のほとりにある足湯。
 *    出典(直接開いたURL): https://www.ginzanonsen.jp/ginzan/walk.html
 *    (銀山温泉公式。「温泉街の入り口、銀山川のほとりにあり、誰でも気軽に
 *    利用できる足湯です。源泉がそのまま使われているので効果も抜群です」)
 *    営業時間・料金は決まり9のため本文に書かない。
 *
 * 徳良湖→白銀公園の移動(元car/20)を、徳良湖→十分一番所跡car/12、
 * 十分一番所跡→白銀公園car/8に分割。白銀公園の書き出し(旧:徳良湖から)を
 * 十分一番所跡からの移動に合わせて修正。
 * しろがね湯→銀山温泉街の移動(元walk/3)を、しろがね湯→和楽足湯walk/3、
 * 和楽足湯→銀山温泉街walk/2に分割。
 *
 * これでDay1は09:00〜16:41となり、決まり2の窓(16:30〜17:00)に収まる。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280f-371e874b.ts
 * (実行済み。十分一番所跡の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];

  if (day1.spots.some((s) => s.name === "十分一番所跡")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const tokurako = day1.spots.find((s) => s.name === "徳良湖")!;
  const shirogane = day1.spots.find((s) => s.name === "白銀公園")!;
  const shiroganeyu = day1.spots.find((s) => s.name === "しろがね湯")!;
  const ginzanStreet = day1.spots.find((s) => s.name === "銀山温泉街")!;

  // 徳良湖: 55分→45分(延ばしすぎを見直し)。中身はそのまま
  await updateSpotInItinerary(ITIN_ID, { spotId: tokurako.id }, { stayDurationMin: 45 });

  // 徳良湖→白銀公園のcar/20をcar/12+car/8に分割するため、白銀公園の
  // 移動時間・書き出しを更新
  await updateSpotInItinerary(ITIN_ID, { spotId: shirogane.id }, {
    transitDurationMin: 8,
    memo: (shirogane.memo ?? "").replace("徳良湖からは車で20分ほどです。", "十分一番所跡からは車で8分ほどです。"),
  });

  const otherSpots = day1.spots.filter(
    (s) => ![tokurako.id, shirogane.id, shiroganeyu.id, ginzanStreet.id].includes(s.id)
  );

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        ...otherSpots
          .filter((s) => s.orderNo < tokurako.orderNo)
          .map((s) => ({ id: s.id, data: {} })),
        { id: tokurako.id, data: {} },
        {
          create: {
            name: "十分一番所跡",
            address: "尾花沢市銀山新畑",
            lat: 38.57558,
            lng: 140.51602,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 27)),
            stayDurationMin: 15,
            transitMode: "car",
            transitDurationMin: 12,
            memo:
              "徳良湖からは車で12分ほどです。十分一番所跡は、銀山温泉の入り口にあたる史跡です。江戸時代、延沢方面へ向かう荷物には、ここで品物の価格の十分の一が税として課せられていたと伝えられています。今はさら地になっていますが、温泉街の歴史を物語る場所です。",
          },
        },
        { id: shirogane.id, data: {} },
        ...otherSpots
          .filter((s) => s.orderNo > shirogane.orderNo && s.id !== shiroganeyu.id)
          .map((s) => ({ id: s.id, data: {} })),
        { id: shiroganeyu.id, data: {} },
        {
          create: {
            name: "和楽足湯",
            address: "尾花沢市銀山新畑",
            lat: 38.57007,
            lng: 140.53049,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 29)),
            stayDurationMin: 20,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "しろがね湯からは徒歩3分ほどです。和楽足湯は、温泉街の入り口、銀山川のほとりにある足湯です。源泉をそのまま使っているので、温まり方も格別です。旅館の窓明かりや山並みを眺めながら、歩き疲れた足を休めましょう。",
          },
        },
        { id: ginzanStreet.id, data: {} },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  // 銀山温泉街の移動時間を「和楽足湯→銀山温泉街walk/2」に更新
  // (元のしろがね湯→銀山温泉街walk/3から、間に和楽足湯を挟む形に変更)
  await updateSpotInItinerary(ITIN_ID, { spotId: ginzanStreet.id }, { transitDurationMin: 2 });

  // visitTimeの再計算(徳良湖以降を順に積み上げ)
  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "徳良湖") {
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
