/**
 * #142 0986be13の直し(5回目、企画運営・法務の指摘)。
 * ①乗船寺の結びが「大石田駅へ向かい、帰りの電車に乗りましょう」で、
 *   朝に大石田駅から車で来た設定なのに、車をどう返すかの説明がなかった
 *   (企画運営)。最上川舟役所跡の文に車を置く場所を明記し、乗船寺の結びを
 *   レンタカーを返す流れに直す。
 * ②乗船寺はお寺なので、「静かに、敬意をもって見学しましょう」を、祈りの
 *   決まった一文「今も祈りが続く場所ですので、静かに、敬意をもって
 *   お参りしましょう」に直す(法務)。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const FUNAYAKUSHO_FROM = "大石田の歴史をたどりながら、河岸の界隈を少し歩いてみましょう。この後は、歩いておよそ4分、乗船寺へ向かいましょう。";
const FUNAYAKUSHO_TO = "大石田の歴史をたどりながら、河岸の界隈を少し歩いてみましょう。車は、このあたりに置いておきましょう。この後は、歩いておよそ4分、乗船寺へ向かいましょう。";

const JOSENJI_FROM = "本堂には、山形県の文化財に指定されている千手観音像が納められています。最上川の舟運でにぎわった大石田とともに歩んできたお寺です。静かに、敬意をもって見学しましょう。見学を終えたら、歩いておよそ10分、大石田駅へ向かい、帰りの電車に乗りましょう。";
const JOSENJI_TO = "本堂には、山形県の文化財に指定されている千手観音像が納められています。最上川の舟運でにぎわった大石田とともに歩んできたお寺です。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。見学を終えたら、歩いて最上川舟役所跡へ戻り、車に乗って大石田駅の近くでレンタカーを返しましょう。そこから、帰りの電車に乗りましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0986be13%'`);
  const itinId = rows[0].id;
  const funayakusho = await findSpotInItinerary(itinId, { spotName: "最上川舟役所跡" });
  const josenji = await findSpotInItinerary(itinId, { spotName: "乗船寺" });

  if (!funayakusho.memo?.includes(FUNAYAKUSHO_FROM)) throw new Error("最上川舟役所跡の文言が想定外です");
  if (!josenji.memo?.includes(JOSENJI_FROM)) throw new Error("乗船寺の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: funayakusho.id },
      data: { memo: funayakusho.memo!.replace(FUNAYAKUSHO_FROM, FUNAYAKUSHO_TO) },
    }),
    prisma.spot.update({
      where: { id: josenji.id },
      data: { memo: josenji.memo!.replace(JOSENJI_FROM, JOSENJI_TO) },
    }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
