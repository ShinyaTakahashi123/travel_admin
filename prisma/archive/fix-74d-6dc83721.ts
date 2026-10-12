/**
 * #74 6dc83721 D2。企画運営の指摘(決まりA、縮めた分をほかに移さない): 別所沼公園
 * 90分は、桜草公園・荒川彩湖公園から縮めた分がそのまま移った水増し。実際に
 * 過ごせる長さ(沼のまわり1周程度、40分)に縮め、空いた時間は実在の行き先
 * (玉蔵院、実在、平安時代創建と伝わる真言宗の古刹、桜の名所、OSM node
 * 1485636825)を追加して埋める。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const BESSHONUMA_MEMO_SHORT =
  "荒川彩湖公園から車でおよそ8分、別所沼公園に着きます。沼を中心に整備された、地元の人々に親しまれている公園です。沼のまわりにはおよそ1周1kmの散策路が整えられていて、木々に囲まれた水辺をゆっくりと歩くことができます。詩人・立原道造が設計した、みずべ休憩所「ヒヤシンスハウス」も園内に立っています。都会の中の静かな水辺の景色を、のんびりと味わってみてください。この後は、車でおよそ3分、玉蔵院へ向かいましょう。";

const GYOKUZOIN_MEMO =
  "別所沼公園から車でおよそ3分、玉蔵院に着きます。平安時代、弘法大師によって開かれたと伝わる真言宗の古刹で、浦和でも指折りの歴史を持つ寺院です。境内にはおよそ200本ものソメイヨシノが植えられていて、春には桜の名所としても多くの人でにぎわいます。地蔵堂に安置される石造の地蔵菩薩像は、市の文化財にも指定されています。静かに、敬意をもってお参りください。この後は、車でおよそ2分、調神社へ向かいましょう。";

const TSUKI_JINJA_OPENER_FROM = "別所沼公園から車でおよそ4分、調神社に着きます。";
const TSUKI_JINJA_OPENER_TO = "玉蔵院から車でおよそ2分、調神社に着きます。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
  const itinId = rows[0].id;
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const tsuki = await prisma.spot.findFirstOrThrow({ where: { name: "調神社", dayId: day2.id } });
  if (!tsuki.memo!.includes(TSUKI_JINJA_OPENER_FROM)) throw new Error("一致しません(調神社)");
  const tsukiNewMemo = tsuki.memo!.split(TSUKI_JINJA_OPENER_FROM).join(TSUKI_JINJA_OPENER_TO);

  const day2Spots: SpotOrderItem[] = [
    { id: "e2ccacf9-311d-44e1-bb9b-0916515698a8", data: {} }, // さいたま清河寺温泉
    { id: "e679227f-f532-46d4-a269-2eb1abc31817", data: {} }, // 三橋総合公園
    { id: "eee93d29-1590-4771-9966-93f40b705dfc", data: {} }, // 秋ヶ瀬公園
    { id: (await prisma.spot.findFirstOrThrow({ where: { name: "桜草公園", dayId: day2.id } })).id, data: {} },
    { id: (await prisma.spot.findFirstOrThrow({ where: { name: "荒川彩湖公園", dayId: day2.id } })).id, data: {} },
    {
      id: "c7a478e1-9367-424a-89db-e7861a354dda", // 別所沼公園
      data: { memo: BESSHONUMA_MEMO_SHORT, stayDurationMin: 40 },
    },
    {
      create: {
        name: "玉蔵院",
        address: "埼玉県さいたま市浦和区仲町2-13-22",
        lat: 35.8590212,
        lng: 139.6520785,
        memo: GYOKUZOIN_MEMO,
        visitTime: t(15, 4),
        stayDurationMin: 45,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      id: tsuki.id, // 調神社
      data: { memo: tsukiNewMemo, visitTime: t(15, 51), stayDurationMin: 40, transitMode: "car", transitDurationMin: 2 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
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
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
