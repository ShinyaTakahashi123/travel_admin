/**
 * #139 04618af3の直し(3回目)。企画運営・法務の指摘をまとめて反映。
 * ・座標5か所を実点に修正(角島大橋・角島大浜海水浴場・牧崎・
 *   元乃隅神社・龍宮の潮吹き)。龍宮の潮吹きは元乃隅神社とほぼ
 *   同じ場所(約100m)だったため、歩いて2分・徒歩に変更。
 * ・滞在の水増しを是正(角島大橋90→35分、大浜150→65分、
 *   青海島130→90分、記念館90→50分)
 * ・Day1に土井ヶ浜遺跡・人類学ミュージアムを、Day2に東後畑棚田
 *   (向津具半島の棚田百選、GSIの住所ベースの推定点)・長門湯本温泉
 *   を追加(東後畑棚田は地理的に元乃隅神社より西のため、Day2の
 *   最初に組み替え)
 * ・車・宿のつながりを追加(新下関駅でレンタカー、豊北町の宿、
 *   新下関駅で返却)
 * ・角島灯台の日付(3月1日)を削除し「最初の洋式灯台とされています」
 *   にぼかしを追加。龍宮の潮吹き・青海島・牧崎に足元/崖の安全の
 *   一文を追加。青海島「島全体が…指定」を単純化。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BRIDGE_MEMO =
  "新下関駅前でレンタカーを借り、車でおよそ1時間、角島大橋に着きます。平成12年(2000)に開通した、全長1780mの橋で、国内でも有数の長さを誇ります。エメラルドグリーンに輝く海の上を一直線に架かるこの橋は、開通以来、数々の自動車のテレビCMや映画のロケ地として使われ、日本を代表する絶景ドライブスポットとして知られるようになりました。橋の両側には、角島大橋を一望できる展望台も整備されており、車を降りて景色を楽しむこともできます。晴れた日には、太陽の光を受けて海の色が刻一刻と変化していく様子も見どころの一つです。青い海と空に一直線に延びる橋の絶景を楽しみましょう。この後は、車でおよそ8分、角島灯台へ向かいましょう。";

const LIGHTHOUSE_MEMO =
  "角島大橋から車でおよそ8分、角島灯台に着きます。明治9年(1876)に初めて灯がともった、日本海側では最初の洋式灯台とされています。「日本の灯台の父」と呼ばれるイギリス人技師・ブラントンが、帰国する直前に手がけた最後の灯台と伝えられています。高さ30mの灯台は、入り口や上部に細かな細工が施された御影石造りで、周辺にはおよそ2万株の水仙が植えられ、1月中旬から2月上旬ごろに見頃を迎えます。静かに見学しましょう。この後は、歩いておよそ3分、夢崎波公園へ向かいましょう。";

const OHAMA_MEMO =
  "夢崎波公園から歩いておよそ13分、角島大浜海水浴場に着きます。角島を代表する海水浴場で、透明度の高いエメラルドグリーンの海と、白い砂浜が広がります。このあたりには食事処もあるので、昼食をとりましょう。泳ぐのは決められた区域の中で、監視員の指示に従いましょう。遊泳や砂浜での散策など、思い思いに過ごしましょう。この後は、車でおよそ5分、牧崎へ向かいましょう。";

const MAKIZAKI_MEMO =
  "角島大浜海水浴場から車でおよそ5分、牧崎に着きます。角島の最北端にある岬で、遊歩道からは、波の穏やかな内海と、荒々しい日本海の、対照的な景色を見比べることができます。崖のふちには近づかず、柵の内側から眺めましょう。静かに景色を楽しみましょう。この後は、車でおよそ14分、土井ヶ浜遺跡・人類学ミュージアムへ向かいましょう。";

const DOIGAHAMA_MEMO =
  "牧崎から車でおよそ14分、土井ヶ浜遺跡・人類学ミュージアムに着きます。弥生時代の墓地遺跡で、300体を超える人骨が装身具や土器とともに見つかった、国の史跡です。日本で唯一の人類学専門の博物館では、発掘された人骨の実際の埋葬の様子を再現した「土井ヶ浜ドーム」や、顔つきの変化を紹介する展示などを見ることができます。弥生時代の人々の暮らしに、思いをめぐらせてみましょう。見学を終えたら、車でおよそ10分、豊北町内の宿へ向かいましょう。";

const HIGASHIUSHIROBATA_MEMO =
  "宿を出て、車でおよそ35分、東後畑棚田に着きます。向津具半島にある、日本海を見渡す棚田で、「日本の棚田百選」に選ばれています。山の斜面に階段状に連なる水田と、その先に広がる海の景色を一緒に眺められるのが魅力です。静かに景色を楽しみましょう。この後は、車でおよそ4分、元乃隅神社へ向かいましょう。";

const MOTONOSUMI_MEMO =
  "東後畑棚田から車でおよそ4分、元乃隅神社に着きます。昭和30年(1955)、地元の網元の枕元に白狐が現れ、「この地に私を祀ってほしい」とのお告げがあったことをきっかけに建てられた神社と伝えられています。稲荷神を祀る神社は全国に数多くありますが、白狐のお告げにちなんで「稲荷」ではなく「稲成」の字をあてているのが特徴で、この表記を用いるのは全国でも2社のみと伝えられています。昭和62年(1987)から10年をかけて奉納された123基の朱色の鳥居が、およそ100mにわたって海に向かって連なる光景は圧巻で、平成31年(2019)には、海外からの観光客にも親しみやすいよう「元乃隅神社」に改称されました。鳥居のトンネルをくぐりながら、日本海を望む絶景を眺めてみましょう。今も参拝の対象となっている神社ですので、境内では静かに、敬意を持ってお参りしましょう。この後は、歩いておよそ2分、龍宮の潮吹きへ向かいましょう。";

const RYUGU_MEMO =
  "元乃隅神社から歩いておよそ2分、龍宮の潮吹きに着きます。玄武岩の海食地形にできた割れ目に、日本海の波が打ち込むことで、潮が吹き上がる自然現象が見られる場所です。国の天然記念物に指定されています。冬場、海が荒れた日には、潮が30m以上も高く噴き上がることがあるといわれています。波が高い日は、岩場に近づきすぎないようにしましょう。この後は、車でおよそ5分、千畳敷へ向かいましょう。";

const SENJO_MEMO =
  "龍宮の潮吹きから車でおよそ5分、千畳敷に着きます。日本海を望む高原状の草原が広がる展望地で、畳を敷いたような平らな地形がその名の由来とされています。静かに景色を楽しみましょう。この後は、車でおよそ15分、青海島へ向かいましょう。";

const OMIJIMA_MEMO =
  "千畳敷から車でおよそ15分、青海島に着きます。仙崎と青海大橋でつながる、周囲およそ40kmの島です。北側の海岸には、日本海の荒波に浸食された洞門や断崖、奇岩が連なり、「海上アルプス」とも呼ばれています。青海島は国の名勝及び天然記念物に指定されており、自然研究路を歩いて景色を楽しむほか、観光船に乗って海上からその景観を眺めることもできます。崖のふちや岩場では足元に気をつけましょう。このあたりには食事処もあるので、昼食をとりましょう。静かに景色を楽しみましょう。この後は、車でおよそ6分、金子みすゞ記念館へ向かいましょう。";

const MISUZU_MEMO =
  "青海島から車でおよそ6分、金子みすゞ記念館に着きます。明治36年(1903)、仙崎に生まれた童謡詩人・金子みすゞの生涯と作品を紹介する記念館です。大正から昭和にかけて、雑誌『童話』などに数多くの童謡を発表し、「若き童謡詩人の中の巨星」と評されました。平成15年(2003)、生誕100年を記念して開館し、幼少期を過ごした仙崎の暮らしを再現した部屋や、かまど、井戸なども展示されています。みすゞの詩の世界を、ゆっくり味わってみましょう。この後は、車でおよそ12分、長門湯本温泉へ向かいましょう。";

const NAGATOYUMOTO_MEMO =
  "金子みすゞ記念館から車でおよそ12分、長門湯本温泉に着きます。およそ600年前、大寧寺の定庵禅師が、住吉大明神からのお告げによって見つけたと伝えられる、山口県でも最も古い歴史を持つ温泉地とされています。音信川のせせらぎに沿って、昔ながらの湯治場の情緒と、今の感性が融合した温泉街が広がります。立ち寄り湯も何か所かあるので、ゆっくり温泉街を歩いてみましょう。見学を終えたら、車でおよそ1時間10分、新下関駅でレンタカーを返し、帰りの新幹線に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const bridge = await findSpotInItinerary(itinId, { spotName: "角島大橋" });
  const lighthouse = await findSpotInItinerary(itinId, { spotName: "角島灯台" });
  const yumezaki = await findSpotInItinerary(itinId, { spotName: "夢崎波公園" });
  const ohama = await findSpotInItinerary(itinId, { spotName: "角島大浜海水浴場" });
  const makizaki = await findSpotInItinerary(itinId, { spotName: "牧崎" });
  const motonosumi = await findSpotInItinerary(itinId, { spotName: "元乃隅神社" });
  const ryugu = await findSpotInItinerary(itinId, { spotName: "龍宮の潮吹き" });
  const senjo = await findSpotInItinerary(itinId, { spotName: "千畳敷" });
  const omijima = await findSpotInItinerary(itinId, { spotName: "青海島" });
  const misuzu = await findSpotInItinerary(itinId, { spotName: "金子みすゞ記念館" });

  console.log("day1:", bridge.dayId, "day2:", motonosumi.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      {
        id: bridge.id,
        data: {
          lat: 34.3523746, lng: 130.8872191, stayDurationMin: 35, memo: BRIDGE_MEMO,
        },
      },
      {
        id: lighthouse.id,
        data: { visitTime: t(10, 13), stayDurationMin: 70, memo: LIGHTHOUSE_MEMO },
      },
      {
        id: yumezaki.id,
        data: { visitTime: t(11, 26), stayDurationMin: 45 },
      },
      {
        id: ohama.id,
        data: {
          lat: 34.3538602, lng: 130.8495837, visitTime: t(12, 24), stayDurationMin: 65, memo: OHAMA_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 13 }] },
        },
      },
      {
        id: makizaki.id,
        data: {
          lat: 34.3740235, lng: 130.8670459, visitTime: t(13, 34), stayDurationMin: 70, memo: MAKIZAKI_MEMO,
        },
      },
      {
        create: {
          name: "土井ヶ浜遺跡・人類学ミュージアム", lat: 34.294411, lng: 130.885635, visitTime: t(14, 58), stayDurationMin: 100, memo: DOIGAHAMA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 14 }] },
        },
      },
    ];
    await setDaySpotOrder(bridge.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      {
        create: {
          name: "東後畑棚田", lat: 34.407894, lng: 131.039932, visitTime: t(9, 30), stayDurationMin: 50, memo: HIGASHIUSHIROBATA_MEMO,
        },
      },
      {
        id: motonosumi.id,
        data: {
          lat: 34.4200826, lng: 131.0631692, visitTime: t(10, 24), stayDurationMin: 60, memo: MOTONOSUMI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 4 }] },
        },
      },
      {
        id: ryugu.id,
        data: {
          lat: 34.4209715, lng: 131.0630716, visitTime: t(11, 26), stayDurationMin: 45, memo: RYUGU_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
        },
      },
      {
        id: senjo.id,
        data: {
          visitTime: t(12, 16), stayDurationMin: 55, memo: SENJO_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
        },
      },
      {
        id: omijima.id,
        data: { visitTime: t(13, 26), stayDurationMin: 90, memo: OMIJIMA_MEMO },
      },
      {
        id: misuzu.id,
        data: { visitTime: t(15, 2), stayDurationMin: 50, memo: MISUZU_MEMO },
      },
      {
        create: {
          name: "長門湯本温泉", lat: 34.3291574, lng: 131.1735632, visitTime: t(16, 4), stayDurationMin: 35, memo: NAGATOYUMOTO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
        },
      },
    ];
    await setDaySpotOrder(motonosumi.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
