/**
 * #79 90e7362b 法務の見立て(docs/legal/20260930-coordinate-sources.md)を受けた
 * 企画運営の指摘(2026-09-30 18:16)。公式サイトに埋め込まれた地図から座標を
 * 読み取るのは不可のため、三国街道脇本陣跡「池田家」を撤回(削除)。
 * 代わりに、OSMに実際の点がある諏訪神社(湯沢温泉、OSM way 871809086
 * 「Suwa shrine」、#66 1d0aa24fで既に座標を確認済みの同じ点)を、道の駅
 * みつまたのあとの最終スポットとして追加。道の駅みつまたの移動元も
 * 池田家→宿場の湯に戻す。移動はOSRM実測(道の駅みつまた→諏訪神社
 * 8.4km/14分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHUKUBA_MEMO =
  "田代湖からロープウェーで下り、歩いておよそ25分、三国街道沿いにある町営の日帰り温泉施設、宿場の湯に着きます。平成7年(1995年)に開業した施設で、江戸時代に参勤交代の大名たちが越後と関東を行き来した三国街道の宿場町、二居の名にちなんで名づけられました。大浴場からは周囲の山並みを望むことができ、ゴンドラとロープウェーでの空中散歩や湖畔の散策で歩いた足を、ゆっくりと休められます。ここで昼食をとるのもおすすめです。このあとは、苗場ドラゴンドラで田代側から苗場側へ戻り(およそ25分)、駐車場から車でおよそ15分、道の駅みつまたへ向かいましょう。";

const MITSUMATA_MEMO =
  "苗場ドラゴンドラで苗場側の駐車場まで戻ったら、車でおよそ15分、旧三国街道沿いにある道の駅みつまたに着きます。新潟県指定文化財の池田家をイメージしたという建物に、三国街道を行き交った旅人たちの往時の風情が感じられます。地元でとれた野菜や特産品が並ぶ直売所や、和豚もち豚を使ったもつ煮が名物のレストランなどが集まっていて、足湯にも立ち寄れます。定休日は公式サイトで確かめてから訪れましょう。この後は、車でおよそ14分、諏訪神社へ向かいましょう。";

const SUWA_MEMO =
  "道の駅みつまたから車でおよそ14分、越後湯沢の温泉街に鎮座する諏訪神社に着きます。川端康成の小説『雪国』の文中にも登場することで知られる古社で、静かな境内が温泉街の歴史を今に伝えています。静かに、敬意をもってお参りください。参道の周辺には、古くからの温泉旅館や土産物店が並ぶ通りも続いており、あわせてゆっくりと歩いてみてください。旅の2日目は、ここで終了です。お疲れさまでした。お帰りは、越後湯沢駅からご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '90e7362b%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const day2Spots: SpotOrderItem[] = [
    { id: "4281d1df-0ff5-463e-8c2a-3bcbbb287745", data: {} }, // 苗場ドラゴンドラ
    { id: "7537983a-0182-4735-abdd-ca7719d58721", data: {} }, // 田代ロープウェー
    { id: "7613be58-2b67-45ce-8954-de04380fa8b8", data: {} }, // 田代湖
    {
      id: "5fb99580-a6c8-440d-8374-8e545510eea1", // 宿場の湯
      data: { memo: SHUKUBA_MEMO },
    },
    {
      id: "8290fcdc-4c56-462e-b3ee-db9065a50133", // 道の駅みつまた
      data: { visitTime: t(15, 30), stayDurationMin: 25, memo: MITSUMATA_MEMO, transitMode: "other", transitDurationMin: 40 },
    },
    {
      create: {
        name: "諏訪神社",
        address: "新潟県南魚沼郡湯沢町大字湯沢",
        lat: 36.9465679,
        lng: 138.8013787,
        memo: SUWA_MEMO,
        visitTime: t(16, 9),
        stayDurationMin: 25,
        transitMode: "car",
        transitDurationMin: 14,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { remove: ["324c3c53-c1d0-4c15-afd7-fa2ab2e03ec4"], tx }); // remove 池田家
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
