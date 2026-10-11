/**
 * #371の続き。法務の指摘(記録6825f9b)に対応。
 *
 * 「サイエンス・スクエアつくば」は、現在「AIST-Cube」に改称され、見学が
 * 完全予約制になっている(るるぶ https://rurubu.jp/andmore/spot/80006202
 * 「完全予約制、公式サイトにて要予約」)。スポット名を「AIST-Cube(旧
 * サイエンス・スクエアつくば)」に変更し、本文にも新しい名前と、予約が
 * 必要な旨の一文を追加した。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-371c-d20ff955.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "78eb1ce7-82b5-45de-9686-a07f4031f663";

async function main() {
  const square = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "サイエンス・スクエアつくば" } });

  const oldOpen = "地質標本館から歩いて2分ほど、次に訪れるのはサイエンス・スクエアつくばです。産業技術総合研究所(産総研)の最新の研究成果を、映像や試作品の展示を通じて紹介する、産業技術のショールームです。難しい研究テーマも、体験型の展示を通してわかりやすく学べるよう工夫されています。見学には1〜2時間ほどかかることもあるので、時間に余裕をもって回りましょう。見学を終えたら、歩いて筑波宇宙センターの駐車場へ戻りましょう。";
  const newOpen =
    "地質標本館から歩いて2分ほど、次に訪れるのはAIST-Cube(旧サイエンス・スクエアつくば)です。産業技術総合研究所(産総研)の最新の研究成果を、映像や試作品の展示を通じて紹介する、産業技術のショールームです。難しい研究テーマも、体験型の展示を通してわかりやすく学べるよう工夫されています。見学は予約が必要なので、公式サイトで確かめておきましょう。見学には1〜2時間ほどかかることもあるので、時間に余裕をもって回りましょう。見学を終えたら、歩いて筑波宇宙センターの駐車場へ戻りましょう。";

  if (square.name === "AIST-Cube(旧サイエンス・スクエアつくば)") {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: square.id },
    data: {
      name: "AIST-Cube(旧サイエンス・スクエアつくば)",
      memo: square.memo === oldOpen ? newOpen : square.memo,
    },
  });

  // つくば駅で昼食の書き出しも、前のスポット名に合わせて更新する
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "つくば駅で昼食" } });
  const lunchOld =
    "サイエンス・スクエアつくばから歩いて10分ほどの筑波宇宙センターの駐車場に戻り、車でさらに10分ほど、お昼はつくば駅周辺で食事をとりましょう。駅に直結する商業施設には、さまざまなジャンルの食事処が集まっています。研究学園都市らしい、広々とした街並みを眺めながら、ゆっくりと食事を楽しみましょう。お腹を満たしたら、歩いてつくばエキスポセンターへ向かいましょう。";
  const lunchNew =
    "AIST-Cubeから歩いて10分ほどの筑波宇宙センターの駐車場に戻り、車でさらに10分ほど、お昼はつくば駅周辺で食事をとりましょう。駅に直結する商業施設には、さまざまなジャンルの食事処が集まっています。研究学園都市らしい、広々とした街並みを眺めながら、ゆっくりと食事を楽しみましょう。お腹を満たしたら、歩いてつくばエキスポセンターへ向かいましょう。";
  if (lunch.memo === lunchOld) {
    await prisma.spot.update({ where: { id: lunch.id }, data: { memo: lunchNew } });
  }

  console.log("#371続き: サイエンス・スクエアつくば→AIST-Cube(旧サイエンス・スクエアつくば)に改名、予約の一文を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
