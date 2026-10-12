/**
 * #133 dba1a628(鶴岡八幡宮と北鎌倉の禅寺、長谷の観音・大仏をめぐり
 * 御朱印をいただく鎌倉1泊2日)の全面見直し。
 *
 * もとはDay1が円覚寺・建長寺・鶴岡八幡宮の3か所(09:30〜14:20)、Day2が
 * 高徳院・長谷寺・銭洗弁財天の3か所(09:30〜13:50)で、どちらも4か所
 * 未満。昼食の一文がなく(建長寺→鶴岡八幡宮、長谷寺→銭洗弁財天の間に
 * 説明のつかない時間差があった)、最後の銭洗弁財天の結びが案内役の
 * まとめ口調(「〜をお楽しみいただけたことでしょう」)だった。長谷寺の
 * 「日本最大級」にも同じ文の中のぼかしがなかった。
 *
 * 既存の4b95c57d(竹林と紫陽花…)・5d898384(大仏さまと江ノ電…)が、
 * 円覚寺・鶴岡八幡宮・高徳院・長谷寺を使っており(5d898384の高徳院・
 * 長谷寺の文は、特にもとの#133の文とかなり近かった)、全文を確認して
 * 重なる地点は別の事実・切り口で執筆:
 * - 高徳院: 5d898384は寸法・重さ・大仏殿倒壊説・像内拝観を中心に
 *   していたため、最初は木造の大仏だった(寛元元年/1243開眼、のちに
 *   失われた)という伝承と、与謝野晶子の歌碑(昭和27年/1952、造立700年
 *   記念)を中心にした。
 * - 長谷寺: 5d898384は徳道上人の2体の観音像の伝説・見晴台からの眺め・
 *   弁天窟を詳しく語っていたため、良縁地蔵(3体)とあじさい路を中心に
 *   し、創建の伝説は一文程度に短くした。
 * - 円覚寺・鶴岡八幡宮は、もとの文がすでに4b95c57dと異なる事実
 *   (円覚経の寺名由来、若宮大路と流鏑馬など)を使っていたため、大きな
 *   変更はせず。
 *
 * 新規に、Day1は浄智寺(鎌倉五山第四位、f未使用)・宝戒寺(萩寺、未使用)・
 * 妙本寺(比企谷、日蓮宗の古刹、未使用)、Day2は甘縄神明神社(鎌倉最古の
 * 神社の一つ、未使用)・御霊神社(権五郎景政、面掛行列、未使用)・
 * 成就院(極楽寺坂切通、縁結び、未使用)を追加し、各日6か所に。
 *
 * 座標(OSM、Nominatim/生APIで確認): 浄智寺35.3333982,139.5462449、
 * 宝戒寺35.3221163,139.5582800、妙本寺35.3171792,139.5572259、
 * 甘縄神明神社35.3142710,139.5371224(way中心)、
 * 御霊神社35.3110327,139.5330270(宝蔵庫の点、推定)、
 * 成就院35.3090783,139.5312626。
 *
 * 出典: 浄智寺はkanagawa-kankou.or.jp/features/169、宝戒寺は
 * tabi-mag.jp/kn0089/、妙本寺はkanagawa-kankou.or.jp/
 * kanagawayokohamadc/spot/101、甘縄神明神社はrurubu.jp記事、
 * 御霊神社はtabi-mag.jp/kn0370/・online.bunka.go.jp/db/heritages/
 * detail/580992(面掛行列)、成就院はtabi-mag.jp/kn0496、
 * 与謝野晶子の歌碑・木造先代大仏はmlit.go.jp/tagengo-db/R1-01391.html
 * ほかで確認。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

// ---------- Day1 ----------

const ENGAKUJI_FROM = "山あいの静かな境内で、鎌倉時代から続く禅の空気を感じながら、静かに、敬意をもってお参りください。";
const ENGAKUJI_TO =
  "山あいの静かな境内で、鎌倉時代から続く禅の空気を感じながら、静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ7分、浄智寺へ向かいましょう。";

const JOCHIJI_MEMO =
  "円覚寺から歩いておよそ7分、浄智寺に着きます。弘安4年(1281)、北条時頼の三男・宗政の死を弔うため、妻とその子・師時が建立したと伝えられる禅寺で、鎌倉五山の第四位に数えられています。入口に立つ「鐘楼門」は、2階に延宝7年(1679)に鋳造された鐘を掛けた、珍しい構造の門です。境内の奥には、鎌倉・江の島七福神の一つ、布袋尊が祀られています。苔むした石段が続く参道も見どころです。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ12分、建長寺へ向かいましょう。";

const KENCHOJI_FROM = "今も座禅会が開かれる修行の場ですので、静かに、敬意をもってお参りください。";
const KENCHOJI_TO =
  "今も座禅会が開かれる修行の場ですので、静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ16分、鎌倉駅周辺を通って宝戒寺へ向かいましょう。途中、食事処で昼食をとっておきましょう。";

const HOKAIJI_MEMO =
  "建長寺から歩いておよそ16分、宝戒寺に着きます。建武2年(1335)、後醍醐天皇の命を受けた足利尊氏が、鎌倉幕府の滅亡で亡くなった北条一族の霊を慰めるために建てたと伝えられる寺です。このあたりは、北条氏の執権が代々邸宅を構えた「小町亭」の跡地でもあります。9月には境内一面に萩の花が咲くことから「萩寺」としても知られています。本尊は、子育てや安産にご利益があるとされる子育経読地蔵大菩薩です。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ7分、鶴岡八幡宮へ向かいましょう。";

const TSURUGAOKA_FROM = "静かに、敬意をもってお参りください。今夜はこの近くの宿にご宿泊いただきます。";
const TSURUGAOKA_TO = "静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ14分、妙本寺へ向かいましょう。";

const MYOHONJI_MEMO =
  "鶴岡八幡宮から歩いておよそ14分、妙本寺に着きます。鎌倉幕府の有力な御家人だった比企能員の屋敷があった「比企谷」に建つ、日蓮宗では最も古い寺院の一つとされるお寺です。比企一族が滅ぼされたのち、ただ一人生き残った末子・能本が、晩年をともにした日蓮に法華堂を開くことを許し、これが寺の始まりと伝えられています。境内では、春には桜とともに、薄紅色の海棠(かいどう)の花が咲き誇ります。静かに、敬意を持ってお参りしましょう。今夜はこの近くの宿に宿をとりましょう。";

// ---------- Day2 ----------

const AMANAWA_MEMO =
  "長谷の高台に鎮座する甘縄神明神社に着きます。和銅3年(710)、行基が建てたという伝承が残り、鎌倉で最も古い神社の一つとされています。天照大御神を祭神とし、源頼家がこの社に祈願したところ、のちに長男・一幡に恵まれたという言い伝えから、安産の神社としても信仰されてきました。鎌倉幕府の有力な武将・和田義盛が生まれた地とも伝えられています。境内からは、鎌倉の海を望むこともできます。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ5分、高徳院へ向かいましょう。";

const KOTOKUIN_MEMO =
  "甘縄神明神社から歩いておよそ5分、高徳院に着きます。本尊は、国宝・銅造阿弥陀如来坐像、通称「鎌倉大仏」です。寺の記録によれば、最初に造られたのは木造の大仏で、寛元元年(1243)に開眼したと伝えられていますが、その後失われてしまい、建長4年(1252)ごろから、今に残る銅造の大仏が新たに造られ始めたとされています。像内は拝観でき、鋳造の継ぎ目を間近に見ることもできます。境内には、歌人・与謝野晶子が詠んだ「かまくらやみほとけなれど釈迦牟尼は美男におわす夏木立かな」という歌を刻んだ歌碑があり、昭和27年(1952)、大仏の造立700年を記念して建てられました。静かに、敬意を持って拝観しましょう。この後は、歩いておよそ8分、長谷寺へ向かいましょう。";

const HASEDERA_MEMO =
  "高徳院から歩いておよそ8分、長谷寺に着きます。寺伝によれば、徳道上人が一本の木から2体の十一面観音像を彫り、1体をこの地に祀ったのが始まりと伝えられ、像高9.18mの本尊は、木造の仏像としては日本最大級とされています。境内の石段沿いには、3体並んだ「良縁地蔵」が安置されており、3体すべてを写真に収めると良縁に恵まれるという言い伝えがあります。6月には、40種以上およそ2500株のあじさいが咲き誇る「あじさい路」も見どころの一つです。途中、食事処もあるので、ここで昼食をとっておきましょう。見晴台からは由比ヶ浜や三浦半島まで見渡せます。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ3分、御霊神社へ向かいましょう。";

const GORYOJINJA_MEMO =
  "長谷寺から歩いておよそ3分、御霊神社に着きます。源頼朝が鎌倉に入る以前からこの地にあったと伝えられる古い神社で、後三年の役で活躍した武将・鎌倉権五郎景政を祀っていることから、「権五郎神社」とも呼ばれています。境内のすぐそばを江ノ電が走り抜ける光景は、鎌倉らしい眺めとして知られています。9月18日の例大祭では、さまざまな仮面をつけた10人が練り歩く「面掛行列」が行われ、国の重要無形民俗文化財に指定されています。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ4分、成就院へ向かいましょう。";

const JOJUIN_MEMO =
  "御霊神社から歩いておよそ4分、成就院に着きます。承久元年(1219)、鎌倉幕府3代執権・北条泰時が、空海(弘法大師)が平安時代にこの地で修行したという伝承に基づいて開いたと伝えられる寺です。極楽寺坂切通のそばにあり、縁結びにご利益があるとされています。石段の参道からは、由比ヶ浜を見渡す眺めが広がります。静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ30分、銭洗弁財天宇賀福神社へ向かいましょう。";

const ZENIARAI_FROM =
  "静かに、敬意をもってお参りください。鶴岡八幡宮と北鎌倉の禅寺、長谷の観音・大仏をめぐり御朱印をいただく1泊2日をお楽しみいただけたことでしょう。";
const ZENIARAI_TO = "静かに、敬意を持ってお参りしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'dba1a628%'`);
  const itinId = rows[0].id;

  const engakuji = await findSpotInItinerary(itinId, { spotName: "円覚寺" });
  const kenchoji = await findSpotInItinerary(itinId, { spotName: "建長寺" });
  const tsurugaoka = await findSpotInItinerary(itinId, { spotName: "鶴岡八幡宮" });
  const kotokuin = await findSpotInItinerary(itinId, { spotName: "高徳院（鎌倉大仏）" });
  const hasedera = await findSpotInItinerary(itinId, { spotName: "長谷寺" });
  const zeniarai = await findSpotInItinerary(itinId, { spotName: "銭洗弁財天宇賀福神社" });

  if (!engakuji.memo?.includes(ENGAKUJI_FROM)) throw new Error("円覚寺の文言が想定外です");
  if (!kenchoji.memo?.includes(KENCHOJI_FROM)) throw new Error("建長寺の文言が想定外です");
  if (!tsurugaoka.memo?.includes(TSURUGAOKA_FROM)) throw new Error("鶴岡八幡宮の文言が想定外です");
  if (!zeniarai.memo?.includes(ZENIARAI_FROM)) throw new Error("銭洗弁財天の文言が想定外です");

  console.log("確認OK。day1:", engakuji.dayId, "day2:", kotokuin.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      {
        id: engakuji.id,
        data: { memo: engakuji.memo!.replace(ENGAKUJI_FROM, ENGAKUJI_TO), stayDurationMin: 80 },
      },
      {
        create: {
          name: "浄智寺",
          memo: JOCHIJI_MEMO,
          lat: 35.3333982,
          lng: 139.5462449,
          visitTime: t(10, 57),
          stayDurationMin: 30,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
        },
      },
      {
        id: kenchoji.id,
        data: {
          memo: kenchoji.memo!.replace(KENCHOJI_FROM, KENCHOJI_TO),
          visitTime: t(11, 39),
          stayDurationMin: 80,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12, transitLine: null }] },
        },
      },
      {
        create: {
          name: "宝戒寺",
          memo: HOKAIJI_MEMO,
          lat: 35.3221163,
          lng: 139.55828,
          visitTime: t(13, 15),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16, transitLine: null }] },
        },
      },
      {
        id: tsurugaoka.id,
        data: {
          memo: tsurugaoka.memo!.replace(TSURUGAOKA_FROM, TSURUGAOKA_TO),
          visitTime: t(13, 57),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7, transitLine: null }] },
        },
      },
      {
        create: {
          name: "妙本寺",
          memo: MYOHONJI_MEMO,
          lat: 35.3171792,
          lng: 139.5572259,
          visitTime: t(15, 41),
          stayDurationMin: 50,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 14, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(engakuji.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      {
        create: {
          name: "甘縄神明神社",
          memo: AMANAWA_MEMO,
          lat: 35.314271,
          lng: 139.537122,
          visitTime: t(9, 30),
          stayDurationMin: 35,
        },
      },
      {
        id: kotokuin.id,
        data: {
          memo: KOTOKUIN_MEMO,
          visitTime: t(10, 10),
          stayDurationMin: 90,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5, transitLine: null }] },
        },
      },
      {
        id: hasedera.id,
        data: { memo: HASEDERA_MEMO, visitTime: t(11, 48), stayDurationMin: 85 },
      },
      {
        create: {
          name: "御霊神社",
          memo: GORYOJINJA_MEMO,
          lat: 35.3110327,
          lng: 139.533027,
          visitTime: t(13, 16),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }] },
        },
      },
      {
        create: {
          name: "成就院",
          memo: JOJUIN_MEMO,
          lat: 35.3090783,
          lng: 139.5312626,
          visitTime: t(13, 55),
          stayDurationMin: 35,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4, transitLine: null }] },
        },
      },
      {
        id: zeniarai.id,
        data: {
          memo: zeniarai.memo!.replace(ZENIARAI_FROM, ZENIARAI_TO),
          visitTime: t(15, 0),
          stayDurationMin: 90,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 30, transitLine: null }] },
        },
      },
    ];
    await setDaySpotOrder(kotokuin.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
