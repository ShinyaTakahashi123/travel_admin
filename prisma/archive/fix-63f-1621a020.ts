/**
 * #63 1621a020（五箇山・白川郷）企画運営の指摘(13:08)残り1点。五箇山和紙の里の
 * 152分を120分に戻し(決まりA)、空いた32分は城端(じょうはな、南砺市街、五箇山
 * から車でおよそ30分)の善徳寺・城端曳山会館(ともに実在)を1日目の最後に追加して
 * 埋める。ゆ～楽のあと城端へ向かい、そこから宿のある平・上梨へ戻る形(帰りの
 * 移動は17時のあと、本文に「宿へ車で約30分」と明記)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "c9bcca21-0b20-4714-a6eb-acf09158ab7d";

const WASHINOSATO_MEMO_REVERT =
  "羽馬家住宅から車でおよそ10分、五箇山和紙の里に着きます。国の伝統的工芸品にも指定されている五箇山和紙の歴史や魅力を伝える「和紙工芸館」、実際に紙をすく体験ができる「和紙体験館」(体験には事前の予約が必要です。準備から仕上げまでおよそ1時間かかるとされています)、五箇山の歴史や産業を紹介する「たいら郷土館」の3つの施設が集まった複合施設です。五箇山和紙は江戸時代、加賀藩の手厚い保護のもとで発展してきました。丈夫で長持ちすることから、文化財の修復に用いられることもあるといわれています。合掌造りの屋根裏では、夏は塩硝づくりや養蚕、冬は紙すきと、季節に合わせた仕事が営まれてきたとされ、今日訪れた相倉や村上家の屋根の下にも、同じような暮らしの知恵が息づいていました。併設の食事処もあるので、ここで昼食にしましょう。時間をかけて、3つの施設をじっくりとめぐってみてください。この後は、車でおよそ4分、新五箇山温泉 ゆ～楽へ向かいましょう。";

const YURAKU_MEMO_TO_JOHANA =
  "五箇山和紙の里から車でおよそ4分、庄川のほとりに立つ新五箇山温泉 ゆ～楽に着きます。地元の人々にも親しまれている日帰り温泉施設で、エメラルドグリーンに輝く庄川の流れを見下ろす露天風呂につかりながら、旅の疲れをゆっくりとほぐすことができます。浴室では撮影しないようにしましょう。訪れる前に、公式サイトで営業時間や休館日を確かめてください。この後は、車でおよそ30分、城端(じょうはな)の城端曳山会館へ向かいましょう。";

const HIKIYAMA_MEMO =
  "新五箇山温泉 ゆ～楽から車でおよそ30分、越中の小京都と呼ばれる城端の町にある城端曳山会館に着きます。毎年5月に行われる「城端曳山祭」で実際に使われる、庵屋台や曳山が常時展示されている施設で、祭りの熱気を伝える映像もあわせて楽しめます。精巧な彫刻や漆塗りが施された山車を間近に見ることができ、江戸時代から受け継がれてきた城端の祭り文化にふれられます。この後は、歩いておよそ2分、城端別院善徳寺へ向かいましょう。";

const ZENTOKUJI_MEMO =
  "城端曳山会館から歩いておよそ2分、城端別院善徳寺に着きます。室町時代の文安元年(1444)、本願寺第8代・蓮如上人によって開かれたと伝わる浄土真宗の寺院で、永禄年間にこの地へ移りました。親鸞聖人直筆とされる『唯信抄』をはじめ、およそ1万点にのぼる寺宝の一部を、常設で見ることができます。春には樹齢370年ともいわれるしだれ桜が境内を彩ります。静かに、敬意をもってお参りください。相倉・五箇山の合掌造りから城端の寺町まで、五箇山を満喫した1日目は、ここで締めくくりましょう。お帰りは、車でおよそ30分、平・上梨の宿へ向かいましょう。";

async function main() {
  const day1Spots: SpotOrderItem[] = [
    { id: "5180d5bb-2cc0-494f-8c01-3ff1c8bd4a59", data: {} },
    { id: "ea6b8c6f-301d-4c6b-bae9-5c081130d7f7", data: {} },
    { id: "885aea12-01b6-43d2-82de-e0fa0b1c38e2", data: {} },
    { id: "2a21313a-a48c-4c1f-af68-872aa0601167", data: {} },
    { id: "4b2453bb-1890-4895-8260-89d6f890d6c6", data: {} },
    { id: "45e6e8d9-23e6-457d-b745-7fa64300464d", data: {} },
    { id: "9f8162f8-fbf7-42f8-ad5e-10e41675b170", data: {} },
    { id: "8d1cead2-cb8d-4aec-af22-16e9d51dab3d", data: { memo: WASHINOSATO_MEMO_REVERT, stayDurationMin: 120 } },
    { id: "ffb07e91-25b0-46e2-b71c-0b5e7a831a6d", data: { memo: YURAKU_MEMO_TO_JOHANA, visitTime: t(14, 59), stayDurationMin: 60 } },
    {
      create: {
        name: "城端曳山会館",
        address: "富山県南砺市泉沢",
        lat: 36.5145735,
        lng: 136.9021174,
        memo: HIKIYAMA_MEMO,
        visitTime: t(16, 29),
        stayDurationMin: 16,
        transitMode: "car",
        transitDurationMin: 30,
        transitLine: null,
      },
    },
    {
      create: {
        name: "城端別院善徳寺",
        address: "富山県南砺市西上町",
        lat: 36.5156196,
        lng: 136.9010631,
        memo: ZENTOKUJI_MEMO,
        visitTime: t(16, 47),
        stayDurationMin: 12,
        transitMode: "walk",
        transitDurationMin: 2,
        transitLine: null,
      },
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
