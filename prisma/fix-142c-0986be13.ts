/**
 * #142 0986be13の直し(4回目)。企画運営・法務からの指摘にまとめて対応。
 *
 * 企画運営:
 * ①昼食(白銀の滝 10:40〜11:40)が11:30より早い→昼食の一文を延沢銀山遺跡
 *   (11:42〜12:27、11:30〜13:30の枠に収まる)に移す
 * ②最上川舟役所跡の85分は跡地としては長すぎる→30分に短縮し、空いた
 *   時間に大石田の乗船寺(慶長元年/1596創建、県指定文化財の千手観音像。
 *   371e874bのDay2にも登場するが、本案は子規の句碑・茂吉の墓(371e874b
 *   が使っていそうな有名な事実)ではなく創建年・観音像のみで執筆)を追加
 * ③車の説明がなかった→銀山温泉街の書き出しに「大石田駅から車で
 *   およそ30分、車は温泉街入り口の駐車場に置く」ことを追加し、十分一
 *   番所跡で「朝に置いた駐車場に戻る」と明確化
 *
 * 法務:
 * ④徳良湖「池を一周する遊歩道が整備されているので、のんびりと歩いて
 *   みましょう」が371e874bの「湖を一周する遊歩道が…」と1字違い→言い換え
 * ⑤事実の食い違い2件を確認(museum.or.jp/museum/1094・tabi-mag.jp/yg0240/
 *   で確認): 芭蕉・清風歴史資料館は「鈴木清風の屋敷を復元」ではなく、
 *   実際は「旧丸屋・鈴木弥兵衛の店舗と母屋を清風宅の隣に移転復元」した
 *   建物という371e874bの記載が正しかったため、本案を訂正。徳良湖の
 *   完成年「大正10年(1921)」はtabi-mag.jp/yg0240/の原文「大正10年5月27日
 *   に完成」と一致しており、本案が正しく371e874bの「1920年」が誤り
 *   (企画運営に別途報告)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MACHI_MEMO =
  "大石田駅から車でおよそ30分、銀山温泉街に着きます。車は、温泉街入り口の駐車場に置きましょう。江戸時代初期に栄えた延沢銀山の名前にちなんで名付けられたこの温泉地には、大正から昭和初期にかけて建てられた、洋風の意匠を取り入れた木造多層の旅館が、銀山川の両岸に軒を連ねています。窓辺の手すりや外壁の装飾には、当時の職人たちのこだわりが今も息づいており、まるで大正時代にタイムスリップしたかのような、ノスタルジックな町並みが広がります。カメラを片手に、レトロな旅館の建ち並ぶ通りをゆっくりと歩いて楽しみましょう。冬の夕方以降は、混雑を防ぐため、日帰りの人の立ち入りが予約制になる時期があります。お出かけ前に、尾花沢市や銀山温泉の公式の案内で確かめましょう。この後は、歩いてすぐ、和楽足湯へ向かいましょう。";

const TAKI_MEMO =
  "和楽足湯から歩いておよそ4分、白銀の滝に着きます。川の上流にある落差22メートルの滝で、大小2筋の水流が織りなす、迫力ある姿が魅力です。滝つぼの近くは足もとが悪いので、転ばないように注意しましょう。この後は、歩いておよそ2分、延沢銀山遺跡へ向かいましょう。";

const GINZAN_MEMO =
  "白銀の滝から歩いておよそ2分、延沢銀山遺跡に着きます。国の史跡に指定されている鉱山跡です。戦国時代末期、この地を治めた延沢城主・延澤満定が開発したと考えられており、寛永11年(1634)には江戸幕府の直轄となりました。寛永8年(1631)ごろから翌年にかけてが最盛期で、銀山町の人口はおよそ1万5千人を数えるほどにぎわいましたが、元禄2年(1689)の大崩落により、坑道に水が入り込み、閉山に至りました。このあたりには食事処もあるので、昼食をとりましょう。かつての賑わいに思いをめぐらせながら、静かに見学しましょう。この後は、歩いておよそ20分、十分一番所跡へ向かいましょう。";

const JUUBU_MEMO =
  "延沢銀山遺跡から歩いておよそ20分、十分一番所跡に着きます。江戸時代、延沢方面との間を行き来する荷物に目を光らせ、代金の十分の一を税として取り立てていたという番所の跡地です。かつての賑わいを物語る、小さな史跡です。朝に車を置いた温泉街入り口の駐車場に戻り、そこから車に乗りましょう。この後は、車でおよそ12分、徳良湖へ向かいましょう。";

const TOKURAKO_MEMO =
  "十分一番所跡から車でおよそ12分、徳良湖に着きます。大正10年(1921)に完成した、灌漑用のため池です。周囲およそ2.7kmのこの池は、今も尾花沢の120ヘクタールの水田を潤す、現役のため池として使われています。農林水産省の「ため池百選」にも選ばれました。湖畔の道を歩きながら、水面に映る周囲の山々を眺めてみましょう。この後は、車でおよそ6分、芭蕉・清風歴史資料館へ向かいましょう。";

const BASHO_MEMO =
  "徳良湖から車でおよそ6分、芭蕉・清風歴史資料館に着きます。旧丸屋・鈴木弥兵衛の店舗と母屋を、清風の屋敷の隣に移築復元した建物です。清風は、最上地方の特産品だった紅花の取引で栄えた豪商で、俳諧もたしなんでいました。「おくのほそ道」の旅で尾花沢を訪れた松尾芭蕉は、旧知であった清風のもとに10日ほど滞在したと伝えられています。紅花交易で栄えた商人の暮らしぶりに、思いをめぐらせてみましょう。この後は、車でおよそ7分、最上川舟役所跡へ向かいましょう。";

const FUNAYAKUSHO_MEMO =
  "芭蕉・清風歴史資料館から車でおよそ7分、最上川舟役所跡に着きます。江戸時代、最上川の舟運で栄えた大石田河岸にあった、年貢米などの運上を取り扱った役所の跡地です。周辺には、舟運でにぎわった往時をしのばせる町並みが残っています。大石田の歴史をたどりながら、河岸の界隈を少し歩いてみましょう。この後は、歩いておよそ4分、乗船寺へ向かいましょう。";

const JOSENJI_MEMO =
  "最上川舟役所跡から歩いておよそ4分、乗船寺に着きます。慶長元年(1596)に創建された、歴史あるお寺です。本堂には、山形県の文化財に指定されている千手観音像が納められています。最上川の舟運でにぎわった大石田とともに歩んできたお寺です。静かに、敬意をもって見学しましょう。見学を終えたら、歩いておよそ10分、大石田駅へ向かい、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0986be13%'`);
  const itinId = rows[0].id;
  const machi = await findSpotInItinerary(itinId, { spotName: "銀山温泉街" });
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "和楽足湯" });
  const taki = await findSpotInItinerary(itinId, { spotName: "白銀の滝" });
  const ginzan = await findSpotInItinerary(itinId, { spotName: "延沢銀山遺跡" });
  const juubu = await findSpotInItinerary(itinId, { spotName: "十分一番所跡" });
  const tokurako = await findSpotInItinerary(itinId, { spotName: "徳良湖" });
  const basho = await findSpotInItinerary(itinId, { spotName: "芭蕉・清風歴史資料館" });
  const funayakusho = await findSpotInItinerary(itinId, { spotName: "最上川舟役所跡" });

  console.log("dayId:", machi.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1: SpotOrderItem[] = [
    { id: machi.id, data: { memo: MACHI_MEMO } },
    { id: ashiyu.id, data: {} },
    { id: taki.id, data: { memo: TAKI_MEMO } },
    { id: ginzan.id, data: { memo: GINZAN_MEMO } },
    { id: juubu.id, data: { memo: JUUBU_MEMO } },
    { id: tokurako.id, data: { memo: TOKURAKO_MEMO } },
    { id: basho.id, data: { memo: BASHO_MEMO } },
    {
      id: funayakusho.id,
      data: { stayDurationMin: 30, memo: FUNAYAKUSHO_MEMO },
    },
    {
      create: {
        name: "乗船寺", lat: 38.5886433, lng: 140.3756281, visitTime: t(15, 41), stayDurationMin: 55, memo: JOSENJI_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
  ];
  await setDaySpotOrder(machi.dayId, day1);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
