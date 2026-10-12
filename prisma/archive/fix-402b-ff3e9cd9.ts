/**
 * #402 ff3e9cd9 の追いの修正（しおりえ(制作補助2)、監査・prayer-check への対応）
 * - 雪の科学館: 「初めて人工雪をつくることに成功した」→「初めて人工雪をつくることに成功したとされる」
 * - 鶴仙渓（黒谷橋・芭蕉堂）: 芭蕉堂は松尾芭蕉をまつるお堂なので配慮の一文を足す
 * - 山中塗うるし座: タクシーの移動を10分→15分に（到着15:55と合わせる）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-402b-ff3e9cd9.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITINERARY_ID = "ff3e9cd9-724f-4c8c-80bf-0c0807335c48";
const COMMIT = process.argv.includes("--commit");

async function main() {
  const yuki = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotName: "中谷宇吉郎 雪の科学館" });
  const kaku = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "鶴仙渓（黒谷橋・芭蕉堂）" });
  const urushi = await findSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotName: "山中塗うるし座（山中漆器伝統産業会館）" });
  const O1 = "初めて人工雪をつくることに成功した中谷宇吉郎";
  const N1 = "初めて人工雪をつくることに成功したとされる中谷宇吉郎";
  const O2 = "松尾芭蕉をまつる芭蕉堂があります。";
  const N2 = "松尾芭蕉をまつる芭蕉堂があります。芭蕉堂では、静かに、敬意をもってお参りしましょう。";
  const O3 = "温泉街からタクシーで約10分。";
  const N3 = "温泉街からタクシーで約15分。";
  if (!yuki.memo?.includes(O1) || !kaku.memo?.includes(O2) || !urushi.memo?.includes(O3)) throw new Error("本文が想定と違います");
  console.log(N1, "\n", N2, "\n", N3);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 1, spotId: yuki.id }, { memo: yuki.memo!.replace(O1, N1) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: kaku.id }, { memo: kaku.memo!.replace(O2, N2) }, { tx });
    await updateSpotInItinerary(ITINERARY_ID, { dayNumber: 2, spotId: urushi.id }, { memo: urushi.memo!.replace(O3, N3), transitDurationMin: 15 }, { tx });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
