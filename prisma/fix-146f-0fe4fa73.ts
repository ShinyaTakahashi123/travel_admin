/**
 * #146 0fe4fa73の直し(6回目)。企画運営の指摘2点・法務の指摘4点。
 *
 * 企画運営:
 * ①天覧台の95分は展望台としては長すぎたため30分に短縮し、空いた時間で
 *   「ROKKO森の音ミュージアム」(新規。旧・六甲オルゴールミュージアム
 *   が令和3年/2021にリニューアル。19世紀後半〜20世紀初頭のヨーロッパ・
 *   アメリカのオルゴールや自動演奏楽器を展示、四季のガーデンも)を
 *   天覧台の前に追加。
 * ②天覧台の「日没の時刻を確かめてから訪れるとよいでしょう」→
 *   「確かめましょう」に直す(「よいでしょう」は使わない)。
 *
 * 法務:
 * ③記念碑台の「日本ではじめてのゴルフ場」は、ひらがなに変えても言い
 *   切りのままだったため、「初めて」に戻し同じ文で「とされる」をつけて
 *   ぼかす。
 * ④温泉寺の「毎年1月2日には」は、日付までの行事表記のため「毎年1月
 *   のはじめには」に直す。
 * ⑤座標: 記念碑台を兵庫県立六甲山ビジターセンターw685822334の中心
 *   34.7569840,135.2294136に(もとはバス停の点)。
 * ⑥座標: 有馬の温泉街を湯本坂w690951979の中心34.7965211,135.2485855に
 *   (もとは小数4けたに丸めた値)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder, type SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TENRANDAI_FROM = "日没の早い季節は、夕暮れから街の明かりがともり始める様子が見られることもあります。夜景を見るなら、日没の時刻を確かめてから訪れるとよいでしょう。見学を終えたら、今夜の宿がある有馬温泉へ向かいましょう。";
const TENRANDAI_TO = "日没の早い季節は、夕暮れから街の明かりがともり始める様子が見られることもあります。夜景を見るなら、日没の時刻を確かめましょう。見学を終えたら、今夜の宿がある有馬温泉へ向かいましょう。";

const KINENHIDAI_FROM = "明治36年(1903)には日本ではじめてのゴルフ場を開きました。";
const KINENHIDAI_TO = "明治36年(1903)には日本で初めてとされるゴルフ場を開きました。";

const ONSENJI_FROM = "毎年1月2日には、行基と仁西の木像を温泉で清める「入初式」が行われています。";
const ONSENJI_TO = "毎年1月のはじめには、行基と仁西の木像を温泉で清める「入初式」が行われています。";

const MORINOOTO_MEMO =
  "六甲ガーデンテラスからバスでおよそ10分、ROKKO森の音ミュージアムに着きます。平成6年(1994)に六甲オルゴールミュージアムとして開館し、令和3年(2021)に今の名前にリニューアルしました。19世紀後半から20世紀初頭にかけて、ヨーロッパやアメリカで親しまれていた、オルゴールや自動演奏オルガン、自動演奏ヴァイオリンなどが展示されています。実際に演奏される音色を聴ける時間もあり、四季で表情を変えるガーデンも楽しめます。この後は、バスでおよそ10分、六甲山天覧台へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const tenrandai = await findSpotInItinerary(itinId, { spotName: "六甲山天覧台" });
  const kinenhidai = await findSpotInItinerary(itinId, { spotName: "記念碑台" });
  const onsenji = await findSpotInItinerary(itinId, { spotName: "温泉寺" });
  const onsengai = await findSpotInItinerary(itinId, { spotName: "有馬の温泉街" });
  const dayId = tenrandai.dayId;

  if (!tenrandai.memo?.includes(TENRANDAI_FROM)) throw new Error("六甲山天覧台の文言が想定外です");
  if (!kinenhidai.memo?.includes(KINENHIDAI_FROM)) throw new Error("記念碑台の文言が想定外です");
  if (!onsenji.memo?.includes(ONSENJI_FROM)) throw new Error("温泉寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.spot.update({
      where: { id: kinenhidai.id },
      data: { lat: 34.7569840, lng: 135.2294136, memo: kinenhidai.memo!.replace(KINENHIDAI_FROM, KINENHIDAI_TO) },
    });
    await tx.spot.update({
      where: { id: onsenji.id },
      data: { memo: onsenji.memo!.replace(ONSENJI_FROM, ONSENJI_TO) },
    });
    await tx.spot.update({
      where: { id: onsengai.id },
      data: { lat: 34.7965211, lng: 135.2485855 },
    });

    const others = (await tx.spot.findMany({ where: { dayId }, orderBy: { orderNo: "asc" } }))
      .filter((s) => s.id !== tenrandai.id)
      .map((s) => ({ id: s.id, data: {} }));

    const day1: SpotOrderItem[] = [
      ...others,
      {
        create: {
          name: "ROKKO森の音ミュージアム", lat: 34.7630182, lng: 135.2376625,
          visitTime: t(14, 50), stayDurationMin: 60, memo: MORINOOTO_MEMO,
          transitLegs: { create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 10 }] },
        },
      },
      {
        id: tenrandai.id,
        data: {
          visitTime: t(16, 0), stayDurationMin: 30,
          memo: tenrandai.memo!.replace(TENRANDAI_FROM, TENRANDAI_TO),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "bus", transitDurationMin: 10 }] },
        },
      },
    ];
    await setDaySpotOrder(dayId, day1, { tx });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
