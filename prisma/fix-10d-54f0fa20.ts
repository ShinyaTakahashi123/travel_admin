/**
 * #10 54f0fa20の直し(4回目)。法務(2026-10-11、記録8223bc6)の指摘。
 *
 * ① 説明文に外した「赤レンガの姫路市立美術館」が残っていたため、
 *    「男山配水池公園」に書き換え。
 * ② 姫路市立動物園のふれあい広場に、動物にさわるときの一文を追加。
 * ③ 書写山の参道(摩尼殿の文中)・摩尼殿から三之堂への山道に、足元の
 *    一文を追加。
 * ④ 手柄山平和公園の慰霊塔に、静かに手を合わせる一文を追加。
 * ⑤ 座標10か所を修正(書写山ロープウェイ山麓駅は fix-10c で既に対応済み
 *    のため対象外)。男山配水池公園は案内板の点だったため、男山
 *    (w243927621)の中心に、推定として使用。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const DESC_FROM = "隣接する大名庭園・好古園、赤レンガの姫路市立美術館、姫路市立動物園、姫路文学館をめぐる1日目。";
const DESC_TO = "隣接する大名庭園・好古園、男山配水池公園、姫路市立動物園、姫路文学館をめぐる1日目。";

const ZOO_FROM = "象やキリンといった定番の動物から、ふれあい広場での小動物との触れ合いまで楽しめます。";
const ZOO_TO =
  "象やキリンといった定番の動物から、ふれあい広場での小動物との触れ合いまで楽しめます。動物にさわったあとは手を洗い、係の人の案内に従いましょう。";

const MANIDEN_FROM = "断崖に張り出すように建つ舞台造りの本堂・摩尼殿が見えてきます。";
const MANIDEN_TO = "断崖に張り出すように建つ舞台造りの本堂・摩尼殿が見えてきます。参道は石畳や坂道が続くので、足元に気をつけて歩きましょう。";

const SANNODO_FROM = "境内の中でも最奥にあたる「三之堂」と呼ばれる一角に着きます。";
const SANNODO_TO = "境内の中でも最奥にあたる「三之堂」と呼ばれる一角に着きます。山道には坂や段差があるので、足元に気をつけて歩きましょう。";

const HEIWA_FROM = "「太平洋戦争全国戦災都市空爆死没者慰霊塔」が建っています。";
const HEIWA_TO = "「太平洋戦争全国戦災都市空爆死没者慰霊塔」が建っています。慰霊塔の前では、静かに手を合わせましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '54f0fa20%'`);
  const itinId = rows[0].id;

  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: itinId } });
  const otedori = await findSpotInItinerary(itinId, { spotName: "大手前通り" });
  const himejijo = await findSpotInItinerary(itinId, { spotName: "姫路城" });
  const kokoen = await findSpotInItinerary(itinId, { spotName: "好古園" });
  const otokoyama = await findSpotInItinerary(itinId, { spotName: "男山配水池公園" });
  const zoo = await findSpotInItinerary(itinId, { spotName: "姫路市立動物園" });
  const bungakukan = await findSpotInItinerary(itinId, { spotName: "姫路文学館" });
  const maniden = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });
  const suizokukan = await findSpotInItinerary(itinId, { spotName: "姫路市立水族館" });
  const heiwakoen = await findSpotInItinerary(itinId, { spotName: "手柄山平和公園" });

  if (!itin.description?.includes(DESC_FROM)) throw new Error("説明文が想定外です");
  if (!zoo.memo?.includes(ZOO_FROM)) throw new Error("動物園の文言が想定外です");
  if (!maniden.memo?.includes(MANIDEN_FROM)) throw new Error("摩尼殿の文言が想定外です");
  if (!sannodo.memo?.includes(SANNODO_FROM)) throw new Error("三之堂の文言が想定外です");
  if (!heiwakoen.memo?.includes(HEIWA_FROM)) throw new Error("手柄山平和公園の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.itinerary.update({ where: { id: itinId }, data: { description: itin.description!.replace(DESC_FROM, DESC_TO) } });

  await updateSpotInItinerary(itinId, { spotId: otedori.id }, { lat: 34.832149, lng: 134.691754 });
  await updateSpotInItinerary(itinId, { spotId: himejijo.id }, { lat: 34.839331, lng: 134.69402 });
  await updateSpotInItinerary(itinId, { spotId: kokoen.id }, { lat: 34.837969, lng: 134.689613 });
  await updateSpotInItinerary(itinId, { spotId: otokoyama.id }, { lat: 34.841913, lng: 134.689594 });
  await updateSpotInItinerary(
    itinId,
    { spotId: zoo.id },
    { memo: zoo.memo!.replace(ZOO_FROM, ZOO_TO) }
  );
  await updateSpotInItinerary(itinId, { spotId: bungakukan.id }, { lat: 34.841566, lng: 134.688401 });
  await updateSpotInItinerary(
    itinId,
    { spotId: maniden.id },
    { memo: maniden.memo!.replace(MANIDEN_FROM, MANIDEN_TO), lat: 34.891426, lng: 134.657542 }
  );
  await updateSpotInItinerary(
    itinId,
    { spotId: sannodo.id },
    { memo: sannodo.memo!.replace(SANNODO_FROM, SANNODO_TO), lat: 34.892547, lng: 134.654782 }
  );
  await updateSpotInItinerary(itinId, { spotId: kaizando.id }, { lat: 34.892938, lng: 134.653194 });
  await updateSpotInItinerary(itinId, { spotId: suizokukan.id }, { lat: 34.822656, lng: 134.676338 });
  await updateSpotInItinerary(
    itinId,
    { spotId: heiwakoen.id },
    { memo: heiwakoen.memo!.replace(HEIWA_FROM, HEIWA_TO), lat: 34.821319, lng: 134.673495 }
  );

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
