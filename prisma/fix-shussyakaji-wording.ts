/**
 * 企画運営の依頼: 承認待ちの8f2be8d8（四国八十八か所12）出釈迦寺のメモを直す。
 *  - 「断崖から身を投げたところ、…抱きとめた」(5章、身を投げる表現) →
 *    「…と誓ったところ、釈迦如来と天女が現れた」に(飛び降りる所を書かない)
 *  - 「納経所で通行料を納めて」(お金の話) → 外す
 *  - 「…お出かけください」は言い切らない形に → 「…を心がけましょう。」
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "8f2be8d8-9b55-4c19-8eff-f23df7df24ae";
const SPOT_NAME = "出釈迦寺";

const FROM1 =
  "「仏門に入って多くの人を救えるなら釈迦如来よ姿を現してください、かなわないのなら我が身を捨てて仏に供養します」と唱えて断崖から身を投げたところ、釈迦如来と天女が現れて抱きとめたという言い伝えが残ります。";
const TO1 =
  "「仏門に入って多くの人を救えるなら、釈迦如来よ姿を現してください」と誓ったところ、釈迦如来と天女が現れたという言い伝えが残ります。";

const FROM2 = "徒歩で40〜50分ほど、あるいは納経所で通行料を納めて狭い林道";
const TO2 = "徒歩で40〜50分ほど、あるいは狭い林道";

const FROM3 = "歩きやすい靴と時間の余裕を持ってお出かけください。";
const TO3 = "歩きやすい靴で、時間の余裕を持って出かけることを心がけましょう。";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: SPOT_NAME, day: { itineraryId: ITIN_ID } } });
  if (!spot.memo || !spot.memo.includes(FROM1)) throw new Error("期待する文1が見つかりません");
  if (!spot.memo.includes(FROM2)) throw new Error("期待する文2が見つかりません");
  if (!spot.memo.includes(FROM3)) throw new Error("期待する文3が見つかりません");
  const after = spot.memo.replace(FROM1, TO1).replace(FROM2, TO2).replace(FROM3, TO3);
  console.log(`旧: ${spot.memo}\n\n新: ${after}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: spot.id }, data: { memo: after } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
