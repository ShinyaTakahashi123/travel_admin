/**
 * #415 4b15dd96 の追いの修正その2（しおりえ(制作補助2)、企画運営の指摘）
 * - 弘前公園: 天守の公開の状態を言い切らず、「時期によって変わるので公式で確かめて」の形に（#56・#342 と同じ書き方）
 * - 長勝寺: 冬の一文を「冬の間は拝観できない期間があるので公式で確かめて」の形に
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-415c-4b15dd96.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "4b15dd96-716f-4925-bfe3-86275452108e";
const COMMIT = process.argv.includes("--commit");
const EDITS: [string, string, string][] = [
  ["弘前公園（弘前城）", "天守は保存修理のため内部の公開を休止しているので、外からその姿を眺めましょう。", "天守は石垣の修理にあわせて、位置や見学できる範囲が時期によって変わるので、訪れる前に公式の案内で確かめましょう。"],
  ["長勝寺（禅林街）", "冬の間は休館するので、公式の案内で確かめてから訪れましょう。", "冬の間は拝観できない期間があるので、公式の案内で確かめてから訪れましょう。"],
];

async function main() {
  const rows = [];
  for (const [name, o, n] of EDITS) {
    const s = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: name });
    if (!s.memo?.includes(o)) throw new Error(`本文が想定と違います: ${name}`);
    rows.push({ id: s.id, memo: s.memo.replace(o, n) });
    console.log(`${name}: ${n}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    for (const r of rows) await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: r.id }, { memo: r.memo }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
