/**
 * #141 050431baの直し(2回目、自己点検)。八甲田丸→ワ・ラッセの距離が
 * 200mなのにwalk/2分だったため「徒歩が速すぎ」と検出された。4分に修正し、
 * 実際の間隔(visitTime)も2分遅らせる必要があるため、ワ・ラッセ以降の
 * Day1全スポットのvisitTimeを2分ずつ後ろにずらす。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const HAKKOUDAMARU_FROM = "この後は、歩いておよそ2分、ねぶたの家ワ・ラッセへ向かいましょう。";
const HAKKOUDAMARU_TO = "この後は、歩いておよそ4分、ねぶたの家ワ・ラッセへ向かいましょう。";

const WARASSE_FROM = "八甲田丸から歩いておよそ2分、ねぶたの家ワ・ラッセに着きます。";
const WARASSE_TO = "八甲田丸から歩いておよそ4分、ねぶたの家ワ・ラッセに着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '050431ba%'`);
  const itinId = rows[0].id;
  const hakkoudamaru = await findSpotInItinerary(itinId, { spotName: "青函連絡船メモリアルシップ八甲田丸" });
  const warasse = await findSpotInItinerary(itinId, { spotName: "ねぶたの家ワ・ラッセ" });
  const aspam = await findSpotInItinerary(itinId, { spotName: "青森県観光物産館アスパム" });
  const utou = await findSpotInItinerary(itinId, { spotName: "善知鳥神社" });
  const shinmachi = await findSpotInItinerary(itinId, { spotName: "新町通り" });
  const gappo = await findSpotInItinerary(itinId, { spotName: "合浦公園" });
  const asamushi = await findSpotInItinerary(itinId, { spotName: "浅虫水族館" });

  if (!hakkoudamaru.memo?.includes(HAKKOUDAMARU_FROM)) throw new Error("八甲田丸の文言が想定外です");
  if (!warasse.memo?.includes(WARASSE_FROM)) throw new Error("ワ・ラッセの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: hakkoudamaru.id },
      data: { memo: hakkoudamaru.memo!.replace(HAKKOUDAMARU_FROM, HAKKOUDAMARU_TO) },
    }),
    prisma.spot.update({
      where: { id: warasse.id },
      data: {
        memo: warasse.memo!.replace(WARASSE_FROM, WARASSE_TO),
        visitTime: t(11, 1),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    }),
    prisma.spot.update({ where: { id: aspam.id }, data: { visitTime: t(11, 45) } }),
    prisma.spot.update({ where: { id: utou.id }, data: { visitTime: t(12, 20) } }),
    prisma.spot.update({ where: { id: shinmachi.id }, data: { visitTime: t(12, 56) } }),
    prisma.spot.update({ where: { id: gappo.id }, data: { visitTime: t(14, 4) } }),
    prisma.spot.update({ where: { id: asamushi.id }, data: { visitTime: t(15, 24) } }),
  ]);

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
