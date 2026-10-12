/**
 * #143 0aebca35の直し(2回目)。企画運営からの指摘2点・法務からの指摘4点
 * をまとめて対応。
 *
 * 企画運営:
 * ①船の時刻: 那覇泊港発の高速船「マリンライナーとかしき」の時刻表
 *   (navitime.co.jp、tokashiki-ferry.jp/Senpaku/portal)を確認した
 *   ところ、始発は那覇泊港発9:00・渡嘉敷港着9:40(夏・冬とも同じ)。
 *   09:00着としていたのを09:40着に修正。帰りは、夏は渡嘉敷港発17:30、
 *   冬は17:00が最終のため、阿波連ビーチからの帰路を含めてこの時刻に
 *   収まるよう組み直した(離島の最終便に合わせる例外として16:30〜
 *   17:00をわずかに超える17:10発になる)。
 * ②阿波連ビーチの座標確認は、法務の指摘(下記)で対応。
 *
 * 法務:
 * ③阿波連ビーチの座標26.197778,127.364444(もとからある地点)が、
 *   度分秒から直した値で、実際の阿波連ビーチから約3.5km北(渡嘉敷港
 *   のそば)だったため、OSMのr6982081の中心26.1691270,127.3472413に
 *   修正。
 * ④説明文「世界屈指の透明度」を、同じ文で「世界でも有数ともいわれる
 *   透明度」にぼかし。
 * ⑤「少し沖に出てシュノーケリングをすれば」(沖へ出るのを勧める書き方)
 *   を外し、ライフジャケット・ガイド同伴・サンゴを踏まない一文に直す。
 * ⑥渡嘉志久ビーチのウミガメに「さわったり追いかけたりせず、近づき
 *   すぎないようにしましょう」を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界でも有数ともいわれる透明度「ケラマブルー」で知られる渡嘉敷島。ウミガメに出会える渡嘉志久ビーチと、慶良間諸島観光の定番・阿波連ビーチをめぐる、シュノーケリングにも最適な日帰りプランです。";

const PORT_MEMO =
  "那覇泊港発9:00の高速船で、およそ40分、渡嘉敷島の渡嘉敷港に着きます。渡嘉敷村の玄関口で、売店や食堂が並ぶ、島の中心となる集落です。帰りの高速船は、夏は17:30発・冬は17:00発が最終です(増便の時期もあるので、出かける前に公式サイトで確かめましょう)。この後は、歩いておよそ10分、港の見える丘展望台へ向かいましょう。";

const TOKASHIKU_FROM = "遠浅で波が穏やかな、渡嘉志久集落に面したビーチです。ウミガメの餌場になっているといわれ、遊泳区域の中で泳いでいるうちに、ウミガメと出会えることもあります。決められた遊泳区域を守り、監視員の案内に従いましょう。日差しが強いので、帽子や日焼け止め、水分補給も忘れずに。この後は、バスでおよそ15分、阿波連ビーチへ向かいましょう。";
const TOKASHIKU_TO = "遠浅で波が穏やかな、渡嘉志久集落に面したビーチです。ウミガメの餌場になっているといわれ、遊泳区域の中で泳いでいるうちに、ウミガメと出会えることもあります。ウミガメを見かけても、さわったり追いかけたりせず、近づきすぎないようにしましょう。決められた遊泳区域を守り、監視員の案内に従いましょう。日差しが強いので、帽子や日焼け止め、水分補給も忘れずに。この後は、バスでおよそ10分、阿波連ビーチへ向かいましょう。";

const AWAREN_MEMO =
  "渡嘉志久ビーチからバスでおよそ10分、阿波連ビーチに着きます。湾のような地形に守られた、全長およそ800mの白砂のビーチです。渡嘉敷島が属する慶良間諸島国立公園は、那覇の西およそ40kmに浮かぶ30以上の島々からなり、世界でも有数ともいわれる透明度の海域が評価されているエリアです。地元で「ケラマブルー」と呼ばれる青い海を、決められた遊泳区域の中で、監視員の案内に従って楽しみましょう。シュノーケリングをするときは、ライフジャケットを着け、慣れない人はガイドと一緒に楽しみましょう。サンゴは生き物なので、踏んだりさわったりしないようにしましょう。冬の時期、例年1〜3月ごろには、沖合でザトウクジラの姿が見られることもあるとされています。このあたりの食事処で昼食をとりましょう。見学を終えたら、バスでおよそ20分、渡嘉敷港へ戻り、帰りの船に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0aebca35%'`);
  const itinId = rows[0].id;
  const port = await findSpotInItinerary(itinId, { spotName: "渡嘉敷港・集落" });
  const minatomieoka = await findSpotInItinerary(itinId, { spotName: "港の見える丘展望台" });
  const tokashiku = await findSpotInItinerary(itinId, { spotName: "渡嘉志久ビーチ" });
  const awaren = await findSpotInItinerary(itinId, { spotName: "阿波連ビーチ" });

  if (!tokashiku.memo?.includes(TOKASHIKU_FROM)) throw new Error("渡嘉志久ビーチの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } }),
    prisma.spot.update({ where: { id: port.id }, data: { visitTime: t(9, 40), stayDurationMin: 20, memo: PORT_MEMO } }),
    prisma.spot.update({ where: { id: minatomieoka.id }, data: { visitTime: t(10, 10) } }),
    prisma.spot.update({ where: { id: tokashiku.id }, data: { visitTime: t(10, 45), memo: tokashiku.memo!.replace(TOKASHIKU_FROM, TOKASHIKU_TO) } }),
    prisma.spot.update({
      where: { id: awaren.id },
      data: {
        lat: 26.1691270, lng: 127.3472413,
        visitTime: t(12, 25), stayDurationMin: 285, memo: AWAREN_MEMO,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 10 }] },
      },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
