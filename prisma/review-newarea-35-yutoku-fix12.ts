/**
 * #35の直し(企画運営、最終確認の5点、2026-10-13)。
 * 1. 祐徳稲荷神社の本殿メモ「京都の伏見稲荷神社」→正式名称「伏見稲荷大社」に修正
 *    (出典: http://inari.jp/ 公式サイトで一貫して使われている名称)
 * 2. 肥前浜宿酒蔵通りへの行き方: 祐徳自動車「祐徳線」(祐徳神社前〜下西山車庫)が
 *    肥前鹿島駅前を経由して浜三ツ角まで直通で走っていることをJorudanの停留所・
 *    路線ページで確認(乗換なし)。ただし祐徳自動車の公式時刻表サイトが見つからず、
 *    Jorudanの時刻表ページはJS必須で具体的な分数が確認できなかったため、
 *    「約25分」のような言い切りの数字は書かず、本数が少ない旨の案内文に留める。
 *    表参道の終わりとバスの発着(浜三ツ角)の両方に一文を追加
 * 3. 表参道の「約400m」「江戸時代から続くという」は出典が見つからなかったため削除。
 *    かわりに、昼食後に通りを散策する内容を加え、滞在時間の中身を示す
 * 4. 表参道の滞在 98分→75分に短縮(水増し解消)。日本庭園・祐徳博物館は
 *    庭園+博物館の複数内容があるため60→90分に(既存の「庭園+博物館の組み合わせは
 *    長めでも可」の基準内)。肥前浜宿酒蔵通り(この日の最後のスポット)を67→100分に
 *    延ばし、ゆったり過ごす内容であることをメモに示す
 * 5. 奥の院の滞在 70分→15分に短縮し、登り・下りの時間を移動時間に反映。
 *    ブログ記事(banzokubiology.com、公式サイトyutokusan.jpには分数の記載なし)に
 *    よると、本殿〜登山口5分+登り20〜25分、下山15〜25分とのことから、
 *    登りの移動時間を20→25分、下りの移動時間を15→25分に変更
 *
 * 時間の組み直し(09:30〜16:30は変わらず):
 *   日本庭園: 10:35〜12:05(90分、前と同じ) / 登り25分 / 奥の院: 12:30〜12:45(15分)
 *   / 下り25分 / 表参道: 13:10〜14:25(75分) / バス25分(変更なし) /
 *   肥前浜宿: 14:50〜16:30(100分)
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const YUTOKU_SPOT_ID = "3e22c82c-19dc-4cc2-a136-9fc4a157e896";
const NIHONTEIEN_SPOT_ID = "0d1f6065-d97a-4f9c-85f7-82188567fab3";
const OKUNOIN_SPOT_ID = "ee1068f8-ccdf-4f0f-b8dc-d7ed49406698";
const OMOTESANDO_SPOT_ID = "d3b67a4d-a9ca-4d99-9e86-fb788f61b21a";
const HAMASHUKU_SPOT_ID = "2530e81b-999d-4740-a47d-71053e4705a6";

const OKUNOIN_LEG_ID = "764f1b17-eef7-4f6d-b496-2645c5d2e2de"; // 日本庭園→奥の院
const OMOTESANDO_LEG_ID = "caaa40ae-e4c3-4d88-a81b-8346a3c2635a"; // 奥の院→表参道
const HAMASHUKU_LEG_ID = "221977d1-2b2a-4d5e-a757-fecaebdc91b1"; // 表参道→肥前浜宿

const YUTOKU_MEMO_NEW =
  "貞享4年(1687)、肥前鹿島藩主・鍋島直朝の夫人であった花山院萬子媛が、朝廷の勅願所であった稲荷大神の御分霊を勧請したことに始まると伝わる神社です。京都の伏見稲荷大社、茨城の笠間稲荷神社とあわせて、日本三大稲荷の一つとされています。石壁山の中腹、高さ18mの舞台造りの上に本殿が立ち、総漆塗り・極彩色の楼門とあわせて「鎮西日光」とも呼ばれています。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const NIHONTEIEN_MEMO_NEW =
  "神社に隣接する日本庭園では、アジサイやハナショウブ、ボタンなど四季折々の花が楽しめ、秋には紅葉の名所としても知られています。開園の時期は変わることがあるので、公式の案内で確かめましょう。池のまわりの小径をゆっくり歩いてから、隣の祐徳博物館で、神社に伝わる宝物や郷土の歴史資料を見学しましょう。";

const OMOTESANDO_MEMO_NEW =
  "祐徳稲荷神社へと続く参道沿いに広がる門前商店街です。趣のある店構えが並び、食事処や土産物店でにぎわいます。ここで昼食をとり、稲荷ようかんなど地元のみやげを探しながら、通りをゆっくり歩いてみましょう。見学を終えたら、祐徳神社前からバスに乗りましょう。本数が少ないため、事前に時刻を確かめましょう。";

const HAMASHUKU_MEMO_NEW =
  "浜三ツ角でバスを降りたら、少し歩いて向かいます。佐賀県鹿島市浜町にある、国の重要伝統的建造物群保存地区です。白壁の酒蔵や町家が軒を連ねる通りを、のんびりと歩いてみましょう。今も人が暮らす町並みですので、家の敷地に入らず、静かに散策しましょう。見学を終えたら、すぐ近くのJR肥前浜駅から帰路につきましょう。";

async function main() {
  const yutoku = await prisma.spot.findUnique({ where: { id: YUTOKU_SPOT_ID } });
  const niwa = await prisma.spot.findUnique({ where: { id: NIHONTEIEN_SPOT_ID } });
  const okunoin = await prisma.spot.findUnique({ where: { id: OKUNOIN_SPOT_ID } });
  const sando = await prisma.spot.findUnique({ where: { id: OMOTESANDO_SPOT_ID } });
  const hama = await prisma.spot.findUnique({ where: { id: HAMASHUKU_SPOT_ID } });
  if (!yutoku || !niwa || !okunoin || !sando || !hama) throw new Error("想定と違います");

  console.log("[1] 祐徳稲荷神社: 伏見稲荷神社→伏見稲荷大社");
  console.log("[2] 肥前浜宿への行き方の一文を表参道(発)・肥前浜宿(着)に追加");
  console.log("[3] 表参道: 未確認の「約400m」「江戸時代から続くという」を削除、散策の中身を追加");
  console.log("[4] stay変更: 日本庭園60→90 / 表参道98→75 / 肥前浜宿67→100");
  console.log("[5] stay変更: 奥の院70→15 / leg変更: 登り20→25 / 下り15→25");
  console.log("\n新しい時間割:");
  console.log("  日本庭園・祐徳博物館 10:35-12:05(90分)");
  console.log("  奥の院 12:30-12:45(15分)  [登り25分]");
  console.log("  表参道 13:10-14:25(75分)  [下り25分]");
  console.log("  肥前浜宿酒蔵通り 14:50-16:30(100分)  [バス25分、変更なし]");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: YUTOKU_SPOT_ID }, data: { memo: YUTOKU_MEMO_NEW } });
  await prisma.spot.update({ where: { id: NIHONTEIEN_SPOT_ID }, data: { stayDurationMin: 90, memo: NIHONTEIEN_MEMO_NEW } });
  await prisma.spotTransitLeg.update({ where: { id: OKUNOIN_LEG_ID }, data: { transitDurationMin: 25 } });
  await prisma.spot.update({ where: { id: OKUNOIN_SPOT_ID }, data: { stayDurationMin: 15, visitTime: new Date(Date.UTC(1970, 0, 1, 12, 30)) } });
  await prisma.spotTransitLeg.update({ where: { id: OMOTESANDO_LEG_ID }, data: { transitDurationMin: 25 } });
  await prisma.spot.update({
    where: { id: OMOTESANDO_SPOT_ID },
    data: { stayDurationMin: 75, memo: OMOTESANDO_MEMO_NEW, visitTime: new Date(Date.UTC(1970, 0, 1, 13, 10)) },
  });
  await prisma.spot.update({
    where: { id: HAMASHUKU_SPOT_ID },
    data: { stayDurationMin: 100, memo: HAMASHUKU_MEMO_NEW, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 50)) },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
