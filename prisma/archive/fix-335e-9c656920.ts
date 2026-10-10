/**
 * #335の続き。企画運営2026-10-01 06:12・法務06:13の指摘に対応。
 *
 * 1) つなぎのずれ: 地獄蒸し工房鉄輪の結びが「車でおよそ5分の血の池地獄へ」
 *    のまま(fix-335bでバスに変更した際の見落とし)だった。血の池地獄の
 *    書き出し(バスでおよそ10分)に合わせて修正。
 * 2) 竹瓦小路30分は、南北60mほどの短いアーケードのため実際は15分程度。
 *    15分に戻し、終了時刻を16:33(窓の中)に調整。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-335e-9c656920.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "9c656920-3b82-425e-915c-1caa49ba9e47";

async function main() {
  const jm = await prisma.spot.findFirstOrThrow({ where: { name: "地獄蒸し工房鉄輪", day: { itineraryId: ITIN_ID } } });
  const old = "続いては、車でおよそ5分の血の池地獄へ向かいましょう。";
  const next = "続いては、バスでおよそ10分の血の池地獄へ向かいましょう。";
  if (jm.memo?.includes(next)) {
    console.log("jigokumushi already fixed");
  } else {
    if (!jm.memo?.includes(old)) throw new Error("jigokumushi text not found");
    await updateSpotInItinerary(ITIN_ID, { spotId: jm.id }, { memo: jm.memo.replace(old, next) });
    console.log("jigokumushi forward-line fixed");
  }

  const tk = await prisma.spot.findFirstOrThrow({ where: { name: "竹瓦小路", day: { itineraryId: ITIN_ID } } });
  if (tk.stayDurationMin !== 15) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tk.id }, { stayDurationMin: 15 });
    console.log("takegawara-kouji stay trimmed to 15");
  } else {
    console.log("takegawara-kouji already 15min");
  }

  const onsen = await prisma.spot.findFirstOrThrow({ where: { name: "竹瓦温泉", day: { itineraryId: ITIN_ID } } });
  const target = new Date(Date.UTC(1970, 0, 1, 15, 28));
  if (onsen.visitTime?.getTime() !== target.getTime()) {
    await updateSpotInItinerary(ITIN_ID, { spotId: onsen.id }, { visitTime: target });
    console.log("onsen visitTime adjusted");
  } else {
    console.log("onsen visitTime already correct");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
