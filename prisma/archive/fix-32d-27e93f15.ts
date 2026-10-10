/**
 * #32 27e93f15（由布院）企画運営の指摘5点(11:18)・法務の指摘1点(11:18)をまとめて対応。
 *
 * 1) 2日目、下ん湯のあと車移動に変わる点について、下ん湯の本文に「由布院駅の近くで
 *    レンタカーを借りて」の一言を追加。レンタカー営業所は9:00開店(駅レンタカー由布院駅
 *    営業所で確認)のため、下ん湯→狭霧台の移動時間に、徒歩・開店待ち・手続きを含めて38分
 *    を確保し、狭霧台到着を9:09にした(以前の8:49→大幅に後ろ倒し)。
 * 2) 帰り方(決まり3): 龍巻地獄の結びに「帰りは車で別府駅・大分空港方面へ向かい、
 *    レンタカーを返却しましょう」を追加。大杵社の結びに「今夜は由布院の宿でゆっくり
 *    お休みください」を追加。
 * 3) 龍巻地獄の滞在を70→45分に短縮(間欠泉の周期30〜40分に対して70分は長すぎるため)。
 * 4) 湯の坪街道90→60分に短縮(フローラルヴィレッジで昼食をとるため、2つ続けて90分は
 *    買い物の通りに3時間は長すぎる)。空いた30分は、COMICO ART MUSEUM YUFUINの滞在を
 *    60→85分、大杵社を35→40分にして、実在の施設の中でゆっくり過ごす時間として確保。
 * 5) 下ん湯: 外から見るだけでなく実際に入浴する内容に修正(25分)。入浴の一言(ほかの
 *    入浴客を撮らない・施設の決まりに従う)を追加。
 * 6) 法務の指摘: 龍巻地獄の結び「由布院の由緒ある神社めぐり」(2日目に神社はない)を、
 *    2日目の実際の中身(狭霧台・アルテジオでの静かなひととき)に合わせて修正。
 *
 * あわせて、龍巻地獄の滞在短縮・湯の坪街道の短縮で生じた時間の調整として、
 * 明礬温泉の湯の花小屋(実在、江戸時代から続く湯の花製造の見学。無料とは書かない)を
 * アルテジオと海地獄の間に追加し、2日目を16:30〜17:00に収めた。
 *
 * 座標: Nominatim確認(湯の花小屋は「明礬温泉」の地点を代替アンカーに使用)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const ITIN = "27e93f15-8dbe-4e72-81d5-7bcde9231b4e";

const COMICO_ID = "f941000c-0be8-4cd8-8c48-a807b3b86fc0";
const YUNOTSUBO_ID = "e1497db9-5d65-4abd-8f4c-774bbf45b22e";
const OOGOSHA_ID = "bfabbeec-a1f9-445e-ad23-474e80e76877";

const SHIMONOYU_ID = "564db84b-cef1-4048-b295-6d7e5cabe533";
const SAGIRIDAI_ID = "2b3fcdbc-ca21-46b1-a0d1-27fb0c7ef97a";
const ARTEGIO_ID = "99d00c45-5eb0-4614-8c05-ecb69c412cde";
const UMIJIGOKU_ID = "596d7172-5a7c-4c12-91ac-cf3758cace64";
const TATSUMAKIJIGOKU_ID = "14c356b3-fc47-4930-a295-a4b31cddeab7";

async function main() {
  const days = await prisma.day.findMany({
    where: { itineraryId: ITIN },
    orderBy: { dayNumber: "asc" },
  });
  const day2Id = days[1].id;

  const oogosha = await findSpotInItinerary(ITIN, { spotId: OOGOSHA_ID });
  const newOogoshaMemo = oogosha.memo!.replace(
    "由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終了です。お疲れさまでした。",
    "由布院駅から湯の坪街道、フローラルヴィレッジとめぐった1日目は、ここで終了です。お疲れさまでした。今夜は由布院の宿でゆっくりお休みください。"
  );
  if (newOogoshaMemo === oogosha.memo) throw new Error("大杵社: 置換対象の文字列が一致しません");

  // ---------- Day2: 並び替え(湯の花小屋を追加、レンタカーの一言・時刻を調整) ----------
  const day2Spots: SpotOrderItem[] = [
    { id: "7133984e-afce-4a38-a4c0-551ce9018f51", data: {} }, // 金鱗湖(変更なし)
    {
      id: SHIMONOYU_ID,
      data: {
        memo: "金鱗湖のほとりから歩いてすぐ、地元の人に親しまれてきた共同浴場、下ん湯に着きます。金鱗湖の湖畔にひっそりとたたずむ小さな湯小屋で、由布院温泉の素朴な歴史を今に伝える場所です。朝の静けさの中、湯につかってひとときを過ごしてみてください。共同浴場なので、ほかの入浴客を撮影したり、施設の決まりに反したりしないようにしましょう。この後は、由布院駅の近くでレンタカーを借りて、車で狭霧台へ向かいましょう。",
        stayDurationMin: 25,
      },
    },
    {
      id: SAGIRIDAI_ID,
      data: {
        memo: "下ん湯から、レンタカーの手続きを含めておよそ38分、狭霧台に着きます。由布院盆地を見下ろす高台にある展望地で、由布岳を背景に、盆地に広がる田園風景を一望できます。名前の通り、霧が立ち込める朝にはひときわ幻想的な眺めとなり、金鱗湖の朝霧とはまた違った、由布院盆地全体を覆う雲海のような景色に出会えることもあります。この後は、車でおよそ9分、由布院空想の森アルテジオへ向かいましょう。",
        visitTime: t(9, 9),
        stayDurationMin: 45,
        transitMode: "car",
        transitDurationMin: 38,
      },
    },
    {
      id: ARTEGIO_ID,
      data: {
        memo: "狭霧台から車でおよそ9分、由布院空想の森アルテジオに着きます。宿「山荘無量塔」の敷地内にある美術館で、音楽にまつわる美術作品を集めた展示室には、いつも静かに音楽が流れています。読書室やカフェも備えられており、静かなひとときを過ごすのにぴったりの場所です。この後は、車でおよそ40分、明礬温泉の湯の花小屋へ向かいましょう。",
        visitTime: t(10, 3),
        stayDurationMin: 55,
        transitMode: "car",
        transitDurationMin: 9,
      },
    },
    {
      create: {
        name: "明礬温泉 湯の花小屋",
        address: "大分県別府市明礬",
        lat: 33.317303,
        lng: 131.453369,
        memo: "由布院空想の森アルテジオから車でおよそ40分、明礬温泉の湯の花小屋に着きます。江戸時代から300年近く続く製法で「湯の花」という入浴剤を作り続けている、わら葺き屋根の小屋がおよそ50棟並ぶ一帯です。青粘土の上に湯の花が育つ様子や、職人による作業のようすを見学できます。別府ならではの、地熱と共に生きる暮らしにふれてみてください。この後は、車でおよそ8分、別府温泉の海地獄へ向かいましょう。",
        visitTime: t(11, 38),
        stayDurationMin: 25,
        transitMode: "car",
        transitDurationMin: 40,
        transitLine: null,
      },
    },
    {
      id: UMIJIGOKU_ID,
      data: {
        memo: "明礬温泉の湯の花小屋から車でおよそ8分、別府温泉の象徴ともいえる海地獄に着きます。コバルトブルーに輝く湯の色が、まるで海のように見えることからこの名がついたと伝えられています。摂氏98度もの高温の湯からは絶えず白い蒸気が立ちのぼり、大正時代から続く別府地獄めぐりの中でも指折りの人気を誇ります。地獄の湯はとても熱いので、柵の外に出たり手を入れたりしないようにしましょう。庭園内には熱帯スイレンの温室もあり、地熱を利用して育てられた植物も見どころの一つです。この後は、歩いておよそ2分、鬼石坊主地獄へ向かいましょう。",
        visitTime: t(12, 11),
        stayDurationMin: 30,
        transitMode: "car",
        transitDurationMin: 8,
      },
    },
    { id: "e24b33bb-15a9-43bf-a141-3ad5cf9d3cdb", data: { visitTime: t(12, 43), stayDurationMin: 15 } }, // 鬼石坊主地獄
    { id: "a5c73cf4-07f2-4a07-9a01-1a4ce7ddf1b7", data: { visitTime: t(13, 6), stayDurationMin: 50 } }, // 地獄蒸し工房鉄輪
    { id: "13af711a-5379-4917-821c-bb0c51207a46", data: { visitTime: t(14, 1), stayDurationMin: 20 } }, // かまど地獄
    { id: "ebaa09b1-2241-4ec7-9155-1f892107e59a", data: { visitTime: t(14, 23), stayDurationMin: 20 } }, // 鬼山地獄
    { id: "e2f25a9b-a10a-48a2-af77-6267c3032686", data: { visitTime: t(14, 45), stayDurationMin: 20 } }, // 白池地獄
    { id: "2b9f84d2-b507-48ce-ae1f-0c4180a77018", data: { visitTime: t(15, 10), stayDurationMin: 35 } }, // 血の池地獄
    {
      id: TATSUMAKIJIGOKU_ID,
      data: {
        memo: "血の池地獄から歩いておよそ5分、旅の締めくくりは龍巻地獄です。およそ30分から40分の周期で、高温の熱湯と蒸気が勢いよく噴き上がる間欠泉で、天然の間欠泉としては世界でも有数の短い周期で噴出するとされています。柵の外に出ず、少し時間に余裕を持って、噴出の瞬間を待ってみてください。噴出の瞬間には、あたりに轟音とともに白い湯けむりが立ちのぼり、大迫力の景色を見せてくれます。金鱗湖の朝霧から、狭霧台やアルテジオでの静かなひととき、そして別府の地獄めぐりへと移り変わった2日目も、ここで無事に終了です。お疲れさまでした。帰りは車で別府駅・大分空港方面へ向かい、レンタカーを返却しましょう。",
        visitTime: t(15, 50),
        stayDurationMin: 45,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`D2 ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await updateSpotInItinerary(ITIN, { spotId: COMICO_ID }, { stayDurationMin: 85 }, { tx });
    await updateSpotInItinerary(ITIN, { spotId: YUNOTSUBO_ID }, { stayDurationMin: 60 }, { tx });
    await updateSpotInItinerary(ITIN, { spotId: OOGOSHA_ID }, { stayDurationMin: 40, memo: newOogoshaMemo }, { tx });
    await setDaySpotOrder(day2Id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
