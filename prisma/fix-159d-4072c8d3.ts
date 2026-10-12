/**
 * #159の続き。企画運営の3点・法務の3点(重なる内容あり)に対応。
 * ①金剛峯寺・壇上伽藍の文が、既存の別のしおり「宿坊に泊まり精進料理と
 *   朝の勤行を体験する、高野山1泊2日修行の旅」(15c4b54a)とほぼ同じ
 *   だったため、一から書き直した。
 *   金剛峯寺: 空海の開創・名前の由来ではなく、豊臣秀吉が建てた青巌寺と
 *   興山寺が明治2年(1869)に合併して「金剛峯寺」になった経緯と、2000人分
 *   の食事を用意したという台所の話を中心にした(出典: WebSearchで複数確認)。
 *   壇上伽藍: 嵯峨天皇から賜った話ではなく、「三鈷の松」の伝説から始め、
 *   根本大塔だけでなく金堂・御影堂にも触れた。
 * ②最初の金剛峯寺に、高野山駅からバスでおよそ10分という道のりを追加。
 * ③昼食を90分→65分に短縮。
 * ④奥の院に、しのぶ一文と、御廟近くの撮影ルールの一文を追加。
 * ⑤座標2か所を法務指摘のOSM実点に修正:
 *   奥の院(n4874774415「奥之院」tourism=attraction)、
 *   昼食(高野山宿坊協会中央案内所 n1898351687)。
 *   奥の院の座標が一の橋から離れたため、昼食からの移動時間を21分に
 *   組み直し、滞在時間も再計算した(モデルコースの所要時間「約2時間」を
 *   移動+滞在の合計の目安とした)。
 *   空いた時間は、壇上伽藍(19ある堂塔のうち金堂・御影堂にも触れた分)・
 *   金剛峯寺の滞在をわずかに延ばして吸収した(新しい行き先は追加していない。
 *   大師教会はOSMに実点が見つからなかったため使わなかった)。
 *
 * 新しい時刻(09:30〜16:39、5か所):
 * 金剛峯寺09:30(85)→壇上伽藍11:00(100)→六時の鐘12:44(15)→
 * 昼食(門前町)13:03(65)→奥の院14:29(130)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-159d-4072c8d3.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "6d957fc9-237e-44e8-aa16-0c2ca9def561";
const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const kongobuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "金剛峯寺" } });
  const danjogaran = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "壇上伽藍" } });
  const rokuji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "六時の鐘" } });
  const lunch = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "門前町で昼食" } });
  const okunoin = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "奥の院" } });

  if (kongobuji.memo?.includes("青巌寺")) {
    console.log("already applied, skipping");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    {
      id: kongobuji.id,
      data: {
        stayDurationMin: 85,
        memo: "高野山駅からバスでおよそ10分、「金剛峯寺前」で降りると、高野山真言宗の総本山・金剛峯寺に着きます。もとは、豊臣秀吉が母の菩提を弔うために建てた青巌寺と、隣接する興山寺という、二つの寺がありましたが、明治2年(1869)にこの二寺が合併し、「金剛峯寺」という一つの寺の名前になりました。主殿の台所には、かつて一度に2000人分もの食事を用意したという大きな釜が残されており、総本山としての規模の大きさを物語っています。境内には、昭和59年(1984)に造園された、石庭としては国内有数の広さともいわれる「蟠龍庭」もあり、雲海の中で雌雄一対の龍が奥殿を守る姿が表現されています。今も祈りが続く聖地ですので、境内では静かに、敬意をもってお参りしましょう。参拝のあとは、歩いて壇上伽藍へ向かいましょう。",
      },
    },
    {
      id: danjogaran.id,
      data: {
        visitTime: T(11, 0),
        stayDurationMin: 100,
        memo: "金剛峯寺から歩いて5分ほど、次に訪れるのは壇上伽藍です。唐に渡っていた空海が、密教を広めるにふさわしい地に届くようにと、三鈷杵という法具を日本に向けて投げたところ、一本の松の枝にかかっていたと伝えられ、その松は「三鈷の松」として、今も大切にされています。この地こそがふさわしいと悟った空海は、弘仁7年(816)、嵯峨天皇から高野山を賜り、真言密教の根本道場として、壇上伽藍の整備を始めました。中心となる金堂は、高野山の年中行事の中心となる重要な堂で、隣の御影堂には空海の肖像が納められています。シンボルとされる根本大塔と西塔は、空海が金剛界・胎蔵界の両部曼荼羅に見立てたことから、壇上伽藍は「立体曼荼羅」とも呼ばれています。今も祈りが続く聖地ですので、境内では静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて六時の鐘へ向かいましょう。",
      },
    },
    {
      id: rokuji.id,
      data: { visitTime: T(12, 44) },
    },
    {
      id: lunch.id,
      data: {
        lat: 34.2132647,
        lng: 135.5865098,
        visitTime: T(13, 3),
        stayDurationMin: 65,
        memo: lunch.memo?.replace("ゆっくりと味わいましょう。", "味わいましょう。"),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      id: okunoin.id,
      data: {
        lat: 34.2173428,
        lng: 135.6038296,
        visitTime: T(14, 29),
        stayDurationMin: 130,
        memo: "門前町から歩いておよそ21分、高野山の旅の最後に訪れるのは奥の院です。今も弘法大師空海が禅定を続けていると信じられている霊域で、一の橋から御廟まで、およそ2kmの参道が続いています。参道の両側には、樹齢数百年の杉木立とともに、織田信長や武田信玄、伊達政宗など、戦国武将をはじめとする20万基を超える墓石や供養塔が並んでいます。参道の奥に進むと、御廟の手前に燈籠堂があり、堂内には多くの燈籠が納められています。多くの人が眠る場所ですので、静かに、敬意をもって歩きましょう。御廟のまわりでは写真を撮らないなど、現地の決まりに従いましょう。見学を終えたら、バスで高野山駅方面へ戻り、帰りましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
      },
    },
  ]);

  console.log("#159続き: 金剛峯寺・壇上伽藍を書き直し、座標2か所を修正、昼食を短縮、奥の院に一文を追加。09:30〜16:39に組み直し");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
