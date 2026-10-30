/**
 * #53 d8a6076d 釣山公園の点の直し（しおりえ(制作補助2)、法務の指摘・企画運営 10/30 の判断 (A)。時刻は変えない）
 * 公園全体の way 565571532 の中心 38.924413,141.129505 → 一関八幡神社 node 4586997126（38.9229267,141.1316002。境内社の竹駒神社・天満宮・めおと親子杉の点が集まる本社）
 * 骨寺村荘園交流館から OSRM 15.1分（21分のまま）。一ノ関駅まで routed-foot 1,335m・17.8分 → 宿の一文の「約22分」を「約18分」に
 * 田村神社の「相殿として」「東京の田村屋敷から大正年代に移された」は出典で確かめられないので、「丘の上には、一関八幡神社や田村神社がまつられています。」に（法務 10/30）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-053b-d8a6076d.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const TSURI = "925ecc55-fd42-493e-aa73-3667265e8298";
const FROM: [number, number] = [38.924413, 141.129505];
const TO: [number, number] = [38.922927, 141.1316];
const FACT_FROM = "丘の上には一関八幡神社が鎮座し、社殿には田村神社が相殿として祀られています。田村神社は、もとは東京の田村屋敷にあったお社で、大正年代に一関藩主・田村家が一関に常住するのにあわせてこの地に移されました。";
const FACT_TO = "丘の上には、一関八幡神社や田村神社がまつられています。";
const MEMO_FROM = "この夜は、歩いておよそ22分の一ノ関駅のまわりの宿に泊まりましょう。";
const MEMO_TO = "この夜は、歩いておよそ18分の一ノ関駅のまわりの宿に泊まりましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: TSURI }, include: { day: { select: { itineraryId: true } } } });
  if (!s.day.itineraryId.startsWith("d8a6076d") || Number(s.lat) !== FROM[0] || Number(s.lng) !== FROM[1] || (s.memo ?? "").split(MEMO_FROM).length !== 2 || (s.memo ?? "").split(FACT_FROM).length !== 2)
    throw new Error(`いまの値が想定と違います（${s.lat},${s.lng}）`);
  console.log(`${s.name}: ${FROM.join(",")} → ${TO.join(",")}`);
  console.log(`  ${MEMO_FROM} → ${MEMO_TO}`);
  console.log(`  ${FACT_FROM} → ${FACT_TO}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: TSURI }, data: { lat: TO[0], lng: TO[1], memo: s.memo!.replace(MEMO_FROM, MEMO_TO).replace(FACT_FROM, FACT_TO) } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
