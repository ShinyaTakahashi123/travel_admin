/**
 * 関宿＋伊賀上野(地方のしおり候補6、30eed95e)の、伊賀上野城の写真の作者欄を直す。
 * 「オリジナルのアップロード者は日本語版ウィキペディアのT@kaさん」というCommonsのテンプレート
 * 文言のままだったため、実際のユーザー名「T@ka」に直す(白水ダムのときと同じ直し。法務の指摘
 * 2026-11-03)。
 * 使い方: npm run prod -- npx tsx prisma/fix-sekiueno1-igaueno-author.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const TITLE = "東海道関宿の町並みと伊賀上野城、二つの城下町をめぐる日帰りプラン";
const SPOT_NAME = "伊賀上野城";
const NEW_AUTHOR = "T@ka";

async function main() {
  const commit = process.argv.includes("--commit");
  const it = await prisma.itinerary.findFirstOrThrow({ where: { title: TITLE } });
  const day = await prisma.day.findFirstOrThrow({
    where: { itineraryId: it.id },
    include: { spots: { include: { photos: true } } },
  });
  const spot = day.spots.find((s) => s.name === SPOT_NAME);
  if (!spot) throw new Error("伊賀上野城が見つかりません");
  const photo = spot.photos[0];
  if (!photo) throw new Error("伊賀上野城の写真が見つかりません");
  console.log("直す前の作者欄:", photo.author);
  console.log("直した後の作者欄:", NEW_AUTHOR);

  if (commit) {
    await prisma.photo.update({ where: { id: photo.id }, data: { author: NEW_AUTHOR } });
    console.log("書き込みました。");
  } else {
    console.log("(確認モード。--commit で書き込みます)");
  }
}
main().finally(() => prisma.$disconnect());
