/**
 * 初日・最終日の見直し #163 bd33014d の追加の直し（しおりえ(制作補助2)、法務 10/30 03:21）
 * 浜町アーケードの書き出しに、崇福寺からの歩きの分数を入れる（itinerary-rules 145。850m・12分）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-163b-bd33014d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "bd33014d-d57d-49c2-b7a7-3c34456fa368";
const KO = "065eb03f-8417-4e91-9398-f4c70c98b235";
const FROM = "お昼は、長崎の中心部にある商店街、浜町アーケードで昼食をとりましょう。";
const TO = "崇福寺から歩いて12分ほど。お昼は、長崎の中心部にある商店街、浜町アーケードで昼食をとりましょう。";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: KO }, include: { day: true } });
  if (s.day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const memo = s.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("置き換え元が見つかりません");
  const next = memo.replace(FROM, TO);
  console.log(`${s.name}: …${next.slice(0, 70)}…`);

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
