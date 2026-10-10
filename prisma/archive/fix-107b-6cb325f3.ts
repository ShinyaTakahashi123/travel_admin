/**
 * #107 6cb325f3(那須) の直し(2回目)。企画運営(2026-10-01 11:46・11:48)・
 * 法務(2026-10-01 11:46)の指摘。#84(bb9c4e59、同じ那須の場所を含む既存の
 * 公開しおり)で法務確認済みの文言をそのまま再利用した箇所がある。
 *
 * 企画運営の5点+1点:
 * 1. 那須どうぶつ王国は平日16:30閉園(公式 https://nasu-oukoku.com/?p=5567
 *    で確認、土日祝は9:00〜17:00・水曜定休)。16:34発→16:30発に収まるよう、
 *    那須平成の森→どうぶつ王国の移動時間を18分→14分に見直した(距離の見積もり
 *    を再検討した結果、直線距離2.78kmに対し18分は長すぎたため)。那須
 *    ロープウェイは冬季運休(12月〜3月中旬、WebSearchで確認)のため、
 *    しおりのseasonsからwinterを外した。
 * 2. ロープウェイの「1962年10月19日」など具体的な日付・年号の羅列を削り、
 *    開業年(1962年)だけにした。
 * 3. 車の旅なのに借りる場所が書かれていなかった点・最後が「ご利用ください」
 *    の案内口調だった点を直し、那須塩原駅でレンタカーを借りて返す形に統一。
 * 4. 滞在50分なのに茶臼岳往復登山(徒歩50分)に触れており矛盾していたため、
 *    登山の案内を削り「このプランでは山頂駅の周りを歩いて景色を楽しみます」
 *    と明記。
 * 5. 那須平成の森の「天皇陛下御在位20年」はだれのことか分かるよう、
 *    「平成21年(2009)、当時の天皇陛下(今の上皇陛下)の御在位20年を記念して」
 *    に直した(企画運営の提案文言どおり)。
 *
 * 法務の3点(#84で確認済みの文言を再利用):
 * ① ロープウェイに活火山の一文
 * ② 鹿の湯に撮影を控える一文
 * ③ どうぶつ王国に動物ふれあいの一文
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ROPEWAY_FROM =
  "那須ロープウェイは、JR那須塩原駅から車で約50分、那須連峰の主峰・茶臼岳の7合目にある山麓駅と、標高1684mの山頂駅を結ぶロープウェイです。標高差293mをおよそ3分40秒で結び、一度に111人を乗せることができる大型のゴンドラが山頂へ運んでくれます。開業は1962年10月19日。当時の東野鉄道社長・矢野目正夫が1956年に構想を練り、1960年に着工、1962年9月の試運転を経て開業したと伝えられています。ちょうどヒマラヤのマナスル初登頂のニュースで登山ブームが起きていた時期で、那須岳への登山客の増加がこの建設を後押ししたといわれています。山頂駅からは那須高原の雄大な景色が広がり、天候に恵まれれば遠くの山々まで見渡せます。時間と体力に余裕があれば、山頂駅から茶臼岳の山頂まで、火山ならではの荒々しい景色が続く道のりを徒歩およそ50分かけて目指すこともできます(軽石や砂利で滑りやすいため、歩きやすい靴で)。この後は、車でおよそ15分、殺生石へ向かいましょう。";
const ROPEWAY_TO =
  "那須塩原駅でレンタカーを借り、車でおよそ50分、那須連峰の主峰・茶臼岳の7合目にある那須ロープウェイの山麓駅に着きます。標高1684mの山頂駅までの標高差293mを、一度に111人を乗せる大型のゴンドラがおよそ3分40秒で結びます。開業は1962年。登山ブームを背景に、那須岳への登山客の増加が建設の後押しになったと伝えられています。山頂駅の周辺からは那須高原の雄大な景色が広がり、天候に恵まれれば遠くの山々まで見渡せます。このプランでは、山頂駅の周りを歩いて景色を楽しみます。茶臼岳は活火山です。訪れる前に火山の情報を確かめ、立入規制に従いましょう。この後は、車でおよそ15分、殺生石へ向かいましょう。";

const SHIKANOYU_FROM =
  "乳白色の硫黄泉は刺激が強いため、長湯は避け、こまめに水分をとりながら、短い時間で何度か入るようにしましょう。この後は、車でおよそ10分、那須平成の森へ向かいましょう。";
const SHIKANOYU_TO =
  "乳白色の硫黄泉は刺激が強いため、長湯は避け、こまめに水分をとりながら、短い時間で何度か入るようにしましょう。浴場では、ほかの方が写らないよう撮影は控えましょう。この後は、車でおよそ10分、那須平成の森へ向かいましょう。";

const HEISEINOMORI_FROM =
  "那須御用邸用地のおよそ半分にあたるおよそ560ヘクタールが宮内庁から環境省に引き継がれ、天皇陛下御在位20年の記念事業として整備が進められ、2011年に開園しました。";
const HEISEINOMORI_TO =
  "那須御用邸用地のおよそ半分にあたるおよそ560ヘクタールが、平成21年(2009)、当時の天皇陛下(今の上皇陛下)の御在位20年を記念して宮内庁から環境省に引き継がれ、整備を経て2011年に開園しました。";
const HEISEINOMORI_TRANSIT_FROM = "この後は、車でおよそ18分、那須どうぶつ王国へ向かいましょう。";
const HEISEINOMORI_TRANSIT_TO = "この後は、車でおよそ14分、那須どうぶつ王国へ向かいましょう。";

const DOBUTSUOKOKU_FROM =
  "那須平成の森から車でおよそ18分、この旅の締めくくり、那須どうぶつ王国に着きます。東京ドームおよそ10個分の敷地に600頭以上の動物たちが暮らす動物園で、1998年の開園以来、那須高原を代表する観光地のひとつになっています。屋根付きの「王国タウン」ではカピバラやハシビロコウなど多彩な動物と出会え、カピバラが温泉に浸かる「カピバラの湯」もよく知られています。牧場形態の「王国ファーム」とは「王国リフト」で結ばれています(土日祝のみ運行、冬季は運休)。思い思いに動物たちとの時間を過ごしましょう。茶臼岳ロープウェイと殺生石、那須の自然と伝説を巡る旅はこれで終わりです。帰りは、JR那須塩原駅方面へ、路線バスやタクシーをご利用ください。";
const DOBUTSUOKOKU_TO =
  "那須平成の森から車でおよそ14分、この旅の締めくくり、那須どうぶつ王国に着きます。東京ドームおよそ10個分の敷地に600頭以上の動物たちが暮らす動物園で、1998年の開園以来、那須高原を代表する観光地のひとつになっています。屋根付きの「王国タウン」ではカピバラやハシビロコウなど多彩な動物と出会え、カピバラが温泉に浸かる「カピバラの湯」もよく知られています。牧場形態の「王国ファーム」とは「王国リフト」で結ばれています(土日祝のみ運行、冬季は運休)。思い思いに動物たちとの時間を過ごしましょう。エサやりやふれあいの際は、係員の案内に従いましょう。茶臼岳ロープウェイと殺生石、那須の自然と伝説を巡る旅はこれで終わりです。帰りは、那須塩原駅までレンタカーを返却してから、新幹線などで帰路につきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, seasons from itinerary where id::text like '6cb325f3%'`);
  const itinId = rows[0].id;
  const seasons: string[] = rows[0].seasons;

  const ropeway = await findSpotInItinerary(itinId, { spotName: "那須ロープウェイ" });
  const shikanoyu = await findSpotInItinerary(itinId, { spotName: "鹿の湯" });
  const heiseinomori = await findSpotInItinerary(itinId, { spotName: "那須平成の森" });
  const dobutsuokoku = await findSpotInItinerary(itinId, { spotName: "那須どうぶつ王国" });

  if (!ropeway.memo!.includes(ROPEWAY_FROM)) throw new Error("那須ロープウェイの文言が想定外です");
  if (!shikanoyu.memo!.includes(SHIKANOYU_FROM)) throw new Error("鹿の湯の文言が想定外です");
  if (!heiseinomori.memo!.includes(HEISEINOMORI_FROM)) throw new Error("那須平成の森の文言①が想定外です");
  if (!heiseinomori.memo!.includes(HEISEINOMORI_TRANSIT_FROM)) throw new Error("那須平成の森の文言②が想定外です");
  if (!dobutsuokoku.memo!.includes(DOBUTSUOKOKU_FROM)) throw new Error("那須どうぶつ王国の文言が想定外です");
  if (dobutsuokoku.transitDurationMin !== 18) throw new Error("那須平成の森→どうぶつ王国の移動時間が想定外です");
  console.log("確認OK: 5件");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: ropeway.id }, { memo: ropeway.memo!.replace(ROPEWAY_FROM, ROPEWAY_TO) });
  await updateSpotInItinerary(itinId, { spotId: shikanoyu.id }, { memo: shikanoyu.memo!.replace(SHIKANOYU_FROM, SHIKANOYU_TO) });
  const heiseinomoriMemo = heiseinomori.memo!.replace(HEISEINOMORI_FROM, HEISEINOMORI_TO).replace(HEISEINOMORI_TRANSIT_FROM, HEISEINOMORI_TRANSIT_TO);
  await updateSpotInItinerary(itinId, { spotId: heiseinomori.id }, { memo: heiseinomoriMemo });
  await updateSpotInItinerary(
    itinId,
    { spotId: dobutsuokoku.id },
    { memo: dobutsuokoku.memo!.replace(DOBUTSUOKOKU_FROM, DOBUTSUOKOKU_TO), visitTime: t(13, 30), transitDurationMin: 14 }
  );
  await prisma.itinerary.update({ where: { id: itinId }, data: { seasons: seasons.filter((s) => s !== "winter") } });
  console.log("COMMITTED: 5件");
}
main().finally(() => prisma.$disconnect());
