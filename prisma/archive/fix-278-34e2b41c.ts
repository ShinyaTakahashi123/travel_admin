/**
 * チェックリスト #278 の修正記録(見直し、ユーザーの新方針への対応)。
 * しおり「温泉津温泉、世界遺産の湯治場を楽しむ石見銀山1泊2日」
 * (34e2b41c-5c39-43ef-917d-aa859b7a4f16)
 *
 * 本番でDay2の終了が15:47と、決まり2(16:30〜17:00)に届いていないことが判明。
 * ユーザーの方針(2026-09-30、「近くに実在の行き先が足りない」は例外にしない)に
 * もとづき、実在するスポットを追加(直接開いたURLで確認):
 *
 * Day2: 清水谷製錬所跡と龍源寺間歩の間に、豊栄神社(新規)を追加。もとは洞春山長安寺
 * という曹洞宗の寺で、永禄4年(1561)に毛利元就が山吹城内に自らの木像を安置し、
 * 元亀2年(1571)に長安寺を建てて木像を移したと伝わる。明治2年(1869)、朝廷から
 * 「豊栄」の神号が贈られ、翌年に神社へ改められた。大田市観光サイト
 * https://www.ginzan-wm.jp/purpose_post/豊栄神社/ 、石見銀山・大森町の地域サイト
 * https://iwamiginzan.jp/townmap/483 の両方を直接開いて確認(日付・経緯とも一致)。
 * Wikipedia記事に情報がなく、画像もないため写真は見送り。配慮の一文を追加。
 *
 * 結果、Day2は8か所09:00〜16:30(窓内)。Day1は変更なし(既に窓内)。
 * itinerary-audit.cjs・prayer-check.cjs 確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-278-34e2b41c.ts
 * (実行済み。新スポットの有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "34e2b41c-5c39-43ef-917d-aa859b7a4f16";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day2 = itin.days[1];

  if (!day2.spots.some((s) => s.name === "豊栄神社")) {
    const shimizudani = day2.spots.find((s) => s.name === "清水谷製錬所跡")!;
    const ryugenji = day2.spots.find((s) => s.name === "龍源寺間歩")!;

    await prisma.$transaction(async (tx) => {
      await setDaySpotOrder(
        day2.id,
        [
          ...day2.spots.filter((s) => s.id !== ryugenji.id).map((s) => ({ id: s.id, data: {} })),
          {
            create: {
              name: "豊栄神社",
              address: "大田市大森町ホ211",
              lat: 35.1093255,
              lng: 132.4383063,
              visitTime: new Date(Date.UTC(1970, 0, 1, 14, 23)),
              stayDurationMin: 40,
              transitMode: "walk",
              transitDurationMin: 6,
              memo: "清水谷製錬所跡からは歩いて6分ほどです。豊栄神社は、もとは洞春山長安寺という曹洞宗の寺でした。永禄4年(1561)、毛利元就が山吹城内に自らの木像を安置し、元亀2年(1571)に長安寺を建てて、その木像を移したと伝わります。「洞春」は元就の法号で、元就は生前「洞春公」とも呼ばれていました。明治2年(1869)、朝廷から元就に「豊栄」の神号が贈られたことを受け、翌明治3年(1870)、長安寺から豊栄神社へと改められました。幕末の第二次長州戦争の際には、長州藩(毛利氏)の兵がこの地でご神体の木像に出会い、驚いたと伝えられ、境内の灯籠や鳥居には長州藩士の名が刻まれています。静かに、敬意をもってお参りください。",
            },
          },
          {
            id: ryugenji.id,
            data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 20)), transitDurationMin: 17 },
          },
        ],
        { tx }
      );
    }, { timeout: 60000 });
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
