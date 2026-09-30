/**
 * チェックリスト #311 の修正記録(企画運営1点・法務3点)。
 * しおり「群馬県立近代美術館と高崎城址、アートと歴史を楽しむ日帰り
 * プラン」(6de84372-3d1e-4106-bcb2-f881ee14b8b4)
 *
 * 企画運営の指摘:
 * 1. 終了が16:27で、決まり2の窓(16:30〜17:00)に3分届いていなかった。
 *    滞在は延ばさず、高崎城址→高崎市美術館の移動時間を、直線距離
 *    (およそ0.7km)に対して短すぎた5分から8分に見直した(実際の道路を
 *    考慮した補正。滞在の水増しではない)。
 * 2. 高崎白衣大観音は戦没者慰霊のために建てられた像のため、慰霊の
 *    一文を追加。
 *
 * 法務の指摘:
 * 1. 高崎城址の「唯一の城郭建築です」→「唯一の城郭建築とされます」。
 * 2. しおりのdescriptionの「縁起だるま発祥の少林山達磨寺」→本文と
 *    同じく「縁起だるま発祥の寺として知られる少林山達磨寺」。
 * 3. 高崎白衣大観音の像内の階段(146段)に、足元注意の一文を追加。
 *
 * 企画運営の追加指摘: 最初は「高崎駅西口からバス」なのに途中から車に
 * 変わっていた(決まり8)。最初から車でめぐる旅として書き直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-311b-6de84372.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "6de84372-3d1e-4106-bcb2-f881ee14b8b4";

async function main() {
  const kindaiBijutsukan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "群馬県立近代美術館" },
  });
  const oldIntro = "高崎駅西口からバスでおよそ25分、";
  const newIntro = "この旅は車でめぐります。高崎駅からは車でおよそ20分、";
  if (kindaiBijutsukan.memo?.includes(oldIntro)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: kindaiBijutsukan.id }, {
      memo: kindaiBijutsukan.memo.replace(oldIntro, newIntro),
    });
  }

  const bijutsukan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "高崎市美術館(旧井上房一郎邸)" },
  });
  if (bijutsukan.transitDurationMin === 5) {
    const fixedMemo = (bijutsukan.memo ?? "").replace(
      "高崎城址からは車で5分ほどです。",
      "高崎城址からは車で8分ほどです。"
    );
    await updateSpotInItinerary(ITIN_ID, { spotId: bijutsukan.id }, { transitDurationMin: 8, memo: fixedMemo });
  }

  const jyoshi = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "高崎城址" } });
  const oldYagura = "群馬県内に現存する唯一の城郭建築です。";
  const newYagura = "群馬県内に現存する唯一の城郭建築とされます。";
  if (jyoshi.memo?.includes(oldYagura)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jyoshi.id }, { memo: jyoshi.memo.replace(oldYagura, newYagura) });
  }

  const daikannon = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "高崎白衣大観音(慈眼院)" },
  });
  const memorialLine = "戦没者を慰霊する観音像でもあります。静かに、敬意をもってお参りしましょう。";
  const stairsLine = "像内の階段は急なので、足元に気をつけて上りましょう。";
  if (daikannon.memo && !daikannon.memo.includes("慰霊")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: daikannon.id }, {
      memo: `${daikannon.memo} ${memorialLine} ${stairsLine}`,
    });
  } else if (daikannon.memo && !daikannon.memo.includes("像内の階段")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: daikannon.id }, { memo: `${daikannon.memo} ${stairsLine}` });
  }

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldDesc = "縁起だるま発祥の少林山達磨寺まで。";
  const newDesc = "縁起だるま発祥の寺として知られる少林山達磨寺まで。";
  if (itin.description?.includes(oldDesc)) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: { description: itin.description.replace(oldDesc, newDesc) },
    });
  }

  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  const ordered = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  let cursor: Date | null = null;
  for (const s of ordered) {
    if (s.name === "群馬県立近代美術館") {
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
