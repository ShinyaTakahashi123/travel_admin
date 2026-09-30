/**
 * #269飯盛山と白虎隊(28ec8b18)の続き。法務2026-09-30 23:36の4点。
 * 1. タイトルと本文2か所の「会津の悲劇の歴史」→「会津の歴史」(評価語の悲劇を外す。タイトルも変更)
 * 2. 飯盛山・鶴ヶ城: 「思い込み→亡くなった」を結ぶ形が亡くなり方を思わせるため、
 *    思い込みの部分を外す
 * 3. 阿弥陀寺の墓地: 「およそ1300名」の人数を外す
 * 4. 白虎隊記念館: 「命を落とした隊士のひとり」→「白虎隊士のひとり」
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-269c-28ec8b18.ts
 * (実行済み。現在の文言を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "28ec8b18-c34e-4f95-a166-830976a70133";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  const oldTitle = "飯盛山と白虎隊、会津の悲劇の歴史をたどる日帰りプラン";
  const newTitle = "飯盛山と白虎隊、会津の歴史をたどる日帰りプラン";
  if (itin.title === oldTitle) {
    await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: newTitle } });
  } else if (itin.title !== newTitle) {
    throw new Error("title不一致: " + itin.title);
  }

  const nisshinkan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "会津藩校日新館" },
  });
  {
    const old = "会津の悲劇の歴史をたどる旅は、まずこの学び舎から始めましょう。";
    const next = "会津の歴史をたどる旅は、まずこの学び舎から始めましょう。";
    if (nisshinkan.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: nisshinkan.id }, { memo: nisshinkan.memo.replace(old, next) });
    }
  }

  const iimoriyama = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "飯盛山" },
  });
  {
    const old =
      "戦場からの退却の途中この山にたどり着き、遠くに見えた煙を鶴ヶ城の落城と思い込み、主君のためにと、この地で亡くなったと伝えられています(この経緯には諸説あります)。実際には城は落城していませんでした。唯一助かったとされる隊士の証言により、この出来事は今に語り継がれています。";
    const next =
      "戦場からの退却の途中この地にたどり着き、亡くなったと伝えられています(この経緯には諸説あります)。唯一助かったとされる隊士の証言により、この出来事は今に語り継がれています。";
    if (iimoriyama.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: iimoriyama.id }, { memo: iimoriyama.memo.replace(old, next) });
    }
  }

  const kinenkan = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "白虎隊記念館" },
  });
  {
    const old = "飯盛山で命を落とした隊士のひとり・津川喜代美が遺した手紙";
    const next = "白虎隊士のひとり・津川喜代美が遺した手紙";
    if (kinenkan.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: kinenkan.id }, { memo: kinenkan.memo.replace(old, next) });
    }
  }

  const tsurugajo = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "鶴ヶ城" },
  });
  {
    const old = "飯盛山で亡くなった白虎隊士中二番隊が、落城したと思い込んだのが、まさにこの鶴ヶ城です。";
    const next = "白虎隊ゆかりの鶴ヶ城です。";
    if (tsurugajo.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: tsurugajo.id }, { memo: tsurugajo.memo.replace(old, next) });
    }
  }

  const amidaji = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "阿弥陀寺" },
  });
  {
    const old = "境内の墓地には、戊辰戦争で亡くなったおよそ1300名が眠っており、";
    const next = "境内の墓地には、戊辰戦争で亡くなった人々が眠っており、";
    if (amidaji.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: amidaji.id }, { memo: amidaji.memo.replace(old, next) });
    }
  }

  const buke = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "会津武家屋敷" },
  });
  {
    const old = "飯盛山と白虎隊、会津の悲劇の歴史をたどる旅は、これで終わりです。";
    const next = "飯盛山と白虎隊、会津の歴史をたどる旅は、これで終わりです。";
    if (buke.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: buke.id }, { memo: buke.memo.replace(old, next) });
    }
  }

  // 法務2026-09-30 23:39の追加提案(必須ではないが#228と揃える): 年齢の記載を外す
  const iimoriyama2 = await prisma.spot.findFirstOrThrow({
    where: { day: { itineraryId: ITIN_ID }, name: "飯盛山" },
  });
  {
    const old = "16歳から17歳の少年たちで編成された白虎隊士中二番隊";
    const next = "少年たちで編成された白虎隊士中二番隊";
    if (iimoriyama2.memo?.includes(old)) {
      await updateSpotInItinerary(ITIN_ID, { spotId: iimoriyama2.id }, { memo: iimoriyama2.memo.replace(old, next) });
    }
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
