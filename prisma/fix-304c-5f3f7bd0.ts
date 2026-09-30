/**
 * チェックリスト #304 の修正記録(企画運営の指摘: 決まりA違反の是正)。
 * しおり「遠刈田温泉の共同浴場めぐり、宮城蔵王の湯治文化を楽しむ日帰り
 * プラン」(5f3f7bd0-2efd-405d-840c-53913d342c3e)
 *
 * 企画運営の指摘: 御釜を100→35分に縮めた分が、三階滝(50→60分)と奥宮
 * (45→70分)に移っており、決まりAの水増しに当たる。三階滝・奥宮を元の
 * 長さに戻し、空いた35分は実在の行き先で埋める。
 *
 * こけし館の裏手から「こけしの道」を歩いた先にある、新地こけし集落の
 * 中心「惟喬神社」(node 2286350118)を追加。木地師の祖・惟喬親王を祀る
 * 神社で、遠刈田こけし発祥の集落の中心。座標はOSM(Nominatim)で確認。
 * 出典(直接開いたURL): https://zaogeopark.jp/top/togattaarea/新地こけし集落-遠刈田エリア-
 * (蔵王ジオパーク推進協議会。「江戸時代から続く木地師の集落で、工芸品・
 * 遠刈田こけしの発祥の地」)
 * 昼食の一言は、こけし館からこちらに移動(11:30〜13:30の範囲内を維持)。
 *
 * あわせて法務の指摘で、駒草平(断崖の上の展望台)に安全の一文を追加。
 * 三階滝の書き出し(旧:こけし館から)が、間に惟喬神社を挟んだことで古く
 * なっていたため、惟喬神社からの移動に合わせて修正(flow-check.cjsで発見)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 * 直した結果、三階滝・奥宮の滞在が元の長さ(50分・45分)に戻っていること、
 * ほかのスポットの滞在が前より延びていないことを確認。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-304c-5f3f7bd0.ts
 * (実行済み。惟喬神社の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITIN_ID = "5f3f7bd0-2efd-405d-840c-53913d342c3e";

async function main() {
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: ITIN_ID, dayNumber: 1 } });
  const spots = await prisma.spot.findMany({ where: { dayId: day1.id }, orderBy: { orderNo: "asc" } });

  if (spots.some((s) => s.name === "惟喬神社")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const kokeshikan = spots.find((s) => s.name === "みやぎ蔵王こけし館")!;
  const sankaidaki = spots.find((s) => s.name === "三階滝")!;
  const komakusadaira = spots.find((s) => s.name === "駒草平")!;
  const okama = spots.find((s) => s.name === "御釜")!;
  const okumiya = spots.find((s) => s.name === "刈田嶺神社(奥宮)")!;

  const kokeshikanNoLunch =
    "壽の湯からは徒歩8分ほどです。遠刈田は、鳴子・土湯と並ぶ日本三大こけし産地の一つといわれ、素朴な表情の「遠刈田こけし」は、江戸時代から湯治客への土産として発展してきました。みやぎ蔵王こけし館は、遠刈田伝統こけしをはじめ、全国の伝統こけしや木地玩具およそ5500点を展示する資料館です。現役のこけし工人によるろくろ挽きの実演を見学できるほか、白木地に絵を描く絵付け体験もできます。自分だけのこけしを作ってみましょう。";

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        ...spots.filter((s) => s.orderNo < kokeshikan.orderNo).map((s) => ({ id: s.id, data: {} })),
        { id: kokeshikan.id, data: { memo: kokeshikanNoLunch } },
        {
          create: {
            name: "惟喬神社",
            address: "宮城県刈田郡蔵王町遠刈田温泉寿町",
            lat: 38.117905,
            lng: 140.569724,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 31)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "こけし館からは徒歩8分ほどです。惟喬神社は、木地師の祖と伝わる惟喬親王を祀る神社で、藩政時代から続く木地師の集落「新地」の中心にあります。遠刈田こけしは、江戸時代末期にこの集落で生まれたと伝えられ、同じ姓を持つ工人の家々が、杉木立の中に集落を形作っています。今も工房が点在し、こけしづくりの様子を見学できるところもあります。静かに、敬意をもってお参りください。周辺には食事処もあるので、ここで昼食をとりましょう。",
          },
        },
        {
          id: sankaidaki.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 16)),
            stayDurationMin: 50,
            transitMode: "car",
            transitDurationMin: 15,
            memo: (sankaidaki.memo ?? "").replace(
              "こけし館からは車で15分ほどです。",
              "惟喬神社からは車で15分ほどです。"
            ),
          },
        },
        {
          id: komakusadaira.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 21)),
            memo:
              "三階滝からは車で15分ほどです。駒草平は、標高およそ1,383mに位置する、蔵王エコーライン沿いの展望スポットです。断崖の上に設けられた展望台からは、不帰の滝や振子滝、奥羽山脈の山並みの向こうに太平洋までも見渡せます。「高山植物の女王」と呼ばれるコマクサの群生地としても知られ、例年6月中旬から7月ごろに花を咲かせます。蔵王エコーラインは11月から4月ごろまで冬季通行止めとなるので、訪れる時期に注意しましょう。断崖の上なので、柵の外に出たり身を乗り出したりしないようにしましょう。",
          },
        },
        {
          id: okama.id,
          data: { visitTime: new Date(Date.UTC(1970, 0, 1, 15, 6)) },
        },
        {
          id: okumiya.id,
          data: {
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 51)),
            stayDurationMin: 45,
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: day1.id } });
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
