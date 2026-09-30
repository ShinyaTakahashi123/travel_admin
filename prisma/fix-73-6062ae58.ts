/**
 * #73 6062ae58（岡山城）ユーザー決定「全部直す」の対象(現状15:51)。滞在を
 * 延ばさず(決まりA)、実在スポットを追加。表町商店街のあとに西川緑道公園
 * (実在、岡山市中心部を流れる西川用水沿いの緑道公園、総延長2.4km、OSM
 * relation 6365025)を追加。移動時間は表町商店街から西川緑道公園駅(OSM
 * tram_stop)までの距離をもとに徒歩10分と設定。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OMOTECHO_MEMO_TO_NISHIGAWA =
  "林原美術館から歩いておよそ10分、表町商店街に着きます。慶長年間、およそ1600年ごろに商人町として始まったと伝えられる、400年の歴史を持つ岡山県下最大の商店街です。上之町・中之町・下之町・栄町・紙屋町・西大寺町・新西大寺町・千日前という8つの町からなり、「表八ヶ町」とも呼ばれ親しまれてきました。南北およそ1.4kmにわたってアーケードが続き、現在も300を超える店が軒を連ねています。岡山城・後楽園めぐりの締めくくりに、老舗から新しい店まで入り混じる商店街の活気を楽しんでみてください。この後は、歩いておよそ10分、西川緑道公園へ向かいましょう。";

const NISHIGAWA_MEMO =
  "表町商店街から歩いておよそ10分、西川緑道公園に着きます。岡山市中心部を南北に流れる西川用水の両岸を整備した、総延長およそ2.4kmにわたる緑道公園です。およそ100種、3万8千本もの樹木が植えられていて、噴水や水上テラスなどもあり、四季折々の彩りを楽しみながら散策できます。岡山城下町を歩いてきた締めくくりに、水辺の緑道をゆっくりと歩いてみてください。岡山城、烏城と呼ばれる漆黒の天守を望む定番日帰りプランも、ここで無事に終了です。お疲れさまでした。";

async function main() {
  const itin = await prisma.$queryRawUnsafe<any[]>(`select id::text from itinerary where id::text like '6062ae58%'`);
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itin[0].id } });

  const day1Spots: SpotOrderItem[] = [
    { id: "dc42588e-cd09-441e-9576-1e23187cd0f9", data: {} }, // 岡山城
    { id: "69d794bb-4204-4cea-bd5b-bbf73b017a2a", data: {} }, // 岡山後楽園
    { id: "7d04ad57-935f-46a1-b58b-e32f57cfd437", data: {} }, // 夢二郷土美術館
    { id: "bd5fd828-7cb8-4b1a-8544-61776b743c12", data: {} }, // 岡山県立博物館
    { id: "99ed4d93-490e-448e-b227-df60c5218d56", data: {} }, // 林原美術館
    {
      id: "2c61c73a-cb35-4962-8d6d-187a7afc54b3", // 表町商店街
      data: { memo: OMOTECHO_MEMO_TO_NISHIGAWA },
    },
    {
      create: {
        name: "西川緑道公園",
        address: "岡山県岡山市北区岩田町",
        lat: 34.6655732,
        lng: 133.9231530,
        memo: NISHIGAWA_MEMO,
        visitTime: t(16, 1),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 10,
        transitLine: null,
      },
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
