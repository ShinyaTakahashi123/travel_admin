/**
 * 3b17f9a0（奥入瀬渓流・十和田湖）十和田ビジターセンターの言葉の直し（法務指摘、2026-10-30）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const VC = "74f61a32-3d6a-40f4-b25d-1984c6c3268f";

const MEMO_OLD =
  "乙女の像から歩いておよそ15分、十和田ビジターセンターに着きます。十和田湖・奥入瀬渓流一帯の自然について、地形や動植物、四季それぞれの見どころを、模型やパネル、映像で紹介する施設です。昨日歩いた渓流と、今日ここまで巡ってきた湖畔の景色を振り返りながら見学すると、この一帯がどのようにして今の姿になったのか、より深く知ることができます。売店も併設されているので、旅の合間の休憩にもどうぞご利用ください。";
const MEMO_NEW =
  "乙女の像から歩いておよそ15分、十和田ビジターセンターに着きます。十和田湖・奥入瀬渓流一帯の自然について、地形や動植物、四季それぞれの見どころを、模型やパネル、映像で紹介する施設です。昨日歩いた渓流と、今日ここまで巡ってきた湖畔の景色を振り返りながら見学すると、この一帯がどのようにして今の姿になったのか、より深く知ることができます。売店もあるので、旅の合間の休憩にも立ち寄りましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: VC } });
  if (s.memo !== MEMO_OLD) throw new Error("十和田ビジターセンター: memo現在値が期待と不一致");
  console.log("前提の確認OK。\n");
  console.log("[十和田ビジターセンター] どうぞご利用ください。→立ち寄りましょう。");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.spot.update({ where: { id: VC }, data: { memo: MEMO_NEW } });
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
