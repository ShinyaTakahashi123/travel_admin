/**
 * #349の続き。企画運営12:31・法務12:32の指摘に対応。
 * 1) 決まりA違反(水増し): 鵜戸神宮70→105分、道の駅フェニックス→90分、
 *    堀切峠→33分はいずれも水増し。鵜戸神宮70分・道の駅フェニックス60分
 *    (昼食+お土産)・堀切峠18分に戻し、空いた時間は実在の青島亜熱帯植物園
 *    (青島神社のすぐそば)・飫肥城下町(サンメッセ日南と鵜戸神宮の間、
 *    九州の小京都)を新規に追加して埋めた(5→7か所)。#376(d6c081e8)と
 *    ほぼ同じ道順のため、文章は書き分けた。
 * 2) 青島神社の御祭神の文が入り組んでいた。公式サイト(aoshima-jinja.jp)で
 *    確認し、「彦火々出見命とその后・豊玉姫命」に修正。
 * 3) サンメッセ日南の定休日(毎週水曜、公式確認)を本文に追加。
 * 4) 青島(岩場)・鵜戸神宮(石段と岩場)に、法務指摘の安全の一文を追加。
 *
 * 座標はすべてNominatimで確認(2026-10-01)。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-349d-af30d135.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "5d106f12-8bfb-464f-bfe0-67eafe3df1b2";
const AOSHIMA_ID = "850f6912-15cd-4e2b-a39a-491e28621050";
const HORIKIRI_ID = "b24f3cc8-ee36-4baa-8fc0-87df3cf20c60";
const PHOENIX_ID = "cfef78b1-a87d-4c5d-a181-c4b6a7979f99";
const SUNMESSE_ID = "485d8957-66d5-4f22-bcda-7011fa47e2ae";
const UDO_ID = "efaee18b-0a25-4c66-9d35-9c5df6ce7a9e";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const already = await prisma.spot.findFirst({ where: { name: "青島亜熱帯植物園", dayId: DAY1_ID } });
  if (already) {
    console.log("already applied, skipping");
    return;
  }

  const aoshima = await prisma.spot.findFirstOrThrow({ where: { id: AOSHIMA_ID } });
  const horikiri = await prisma.spot.findFirstOrThrow({ where: { id: HORIKIRI_ID } });
  const phoenix = await prisma.spot.findFirstOrThrow({ where: { id: PHOENIX_ID } });
  const sunmesse = await prisma.spot.findFirstOrThrow({ where: { id: SUNMESSE_ID } });
  const udo = await prisma.spot.findFirstOrThrow({ where: { id: UDO_ID } });

  const aoshimaOld2 =
    "青島は、周囲およそ1.5kmの小島で、島全体が青島神社の境内となっており、ビロウ樹をはじめとする熱帯・亜熱帯植物の群生地として、国の特別天然記念物に指定されています。御祭神は、海神の娘・豊玉姫命の妹とされる彦火火出見尊の后・豊玉姫命(山幸彦の后)で、縁結びの神社として親しまれています。境内の夫婦ビロウには、願いごとによって色の異なる紙縒(こより)を結ぶことができます。今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。南国情緒あふれる島内を歩き、海に囲まれた神社ならではの雰囲気を味わいましょう。見学を終えたら、車でおよそ9分の堀切峠へ向かいましょう。";
  const aoshimaNext2 =
    "青島は、周囲およそ1.5kmの小島で、島全体が青島神社の境内となっており、ビロウ樹をはじめとする熱帯・亜熱帯植物の群生地として、国の特別天然記念物に指定されています。御祭神は、海幸・山幸の神話で知られる彦火々出見命と、その后・豊玉姫命で、縁結びをはじめ、あらゆる和合をもたらす神様として信仰されています。境内の夫婦ビロウには、願いごとによって色の異なる紙縒(こより)を結ぶことができます。今も多くの人が参拝に訪れる祈りの場ですので、境内では静かに、敬意をもってお参りください。島を一周する参道の岩場は、波しぶきや潮で滑りやすいので、足元に気をつけましょう。南国情緒あふれる島内を歩き、海に囲まれた神社ならではの雰囲気を味わいましょう。見学を終えたら、車でおよそ2分の青島亜熱帯植物園へ向かいましょう。";
  if (!aoshima.memo?.includes(aoshimaOld2)) throw new Error("aoshima anchor not found");

  const horikiriOld = "青島神社からは、車でおよそ9分です。";
  const horikiriNext = "青島亜熱帯植物園からは、車でおよそ9分です。";
  if (!horikiri.memo?.includes(horikiriOld)) throw new Error("horikiri anchor not found");

  const phoenixOld = "道の駅フェニックスは、日南海岸を望む高台にある道の駅で、宮崎の特産品や海産物を扱う売店と、地元の食材を使った食事処が並んでいます。ここで昼食をとるとよいでしょう。展望デッキからは、堀切峠と同じく鬼の洗濯板と太平洋の景色を眺めることができ、フェニックスの木々に南国らしさを感じられます。お土産探しとランチを楽しみながら、ひと休みしましょう。見学を終えたら、車でおよそ21分のサンメッセ日南へ向かいましょう。";
  const phoenixNext =
    "道の駅フェニックスは、日南海岸を望む高台にある道の駅で、宮崎の特産品や海産物を扱う売店と、地元の食材を使った食事処が並んでいます。ここで昼食をとるとよいでしょう。展望デッキからは、堀切峠と同じく鬼の洗濯板と太平洋の景色を眺めることができ、フェニックスの木々に南国らしさを感じられます。お土産探しとランチを、手早く楽しみましょう。見学を終えたら、車でおよそ21分のサンメッセ日南へ向かいましょう。";
  if (!phoenix.memo?.includes(phoenixOld)) throw new Error("phoenix anchor not found");

  const sunmesseOld = "モアイ像と海の絶景が織りなす、南国ムード満点の風景を楽しみましょう。続いては、車でおよそ8分の鵜戸神宮へ向かいましょう。";
  const sunmesseNext =
    "モアイ像と海の絶景が織りなす、南国ムード満点の風景を楽しみましょう。定休日は毎週水曜日(祝日や特定期間は営業)のため、訪れる前に確かめましょう。続いては、車でおよそ19分の飫肥城下町へ向かいましょう。";
  if (!sunmesse.memo?.includes(sunmesseOld)) throw new Error("sunmesse anchor not found");

  const udoOld2 =
    "サンメッセ日南からは、車でおよそ8分です。鵜戸神宮は、太平洋の荒波が刻んだ断崖の洞窟の中に、朱塗りの本殿が埋め込まれるように建つ、全国でも珍しい神社です。御祭神は、海神の娘・豊玉姫命が、山幸彦との間に授かった御子・鵜葺草葺不合命で、出産のために建てた産屋の屋根が、鵜の羽で葺き終わる前に生まれたことから、この御名が付けられたと伝えられています。この洞窟こそが、その産屋の跡だと伝えられており、太平洋を望む断崖の岩肌に本殿が抱かれるように鎮座しています。参拝の名物は「運玉投げ」で、洞窟の入口から見える亀の形をした岩「霊石亀石」の背中のくぼみを目がけて、男性は左手、女性は右手で丸い玉を投げ、うまく入れば願いが叶うといわれています。波音に包まれながらお参りする、他にはない神社ならではの体験です。今も多くの人が参拝に訪れる祈りの場ですので、静かに、敬意をもってお参りください。日南海岸をめぐる一日は、ここで終わりです。帰りは、車でおよそ1時間の宮崎駅へ向かい、レンタカーを返却してから、帰路につきましょう。";
  const udoNext2 =
    "飫肥城下町からは、車でおよそ19分です。鵜戸神宮は、太平洋の荒波が刻んだ断崖の洞窟の中に、朱塗りの本殿が埋め込まれるように建つ、全国でも珍しい神社です。御祭神は、海神の娘・豊玉姫命が、山幸彦との間に授かった御子・鵜葺草葺不合命で、出産のために建てた産屋の屋根が、鵜の羽で葺き終わる前に生まれたことから、この御名が付けられたと伝えられています。この洞窟こそが、その産屋の跡だと伝えられており、太平洋を望む断崖の岩肌に本殿が抱かれるように鎮座しています。本殿へは急な石段を下りるので、足元に気をつけ、岩場や波打ち際には近づきすぎないようにしましょう。参拝の名物は「運玉投げ」で、洞窟の入口から見える亀の形をした岩「霊石亀石」の背中のくぼみを目がけて、男性は左手、女性は右手で丸い玉を投げ、うまく入れば願いが叶うといわれています。波音に包まれながらお参りする、他にはない神社ならではの体験です。今も多くの人が参拝に訪れる祈りの場ですので、静かに、敬意をもってお参りください。日南海岸をめぐる一日は、ここで終わりです。帰りは、車でおよそ1時間の宮崎駅へ向かい、レンタカーを返却してから、帰路につきましょう。";
  if (!udo.memo?.includes(udoOld2)) throw new Error("udo anchor not found");

  await setDaySpotOrder(DAY1_ID, [
    { id: aoshima.id, data: { memo: aoshima.memo.replace(aoshimaOld2, aoshimaNext2) } },
    {
      create: {
        name: "青島亜熱帯植物園",
        address: "宮崎市青島2-12-1",
        lat: 31.8014266,
        lng: 131.4696146,
        visitTime: t(10, 47),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 2,
        memo:
          "青島神社からは、車でおよそ2分です。青島亜熱帯植物園(宮交ボタニックガーデン青島)は、青島に自生する亜熱帯植物群落の保護研究を目的に整備された植物園です。ビロウやフェニックス、ナツメヤシなどのヤシ類が並び、ブーゲンビリアやハイビスカスが鮮やかな彩りを添えています。大温室には、国内最大級ともいわれるマンゴーの大木やプルメリアが生い茂り、南国の森に迷い込んだような雰囲気を味わえます。熱帯果樹温室では、パイナップルやパパイヤなどの果樹も見学できます。椰子と花々に包まれた、南国ムード満点の園内を散策しましょう。続いては、車でおよそ9分の堀切峠へ向かいましょう。",
      },
    },
    {
      id: horikiri.id,
      data: { visitTime: t(11, 31), stayDurationMin: 18, transitMode: "car", transitDurationMin: 9, memo: horikiri.memo.replace(horikiriOld, horikiriNext) },
    },
    { id: phoenix.id, data: { visitTime: t(11, 52), stayDurationMin: 60, memo: phoenix.memo.replace(phoenixOld, phoenixNext) } },
    { id: sunmesse.id, data: { visitTime: t(13, 13), stayDurationMin: 65, memo: sunmesse.memo.replace(sunmesseOld, sunmesseNext) } },
    {
      create: {
        name: "飫肥城下町",
        address: "日南市飫肥",
        lat: 31.6261254,
        lng: 131.3536227,
        visitTime: t(14, 37),
        stayDurationMin: 50,
        transitMode: "car",
        transitDurationMin: 19,
        memo:
          "サンメッセ日南からは、車でおよそ19分です。飫肥城下町は、江戸時代に飫肥藩五万一千石の城下町として栄えた町並みが今も残る地区で、「九州の小京都」とも呼ばれています。飫肥城の大手門や石垣、武家屋敷の白壁と水路が続く通りには、しっとりと落ち着いた城下町の雰囲気が漂っています。商人通りには、飫肥天(飫肥名物の揚げかまぼこ)などを扱う店が軒を連ね、食べ歩きも楽しめます。石畳の道をゆっくりと歩きながら、江戸時代から続く城下町の面影を感じてみましょう。続いては、車でおよそ19分の鵜戸神宮へ向かいましょう。",
      },
    },
    { id: udo.id, data: { visitTime: t(15, 46), stayDurationMin: 70, transitMode: "car", transitDurationMin: 19, memo: udo.memo.replace(udoOld2, udoNext2) } },
  ]);

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
