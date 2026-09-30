/**
 * チェックリスト #278 の修正記録(2巡目、企画運営の指摘3点)。
 * しおり「温泉津温泉、世界遺産の湯治場を楽しむ石見銀山1泊2日」
 * (34e2b41c-5c39-43ef-917d-aa859b7a4f16)
 *
 * 1. 決まり7: 龍源寺間歩は冬季(12〜2月)16:00閉坑・最終入坑15:50(大田市公式
 *    https://www.city.oda.lg.jp/update_info/3672 で確認)。旧構成は16:30到着で
 *    冬季に間に合わない。龍源寺間歩を清水谷製錬所跡の直後(14:37開始、全季節で
 *    余裕をもって間に合う)に移し、豊栄神社をDay2最後に回した(神社は開閉の
 *    時刻がない)。
 * 2. 説明文が「町並みや五百羅漢とは違う」のままで、実際のDay2の中身(町並み・
 *    五百羅漢をめぐる)と逆だったため書き直し。
 * 3. 清水谷製錬所跡の「藤田組(現在の同和鉱業)」→「藤田組(のちの同和鉱業)」
 *    (社名はその後も変わっているため、「現在」の断定を避けた)。
 *
 * itinerary-audit.cjs・prayer-check.cjs 再確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-278b-34e2b41c.ts
 * (実行済み。現在の並び・本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "34e2b41c-5c39-43ef-917d-aa859b7a4f16";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day2 = itin.days[1];

  // 1) 順番の入れ替え: 清水谷製錬所跡→龍源寺間歩→豊栄神社
  const toyosaka = day2.spots.find((s) => s.name === "豊栄神社");
  const ryugenji = day2.spots.find((s) => s.name === "龍源寺間歩")!;
  if (toyosaka && toyosaka.orderNo < ryugenji.orderNo) {
    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day2.id,
        [
          ...day2.spots.filter((s) => s.id !== toyosaka.id && s.id !== ryugenji.id).map((s) => ({ id: s.id, data: {} })),
          {
            id: ryugenji.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 14, 37)),
              transitDurationMin: 20,
              memo: "清水谷製錬所跡からは歩いて20分ほどです。龍源寺間歩は、石見銀山に数多く残る坑道(間歩)の中で、一般に公開されている代表的なものです。総延長は約600mにおよび、そのうち157mが公開区間として歩くことができます(新しく掘られたトンネルを含めると273m)。内部には、深さ100mにおよぶ排水用の竪坑も見ることができます。坑道の中は足元が平らでない場所や天井が低い場所もあるため、頭上と足元に注意しながら進みましょう。",
            },
          },
          {
            id: toyosaka.id,
            data: {
              visitTime: new Date(Date.UTC(1970, 0, 1, 16, 4)),
              transitDurationMin: 17,
              memo: "龍源寺間歩からは歩いて17分ほどです。豊栄神社は、もとは洞春山長安寺という曹洞宗の寺でした。永禄4年(1561)、毛利元就が山吹城内に自らの木像を安置し、元亀2年(1571)に長安寺を建てて、その木像を移したと伝わります。「洞春」は元就の法号で、元就は生前「洞春公」とも呼ばれていました。明治2年(1869)、朝廷から元就に「豊栄」の神号が贈られたことを受け、翌明治3年(1870)、長安寺から豊栄神社へと改められました。幕末の第二次長州戦争の際には、長州藩(毛利氏)の兵がこの地でご神体の木像に出会い、驚いたと伝えられ、境内の灯籠や鳥居には長州藩士の名が刻まれています。静かに、敬意をもってお参りください。大森から路線バスで、世界遺産センターの駐車場へ戻りましょう。",
            },
          },
        ],
        { tx }
      );
    }, { timeout: 60000 });
  }

  // 2) 説明文
  const itinRow = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itinRow.description?.includes("町並みや五百羅漢とは違う")) {
    await prisma.itinerary.update({
      where: { id: ITIN_ID },
      data: {
        description:
          "石見銀山の銀の積出港として栄え、世界遺産にも登録された温泉津温泉。1日目は仁摩の鳴き砂の浜や中世の港跡から、鄙びた湯治場・温泉津の風情を、2日目は大森の町並みと五百羅漢、龍源寺間歩をめぐる1泊2日です。",
      },
    });
  }

  // 3) 清水谷製錬所跡の表現
  const shimizudani = await findSpotInItinerary(ITIN_ID, { spotName: "清水谷製錬所跡" });
  const shimizudaniRow = await prisma.spot.findUniqueOrThrow({ where: { id: shimizudani.id } });
  if (shimizudaniRow.memo?.includes("現在の同和鉱業")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: shimizudani.id },
      { memo: shimizudaniRow.memo.replace("現在の同和鉱業", "のちの同和鉱業") }
    );
  }

  const allSpots = await prisma.spot.findMany({ where: { dayId: day2.id } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
