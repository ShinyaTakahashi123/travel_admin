/**
 * #120 b0b18b71(秩父神社と長瀞ライン下り)の直し(2回目)。企画運営・法務
 * (2026-10-11、法務記録4307e52)の指摘を反映。
 *
 * 企画運営:
 * 1. 長瀞ライン下りの座標(丸め値)→法務が見つけたOSM nodeの生の値に
 * 2. 宝登山山頂の滞在120分(決まりA)→90分以下に。小動物公園を別スポットに
 *    分けて、滞在を分担する形にした(70分+45分)
 * 3. 長瀞岩畳→乗船場(車8分)の行き方を、前後の文に明記
 * 4. 出典: 秩父神社 chichibu-jinja.or.jp/saijin/、宝登山神社
 *    hodosan-jinja.or.jp/yuisho/、他は ja.wikipedia.org の該当項目(羊山公園・
 *    長瀞・秩父まつり会館・宝登山・宝登山神社)で確認済み
 *
 * 法務:
 * ①長瀞ライン下り座標: OSM node 8815678817「長瀞舟下り」(36.0940082,
 *   139.1103656)
 * ②宝登山山頂の「秩父鉄道が運営する」を削除
 * ③安全の一言: 長瀞岩畳(岩が滑りやすい・水ぎわに近づきすぎない)、
 *   ライン下り(船頭の指示・救命胴衣・しぶき)
 * ④羊山公園ふれあい牧場: やさしくふれる・ふれたあと手を洗うの一言
 * ⑤秩父まつり会館「12月3日に」→「毎年12月に」(決まり9、日付を書かない)
 *
 * 宝登山小動物公園の座標: 36.0945339, 139.0920123 (Nominatim、osm_id
 * 1420192650)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MATSURI_FROM = "12月3日に秩父神社の例祭として行われる秩父夜祭の山車や資料を展示しています。";
const MATSURI_TO = "毎年12月に秩父神社の例祭として行われる秩父夜祭の山車や資料を展示しています。";

const HITSUJIYAMA_FROM = "その歴史にちなんだ「ふれあい牧場」では、今も羊を間近に見ることができます。";
const HITSUJIYAMA_TO =
  "その歴史にちなんだ「ふれあい牧場」では、今も羊を間近に見ることができます。羊にふれるときは、やさしく接し、ふれたあとは手を洗いましょう。";

const IWATATAMI_MEMO =
  "羊山公園から車でおよそ15分、長瀞岩畳に着きます。荒川の川岸に広がる、畳を敷き詰めたような平らな岩肌が特徴的なこの景勝地は、結晶片岩と呼ばれる岩石が、長い年月をかけて川の流れに磨かれてできたものです。明治時代から地質学者たちの研究対象となってきたことから「日本地質学発祥の地」ともいわれ、大正13年(1924)には国の名勝及び天然記念物に指定されました。岩肌は滑りやすい場所もあるので、水ぎわには近づきすぎないようにしましょう。岩畳沿いには食事処が並んでいるので、ここで昼食にしましょう。この後は、車でおよそ8分、長瀞ライン下りの乗船場へ向かいましょう。";

const LINEKUDARI_MEMO =
  "長瀞岩畳から車でおよそ8分、長瀞ライン下りの乗船場に着きます。乗船したら、先ほど歩いた岩畳を、今度は川の上から眺めます。国の名勝及び天然記念物に指定された長瀞の渓谷を、船頭の巧みな棹さばきで下る舟下りです。穏やかな流れでのんびりと景色を楽しめる区間もあれば、岩にせき止められた急流でしぶきを浴びるスリリングな区間もあり、変化に富んだ渓谷美を味わえます。船頭の指示に従い、救命胴衣を着けましょう。急流ではしぶきを浴びることもあるので、濡れてもよい服装がおすすめです。この後は、車でおよそ5分、宝登山神社へ向かいましょう。";

const HODOSAN_SUMMIT_MEMO =
  "宝登山神社のそばから、宝登山ロープウェイに乗って山頂へ上がります。山頂には、宝登山神社の奥宮や、梅園・ロウバイ園が広がります。晴れた日には、山頂から秩父の山々を見渡せます。奥宮にも、静かに、敬意をもってお参りしましょう。遊歩道は足元が整っていない場所もあるので、歩きやすい靴で気をつけて歩きましょう。この後は、歩いて宝登山小動物公園へ向かいましょう。";

const HODOSAN_ZOO_MEMO =
  "宝登山山頂から歩いてすぐ、宝登山小動物公園に着きます。うさぎやモルモットなど、小さな動物たちと間近にふれあえる施設です。動物にふれるときは、やさしく接し、ふれたあとは手を洗いましょう。長瀞の旅はこれで終わりです。ロープウェイで下り、車を返して、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'b0b18b71%'`);
  const itinId = rows[0].id;

  const chichibuShrine = await findSpotInItinerary(itinId, { spotName: "秩父神社" });
  const matsuri = await findSpotInItinerary(itinId, { spotName: "秩父まつり会館" });
  const hitsujiyama = await findSpotInItinerary(itinId, { spotName: "羊山公園" });
  const iwatatami = await findSpotInItinerary(itinId, { spotName: "長瀞岩畳" });
  const linekudari = await findSpotInItinerary(itinId, { spotName: "長瀞ライン下り" });
  const hodosanShrine = await findSpotInItinerary(itinId, { spotName: "宝登山神社" });
  const hodosanSummit = await findSpotInItinerary(itinId, { spotName: "宝登山山頂" });

  if (!matsuri.memo?.includes(MATSURI_FROM)) throw new Error("秩父まつり会館の文言が想定外です");
  if (!hitsujiyama.memo?.includes(HITSUJIYAMA_FROM)) throw new Error("羊山公園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: matsuri.id }, { memo: matsuri.memo!.replace(MATSURI_FROM, MATSURI_TO) });
  await updateSpotInItinerary(itinId, { spotId: hitsujiyama.id }, { memo: hitsujiyama.memo!.replace(HITSUJIYAMA_FROM, HITSUJIYAMA_TO) });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      iwatatami.dayId,
      [
        { id: chichibuShrine.id, data: {} },
        { id: matsuri.id, data: {} },
        { id: hitsujiyama.id, data: {} },
        { id: iwatatami.id, data: { memo: IWATATAMI_MEMO } },
        {
          id: linekudari.id,
          data: {
            memo: LINEKUDARI_MEMO,
            lat: 36.0940082,
            lng: 139.1103656,
          },
        },
        { id: hodosanShrine.id, data: {} },
        {
          id: hodosanSummit.id,
          data: {
            memo: HODOSAN_SUMMIT_MEMO,
            stayDurationMin: 70,
          },
        },
        {
          create: {
            name: "宝登山小動物公園",
            memo: HODOSAN_ZOO_MEMO,
            lat: 36.0945339,
            lng: 139.0920123,
            visitTime: t(15, 58),
            stayDurationMin: 45,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
