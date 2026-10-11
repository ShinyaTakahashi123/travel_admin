/**
 * #138 043809aeの直し(4回目)。企画運営・法務の指摘をまとめて反映。
 * ・座喜味城跡の書き出しが2678aee0とほぼ同じ言い回しだったため言い換え、
 *   護佐丸の後年の経歴(中城城・今帰仁城)を追加
 * ・やちむんの里の一文が2678aee0と全く同じだったため言い換え、
 *   陶器市の一文を追加
 * ・浦添グスク・ようどれ館(96→90分)に、浦添城跡を歩く・ようどれを
 *   外から見る実際の見学内容を追加し、資料館だけの話にならないよう
 *   に調整。道の駅かでな65→45分に短縮
 * ・真栄田岬岬の上: このしおりは夏季限定のため2〜3月のザトウクジラの
 *   話を削除、案内役の言い方(ベンチに座ってみるのもよいでしょう)を
 *   削除、2日目の書き出しに宿からの移動を追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MISAKIUE_MEMO =
  "宿を出て、車でおよそ15分、真栄田岬の岬の上に着きます。こちらは海の中とはまた違う、緑豊かな景色が広がるエリアです。芝生の広場の周辺にはアダンが自生していて、初夏になるとヤエヤマノイバラの白い花が咲く様子も見られます。遊歩道沿いには東屋があり、亜熱帯植物を眺めながら休憩しつつ、西海岸の眺望を楽しめます。潮風を感じながら、青の洞窟とはまた違う真栄田岬の表情を味わいましょう。この後は、車でおよそ10分、座喜味城跡へ向かいましょう。";

const ZAKIMI_MEMO =
  "真栄田岬の岬の上から、車でおよそ10分、座喜味城跡に着きます。護佐丸が15世紀前半に築いたとされるグスクです。築城の名人として知られる護佐丸は、後に中城城・今帰仁城の増築にも関わったと伝えられています。本丸は、第二次世界大戦中は日本軍の陣地となり、戦後は米軍の基地として使われていた時期もありました。世界遺産「琉球王国のグスク及び関連遺産群」の一つとして、昭和48年(1973)から13年をかけて復元されました。城壁の上は柵のない所もあるので、足元に気をつけ、立ち入りできない場所には入らないようにしましょう。静かに見学しましょう。この後は、車でおよそ3分、やちむんの里へ向かいましょう。";

const YACHIMUN_MEMO =
  "座喜味城跡から車でおよそ3分、やちむんの里に着きます。沖縄初の人間国宝として知られる陶工・金城次郎が、この地に登り窯「金城次郎窯」を構えたことをきっかけに、多くの陶工が集まるようになりました。昭和55年(1980)には、名工4人が共同で9連の登り窯「読谷山焼窯」を築き、「やちむんの里」と呼ばれるようになったと伝えられています。毎年12月には、陶器市も開催されています。工房は一つずつ違う窯元が営んでいるので、見学できる時間はそれぞれ異なります。訪れる前に、公式の案内で確かめましょう。木々に囲まれた散策路を歩きながら、工房を一つずつのぞいてみましょう。このあたりには食事処もあるので、昼食をとりましょう。作業の邪魔にならないよう、静かに見て回りましょう。この後は、車でおよそ9分、道の駅かでなへ向かいましょう。";

const URASOE_MEMO =
  "道の駅かでなから車でおよそ22分、浦添グスク・ようどれ館に着きます。琉球王国が首里城に移る前、政権の拠点だった浦添城の跡です。崖の上に広がる城跡を歩いたあと、崖の中腹にある王族の陵墓「浦添ようどれ」を外から眺めてみましょう。13世紀後半に英祖王が築いたと伝えられ、1620年ごろに尚寧王が改修しました。この一帯は、太平洋戦争の沖縄戦で「前田高地」と呼ばれた激しい戦いの地でもありました。資料館では、平成17年(2005)の復元にあわせて、英祖王の墓の内部が実物大で再現され、出土した石棺なども展示されています。静かに、敬意を持って見学しましょう。見学を終えたら、車でおよそ20分、那覇市内か那覇空港でレンタカーを返し、帰りの飛行機に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '043809ae%'`);
  const itinId = rows[0].id;
  const misakiue = await findSpotInItinerary(itinId, { spotName: "真栄田岬 岬の上" });
  const zakimi = await findSpotInItinerary(itinId, { spotName: "座喜味城跡" });
  const yachimun = await findSpotInItinerary(itinId, { spotName: "やちむんの里" });
  const kadena = await findSpotInItinerary(itinId, { spotName: "道の駅かでな" });
  const urasoe = await findSpotInItinerary(itinId, { spotName: "浦添グスク・ようどれ館" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: misakiue.id }, data: { memo: MISAKIUE_MEMO } }),
    prisma.spot.update({ where: { id: zakimi.id }, data: { stayDurationMin: 65, memo: ZAKIMI_MEMO } }),
    prisma.spot.update({ where: { id: yachimun.id }, data: { visitTime: t(11, 48), stayDurationMin: 117, memo: YACHIMUN_MEMO } }),
    prisma.spot.update({ where: { id: kadena.id }, data: { visitTime: t(13, 54), stayDurationMin: 45 } }),
    prisma.spot.update({ where: { id: urasoe.id }, data: { visitTime: t(15, 1), stayDurationMin: 90, memo: URASOE_MEMO } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
