/**
 * #172 57863f76 の続き（しおりえ(制作補助2)）: 企画運営の指摘（2026-10-11、涸沼自然公園の100分は時間合わせに見える・決まりA）で、
 *   涸沼自然公園を60分にし、その前に広浦公園（涸沼の東岸・水戸八景「広浦の秋月」）を足して、1日目を 9:00〜16:30 に整える
 *   めんたいパーク 11:40〜12:30 → 広浦公園 12:50〜13:30（車20分）→ 涸沼自然公園 13:40〜14:40（車10分）→ 親沢公園・網掛公園はそのまま
 * 出典: 茨城町 https://www.town.ibaraki.lg.jp/gyousei/kenkoukaigo/sports/koen/park/000687.html 広浦公園（徳川斉昭が水戸八景の一つに選んだ「広浦の秋月」・晴れた日に筑波山・
 *   広浦港は釣りの名所で汽水の涸沼ならではの魚・釣り糸や針は持ち帰る）
 * 座標: OSM — 広浦公園キャンプ場 way 318175441（leisure=park、広浦公園の中。Nominatim の中心）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-172b-57863f76.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1 = "25231ff5-c7f0-4419-ab04-82bd32741a45";
const IDS = {
  isosaki: "4f052494-9660-4aa3-ba03-daeeedc4060e",
  sunbeach: "a6e8f9dc-f17c-453f-984a-010406cfd7cd",
  mentai: "6b93b52c-2c05-4710-a8d0-8db69d4a169a",
  shizen: "836cbeec-e2b1-4b09-8862-5a40db36d42b",
  oyazawa: "95b61c9d-0ae3-4aab-9875-d9e4b635ca12",
  amikake: "36b29267-2379-493a-8f51-bf7b754d1418",
};
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const FROM = "大洗港から西へ車で約30分。";
const TO = "広浦公園から湖岸沿いに車で約10分。";

async function main() {
  const spots = await prisma.spot.findMany({ where: { dayId: DAY1 }, orderBy: { orderNo: "asc" } });
  if (spots.map((s) => s.id).join() !== Object.values(IDS).join()) throw new Error("構成が想定と違います");
  const shizen = spots.find((s) => s.id === IDS.shizen)!;
  if ((shizen.memo ?? "").split(FROM).length !== 2) throw new Error("直す文が見つからない");
  const items = [
    { id: IDS.isosaki, data: {} },
    { id: IDS.sunbeach, data: {} },
    { id: IDS.mentai, data: {} },
    { create: { name: "広浦公園", visitTime: t(12, 50), stayDurationMin: 40, lat: 36.28544, lng: 140.5206796, address: "茨城県東茨城郡茨城町下石崎1651",
      memo: "めんたいパークから西へ、車で約20分の涸沼へ。涸沼の東の岸にある公園で、湖面に映る月の眺めは「広浦の秋月」として、水戸藩主・徳川斉昭が選んだ水戸八景の一つに数えられています。晴れた日には湖の向こうに筑波山を望めます。前の広浦港は、海水と淡水がまじる涸沼ならではのさまざまな魚が釣れる場所です。水辺では足元に気をつけ、釣りをする人のじゃまにならないようにしましょう。",
      transitLegs: { create: [{ orderNo: 1, transitMode: "car" as const, transitDurationMin: 20, transitLine: null }] } } },
    { id: IDS.shizen, data: { visitTime: t(13, 40), stayDurationMin: 60, memo: (shizen.memo ?? "").replace(FROM, TO),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car" as const, transitDurationMin: 10, transitLine: null }] } } },
    { id: IDS.oyazawa, data: {} },
    { id: IDS.amikake, data: {} },
  ];
  console.log("広浦公園 12:50〜13:30 を足し、涸沼自然公園を 13:40〜14:40（60分）にする");
  console.log((shizen.memo ?? "").replace(FROM, TO));
  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY1, items, { tx }); }, { timeout: 60000 });
  console.log("書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
