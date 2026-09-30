/**
 * チェックリスト #310 の修正記録(企画運営指摘、description重複)。
 * しおり「あべのハルカスと四天王寺、天王寺の絶景と歴史を巡るプラン」
 * (6d8232c0-df97-4f32-b8c3-6d8c9d3f0038)
 *
 * fix-310bのdescription置換処理の順序ミスで「昭和レトロな新世界・
 * 通天閣」が2回入り、実際のスポット順(堀越神社→四天王寺→美術館→
 * 慶沢園→茶臼山→てんしば→新世界・通天閣→ハルカス)とも合っていなかった
 * ため、書き直した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-310c-6d8232c0.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";

const ITIN_ID = "6d8232c0-df97-4f32-b8c3-6d8c9d3f0038";

async function main() {
  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "無病息災を祈る堀越神社から、聖徳太子ゆかりの四天王寺、大阪市立美術館、住友家旧本邸庭園の慶沢園、大坂の陣ゆかりの茶臼山、緑豊かな天王寺公園（てんしば）、昭和レトロな新世界・通天閣、そして西日本一の高さとされるあべのハルカスの展望台まで。古刹の歴史と下町情緒、高層ビルの絶景を1日で楽しむプランです。",
    },
  });
  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
