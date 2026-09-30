/**
 * #74 6dc83721 D2。企画運営の指摘(決まりA): 桜草公園110分・荒川彩湖公園105分は
 * 水増し。実際に過ごせる長さ(桜草公園20〜30分、荒川彩湖公園40〜60分)に縮め、
 * 空いた時間は実在の行き先(別所沼公園・調神社、いずれも実在、OSM確認)で埋める。
 * 桜草公園には花の見ごろ(例年4月ごろ)とそれ以外の季節の一言を追加。調神社には
 * 配慮の一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const AKIGASE_MEMO_TO_SAKURASOU =
  "三橋総合公園から車でおよそ20分、荒川と鴨川にはさまれた秋ヶ瀬公園に着きます。埼玉県営の公園の中でも広い面積を持つ公園で、雑木林や芝生広場が広がり、四季折々の自然を楽しめます。およそ100種類もの野鳥が観察できるといわれ、バードウォッチングを楽しむ人々にも親しまれている探鳥地です。木々の中を歩けば、都心からそう遠くないとは思えないほどの豊かな自然に包まれます。近くには食事処もあるので、ここで昼食にするのもおすすめです。この後は、車でおよそ5分、桜草公園へ向かいましょう。";

const SAKURASOU_MEMO =
  "秋ヶ瀬公園から車でおよそ5分、桜草公園に着きます。国の天然記念物に指定されている、野生のサクラソウの自生地として知られる公園です。かつて荒川流域に広く見られたサクラソウの群生地は、開発によってほとんど姿を消しましたが、この地では今も守り伝えられています。花の見ごろは例年4月ごろで、可憐な薄紫色の花が一面に咲きそろいます。それ以外の季節は、青々とした草原が広がる静かな景色を楽しめます。花を傷つけないよう、決められた場所から見学してください。この後は、車でおよそ3分、荒川彩湖公園へ向かいましょう。";

const ARAKAWASAIKO_MEMO =
  "桜草公園から車でおよそ3分、荒川彩湖公園に着きます。カマキリの形をした遊具があることから「カマキリ公園」の愛称でも親しまれる、荒川沿いの広々とした公園です。滑り台やブランコなどの遊具のほか、芝生広場や湖を眺められる散策路もあり、家族連れにも人気です。都会の喧騒を離れて、川辺のひとときをゆっくりと過ごしてみてください。この後は、車でおよそ8分、別所沼公園へ向かいましょう。";

const BESSHONUMA_MEMO =
  "荒川彩湖公園から車でおよそ8分、別所沼公園に着きます。沼を中心に整備された、地元の人々に親しまれている公園です。沼のまわりにはおよそ1周1kmの散策路が整えられていて、木々に囲まれた水辺をゆっくりと歩くことができます。詩人・立原道造が設計した、みずべ休憩所「ヒヤシンスハウス」も園内に立っています。都会の中の静かな水辺の景色を、のんびりと味わってみてください。この後は、車でおよそ4分、調神社へ向かいましょう。";

const TSUKI_JINJA_MEMO =
  "別所沼公園から車でおよそ4分、調神社に着きます。「つきのみや」とも呼ばれる古社で、全国でも珍しく、鳥居のない神社として知られています。「調」の字が「月」に通じることから、うさぎが神様のお使いとされ、境内のあちこちにうさぎの像が置かれています。旧中山道・浦和宿の面影を今に伝える一帯に鎮座する、地域に根づいた神社です。静かに、敬意をもってお参りください。けやきひろば、そしてさいたま清河寺温泉から続いた、都市型リラックス1泊2日の旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const arakawasaiko = await prisma.spot.findFirstOrThrow({ where: { name: "荒川彩湖公園", dayId: day2.id } });
  const sakurasou = await prisma.spot.findFirstOrThrow({ where: { name: "桜草公園", dayId: day2.id } });

  const finalDay2Spots: SpotOrderItem[] = [
    { id: "e2ccacf9-311d-44e1-bb9b-0916515698a8", data: {} }, // さいたま清河寺温泉
    { id: "e679227f-f532-46d4-a269-2eb1abc31817", data: {} }, // 三橋総合公園
    { id: "eee93d29-1590-4771-9966-93f40b705dfc", data: { memo: AKIGASE_MEMO_TO_SAKURASOU } }, // 秋ヶ瀬公園
    { id: sakurasou.id, data: { memo: SAKURASOU_MEMO, visitTime: t(12, 55), stayDurationMin: 25 } }, // 桜草公園
    { id: arakawasaiko.id, data: { memo: ARAKAWASAIKO_MEMO, visitTime: t(13, 23), stayDurationMin: 50, transitMode: "car", transitDurationMin: 3 } }, // 荒川彩湖公園
    {
      create: {
        name: "別所沼公園",
        address: "埼玉県さいたま市南区別所4",
        lat: 35.8565146,
        lng: 139.6411491,
        memo: BESSHONUMA_MEMO,
        visitTime: t(14, 21),
        stayDurationMin: 90,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "調神社",
        address: "埼玉県さいたま市浦和区岸町3-17-25",
        lat: 35.8534258,
        lng: 139.6556949,
        memo: TSUKI_JINJA_MEMO,
        visitTime: t(15, 55),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 4,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of finalDay2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, finalDay2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
