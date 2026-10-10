/**
 * #86 c77a7701 秋田市民市場と川反、あきた食文化を満喫するグルメプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'c77a7701%'`);
  const itinId = rows[0].id;
  const spot = await findSpotInItinerary(itinId, { spotName });
  if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  console.log(`確認OK: ${label}`);
  if (!COMMIT) return;
  await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(from, to) });
  console.log(`COMMITTED: ${label}`);
}

async function main() {
  await fixOne(
    "秋田市民市場",
    "本日ご案内するのは秋田市民市場です。",
    "旅の始まりは秋田市民市場です。",
    "秋田市民市場(書き出し)"
  );
  await fixOne(
    "秋田市民市場",
    "地元の人々の暮らしに根づいた市場の活気を、目と舌でお楽しみください。市場を歩いたあとは、秋田を代表する歓楽街、川反へとご案内いたします。",
    "地元の人々の暮らしに根づいた市場の活気を、目と舌で楽しんでください。市場を歩いたあとは、秋田を代表する歓楽街、川反へ向かいましょう。",
    "秋田市民市場(結び)"
  );
  await fixOne(
    "千秋公園",
    "秋田の食文化と歴史をたどる旅は、ここで終了です。お疲れさまでした。お帰りは、秋田駅方面へ徒歩またはバスでどうぞ。",
    "秋田の食文化と歴史をたどる旅は、ここで終わりです。お帰りは、秋田駅方面へ徒歩またはバスでどうぞ。",
    "千秋公園(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
