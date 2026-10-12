/**
 * チェックリスト #310 の修正記録(ふだんの見直し)。
 * しおり「あべのハルカスと四天王寺、天王寺の絶景と歴史を巡るプラン」
 * (6d8232c0-df97-4f32-b8c3-6d8c9d3f0038)
 *
 * 本番で5か所・09:00〜15:10で、決まり2(終了16:30〜17:00)に届いて
 * いなかった。てんしばとあべのハルカスの間に、実在の新世界・通天閣を
 * 追加。あわせて、てんしばに昼食の一言を追加。
 *
 * 新世界・通天閣(way 254319878): 明治36年(1903)の第5回内国勧業博覧会の
 * 跡地に発展、ジャンジャン横丁など昭和の下町情緒が残る。
 * 出典(直接開いたURL): https://osaka-info.jp/spot/shinsekai/
 * (大阪観光局公式サイト OSAKA-INFO)
 * 座標はNominatim(OSM)で確認。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-310-6d8232c0.ts
 * (実行済み。新世界・通天閣の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "新世界・通天閣")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const horikoshi = spots.find((s) => s.name === "堀越神社")!;
  const shitennoji = spots.find((s) => s.name === "四天王寺")!;
  const tenshiba = spots.find((s) => s.name === "天王寺公園（てんしば）")!;
  const harukas = spots.find((s) => s.name === "あべのハルカス")!;

  const courtesy = "今も信仰が続く場所ですので、静かに、敬意をもってお参りください。";
  const horikoshiMemo = (horikoshi.memo ?? "").includes("敬意") ? horikoshi.memo : `${horikoshi.memo} ${courtesy}`;
  const shitennojiMemo = (shitennoji.memo ?? "").includes("敬意") ? shitennoji.memo : `${shitennoji.memo} ${courtesy}`;

  const lunchLine = " てんしば内の飲食店で、ここで昼食をとりましょう。";
  const tenshibaMemo = (tenshiba.memo ?? "").includes("昼食")
    ? tenshiba.memo
    : (tenshiba.memo ?? "") + lunchLine;

  const harukasOldOpener = "旅の最後にご案内するのは、大阪のランドマーク、あべのハルカスです。";
  const harukasNewOpener = "新世界・通天閣からは徒歩10分ほどです。旅の最後にご案内するのは、大阪のランドマーク、あべのハルカスです。";
  const harukasOldSuperlative = "あべのハルカスは今なお「西日本一高いビル」という記録を持ち続けています。";
  const harukasNewSuperlative = "あべのハルカスは今なお「西日本一高いビル」とされています。";
  const harukasReturnLine = " 見学を終えたら、あべのハルカス直結の天王寺駅・大阪阿部野橋駅から、電車で帰りましょう。";
  const harukasMemo = (harukas.memo ?? "")
    .replace(harukasOldOpener, harukasNewOpener)
    .replace(harukasOldSuperlative, harukasNewSuperlative) + harukasReturnLine;

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: horikoshi.id, data: { memo: horikoshiMemo } },
        { id: shitennoji.id, data: { memo: shitennojiMemo } },
        ...spots
          .filter((s) => ![horikoshi.id, shitennoji.id, tenshiba.id, harukas.id].includes(s.id))
          .map((s) => ({ id: s.id, data: {} })),
        { id: tenshiba.id, data: { memo: tenshibaMemo } },
        {
          create: {
            name: "新世界・通天閣",
            address: "大阪市浪速区恵美須東1-18-6",
            lat: 34.6525393,
            lng: 135.5063098,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 20)),
            stayDurationMin: 72,
            transitMode: "walk",
            transitDurationMin: 13,
            memo:
              "天王寺公園(てんしば)からは徒歩13分ほどです。新世界は、明治36年(1903)に開かれた第5回内国勧業博覧会の跡地に発展した繁華街です。跡地の東半分には天王寺公園が、西半分には博覧会のシンボルとして通天閣(初代)がつくられたことが、この街のはじまりと伝えられています。現在の通天閣は2代目で、昭和31年(1956)に開業しました。通天閣の南に続くジャンジャン横丁には、串カツ店や将棋クラブなどおよそ50軒が軒を連ね、昭和の下町情緒を今に伝えています。大きなフグの看板や、足をなでると幸運が訪れるといわれる「ビリケンさん」も見どころです。",
          },
        },
        { id: harukas.id, data: { memo: harukasMemo } },
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

  // visitTimeの再計算(堀越神社以降を順に積み上げ)
  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "堀越神社") {
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
        "無病息災を祈る堀越神社から、聖徳太子ゆかりの四天王寺、大阪市立美術館、緑豊かな天王寺公園（てんしば）、昭和レトロな新世界・通天閣、そして西日本一の高さを誇るあべのハルカスの展望台まで。古刹の歴史と下町情緒、高層ビルの絶景を1日で楽しむプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
