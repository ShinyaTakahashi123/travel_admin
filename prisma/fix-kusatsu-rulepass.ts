/**
 * 法務の10章見直し、草津(89522173)の1件。Day2の1か所目(大滝乃湯)に、宿からの行き方と
 * 分がなかった。宿のあたり(西の河原公園)からrouted-footで1273m・17.0分→17分を確認し、
 * 追加した。
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const NAME = "大滝乃湯";
const OLD_MEMO =
  "旅の2日目は、大滝乃湯から始めましょう。数ある草津の源泉の中でも、煮川源泉を使用するこの日帰り温泉施設では、草津に古くから伝わる入浴法「合わせ湯」が体験できます。温度の異なる浴槽がいくつも並び、水で薄めることなく自然に冷ましたぬるめの湯から少しずつ熱い湯へと、体を慣らしながら入っていく、この土地ならではの湯めぐりの作法です。何百年も昔から草津の人々に伝わるこの入浴法で、源泉の湯にじっくりと浸かることができます。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。草津の湯は熱めなので、長湯を避けて、こまめに水分をとりましょう。じっくりと温まって、旅の疲れを癒やしましょう。湯めぐりのあとは、路線バス(天狗山方面)でおよそ15分の草津温泉スキー場へ向かいましょう。";
const NEW_MEMO = OLD_MEMO.replace(
  "旅の2日目は、大滝乃湯から始めましょう。",
  "2日目は、西の河原公園のあたりの宿から歩いておよそ17分、大滝乃湯から始めましょう。"
);

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");
  const spot = await prisma.spot.findFirstOrThrow({ where: { name: NAME, day: { itineraryId: "89522173-3b95-4393-a808-5ed5d465d85b" } } });
  if (spot.memo !== OLD_MEMO) throw new Error("memo現在値が期待と不一致");
  console.log(`[${NAME}]\n旧: ${OLD_MEMO}\n\n新: ${NEW_MEMO}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: spot.id }, data: { memo: NEW_MEMO } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
