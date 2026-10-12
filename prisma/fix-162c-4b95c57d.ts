/**
 * #162の続き。確認ツールの指摘2点に対応。
 * ①itinerary-auditの「徒歩が遅すぎ(水増し?) 0.4km/15分」: 報国寺→杉本寺の
 *   移動時間(既存データ、今回は未変更の区間)を、実際の距離に見合う6分に
 *   短縮。あわせて後続の時刻を組み直した。
 * ②flow-checkの「宿の一言なし」: 鶴岡八幡宮(1日目最後のスポット)の結びに
 *   宿泊の一言がなかったため追加。短縮した分、滞在を66分→75分に延ばして
 *   終了時刻は16:30を維持。
 *
 * 新しい時刻(Day1、09:30〜16:30): 報国寺09:30(80)→杉本寺10:56(40)→
 * 浄妙寺11:41(110)→瑞泉寺13:39(75)→鶴岡八幡宮15:15(75)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-162c-4b95c57d.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "badac21c-fd67-45da-98d3-cff2ec258992";

const T = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

async function main() {
  const sugimotodera = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "杉本寺" } });
  const jomyoji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "浄妙寺" } });
  const zuisenji = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "瑞泉寺" } });
  const tsurugaoka = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "鶴岡八幡宮" } });

  if (sugimotodera.visitTime?.getUTCHours() === 10 && sugimotodera.visitTime?.getUTCMinutes() === 56) {
    console.log("already applied, skipping");
    return;
  }

  await prisma.spot.update({
    where: { id: sugimotodera.id },
    data: {
      visitTime: T(10, 56),
      transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 6 }] },
    },
  });
  await prisma.spot.update({ where: { id: jomyoji.id }, data: { visitTime: T(11, 41) } });
  await prisma.spot.update({ where: { id: zuisenji.id }, data: { visitTime: T(13, 39) } });
  await prisma.spot.update({
    where: { id: tsurugaoka.id },
    data: {
      visitTime: T(15, 15),
      stayDurationMin: 75,
      memo: tsurugaoka.memo?.replace(
        "今日の散策はここまで。明日は明月院と円覚寺で、竹の庭とはまた違う緑の美しさを楽しみましょう。",
        "見学を終えたら、今夜は鎌倉市内の宿に宿泊します。明日は明月院と円覚寺で、竹の庭とはまた違う緑の美しさを楽しみましょう。"
      ),
    },
  });

  console.log("#162続き: 報国寺→杉本寺の移動時間を6分に短縮し後続を組み直し、鶴岡八幡宮の結びに宿泊の一言を追加");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
