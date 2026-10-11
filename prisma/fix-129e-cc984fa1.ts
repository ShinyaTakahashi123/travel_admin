/**
 * #129 cc984fa1の直し(5回目)。法務(2026-10-11、記録79e4f44)・企画運営の
 * 指摘。
 *
 * ① 書写の里・美術工芸館は令和8年(2026)3月31日に閉館(姫路市公式
 *    city.himeji.lg.jp/kougei/で確認)。スポットを削除し、説明文・
 *    ロープウェイの書き出しからも削除。
 * ② #10(54f0fa20)と同じ・ほぼ同じ文が複数あった。摩尼殿・大講堂三之堂・
 *    開山堂を、新たに調べた別の事実で書き直す:
 *    - 摩尼殿: 性空上人が桜の木に舞う天女を見て如意輪観音を彫ったという
 *      草創の伝説(970年の如意輪堂建立)、大正10年(1921)の火災と
 *      12年後の再建、現在の本尊は暦仁2年(1239)に覚印が造ったもの
 *      (性空作の像は明応元年(1492)の火災で失われた)
 *      (出典: mlit.go.jp/tagengo-db/R2-01580.html)
 *    - 大講堂・三之堂: 大講堂の本尊・釈迦三尊像(藤原時代・重要文化財)、
 *      食堂が承安4年(1174)創建も長く未完成のまま残り昭和38年(1963)に
 *      復元整備されたこと(出典: ana.co.jp/japan-travel-planner/hyogo/
 *      0000012.html)
 *    - 開山堂: 延宝元年(1673)建立、堂内に性空上人の木造(瞑想の姿)、
 *      奥之院には開山堂のほか不動堂(元禄10年/1697建立)・護法堂
 *      (守護神の乙天・若天を祀る)もあること(出典: mlit.go.jp/
 *      tagengo-db/en/R2-01579.html)
 * ③ 仁王門の「三棟造り」に同じ文の中の伝聞がなかったため「とされる」を
 *    追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESC_FROM = "「西の比叡山」とも呼ばれる古刹の仁王門・摩尼殿・三之堂・開山堂を、山麓の美術館とあわせてめぐるプランです。";
const DESC_TO = "「西の比叡山」とも呼ばれる古刹の仁王門・摩尼殿・三之堂・開山堂をめぐるプランです。";

const ROPEWAY_FROM = "書写の里・美術工芸館から歩いておよそ5分、書写山ロープウェイ山麓駅に着きます。";
const ROPEWAY_TO = "JR姫路駅から神姫バスでおよそ30分、書写山ロープウェイ山麓駅に着きます。";

const NIOMON_FROM = "日本でも古い寺院にだけ見られる「三棟造り」という珍しい様式で建てられています。";
const NIOMON_TO = "日本でも古い寺院にだけ見られる「三棟造り」という珍しい様式で建てられているとされます。";

const MANIDEN_MEMO =
  "仁王門から参道を歩いておよそ10分、断崖に張り出すように建つ舞台造りの本堂・摩尼殿が見えてきます。性空上人が桜の木のまわりで天女が舞う姿を見て、その木に如意輪観音を彫り、お堂を建てたのが始まりと伝えられ、天禄元年(970)に建立されました。もとの性空作の像は明応元年(1492)の火災で失われ、現在、本尊として祀られている如意輪観音坐像は、暦仁2年(1239)に覚印という僧によって造られたものです。お堂自体も大正10年(1921)に火災に遭い、12年の歳月をかけて再建されました。西国三十三所第二十七番札所として今も多くの参拝者を集めています。境内は今も修行や参拝が続けられる祈りの場ですので、敬意を持ってお参りしましょう。この後は、山道を歩いておよそ8分、大講堂・三之堂へ向かいましょう。";

const SANNODO_MEMO =
  "摩尼殿から山道を歩いておよそ8分、境内の中でも最奥に近い「西谷」にあたる「三之堂」と呼ばれる一角に着きます。学問と修行の場である大講堂、僧侶の食事の場だった食堂、不断念仏を唱えた常行堂の3つが、コの字型に向かい合って建つ空間です。大講堂の本尊は、藤原時代の作とされる釈迦三尊像で、国の重要文化財に指定されています。食堂は承安4年(1174)に建てられ始めましたが、長く未完成のまま残り、昭和38年(1963)になって今の姿に復元整備されました。1階は写経道場、2階は寺宝の展示館になっており、内部を見学できます。境内には食事ができる場所もあるので、ここで昼食にしましょう。山道には坂や段差があるので、足元に気をつけて歩きましょう。今も祈りの場ですので、敬意を持ってめぐりましょう。この後は、歩いておよそ3分、開山堂へ向かいましょう。";

const KAIZANDO_MEMO =
  "三之堂からさらに奥へ、開山堂に着きます。延宝元年(1673)に建てられた、圓教寺を開いた性空上人を祀るお堂で、堂内には瞑想する姿の性空上人の木像が安置されています。この一帯は「奥之院」と呼ばれ、開山堂のほかにも、元禄10年(1697)建立の不動堂や、圓教寺の守護神とされる乙天・若天を祀る護法堂があります。乙天は不動明王、若天は毘沙門天の化身と伝えられています。書写山での拝観の締めくくりに、敬意を持って参拝しましょう。参拝を終えたら、参道を戻ってロープウェイで下山し、バスで姫路駅へ戻りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: itinId } });
  const sato = await findSpotInItinerary(itinId, { spotName: "書写の里・美術工芸館" });
  const ropeway = await findSpotInItinerary(itinId, { spotName: "書寫山ロープウェイ" });
  const niomon = await findSpotInItinerary(itinId, { spotName: "仁王門" });
  const maniden = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });

  if (!itin.description?.includes(DESC_FROM)) throw new Error("説明文が想定外です");
  if (!ropeway.memo?.includes(ROPEWAY_FROM)) throw new Error("ロープウェイの文言が想定外です");
  if (!niomon.memo?.includes(NIOMON_FROM)) throw new Error("仁王門の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: itin.description!.replace(DESC_FROM, DESC_TO) } });

    await setDaySpotOrder(
      ropeway.dayId,
      [
        {
          id: ropeway.id,
          data: {
            memo: ropeway.memo!.replace(ROPEWAY_FROM, ROPEWAY_TO),
            visitTime: t(9, 0),
            transitLegs: { deleteMany: {} },
          },
        },
        {
          id: niomon.id,
          data: { memo: niomon.memo!.replace(NIOMON_FROM, NIOMON_TO), visitTime: t(9, 19) },
        },
        { id: maniden.id, data: { memo: MANIDEN_MEMO, visitTime: t(9, 49) } },
        {
          id: sannodo.id,
          data: {
            memo: SANNODO_MEMO,
            visitTime: t(10, 57),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
          },
        },
        { id: kaizando.id, data: { memo: KAIZANDO_MEMO, visitTime: t(12, 15) } },
      ],
      { remove: [sato.id], tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
