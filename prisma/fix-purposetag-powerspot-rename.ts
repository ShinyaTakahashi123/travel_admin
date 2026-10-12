/**
 * ユーザー指示(企画運営経由、2026-10-12 00:01 JST)「祈りの場めぐりでよいです」。
 * 目的タグ(purpose_tag)「パワースポット」の名前を「祈りの場めぐり」に変更する
 * (1行の名前の変更のみ。しおり・テーマとのつながり(ItineraryPurposeTag・
 * ThemePurposeTag)は変えない)。法務の提案(「パワースポット」は効き目をうたう
 * ように読めるため)をユーザーが選んだもの。
 *
 * あわせて、このタグがついた公開中のしおりの本文・タイトル・説明文に
 * 「パワースポット」の言葉が残っていないかを調べる(件数と場所を報告するのみ、
 * この場では直さない)。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const FROM = "パワースポット";
const TO = "祈りの場めぐり";

async function main() {
  const targets = await prisma.purposeTag.findMany({ where: { name: FROM } });
  if (targets.length !== 1) {
    throw new Error(`対象が1件ではありません(${targets.length}件)。中止します。`);
  }
  const tag = targets[0];
  console.log(`対象タグ: id=${tag.id} name="${tag.name}"`);

  const linked = await prisma.itineraryPurposeTag.findMany({
    where: { purposeTagId: tag.id },
    include: { itinerary: { select: { id: true, title: true, description: true, status: true } } },
  });
  console.log(`つながっているしおり: ${linked.length}件`);

  let hitCount = 0;
  const hitList: string[] = [];
  for (const l of linked) {
    const it = l.itinerary;
    if (it.status !== "published") continue;
    const inTitleOrDesc = (it.title || "").includes(FROM) || (it.description || "").includes(FROM);
    const spots = await prisma.spot.findMany({ where: { day: { itineraryId: it.id } }, select: { name: true, memo: true } });
    const spotHits = spots.filter((s) => (s.memo || "").includes(FROM) || s.name.includes(FROM));
    if (inTitleOrDesc || spotHits.length > 0) {
      hitCount++;
      hitList.push(
        `${it.id.slice(0, 8)} 「${it.title}」` +
          (inTitleOrDesc ? " [タイトル/説明文に含む]" : "") +
          (spotHits.length > 0 ? ` [スポット${spotHits.length}件: ${spotHits.map((s) => s.name).join("、")}]` : "")
      );
    }
  }
  console.log(`「${FROM}」の言葉が本文等に残っているしおり: ${hitCount}件`);
  for (const h of hitList) console.log("  - " + h);

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.purposeTag.update({ where: { id: tag.id }, data: { name: TO } });
  console.log(`COMMITTED: "${FROM}" → "${TO}"`);
}
main().finally(() => prisma.$disconnect());
