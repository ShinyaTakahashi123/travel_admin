/**
 * #118 7133c8fe の追加の直し（しおりえ(制作補助2)、法務 10/30 18:09・企画運営のOK。文だけ、時刻・移動・点は変えない）
 * 鉾杉は鉾神社に立つ杉（桃源郷祖谷の山里 https://www.tougenkyo-iya.jp/?p=5414「隣接する鉾神社には樹齢800年ともいわれる巨大な杉の木、“鉾杉”が自生しています。」）なので、
 * 祈りの一文を足す（決まり 5章）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-118b-7133c8fe.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const HOKO = "7d6bbc2e-ffbc-4f86-bcf8-b38408d0c501";
const COMMIT = process.argv.includes("--commit");
const FROM = "大杉の姿を、見上げましょう。";
const TO = "大杉の姿を、見上げましょう。鉾神社に立つ杉です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。";

async function main() {
  const s = await prisma.spot.findUniqueOrThrow({ where: { id: HOKO } });
  const m = s.memo ?? "";
  if (m.split(FROM).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません`);
  const memo = m.replace(FROM, TO);
  console.log(`■ ${s.name}\n${memo}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.spot.update({ where: { id: HOKO }, data: { memo } });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
