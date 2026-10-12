/**
 * #71 4ba25b3d 由比ヶ浜と稲村ヶ崎、江ノ電に揺られる鎌倉の海辺さんぽプラン。
 * 企画運営(2026-10-01 06:27)の口調直し(「お疲れさまでした」)と、
 * 法務(2026-10-01 06:24)の3点。記録: docs/content/legal-review/
 * 見直し-1日4か所.md 最後の節(2429fb3)
 * - 新江ノ島水族館(結び): 「お疲れさまでした。」を外す
 * - 鎌倉高校前の踏切: 撮影マナーの一文を追加
 * - 江の島岩屋: 祈りの一文を追加(信仰発祥の地のため)
 * - 江の島岩屋(洞窟): 頭上・足元の安全の一文を追加
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '4ba25b3d%'`);
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
    "新江ノ島水族館",
    "由比ヶ浜から江ノ電に揺られて続いてきた海辺さんぽも、この水族館で締めくくりです。お疲れさまでした。",
    "由比ヶ浜から江ノ電に揺られて続いてきた海辺さんぽも、この水族館で締めくくりです。",
    "新江ノ島水族館(口調)"
  );
  await fixOne(
    "江ノ電（長谷〜鎌倉高校前）",
    "踏切での撮影を楽しんだら、江ノ電に揺られてさらに海沿いを進み、稲村ヶ崎を目指しましょう。",
    "撮影する際は、踏切や車道で立ち止まらず、地元の方や車の迷惑にならないようにしましょう。江ノ電に揺られてさらに海沿いを進み、稲村ヶ崎を目指しましょう。",
    "鎌倉高校前の踏切(撮影マナー)"
  );
  await fixOne(
    "江の島岩屋",
    "奥の第二岩屋には、江の島の龍神伝説にちなんだ像が鎮座しています。ひんやりとした洞窟の中を、灯りを頼りにゆっくりと進んでみてください。",
    "奥の第二岩屋には、江の島の龍神伝説にちなんだ像が鎮座しています。信仰の地として、静かに、敬意をもって進みましょう。洞窟内は天井が低いところや足元が悪いところもあるので、頭上や足元に気をつけながら、灯りを頼りにゆっくりと進んでみてください。",
    "江の島岩屋(祈り・安全)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
