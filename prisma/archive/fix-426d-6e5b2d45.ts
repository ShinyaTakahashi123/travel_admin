/**
 * #426 6e5b2d45 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 2日目（車）: 粟又の滝 → 大多喜城 → 大多喜の城下町（昼食）→ 夷隅神社 →（車）八幡岬公園（新規）→ 鵜原理想郷（新規）→ かつうら海中公園 海中展望塔（新規）（7か所 09:00〜16:30）
 *   海中展望塔は 9:00〜17:00、最終受付16:30（公式）。本文に時刻は書かない
 * 本文の出典: 勝浦市 https://www.city.katsuura.lg.jp/page/1164.html （鵜原理想郷）、勝浦市観光協会 https://www.katsuura-kankou.net/ubarautopia/ （鵜原理想郷・往復1時間半）、
 *   ちば観光ナビ https://maruchiba.jp/spot/detail_10390.html （八幡岬公園）・https://maruchiba.jp/spot/detail_10392.html （かつうら海中公園）、海中展望塔 https://www.katsuura.org/hourprice/
 * 座標の出典: Nominatim（八幡岬公園 35.1359091,140.3113394／かつうら海中公園 35.1341423,140.2840345／鵜原理想郷は、入口まで歩いて約7分の鵜原駅 35.1408440,140.2784674）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-426d-6e5b2d45.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "6e5b2d45-92e1-4cfe-913d-b80babce8573";
const DAY2_ID = "aa4b3de6-3fa5-4638-b964-334abfeaf8bb";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  if (day.spots.length !== 4 || day.spots[3].name !== "夷隅神社") throw new Error("2日目が想定と違います");
  const isumi = day.spots[3];
  const idx = isumi.memo?.indexOf("房総の渓谷と") ?? -1;
  if (idx < 0) throw new Error("夷隅神社の本文が想定と違います");
  const oldTail = isumi.memo!.slice(idx);
  const isumiMemo = isumi.memo!.slice(0, idx) + "このあとは車で、外房の海辺の町・勝浦へ向かいましょう。";

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: isumi.id, data: { memo: isumiMemo } },
    { create: { name: "八幡岬公園", visitTime: t(13, 35), stayDurationMin: 35, transitMode: "car", transitDurationMin: 35, transitLine: null, lat: 35.135909, lng: 140.311339, address: "千葉県勝浦市浜勝浦",
      memo: "大多喜から車で、勝浦の市街地の南東、海に突き出た八幡岬へ。かつて勝浦城があった場所で、今は公園として整えられています。海の眺めがよく、岬の突端からは太平洋の大パノラマが広がります。崖の近くでは柵の外に出ず、足元に気をつけましょう。" } },
    { create: { name: "鵜原理想郷", visitTime: t(14, 25), stayDurationMin: 60, transitMode: "car", transitDurationMin: 15, transitLine: null, lat: 35.140844, lng: 140.278467, address: "千葉県勝浦市鵜原",
      memo: "八幡岬から車で、JR鵜原駅の近くにある鵜原理想郷へ。太平洋の荒波に削られた典型的なリアス式海岸の明神岬一帯で、大正の初めにここを別荘地にする計画があったことから「理想郷」と呼ばれるようになりました。昭和11年（1936年）には与謝野晶子が友人の画家らとここに滞在し、76首の歌を詠んでいます。岬をめぐる散策路は、ゆっくり歩くと往復1時間半ほどなので、時間に合わせて歩ける範囲を楽しみましょう。起伏のある道なので、歩きやすい靴で出かけましょう。" } },
    { create: { name: "かつうら海中公園 海中展望塔", visitTime: t(15, 40), stayDurationMin: 50, transitMode: "car", transitDurationMin: 10, transitLine: null, lat: 35.134142, lng: 140.284035, address: "千葉県勝浦市吉尾174",
      memo: "旅の締めくくりは、かつうら海中公園の海中展望塔へ。沖合60mの海の上に建つ塔で、桟橋を渡って向かいます。塔のらせん階段を下りると、水深8mの窓から海の中の生き物を自然のままの姿で観察できます。らせん階段は段数が多いので、ゆっくり上り下りしましょう。受付の時間は季節や天気で変わることがあるので、公式の案内で確かめましょう。房総の渓谷と外房の海をめぐった旅を、ここで締めくくりましょう。帰りも安全運転で。" } },
  ];
  console.log(`夷隅神社の最後（前）: ${oldTail}`);
  console.log(`夷隅神社の最後（後）: …${isumiMemo.slice(-60)}`);
  console.log("2日目: 粟又の滝 09:00 → 大多喜城 → 城下町（昼食）→ 夷隅神社 12:40〜13:00 →（車35分）八幡岬公園 13:35〜14:10 →（車15分）鵜原理想郷 14:25〜15:25 →（車10分）海中展望塔 15:40〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => { await setDaySpotOrder(DAY2_ID, order, { tx }); }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
