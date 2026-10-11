/**
 * #132 d45c6b3b(御釜の絶景を望む、宮城側から登る蔵王エコーライン日帰り
 * プラン)の全面見直し。
 *
 * もとは蔵王エコーライン(10:00、開始が9時台を外れている)・蔵王のお釜
 * (11:30)の2か所のみ(12:20終了)で4か所未満。終始「皆様、ご案内する」の
 * 案内役の話し方。
 *
 * 既存の5f3f7bd0(遠刈田温泉の共同浴場めぐり)が、このルートの主要な
 * 見どころ(刈田嶺神社・神の湯・壽の湯・みやぎ蔵王こけし館・惟喬神社・
 * 三階滝・駒草平・御釜・刈田嶺神社奥宮)をすべて使っており、44c030d6
 * (山形側からのお釜アプローチ)・8a15b42c(遠刈田温泉・こけし館)も
 * 同じ地域の見どころを使っているため、全文を事前に確認し、重なる
 * 地点は別の事実・切り口で執筆:
 * - 滝見台: 5f3f7bd0は「三階滝」を主役にしていたため、不動滝(蔵王山中
 *   最大の滝、高さ54m・幅16m)を主役にし、三階滝は脇に。
 * - 駒草平: 5f3f7bd0は展望(不帰の滝・振子滝・太平洋)を中心にしていた
 *   ため、コマクサの生態(競争を避けて砂礫地を選ぶ・水をはじく葉・
 *   長い根)を中心に。
 * - 御釜: 5f3f7bd0・44c030d6とも色の変化・噴火史を中心にしていたため、
 *   水質pH3.5という具体的な数値を中心に。
 * - 刈田嶺神社奥宮: 5f3f7bd0は「蔵王大権現社→神仏分離」、44c030d6は
 *   「天之水分神・国之水分神」を中心にしていたため、役小角による開山
 *   伝説・延喜式内社としての古さ・享保3年(1721)建立の現社殿(銘板で
 *   確認、宮城県指定文化財)を中心に。
 *
 * 【企画運営への申し送り】このルートの主要な見どころは上記4地点で、
 * 遠刈田温泉から御釜までの実際の車での所要時間(およそ40分、
 * nap-camp.com等で確認)も反映した結果、5か所・09:00〜15:09となり、
 * 16:30〜17:00には届いていません。賽の河原はOSMに点が見つからず、
 * 蔵王ハイライン側(山形側からのアプローチ)は44c030d6と同じ区間に
 * なるため使っていません。滞在時間は御釜・刈田嶺神社奥宮とも上限の
 * 90分まで使っています。延長が必要な場合は指示を仰ぎます。
 *
 * 座標(OSM、Nominatim/生APIで確認):
 * - 滝見台(不動滝基準): 38.1348483,140.5100479(OSM node 754734099
 *   「不動滝」)
 * - 駒草平: 38.1346238,140.4679767(OSM node 14156913233「駒草平」
 *   バス停)
 * - 御釜: 既存値(38.13099,140.446682)を維持(前回までの確認済み値)
 * - 刈田嶺神社奥宮: 御釜のすぐそば(刈田岳山頂)のため、便宜上御釜と
 *   同程度の座標域とし、既存の蔵王のお釜のスポットの座標から徒歩圏の
 *   位置として38.129,140.444を使用(推定)。
 *
 * 出典: 不動滝・三階滝のサイズはnews.allabout.co.jp記事、御釜のpHは
 * tabi-mag.jp/mg0047/、コマクサの生態はpref.miyagi.jp/soshiki/
 * oksgsin-r/kouzan-syokubutu.html、刈田嶺神社奥宮の開山伝説・
 * 享保3年建立はpref.miyagi.jp/soshiki/bunkazai/34kattamine.html、
 * 蔵王山頂レストハウスの営業時間はpref.miyagi.jp/documents/35756/
 * 608385.pdf関連の検索結果で確認(具体的な料金・メニュー名は本文に
 * 書かない)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const ECHOLINE_MEMO =
  "遠刈田温泉から車を走らせ、蔵王連峰を貫く蔵王エコーラインに入ります。昭和37年(1962)に開通した、宮城・山形県境を結ぶ山岳ドライブルートです。沿道には「賽の河原」など仏教にちなんだ地名が残っており、この道ができる前、蔵王が信仰の山として多くの人に登られていた歴史をしのばせます。標高を上げるにつれて木々の姿は変わり、視界が開けると蔵王連峰の雄大な稜線が広がります。積雪のため冬の間は通行止めとなり、春から秋にかけてだけ走ることのできる道です。この後は、車でおよそ25分、滝見台へ向かいましょう。";

const TAKIMIDAI_MEMO =
  "蔵王エコーラインを車でおよそ25分、滝見台に着きます。正面に見えるのは、高さおよそ54m、幅およそ16mと、蔵王山中で最も大きいとされる不動滝です。視界を右手に移すと、水が三段になって流れ落ちる三階滝も遠くに望むことができ、「日本の滝百選」にも選ばれています。積雪期は閉鎖されるので、訪れる際は時期に注意しましょう。この後は、車でおよそ9分、駒草平へ向かいましょう。";

const KOMAKUSADAIRA_MEMO =
  "滝見台から車でおよそ9分、駒草平に着きます。標高およそ1,383mに位置する、蔵王エコーライン沿いの展望スポットです。「高山植物の女王」と呼ばれるコマクサの群生地として知られ、例年6月中旬から7月ごろに花を咲かせます。コマクサは、ほかの高山植物との競争を避けるため、過酷な砂礫地をあえて選んで育つといわれ、水をはじく葉で集めた水分を、地下に50cmから1mほど伸びる長い根に送って育つという、独特の生態を持っています。断崖の上の展望台からは、奥羽山脈の山並みの向こうに太平洋までも見渡せます。断崖の上なので、柵の外に出たり身を乗り出したりしないようにしましょう。この後は、車でおよそ5分、御釜へ向かいましょう。";

const OKAMA_MEMO =
  "駒草平から車でおよそ5分、蔵王のお釜に着きます。刈田岳・熊野岳・五色岳という3つの山に囲まれてできた火口湖で、水をたたえたその姿が釜のように見えることから「お釜」と呼ばれています。水質はpH3.5ほどの強い酸性で、生き物はほとんど棲めませんが、その澄んだ水面は、天候や季節、時間帯によって瑠璃色から白濁した色、赤みを帯びた色へと表情を変えることから、「五色沼」の別名でも呼ばれてきました。最初の噴火は鎌倉時代の初めごろと考えられており、以来幾度となく噴火を繰り返しながら、この神秘的な景観を作り上げてきたのだそうです。蔵王山は今も活動を続ける火山です。火山ガスが出る場所や立ち入りが規制される場所もあるので、気象庁や現地の最新の案内で確かめましょう。この後は、歩いておよそ10分、刈田嶺神社奥宮へ向かいましょう。";

const KATTAMINEJINJA_MEMO =
  "御釜から歩いておよそ10分、刈田嶺神社奥宮に着きます。修験道の祖とされる役小角(えんのぎょうじゃ)が開いたと伝えられる、古くからの信仰の山・蔵王の中心となる神社です。平安時代の『延喜式』にもその名が記された、歴史の長い神社としても知られています。現在の社殿は、脇の金具に刻まれた銘から、享保3年(1721)に建てられたものと確認されており、宮城県の指定文化財になっています。すぐそばの蔵王山頂レストハウスでは、売店や食堂で食事をとることができるので、ここで昼食にするのもよいでしょう。冬の間は雪深い山頂へのお参りが難しくなるため、御神体は遠刈田温泉の里宮へ遷されます。静かに、敬意を持ってお参りください。見学を終えたら、車でおよそ40分、遠刈田温泉方面へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd45c6b3b%'`);
  const itinId = rows[0].id;

  const echoline = await findSpotInItinerary(itinId, { spotName: "蔵王エコーライン" });
  const okama = await findSpotInItinerary(itinId, { spotName: "蔵王のお釜" });

  console.log("確認OK。dayId:", echoline.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        description:
          "宮城県側から蔵王エコーラインをドライブし、不動滝・三階滝の滝見台、コマクサの駒草平、神秘的な火口湖・御釜、役小角ゆかりの刈田嶺神社奥宮をめぐる、雄大な蔵王連峰の絶景を楽しむプランです。",
      },
    });

    const items: SpotOrderItem[] = [
      {
        id: echoline.id,
        data: { memo: ECHOLINE_MEMO, visitTime: t(9, 0), stayDurationMin: 30 },
      },
      {
        create: {
          name: "滝見台",
          memo: TAKIMIDAI_MEMO,
          lat: 38.1348483,
          lng: 140.5100479,
          visitTime: t(9, 55),
          stayDurationMin: 55,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 25, transitLine: null }] },
        },
      },
      {
        create: {
          name: "駒草平",
          memo: KOMAKUSADAIRA_MEMO,
          lat: 38.1346238,
          lng: 140.4679767,
          visitTime: t(10, 59),
          stayDurationMin: 55,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9, transitLine: null }] },
        },
      },
      {
        id: okama.id,
        data: {
          memo: OKAMA_MEMO,
          visitTime: t(11, 59),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        create: {
          name: "刈田嶺神社奥宮",
          memo: KATTAMINEJINJA_MEMO,
          lat: 38.129,
          lng: 140.444,
          visitTime: t(13, 39),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(echoline.dayId, items, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
