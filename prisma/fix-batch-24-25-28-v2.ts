/**
 * #24・#25・#28の座標の再修正(企画運営指摘、2026-10-13)。
 * 1. #24 伊予西条駅前（昼食）: 前回使った西条市観光交流センターが、同じしおりの
 *    別スポット(D1-6「西条市観光交流センター」)と同じ点になり重なっていたため、
 *    伊予西条駅そのもの(node 8599386263、railway=station、33.9124158,133.1875765)
 *    に変更
 * 2. #25 御井町周辺（昼食）: 無名の道路の点は使えないとの指摘のため、御井町内の
 *    実在・名前付きの地物「高良山鳥居」(node 4715903789、historic=monument、
 *    33.30191,130.564956。高良大社の参道の入口)に修正
 * 3. #28 西条駅周辺（昼食、広島）: 前回使ったnode 265919207がタグのない点だった
 *    (バグの影響)ため、JR西条駅の駅舎(way 406533740、building=train_station、
 *    34.4311299,132.7436206)に修正
 * いずれもnode/way単体の直接取得で再確認済み。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const EKIMAE_ID = "b7919763-ddd6-4b78-a93a-42e94552fa34";
const MIIMACHI_ID = "b4f49aba-a3bb-4dab-aac5-829811261df5";
const SAIJO_HIRO_ID = "0e60efb9-54b0-4bb7-8013-aef131bc150a";

const fixes = [
  { id: EKIMAE_ID, lat: 33.9124158, lng: 133.1875765, label: "伊予西条駅前（昼食）(OSM node 8599386263 伊予西条駅)" },
  { id: MIIMACHI_ID, lat: 33.30191, lng: 130.564956, label: "御井町周辺（昼食）(OSM node 4715903789 高良山鳥居)" },
  { id: SAIJO_HIRO_ID, lat: 34.4311299, lng: 132.7436206, label: "西条駅周辺（昼食）(OSM way 406533740 JR西条駅)" },
];

async function main() {
  const spots = await Promise.all(fixes.map((f) => prisma.spot.findUnique({ where: { id: f.id } })));
  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i];
    if (!s) throw new Error("想定と違います: " + fixes[i].id);
    console.log(fixes[i].label, ":", s.lat, s.lng, "→", fixes[i].lat, fixes[i].lng);
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i]!;
    const f = fixes[i];
    if (s.placeMasterId) {
      await prisma.placeMaster.update({ where: { id: s.placeMasterId }, data: { lat: f.lat, lng: f.lng, positionSource: "osm" } });
    }
    await prisma.spot.update({ where: { id: s.id }, data: { lat: f.lat, lng: f.lng } });
  }
  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
