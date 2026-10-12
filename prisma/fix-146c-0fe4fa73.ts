/**
 * #146 0fe4fa73の直し(3回目)。企画運営からの指摘5点・法務からの指摘5点
 * をまとめて対応。
 *
 * 企画運営:
 * ①夜景: 9時〜17時の決まりは例外にせず、天覧台は16:30に出る形に。
 *   夜の眺めは「日没の早い季節は、夕暮れから街の明かりがともり始める
 *   様子が見られることもあります」というおまけの一文に。
 * ②滞在の長さ: ガーデンテラス170→70分(昼食込み)、外湯は銀の湯90→55分・
 *   金の湯140→55分、瑞宝寺公園110→30分に短縮。空いた時間で、Day1に
 *   記念碑台(新規、六甲山を開発した英国人アーサー・ヘスケス・グルーム
 *   の胸像)、Day2に温泉寺・念仏寺・有馬玩具博物館(いずれも新規)を追加。
 * ③昼食: Day2の昼食を瑞宝寺公園から「有馬の温泉街」という独立した
 *   スポットに差し替え。
 * ④六甲ケーブル下駅へのアクセス(阪急六甲駅から神戸市バス)を明記。
 * ⑤金の湯の「名物の金泉でゆっくりと癒やしましょう」を効能のように
 *   読めない事実だけの表現に修正。
 *
 * 法務:
 * ⑥説明文の「日本三大夜景」「日本三古泉」を同じ文でぼかし。
 * ⑦湯泉神社に付いていた誤った写真(ロープウェーから見た町並み、神社
 *   ではない)を削除。
 * ⑧銀の湯にも長湯・水分補給の一文を追加。
 * ⑨六甲山牧場に、動物にふれる際の係の人の案内・食べ物を与えない一文
 *   を追加。
 * ⑩座標2か所: 六甲ケーブル山上駅をn12282624109「六甲山上」
 *   (34.7519632,135.2368944)に、六甲山天覧台をn1259448039「天覧台」
 *   (34.7519508,135.2372189、山上駅のすぐそば)に修正。
 *
 * 出典: tabi-mag.jp/hg系(六甲山・有馬温泉各施設)、smtrc.jp/town-
 * archives(グルームと六甲山記念碑台)、museum.or.jp(有馬玩具博物館)、
 * 各種(温泉寺の行基・仁西の伝承、念仏寺の淀殿別荘・正徳2年本堂)。
 * 座標はOSM。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "六甲ケーブルや牧場、植物園を巡って「日本三大夜景」の一つとされる六甲山の夜景を楽しみ、翌日は「日本三古泉」の一つとされる有馬温泉で金泉と銀泉の湯めぐりを満喫する1泊2日プランです。";

const CABLE_MEMO =
  "阪急六甲駅から神戸市バスでおよそ15分、六甲ケーブル下駅へ行き、ケーブルカーでおよそ10分、六甲ケーブル山上駅に着きます。昭和7年(1932)に開業した、歴史あるケーブルカーです。平成11年(1999)に登場した3代目の車両は、欧州風のクラシックタイプと、明治末の路面電車をイメージしたレトロタイプの2種類があり、どちらも床や座席に天然木を使い、天井をガラス張りにした展望車がつながれています。山麓から山上まで、レトロな車両に揺られながら上ってみましょう。この後は、歩いておよそ10分、記念碑台へ向かいましょう。";

const KINENHIDAI_MEMO =
  "六甲ケーブル山上駅から歩いておよそ10分、記念碑台に着きます。六甲山の開発に力を尽くした、英国人貿易商アーサー・ヘスケス・グルームの胸像が立つ場所です。明治28年(1895)、三国池のそばに別荘を構えたグルームは、私費で登山道や植林を整え、明治36年(1903)には日本で初めてのゴルフ場を開きました。こうした功績から「六甲山の父」と呼ばれています。六甲山ビジターセンターも併設されているので、山の自然についての展示もあわせて見てみましょう。この後は、バスでおよそ10分、六甲山牧場へ向かいましょう。";

const BOKUJO_MEMO =
  "記念碑台からバスでおよそ10分、六甲山牧場に着きます。六甲山の広々とした自然の中に広がる牧場で、羊やヤギ、牛たちが草を食む姿を見られます。乳搾りやバター作りなどの体験も楽しめます。動物にふれるときは係の人の案内に従い、勝手に食べ物を与えないようにしましょう。牧場で育まれた食材を使った料理も味わえます。この後は、バスでおよそ15分、六甲高山植物園へ向かいましょう。";

const SHOKUBUTSUEN_MEMO =
  "六甲山牧場からバスでおよそ15分、六甲高山植物園に着きます。六甲山に自生する植物や、世界各地の高山に咲く植物など、およそ1500種を集めた植物園です。四季折々の花々や、季節ごとに変わる山の自然の表情を楽しめます。この後は、歩いておよそ5分、六甲ガーデンテラスへ向かいましょう。";

const GARDEN_TERRACE_MEMO =
  "六甲高山植物園から歩いておよそ5分、六甲ガーデンテラスに着きます。食事処やお土産店が並ぶ、山上の休憩スポットです。ここで昼食をとりましょう。デッキからは、大阪湾や神戸の市街地を見渡せます。この後は、バスでおよそ15分、六甲山天覧台へ向かいましょう。";

const TENRANDAI_MEMO =
  "六甲ガーデンテラスからバスでおよそ15分、六甲山天覧台に着きます。標高931mの六甲山の山上に広がる展望スポットで、六甲ケーブル山上駅のすぐそばにあります。大阪から神戸にかけての市街地や大阪湾を一望する眺めが魅力です。昭和28年(1953)、関西電力の副社長がコラムの中で、この一帯の1か月分の電気代をドルに換算すると100万ドルになると紹介したのがきっかけとなり、当初は「100万ドルの夜景」と呼ばれるようになりました。その後、物価の変動などを経て、今では「1000万ドルの夜景」とも呼ばれています。日没の早い季節は、夕暮れから街の明かりがともり始める様子が見られることもあります。夜景を見るなら、日没の時刻を確かめてから訪れるとよいでしょう。見学を終えたら、今夜の宿がある有馬温泉へ向かいましょう。";

const YUSEN_MEMO =
  "有馬温泉の宿を出て、湯泉神社に着きます。有馬を最初に見つけたと伝わる大己貴命・少彦名命をまつる古社です。延喜式神名帳(927年に整えられた神社の名簿)にもその名が記される、歴史ある神社です。3羽の傷ついたカラスが水たまりで水を浴びているのを見て、その水が温泉だと見つけたという開湯伝説が伝わります。参道や本殿のそばのモミジは、紅葉の時期には美しく色づきます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、太閤の湯殿館へ向かいましょう。";

const ONSENJI_MEMO =
  "太閤の湯殿館から歩いてすぐ、温泉寺に着きます。神亀元年(724)、僧・行基が薬師如来のお告げを受けて開いたと伝わる寺院です。平安時代末期、有馬の地を襲った大洪水で温泉が荒れた際には、僧・仁西がこの地を訪れて温泉を復興し、12の宿を営んで今の温泉街の基礎を整えたと伝えられています。毎年1月2日には、行基と仁西の木像を温泉で清める「入初式」が行われています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、念仏寺へ向かいましょう。";

const NENBUTSUJI_MEMO =
  "温泉寺から歩いてすぐ、念仏寺に着きます。豊臣秀吉の妻・淀殿の別荘だったとも伝わる、高台にあるお寺です。天文7年(1538)に創建され、慶長年間(1596〜1615)ごろに今の場所へ移ったと伝えられています。正徳2年(1712)に建てられた本堂は、有馬温泉に残る建物の中でも、もっとも古いとされています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ2分、有馬の温泉街へ向かいましょう。";

const ONSENGAI_MEMO =
  "念仏寺から歩いておよそ2分、有馬の温泉街に着きます。坂道の両側に旅館や土産物店、食事処が並ぶ、湯の町らしい通りです。ここで昼食をとりましょう。食事を終えたら、通りを少し歩いて、湯の町の風情を感じてみましょう。この後は、歩いておよそ3分、銀の湯へ向かいましょう。";

const GINNOYU_MEMO =
  "有馬の温泉街から歩いておよそ3分、銀の湯に着きます。無色透明で、炭酸やラドンを含む「銀泉」を使った外湯です。有馬温泉には、鉄分や塩分を含み赤褐色に変わる「金泉」と、この銀泉の二種類の湯があります。金泉とはまた違う、さらりとした湯あたりを楽しみましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。この後は、歩いておよそ10分、瑞宝寺公園へ向かいましょう。";

const ZUIHOJI_MEMO =
  "銀の湯から歩いておよそ10分、瑞宝寺公園に着きます。明治6年(1873)に廃寺となった瑞宝寺の跡を公園にしたもので、有馬温泉でも指折りの紅葉の名所として知られています。秋にはおよそ2500本のカエデが色づき、豊臣秀吉が「いくら見ていても飽きない」と賞賛したと伝わる庭は「日暮らしの庭」と呼ばれています。紅葉の季節でなくても、山あいの静かな庭園の雰囲気を楽しめます。この後は、歩いておよそ12分、金の湯へ向かいましょう。";

const KINNOYU_MEMO =
  "瑞宝寺公園から歩いておよそ12分、金の湯に着きます。有馬温泉街の中心にある外湯で、鉄分や塩分を多く含み、空気に触れると赤褐色に変わる「金泉」の湯につかりましょう。ほかの入浴客を撮らないようにしましょう。長湯は避けて、水分をとりながら入りましょう。この後は、歩いてすぐ、有馬玩具博物館へ向かいましょう。";

const OMOCHA_MEMO =
  "金の湯から歩いてすぐ、有馬玩具博物館に着きます。平成15年(2003)に開館した、4階建ての玩具博物館です。チェコやドイツの伝統的な木製のミニチュアから、現代のおもちゃ、からくり仕掛けのおもちゃ、鉄道模型やブリキのおもちゃまで、幅広いコレクションが並びます。童心に返って、懐かしいおもちゃや珍しいおもちゃを眺めてみましょう。見学を終えたら、有馬温泉街を歩いて、帰りの神戸電鉄有馬温泉駅へ向かいましょう。";

async function main() {
  const itinId = "0fe4fa73-3422-47d8-a8ac-42ea5872ab22";
  const day1Id = "0f24a14c-4581-47de-829c-38e975d61024";
  const day2Id = "e9833151-5ee3-45a8-b7b1-59c8bc196ddb";

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });

    const day1spots = await tx.spot.findMany({ where: { dayId: day1Id } });
    const cable = day1spots.find((s) => s.name === "六甲ケーブル山上駅")!;
    const bokujo = day1spots.find((s) => s.name === "六甲山牧場")!;
    const shokubutsuen = day1spots.find((s) => s.name === "六甲高山植物園")!;
    const terrace = day1spots.find((s) => s.name === "六甲ガーデンテラス")!;
    const tenrandai = day1spots.find((s) => s.name === "六甲山天覧台")!;

    const day1: SpotOrderItem[] = [
      {
        id: cable.id,
        data: {
          lat: 34.7519632, lng: 135.2368944,
          visitTime: t(9, 30), stayDurationMin: 20, memo: CABLE_MEMO,
        },
      },
      {
        create: {
          name: "記念碑台", lat: 34.7564376, lng: 135.2301181,
          visitTime: t(9, 50), stayDurationMin: 30, memo: KINENHIDAI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        id: bokujo.id,
        data: {
          visitTime: t(10, 20), stayDurationMin: 90, memo: BOKUJO_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 10 }] },
        },
      },
      {
        id: shokubutsuen.id,
        data: { visitTime: t(11, 50), stayDurationMin: 60, memo: SHOKUBUTSUEN_MEMO },
      },
      {
        id: terrace.id,
        data: { visitTime: t(12, 55), stayDurationMin: 70, memo: GARDEN_TERRACE_MEMO },
      },
      {
        id: tenrandai.id,
        data: {
          lat: 34.7519508, lng: 135.2372189,
          visitTime: t(14, 20), stayDurationMin: 130, memo: TENRANDAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 15 }] },
        },
      },
    ];
    await setDaySpotOrder(day1Id, day1, { tx });

    const day2spots = await tx.spot.findMany({ where: { dayId: day2Id } });
    const yusen = day2spots.find((s) => s.name === "湯泉神社")!;
    const taikou = day2spots.find((s) => s.name === "太閤の湯殿館")!;
    const ginnoyu = day2spots.find((s) => s.name === "銀の湯")!;
    const zuihoji = day2spots.find((s) => s.name === "瑞宝寺公園")!;
    const kinnoyu = day2spots.find((s) => s.name === "金の湯")!;

    await tx.photo.deleteMany({ where: { spotId: yusen.id } });

    const day2: SpotOrderItem[] = [
      { id: yusen.id, data: { memo: YUSEN_MEMO } },
      { id: taikou.id, data: {} },
      {
        create: {
          name: "温泉寺", lat: 34.7958197, lng: 135.2482248,
          visitTime: t(10, 42), stayDurationMin: 50, memo: ONSENJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        create: {
          name: "念仏寺", lat: 34.7960640, lng: 135.2486232,
          visitTime: t(11, 33), stayDurationMin: 40, memo: NENBUTSUJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        create: {
          name: "有馬の温泉街", lat: 34.7953000, lng: 135.2492000,
          visitTime: t(12, 15), stayDurationMin: 60, memo: ONSENGAI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        id: ginnoyu.id,
        data: {
          visitTime: t(13, 18), stayDurationMin: 55, memo: GINNOYU_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        id: zuihoji.id,
        data: { visitTime: t(14, 23), stayDurationMin: 30, memo: ZUIHOJI_MEMO },
      },
      {
        id: kinnoyu.id,
        data: {
          visitTime: t(15, 5), stayDurationMin: 55, memo: KINNOYU_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
        },
      },
      {
        create: {
          name: "有馬玩具博物館", lat: 34.7970661, lng: 135.2479085,
          visitTime: t(16, 1), stayDurationMin: 50, memo: OMOCHA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
    ];
    await setDaySpotOrder(day2Id, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
