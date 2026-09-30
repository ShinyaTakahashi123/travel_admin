/**
 * #79 90e7362b 企画運営の指摘(2026-09-30 18:00)のD2分。
 * 道の駅みつまたの65分は長すぎた(道の駅は長居する場所ではない、目安20〜30分)。
 * 25分に短縮し、空いた時間は宿場の湯のあとに三国街道脇本陣跡「池田家」
 * (実在、湯沢町三俣780、新潟県指定文化財、三国街道沿いに残る唯一の
 * 江戸期の建物)を新規に追加して埋めた(決まりA、縮めた分をほかへ移さない)。
 * 座標はOSM/GSIとも大字レベルでしか解決できなかったため、湯沢町教育委員会の
 * 公式ページに埋め込まれたGoogleマップのリンク(座標が明記)を典拠として使用
 * (36.8948, 138.77806)。見学は事前予約制のため、その旨をメモに明記。
 * 池田家は最終入館16:30のため道の駅みつまたより先に配置、道の駅みつまたを
 * 最終スポットのまま維持。移動はOSRM実測(苗場駐車場→池田家 7.1km/13分、
 * 池田家→道の駅みつまた 0.8km/2分)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHUKUBA_MEMO =
  "田代湖からロープウェーで下り、歩いておよそ25分、三国街道沿いにある町営の日帰り温泉施設、宿場の湯に着きます。平成7年(1995年)に開業した施設で、江戸時代に参勤交代の大名たちが越後と関東を行き来した三国街道の宿場町、二居の名にちなんで名づけられました。大浴場からは周囲の山並みを望むことができ、ゴンドラとロープウェーでの空中散歩や湖畔の散策で歩いた足を、ゆっくりと休められます。ここで昼食をとるのもおすすめです。このあとは、苗場ドラゴンドラで田代側から苗場側へ戻り(およそ25分)、駐車場から車でおよそ13分、三国街道脇本陣跡「池田家」へ向かいましょう。";

const IKEDAKE_MEMO =
  "苗場ドラゴンドラで苗場側の駐車場まで戻ったら、車でおよそ13分、三国街道の宿場町・三俣に残る三国街道脇本陣跡「池田家」に着きます。三国街道沿いに今も残る江戸時代の建物は、湯沢町内ではこの池田家だけで、新潟県の文化財に指定されています。江戸時代には参勤交代の大名の家老や佐渡奉行が、明治時代には山県有朋や森鷗外も宿泊したと伝わり、宿泊者の名を記した宿札や、格式の高い人が使った上段の間などを見学できます。見学は事前予約制のため、訪れる前に湯沢町教育委員会に連絡し、見学日と人数を伝えて申し込みましょう。この後は、車でおよそ2分、道の駅みつまたへ向かいましょう。";

const MITSUMATA_MEMO =
  "池田家から車でおよそ2分、旧三国街道沿いにある道の駅みつまたに着きます。新潟県指定文化財の池田家をイメージしたという建物に、三国街道を行き交った旅人たちの往時の風情が感じられます。地元でとれた野菜や特産品が並ぶ直売所や、和豚もち豚を使ったもつ煮が名物のレストランなどが集まっていて、旅の締めくくりに立ち寄るのにぴったりの場所です。足湯にも立ち寄れます。定休日は公式サイトで確かめてから訪れましょう。お帰りは、関越自動車道などで安全運転でお帰りください。旅の2日目は、ここで終了です。お疲れさまでした。";

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
      create: {
        name: "三国街道脇本陣跡「池田家」",
        address: "新潟県南魚沼郡湯沢町大字三俣780",
        lat: 36.8948,
        lng: 138.77806,
        memo: IKEDAKE_MEMO,
        visitTime: t(15, 28),
        stayDurationMin: 35,
        transitMode: "other",
        transitDurationMin: 38,
        transitLine: null,
      },
    },
    {
      id: "8290fcdc-4c56-462e-b3ee-db9065a50133", // 道の駅みつまた
      data: { visitTime: t(16, 8), stayDurationMin: 25, memo: MITSUMATA_MEMO, transitMode: "car", transitDurationMin: 5 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const knownStay: Record<string, number> = {
    "4281d1df-0ff5-463e-8c2a-3bcbbb287745": 60, // 苗場ドラゴンドラ
    "7537983a-0182-4735-abdd-ca7719d58721": 50, // 田代ロープウェー
    "7613be58-2b67-45ce-8954-de04380fa8b8": 40, // 田代湖
    "5fb99580-a6c8-440d-8374-8e545510eea1": 120, // 宿場の湯
  };
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    if (!vt) continue;
    const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    if (st != null) prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
