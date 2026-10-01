/**
 * #114 7d354df2(足利)の直し(4回目)。企画運営(14:34)の指摘:
 * 美術館(11:11〜11:56)のあとに足利公園(12:15着)まで19分しかなく、
 * 「このあたりで昼食」と書きながら実際には昼食の時間が0分だった。
 * 美術館の滞在に昼食の時間(40分)を組み込み、後ろを順に遅らせる。
 *
 * 40分を組み込むと、そのままでは終わりが17:19になり17:00を超えるため、
 * 企画運営の指示どおり「滞在を縮めるのではなく、行き先を外して合わせる」。
 * 今回新しく足した2か所(足利公園の修正後の座標・草雲美術館)のうち、
 * 足利公園はもとの3か所に含まれる既存スポット(法務が座標を確認済み)
 * なので残し、今回の組み替えで新しく追加した草雲美術館を外す
 * (法務には、この回の直しであわせて伝える)。
 *
 * 新しい日の順: 学校→鑁阿寺→美術館(見学+昼食)→足利公園→織姫神社
 * →(JR足利駅経由)→あしかがフラワーパーク、16:38終了
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BIJUTSUKAN_MEMO =
  "鑁阿寺から歩いておよそ6分、足利市立美術館に着きます。平成6年(1994)に開館した、市営の集合住宅と併設された珍しい構造の美術館です。5000点を超えるコレクションを所蔵し、足利に生まれた日本画家・大山魯牛や、両毛地域にゆかりの深い洋画家・川島理一郎など、地元ゆかりの作家の作品を中心に紹介しています。市民からの寄贈を受けた「浅川コレクション」も充実しており、地域の文化発信の拠点となっています。見学を終えたら、美術館の周辺の食事処で、ゆっくり昼食の時間をとりましょう。この後は、歩いておよそ19分、足利公園へ向かいましょう。";

const KOEN_MEMO =
  "足利市立美術館から歩いておよそ19分、足利公園に着きます。1883年に開設された、足利市の中心市街地から少し西に入った丘陵地の南端に広がる公園です。開設された当初からサクラやツツジの名所として親しまれ、春には多くの人でにぎわいます。もうひとつ見逃せないのが、園内に残る円墳や前方後円墳などあわせて10基ほどの古墳です。花見の名所であると同時に、古代からこの土地に人が暮らしてきたことを物語る歴史的な場所でもあり、散策しながら足利の長い歴史に思いを馳せることができます。木々に囲まれた園内には遊歩道やベンチも整えられていて、ひと休みするのにぴったりの場所です。この後は、歩いておよそ13分、織姫神社へ向かいましょう。";

const ORIHIME_MEMO =
  "足利公園から歩いておよそ13分、織姫神社に着きます。宝永2年(1705)、当時の足利藩主・戸田忠利が、機織りの神である天御鉾命と天八千々姫命を祀って創建したと伝えられる神社です。この二柱の神が力を合わせて織物を織っていたという言い伝えから、男女の縁結びにもご利益があるとされ、多くの参拝者が訪れています。229段の石段を上った高台に社殿があり、足利の町並みを一望できる眺めも魅力です。石段には手すりもありますが、段数が多いので、足元に気をつけながらゆっくり上りましょう。参拝の際は、敬意を込めて手を合わせましょう。この後は、JR足利駅を経由して、あしかがフラワーパークへ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7d354df2%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const gakko = await findSpotInItinerary(itinId, { spotName: "足利学校" });
  const bannaji = await findSpotInItinerary(itinId, { spotName: "鑁阿寺" });
  const bijutsukan = await findSpotInItinerary(itinId, { spotName: "足利市立美術館" });
  const koen = await findSpotInItinerary(itinId, { spotName: "足利公園" });
  const souun = await findSpotInItinerary(itinId, { spotName: "草雲美術館" });
  const orihime = await findSpotInItinerary(itinId, { spotName: "織姫神社" });
  const flowerpark = await findSpotInItinerary(itinId, { spotName: "あしかがフラワーパーク" });

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const day1Spots: SpotOrderItem[] = [
    { id: gakko.id, data: {} },
    { id: bannaji.id, data: {} },
    {
      id: bijutsukan.id,
      data: { memo: BIJUTSUKAN_MEMO, stayDurationMin: 85 },
    },
    {
      id: koen.id,
      data: { memo: KOEN_MEMO, visitTime: t(12, 55) },
    },
    {
      id: orihime.id,
      data: { memo: ORIHIME_MEMO, visitTime: t(13, 38), transitDurationMin: 13 },
    },
    {
      id: flowerpark.id,
      data: { visitTime: t(14, 38) },
    },
  ];

  await setDaySpotOrder(day1.id, day1Spots, { remove: [souun.id] });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
