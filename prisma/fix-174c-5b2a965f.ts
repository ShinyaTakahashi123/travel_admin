/**
 * #174 5b2a965f の続き（しおりえ(制作補助2)）: 企画運営の確認（2026-10-11）の2点を直す
 *   ① タイトルの「パワースポット」を「歴史と信仰の地」に言い換える（説明文と本文にはこの言葉はない）
 *   ② 旧三上家住宅の「宮津の城下でも指折りの商家だった」を、同じ文の中でぼかす（出典: 宮津城下有数の商家）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-174c-5b2a965f.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5b2a965f-d418-4fb0-93b5-b715252e8740";
const OLD_TITLE = "元伊勢と丹後国分寺、歴史とパワースポットを訪ねる日帰り旅";
const TITLE = "元伊勢と丹後国分寺、歴史と信仰の地を訪ねる日帰り旅";
const FROM = "江戸時代、宮津の城下でも指折りの商家だった「元結屋」三上家の住まいです。";
const TO = "江戸時代、宮津の城下でも有数の商家とされる「元結屋」三上家の住まいです。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { title: true, description: true } });
  if (it.title !== OLD_TITLE) throw new Error(`タイトルが想定と違います: ${it.title}`);
  const all = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID } }, select: { memo: true } });
  const left = [it.description ?? "", ...all.map((x) => x.memo ?? "")].filter((m) => m.includes("パワースポット")).length;
  if (left) throw new Error(`説明文か本文に「パワースポット」が ${left} 件あります`);
  const s = await prisma.spot.findMany({ where: { day: { itineraryId: ITINERARY_ID }, name: "旧三上家住宅" } });
  if (s.length !== 1) throw new Error(`旧三上家住宅 ${s.length}件`);
  const memo = s[0].memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const neu = memo.replace(FROM, TO);
  console.log(`タイトル: ${TITLE}\n${neu}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { title: TITLE } });
    await tx.spot.update({ where: { id: s[0].id }, data: { memo: neu } });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
