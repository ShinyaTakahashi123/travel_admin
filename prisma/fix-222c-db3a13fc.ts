/**
 * #222 db3a13fc の観潮船の言い方の直し（しおりえ(制作補助2)、法務の指摘 10/11）
 * 「日本三大急潮のひとつに数えられる」は公に定まった並びではないので、#221 と同じく「とされる」の伝聞にする
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-222c-db3a13fc.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "db3a13fc-e98e-4299-9f52-ca2842637553";
const COMMIT = process.argv.includes("--commit");
const FROM = "日本三大急潮のひとつに数えられる来島海峡";
const TO = "日本三大急潮のひとつとされる来島海峡";

async function main() {
  const spots = await prisma.spot.findMany({ where: { name: "来島海峡急流観潮船", day: { itineraryId: ITINERARY_ID } } });
  if (spots.length !== 1 || !(spots[0].memo ?? "").includes(FROM)) throw new Error("構成が想定と違います");
  const memo = spots[0].memo!.replace(FROM, TO);
  console.log(memo);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: spots[0].id }, data: { memo } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
