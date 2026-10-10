/**
 * #97 3993afce の直し(6回目)。企画運営(2026-10-01 09:20)の指摘:
 * 黒壁スクエア210分・豊公園120分・長浜城歴史博物館90分は、決まりAの水増しに
 * あたる(「実在の内容で妥当」という理由付けでは足りず、必ず新しい行き先を
 * 足して空いた時間を埋める)。また竹生島160分は、往復の船の時間を含むことを
 * 本文に明記する。
 *
 * 直し方:
 * - 黒壁スクエア: 210分→90分(町並みと昼食)。空いた時間は、黒壁スクエア内の
 *   実在の施設である黒壁ガラス館(新規・ガラス工芸の展示販売館)・黒壁オルゴール館
 *   (新規・オルゴール専門館)を独立したスポットとして追加して埋めた
 * - 豊国神社のあと、1日目の締めに実在の新しい行き先・国友鉄砲の里資料館
 *   (国友は堺と並ぶ日本有数の鉄砲生産地だったとされる)を追加(車でおよそ12分)。
 *   「1日目はここまでです」の結びはこちらに移した
 * - 竹生島: 「長浜港から竹生島までは船でおよそ35分、上陸時間のおよそ90分と
 *   あわせて、港に戻るまでの往復でおよそ160分かかります」を本文に追加
 * - 長浜城歴史博物館: 90分→60分
 * - 豊公園: 120分→40分。空いた時間は、実在の新しい行き先・長浜びわこ大仏
 *   (新規・良疇寺、台座含め高さ28mの青銅製阿弥陀如来像)を2日目の締めに追加
 *   (車でおよそ8分)。「旅の最後に」の結びはこちらに移した
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 黒壁ガラス館: 35.3806834,136.2670771 / 黒壁オルゴール館: 35.3808116,136.2669944
 * - 国友鉄砲の里資料館: 35.408960,136.282494 / 長浜びわこ大仏: 35.3677473,136.2738240
 *
 * 開いたURL(事実確認):
 * - 国友鉄砲の里資料館(1543年種子島伝来から1年ほどで国産化・三英傑ゆかり): https://ja.wikipedia.org/wiki/%E5%9B%BD%E5%8F%8B%E9%89%84%E7%A0%B2%E3%81%AE%E9%87%8C%E8%B3%87%E6%96%99%E9%A4%A8
 * - 長浜びわこ大仏(良疇寺・高さ28m・初代1937年建立1992年解体・2代目1994年開眼): https://www.nagazine.jp/biwako-daibutsu/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KUROKABE_MEMO =
  "長浜曳山博物館から歩いておよそ5分、黒壁スクエアに着きます。北国街道と大手門通りが交わる「札の辻」を中心に広がる、江戸時代から明治時代の古い建物を生かした街並みです。象徴的な「黒壁ガラス館」は、明治33年(1900)に第百三十国立銀行長浜支店として建てられたもので、黒漆喰の外観から地元の人々に「黒壁銀行」と呼ばれ親しまれてきました。銀行としての役目を終えたのち、平成元年(1989)にガラス美術館として生まれ変わり、これをきっかけに周辺一帯がガラス工芸を軸にした街並みへと整備されていきました。今では、湖北を代表する観光地として、多くの人でにぎわっています。大手門通りや北国街道沿いの町家をのぞきながら、ここで昼食にしましょう。この後は、歩いてすぐ、黒壁ガラス館へ向かいましょう。";

const GARASUKAN_MEMO =
  "黒壁スクエアの中心、黒壁ガラス館に着きます。先ほど歩いてきた明治33年(1900)建築の旧第百三十国立銀行長浜支店を活用した、ガラス工芸の展示・販売館です。国内外の作家によるガラス作品が並ぶギャラリーのほか、吹きガラスや万華鏡づくりなどの体験工房もあり、ガラス工芸の町・黒壁のシンボルとして親しまれています。この後は、歩いてすぐ、黒壁オルゴール館へ向かいましょう。";

const ORGELKAN_MEMO =
  "黒壁ガラス館からすぐ、黒壁オルゴール館に着きます。北国街道沿いに建つ、オルゴールを専門に扱う館です。小さなものから大型のアンティークオルゴールまで、さまざまな音色を聞き比べながら見て回れます。この後は、歩いておよそ3分、豊国神社へ向かいましょう。";

const TOYOKUNI_FROM = "長浜の人々が守り抜いた秀吉への信仰の跡に、敬意を込めて手を合わせてみてください。1日目はここまでです。今夜はこの近くの宿に泊まります。";
const TOYOKUNI_TO = "長浜の人々が守り抜いた秀吉への信仰の跡に、敬意を込めて手を合わせてみてください。この後は、車でおよそ12分、国友鉄砲の里資料館へ向かいましょう。";
const TOYOKUNI_PREV_FROM = "黒壁スクエアから歩いておよそ3分、豊国神社に着きます。";
const TOYOKUNI_PREV_TO = "黒壁オルゴール館から歩いておよそ3分、豊国神社に着きます。";

const KUNITOMO_MEMO =
  "豊国神社から車でおよそ12分、国友鉄砲の里資料館に着きます。国友は、堺とともに日本有数の鉄砲生産地だったとされる町です。天文12年(1543)に種子島に鉄砲が伝来してからわずか1年ほどで、国友の鍛冶職人たちは国産化に成功したと伝えられています。織田信長・豊臣秀吉・徳川家康の三英傑は、いずれも国友を所領とし、国友で作られた鉄砲を重く用いたといわれています。実際に使われた火縄銃や、鉄砲づくりの道具などを間近に見ることができます。1日目はここまでです。今夜はこの近くの宿に泊まります。";

const CHIKUBU_FROM = "港で乗船の手続きをすませ、琵琶湖汽船のクルーズ船で竹生島へ渡ります。竹生島は、琵琶湖の北部に浮かぶ小さな島で";
const CHIKUBU_TO = "港で乗船の手続きをすませ、琵琶湖汽船のクルーズ船で竹生島へ渡ります。長浜港から竹生島までは船でおよそ35分、上陸時間のおよそ90分とあわせて、港に戻るまでの往復でおよそ160分かかります。竹生島は、琵琶湖の北部に浮かぶ小さな島で";

const HOKO_FROM = "湖岸沿いの遊歩道を歩けば、竹生島の浮かぶ湖面や対岸の山並みまで見渡せます。ベンチで一息ついたり、湖から吹く風を感じながら岸辺を歩いたりと、旅の最後にゆっくり過ごすのにちょうどよい場所です。黒壁スクエアのにぎわいから、静かな琵琶湖畔まで、長浜をじっくり満喫する1泊2日はこれで終わりです。帰りは、JR長浜駅から徒歩またはバスでどうぞ。";
const HOKO_TO = "湖岸沿いの遊歩道を歩けば、竹生島の浮かぶ湖面や対岸の山並みまで見渡せます。この後は、車でおよそ8分、長浜びわこ大仏へ向かいましょう。";

const BIWAKODAIBUTSU_MEMO =
  "豊公園から車でおよそ8分、長浜びわこ大仏に着きます。臨済宗妙心寺派の寺院・良疇寺にそびえる、台座を含め高さ28mの青銅製阿弥陀如来像です。初代の大仏は昭和8年(1933)に発願され、昭和12年(1937)に建立されましたが、老朽化のため平成4年(1992)に解体されました。現在の2代目の大仏は、仏師・米林勝二の手によるもので、平成6年(1994)に開眼供養が行われました。琵琶湖畔にそびえる大きな姿に、敬意を込めて手を合わせてみてください。黒壁スクエアのにぎわいから、静かな琵琶湖畔まで、長浜をじっくり満喫する1泊2日はこれで終わりです。帰りは、JR長浜駅から徒歩またはバスでどうぞ。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3993afce%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const otsuji = await findSpotInItinerary(itinId, { spotName: "大通寺" });
  const hachimangu = await findSpotInItinerary(itinId, { spotName: "長浜八幡宮" });
  const shanain = await findSpotInItinerary(itinId, { spotName: "舎那院" });
  const chizenin = await findSpotInItinerary(itinId, { spotName: "知善院" });
  const hikiyama = await findSpotInItinerary(itinId, { spotName: "長浜曳山博物館" });
  const kurokabe = await findSpotInItinerary(itinId, { spotName: "黒壁スクエア" });
  const toyokuni = await findSpotInItinerary(itinId, { spotName: "豊国神社" });

  const keiunkan = await findSpotInItinerary(itinId, { spotName: "慶雲館" });
  const tetsudo = await findSpotInItinerary(itinId, { spotName: "長浜鉄道スクエア" });
  const chikubu = await findSpotInItinerary(itinId, { spotName: "竹生島" });
  const castle = await findSpotInItinerary(itinId, { spotName: "長浜城歴史博物館" });
  const hoko = await findSpotInItinerary(itinId, { spotName: "豊公園" });

  if (!toyokuni.memo!.includes(TOYOKUNI_FROM)) throw new Error("豊国神社の文言(1)が想定外です");
  if (!toyokuni.memo!.includes(TOYOKUNI_PREV_FROM)) throw new Error("豊国神社の文言(2)が想定外です");
  if (!chikubu.memo!.includes(CHIKUBU_FROM)) throw new Error("竹生島の文言が想定外です");
  if (!hoko.memo!.includes(HOKO_FROM)) throw new Error("豊公園の文言が想定外です");

  const toyokuniMemo = toyokuni.memo!.replace(TOYOKUNI_PREV_FROM, TOYOKUNI_PREV_TO).replace(TOYOKUNI_FROM, TOYOKUNI_TO);
  const chikubuMemo = chikubu.memo!.replace(CHIKUBU_FROM, CHIKUBU_TO);
  const hokoMemo = hoko.memo!.replace(HOKO_FROM, HOKO_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: otsuji.id, data: {} },
    { id: hachimangu.id, data: {} },
    { id: shanain.id, data: {} },
    { id: chizenin.id, data: {} },
    { id: hikiyama.id, data: {} },
    { id: kurokabe.id, data: { memo: KUROKABE_MEMO, stayDurationMin: 90 } },
    {
      create: {
        name: "黒壁ガラス館",
        address: "滋賀県長浜市元浜町",
        lat: 35.3806834,
        lng: 136.2670771,
        memo: GARASUKAN_MEMO,
        visitTime: t(14, 12),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "黒壁オルゴール館",
        address: "滋賀県長浜市元浜町",
        lat: 35.3808116,
        lng: 136.2669944,
        memo: ORGELKAN_MEMO,
        visitTime: t(14, 54),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    { id: toyokuni.id, data: { memo: toyokuniMemo, visitTime: t(15, 32), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 3, transitLine: null } },
    {
      create: {
        name: "国友鉄砲の里資料館",
        address: "滋賀県長浜市国友町",
        lat: 35.40896,
        lng: 136.282494,
        memo: KUNITOMO_MEMO,
        visitTime: t(16, 14),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 12,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: keiunkan.id, data: {} },
    { id: tetsudo.id, data: {} },
    { id: chikubu.id, data: { memo: chikubuMemo } },
    { id: castle.id, data: { stayDurationMin: 60 } },
    { id: hoko.id, data: { memo: hokoMemo, visitTime: t(14, 10), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 4, transitLine: null } },
    {
      create: {
        name: "長浜びわこ大仏",
        address: "滋賀県長浜市下坂浜町",
        lat: 35.3677473,
        lng: 136.273824,
        memo: BIWAKODAIBUTSU_MEMO,
        visitTime: t(14, 58),
        stayDurationMin: 100,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
