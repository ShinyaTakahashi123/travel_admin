/**
 * いちご狩り#5(うきは, 21141835)の直し(法務指摘、2026-10-13)。
 * 1. つづら棚田: OSMの展望の点(node 5982047189、「つづら棚田」tourism=viewpoint、
 *    33.2677994,130.8244094)から約2.6km離れていたため、その点に修正
 * 2. 春光園: 出どころを確かめたところ、OSMの「春光園 觀光果園」
 *    (node 5543219421、tourism=attraction、33.3355378,130.8313406)から
 *    約1km離れていたため、その点に修正
 * 3. (任意、法務提案採用)「鯉とりまあしゃん」は実在した人の呼び名のため、
 *    「地元の鯉とりの名人」に変更
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const SHUNKOEN_ID = "e06b1b41-7adf-478f-93a1-488731243c01";
const TSUZURA_ID = "2a5da114-36ee-4811-836d-5833c380fd23";
const TAISHUMARU_ID = "5306a0e0-f154-4a76-bd82-e4a7e688518a";

const TAISHUMARU_MEMO_NEW =
  "昭和3年(1928)開業のJR久大本線田主丸駅は、平成4年(1992)、地元・浮羽工業高校の生徒が河童をイメージしてデザインした駅舎に生まれ変わりました。筑後川流域に伝わる河童伝説の地として知られ、中央アジアから海を渡った河童が球磨川(熊本県)から筑後川へ移り住んだという言い伝えが残ります。戦時中にこの地を訪れた作家・火野葦平は、川で鯉をとる地元の名人との出会いをきっかけに、河童を題材にした作品を多く残しました。駅舎内の「田主丸ふるさと会館」には河童の資料館やカフェがあり、ホームの「お迎え河童」や駅前の「楽太郎河童」が出迎えてくれます。駅の周りを歩くと、あちこちに河童の像を見つけられます。";

const fixes = [
  { id: SHUNKOEN_ID, lat: 33.3355378, lng: 130.8313406, label: "春光園(OSM node 5543219421)" },
  { id: TSUZURA_ID, lat: 33.2677994, lng: 130.8244094, label: "つづら棚田(OSM node 5982047189)" },
];

async function main() {
  const taishumaru = await prisma.spot.findUnique({ where: { id: TAISHUMARU_ID } });
  if (!taishumaru) throw new Error("想定と違います");
  const spots = await Promise.all(fixes.map((f) => prisma.spot.findUnique({ where: { id: f.id } })));
  for (let i = 0; i < fixes.length; i++) {
    const s = spots[i];
    if (!s) throw new Error("想定と違います: " + fixes[i].id);
    console.log(fixes[i].label, ":", s.lat, s.lng, "→", fixes[i].lat, fixes[i].lng);
  }
  console.log("[確認OK] 田主丸駅: 「鯉とりまあしゃん」→「鯉をとる地元の名人」");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.spot.update({ where: { id: TAISHUMARU_ID }, data: { memo: TAISHUMARU_MEMO_NEW } });

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
