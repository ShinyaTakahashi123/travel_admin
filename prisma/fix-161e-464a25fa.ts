/**
 * #161の続き。企画運営の指摘(決まりA、滞在が全体に時間合わせになっている)
 * に対応。パディングだった滞在を短くし、空いた時間には実在の行き先を
 * 追加した(宝生院のシンパク・肥土山と中山の農村歌舞伎舞台・西光寺・
 * 小豆島霊場の観音寺/常光寺)。あわせて法務の指摘(オリーブ公園のヘッジ・
 * 座標7か所)にも対応。
 *
 * ①小豆島オリーブ公園: 「日本で初めて...成功したのが」→「したとされるのが」
 *   (同じ文にヘッジがなかったため)。座標もw251111311の中心に修正。
 * ②座標: 迷路のまち→妖怪美術館02 w966167850の中心、土庄の町で昼食→
 *   実在の店(入船)の点、馬木で昼食→実在の店(さぬき庵)の点、
 *   二十四の瞳映画村→w426547200の中心、坂手港→坂手の地点(法務指摘の点)
 *   に修正。
 * ③Day1: 迷路のまち100分→50分、昼食80分→70分、オリーブ公園155分→80分に
 *   短縮。空いた時間に西光寺(小豆島霊場58番、三重塔)・宝生院のシンパク
 *   (国の特別天然記念物の巨木)・肥土山の農村歌舞伎舞台(国指定、中山と
 *   並ぶ島に2つだけの舞台)・中山の農村歌舞伎舞台を追加し、9か所に。
 * ④Day2: 映画村110分→85分、昼食90分→75分、醤の郷90分→65分、
 *   坂手港65分→50分に短縮。空いた時間に小豆島霊場の観音寺(3番)・
 *   常光寺(8番)を追加し、7か所に。
 *
 * 新しい時刻:
 * Day1(09:20〜16:31、9か所): 土渕海峡→迷路のまち→昼食→西光寺→
 *   宝生院のシンパク→肥土山の農村歌舞伎舞台→中山の農村歌舞伎舞台→
 *   中山千枚田→小豆島オリーブ公園
 * Day2(09:30〜16:30、7か所): 二十四の瞳映画村→岬の分教場→昼食→
 *   醤の郷→観音寺→坂手港→常光寺
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-161e-464a25fa.ts
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "322356ed-3fb4-4c5a-afe4-edc2b31855a8";
const DAY2_ID = "c9f825d6-5aa0-4e33-b608-cfcadc4977f3";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const kaikyo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "土渕海峡" } });
  const meiro = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "迷路のまち" } });
  const lunch1 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "土庄の町で昼食" } });
  const tanada = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "中山千枚田" } });
  const olive = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "小豆島オリーブ公園" } });
  const eigamura = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "二十四の瞳映画村" } });
  const bunkyojo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "岬の分教場" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "馬木で昼食" } });
  const shoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "醤の郷" } });
  const sakate = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "坂手港" } });

  if (meiro.stayDurationMin === 50) {
    console.log("already applied, skipping");
    return;
  }

  // ---------- Day1 ----------
  await setDaySpotOrder(DAY1_ID, [
    { id: kaikyo.id, data: {} },
    {
      id: meiro.id,
      data: {
        lat: 34.4851942,
        lng: 134.1857019,
        stayDurationMin: 50,
      },
    },
    {
      id: lunch1.id,
      data: {
        lat: 34.4811223,
        lng: 134.1882788,
        visitTime: T(10, 38),
        stayDurationMin: 70,
        memo: "迷路のまちから歩いて7分ほど、お昼は土庄の町で食事をとりましょう。手延べそうめんや小豆島産オリーブを使った料理など、島ならではの味を楽しめる店が点在しています。ゆっくりと食事をとったら、歩いて西光寺へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    },
    {
      create: {
        name: "西光寺",
        address: "土庄町淵崎",
        lat: 34.4830691,
        lng: 134.1872718,
        visitTime: T(11, 51),
        stayDurationMin: 25,
        memo: "土庄の町から歩いて3分ほど、次に訪れるのは西光寺です。小豆島霊場の第58番札所で、小高い丘の上に三重塔が建っています。寺の西側には、ゆるやかにカーブした石塀が続く路地があり、石塀越しに三重塔を望む、静かで趣のある眺めを楽しめます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車で宝生院のシンパクへ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 3 }] },
      },
    },
    {
      create: {
        name: "宝生院のシンパク",
        address: "土庄町北山",
        lat: 34.4932326,
        lng: 134.1974743,
        visitTime: T(12, 21),
        stayDurationMin: 20,
        memo: "西光寺から車でおよそ5分、次に訪れるのは宝生院のシンパクです。宝生院の境内にそびえる、国の特別天然記念物に指定された真柏(シンパク)の巨木で、幹まわりおよそ16.9m、樹高およそ20.9m、推定樹齢は1600年を超えるとされています。地上1mほどの高さで3方向に幹が分かれており、遠目には1本の木には見えないほどの迫力があります。枝ぶりをよく見ると、象や龍、亀など仏教にゆかりのある生きものの姿が見えるともいわれています。境内の大切な木ですので、静かに、敬意をもって見学しましょう。見学を終えたら、車で肥土山の農村歌舞伎舞台へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
      },
    },
    {
      create: {
        name: "肥土山の農村歌舞伎舞台",
        address: "土庄町肥土山",
        lat: 34.5033284,
        lng: 134.2306045,
        visitTime: T(12, 51),
        stayDurationMin: 40,
        memo: "宝生院のシンパクから車でおよそ10分、次に訪れるのは肥土山地区です。離宮八幡神社の境内には、江戸時代から200年以上にわたって島の人々が演じ継いできた農村歌舞伎の舞台が残されています。小豆島には、ここ肥土山と、このあと訪れる中山の2か所にしか農村歌舞伎の舞台が残っておらず、どちらも国の重要有形民俗文化財に指定されている、全国的にも珍しい場所です。肥土山では毎年5月3日に、舞台いっぱいに幕が張られ、地元の人々による歌舞伎が上演されます。上演のない日は、境内から静かに舞台を眺めることができます。今も祈りが続く神社ですので、静かに、敬意をもって見学しましょう。見学を終えたら、車で中山の農村歌舞伎舞台へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 10 }] },
      },
    },
    {
      create: {
        name: "中山の農村歌舞伎舞台",
        address: "小豆島町中山",
        lat: 34.5034186,
        lng: 134.2394860,
        visitTime: T(13, 34),
        stayDurationMin: 20,
        memo: "肥土山から車でおよそ3分、次に訪れるのは中山の農村歌舞伎舞台です。先ほどの肥土山と同じく、江戸時代から伝わる農村歌舞伎の舞台で、春日神社の境内にあります。中山では毎年10月の第2日曜日に上演が行われ、棚田に囲まれたこの土地ならではの、のどかな雰囲気の中で歌舞伎が楽しまれてきました。今も祈りが続く神社の境内ですので、静かに、敬意をもって見学しましょう。見学を終えたら、歩いて中山千枚田へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3 }] },
      },
    },
    {
      id: tanada.id,
      data: {
        visitTime: T(13, 56),
        stayDurationMin: 60,
        memo: "中山農村歌舞伎舞台から歩いてすぐ、次に訪れるのは中山千枚田です。山あいの斜面におよそ770枚の田んぼが連なる棚田で、「日本の棚田百選」にも選ばれています。たびたび渇水に見舞われてきた小豆島で、中山地区の人々が力を合わせて切り開いてきた棚田で、湧き水を利用した「湯船の水」が、今も田を潤しています。田植えの時期には水面がきらめき、稲刈りの頃には黄金色に染まるなど、季節ごとに違う彩りを見せてくれます。見学を終えたら、車で小豆島オリーブ公園へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      id: olive.id,
      data: {
        lat: 34.4728188,
        lng: 134.2737214,
        visitTime: T(15, 11),
        stayDurationMin: 80,
        memo: "中山千枚田から車でおよそ15分、次に訪れるのは小豆島オリーブ公園です。日本で初めてオリーブの栽培と搾油に成功したとされるのがこの小豆島で、明治41年(1908)、アメリカから輸入された苗木を植えたことがその始まりと伝えられています。公園のシンボルとして親しまれている白いギリシャ風車は、小豆島と姉妹島提携を結ぶギリシャのミロス島との友好の証として、平成4年(1992)に建てられたものです。実写映画「魔女の宅急便」のロケ地にもなり、風車を背景にほうきにまたがって記念撮影ができるコーナーも人気です。園内には今も2000本を超えるオリーブの木が栽培され、オリーブ記念館やハーブ館ミロスもあわせて見学できます。見学を終えたら、今夜はこの近くの宿に宿泊します。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
      },
    },
  ]);

  // ---------- Day2 ----------
  await setDaySpotOrder(DAY2_ID, [
    { id: eigamura.id, data: { stayDurationMin: 85 } },
    { id: bunkyojo.id, data: {} },
    {
      id: lunch2.id,
      data: {
        lat: 34.4778166,
        lng: 134.3149852,
        visitTime: T(11, 53),
        stayDurationMin: 75,
        memo: "岬の分教場から車でおよそ10分、お昼は醤油蔵の立ち並ぶ馬木地区で食事をとりましょう。醤油の香りが漂う町並みの中に、島の食材を使った定食や、醤油味のソフトクリームを味わえる店もあります。ゆっくりと食事をとったら、歩いて醤の郷を巡りましょう。",
      },
    },
    {
      id: shoyu.id,
      data: {
        visitTime: T(13, 11),
        stayDurationMin: 65,
        memo: shoyu.memo?.replace(
          "見学を終えたら、車で坂手港へ向かいましょう。",
          "見学を終えたら、車で観音寺へ向かいましょう。"
        ),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
      },
    },
    {
      create: {
        name: "観音寺",
        address: "小豆島町坂手",
        lat: 34.4583740,
        lng: 134.3234560,
        visitTime: T(14, 21),
        stayDurationMin: 30,
        memo: "醤の郷から車でおよそ5分、次に訪れるのは観音寺です。小豆島には、四国の八十八か所霊場にならって島内に設けられた「小豆島霊場」八十八か所があり、今も多くの人が巡礼に訪れます。観音寺はその3番札所にあたる小さなお堂で、集落の中にひっそりとたたずんでいます。坂手の静かな路地の雰囲気とあわせて、島に根づいた巡礼の文化を感じてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて坂手港へ向かいましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
      },
    },
    {
      id: sakate.id,
      data: {
        lat: 34.4589858,
        lng: 134.3217252,
        visitTime: T(14, 53),
        stayDurationMin: 50,
        memo: "観音寺から歩いて2分ほど、次に訪れるのは坂手港です。瀬戸内国際芸術祭の作品として、現代美術家・ヤノベケンジが手がけた「スターアンガー」が、灯台のそばに設置されています。大きな鏡の玉の上に赤い目の竜がとまる、インパクトのある造形で、港の待合所には、小豆島の伝説を描いた長さ35mの壁画もあります。港から海を眺めながら、アートと伝説にふれるひとときを過ごしましょう。見学を終えたら、車で常光寺へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 2 }] },
      },
    },
    {
      create: {
        name: "常光寺",
        address: "小豆島町坂手",
        lat: 34.4686360,
        lng: 134.3238070,
        visitTime: T(15, 46),
        stayDurationMin: 44,
        memo: "坂手港から車でおよそ3分、小豆島の旅の最後に訪れるのは常光寺です。先ほどの観音寺と同じ小豆島霊場の8番札所にあたるお堂で、地元の人々によって大切に守られてきました。四国の八十八か所霊場にならって島内に設けられた八十八の札所は、歩き遍路や車での巡拝など、今もさまざまな形でめぐられています。旅の締めくくりに、島に根づいた信仰の文化にふれてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車でおよそ30分、土庄港のレンタカー営業所へ戻り、返却してからフェリーで帰りましょう。",
        transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3 }] },
      },
    },
  ]);

  // 二十四の瞳映画村の座標を法務指摘の実点に修正
  await prisma.spot.update({ where: { id: eigamura.id }, data: { lat: 34.4454611, lng: 134.2855521 } });

  console.log("#161続き: 決まりA(時間合わせの滞在)を是正。Day1に西光寺・宝生院のシンパク・肥土山/中山の農村歌舞伎舞台を追加(9か所、09:20〜16:31)。Day2に観音寺・常光寺を追加(7か所、09:30〜16:30)。法務指摘の座標7か所・ヘッジ1か所も修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
