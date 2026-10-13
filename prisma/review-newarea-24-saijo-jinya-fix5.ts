/**
 * #24の直し。企画運営の指摘(2026-10-13)に対応。
 * 1. このしおりは徒歩で回る前提(他の移動はすべて徒歩)なのに、観光交流センター→
 *   考古歴史館だけ車になっていた。西条市の公式資料によると、最寄りのバス停からも
 *   徒歩約40分かかる山の中腹のため、公共交通機関は現実的でないと判断し、
 *   タクシー利用である旨をメモに明記する(行き・帰りの両方)
 * 2. 考古歴史館の最終入館時刻は(公式でも)確認できなかったが、開館時間9:00-17:00に
 *   対し、16:07-16:52の見学は閉館の8分前に終わる計算のため、このまま進める
 *   (念のため企画運営には確認できなかった旨を報告する)
 * 3. 説明文に西条市考古歴史館を追加
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "efaee93e-6edc-4e90-bde2-5f942c5f7e8c";

const NEW_DESCRIPTION =
  "弘法大師ゆかりの湧き水「弘法水」から、水辺の遊歩道アクアトピア、西条藩の歴史を伝える陣屋跡と郷土博物館をめぐります。伊予西条駅前で昼食をとり、四国鉄道文化館、西条市観光交流センター、西条市考古歴史館まで、水の都・西条の城下町と鉄道・歴史の魅力を楽しむ日帰りプランです。";

async function main() {
  const koko = await prisma.spot.findFirst({ where: { name: "西条市考古歴史館" } });
  if (!koko?.memo) throw new Error("想定と違います");

  const newKokoMemo =
    "八堂山の中腹にあるため、伊予西条駅前からはタクシーで向かいます(車で約8分)。" +
    koko.memo +
    "帰りもタクシーを利用しましょう。";

  console.log("[確認OK] 説明文に西条市考古歴史館を追加");
  console.log("[確認OK] 考古歴史館のメモにタクシー利用の案内を追加");
  console.log("新メモ:", newKokoMemo);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: koko.id }, data: { memo: newKokoMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
