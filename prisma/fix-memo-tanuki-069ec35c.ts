/**
 * 069ec35c の田貫湖のメモの書き直し(2026-11-05、しおりえ(制作補助2))。企画運営・法務の判断(点そろえ ebe0d20 のあとの別の小さな直し)。
 * - 公式で確かめていない4つの文(水深が浅く風が穏やか・周遊道・レンタサイクル・展望デッキ)を外し、富士宮市の公式
 *   city.fujinomiya.lg.jp/1025200000/p001795.html(田貫湖)の事実だけで、aea12c13・66d185f1 の文を写さずに書く。
 * - 書き出しは「およそN分」の形、結びに次の行き先への一文を入れる(区間は今の車20・車20のまま。点・時刻・滞在は変えない)。
 * 確認モードは、書き込むデータから直接出す形。
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-memo-tanuki-069ec35c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const SPOT_ID = "681c2c6f-b324-400f-8b7c-6189b7274b95";
const MEMO_OLD =
  "音止の滝から車で約20分、富士山の西麓、朝霧高原の一角にある湖です。水深が浅く風が比較的穏やかなため、湖面に富士山が逆さに映る「逆さ富士」が名物です。湖畔には周遊道が整えられ、散策やレンタサイクルを楽しめます。春には湖畔に桜が咲き、展望デッキからはのんびりと富士山を眺められます。";
const MEMO_NEW =
  "音止の滝から車でおよそ20分、田貫湖に着きます。広い朝霧高原の一角にある湖で、真東の方角に富士山の全景がそびえ、湖面には富士山と、伝説の残る天子ヶ岳が映ります。湖の大きさは東西約1km、南北約0.5kmで、周りは3.3kmあります。湖畔には桜やツツジが植えられ、北側には広葉樹の林が広がっていて、春の桜から秋の紅葉まで、富士山を背にした景色が移り変わります。4月20日前後と8月20日前後のおよそ1週間は、富士山の頂から朝日が昇る「ダイヤモンド富士」を見ることができます。ヘラブナ釣りの場所としても、全国に知られています。この後は、車でおよそ20分、道の駅 朝霧高原へ向かいましょう。";

async function main() {
  const s = await prisma.spot.findUnique({
    where: { id: SPOT_ID },
    select: { name: true, lat: true, lng: true, memo: true, day: { select: { itineraryId: true } }, transitLegs: { select: { transitMode: true, transitDurationMin: true } } },
  });
  if (!s || s.name !== "田貫湖" || !s.day.itineraryId.startsWith("069ec35c")) throw new Error(`スポットが想定と違います「${s?.name}」`);
  if (String(s.lat) !== "35.345766" || String(s.lng) !== "138.558598") throw new Error(`点が想定と違います(点そろえの前?) ${s.lat},${s.lng}`);
  if (s.memo !== MEMO_OLD) throw new Error("今のメモが想定と違います");
  const legs = s.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
  if (legs !== "car20") throw new Error(`入る区間が想定と違います ${legs}`);
  const next = await prisma.spot.findFirst({ where: { day: { itineraryId: s.day.itineraryId }, name: "道の駅 朝霧高原" }, select: { transitLegs: { select: { transitMode: true, transitDurationMin: true } } } });
  const nextLegs = next?.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
  if (nextLegs !== "car20") throw new Error(`次の区間が想定と違います ${nextLegs}`);
  console.log(`■ 069ec35c 田貫湖(入る区間 ${legs}、次の道の駅 朝霧高原への区間 ${nextLegs})\n  今: ${MEMO_OLD}\n  →: ${MEMO_NEW}`);
  if (!commit) {
    console.log("\n確認モードはここまで。内容に問題なければ --commit で書き込みます。");
    return;
  }
  await prisma.spot.update({ where: { id: SPOT_ID }, data: { memo: MEMO_NEW } });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
