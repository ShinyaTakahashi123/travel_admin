/**
 * #139 04618af3の直し。もとはDay1が角島大橋の1か所(10:00〜11:00)、
 * Day2が元乃隅神社の1か所(09:30〜10:20)のみで両日とも4か所未満、
 * 終始案内役の話し方。
 * Day1(角島)に角島灯台・夢崎波公園・角島大浜海水浴場・牧崎を追加し
 * 5か所に。Day2(長門市油谷・仙崎)に龍宮の潮吹き・千畳敷・青海島・
 * 金子みすゞ記念館を追加し5か所に。いずれも他の既存しおりで
 * 未使用を確認済み。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BRIDGE_MEMO =
  "角島大橋に着きます。平成12年(2000)に開通した、全長1780mの橋で、通行無料の橋としては国内でも有数の長さです。エメラルドグリーンに輝く海の上を一直線に架かるこの橋は、開通以来、数々の自動車のテレビCMや映画のロケ地として使われ、日本を代表する絶景ドライブスポットとして知られるようになりました。橋の両側には、角島大橋を一望できる展望台も整備されており、車を降りて景色を楽しむこともできます。晴れた日には、太陽の光を受けて海の色が刻一刻と変化していく様子も見どころの一つです。青い海と空に一直線に延びる橋の絶景を、心ゆくまで楽しみましょう。この後は、車でおよそ8分、角島灯台へ向かいましょう。";

const LIGHTHOUSE_MEMO =
  "角島大橋から車でおよそ8分、角島灯台に着きます。明治9年(1876)3月1日に初点灯した、日本海側では最初の洋式灯台です。「日本の灯台の父」と呼ばれるイギリス人技師・ブラントンが、帰国する直前に手がけた最後の灯台と伝えられています。高さ30mの灯台は、入り口や上部に細かな細工が施された御影石造りで、周辺にはおよそ2万株の水仙が植えられ、1月中旬から2月上旬ごろに見頃を迎えます。静かに見学しましょう。この後は、歩いておよそ3分、夢崎波公園へ向かいましょう。";

const YUMEZAKI_MEMO =
  "角島灯台から歩いておよそ3分、夢崎波公園に着きます。灯台に隣接する公園で、ハマユウやダルマギク、スイセン、ハマヒルガオなど、角島に自生する草花が一年を通じて咲いています。波をイメージした園内の設計で、アーチのある舗装路が整えられています。静かに散策しましょう。この後は、歩いておよそ12分、角島大浜海水浴場へ向かいましょう。";

const OHAMA_MEMO =
  "夢崎波公園から歩いておよそ12分、角島大浜海水浴場に着きます。角島を代表する海水浴場で、透明度の高いエメラルドグリーンの海と、白い砂浜が広がります。このあたりには食事処もあるので、昼食をとりましょう。泳ぐのは決められた区域の中で、監視員の指示に従いましょう。遊泳や砂浜での散策など、思い思いに過ごしましょう。この後は、車でおよそ5分、牧崎へ向かいましょう。";

const MAKIZAKI_MEMO =
  "角島大浜海水浴場から車でおよそ5分、牧崎に着きます。角島の最北端にある岬で、遊歩道からは、波の穏やかな内海と、荒々しい日本海の、対照的な景色を見比べることができます。静かに景色を楽しみましょう。見学を終えたら、今夜の宿へ向かいましょう。";

const MOTONOSUMI_MEMO =
  "元乃隅神社に着きます。昭和30年(1955)、地元の網元の枕元に白狐が現れ、「この地に私を祀ってほしい」とのお告げがあったことをきっかけに建てられた神社と伝えられています。稲荷神を祀る神社は全国に数多くありますが、白狐のお告げにちなんで「稲荷」ではなく「稲成」の字をあてているのが特徴で、この表記を用いるのは全国でも2社のみと伝えられています。昭和62年(1987)から10年をかけて奉納された123基の朱色の鳥居が、およそ100mにわたって海に向かって連なる光景は圧巻で、平成31年(2019)には、海外からの観光客にも親しみやすいよう「元乃隅神社」に改称されました。鳥居のトンネルをくぐりながら、日本海を望む絶景を眺めてみましょう。今も参拝の対象となっている神社ですので、境内では静かにお参りしましょう。この後は、車でおよそ4分、龍宮の潮吹きへ向かいましょう。";

const RYUGU_MEMO =
  "元乃隅神社から車でおよそ4分、龍宮の潮吹きに着きます。玄武岩の海食地形にできた割れ目に、日本海の波が打ち込むことで、潮が吹き上がる自然現象が見られる場所です。国の天然記念物に指定されています。冬場、海が荒れた日には、潮が30m以上も高く噴き上がることがあるといわれています。足元に気をつけながら、波の様子を眺めてみましょう。この後は、歩いておよそ3分、千畳敷へ向かいましょう。";

const SENJO_MEMO =
  "龍宮の潮吹きから歩いておよそ3分、千畳敷に着きます。日本海を望む高原状の草原が広がる展望地で、畳を敷いたような平らな地形がその名の由来とされています。静かに景色を楽しみましょう。この後は、車でおよそ15分、青海島へ向かいましょう。";

const OMIJIMA_MEMO =
  "千畳敷から車でおよそ15分、青海島に着きます。仙崎と青海大橋でつながる、周囲およそ40kmの島です。北側の海岸には、日本海の荒波に浸食された洞門や断崖、奇岩が連なり、「海上アルプス」とも呼ばれています。島全体が国の名勝及び天然記念物に指定されており、自然研究路を歩いて景色を楽しむことができます。このあたりには食事処もあるので、昼食をとりましょう。静かに景色を楽しみましょう。この後は、車でおよそ6分、金子みすゞ記念館へ向かいましょう。";

const MISUZU_MEMO =
  "青海島から車でおよそ6分、金子みすゞ記念館に着きます。明治36年(1903)、仙崎に生まれた童謡詩人・金子みすゞの生涯と作品を紹介する記念館です。大正から昭和にかけて、雑誌『童話』などに数多くの童謡を発表し、「若き童謡詩人の中の巨星」と評されました。平成15年(2003)、生誕100年を記念して開館し、幼少期を過ごした仙崎の暮らしを再現した部屋や、かまど、井戸なども展示されています。みすゞの詩の世界を、ゆっくり味わってみましょう。見学を終えたら、車で来た道を戻り、帰路につきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '04618af3%'`);
  const itinId = rows[0].id;
  const bridge = await findSpotInItinerary(itinId, { spotName: "角島大橋" });
  const motonosumi = await findSpotInItinerary(itinId, { spotName: "元乃隅神社" });

  console.log("day1:", bridge.dayId, "day2:", motonosumi.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { id: bridge.id, data: { visitTime: t(9, 30), stayDurationMin: 90, memo: BRIDGE_MEMO } },
      {
        create: {
          name: "角島灯台", lat: 34.3524934, lng: 130.8410492, visitTime: t(11, 8), stayDurationMin: 60, memo: LIGHTHOUSE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "夢崎波公園", lat: 34.3538425, lng: 130.8408132, visitTime: t(12, 11), stayDurationMin: 45, memo: YUMEZAKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "角島大浜海水浴場", lat: 34.3539092, lng: 130.8494616, visitTime: t(13, 8), stayDurationMin: 150, memo: OHAMA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
        },
      },
      {
        create: {
          name: "牧崎", lat: 34.3598289, lng: 130.8720929, visitTime: t(15, 43), stayDurationMin: 60, memo: MAKIZAKI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
        },
      },
    ];
    await setDaySpotOrder(bridge.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      { id: motonosumi.id, data: { stayDurationMin: 70, memo: MOTONOSUMI_MEMO } },
      {
        create: {
          name: "龍宮の潮吹き", lat: 34.4148213, lng: 131.0883863, visitTime: t(10, 44), stayDurationMin: 50, memo: RYUGU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 4 }] },
        },
      },
      {
        create: {
          name: "千畳敷", lat: 34.4143977, lng: 131.0903847, visitTime: t(11, 37), stayDurationMin: 55, memo: SENJO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "青海島", lat: 34.4180085, lng: 131.1936226, visitTime: t(12, 47), stayDurationMin: 130, memo: OMIJIMA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
      {
        create: {
          name: "金子みすゞ記念館", lat: 34.3915045, lng: 131.1985334, visitTime: t(15, 3), stayDurationMin: 90, memo: MISUZU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
        },
      },
    ];
    await setDaySpotOrder(motonosumi.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
