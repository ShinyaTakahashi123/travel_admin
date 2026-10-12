/**
 * #87 cdc1ed6f 企画運営・法務の指摘(2026-09-30 20:08-20:12)。
 * 1) 説明文にまだ「瑞巌寺」が残っていたため「藍場浜公園」に修正。
 * 2) 藍場浜公園のメモにあった「藍場の浜」の名の由来・藍蔵・蜂須賀家政の
 *    奨励策・空襲で焼けたことについて、実際に開けるページで出典を探した
 *    ところ、確認できたのは徳島県公式サイトの「徳島藩が藍事業を保護奨励
 *    した」という一般的な記載(家政個人を名指しした記載は見当たらず)と、
 *    桜の名所であることのみ(funfun-tokushima.jp)。藍蔵・空襲の具体的な
 *    経緯は出典を確認できなかったため削除し、名の由来は「とされています」
 *    という伝聞の書き方に弱め、藍の奨励は「徳島藩」(家政個人ではなく)の
 *    政策として書き直した。
 *
 * 開いたURL:
 * - 阿波藍(徳島県公式、藍事業の保護奨励): https://www.pref.tokushima.lg.jp/japanese/natural_culture/traditional_culture/awa-ai
 * - 藍場浜公園の桜: https://funfun-tokushima.jp/introduce/%EF%BC%88%E6%A1%9C%EF%BC%89%E8%97%8D%E5%A0%B4%E6%B5%9C%E5%85%AC%E5%9C%92/
 * (Wikipedia「藍場浜公園」・jalan.net・徳島市公式のリンク切れページも確認したが、
 *  藍場の浜の由来・藍蔵・空襲の記載は見当たらなかった)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const NEW_DESCRIPTION =
  "蜂須賀家政が築いた徳島城の跡地に広がる徳島中央公園から、蜂須賀家墓所の興源寺、ひょうたん島クルーズ、藍の産業にゆかりのある藍場浜公園まで。眉山や阿波おどりとは違う、徳島藩の歴史をたどるプランです。";

const AIBAHAMA_MEMO =
  "新町川水際公園から歩いておよそ5分、藍場浜公園に着きます。江戸時代、徳島藩は「阿波藍」の生産を保護・奨励し、藍は藩の主要な財源の一つとなりました。公園の名は、こうした藍の産業にゆかりがあるとされています。春には桜の名所としても親しまれ、新町川沿いの桜並木が水面に映るさまを楽しめます。徳島城跡から鷲の門、博物館、庭園、興源寺の蜂須賀家墓所とめぐった旅は、ここで終了です。徳島駅までは徒歩でおよそ15分です。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cdc1ed6f%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName: "藍場浜公園" });

  console.log("説明文を更新予定");
  console.log("藍場浜公園のメモを更新予定");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: NEW_DESCRIPTION } });
    await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: AIBAHAMA_MEMO }, { tx });
  });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
