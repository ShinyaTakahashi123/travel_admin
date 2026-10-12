/**
 * #118 8ba48819の直し(4回目)。企画運営(16:02)と法務(16:03)の指摘に対応。
 *
 * 企画運営:
 * 1. 展望台80分→25分に短縮し、本覚寺を追加(野外博物館合掌造り民家園は
 *    座標の裏付けが取れず、どぶろく祭りの館は現在無期限休館中と判明
 *    したため、ともに見送った)
 * 2. 和田家→展望台の移動を車からシャトルバスに(0534e5d3との書き分けと
 *    あわせて、以下3で全面書き直し)
 * 3. 和田家の文章が0534e5d3のしおりとほぼ同じだったため全面書き直し
 *    (桁行22.3m・梁間12.8mの三階建て、釘を使わない縄での組み上げ、
 *    2階より上での養蚕、2つの異なる入り口、など新しい事実にもとづく)
 * 4. 言い切り・口調の修正(上の書き直しで解消)
 * 5. 荻町合掌造り集落の座標をOSMの点に修正
 *
 * 法務:
 * ①座標3か所(集落・和田家・神田家)をOSMの点に修正
 * ②(3の書き直しで解消)
 * ③和田家・長瀬家に「公開されていない所には入らない」の一文を追加
 * ④白川八幡神社の「参拝者にも振る舞われる」を外す(祭りそのものの
 *   説明にとどめ、来訪者への酒類提供を示唆しない)
 *
 * 新しい並び: 荻町合掌造り集落→白川八幡神社→本覚寺→明善寺郷土館→
 * 神田家→長瀬家(昼食)→和田家→荻町城跡展望台、09:15〜16:41。
 *
 * 事実確認: 本覚寺(光明山本覚寺、開山は本尊の阿弥陀如来絵像が本願寺
 * 9世・実如上人から授与されたことから15世紀末ごろと推測、延宝8年
 * /1680に真宗大谷派から本願寺派へ転派、明善寺はこの本覚寺から分かれた
 * 門信徒により寛延元年/1748創建と伝わる、「おおた桜」でも知られる):
 * gifureki.com等。和田家(桁行22.3m・梁間12.8m・一重三階・切妻造・
 * 茅葺、江戸末期建築とみられ平成7年/1995重文指定、釘を使わず縄で
 * 組む合掌造りの技法、2階より上で養蚕、2つの異なる入り口):
 * online.bunka.go.jp、mlit.go.jp等
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HACHIMAN_FROM =
  "神社の酒蔵でつくられたどぶろくを神様に奉納し、参拝者にも振る舞われるお祭りで、獅子舞や民謡「こだいじん」が披露されます。";
const HACHIMAN_TO = "神社の酒蔵でつくられたどぶろくを神様に奉納するお祭りで、獅子舞や民謡「こだいじん」が披露されます。";

const HACHIMAN_END_FROM = "この後は、歩いてすぐ、明善寺郷土館へ向かいましょう。";
const HACHIMAN_END_TO = "この後は、歩いておよそ4分、本覚寺へ向かいましょう。";

const HONGAKUJI_MEMO =
  "白川八幡神社から歩いておよそ4分、本覚寺に着きます。創建の時期ははっきりしませんが、本尊の阿弥陀如来絵像が本願寺9世・実如上人から授与されたことから、15世紀末ごろの開山と推測されています。延宝8年(1680)には、真宗大谷派から本願寺派へと転派しました。集落にあるもう一つの寺院・明善寺は、この本覚寺から分かれた門信徒たちによって、寛延元年(1748)に創建されたと伝えられています。境内に植えられた「おおた桜」でも知られ、季節には美しい花を咲かせます。今も信仰の対象となっている寺院ですので、参拝の際は敬意を込めて手を合わせましょう。この後は、歩いておよそ3分、明善寺郷土館へ向かいましょう。";

const MYOZENJI_FROM = "白川八幡神社から歩いてすぐ、明善寺郷土館に着きます。";
const MYOZENJI_TO = "本覚寺から歩いておよそ3分、明善寺郷土館に着きます。";

const NAGASEKE_FROM = "急な階段を上りながら、養蚕や焔硝づくりで栄えた旧家の暮らしぶりをたどってみましょう。";
const NAGASEKE_TO =
  "急な階段を上りながら、養蚕や焔硝づくりで栄えた旧家の暮らしぶりをたどってみましょう。今も一部は住まいとして使われていますので、公開されていない部屋には立ち入らないようにしましょう。";

const WADAKE_MEMO =
  "長瀬家から歩いておよそ5分、和田家に着きます。桁行22.3m、梁間12.8mの大きな主屋を持つ、一重三階・切妻造・茅葺の合掌造りで、江戸時代末期の建築と見られています。平成7年(1995)に国の重要文化財に指定されました。建物には釘を一切使わず、梁や柱を縄で固く縛って組み上げる、合掌造り特有の技法が用いられています。2階より上の階では、かつて養蚕が盛んに行われていました。正面には大きさの異なる2つの入り口があり、小さな右側は普段の住人用、畳敷きの部屋に続く大きな左側は、身分の高い来客を迎えるためのものだったと伝えられています。今も一部は住まいとして使われていますので、公開されていない部屋には立ち入らないようにしましょう。急な階段を上りながら、囲炉裏の煙で飴色に燻された梁や柱を眺めてみましょう。この後は、歩いておよそ18分、荻町城跡展望台へ向かいましょう。";

const TENBODAI_MEMO =
  "和田家から、上り坂を歩いておよそ18分(シャトルバスも利用できます)、荻町城跡展望台に着きます。田畑の中に合掌造りの家並みが点在する荻町集落の全景を、高いところからゆったりと見渡せる、白川郷観光の記念撮影スポットです。すぐそばには、食事やお土産を扱う民間の施設もあり、休憩に立ち寄ることもできます。集落を歩いて感じた合掌造りの息づかいを、高台から俯瞰する景色とあわせて、旅の締めくくりに味わいましょう。シャトルバスか徒歩で集落まで戻り、高山濃飛バスセンター行きのバスで帰りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '8ba48819%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const shuuraku = await findSpotInItinerary(itinId, { spotName: "荻町合掌造り集落" });
  const hachiman = await findSpotInItinerary(itinId, { spotName: "白川八幡神社" });
  const myozenji = await findSpotInItinerary(itinId, { spotName: "明善寺郷土館" });
  const kandake = await findSpotInItinerary(itinId, { spotName: "神田家" });
  const nagaseke = await findSpotInItinerary(itinId, { spotName: "長瀬家" });
  const wadake = await findSpotInItinerary(itinId, { spotName: "和田家" });
  const tenbodai = await findSpotInItinerary(itinId, { spotName: "荻町城跡展望台" });

  if (!hachiman.memo!.includes(HACHIMAN_FROM)) throw new Error("白川八幡神社の文言が想定外です");
  if (!hachiman.memo!.includes(HACHIMAN_END_FROM)) throw new Error("白川八幡神社の結びが想定外です");
  if (!myozenji.memo!.includes(MYOZENJI_FROM)) throw new Error("明善寺郷土館の文言が想定外です");
  if (!nagaseke.memo!.includes(NAGASEKE_FROM)) throw new Error("長瀬家の文言が想定外です");
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    {
      id: shuuraku.id,
      data: { lat: 36.2619949, lng: 136.906877, visitTime: t(9, 15) },
    },
    {
      id: hachiman.id,
      data: {
        memo: hachiman.memo!.replace(HACHIMAN_FROM, HACHIMAN_TO).replace(HACHIMAN_END_FROM, HACHIMAN_END_TO),
        visitTime: t(11, 7),
        transitDurationMin: 12,
      },
    },
    {
      create: {
        name: "本覚寺",
        address: "岐阜県大野郡白川村荻町679-1",
        lat: 36.2574804,
        lng: 136.9053395,
        memo: HONGAKUJI_MEMO,
        visitTime: t(11, 36),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
    {
      id: myozenji.id,
      data: { memo: myozenji.memo!.replace(MYOZENJI_FROM, MYOZENJI_TO), visitTime: t(12, 9), transitDurationMin: 3 },
    },
    {
      id: kandake.id,
      data: { lat: 36.257803, lng: 136.90708, visitTime: t(13, 12) },
    },
    {
      id: nagaseke.id,
      data: { memo: nagaseke.memo!.replace(NAGASEKE_FROM, NAGASEKE_TO), visitTime: t(13, 48) },
    },
    {
      id: wadake.id,
      data: { memo: WADAKE_MEMO, lat: 36.259924, lng: 136.9076278, visitTime: t(15, 18) },
    },
    {
      id: tenbodai.id,
      data: {
        memo: TENBODAI_MEMO,
        visitTime: t(16, 16),
        stayDurationMin: 25,
        transitMode: "walk",
        transitDurationMin: 18,
        transitLine: null,
      },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots);
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
