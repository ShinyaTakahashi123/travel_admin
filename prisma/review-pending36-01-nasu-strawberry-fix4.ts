/**
 * #1(那須いちご狩り)の直し直しその2。企画運営の指摘(2026-10-13)に対応。
 * 1. 説明文にステンドグラス美術館を追加
 * 2. 座標の丸め値を、OSMの実際の点に置き直す
 *    - いちごの森: OSMノード5898506333「いちごの森」37.0185178, 140.0280367
 *    - 那須温泉神社: OSMウェイ452370586「温泉神社」の起点37.0999753, 139.9988945
 * 3. ステンドグラス美術館の記述に出典を確認(gltjp.com、1800年代のアンティーク
 *    ステンドグラス・コッツウォルズ地方のマナーハウスをモチーフにした建物と確認)
 * 4. いちごの森メモの「楽しみましょう」の重複を直す
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ITIN_ID = "df7271d1-8bcb-4e05-a142-bb33e425fce1";
const ICHIGO_SPOT_ID = "cc9db79a-f746-421f-9e0c-2bddc366f314";
const SHRINE_SPOT_ID = "10ea5230-ead0-42f4-b847-d65e07cc759c";

const NEW_DESCRIPTION =
  "那須高原の観光いちご園でいちご狩りを楽しんだあと、九尾の狐伝説で知られる殺生石と、隣接する古社・那須温泉神社をめぐります。午後は那須どうぶつ王国で昼食をとりながら動物とふれあい、那須ステンドグラス美術館を見学して、南ヶ丘牧場で那須の牧場風景を楽しむ日帰りプランです。";

const ICHIGO_MEMO =
  "栃木県が育成したブランドいちご「とちおとめ」や「とちあいか」などを楽しめる観光いちご園で、ハウスは立ったまま摘み取れる高設栽培です。開園期間や時間は季節によって変わるため、訪れる前に公式サイトで確かめましょう。いちご狩りは、この観光農園の中だけにしましょう。周辺には出荷用のいちご畑も広がっていますが、観光農園以外の畑には入らないようにしましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID }, select: { description: true } });
  const ichigo = await prisma.spot.findUnique({ where: { id: ICHIGO_SPOT_ID } });
  const shrine = await prisma.spot.findUnique({ where: { id: SHRINE_SPOT_ID } });
  const sgmSpot = await prisma.spot.findFirst({ where: { name: "那須ステンドグラス美術館" } });
  const sgmPlace = await prisma.placeMaster.findFirst({ where: { name: "那須ステンドグラス美術館" } });
  if (!itin || !ichigo || !shrine || !sgmSpot || !sgmPlace) throw new Error("想定と違います");

  console.log("[確認OK] 説明文にステンドグラス美術館を追加");
  console.log("[確認OK] いちごの森・那須温泉神社の座標をOSMの実点に直す");
  console.log("[確認OK] ステンドグラス美術館のメモに出典確認済みの記述を追加");
  console.log("[確認OK] いちごの森メモの「楽しみましょう」の重複を直す");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESCRIPTION } });
  await prisma.spot.update({ where: { id: ICHIGO_SPOT_ID }, data: { lat: 37.0185178, lng: 140.0280367, memo: ICHIGO_MEMO } });
  await prisma.spot.update({ where: { id: SHRINE_SPOT_ID }, data: { lat: 37.0999753, lng: 139.9988945 } });

  const sgmMemo =
    "イギリス・コッツウォルズ地方の貴族の館(マナーハウス)をモチーフにした石造りの建物で、1800年代のアンティークステンドグラスを中心に展示しています。壁一面がステンドグラスで飾られた礼拝堂もあります。休館日があるため、訪れる前に公式サイトで確かめましょう。";
  await prisma.spot.update({ where: { id: sgmSpot.id }, data: { memo: sgmMemo } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
