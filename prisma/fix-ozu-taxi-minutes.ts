/**
 * 大洲の日帰りしおり(5ce1979f、承認待ち)のタクシー分の直し(法務訂正 2026-11-02 02:19)。
 * 「×1.5+5分」はもとの値を残してよい上限で、新しく決めるときの目安は「道のりの時間+5分」。
 *   臥龍山荘→如法寺: OSRM 3.0分+5=8分（旧10分）
 *   如法寺→少彦名神社: OSRM 3.2分+5=8分（旧10分）
 *   少彦名神社→伊予大洲駅: OSRM 4.2分+5=9分（旧11分。メモの文のみ、DBにスポットなし）
 * 着く時刻: 如法寺15:02(旧15:04)、少彦名神社15:55(旧15:59)。滞在は変更しない。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-ozu-taxi-minutes.ts
 *   反映: npm run prod -- npx tsx prisma/fix-ozu-taxi-minutes.ts --commit
 */
import { prisma } from "../src/lib/prisma";

function toTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

const NYOHOJI_SPOT_ID = "e4ce2e86-d580-4bc1-b05b-50c03288da2d";
const NYOHOJI_LEG_ID = "64cd73cf-1b5a-4d94-b80c-cf366e709cc8";
const SUKUNAHIKONA_SPOT_ID = "840099cf-2900-4291-a7e6-45db6698292d";
const SUKUNAHIKONA_LEG_ID = "cc4f99fa-f2ad-43c0-86af-0e0a75edd12f";

const RYUJO_MEMO_FIND = "見学を終えたら、タクシーでおよそ10分、如法寺へ向かいましょう";
const RYUJO_MEMO_REPLACE = "見学を終えたら、タクシーでおよそ8分、如法寺へ向かいましょう";

const NYOHOJI_MEMO_OPEN_FIND = "臥龍山荘からタクシーでおよそ10分、如法寺に着きます。";
const NYOHOJI_MEMO_OPEN_REPLACE = "臥龍山荘からタクシーでおよそ8分、如法寺に着きます。";
const NYOHOJI_MEMO_CLOSE_FIND = "見学を終えたら、タクシーでおよそ10分、少彦名神社へ向かいましょう";
const NYOHOJI_MEMO_CLOSE_REPLACE = "見学を終えたら、タクシーでおよそ8分、少彦名神社へ向かいましょう";

const SUKUNAHIKONA_MEMO_OPEN_FIND = "如法寺からタクシーでおよそ10分、少彦名神社に着きます。";
const SUKUNAHIKONA_MEMO_OPEN_REPLACE = "如法寺からタクシーでおよそ8分、少彦名神社に着きます。";
const SUKUNAHIKONA_MEMO_CLOSE_FIND = "見学を終えたら、タクシーでおよそ11分の伊予大洲駅へ戻りましょう。";
const SUKUNAHIKONA_MEMO_CLOSE_REPLACE = "見学を終えたら、タクシーでおよそ9分の伊予大洲駅へ戻りましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      const ryujo = await tx.spot.findUniqueOrThrow({ where: { id: "4a8d6252-9db7-4a5a-8665-18868a9c4b8b" } });
      const nyohoji = await tx.spot.findUniqueOrThrow({ where: { id: NYOHOJI_SPOT_ID } });
      const sukunahikona = await tx.spot.findUniqueOrThrow({ where: { id: SUKUNAHIKONA_SPOT_ID } });

      if (!ryujo.memo?.includes(RYUJO_MEMO_FIND)) throw new Error("[想定と違います] 臥龍山荘のメモに対象の文がありません");
      if (!nyohoji.memo?.includes(NYOHOJI_MEMO_OPEN_FIND) || !nyohoji.memo?.includes(NYOHOJI_MEMO_CLOSE_FIND))
        throw new Error("[想定と違います] 如法寺のメモに対象の文がありません");
      if (!sukunahikona.memo?.includes(SUKUNAHIKONA_MEMO_OPEN_FIND) || !sukunahikona.memo?.includes(SUKUNAHIKONA_MEMO_CLOSE_FIND))
        throw new Error("[想定と違います] 少彦名神社のメモに対象の文がありません");

      const newRyujoMemo = ryujo.memo.replace(RYUJO_MEMO_FIND, RYUJO_MEMO_REPLACE);
      const newNyohojiMemo = nyohoji.memo.replace(NYOHOJI_MEMO_OPEN_FIND, NYOHOJI_MEMO_OPEN_REPLACE).replace(NYOHOJI_MEMO_CLOSE_FIND, NYOHOJI_MEMO_CLOSE_REPLACE);
      const newSukunahikonaMemo = sukunahikona.memo
        .replace(SUKUNAHIKONA_MEMO_OPEN_FIND, SUKUNAHIKONA_MEMO_OPEN_REPLACE)
        .replace(SUKUNAHIKONA_MEMO_CLOSE_FIND, SUKUNAHIKONA_MEMO_CLOSE_REPLACE);

      console.log("=== 臥龍山荘(メモのみ) ===");
      console.log("直前:", ryujo.memo);
      console.log("直後:", newRyujoMemo);

      console.log("\n=== 如法寺 ===");
      console.log(`visitTime 直前=${nyohoji.visitTime!.toISOString()} 直後=15:02`);
      console.log("transitLeg min 直前=10 直後=8");
      console.log("メモ 直前:", nyohoji.memo);
      console.log("メモ 直後:", newNyohojiMemo);

      console.log("\n=== 少彦名神社 ===");
      console.log(`visitTime 直前=${sukunahikona.visitTime!.toISOString()} 直後=15:55`);
      console.log("transitLeg min 直前=10 直後=8");
      console.log("メモ 直前:", sukunahikona.memo);
      console.log("メモ 直後:", newSukunahikonaMemo);

      await tx.spot.update({ where: { id: ryujo.id }, data: { memo: newRyujoMemo } });
      await tx.spot.update({ where: { id: nyohoji.id }, data: { memo: newNyohojiMemo, visitTime: toTime("15:02") } });
      await tx.spotTransitLeg.update({ where: { id: NYOHOJI_LEG_ID }, data: { transitDurationMin: 8 } });
      await tx.spot.update({ where: { id: sukunahikona.id }, data: { memo: newSukunahikonaMemo, visitTime: toTime("15:55") } });
      await tx.spotTransitLeg.update({ where: { id: SUKUNAHIKONA_LEG_ID }, data: { transitDurationMin: 8 } });

      if (!commit) {
        console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
        throw new Error("DRY_RUN_ROLLBACK");
      }
    },
    { timeout: 60000 }
  ).catch((e) => {
    if (e.message === "DRY_RUN_ROLLBACK") return;
    throw e;
  });

  if (commit) {
    console.log("\n[--commit] 書き込みました。");
  }
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
