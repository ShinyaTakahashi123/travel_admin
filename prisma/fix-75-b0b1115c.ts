/**
 * #75(米子城跡と皆生温泉、歴史と海辺の湯を楽しむ1泊2日、b0b1115c)の、
 * 初日・最終日の見直し。
 *
 * Day2(最終日)は、09:00開始・16:30終了ですでに決まりに合うため変更なし。
 *
 * Day1(初日)は09:00開始・16:30終了だったが、1か所目(米子城跡)の到着が
 * 10:45〜11:45の範囲外(09:00)だったため、入口の一文に時刻を加え
 * (JR米子駅に10時25分ごろ着→歩いて20分→米子城跡10:45着)、見どころは
 * 削らず滞在を短縮した。
 *
 * 【移動の測り直し】routing.openstreetmap.de/routed-footで3区間を測り直した:
 * - 米子城跡→湊山公園(walk): 5分→実測16.1分(1204m)。短すぎた。16分に直す
 *   (城跡は山頂の見晴らしまで登る内容(メモに「山頂からは…見渡せます」
 *   「石段や坂道が続くので…登りましょう」とあり)で、下山の道のりが
 *   もとの5分には含まれていなかったと考えられる)
 * - 湊山公園→歴史館(walk): 20分→実測15.0分(1128m)。長すぎた。15分に直す
 * - 歴史館→加茂川沿いの白壁土蔵(walk): 5分→実測4.5分(335m)。ほぼ一致、
 *   変更なし(昼食の時間も含むため、到着時刻は別途調整)
 *
 * 新しい時刻(Day1、入口を10:30着・10:50開始に、企画運営の指示どおり):
 *   米子城跡10:50(55)→湊山公園12:01(20、leg16分)→
 *   歴史館12:36(35、leg15分、この後昼食)→
 *   白壁土蔵13:51(39、leg5分+昼食35分)→皆生温泉15:00(120、leg30分bus、〜17:00)
 *
 * (訂正: 最初の版は湊山公園・歴史館のvisitTimeの計算を誤っていた
 * (区間の移動分を加え忘れていた)。企画運営の指摘で確認し、全体を
 * 正しく計算し直した。皆生温泉の到着も14:30→15:00に変わる)
 *
 * 【座標の直し(法務の指摘、Day2)】とっとり花回廊の点は、バス停(node
 * 5761173323)の点だった。施設そのもの(OSM way406678528「鳥取県立
 * とっとり花回廊」tourism=museum)のNominatim値35.3479682/133.4248977に
 * 直す。旧点との差は約174mで、桝水高原からの移動(car)は、新しい点でも
 * 実測15.8分・決まりの「実測×1.5+5=28.7分」以内のため、時刻・滞在は
 * 変更しない(座標のみの訂正)。
 *
 * 【桝水高原の座標(企画運営の例外、2026-10-30)】桝水高原には、OSM・
 * 地理院のどちらにも「桝水高原」という名前の点がなく、300m以内にも
 * 名前のある地物がなかった(法務の指摘)。企画運営の判断で、itinerary-
 * rules.md 7章の最後の行の例外として、同じ高原の名前を持つ実在の施設
 * way1458697240「大山ますみず高原スノーパーク」(約529m)のNominatim値
 * 35.3696581/133.5181488を使う。
 *
 * 座標が約500m動くため、前後の車の区間を道のりで測り直した(法務の指摘):
 * - 大神山神社奥宮→桝水高原: 20分→実測7.2分。決まりの「実測×1.5+5=
 *   15.8分」を超えていたため、12分(実測+5分)に直す
 * - 桝水高原→とっとり花回廊: 25分→実測16.3分。「実測×1.5+5=29.5分」
 *   以内のため変更なし
 * 浮いた8分は、2日目が今より早くならないよう、1か所目(米子水鳥公園)の
 * 開始を9:00→9:08に遅らせて吸収した(決まりの順②)。結果、桝水高原
 * 以降(14:20着・15:00発・花回廊15:25着・終了16:30)は今と同じ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-75-b0b1115c.ts
 *   反映: npm run prod -- npx tsx prisma/fix-75-b0b1115c.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const YONAGOJO_ID = "90f703be-2860-4a96-87b3-3eb163aff665";
const MINATOYAMA_ID = "b4246a9d-a5c6-45ea-8551-cbf0334d8309";
const REKISHIKAN_ID = "4b568147-8c66-489c-9760-5360ef6d916c";
const SHIRAKABE_ID = "25254f8d-80f6-49c3-ad30-8ded60ef70db";
const KAIKE_ID = "89aefb60-9ea4-46da-9d36-1c93494627f5";
const HANAKAIRO_ID = "8e6c472f-b085-41ab-9704-d26b8779b17c";
const SUICHO_ID = "146ffc1e-c2ee-4448-b83d-a166c6d14f0a";
const HONSHA_ID = "c43add3c-4d30-4eab-a872-575d4b3fca35";
const DAISENJI_ID = "780b9059-3cd2-4db9-9ad2-a86fe25f5d12";
const OKUMIYA_ID = "45809240-4065-42bc-a4d3-9c400ec521c2";
const MASUIZU_ID = "13b354d0-c391-46b0-849e-086562d47748";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const YONAGOJO_FIND = "旅の始まりは、JR米子駅から歩いて20分ほどの米子城跡へ。";
const YONAGOJO_REPLACE = "旅の始まりは、JR米子駅に10時30分ごろ着いたら、歩いて20分ほどの米子城跡へ。";

const MINATOYAMA_FIND = "城山のふもとに広がる湊山公園へ。";
const MINATOYAMA_REPLACE = "米子城跡から歩いて約16分、城山のふもとに広がる湊山公園へ。";

const REKISHIKAN_FIND = "湊山公園から歩いて、米子市立山陰歴史館へ。";
const REKISHIKAN_REPLACE = "湊山公園から歩いて約15分、米子市立山陰歴史館へ。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [yonagojo, minatoyama, rekishikan] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: YONAGOJO_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MINATOYAMA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: REKISHIKAN_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["米子城跡", yonagojo, YONAGOJO_FIND],
    ["湊山公園", minatoyama, MINATOYAMA_FIND],
    ["山陰歴史館", rekishikan, REKISHIKAN_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newYonagojoMemo = yonagojo.memo!.replace(YONAGOJO_FIND, YONAGOJO_REPLACE);
  const newMinatoyamaMemo = minatoyama.memo!.replace(MINATOYAMA_FIND, MINATOYAMA_REPLACE);
  const newRekishikanMemo = rekishikan.memo!.replace(REKISHIKAN_FIND, REKISHIKAN_REPLACE);

  console.log("=== #75 Day1: 初日の開始を10:50に(入口は米子駅10:30着)、移動の測り直し ===\n");
  console.log(`[米子城跡] 新visitTime: 10:50  新stay: 55(もと75)`);
  console.log("  新memo:", newYonagojoMemo);
  console.log(`[湊山公園] 新visitTime: 12:01  新stay: 20(もと30)  新leg: walk/16分`);
  console.log("  新memo:", newMinatoyamaMemo);
  console.log(`[山陰歴史館] 新visitTime: 12:36  新stay: 35(もと50)  新leg: walk/15分`);
  console.log("  新memo:", newRekishikanMemo);
  console.log(`[白壁土蔵] 新visitTime: 13:51  新stay: 39(もと45)  leg:walk/5分(無変更)`);
  console.log(`[皆生温泉] 新visitTime: 15:00(もと14:30)  新stay: 120(無変更、〜17:00)`);
  console.log(
    "\nDay1 新しい時刻: 米子城跡10:50(55)→湊山公園12:01(20)→山陰歴史館12:36(35)→白壁土蔵13:51(39)→皆生温泉15:00(120、〜17:00)"
  );
  console.log(`\n[とっとり花回廊] 新lat/lng: 35.3479682/133.4248977(OSM way406678528、Nominatim)。時刻・滞在は変更なし`);
  console.log(`[桝水高原] 新lat/lng: 35.3696581/133.5181488(企画運営の例外、同じ高原のスノーパークway1458697240のNominatim)`);
  console.log(`\n-- Day2(米子水鳥公園の開始を9:00→9:08に) --`);
  console.log(`[米子水鳥公園] 新visitTime: 09:08(もと09:00)  新stay: 50(無変更)`);
  console.log(`[大神山神社（本社）] 新visitTime: 10:23  新stay: 35(無変更)`);
  console.log(`[大山寺] 新visitTime: 11:23  新stay: 45(無変更)`);
  console.log(`[大神山神社奥宮] 新visitTime: 12:23  新stay: 60(無変更)  新leg: car/12分(もと20分)`);
  console.log(`[桝水高原] 新visitTime: 14:20(無変更)  新stay: 40(無変更)`);
  console.log(`[とっとり花回廊] 新visitTime: 15:25(無変更)  新stay: 65(無変更、〜16:30、無変更)`);
  console.log(
    "\nDay2 新しい時刻: 米子水鳥公園09:08(50)→大神山神社本社10:23(35)→大山寺11:23(45)→奥宮12:23(60)→桝水高原14:20(40)→とっとり花回廊15:25(65、〜16:30)"
  );

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.spot.update({
    where: { id: YONAGOJO_ID },
    data: { visitTime: T(10, 50), stayDurationMin: 55, memo: newYonagojoMemo },
  });
  await prisma.spot.update({
    where: { id: MINATOYAMA_ID },
    data: {
      visitTime: T(12, 1),
      stayDurationMin: 20,
      memo: newMinatoyamaMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 16 }] },
    },
  });
  await prisma.spot.update({
    where: { id: REKISHIKAN_ID },
    data: {
      visitTime: T(12, 36),
      stayDurationMin: 35,
      memo: newRekishikanMemo,
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 15 }] },
    },
  });
  await prisma.spot.update({
    where: { id: SHIRAKABE_ID },
    data: { visitTime: T(13, 51), stayDurationMin: 39 },
  });
  await prisma.spot.update({
    where: { id: KAIKE_ID },
    data: { visitTime: T(15, 0) },
  });
  await prisma.spot.update({
    where: { id: HANAKAIRO_ID },
    data: { lat: 35.3479682, lng: 133.4248977 },
  });
  await prisma.spot.update({ where: { id: SUICHO_ID }, data: { visitTime: T(9, 8) } });
  await prisma.spot.update({ where: { id: HONSHA_ID }, data: { visitTime: T(10, 23) } });
  await prisma.spot.update({ where: { id: DAISENJI_ID }, data: { visitTime: T(11, 23) } });
  await prisma.spot.update({
    where: { id: OKUMIYA_ID },
    data: {
      visitTime: T(12, 23),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 12 }] },
    },
  });
  await prisma.spot.update({
    where: { id: MASUIZU_ID },
    data: { lat: 35.3696581, lng: 133.5181488 },
  });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
