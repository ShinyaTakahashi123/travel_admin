/**
 * 冬の特集の見直し(docs/content/20261102-winter-feature-rule-pass.md)。
 * 出雲大社の初詣(21f198de、published)。
 *
 * 直すこと(法務の訂正2026-11-02 02:43/02:44/02:48を反映):
 *   1. 1か所目(稲佐の浜)に入口(出雲市駅)からの行き方・分がない → レンタカーの一文を追加。
 *      出雲市駅→稲佐の浜はOSRM車実測10.8分、決まり(道のりの時間+5分)で16分。
 *      入口着8:45ごろ+手続き15分+運転16分で、稲佐の浜の着は09:15
 *   2. 稲佐の浜→出雲大社(transitLeg、もと10分)もOSRM実測1,341m・2.1分で、決まり
 *      (×1.5+5=8.2分を超えるため道のり+5分に直す区間)により7分に直す。稲佐の浜の最後の文・
 *      出雲大社の書き出しも7分に
 *   3. 出雲大社110分(公式の見学目安の根拠なし) → 100分以内の95分に短縮
 *   4. 1・2・3により、各スポットの時刻を次のとおり直す: 出雲大社10:12(09:15+50+7)、
 *      古代出雲歴史博物館11:52(10:12+95+5(歩5分は変更なし))、神門通り13:07、旧大社駅13:37、
 *      出雲日御碕灯台14:34、日御碕神社15:32。終わりは16:32(16:30〜17:00の中)。滞在とほかの
 *      移動の分は変更しない
 *   5. 最後の日御碕神社に帰りの一文がない → 出雲市駅までOSRM車実測18.9分、決まりで24分
 *   6. 入口のレンタカー手続き「15分ほど」は出典がないため削除(企画運営の指摘 2026-11-02。
 *      文のみ、時刻・分は変更しない)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-winter-izumo.ts
 *   反映: npm run prod -- npx tsx prisma/fix-winter-izumo.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const INASA_SPOT_ID = "8e02831c-94c5-48e7-bbdb-ff769a07bddd";
const TAISHA_SPOT_ID = "4d6a631f-7cbc-44a0-86e0-b61d3c56d9cb";
const TAISHA_LEG_ID = "74dfb141-333f-413c-89f4-e161cee3ac1c";
const MUSEUM_SPOT_ID = "cb461586-a3bf-4ff8-ac81-1594c478be8e";
const SHINMON_SPOT_ID = "c4ca9c8f-4acb-432d-9ddb-336531eaace1";
const KYUTAISHA_SPOT_ID = "754b4f9e-e9ef-42a6-8ad2-f73b7c9df109";
const TOUDAI_SPOT_ID = "743f0fd3-4545-4bbb-b3b6-633d6a2a237b";
const HINOMISAKI_JINJA_SPOT_ID = "6fced6b6-2960-4df4-9fd1-1fbfd424a74f";

function toTime(hhmm: string): Date {
  const [h, m] = hhmm.split(":").map(Number);
  return new Date(Date.UTC(1970, 0, 1, h, m, 0));
}

const INASA_FIND_ENTRY = "出雲大社の参拝に先立ち、まず立ち寄りたいのが稲佐の浜です。";
const INASA_REPLACE_ENTRY =
  "出雲市駅に8時45分ごろ着いたら、駅の近くでレンタカーを借りて、車でおよそ16分、稲佐の浜に着きます。出雲大社の参拝に先立ち、まず立ち寄りたい場所です。";
const INASA_FIND_CLOSE = "この後は、車でおよそ10分、出雲大社へ向かいましょう。";
const INASA_REPLACE_CLOSE = "この後は、車でおよそ7分、出雲大社へ向かいましょう。";

const TAISHA_FIND_OPEN = "出雲大社は、『古事記』や『日本書紀』に記される神話によれば";
// 出雲大社のメモは「出雲大社は、」で始まり、前のスポットからの分数は書かれていなかったため、
// 書き出しに「稲佐の浜から車でおよそ7分、」を追加する
const TAISHA_REPLACE_OPEN = "稲佐の浜から車でおよそ7分、出雲大社に着きます。『古事記』や『日本書紀』に記される神話によれば";

const HINOMISAKI_FIND = "静かに、敬意をもって、両方の宮を参拝してください。新しい年の良縁と旅の無事を祈って、出雲をめぐる今日の旅を締めくくりましょう。";
const HINOMISAKI_REPLACE =
  "静かに、敬意をもって、両方の宮を参拝してください。新しい年の良縁と旅の無事を祈って、出雲をめぐる今日の旅を締めくくりましょう。見学を終えたら、車でおよそ24分の出雲市駅へ戻り、レンタカーを返しましょう(返す手続きに15分ほど)。";

async function main() {
  const commit = process.argv.includes("--commit");

  await prisma.$transaction(
    async (tx) => {
      const inasa = await tx.spot.findUniqueOrThrow({ where: { id: INASA_SPOT_ID } });
      const taisha = await tx.spot.findUniqueOrThrow({ where: { id: TAISHA_SPOT_ID } });
      const hinomisaki = await tx.spot.findUniqueOrThrow({ where: { id: HINOMISAKI_JINJA_SPOT_ID } });

      if (!inasa.memo?.includes(INASA_FIND_ENTRY)) throw new Error("[想定と違います] 稲佐の浜の入口の文がありません");
      if (!inasa.memo?.includes(INASA_FIND_CLOSE)) throw new Error("[想定と違います] 稲佐の浜の閉じの文がありません");
      if (!taisha.memo?.startsWith(TAISHA_FIND_OPEN)) throw new Error("[想定と違います] 出雲大社の書き出しが想定と違います");
      if (!hinomisaki.memo?.includes(HINOMISAKI_FIND)) throw new Error("[想定と違います] 日御碕神社のメモに対象の文がありません");
      if (taisha.stayDurationMin !== 110) throw new Error(`[想定と違います] 出雲大社のstayDurationMinが110ではありません: ${taisha.stayDurationMin}`);

      const newInasaMemo = inasa.memo.replace(INASA_FIND_ENTRY, INASA_REPLACE_ENTRY).replace(INASA_FIND_CLOSE, INASA_REPLACE_CLOSE);
      const newTaishaMemo = TAISHA_REPLACE_OPEN + taisha.memo.slice(TAISHA_FIND_OPEN.length);
      const newHinomisakiMemo = hinomisaki.memo!.replace(HINOMISAKI_FIND, HINOMISAKI_REPLACE);

      const timeUpdates: [string, string][] = [
        [INASA_SPOT_ID, "09:15"],
        [TAISHA_SPOT_ID, "10:12"],
        [MUSEUM_SPOT_ID, "11:52"],
        [SHINMON_SPOT_ID, "13:07"],
        [KYUTAISHA_SPOT_ID, "13:37"],
        [TOUDAI_SPOT_ID, "14:34"],
        [HINOMISAKI_JINJA_SPOT_ID, "15:32"],
      ];

      console.log("=== 時刻の変更 ===");
      for (const [id, t] of timeUpdates) console.log(`${id} → ${t}`);
      console.log("出雲大社 transitLeg min 直前=10 直後=7");
      console.log("出雲大社 stayDurationMin 直前=110 直後=95");

      console.log("\n=== 稲佐の浜 ===");
      console.log("直前:", inasa.memo);
      console.log("直後:", newInasaMemo);

      console.log("\n=== 出雲大社(書き出しのみ抜粋) ===");
      console.log("直前:", taisha.memo!.slice(0, 80));
      console.log("直後:", newTaishaMemo.slice(0, 80));

      console.log("\n=== 日御碕神社 ===");
      console.log("直前:", hinomisaki.memo);
      console.log("直後:", newHinomisakiMemo);

      for (const [id, t] of timeUpdates) {
        await tx.spot.update({ where: { id }, data: { visitTime: toTime(t) } });
      }
      await tx.spot.update({ where: { id: INASA_SPOT_ID }, data: { memo: newInasaMemo } });
      await tx.spot.update({ where: { id: TAISHA_SPOT_ID }, data: { memo: newTaishaMemo, stayDurationMin: 95 } });
      await tx.spotTransitLeg.update({ where: { id: TAISHA_LEG_ID }, data: { transitDurationMin: 7 } });
      await tx.spot.update({ where: { id: HINOMISAKI_JINJA_SPOT_ID }, data: { memo: newHinomisakiMemo } });

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

  if (commit) console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
