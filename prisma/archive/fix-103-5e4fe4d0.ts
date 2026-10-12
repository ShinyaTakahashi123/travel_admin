/**
 * #103 5e4fe4d0 あわら温泉、湯のまち広場から巡る定番日帰りプラン。
 * チェックリスト(20260929-itinerary-4spots-9to16)の決まりに合わせて組み直す。
 * 元はあわら湯のまち広場1か所(09:30〜10:40)のみで、4か所未満・終了とも
 * 決まりに合っていなかった。あわら市・坂井市周辺の実在の行き先(藤野厳九郎
 * 記念館・金津創作の森・吉崎御坊・東尋坊)を追加し、8:30〜9:30開始・
 * 16:30〜17:00終了の形にした。あわせて元の文章のツアーガイド口調
 * (皆様/本日ご案内するのは)もサイト標準の口調に直した。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 藤野厳九郎記念館: 既存のあわら湯のまち広場と同じ複合施設(あわら市文化会館)内
 *   にあるため、既存点(36.225,136.194444)をそのまま使用
 * - 金津創作の森: 36.2304916,136.2613462 / 吉崎御坊: 36.2872801,136.2509371
 * - 東尋坊: 36.2378168,136.1267357
 *
 * 開いたURL(事実確認):
 * - 藤野厳九郎記念館(1874〜1945・仙台医学専門学校・魯迅『藤野先生』・紹興市との友好都市): https://www.city.awara.lg.jp/annai/7200/kankoshisetsu/p000263.html
 * - 金津創作の森(アート体験型施設・ガラス工房など): https://ja.wikipedia.org/wiki/%E9%87%91%E6%B4%A5%E5%89%B5%E4%BD%9C%E3%81%AE%E6%A3%AE
 * - 吉崎御坊(1471年・蓮如・浄土真宗北陸布教の拠点): https://ja.wikipedia.org/wiki/%E5%90%89%E5%B4%8E%E5%BE%A1%E5%9D%8A
 * - 東尋坊(柱状節理・高さ約25m・国の天然記念物名勝・地名由来の伝説): https://www.nippon.com/ja/guide-to-japan/gu900293/
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "明治期に湧出した北陸有数の温泉地、あわら温泉。湯けむり漂う湯のまち広場を起点に、魯迅ゆかりの記念館やアートの森、蓮如ゆかりの史跡、そして断崖絶景の東尋坊までめぐる日帰りプランです。";

const YUNOMACHI_MEMO =
  "旅の始まりは、あわら温泉 湯のまち広場です。えちぜん鉄道あわら湯のまち駅のすぐ前、平成23年(2011)にオープンした、温泉街の中心となる広場です。あわら温泉は、明治16年(1883)、田んぼの灌漑用に井戸を掘っていたところ、偶然温泉が湧き出したのが始まりと伝えられ、北陸を代表する温泉地の一つとして発展してきました。広場には、総ひのき造りの足湯「芦湯」があり、2種類の源泉をかけ流しで楽しめるほか、屋台村「湯けむり横丁」なども並んでいます。散策の合間に、無料の足湯で旅の疲れを癒やしてみてください。この後は、歩いてすぐ、藤野厳九郎記念館へ向かいましょう。";

const FUJINO_MEMO =
  "あわら湯のまち広場からすぐ、藤野厳九郎記念館に着きます。藤野厳九郎(1874〜1945)は、現在のあわら市に生まれた医師・教育者です。仙台医学専門学校で解剖学を教えていた際、中国からの留学生・周樹人、のちの作家・魯迅の指導にあたり、ノートを赤字で丁寧に添削するなど、深い師弟関係を結びました。魯迅は帰国後、この恩師との思い出を随筆『藤野先生』に綴り、今も中国の教科書に掲載されるほど広く知られています。記念館は、あわら市と魯迅ゆかりの中国・紹興市との友好都市提携を記念して開設されました。この後は、車でおよそ12分、金津創作の森へ向かいましょう。";

const KANAZU_MEMO =
  "藤野厳九郎記念館から車でおよそ12分、金津創作の森に着きます。芸術活動の発信と育成を目的としたアート体験型の文化施設です。森に囲まれた園内には、彫刻家による屋外作品が点在し、散策しながら鑑賞できます。ガラス工房やろうけつ染め工房などの創作工房もあり、ガラス細工や陶芸、竹細工づくりなどの体験ができます。緑に囲まれた静かな環境の中で、アートに触れるひとときを過ごしてみてください。この後は、車でおよそ13分、吉崎御坊へ向かいましょう。";

const YOSHIZAKI_MEMO =
  "金津創作の森から車でおよそ13分、吉崎御坊に着きます。文明3年(1471)、比叡山などの迫害を逃れて京を離れた本願寺第8世・蓮如が、北潟湖を見下ろす吉崎山の頂に構えた、浄土真宗の北陸布教の拠点です。蓮如はここで、わかりやすい言葉で教えを説き、北陸はもとより奥羽からも多くの門徒を集めたと伝えられています。現在は御坊の建物こそ残っていませんが、史跡として整備され、蓮如上人の足跡をしのぶことができます。参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ25分、東尋坊へ向かいましょう。";

const TOJINBO_MEMO =
  "吉崎御坊から車でおよそ25分、この旅の締めくくり、東尋坊に着きます。輝石安山岩が柱状に並ぶ「柱状節理」でできた断崖が、およそ1kmにわたって続いています。これほどの規模の柱状節理は世界でも数か所しかないとされ、高さ約25mの断崖とともに、国の天然記念物・名勝に指定されています。地名の由来は、平泉寺にいた乱暴者の僧・東尋坊が、1182年、仲間に誘われてこの地を訪れた際、断崖から突き落とされたという言い伝えによります。崖の上には柵のない場所もあるため、足元に十分注意しながら歩きましょう。遊覧船に乗って海から断崖を見上げたり、崖沿いの土産物店で越前がにや海鮮を味わったりと、思い思いに過ごせます。あわら温泉、湯のまち広場から巡る旅はこれで終わりです。帰りは、東尋坊から三国駅・あわら湯のまち駅方面へ、バスやタクシーをご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5e4fe4d0%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const yunomachi = await findSpotInItinerary(itinId, { spotName: "あわら湯のまち広場" });

  const day1Spots: SpotOrderItem[] = [
    { id: yunomachi.id, data: { memo: YUNOMACHI_MEMO, visitTime: t(9, 0), stayDurationMin: 70, transitMode: null, transitDurationMin: null, transitLine: null } },
    {
      create: {
        name: "藤野厳九郎記念館",
        address: "福井県あわら市温泉二丁目",
        lat: 36.225,
        lng: 136.194444,
        memo: FUJINO_MEMO,
        visitTime: t(10, 12),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    {
      create: {
        name: "金津創作の森",
        address: "福井県あわら市宮谷",
        lat: 36.2304916,
        lng: 136.2613462,
        memo: KANAZU_MEMO,
        visitTime: t(10, 54),
        stayDurationMin: 70,
        transitMode: "car",
        transitDurationMin: 12,
        transitLine: null,
      },
    },
    {
      create: {
        name: "吉崎御坊",
        address: "福井県あわら市吉崎",
        lat: 36.2872801,
        lng: 136.2509371,
        memo: YOSHIZAKI_MEMO,
        visitTime: t(12, 17),
        stayDurationMin: 40,
        transitMode: "car",
        transitDurationMin: 13,
        transitLine: null,
      },
    },
    {
      create: {
        name: "東尋坊",
        address: "福井県坂井市三国町安島",
        lat: 36.2378168,
        lng: 136.1267357,
        memo: TOJINBO_MEMO,
        visitTime: t(13, 22),
        stayDurationMin: 200,
        transitMode: "car",
        transitDurationMin: 25,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  console.log("--- D1 ---");
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt) { console.log("(visitTime未変更)"); continue; }
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
