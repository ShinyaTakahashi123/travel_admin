/**
 * #23(石鎚神社と石鎚登山ロープウェイ、e8927e1c)の座標の直し(企画運営指摘、2026-10-13)。
 * 1. 石鎚登山ロープウェイ: OSMの大字の点「西之川」だったため、OSMの名前付き
 *    ロープウェイ駅(node 2096161612、aerialway=station、「下谷駅」、
 *    33.798019,133.12719。山麓側の駅)に修正
 * 2. 石鎚神社 口之宮本社: OSMの「石鎚神社」(node 612807210、amenity=place_of_worship、
 *    33.8859546,133.1476685)に修正
 * 伊曽乃神社・武丈公園は今回動かさず、出どころの確認のみ(チェック表に記録):
 * - 伊曽乃神社(33.893341,133.186508)は、公式住所(西条市中野甲1649。出典
 *   navitime.co.jp)を国土地理院で検索した番地の点とすでに一致していた(確認のみ)
 * - 武丈公園(33.899997,133.191581)は、OSMに「武丈公園」の名前付き地物がなく、
 *   国土地理院も大字「福武甲」までしか出ない。現在の点は西条市中野甲
 *   (郵便番号793-0035。rurubu.jp等の掲載住所と一致)の区域内にあり、OSMの
 *   無名の運動施設(pitch・swimming_pool、way 378862485等)の近くにあるため、
 *   おおむね公園内の妥当な位置と考えられる。より良い実点が見つかれば後日差し替え
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ROPEWAY_ID = "56a4e551-a558-441a-a6e6-ab9da47461d2";
const KUCHINOMIYA_ID = "d965042c-6d92-4d26-9c80-9e59e2c988cd";

const fixes = [
  { id: ROPEWAY_ID, lat: 33.798019, lng: 133.12719, label: "石鎚登山ロープウェイ(OSM node 2096161612 下谷駅)" },
  { id: KUCHINOMIYA_ID, lat: 33.8859546, lng: 133.1476685, label: "石鎚神社 口之宮本社(OSM node 612807210)" },
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
