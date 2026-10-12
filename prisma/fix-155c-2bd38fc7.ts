/**
 * #155の続き。企画運営の3点・法務の2点の指摘に対応。
 * 企画運営:
 * ①第1ターミナル展望デッキ(SHIKISAI GARDEN)の130分は長すぎたため60分に短縮。
 *   空いた時間に、空港の外の三里塚記念公園(御料牧場記念館)を1か所追加。
 *   空港ができる前、宮内庁の御料牧場だった歴史を伝える場所(ほかのしおりとの
 *   重なりなしを確認済み)。御料牧場記念館は16:30閉館のため、16:30以降に
 *   かからないよう三里塚記念公園をSHIKISAI GARDENの前に置いた
 *   (SHIKISAI GARDENは21時まで開いているため、最後でも問題ない)。
 * ②第2ターミナル展望デッキの座標が昼食(第2ターミナル)と同じだったため、
 *   OSM実点のviewpoint(n1093276379「展望台北」、35.7750635,140.3878796)に修正。
 * ③最後の一文に、レンタカーを返す場所(朝に借りた空港第2ビル駅前)を明記。
 * 法務:
 * ①SHIKISAI GARDENの足湯に、ほかの利用者を写さない一文を追加。
 * ②航空科学博物館「戦後初の国産旅客機YS-11」にヘッジを追加。
 * (任意の指摘: 説明文の「さくらの丘」→「さくらの山」に統一。
 *  第1ターミナル展望デッキの座標はn2134199633「展望デッキ」(35.7635940,
 *  140.3836128)に変更)
 *
 * 新しい時刻(09:30〜16:33、6か所):
 * さくらの山09:30(25)→航空科学博物館10:10(120)→昼食12:25(70)→
 * 第2ターミナル展望デッキ13:38(35)→三里塚記念公園14:28(55)→
 * 第1ターミナル展望デッキ15:33(60)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-155c-2bd38fc7.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "2bd38fc7-fda8-40a1-b9d2-5df16bb624fd";
const DAY1_ID = "c45d8cd1-2b3e-4d6f-9988-ede8fb90e82d";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const sakura = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "さくらの山" } });
  const museum = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "航空科学博物館" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "成田国際空港第2ターミナルで昼食" } });
  const t2deck = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "成田国際空港第2ターミナル展望デッキ" } });
  const t1deck = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "成田国際空港第1ターミナル展望デッキ" } });

  if (t1deck.stayDurationMin === 60) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "成田国際空港に隣接する航空科学博物館や、離着陸を間近で見られるさくらの山、空港ができる前の牧場の歴史を伝える三里塚記念公園、空港ターミナルの展望デッキ・足湯も楽しめる「SHIKISAI GARDEN」まで、飛行機好き親子にぴったりの、空港の街・成田をめぐるファミリープランです。",
    },
  });

  await setDaySpotOrder(DAY1_ID, [
    { id: sakura.id, data: {} },
    {
      id: museum.id,
      data: {
        memo: museum.memo?.replace(
          "戦後初の国産旅客機YS-11の試作1号機",
          "戦後初の国産旅客機とされるYS-11の試作1号機"
        ),
      },
    },
    { id: lunch.id, data: {} },
    {
      id: t2deck.id,
      data: {
        lat: 35.7750635,
        lng: 140.3878796,
      },
    },
    {
      create: {
        name: "三里塚記念公園",
        address: "成田市三里塚御料1-34",
        lat: 35.7489025,
        lng: 140.3727966,
        visitTime: T(14, 28),
        stayDurationMin: 55,
        memo: "第2ターミナル展望デッキから車でおよそ15分、次に訪れるのは三里塚記念公園です。明治時代から、皇室の御料牧場として使われてきた土地で、成田国際空港の建設にともない、牧場は栃木県に移り、跡地が公園として整備されました。園内西側の御料牧場記念館には、牧場で使われていた農機具や、皇室ゆかりの調度品などが展示されており、空港ができる前の成田のもう一つの顔を伝えています。マロニエの並木道も見どころです。空港の歴史の背景にも触れながら、ゆっくりと巡りましょう。見学を終えたら、車で第1ターミナルへ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
      },
    },
    {
      id: t1deck.id,
      data: {
        lat: 35.763594,
        lng: 140.3836128,
        visitTime: T(15, 33),
        stayDurationMin: 60,
        memo: "三里塚記念公園から車でおよそ10分、成田の旅の最後に訪れるのは、第1ターミナルの「SHIKISAI GARDEN」です。令和8年(2026)にリニューアルした、5階の展望デッキを含むエリアで、足湯につかりながら、高い位置の「マウンテンデッキ」から航空機の離着陸を眺められます。足湯では、ほかの利用者を写さないよう気をつけましょう。フードコートや、子ども向けの遊び場もあり、家族でゆっくりと過ごせます。水のせせらぎや緑に囲まれた、空港とは思えない開放的な空間で、旅の締めくくりのひとときを楽しみましょう。見学を終えたら、車で空港第2ビル駅前へ戻り、レンタカーを返して、京成線・JR線で帰りましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
      },
    },
  ]);

  console.log("#155続き: SHIKISAI GARDEN60分に短縮、三里塚記念公園を追加、座標・ヘッジ・足湯の一文・車を返す場所を修正。09:30〜16:33に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
