/**
 * #76 7ec2843d カップヌードルミュージアムと帆船日本丸、みなとみらい散策
 * プラン。法務(2026-10-01 06:24)の指摘。記録: docs/content/legal-review/
 * 見直し-1日4か所.md 最後の節(2429fb3)
 * - よこはまコスモワールド: 「乗りたいアトラクションごとにチケットを
 *   購入する仕組み」(チケットは書かない決まり)→「乗りたいものを選んで
 *   楽しめる都市型遊園地」に
 * あわせて見つけた口調の直し(象の鼻パーク・大さん橋の結び「お疲れさまでした」)
 * も外した。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

async function fixOne(spotName: string, from: string, to: string, label: string) {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '7ec2843d%'`);
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
    "よこはまコスモワールド",
    "園内は、乗りたいアトラクションごとにチケットを購入する仕組みの都市型遊園地になっているので、気になるものだけを選んで楽しめます。",
    "園内は、乗りたいものを選んで楽しめる都市型遊園地になっています。",
    "よこはまコスモワールド(チケット表現)"
  );
  await fixOne(
    "象の鼻パーク・大さん橋",
    "日が暮れてから時間に余裕があれば、赤レンガ倉庫周辺から出航する、京浜工業地帯の幻想的な明かりを船上から眺める工場夜景クルーズに参加してみるのもおすすめです。お疲れさまでした。",
    "日が暮れてから時間に余裕があれば、赤レンガ倉庫周辺から出航する、京浜工業地帯の幻想的な明かりを船上から眺める工場夜景クルーズに参加してみるのもおすすめです。",
    "象の鼻パーク・大さん橋(口調)"
  );

  if (!COMMIT) console.log("\n確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
