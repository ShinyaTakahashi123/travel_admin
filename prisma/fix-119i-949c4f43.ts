/**
 * #119 949c4f43の直し(9回目)。企画運営(2026-10-11)・法務(2026-10-11、記録2a660e3)の
 * 指摘4点+確かめの反映。
 *
 * ①旧佐世保無線電信所「ニイタカヤマノボレ…大和の出撃…」の文を削除(法務の指摘で
 *   「外してください」)。事実: ja.wikipedia.org/wiki/針尾送信所 によれば、この暗号は
 *   1941年の太平洋戦争開戦(真珠湾攻撃)の命令で、大和とは無関係。針尾から送信した
 *   という話も「定かではない」とされ、実際の送信は船橋送信所・依佐美送信所と考え
 *   られている。高さも136m→135〜137m(1,2号塔135m・3号塔137m)に修正
 * ②Day1の昼食を11:30〜13:30ごろに移す: 島瀬美術センターのあとに新規スポット
 *   「四ヶ町アーケード」(佐世保の中心部、昼食)を追加。パレスハウステンボスの
 *   滞在から昼食分を外し110→70分に短縮
 * ③Day2のさせぼ五番街: 「夕食」表記(14:51着で時間が合わない)と100分(決まりA)を
 *   直す。新規スポット「アルカスSASEBO」(佐世保駅周辺の見どころ、長崎県民文化
 *   ホール+佐世保地域交流センター、2001年開館、ja.wikipedia.org/wiki/アルカスSASEBO)
 *   を足し、させぼ五番街は70分・「おみやげ探しや軽い食事」に書き直す
 * ④「パールクイーン」表記ゆれを「パールクィーン」(公式表記、pearlsea.jp)に統一
 * ⑤座標: 法務がOSMのname:enタグで見つけた値に修正
 *   - パレスハウステンボス: node 1423797459(name:en "Palace Huis Ten Bosch")
 *     33.0795856, 129.7835755
 *   - ドムトールン: node 4693066189(name:en "Domtoren Observation Platform")
 *     33.084418, 129.7860579
 * ⑥ドムトールンのエレベーター定員・所要時間(30人・35秒)は出典が確かめられな
 *   かったため削除。宮殿の王冠の記述も「本物と同じ形・大きさ」(未確認)から、
 *   ja.wikipedia.org/wiki/ハウステンボス で確認できる「オランダの企業グループ
 *   から贈られた、日蘭友好の象徴」に直した
 * ⑦四ヶ町アーケードの座標はOSMに単独の点が無いため、徒歩1〜2分の位置にある
 *   佐世保中央駅(node 270861131、33.1710, 129.7207)を目印として使用(開示)。
 *   アルカスSASEBOはOSM建物way 639976049(name「アルカス佐世保」)の最初の
 *   ノード(33.1660068, 129.7236588)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HARIO_MEMO =
  "佐世保の四ヶ町アーケードから車でおよそ20分、旧佐世保無線電信所(針尾送信所)に着きます。大正7年(1918)に着工し、大正11年(1922)に完成した、高さ135〜137mの無線塔3基が、およそ300m間隔で正三角形に並んで立つ施設で、国の重要文化財に指定されています。かつて海軍の無線通信施設として使われました。巨大な鉄塔3基が並んで立つ姿は、ほかに類を見ない独特の景観です。この後は、車でおよそ5分、西海橋へ向かいましょう。";

const SHIKACHOU_MEMO =
  "佐世保市博物館島瀬美術センターから車でおよそ3分、佐世保の中心部・四ヶ町アーケードに着きます。佐世保を代表する商店街で、アーケードの下に飲食店や土産物店が並びます。佐世保の名物・レモンステーキや佐世保バーガーの店も多いので、ここで昼食にしましょう。";

const PALACE_MEMO =
  "西海橋から車でおよそ10分、パレスハウステンボスに着きます。オランダのハーグにある王室の宮殿「ハウステンボス宮殿」を忠実に再現した建物で、現在は美術館として利用されています。本物の宮殿は17世紀に建てられ、王族の住まいとして使われてきましたが、1733年に計画された後期ルネサンス様式の庭園は、財政上の事情などから実現せず、幻の庭園として歴史に残っていました。このパークでは、実現しなかったその庭園までも再現しています。ドームの頂には、オランダの企業グループから贈られた王冠が置かれ、日蘭両国の友好の象徴とされています。オランダ王室の許しを得て、宮殿の名前と建物の再現が行われました。オランダ王室ゆかりの優美な建築と、館内の美術展示を、あわせて味わいましょう。この後は、歩いておよそ5分、ドムトールンへ向かいましょう。";

const DOM_MEMO =
  "パレスハウステンボスから歩いておよそ5分、ドムトールンに着きます。オランダの古都ユトレヒトに実在する、同国で最も高い鐘楼とされる「ドム塔」をモデルにした展望塔です。本物のドム塔は1321年から1382年にかけて建てられ、高さはおよそ112mにおよびますが、ここハウステンボスのドムトールンは、周囲の街並みとのバランスを考慮して、高さおよそ105mに設計されています。地上80mの位置に設けられた展望室からは、ハウステンボスの街並みはもちろん、大村湾の雄大な景色まで一望でき、先ほど訪れたパレスハウステンボスの優美な姿も、上から眺めることができます。異国の空気をまとった塔からの絶景を、味わいましょう。今夜はこの近くの宿に泊まりましょう。";

const PEARLQUEEN_MEMO =
  "パールシーリゾートの桟橋から、遊覧船パールクィーンに乗り込みます。九十九島は、大小208の島々が織りなす多島海で、この船は島々の間を縫うように、およそ50分かけて南のコースをめぐります。甲板に立つと、潮風とともに、間近に迫る島影を楽しめます。甲板に出るときは、手すりを持ち、足元に気をつけましょう。船の時刻や所要時間は、季節や当日の運航によって変わることがあるので、公式の案内で確かめましょう。";

const ARCAS_MEMO =
  "海きららから車でおよそ20分、JR佐世保駅の近くにあるアルカスSASEBOに着きます。長崎県立の文化ホールと佐世保市の交流センターが入った複合施設で、2001年に開館しました。2,000席の大ホールは西九州最大級の規模で、フルオーケストラの演奏にも対応しています。催し物がなければ、ロビーや前の広場から、佐世保港の眺めを楽しみましょう。";

const GOBANGAI_MEMO =
  "アルカスSASEBOから歩いておよそ3分、させぼ五番街に着きます。海に面した商業施設で、おみやげ店や、海を眺めながら食事のできるカフェが並びます。長崎の旅の最後に、ここでおみやげ探しや軽い食事をしましょう。レンタカーを返して、帰りの電車や飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;

  const yumihari = await findSpotInItinerary(itinId, { spotName: "弓張岳展望台" });
  const sailtower = await findSpotInItinerary(itinId, { spotName: "海上自衛隊佐世保史料館" });
  const shimanose = await findSpotInItinerary(itinId, { spotName: "佐世保市博物館島瀬美術センター" });
  const hario = await findSpotInItinerary(itinId, { spotName: "旧佐世保無線電信所" });
  const saikaibashi = await findSpotInItinerary(itinId, { spotName: "西海橋" });
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const dom = await findSpotInItinerary(itinId, { spotName: "ドムトールン" });

  const kaicho = await findSpotInItinerary(itinId, { spotName: "展海峰" });
  const ishidake = await findSpotInItinerary(itinId, { spotName: "石岳展望台" });
  const kirara = await findSpotInItinerary(itinId, { spotName: "森きらら" });
  const pearlsea = await findSpotInItinerary(itinId, { spotName: "九十九島パールシーリゾート" });
  const pearlqueen = await findSpotInItinerary(itinId, { spotName: "九十九島遊覧船パールクィーン" });
  const umikirara = await findSpotInItinerary(itinId, { spotName: "海きらら" });
  const gobangai = await findSpotInItinerary(itinId, { spotName: "させぼ五番街" });

  if (!hario.memo?.includes("ニイタカヤマノボレ")) {
    throw new Error("旧佐世保無線電信所の文言が想定外です(既に直っている可能性)");
  }

  console.log("確認OK。Day1:", yumihari.dayId, "Day2:", kaicho.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // Day1
    await setDaySpotOrder(
      yumihari.dayId,
      [
        { id: yumihari.id, data: {} },
        { id: sailtower.id, data: {} },
        { id: shimanose.id, data: {} },
        {
          create: {
            name: "四ヶ町アーケード",
            memo: SHIKACHOU_MEMO,
            lat: 33.171,
            lng: 129.7207,
            visitTime: t(12, 16),
            stayDurationMin: 50,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3, transitLine: null }] },
          },
        },
        {
          id: hario.id,
          data: {
            memo: HARIO_MEMO,
            visitTime: t(13, 26),
            transitLegs: {
              deleteMany: {},
              create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }],
            },
          },
        },
        { id: saikaibashi.id, data: { visitTime: t(14, 11) } },
        {
          id: palace.id,
          data: { memo: PALACE_MEMO, stayDurationMin: 70, visitTime: t(14, 51), lat: 33.0795856, lng: 129.7835755 },
        },
        { id: dom.id, data: { memo: DOM_MEMO, visitTime: t(16, 6), lat: 33.084418, lng: 129.7860579 } },
      ],
      { tx }
    );

    // Day2
    await setDaySpotOrder(
      kaicho.dayId,
      [
        { id: kaicho.id, data: {} },
        { id: ishidake.id, data: {} },
        { id: kirara.id, data: {} },
        { id: pearlsea.id, data: {} },
        { id: pearlqueen.id, data: { memo: PEARLQUEEN_MEMO } },
        { id: umikirara.id, data: {} },
        {
          create: {
            name: "アルカスSASEBO",
            memo: ARCAS_MEMO,
            lat: 33.1660068,
            lng: 129.7236588,
            visitTime: t(14, 51),
            stayDurationMin: 30,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 20, transitLine: null }] },
          },
        },
        {
          id: gobangai.id,
          data: {
            memo: GOBANGAI_MEMO,
            stayDurationMin: 70,
            visitTime: t(15, 24),
            transitLegs: {
              deleteMany: {},
              create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3, transitLine: null }],
            },
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
