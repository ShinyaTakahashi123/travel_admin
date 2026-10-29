/**
 * 初日・最終日の見直し #162 429aa0c4 の追加の直し（しおりえ(制作補助2)、法務 10/30 03:18）
 * 南方熊楠記念館の宿の一文を、新しく書く一文の形（itinerary-rules 74・75）にそろえる
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-162b-429aa0c4.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "429aa0c4-7d53-4cb8-b830-cbf7885a1f29";
const KO = "b0270b52-5927-4f59-ad6d-70bf508f32c5";
const FROM = "今夜は、白浜温泉に泊まります。";
const TO = "この夜は、白浜温泉の宿に泊まりましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: KO }, include: { day: true } });
  if (s.day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const memo = s.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("置き換え元が見つかりません");
  const next = memo.replace(FROM, TO);
  console.log(`${s.name}: …${next.slice(next.length - 60)}…`);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: KO }, data: { memo: next } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
