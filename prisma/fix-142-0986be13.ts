/**
 * #142 0986be13の直し(3回目。企画運営・法務からの2件のフィードバックを
 * まとめて対応)。
 *
 * 企画運営: fix-140(誤記、実際は#142)で作った5か所の滞在時間が長すぎる
 * (温泉街155分・滝80分・遺跡80分・番所跡70分)。「小さな村で行き先が
 * 少ない」は例外にならないため、尾花沢市街まで足を延ばし、371e874b
 * (銀山温泉じっくり1泊2日)が使っていない徳良湖・芭蕉清風歴史資料館・
 * 最上川舟役所跡を、同じ場所でも別の事実・切り口で追加。
 *   - 徳良湖: 371e874bは1919年着工・3万人の作業・花笠音頭の起源・桜の
 *     本数を書いている。本案は tabi-mag.jp/yg0240/ で確認した「大正10年
 *     (1921)完成・周囲2.7km・現役の灌漑池として尾花沢の120haを灌漑」の
 *     事実のみを使用
 *   - 芭蕉・清風歴史資料館: 371e874bは建物の復元・芭蕉の滞在そのものを
 *     書いている。本案は鈴木清風自身の経歴(紅花商人)・芭蕉との10日間の
 *     親交を中心に執筆
 *   - 最上川舟役所跡: 371e874bのDay2にも登場するが、本案は舟運における
 *     年貢米の運上という役所の機能を中心に執筆(371e874bのDay2の実際の
 *     文言は未確認のため、法務に確認を依頼)
 *
 * 法務: 和楽足湯・白銀の滝・延沢銀山遺跡・十分一番所跡の一部の文が
 * 371e874bと表現が近すぎるため書き直し。座標4件を修正(銀山温泉街・
 * 延沢銀山遺跡は別の点、和楽足湯・十分一番所跡は同じ点のより精密な
 * 座標)。和楽足湯に「ほかの人を写さないようにしましょう」を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MACHI_MEMO =
  "銀山温泉街に着きます。江戸時代初期に栄えた延沢銀山の名前にちなんで名付けられたこの温泉地には、大正から昭和初期にかけて建てられた、洋風の意匠を取り入れた木造多層の旅館が、銀山川の両岸に軒を連ねています。窓辺の手すりや外壁の装飾には、当時の職人たちのこだわりが今も息づいており、まるで大正時代にタイムスリップしたかのような、ノスタルジックな町並みが広がります。カメラを片手に、レトロな旅館の建ち並ぶ通りをゆっくりと歩いて楽しみましょう。冬の夕方以降は、混雑を防ぐため、日帰りの人の立ち入りが予約制になる時期があります。お出かけ前に、尾花沢市や銀山温泉の公式の案内で確かめましょう。この後は、歩いてすぐ、和楽足湯へ向かいましょう。";

const ASHIYU_MEMO =
  "銀山温泉街から歩いてすぐ、和楽足湯に着きます。銀山川沿いにある足湯で、温泉そのものの湯を引いているため、少し熱めです。歩き疲れた足を、ここでひと休みさせましょう。ほかの人を写さないようにしましょう。この後は、歩いておよそ4分、白銀の滝へ向かいましょう。";

const TAKI_MEMO =
  "和楽足湯から歩いておよそ4分、白銀の滝に着きます。川の上流にある落差22メートルの滝で、大小2筋の水流が織りなす、迫力ある姿が魅力です。滝つぼの近くは足もとが悪いので、転ばないように注意しましょう。このあたりには食事処もあるので、昼食をとりましょう。この後は、歩いておよそ2分、延沢銀山遺跡へ向かいましょう。";

const GINZAN_MEMO =
  "白銀の滝から歩いておよそ2分、延沢銀山遺跡に着きます。国の史跡に指定されている鉱山跡です。戦国時代末期、この地を治めた延沢城主・延澤満定が開発したと考えられており、寛永11年(1634)には江戸幕府の直轄となりました。寛永8年(1631)ごろから翌年にかけてが最盛期で、銀山町の人口はおよそ1万5千人を数えるほどにぎわいましたが、元禄2年(1689)の大崩落により、坑道に水が入り込み、閉山に至りました。かつての賑わいに思いをめぐらせながら、静かに見学しましょう。この後は、歩いておよそ20分、十分一番所跡へ向かいましょう。";

const JUUBU_MEMO =
  "延沢銀山遺跡から歩いておよそ20分、十分一番所跡に着きます。江戸時代、延沢方面との間を行き来する荷物に目を光らせ、代金の十分の一を税として取り立てていたという番所の跡地です。かつての賑わいを物語る、小さな史跡です。この後は、車でおよそ12分、徳良湖へ向かいましょう。";

const TOKURAKO_MEMO =
  "十分一番所跡から車でおよそ12分、徳良湖に着きます。大正10年(1921)に完成した、灌漑用のため池です。周囲およそ2.7kmのこの池は、今も尾花沢の120ヘクタールの水田を潤す、現役のため池として使われています。農林水産省の「ため池百選」にも選ばれました。池を一周する遊歩道が整備されているので、のんびりと歩いてみましょう。この後は、車でおよそ6分、芭蕉・清風歴史資料館へ向かいましょう。";

const BASHO_MEMO =
  "徳良湖から車でおよそ6分、芭蕉・清風歴史資料館に着きます。江戸時代の豪商・鈴木清風(1651〜1721)の屋敷を復元した建物です。清風は、最上地方の特産品だった紅花の取引で栄えた商人で、俳諧もたしなんでいました。「おくのほそ道」の旅で尾花沢を訪れた松尾芭蕉は、旧知であった清風のもとに10日ほど滞在したと伝えられています。紅花交易で栄えた商人の暮らしぶりに、思いをめぐらせてみましょう。この後は、車でおよそ7分、最上川舟役所跡へ向かいましょう。";

const FUNAYAKUSHO_MEMO =
  "芭蕉・清風歴史資料館から車でおよそ7分、最上川舟役所跡に着きます。江戸時代、最上川の舟運で栄えた大石田河岸にあった、年貢米などの運上を取り扱った役所の跡地です。周辺には、舟運でにぎわった往時をしのばせる町並みが残っています。大石田の歴史をたどりながら、河岸の界隈をゆっくりと歩いてみましょう。見学を終えたら、車でおよそ5分、大石田駅へ向かい、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0986be13%'`);
  const itinId = rows[0].id;
  const machi = await findSpotInItinerary(itinId, { spotName: "銀山温泉街" });
  const ashiyu = await findSpotInItinerary(itinId, { spotName: "和楽足湯" });
  const taki = await findSpotInItinerary(itinId, { spotName: "白銀の滝" });
  const ginzan = await findSpotInItinerary(itinId, { spotName: "延沢銀山遺跡" });
  const juubu = await findSpotInItinerary(itinId, { spotName: "十分一番所跡" });

  console.log("dayId:", machi.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1: SpotOrderItem[] = [
    {
      id: machi.id,
      data: { lat: 38.5704194, lng: 140.5300687, visitTime: t(9, 0), stayDurationMin: 70, memo: MACHI_MEMO },
    },
    {
      id: ashiyu.id,
      data: {
        lat: 38.5700654, lng: 140.5304897, visitTime: t(10, 11), stayDurationMin: 25, memo: ASHIYU_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
      },
    },
    {
      id: taki.id,
      data: {
        visitTime: t(10, 40), stayDurationMin: 60, memo: TAKI_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      id: ginzan.id,
      data: {
        lat: 38.5667139, lng: 140.5320232, visitTime: t(11, 42), stayDurationMin: 45, memo: GINZAN_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      id: juubu.id,
      data: {
        lat: 38.5755796, lng: 140.5160187, visitTime: t(12, 47), stayDurationMin: 15, memo: JUUBU_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 20 }] },
      },
    },
    {
      create: {
        name: "徳良湖", lat: 38.596539, lng: 140.440583, visitTime: t(13, 14), stayDurationMin: 50, memo: TOKURAKO_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
      },
    },
    {
      create: {
        name: "芭蕉・清風歴史資料館", lat: 38.606412, lng: 140.404454, visitTime: t(14, 10), stayDurationMin: 50, memo: BASHO_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
      },
    },
    {
      create: {
        name: "最上川舟役所跡", lat: 38.5864, lng: 140.375046, visitTime: t(15, 7), stayDurationMin: 85, memo: FUNAYAKUSHO_MEMO,
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7 }] },
      },
    },
  ];
  await setDaySpotOrder(machi.dayId, day1);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
