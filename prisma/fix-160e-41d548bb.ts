/**
 * #160の続き。企画運営の指摘(宝厳寺65分は、短くした分がそのまま移っただけで
 * 決まりA違反)に対応。宝厳寺を30分に短縮し、空いた35分で道後公園(湯築城跡)
 * を追加した。既存の別のしおり4本とは異なり、河野氏の居城としての歴史は
 * 簡潔にとどめ、明治21年(1888)の公園化、かつて園内にあった動物園
 * (昭和62年/1987年に砥部町へ移転)、展望台からの眺めを中心にした文にして
 * 重なりを避けた(出典: WebSearchで確認)。
 *
 * 新しい時刻(09:30〜16:42、8か所):
 * 道後温泉本館09:30(100)→圓満寺11:12(20)→昼食(道後商店街)11:35(65)→
 * 伊佐爾波神社12:44(40)→宝厳寺13:26(30)→道後公園(湯築城跡)14:03(35)→
 * 椿の湯14:44(55)→ぎやまんガラス美術館15:42(60)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-160e-41d548bb.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "4fa70190-2640-4afc-88af-d2ac7903a436";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const honkan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "道後温泉本館" } });
  const enmanji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "圓満寺" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "道後商店街で昼食" } });
  const isaniwa = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "伊佐爾波神社" } });
  const hogonji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "宝厳寺" } });
  const tsubaki = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "椿の湯" } });
  const giyaman = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "ぎやまんガラス美術館" } });

  if (hogonji.stayDurationMin === 30) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: honkan.id, data: {} },
    { id: enmanji.id, data: {} },
    { id: lunch.id, data: {} },
    { id: isaniwa.id, data: {} },
    {
      id: hogonji.id,
      data: {
        stayDurationMin: 30,
        memo: hogonji.memo?.replace(
          "見学を終えたら、歩いて椿の湯へ向かいましょう。",
          "見学を終えたら、歩いて道後公園へ向かいましょう。"
        ),
      },
    },
    {
      create: {
        name: "道後公園（湯築城跡）",
        address: "松山市道後公園",
        lat: 33.8482478,
        lng: 132.7852575,
        visitTime: T(14, 3),
        stayDurationMin: 35,
        memo: "宝厳寺から歩いて7分ほど、次に訪れるのは道後公園(湯築城跡)です。中世に伊予国を治めた河野氏の居城跡ですが、明治21年(1888)には公園として整備され、昭和の時代には動物園が置かれていたこともありました(動物園は昭和62年/1987年に砥部町へ移転)。園内の丘の上にある展望台からは、松山城や、晴れた日には瀬戸内海まで見渡せます。南北およそ350m、東西およそ295mの、丸みを帯びた六角形の敷地には、内側に土塁を持つ二重の堀が巡らされ、中世の城の姿を今に伝えています。資料館や復元された武家屋敷もあわせて見学しましょう。見学を終えたら、歩いて椿の湯へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    },
    {
      id: tsubaki.id,
      data: {
        visitTime: T(14, 44),
        memo: tsubaki.memo?.replace("宝厳寺から歩いて6分ほど", "道後公園から歩いて6分ほど"),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    },
    { id: giyaman.id, data: { visitTime: T(15, 42) } },
  ]);

  console.log("#160続き: 宝厳寺を30分に短縮し、道後公園(湯築城跡)を追加。09:30〜16:42に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
