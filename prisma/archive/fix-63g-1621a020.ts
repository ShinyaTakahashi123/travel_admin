/**
 * #63 1621a020（五箇山・白川郷）企画運営の指摘(14:21)。城端(善徳寺・城端曳山会館)を
 * 1日目の最後から最初へ移し、朝に城端を回ってから五箇山へ入る順に組み替える。
 * 曳山会館16→40分、善徳寺12→30分(実際に見学できる長さに)。ほかの滞在は変えない。
 * 城端(富山側の入口)から五箇山へ入るため、1日目の開始を08:00に早め(本文に明記)、
 * 新五箇山温泉 ゆ～楽を1日目最後(宿の近くで終わる)に変更。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "c9bcca21-0b20-4714-a6eb-acf09158ab7d";

const ZENTOKUJI_MEMO =
  "五箇山・白川郷をめぐる1泊2日の旅は、朝少し早めに、富山側の玄関口にあたる城端(じょうはな)の町から始めます。越中の小京都とも呼ばれるこの町にある城端別院善徳寺は、室町時代の文安元年(1444)、本願寺第8代・蓮如上人によって開かれたと伝わる浄土真宗の寺院で、永禄年間にこの地へ移りました。親鸞聖人直筆とされる『唯信抄』をはじめ、およそ1万点にのぼる寺宝の一部を、常設で見ることができます。春には樹齢370年ともいわれるしだれ桜が境内を彩ります。静かに、敬意をもってお参りください。この後は、歩いておよそ2分、城端曳山会館へ向かいましょう。";

const HIKIYAMA_MEMO =
  "城端別院善徳寺から歩いておよそ2分、越中の小京都と呼ばれる城端の町にある城端曳山会館に着きます。毎年5月に行われる「城端曳山祭」で実際に使われる、庵屋台や曳山が常時展示されている施設で、祭りの熱気を伝える映像もあわせて楽しめます。精巧な彫刻や漆塗りが施された山車を間近に見ることができ、江戸時代から受け継がれてきた城端の祭り文化にふれられます。見学のあとは、車でおよそ30分、五箇山の相倉合掌造り集落へ向かいましょう。";

const AIKURA_MEMO =
  "城端曳山会館から車でおよそ30分、世界遺産・相倉合掌造り集落に着きます。20棟の合掌造り家屋が現存し、五箇山に唯一残るとされる原始合掌の家屋もあるなど、集落そのものが貴重な文化財です。生活の場でもあるので、私有地や家の中に立ち入らず、静かに歩きましょう。集落の駐車場から段々畑沿いの坂を上っておよそ5分のところに展望広場があり、山あいに広がる合掌造りの家並みを高台から一望できます。朝のやわらかな光の中、坂を上り下りしながら、五箇山の原風景をゆっくりと味わってみてください。この後は、歩いてすぐ、相倉民俗館へ向かいましょう。";

const YURAKU_MEMO_FINAL =
  "五箇山和紙の里から車でおよそ4分、庄川のほとりに立つ新五箇山温泉 ゆ～楽に着きます。地元の人々にも親しまれている日帰り温泉施設で、エメラルドグリーンに輝く庄川の流れを見下ろす露天風呂につかりながら、旅の疲れをゆっくりとほぐすことができます。浴室では撮影しないようにしましょう。訪れる前に、公式サイトで営業時間や休館日を確かめてください。城端の町並みから相倉・上梨の合掌造り集落、五箇山和紙の里まで巡った1日目は、ここで締めくくりましょう。今夜はこの近くの宿でゆっくり休みましょう。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    {
      id: "e58e76b9-760f-4b3b-97fa-39cba0bfbd1e", // 城端別院善徳寺
      data: { memo: ZENTOKUJI_MEMO, visitTime: t(8, 0), stayDurationMin: 30, transitMode: null, transitDurationMin: null, transitLine: null },
    },
    {
      id: "d1dea107-0a17-4984-8609-60591c31341a", // 城端曳山会館
      data: { memo: HIKIYAMA_MEMO, visitTime: t(8, 32), stayDurationMin: 40, transitMode: "walk", transitDurationMin: 2 },
    },
    {
      id: "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59", // 相倉合掌造り集落
      data: { memo: AIKURA_MEMO, visitTime: t(9, 42), stayDurationMin: 40, transitMode: "car", transitDurationMin: 30 },
    },
    { id: "ea6b8c6f-301d-4c6b-bae9-5c081130d7f7", data: { visitTime: t(10, 25), stayDurationMin: 30 } }, // 相倉民俗館
    { id: "885aea12-01b6-43d2-82de-e0fa0b1c38e2", data: { visitTime: t(10, 58), stayDurationMin: 25 } }, // 相倉伝統産業館
    { id: "2a21313a-a48c-4c1f-af68-872aa0601167", data: { visitTime: t(11, 27), stayDurationMin: 35 } }, // 村上家
    { id: "4b2453bb-1890-4895-8260-89d6f890d6c6", data: { visitTime: t(12, 7), stayDurationMin: 30 } }, // 白山宮
    { id: "45e6e8d9-23e6-457d-b745-7fa64300464d", data: { visitTime: t(12, 40), stayDurationMin: 30 } }, // 流刑小屋
    { id: "9f8162f8-fbf7-42f8-ad5e-10e41675b170", data: { visitTime: t(13, 12), stayDurationMin: 15 } }, // 羽馬家住宅
    { id: "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", data: { visitTime: t(13, 37), stayDurationMin: 120 } }, // 五箇山和紙の里
    {
      id: "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d", // 新五箇山温泉 ゆ～楽
      data: { memo: YURAKU_MEMO_FINAL, visitTime: t(15, 41), stayDurationMin: 60 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
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
    await setDaySpotOrder(DAY1_ID, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
