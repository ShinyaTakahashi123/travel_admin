/**
 * #70(有田町歴史民俗資料館と伊万里の商家、やきものの町の歴史を学ぶ1泊2日、
 * fb4c9c64)の、歩きの道具の直し(round2)。
 *
 * docs/content/20261030-transit-recheck-67-73.md で「短すぎる」と判定された
 * 武雄神社→御船山楽園(walk)を、routing.openstreetmap.de/routed-foot で測り
 * 直した。1237m・約16.5分(project-osrm.orgの17.4分とほぼ同じで、この区間は
 * 道具の違いによる誤りではなかった)。11分→約17分に直す。
 *
 * この+6分を御船山楽園の到着にそのまま加えると、初日(Day1)の終了が
 * 16:55→17:01になり、16:30〜17:00の範囲を1分超える。御船山楽園(最後の
 * スポット)の滞在を36分→35分(-1分)にして、終了を17:00ちょうどに収めた。
 *
 * 新しい時刻: 武雄神社15:48(20)→御船山楽園16:25(35、〜17:00)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-70-fb4c9c64-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-70-fb4c9c64-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TAKEO_ID = "4ba26a30-e076-4797-91f9-d6e4bb323b6a";
const MIFUNEYAMA_ID = "4b2b9c43-2a15-41bc-a096-4e6abd520564";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAKEO_FIND = "この後は、歩いておよそ11分、御船山楽園へ向かいましょう。";
const TAKEO_REPLACE = "この後は、歩いておよそ17分、御船山楽園へ向かいましょう。";

const MIFUNEYAMA_FIND = "武雄神社から歩いておよそ11分、御船山楽園に着きます。";
const MIFUNEYAMA_REPLACE = "武雄神社から歩いておよそ17分、御船山楽園に着きます。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [takeo, mifuneyama] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TAKEO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MIFUNEYAMA_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["武雄神社", takeo, TAKEO_FIND],
    ["御船山楽園", mifuneyama, MIFUNEYAMA_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newTakeoMemo = takeo.memo!.replace(TAKEO_FIND, TAKEO_REPLACE);
  const newMifuneyamaMemo = mifuneyama.memo!.replace(MIFUNEYAMA_FIND, MIFUNEYAMA_REPLACE);

  console.log("=== #70 round2: 武雄神社→御船山楽園の移動の直し ===\n");
  console.log(`[武雄神社] 変更なし(visitTime=15:48, stay=20)`);
  console.log("  新memo:", newTakeoMemo);
  console.log(`[御船山楽園] 新visitTime: 16:25  新stay: 35(もと36、-1分)  新leg: walk/17分  〜17:00`);
  console.log("  新memo:", newMifuneyamaMemo);
  console.log("\nDay1 新しい時刻: 武雄神社15:48(20)→御船山楽園16:25(35、〜17:00)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: TAKEO_ID },
    data: { memo: newTakeoMemo },
  });
  await prisma.spot.update({
    where: { id: MIFUNEYAMA_ID },
    data: {
      visitTime: T(16, 25),
      stayDurationMin: 35,
      memo: newMifuneyamaMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 17 }] },
    },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
