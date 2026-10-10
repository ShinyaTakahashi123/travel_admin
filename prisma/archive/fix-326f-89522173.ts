/**
 * #326の続き。企画運営2026-10-01 02:29の指摘 + 法務2026-10-01 02:30の
 * 1点。
 *
 * 企画運営: 時間延ばしでの帳尻合わせをやめ、実在の行き先で埋め直す。
 * - 道の駅90分→45分、西の河原公園140分→96分、西の河原通り108分→35分、
 *   大滝乃湯90分→70分に短縮
 * - 空いた時間は実在スポット3つで埋めた:
 *   D1: 草津片岡鶴太郎美術館(西の河原公園の入口、平成10年開館)
 *   D2: 地蔵の湯(地蔵源泉の共同浴場、足湯併設)・白根神社(草津白根山
 *   信仰、日本武尊を祀る、石楠花の境内。史実は#384(e4b7d41b)の
 *   既存記述で確認済みの内容を踏まえた)
 * - 昼食の一言は道の駅(遅い時間になったため)から地蔵の湯(12:40到着)
 *   に移した
 *
 * 法務: 白旗の湯「草津でも指折りの古い源泉の一つです」→「...一つと
 * されます」(言い切りのヘッジ)
 *
 * 座標の出典(いずれもNominatim名称一致):
 * - 草津片岡鶴太郎美術館: 36.6241021,138.5925225(node 1742251462)
 * - 白根神社: 36.6246746,138.5962603(way 954982172、#384の記載
 *   36.624675,138.59626とほぼ一致)
 * - 地蔵の湯: 36.622754,138.598369(前回fix-326bで座標調査済み)
 *
 * 事実確認(直接開いて確認):
 * - co-trip.jp等: 片岡鶴太郎美術館は西の河原公園の入口、550点のうち
 *   季節ごとに120点を展示、平成10年(1998)開館、草津ホテルの付帯施設
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-326f-89522173.ts
 * (実行済み。現在の値を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "89522173-3b95-4393-a808-5ed5d465d85b";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 2 } });

  const already1 = await prisma.spot.findFirst({ where: { dayId: day1.id, name: "草津片岡鶴太郎美術館" } });
  const already2 = await prisma.spot.findFirst({ where: { dayId: day2.id, name: "地蔵の湯" } });

  const shirahata = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "白旗の湯" } });
  {
    const old = "草津でも指折りの古い源泉の一つです。";
    const next = "草津でも指折りの古い源泉の一つとされます。";
    if (shirahata.memo?.includes(old)) {
      await prisma.spot.update({ where: { id: shirahata.id }, data: { memo: shirahata.memo.replace(old, next) } });
    }
  }

  if (!already1) {
    const netsunoyu2 = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "熱乃湯（湯もみショー）" } });
    const gozanoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "御座之湯" } });
    const yubatake = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "湯畑" } });
    const kousenji = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "光泉寺" } });
    const nettaiken = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "草津熱帯圏" } });
    const nishinokawara = await prisma.spot.findFirstOrThrow({ where: { dayId: day1.id, name: "西の河原公園・露天風呂" } });

    const nettaikenMemo = (nettaiken.memo ?? "").replace(
      "続いては、歩いておよそ19分の西の河原公園・露天風呂へ向かいましょう。",
      "続いては、歩いておよそ19分の草津片岡鶴太郎美術館へ向かいましょう。"
    );

    const nishinokawaraMemo = (nishinokawara.memo ?? "").replace(
      "草津熱帯圏からは歩いておよそ19分です。",
      "片岡鶴太郎美術館からは歩いてすぐです。"
    );

    await setDaySpotOrder(day1.id, [
      { id: netsunoyu2.id, data: {} },
      { id: gozanoyu.id, data: {} },
      { id: yubatake.id, data: {} },
      { id: shirahata.id, data: {} },
      { id: kousenji.id, data: {} },
      { id: nettaiken.id, data: { memo: nettaikenMemo } },
      {
        create: {
          name: "草津片岡鶴太郎美術館",
          address: "群馬県吾妻郡草津町草津479",
          lat: 36.6241021,
          lng: 138.5925225,
          visitTime: new Date(Date.UTC(1970, 0, 1, 14, 12)),
          stayDurationMin: 40,
          transitMode: "walk",
          transitDurationMin: 19,
          memo:
            "草津熱帯圏からは歩いておよそ19分です。草津片岡鶴太郎美術館は、西の河原公園の入口に立つ美術館です。俳優・画家として活躍する片岡鶴太郎の、墨彩画や油絵、陶器などおよそ550点の作品の中から、季節にあわせて120点ほどを展示しています。平成10年(1998)、草津ホテルの付帯施設として開館しました。多彩な表現で描かれた作品の数々を眺めてみましょう。続いては、歩いてすぐの西の河原公園・露天風呂へ向かいましょう。",
        },
      },
      { id: nishinokawara.id, data: { memo: nishinokawaraMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 34)), stayDurationMin: 96, transitMode: "walk", transitDurationMin: 2 } },
    ]);
  }

  if (!already2) {
    const otakinoyu = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "大滝乃湯" } });
    const skijo = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "草津温泉スキー場" } });
    const toshokan = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "温泉図書館" } });
    const michinoeki = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "道の駅 草津運動茶屋公園" } });
    const dori = await prisma.spot.findFirstOrThrow({ where: { dayId: day2.id, name: "西の河原通り" } });

    const toshokanMemo = (toshokan.memo ?? "").replace(
      "続いては、歩いておよそ15分の道の駅 草津運動茶屋公園へ向かいましょう。",
      "続いては、歩いておよそ10分の地蔵の湯へ向かいましょう。"
    );

    const michinoekiMemo = (michinoeki.memo ?? "")
      .replace("温泉図書館からは歩いておよそ15分です。到着したら、まずこのあたりで昼食をとりましょう。", "白根神社からは歩いておよそ20分です。");

    await setDaySpotOrder(day2.id, [
      { id: otakinoyu.id, data: { stayDurationMin: 70 } },
      { id: skijo.id, data: {} },
      { id: toshokan.id, data: { memo: toshokanMemo } },
      {
        create: {
          name: "地蔵の湯",
          address: "群馬県吾妻郡草津町草津",
          lat: 36.622754,
          lng: 138.598369,
          visitTime: new Date(Date.UTC(1970, 0, 1, 12, 40)),
          stayDurationMin: 40,
          transitMode: "walk",
          transitDurationMin: 10,
          memo:
            "温泉図書館からは歩いておよそ10分です(坂の上り下りがあるため、直線距離より時間がかかります)。到着したら、まずこのあたりで昼食をとりましょう。地蔵の湯は、地蔵源泉を使った共同浴場です。湯畑の賑わいから少し離れた、静かな一角にあり、すぐそばには同じ源泉を使った足湯も設けられています。地元の人々が日々の暮らしの中で通う、草津ならではの共同浴場の雰囲気を感じられる場所です。足湯に腰かけて、ひと休みしてみましょう。続いては、歩いておよそ8分の白根神社へ向かいましょう。",
        },
      },
      {
        create: {
          name: "白根神社",
          address: "群馬県吾妻郡草津町草津",
          lat: 36.6246746,
          lng: 138.5962603,
          visitTime: new Date(Date.UTC(1970, 0, 1, 13, 28)),
          stayDurationMin: 70,
          transitMode: "walk",
          transitDurationMin: 8,
          memo:
            "地蔵の湯からは歩いておよそ8分です。白根神社は、温泉街を見下ろす高台に立つ神社です。西にそびえる草津白根山への信仰が始まりと考えられ、今も山の上に奥宮があります。祭神は、草津温泉を開いたという伝説の残る日本武尊で、明治6年(1873)に今の場所へ移されました。広い境内には、たくさんの石楠花が植えられており、季節になると花が境内を彩ります。静かに、敬意をもってお参りください。続いては、歩いておよそ20分の道の駅 草津運動茶屋公園へ向かいましょう。",
        },
      },
      { id: michinoeki.id, data: { memo: michinoekiMemo, visitTime: new Date(Date.UTC(1970, 0, 1, 14, 46)), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 20 } },
      { id: dori.id, data: { stayDurationMin: 35 } },
    ]);
  }

  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
