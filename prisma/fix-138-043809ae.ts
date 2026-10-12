/**
 * #138 043809aeの直し。もとはDay1が真栄田岬の1か所(10:00〜12:00)、
 * Day2が真栄田岬岬の上の1か所(09:30〜10:10)のみで両日とも4か所未満、
 * 終始案内役の話し方(んですよ・ください等)。
 * 既存の2678aee0(万座毛と沖縄美ら海水族館)が、琉球村・万座毛・
 * ナビービーチ・残波岬・座喜味城・アメリカンビレッジを使用済みのため、
 * Day1にタイガービーチ・ムーンビーチ・万座ビーチ(万座毛とは別の
 * 実際の浜)、Day2に仲泊遺跡・恩納村博物館・都屋漁港を追加。
 * 【申し送り】Day2は、岬の上+仲泊遺跡+博物館+都屋漁港の4か所で
 * 現実的な長さの滞在にしても14:19終了にしかならず、16:30〜17:00に
 * 136〜171分届かない。このエリアの主要な見どころは2678aee0が
 * ほぼ使用済みで、近隣に他の実在するまとまった行き先が見つからず。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MAEDA_MEMO =
  "那覇空港から車でおよそ1時間、恩納村の真栄田岬に着きます。最大の見どころは、海水の浸食によって自然にできた海食洞、通称「青の洞窟」です。洞窟の中に差し込んだ太陽の光が水中で反射することで、あたり一面が神秘的な青色に染まって見えます。洞窟へ向かうには、階段を約100段下りてビーチから泳いで向かう「ビーチエントリー」と、船で洞窟の近くまで運んでもらう「ボートエントリー」の二つの方法があります。ここは天候や海況によって利用できないことがあるので注意しましょう。青・黄・赤・オレンジの旗で毎日その日の海況が掲示されていて、強風や高波の日には赤旗が掲げられ遊泳禁止、階段も閉鎖されます。訪れる前に、その日の旗の色を確認しておきましょう。洞窟の景色を楽しみましょう。この後は、車でおよそ6分、タイガービーチへ向かいましょう。";

const TIGER_MEMO =
  "真栄田岬から車でおよそ6分、タイガービーチに着きます。サンゴが豊富で、海に入るとすぐに深くなる地形が特徴のビーチです。クマノミなど、水族館で見るような熱帯魚が目の前を泳ぐ姿を見られることもあり、シュノーケリングに人気のスポットです。このあたりには食事処もあるので、昼食をとりましょう。静かに、海の生き物たちの様子を楽しみましょう。この後は、歩いておよそ8分、ムーンビーチへ向かいましょう。";

const MOON_MEMO =
  "タイガービーチから歩いておよそ8分、ムーンビーチに着きます。弓のような三日月形をした、天然の砂浜のビーチです。椰子の木々が並ぶ、リゾート気分を味わえる景観が人気です。遊泳や日差しを避けての散策など、思い思いに過ごしましょう。この後は、車でおよそ16分、万座ビーチへ向かいましょう。";

const MANZA_MEMO =
  "ムーンビーチから車でおよそ16分、万座ビーチに着きます。サンゴ礁に囲まれた、白い砂浜のビーチです。断崖の景勝地として知られる万座毛の近くに広がる海で、透明度の高い水の中でシュノーケリングや遊泳を楽しめます。穏やかな時間を過ごしましょう。見学を終えたら、今夜の宿へ向かいましょう。";

const MISAKIUE_MEMO =
  "洞窟エリアから歩いてすぐ、真栄田岬の岬の上に着きます。こちらは海の中とはまた違う、緑豊かな景色が広がるエリアです。芝生の広場の周辺にはアダンが自生していて、初夏になるとヤエヤマノイバラの白い花が咲く様子も見られます。遊歩道沿いには東屋があり、亜熱帯植物を眺めながら休憩しつつ、西海岸の眺望を楽しめます。例年2〜3月末ごろにかけて、沖合にザトウクジラが姿を見せることがあるといわれています。確実に見られるわけではありませんが、この時期に訪れたなら、ベンチに座って海を眺めてみるのもよいでしょう。潮風を感じながら、青の洞窟とはまた違う真栄田岬の表情を味わいましょう。この後は、車でおよそ6分、仲泊遺跡へ向かいましょう。";

const NAKADOMARI_MEMO =
  "真栄田岬の岬の上から、車でおよそ6分、仲泊遺跡に着きます。昭和49年(1974)、翌年に控えた沖縄国際海洋博覧会の関連工事として行われた国道58号の改良工事の際に、2500〜3000年前のものと見られる住居跡や貝塚が見つかった遺跡です。保存を求める声を受けて、道路のルートは海側に大きく迂回する形に変更されました。縄文時代の土器も多く出土しています。静かに見学しましょう。この後は、歩いてすぐの恩納村博物館へ向かいましょう。";

const MUSEUM_MEMO =
  "仲泊遺跡から歩いてすぐ、恩納村博物館に着きます。仲泊遺跡に隣接する形で開設された、恩納村の歴史と暮らしを伝える博物館です。「恩納のくらし」ゾーンでは、生活道具や映像を通じてかつての村の暮らしを再現し、「恩納のみち」ゾーンでは、グスクや仲泊遺跡から出土した品々とともに、現代から古代へと歴史をたどることができます。郷土の歴史を、じっくり眺めてみましょう。この後は、車でおよそ15分、都屋漁港へ向かいましょう。";

const MIYAKO_MEMO =
  "恩納村博物館から車でおよそ15分、都屋漁港に着きます。読谷村都屋にある、地元の漁船が並ぶ漁港です。このあたりには食事処もあるので、昼食をとりましょう。漁港ならではの、沖縄の海の暮らしの風景を眺めてみましょう。見学を終えたら、車でおよそ50分、那覇空港へ向かい、帰りの飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '043809ae%'`);
  const itinId = rows[0].id;
  const maeda = await findSpotInItinerary(itinId, { spotName: "真栄田岬" });
  const misakiue = await findSpotInItinerary(itinId, { spotName: "真栄田岬 岬の上" });

  console.log("day1:", maeda.dayId, "day2:", misakiue.dayId);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    const day1: SpotOrderItem[] = [
      { id: maeda.id, data: { visitTime: t(9, 30), stayDurationMin: 100, memo: MAEDA_MEMO } },
      {
        create: {
          name: "タイガービーチ", lat: 26.4531334, lng: 127.80638, visitTime: t(11, 16), stayDurationMin: 90, memo: TIGER_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
        },
      },
      {
        create: {
          name: "ムーンビーチ", lat: 26.4509406, lng: 127.8020918, visitTime: t(12, 54), stayDurationMin: 100, memo: MOON_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
        },
      },
      {
        create: {
          name: "万座ビーチ", lat: 26.5062117, lng: 127.8591639, visitTime: t(14, 50), stayDurationMin: 100, memo: MANZA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 16 }] },
        },
      },
    ];
    await setDaySpotOrder(maeda.dayId, day1, { tx });

    const day2: SpotOrderItem[] = [
      { id: misakiue.id, data: { stayDurationMin: 70, memo: MISAKIUE_MEMO } },
      {
        create: {
          name: "仲泊遺跡", lat: 26.4361019, lng: 127.7919823, visitTime: t(10, 46), stayDurationMin: 45, memo: NAKADOMARI_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 6 }] },
        },
      },
      {
        create: {
          name: "恩納村博物館", lat: 26.4364524, lng: 127.7933886, visitTime: t(11, 34), stayDurationMin: 80, memo: MUSEUM_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
        },
      },
      {
        create: {
          name: "都屋漁港", lat: 26.3902159, lng: 127.7235585, visitTime: t(13, 9), stayDurationMin: 70, memo: MIYAKO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
    ];
    await setDaySpotOrder(misakiue.dayId, day2, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
