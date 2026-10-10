/**
 * #375 d6badcd1 企画運営の指摘への対応（しおりえ(制作補助2)）: タイトルを中身に合わせる／天鼓林の本文の出典に近い言い回しを書き直す
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-375b-d6badcd1.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "d6badcd1-3d74-443c-acff-931643910c69";
const TENKORIN_ID = "a4fb873b-1da8-4959-86fe-625233cad9a3";
const COMMIT = process.argv.includes("--commit");
const TITLE = "天鼓林と石門、昇仙峡を歩いて上り甲府の町もめぐる1泊2日";
const MEMO =
  "長潭橋から渓谷沿いの遊歩道を歩いておよそ40分、山梨県の天然記念物に指定されている天鼓林に着きます。林の中の決まった場所で足を強く踏み鳴らすと、地面の下から鼓を打つような音が返ってくることで知られます。こうした音が聞こえる林は、岩盤の固い奥秩父の山々に見られるといわれ、昇仙峡のものはとりわけ音がよく響くとされています。木々に囲まれた静かな林で、トイレもあるので、渓谷歩きのひと休みにもちょうどよいところ。林を傷めないよう、道から外れずに音を確かめてみましょう。";

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true } });
  const sp = await prisma.spot.findFirstOrThrow({ where: { id: TENKORIN_ID, day: { itineraryId: ITINERARY_ID } }, select: { name: true, memo: true } });
  console.log(`タイトル: ${it.title}\n  → ${TITLE}\n${sp.name}:\n  前: ${sp.memo}\n  後: ${MEMO}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE } }),
    prisma.spot.update({ where: { id: TENKORIN_ID }, data: { memo: MEMO } }),
  ]);
  console.log("書き込みました。");
}
main().catch((e) => { console.error(e?.message); process.exit(1); }).finally(() => prisma.$disconnect());
