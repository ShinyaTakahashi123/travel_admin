/**
 * #7 3b17f9a0 企画運営(2026-10-01 07:07)の指摘。fix-7で見落としていた
 * 「でございます」3か所を直す。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '3b17f9a0%'`);
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
    "石ヶ戸",
    "休憩所も設けられておりますので、これから始まる渓流歩きの前に、身支度を整えていただくのにもちょうどよい場所でございます。",
    "休憩所も設けられているので、これから始まる渓流歩きの前に、身支度を整えるのにもちょうどよい場所です。",
    "石ヶ戸"
  );
  await fixOne(
    "阿修羅の流れ",
    "秋の装いをまとったこの一帯は、赤や黄に色づいた木々と白く泡立つ流れが重なり合い、一年の中でも特に華やかな表情を見せてくれる季節でございます。",
    "秋の装いをまとったこの一帯は、赤や黄に色づいた木々と白く泡立つ流れが重なり合い、一年の中でも特に華やかな表情を見せてくれる季節です。",
    "阿修羅の流れ"
  );
  await fixOne(
    "十和田神社",
    "ここは今も地域の方々が大切に守る神域でございますので、境内では静かに、敬意を持ってお参りください。",
    "ここは今も地域の方々が大切に守る神域ですので、境内では静かに、敬意を持ってお参りください。",
    "十和田神社"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
