/**
 * e9a900e3（高松・松山3泊4日）2日目・3日目（中の日）の座標の直し（2026-10-30）
 * 企画運営・法務指摘: 初日・最終日の見直しでも、しおりの全部の点をNominatim/OSMで確かめる決まり
 * （itinerary-rules.md 7章）。時刻・行き先は直さない（中の日のルール）が、座標の誤りと、
 * 総本山善通寺の移動時間（座標を西院の御影堂に直したことに伴う、移動の誤りの直し）は対象。
 *
 * 2日目:
 * - 旧金毘羅大芝居（金丸座）: OSM way 570442011のNominatimの値（法務指摘: 自分で計算した
 *   頂点の平均は使わない。lookup?osm_ids=W570442011の値）に
 * - 金刀比羅宮: OSM way 139583694（建物の頂点の平均、Nominatimの値と同じ）に
 * - 鞘橋と門前町: OSM node 6323396538「鞘橋」に
 * - 旧善通寺偕行社: OSM way 1075688138のNominatimの値（同上）に
 * - 総本山善通寺: 本文が「大師の生まれた…邸宅の跡」とする西院の御影堂（OSM way 566284870、
 *   建物の頂点の平均）に。東院寄りの元の点から約250m移るため、偕行社からの移動（徒歩）を
 *   routing.openstreetmap.de/routed-footで測り直し、15分→22分に直す（移動の誤りの直し）。
 *   到着時刻を14:35→14:42、滞在を70分→63分にし、丸亀城への出発時刻（15:45）は変えない。
 * - 丸亀城: OSM node 1179835155（Nominatimの値と同じ、けたを合わせる）に
 *
 * 3日目:
 * - 松山城: OSM node 611661255（愛媛、Nominatimの値と同じ、けたを合わせる）に
 * - 二之丸史跡庭園: OSM way 137312636（Nominatimの値と同じ、けたを合わせる）に
 * - 萬翠荘: OSM way 505266693（Nominatimの値と同じ、けたを合わせる）に
 * - 坂の上の雲ミュージアム: OSM way 216404934の値に（現在値から約9mの直し）
 * - 愚陀佛庵: 2010年の土砂崩れで壊れ、令和8年（2026年）7月24日に松山市立番町小学校プール
 *   跡地（松山市二番町4丁目6番地1）に再建・公開済み（市の公式資料で確認）。再建後の建物は
 *   OSMにまだ無いため、GSI地理院地図の番地点（33.839455,132.766403）に直す
 *   （現在値は元の場所に近い約22mずれた点だったため）。メモの文章は既に再建後の内容に
 *   なっているため変更しない。
 * - 秋山兄弟生誕地・高燈籠・子規堂: OSM値とほぼ完全一致のため変更なし
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const KANAMARUZA = "d1d45bd6-9e97-4613-af63-5fbcb49875f9";
const KOTOHIRAGU = "128c14c6-b864-4762-9d7b-10f3dd13c9de";
const SAYABASHI = "9e495304-1d1c-46ca-9a22-94fc59b5b122";
const KAIKOSHA = "cad1a6ee-6966-49b6-bdbc-6dc28303b9c9";
const ZENTSUJI = "5e99ee67-8c81-44e3-a111-25cf4f159841";
const MARUGAMEJO = "fe772ef4-dd5b-43be-9234-531a09c52dc3";

const MATSUYAMAJO = "bad04269-bb14-4825-b785-d468f7180f35";
const NINOMARU = "2b7ad779-c755-4b74-85ad-02c80b2fe5ee";
const BANSUISO = "c6780e34-9c10-47af-b9d3-5f353b7ec506";
const SAKANOUE_MUSEUM = "17dc6cbb-5f79-4289-9187-5642df096f14";
const GUDABUTSUAN = "7fab99ef-03cc-4114-bd24-3e2e5c61563b";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

async function main() {
  const spots = await prisma.spot.findMany({
    where: {
      id: {
        in: [
          KANAMARUZA,
          KOTOHIRAGU,
          SAYABASHI,
          KAIKOSHA,
          ZENTSUJI,
          MARUGAMEJO,
          MATSUYAMAJO,
          NINOMARU,
          BANSUISO,
          SAKANOUE_MUSEUM,
          GUDABUTSUAN,
        ],
      },
    },
    include: { transitLegs: true },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const expect: Record<string, [string, string]> = {
    [KANAMARUZA]: ["34.184617", "133.818003"],
    [KOTOHIRAGU]: ["34.183989", "133.80939"],
    [SAYABASHI]: ["34.185643", "133.82165"],
    [KAIKOSHA]: ["34.227617", "133.78775"],
    [ZENTSUJI]: ["34.225972", "133.776773"],
    [MARUGAMEJO]: ["34.286022", "133.800101"],
    [MATSUYAMAJO]: ["33.845651", "132.765746"],
    [NINOMARU]: ["33.842727", "132.764423"],
    [BANSUISO]: ["33.842466", "132.768202"],
    [SAKANOUE_MUSEUM]: ["33.841771", "132.769208"],
    [GUDABUTSUAN]: ["33.839259", "132.76639"],
  };
  for (const [id, [lat, lng]] of Object.entries(expect)) {
    const s = byId.get(id)!;
    if (s.lat?.toString() !== lat || s.lng?.toString() !== lng) {
      throw new Error(`${s.name}: 座標現在値が期待と不一致。現在値=${s.lat},${s.lng}`);
    }
  }
  const zentsuji = byId.get(ZENTSUJI)!;
  if (zentsuji.visitTime?.toISOString() !== t(14, 35).toISOString()) throw new Error("総本山善通寺: visitTime現在値が期待と不一致");
  if (zentsuji.stayDurationMin !== 70) throw new Error("総本山善通寺: stayDurationMin現在値が期待と不一致");
  const zentsujiLegs = zentsuji.transitLegs.filter((l) => l.transitMode === "walk");
  if (zentsujiLegs.length !== 1 || zentsujiLegs[0].transitDurationMin !== 15) {
    throw new Error("総本山善通寺: transitLeg現在値が期待と不一致");
  }
  console.log("前提の確認OK。\n");

  console.log("[旧金毘羅大芝居（金丸座）] 34.184617,133.818003 → 34.184617,133.8180025（OSM way 570442011のNominatim値）");
  console.log("[金刀比羅宮] 34.183989,133.80939 → 34.1839885,133.8093897（OSM way 139583694）");
  console.log("[鞘橋と門前町] 34.185643,133.82165 → 34.1856427,133.8216501（OSM node 6323396538）");
  console.log("[旧善通寺偕行社] 34.227617,133.78775 → 34.227617,133.7877498（OSM way 1075688138のNominatim値）");
  console.log("[総本山善通寺] 34.225972,133.776773 → 34.2245166,133.7742161（西院・御影堂、OSM way 566284870）");
  console.log("  移動（偕行社→総本山善通寺、徒歩）15分 → 22分（routing.openstreetmap.de/routed-footで1664m/22.2分）");
  console.log("  到着 14:35→14:42、滞在 70分→63分（丸亀城への出発15:45は変更なし）");
  console.log("[丸亀城] 34.286022,133.800101 → 34.2860216,133.8001009（OSM node 1179835155）");
  console.log("[松山城] 33.845651,132.765746 → 33.8456510,132.7657463（OSM node 611661255）");
  console.log("[二之丸史跡庭園] 33.842727,132.764423 → 33.8427272,132.7644227（OSM way 137312636）");
  console.log("[萬翠荘] 33.842466,132.768202 → 33.8424656,132.7682015（OSM way 505266693）");
  console.log("[坂の上の雲ミュージアム] 33.841771,132.769208 → 33.8418489,132.7691840（OSM way 216404934）");
  console.log("[愚陀佛庵] 33.839259,132.76639 → 33.839455,132.766403（GSI番地点、二番町4丁目6-1の再建地）");

  if (!commit) {
    console.log("\n確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: KANAMARUZA }, data: { lat: 34.184617, lng: 133.8180025 } }),
    prisma.spot.update({ where: { id: KOTOHIRAGU }, data: { lat: 34.1839885, lng: 133.8093897 } }),
    prisma.spot.update({ where: { id: SAYABASHI }, data: { lat: 34.1856427, lng: 133.8216501 } }),
    prisma.spot.update({ where: { id: KAIKOSHA }, data: { lat: 34.227617, lng: 133.7877498 } }),
    prisma.spot.update({
      where: { id: ZENTSUJI },
      data: {
        lat: 34.2245166,
        lng: 133.7742161,
        visitTime: t(14, 42),
        stayDurationMin: 63,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 22 }] },
      },
    }),
    prisma.spot.update({ where: { id: MARUGAMEJO }, data: { lat: 34.2860216, lng: 133.8001009 } }),
    prisma.spot.update({ where: { id: MATSUYAMAJO }, data: { lat: 33.845651, lng: 132.7657463 } }),
    prisma.spot.update({ where: { id: NINOMARU }, data: { lat: 33.8427272, lng: 132.7644227 } }),
    prisma.spot.update({ where: { id: BANSUISO }, data: { lat: 33.8424656, lng: 132.7682015 } }),
    prisma.spot.update({ where: { id: SAKANOUE_MUSEUM }, data: { lat: 33.8418489, lng: 132.769184 } }),
    prisma.spot.update({ where: { id: GUDABUTSUAN }, data: { lat: 33.839455, lng: 132.766403 } }),
  ]);
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
