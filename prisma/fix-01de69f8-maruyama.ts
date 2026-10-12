/**
 * 法務の指摘・企画運営からの追加依頼による修正。
 * 01de69f8(初めての京都！清水寺・祇園・錦市場を巡る鉄板プラン)の
 * 円山公園のメモで、言い切りの「京都で最も古い公園です」をぼかす形に直し、
 * 「〜だそうです」の言い方も、ほかのしおりと同じ「〜と伝えられています」に直す。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const SPOT_ID = "739208ab-bd70-4a1c-8921-9eaacc4bb9be";
const FROM = "しだれ桜で知られる、京都で最も古い公園です。園内にある「慈円山」という山号を持つ安養寺にちなんで名づけられたと伝えられ、もとはこの一帯、ススキが生い茂る「真葛ヶ原」と呼ばれる原野でした。1886年（明治19年）に開園し、近代日本庭園の先駆者・7代目小川治兵衛が作庭を手がけたと伝えられています。名物のしだれ桜は2代目で、初代は江戸時代から愛された名木でしたが昭和22年に枯死し、昭和24年に植え継がれたものだそうです。八坂神社に隣接しています。";
const TO = "しだれ桜で知られる、京都で最も古い公園とされています。園内にある「慈円山」という山号を持つ安養寺にちなんで名づけられたと伝えられ、もとはこの一帯、ススキが生い茂る「真葛ヶ原」と呼ばれる原野でした。1886年（明治19年）に開園し、近代日本庭園の先駆者・7代目小川治兵衛が作庭を手がけたと伝えられています。名物のしだれ桜は2代目で、初代は江戸時代から愛された名木でしたが昭和22年に枯死し、昭和24年に植え継がれたものと伝えられています。八坂神社に隣接しています。";

async function main() {
  const spot = await prisma.spot.findUnique({ where: { id: SPOT_ID } });
  if (!spot) throw new Error("スポットが見つかりません");
  if (spot.memo !== FROM) throw new Error("メモが想定外です: " + spot.memo);
  console.log("確認OK。");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: SPOT_ID }, data: { memo: TO } });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
