/**
 * #67(大鳴門橋遊歩道「渦の道」と道の駅くるくる なると、鳴門1泊2日、
 * ac272e0b)の、移動の再測り直しの直し(round2)。
 *
 * docs/content/20261030-transit-recheck-67-73.md に基づき、Day2の3区間を
 * 直す: 金泉寺→大日寺(car)15→11分、大日寺→地蔵寺(car)10→7分、
 * 道の駅第九の里→鳴門市ドイツ館(walk、routing.openstreetmap.deで111m・
 * 約1.5分を確認)5→2分。
 *
 * 3区間で合計10分短くなるが、最終日が今の16:30(範囲16:30〜17:00の
 * 下限)より早くなってしまうため、決まりの順②に従い、1か所目(金泉寺)の
 * 開始を9:00→9:10(他の日の朝は9:30までの範囲内)に遅らせて吸収した。
 * 結果、道の駅第九の里より先(鳴門市ドイツ館・賀川豊彦記念館・
 * あすたむらんど徳島)の時刻は変わらず、終了は今と同じ16:30。
 *
 * 新しい時刻(Day2): 金泉寺09:10(40)→大日寺10:01(35)→地蔵寺10:43(45)→
 * 道の駅第九の里11:43(60)→鳴門市ドイツ館12:45(75)→賀川豊彦記念館14:05(45)→
 * あすたむらんど徳島15:10(80、〜16:30、無変更)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-67-ac272e0b-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-67-ac272e0b-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const KINSENJI_ID = "0eeea741-ac29-4ed1-a2f7-e90cce4fa017";
const DAINICHIJI_ID = "9fbf8d3d-1cf1-4045-84e8-afe03749317b";
const JIZOJI_ID = "e575eb54-85d6-47df-b43d-3eeed23b8ba2";
const MICHINOEKI_ID = "578a0c99-34d9-41fa-b4f4-262a360465f8";
const GERMANHOUSE_ID = "2441a06e-9a46-4bfe-b5c7-8f1a6f90f838";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DAINICHIJI_FIND = "金泉寺から車で約15分。";
const DAINICHIJI_REPLACE = "金泉寺から車で約11分。";

const JIZOJI_FIND = "大日寺から車で約10分。";
const JIZOJI_REPLACE = "大日寺から車で約7分。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [dainichiji, jizoji] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: DAINICHIJI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: JIZOJI_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["大日寺", dainichiji, DAINICHIJI_FIND],
    ["地蔵寺", jizoji, JIZOJI_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newDainichijiMemo = dainichiji.memo!.replace(DAINICHIJI_FIND, DAINICHIJI_REPLACE);
  const newJizojiMemo = jizoji.memo!.replace(JIZOJI_FIND, JIZOJI_REPLACE);

  console.log("=== #67 round2: Day2の移動の直し ===\n");
  console.log(`[金泉寺] 新visitTime: 09:10(もと09:00、1か所目を後ろへ)  新stay: 40(無変更)`);
  console.log(`[大日寺] 新visitTime: 10:01  新stay: 35(無変更)  新leg: car/11分`);
  console.log("  新memo:", newDainichijiMemo);
  console.log(`[地蔵寺] 新visitTime: 10:43  新stay: 45(無変更)  新leg: car/7分`);
  console.log("  新memo:", newJizojiMemo);
  console.log(`[道の駅第九の里] 新visitTime: 11:43  新stay: 60(無変更)`);
  console.log(`[鳴門市ドイツ館] 新visitTime: 12:45(無変更)  新stay: 75(無変更)  新leg: walk/2分`);
  console.log(`[賀川豊彦記念館][あすたむらんど徳島] 変更なし(14:05・15:10、〜16:30)`);
  console.log(
    "\nDay2 新しい時刻: 金泉寺09:10(40)→大日寺10:01(35)→地蔵寺10:43(45)→道の駅第九の里11:43(60)→鳴門市ドイツ館12:45(75)→賀川豊彦記念館14:05(45)→あすたむらんど徳島15:10(80、〜16:30)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({ where: { id: KINSENJI_ID }, data: { visitTime: T(9, 10) } });
  await prisma.spot.update({
    where: { id: DAINICHIJI_ID },
    data: {
      visitTime: T(10, 1),
      memo: newDainichijiMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 11 }] },
    },
  });
  await prisma.spot.update({
    where: { id: JIZOJI_ID },
    data: {
      visitTime: T(10, 43),
      memo: newJizojiMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
    },
  });
  await prisma.spot.update({ where: { id: MICHINOEKI_ID }, data: { visitTime: T(11, 43) } });
  await prisma.spot.update({
    where: { id: GERMANHOUSE_ID },
    data: {
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
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
