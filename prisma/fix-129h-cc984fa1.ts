/**
 * #129 cc984fa1の直し(8回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営:
 * 1. 文の写しがまだ残っている(摩尼殿の書き出し、三之堂の「コの字型」の文)
 * 2. 昼食の一文がない→開山堂→英賀神社のバス移動(姫路駅経由)に追加
 * 3. 英賀神社は到着がバスなのに斑鳩寺へは「車で」になっている。かつ
 *    英賀神社への移動(transitLegs)が入っていない(audit「-/-」)
 * 4. 斑鳩寺からの帰りの一文も乗り物を合わせる
 *
 * 法務(記録8a2f487):
 * ① 摩尼殿「断崖に張り出すように建つ舞台造りの本堂」、三之堂「学問と
 *    修行の場である大講堂、僧侶の食事の場だった食堂、不断念仏を唱えた
 *    常行堂の3つが、コの字型に向かい合って建つ空間です」が#10
 *    (54f0fa20)とほぼ同じ文だった→別の言い方に書き直す
 * ② 英賀神社「播磨三大城の一つに数えられた英賀城」に同じ文の中の
 *    ぼかしがない→「ともいわれる」を追加
 * ③ 斑鳩寺の三重塔の説明が誤り。天文10年(1541)の火災のあと永禄8年
 *    (1565)に建てられたのが現在の三重塔(火災を免れたのではない)。
 *    旅の手帖 tabi-mag.jp/hg0399/、コトバンク「斑鳩寺」で確認。
 *
 * 英賀神社↔斑鳩寺の実際の公共交通(WebSearchで確認):
 * - 英賀神社はJR英賀保駅から徒歩15分(山陽電鉄西飾磨駅からは徒歩12分)
 * - 斑鳩寺はJR網干駅南口から神姫バス山崎方面でおよそ10分「鵤」下車、
 *   徒歩およそ7分
 *   (jalan.net、summer.walkerplus.comの記事で確認)
 * よって英賀神社→斑鳩寺: 徒歩15分(英賀保駅)→JR山陽本線15分(網干駅)→
 * 神姫バス10分(鵤)→徒歩7分で、およそ47分。車を使わない公共交通のみの
 * ルートに直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MANIDEN_FROM = "仁王門から参道を歩いておよそ10分、断崖に張り出すように建つ舞台造りの本堂・摩尼殿が見えてきます。";
const MANIDEN_TO = "仁王門から参道を歩いておよそ10分、急な斜面に多くの柱を立てて支える「懸造り」という建て方の本堂・摩尼殿に着きます。";

const SANNODO_MEMO =
  "摩尼殿から山道を歩いておよそ8分、西谷と呼ばれる境内最奥の区域に、大講堂を中心として食堂・常行堂が向かい合う「三之堂」が建ち並んでいます。大講堂は学問や修行に使われた建物、食堂はかつて僧侶が食事をとった場所、常行堂は不断念仏を唱える道場で、3棟でコの字形を描くように配置されています。大講堂の本尊は、藤原時代の作とされる釈迦三尊像で、国の重要文化財に指定されています。食堂は承安4年(1174)に建てられ始めましたが、長く未完成のまま残り、昭和38年(1963)になって今の姿に復元整備されました。1階は写経道場、2階は寺宝の展示館になっており、内部を見学できます。山道には坂や段差があるので、足元に気をつけて歩きましょう。今も祈りの場ですので、敬意を持ってめぐりましょう。この後は、歩いておよそ3分、開山堂へ向かいましょう。";

const KAIZANDO_FROM =
  "参拝を終えたら、参道を戻ってロープウェイで下山し、バスでおよそ70分、姫路駅を経由して英賀神社へ向かいましょう。";
const KAIZANDO_TO =
  "参拝を終えたら、参道を戻ってロープウェイで下山し、バスでおよそ70分、姫路駅を経由して英賀神社へ向かいましょう。姫路駅で乗り換える際に、駅周辺で昼食をとっておくとよいでしょう。";

const AGA_HEDGE_FROM = "播磨三大城の一つに数えられた英賀城の跡地でもあり";
const AGA_HEDGE_TO = "播磨三大城の一つともいわれる英賀城の跡地でもあり";

const AGA_END_FROM = "この後は、車でおよそ20分、斑鳩寺へ向かいましょう。";
const AGA_END_TO =
  "この後は、歩いておよそ15分でJR英賀保駅へ向かい、JR山陽本線でおよそ15分、網干駅まで移動しましょう。網干駅からは神姫バス(山崎方面)でおよそ10分、「鵤」バス停で下車し、歩いておよそ7分で斑鳩寺に着きます(乗り換えを含めておよそ47分)。";

const IKARUGA_OPENER_FROM = "英賀神社から車でおよそ20分、斑鳩寺に着きます。";
const IKARUGA_OPENER_TO = "英賀神社からJR英賀保駅・網干駅で乗り換えて、歩きと電車・バスでおよそ47分、斑鳩寺に着きます。";

const IKARUGA_TOWER_FROM =
  "境内に立つ三重塔は永禄8年(1565)、赤松政秀によって建てられたもので、天文10年(1541)の火災を免れた貴重な建物として、国の重要文化財に指定されています。";
const IKARUGA_TOWER_TO =
  "境内に立つ三重塔は、天文10年(1541)の火災で多くの堂塔を焼失したあと、永禄8年(1565)に赤松政秀によって再建されたもので、国の重要文化財に指定されています。";

const IKARUGA_END_FROM = "参拝を終えたら、車でおよそ25分、姫路駅へ戻りましょう。";
const IKARUGA_END_TO =
  "参拝を終えたら、鵤バス停まで歩いておよそ7分、神姫バスで網干駅へ(およそ10分)、そこからJR山陽本線でおよそ15分、姫路駅へ戻りましょう(乗り換えを含めておよそ35分)。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;

  const ropeway = await findSpotInItinerary(itinId, { spotName: "書寫山ロープウェイ" });
  const niomon = await findSpotInItinerary(itinId, { spotName: "仁王門" });
  const maniden = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });
  const aga = await findSpotInItinerary(itinId, { spotName: "英賀神社" });
  const ikaruga = await findSpotInItinerary(itinId, { spotName: "斑鳩寺" });

  if (!maniden.memo?.includes(MANIDEN_FROM)) throw new Error("摩尼殿の文言が想定外です");
  if (!kaizando.memo?.includes(KAIZANDO_FROM)) throw new Error("開山堂の文言が想定外です");
  if (!aga.memo?.includes(AGA_HEDGE_FROM)) throw new Error("英賀神社のヘッジ対象文言が想定外です");
  if (!aga.memo?.includes(AGA_END_FROM)) throw new Error("英賀神社の結びが想定外です");
  if (!ikaruga.memo?.includes(IKARUGA_OPENER_FROM)) throw new Error("斑鳩寺の書き出しが想定外です");
  if (!ikaruga.memo?.includes(IKARUGA_TOWER_FROM)) throw new Error("斑鳩寺の三重塔の文言が想定外です");
  if (!ikaruga.memo?.includes(IKARUGA_END_FROM)) throw new Error("斑鳩寺の結びが想定外です");

  console.log("確認OK。dayId:", maniden.dayId);
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  const agaMemo = aga.memo!.replace(AGA_HEDGE_FROM, AGA_HEDGE_TO).replace(AGA_END_FROM, AGA_END_TO);
  const ikarugaMemo = ikaruga.memo!
    .replace(IKARUGA_OPENER_FROM, IKARUGA_OPENER_TO)
    .replace(IKARUGA_TOWER_FROM, IKARUGA_TOWER_TO)
    .replace(IKARUGA_END_FROM, IKARUGA_END_TO);

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      maniden.dayId,
      [
        { id: ropeway.id, data: {} },
        { id: niomon.id, data: {} },
        { id: maniden.id, data: { memo: maniden.memo!.replace(MANIDEN_FROM, MANIDEN_TO) } },
        { id: sannodo.id, data: { memo: SANNODO_MEMO } },
        { id: kaizando.id, data: { memo: kaizando.memo!.replace(KAIZANDO_FROM, KAIZANDO_TO) } },
        {
          id: aga.id,
          data: {
            memo: agaMemo,
            transitLegs: {
              deleteMany: {},
              create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 70, transitLine: "神姫バス(姫路駅経由)" }],
            },
          },
        },
        {
          id: ikaruga.id,
          data: {
            memo: ikarugaMemo,
            visitTime: t(15, 27),
            transitLegs: {
              deleteMany: {},
              create: [
                { orderNo: 1, transitMode: "walk", transitDurationMin: 15, transitLine: null },
                { orderNo: 2, transitMode: "train", transitDurationMin: 15, transitLine: "JR山陽本線" },
                { orderNo: 3, transitMode: "bus", transitDurationMin: 10, transitLine: "神姫バス(山崎方面)" },
                { orderNo: 4, transitMode: "walk", transitDurationMin: 7, transitLine: null },
              ],
            },
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
