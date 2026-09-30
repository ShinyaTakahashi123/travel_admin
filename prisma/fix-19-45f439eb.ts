/**
 * #19 45f439eb 徴古館と佐賀バルーンミュージアム、佐賀の科学と歴史を学ぶ
 * プラン。企画運営(2026-10-01 06:27)の口調直し。時刻・行き先は変更しない。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '45f439eb%'`);
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
    "徴古館",
    "皆様、本日ご案内するのは徴古館です。",
    "旅の始まりは徴古館です。",
    "徴古館(書き出し)"
  );
  await fixOne(
    "徴古館",
    "日本でも早くに生まれた私立博物館の歴史そのものを感じながら、鍋島家の至宝をお楽しみください。",
    "日本でも早くに生まれた私立博物館の歴史そのものを感じながら、鍋島家の至宝をゆっくり見学してください。",
    "徴古館(結び)"
  );
  await fixOne(
    "佐賀バルーンミュージアム",
    "空を彩る熱気球のロマンを、館内でじっくりとお楽しみください。",
    "空を彩る熱気球のロマンを、館内でじっくりと味わってください。",
    "佐賀バルーンミュージアム"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
