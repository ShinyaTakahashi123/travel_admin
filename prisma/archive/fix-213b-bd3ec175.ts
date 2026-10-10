/**
 * #213 bd3ec175 の追いの直し（しおりえ(制作補助2)、2026-10-01 企画運営の指摘「イルミネーションのあとでは、レンタカーの店が閉まっていることがある」）
 * 佐世保駅のそばのレンタカーの店は、夜は 18:00〜20:00 ごろに閉まる（トヨタレンタカー 佐世保駅前店 8:00〜20:00 https://rent.toyota.co.jp/sp/shop/detail.aspx?rCode=68301&eCode=009 、
 *   ニッポンレンタカー 佐世保駅前 8:00〜18:00 https://store.nipponrentacar.co.jp/b/nrs/info/010069/ 。店の名前は本文に書かない）。
 * そこで、弓張岳のあと佐世保駅でレンタカーを返し、JR でハウステンボスへ向かう形にする（夜の帰りは JR）:
 *   弓張岳展望台 14:30〜15:10 →（車で約15分の佐世保駅でレンタカーを返し、JR の長崎方面行きで約20分のハウステンボス駅、歩いて約7分。あわせて約55分）→ ハウステンボス 16:05〜17:00
 *   出典: 海風の国 https://www.sasebo99.com/spot/259 （佐世保駅から「長崎」方面行で約20分・JRハウステンボス駅から約7分）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-213b-bd3ec175.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "bd3ec175-b1cc-43be-9169-ec9e31ecc71a";
const D_FROM = "秋から冬のレンタカーの日帰りプラン";
const D_TO = "秋から冬の、レンタカーとJRでめぐる日帰りプラン";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const FROM1 = "弓張岳から車で約40分、大村湾のほとりのハウステンボスへ。";
const TO1 = "弓張岳から車で約15分のJR佐世保駅のそばでレンタカーを返し、JRの長崎方面行きで約20分のハウステンボス駅へ行き、歩いて約7分（あわせて約55分）。大村湾のほとりに広がるリゾートです。";
const FROM2 = "夜の帰りは、レンタカーをJR佐世保駅の近くで返しましょう（車で約40分）。";
const TO2 = "帰りは、JRハウステンボス駅から列車に乗りましょう。最終の列車の時刻は公式の案内で確かめましょう。";

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "ハウステンボス" });
  if (!s.memo?.startsWith(FROM1) || !s.memo.includes(FROM2)) throw new Error("本文が想定と違います");
  const memo = s.memo.replace(FROM1, TO1).replace(FROM2, TO2);
  console.log(`ハウステンボス 16:05〜17:00（train 55分）\n${memo}`);
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(D_FROM)) throw new Error("説明文が想定と違います");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description.replace(D_FROM, D_TO) } });
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "ハウステンボス" }, { visitTime: t(16, 5), stayDurationMin: 55, transitMode: "train", transitDurationMin: 55, transitLine: "JR大村線", memo });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
