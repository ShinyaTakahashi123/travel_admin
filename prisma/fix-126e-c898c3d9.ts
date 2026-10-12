/**
 * #126 c898c3d9の直し(5回目)。自己点検(itinerary-audit/prayer-check)の
 * 指摘:
 * - 徳川ミュージアムの到着時刻が常磐神社の終了(10:50)+徒歩12分と2分
 *   ずれていた(11:00→11:02に修正)
 * - 常磐神社(実在の神社)に参拝の配慮の一文がなかった
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TOKIWA_FROM = "斉昭が築かせた大砲「太極砲」などが展示されています。";
const TOKIWA_TO =
  "斉昭が築かせた大砲「太極砲」などが展示されています。ほかの参拝者の迷惑にならないよう、敬意を持ってお参りしましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c898c3d9%'`);
  const itinId = rows[0].id;
  const tokiwa = await findSpotInItinerary(itinId, { spotName: "常磐神社" });
  const tokugawa = await findSpotInItinerary(itinId, { spotName: "徳川ミュージアム" });

  if (!tokiwa.memo?.includes(TOKIWA_FROM)) throw new Error("常磐神社の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: tokiwa.id }, { memo: tokiwa.memo!.replace(TOKIWA_FROM, TOKIWA_TO) });
  await updateSpotInItinerary(itinId, { spotId: tokugawa.id }, { visitTime: t(11, 2) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
