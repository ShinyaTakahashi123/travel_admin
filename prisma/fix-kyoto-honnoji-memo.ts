/**
 * fc54731b（京都3泊4日）本能寺のメモ、法務指摘の最後の1点（2026-10-29）
 * 「今夜も京都市内の宿でお休みください。」→「この夜も、京都市内の宿に泊まりましょう。」（六道珍皇寺と同じ形）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const HONNOJI = "78bfa5af-290a-4a08-a480-16d576993f3b";

const MEMO_OLD =
  "京都文化博物館から歩いておよそ10分、本能寺は、天正10年(1582)6月2日、家臣・明智光秀の謀反によって織田信長が最期を迎えた「本能寺の変」の舞台として知られる寺です。現在の本堂は、事件当時の場所から移転した後、複数回の焼失を経て再建されたもので、事件当日の建物とは場所も姿も異なります。境内には信長を祀る廟所があり、毎年6月には信長忌の法要が営まれています。静かに、敬意をもってお参りください。3日目はここまでです。今夜も京都市内の宿でお休みください。";
const MEMO_NEW =
  "京都文化博物館から歩いておよそ10分、本能寺は、天正10年(1582)6月2日、家臣・明智光秀の謀反によって織田信長が最期を迎えた「本能寺の変」の舞台として知られる寺です。現在の本堂は、事件当時の場所から移転した後、複数回の焼失を経て再建されたもので、事件当日の建物とは場所も姿も異なります。境内には信長を祀る廟所があり、毎年6月には信長忌の法要が営まれています。静かに、敬意をもってお参りください。3日目はここまでです。この夜も、京都市内の宿に泊まりましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: HONNOJI } });
  if (s.memo !== MEMO_OLD) throw new Error("本能寺: memo現在値が期待と不一致");
  console.log("前提の確認OK。\n");
  console.log(`[本能寺] memo末尾: 「今夜も京都市内の宿でお休みください。」→「この夜も、京都市内の宿に泊まりましょう。」`);

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: HONNOJI }, data: { memo: MEMO_NEW } });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
