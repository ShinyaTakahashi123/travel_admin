/**
 * #119 949c4f43の直し(12回目)。企画運営(2026-10-11)指摘4点+法務(2026-10-11、
 * 記録7b41ec7)の座標指摘。
 * fix-119iで行き先を足した際、前の行き先の文末「この後は〜」が
 * 新しい次のスポットに更新されていなかった(3か所)。
 * 座標は、法務が見つけたOSMの名前付きwayの中心に直す:
 * - 四ヶ町アーケード: way 549380867「四ヶ町アーケード」(pedestrian)の中心
 *   (33.170983, 129.721375)。佐世保中央駅の点(丸め値)から変更
 * - アルカスSASEBO: way 639976049「アルカス佐世保」の中心(33.1658533,
 *   129.7242904)。自分が使っていた値は建物の頂点の1つで、中心からおよそ60m
 *   ずれていた
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const SHIMANOSE_FROM = "この後は、車でおよそ20分、旧佐世保無線電信所へ向かいましょう。";
const SHIMANOSE_TO = "この後は、車でおよそ3分、四ヶ町アーケードへ向かいましょう。";

const PALACE_FROM = "この後は、歩いておよそ5分、ドムトールンへ向かいましょう。";
const PALACE_TO = "この後は、歩いておよそ8分、ドムトールンへ向かいましょう。";

const UMIKIRARA_FROM = "この後は、車でおよそ20分、させぼ五番街へ向かいましょう。";
const UMIKIRARA_TO = "この後は、車でおよそ20分、アルカスSASEBOへ向かいましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '949c4f43%'`);
  const itinId = rows[0].id;
  const shimanose = await findSpotInItinerary(itinId, { spotName: "佐世保市博物館島瀬美術センター" });
  const palace = await findSpotInItinerary(itinId, { spotName: "パレスハウステンボス" });
  const umikirara = await findSpotInItinerary(itinId, { spotName: "海きらら" });
  const shikachou = await findSpotInItinerary(itinId, { spotName: "四ヶ町アーケード" });
  const arcas = await findSpotInItinerary(itinId, { spotName: "アルカスSASEBO" });

  if (!shimanose.memo?.includes(SHIMANOSE_FROM)) throw new Error("島瀬美術センターの文言が想定外です");
  if (!palace.memo?.includes(PALACE_FROM)) throw new Error("パレスハウステンボスの文言が想定外です");
  if (!umikirara.memo?.includes(UMIKIRARA_FROM)) throw new Error("海きららの文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: shimanose.id }, { memo: shimanose.memo!.replace(SHIMANOSE_FROM, SHIMANOSE_TO) });
  await updateSpotInItinerary(itinId, { spotId: palace.id }, { memo: palace.memo!.replace(PALACE_FROM, PALACE_TO) });
  await updateSpotInItinerary(itinId, { spotId: umikirara.id }, { memo: umikirara.memo!.replace(UMIKIRARA_FROM, UMIKIRARA_TO) });
  await updateSpotInItinerary(itinId, { spotId: shikachou.id }, { lat: 33.170983, lng: 129.721375 });
  await updateSpotInItinerary(itinId, { spotId: arcas.id }, { lat: 33.1658533, lng: 129.7242904 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
