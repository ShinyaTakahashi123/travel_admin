/**
 * #68(天橋立と伊根の舟屋、海と絶景の丹後めぐり旅、c5aee4db)の初日を、
 * docs/content/itinerary-rules.md に合わせて組み直す(法務の指摘を反映した
 * 2回目の版)。最終日(2日目)は時刻・順番は変えないが、法務の指摘により
 * レンタカーを返す一文と、籠神社の座標を直す。
 *
 * 【1回目からの変更点、法務の指摘により】
 * 1. 入口の一文が無かった。琴引浜の書き出しに「京都丹後鉄道の網野駅に
 *    10時45分ごろ着いたら、駅前でレンタカーの手続きをして、車で約6分」
 *    を追加(網野駅→琴引浜はOSRMで5.97km/6.3分)。
 * 2. 伊根の舟屋・丹後国分寺跡に、前のスポットからの書き出しが無かった。
 *    追加した。
 * 3. 丹後由良は、タイトル・説明文に名前がなく、伊根→由良(南東、宮津の
 *    さらに南)→国分寺跡(天橋立の北)→ビューランド(天橋立の南)という、
 *    天橋立のあたりを行ったり来たりする順番の原因になっていたため外した。
 *    伊根の舟屋→丹後国分寺跡の直接の区間をOSRMで測った(18.0km/14.9分)。
 * 4. 決まりで使わない言い方を直した: 伊根の舟屋「おすすめです」→
 *    「しましょう」、丹後国分寺跡「歩いてみてください」→「歩きましょう」。
 * 5. 丹後国分寺跡の座標(35.580056,135.180056、末尾がどちらも「0056」で
 *    度分秒からの換算と疑われるもの)を、OSM(Nominatim、way1113487378の
 *    中心 35.579199/135.179026)に直した。
 * 6. 2日目の籠神社の座標(35.5622,135.1899)は、OSM(Nominatim、
 *    way681747088)で確かめると実際の籠神社(35.582645,135.196758、
 *    一の宮・文珠側)から2km以上離れた、天橋立の砂州側の点だったため直した。
 *
 * 【法務の2回目の指摘で直した3点】
 * A. 初日が15:37で終わっており早すぎたため、智恩寺のあとに天橋立温泉
 *    「智恵の湯」(智恩寺から歩いて約5分、OSRM実測376m)を1か所足した。
 *    智恩寺の宿の一文は、智恵の湯への案内に変え、宿の一文は智恵の湯の
 *    結びに移した。新しい終了時刻は16:32(16:30〜17:00の決まりに合う)。
 * B. 2日目最後(旧尾藤家住宅)の結びの口調「お帰りは」を直し、どこで
 *    返すかも明記した: 「帰りは、車で約24分の網野駅へ戻り、レンタカーを
 *    返しましょう。」(旧尾藤家住宅→網野駅はOSRMで26.0km/24.1分)。
 * C. 傘松公園の座標(35.5869,135.1947)も、OSM(Nominatim、way683931922、
 *    中心35.586759/135.195117)の値に直した(約40mの差があったため)。
 *
 * 【法務の3回目の指摘で直した「智恵の湯」の文】
 * - 効き目をうたう言い方(「1日歩いた疲れをゆっくり癒やせます」)を削除
 * - 入浴の安全の一文を追加(itinerary-rules.md 5章)
 * - 事実を1つ追加: 浴槽に名前があること(京都府丹後広域振興局「丹後
 *   だより」第404号で確認、営業時間・料金は書かない)
 * - 座標: lat 35.557431 / lng 135.183087 (OSM Nominatim way388803189、
 *   天橋立温泉 智恵の湯の建物の中心)
 *
 * 【法務の4回目の指摘で直した2点】
 * - 浴槽の名前「智恵の輪」は、紹介サイトによって「ちゑの輪」とも
 *   書かれ、字が確かめられなかったため、名前を出さず「天橋立の名所に
 *   ちなんだ名前の湯もある」という言い方にした
 * - 「休みの日は公式の案内で確かめましょう。」を追加(曜日は書かない)
 *
 * 【企画運営の指摘で直した1点(2日目の座標)】
 * - 2日目の「天橋立」(35.569361/135.191528)が、緯度・経度とも度分秒からの
 *   換算を疑われる値だった。OSMの「天橋立」は way472691724(砂州全体の線)
 *   で点ではないため、同じ名前の点を探した。OSM生データ(api.openstreetmap.org
 *   /api/0.6/map)に、天橋立の松並木の中にある、名前がちょうど「天橋立」の
 *   史跡の碑(node 6423747555、historic=memorial)があり、これに直した:
 *   lat 35.5770016 / lng 135.1978960(籠神社に近い、松並木の北側)。
 *
 * 【直す前のDay1】09:00開始・7か所(琴引浜→経ヶ岬灯台→伊根の舟屋→
 * 丹後由良→丹後国分寺跡→天橋立ビューランド→智恩寺)、16:32終了。
 *
 * 新しい時刻(Day1、11:06〜16:32、6か所): 琴引浜11:06(50)→
 * 伊根の舟屋12:27(41、昼食可)→丹後国分寺跡13:23(25)→
 * 天橋立ビューランド13:57(40)→智恩寺14:47(50)→智恵の湯15:42(50)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-68-c5aee4db.ts
 *   反映: npm run prod -- npx tsx prisma/fix-68-c5aee4db.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "991345dc-f3d3-407b-beee-0eb92fa83f8d";

const KOTOHIKI_ID = "7721a48b-add6-4f86-86bc-e455f61d5d2c"; // 琴引浜
const KYOGAMISAKI_ID = "3ed4d230-3b02-49f4-ac39-4057dcf51088"; // 経ヶ岬灯台(削除)
const INE_ID = "5cc71901-3648-4dfc-b001-23ff64deda5b"; // 伊根の舟屋
const YURA_ID = "08cd6903-ce8a-4924-ba78-c70cd6c53c55"; // 丹後由良(削除)
const KOKUBUNJI_ID = "fa8a3736-b0c3-4f72-88a4-429ddaa9a35f"; // 丹後国分寺跡
const VIEWLAND_ID = "4f14613e-131b-4c36-be29-2313c1f4ed78"; // 天橋立ビューランド
const CHIONJI_ID = "62791fec-4404-4eab-ad48-dd36c06f2cba"; // 智恩寺
const KONOJINJA_ID = "d738f0f9-b4e6-4050-8869-ec870f90d762"; // 籠神社(2日目、座標のみ)
const KASAMATSU_ID = "3d2be909-0968-4a39-bf71-9322da89e098"; // 傘松公園(2日目、座標のみ)
const TENKYOUDATE_ID = "1df469c2-1941-4ff0-a7a9-199a5069fc79"; // 天橋立(2日目、座標のみ)
const BITO_ID = "e0901f4e-0be2-4ffb-b9b9-09719db3f473"; // 旧尾藤家住宅(2日目、本文のみ)

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const KOTOHIKI_MEMO_PREPEND =
  "この旅は車でめぐります。京都丹後鉄道の網野駅に10時45分ごろ着いたら、駅前でレンタカーの手続きをして、車で約6分の琴引浜へ。";

const INE_MEMO_PREPEND = "琴引浜から車でおよそ31分、伊根の舟屋に着きます。";
const INE_FIND = "ここで昼食にするのもおすすめです。";
const INE_REPLACE = "ここで昼食にしましょう。";

const KOKUBUNJI_PREPEND = "伊根の舟屋から車でおよそ15分、";
const KOKUBUNJI_FIND = "敬意をもって歩いてみてください。";
const KOKUBUNJI_REPLACE = "敬意をもって歩きましょう。";

const CHIONJI_FIND = "今夜は近くの宿でゆっくりお休みください。";
const CHIONJI_REPLACE = "この後は、歩いておよそ5分、天橋立温泉「智恵の湯」へ向かいましょう。";

const CHIEYU_MEMO =
  "智恩寺から歩いておよそ5分、天橋立温泉「智恵の湯」に着きます。手と足だけをお湯につける「手足湯」や、天橋立の名所にちなんだ名前の湯もある日帰り温泉です。休みの日は公式の案内で確かめましょう。ほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。この夜は、天橋立のあたりの宿に泊まりましょう。";

const BITO_FIND = "お帰りは、車で丹後半島をあとにしましょう。";
const BITO_REPLACE = "帰りは、車で約24分の網野駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [kotohiki, ine, kokubunji, viewland, chionji, konojinja, kasamatsu, tenkyoudate, bito] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: KOTOHIKI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: INE_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KOKUBUNJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: VIEWLAND_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: CHIONJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KONOJINJA_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: KASAMATSU_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: TENKYOUDATE_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: BITO_ID } }),
  ]);

  for (const [label, spot, find] of [
    ["伊根の舟屋", ine, INE_FIND],
    ["丹後国分寺跡", kokubunji, KOKUBUNJI_FIND],
    ["智恩寺", chionji, CHIONJI_FIND],
    ["旧尾藤家住宅", bito, BITO_FIND],
  ] as const) {
    if (!spot.memo?.includes(find)) {
      console.log(`[想定と違います] ${label} に「${find}」が見つかりません。処理を中止します。`);
      return;
    }
  }

  const newKotohikiMemo = KOTOHIKI_MEMO_PREPEND + kotohiki.memo;
  const newIneMemo = (INE_MEMO_PREPEND + ine.memo).replace(INE_FIND, INE_REPLACE);
  const newKokubunjiMemo = (KOKUBUNJI_PREPEND + kokubunji.memo).replace(KOKUBUNJI_FIND, KOKUBUNJI_REPLACE);
  const newChionjiMemo = chionji.memo!.replace(CHIONJI_FIND, CHIONJI_REPLACE);
  const newBitoMemo = bito.memo!.replace(BITO_FIND, BITO_REPLACE);

  console.log("=== #68 Day1 直す前→直した後(2回目の版) ===\n");
  console.log("[削除] 経ヶ岬灯台・丹後由良");
  console.log("");
  console.log(`[1] 琴引浜 (id=${kotohiki.id})`);
  console.log("  新visitTime: 11:06  新stay: 50(無変更)");
  console.log("  新memo:", newKotohikiMemo);
  console.log("");
  console.log(`[2] 伊根の舟屋 (id=${ine.id})`);
  console.log("  新visitTime: 12:27  新stay: 41(無変更)  新transitLeg: car/31分(OSRM実測)");
  console.log("  新memo:", newIneMemo);
  console.log("");
  console.log(`[3] 丹後国分寺跡 (id=${kokubunji.id})`);
  console.log("  新visitTime: 13:23  新stay: 25(無変更)  新transitLeg: car/15分(OSRM実測)");
  console.log("  新memo:", newKokubunjiMemo);
  console.log("  新座標: lat 35.579199 / lng 135.179026 (OSM Nominatim way1113487378)");
  console.log("");
  console.log(`[4] 天橋立ビューランド (id=${viewland.id}) — 本文・移動時間は無修正、時刻のみ`);
  console.log("  新visitTime: 13:57 (stay 40、無変更)");
  console.log("");
  console.log(`[5] 智恩寺 (id=${chionji.id})`);
  console.log("  新visitTime: 14:47  新stay: 50(無変更)");
  console.log("  新memo:", newChionjiMemo);
  console.log("");
  console.log("[6] 天橋立温泉 智恵の湯 (新規作成)");
  console.log("  新visitTime: 15:42  新stay: 50  新transitLeg: walk/5分(OSRM実測376m)");
  console.log("  座標: lat 35.557431 / lng 135.183087 (OSM Nominatim way388803189)");
  console.log("  新memo:", CHIEYU_MEMO);
  console.log("");
  console.log("Day1 新しい時刻: 琴引浜11:06(50)→伊根の舟屋12:27(41、昼食可)→丹後国分寺跡13:23(25)→天橋立ビューランド13:57(40)→智恩寺14:47(50)→智恵の湯15:42(50、〜16:32)");
  console.log("");
  console.log(`[2日目] 籠神社 (id=${konojinja.id}) — 座標のみ修正`);
  console.log("  旧lat/lng:", konojinja.lat, konojinja.lng, " → 新lat/lng: 35.582645 / 135.196758 (OSM Nominatim way681747088、実際の社殿の位置)");
  console.log("");
  console.log(`[2日目] 傘松公園 (id=${kasamatsu.id}) — 座標のみ修正`);
  console.log("  旧lat/lng:", kasamatsu.lat, kasamatsu.lng, " → 新lat/lng: 35.586759 / 135.195117 (OSM Nominatim way683931922)");
  console.log("");
  console.log(`[2日目] 天橋立 (id=${tenkyoudate.id}) — 座標のみ修正`);
  console.log("  旧lat/lng:", tenkyoudate.lat, tenkyoudate.lng, " → 新lat/lng: 35.5770016 / 135.1978960 (OSM raw node 6423747555、名前が「天橋立」の史跡の碑)");
  console.log("");
  console.log(`[2日目] 旧尾藤家住宅 (id=${bito.id}) — 本文のみ修正(帰りの一文)`);
  console.log("  新memo:", newBitoMemo);
  console.log("");
  console.log("Day2(最終日)は時刻・順番とも変更なし。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: kotohiki.id, data: { visitTime: T(11, 6), memo: newKotohikiMemo } },
      {
        id: ine.id,
        data: {
          visitTime: T(12, 27),
          memo: newIneMemo,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 31 }] },
        },
      },
      {
        id: kokubunji.id,
        data: {
          visitTime: T(13, 23),
          memo: newKokubunjiMemo,
          lat: 35.579199,
          lng: 135.179026,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 15 }] },
        },
      },
      { id: viewland.id, data: { visitTime: T(13, 57) } },
      { id: chionji.id, data: { visitTime: T(14, 47), memo: newChionjiMemo } },
      {
        create: {
          name: "天橋立温泉 智恵の湯",
          lat: 35.557431,
          lng: 135.183087,
          visitTime: T(15, 42),
          stayDurationMin: 50,
          memo: CHIEYU_MEMO,
          stampCategory: "onsen",
          transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
        },
      },
    ],
    { remove: [KYOGAMISAKI_ID, YURA_ID] }
  );

  await prisma.spot.update({ where: { id: KONOJINJA_ID }, data: { lat: 35.582645, lng: 135.196758 } });
  await prisma.spot.update({ where: { id: KASAMATSU_ID }, data: { lat: 35.586759, lng: 135.195117 } });
  await prisma.spot.update({ where: { id: TENKYOUDATE_ID }, data: { lat: 35.5770016, lng: 135.197896 } });
  await prisma.spot.update({ where: { id: BITO_ID }, data: { memo: newBitoMemo } });

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
