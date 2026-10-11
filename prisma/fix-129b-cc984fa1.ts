/**
 * #129 cc984fa1の直し(2回目)。自己点検(itinerary-audit/flow-check)の指摘:
 * - 摩尼殿の到着時刻が仁王門終了(09:54)+移動10分と5分ずれていた
 * - 大講堂・三之堂への移動(0.3km/15分)が遅すぎた。8分に修正
 * - 1日目に昼食の一言がない。大講堂・三之堂(かつての食堂、写経道場)に
 *   昼食の一文を追加
 * - 大講堂・三之堂に参拝の配慮の一文がない
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SANNODO_LUNCH_FROM = "食堂は、1階が写経道場、2階が寺宝の展示館になっており、内部を見学できます。";
const SANNODO_LUNCH_TO =
  "食堂は、1階が写経道場、2階が寺宝の展示館になっており、内部を見学できます。山上駅のそばの「はづき茶屋」など、境内には食事ができる場所もあるので、昼食をとるのもよいでしょう。";

const SANNODO_RESPECT_FROM = "山道には坂や段差があるので、足元に気をつけて歩きましょう。";
const SANNODO_RESPECT_TO = "山道には坂や段差があるので、足元に気をつけて歩きましょう。今も祈りの場ですので、敬意を持ってめぐりましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'cc984fa1%'`);
  const itinId = rows[0].id;

  const maniden = await findSpotInItinerary(itinId, { spotName: "摩尼殿" });
  const sannodo = await findSpotInItinerary(itinId, { spotName: "大講堂・三之堂" });
  const kaizando = await findSpotInItinerary(itinId, { spotName: "開山堂（奥之院）" });

  if (!sannodo.memo?.includes(SANNODO_LUNCH_FROM) || !sannodo.memo?.includes(SANNODO_RESPECT_FROM)) {
    throw new Error("三之堂の文言が想定外です");
  }

  console.log("確認OK");
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: maniden.id }, { visitTime: t(10, 4) });
  await updateSpotInItinerary(
    itinId,
    { spotId: sannodo.id },
    {
      memo: sannodo.memo!.replace(SANNODO_LUNCH_FROM, SANNODO_LUNCH_TO).replace(SANNODO_RESPECT_FROM, SANNODO_RESPECT_TO),
      visitTime: t(11, 12),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8, transitLine: null }] },
    }
  );
  await updateSpotInItinerary(itinId, { spotId: kaizando.id }, { visitTime: t(12, 30) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
