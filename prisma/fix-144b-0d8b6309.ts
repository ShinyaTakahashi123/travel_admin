/**
 * #144 0d8b6309の直し(2回目)。企画運営からの指摘4点・法務からの指摘2点。
 *
 * 企画運営:
 * ①昼食がなかったため、金峯山寺のあとに「吉野山参道」を昼食スポット
 *   として新設(11:30〜13:30の枠)。
 * ②滞在の長さ(決まりA): 賀名生の里歴史民俗資料館100→50分、栄山寺は
 *   同じ95分のまま(下記④の行宮の事実を加えて内容を充実させたため)。
 * ③如意輪寺の到着が09:40で9:30の決まりを少し過ぎていたため、駐車場
 *   からの移動時間を見直し09:30着に。車は金峯山寺近くの駐車場に置く
 *   (如意輪寺までは徒歩で離れている)ことを明記。
 * ④栄山寺に、後村上天皇・後亀山天皇の行宮(仮の皇居)が置かれたと
 *   伝わる事実(国史跡)を追加。栄山寺行宮の跡地は国の史跡に指定されて
 *   おり、南朝ゆかりの地であることを本文で明確にした(企画運営の
 *   指摘・tabi-mag.jp/na0306等で確認)。
 *
 * 法務:
 * ⑤ecdd6ad8とほぼ同じ文(金峯山寺の開山伝承2文、如意輪寺の塔尾陵の文)
 *   を、別の点・別の組み立てに書き直し。
 * ⑥座標3か所(如意輪寺・吉水神社・金峯山寺)が出どころ不明だったため、
 *   OSMの実点(如意輪寺w1123815888、吉水神社w218660992、金峯山寺
 *   w1340388235)に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const NYOIRINJI_MEMO =
  "大和上市駅でレンタカーを借り、車でおよそ10分、金峯山寺近くの駐車場に車を置いて、歩いておよそ20分、如意輪寺に着きます。延喜年間(901〜923)に開かれたと伝わる古刹で、吉野に逃れた後醍醐天皇の勅願寺となりました。後醍醐天皇はここで生涯を終え、本堂の裏手に葬られました。都のある京の方角を一心に見つめるようにと、天皇陵には珍しく北を向いて築かれたと伝えられる「塔尾陵」です。宮内庁の管理地のため、柵の外から静かに見守りましょう。正平2年(1347)、後醍醐天皇の志を継いだ楠木正行は、四條畷への出陣を前にこの寺に立ち寄り、如意輪堂の扉に、生きて戻らぬ覚悟の辞世を矢じりで刻んだと伝えられています。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いておよそ10分、吉水神社へ向かいましょう。";

const KINPUSEN_MEMO =
  "吉水神社から歩いておよそ10分、金峯山寺に着きます。修験道の総本山として、古くから多くの修行者を迎えてきた霊域の中心です。後醍醐天皇が都を離れてこの吉野を選んだのも、こうした信仰の力に守られた土地だったからともいわれます。本堂の蔵王堂は、木造の古建築としては屈指の規模を誇るとされる国宝建築で、堂内には秘仏として金剛蔵王権現が三体安置されています。南朝の時代から今日まで、変わらず多くの祈りを見守ってきた場所です。世界遺産「紀伊山地の霊場と参詣道」の構成資産の一つです。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。この後は、歩いてすぐ、吉野山の参道へ向かいましょう。";

const LUNCH_MEMO =
  "金峯山寺から歩いてすぐ、吉野山の参道に着きます。昔から続く土産物店や食事処が軒を連ねる通りです。店をのぞきながら歩き、好みの一軒で昼食をとりましょう。この後は、駐車場の車に乗り、車でおよそ35分、賀名生の里歴史民俗資料館へ向かいましょう。";

const EISANJI_MEMO =
  "賀名生の里歴史民俗資料館から車でおよそ15分、栄山寺に着きます。養老3年(719)、藤原武智麻呂が創建したと伝わる寺院です。境内の八角堂は、武智麻呂の子・藤原仲麻呂が、亡き父母をしのんで天平宝字4年(760)ごろに建てたと伝えられ、法隆寺の夢殿とともに、奈良時代の八角堂建築の姿を伝える貴重な遺構として、国宝に指定されています。南北朝の時代には、後村上天皇や後亀山天皇の行宮(仮の皇居)が置かれたとも伝えられ、その跡地は国の史跡に指定されています。吉野で始まった南朝の歴史が、この地にも及んでいたことがうかがえます。簡素な姿の中に奈良時代の建築の味わいが残る、静かな境内を歩いてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、車でおよそ5分、JR五条駅へ向かい、レンタカーを返しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0d8b6309%'`);
  const itinId = rows[0].id;
  const nyoirinji = await findSpotInItinerary(itinId, { spotName: "如意輪寺" });
  const yoshimizu = await findSpotInItinerary(itinId, { spotName: "吉水神社" });
  const kinpusen = await findSpotInItinerary(itinId, { spotName: "金峯山寺" });
  const kanau = await findSpotInItinerary(itinId, { spotName: "賀名生の里歴史民俗資料館" });
  const eisanji = await findSpotInItinerary(itinId, { spotName: "栄山寺" });
  const dayId = kinpusen.dayId;

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: nyoirinji.id },
      data: { lat: 34.3647129, lng: 135.8675653, visitTime: t(9, 30), memo: NYOIRINJI_MEMO },
    });
    await tx.spot.update({ where: { id: yoshimizu.id }, data: { lat: 34.3672859, lng: 135.8618984 } });
    await tx.spot.update({
      where: { id: kinpusen.id },
      data: { lat: 34.3683328, lng: 135.8588339, visitTime: t(11, 15), memo: KINPUSEN_MEMO },
    });

    const day1: SpotOrderItem[] = [
      { id: nyoirinji.id, data: {} },
      { id: yoshimizu.id, data: {} },
      { id: kinpusen.id, data: {} },
      {
        create: {
          name: "吉野山参道", lat: 34.3683328, lng: 135.8588339,
          visitTime: t(12, 15), stayDurationMin: 60, memo: LUNCH_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 1 }] },
        },
      },
      {
        id: kanau.id,
        data: {
          visitTime: t(13, 50), stayDurationMin: 50,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 35 }] },
        },
      },
      {
        id: eisanji.id,
        data: { visitTime: t(14, 55), memo: EISANJI_MEMO },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
