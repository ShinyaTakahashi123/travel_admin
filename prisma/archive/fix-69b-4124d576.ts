/**
 * #69 4124d576。企画運営の指摘: 16:24は決まり2の窓(16:30〜17:00)に届いていない。
 * 滞在を延ばさず(決まりA)、実在スポットを追加。勝浦漁港にぎわい市場とくじらの
 * 博物館の間に、太地町立石垣記念館(実在、太地出身の洋画家・石垣栄太郎の作品を
 * 展示、GSI住所点を使用)を追加。開館9:00〜16:30のため、くじらの博物館(最後)より
 * 先に訪れる並びに。移動時間はOSRM実測+バスの停車を見込んで調整。
 * あわせて、帰りの一言の口調を「お戻りください」→「戻りましょう」に修正。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY1_ID = "eb4c1d0f-placeholder"; // will be overwritten below via query

const KATSUURA_MEMO_TO_ISHIGAKI =
  "熊野那智大社からバスでおよそ25分、山を下って勝浦漁港にぎわい市場に着きます。生鮮メバチマグロの水揚げ量で知られる勝浦漁港のそばにある市場で、新鮮な魚介を扱う店や、地元の海の幸を味わえる食事処が軒を連ねています。ここで昼食にしましょう。まぐろの解体ショーが行われることもあり、活気ある港町の雰囲気を楽しめます。この後は、バスでおよそ10分、太地町立石垣記念館へ向かいましょう。";

const ISHIGAKI_MEMO =
  "勝浦漁港にぎわい市場からバスでおよそ10分、太地町立石垣記念館に着きます。太地に生まれ、アメリカ・ニューヨークを拠点に活動した洋画家・石垣栄太郎の作品を紹介する記念館です。異国の地で社会の現実を見つめ続けた画家の作品を、じっくりと鑑賞してみてください。休館日があるので、訪れる前に公式サイトで確かめましょう。この後は、歩いておよそ12分、太地町立くじらの博物館へ向かいましょう。";

const KUJIRAKAN_MEMO_OPENER_FROM = "勝浦漁港にぎわい市場からバスでおよそ15分、太地町立くじらの博物館に着きます。";
const KUJIRAKAN_MEMO_OPENER_TO = "太地町立石垣記念館から歩いておよそ12分、太地町立くじらの博物館に着きます。";
const KUJIRAKAN_RETURN_FROM = "お帰りは、バスなどで紀伊勝浦駅方面へお戻りください。";
const KUJIRAKAN_RETURN_TO = "お帰りは、バスなどで紀伊勝浦駅方面へ戻りましょう。";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: "4124d576-4cd8-4086-b61e-9cd8a9576115", dayNumber: 1 } });

  const kujirakan = await prisma.spot.findUniqueOrThrow({ where: { id: "a185d199-6248-49a7-80db-7348ee275fda" } });
  let kujirakanMemo = kujirakan.memo!;
  if (!kujirakanMemo.includes(KUJIRAKAN_MEMO_OPENER_FROM)) throw new Error("一致しません(くじらの博物館 opener)");
  kujirakanMemo = kujirakanMemo.split(KUJIRAKAN_MEMO_OPENER_FROM).join(KUJIRAKAN_MEMO_OPENER_TO);
  if (!kujirakanMemo.includes(KUJIRAKAN_RETURN_FROM)) throw new Error("一致しません(くじらの博物館 return)");
  kujirakanMemo = kujirakanMemo.split(KUJIRAKAN_RETURN_FROM).join(KUJIRAKAN_RETURN_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: "8ee8e37d-0ae6-4f08-ab08-24bdca0b52c5", data: {} }, // 補陀洛山寺
    { id: "04b96850-bfb9-4028-b955-be7133557527", data: {} }, // 熊野古道 大門坂
    { id: "204b0fb3-cb5b-4d75-83bb-c1ba7dae3684", data: {} }, // 那智の滝
    { id: "d142e8c1-f751-4ab0-b1c2-02782eadc6f2", data: {} }, // 青岸渡寺
    { id: "fdc036a5-562c-4944-be83-4978783c31b3", data: {} }, // 三重塔
    { id: "1238e0e8-82db-4ba0-af2a-d73105538449", data: {} }, // 熊野那智大社
    {
      id: "90be5114-8adf-4f3a-9028-3372a2f6b5f8", // 勝浦漁港にぎわい市場
      data: { memo: KATSUURA_MEMO_TO_ISHIGAKI },
    },
    {
      create: {
        name: "太地町立石垣記念館",
        address: "和歌山県東牟婁郡太地町太地2902-79",
        lat: 33.598328,
        lng: 135.940308,
        memo: ISHIGAKI_MEMO,
        visitTime: t(15, 24),
        stayDurationMin: 25,
        transitMode: "bus",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      id: "a185d199-6248-49a7-80db-7348ee275fda", // 太地町立くじらの博物館
      data: { memo: kujirakanMemo, visitTime: t(16, 1), stayDurationMin: 55, transitMode: "walk", transitDurationMin: 12 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day1Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
