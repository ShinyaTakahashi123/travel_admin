/**
 * #59 e58458ef（松島の夕景と瑞巌寺の紅葉、じっくり味わう1泊2日の旅）
 * ユーザー決定「全部直す」の対象(旧Day2開始10:00・終了13:42)。
 * 松島-塩竈間の遊覧船「芭蕉コース」の運航は9:00〜15:00(丸文松島汽船公式で確認)
 * のため、始発の9:00に合わせてDay2の開始を1時間早めた。
 * 塩竈の実在スポットを追加: 志波彦神社(鹽竈神社に隣接する独立した神社、実は別)・
 * 旧亀井邸(実在、大正13年築の和洋併置式住宅、無料・休館日は書かず)・
 * 浦霞酒ギャラリー(実在、享保9年創業・鹽竈神社御用の酒蔵、料金は書かず)を追加し、
 * 鹽竈神社(202段の大きな神社、45→80分)・杉村惇美術館(40→55分)の滞在も延ばした。
 * 昼食は本塩釜駅前(実在の駅、店名は挙げず「塩釜まぐろづくし」という土地の名物に
 * 言及)で確保し、帰りの一言も追加。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY2_ID = "18dbc2f6-9570-4c88-a4d9-a17cb5a03bc9";

const CRUISE_ID = "5c603e23-2a2c-4f82-bf88-d2fd6c313cce";
const SHIOGAMA_JINJA_ID = "1c39de02-96c9-4db9-a256-8347a54d3e04";
const HAKUBUTSUKAN_ID = "388346d7-632c-490f-b090-9f1d60a5004b";
const MITAMA_JINJA_ID = "3da4bcbf-eef7-47a1-a918-bddd069e4aa7";
const SUGIMURA_ID = "855944fb-baee-4097-a9cd-cea89be915ab";

const SHIOGAMA_JINJA_MEMO_NEW =
  "塩竈のマリンゲート塩釜から歩いておよそ20分、表参道の202段の石段を上りきると、志波彦神社・鹽竈神社に着きます。武甕槌神・経津主神を東北へと導いた塩土老翁神をまつる神社で、古くから陸奥国一之宮として、朝廷や仙台藩の厚い崇敬を受けてきました。慶長12年(1607)、仙台藩祖・伊達政宗公が社殿を造営し、四代藩主・綱村公の代に大規模な造り替えが行われ、現在の社殿は棟梁・松原助兵衛重成の手による、江戸中期の姿を今に伝えています。表参道の石段は急な上り坂ですが、途中の裏坂(女坂)を通れば、ゆるやかに参道をたどることもできます。境内では静かに、敬意をもってお参りください。この後は、歩いておよそ6分、志波彦神社へ向かいましょう。";

const SHIWAHIKO_MEMO =
  "鹽竈神社から歩いておよそ6分、志波彦神社に着きます。志波彦大神をまつる神社で、延喜式神名帳にも名神大社として記された古社です。明治4年(1871)に国幣中社に列せられ、明治7年(1874)、鹽竈神社の境内に遷座しました。現在の社殿は昭和13年(1938)に造営されたものです。鹽竈神社とは隣り合って建っていますが、それぞれ独立した神社として、今も別々にお祭りが営まれています。静かに、敬意をもってお参りください。この後は、歩いておよそ8分、裏坂沿いの志波彦神社鹽竈神社博物館へ向かいましょう。";

const HAKUBUTSUKAN_MEMO_NEW =
  "志波彦神社から歩いておよそ8分、裏坂(女坂)沿いの志波彦神社鹽竈神社博物館に着きます。神社に伝わる刀剣や武具、絵画、古文書などを収蔵・展示しており、なかでも国の重要文化財に指定されている太刀2振(銘・来国光、銘・雲生)は必見です。江戸時代に仙台藩主・伊達家から奉納された太刀35振(県指定重要文化財)も収蔵されています。2階には、主祭神・塩土老翁神にまつわる資料も収められています。神域にある施設として、静かに、敬意をもって見学しましょう。この後は、歩いておよそ3分、旧亀井邸へ向かいましょう。";

const KAMEITEI_MEMO =
  "志波彦神社鹽竈神社博物館から歩いておよそ3分、旧亀井邸に着きます。地元の実業家・亀井文平が大正13年(1924)に建てた邸宅で、「海商の館」とも呼ばれています。伝統的な和館に洋館を組み合わせた和洋併置式の住宅建築で、大正時代の趣を今に伝えています。鹽竈神社の裏坂を上ってすぐの場所にあり、静かなたたずまいの中で当時の暮らしぶりを垣間見ることができます。休館日があるので、訪れる前に公式の案内で確かめてください。この後は、歩いておよそ3分、御釜神社へ向かいましょう。";

const MITAMA_JINJA_MEMO_NEW =
  "旧亀井邸から歩いておよそ3分、御釜神社に着きます。鹽竈神社の末社で、製塩の方法を教えたと伝わる塩土老翁神をまつり、境内には「神竈」と呼ばれる4つの鉄製の釜が納められています。水が絶えず、腐らず、変事があると水の色が変わるという言い伝えから、日本三奇の一つとされています。毎年、海水を汲んで塩を焼く神事もこの神社で行われてきました。塩竈という地名の由来ともなった神社ですので、静かに、敬意をもってお参りください。この後は、歩いておよそ2分、浦霞酒ギャラリーへ向かいましょう。";

const URAKASUMI_MEMO =
  "御釜神社から歩いておよそ2分、浦霞酒ギャラリーに着きます。享保9年(1724)創業、鹽竈神社の御用酒屋として歴代仕えてきた酒蔵・浦霞醸造元の直営ギャラリーです。歴史ある酒器や酒造りの道具などを眺めながら、月替わりで内容が変わる日本酒の試飲も楽しめます(ソフトドリンクの用意もあります)。港町・塩竈の食文化を支えてきた地酒の世界にふれてみてください。この後は、歩いておよそ4分、塩竈市杉村惇美術館へ向かいましょう。";

const SUGIMURA_MEMO_NEW =
  "浦霞酒ギャラリーから歩いておよそ4分、塩竈市杉村惇美術館に着きます。昭和25年(1950)に建てられた塩竈市公民館本町分室を改修して開館した美術館で、塩竈石を用いた外観と、木骨で組まれた天井が美しい大講堂は、市の有形文化財に指定されています。塩竈にゆかりのある洋画家・杉村惇の作品を中心に、企画展も開かれています。休館日があるので、訪れる前に公式サイトで確かめてください。この後は、歩いておよそ9分、本塩釜駅前へ向かいましょう。";

const EKIMAE_MEMO =
  "塩竈市杉村惇美術館から歩いておよそ9分、本塩釜駅前に着きます。生まぐろの水揚げ量が全国有数の塩釜港を擁する港町らしく、駅の周辺には新鮮なまぐろを扱う寿司店が数多く軒を連ねています。まぐろのさまざまな部位を少しずつ味わえる「塩釜まぐろづくし」は、この土地ならではの一皿です。ここでゆっくりと昼食をとりましょう。松島の夕景と瑞巌寺の紅葉、そして塩竈のまちなかをめぐった2日間の旅は、ここで締めくくりとなります。お帰りは、すぐそばのJR仙石線・本塩釜駅から乗車を。";

async function main() {
  const spots: SpotOrderItem[] = [
    { id: CRUISE_ID, data: { visitTime: t(9, 0) } },
    { id: SHIOGAMA_JINJA_ID, data: { memo: SHIOGAMA_JINJA_MEMO_NEW, visitTime: t(10, 12), stayDurationMin: 80, transitMode: "other", transitDurationMin: 22 } },
    {
      create: {
        name: "志波彦神社",
        address: "宮城県塩竈市一森山",
        lat: 38.3189766,
        lng: 141.0137149,
        memo: SHIWAHIKO_MEMO,
        visitTime: t(11, 38),
        stayDurationMin: 20,
        transitMode: "walk",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    { id: HAKUBUTSUKAN_ID, data: { memo: HAKUBUTSUKAN_MEMO_NEW, visitTime: t(12, 6), stayDurationMin: 35, transitMode: "walk", transitDurationMin: 8 } },
    {
      create: {
        name: "旧亀井邸",
        address: "宮城県塩竈市本町",
        lat: 38.3175666,
        lng: 141.0169662,
        memo: KAMEITEI_MEMO,
        visitTime: t(12, 44),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    { id: MITAMA_JINJA_ID, data: { memo: MITAMA_JINJA_MEMO_NEW, visitTime: t(13, 17), stayDurationMin: 20, transitMode: "walk", transitDurationMin: 3 } },
    {
      create: {
        name: "浦霞酒ギャラリー",
        address: "宮城県塩竈市本町2-19",
        lat: 38.3165382,
        lng: 141.0190931,
        memo: URAKASUMI_MEMO,
        visitTime: t(13, 39),
        stayDurationMin: 30,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
    },
    { id: SUGIMURA_ID, data: { memo: SUGIMURA_MEMO_NEW, visitTime: t(14, 13), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 4 } },
    {
      create: {
        name: "本塩釜駅前",
        address: "宮城県塩竈市海岸通",
        lat: 38.3178146,
        lng: 141.0228114,
        memo: EKIMAE_MEMO,
        visitTime: t(15, 17),
        stayDurationMin: 75,
        transitMode: "walk",
        transitDurationMin: 9,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = (d.stayDurationMin as number | undefined) ?? 50;
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY2_ID, spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
