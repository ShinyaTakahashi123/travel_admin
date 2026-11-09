/**
 * #65(大洗サンビーチとめんたいパーク、海水浴とグルメの1泊2日、
 * 57863f76)の初日を、仕様書 docs/specs/20261029-first-last-day-times.md
 * と、企画運営の「入口と1か所目」の決まりに合わせて組み直す。
 * 最終日(2日目)は1泊2日のため今のまま変更しない。
 *
 * 【経緯】①最初の案は書き出しの時刻とvisitTimeが合っていなかった
 * (企画運営指摘、11:00→11:40に修正)。②次に、大洗サンビーチの滞在が
 * 短いと指摘があり、「神社→めんたいパーク(昼食)→サンビーチ→広浦公園→
 * 涸沼自然公園」の順に組み替えた。③企画運営の指摘(決まり4「まっすぐな
 * 距離から当てずっぽうにしない」)で、新しく生じた3区間と、涸沼自然公園
 * →宿の時間を、座標からのまっすぐな距離の見積もりではなく、OSRM
 * (http://router.project-osrm.org、ほかの担当も使っている実際の道のりの
 * 確認方法)で測り直した:
 *   神社→めんたいパーク: 1.3km/3分(見積もり4分から修正)
 *   めんたいパーク→サンビーチ: 2.9km/5分(見積もり10分から修正)
 *   サンビーチ→広浦公園: 8.8km/16分(見積もり12分から修正)
 *   涸沼自然公園→大洗(神社付近): 11.6km/21分(見積もり30分から修正)
 * 広浦公園→涸沼自然公園は、もとの並びでも隣り合っていた既存の区間
 * (車10分)のため、今回は測り直していない。
 *
 * 新しい時刻(Day1、11:40〜16:49、5か所): 大洗磯前神社11:40(40)→
 * めんたいパーク大洗12:23(50、昼食)→大洗サンビーチ13:18(85)→
 * 広浦公園14:59(40)→涸沼自然公園15:49(60)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-65-57863f76.ts
 *   反映: npm run prod -- npx tsx prisma/fix-65-57863f76.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "25231ff5-c7f0-4419-ab04-82bd32741a45";

const JINJA_ID = "4f052494-9660-4aa3-ba03-daeeedc4060e"; // 大洗磯前神社
const MENTAI_ID = "6b93b52c-2c05-4710-a8d0-8db69d4a169a"; // めんたいパーク大洗
const BEACH_ID = "a6e8f9dc-f17c-453f-984a-010406cfd7cd"; // 大洗サンビーチ
const HIROURA_ID = "cd2d6d09-2b35-4ac0-86a8-7a50c93735fc"; // 広浦公園
const SHIZEN_ID = "836cbeec-e2b1-4b09-8862-5a40db36d42b"; // 涸沼自然公園
const OYAZAWA_ID = "95b61c9d-0ae3-4aab-9875-d9e4b635ca12"; // 親沢公園(削除、前回のまま)
const AMIKAKE_ID = "36b29267-2379-493a-8f51-bf7b754d1418"; // 網掛公園(削除、前回のまま)

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const JINJA_MEMO_FIND = "この旅は車でめぐります。JR水戸駅の近くでレンタカーを借りて、車で約30分。";
const JINJA_MEMO_REPLACE = "この旅は車でめぐります。JR水戸駅に11時ごろ着いたら、駅の近くでレンタカーを借りて、車で約30分。";

const MENTAI_MEMO =
  "大洗磯前神社から車でおよそ3分、大洗港のそばへ。ガラスごしに明太子をつくる工場を見学できる施設で、明太子を使った料理のフードコートがあるので、ここで昼食にしましょう。食事を終えたら、車で大洗サンビーチへ向かいましょう。";

const BEACH_MEMO =
  "めんたいパークから車でおよそ5分。遠浅の海に広い砂浜が続く海水浴場で、昭和59年に開かれました。体の不自由な人や年を重ねた人も安心して海を楽しめる「ユニバーサルビーチ」の考えで整えられていて、砂の上を進める水陸両用の車いすの貸し出しもあります。泳ぐときは決められた区域の中で泳ぎ、監視員の指示に従いましょう。遊泳の期間は公式の案内で確かめましょう。海水浴を終えたら、車で広浦公園へ向かいましょう。";

const HIROURA_MEMO_FIND = "めんたいパークから西へ、車で約20分の涸沼へ。";
const HIROURA_MEMO_REPLACE = "大洗サンビーチから車でおよそ16分、涸沼へ。";

const SHIZEN_MEMO =
  "広浦公園から湖岸沿いに車で約10分。海水と淡水がまじり合う汽水湖・涸沼は、2016年にラムサール条約の湿地に登録されました。そのほとりの広い公園で、「太陽の広場」からは涸沼を一望でき、梅雨のころには約1万株のあじさいが咲きます。涸沼にすむ珍しいトンボ・ヒヌマイトトンボにちなむ赤い橋も架かっています。生きものはとらずに、見るだけにしましょう。今夜は、車で約20分の大洗の宿に泊まります。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [jinja, mentai, beach, hiroura, shizen] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: JINJA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MENTAI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: BEACH_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: HIROURA_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: SHIZEN_ID, dayId: DAY1_ID } }),
  ]);

  console.log("=== #65 Day1 直す前→直した後(OSRM実測で移動時間を修正) ===\n");
  console.log("[削除] 網掛公園 id=" + AMIKAKE_ID + " / 親沢公園 id=" + OYAZAWA_ID + "(前回のまま)");
  console.log("");
  console.log(`[1] 大洗磯前神社 (id=${jinja.id}) — 前回のまま`);
  console.log("  新visitTime: 11:40 (stay 40、無変更)");
  console.log("");
  console.log(`[2] めんたいパーク大洗 (id=${mentai.id})`);
  console.log("  旧visitTime:", mentai.visitTime, " → 新visitTime: 12:23  新stay: 50(無変更、昼食)");
  console.log("  新memo:", MENTAI_MEMO, "(神社→めんたい OSRM実測1.3km/3分)");
  console.log("");
  console.log(`[3] 大洗サンビーチ (id=${beach.id})`);
  console.log("  旧visitTime:", beach.visitTime, " 旧stay:", beach.stayDurationMin, "→ 新visitTime: 13:18  新stay: 85");
  console.log("  新memo:", BEACH_MEMO, "(めんたい→サンビーチ OSRM実測2.9km/5分)");
  console.log("");
  console.log(`[4] 広浦公園 (id=${hiroura.id})`);
  console.log("  旧visitTime:", hiroura.visitTime, " → 新visitTime: 14:59  新stay: 40(無変更)");
  console.log("  新文の一文:", HIROURA_MEMO_REPLACE, "(サンビーチ→広浦 OSRM実測8.8km/16分)");
  console.log("");
  console.log(`[5] 涸沼自然公園 (id=${shizen.id})`);
  console.log("  新visitTime: 15:49 (stay 60、無変更)");
  console.log("  新memo末尾: 「今夜は、車で約20分の大洗の宿に泊まります。」(涸沼自然公園→大洗 OSRM実測11.6km/21分)");
  console.log("");
  console.log("Day1 新しい時刻: 大洗磯前神社11:40(40)→めんたいパーク大洗12:23(50、昼食)→大洗サンビーチ13:18(85)→広浦公園14:59(40)→涸沼自然公園15:49(60、〜16:49)");
  console.log("Day2(最終日)は1泊2日のため無変更。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: jinja.id, data: { visitTime: T(11, 40), memo: jinja.memo!.replace(JINJA_MEMO_FIND, JINJA_MEMO_REPLACE) } },
      {
        id: mentai.id,
        data: {
          visitTime: T(12, 23),
          memo: MENTAI_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 3 }] },
        },
      },
      {
        id: beach.id,
        data: {
          visitTime: T(13, 18),
          stayDurationMin: 85,
          memo: BEACH_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 5 }] },
        },
      },
      {
        id: hiroura.id,
        data: {
          visitTime: T(14, 59),
          memo: hiroura.memo!.replace(HIROURA_MEMO_FIND, HIROURA_MEMO_REPLACE),
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "car", transitDurationMin: 16 }] },
        },
      },
      { id: shizen.id, data: { visitTime: T(15, 49), memo: SHIZEN_MEMO } },
    ],
    { remove: [AMIKAKE_ID, OYAZAWA_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
