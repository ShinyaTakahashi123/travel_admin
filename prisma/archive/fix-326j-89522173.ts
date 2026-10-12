/**
 * #326の続き。法務2026-10-01 02:39 + 企画運営02:40の指摘。
 * 1) 片岡鶴太郎美術館の「草津ホテルの付帯施設として」はホテル名を
 *    書かない決まりのため削除。
 * 2) 地蔵の湯40分(昼食+足湯には短い)・白根神社70分(境内としては
 *    長すぎる)を、合計110分は変えずに地蔵の湯70分・白根神社40分に
 *    入れ替えた(合計が同じなので後続のvisitTimeは変更不要)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326j-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const museum = await prisma.spot.findFirstOrThrow({
    where: { name: "草津片岡鶴太郎美術館", day: { itineraryId: ITIN_ID } },
  });
  const old = "平成10年(1998)、草津ホテルの付帯施設として開館しました。";
  const next = "平成10年(1998)に開館しました。";
  if (museum.memo?.includes(old)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: museum.memo.replace(old, next) });
    console.log("museum updated");
  }

  const jizo = await prisma.spot.findFirstOrThrow({
    where: { name: "地蔵の湯", day: { itineraryId: ITIN_ID } },
  });
  if (jizo.stayDurationMin !== 70) {
    await updateSpotInItinerary(ITIN_ID, { spotId: jizo.id }, { stayDurationMin: 70 });
    console.log("jizo stay updated");
  }

  const shirane = await prisma.spot.findFirstOrThrow({
    where: { name: "白根神社", day: { itineraryId: ITIN_ID } },
  });
  if (shirane.stayDurationMin !== 40) {
    // 地蔵の湯が30分延びた分、白根神社の開始も30分後ろ倒しにする
    // (終了時刻は据え置き: 13:28+30=13:58 → 13:58+40=14:38、直前の14:38と一致)
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: shirane.id },
      { stayDurationMin: 40, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 58)) }
    );
    console.log("shirane stay+visitTime updated");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
