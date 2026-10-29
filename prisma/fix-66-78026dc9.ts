/**
 * #66(大聖院と紅葉谷公園、宮島の古刹と渓谷美を楽しむ1泊2日、78026dc9)の
 * 初日を、仕様書 docs/specs/20261029-first-last-day-times.md と、
 * 企画運営の「入口と1か所目」の決まり・itinerary-rules.mdに合わせて
 * 組み直す。最終日(2日目)は1泊2日のため今のまま変更しない。
 *
 * 【直す前】Day1は09:00開始・9か所(千畳閣→五重塔→紅葉谷公園→大聖院→
 * 大願寺→宮島歴史民俗資料館→清盛神社→宮島水族館→大元神社)、16:46終了。
 *
 * 【直した内容】タイトル・説明文の見どころ(千畳閣・紅葉谷公園・大聖院・
 * 大願寺・宮島水族館)はすべて残した。説明文に名前のない3か所(宮島歴史
 * 民俗資料館・清盛神社・大元神社)を外した。大願寺(もとから「このあたり
 * で昼食にしましょう」とある)を昼食の場所とし、11時ごろ入口(宮島桟橋)
 * 着からの移動時間に収めるため、紅葉谷公園(50→30分)・大聖院(60→41分)・
 * 千畳閣(45→40分)の滞在を短くした。大願寺の先は、外した3か所を飛ばして
 * 宮島水族館へ直接向かう形にした。
 *
 * 【法務・企画運営の指摘で再修正】①大願寺→水族館の区間(OSRM距離310m)を、
 * 当初「歩いて1分」としたのは分速300mで速すぎた。法務の指摘どおり、
 * 310m÷毎分およそ75m(ふつうの歩く速さ)で「歩いておよそ4分」に直した。
 * ②水族館の滞在を95分→90分に戻した(ほかを縮めたぶんを延ばすのは
 * 決まりAに当たるとの指摘)。千畳閣は40分のまま(企画運営から「OKの点」
 * とされていたため据え置き、二重に縮めた分を延ばす形にはしていない)。
 * ③昼食(大願寺)は13:36開始になる(決まりの11:30〜13:30をやや超えるが、
 * 企画運営から「5分だけなので、このままでかまわない」との回答済み)。
 * ④宿の一文を、10/29の決まり(itinerary-rules.md 1章)どおり
 * 「この夜は、〇〇の宿に泊まりましょう。」の形にした。
 *
 * 新しい時刻(Day1、11:07〜16:30、6か所): 千畳閣11:07(40)→五重塔11:49(15)
 * →紅葉谷公園12:11(30)→大聖院12:49(41)→大願寺13:36(80、昼食)→
 * 宮島水族館15:00(90)
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-66-78026dc9.ts
 *   反映: npm run prod -- npx tsx prisma/fix-66-78026dc9.ts --commit
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const DAY1_ID = "20c9abab-9eff-4390-bd30-b4d78e8cecb4";

const SENJOKAKU_ID = "1b6021c9-cc82-4d63-87a4-60ba7b172ced"; // 千畳閣
const GOJUNOTO_ID = "cd42e5fc-b654-46e0-8178-471e074aacc7"; // 五重塔
const MOMIJIDANI_ID = "c7afe28a-fe12-4f5e-914a-2a302a3bbd92"; // 紅葉谷公園
const DAISHOIN_ID = "9fd28556-e733-40bd-8c82-b6909a5bbbc5"; // 大聖院
const DAIGANJI_ID = "a472b502-43b9-4f90-b4a7-cced0b3f8613"; // 大願寺
const AQUARIUM_ID = "9d398c10-c88b-4875-b653-6883547bbcc7"; // 宮島水族館
const SHIRYOKAN_ID = "02adec35-28a1-4406-8830-97b7df8418c3"; // 宮島歴史民俗資料館(削除)
const KIYOMORI_ID = "b1c8a328-b7a7-47d9-abf2-634328cf67f5"; // 清盛神社(削除)
const OMOTO_ID = "87597c06-964c-43a4-bad9-c6baa2b50eb2"; // 大元神社(削除)

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SENJOKAKU_MEMO_FIND = "JR宮島口駅からフェリーでおよそ10分、宮島に着いたら、宮島桟橋から歩いておよそ7分、千畳閣(豊国神社)に着きます。";
const SENJOKAKU_MEMO_REPLACE = "JR宮島口駅からフェリーで宮島に11時ごろ着いたら、宮島桟橋から歩いておよそ7分、千畳閣(豊国神社)に着きます。";

const DAIGANJI_MEMO_FIND = "この後は、歩いておよそ1分、宮島歴史民俗資料館へ向かいましょう。";
const DAIGANJI_MEMO_REPLACE = "この後は、歩いておよそ4分、宮島水族館へ向かいましょう。";

const AQUARIUM_MEMO =
  "大願寺から歩いておよそ4分、宮島水族館(みやじマリン)に着きます。瀬戸内海の生き物を中心に、およそ380種を展示する水族館です。シンボルのスナメリをはじめ、カキいかだを再現した「カキ水槽」や、生き物に直接触れられる「ふれあいの磯」など、瀬戸内の自然を身近に感じられる展示が揃っています。生き物に触れるときはやさしく、触れたあとは手を洗うようにしましょう。館内をゆっくりめぐって、瀬戸内海の豊かな生き物たちを楽しみましょう。この夜は、宮島の宿に泊まりましょう。";

async function main() {
  const commit = process.argv.includes("--commit");

  const [senjokaku, gojunoto, momijidani, daishoin, daiganji, aquarium] = await Promise.all([
    prisma.spot.findFirstOrThrow({ where: { id: SENJOKAKU_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: GOJUNOTO_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: MOMIJIDANI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: DAISHOIN_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: DAIGANJI_ID, dayId: DAY1_ID } }),
    prisma.spot.findFirstOrThrow({ where: { id: AQUARIUM_ID, dayId: DAY1_ID } }),
  ]);

  console.log("=== #66 Day1 直す前→直した後(修正版) ===\n");
  console.log("[削除] 宮島歴史民俗資料館・清盛神社・大元神社(説明文に名前がない3か所)");
  console.log("");
  console.log(`[1] 千畳閣 (id=${senjokaku.id})`);
  console.log("  新visitTime: 11:07  新stay: 40(前回のまま)");
  console.log("  新文の一文:", SENJOKAKU_MEMO_REPLACE);
  console.log("");
  console.log(`[2] 五重塔 (id=${gojunoto.id}) — 本文は無修正`);
  console.log("  新visitTime: 11:49  新stay: 15(無変更)");
  console.log("");
  console.log(`[3] 紅葉谷公園 (id=${momijidani.id}) — 本文は無修正、前回のまま`);
  console.log("  新visitTime: 12:11  新stay: 30");
  console.log("");
  console.log(`[4] 大聖院 (id=${daishoin.id}) — 本文は無修正、滞在を41分に(前回40分から+1)`);
  console.log("  新visitTime: 12:49  新stay: 41");
  console.log("");
  console.log(`[5] 大願寺 (id=${daiganji.id}) — 結びの移動時間を修正(1分→4分)`);
  console.log("  新visitTime: 13:36  新stay: 80(無変更、昼食)");
  console.log("  新文の一文:", DAIGANJI_MEMO_REPLACE);
  console.log("");
  console.log(`[6] 宮島水族館 (id=${aquarium.id}) — 滞在を90分に戻し、宿の一文を直す`);
  console.log("  新visitTime: 15:00  新stay: 90(前回95から90に戻す)");
  console.log("  新memo:", AQUARIUM_MEMO);
  console.log("");
  console.log("Day1 新しい時刻: 千畳閣11:07(40)→五重塔11:49(15)→紅葉谷公園12:11(30)→大聖院12:49(41)→大願寺13:36(80、昼食)→宮島水族館15:00(90、〜16:30)");
  console.log("Day2(最終日)は1泊2日のため無変更。");

  if (!commit) {
    console.log("\n[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await setDaySpotOrder(
    DAY1_ID,
    [
      { id: senjokaku.id, data: { visitTime: T(11, 7), stayDurationMin: 40, memo: senjokaku.memo!.replace(SENJOKAKU_MEMO_FIND, SENJOKAKU_MEMO_REPLACE) } },
      { id: gojunoto.id, data: { visitTime: T(11, 49) } },
      { id: momijidani.id, data: { visitTime: T(12, 11), stayDurationMin: 30 } },
      { id: daishoin.id, data: { visitTime: T(12, 49), stayDurationMin: 41 } },
      { id: daiganji.id, data: { visitTime: T(13, 36), memo: daiganji.memo!.replace(DAIGANJI_MEMO_FIND, DAIGANJI_MEMO_REPLACE) } },
      {
        id: aquarium.id,
        data: {
          visitTime: T(15, 0),
          stayDurationMin: 90,
          memo: AQUARIUM_MEMO,
          transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
        },
      },
    ],
    { remove: [SHIRYOKAN_ID, KIYOMORI_ID, OMOTO_ID] }
  );

  console.log("\n[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
