/**
 * #74(竹林と紫陽花、鎌倉の名庭と自然をゆったり巡る1泊2日、4b95c57d)の、
 * 歩きの道具の直し(round2)。
 *
 * 法務の指摘: router.project-osrm.org は「foot」でも車道だけの経路しか
 * 持たず、歩き専用の近道(石段・歩道など)を考えないため、歩きの区間は
 * 実際より長く出ることがある。歩きは routing.openstreetmap.de/routed-foot
 * で測り直すべき。
 *
 * fix-74-4b95c57d.ts(round1)で直した歩きの区間を、routing.openstreetmap.de
 * で測り直した結果:
 * - 杉本寺→浄妙寺(8分): 実測9.4分 → 差1.4分、ほぼ一致。直さない
 * - 浄妙寺→瑞泉寺(28分): 実測26.2分 → 差1.8分、ほぼ一致。直さない
 *   (法務が「金沢街道まわり」の道のりで確かめ済み)
 * - 瑞泉寺→鎌倉宮(11分): 実測14.4分 → 差3.4分、ほぼ一致。直さない
 * - 鎌倉宮→荏柄天神社(6分): 実測4.9分 → 差1.1分、ほぼ一致。直さない
 * - 荏柄天神社→鶴岡八幡宮(18分): 実測13.9分 → 差4.1分、長すぎる。
 *   **18分→14分に直す**(もとは9分だったが、project-osrm.orgの値が
 *   大きくずれていたため、実測寄りの14分に訂正)
 * - 明月院→東慶寺(10分): 実測12.5分 → 差2.5分、ほぼ一致。直さない
 * - 円覚寺→英勝寺(34分): 実測25.3分 → 差8.7分、長すぎる。
 *   **34分→25分に直す**(もとは18分だったが、project-osrm.orgの値が
 *   大きくずれていたため、実測寄りの25分に訂正)
 * - 寿福寺→海蔵寺(10分): 実測10.2分 → ほぼ一致。直さない
 *
 * 浮いた時間の使い方(決まりの順、企画運営 2026-10-30):
 * - Day1: 荏柄天神社→鶴岡八幡宮が4分短くなる分、鶴岡八幡宮の到着が
 *   16:00→15:56に早まる(滞在55分は無変更)。終了は16:51で、今の
 *   16:55より早いが16:30〜17:00の範囲内なので、滞在を延ばす必要はない。
 * - Day2: 円覚寺→英勝寺が9分短くなる分、①の決まり(このitineraryの
 *   移動の測り直しで短くした滞在をもとの長さまで戻す)に従い、
 *   円覚寺の滞在を70分→78分(もとは90分、8分だけ戻す)、
 *   英勝寺の滞在を34分→35分(もとの35分に戻す、+1分)に戻す。
 *   この結果、英勝寺の出発(15:15)・寿福寺(15:17)・海蔵寺(16:02〜16:37)
 *   はすべて今と同じ時刻のまま(延びていない)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-74-4b95c57d-round2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-74-4b95c57d-round2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const EGARA_ID = "9db58e58-8cde-4f50-8209-41200382e176";
const TSURUGAOKA_ID = "8b535b93-e34c-4305-bc9a-bd688dfadc80";
const ENGAKUJI_ID = "dd43b2c9-9e29-462f-81ab-1d179c4d63d5";
const EISHOJI_ID = "b76e031e-ef2c-4d5b-8c83-797bfc38282d";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TSURUGAOKA_FIND = "荏柄天神社から歩いて18分ほど";
const TSURUGAOKA_REPLACE = "荏柄天神社から歩いて14分ほど";

const EISHOJI_FIND = "円覚寺から歩いて34分ほど";
const EISHOJI_REPLACE = "円覚寺から歩いて25分ほど";

async function main() {
  const commit = process.argv.includes("--commit");

  const [tsurugaoka, eishoji] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TSURUGAOKA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: EISHOJI_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["鶴岡八幡宮", tsurugaoka, TSURUGAOKA_FIND],
    ["英勝寺", eishoji, EISHOJI_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newTsurugaokaMemo = tsurugaoka.memo!.replace(TSURUGAOKA_FIND, TSURUGAOKA_REPLACE);
  const newEishojiMemo = eishoji.memo!.replace(EISHOJI_FIND, EISHOJI_REPLACE);

  console.log("=== #74 round2: 歩きの道具の直し ===\n");
  console.log("-- Day1 --");
  console.log(`[荏柄天神社] 変更なし`);
  console.log(`[鶴岡八幡宮] 新visitTime: 15:56  新stay: 55(無変更、〜16:51)  新leg: walk/14分`);
  console.log("  新memo:", newTsurugaokaMemo);
  console.log("\n-- Day2 --");
  console.log(`[円覚寺] 新stay: 78(もと70、原本90のうち8分戻す)`);
  console.log(`[英勝寺] 新visitTime: 14:40  新stay: 35(もと34、原本35に戻す)  新leg: walk/25分`);
  console.log("  新memo:", newEishojiMemo);
  console.log(`[寿福寺][海蔵寺] 変更なし(出発・到着は今と同じ)`);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: TSURUGAOKA_ID },
    data: {
      visitTime: T(15, 56),
      memo: newTsurugaokaMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14 }] },
    },
  });
  await prisma.spot.update({ where: { id: ENGAKUJI_ID }, data: { stayDurationMin: 78 } });
  await prisma.spot.update({
    where: { id: EISHOJI_ID },
    data: {
      visitTime: T(14, 40),
      stayDurationMin: 35,
      memo: newEishojiMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 25 }] },
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
