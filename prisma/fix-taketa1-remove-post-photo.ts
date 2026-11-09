/**
 * 竹田(地方のしおり候補5)の「竹田の町なか（昼食）」に自動でついた写真(File:Taketa_Post_Office_ac.jpg)
 * を外す。郵便局の看板(「TAKETA POST OFFICE」)が大きく写っており、決まり(店の看板が大きく写るものは
 * 使わない)に触れるおそれがあるため。また昼食のスポットに郵便局の建物の写真は内容として合わない。
 * 使い方: npm run prod -- npx tsx prisma/fix-taketa1-remove-post-photo.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "岡城跡と「荒城の月」ゆかりの地、竹田の城下町をめぐる日帰りプラン";
const SPOT_NAME = "竹田の町なか（昼食）";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({
    where: { title: TITLE },
    include: { days: { include: { spots: { include: { photos: true } } } } },
  });
  const spot = it.days.flatMap((d) => d.spots).find((s) => s.name === SPOT_NAME);
  if (!spot) throw new Error("スポットが見つかりません");
  console.log("写真数:", spot.photos.length);
  for (const p of spot.photos) console.log(" -", p.id, p.url, p.caption);
  if (commit) {
    await prisma.photo.deleteMany({ where: { spotId: spot.id } });
    console.log("削除しました。");
  } else {
    console.log("(確認モード。--commit で削除します)");
  }
}
main().finally(() => prisma.$disconnect());
