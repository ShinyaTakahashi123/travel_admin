/**
 * #125 c4f58fddの直し(6回目)。企画運営(2026-10-11)・法務(2026-10-11、
 * 記録87dbf22)の指摘。
 *
 * 企画運営:
 * 1. Day1が12:33で終わっていた(決まりは各日ごと)。田沢湖高原の実在の
 *    施設「アルパこまくさ」(秋田駒ヶ岳火山防災ステーション・情報センター・
 *    日帰り入浴を併設する公共の施設)をDay1に追加し、乳頭温泉郷の到着を
 *    16:00ごろに。
 * 2. Day2の武家屋敷通り114分は決まりA違反。角館の別の実在の行き先
 *    「桧木内川堤」(国の名勝、ソメイヨシノの桜並木)を新たに挟み、
 *    武家屋敷通りは90分以内に短縮。
 * 3. Day2朝の「乳頭温泉郷」(Day1と同じ場所)は、別の点として書けないため、
 *    独立したスポットにせず、抱返り渓谷の書き出しに「宿を出る」一文として
 *    まとめる(Day2のスポットから削除)。
 *
 * 法務:
 * ① 乳頭温泉郷の座標を、国土地理院の地名「乳頭温泉」の点
 *    (39.80372508, 140.7914228)に修正(宿の点ではない)。チェックリストに
 *    「推定(国土地理院の地名の点)」と記録。
 * ② 「東北でも指折りの温泉地」を伝聞の形に修正。
 * ③ 乳頭温泉郷(Day1到着時・Day2朝)に入浴の一文(ほかの人を撮らない・
 *    長湯を避ける・水分をとる)、Day2朝のブナ林遊歩道にクマの一文
 *    (鈴・決められた道・出会ったら静かに離れる)を追加。
 * ④ 乳頭温泉郷の写真(休暇村の建物・看板が大きく写る)を、スポット写真・
 *    しおりの表紙(thumbnailUrl)の両方から削除(差し替えの手持ちがないため)。
 * ⑤ 角館武家屋敷通りに、今も住民が暮らしている通りである旨の一文を追加。
 *
 * 新しい座標(すべて実在の点、OSM/国土地理院):
 * - アルパこまくさ: 39.7771237, 140.7640451(OSM way 457377725)
 * - 乳頭温泉郷(修正後): 39.80372508, 140.7914228(国土地理院「乳頭温泉」、
 *   推定・地名の点。OSMには宿の点しかないため)
 * - 桧木内川堤: 39.5996543, 140.5586314(OSM way 755931873「桧木内川堤公園」)
 *
 * 事実の出典:
 * - アルパこまくさ: 秋田駒ヶ岳火山防災ステーション・秋田駒ヶ岳情報センター・
 *   日帰り温泉を併設(仙北市田沢湖高原、複数の観光サイトで確認)
 * - 桧木内川堤: 昭和9年(1934)、皇太子明仁親王の御誕生記念で町民が
 *   ソメイヨシノ400本を植樹、国の名勝指定、日本さくら名所100選
 *   (tabi-mag.jp/ak0117/ ほかで確認)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TATSUKO_STAY = 40;

const GOZAISHI_STAY = 60;

const HIME_FROM = "湖に向かって静かに立つ像を見ながら、少し足を止めましょう。この後は、車でおよそ30分、山あいの乳頭温泉郷へ向かいましょう。";
const HIME_TO =
  "湖に向かって静かに立つ像を見ながら、少し足を止めましょう。この先の田沢湖高原には食事処もあるので、昼食をとってから向かうのもよいでしょう。この後は、車でおよそ40分、田沢湖高原のアルパこまくさへ向かいましょう。";

const ALPA_MEMO =
  "姫観音像から車でおよそ40分、田沢湖高原にあるアルパこまくさに着きます。秋田駒ヶ岳の麓にある施設で、火山の仕組みや防災について学べる「駒ヶ岳火山防災ステーション」と、周辺の自然を紹介する「秋田駒ヶ岳情報センター」を併設しています。展望ロビーやお風呂からは、田沢湖と周囲の山々を一望できます。日帰り入浴もできるので、ここでひと休みしましょう。この後は、車でおよそ15分、乳頭温泉郷へ向かいましょう。";

const NYUTO_DAY1_MEMO =
  "アルパこまくさから車でおよそ15分、乳頭山の山麓に広がる乳頭温泉郷に着きます。ブナの原生林に囲まれた一帯に、日帰り入浴のできる一軒宿が点在する、東北でも指折りの温泉地とされています。宿ごとに泉質や湯の色が異なり、白く濁った乳白色の湯や、無色透明の湯など、湯めぐりが楽しめます。入浴の際は、ほかの入浴客を写真に撮ったりせず、長湯をしすぎないよう気をつけ、こまめに水分をとりましょう。今夜はこの近くの宿に泊まりましょう。";

const KAERIMIZU_MEMO =
  "乳頭温泉郷で迎える朝です。宿のお風呂でもうひと浴びしてから、ブナの原生林の中に整備された遊歩道を少し散策しましょう。入浴の際は、ほかの入浴客を写真に撮ったりせず、長湯をしすぎないよう気をつけ、こまめに水分をとりましょう。遊歩道ではクマが出ることもあるので、鈴を鳴らして歩き、決められた道から外れず、もし出会ったら騒がず静かにその場を離れましょう。散策のあとは宿を出発し、車でおよそ50分、抱返り渓谷に着きます。玉川沿いに広がる渓谷で、新緑や紅葉の時期には特に美しい景色が広がることから、「東北の耶馬渓」とも呼ばれます。遊歩道の途中にかかる神の岩橋を渡った先には、抱返り渓谷のシンボルとされる回顧の滝があります。岩場や吊り橋は足元が滑りやすいので、気をつけて歩きましょう。この後は、車でおよそ18分、角館の町なかへ向かいましょう。";

const SHINCHOSHA_FROM = "この後は、歩いておよそ8分、角館武家屋敷通りへ向かいましょう。";
const SHINCHOSHA_TO = "この後は、歩いておよそ12分、桧木内川堤へ向かいましょう。";

const HINOKINAI_MEMO =
  "新潮社記念文学館から歩いておよそ12分、桧木内川堤に着きます。檜木内川沿いにおよそ2kmにわたって続く堤防で、昭和9年(1934)、皇太子明仁親王(のちの上皇陛下)の御誕生を記念し、町民の手で400本のソメイヨシノが植えられたのが始まりです。国の名勝に指定されており、角館武家屋敷通りの枝垂桜とあわせて「日本さくら名所100選」にも選ばれています。桜の時期でなくても、堤防の上を歩きながら、川の流れと町並みを眺める散歩道として親しまれています。この後は、歩いておよそ5分、角館武家屋敷通りへ向かいましょう。";

const BUKE_FROM = "新潮社記念文学館から歩いておよそ8分、角館武家屋敷通りに着きます。";
const BUKE_TO = "桧木内川堤から歩いておよそ5分、角館武家屋敷通りに着きます。";
const BUKE_FROM2 = "いくつかの屋敷は内部も見学でき、当時の暮らしぶりを伝える道具や資料が展示されています。通りをゆっくりと歩きながら";
const BUKE_TO2 =
  "いくつかの屋敷は内部も見学でき、当時の暮らしぶりを伝える道具や資料が展示されています。今も住民が暮らしている通りでもあるので、敷地や玄関先には立ち入らず、通りからの見学にとどめましょう。通りをゆっくりと歩きながら";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c4f58fdd%'`);
  const itinId = rows[0].id;

  const tatsuko = await findSpotInItinerary(itinId, { spotName: "たつこ像" });
  const gozaishi = await findSpotInItinerary(itinId, { spotName: "御座石神社" });
  const hime = await findSpotInItinerary(itinId, { spotName: "姫観音像" });
  const nyutoDay1 = await findSpotInItinerary(itinId, { dayNumber: 1, spotName: "乳頭温泉郷" });
  const nyutoDay2 = await findSpotInItinerary(itinId, { dayNumber: 2, spotName: "乳頭温泉郷" });
  const kaerimizu = await findSpotInItinerary(itinId, { spotName: "抱返り渓谷" });
  const kabazaiku = await findSpotInItinerary(itinId, { spotName: "角館樺細工伝承館" });
  const shinchosha = await findSpotInItinerary(itinId, { spotName: "新潮社記念文学館" });
  const buke = await findSpotInItinerary(itinId, { spotName: "角館武家屋敷通り" });

  if (!hime.memo?.includes(HIME_FROM)) throw new Error("姫観音像の文言が想定外です");
  if (!shinchosha.memo?.includes(SHINCHOSHA_FROM)) throw new Error("新潮社記念文学館の文言が想定外です");
  if (!buke.memo?.includes(BUKE_FROM) || !buke.memo?.includes(BUKE_FROM2)) throw new Error("武家屋敷通りの文言が想定外です");

  console.log("確認OK。Day1 dayId:", tatsuko.dayId, " Day2 dayId:", kaerimizu.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { thumbnailUrl: null } });
    await tx.photo.deleteMany({ where: { spotId: nyutoDay2.id } });

    // Day1: たつこ像・御座石神社・姫観音像(時間延長・文修正)→アルパこまくさ(新規)→乳頭温泉郷(座標・文修正)
    const items1: SpotOrderItem[] = [
      { id: tatsuko.id, data: { stayDurationMin: TATSUKO_STAY } },
      { id: gozaishi.id, data: { stayDurationMin: GOZAISHI_STAY, visitTime: t(9, 50) } },
      {
        id: hime.id,
        data: { memo: hime.memo!.replace(HIME_FROM, HIME_TO), stayDurationMin: 60, visitTime: t(10, 58) },
      },
      {
        create: {
          name: "アルパこまくさ",
          memo: ALPA_MEMO,
          lat: 39.7771237,
          lng: 140.7640451,
          visitTime: t(12, 38),
          stayDurationMin: 180,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 40, transitLine: null }] },
        },
      },
      {
        id: nyutoDay1.id,
        data: {
          memo: NYUTO_DAY1_MEMO,
          lat: 39.80372508,
          lng: 140.7914228,
          visitTime: t(15, 53),
          stayDurationMin: 40,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(tatsuko.dayId, items1, { tx });

    // Day2: 乳頭温泉郷(削除、抱返り渓谷の書き出しに統合)→抱返り渓谷(文修正)→樺細工伝承館→
    //       新潮社記念文学館(文修正)→桧木内川堤(新規)→武家屋敷通り(時間短縮・文修正)
    const items2: SpotOrderItem[] = [
      {
        id: kaerimizu.id,
        data: { memo: KAERIMIZU_MEMO, visitTime: t(9, 30), stayDurationMin: 95, transitLegs: { deleteMany: {} } },
      },
      { id: kabazaiku.id, data: { visitTime: t(11, 23), stayDurationMin: 60 } },
      {
        id: shinchosha.id,
        data: { memo: shinchosha.memo!.replace(SHINCHOSHA_FROM, SHINCHOSHA_TO), visitTime: t(12, 33), stayDurationMin: 80 },
      },
      {
        create: {
          name: "桧木内川堤",
          memo: HINOKINAI_MEMO,
          lat: 39.5996543,
          lng: 140.5586314,
          visitTime: t(14, 5),
          stayDurationMin: 70,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12, transitLine: null }] },
        },
      },
      {
        id: buke.id,
        data: {
          memo: buke.memo!.replace(BUKE_FROM, BUKE_TO).replace(BUKE_FROM2, BUKE_TO2),
          visitTime: t(15, 23),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(kaerimizu.dayId, items2, { remove: [nyutoDay2.id], tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
