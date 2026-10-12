/**
 * #411 2afa2584 の直し（しおりえ(制作補助2)、2026-10-01 企画運営の言葉の点検）
 * - ココ・ファーム・ワイナリーは1社のお店（ワイナリー）の紹介になるので、行き先から外す（写真なし）
 * - 代わりに、公共の行き先「名草厳島神社・名草巨石群」（国の天然記念物）を入れる。説明文も直す
 *   出典: 足利市観光協会 https://www.ashikaga-kankou.jp/spot/nagusaitsukushima （弘仁年間に弘法大師空海が勧請したと伝わる・
 *   境内の名草巨石群は国指定の天然記念物・江戸時代中期に弁財天像・足利七福神めぐりの一つ・自由参拝・名草上町4990）
 *   座標: OSM node 4338173347（名草厳島神社）
 * - 時刻: 樺崎八幡宮 9:00〜9:40 →（車20分）名草厳島神社 10:00〜10:45 →（車35分）あしかがフラワーパーク 11:20〜13:40（昼食。以降は変えない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-411f-2afa2584.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "2afa2584-ca85-4263-984e-82ae6f1d282c";
const DAY2_ID = "64e974e3-6585-489c-9892-a7f9c54259e5";
const COCO = "633c3810-7d98-48c7-99d3-2259e350c9f9";
const FP = "a61e18d2-e92a-4a91-906a-3c125e09f42d";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
const D_FROM = "山のぶどう畑のふもとのワイナリーを訪ね、";
const D_TO = "国の天然記念物の名草巨石群がある名草厳島神社を訪ね、";
const FP_FROM = "ココ・ファームから車で約25分。";
const FP_TO = "名草厳島神社から車で約35分。";

const NAGUSA = {
  name: "名草厳島神社・名草巨石群", visitTime: t(10, 0), stayDurationMin: 45, transitMode: "car", transitDurationMin: 20, transitLine: null,
  lat: 36.4301769, lng: 139.4468873, address: "栃木県足利市名草上町4990",
  memo: "樺崎八幡宮から車で約20分、北の名草の山あいへ。弘仁年間に弘法大師空海が勧請したと伝えられる神社で、境内に鎮座する名草巨石群は、国の天然記念物に指定されています。江戸時代の中ごろに造られた弁財天は、足利七福神めぐりの一つにも数えられます。" + RESPECT + "巨石のまわりは足元が悪いので、気をつけて歩きましょう。",
};

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  if (!it.description?.includes(D_FROM)) throw new Error("説明文が想定と違います");
  const spots = await prisma.spot.findMany({ where: { dayId: DAY2_ID }, orderBy: { orderNo: "asc" }, include: { photos: true } });
  const names = spots.map((s) => s.name);
  if (spots[1]?.id !== COCO || spots[2]?.id !== FP || spots[1].photos.length) throw new Error(`2日目が想定と違います: ${names.join()}`);
  const fp = spots[2];
  if (!fp.memo?.startsWith(FP_FROM)) throw new Error("フラワーパークの書き出しが想定と違います");
  const items = [
    { id: spots[0].id, data: {} },
    { create: NAGUSA },
    { id: FP, data: { visitTime: t(11, 20), stayDurationMin: 140, transitDurationMin: 35, memo: fp.memo.replace(FP_FROM, FP_TO) } },
    ...spots.slice(3).map((s) => ({ id: s.id, data: {} })),
  ];
  console.log(`外す: ココ・ファーム・ワイナリー\n入れる: ${NAGUSA.name} 10:00〜10:45\nフラワーパーク 11:20〜13:40（車35分）\n説明文: ${it.description.replace(D_FROM, D_TO)}`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(
    async (tx) => {
      await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: it.description!.replace(D_FROM, D_TO) } });
      await setDaySpotOrder(DAY2_ID, items as never, { remove: [COCO], tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
