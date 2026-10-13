/**
 * #25(a54e45e0)巨峰ワイナリー(田主丸ワインの森)の差し替え(企画運営・法務の
 * 判断、2026-10-13)。公式住所(益生田246-1)が国土地理院で番地まで出ず、OSMにも
 * 建物がない(確認済みのデータの欠落)ため、OSMの実在・名前付きの史跡
 * 「田主丸大塚古墳」(way 974589153)・「大塚古墳歴史公園」(way 766129043)に
 * 差し替える。墳丘全長103m・後円部直径60m・6世紀後半築造・九州最大級との
 * 伝承は、久留米市公式資料(city.kurume.fukuoka.jp)・crossroadfukuoka.jp/spot/14854
 * で確認。あわせて、しおりの題・説明から「ワイナリー」「お酒」の言及を外す。
 * 座標が変わったことで田主丸駅からの移動時間も実距離(約5分)に修正。
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");

const ITIN_ID = "a54e45e0-4329-473b-abb3-b6cd6aca7327";
const KYOHO_SPOT_ID = "a857e6a8-ada1-4e01-a682-c12626cbff9a";

const OLD_TITLE = "水天宮と石橋文化センター、田主丸のかっぱとワイナリーをめぐる日帰りプラン";
const NEW_TITLE = "水天宮と石橋文化センター、田主丸のかっぱと大塚古墳をめぐる日帰りプラン";

const OLD_DESC =
  "全国水天宮の総本宮から、久留米出身の実業家・石橋正二郎ゆかりの石橋文化センター、筑後国一の宮・高良大社、河童伝説が伝わる田主丸のかっぱ駅と巨峰ワイナリーまで、久留米市の歴史と物語をめぐる日帰りプランです。お酒を飲めるのは20歳になってからです。";
const NEW_DESC =
  "全国水天宮の総本宮から、久留米出身の実業家・石橋正二郎ゆかりの石橋文化センター、筑後国一の宮・高良大社、河童伝説が伝わる田主丸のかっぱ駅と、九州最大級ともいわれる規模で築かれたとされる田主丸大塚古墳まで、久留米市の歴史と物語をめぐる日帰りプランです。";

const NEW_NAME = "田主丸大塚古墳(大塚古墳歴史公園)";
const NEW_LAT = 33.3261632;
const NEW_LNG = 130.7115183;
const NEW_MEMO =
  "田主丸古墳群を構成する、国指定史跡の前方後円墳です。墳丘の全長は103m、後円部の直径は60mあり、6世紀後半の築造と推測され、当時は九州最大級の規模だったともいわれています。平成19年(2007)、古墳を中心に「大塚古墳歴史公園」として整備されました。芝生の広場があり、ヤマザクラやソメイヨシノも植えられています。古墳の上に登って、公園の様子を眺めてみましょう。";

async function main() {
  const itin = await prisma.itinerary.findUnique({ where: { id: ITIN_ID } });
  if (!itin || itin.title !== OLD_TITLE || itin.description !== OLD_DESC) throw new Error("しおりの題・説明が想定と違います");

  const kyoho = await prisma.spot.findUnique({ where: { id: KYOHO_SPOT_ID } });
  if (!kyoho) throw new Error("想定と違います");
  const leg = await prisma.spotTransitLeg.findFirst({ where: { spotId: KYOHO_SPOT_ID } });
  if (!leg) throw new Error("移動データが見つかりません");

  console.log("[確認OK] 題:", OLD_TITLE, "→", NEW_TITLE);
  console.log("[確認OK] 説明文を書きかえ");
  console.log("[確認OK] スポット名:", kyoho.name, "→", NEW_NAME);
  console.log("[確認OK] 座標:", kyoho.lat, kyoho.lng, "→", NEW_LAT, NEW_LNG);
  console.log("[確認OK] leg 田主丸駅→(新スポット):", leg.transitDurationMin, "→ 5分");
  console.log("[確認OK] 滞在:", kyoho.stayDurationMin, "→ 77分(16:30終了に合わせる)");

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: ITIN_ID }, data: { title: NEW_TITLE, description: NEW_DESC } });

  if (kyoho.placeMasterId) {
    await prisma.placeMaster.update({
      where: { id: kyoho.placeMasterId },
      data: { name: NEW_NAME, lat: NEW_LAT, lng: NEW_LNG, positionSource: "osm" },
    });
  }
  await prisma.spot.update({
    where: { id: KYOHO_SPOT_ID },
    data: { name: NEW_NAME, lat: NEW_LAT, lng: NEW_LNG, memo: NEW_MEMO },
  });
  await prisma.spotTransitLeg.update({ where: { id: leg.id }, data: { transitDurationMin: 5 } });
  // 田主丸駅→(新スポット)のvisitTime: 14:33(田主丸駅開始)+35(滞在)=15:08終了+5分leg=15:13開始
  // 16:30終了に合わせ、滞在72分→77分
  await prisma.spot.update({
    where: { id: KYOHO_SPOT_ID },
    data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 13)), stayDurationMin: 77 },
  });

  console.log("  COMMITTED");
}
main().finally(() => prisma.$disconnect());
