/**
 * 企画運営(2026-10-01 13:25)指摘。言葉の点検の見落とし8件(確認済み
 * だったもの)をまとめて直す。
 * #1 fc54731b: 本能寺「命日の6月2日」(年中行事の日にち)→「毎年6月」
 * #2 bb3ae76a: 外国人墓地「亡くなった水兵2名」(亡くなった人数)→数を外す
 * #12 d8ccb730: 北野天満宮「例年2月25日」(年中行事の日にち)→「例年2月」
 * #16 c946b414: 白兎神社「皮膚の病にご利益」(病気に効く書き方)→
 *   「皮膚の回復を願う人がお参りする」
 * #22 f3ee1b04: 立山駅「私有車が入れない立山有料道路」(料金の言葉)→
 *   「マイカーが入れない山岳道路」
 * #23 401d9f0c: 説明文「無料の足湯」(料金の言葉)→「足湯」
 * #37 41e37fe5: 水間寺「両方のご利益にあやかったら」(ご利益をすすめる
 *   言い方)→ふつうの結びに
 * #40 1d70017a: 海士潜女神社「めまい除けにご利益」(病気に効く書き方)→
 *   「潜水の安全を願う人がお参りする」
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

type SpotFix = { itinPrefix: string; spotName: string; from: string; to: string };
type DescFix = { itinPrefix: string; from: string; to: string };

const SPOT_FIXES: SpotFix[] = [
  {
    itinPrefix: "fc54731b",
    spotName: "本能寺",
    from: "境内には信長を祀る廟所があり、命日の6月2日には信長忌の法要が営まれています。",
    to: "境内には信長を祀る廟所があり、毎年6月には信長忌の法要が営まれています。",
  },
  {
    itinPrefix: "bb3ae76a",
    spotName: "外国人墓地",
    from: "安政元年(1854)、ペリー来航の際にこの地で亡くなった水兵2名を埋葬したのが始まりと伝えられ、",
    to: "安政元年(1854)、ペリー来航の際にこの地で亡くなった水兵を埋葬したのが始まりと伝えられ、",
  },
  {
    itinPrefix: "d8ccb730",
    spotName: "北野天満宮",
    from: "その梅が飛んできたという「飛梅」伝説にちなみ、境内には数多くの梅が植えられ、例年2月25日には梅花祭が行われます。",
    to: "その梅が飛んできたという「飛梅」伝説にちなみ、境内には数多くの梅が植えられ、例年2月には梅花祭が行われます。",
  },
  {
    itinPrefix: "c946b414",
    spotName: "白兎神社",
    from: "和邇(わに)を欺いて皮をはがれてしまった兎を、大国主命が助けたという逸話から、皮膚の病にご利益があるとされ、近年では兎と大国主命の絆にちなんで、縁結びの神社としても親しまれています。",
    to: "和邇(わに)を欺いて皮をはがれてしまった兎を、大国主命が助けたという逸話から、皮膚の回復を願う人がお参りする神社とされ、近年では兎と大国主命の絆にちなんで、縁結びの神社としても親しまれています。",
  },
  {
    itinPrefix: "f3ee1b04",
    spotName: "立山駅",
    from: "（2日目は、私有車が入れない立山有料道路をバスで進みます）。",
    to: "（2日目は、マイカーが入れない山岳道路をバスで進みます）。",
  },
  {
    itinPrefix: "41e37fe5",
    spotName: "水間寺",
    from: "厄除けと縁結び、両方のご利益にあやかったら、次は世界遺産の百舌鳥古墳群へ向かいましょう。",
    to: "厄除けと縁結びで知られるこの寺をめぐったら、この後は、世界遺産の百舌鳥古墳群へ向かいましょう。",
  },
  {
    itinPrefix: "1d70017a",
    spotName: "海士潜女神社",
    from: "潜水作業の安全や「めまい除け」にご利益があるとされ、地元の海女さんだけでなく、全国のダイバーからも信仰を集めています。",
    to: "潜水の安全を願う人がお参りする神社として、地元の海女さんだけでなく、全国のダイバーからも信仰を集めています。",
  },
];

const DESC_FIXES: DescFix[] = [
  {
    itinPrefix: "401d9f0c",
    from: "飛騨川沿いの温泉街と、無料の足湯を巡りながら、名湯の雰囲気を楽しむ定番プランです。",
    to: "飛騨川沿いの温泉街と、足湯を巡りながら、名湯の雰囲気を楽しむ定番プランです。",
  },
];

async function main() {
  let ok = 0;
  let total = 0;
  for (const fix of SPOT_FIXES) {
    total++;
    const label = `${fix.itinPrefix}/${fix.spotName}`;
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '${fix.itinPrefix}%'`);
    if (!rows.length) { console.error(`NG: ${label}: itinerary not found`); continue; }
    const itinId = rows[0].id;
    const spot = await findSpotInItinerary(itinId, { spotName: fix.spotName });
    if (!spot.memo!.includes(fix.from)) { console.error(`NG: ${label}: 文言が想定外です`); continue; }
    console.log(`確認OK: ${label}`);
    if (COMMIT) {
      await updateSpotInItinerary(itinId, { spotId: spot.id }, { memo: spot.memo!.replace(fix.from, fix.to) });
      console.log(`COMMITTED: ${label}`);
    }
    ok++;
  }
  for (const fix of DESC_FIXES) {
    total++;
    const label = `${fix.itinPrefix}/description`;
    const rows: any[] = await prisma.$queryRawUnsafe(`select id::text, description from itinerary where id::text like '${fix.itinPrefix}%'`);
    if (!rows.length) { console.error(`NG: ${label}: itinerary not found`); continue; }
    const itinId = rows[0].id;
    const description: string = rows[0].description;
    if (!description.includes(fix.from)) { console.error(`NG: ${label}: 文言が想定外です`); continue; }
    console.log(`確認OK: ${label}`);
    if (COMMIT) {
      await prisma.itinerary.update({ where: { id: itinId }, data: { description: description.replace(fix.from, fix.to) } });
      console.log(`COMMITTED: ${label}`);
    }
    ok++;
  }
  console.log(`\n合計 ${total}件、成功 ${ok}件`);
  if (!COMMIT) console.log("確認モードです。--commit で書き込みます。");
}
main().finally(() => prisma.$disconnect());
