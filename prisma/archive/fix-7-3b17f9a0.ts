/**
 * #7 3b17f9a0 奥入瀬渓流を歩き、十和田湖の紅葉に出会う旅。
 * 企画運営(2026-10-01 06:27)の口調直し。案内の口調の言葉(「皆様」
 * 「ご案内」「ご覧ください」系)を、ふつうの書き方に1文ずつ書き換える。
 * 時刻・行き先は変更しない。
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
    "皆様、渓流館を後にして最初に立ち寄りますのが「石ヶ戸」でございます。",
    "渓流館を後にして最初に立ち寄るのが「石ヶ戸」です。",
    "石ヶ戸"
  );
  await fixOne(
    "阿修羅の流れ",
    "皆様、こちらが再び渓流の見どころとしてご案内いたします「阿修羅の流れ」でございます。",
    "こちらが再び渓流の見どころとして現れる「阿修羅の流れ」です。",
    "阿修羅の流れ"
  );
  await fixOne(
    "十和田神社",
    "皆様、奥入瀬渓流を歩かれた後にお立ち寄りいただくのが、十和田湖畔に鎮まる十和田神社でございます。",
    "奥入瀬渓流を歩いた後に立ち寄りたいのが、十和田湖畔に鎮まる十和田神社です。",
    "十和田神社"
  );
  await fixOne(
    "乙女の像",
    "皆様、湖畔にたたずむ乙女の像にお越しいただきました。",
    "湖畔にたたずむ乙女の像に着きます。",
    "乙女の像(書き出し)"
  );
  await fixOne(
    "乙女の像",
    "紅葉狩りの合間に、しばし足を止めてご覧いただければと思います。",
    "紅葉狩りの合間に、しばし足を止めて眺めてみてください。",
    "乙女の像(結び)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
