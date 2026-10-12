/**
 * #146 0fe4fa73の直し(9回目)。企画運営の指摘(つなぎの文3か所)・法務の
 * 指摘(座標1か所)。
 * ①スポットを足した際に直し漏れていた、つなぎの文(結び・書き出し)の
 *   食い違い3か所を修正。
 * ②ROKKO森の音ミュージアムの座標が、バス停n6332800286の点だったため、
 *   建物w685822310(旧名「オルゴール・ミュージアムホール・オブ・
 *   ホールズ六甲」、同じ施設)の中心34.7616980,135.2383740に修正。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const TERRACE_FROM = "この後は、バスでおよそ15分、六甲山天覧台へ向かいましょう。";
const TERRACE_TO = "この後は、歩いておよそ12分、ROKKO森の音ミュージアムへ向かいましょう。";

const TENRANDAI_FROM = "六甲ガーデンテラスからバスでおよそ15分、六甲山天覧台に着きます。";
const TENRANDAI_TO = "ROKKO森の音ミュージアムからバスでおよそ10分、六甲山天覧台に着きます。";

const TAIKOU_FROM = "この後は、歩いてすぐ、銀の湯へ向かいましょう。";
const TAIKOU_TO = "この後は、歩いてすぐ、温泉寺へ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '0fe4fa73%'`);
  const itinId = rows[0].id;
  const terrace = await findSpotInItinerary(itinId, { spotName: "六甲ガーデンテラス" });
  const tenrandai = await findSpotInItinerary(itinId, { spotName: "六甲山天覧台" });
  const taikou = await findSpotInItinerary(itinId, { spotName: "太閤の湯殿館" });
  const morinooto = await findSpotInItinerary(itinId, { spotName: "ROKKO森の音ミュージアム" });

  if (!terrace.memo?.includes(TERRACE_FROM)) throw new Error("六甲ガーデンテラスの文言が想定外です");
  if (!tenrandai.memo?.includes(TENRANDAI_FROM)) throw new Error("六甲山天覧台の文言が想定外です");
  if (!taikou.memo?.includes(TAIKOU_FROM)) throw new Error("太閤の湯殿館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({ where: { id: terrace.id }, data: { memo: terrace.memo!.replace(TERRACE_FROM, TERRACE_TO) } }),
    prisma.spot.update({ where: { id: tenrandai.id }, data: { memo: tenrandai.memo!.replace(TENRANDAI_FROM, TENRANDAI_TO) } }),
    prisma.spot.update({ where: { id: taikou.id }, data: { memo: taikou.memo!.replace(TAIKOU_FROM, TAIKOU_TO) } }),
    prisma.spot.update({ where: { id: morinooto.id }, data: { lat: 34.7616980, lng: 135.2383740 } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
