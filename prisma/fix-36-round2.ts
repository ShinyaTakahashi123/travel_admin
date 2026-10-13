/**
 * #36の直し(企画運営・法務指摘、2026-10-13)。
 * 1. 物産館千菜市を「物産館千菜市（昼食）」に改名、メモの結びを「ここで昼食を
 *    とりましょう」の形に
 * 2. 竹崎観世音寺: 国の重要無形民俗文化財に指定されているのは「竹崎観世音寺
 *    修正会鬼祭」そのもの(出典: 文化庁 文化遺産オンライン detail/136474)。
 *    童子舞はその中で奉納される舞という位置づけに修正。説明文も同様に修正
 * 3. 竹崎城跡: 座標がOSMの案内板(node 4770835164、information=board。
 *    決まりで使わない種類の点)だったため、展望台の建物(way 481203610、
 *    「竹崎城址展望台」、32.9567655,130.223389075)に修正。あわせて、
 *    「南北朝時代、有馬氏によって築かれた」「島原の乱の後に廃城」は、太良町・
 *    佐賀県の公式での確認ができなかったため削除し、中世の城跡であることの
 *    み残す
 * 4. 大魚神社: 「日本有数の干満差」の「有数」を同じ文でぼかす
 * 5. 竹崎城跡→道の駅太良の移動時間(11分)が、実際の道のり(約14km)に対して
 *    短すぎたため18分に修正。道の駅太良の開始が15:57、終了16:37(16:30〜17:00
 *    の範囲内)になるよう調整
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "b9031e4f-79e2-414d-a1e8-bbc809ed5f6f";

const SENJAICHI_ID = "38ad6915-f7b5-4b51-831d-8bed9e76203f";
const OYO_ID = "7e624c09-1263-4d46-ac3e-c15a6168790f";

const OLD_DESC =
  "鹿島藩の政庁が置かれた鹿島城の跡地・旭ヶ岡公園から、有明海の広大な干潟を望む道の駅鹿島、隣の太良町にある大魚神社の海中鳥居、国の重要無形民俗文化財「童子舞」が伝わる竹崎観世音寺や中世の城跡・竹崎城跡、道の駅太良までをめぐる、鹿島・太良の日帰りプランです。";
const NEW_DESC =
  "鹿島藩の政庁が置かれた鹿島城の跡地・旭ヶ岡公園から、有明海の広大な干潟を望む道の駅鹿島、隣の太良町にある大魚神社の海中鳥居、国の重要無形民俗文化財「竹崎観世音寺修正会鬼祭」で童子舞が奉納される竹崎観世音寺や中世の城跡・竹崎城跡、道の駅太良までをめぐる、鹿島・太良の日帰りプランです。";

const SENJAICHI_NAME_NEW = "物産館千菜市（昼食）";
const SENJAICHI_MEMO_NEW =
  "道の駅鹿島の直売所です。ムツゴロウやクチゾコ、ワラスボなど、有明海ならではの珍しい魚介類を使った加工品をはじめ、地元でとれた野菜や果物が並びます。隣接する食事処で、うどんなどの昼食をとりましょう。";

const OYO_MEMO_NEW =
  "隣の太良町、有明海に面して立つ3基の海中鳥居で知られる神社です。有明海は最大6mにもなる、日本有数ともいわれる干満差があり、満潮時には鳥居が海に浮かんでいるように見え、干潮時には鳥居のそばまで干潟を歩ける状態になります。見え方は潮の満ち引きによって大きく変わるので、訪れる前に太良町の潮見表など公式の案内で時刻を確かめましょう。潮が引いていても、鳥居まで無理に歩いて行かず、現地の案内に従いましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const KANZEONJI_MEMO_NEW =
  "太良町竹崎にある古刹です。正月の修正会で行われる「竹崎観世音寺修正会鬼祭」は、国の重要無形民俗文化財に指定されており、この行事の中で「童子舞」と呼ばれる芸能が奉納されます。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

const SHIROATO_LAT = 32.9567655;
const SHIROATO_LNG = 130.223389075;
const SHIROATO_MEMO_NEW =
  "有明海に面した竹崎の高台に立つ、中世の城跡を伝える展望台です。今は城をかたどった展望台が立ち、有明海や多良岳、晴れた日には雲仙岳までを見渡せます。展望台の階段には段差があるので、足元に注意しましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.description !== OLD_DESC) throw new Error("説明文が想定と違います");

  const senjaichi = await prisma.spot.findUnique({ where: { id: SENJAICHI_ID } });
  const oyo = await prisma.spot.findUnique({ where: { id: OYO_ID } });
  const kanzeonji = await prisma.spot.findFirst({ where: { name: "竹崎観世音寺" } });
  const shiroato = await prisma.spot.findFirst({ where: { name: "竹崎城跡" } });
  const michinoeki = await prisma.spot.findFirst({ where: { name: "道の駅太良" } });
  if (!senjaichi || !oyo || !kanzeonji || !shiroato || !michinoeki) throw new Error("想定と違います");

  const legShiroato = await prisma.spotTransitLeg.findFirst({ where: { spotId: shiroato.id } });
  const legMichinoeki = await prisma.spotTransitLeg.findFirst({ where: { spotId: michinoeki.id } });
  if (!legShiroato || !legMichinoeki) throw new Error("移動データが見つかりません");

  console.log("[確認OK] 説明文を書きかえ");
  console.log("[確認OK] 物産館千菜市 →", SENJAICHI_NAME_NEW);
  console.log("[確認OK] 大魚神社: 「有数」を同じ文でぼかす");
  console.log("[確認OK] 竹崎観世音寺: 重要無形民俗文化財の対象を修正会鬼祭そのものに");
  console.log("[確認OK] 竹崎城跡: 座標", shiroato.lat, shiroato.lng, "→", SHIROATO_LAT, SHIROATO_LNG, "、出典のない由来を削除");
  console.log("[確認OK] leg 竹崎城跡→道の駅太良:", legMichinoeki.transitDurationMin, "→ 18分、道の駅太良 15:57-16:37");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { description: NEW_DESC } });

  await prisma.spot.update({ where: { id: SENJAICHI_ID }, data: { name: SENJAICHI_NAME_NEW, memo: SENJAICHI_MEMO_NEW } });
  await prisma.spot.update({ where: { id: OYO_ID }, data: { memo: OYO_MEMO_NEW } });
  await prisma.spot.update({ where: { id: kanzeonji.id }, data: { memo: KANZEONJI_MEMO_NEW } });

  if (shiroato.placeMasterId) {
    await prisma.placeMaster.update({ where: { id: shiroato.placeMasterId }, data: { lat: SHIROATO_LAT, lng: SHIROATO_LNG, positionSource: "osm" } });
  }
  await prisma.spot.update({ where: { id: shiroato.id }, data: { lat: SHIROATO_LAT, lng: SHIROATO_LNG, memo: SHIROATO_MEMO_NEW } });

  await prisma.spotTransitLeg.update({ where: { id: legMichinoeki.id }, data: { transitDurationMin: 18 } });
  await prisma.spot.update({ where: { id: michinoeki.id }, data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 57)) } });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
