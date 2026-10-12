/**
 * #146 0fe4fa73(六甲山の夜景と有馬温泉、神戸の絶景と湯めぐり1泊2日)
 * の直し。もとはDay1が六甲山天覧台の1か所(16:00〜17:30)、Day2が有馬
 * 温泉の1か所(10:00〜11:30)のみで両日とも4か所未満、終始案内役の話し方
 * (皆様・ご案内するのは等)。
 *
 * 六甲山・有馬温泉のスポットを使う既存の公開しおりは見当たらなかった
 * ため、重複の心配なく実在の見どころで組み立てた。
 *
 * Day1: 六甲ケーブル山上駅(新規、昭和7年/1932開業・平成11年/1999の
 * 3代目車両)→六甲山牧場(新規)→六甲高山植物園(新規)→六甲ガーデン
 * テラス(新規、昼食)→六甲山天覧台(既存、夜景。案内役の話し方のみ
 * 直し、終了17:30は夜景という性質上、日没後まで待つ必要がある最終便
 * 的な例外として残した)。
 *
 * Day2: 湯泉神社(既存の「有馬温泉」を改めた。開湯伝説・延喜式神名帳)
 * →太閤の湯殿館(新規、豊臣秀吉の湯山御殿跡・岩風呂蒸し風呂の遺構)→
 * 銀の湯(新規、銀泉の外湯)→瑞宝寺公園(新規、紅葉の名所・秀吉の
 * 「日暮らしの庭」)→金の湯(新規、金泉の外湯、昼食は瑞宝寺公園で)。
 *
 * 出典: tabi-mag.jp/hg系(六甲ケーブル・太閤の湯殿館・瑞宝寺公園)、
 * serai.jp(太閤の湯殿館の発掘経緯)、koyo.walkerplus.com(瑞宝寺公園の
 * 紅葉)、各種(湯泉神社の開湯伝説・延喜式神名帳)。座標はOSM。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "六甲ケーブルや牧場、植物園を巡って「日本三大夜景」の一つ・六甲山の夜景を楽しみ、翌日は「日本三古泉」の一つ・有馬温泉で金泉と銀泉の湯めぐりを満喫する1泊2日プランです。";

const CABLE_MEMO =
  "神戸市内から六甲ケーブル下駅へ移動し、ケーブルカーで六甲ケーブル山上駅に着きます。昭和7年(1932)に開業した、歴史あるケーブルカーです。平成11年(1999)に登場した3代目の車両は、欧州風のクラシックタイプと、明治末の路面電車をイメージしたレトロタイプの2種類があり、どちらも床や座席に天然木を使い、天井をガラス張りにした展望車がつながれています。山麓から山上まで、レトロな車両に揺られながら上ってみましょう。この後は、バスでおよそ10分、六甲山牧場へ向かいましょう。";

const BOKUJO_MEMO =
  "六甲ケーブル山上駅からバスでおよそ10分、六甲山牧場に着きます。六甲山の広々とした自然の中に広がる牧場で、羊やヤギ、牛たちが草を食む姿を見られます。乳搾りやバター作り、乗馬など、牧場らしい体験も楽しめます。牧場で育まれた食材を使った料理も味わえます。この後は、バスでおよそ15分、六甲高山植物園へ向かいましょう。";

const SHOKUBUTSUEN_MEMO =
  "六甲山牧場からバスでおよそ15分、六甲高山植物園に着きます。六甲山に自生する植物や、世界各地の高山に咲く植物など、およそ1500種を集めた植物園です。四季折々の花々や、季節ごとに変わる山の自然の表情を楽しめます。この後は、歩いておよそ5分、六甲ガーデンテラスへ向かいましょう。";

const GARDEN_TERRACE_MEMO =
  "六甲高山植物園から歩いておよそ5分、六甲ガーデンテラスに着きます。食事処やお土産店が並ぶ、山上の休憩スポットです。ここで昼食をとりましょう。デッキからは、大阪湾や神戸の市街地を見渡せます。日が暮れるまで、ゆっくりと山上の時間を過ごしましょう。この後は、バスでおよそ20分、六甲山天覧台へ向かいましょう。";

const TENRANDAI_MEMO =
  "六甲ガーデンテラスからバスでおよそ20分、六甲山天覧台に着きます。標高931mの六甲山の山上に広がる展望スポットで、大阪から神戸にかけての市街地や大阪湾を一望する眺めが魅力です。昭和28年(1953)、関西電力の副社長がコラムの中で、この一帯の1か月分の電気代をドルに換算すると100万ドルになると紹介したのがきっかけとなり、当初は「100万ドルの夜景」と呼ばれるようになりました。その後、物価の変動などを経て、今では「1000万ドルの夜景」とも呼ばれています。夕暮れとともに街の灯りがともり始める時間帯は、昼間とはまた違った景色の変化を楽しめます。日が沈み、街が光の海へと変わっていく様子を、ゆっくりと眺めましょう。見学を終えたら、今夜の宿がある有馬温泉へ向かいましょう。";

const YUSEN_MEMO =
  "有馬温泉の宿を出て、湯泉神社に着きます。有馬を最初に見つけたと伝わる大己貴命・少彦名命をまつる古社です。延喜式神名帳(927年に整えられた神社の名簿)にもその名が記される、歴史ある神社です。3羽の傷ついたカラスが水たまりで水を浴びているのを見て、その水が温泉だと見つけたという開湯伝説が伝わります。参道や本殿のそばのモミジは、紅葉の時期には美しく色づきます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、太閤の湯殿館へ向かいましょう。";

const TAIKOU_MEMO =
  "湯泉神社から歩いてすぐ、太閤の湯殿館に着きます。豊臣秀吉が築いたとされる湯山御殿の跡に立つ資料館です。御殿は徳川の時代に取り壊されて埋められ、その上に建てられた極楽寺が、平成7年(1995)の阪神・淡路大震災で傷んだ際の修復工事で、岩風呂や蒸し風呂の遺構が見つかりました。竹の管で温泉の蒸気を床下に取り込む、半地下式の蒸し風呂の遺構を間近に見られます。出土した茶器や瓦なども展示されています。この後は、歩いてすぐ、銀の湯へ向かいましょう。";

const GINNOYU_MEMO =
  "太閤の湯殿館から歩いてすぐ、銀の湯に着きます。無色透明で、炭酸やラドンを含む「銀泉」を使った外湯です。有馬温泉には、鉄分や塩分を含み赤褐色に変わる「金泉」と、この銀泉の二種類の湯があります。金泉とはまた違う、さらりとした湯あたりを楽しみましょう。ほかの入浴客を撮らないようにしましょう。この後は、歩いておよそ10分、瑞宝寺公園へ向かいましょう。";

const ZUIHOJI_MEMO =
  "銀の湯から歩いておよそ10分、瑞宝寺公園に着きます。明治6年(1873)に廃寺となった瑞宝寺の跡を公園にしたもので、有馬温泉でも指折りの紅葉の名所として知られています。秋にはおよそ2500本のカエデが色づき、豊臣秀吉が「いくら見ていても飽きない」と賞賛したと伝わる庭は「日暮らしの庭」と呼ばれています。このあたりの食事処で昼食をとりましょう。紅葉の季節でなくても、山あいの静かな庭園の雰囲気を楽しめます。この後は、歩いておよそ12分、金の湯へ向かいましょう。";

const KINNOYU_MEMO =
  "瑞宝寺公園から歩いておよそ12分、金の湯に着きます。有馬温泉街の中心にある外湯で、鉄分や塩分を多く含み、空気に触れると赤褐色に変わる「金泉」を使っています。昨日の六甲山の夜景、今日の神社やお寺、公園めぐりの疲れを、名物の金泉でゆっくりと癒やしましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。湯上がりは、有馬の温泉街で外湯めぐりや射的、温泉まんじゅうの食べ歩きなど、思い思いに湯の町の風情を楽しみましょう。";

async function main() {
  const itinId = "0fe4fa73-3422-47d8-a8ac-42ea5872ab22";
  const day1Id = "0f24a14c-4581-47de-829c-38e975d61024";
  const day2Id = "e9833151-5ee3-45a8-b7b1-59c8bc196ddb";
  const tenrandaiId = "344e459e-2f68-4fba-8713-6f6aca03d733";
  const arimaId = "372984f0-0f0d-494b-926e-0d5dd4500677"; // 湯泉神社に改める

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });

    const day1: SpotOrderItem[] = [
      {
        create: {
          name: "六甲ケーブル山上駅", lat: 34.7521126, lng: 135.2366104,
          visitTime: t(9, 30), stayDurationMin: 20, memo: CABLE_MEMO,
        },
      },
      {
        create: {
          name: "六甲山牧場", lat: 34.7500422, lng: 135.2082377,
          visitTime: t(10, 0), stayDurationMin: 90, memo: BOKUJO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "六甲高山植物園", lat: 34.7623692, lng: 135.2417271,
          visitTime: t(11, 45), stayDurationMin: 60, memo: SHOKUBUTSUEN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 15 }] },
        },
      },
      {
        create: {
          name: "六甲ガーデンテラス", lat: 34.7636161, lng: 135.2459899,
          visitTime: t(12, 50), stayDurationMin: 170, memo: GARDEN_TERRACE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        id: tenrandaiId,
        data: {
          visitTime: t(16, 0), stayDurationMin: 90, memo: TENRANDAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 20 }] },
        },
      },
    ];
    await setDaySpotOrder(day1Id, day1, { tx });

    const day2: SpotOrderItem[] = [
      {
        id: arimaId,
        data: {
          name: "湯泉神社", lat: 34.7950583, lng: 135.2486723,
          visitTime: t(9, 0), stayDurationMin: 40, memo: YUSEN_MEMO,
        },
      },
      {
        create: {
          name: "太閤の湯殿館", lat: 34.7956267, lng: 135.2485825,
          visitTime: t(9, 41), stayDurationMin: 60, memo: TAIKOU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        create: {
          name: "銀の湯", lat: 34.7955148, lng: 135.2490200,
          visitTime: t(10, 42), stayDurationMin: 90, memo: GINNOYU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        create: {
          name: "瑞宝寺公園", lat: 34.7941315, lng: 135.2567610,
          visitTime: t(12, 22), stayDurationMin: 110, memo: ZUIHOJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "金の湯", lat: 34.7967856, lng: 135.2479332,
          visitTime: t(14, 24), stayDurationMin: 140, memo: KINNOYU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
        },
      },
    ];
    await setDaySpotOrder(day2Id, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
