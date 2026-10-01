/**
 * #101 5bc07d20 の直し(3回目)。企画運営(2026-10-01 09:20)の指摘:
 * アイビースクエア90分は、建物と記念館で40〜50分程度が妥当(決まりAの水増し)。
 * 空いた時間は、新しい実在の行き先・大橋家住宅(国指定重要文化財、新禄と
 * 呼ばれた豪商の旧宅)を追加して埋めた。あわせて、#315(大原美術館、日本初
 * とされる西洋美術中心の私立美術館プラン)と行き先が重なる(大原美術館・
 * 倉敷民藝館)ことについては、#315の実際の本文(73c2a636)を確認し、文章・
 * 構成とも別物であることを確かめた(コピーではない)。
 *
 * 新規に追加したスポットの座標(Nominatim名前検索で確認):
 * - 大橋家住宅: 34.5969724,133.7684196
 *
 * 開いたURL(事実確認):
 * - 大橋家住宅(新田・塩田開発で台頭した「新禄」・寛政年間建築・1978年重文指定): https://ja.wikipedia.org/wiki/%E5%A4%A7%E6%A9%8B%E5%AE%B6%E4%BD%8F%E5%AE%85
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const IVYSQUARE_MEMO =
  "倉敷民藝館から歩いておよそ6分、倉敷アイビースクエアに着きます。明治21年(1888)創業の倉敷紡績(クラボウ)倉敷本社工場の跡地を活用した複合施設です。蔦(アイビー)が絡まる赤レンガの建物が、工場の面影を今に伝えています。敷地内の倉紡記念館では、紡績業の歴史や倉敷の近代化のあゆみを紹介する展示を見学できます。この後は、歩いておよそ10分、大橋家住宅へ向かいましょう。";

const OHASHIKE_MEMO =
  "倉敷アイビースクエアから歩いておよそ10分、大橋家住宅に着きます。新田や塩田の開発で財を築き、大原家とともに「新禄」と呼ばれる新興の豪商に数えられた大橋家の旧宅です。主屋は寛政年間(1789〜1801)の建築で、長屋門・米蔵・内蔵とともに昭和53年(1978)、国の重要文化財に指定されました。倉敷窓や倉敷格子、なまこ壁など、倉敷の町家建築ならではの意匠を随所に見ることができます。この後は、歩いておよそ9分、阿智神社へ向かいましょう。";

const ACHI_FROM = "倉敷アイビースクエアから歩いておよそ12分、鶴形山の山頂に鎮座する阿智神社に着きます。";
const ACHI_TO = "大橋家住宅から歩いておよそ9分、鶴形山の山頂に鎮座する阿智神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5bc07d20%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const bikan = await findSpotInItinerary(itinId, { spotName: "倉敷美観地区" });
  const ohara = await findSpotInItinerary(itinId, { spotName: "大原美術館" });
  const koukokan = await findSpotInItinerary(itinId, { spotName: "倉敷考古館" });
  const mingeikan = await findSpotInItinerary(itinId, { spotName: "倉敷民藝館" });
  const ivysquare = await findSpotInItinerary(itinId, { spotName: "倉敷アイビースクエア" });
  const achi = await findSpotInItinerary(itinId, { spotName: "阿智神社" });

  if (!achi.memo!.includes(ACHI_FROM)) throw new Error("阿智神社の文言が想定外です");
  const achiMemo = achi.memo!.replace(ACHI_FROM, ACHI_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: bikan.id, data: {} },
    { id: ohara.id, data: {} },
    { id: koukokan.id, data: {} },
    { id: mingeikan.id, data: {} },
    { id: ivysquare.id, data: { memo: IVYSQUARE_MEMO, stayDurationMin: 45 } },
    {
      create: {
        name: "大橋家住宅",
        address: "岡山県倉敷市阿知三丁目",
        lat: 34.5969724,
        lng: 133.7684196,
        memo: OHASHIKE_MEMO,
        visitTime: t(14, 53),
        stayDurationMin: 35,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    { id: achi.id, data: { memo: achiMemo, visitTime: t(15, 37), transitMode: "walk", transitDurationMin: 9, transitLine: null } },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
