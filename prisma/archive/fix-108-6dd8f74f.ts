/**
 * #108 6dd8f74f(高崎)の組み直し。元は高崎白衣大観音・少林山達磨寺の2か所
 * (09:30〜11:40)のみで、4か所未満・終了とも規定外。ツアーガイド口調
 * (「皆様、本日ご案内するのは」「〜へとご案内いたします」「続いてご案内する
 * のは」「実りある1日をお楽しみください」)も直した。
 *
 * 足りない時間は、観音山地区の実在の行き先(清水寺・高崎市染料植物園)と、
 * 高崎城址公園・高崎公園・高崎市美術館(旧井上房一郎邸)を新しく足して
 * 埋めた(行き先を足す形)。順番は達磨寺(北西)→観音山地区(西)→高崎城址・
 * 公園・美術館(東、高崎駅周辺)と、戻りの少ない経路にした。
 *
 * 新規5か所はいずれもOSM生APIで実在のノード座標を確認済み:
 * - 清水寺 36.3101319,138.9884806
 * - 高崎市染料植物園 36.3055730,138.9814030
 * - 高崎城跡 36.3237772,139.0040621
 * - 高崎公園 36.3196686,139.0027929
 * - 高崎市美術館 36.3206233,139.0106745
 *
 * 事実確認(開いたURL):
 * - 清水寺の創建伝承(大同3年808・坂上田村麻呂・京都清水寺勧請・千手観音・
 *   観音山の地名由来): https://www.city.takasaki.gunma.jp/site/sightseeing/4798.html
 * - 高崎市染料植物園(平成6年1994開園・入園無料・160種およそ17000株):
 *   高崎市公式サイト(よくある質問・利用案内ページ)
 * - 高崎城跡(慶長2年1597井伊直政築城・中山道と三国街道の分岐点・乾櫓は
 *   県内現存唯一とされる城郭建築・東門ともに群馬県重要文化財):
 *   https://ja.wikipedia.org/wiki/高崎城 ほか
 * - 高崎公園(明治9年1876開園・大染寺跡地・明治33年1900高崎公園と改称・
 *   明治43年1910築庭家小沢奎次郎設計の庭園整備):
 *   https://www.city.takasaki.gunma.jp/page/3118.html
 * - 高崎市美術館(平成3年1991開館)・旧井上房一郎邸(1952年築・建築家
 *   アントニン・レーモンドゆかり・2010年景観重要建造物第1号・同年公開)・
 *   開館時間10:00〜18:00(金曜20:00まで)月曜休館:
 *   https://www.city.takasaki.gunma.jp/site/art-museum/2494.html ,
 *   https://www.city.takasaki.gunma.jp/site/sightseeing/3460.html
 *
 * 高崎市美術館の滞在125分は、美術館本館と隣接する旧井上房一郎邸(建物・庭園)
 * の2施設をあわせて見る前提の長さ(開館時間10:00〜18:00のため、14:24〜16:30
 * の滞在は時間内)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "高崎のシンボル・白衣大観音と、だるま発祥の寺として知られる少林山達磨寺を中心に、観音山の清水寺や染料植物園、高崎城址公園、高崎公園、高崎市美術館まで、高崎の信仰と歴史、文化をめぐる日帰りプランです。";

const DARUMAJI_MEMO =
  "旅の始まりは少林山達磨寺です。黄檗宗の寺院で、元禄10年(1697)、前橋城主・酒井忠挙が、水戸光圀ゆかりの心越禅師の教えを慕い、その高弟を招いて開いたと伝えられています。「だるま発祥の地」と呼ばれるのは、江戸時代後期の天明の飢饉のころ、住職が心越禅師の描いた一筆達磨の絵をもとに木型を彫り、農民の副業として張子だるまの作り方を伝えたことに由来するのだそうです。境内ではだるまの絵付け体験もでき、高崎ならではのお土産づくりも楽しめます。今も法要が営まれる祈りの場ですので、境内では静かにお参りください。この後は、車でおよそ15分、高崎白衣大観音へ向かいましょう。";

const DAIKANNON_MEMO =
  "少林山達磨寺から車でおよそ15分、高崎白衣大観音に着きます。白衣を纏った姿で高崎のまちを見守るこの像は、昭和11年(1936)、地元の実業家・井上保三郎が、陸軍歩兵第十五連隊の戦没者の慰霊と観光都市高崎の発展を願って建立しました。像の原型を手がけたのは彫刻家・森村酉三で、高さは40メートルを超える鉄筋コンクリート造りです。像の内部は9階建てになっており、上りながら各階の仏像にお参りできるほか、最上階からは高崎の市街を一望できます。今も多くの人が参拝に訪れる祈りの場ですので、静かにお参りください。この後は、歩いておよそ13分、清水寺へ向かいましょう。";

const KIYOMIZUDERA_MEMO =
  "高崎白衣大観音から歩いておよそ13分、清水寺に着きます。大同3年(808)、征夷大将軍・坂上田村麻呂が蝦夷征討の折にこの地に進軍し、武運長久を祈って京都東山の清水寺の観音を勧請して開いたと伝えられる古刹です。本尊の千手観音にちなみ、この一帯は「観音山」と呼ばれるようになりました。参道の石段の両側にはおよそ300株のあじさいが植えられ、見頃の時期には多くの参拝者が訪れます。参拝の際は、敬意を込めて手を合わせましょう。この後は、歩いておよそ13分、高崎市染料植物園へ向かいましょう。";

const SENRYOKUEN_MEMO =
  "清水寺から歩いておよそ13分、高崎市染料植物園に着きます。平成6年(1994)に開園した、染料になる植物を専門に扱う全国でも珍しい植物園で、アイやムラサキ、ベニバナなど160種・およそ17000株の染料植物が栽培されています。入園は無料で、敷地内の染色工芸館では、実際に染められた布や糸の展示を見ることができます。園内は緑豊かで休憩もしやすいので、ここで昼食をとるのもよいでしょう。この後は、車でおよそ13分、高崎城址公園へ向かいましょう。";

const JOSHIKOEN_MEMO =
  "高崎市染料植物園から車でおよそ13分、高崎城址公園に着きます。慶長2年(1597)、徳川家康の命を受けた井伊直政が、中山道と三国街道の分岐点という交通の要衝を押さえるために築いた高崎城の跡地です。現在は三の丸の土塁と堀の一部、そして乾櫓・東門が残っています。乾櫓はかつて武器や食料を収めた蔵で、群馬県内に現存する唯一とされる城郭建築として県の重要文化財に指定されています。東門は、武士や商人が城内へ出入りする通用門だったと伝えられ、こちらも県の重要文化財です。この後は、歩いておよそ7分、高崎公園へ向かいましょう。";

const TAKASAKIKOEN_MEMO =
  "高崎城址公園から歩いておよそ7分、高崎公園に着きます。明治9年(1876)、旧高崎城の南西にあった大染寺の跡地に開かれ、明治33年(1900)の市制施行とともに「高崎公園」と呼ばれるようになった、高崎で2番目に古い公園です。明治43年(1910)の群馬県教育品展覧会にあわせ、築庭家・小沢奎次郎の設計で、泉水広場や噴水、滝を備えた庭園として整備されました。春は桜、夏は噴水のそばの木陰、秋は銀杏の落ち葉と、四季を通じて楽しめる市民の憩いの場です。この後は、歩いておよそ8分、高崎市美術館へ向かいましょう。";

const BIJUTSUKAN_MEMO =
  "高崎公園から歩いておよそ8分、この旅の締めくくり、高崎市美術館に着きます。平成3年(1991)に開館した美術館で、敷地内には高崎の芸術文化のパトロンとして知られた実業家・井上房一郎(1898-1993)の旧邸が隣接しています。この旧邸は、井上と親交のあった建築家アントニン・レーモンドの自邸を参考に1952年に建てられた木造平屋で、2010年に高崎市の景観重要建造物第1号に指定され、同年から一般公開されています。美術館の展示とあわせて、モダニズム建築の旧邸や庭園もゆっくり巡ってみましょう。高崎白衣大観音と少林山達磨寺、高崎の信仰と歴史をめぐる旅はこれで終わりです。帰りは、高崎駅方面へ、徒歩やバスでお戻りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dd8f74f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const daikannon = await findSpotInItinerary(itinId, { spotName: "高崎白衣大観音" });
  const darumaji = await findSpotInItinerary(itinId, { spotName: "少林山達磨寺" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: darumaji.id, data: { memo: DARUMAJI_MEMO, visitTime: t(9, 0), stayDurationMin: 40, transitMode: null, transitDurationMin: null } },
    { id: daikannon.id, data: { memo: DAIKANNON_MEMO, visitTime: t(9, 55), stayDurationMin: 50, transitMode: "car", transitDurationMin: 15 } },
    {
      create: {
        name: "清水寺",
        address: "群馬県高崎市石原町",
        lat: 36.3101319,
        lng: 138.9884806,
        memo: KIYOMIZUDERA_MEMO,
        visitTime: t(10, 58),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 13,
        transitLine: null,
      },
    },
    {
      create: {
        name: "高崎市染料植物園",
        address: "群馬県高崎市寺尾町",
        lat: 36.3055730,
        lng: 138.9814030,
        memo: SENRYOKUEN_MEMO,
        visitTime: t(11, 51),
        stayDurationMin: 55,
        transitMode: "walk",
        transitDurationMin: 13,
        transitLine: null,
      },
    },
    {
      create: {
        name: "高崎城址公園",
        address: "群馬県高崎市高松町",
        lat: 36.3237772,
        lng: 139.0040621,
        memo: JOSHIKOEN_MEMO,
        visitTime: t(12, 59),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 13,
        transitLine: null,
      },
    },
    {
      create: {
        name: "高崎公園",
        address: "群馬県高崎市高松町",
        lat: 36.3196686,
        lng: 139.0027929,
        memo: TAKASAKIKOEN_MEMO,
        visitTime: t(13, 41),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 7,
        transitLine: null,
      },
    },
    {
      create: {
        name: "高崎市美術館",
        address: "群馬県高崎市八島町",
        lat: 36.3206233,
        lng: 139.0106745,
        memo: BIJUTSUKAN_MEMO,
        visitTime: t(14, 24),
        stayDurationMin: 126,
        transitMode: "walk",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
  ];

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
