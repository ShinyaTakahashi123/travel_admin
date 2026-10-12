/**
 * #120 b0b18b71(秩父神社と長瀞ライン下り)の直し。
 * もとは3か所・09:30〜12:30で終わっていた(4か所未満・終了)。
 *
 * 足した4か所: 秩父まつり会館・羊山公園・宝登山神社・宝登山山頂(ロープウェイ)。
 * 09:30〜16:43、7か所に。
 *
 * 文章は案内役の口調(「皆様、本日ご案内するのは」「お楽しみください」等)を
 * サイトの標準の言い方に直し、長瀞岩畳に昼食の一言を追加。事実は以下で確認:
 * - 秩父神社: ja.wikipedia.org/wiki/秩父神社(妙見宮の正式名「秩父大宮妙見宮」に修正、
 *   社殿建立は「江戸時代」に表現を弱め、つなぎの龍は「伝わる」のまま)
 * - 秩父まつり会館: ja.wikipedia.org/wiki/秩父まつり会館(1984年開館、重要有形/無形
 *   民俗文化財、2016年ユネスコ無形文化遺産)
 * - 長瀞岩畳: ja.wikipedia.org/wiki/長瀞(1924年、国の名勝及び天然記念物)
 * - 羊山公園: ja.wikipedia.org/wiki/羊山公園(綿羊種畜場の由来、ふれあい牧場、
 *   武甲山の眺め。芝桜は春限定のため季節の一文として言及)
 * - 宝登山神社・宝登山: ja.wikipedia.org/wiki/宝登山神社、ja.wikipedia.org/wiki/宝登山
 *   (日本武尊・山犬の創建伝承、「火止山」からの名前の由来、ロープウェイ・
 *   小動物公園・梅園・ロウバイ園・奥宮)
 *
 * 座標(すべてOSM/Nominatim、User-Agent必須・1秒に1回のルールで取得):
 * - 秩父まつり会館: 35.9972130, 139.0852719 (osm_id 1420202180、tourism=museum)
 * - 羊山公園: 35.9853196, 139.0883125 (osm_id 475809878)
 * - 宝登山神社: 36.0932559, 139.1030646 (osm_id 2507884961)
 * - 宝登山山頂: 36.0911245, 139.0932638 (OSM node)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const CHICHIBU_SHRINE_MEMO =
  "秩父鉄道秩父駅前でレンタカーを借りて、今日はまず秩父神社から始まります。秩父駅から徒歩3分ほど、崇神天皇の時代、知知夫国造に任じられた知知夫彦命が、祖神をまつったのが始まりと伝えられる、知知夫国の総鎮守です。中世以降は妙見信仰と結びつき、「秩父大宮妙見宮」として長く信仰を集めてきました。現在の社殿は江戸時代に徳川家康の寄進によって建てられたもので、名工・左甚五郎の作と伝わる「つなぎの龍」の彫刻も見どころです。今も多くの人が参拝に訪れる祈りの場です。静かに、敬意をもってお参りしましょう。この後は、歩いておよそ3分、秩父まつり会館へ向かいましょう。";

const MATSURI_HALL_MEMO =
  "秩父神社から歩いておよそ3分、秩父まつり会館に着きます。昭和59年(1984)に開館した施設で、12月3日に秩父神社の例祭として行われる秩父夜祭の山車や資料を展示しています。祭りで使われる笠鉾・屋台は国の重要有形民俗文化財、屋台行事と神楽は重要無形民俗文化財に指定されていて、平成28年(2016)にはユネスコ無形文化遺産にも登録されました。実物の山車を間近に見て、祭りの迫力を感じましょう。この後は、車でおよそ7分、羊山公園へ向かいましょう。";

const HITSUJIYAMA_MEMO =
  "秩父まつり会館から車でおよそ7分、羊山公園に着きます。武甲山から北へ延びる丘陵にある公園で、「羊山」の名は、戦前にここに県の綿羊種畜場が置かれていたことに由来します。その歴史にちなんだ「ふれあい牧場」では、今も羊を間近に見ることができます。見晴しの丘からは、武甲山と秩父の市街地を一望できます。春には、丘の一面が芝桜で彩られます。この後は、車でおよそ15分、長瀞岩畳へ向かいましょう。";

const NAGATORO_IWATATAMI_MEMO =
  "羊山公園から車でおよそ15分、長瀞岩畳に着きます。荒川の川岸に広がる、畳を敷き詰めたような平らな岩肌が特徴的なこの景勝地は、結晶片岩と呼ばれる岩石が、長い年月をかけて川の流れに磨かれてできたものです。明治時代から地質学者たちの研究対象となってきたことから「日本地質学発祥の地」ともいわれ、大正13年(1924)には国の名勝及び天然記念物に指定されました。岩畳沿いには食事処が並んでいるので、ここで昼食にしましょう。この後は、長瀞ライン下りへ向かいましょう。";

const LINE_KUDARI_MEMO =
  "長瀞ライン下りに乗り、先ほど歩いた岩畳を、今度は川の上から眺めます。国の名勝及び天然記念物に指定された長瀞の渓谷を、船頭の巧みな棹さばきで下る舟下りです。穏やかな流れでのんびりと景色を楽しめる区間もあれば、岩にせき止められた急流でしぶきを浴びるスリリングな区間もあり、変化に富んだ渓谷美を味わえます。船頭が語る岩や地形にまつわる話にも耳を傾けましょう。この後は、車でおよそ5分、宝登山神社へ向かいましょう。";

const HODOSAN_SHRINE_MEMO =
  "長瀞ライン下りの乗船場から車でおよそ5分、宝登山神社に着きます。景行天皇41年(111)、日本武尊が東征の際にこの山で火にあい、道案内をしていた山犬が火を消し止めて尊を救ったという伝承から、もとは「火止山」と呼ばれ、それが「宝登山」になったと伝えられています。神日本磐余彦尊・大山祗神・火産霊神をまつり、火と山の神として信仰を集めています。静かに、敬意をもってお参りしましょう。この後は、宝登山ロープウェイで山頂へ向かいましょう。";

const HODOSAN_SUMMIT_MEMO =
  "宝登山神社のそばから、秩父鉄道が運営する宝登山ロープウェイに乗って山頂へ上がります。山頂には、宝登山神社の奥宮や、小動物公園、梅園・ロウバイ園が広がります。晴れた日には、山頂から秩父の山々を見渡せます。奥宮にも、静かに、敬意をもってお参りしましょう。遊歩道は足元が整っていない場所もあるので、歩きやすい靴で気をつけて歩きましょう。長瀞の旅はこれで終わりです。ロープウェイで下り、車を返して、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b0b18b71%'`);
  const itinId = rows[0].id;
  const day = await prisma.day.findFirst({ where: { itineraryId: itinId } });
  if (!day) throw new Error("dayが見つかりません");

  const existing = await prisma.spot.findMany({ where: { dayId: day.id }, orderBy: { orderNo: "asc" } });
  const shrine = existing.find((s) => s.name === "秩父神社");
  const iwatatami = existing.find((s) => s.name === "長瀞岩畳");
  const linekudari = existing.find((s) => s.name === "長瀞ライン下り");
  if (!shrine || !iwatatami || !linekudari) throw new Error("既存スポットが見つかりません(既に直っている可能性)");

  console.log("確認OK。既存3か所を確認。dayId:", day.id);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({
      where: { id: itinId },
      data: {
        description:
          "秩父の総鎮守・秩父神社から、秩父まつり会館、羊山公園、長瀞の岩畳・ライン下り、宝登山神社と山頂まで。秩父・長瀞の魅力を1日で巡る定番プランです。",
      },
    });

    await setDaySpotOrder(
      day.id,
      [
        { id: shrine.id, data: { memo: CHICHIBU_SHRINE_MEMO, visitTime: t(9, 30), stayDurationMin: 40 } },
        {
          create: {
            name: "秩父まつり会館",
            memo: MATSURI_HALL_MEMO,
            lat: 35.9972130,
            lng: 139.0852719,
            visitTime: t(10, 13),
            stayDurationMin: 35,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
          },
        },
        {
          create: {
            name: "羊山公園",
            memo: HITSUJIYAMA_MEMO,
            lat: 35.9853196,
            lng: 139.0883125,
            visitTime: t(10, 55),
            stayDurationMin: 40,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 7, transitLine: null }] },
          },
        },
        {
          id: iwatatami.id,
          data: {
            memo: NAGATORO_IWATATAMI_MEMO,
            visitTime: t(11, 50),
            stayDurationMin: 70,
            transitLegs: {
              deleteMany: {},
              create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15, transitLine: null }],
            },
          },
        },
        { id: linekudari.id, data: { memo: LINE_KUDARI_MEMO, visitTime: t(13, 8) } },
        {
          create: {
            name: "宝登山神社",
            memo: HODOSAN_SHRINE_MEMO,
            lat: 36.0932559,
            lng: 139.1030646,
            visitTime: t(14, 3),
            stayDurationMin: 30,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5, transitLine: null }] },
          },
        },
        {
          create: {
            name: "宝登山山頂",
            memo: HODOSAN_SUMMIT_MEMO,
            lat: 36.0911245,
            lng: 139.0932638,
            visitTime: t(14, 43),
            stayDurationMin: 120,
            transitLegs: { create: [{ orderNo: 1, transitMode: "other", transitDurationMin: 10, transitLine: null }] },
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
