/**
 * #95 清水寺と八坂神社、東福寺と伏見稲荷大社をめぐり御朱印をいただく京都1泊2日
 * (5bb2acee-21b8-4703-97e7-8ba1d3d4988c) 初日・最終日の見直し。
 *
 * 初日: 入口(京阪・清水五条駅)の到着時刻の記載がなく09:30開始だったため、入口10:30ごろ着+
 * 実測23分で1か所目(清水寺)を10:53に直す(企画運営の判断でバスは使わず、徒歩の実測値を使う)。
 * 説明文の7か所すべてに名前があり外せないため、滞在を少しずつ短くして収める。昼食は八坂神社の
 * 滞在に元からある一文のまま(13:20、13:30の決まりに収まる)。
 *
 * 座標: 法務の指摘で、清水寺(本堂)・六波羅蜜寺・八坂神社(西楼門)・円山公園(枝垂桜)・
 * 知恩院(三門)の座標を、境内全体や度分秒の丸めの点から、名前の地物の点に直す。連動する移動を
 * 実測(routed-foot)し直す。終了は16:49(16:30〜17:00)。
 *
 * 2日目(最終日): 時刻(09:30〜16:50)はもとから決まりに合っていた。東寺→梅小路公園・
 * 梅小路公園→京都鉄道博物館の移動を、座標の直し(東福寺→通天橋、伏見稲荷大社→楼門、梅小路
 * 公園→芝生広場)にあわせて測り直す。京都鉄道博物館の滞在を60分にして、終了を見直す前と
 * 同じ16:50に保つ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-95-5bb2acee.ts
 *   反映: npm run prod -- npx tsx prisma/fix-95-5bb2acee.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const KIYOMIZUDERA_ID = "1851ce5c-7d29-433c-86ef-313beddb03fa";
const ROKUHARAMITSUJI_ID = "77513450-eb9e-4092-8dff-b96de2fcade4";
const YASAKAJINJA_ID = "848ca4f7-8c85-4172-b265-d6aa00d98824";
const MARUYAMAKOEN_ID = "9225e71c-ae94-47ad-8fa4-2fc701a23cdb";
const KODAIJI_ID = "4e379fb1-de4f-42ee-8cd8-41b2152b197a";
const CHIONIN_ID = "e3f8f556-050a-491b-bd64-a5c037722d03";
const SHORENIN_ID = "ba02838b-355b-43b7-9dad-2fa8ff3405e9";

const TOFUKUJI_ID = "c0eb670e-4e45-4fee-92c7-777576cc0474";
const FUSHIMIINARI_ID = "8b587b78-5be8-46b6-a2db-b5875b502c60";
const TOJI_ID = "cdaad61b-bf3f-4220-a0ea-ccfd0bc6cd43";
const UMEKOJIKOEN_ID = "a918534d-04e9-42de-b8fc-2a21b3dfd93d";
const RAILWAY_MUSEUM_ID = "1a0e697b-0c92-453b-abd0-516bb98c93d4";
const NISHIHONGANJI_ID = "21ef4e50-d143-48d2-b962-e6c7d8f17a25";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const KIYOMIZUDERA_FIND = "京阪・清水五条駅から徒歩約25分、または市バスで清水道下車徒歩約10分。";
const KIYOMIZUDERA_REPLACE = "京阪の清水五条駅に10:30ごろ着いたら、歩いて約23分。";

const ROKUHARAMITSUJI_FIND = "西国三十三所第17番札所で、";
const YASAKAJINJA_FIND = "参道の四条通周辺には飲食店が多いので、ここで昼食をとりましょう。";

const TOFUKUJI_FIND = "渓谷にかかる通天橋や、";
const FUSHIMIINARI_FIND = "稲荷山の参道に連なる朱色の鳥居は、";
const UMEKOJIKOEN_FIND = "広々とした芝生広場、";

const MARUYAMAKOEN_TEXT_FIND = "八坂神社からは徒歩5分ほどです。";
const MARUYAMAKOEN_TEXT_REPLACE = "八坂神社からは徒歩4分ほどです。";

const KODAIJI_TEXT_FIND = "円山公園からは徒歩8分ほどです。";
const KODAIJI_TEXT_REPLACE = "円山公園からは徒歩7分ほどです。";

const CHIONIN_TEXT_FIND = "高台寺からは徒歩12分ほどです。";
const CHIONIN_TEXT_REPLACE = "高台寺からは徒歩10分ほどです。";

const SHORENIN_TEXT_FIND = "知恩院からは徒歩5分ほどです。";
const SHORENIN_TEXT_REPLACE = "知恩院からは徒歩6分ほどです。";

const UMEKOJIKOEN_TEXT_FIND = "東寺からは徒歩15分ほどです。";
const UMEKOJIKOEN_TEXT_REPLACE = "東寺からは徒歩12分ほどです。";

const RAILWAY_MUSEUM_TEXT_FIND = "梅小路公園からは徒歩5分ほどです。";
const RAILWAY_MUSEUM_TEXT_REPLACE = "梅小路公園からは徒歩19分ほどです。";

const NISHIHONGANJI_TEXT_FIND = "京都鉄道博物館からは徒歩15分ほどです。";
const NISHIHONGANJI_TEXT_REPLACE = "京都鉄道博物館からは徒歩21分ほどです。";

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = {
    kiyomizudera: KIYOMIZUDERA_ID,
    rokuharamitsuji: ROKUHARAMITSUJI_ID,
    yasakajinja: YASAKAJINJA_ID,
    maruyamakoen: MARUYAMAKOEN_ID,
    kodaiji: KODAIJI_ID,
    chionin: CHIONIN_ID,
    shorenin: SHORENIN_ID,
    tofukuji: TOFUKUJI_ID,
    fushimiinari: FUSHIMIINARI_ID,
    umekojikoen: UMEKOJIKOEN_ID,
    railwayMuseum: RAILWAY_MUSEUM_ID,
    nishihonganji: NISHIHONGANJI_ID,
  };
  const spots = Object.fromEntries(
    await Promise.all(Object.entries(ids).map(async ([key, id]) => [key, await prisma.spot.findFirstOrThrow({ where: { id } })]))
  ) as Record<keyof typeof ids, { memo: string | null }>;

  const checks: [string, string, string][] = [
    ["清水寺", spots.kiyomizudera.memo ?? "", KIYOMIZUDERA_FIND],
    ["六波羅蜜寺", spots.rokuharamitsuji.memo ?? "", ROKUHARAMITSUJI_FIND],
    ["八坂神社", spots.yasakajinja.memo ?? "", YASAKAJINJA_FIND],
    ["東福寺", spots.tofukuji.memo ?? "", TOFUKUJI_FIND],
    ["伏見稲荷大社", spots.fushimiinari.memo ?? "", FUSHIMIINARI_FIND],
    ["梅小路公園", spots.umekojikoen.memo ?? "", UMEKOJIKOEN_FIND],
    ["円山公園(文)", spots.maruyamakoen.memo ?? "", MARUYAMAKOEN_TEXT_FIND],
    ["高台寺(文)", spots.kodaiji.memo ?? "", KODAIJI_TEXT_FIND],
    ["知恩院(文)", spots.chionin.memo ?? "", CHIONIN_TEXT_FIND],
    ["青蓮院(文)", spots.shorenin.memo ?? "", SHORENIN_TEXT_FIND],
    ["梅小路公園(文)", spots.umekojikoen.memo ?? "", UMEKOJIKOEN_TEXT_FIND],
    ["京都鉄道博物館(文)", spots.railwayMuseum.memo ?? "", RAILWAY_MUSEUM_TEXT_FIND],
    ["西本願寺(文)", spots.nishihonganji.memo ?? "", NISHIHONGANJI_TEXT_FIND],
  ];
  for (const [label, text, find] of checks) {
    if (!text.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newKiyomizuderaMemo = spots.kiyomizudera.memo!.replace(KIYOMIZUDERA_FIND, KIYOMIZUDERA_REPLACE);
  const newMaruyamakoenMemo = spots.maruyamakoen.memo!.replace(MARUYAMAKOEN_TEXT_FIND, MARUYAMAKOEN_TEXT_REPLACE);
  const newKodaijiMemo = spots.kodaiji.memo!.replace(KODAIJI_TEXT_FIND, KODAIJI_TEXT_REPLACE);
  const newChioninMemo = spots.chionin.memo!.replace(CHIONIN_TEXT_FIND, CHIONIN_TEXT_REPLACE);
  const newShoreninMemo = spots.shorenin.memo!.replace(SHORENIN_TEXT_FIND, SHORENIN_TEXT_REPLACE);
  const newUmekojikoenMemo = spots.umekojikoen.memo!.replace(UMEKOJIKOEN_TEXT_FIND, UMEKOJIKOEN_TEXT_REPLACE);
  const newRailwayMuseumMemo = spots.railwayMuseum.memo!.replace(RAILWAY_MUSEUM_TEXT_FIND, RAILWAY_MUSEUM_TEXT_REPLACE);
  const newNishihonganjiMemo = spots.nishihonganji.memo!.replace(NISHIHONGANJI_TEXT_FIND, NISHIHONGANJI_TEXT_REPLACE);

  console.log("=== #95 初日・最終日の見直し ===\n");
  console.log("--- 初日 ---");
  console.log("1. 清水寺 10:53(78分、入口を追加):");
  console.log(newKiyomizuderaMemo.slice(0, 60));
  console.log("2. 六波羅蜜寺 12:27(38分←50分、座標を直す、移動16分)");
  console.log("3. 八坂神社 13:20(48分←60分、座標を直す、移動15分、昼食)");
  console.log("4. 円山公園 14:12(20分←30分、座標を直す、移動4分)");
  console.log("5. 高台寺 14:39(48分←60分、移動7分)");
  console.log("6. 知恩院 15:37(33分←45分、座標を直す、移動10分)");
  console.log("7. 青蓮院(最後) 16:16(33分←45分、移動6分、終了16:49)");

  console.log("\n--- 2日目(最終日) ---");
  console.log("1. 東福寺 09:30(70分、変更なし、座標を直す)");
  console.log("2. 伏見稲荷大社 10:55(87分←90分、座標を直す、昼食)");
  console.log("3. 東寺 12:42(60分、変更なし)");
  console.log("4. 梅小路公園 13:54(30分、座標を直す、移動12分)");
  console.log("5. 京都鉄道博物館 14:43(60分←75分、移動19分)");
  console.log("6. 西本願寺(最後) 16:04(45分、変更なし、移動21分、終了16:49)");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({
      where: { id: KIYOMIZUDERA_ID },
      data: { visitTime: t(10, 53), stayDurationMin: 78, lat: 34.994842, lng: 135.785, memo: newKiyomizuderaMemo },
    }),
    prisma.spot.update({
      where: { id: ROKUHARAMITSUJI_ID },
      data: {
        visitTime: t(12, 27),
        stayDurationMin: 38,
        lat: 34.997061,
        lng: 135.77333,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
      },
    }),
    prisma.spot.update({
      where: { id: YASAKAJINJA_ID },
      data: {
        visitTime: t(13, 20),
        stayDurationMin: 48,
        lat: 35.00373,
        lng: 135.777531,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
      },
    }),
    prisma.spot.update({
      where: { id: MARUYAMAKOEN_ID },
      data: {
        visitTime: t(14, 12),
        stayDurationMin: 20,
        lat: 35.003613,
        lng: 135.7803,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
      },
    }),
    prisma.spot.update({
      where: { id: KODAIJI_ID },
      data: {
        visitTime: t(14, 39),
        stayDurationMin: 48,
        memo: newKodaijiMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 7 }] },
      },
    }),
    prisma.spot.update({
      where: { id: CHIONIN_ID },
      data: {
        visitTime: t(15, 37),
        stayDurationMin: 33,
        lat: 35.00479,
        lng: 135.781812,
        memo: newChioninMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10 }] },
      },
    }),
    prisma.spot.update({
      where: { id: SHORENIN_ID },
      data: {
        visitTime: t(16, 16),
        stayDurationMin: 33,
        memo: newShoreninMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
      },
    }),
    prisma.spot.update({ where: { id: MARUYAMAKOEN_ID }, data: { memo: newMaruyamakoenMemo } }),
    prisma.spot.update({ where: { id: TOFUKUJI_ID }, data: { lat: 34.977289, lng: 135.773668 } }),
    prisma.spot.update({
      where: { id: FUSHIMIINARI_ID },
      data: { stayDurationMin: 87, lat: 34.967132, lng: 135.772652 },
    }),
    prisma.spot.update({ where: { id: TOJI_ID }, data: { visitTime: t(12, 42) } }),
    prisma.spot.update({
      where: { id: UMEKOJIKOEN_ID },
      data: {
        visitTime: t(13, 54),
        lat: 34.986598,
        lng: 135.747721,
        memo: newUmekojikoenMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
      },
    }),
    prisma.spot.update({
      where: { id: RAILWAY_MUSEUM_ID },
      data: {
        visitTime: t(14, 43),
        stayDurationMin: 60,
        memo: newRailwayMuseumMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 19 }] },
      },
    }),
    prisma.spot.update({
      where: { id: NISHIHONGANJI_ID },
      data: {
        visitTime: t(16, 4),
        memo: newNishihonganjiMemo,
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 21 }] },
      },
    }),
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
