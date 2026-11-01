/**
 * 法務の10章見直し、城崎(6e2f29bb)の1件。Day2の1か所目(城崎温泉ロープウェイ)に、
 * 宿からの行き方と分がなかった。宿の場所は決まっていないため、1日目の最後のスポット
 * (まんだら湯、宿へ戻る文がある所)からrouted-footで測る(法務の指摘、2026-11-02)。
 * まんだら湯→城崎温泉ロープウェイは613m・8.2分→8分。言い方は企画運営の指示どおり
 * 出発→着く所の順にした。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const NAME = "城崎温泉ロープウェイ";
const OLD_MEMO =
  "2日目は城崎温泉ロープウェイで山頂駅へ。山頂からは、外湯めぐりで知られる城崎の町並みと、遠くに日本海までの眺めが広がります。運転の時間は公式の案内で確かめましょう。帰りは、途中の温泉寺駅で降りて温泉寺にお参りします。";
const NEW_MEMO = OLD_MEMO.replace(
  "2日目は城崎温泉ロープウェイで山頂駅へ。",
  "2日目は、城崎温泉の宿から歩いておよそ8分、城崎温泉ロープウェイの山麓駅へ。ロープウェイで山頂駅へ向かいましょう。"
);

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: NAME, day: { itineraryId: "6e2f29bb-45c2-494a-83c1-8e42e11552c1" } } });
  if (spot.memo !== OLD_MEMO) throw new Error("memo現在値が期待と不一致");
  console.log(`[${NAME}]\n旧: ${OLD_MEMO}\n\n新: ${NEW_MEMO}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: spot.id }, data: { memo: NEW_MEMO } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
