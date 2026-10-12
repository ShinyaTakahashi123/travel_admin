/**
 * #143 0aebca35(渡嘉敷島・阿波連ビーチ、ケラマブルーの海を楽しむ定番
 * プラン)の直し。もとは阿波連ビーチの1か所(10:00〜12:30)のみで4か所
 * 未満、終始案内役の話し方(ようこそ・くださいね等)。
 *
 * 既存のf4665b0d(座間味島、ケラマブルーの2つのビーチと高月山展望台を
 * めぐる日帰りプラン)は座間味島(別の島)の座間味港・古座間味ビーチ・
 * 座間味の集落を使用しているため、同じ「ケラマブルー」の切り口でも
 * 物理的に異なる島・スポットであり重複はない。ただし古座間味ビーチの
 * 既存アーカイブ文言(archive/fix-392-f4665b0d.ts)を確認し、遊泳区域・
 * 監視員・クラゲ・サンゴ・日焼け対策という安全文言の「内容」は似通って
 * 当然だが、「表現」は変えて執筆した。
 *
 * 渡嘉敷港・港の見える丘展望台・渡嘉志久ビーチを新規追加。島内の移動は
 * レンタカーではなくバス(とかしき観光バスなど、会社名は出さず「バス」
 * とした)を想定。
 *
 * 出典: 近畿日本ツーリスト「め(ぐ)旅」渡嘉敷特集(www.knt.co.jp/meito/
 * sp/tokashiki/)、環境省 慶良間諸島国立公園のページ(www.env.go.jp/
 * nature/nationalparks/list/kerama-shoto/)、jeepe.jp「tokashiki
 * island travel guide」、aumo.jp(渡嘉志久ビーチ・展望台)。座標はOSM
 * (渡嘉敷港n5885063593、港の見える丘展望台n5885063003、渡嘉志久ビーチ
 * relation6980654、阿波連ビーチは既存のまま)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "世界屈指の透明度「ケラマブルー」で知られる渡嘉敷島。ウミガメに出会える渡嘉志久ビーチと、慶良間諸島観光の定番・阿波連ビーチをめぐる、シュノーケリングにも最適な日帰りプランです。";

const PORT_MEMO =
  "那覇泊港から高速船でおよそ35〜50分、渡嘉敷島の渡嘉敷港に着きます。渡嘉敷村の玄関口で、売店や食堂が並ぶ、島の中心となる集落です。帰りの船の時刻は、出かける前に公式サイトで確かめておきましょう。この後は、歩いておよそ10分、港の見える丘展望台へ向かいましょう。";

const MINATOMIEOKA_MEMO =
  "渡嘉敷港から歩いておよそ10分、港の見える丘展望台に着きます。渡嘉敷港とその先の海を見渡せる、小高い場所にある展望台です。船で渡ってきたばかりの渡嘉敷島の姿を、高いところから眺めてみましょう。この後は、バスでおよそ15分、渡嘉志久ビーチへ向かいましょう。";

const TOKASHIKU_MEMO =
  "港の見える丘展望台からバスでおよそ15分、渡嘉志久ビーチに着きます。遠浅で波が穏やかな、渡嘉志久集落に面したビーチです。ウミガメの餌場になっているといわれ、遊泳区域の中で泳いでいるうちに、ウミガメと出会えることもあります。決められた遊泳区域を守り、監視員の案内に従いましょう。日差しが強いので、帽子や日焼け止め、水分補給も忘れずに。この後は、バスでおよそ15分、阿波連ビーチへ向かいましょう。";

const AWAREN_MEMO =
  "渡嘉志久ビーチからバスでおよそ15分、阿波連ビーチに着きます。湾のような地形に守られた、全長およそ800mの白砂のビーチです。渡嘉敷島が属する慶良間諸島国立公園は、那覇の西およそ40kmに浮かぶ30以上の島々からなり、海域の美しさそのものが評価されているエリアです。透明度の高い青い海は、地元で「ケラマブルー」と呼ばれています。決められた遊泳区域の中で、監視員の案内に従って泳ぎましょう。少し沖に出てシュノーケリングをすれば、色とりどりの魚たちにも出会えます。冬の時期、例年1〜3月ごろには、沖合でザトウクジラの姿が見られることもあるとされています。このあたりの食事処で昼食をとりましょう。見学を終えたら、バスでおよそ15分、渡嘉敷港へ戻り、帰りの船に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0aebca35%'`);
  const realItinId = rows[0].id;
  const day = await prisma.day.findFirst({ where: { itineraryId: realItinId } });
  if (!day) throw new Error("day not found");
  const awaren = await prisma.spot.findFirst({ where: { dayId: day.id, name: "阿波連ビーチ" } });
  if (!awaren) throw new Error("阿波連ビーチが見つかりません");

  console.log("itinId:", realItinId, "dayId:", day.id);
  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: realItinId }, data: { description: DESCRIPTION } });

    const day1: SpotOrderItem[] = [
      {
        create: {
          name: "渡嘉敷港・集落", lat: 26.1991475, lng: 127.3695236,
          visitTime: t(9, 0), stayDurationMin: 30, memo: PORT_MEMO,
        },
      },
      {
        create: {
          name: "港の見える丘展望台", lat: 26.1955203, lng: 127.3665135,
          visitTime: t(9, 40), stayDurationMin: 20, memo: MINATOMIEOKA_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
        },
      },
      {
        create: {
          name: "渡嘉志久ビーチ", lat: 26.1857690, lng: 127.3478751,
          visitTime: t(10, 15), stayDurationMin: 90, memo: TOKASHIKU_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 15 }] },
        },
      },
      {
        id: awaren.id,
        data: {
          visitTime: t(12, 0), stayDurationMin: 270, memo: AWAREN_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 15 }] },
        },
      },
    ];
    await setDaySpotOrder(day.id, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
