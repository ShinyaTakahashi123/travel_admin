/**
 * #81(川平湾と竹富島の赤瓦の集落、石垣やいま村をめぐる石垣島・竹富島
 * 2泊3日、d1855002)の初日・最終日の見直し(修正版)。
 *
 * Day2(中日)は決まりに合うため時刻は変更なし。移動もすべて実測との差
 * 5分未満で確認済み。水牛車観光の座標のみ修正(下記)。
 *
 * 【初日(Day1)の修正】最初の版は入口を「10時05分ごろ着」としたが、
 * 決まり(入口は10:30より前にしない)に反するため、法務・企画運営の
 * 指摘で10:30ごろ着に直した(→手続き15分→車で約25分→玉取崎展望台
 * 11:10着)。このままでは昼食(川平湾)が13:30を過ぎ、終了も17:00を
 * 過ぎるため、滞在をさらに削るのではなく、企画運営の判断で唐人墓
 * (説明文に名前が出てこない)を外した。御神崎→石垣やいま村の直接の
 * 区間を測り直し(実測15.8分、16分に直す)、見どころは削らず滞在を
 * 少しずつ短縮して16:30〜17:00の範囲(17:00ちょうど)、昼食を13:30に
 * 収めた。
 *
 * 新しい時刻: 玉取崎展望台11:10(15)→平久保崎11:50(22)→
 * 米原のヤエヤマヤシ群落12:55(20)→川平湾13:30(75、昼食)→
 * 御神崎15:00(27)→石垣やいま村15:43(77、〜17:00)
 *
 * 【最終日(Day3)の修正】最初の版は開始を8:30としたが、石垣島鍾乳洞の
 * 開館は9:00(公式ishigaki-cave.com)のため9:00開始に直した(もとの
 * 開始と同じ)。「改めてレンタカーを借りる」の文も、1日目に借りた車を
 * 3日間つづけて使う旅のため削除し、もとの「宿から車で、市街地の北へ
 * 約10分。」に戻した。9:00開始・15:00までの範囲には8か所が入らない
 * ため、企画運営の判断で730記念碑(説明文に名前が出てこない)を外した。
 * 帰りの一文(車を返して新石垣空港へ)は、最後のスポットになる
 * 八重山平和祈念館のメモに移した。
 *
 * 新しい時刻(訂正: 移動(legs)を加え忘れていた計算の誤りを法務の指摘で
 * 修正): 石垣島鍾乳洞09:00(50)→バンナ公園10:00(58)→
 * 八重山博物館11:13(38)→石垣市公設市場11:56(52、昼食)→
 * 宮良殿内12:53(28)→桃林寺・権現堂13:31(33)→
 * 八重山平和祈念館14:24(36、〜15:00)
 *
 * 【水牛車観光(企画運営の判断)】水牛車観光の座標が、となりの「竹富島の
 * 集落（なごみの塔）」と同じ点になっていた(法務の指摘)。OSM・地理院
 * のどちらにも乗り場・会社の名前の点がなく(地理院は番地まで出ず大字
 * 「竹富」の中心点のみ)、大字中心は使わない決まりのため、水牛車観光を
 * スポットから外し、内容(送迎バス・乗る時間などの事実のみ)を「竹富島
 * の集落（なごみの塔）」のメモに統合した。集落を1か所目にし、もとの
 * 水牛車(40分)+集落(120分)の合計(160分)を超えない範囲で滞在をまとめた
 * (160分、延ばしなし)。浮いた時間はないが、1か所目の開始を9:00→9:23に
 * 遅らせることで、終了を今と同じ16:30に保った(決まりの順②)。
 *
 * 新しい時刻(Day2): 竹富島の集落（なごみの塔）09:23(160)→西桟橋12:18
 * (30、leg15分)→コンドイビーチ13:00(80、leg12分、直接の区間)→
 * 星砂の浜14:30(60、leg10分)→竹富島ゆがふ館15:45(45、leg15分、〜16:30)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-81-d1855002.ts
 *   反映: npm run prod -- npx tsx prisma/fix-81-d1855002.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "102f719c-7988-4c4c-87bd-593b0640ca21";
const DAY2_ID = "22f72105-6e43-4651-93e3-c3d740afad80";
const DAY3_ID = "cb90dd3c-90e1-4d8c-b579-775526d3a2d9";

const SUIGYU_ID = "946340ac-07b1-4b99-a008-327e0ef6e3f0";
const NISHISAJIBASHI_ID = "6820798a-480f-4012-a931-4ee324ac41c6";
const SHURAKU_ID = "2f3a8a3d-450d-4477-9d11-47f299876890";
const KONDOI_ID = "891a9946-d22a-4d2a-8dfa-db46bd85bc9f";
const HOSHIZUNA_ID = "edbc2bab-3aac-429b-b10b-b17d8be0c111";
const YUGAFUKAN_ID = "5da69083-5239-46ef-972d-54dad1112734";

const TAMATORI_ID = "bc343070-e55f-48d4-a45f-ddef808445f7";
const HIRAKUBO_ID = "2d394b1a-6bfb-4408-83cb-3e1edaef2a95";
const YAEYAMAYASHI_ID = "1798c17a-e186-4e7c-ab43-f16f29942e62";
const KABIRA_ID = "58c40f1c-c8e6-4d8c-bab1-5edae9d639cf";
const UGANZAKI_ID = "e722536a-8738-410b-9d51-942b9cf05b63";
const TOJINBAKA_ID = "5bd48701-0539-4c19-893d-e074d60ac5d1";
const YAIMAMURA_ID = "cc665586-9108-46d1-8eaa-89f0ddd8996a";

const SHONYUDO_ID = "7c2bad3f-df49-4b77-ac4f-e121e84f008b";
const BANNA_ID = "96579562-90d8-4fa9-864b-e9ae1328e382";
const HAKUBUTSUKAN_ID = "c79a6a57-3408-41d0-b44d-21fa46bde6c1";
const ICHIBA_ID = "660f845b-0181-4f54-8cd4-24e332eace6f";
const MIYARA_ID = "024892c9-031a-49c4-969e-d5b3f6179a21";
const TORINJI_ID = "b39f4eb7-f44f-4cdf-a12d-1b1f7da96fb3";
const KINENKAN_ID = "32d013c9-c650-4412-9301-589a6f31d816";
const KANAMARU_ID = "66a9568e-6e20-42f1-aa40-b42a1df42591";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TAMATORI_FIND = "新石垣空港の近くで車を借りて、北へ約25分。";
const TAMATORI_REPLACE = "新石垣空港に10時30分ごろ着いたら、近くで車を借りて(手続きに15分ほど)、北へ約25分。";

const YAIMAMURA_FIND = "唐人墓から車で約10分。";
const YAIMAMURA_REPLACE = "御神崎から車で約16分。";

const KINENKAN_FIND = "休館日は公式の案内で確かめましょう。";
const KINENKAN_REPLACE =
  "休館日は公式の案内で確かめましょう。このあとはレンタカーを返して、新石垣空港から帰りの飛行機に乗りましょう。";

const SHURAKU_MEMO =
  "2日目は車を使わず、船で竹富島へ渡ります。宿から石垣港離島ターミナルへ向かい、船でおよそ15分。竹富港から集落までは、島のバスか、歩いて(およそ10分)向かいます。島の中央にある東・西・仲筋の3つの集落は、昭和62年（1987年）に国の重要伝統的建造物群保存地区に選ばれました。白砂の道と、グックと呼ばれる石積み、屋敷林に囲まれた屋敷に、赤瓦屋根の民家が建ち並ぶ、昔ながらの農村の景観が残っています。白砂の道は、毎朝島の人たちが掃き清めています。西集落のほぼ中央に立つ「なごみの塔」は、昭和28年（1953年）に放送台として住民の手で建てられ、国の登録有形文化財になっています。集落の中は、水牛に引かれた車に乗ってめぐることもできます。水牛を驚かせないよう、乗り降りは案内に従いましょう。乗っている時間は20〜30分ほどで、水牛の体調や歩き方、天気によって前後します。昼食は、集落の中の食事どころでとりましょう。今も人が暮らす集落ですので、家の敷地には入らず、静かに歩きましょう。";

const NISHISAJIBASHI_FIND = "水牛車を降りたら、歩いて島の西の海辺へ。";
const NISHISAJIBASHI_REPLACE = "集落から歩いて、島の西の海辺へ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [tamatori, yaimamura, kinenkan, nishisajibashi] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: TAMATORI_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YAIMAMURA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KINENKAN_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NISHISAJIBASHI_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["玉取崎展望台", tamatori, TAMATORI_FIND],
    ["石垣やいま村", yaimamura, YAIMAMURA_FIND],
    ["八重山平和祈念館", kinenkan, KINENKAN_FIND],
    ["西桟橋", nishisajibashi, NISHISAJIBASHI_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newTamatoriMemo = tamatori.memo!.replace(TAMATORI_FIND, TAMATORI_REPLACE);
  const newYaimamuraMemo = yaimamura.memo!.replace(YAIMAMURA_FIND, YAIMAMURA_REPLACE);
  const newKinenkanMemo = kinenkan.memo!.replace(KINENKAN_FIND, KINENKAN_REPLACE);
  const newNishisajibashiMemo = nishisajibashi.memo!.replace(NISHISAJIBASHI_FIND, NISHISAJIBASHI_REPLACE);

  console.log("=== #81 Day1: 唐人墓を外し、入口を10:30着にする ===\n");
  console.log("[唐人墓] 削除");
  console.log(
    "玉取崎展望台11:10(15)→平久保崎11:50(22)→米原のヤエヤマヤシ群落12:55(20)→川平湾13:30(75、昼食)→御神崎15:00(27)→石垣やいま村15:43(77、〜17:00)"
  );
  console.log("  新memo(玉取崎展望台):", newTamatoriMemo);
  console.log("  新memo(石垣やいま村):", newYaimamuraMemo);

  console.log("\n=== #81 Day3: 730記念碑を外し、開始を9:00にする ===\n");
  console.log("[730記念碑] 削除");
  console.log(
    "石垣島鍾乳洞09:00(50、入口の文はもとのまま)→バンナ公園10:00(58)→八重山博物館11:13(38)→石垣市公設市場11:56(52、昼食)→宮良殿内12:53(28)→桃林寺・権現堂13:31(33)→八重山平和祈念館14:24(36、〜15:00)"
  );
  console.log("  新memo(八重山平和祈念館):", newKinenkanMemo);
  console.log("\n=== #81 Day2: 水牛車観光を外し、集落(なごみの塔)に統合 ===\n");
  console.log("[水牛車観光] 削除、内容を竹富島の集落(なごみの塔)に統合");
  console.log(
    "竹富島の集落（なごみの塔）09:23(160)→西桟橋12:18(30)→コンドイビーチ13:00(80、leg12分、直接の区間)→星砂の浜14:30(60)→竹富島ゆがふ館15:45(45、〜16:30)"
  );
  console.log("  新memo(竹富島の集落（なごみの塔）):", SHURAKU_MEMO);
  console.log("  新memo(西桟橋):", newNishisajibashiMemo);

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: TAMATORI_ID, data: { visitTime: T(11, 10), stayDurationMin: 15, memo: newTamatoriMemo } },
      { id: HIRAKUBO_ID, data: { visitTime: T(11, 50), stayDurationMin: 22 } },
      {
        id: YAEYAMAYASHI_ID,
        data: {
          visitTime: T(12, 55),
          stayDurationMin: 20,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 43 }] },
        },
      },
      { id: KABIRA_ID, data: { visitTime: T(13, 30), stayDurationMin: 75 } },
      { id: UGANZAKI_ID, data: { visitTime: T(15, 0), stayDurationMin: 27 } },
      {
        id: YAIMAMURA_ID,
        data: {
          visitTime: T(15, 43),
          stayDurationMin: 77,
          memo: newYaimamuraMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 16 }] },
        },
      },
    ],
    { remove: [TOJINBAKA_ID] }
  );

  await setDaySpotOrder(
    DAY3_ID,
    [
      { id: SHONYUDO_ID, data: { visitTime: T(9, 0), stayDurationMin: 50 } },
      { id: BANNA_ID, data: { visitTime: T(10, 0), stayDurationMin: 58 } },
      { id: HAKUBUTSUKAN_ID, data: { visitTime: T(11, 13), stayDurationMin: 38 } },
      { id: ICHIBA_ID, data: { visitTime: T(11, 56), stayDurationMin: 52 } },
      { id: MIYARA_ID, data: { visitTime: T(12, 53), stayDurationMin: 28 } },
      { id: TORINJI_ID, data: { visitTime: T(13, 31), stayDurationMin: 33 } },
      { id: KINENKAN_ID, data: { visitTime: T(14, 24), stayDurationMin: 36, memo: newKinenkanMemo } },
    ],
    { remove: [KANAMARU_ID] }
  );

  await setDaySpotOrder(
    DAY2_ID,
    [
      {
        id: SHURAKU_ID,
        data: {
          visitTime: T(9, 23),
          stayDurationMin: 160,
          memo: SHURAKU_MEMO,
          transitLegs: { deleteMany: {} },
        },
      },
      {
        id: NISHISAJIBASHI_ID,
        data: {
          visitTime: T(12, 18),
          stayDurationMin: 30,
          memo: newNishisajibashiMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
        },
      },
      {
        id: KONDOI_ID,
        data: {
          visitTime: T(13, 0),
          stayDurationMin: 80,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 12 }] },
        },
      },
      { id: HOSHIZUNA_ID, data: { visitTime: T(14, 30), stayDurationMin: 60 } },
      { id: YUGAFUKAN_ID, data: { visitTime: T(15, 45), stayDurationMin: 45 } },
    ],
    { remove: [SUIGYU_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
