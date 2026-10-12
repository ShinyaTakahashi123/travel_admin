/**
 * #80 998ecdfc 広島城と縮景園、広島藩の歴史と庭園を巡るプラン。
 * 企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '998ecdfc%'`);
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
    "縮景園",
    "大きな池を中心に、山や渓谷、田園風景まで凝縮したような、変化に富んだ景観をお楽しみいただけます。広島城の力強い歴史とはまた違う、大名庭園ならではの雅やかな趣を、ゆったりと散策してお楽しみください。",
    "大きな池を中心に、山や渓谷、田園風景まで凝縮したような、変化に富んだ景観を楽しめます。広島城の力強い歴史とはまた違う、大名庭園ならではの雅やかな趣を、ゆったりと散策して味わってください。",
    "縮景園"
  );
  await fixOne(
    "聖光寺",
    "お帰りは、JR広島駅や周辺のバス停をご利用ください。旅はここで終了です。お疲れさまでした。",
    "お帰りは、JR広島駅や周辺のバス停をご利用ください。旅はここで終わりです。",
    "聖光寺(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
