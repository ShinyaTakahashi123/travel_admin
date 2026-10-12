/**
 * #118 8ba48819の直し(6回目)。企画運営(16:08)の指摘2点。
 * 1. 昼食(長瀬家)の到着が13:48で11:30〜13:30を過ぎていたため、
 *    長瀬家と神田家の順番を入れ替え、明善寺郷土館のすぐあとに昼食
 *    (長瀬家)が来るようにした。長瀬家→神田家→和田家→展望台、
 *    終わりは16:40。
 * 2. 荻町合掌造り集落の結びが「歩いておよそ6分」のままで、白川八幡
 *    神社の書き出し(12分、fix-118eで直し済み)と合っていなかった。
 *    「12分」に直す。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHUURAKU_FROM = "この後は、歩いておよそ6分、白川八幡神社へ向かいましょう。";
const SHUURAKU_TO = "この後は、歩いておよそ12分、白川八幡神社へ向かいましょう。";

const MYOZENJI_FROM = "この後は、歩いておよそ3分、神田家へ向かいましょう。";
const MYOZENJI_TO = "この後は、歩いておよそ3分、長瀬家へ向かいましょう。";

const NAGASEKE_FROM = "この後は、歩いておよそ5分、和田家へ向かいましょう。";
const NAGASEKE_TO = "この後は、歩いてすぐ、神田家へ向かいましょう。";

const KANDAKE_MEMO =
  "長瀬家から歩いてすぐ、神田家に着きます。160年以上の歴史を持つ合掌造りの民家で、間取りの発達や、小屋組み(合掌木)に見える大工の手跡の多さから、合掌造り家屋の中でも完成度が極めて高いとされています。囲炉裏端で代々受け継がれてきた暮らしの道具や、太い梁が組まれた屋根裏の構造を、間近で見学できます。この後は、歩いておよそ4分、和田家へ向かいましょう。";

const WADAKE_FROM = "長瀬家から歩いておよそ5分、和田家に着きます。";
const WADAKE_TO = "神田家から歩いておよそ4分、和田家に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const shuuraku = await findSpotInItinerary(itinId, { spotName: "荻町合掌造り集落" });
  const myozenji = await findSpotInItinerary(itinId, { spotName: "明善寺郷土館" });
  const kandake = await findSpotInItinerary(itinId, { spotName: "神田家" });
  const nagaseke = await findSpotInItinerary(itinId, { spotName: "長瀬家" });
  const wadake = await findSpotInItinerary(itinId, { spotName: "和田家" });
  const tenbodai = await findSpotInItinerary(itinId, { spotName: "荻町城跡展望台" });

  if (!shuuraku.memo!.includes(SHUURAKU_FROM)) throw new Error("荻町合掌造り集落の文言が想定外です");
  if (!myozenji.memo!.includes(MYOZENJI_FROM)) throw new Error("明善寺郷土館の文言が想定外です");
  if (!nagaseke.memo!.includes(NAGASEKE_FROM)) throw new Error("長瀬家の文言が想定外です");
  if (!wadake.memo!.includes(WADAKE_FROM)) throw new Error("和田家の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: shuuraku.id, data: { memo: shuuraku.memo!.replace(SHUURAKU_FROM, SHUURAKU_TO) } },
    { id: (await findSpotInItinerary(itinId, { spotName: "白川八幡神社" })).id, data: {} },
    { id: (await findSpotInItinerary(itinId, { spotName: "本覚寺" })).id, data: {} },
    { id: myozenji.id, data: { memo: myozenji.memo!.replace(MYOZENJI_FROM, MYOZENJI_TO) } },
    { id: nagaseke.id, data: { memo: nagaseke.memo!.replace(NAGASEKE_FROM, NAGASEKE_TO), visitTime: t(13, 12) } },
    { id: kandake.id, data: { memo: KANDAKE_MEMO, visitTime: t(14, 38) } },
    { id: wadake.id, data: { memo: wadake.memo!.replace(WADAKE_FROM, WADAKE_TO), visitTime: t(15, 17) } },
    { id: tenbodai.id, data: { visitTime: t(16, 15) } },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
