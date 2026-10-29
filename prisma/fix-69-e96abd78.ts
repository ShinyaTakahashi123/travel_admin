/**
 * #69(小樽の歴史的建造物と余市の蒸溜所、積丹ブルーをめぐるレンタカー2泊3日、
 * e96abd78)の初日(Day1)と最終日(Day3)を、docs/content/itinerary-rules.md
 * (10/29仕様)に合わせて組み直す。中の日(Day2)は、1か所目9:00・最後16:40
 * (〜16:30-17:00)・6か所で、今のままで決まりに合うため変更しない。
 *
 * 【Day1(初日、11時ごろ〜・3か所以上・16:30〜17:00）】
 * 直す前は09:00開始・7か所(小樽運河→運河館→旧日本郵船→寿司屋通り→
 * 金融資料館→芸術村→堺町通り)、16:30終了(すでに終了は決まりの範囲内)。
 * 説明文にある見どころ(小樽運河・運河館・旧日本郵船・寿司屋通り・
 * 金融資料館・芸術村・堺町通り、寿司屋通りは昼食の場)はすべて残し、
 * 開始を11:00に遅らせた分だけ、各スポットの滞在をバランスよく短くした
 * (決まりAに沿い、移動時間は変えず、スポットを削らずに収めた)。
 * 入口の一文(小樽駅に10時50分ごろ着→歩いて約10分)を1か所目に追加。
 * 運河館・寿司屋通り・芸術村・堺町通りに、前のスポットからの書き出しが
 * 無い、または分数が無かったため追加・修正した(移動時間は無変更、
 * もとのtransitLegの値をそのまま文章にした)。
 *
 * 新しい時刻(Day1、11:00〜16:30、7か所): 小樽運河11:00(30)→
 * 運河館11:35(40)→旧日本郵船12:30(35)→寿司屋通り13:25(45、昼食)→
 * 金融資料館14:20(35)→芸術村15:00(45)→堺町通り15:50(40)
 *
 * 【Day3(2泊以上の最終日、〜14:30-15:00・3か所以上）】
 * 直す前は09:00開始・5か所、最後(小樽市総合博物館本館)が14:50着・
 * stay100分で16:30終了と、決まり(15時までに最後の行き先を出る)に
 * 合わなかった。見どころ(鰊御殿・旧青山別邸・天狗山・鉄道の博物館、
 * すべて説明文にある)は削らず、滞在をバランスよく短くして収めた
 * (決まりAに沿い、移動時間は変えず)。鰊御殿・三角市場・天狗山・
 * 博物館本館の書き出しに、分数が無い、または前のスポットの名前が
 * 違う(「祝津」はエリア名で、本当の前のスポットは旧青山別邸)ものが
 * あったため直した(移動時間は無変更、もとのtransitLegの値をそのまま
 * 文章にした)。最後(博物館本館)の帰りの一文はすでに決まりに合うため
 * 無修正。
 *
 * 新しい時刻(Day3、09:00〜15:00、5か所): 鰊御殿09:00(50)→
 * 旧青山別邸10:05(65)→小樽三角市場11:30(50、昼食)→天狗山12:40(55)→
 * 小樽市総合博物館本館14:00(60、〜15:00)
 *
 * 【法務の指摘で直した1点】鰊御殿の書き出しに「宿から車で約10分」と
 * 分数を入れたが、宿の場所が決まっておらず、小樽駅のあたりからだと
 * 7km前後で10分は短すぎるとの指摘。1日目の1か所目は分数が無くても
 * 決まりに反しないため、もとの「宿から車で、海辺の祝津へ。」のまま
 * (分数を書かない)にした。
 *
 * 【度分秒の換算チェック】18か所すべてのlat/lngを度分秒に変換し、秒の
 * 値が0.1秒単位にちょうど合うものがないか確認した。最も近かったのは
 * 運河館(緯度・経度ともおよそ0.003〜0.006秒差)だが、Nominatim
 * (way1444266306)の値ともほぼ同じ(0.0001度未満の差)で、実在の建物の
 * 位置と確認できたため、度分秒からの換算ではなく本物の座標と判断した。
 * ほかの点はすべて0.006秒以上の差があり、問題なし。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-69-e96abd78.ts
 *   反映: npm run prod -- npx tsx prisma/fix-69-e96abd78.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "d7b615c4-67f5-42cd-bda6-3ccbae46faf6";
const DAY3_ID = "4e165fba-4b35-47d6-813b-e9662013dbc9";

const UNGA_ID = "e90d4f65-f366-4038-9b4a-2578279de49a"; // 小樽運河
const UNGAKAN_ID = "745c2263-0eb1-4450-a1d3-273d7c24f352"; // 小樽市総合博物館運河館
const YUSEN_ID = "c8383b7a-3e54-4d61-869b-decb05136f42"; // 旧日本郵船株式会社小樽支店
const SUSHIYA_ID = "c9d0d08c-c35c-464e-a164-b80f22f9b101"; // 小樽寿司屋通り
const KINYU_ID = "b70f62c3-8e06-417b-8b03-45472e96cd6d"; // 日本銀行旧小樽支店金融資料館
const GEIJUTSU_ID = "653da4d7-031c-4a7e-9bde-57778fc787b9"; // 小樽芸術村
const SAKAIMACHI_ID = "d3b349e1-c050-4271-81f9-1582766b5f89"; // 堺町通り

const NISHIN_ID = "09c9180c-7a11-4ede-9756-df7fba1f0693"; // 小樽市鰊御殿
const AOYAMA_ID = "b40af180-c89b-40b1-ab7c-b3b274c94204"; // 小樽貴賓館(旧青山別邸)
const SANKAKU_ID = "dc1035d7-1570-431d-82ba-0b2772917aae"; // 小樽三角市場
const TENGU_ID = "6000e345-e3a3-41cc-a356-a4d4f3f9c324"; // 小樽天狗山
const HAKUBUTSUKAN_ID = "91db32a7-a45c-47f1-a9c5-100fa3440d0a"; // 小樽市総合博物館本館

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const UNGA_FIND = "小樽駅から歩いて約10分で小樽運河へ。";
const UNGA_REPLACE = "小樽駅に10時50分ごろ着いたら、駅から歩いて約10分の小樽運河へ。";

const UNGAKAN_PREPEND = "小樽運河から歩いて約5分。";

const SUSHIYA_FIND = "旧日本郵船から歩いて、街の中心の寿司屋通りへ。";
const SUSHIYA_REPLACE = "旧日本郵船から歩いて約20分、街の中心の寿司屋通りへ。";

const GEIJUTSU_FIND = "金融資料館から歩いてすぐ。";
const GEIJUTSU_REPLACE = "金融資料館から歩いて約5分。";

const SAKAIMACHI_FIND = "芸術村から歩いてすぐ、運河の南東の堺町通りへ。";
const SAKAIMACHI_REPLACE = "芸術村から歩いて約5分、運河の南東の堺町通りへ。";

const SANKAKU_FIND = "祝津から車で小樽駅の近くへ。";
const SANKAKU_REPLACE = "旧青山別邸から車で約20分、小樽駅の近くへ。";

const TENGU_FIND = "市場から車で天狗山へ。";
const TENGU_REPLACE = "小樽三角市場から車で約20分、天狗山へ。";

const HAKUBUTSUKAN_FIND = "天狗山から車で、北海道の鉄道の発祥の地・手宮へ。";
const HAKUBUTSUKAN_REPLACE = "天狗山から車で約25分、北海道の鉄道の発祥の地・手宮へ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [unga, ungakan, yusen, sushiya, kinyu, geijutsu, sakaimachi, nishin, aoyama, sankaku, tengu, hakubutsukan] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: UNGA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: UNGAKAN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: YUSEN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SUSHIYA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KINYU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GEIJUTSU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SAKAIMACHI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: NISHIN_ID, dayId: DAY3_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: AOYAMA_ID, dayId: DAY3_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SANKAKU_ID, dayId: DAY3_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TENGU_ID, dayId: DAY3_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HAKUBUTSUKAN_ID, dayId: DAY3_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["小樽運河", unga, UNGA_FIND],
    ["小樽寿司屋通り", sushiya, SUSHIYA_FIND],
    ["小樽芸術村", geijutsu, GEIJUTSU_FIND],
    ["堺町通り", sakaimachi, SAKAIMACHI_FIND],
    ["小樽三角市場", sankaku, SANKAKU_FIND],
    ["小樽天狗山", tengu, TENGU_FIND],
    ["小樽市総合博物館本館", hakubutsukan, HAKUBUTSUKAN_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newUngaMemo = unga.memo!.replace(UNGA_FIND, UNGA_REPLACE);
  const newUngakanMemo = UNGAKAN_PREPEND + ungakan.memo;
  const newSushiyaMemo = sushiya.memo!.replace(SUSHIYA_FIND, SUSHIYA_REPLACE);
  const newGeijutsuMemo = geijutsu.memo!.replace(GEIJUTSU_FIND, GEIJUTSU_REPLACE);
  const newSakaimachiMemo = sakaimachi.memo!.replace(SAKAIMACHI_FIND, SAKAIMACHI_REPLACE);
  const newSankakuMemo = sankaku.memo!.replace(SANKAKU_FIND, SANKAKU_REPLACE);
  const newTenguMemo = tengu.memo!.replace(TENGU_FIND, TENGU_REPLACE);
  const newHakubutsukanMemo = hakubutsukan.memo!.replace(HAKUBUTSUKAN_FIND, HAKUBUTSUKAN_REPLACE);

  console.log("=== #69 Day1(初日)直す前→直した後 ===\n");
  console.log(`[1] 小樽運河 (id=${unga.id})  新visitTime: 11:00  新stay: 30`);
  console.log("  新memo:", newUngaMemo);
  console.log(`[2] 運河館 (id=${ungakan.id})  新visitTime: 11:35  新stay: 40`);
  console.log("  新memo:", newUngakanMemo);
  console.log(`[3] 旧日本郵船 (id=${yusen.id}) — 本文無修正  新visitTime: 12:30  新stay: 35`);
  console.log(`[4] 寿司屋通り (id=${sushiya.id})  新visitTime: 13:25  新stay: 45(昼食)`);
  console.log("  新memo:", newSushiyaMemo);
  console.log(`[5] 金融資料館 (id=${kinyu.id}) — 本文無修正  新visitTime: 14:20  新stay: 35`);
  console.log(`[6] 芸術村 (id=${geijutsu.id})  新visitTime: 15:00  新stay: 45`);
  console.log("  新memo:", newGeijutsuMemo);
  console.log(`[7] 堺町通り (id=${sakaimachi.id})  新visitTime: 15:50  新stay: 40`);
  console.log("  新memo:", newSakaimachiMemo);
  console.log("\nDay1 新しい時刻: 小樽運河11:00(30)→運河館11:35(40)→旧日本郵船12:30(35)→寿司屋通り13:25(45、昼食)→金融資料館14:20(35)→芸術村15:00(45)→堺町通り15:50(40、〜16:30)\n");

  console.log("=== #69 Day3(最終日)直す前→直した後 ===\n");
  console.log(`[1] 小樽市鰊御殿 (id=${nishin.id}) — 本文無修正(法務の指摘: 宿の場所未定のため分数は書かない)  新visitTime: 09:00(無変更)  新stay: 50(無変更)`);
  console.log(`[2] 旧青山別邸 (id=${aoyama.id}) — 本文無修正  新visitTime: 10:05(無変更)  新stay: 65`);
  console.log(`[3] 小樽三角市場 (id=${sankaku.id})  新visitTime: 11:30  新stay: 50(昼食)`);
  console.log("  新memo:", newSankakuMemo);
  console.log(`[4] 小樽天狗山 (id=${tengu.id})  新visitTime: 12:40  新stay: 55`);
  console.log("  新memo:", newTenguMemo);
  console.log(`[5] 小樽市総合博物館本館 (id=${hakubutsukan.id})  新visitTime: 14:00  新stay: 60`);
  console.log("  新memo:", newHakubutsukanMemo);
  console.log("\nDay3 新しい時刻: 鰊御殿09:00(50)→旧青山別邸10:05(65)→小樽三角市場11:30(50、昼食)→天狗山12:40(55)→小樽市総合博物館本館14:00(60、〜15:00)");
  console.log("\nDay2(中の日)は09:00開始・6か所・16:40終了で決まりに合うため変更なし。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(DAY1_ID, [
    { id: unga.id, data: { visitTime: T(11, 0), stayDurationMin: 30, memo: newUngaMemo } },
    { id: ungakan.id, data: { visitTime: T(11, 35), stayDurationMin: 40, memo: newUngakanMemo } },
    { id: yusen.id, data: { visitTime: T(12, 30), stayDurationMin: 35 } },
    { id: sushiya.id, data: { visitTime: T(13, 25), stayDurationMin: 45, memo: newSushiyaMemo } },
    { id: kinyu.id, data: { visitTime: T(14, 20), stayDurationMin: 35 } },
    { id: geijutsu.id, data: { visitTime: T(15, 0), stayDurationMin: 45, memo: newGeijutsuMemo } },
    { id: sakaimachi.id, data: { visitTime: T(15, 50), stayDurationMin: 40, memo: newSakaimachiMemo } },
  ]);

  await setDaySpotOrder(DAY3_ID, [
    { id: nishin.id, data: {} },
    { id: aoyama.id, data: { stayDurationMin: 65 } },
    { id: sankaku.id, data: { visitTime: T(11, 30), stayDurationMin: 50, memo: newSankakuMemo } },
    { id: tengu.id, data: { visitTime: T(12, 40), stayDurationMin: 55, memo: newTenguMemo } },
    { id: hakubutsukan.id, data: { visitTime: T(14, 0), stayDurationMin: 60, memo: newHakubutsukanMemo } },
  ]);

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
