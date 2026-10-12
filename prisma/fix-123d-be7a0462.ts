/**
 * #123 be7a0462の直し(4回目)。企画運営・法務(2026-10-11)の指摘。
 *
 * 企画運営 Day1:
 * 1. 金津創作の森を4か所(100+100+40+120分、同じ座標)に分けていたのを、
 *    決まりA違反として2か所(散策路+アートコア鑑賞/ガラス工房、各OSM建物
 *    way)にまとめ、空いた時間に実在のあわら湯のまち広場を追加
 * 2. 最初のスポットに、芦原温泉駅近くでレンタカーを借りる旨を追加
 * 企画運営 Day2:
 * 3. 蓮如上人記念館の座標を、OSM node 1420945696「吉崎蓮如上人記念館」
 *    (36.2892730, 136.2512590)に修正(吉崎御坊跡とは別の実在の点)
 * 4. 開始時刻を09:00→09:20にし、滞在を延ばさずに終了を16:28→16:48に
 * 法務: 一筆啓上日本一短い手紙の館の「カフェ『ふみの庭』で昼食」は店名
 *   なので「館内のカフェで昼食をとりましょう」に修正
 *
 * 新しい座標(OSM):
 * - 金津創作の森(散策路+アートコア): way 438377096「金津 創作の森」の
 *   最初のノード 36.2306912, 136.2608799
 * - ガラス工房: 同じ敷地内の無名の建物way 438377024(36.2339733,
 *   136.2642649、約490m離れた別棟、開示のうえ使用)
 * - あわら湯のまち広場: 36.2238433, 136.1928361(osm_id 5598772146)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";
import { setDaySpotOrder } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const MORI_MEMO =
  "JR芦原温泉駅の近くでレンタカーを借りて、車でおよそ15分、金津創作の森に着きます。里山の地形をそのまま生かした、20ヘクタールにおよぶ広大な敷地に、アートコアやガラス工房が点在する、アート体験型の文化複合施設です。旧金津町によって、新しい文化の拠点として開設されました。初代館長を務めた美術評論家・針生一郎の「森はすべての芸術の源である」という理念のもと、現代美術の企画展が毎年開催されています。木々に囲まれた散策路を歩きながら屋外のアート作品を眺め、アートコアの屋内展示室で企画展もあわせて鑑賞しましょう。この後は、歩いておよそ8分、ガラス工房へ向かいましょう。";

const GLASS_MEMO =
  "金津創作の森から歩いておよそ8分、金津創作の森ガラス工房に着きます。吹きガラスやガラス加工を行う作家の制作の様子を、間近で見学できる工房です。炎を使った作業もあるので、見学の際は作家の指示に従い、距離を保ちましょう。この後は、車でおよそ15分、あわら湯のまち広場へ向かいましょう。";

const YUNOMACHI_MEMO =
  "ガラス工房から車でおよそ15分、あわら湯のまち広場に着きます。あわら温泉の中心にある広場で、無料の足湯が整備されています。あわら温泉街には食事処も多いので、ここで昼食にしましょう。足湯で歩き疲れた足を休めましょう。この後は、車でおよそ15分、北潟湖畔へ向かいましょう。";

const LAKE_MEMO =
  "あわら湯のまち広場から車でおよそ15分、北潟湖畔に着きます。あわら市と坂井市にまたがる湖で、湖畔の道をゆったりと歩きながら、水面の景色を眺められます。歩道と車道が近い場所もあるので、車に気をつけながら歩きましょう。今夜はこの近くの宿に泊まりましょう。";

const TEGAMI_FROM = "カフェ「ふみの庭」で昼食をとりましょう。";
const TEGAMI_TO = "館内のカフェで昼食をとりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'be7a0462%'`);
  const itinId = rows[0].id;

  const mori = await findSpotInItinerary(itinId, { dayNumber: 1, spotName: "金津創作の森" });
  const artCore = await findSpotInItinerary(itinId, { spotName: "金津創作の森アートコア" });
  const glass = await findSpotInItinerary(itinId, { spotName: "金津創作の森ガラス工房" });
  const workshop = await findSpotInItinerary(itinId, { spotName: "金津創作の森創作工房" });
  const lake = await findSpotInItinerary(itinId, { spotName: "北潟湖畔" });

  const kinenkan = await findSpotInItinerary(itinId, { spotName: "蓮如上人記念館" });
  const yoshizaki = await findSpotInItinerary(itinId, { spotName: "吉崎御坊跡" });
  const betsuin = await findSpotInItinerary(itinId, { spotName: "吉崎別院" });
  const maruoka = await findSpotInItinerary(itinId, { spotName: "丸岡城" });
  const tegami = await findSpotInItinerary(itinId, { spotName: "一筆啓上日本一短い手紙の館" });
  const ginkou = await findSpotInItinerary(itinId, { spotName: "旧森田銀行本店" });
  const ryushokan = await findSpotInItinerary(itinId, { spotName: "みくに龍翔館" });

  if (!tegami.memo?.includes(TEGAMI_FROM)) throw new Error("手紙の館の文言が想定外です");

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    // Day1: 4か所(森・アートコア・ガラス工房・創作工房)→2か所+新規2か所
    await setDaySpotOrder(
      mori.dayId,
      [
        {
          id: mori.id,
          data: { memo: MORI_MEMO, visitTime: t(9, 0), stayDurationMin: 90, lat: 36.2306912, lng: 136.2608799 },
        },
        {
          id: glass.id,
          data: {
            memo: GLASS_MEMO,
            visitTime: t(10, 38),
            stayDurationMin: 45,
            lat: 36.2339733,
            lng: 136.2642649,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
          },
        },
        {
          create: {
            name: "あわら湯のまち広場",
            memo: YUNOMACHI_MEMO,
            lat: 36.2238433,
            lng: 136.1928361,
            visitTime: t(11, 38),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15, transitLine: null }] },
          },
        },
        {
          id: lake.id,
          data: {
            memo: LAKE_MEMO,
            visitTime: t(12, 53),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15, transitLine: null }] },
          },
        },
      ],
      { remove: [artCore.id, workshop.id], tx }
    );

    // Day2: 座標修正+開始時刻を20分遅らせて終了を16:48に
    await tx.spot.update({ where: { id: kinenkan.id }, data: { lat: 36.289273, lng: 136.251259 } });
    await tx.spot.update({ where: { id: yoshizaki.id }, data: { visitTime: t(9, 20) } });
    await tx.spot.update({ where: { id: kinenkan.id }, data: { visitTime: t(10, 15) } });
    await tx.spot.update({ where: { id: betsuin.id }, data: { visitTime: t(11, 0) } });
    await tx.spot.update({ where: { id: maruoka.id }, data: { visitTime: t(11, 55) } });
    await tx.spot.update({ where: { id: tegami.id }, data: { memo: tegami.memo!.replace(TEGAMI_FROM, TEGAMI_TO), visitTime: t(12, 58) } });
    await tx.spot.update({ where: { id: ginkou.id }, data: { visitTime: t(14, 8) } });
    await tx.spot.update({ where: { id: ryushokan.id }, data: { visitTime: t(15, 18) } });
  }, { timeout: 60000 });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
