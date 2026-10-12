/**
 * #123 be7a0462(金津創作の森)の直し(2回目)。企画運営(2026-10-11)の指摘
 * に沿って、Day1の説明文・文面を直し、Day2を組み立てる。
 *
 * Day1:
 * - 説明文「温泉街や北潟湖とは違う」が、新しく足した北潟湖畔と矛盾していた
 *   ため、北潟湖を含む内容に書き直す
 * - アートコア(鑑賞)・ガラス工房(見学)・創作工房(体験)が、時間を合わせる
 *   ための分割に見えないよう、それぞれ「何ができる場所か」を文の前半で
 *   はっきり書き、前のスポットとの違いも明記
 * - 北潟湖畔に、車・足元の注意を追加(法務の任意の提案)
 *
 * Day2(新規に組み立て。もとの「金津創作の森美術館」1か所は削除):
 * 吉崎御坊跡→蓮如上人記念館→吉崎別院→丸岡城→一筆啓上日本一短い手紙の館
 * (昼食)→旧森田銀行本店→みくに龍翔館の7か所、09:00〜16:28。
 *
 * 事実の出典:
 * - 吉崎御坊跡・蓮如上人記念館・吉崎別院: ja.wikipedia.org/wiki/吉崎御坊
 *   (文明3年(1471)蓮如建立、昭和50年(1975)国史跡、東西別院の存在)
 * - 丸岡城: 公式サイト maruoka-castle.jp(現存12天守の一つ・北陸唯一、
 *   天正4年(1576)柴田勝豊築城、野面積み・石瓦葺き)。令和8年(2026)10月
 *   現在、天守の大規模修理中で、10/1-10/31・11/1-11/8のみ限定公開
 *   (maruoka-castle.jp/news/20260731-333/)のため、天守内に入れるかどうかは
 *   公式案内を確かめる旨を明記
 * - 一筆啓上日本一短い手紙の館: ja.wikipedia.org/wiki/日本一短い手紙の館
 *   (本多重次の手紙、丸岡城北側、カフェ「ふみの庭」)
 * - 旧森田銀行本店: ja.wikipedia.org/wiki/旧森田銀行本店(大正9年(1920)竣工、
 *   鉄筋コンクリート2階建て)。#111(雄島・東尋坊)でも同じ建物を取り上げて
 *   いるため、文は書き分けている
 * - みくに龍翔館: ja.wikipedia.org/wiki/みくに龍翔館(明治12年(1879)龍翔
 *   小学校の擬洋風建築を復元、北前船模型・三国祭の山車)
 *
 * 座標(すべてOSM/Nominatim):
 * - 吉崎別院: 36.2876925, 136.2525688(osm_id 850032033)
 * - 丸岡城: 36.1523586, 136.2721252(osm_id 181455166)
 * - 一筆啓上日本一短い手紙の館: 36.1536745, 136.2749394(osm_id 648657914)
 * - 旧森田銀行本店: 36.2136000, 136.1495629(osm_id 12416004739)
 * - みくに龍翔館: 36.2198953, 136.1514270(osm_id 196969604)
 * - 蓮如上人記念館: OSMに単独の点がないため、吉崎御坊跡(同じ丘のふもと)の
 *   座標を開示のうえ共通で使用
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "里山の自然の中にアート作品が点在する金津創作の森と、湖畔の景色が広がる北潟湖。あわらのアートと自然を楽しむ1泊2日です。";

const ART_CORE_TO =
  "森の散策路から歩いておよそ5分、金津創作の森アートコアに着きます。屋内の展示室で、企画展を中心とした現代アートの作品を見て回る、鑑賞のための施設です。園内のレストランで昼食をとりましょう。この後は、歩いておよそ5分、ガラス工房へ向かいましょう。";

const GLASS_TO =
  "アートコアから歩いておよそ5分、金津創作の森ガラス工房に着きます。アートコアでの鑑賞とは違い、ここは実際に吹きガラスやガラス加工を行う作家の制作の様子を、間近で見学できる工房です。炎を使った作業もあるので、見学の際は作家の指示に従い、距離を保ちましょう。この後は、歩いておよそ5分、創作工房へ向かいましょう。";

const WORKSHOP_TO =
  "ガラス工房から歩いておよそ5分、金津創作の森創作工房に着きます。ガラス工房が作家の制作を見学する施設なのに対し、ここは来館者自身が実際に手を動かして作品づくりを体験できる施設です。ものづくりの時間をゆっくりと楽しみましょう。この後は、車でおよそ15分、北潟湖畔へ向かいましょう。";

const LAKE_TO =
  "創作工房から車でおよそ15分、北潟湖畔に着きます。あわら市と坂井市にまたがる湖で、湖畔の道をゆったりと歩きながら、水面の景色を眺められます。歩道と車道が近い場所もあるので、車に気をつけながら歩きましょう。今夜はこの近くの宿に泊まりましょう。";

const YOSHIZAKI_MEMO =
  "宿から車でおよそ15分、旅の2日目は吉崎御坊跡から始まります。文明3年(1471)、本願寺第8世・蓮如が、比叡山からの迫害を逃れて北陸の布教の拠点として建立した史跡です。北潟湖に三方を囲まれた小高い丘で、昭和50年(1975)に国の史跡に指定されました。蓮如上人の銅像や、本堂跡の石碑が残されています。静かに、敬意をもって見学しましょう。この後は、歩いておよそ5分、蓮如上人記念館へ向かいましょう。";

const KINENKAN_MEMO =
  "吉崎御坊跡から歩いておよそ5分、蓮如上人記念館に着きます。蓮如の足跡や、吉崎御坊の歴史にまつわる資料を紹介する施設です。布教の拠点として多くの門徒を集めた、この地の歴史をじっくりとたどりましょう。この後は、歩いておよそ5分、吉崎別院へ向かいましょう。";

const BETSUIN_MEMO =
  "蓮如上人記念館から歩いておよそ5分、吉崎別院に着きます。真宗大谷派の別院で、延享4年(1747)に吉崎山のふもとに建立されました。今も祈りの場として大切にされている建物です。静かに、敬意をもってお参りしましょう。この後は、車でおよそ25分、丸岡城へ向かいましょう。";

const MARUOKA_MEMO =
  "吉崎別院から車でおよそ25分、丸岡城に着きます。天正4年(1576)、柴田勝家の甥・勝豊によって築かれた城で、江戸時代以前に建てられた天守が今も残る、全国に12しかない現存天守の一つ、北陸地方では唯一の現存天守です。自然石を積んだ野面積みの石垣や、全体が石の瓦で葺かれた屋根が特徴です。天守の中へ入れるかどうかは、修理工事の状況により変わるので、公式の案内で確かめましょう。この後は、歩いておよそ3分、一筆啓上日本一短い手紙の館へ向かいましょう。";

const TEGAMI_MEMO =
  "丸岡城から歩いておよそ3分、一筆啓上日本一短い手紙の館に着きます。戦国武将・本多重次が陣中から妻へ送った「一筆啓上 火の用心 おせん泣かすな 馬肥やせ」という手紙にちなんだ施設で、日本一短い手紙を募る公募の入賞作品や、丸岡城にまつわる展示があります。カフェ「ふみの庭」で昼食をとりましょう。この後は、車でおよそ20分、旧森田銀行本店へ向かいましょう。";

const GINKOU_MEMO =
  "一筆啓上日本一短い手紙の館から車でおよそ20分、三国湊の旧森田銀行本店に着きます。大正9年(1920)に竣工した、鉄筋コンクリート造2階建ての銀行建築です。茶色のタイルや擬石を使った外壁、古典主義的な装飾が、港町・三国の繁栄を物語っています。平成に入って修復され、資料館として公開されています。この後は、歩いておよそ10分、みくに龍翔館へ向かいましょう。";

const RYUSHOKAN_MEMO =
  "旧森田銀行本店から歩いておよそ10分、みくに龍翔館に着きます。明治12年(1879)に建てられた龍翔小学校の、木造5階建ての擬洋風建築を復元した博物館です。北前船の大型模型や、三国祭の山車などを展示し、港町・三国の歴史と文化を紹介しています。あわら・坂井の旅はこれで終わりです。レンタカーを返して、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;

  const artCore = await findSpotInItinerary(itinId, { spotName: "金津創作の森アートコア" });
  const glass = await findSpotInItinerary(itinId, { spotName: "金津創作の森ガラス工房" });
  const workshop = await findSpotInItinerary(itinId, { spotName: "金津創作の森創作工房" });
  const lake = await findSpotInItinerary(itinId, { spotName: "北潟湖畔" });
  const day2Old = await findSpotInItinerary(itinId, { dayNumber: 2, spotName: "金津創作の森美術館" });

  console.log("確認OK。day2 dayId:", day2Old.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await tx.spot.update({ where: { id: artCore.id }, data: { memo: ART_CORE_TO } });
    await tx.spot.update({ where: { id: glass.id }, data: { memo: GLASS_TO } });
    await tx.spot.update({ where: { id: workshop.id }, data: { memo: WORKSHOP_TO } });
    await tx.spot.update({ where: { id: lake.id }, data: { memo: LAKE_TO } });

    await setDaySpotOrder(
      day2Old.dayId,
      [
        {
          create: {
            name: "吉崎御坊跡",
            memo: YOSHIZAKI_MEMO,
            lat: 36.2872801,
            lng: 136.2509371,
            visitTime: t(9, 0),
            stayDurationMin: 50,
          },
        },
        {
          create: {
            name: "蓮如上人記念館",
            memo: KINENKAN_MEMO,
            lat: 36.2872801,
            lng: 136.2509371,
            visitTime: t(9, 55),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
          },
        },
        {
          create: {
            name: "吉崎別院",
            memo: BETSUIN_MEMO,
            lat: 36.2876925,
            lng: 136.2525688,
            visitTime: t(10, 40),
            stayDurationMin: 30,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
          },
        },
        {
          create: {
            name: "丸岡城",
            memo: MARUOKA_MEMO,
            lat: 36.1523586,
            lng: 136.2721252,
            visitTime: t(11, 35),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25, transitLine: null }] },
          },
        },
        {
          create: {
            name: "一筆啓上日本一短い手紙の館",
            memo: TEGAMI_MEMO,
            lat: 36.1536745,
            lng: 136.2749394,
            visitTime: t(12, 38),
            stayDurationMin: 50,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
          },
        },
        {
          create: {
            name: "旧森田銀行本店",
            memo: GINKOU_MEMO,
            lat: 36.2136,
            lng: 136.1495629,
            visitTime: t(13, 48),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
          },
        },
        {
          create: {
            name: "みくに龍翔館",
            memo: RYUSHOKAN_MEMO,
            lat: 36.2198953,
            lng: 136.151427,
            visitTime: t(14, 58),
            stayDurationMin: 90,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
          },
        },
      ],
      { remove: [day2Old.id], tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
