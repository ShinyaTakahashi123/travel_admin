/**
 * #108 6dd8f74f(高崎)の直し(3回目)。企画運営(2026-10-01 12:02)・
 * 法務(2026-10-01 12:03)の指摘。
 *
 * 企画運営の6点+法務の2点(重なりあり):
 * 1. 高崎市美術館126分は決まりAの水増し。60分に戻し、空いた時間は同じ
 *    建築家アントニン・レーモンド設計の群馬音楽センター(高崎城址公園の
 *    すぐ隣、外観のみ見学、15分)と、高崎市タワー美術館(高崎市美術館から
 *    徒歩8分、日本画中心のコレクション、50分)を新しく足して埋めた。
 *    両美術館とも開館時間10:00〜18:00(金曜20:00まで)・月曜休館で、
 *    訪問時刻と重ならないことを確認済み。
 * 2・法務① 染料植物園「入園は無料で」(料金の言葉、数字がなくても禁止)を削除。
 * 3・法務② 題名の「パワースポット」を削除(法務の提案文言どおり)。
 * 4. 昼食を、場所がはっきりしない染料植物園から、観音山の参道(観音茶屋など
 *    茶屋・みやげ物店が実在)で過ごす清水寺(10:58〜11:53、11:30〜13:30の
 *    時間帯と重なる)に移した。
 * 5. 朝の行き方(高崎駅でレンタカーを借りる)を達磨寺の書き出しに追加。
 *    高崎城址公園で「ここに車を停め、ここから先は徒歩でまわる」ことを
 *    明記し、音楽センター・高崎公園・美術館・タワー美術館は徒歩で統一。
 * 6. 最後のタワー美術館で「来た道を戻って車に乗り、高崎駅前でレンタカーを
 *    返却してから、帰路につきましょう」に直し、案内口調も解消。
 *
 * 新規2か所はOSM生APIで実在のノード座標を確認済み:
 * - 群馬音楽センター 36.3238167,139.0034217(高崎城址公園のほぼ隣)
 * - 高崎市タワー美術館 36.3224609,139.0151829
 *
 * 事実確認(開いたURL):
 * - 群馬音楽センター(昭和36年1961開館・設計アントニン・レーモンド・
 *   市民からの寄付・コンクリート打ち放しの折板構造・DOCOMOMO Japan選定・
 *   公共建築百選): https://www.takasaki-foundation.or.jp/culture/m-center/
 * - 高崎市タワー美術館(開館時間10:00〜18:00金曜20:00まで・月曜休館・
 *   横山大観/東山魁夷/平山郁夫/奥村土牛などの日本画コレクション):
 *   https://www.city.takasaki.gunma.jp/site/tower/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "高崎白衣大観音と少林山達磨寺、観音山と城下をめぐる高崎日帰りプラン";
const DESCRIPTION =
  "高崎のシンボル・白衣大観音と、だるま発祥の寺として知られる少林山達磨寺を中心に、観音山の清水寺や染料植物園、高崎城址公園、群馬音楽センター、高崎公園、高崎市美術館・高崎市タワー美術館まで、高崎の信仰と歴史、建築と美術をめぐる日帰りプランです。";

const DARUMAJI_MEMO =
  "高崎駅でレンタカーを借り、車でおよそ20分、旅の始まりとなる少林山達磨寺に着きます。黄檗宗の寺院で、元禄10年(1697)、前橋城主・酒井忠挙が、水戸光圀ゆかりの心越禅師の教えを慕い、その高弟を招いて開いたと伝えられています。「だるま発祥の地」と呼ばれるのは、江戸時代後期の天明の飢饉のころ、住職が心越禅師の描いた一筆達磨の絵をもとに木型を彫り、農民の副業として張子だるまの作り方を伝えたことに由来するのだそうです。境内ではだるまの絵付け体験もでき、高崎ならではのお土産づくりも楽しめます。今も法要が営まれる祈りの場ですので、境内では敬意を込めて静かにお参りください。この後は、車でおよそ15分、高崎白衣大観音へ向かいましょう。";

const KIYOMIZUDERA_FROM = "参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ13分、高崎市染料植物園へ向かいましょう。";
const KIYOMIZUDERA_TO = "参拝の際は、敬意を込めて手を合わせましょう。参道沿いには茶屋や食事処が点在しているので、ここで昼食にしましょう。この後は、歩いておよそ13分、高崎市染料植物園へ向かいましょう。";

const SENRYOKUEN_FROM = "160種・およそ17000株の染料植物が栽培されています。入園は無料で、敷地内の染色工芸館では、実際に染められた布や糸の展示を見ることができます。園内は緑豊かで休憩もしやすいので、ここで昼食をとるのもよいでしょう。この後は、車でおよそ13分、高崎城址公園へ向かいましょう。";
const SENRYOKUEN_TO = "160種・およそ17000株の染料植物が栽培されています。敷地内の染色工芸館では、実際に染められた布や糸の展示を見ることができます。この後は、車でおよそ13分、高崎城址公園へ向かいましょう。";

const JOSHIKOEN_FROM = "こちらも県の重要文化財です。この後は、歩いておよそ7分、高崎公園へ向かいましょう。";
const JOSHIKOEN_TO = "こちらも県の重要文化財です。ここの駐車場に車を停め、ここから先は徒歩でまわります。この後は、歩いてすぐ、群馬音楽センターへ向かいましょう。";

const ONGAKUCENTER_MEMO =
  "高崎城址公園からすぐ、群馬音楽センターに着きます。昭和36年(1961)、チェコ出身の建築家アントニン・レーモンドの設計で開館したコンサートホールです。当時の高崎市民からの寄付も建設費に充てられたと伝えられ、コンクリート打ち放しの大きな折板構造の屋根が特徴的な外観で、DOCOMOMO Japanの「日本におけるモダン・ムーブメントの建築」20選や、公共建築百選にも選ばれています。公演のない日は中に入れないため、外観を眺めながら、レーモンド建築の雰囲気を楽しみましょう。この後は、歩いておよそ7分、高崎公園へ向かいましょう。";

const TAKASAKIKOEN_FROM = "高崎城址公園から歩いておよそ7分、高崎公園に着きます。";
const TAKASAKIKOEN_TO = "群馬音楽センターから歩いておよそ7分、高崎公園に着きます。";

const BIJUTSUKAN_FROM = "美術館の展示とあわせて、モダニズム建築の旧邸や庭園もゆっくり巡ってみましょう。高崎白衣大観音と少林山達磨寺、高崎の信仰と歴史をめぐる旅はこれで終わりです。帰りは、高崎駅方面へ、徒歩やバスでお戻りください。";
const BIJUTSUKAN_TO = "美術館の展示とあわせて、モダニズム建築の旧邸や庭園もあわせて巡ってみましょう。この後は、歩いておよそ8分、高崎市タワー美術館へ向かいましょう。";

const TOWERBIJUTSUKAN_MEMO =
  "高崎市美術館から歩いておよそ8分、この旅の締めくくり、高崎市タワー美術館に着きます。横山大観や東山魁夷、平山郁夫、奥村土牛といった巨匠たちの近代・現代の日本画を中心に収蔵する美術館で、年に5〜6回、展覧会が入れ替わります。日本画ならではの繊細な筆づかいや余白の美しさを、ゆっくり味わってみましょう。高崎白衣大観音と少林山達磨寺、観音山と城下をめぐる高崎の旅はこれで終わりです。来た道を戻って車に乗り、高崎駅前でレンタカーを返却してから、帰路につきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const darumaji = await findSpotInItinerary(itinId, { spotName: "少林山達磨寺" });
  const daikannon = await findSpotInItinerary(itinId, { spotName: "高崎白衣大観音" });
  const kiyomizudera = await findSpotInItinerary(itinId, { spotName: "清水寺" });
  const senryokuen = await findSpotInItinerary(itinId, { spotName: "高崎市染料植物園" });
  const joshikoen = await findSpotInItinerary(itinId, { spotName: "高崎城址公園" });
  const takasakikoen = await findSpotInItinerary(itinId, { spotName: "高崎公園" });
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "高崎市美術館" });

  const DARUMAJI_FROM_CHECK = "旅の始まりは少林山達磨寺です。";
  if (!darumaji.memo!.includes(DARUMAJI_FROM_CHECK)) throw new Error("少林山達磨寺の文言が想定外です");
  if (!kiyomizudera.memo!.includes(KIYOMIZUDERA_FROM)) throw new Error("清水寺の文言が想定外です");
  if (!senryokuen.memo!.includes(SENRYOKUEN_FROM)) throw new Error("染料植物園の文言が想定外です");
  if (!joshikoen.memo!.includes(JOSHIKOEN_FROM)) throw new Error("高崎城址公園の文言が想定外です");
  if (!takasakikoen.memo!.includes(TAKASAKIKOEN_FROM)) throw new Error("高崎公園の文言が想定外です");
  if (!bijutsukan.memo!.includes(BIJUTSUKAN_FROM)) throw new Error("高崎市美術館の文言が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: darumaji.id, data: { memo: DARUMAJI_MEMO } },
    { id: daikannon.id, data: {} },
    { id: kiyomizudera.id, data: { memo: kiyomizudera.memo!.replace(KIYOMIZUDERA_FROM, KIYOMIZUDERA_TO), stayDurationMin: 55 } },
    { id: senryokuen.id, data: { memo: senryokuen.memo!.replace(SENRYOKUEN_FROM, SENRYOKUEN_TO), visitTime: t(12, 6) } },
    { id: joshikoen.id, data: { memo: joshikoen.memo!.replace(JOSHIKOEN_FROM, JOSHIKOEN_TO), visitTime: t(13, 14) } },
    {
      create: {
        name: "群馬音楽センター",
        address: "群馬県高崎市高松町",
        lat: 36.3238167,
        lng: 139.0034217,
        memo: ONGAKUCENTER_MEMO,
        visitTime: t(13, 51),
        stayDurationMin: 15,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      id: takasakikoen.id,
      data: { memo: takasakikoen.memo!.replace(TAKASAKIKOEN_FROM, TAKASAKIKOEN_TO), visitTime: t(14, 13), transitDurationMin: 7 },
    },
    {
      id: bijutsukan.id,
      data: { memo: bijutsukan.memo!.replace(BIJUTSUKAN_FROM, BIJUTSUKAN_TO), visitTime: t(14, 56), stayDurationMin: 60 },
    },
    {
      create: {
        name: "高崎市タワー美術館",
        address: "群馬県高崎市高松町",
        lat: 36.3224609,
        lng: 139.0151829,
        memo: TOWERBIJUTSUKAN_MEMO,
        visitTime: t(16, 4),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE, description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
