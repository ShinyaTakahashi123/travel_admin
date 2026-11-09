/**
 * 初日・最終日の見直し #161 1755b106 の追加の直し（しおりえ(制作補助2)、法務 10/30 03:06）
 * びわ湖大津港のメモに残っていた船の名前「ミシガン」を外す（便・船の名前は書かない決まり。#5 と同じ）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-161b-1755b106.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "1755b106-a197-4812-92d4-c57352d5dad5";
const KO = "685cdb97-9356-4c89-8389-76ce06d460bc";
const FROM = "赤い外輪が目印の「ミシガン」は、琵琶湖の南湖をめぐる大型の遊覧船で、最上階のデッキからは、";
const TO = "赤い外輪が目印の大型の遊覧船で、琵琶湖の南湖をめぐります。最上階のデッキからは、";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: KO }, include: { day: true } });
  if (s.day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const memo = s.memo ?? "";
  if (memo.split(FROM).length !== 2) throw new Error("置き換え元が見つかりません");
  const next = memo.replace(FROM, TO);
  console.log(`${s.name}: …${next.slice(next.indexOf("赤い外輪") - 10, next.indexOf("赤い外輪") + 90)}…`);
  if (next.includes("ミシガン")) throw new Error("まだ船の名前が残っています");
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
