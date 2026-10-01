/**
 * #102 5d898384 の直し(4回目)。企画運営(2026-10-01 09:20)の指摘:
 * 稲村ヶ崎110分は決まりAの水増し(30〜40分が妥当)。夕景の記載は16時以降の
 * 内容なので、書くなら一言だけにする(すでに一文のみだったため、文章自体は
 * 変更不要と判断)。空いた時間は、新しい実在の行き先・極楽寺(忍性開山の
 * 真言律宗寺院)を由比ヶ浜と稲村ヶ崎の間(江ノ電で各ひと駅)に追加して埋めた。
 *
 * 新規に追加したスポットの座標(OSM生API、api.openstreetmap.org/api/0.6/mapで
 * 極楽寺駅周辺のbboxから実在のノードを確認。Nominatimでは駅の点しか
 * 見つからなかったため、寺そのものの座標が取れるこちらを使用):
 * - 極楽寺: 35.3098629,139.5296761
 *
 * 開いたURL(事実確認):
 * - 極楽寺(1259年北条重時発願・1267年忍性開山・福祉医療事業): https://ja.wikipedia.org/wiki/%E6%A5%B5%E6%A5%BD%E5%AF%BA_(%E9%8E%8C%E5%80%89%E5%B8%82)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YUIGAHAMA_FROM = "この後は、江ノ電でさらに西へ、稲村ヶ崎へ向かいましょう。";
const YUIGAHAMA_TO = "この後は、江ノ電で2駅、極楽寺へ向かいましょう。";

const GOKURAKUJI_MEMO =
  "由比ヶ浜から江ノ電で2駅、極楽寺に着きます。正式名を「霊鷲山感応院極楽律寺」という真言律宗の寺院です。正元元年(1259)、北条重時の発願で建立が始まり、重時の没後、子の長時・業時が引き継いで完成させました。文永4年(1267)には、忍性が招かれて開山となっています。忍性は、貧しい人々の救済や病人の治療、橋や道の整備など、幅広い社会事業に力を注いだ僧として知られ、往時の伽藍図には、薬を扱う施薬院や、病人を治療する療病院、薬湯で治療する薬湯寮なども描かれていたと伝わります。参拝の際は、敬意を込めて手を合わせましょう。この後は、江ノ電でひと駅、稲村ヶ崎へ向かいましょう。";

const INAMURAGASAKI_FROM = "由比ヶ浜から江ノ電でさらに西へ、稲村ヶ崎に着きます。";
const INAMURAGASAKI_TO = "極楽寺から江ノ電でひと駅、稲村ヶ崎に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '5d898384%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });

  const tsurugaoka = await findSpotInItinerary(itinId, { spotName: "鶴岡八幡宮" });
  const komachi = await findSpotInItinerary(itinId, { spotName: "小町通り" });
  const koutokuin = await findSpotInItinerary(itinId, { spotName: "高徳院（鎌倉大仏）" });
  const hasedera = await findSpotInItinerary(itinId, { spotName: "長谷寺" });
  const yuigahama = await findSpotInItinerary(itinId, { spotName: "由比ヶ浜" });
  const inamuragasaki = await findSpotInItinerary(itinId, { spotName: "稲村ヶ崎" });

  if (!yuigahama.memo!.includes(YUIGAHAMA_FROM)) throw new Error("由比ヶ浜の文言が想定外です");
  if (!inamuragasaki.memo!.includes(INAMURAGASAKI_FROM)) throw new Error("稲村ヶ崎の文言が想定外です");

  const yuigahamaMemo = yuigahama.memo!.replace(YUIGAHAMA_FROM, YUIGAHAMA_TO);
  const inamuragasakiMemo = inamuragasaki.memo!.replace(INAMURAGASAKI_FROM, INAMURAGASAKI_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: tsurugaoka.id, data: {} },
    { id: komachi.id, data: {} },
    { id: koutokuin.id, data: {} },
    { id: hasedera.id, data: {} },
    { id: yuigahama.id, data: { memo: yuigahamaMemo } },
    {
      create: {
        name: "極楽寺",
        address: "神奈川県鎌倉市極楽寺",
        lat: 35.3098629,
        lng: 139.5296761,
        memo: GOKURAKUJI_MEMO,
        visitTime: t(14, 40),
        stayDurationMin: 68,
        transitMode: "train",
        transitDurationMin: 10,
        transitLine: "江ノ島電鉄線",
      },
    },
    {
      id: inamuragasaki.id,
      data: { memo: inamuragasakiMemo, visitTime: t(15, 56), stayDurationMin: 35, transitMode: "train", transitDurationMin: 8, transitLine: "江ノ島電鉄線" },
    },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
