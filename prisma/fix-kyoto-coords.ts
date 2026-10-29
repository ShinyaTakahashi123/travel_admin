/**
 * fc54731b（京都3泊4日）座標の直し（法務指摘の22か所＋追加確認分、2026-10-29）
 * docs/content/itinerary-rules.md 7章のとおり、OSMの名前つきの地物の点に直す。
 * 本能寺（78bfa5af）はNominatimの値(OSM way 470070680)とほぼ完全一致していたため対象外。
 *
 * - 京都御所: OSM way 554879249（Nominatimの中心）
 * - 京都タワー: OSM node 1494857741
 * - 三十三間堂: OSM way 31842037
 * - 京都国立博物館: OSM way 31843043
 * - 豊国神社: OSM way 31844031
 * - 六波羅蜜寺: OSM node 4107702310
 * - 建仁寺: OSM way 760889100（建仁寺そのもの。法務指摘2026-10-29: node 7108605498は案内板だったため変更）
 * - 法観寺（八坂の塔）: OSM way 371717423
 * - 二年坂・産寧坂: OSM way 30882783（二寧坂、清水寺に近い区間）
 * - 高台寺: OSM way 759391880
 * - 清水寺: OSM way 336641107
 * - 六道珍皇寺: OSM node 1522769902（六道珍皇寺そのもの。法務指摘2026-10-29: node 4547535698は案内板だったため変更）
 * - 八坂庚申堂: OSM way 1316622873
 * - 円山公園: 公園そのもの（leisure=park、それほど広くなくメモも公園全体のことのため中心点でよい）。OSM way 54170783
 *   （法務指摘2026-10-29: node 5273179108「長楽館」は喫茶・ホテルの建物の点だったため変更）
 * - 八坂神社: OSM way 328903218
 * - 祇園花見小路: OSM way 27908626（花見小路そのもの。法務指摘2026-10-29: node 4198049508は名前が「gion 衹园」で不明だったため変更）
 * - 錦市場: OSM way 772134672
 * - 京都文化博物館: OSM way 352042994（京都府京都文化博物館）
 * - 新京極商店街: OSM way 1568699671（新京極通）
 * - 河原町商店街: 同名の阪急京都河原町駅（railway=station）の点。OSM node 6944607675
 *   （法務指摘2026-10-29: way 484397717「京都BAL」はほかの店の点だったため変更）
 * - 鴨川: 広い川のため、このしおりの行程に近い橋「三条大橋」の点。OSM way 571549175
 * - 先斗町: OSM node 4233370290（先斗町通）
 * - 平安神宮: OSM way 619903245
 * - 京都市京セラ美術館: OSM way 302283151「京都市美術館」（tourism=museum、OSMでは旧称のまま。
 *   法務指摘2026-10-29: node 11433400363は貸し自転車の乗り場だったため変更）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const FIXES: { id: string; name: string; oldLat: string; oldLng: string; newLat: number; newLng: number; source: string }[] = [
  { id: "6332183c-b6a1-477b-b0f9-3c7c97e543b8", name: "京都御所", oldLat: "35.0254", oldLng: "135.7622", newLat: 35.0252635, newLng: 135.7623445, source: "OSM way 554879249" },
  { id: "287bbcac-44c3-448b-8f36-2adf2bff56e1", name: "京都タワー", oldLat: "34.9876", oldLng: "135.7588", newLat: 34.9875524, newLng: 135.7593295, source: "OSM node 1494857741" },
  { id: "2853fd03-419e-4505-9d2d-4eb32a9813f7", name: "三十三間堂", oldLat: "34.9884", oldLng: "135.7717", newLat: 34.9881723, newLng: 135.7717781, source: "OSM way 31842037" },
  { id: "5df4377a-df43-44cb-8f56-27e7fcc2cc95", name: "京都国立博物館", oldLat: "34.9906", oldLng: "135.7717", newLat: 34.9898960, newLng: 135.7728606, source: "OSM way 31843043" },
  { id: "cbbce02b-31e9-40bb-968f-611850b718fc", name: "豊国神社", oldLat: "34.9915", oldLng: "135.7719", newLat: 34.9914108, newLng: 135.7720866, source: "OSM way 31844031" },
  { id: "d49f1c32-06e2-4546-af43-015cce2a8642", name: "六波羅蜜寺", oldLat: "34.9975", oldLng: "135.7726", newLat: 34.9970611, newLng: 135.7733300, source: "OSM node 4107702310" },
  { id: "7a0c3d55-7005-49d2-8242-c0014c0c88e4", name: "建仁寺", oldLat: "35.0016", oldLng: "135.7726", newLat: 35.0002572, newLng: 135.7737408, source: "OSM way 760889100" },
  { id: "743c88cb-350c-4c33-897e-b31325fa3eae", name: "法観寺（八坂の塔）", oldLat: "34.9989", oldLng: "135.7795", newLat: 34.9984916, newLng: 135.7793183, source: "OSM way 371717423" },
  { id: "33cefa42-bd3d-4f92-b986-17289a68cfff", name: "二年坂・産寧坂", oldLat: "34.9977", oldLng: "135.7809", newLat: 34.9980908, newLng: 135.7808377, source: "OSM way 30882783" },
  { id: "c908a91e-a067-4c98-a208-a25c1699ab64", name: "高台寺", oldLat: "35.000761", oldLng: "135.781114", newLat: 35.0003033, newLng: 135.7805956, source: "OSM way 759391880" },
  { id: "a4bde724-a191-43e4-937c-d9d5cae6bc5f", name: "清水寺", oldLat: "34.9948", oldLng: "135.785", newLat: 34.9943030, newLng: 135.7844389, source: "OSM way 336641107" },
  { id: "58845917-22c5-419a-99ef-cb203102f165", name: "六道珍皇寺", oldLat: "34.9977", oldLng: "135.7754", newLat: 34.998384, newLng: 135.7754064, source: "OSM node 1522769902" },
  { id: "3b78213d-a9a7-47ac-80d2-b3f01782a4de", name: "八坂庚申堂", oldLat: "34.9997", oldLng: "135.7804", newLat: 34.9983685, newLng: 135.7787632, source: "OSM way 1316622873" },
  { id: "41ee9ef2-6fb0-4921-983e-586b1033f283", name: "円山公園", oldLat: "35.0028", oldLng: "135.7803", newLat: 35.0037618, newLng: 135.7814763, source: "OSM way 54170783" },
  { id: "23c3479a-c106-47e7-a29e-1e949baae7ea", name: "八坂神社", oldLat: "35.0037", oldLng: "135.7786", newLat: 35.0036027, newLng: 135.7782611, source: "OSM way 328903218" },
  { id: "8a296585-2776-428f-a077-82281d29ac7d", name: "祇園花見小路", oldLat: "35.0032", oldLng: "135.7756", newLat: 35.0026541, newLng: 135.7748676, source: "OSM way 27908626" },
  { id: "408f6b7d-ec6f-4f51-931d-dfad443e3ec0", name: "錦市場", oldLat: "35.005", oldLng: "135.7649", newLat: 35.0050244, newLng: 135.7655699, source: "OSM way 772134672" },
  { id: "f92e6dc6-d15e-47b1-bdae-c2ffde1e101e", name: "京都文化博物館", oldLat: "35.0089", oldLng: "135.7607", newLat: 35.0094898, newLng: 135.7623128, source: "OSM way 352042994" },
  { id: "9d57dd9c-785a-4d15-8992-e52d80f66680", name: "新京極商店街", oldLat: "35.0056", oldLng: "135.7679", newLat: 35.0048090, newLng: 135.7671883, source: "OSM way 1568699671" },
  { id: "3dd74eb8-8b5c-45d4-a37f-45db16d4f14b", name: "河原町商店街（京都河原町駅）", oldLat: "35.0063", oldLng: "135.7688", newLat: 35.0037633, newLng: 135.769608, source: "OSM node 6944607675" },
  { id: "fa2ffd5a-e2e4-4107-932b-dbd40b40b36b", name: "鴨川（三条大橋）", oldLat: "35.0068", oldLng: "135.7707", newLat: 35.0090445, newLng: 135.7717206, source: "OSM way 571549175" },
  { id: "d6542e97-1cb9-43fa-aa77-24858d62ebfe", name: "先斗町", oldLat: "35.0059", oldLng: "135.7695", newLat: 35.0042456, newLng: 135.7712126, source: "OSM node 4233370290" },
  { id: "b77decae-aa7b-4e45-be3f-6b7b37663eeb", name: "平安神宮", oldLat: "35.0161", oldLng: "135.7822", newLat: 35.0160683, newLng: 135.7828961, source: "OSM way 619903245" },
  { id: "9ec1eaff-e40d-42bb-bee6-32afd2193e9d", name: "京都市京セラ美術館", oldLat: "35.012493", oldLng: "135.783798", newLat: 35.0128812, newLng: 135.7835478, source: "OSM way 302283151" },
];

// 言葉の直し4点（法務指摘、2026-10-29）
const MARUYAMA_ID = "41ee9ef2-6fb0-4921-983e-586b1033f283";
const MARUYAMA_MEMO_OLD =
  "しだれ桜で有名な京都最古の公園です。園内の安養寺の山号「慈円山」にちなんで名づけられたと伝えられ、1886年に開園、近代日本庭園の先駆者・7代目小川治兵衛が作庭を手がけたといわれています。名物のしだれ桜は2代目で、初代は昭和22年に枯死し、植え継がれたと伝えられています。八坂神社に隣接し、大人の散策にもぴったりの落ち着いた雰囲気です。";
const MARUYAMA_MEMO_NEW =
  "しだれ桜で知られ、京都でもっとも古い公園とされています。園内の安養寺の山号「慈円山」にちなんで名づけられたと伝えられ、1886年に開園、近代日本庭園の先駆者・7代目小川治兵衛が作庭を手がけたといわれています。名物のしだれ桜は2代目で、初代は昭和22年に枯死し、植え継がれたと伝えられています。八坂神社に隣接し、大人の散策にもぴったりの落ち着いた雰囲気です。";

const KAWARAMACHI_ID = "3dd74eb8-8b5c-45d4-a37f-45db16d4f14b";
const KAWARAMACHI_MEMO_OLD =
  "京都随一の繁華街です。豊臣秀吉による京都の大改造の際、天正18年（1590年）ごろから道が整えられ始めたと伝えられています。江戸時代初め、角倉了以が高瀬川を開削したことをきっかけに、この一帯の都市化が進んだといわれ、幕末には武家屋敷と寺院が並ぶ街並みへと発展しました。ショッピングや食事に便利な中心地です。";
const KAWARAMACHI_MEMO_NEW =
  "京都を代表する繁華街のひとつです。豊臣秀吉による京都の大改造の際、天正18年（1590年）ごろから道が整えられ始めたと伝えられています。江戸時代初め、角倉了以が高瀬川を開削したことをきっかけに、この一帯の都市化が進んだといわれ、幕末には武家屋敷と寺院が並ぶ街並みへと発展しました。ショッピングや食事に便利な中心地です。";

const KODAIJI_ID = "c908a91e-a067-4c98-a208-a25c1699ab64";
const KODAIJI_MEMO_OLD =
  "大人の足取りでねねの道を少し進むと、高台寺に着きます。慶長11年(1606)、豊臣秀吉の正室・北政所（ねね）が、秀吉の菩提を弔うために建てた寺です。小堀遠州の作庭と伝わる庭園は、秀吉とねねを祀る霊屋（おたまや）を望む枯山水と池泉回遊式からなり、桃山文化の粋を伝えています。竹林や紅葉の名所としても知られ、夜間には幻想的なライトアップも行われます。静かに、敬意をもってお参りください。ねねが晩年を過ごしたゆかりの地に思いを馳せながら、大人の静かなひとときを過ごしてください。";
const KODAIJI_MEMO_NEW =
  "大人の足取りでねねの道を少し進むと、高台寺に着きます。慶長11年(1606)、豊臣秀吉の正室・北政所（ねね）が、秀吉の菩提を弔うために建てた寺です。小堀遠州の作庭と伝わる庭園は、秀吉とねねを祀る霊屋（おたまや）を望む枯山水と池泉回遊式からなり、桃山文化の粋を伝えています。竹林や紅葉の名所としても知られ、夜間には幻想的なライトアップも行われます。静かに、敬意をもってお参りください。ねねが晩年を過ごしたゆかりの地に思いを馳せながら、大人の静かなひとときを過ごしましょう。";

const ROKUDOU_ID = "58845917-22c5-419a-99ef-cb203102f165";
const ROKUDOU_MEMO_OLD =
  "清水寺から歩いておよそ15分、六道珍皇寺は、この世とあの世の境目「六道の辻」に建つと伝えられる寺です。平安時代の官僚・小野篁が、夜ごとこの寺の井戸を通って冥界の閻魔大王のもとへ通ったという伝説で知られ、本堂裏手には篁が冥界へ通ったとされる「冥土通いの井戸」が残ります。境内の小さな鐘楼にある「迎え鐘」は、お盆の時期に先祖の霊を呼び寄せる鐘として、今も多くの参拝者が撞きに訪れます。静かに、敬意をもってお参りください。2日目はここまでです。今夜も京都市内の宿でお休みください。";
const ROKUDOU_MEMO_NEW =
  "清水寺から歩いておよそ15分、六道珍皇寺は、この世とあの世の境目「六道の辻」に建つと伝えられる寺です。平安時代の官僚・小野篁が、夜ごとこの寺の井戸を通って冥界の閻魔大王のもとへ通ったという伝説で知られ、本堂裏手には篁が冥界へ通ったとされる「冥土通いの井戸」が残ります。境内の小さな鐘楼にある「迎え鐘」は、お盆の時期に先祖の霊を呼び寄せる鐘として、今も多くの参拝者が撞きに訪れます。静かに、敬意をもってお参りください。2日目はここまでです。この夜も、京都市内の宿に泊まりましょう。";

const MEMO_FIXES = [
  { id: MARUYAMA_ID, name: "円山公園", oldMemo: MARUYAMA_MEMO_OLD, newMemo: MARUYAMA_MEMO_NEW },
  { id: KAWARAMACHI_ID, name: "河原町商店街", oldMemo: KAWARAMACHI_MEMO_OLD, newMemo: KAWARAMACHI_MEMO_NEW },
  { id: KODAIJI_ID, name: "高台寺", oldMemo: KODAIJI_MEMO_OLD, newMemo: KODAIJI_MEMO_NEW },
  { id: ROKUDOU_ID, name: "六道珍皇寺", oldMemo: ROKUDOU_MEMO_OLD, newMemo: ROKUDOU_MEMO_NEW },
];

async function main() {
  const spots = await prisma.spot.findMany({
    where: { id: { in: FIXES.map((f) => f.id) } },
    select: { id: true, lat: true, lng: true },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));

  for (const f of FIXES) {
    const s = byId.get(f.id);
    if (!s) throw new Error(`spot not found: ${f.id}`);
    if (s.lat?.toString() !== f.oldLat || s.lng?.toString() !== f.oldLng) {
      throw new Error(`${f.name}(${f.id}): 現在値が期待と不一致。現在値=${s.lat},${s.lng} 期待値=${f.oldLat},${f.oldLng}`);
    }
  }

  const memoSpots = await prisma.spot.findMany({
    where: { id: { in: MEMO_FIXES.map((f) => f.id) } },
    select: { id: true, memo: true },
  });
  const memoById = new Map(memoSpots.map((s) => [s.id, s]));
  for (const f of MEMO_FIXES) {
    const s = memoById.get(f.id);
    if (!s) throw new Error(`spot not found: ${f.id}`);
    if (s.memo !== f.oldMemo) {
      throw new Error(`${f.name}(${f.id}): memo現在値が期待と不一致`);
    }
  }
  console.log(`前提の確認OK（座標${FIXES.length}件・メモ${MEMO_FIXES.length}件）。\n`);

  for (const f of FIXES) {
    console.log(`[${f.name}] ${f.oldLat},${f.oldLng} → ${f.newLat},${f.newLng}（出典: ${f.source}）`);
  }
  console.log();
  for (const f of MEMO_FIXES) {
    console.log(`[${f.name}] memo旧: ${f.oldMemo}`);
    console.log(`[${f.name}] memo新: ${f.newMemo}\n`);
  }

  if (!commit) {
    console.log("確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction([
    ...FIXES.map((f) => prisma.spot.update({ where: { id: f.id }, data: { lat: f.newLat, lng: f.newLng } })),
    ...MEMO_FIXES.map((f) => prisma.spot.update({ where: { id: f.id }, data: { memo: f.newMemo } })),
  ]);
  console.log("\n書き込みました。");
}

main().finally(() => prisma.$disconnect());
