/**
 * #137 ec2b0e8dの直し。もとは霞城公園・文翔館・山形美術館の3か所
 * (09:30〜12:50)のみで4か所未満、終始案内役の話し方。
 * 山形県立博物館(霞城公園内、国宝「縄文の女神」)・御殿堰(昼食)・
 * 山形まなび館(旧山形市立第一小学校)を追加し6か所に。
 * 最上義光歴史館・山形市郷土館(旧済生館本館)は、他の既存しおり
 * (b461a3e0・ce594140)が同じ建物を使っているため使わず。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KAJO_MEMO =
  "山形駅から歩いて10分ほどの、市街地のほぼ中心に位置する霞城公園に着きます。南北朝時代の延文元年(1356)、斯波兼頼によって築かれたのが始まりと伝えられる山形城の跡地です。その後、出羽を治めた戦国大名・最上義光がこの城を大きく整えました。慶長出羽合戦の折、霞がかかって城が敵から見えなかったという言い伝えから、「霞城」とも呼ばれるようになったと伝えられています。平成3年(1991)に古来の工法で復元された東大手門は、櫓門や高麗門を備えた堂々たる姿で、公園のシンボルとなっています。桜の名所としても知られる城跡公園を、ゆっくりと散策しましょう。この後は、歩いておよそ3分、山形県立博物館へ向かいましょう。";

const MUSEUM_MEMO =
  "霞城公園から歩いておよそ3分、山形県立博物館に着きます。地学・動物・植物・考古・歴史・民俗の6部門からなる、山形県の総合博物館です。舟形町の西ノ前遺跡から出土した、縄文時代の土偶としては日本最大とされる、高さ45cmの土偶「縄文の女神」は、平成24年(2012)に国宝に指定されました。第2展示室「山形の大地に刻まれた歴史」で、常設展示されています。郷土の自然と歴史を、じっくり見てみましょう。この後は、歩いておよそ3分、文翔館へ向かいましょう。";

const BUNSHO_MEMO =
  "山形県立博物館から歩いておよそ3分、文翔館に着きます。文翔館の愛称で親しまれる、山形県郷土館です。大正2年(1913)に着工し、大正5年(1916)に完成した、旧山形県庁舎と旧県会議事堂からなる建物で、英国近世復興様式と呼ばれる重厚な石貼りの外観が特徴です。設計は米沢出身の建築家・中條精一郎の指導のもと、田原新之助が手がけました。昭和50年(1975)まで実際に県庁舎として使われたのち、昭和59年(1984)に国の重要文化財に指定され、およそ10年におよぶ復原工事を経て、平成7年(1995)から公開されています。れんが造りの重厚な建物内部を見学でき、大正ロマンの香り漂う装飾の数々をじっくりと眺めましょう。この後は、歩いておよそ15分、御殿堰へ向かいましょう。";

const GOTEN_MEMO =
  "文翔館から歩いておよそ15分、御殿堰に着きます。およそ400年前、山形城主・鳥居忠正によって造られた、全長17.5kmにおよぶ用水で、かつてこの水が山形城の堀に注いでいたことから「御殿堰」と名付けられたと伝えられています。今は堰に沿って食事処やショップが並ぶ、市民の憩いの場として整備されています。ここで昼食をとりましょう。食事を終えたら、歩いておよそ6分、山形まなび館へ向かいましょう。";

const MANABI_MEMO =
  "御殿堰から歩いておよそ6分、山形まなび館に着きます。昭和2年(1927)に竣工した、山形県内で最初の鉄筋コンクリート造りの校舎だったとされる、旧山形市立第一小学校の建物です。国の登録有形文化財、経済産業省の近代化産業遺産に認定されています。今は、山形の文化財や教育資料を展示する施設として活用されています。昔の学校建築の面影を、ゆっくり眺めましょう。この後は、歩いておよそ10分、山形美術館へ向かいましょう。";

const ARTMUSEUM_MEMO =
  "山形まなび館から歩いておよそ10分、山形美術館に着きます。昭和39年(1964)の開館以来、日本・東洋の古美術やフランス近代美術とあわせて、山形にゆかりの深い作家の作品を収集してきました。中でも、山形市出身で日本の近代彫刻の先駆けとされる新海竹太郎と、その甥にあたる新海竹蔵の作品は、郷土を代表するコレクションとして知られています。山形の金融界を支えた長谷川家が長年にわたり収集した、江戸時代の狩野派や円山四条派の絵画も収蔵されており、地元にゆかりの深い美意識に触れることができます。じっくりと鑑賞しましょう。見学を終えたら、歩いておよそ15分、山形駅へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'ec2b0e8d%'`);
  const itinId = rows[0].id;
  const kajo = await findSpotInItinerary(itinId, { spotName: "霞城公園" });
  const bunsho = await findSpotInItinerary(itinId, { spotName: "山形県郷土館（文翔館）" });
  const artmuseum = await findSpotInItinerary(itinId, { spotName: "山形美術館" });

  console.log("dayId:", kajo.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1: SpotOrderItem[] = [
    { id: kajo.id, data: { stayDurationMin: 70, memo: KAJO_MEMO } },
    {
      create: {
        name: "山形県立博物館", lat: 38.2544062, lng: 140.3296256, visitTime: t(10, 43), stayDurationMin: 80, memo: MUSEUM_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    },
    {
      id: bunsho.id,
      data: {
        visitTime: t(12, 6), stayDurationMin: 60, memo: BUNSHO_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    },
    {
      create: {
        name: "御殿堰", lat: 38.2532459, lng: 140.339326, visitTime: t(13, 21), stayDurationMin: 60, memo: GOTEN_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
      },
    },
    {
      create: {
        name: "山形まなび館", lat: 38.2506912, lng: 140.3359845, visitTime: t(14, 27), stayDurationMin: 35, memo: MANABI_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    },
    {
      id: artmuseum.id,
      data: {
        visitTime: t(15, 12), stayDurationMin: 80, memo: ARTMUSEUM_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
      },
    },
  ];
  await setDaySpotOrder(kajo.dayId, day1);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
