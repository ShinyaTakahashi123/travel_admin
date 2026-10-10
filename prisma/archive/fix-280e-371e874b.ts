/**
 * チェックリスト #280 の修正記録(続き、企画運営1点・法務2点)。
 * しおり「共同浴場とガス灯の街を味わい尽くす、銀山温泉じっくり1泊2日」
 * (371e874b-267d-4ed0-a3aa-6494df36206c)
 *
 * 1. 企画運営の指摘: 徳良湖に、湖畔を歩ける内容と桜の見どころを追加。
 *    出典(直接開いたURL):
 *    https://www.city.obanazawa.yamagata.jp/kanko/matsuri/hanagasa-odori/
 *    (尾花沢市公式。土搗り唄が花笠音頭の起源との由来、既存の本文どおり)
 *    https://www.city.obanazawa.yamagata.jp/kanko/kankochi/1395
 *    (尾花沢市公式。「4月下旬から5月上旬にかけて、徳良湖周辺におよそ100本の
 *    ソメイヨシノが咲きます」「平成17年10月には『最上川さくら回廊』事業に
 *    より30本の『大山桜』が植栽」)
 *    湖を一周する遊歩道があるとの案内も複数のサイトで確認できたため、
 *    散策の一言を追加。滞在を30分→55分に見直した(実在の内容の追記)。
 *
 * 2. 法務の指摘: しろがね湯に入浴の際の配慮(撮影しない)の一文がなかった
 *    ため追加。
 *
 * 3. 法務の指摘: 大正ロマンの旅館の町並みの「国の登録有形文化財に指定
 *    されている」を「登録されている」に修正(#294の飛龍閣と同じ直し)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-280e-371e874b.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "371e874b-267d-4ed0-a3aa-6494df36206c";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });

  const tokurako = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "徳良湖" } });
  if (tokurako.stayDurationMin === 30) {
    await updateSpotInItinerary(ITIN_ID, { spotId: tokurako.id }, {
      stayDurationMin: 55,
      memo:
        tokurako.memo +
        "湖畔にはおよそ100本のソメイヨシノと、平成17年(2005)に植えられた大山桜30本があり、桜の時期にはライトアップも行われます。湖を一周する遊歩道が整備されているので、のんびりと歩いてみましょう。",
    });
  }

  const shiroganeyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "しろがね湯" } });
  const photoLine = "浴場ではほかの入浴客を撮らないようにしましょう。";
  if (shiroganeyu.memo && !shiroganeyu.memo.includes(photoLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: shiroganeyu.id }, {
      memo: shiroganeyu.memo + " " + photoLine,
    });
  }

  const machinami = await prisma.spot.findFirstOrThrow({
    where: { dayId: day1.id, name: "大正ロマンの旅館の町並み(能登屋・藤屋ほか)" },
  });
  const oldText = "国の登録有形文化財に指定されている";
  if (machinami.memo?.includes(oldText)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: machinami.id }, {
      memo: machinami.memo.replace(oldText, "国の登録有形文化財に登録されている"),
    });
  }

  // 徳良湖の滞在延長にともない、後続スポットの開始時刻を25分繰り下げる
  const shiftMin = 25;
  const downstreamNames = [
    "白銀公園",
    "延沢銀山遺跡",
    "大正ロマンの旅館の町並み(能登屋・藤屋ほか)",
    "しろがね湯",
    "銀山温泉街",
  ];
  const shirogane = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白銀公園" } });
  if (shirogane.visitTime?.getUTCHours() === 11 && shirogane.visitTime?.getUTCMinutes() === 20) {
    for (const name of downstreamNames) {
      const row = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name } });
      if (row.visitTime) {
        const newTime = new Date(row.visitTime.getTime() + shiftMin * 60000);
        await updateSpotInItinerary(ITIN_ID, { spotId: row.id }, { visitTime: newTime });
      }
    }
  }

  // transitMode・transitDurationMinは変更していないため、spot_transit_legの
  // 同期は不要(resync-transit-legs.tsの対象外)

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
