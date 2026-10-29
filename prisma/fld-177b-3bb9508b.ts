/**
 * 初日・最終日の見直し #177 3bb9508b の続き（しおりえ(制作補助2)）
 * 石手寺の点がバス停 node 3152608253「石手寺」そのものだったので、メモに出てくる国宝の仁王門 way 444272241 の Nominatim（33.8475,132.7965681）にする（法務 10/30）。
 * 子規記念博物館→仁王門 foot 1,075m・14分（もとの20分以内）、仁王門→道後温泉駅 1,354m・17分（帰りの一文のまま）で、時刻・文は変えない
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-177b-3bb9508b.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ISHITEJI = "c780d153-214f-4095-abf2-1f86b157faa2";
const FROM: [number, number] = [33.84677, 132.796393];
const TO: [number, number] = [33.8475, 132.796568];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: ISHITEJI } });
  if (Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1]) throw new Error(`いまの座標が想定と違います（${s.lat},${s.lng}）`);
  console.log(`座標 ${s.name}: ${s.lat},${s.lng} → ${TO.join(",")}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: ISHITEJI }, data: { lat: TO[0], lng: TO[1] } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
