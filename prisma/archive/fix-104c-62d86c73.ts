/**
 * #104 62d86c73 の直し(3回目)。企画運営(2026-10-01 10:11)の指摘:
 * 新しく足した岡山県天神山文化プラザ90分も水増し(文化施設の展示で30〜40分
 * くらいが妥当)。35分にし、空いた時間は、さらに新しい実在の行き先・岡山市立
 * オリエント美術館(国内唯一とされる古代オリエント専門の公立美術館)を
 * 天神山文化プラザと岡山神社の間に追加して埋めた(時間を延ばすのではなく、
 * 行き先を足す形)。
 *
 * 新規に追加したスポットの座標(OSM生APIで、岡山城・後楽園一帯のbboxから
 * 実在のノード座標を確認):
 * - 岡山市立オリエント美術館: 34.6663706,133.9301513
 *
 * 開いたURL(事実確認):
 * - 岡山市立オリエント美術館(1979年開館・岡山学園からの寄贈1947点・国内唯一とされる古代オリエント専門公立美術館・紀元前9世紀アッシリアレリーフ): https://ja.wikipedia.org/wiki/%E5%B2%A1%E5%B1%B1%E5%B8%82%E7%AB%8B%E3%82%AA%E3%83%AA%E3%82%A8%E3%83%B3%E3%83%88%E7%BE%8E%E8%A1%93%E9%A4%A8
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TENJINYAMA_FROM = "この後は、歩いておよそ4分、岡山神社へ向かいましょう。";
const TENJINYAMA_TO = "この後は、歩いておよそ5分、岡山市立オリエント美術館へ向かいましょう。";

const ORIENT_MEMO =
  "岡山県天神山文化プラザから歩いておよそ5分、岡山市立オリエント美術館に着きます。昭和54年(1979)、学校法人岡山学園から寄贈された古代オリエント美術品1947点を機に開館した、国内で唯一とされる、古代オリエントを専門とする公立の美術館です。建築家・岡田新一が、西アジア各地を取材して得たオリエント建築の要素を取り入れて設計しました。イランやイラク、シリアなど西アジアを中心に、土器や金属器、ガラス器、彫刻など、およそ5000点の美術品を収蔵しています。中でも、紀元前9世紀のアッシリア王宮の内壁を飾っていたレリーフは、世界的にも貴重な歴史遺産です。この後は、歩いておよそ4分、岡山神社へ向かいましょう。";

const OKAYAMAJINJA_FROM = "岡山県天神山文化プラザから歩いておよそ4分、岡山神社に着きます。";
const OKAYAMAJINJA_TO = "岡山市立オリエント美術館から歩いておよそ4分、岡山神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '62d86c73%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const museum = await findSpotInItinerary(itinId, { spotName: "岡山県立博物館" });
  const tenjinyama = await findSpotInItinerary(itinId, { spotName: "岡山県天神山文化プラザ" });
  const okayamajinja = await findSpotInItinerary(itinId, { spotName: "岡山神社" });
  const korakuen = await findSpotInItinerary(itinId, { spotName: "岡山後楽園" });
  const castle = await findSpotInItinerary(itinId, { spotName: "岡山城" });
  const hayashibara = await findSpotInItinerary(itinId, { spotName: "林原美術館" });

  if (!tenjinyama.memo!.includes(TENJINYAMA_FROM)) throw new Error("天神山文化プラザの文言が想定外です");
  if (!okayamajinja.memo!.includes(OKAYAMAJINJA_FROM)) throw new Error("岡山神社の文言が想定外です");

  const tenjinyamaMemo = tenjinyama.memo!.replace(TENJINYAMA_FROM, TENJINYAMA_TO);
  const okayamajinjaMemo = okayamajinja.memo!.replace(OKAYAMAJINJA_FROM, OKAYAMAJINJA_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: museum.id, data: {} },
    { id: tenjinyama.id, data: { memo: tenjinyamaMemo, stayDurationMin: 35 } },
    {
      create: {
        name: "岡山市立オリエント美術館",
        address: "岡山県岡山市北区天神町",
        lat: 34.6663706,
        lng: 133.9301513,
        memo: ORIENT_MEMO,
        visitTime: t(10, 58),
        stayDurationMin: 50,
        transitMode: "walk",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    { id: okayamajinja.id, data: { memo: okayamajinjaMemo, visitTime: t(11, 52), transitMode: "walk", transitDurationMin: 4, transitLine: null } },
    { id: korakuen.id, data: {} },
    { id: castle.id, data: {} },
    { id: hayashibara.id, data: {} },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
