/**
 * 冬の特集③(yukimatsuri-fuyukeshiki)から富良野・美瑛(03330540)を外す。
 * 理由: 昼食のスポット(美瑛選果)が全面休業と分かったため(企画運営、2026-11-02)。
 * 題「...6選」→「...5選」、説明文から「富良野・美瑛の冬景色」を外す。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const FEATURE_SLUG = "yukimatsuri-fuyukeshiki";
const OLD_TITLE = "雪まつりと雪景色、冬ならではの旅のモデルコース6選";
const NEW_TITLE = "雪まつりと雪景色、冬ならではの旅のモデルコース5選";
const OLD_DESC =
  "弘前城雪燈籠まつり、さっぽろ雪まつりと小樽雪あかりの路、蔵王の樹氷、兼六園の雪吊り、函館山から望む雪景色、富良野・美瑛の冬景色など、冬ならではの景色を楽しむモデルコースを6つ紹介。";
const NEW_DESC =
  "弘前城雪燈籠まつり、さっぽろ雪まつりと小樽雪あかりの路、蔵王の樹氷、兼六園の雪吊り、函館山から望む雪景色など、冬ならではの景色を楽しむモデルコースを5つ紹介。";
const FURANO_ITINERARY_ID = "03330540-baac-4c12-8b39-caa89a43bbcb";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const feature = await prisma.feature.findUniqueOrThrow({ where: { slug: FEATURE_SLUG } });
  if (feature.title !== OLD_TITLE) throw new Error("title現在値が期待と不一致");
  if (feature.description !== OLD_DESC) throw new Error("description現在値が期待と不一致");
  const item = await prisma.featureItem.findUniqueOrThrow({
    where: { featureId_itineraryId: { featureId: feature.id, itineraryId: FURANO_ITINERARY_ID } },
  });

  console.log(`旧題: ${OLD_TITLE}\n新題: ${NEW_TITLE}`);
  console.log(`\n旧説明: ${OLD_DESC}\n新説明: ${NEW_DESC}`);
  console.log(`\n削除するFeatureItem: ${item.id}(富良野・美瑛)`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    await tx.feature.update({ where: { id: feature.id }, data: { title: NEW_TITLE, description: NEW_DESC } });
    await tx.featureItem.delete({ where: { id: item.id } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
