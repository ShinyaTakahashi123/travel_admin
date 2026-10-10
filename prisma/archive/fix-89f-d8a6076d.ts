/**
 * #89 d8a6076d 企画運営(22:16)の追加2点。
 * 1) 一関市博物館(10:18〜11:33)の昼食は、見学後すぐ(11時台前半)に始まって
 *    しまい11:30より前になる。博物館は見学のみの60分に戻し、昼食は達谷窟
 *    毘沙門堂(11:45〜12:45、窓の中)に移す。達谷窟〜平泉の間には夢の風・
 *    地水庵・レストラン源など実在の食事処があることをWebSearchで確認した
 *    ため(店名は書かない)、一般的な表現で昼食の一言を入れる。滞在時間を
 *    延ばして帳尻を合わせるのではなく、博物館は元の60分に戻す形にした。
 * 2) 祭畤大橋(落橋)展望の丘に、被災地への配慮の一文を追加。
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");

const HAKUBUTSUKAN_FROM = "見学のあとは、隣接する道の駅で昼食にするとよいでしょう。休館日は公式サイトで確かめてから訪れましょう。";
const HAKUBUTSUKAN_TO = "休館日は公式サイトで確かめてから訪れましょう。";

const TAKKOKU_FROM = "今も信仰の場として大切にされているので、静かに、敬意をもってお参りください。拝観時間は公式サイトで確かめてから訪れましょう。";
const TAKKOKU_TO =
  "今も信仰の場として大切にされているので、静かに、敬意をもってお参りください。この付近には食事ができる店もあるので、昼食にするとよいでしょう。拝観時間は公式サイトで確かめてから訪れましょう。";

const SAIDE_FROM = "お手洗いはないので、事前に済ませておきましょう。";
const SAIDE_TO =
  "被災された方々に思いを寄せ、地震の記憶と教訓を伝える場所として、静かに見学しましょう。お手洗いはないので、事前に済ませておきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like 'd8a6076d%'`);
  const itinId = rows[0].id;

  const hakubutsukan = await findSpotInItinerary(itinId, { spotName: "一関市博物館" });
  const takkoku = await findSpotInItinerary(itinId, { spotName: "達谷窟毘沙門堂" });
  const saide = await findSpotInItinerary(itinId, { spotName: "祭畤大橋(落橋)展望の丘" });

  const check = (spot: { memo: string | null }, from: string, label: string) => {
    if (!spot.memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(hakubutsukan, HAKUBUTSUKAN_FROM, "一関市博物館");
  check(takkoku, TAKKOKU_FROM, "達谷窟毘沙門堂");
  check(saide, SAIDE_FROM, "祭畤大橋");

  console.log("すべて一致確認OK");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await updateSpotInItinerary(itinId, { spotId: hakubutsukan.id }, {
    memo: hakubutsukan.memo!.replace(HAKUBUTSUKAN_FROM, HAKUBUTSUKAN_TO),
    stayDurationMin: 60,
  });
  // 博物館が15分短くなるため、達谷窟以降の時刻を15分前倒しする
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const shiftSpots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });
  const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
  const newTimes: Record<string, Date> = {
    "達谷窟毘沙門堂": t(11, 30),
    "骨寺村荘園交流館": t(12, 48),
    "祭畤大橋(落橋)展望の丘": t(14, 3),
    "釣山公園": t(15, 13),
    "旧沼田家武家住宅": t(16, 4),
  };
  for (const s of shiftSpots) {
    if (newTimes[s.name]) {
      await prisma.spot.update({ where: { id: s.id }, data: { visitTime: newTimes[s.name] } });
    }
  }

  await updateSpotInItinerary(itinId, { spotId: takkoku.id }, { memo: takkoku.memo!.replace(TAKKOKU_FROM, TAKKOKU_TO) });
  await updateSpotInItinerary(itinId, { spotId: saide.id }, { memo: saide.memo!.replace(SAIDE_FROM, SAIDE_TO) });

  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
