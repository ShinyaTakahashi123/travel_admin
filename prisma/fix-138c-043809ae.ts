/**
 * #138 043809aeの直し(3回目)。
 * ・法務の指摘: 海に入る際の安全の一文をDay1の4か所に追加。
 *   真栄田岬 岬の上の座標を、名前のない点からOSMの実点(viewpoint)に修正。
 * ・企画運営の指摘(案(c)): Day2を那覇空港方向へ南下するルートに組み直し。
 *   仲泊遺跡・恩納村博物館・都屋漁港(見学の中身が少ない)を外し、
 *   座喜味城跡(2678aee0が使用済みだが、戦中・戦後の基地利用という
 *   別の事実で執筆)・やちむんの里(同、金城次郎・読谷山焼窯の由来で執筆)・
 *   道の駅かでな・浦添グスク・ようどれ館(いずれも新規)を追加。
 *   最後は那覇空港・那覇市内でレンタカーを返す形に。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

// --- Day1: 安全の一文を追加 ---
const MAEDA_FROM = "訪れる前に、その日の旗の色を確認しておきましょう。洞窟の景色を楽しみましょう。";
const MAEDA_TO = "訪れる前に、その日の旗の色を確認しておきましょう。ボートに乗るときは、係の人の案内に従いましょう。海に慣れていない人は、ガイドのツアーを利用し、ライフジャケットを着けて、一人では泳がないようにしましょう。洞窟の景色を楽しみましょう。";

const TIGER_FROM = "このあたりには食事処もあるので、昼食をとりましょう。静かに、海の生き物たちの様子を楽しみましょう。";
const TIGER_TO = "このあたりには食事処もあるので、昼食をとりましょう。泳ぐのは決められた区域の中で、監視員の指示に従い、サンゴや生き物にはふれないようにしましょう。静かに、海の生き物たちの様子を楽しみましょう。";

const MOON_FROM = "遊泳や日差しを避けての散策など、思い思いに過ごしましょう。この後は、車でおよそ16分、万座ビーチへ向かいましょう。";
const MOON_TO = "遊泳や日差しを避けての散策など、思い思いに過ごしましょう。泳ぐのは決められた区域の中で、監視員の指示に従いましょう。この後は、車でおよそ16分、万座ビーチへ向かいましょう。";

const MANZA_FROM = "透明度の高い水の中でシュノーケリングや遊泳を楽しめます。穏やかな時間を過ごしましょう。";
const MANZA_TO = "透明度の高い水の中でシュノーケリングや遊泳を楽しめます。泳ぐのは決められた区域の中で、監視員の指示に従い、サンゴや生き物にはふれないようにしましょう。穏やかな時間を過ごしましょう。";

// --- Day2: 全面組み直し ---
const MISAKIUE_MEMO =
  "洞窟エリアから歩いてすぐ、真栄田岬の岬の上に着きます。こちらは海の中とはまた違う、緑豊かな景色が広がるエリアです。芝生の広場の周辺にはアダンが自生していて、初夏になるとヤエヤマノイバラの白い花が咲く様子も見られます。遊歩道沿いには東屋があり、亜熱帯植物を眺めながら休憩しつつ、西海岸の眺望を楽しめます。例年2〜3月末ごろにかけて、沖合にザトウクジラが姿を見せることがあるといわれています。確実に見られるわけではありませんが、この時期に訪れたなら、ベンチに座って海を眺めてみるのもよいでしょう。潮風を感じながら、青の洞窟とはまた違う真栄田岬の表情を味わいましょう。この後は、車でおよそ10分、座喜味城跡へ向かいましょう。";

const ZAKIMI_MEMO =
  "真栄田岬の岬の上から、車でおよそ10分、座喜味城跡に着きます。15世紀の初め、築城の名人として知られる按司・護佐丸が築いた城の跡です。本丸は、第二次世界大戦中は日本軍の陣地となり、戦後は米軍の基地として使われていた時期もありました。世界遺産「琉球王国のグスク及び関連遺産群」の一つとして、昭和48年(1973)から13年をかけて復元されました。城壁の上は柵のない所もあるので、足元に気をつけ、立ち入りできない場所には入らないようにしましょう。静かに見学しましょう。この後は、車でおよそ3分、やちむんの里へ向かいましょう。";

const YACHIMUN_MEMO =
  "座喜味城跡から車でおよそ3分、やちむんの里に着きます。沖縄初の人間国宝として知られる陶工・金城次郎が、この地に登り窯「金城次郎窯」を構えたことをきっかけに、多くの陶工が集まるようになりました。昭和55年(1980)には、名工4人が共同で9連の登り窯「読谷山焼窯」を築き、「やちむんの里」と呼ばれるようになったと伝えられています。工房はそれぞれ独立して営業していて、営業時間や休みも工房ごとに違うので、公式の案内で確かめましょう。このあたりには食事処もあるので、昼食をとりましょう。作業の邪魔にならないよう、静かに見て回りましょう。この後は、車でおよそ9分、道の駅かでなへ向かいましょう。";

const KADENA_MEMO =
  "やちむんの里から車でおよそ9分、道の駅かでなに着きます。嘉手納基地の離着陸の様子を展望台から見ることができる施設で、平成15年(2003)に開館しました。4階の展望場からは米軍の飛行場を一望でき、3階の学習展示室では、町の面積の多くを基地が占める嘉手納町の歴史を学ぶこともできます。静かに見学しましょう。この後は、車でおよそ22分、浦添グスク・ようどれ館へ向かいましょう。";

const URASOE_MEMO =
  "道の駅かでなから車でおよそ22分、浦添グスク・ようどれ館に着きます。浦添城の北側の崖の中腹にある「浦添ようどれ」は、琉球王族の陵墓です。13世紀後半、英祖王が築いたと伝えられ、1620年ごろに尚寧王が改修しました。平成17年(2005)の復元工事にあわせて開館したこの資料館では、英祖王の墓の内部が実物大で再現され、出土した石棺なども展示されています。静かに、敬意を持って見学しましょう。見学を終えたら、車でおよそ20分、那覇市内か那覇空港でレンタカーを返し、帰りの飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '043809ae%'`);
  const itinId = rows[0].id;

  const maeda = await findSpotInItinerary(itinId, { spotName: "真栄田岬" });
  const tiger = await findSpotInItinerary(itinId, { spotName: "タイガービーチ" });
  const moon = await findSpotInItinerary(itinId, { spotName: "ムーンビーチ" });
  const manza = await findSpotInItinerary(itinId, { spotName: "万座ビーチ" });
  const misakiue = await findSpotInItinerary(itinId, { spotName: "真栄田岬 岬の上" });
  const nakadomari = await findSpotInItinerary(itinId, { spotName: "仲泊遺跡" });
  const museum = await findSpotInItinerary(itinId, { spotName: "恩納村博物館" });
  const miyako = await findSpotInItinerary(itinId, { spotName: "都屋漁港" });

  if (!maeda.memo?.includes(MAEDA_FROM)) throw new Error("真栄田岬の文言が想定外です");
  if (!tiger.memo?.includes(TIGER_FROM)) throw new Error("タイガービーチの文言が想定外です");
  if (!moon.memo?.includes(MOON_FROM)) throw new Error("ムーンビーチの文言が想定外です");
  if (!manza.memo?.includes(MANZA_FROM)) throw new Error("万座ビーチの文言が想定外です");

  console.log("day2:", misakiue.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: maeda.id }, data: { memo: maeda.memo!.replace(MAEDA_FROM, MAEDA_TO) } });
    await tx.spot.update({ where: { id: tiger.id }, data: { memo: tiger.memo!.replace(TIGER_FROM, TIGER_TO) } });
    await tx.spot.update({ where: { id: moon.id }, data: { memo: moon.memo!.replace(MOON_FROM, MOON_TO) } });
    await tx.spot.update({ where: { id: manza.id }, data: { memo: manza.memo!.replace(MANZA_FROM, MANZA_TO) } });

    const day2: SpotOrderItem[] = [
      {
        id: misakiue.id,
        data: { lat: 26.443906, lng: 127.772051, stayDurationMin: 60, memo: MISAKIUE_MEMO },
      },
      {
        create: {
          name: "座喜味城跡", lat: 26.408455, lng: 127.741607, visitTime: t(10, 40), stayDurationMin: 60, memo: ZAKIMI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "やちむんの里", lat: 26.406903, lng: 127.754266, visitTime: t(11, 43), stayDurationMin: 95, memo: YACHIMUN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "道の駅かでな", lat: 26.3679497, lng: 127.7742506, visitTime: t(13, 27), stayDurationMin: 65, memo: KADENA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 9 }] },
        },
      },
      {
        create: {
          name: "浦添グスク・ようどれ館", lat: 26.2487783, lng: 127.7289505, visitTime: t(14, 54), stayDurationMin: 96, memo: URASOE_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 22 }] },
        },
      },
    ];
    await setDaySpotOrder(misakiue.dayId, day2, { tx, remove: [nakadomari.id, museum.id, miyako.id] });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
