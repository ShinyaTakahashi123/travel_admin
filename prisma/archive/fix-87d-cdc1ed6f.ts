/**
 * #87 cdc1ed6f 企画運営の指摘9点(2026-09-30 19:55)への対応。全スポットの
 * 文体を「皆様、〜」調のツアーガイド口調から普通の書き方に直し、料金に
 * ふれる表現を削除、言い切りを和らげ、事実関係を出典で確認して修正、
 * 昼食の一言を正しい時間帯に配置、帰りの一言を実際のアクセスに合わせた。
 *
 * 事実確認(開いたURL):
 * - 千山丸(徳島城博物館の実際の展示物。「阿波公方御座船」という名称・
 *   「日本最大」「秀吉から拝領した能面」は出典が見当たらず削除):
 *   https://www.city.tokushima.tokushima.jp/smph/johaku/meihin/page05-00/johakusenzanmaru.html
 * - 徳島藩主蜂須賀家墓所(興源寺墓所+万年山墓所の構成、埋葬藩主の内訳):
 *   https://online.bunka.go.jp/heritages/detail/192572
 * - 万年山墓所の所在地(眉山・佐古山町、興源寺とは別の場所):
 *   https://funfun-tokushima.jp/introduce/%E4%B8%87%E5%B9%B4%E5%B1%B1/
 * - 瑞巌寺の歴史(至鎮が弟・義英の菩提のため1614年再興、鳳翔水は阿波名水の一つ):
 *   https://ja.wikipedia.org/wiki/%E7%91%9E%E5%B7%8C%E5%AF%BA_(%E5%BE%B3%E5%B3%B6%E5%B8%82)
 * - 瑞巌寺のアクセス(徳島駅から徒歩15分)・営業状況(庭園拝観が不可の時期が
 *   あるとの記載あり、訪問前の確認を強めに案内):
 *   https://rurubu.jp/andmore/spot/80035446
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");

const CASTLE_MEMO =
  "天正13年(1585)、17万石余の領主として阿波に入国した蜂須賀家政が築城に着手し、翌年に完成させた城で、以来明治に至るまでおよそ280年にわたり、14代続いた徳島藩主・蜂須賀家の居城となりました。標高およそ61mの城山を中心に、東西およそ640m、南北およそ550mの規模を誇り、山頂の本丸を中心に、いくつもの曲輪が連なる構造をしていました。石垣には、阿波特産の青石(緑色片岩)が野面積みで用いられ、青みを帯びた独特の色合いと風合いが特徴とされています。明治8年(1875)に城郭の建物は取り壊されましたが、表御殿庭園と石垣、堀の一部が今も残り、あわせて徳島城博物館も併設されています。青石の石垣に囲まれた城跡公園を、ゆっくりと散策してみてください。この後は、歩いておよそ8分、鷲の門へ向かいましょう。";

const WASHINOMON_MEMO =
  "徳島城跡から歩いておよそ8分、鷲の門に着きます。徳島城の正門にあたる高麗門で、門の上に鷲をかたどった飾りが置かれていたことからこの名がついたと伝えられています。明治8年(1875)の廃城の際、城郭のほとんどの建物が取り壊される中でこの門だけが残ったとされますが、昭和20年(1945)の徳島大空襲で焼失しました。平成元年(1989)、市政百周年を記念して、絵図をもとに木造で復元されています。徳島城の玄関口にふさわしい、堂々とした門構えです。この後は、歩いておよそ4分、徳島城博物館へ向かいましょう。";

const HAKUBUTSUKAN_MEMO =
  "鷲の門から歩いておよそ4分、徳島城博物館に着きます。徳島藩主・蜂須賀家に伝わる大名道具や、徳島城の歴史をたどる資料を常設展示する博物館です。参勤交代の様子を描いた絵巻や、藩政期の徳島の暮らしを伝える資料などを見学できます。屋外には、安政4年(1857)に建造された徳島藩の御召鯨船「千山丸」の展示もあり、参勤交代の際、藩主が徳島城から御座船に乗り移るまでの間に用いた船として、国の重要文化財に指定されています。全長10mあまりの船体に、金箔地へ軍配や団扇を描いた豪華な装飾が施されており、現存する大名船としては数少ない例とされています。この付近で昼食をとるのもよいでしょう。休館日は公式サイトで確かめてから訪れましょう。この後は、歩いてすぐ、旧徳島城表御殿庭園へ向かいましょう。";

const TEIEN_MEMO =
  "徳島城博物館に隣接する旧徳島城表御殿庭園に着きます。江戸時代の武将で茶人でもあった上田宗箇が作庭したと伝わる、国指定名勝の庭園です。枯山水庭と築山泉水庭の二つの庭からなり、藩主が来客をもてなす表御殿の庭として使われました。阿波青石(緑色片岩)を豪快に使った石組みが特徴的で、徳島藩の栄華をしのばせる庭園です。見学の案内は公式サイトで確かめてから訪れましょう。この後は、歩いてすぐ、バラ園と数寄屋橋へ向かいましょう。";

const BARA_MEMO =
  "表御殿庭園から歩いてすぐ、バラ園と数寄屋橋に着きます。バラ園には、春と秋を中心に約50種、400株のバラが植えられ、色とりどりの花が園内を彩ります。すぐそばに架かる数寄屋橋は、江戸時代の風情を今に伝える橋で、公園内の散策路に趣を添えています。徳島中央公園の中でも、城跡とはまた違った華やかな雰囲気が漂う一角です。この後は、歩いておよそ17分、興源寺へ向かいましょう。";

const KOGENJI_MEMO =
  "バラ園・数寄屋橋から歩いておよそ17分、助任川を渡った先にある興源寺に着きます。藩祖・蜂須賀家政をはじめ、歴代藩主の多くの墓が営まれている蜂須賀家の菩提寺です。境内の墓所は「徳島藩主蜂須賀家墓所」として国の史跡に指定されており、この指定には、眉山山麓にある万年山墓所(儒式の墓地)もあわせて含まれています。整然と並ぶ墓石が、260年余り続いた蜂須賀家の歴史の重みを伝えています。静かに、敬意をもってお参りください。この後は、歩いておよそ29分、ひょうたん島クルーズの乗り場、新町川水際公園へ向かいましょう。";

const CRUISE_MEMO =
  "興源寺から歩いておよそ29分、新町川水際公園に着きます。ここから出るひょうたん島クルーズは、新町川と助任川に囲まれた「ひょうたん島」と呼ばれる市街地の周囲、およそ6kmを30分かけてめぐる遊覧船です。この川筋は、かつて徳島城の外堀としての役割も担っていたとされ、水上から見上げる徳島の城下町は、陸から歩くのとはまた違う趣があります。原則無休で運航していますが、天候により運休することもあるので、訪れる前に確かめておくと安心です。この後は、歩いておよそ9分、瑞巌寺へ向かいましょう。";

const ZUIGANJI_MEMO =
  "新町川水際公園から歩いておよそ9分、瑞巌寺に着きます。慶長19年(1614)、徳島藩初代藩主・蜂須賀至鎮が、弟・義英の菩提を弔うために一鶚禅師を開山として再興したと伝わる、臨済宗妙心寺派の寺院です。山麓の斜面を巧みに生かした境内には、江戸時代初期に築かれた池泉回遊式の庭園が広がり、阿波の名水の一つに数えられる湧き水「鳳翔水」が池を潤しています。境内にはキリスト教が禁じられていた時代、地蔵菩薩に見せかけてマリア像を刻んだと伝わる「切支丹灯籠」も残されています。時期により庭園を見学できないこともあるようなので、訪れる前に必ず確かめましょう。静かに、敬意をもってお参りください。徳島城跡から鷲の門、博物館、庭園、興源寺の蜂須賀家墓所とめぐった旅は、ここで終了です。徳島駅までは徒歩でおよそ15分です。";

const NEW_DESCRIPTION =
  "蜂須賀家政が築いた徳島城の跡地に広がる徳島中央公園から、蜂須賀家墓所の興源寺、瑞巌寺、ひょうたん島クルーズまで。眉山や阿波おどりとは違う、徳島藩の歴史をたどるプランです。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cdc1ed6f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const castle = await findSpotInItinerary(itinId, { spotName: "徳島城跡（徳島中央公園）" });
  const washinomon = await findSpotInItinerary(itinId, { spotName: "鷲の門" });
  const hakubutsukan = await findSpotInItinerary(itinId, { spotName: "徳島城博物館" });
  const teien = await findSpotInItinerary(itinId, { spotName: "旧徳島城表御殿庭園" });
  const bara = await findSpotInItinerary(itinId, { spotName: "バラ園・数寄屋橋" });
  const kogenji = await findSpotInItinerary(itinId, { spotName: "興源寺" });
  const cruise = await findSpotInItinerary(itinId, { spotName: "ひょうたん島クルーズ" });
  const zuiganji = await findSpotInItinerary(itinId, { spotName: "瑞巌寺" });

  const day1Spots: SpotOrderItem[] = [
    { id: castle.id, data: { memo: CASTLE_MEMO } },
    { id: washinomon.id, data: { memo: WASHINOMON_MEMO } },
    { id: hakubutsukan.id, data: { memo: HAKUBUTSUKAN_MEMO } },
    { id: teien.id, data: { memo: TEIEN_MEMO } },
    { id: bara.id, data: { memo: BARA_MEMO } },
    { id: kogenji.id, data: { memo: KOGENJI_MEMO } },
    { id: cruise.id, data: { memo: CRUISE_MEMO } },
    { id: zuiganji.id, data: { memo: ZUIGANJI_MEMO } },
  ];

  console.log("スポット文体の書き換え: 8件");
  console.log("説明文の更新あり");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await tx.itinerary.update({ where: { id: itinId }, data: { description: NEW_DESCRIPTION } });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
