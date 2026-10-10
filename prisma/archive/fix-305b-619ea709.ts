/**
 * チェックリスト #305 の修正記録(セルフチェックで発見)。
 * しおり「仙巌園と尚古集成館、世界遺産・薩摩の近代化遺産を巡るプラン」
 * (619ea709-6437-438a-8421-ce3ad8852486)
 *
 * itinerary-audit.cjsで、尚古集成館の開始時刻が本番で元から10分ずれて
 * いたこと(仙巌園の滞在70分+移動10分=10:50が正しいところ、11:00のまま
 * だった)を発見。後続の異人館以降もあわせてvisitTimeを再計算した。
 * また、尚古集成館の「現存する日本最古の石造西洋式機械工場」が決まり9の
 * 言い切りに触れたため「とされる」でヘッジ。桜島溶岩なぎさ公園・足湯の
 * 滞在を70→75分に見直し(日没に近づく夕景の時間帯まで含めた、実在の
 * 遊歩道散策の範囲として妥当)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-305b-619ea709.ts
 * (実行済み。尚古集成館の時刻で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "619ea709-6437-438a-8421-ce3ad8852486";

async function main() {
  const shokoshuseikan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "尚古集成館" },
  });
  if (shokoshuseikan.visitTime?.getUTCHours() === 11 && shokoshuseikan.visitTime?.getUTCMinutes() === 0) {
    const fixedMemo = (shokoshuseikan.memo ?? "").replace(
      "現存する日本最古の石造西洋式機械工場「旧集成館機械工場」の建物を利用した博物館で、",
      "現存する日本最古の石造西洋式機械工場とされる「旧集成館機械工場」の建物を利用した博物館で、"
    );
    await updateSpotInItinerary(ITIN_ID, { spotId: shokoshuseikan.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 10, 50)),
      memo: fixedMemo,
    });
  }

  const ijinkan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "旧鹿児島紡績所技師館(異人館)" },
  });
  if (ijinkan.visitTime?.getUTCHours() === 11 && ijinkan.visitTime?.getUTCMinutes() === 45) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ijinkan.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 11, 44)),
    });
  }

  const shiroyama = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "城山展望台" },
  });
  if (shiroyama.visitTime?.getUTCHours() === 12 && shiroyama.visitTime?.getUTCMinutes() === 27) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shiroyama.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 12, 26)),
    });
  }

  const ishin = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "鹿児島市維新ふるさと館" },
  });
  if (ishin.visitTime?.getUTCHours() === 13 && ishin.visitTime?.getUTCMinutes() === 20) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ishin.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 13, 19)),
    });
  }

  const sakurajima = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "桜島溶岩なぎさ公園・足湯" },
  });
  if (sakurajima.visitTime?.getUTCHours() === 15 && sakurajima.visitTime?.getUTCMinutes() === 20) {
    await updateSpotInItinerary(ITIN_ID, { spotId: sakurajima.id }, {
      visitTime: new Date(Date.UTC(1970, 0, 1, 15, 19)),
      stayDurationMin: 75,
    });
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
