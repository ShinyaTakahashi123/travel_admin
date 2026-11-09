/**
 * 公開中のしおり b6c6744a(異国情緒あふれる元町と金森赤レンガ倉庫、大沼国定公園を
 * めぐる函館日帰りプラン)の残り5スポットの座標直し(法務2026-10-26指摘。
 * 度分秒からの換算・丸めた値だったもの)。OSMの名前つきの地物の点に直す。
 *
 * - 旧函館区公会堂: OSM node 2519645005(tourism=attraction, name="旧函館区公会堂")
 * - 金森赤レンガ倉庫: OSM node 2476094422(shop=mall, name="金森赤レンガ倉庫", 末広町12)
 * - 湯の川温泉: OSM node 6194038634(railway=tram_stop, name="湯の川温泉")。温泉街全体を
 *   指す名前で1点に絞れないため、名前が完全一致する市電の停留所を採用(法務確認済み:
 *   施設自体の点がなく、名前が完全に一致する停留所であるため可)
 * - 大沼国定公園: OSM node 3608187093(tourism=information, name="大沼国際交流プラザ")。
 *   公園の境界(relation 15009591)の中心点は湖や森の中に落ち、地図で向かう人の目印に
 *   ならないため不採用(企画運営の指摘・法務の最終判断)。公園入口の案内所の点を採用
 * - 島巡りの路: 遊歩道そのものを指すOSMの地物が見つからなかったため、歩き始める場所に
 *   あたる OSM node 264424430(railway=stop, name="大沼公園")を採用(法務確認済み:
 *   施設自体の点がなく、歩き始める駅であるため可)。Overpassで「浮島橋」などの橋の名前
 *   を持つ地物も探したが、遊歩道上の橋と確認できるものは見つからなかった
 *
 * 実行方法:
 *   確認モード: npm run prod -- npx tsx prisma/fix-hakodate-coords.ts
 *   本登録     : npm run prod -- npx tsx prisma/fix-hakodate-coords.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const HAKODATE_ID = "b6c6744a-856b-4406-b0ab-45acdf70fbaa";

const FIXES = [
  {
    id: "f9adcbdd-eefa-46aa-bb11-b40b5e8a3e5e",
    name: "旧函館区公会堂",
    oldLat: 41.765028,
    oldLng: 140.708889,
    newLat: 41.765038,
    newLng: 140.708921,
  },
  {
    id: "e539b04e-1d8f-43c9-936c-af3433f9b8ca",
    name: "金森赤レンガ倉庫",
    oldLat: 41.766111,
    oldLng: 140.7175,
    newLat: 41.766184,
    newLng: 140.716449,
  },
  {
    id: "353b0e29-8d5b-4387-8a75-daca3c659ecd",
    name: "湯の川温泉",
    oldLat: 41.7825,
    oldLng: 140.7906,
    newLat: 41.780021,
    newLng: 140.785155,
  },
  {
    id: "1e6485ed-3f15-43f1-be5b-e42a6b91b41b",
    name: "大沼国定公園",
    oldLat: 41.9772,
    oldLng: 140.6822,
    newLat: 41.980588,
    newLng: 140.670413,
  },
  {
    id: "d9d45cb8-f957-49e3-b428-6011e85ccabb",
    name: "島巡りの路",
    oldLat: 41.98,
    oldLng: 140.671,
    newLat: 41.980839,
    newLng: 140.669966,
  },
];

async function main() {
  console.log("=== 確認 ===");
  for (const f of FIXES) {
    const spot = await prisma.spot.findUnique({
      where: { id: f.id },
      include: { day: { include: { itinerary: { select: { id: true, status: true } } } } },
    });
    if (!spot) throw new Error(`スポットが見つかりません: ${f.name} (${f.id})`);
    if (spot.day.itinerary.id !== HAKODATE_ID) throw new Error(`対象外のしおりです: ${f.name}`);
    if (spot.day.itinerary.status !== "published") throw new Error(`公開中ではありません: ${f.name}`);
    if (spot.name !== f.name) throw new Error(`スポット名が想定と違います: ${spot.name}`);
    const lat = spot.lat?.toNumber() ?? 0;
    const lng = spot.lng?.toNumber() ?? 0;
    if (Math.abs(lat - f.oldLat) > 1e-6 || Math.abs(lng - f.oldLng) > 1e-6) {
      throw new Error(`座標が想定と違います: ${f.name} lat=${spot.lat} lng=${spot.lng}`);
    }
    console.log(`[OK] ${f.name} (${f.id}): ${f.oldLat},${f.oldLng} → ${f.newLat},${f.newLng}`);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  console.log("\n=== 書き込み ===");
  for (const f of FIXES) {
    await prisma.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } });
    console.log(`  ${f.name}: COMMITTED`);
  }
}
main().finally(() => prisma.$disconnect());
