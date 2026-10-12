/**
 * #178 5d7ccad2 の続き（しおりえ(制作補助2)）:
 *   ① 企画運営の確認（2026-10-11）: 大濠公園の99分は時間合わせに見える（決まりA）ので50分にし、空いた時間に福岡城むかし探訪館を足す
 *      （鴻臚館跡展示館は改修で令和9年3月のリニューアルまで閉まっているので使わない。舞鶴公園は ba8c13f1・1a3f2d39 と重なる。むかし探訪館はほかのしおりにない）
 *   ② 法務の確認（2026-10-11 16:43、記録 a6991dd）: 「全国でも有数の水景の公園です」を同じ文の中でぼかす
 * 出典: クロスロードふくおか https://www.crossroadfukuoka.jp/spot/11349 福岡城むかし探訪館（古地図や再現模型で福岡城を体感・タブレットで鴻臚館と福岡城のバーチャル時空散歩ガイドツアー・
 *   9:00〜17:00・赤坂駅から徒歩約8分）／福岡市の報道発表と検索結果（鴻臚館跡展示館は令和9年3月にリニューアルオープン予定）
 * 座標: OSM — 福岡城むかし探訪館 way 506835367（Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-178b-5d7ccad2.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "5d7ccad2-e753-4c23-b97d-28f5dc1c5c32";
const DAY_ID = "14e53a37-b66c-4fa6-8f9d-087dd1fb09fb";
const OHORI = "6dac7fd0-44ed-43a9-ab99-20b7203bc087";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const REPL: [string, string][] = [
  ["1929年に開かれた、全国でも有数の水景の公園です。", "1929年に開かれた公園で、全国でも有数の水景の公園とされます。"],
  ["帰りは、地下鉄の大濠公園駅まで歩いて約7分です。", ""],
];
const NEW_MEMO =
  "大濠公園から城跡の方へ、東へ歩いて約15分。福岡城の跡の中にある案内の施設で、古い地図や再現模型を通して、福岡城のかつての姿を、さまざまな角度から知ることができます。タブレット端末を使って、鴻臚館と福岡城の昔の姿をたどるガイドツアーもあります。帰りは、歩いて約8分の地下鉄の赤坂駅へ向かいましょう。";

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("日が想定と違います");
  const last = day.spots[day.spots.length - 1];
  if (last.id !== OHORI) throw new Error("最後のスポットが大濠公園ではありません");
  let memo = last.memo ?? "";
  for (const [a, b] of REPL) {
    if (memo.split(a).length !== 2) throw new Error(`直す文が見つからない: ${a}`);
    memo = memo.replace(a, b);
  }
  console.log(`大濠公園 14:51-15:41（50分）\n  ${memo}\n福岡城むかし探訪館 15:56-16:36（40分、歩き15分）\n  ${NEW_MEMO}`);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: OHORI }, data: { stayDurationMin: 50, memo } });
    await tx.spot.create({
      data: {
        dayId: DAY_ID,
        orderNo: last.orderNo + 1,
        name: "福岡城むかし探訪館",
        visitTime: t(15, 56),
        stayDurationMin: 40,
        lat: 33.5873484,
        lng: 130.384768,
        address: "福岡県福岡市中央区城内1-4",
        memo: NEW_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null }] },
      },
    });
  });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
