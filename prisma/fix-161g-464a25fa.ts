/**
 * #161の続き。企画運営・法務の指摘に対応(重なる内容あり)。
 * ①企画運営: Day1の昼食が10:38と早すぎた(11:30〜13:30の決まり違反)。
 *   迷路のまちのあと、西光寺・宝生院のシンパクを先に回ってから昼食に
 *   する順番に変更。
 * ②法務: 昼食2か所の座標が店の点だったため、国土地理院の住所検索で
 *   得た番地の点に修正(土庄の町: 34.486652,134.188629、
 *   馬木: 34.474697,134.329285)。
 * ③企画運営・法務: 肥土山の「毎年5月3日に」→日付を書かない「毎年5月の
 *   はじめに」に修正。「2か所にしか…残っておらず」の言い切りに、同じ文で
 *   「とされ」を追加。
 * ④企画運営: 迷路のまちの「歩くだけでも時間を忘れてしまいます」(感じ方の
 *   押しつけ)を削除。
 * ⑤企画運営: 迷路のまち・岬の分教場の結び「お昼を食べに行きましょう」を、
 *   実際の次の行き先名に変更(迷路のまちは順番が変わり西光寺へ、
 *   岬の分教場は馬木へ)。
 *
 * 新しい時刻:
 * Day1(09:20〜16:34、9か所): 土渕海峡→迷路のまち→西光寺→
 *   宝生院のシンパク→昼食(11:30)→肥土山→中山歌舞伎舞台→千枚田→
 *   オリーブ公園
 * Day2(09:30〜16:33、7か所、昼食の座標・つなぎのみ変更)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-161g-464a25fa.ts
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
  const saikoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "西光寺" } });
  const hosho = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "宝生院のシンパク" } });
  const hitoyama = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "肥土山の農村歌舞伎舞台" } });
  const nakayamaStage = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "中山の農村歌舞伎舞台" } });
  const tanada = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "中山千枚田" } });
  const olive = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "小豆島オリーブ公園" } });
  const eigamura = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "二十四の瞳映画村" } });
  const bunkyojo = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "岬の分教場" } });
  const lunch2 = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "馬木で昼食" } });
  const shoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "醤の郷" } });
  const kannonji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "観音寺" } });
  const sakate = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "坂手港" } });
  const jokoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY2_ID, name: "常光寺" } });

  if (tanada.visitTime?.getUTCHours() === 13 && tanada.visitTime?.getUTCMinutes() === 59) {
    console.log("already applied, skipping");
    return;
  }

  // ---------- Day1: 順番を入れ替え(迷路のまち→西光寺→宝生院→昼食→肥土山…) ----------
  await setDaySpotOrder(DAY1_ID, [
    { id: kaikyo.id, data: {} },
    {
      id: meiro.id,
      data: {
        memo: "土渕海峡から歩いてすぐ、次に訪れるのは迷路のまちです。土庄の旧市街に広がる、幅1mに満たない路地が網の目のように入り組む町並みで、瀬戸内国際芸術祭の会場の一つにもなっており、空き家や古い蔵を生かした現代アートの作品が路地のあちこちに点在しています。古い町家を利用したカフェや雑貨店も点在しています。住まいの路地なので、家の敷地には入らず、静かに歩きましょう。見学を終えたら、歩いて西光寺へ向かいましょう。",
      },
    },
    {
      id: saikoji.id,
      data: {
        visitTime: T(10, 35),
        stayDurationMin: 26,
        memo: "迷路のまちから歩いて4分ほど、次に訪れるのは西光寺です。小豆島霊場の第58番札所で、小高い丘の上に三重塔が建っています。寺の西側には、ゆるやかにカーブした石塀が続く路地があり、石塀越しに三重塔を望む、静かで趣のある眺めを楽しめます。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車で宝生院のシンパクへ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    },
    {
      id: hosho.id,
      data: {
        visitTime: T(11, 6),
        memo: "西光寺から車でおよそ5分、次に訪れるのは宝生院のシンパクです。宝生院の境内にそびえる、国の特別天然記念物に指定された真柏(シンパク)の巨木で、幹まわりおよそ16.9m、樹高およそ20.9m、推定樹齢は1600年を超えるとされています。地上1mほどの高さで3方向に幹が分かれており、遠目には1本の木には見えないほどの迫力があります。枝ぶりをよく見ると、象や龍、亀など仏教にゆかりのある生きものの姿が見えるともいわれています。境内の大切な木ですので、静かに、敬意をもって見学しましょう。見学を終えたら、車で土庄の町へ戻り、昼食をとりましょう。",
      },
    },
    {
      id: lunch1.id,
      data: {
        lat: 34.486652,
        lng: 134.188629,
        visitTime: T(11, 30),
        memo: "宝生院のシンパクから車でおよそ4分、お昼は土庄の町で食事をとりましょう。手延べそうめんや小豆島産オリーブを使った料理など、島ならではの味を楽しめる店が点在しています。ゆっくりと食事をとったら、車で肥土山の農村歌舞伎舞台へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 4 }] },
      },
    },
    {
      id: hitoyama.id,
      data: {
        visitTime: T(12, 54),
        memo: "土庄の町から車でおよそ14分、次に訪れるのは肥土山地区です。離宮八幡神社の境内には、江戸時代から200年以上にわたって島の人々が演じ継いできた農村歌舞伎の舞台が残されています。農村歌舞伎の舞台が残っているのは、小豆島では、ここ肥土山と、このあと訪れる中山の2か所だけとされ、どちらも国の重要有形民俗文化財に指定されている、全国的にも珍しい場所です。肥土山では毎年5月のはじめに、舞台いっぱいに幕が張られ、地元の人々による歌舞伎が上演されます。上演のない日は、境内から静かに舞台を眺めることができます。今も祈りが続く神社ですので、静かに、敬意をもって見学しましょう。見学を終えたら、車で中山の農村歌舞伎舞台へ向かいましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 14 }] },
      },
    },
    { id: nakayamaStage.id, data: { visitTime: T(13, 37) } },
    { id: tanada.id, data: { visitTime: T(13, 59) } },
    { id: olive.id, data: { visitTime: T(15, 14) } },
  ]);

  // ---------- Day2: 岬の分教場の結び、馬木の昼食の座標・つなぎを修正 ----------
  await setDaySpotOrder(DAY2_ID, [
    { id: eigamura.id, data: {} },
    { id: bunkyojo.id, data: { memo: bunkyojo.memo?.replace("見学を終えたら、車でお昼を食べに行きましょう。", "見学を終えたら、車で馬木へ向かいましょう。") } },
    {
      id: lunch2.id,
      data: {
        lat: 34.474697,
        lng: 134.329285,
        visitTime: T(11, 55),
        memo: "岬の分教場から車でおよそ12分、お昼は醤油蔵の立ち並ぶ馬木地区で食事をとりましょう。醤油の香りが漂う町並みの中に、島の食材を使った定食や、醤油味のソフトクリームを味わえる店もあります。ゆっくりと食事をとったら、車で醤の郷を巡りましょう。",
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
      },
    },
    {
      id: shoyu.id,
      data: {
        visitTime: T(13, 14),
        memo: shoyu.memo?.replace("馬木の町なかから歩いてすぐ、次に訪れるのは醤の郷です。", "馬木の町から車でおよそ4分、次に訪れるのは醤の郷です。"),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 4 }] },
      },
    },
    { id: kannonji.id, data: { visitTime: T(14, 24) } },
    { id: sakate.id, data: { visitTime: T(14, 56) } },
    { id: jokoji.id, data: { visitTime: T(15, 49) } },
  ]);

  console.log("#161続き: Day1の順番を変更し昼食を11:30に是正、昼食2か所の座標を店以外の点に修正、肥土山の日付・言い切りを修正、迷路のまちの押しつけ表現を削除、結びを実際の行き先名に修正");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
