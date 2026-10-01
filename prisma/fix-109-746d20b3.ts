/**
 * #109 746d20b3(郡上八幡)の組み直し。元は4か所(09:00〜14:10)で、終了が
 * 規定外(4か所はすでに揃っていたため「4か所未満」ではなく「終了」のみの
 * 違反)。各スポットの滞在はいずれも妥当な長さで水増しは見当たらないため、
 * 新しい実在の行き先(宗祇水・郡上八幡城)を追加して時間を埋めた。
 *
 * 新規2か所はOSM生APIで実在のノード座標を確認済み:
 * - 宗祇水 35.7499891,136.9562181(やなか水のこみちのすぐそば)
 * - 郡上八幡城 35.7530058,136.9613926
 *
 * 事実確認(開いたURL):
 * - 宗祇水(文明3年1471・連歌師飯尾宗祇と東常縁の歌・昭和60年1985名水百選
 *   第1号・用途別の水場): https://ja.wikipedia.org/wiki/宗祇水 ほか
 * - 郡上八幡城(永禄2年1559遠藤盛数が砦を築いたのが始まり・現在の天守は
 *   昭和8年1933大垣城を参考に再建・日本最古の木造再建天守とされる・
 *   司馬遼太郎「日本でもっとも美しい山城」と評した・営業時間季節により
 *   9:00-17:00/8:00-18:00/9:00-16:30):
 *   https://hachiman-castle.com/history/ , https://hachiman-castle.com/guide/
 *
 * 郡上八幡城の滞在は、冬季(11〜2月)の閉館16:30に収まるよう116分とした
 * (14:34着・16:30発)。やなか水のこみちの「周辺に食事処」の裏付けは、
 * OSM生APIでこの一帯にrestaurant/cafe/fast_foodのamenityタグが15件
 * あることを確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YANAKA_FROM = "住宅のそばの小径ですので、静かに歩きましょう。周辺には食事処も点在しているので、この付近で昼食をとってから次へ向かいましょう。";
const YANAKA_TO = "住宅のそばの小径ですので、静かに歩きましょう。周辺には食事処も点在しているので、この付近で昼食にしましょう。この後は、歩いておよそ3分、宗祇水へ向かいましょう。";

const SOGISUI_MEMO =
  "やなか水のこみちから歩いておよそ3分、宗祇水に着きます。文明3年(1471)、連歌の宗匠として知られた飯尾宗祇が、京へ帰る際にこの泉のほとりで東常縁と歌を交わし、郡上に滞在していた間はこの清水を愛して草庵を結んだと伝えられています。昭和60年(1985)、環境庁の名水百選の第1号に選ばれました。湧き出る水は、上流から飲用・米とぎや食べ物を洗う場・洗濯の順に使い分けられ、今も地域の人々によって大切に守られています。この後は、歩いておよそ6分、郡上八幡博覧館へ向かいましょう。";

const HAKURANKAN_FROM = "大正9年(1920)に建てられた旧税務署の建物を活用した博物館で、";
const HAKURANKAN_TO = "宗祇水から歩いておよそ6分、郡上八幡博覧館に着きます。大正9年(1920)に建てられた旧税務署の建物を活用した博物館で、";
const HAKURANKAN_END_FROM = "実演の回数・時間は変わることがあるため、公式サイトで確認してください）。";
const HAKURANKAN_END_TO = "実演の回数・時間は変わることがあるため、公式サイトで確認してください）。この後は、車でおよそ10分、郡上八幡城へ向かいましょう。";

const GUJOHACHIMANJO_MEMO =
  "郡上八幡博覧館から車でおよそ10分、この旅の締めくくり、郡上八幡城に着きます。永禄2年(1559)、遠藤盛数がこの山に砦を築いたのが始まりとされ、現在の天守は昭和8年(1933)、大垣城を参考に再建された、日本最古の木造再建天守とされる4層5階の建物です。司馬遼太郎は、この城を「日本でもっとも美しい山城」と評しました。天守からは、郡上八幡の城下町と吉田川、長良川の流れを一望できます。郡上八幡の水とものづくり、歴史をめぐる旅はこれで終わりです。帰りは、郡上八幡ICから東海北陸自動車道で戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '746d20b3%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const iwasaki = await findSpotInItinerary(itinId, { spotName: "サンプルビレッジいわさき" });
  const igawa = await findSpotInItinerary(itinId, { spotName: "いがわ小径" });
  const yanaka = await findSpotInItinerary(itinId, { spotName: "やなか水のこみち" });
  const hakurankan = await findSpotInItinerary(itinId, { spotName: "郡上八幡博覧館" });

  if (!yanaka.memo!.includes(YANAKA_FROM)) throw new Error("やなか水のこみちの文言が想定外です");
  if (!hakurankan.memo!.includes(HAKURANKAN_FROM)) throw new Error("郡上八幡博覧館の文言①が想定外です");
  if (!hakurankan.memo!.includes(HAKURANKAN_END_FROM)) throw new Error("郡上八幡博覧館の文言②が想定外です");
  console.log("確認OK");

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const hakurankanMemo = hakurankan.memo!.replace(HAKURANKAN_FROM, HAKURANKAN_TO).replace(HAKURANKAN_END_FROM, HAKURANKAN_END_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: iwasaki.id, data: {} },
    { id: igawa.id, data: {} },
    { id: yanaka.id, data: { memo: yanaka.memo!.replace(YANAKA_FROM, YANAKA_TO) } },
    {
      create: {
        name: "宗祇水",
        address: "岐阜県郡上市八幡町本町",
        lat: 35.7499891,
        lng: 136.9562181,
        memo: SOGISUI_MEMO,
        visitTime: t(12, 43),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    { id: hakurankan.id, data: { memo: hakurankanMemo, visitTime: t(13, 9), transitMode: "walk", transitDurationMin: 6 } },
    {
      create: {
        name: "郡上八幡城",
        address: "岐阜県郡上市八幡町柳町一の平",
        lat: 35.7530058,
        lng: 136.9613926,
        memo: GUJOHACHIMANJO_MEMO,
        visitTime: t(14, 34),
        stayDurationMin: 116,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
