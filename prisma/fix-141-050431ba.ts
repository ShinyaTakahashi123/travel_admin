/**
 * #141 050431ba(青森港ベイエリアとねぶた文化、港町青森を満喫する1泊2日)
 * の直し。もとはDay1が青森ベイブリッジ・ねぶたの家ワ・ラッセの2か所
 * (10:00〜12:00)、Day2が三内丸山遺跡の1か所(09:30〜11:20)のみで両日
 * とも4か所未満、終始案内役の話し方。
 *
 * 既存のf3c75865(三内丸山遺跡で縄文時代にタイムスリップ、青森の歴史
 * 探訪プラン)・87ae6a23(ワ・ラッセと青森県立美術館、ねぶたとアートを
 * 楽しむ日帰りプラン)が、三内丸山遺跡・青森県立美術館・ねぶたの家
 * ワ・ラッセ・青函連絡船メモリアルシップ八甲田丸・青森県観光物産館
 * アスパム・さんまるミュージアム・青森魚菜センター・A-FACTORYを使用
 * 済みのため、企画運営の指示(①青森市のまわりへ足を延ばすことを認める
 * ②日ごとのテーマを組み直す)にもとづき、Day1「港町と町なか」・Day2
 * 「縄文と信仰」に再構成。
 *
 * Day1: 青森市森林博物館(新規、明治41年/1908築の旧青森営林局庁舎)→
 * 青森ベイブリッジ→八甲田丸(無線通信室・エンジン室という、両既存が
 * 触れていない区画の切り口)→ワ・ラッセ(molo設計・鋼製リボンスクリーン
 * という建物の切り口)→アスパム(ASPAMという名前の由来・1986年開館と
 * いう切り口)→善知鳥神社(新規、青森市発祥の地とされる古社)→新町通り
 * (昼食、新規)→合浦公園(新規、明治27年/1894築造)→浅虫水族館(新規、
 * 本州最北端)。
 *
 * Day2: 三内丸山遺跡(既存2本とは別の切り口。42ヘクタール・1700年・
 * 600軒超・500人規模という数字に絞り、掘立柱建物の復元・道の跡・
 * 世界遺産・さんまるミュージアムには触れない)→小牧野遺跡(新規、環状
 * 列石。隣接する小牧野館は、OSMに建物の点が見つからなかったため
 * 企画運営の指示どおり本文にまとめた)→八甲田山麓(昼食、新規)→
 * 八甲田ロープウェー(新規、山頂公園駅1314m・田茂萢岳1326m・遊歩道
 * 「八甲田ゴードライン」。年間運行、荒天時は運休ありのため出かける前に
 * 確かめる一文を入れた)→青龍寺(新規、昭和大仏・五重塔)。
 *
 * 出典: tabi-mag.jp/ao0260(八甲田丸)、architectuul.com「the nebuta
 * house」・バンゾク生物学ブログ(ワ・ラッセの建物)、tabi-mag.jp/ao0003
 * (アスパムの名前の由来)、青森県教育委員会関連ページ(善知鳥神社の
 * 由来)、青森市立図書館の郷土史コラム(合浦公園)、niigata-kankou系
 * ではなくnap-camp.com/mag(浅虫水族館)、tabi-mag.jp/ao0165・
 * kyodokan.com(小牧野遺跡・小牧野館)、jeepe.jp「hakkoda mountain
 * travel guide」(八甲田ロープウェー)、tabi-mag.jp/ao0159(青龍寺・
 * 昭和大仏)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "青森港ベイエリアの港町さんぽと、八甲田・縄文の遺跡めぐりを組み合わせた、青森市内をじっくり楽しむ1泊2日プランです。";

const SHINRIN_MEMO =
  "青森駅前でレンタカーを借りて、車でおよそ3分、青森市森林博物館に着きます。明治41年(1908)に建てられた、旧青森営林局庁舎を利用した、ルネサンス様式の洋館です。青森ヒバの木材で建てられ、昭和57年(1982)には、森林と木をテーマにした博物館として開館しました。映画「八甲田山」の撮影にも使われたという、旧営林局長室も見学できます。この後は、車を置いて歩き、およそ9分、青森ベイブリッジへ向かいましょう。";

const BAYBRIDGE_MEMO =
  "青森市森林博物館から歩いておよそ9分、青森ベイブリッジに着きます。青森港の東西を結ぶ、逆Y字形の主塔が特徴の斜張橋です。橋の随所には、青森の頭文字「A」をかたどった意匠が施されているといわれます。この後は、歩いておよそ3分、青函連絡船メモリアルシップ八甲田丸へ向かいましょう。";

const HAKKOUDAMARU_MEMO =
  "青森ベイブリッジから歩いておよそ3分、青函連絡船メモリアルシップ八甲田丸に着きます。昭和39年(1964)に就航し、昭和63年(1988)の青函トンネル開通まで青森と函館を結んだ連絡船です。船内では、ふだんは入ることのできない無線通信室やエンジン室まで見学でき、当時の船員たちが働いていた様子をうかがえます。足元に気をつけながら、船の中を巡ってみましょう。この後は、歩いておよそ4分、ねぶたの家ワ・ラッセへ向かいましょう。";

const WARASSE_MEMO =
  "八甲田丸から歩いておよそ4分、ねぶたの家ワ・ラッセに着きます。平成23年(2011)に完成した、ねぶたの迫力をイメージしたという真紅の建物です。高さ12メートルの鋼製のリボン状のスクリーンが建物全体を覆い、曲げられたリボンのすき間が、光や眺めを取り込む窓の役目を果たしています。館内には実際にお祭りで使われた大型のねぶたも展示されているので、建物の外観とあわせて楽しみましょう。この後は、歩いておよそ9分、青森県観光物産館アスパムへ向かいましょう。";

const ASPAM_MEMO =
  "ねぶたの家ワ・ラッセから歩いておよそ9分、青森県観光物産館アスパムに着きます。昭和61年(1986)に開館した、地上15階・高さ76メートルの建物です。「アスパム(ASPAM)」という名前は、青森(Aomori)・観光(Sightseeing)・物産(Products)・館(Mansion)の頭文字から付けられました。青森(AOMORI)の頭文字「A」と、これから伸びていく姿を重ねた三角形の建物で、青い海公園に面して建っています。1階の物産ショップで、旅のみやげを少し探してみましょう。この後は、歩いておよそ5分、善知鳥神社へ向かいましょう。";

const UTOU_MEMO =
  "青森県観光物産館アスパムから歩いておよそ5分、善知鳥神社に着きます。允恭天皇の時代に、この地を治めた善知鳥中納言安方が創建したと伝えられ、大同2年(807)には坂上田村麻呂が再建したといわれる古社です。寛永18年(1641)には青森の総鎮守となりました。「善知鳥」という鳥の名が、かつてこの地が善知鳥村と呼ばれ、青森という地名のもとになったとされています。青森市発祥の地ともいわれる、ここで旅の無事を祈ってみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、新町通りへ向かいましょう。";

const SHINMACHI_MEMO =
  "善知鳥神社から歩いてすぐ、新町通りに着きます。青森市の中心を東西に走る、昔からの繁華街です。このあたりの食事処で、青森ならではの味を楽しみながら、昼食をとりましょう。この後は、車でおよそ8分、合浦公園へ向かいましょう。";

const GAPPO_MEMO =
  "新町通りから車でおよそ8分、合浦公園に着きます。明治27年(1894)、水原衛作・柿崎巳十郎の兄弟が私財を投じて造成し、青森市に寄付した、歴史ある公園です。もとは「青森公園」という名でしたが、同じころに「合浦公園」と改められました。園内には、天然記念物に指定されている老松「三誉の松」をはじめ、松林に囲まれた池など、日本庭園の趣を感じられる場所が広がっています。海辺に広がる松林を、のんびりと歩いてみましょう。この後は、車でおよそ20分、浅虫水族館へ向かいましょう。";

const ASAMUSHI_MEMO =
  "合浦公園から車でおよそ20分、浅虫水族館に着きます。本州最北端に位置する水族館で、陸奥湾を中心に、およそ300種1万点の生き物を展示しています。長さ15メートルのトンネル水槽「むつ湾の海」では、ホタテの養殖など、陸奥湾の海の中の様子を間近に見られます。津軽三味線やねぶた囃子にあわせたイルカのパフォーマンスも、一年を通じて楽しめます。見学を終えたら、湯の島を望む浅虫の海辺を少し歩いてから、今夜の宿に向かいましょう。";

const SANNAI_MEMO =
  "浅虫温泉の宿を出て、車でおよそ30分、三内丸山遺跡に着きます。およそ42ヘクタールという広い範囲に、縄文時代の人々が1700年ものあいだ暮らしたとされる集落の跡です。これまでに600軒を超える住居の跡が見つかっており、もっとも栄えていたころには、およそ500人ほどが暮らしていたとも考えられています。広い敷地を歩きながら、長い時間をかけて積み重ねられてきた、縄文の人々の暮らしの跡を感じてみましょう。この後は、車でおよそ15分、小牧野遺跡へ向かいましょう。";

const KOMAKINO_MEMO =
  "三内丸山遺跡から車でおよそ15分、小牧野遺跡に着きます。縄文時代後期前半に作られた、直径およそ55メートルの環状列石(ストーンサークル)を中心とする遺跡です。外帯(直径35m)・内帯(直径29m)・中央(直径2.5m)の3重の構造で、楕円形の石を縦に並べ、その両側に平らな石を横に積む「小牧野式」という独特な組み方は、全国でも珍しいとされています。遺跡のそばには、旧野沢小学校の校舎を改修した「小牧野館」もあり、出土した土器や石器を見学できます。平成7年(1995)に国の史跡に、2021年には世界文化遺産に登録されました。この後は、車でおよそ30分、八甲田山麓へ向かいましょう。";

const HAKKODA_LUNCH_MEMO =
  "小牧野遺跡から車でおよそ30分、八甲田山麓に着きます。山の景色を眺めながら、郷土の味を楽しんで昼食をとりましょう。この後は、歩いてすぐ、八甲田ロープウェーへ向かいましょう。";

const HAKKODA_ROPEWAY_MEMO =
  "八甲田山麓から歩いてすぐ、八甲田ロープウェーに着きます。山麓駅から、標高1314メートルの山頂公園駅まで、およそ10分で登ります。山頂の田茂萢岳(標高1326m)のまわりには、8の字形に湿原をめぐる、およそ2kmの遊歩道「八甲田ゴードライン」が整備されており、1時間ほどで八甲田の山々を眺めながら歩けます。荒天時などに運休することがあるので、出かける前に公式サイトで運行状況を確かめましょう。この後は、車でおよそ40分、青龍寺へ向かいましょう。";

const SEIRYUJI_MEMO =
  "八甲田ロープウェーから車でおよそ40分、青龍寺に着きます。高野山青森別院にあたる寺院です。境内の「昭和大仏」は、青銅坐像としては日本一とされる、高さ21.35メートルの大日如来像で、昭和59年(1984)に建立されました。青森ヒバで造られた五重塔は、塔の高さ39メートルで、東日本では最大、全国でも第4位の高さを誇るといわれ、平成8年(1996)に竣工しました。大きな仏像と五重塔を見上げながら、境内を歩いてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車でおよそ15分、青森駅へ向かい、レンタカーを返しましょう。";

async function main() {
  const itinId = "050431ba-9c60-400d-ac75-912c857a90ba";
  const day1Id = "78a8bafb-6075-4234-92cd-e07f62016936";
  const day2Id = "eaed671c-3118-4c7b-8972-afb1b0e30e61";

  const warasseId = "71b317f1-fda2-45cc-8075-4aab0c8b9c02";
  const baybridgeId = "5d0499fe-8a0a-48c8-a44f-bf31197e53d1";
  const sannaiId = "70ce543c-6e4a-45bd-84cf-d1ad82a57968";

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });

    const day1: SpotOrderItem[] = [
      {
        create: {
          name: "青森市森林博物館", lat: 40.8315369, lng: 140.7257722,
          visitTime: t(9, 0), stayDurationMin: 40, memo: SHINRIN_MEMO,
        },
      },
      {
        id: baybridgeId,
        data: {
          visitTime: t(9, 49), stayDurationMin: 25, memo: BAYBRIDGE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      {
        create: {
          name: "青函連絡船メモリアルシップ八甲田丸", lat: 40.8315900, lng: 140.7363852,
          visitTime: t(10, 17), stayDurationMin: 40, memo: HAKKOUDAMARU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        id: warasseId,
        data: {
          lat: 40.82955, lng: 140.73594,
          visitTime: t(10, 59), stayDurationMin: 35, memo: WARASSE_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
      {
        create: {
          name: "青森県観光物産館アスパム", lat: 40.829763, lng: 140.741007,
          visitTime: t(11, 43), stayDurationMin: 30, memo: ASPAM_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 9 }] },
        },
      },
      {
        create: {
          name: "善知鳥神社", lat: 40.8266592, lng: 140.7427279,
          visitTime: t(12, 18), stayDurationMin: 35, memo: UTOU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
      {
        create: {
          name: "新町通り", lat: 40.8266592, lng: 140.7427279,
          visitTime: t(12, 54), stayDurationMin: 60, memo: SHINMACHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        create: {
          name: "合浦公園", lat: 40.8297424, lng: 140.7790650,
          visitTime: t(14, 2), stayDurationMin: 60, memo: GAPPO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "浅虫水族館", lat: 40.8976143, lng: 140.8627965,
          visitTime: t(15, 22), stayDurationMin: 80, memo: ASAMUSHI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20 }] },
        },
      },
    ];
    await setDaySpotOrder(day1Id, day1, { tx });

    const day2: SpotOrderItem[] = [
      {
        id: sannaiId,
        data: {
          visitTime: t(9, 0), stayDurationMin: 60, memo: SANNAI_MEMO,
        },
      },
      {
        create: {
          name: "小牧野遺跡", lat: 40.7375569, lng: 140.7278406,
          visitTime: t(10, 15), stayDurationMin: 90, memo: KOMAKINO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
      {
        create: {
          name: "八甲田山麓", lat: 40.6783819, lng: 140.8453379,
          visitTime: t(12, 15), stayDurationMin: 60, memo: HAKKODA_LUNCH_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 30 }] },
        },
      },
      {
        create: {
          name: "八甲田ロープウェー", lat: 40.6783819, lng: 140.8453379,
          visitTime: t(13, 15), stayDurationMin: 100, memo: HAKKODA_ROPEWAY_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 0 }] },
        },
      },
      {
        create: {
          name: "青龍寺", lat: 40.8216624, lng: 140.8148239,
          visitTime: t(15, 35), stayDurationMin: 50, memo: SEIRYUJI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 40 }] },
        },
      },
    ];
    await setDaySpotOrder(day2Id, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
