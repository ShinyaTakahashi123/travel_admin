/**
 * #489 8d2e4984 の直し（しおりえ(制作補助2)、#209 の見直しのときに気づいた）
 * 4日目の上梨白山宮「永正元年（1502年）に再建された本殿」: 永正元年は1504年で、年号と西暦が合わない。
 *   五箇山総合案内所（https://gokayama-info.jp/みどころ/五箇山と世界遺産/国重文-村上家の周辺 ）は「1502年(文亀2年)に創建」としているので、
 *   年号を外し「1502年に建てられた本殿」にする（創建か再建かは出典で分かれるので書かない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-489d-8d2e4984.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "8d2e4984-c29c-43dd-a049-b39c6bbb8b5b";
const FROM = "永正元年（1502年）に再建された本殿";
const TO = "1502年に建てられた本殿";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 4, spotName: "上梨白山宮" });
  if (!s.memo?.includes(FROM)) throw new Error("本文が想定と違います");
  console.log(`${FROM} → ${TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 4, spotName: "上梨白山宮" }, { memo: s.memo.replace(FROM, TO) });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
