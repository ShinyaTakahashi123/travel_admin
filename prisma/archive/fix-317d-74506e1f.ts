/**
 * #317の組み直し(企画運営8点・法務4点、2026-09-30 21:00〜21:05 JST)。
 * しおり「熊野三山をすべて巡る、世界遺産・熊野古道じっくり1泊2日」
 * (74506e1f-41b4-444a-9d8d-557e13353862)
 *
 * 企画運営の指摘:
 * 1. 大斎原→湯の峰温泉「歩いて20分」は誤り(実際は4km)。車でおよそ
 *    20分に修正(龍神バス熊野本宮線の16〜19分を参考に、多少の余裕を
 *    見た)。
 * 2. つぼ湯は30分交代制(公式で確認)。90分→40分に短縮し、空いた時間に
 *    東光寺(湯の峰温泉の名の由来となった薬師如来を祀る寺)を追加。
 *    出典: https://www.jisyameguri.com/chiiki/wakayama/toukouji/
 * 3. 乗り物のつじつま: レンタカー(新宮駅で借りる)+熊野古道の徒歩区間、
 *    に統一。1か所目(発心門王子)に朝の行き方(本宮大社前から龍神バスで
 *    およそ15分)、2日目1か所目(神倉神社)にレンタカーの旨を明記。
 * 4. 昼食(2日目): 大門坂到着後にまず昼食をとる案内にし、滞在を60分に
 *    (見学+昼食が実際にとれる長さ)。
 * 5. 那智大社90分→60分に短縮。
 * 6. 「ご案内するのは」(発心門王子・神倉神社)、「ご宿泊いただきます」、
 *    「静かに見学をお楽しみください」を、ふつうの書き方に直した。
 * 7. 大斎原「日本一の規模を誇る大鳥居として知られています」→
 *    「日本一の規模とされる大鳥居です」にヘッジ。
 * 8. Day1の宿の一言を「今夜は湯の峰温泉の宿に泊まります」に。
 *    descriptionも書き直した。
 *
 * 法務の指摘:
 * 1. 発心門王子・伏拝王子に祈りの一文が無かった(王子は名称に神社等の
 *    語を含まずprayer-check.cjsが検知できなかった)。追加。発心門王子に
 *    山道を歩く準備の一文も追加。
 * 2. つぼ湯に入浴時の一文(撮影・長湯)を追加。
 * 3. 大門坂に石段の足元注意を追加。
 * 4. 飛瀧神社に滝そばの足元注意を追加。
 *
 * 時刻の並び:
 * Day1: 09:00発心門王子(15)→伏拝王子(15、徒歩90分)→本宮大社(80、
 *   徒歩80分)→大斎原(45、徒歩15分)→つぼ湯(40、車20分)→東光寺(50、
 *   徒歩すぐ)→16:33終了。
 * Day2: 09:00神倉神社(75)→速玉大社(70、車15分)→大門坂(60、車35分、
 *   昼食込み)→那智大社(60、徒歩35分)→青岸渡寺(30、徒歩3分)→
 *   飛瀧神社(65、徒歩12分)→16:40終了。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-317d-74506e1f.ts
 * (実行済み。東光寺の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "74506e1f-41b4-444a-9d8d-557e13353862";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "東光寺")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const hosshinmon = day1.spots.find((s) => s.name === "発心門王子")!;
  const fushiogami = day1.spots.find((s) => s.name === "伏拝王子")!;
  const hongu = day1.spots.find((s) => s.name === "熊野本宮大社")!;
  const oyunohara = day1.spots.find((s) => s.name === "大斎原")!;
  const tsuboyu = day1.spots.find((s) => s.name === "湯の峰温泉 つぼ湯")!;

  const kamikura = day2.spots.find((s) => s.name === "神倉神社")!;
  const hayatama = day2.spots.find((s) => s.name === "熊野速玉大社")!;
  const daimonzaka = day2.spots.find((s) => s.name === "大門坂")!;
  const nachi = day2.spots.find((s) => s.name === "熊野那智大社")!;
  const hirou = day2.spots.find((s) => s.name === "飛瀧神社(那智の滝)")!;

  // 発心門王子: 口調・レンタカー導入・歩く準備・祈りの一文
  const hosshinmonMemo = (hosshinmon.memo ?? "")
    .replace(
      "この旅は、熊野古道を歩く区間も含めてめぐります。ご案内するのは発心門王子です。",
      "この旅は、新宮駅で借りたレンタカーと、熊野古道を歩く区間を組み合わせてめぐります。本宮大社前からは、龍神バスで発心門王子まで、およそ15分です。発心門王子は、"
    )
    .replace(
      "大きな上り下りの少ない、歩きやすい道です。",
      "大きな上り下りの少ない、歩きやすい道です。歩きやすい靴で、飲み物を持ち、明るいうちに歩き終えるようにしましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: hosshinmon.id }, { memo: hosshinmonMemo });

  // 伏拝王子: 祈りの一文
  const fushiogamiMemo = (fushiogami.memo ?? "").replace(
    "この先に待つ熊野本宮大社への思いを新たにしてみましょう。",
    "この先に待つ熊野本宮大社への思いを新たにしてみましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りください。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: fushiogami.id }, { memo: fushiogamiMemo });

  // 大斎原: ヘッジ・口調・車に変更
  const oyunoharaMemo = (oyunohara.memo ?? "")
    .replace(
      "日本一の規模を誇る大鳥居として知られています。",
      "日本一の規模とされる大鳥居です。"
    )
    .replace(
      "静かに見学をお楽しみください。",
      "静かに見学しましょう。"
    )
    .replace(
      "続いては、歩いておよそ20分の湯の峰温泉・つぼ湯へ向かいましょう。",
      "続いては、車でおよそ20分の湯の峰温泉・つぼ湯へ向かいましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: oyunohara.id }, { memo: oyunoharaMemo });

  // つぼ湯: 滞在短縮・車に変更・入浴の一文・宿の一言を外す・次スポットへの案内
  let tsuboyuMemo = (tsuboyu.memo ?? "").replace(
    "大斎原からは歩いておよそ20分です。",
    "大斎原からは車でおよそ20分です。"
  );
  tsuboyuMemo = tsuboyuMemo.replace(
    "天然の岩風呂で旅の疲れを癒やしましょう。 今夜はこの近くの宿にご宿泊いただきます。",
    "天然の岩風呂で旅の疲れを癒やしましょう。浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。続いては、歩いてすぐの東光寺へ向かいましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: tsuboyu.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 0)),
    stayDurationMin: 40,
    transitDurationMin: 20,
    memo: tsuboyuMemo,
  });

  // 神倉神社: 口調・レンタカー
  const kamikuraMemo = (kamikura.memo ?? "").replace(
    "この旅は、車と徒歩を使い分けてめぐります。ご案内するのは神倉神社です。",
    "この旅は、新宮駅で借りたレンタカーと徒歩を使い分けてめぐります。神倉神社は、"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: kamikura.id }, { memo: kamikuraMemo });

  // 大門坂: 滞在延長・昼食を見学の前に・足元注意
  const daimonzakaMemo = (daimonzaka.memo ?? "")
    .replace(
      "熊野速玉大社からは車でおよそ35分です。大門坂は、",
      "熊野速玉大社からは車でおよそ35分です。到着したら、まずこのあたりで昼食をとりましょう。大門坂は、"
    )
    .replace(
      "夫婦杉と呼ばれる巨木も見どころです。このあたりで、昼食をとりましょう。ここから那智大社まで、",
      "夫婦杉と呼ばれる巨木も見どころです。石段は濡れると滑りやすいので、足元に気をつけましょう。ここから那智大社まで、"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: daimonzaka.id }, {
    stayDurationMin: 60,
    memo: daimonzakaMemo,
  });

  // 那智大社: 滞在短縮・大門坂の滞在延長(20→60分)に伴う時刻カスケード
  await updateSpotInItinerary(ITIN_ID, { spotId: nachi.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 13, 50)),
    stayDurationMin: 60,
  });

  // 青岸渡寺: 時刻カスケード
  await updateSpotInItinerary(ITIN_ID, { spotId: (day2.spots.find((s) => s.name === "青岸渡寺")!).id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 53)),
  });

  // 飛瀧神社: 時刻カスケード・足元注意・帰りの一言
  const hirouMemo = (hirou.memo ?? "")
    .replace(
      "轟音を響かせて流れ落ちる滝を、静かに、敬意をもって眺めてみましょう。見学を終えたら、車で帰りましょう。",
      "轟音を響かせて流れ落ちる滝を、静かに、敬意をもって眺めてみましょう。滝のそばは濡れて滑りやすいので、足元に気をつけましょう。見学を終えたら、車で紀伊勝浦駅方面へ向かい、レンタカーを返却してから帰りましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: hirou.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 15, 35)),
    memo: hirouMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: hosshinmon.id, data: {} },
        { id: fushiogami.id, data: {} },
        { id: hongu.id, data: {} },
        { id: oyunohara.id, data: {} },
        { id: tsuboyu.id, data: {} },
        {
          create: {
            name: "東光寺",
            address: "田辺市本宮町湯峯",
            lat: 33.8288511,
            lng: 135.7577083,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 43)),
            stayDurationMin: 50,
            transitMode: "walk",
            transitDurationMin: 3,
            memo:
              "つぼ湯からは歩いてすぐです。東光寺は、湯の峰温泉の中心部に建つ天台宗の寺院です。最初にお湯が湧き出た場所に、湯の花が自然に積もって薬師如来の姿になったと伝えられ、その姿を本尊「湯峯薬師」として祀ったのが始まりとされています。本尊の胸のあたりから温泉が湧いていたことから「湯の胸温泉」と呼ばれ、それが転じて「湯の峰温泉」の名になったといわれています。静かに、敬意をもってお参りください。今夜は湯の峰温泉の宿に泊まります。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: kamikura.id, data: {} },
        { id: hayatama.id, data: {} },
        { id: daimonzaka.id, data: {} },
        { id: nachi.id, data: {} },
        { id: (day2.spots.find((s) => s.name === "青岸渡寺")!).id, data: {} },
        { id: hirou.id, data: {} },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  const allSpots = await prisma.spot.findMany({ where: { dayId: { in: [day1.id, day2.id] } } });
  for (const s of allSpots) {
    await prisma.spotTransitLeg.deleteMany({ where: { spotId: s.id } });
    if (s.transitMode && s.transitDurationMin != null) {
      await prisma.spotTransitLeg.create({
        data: { spotId: s.id, orderNo: 1, transitMode: s.transitMode, transitDurationMin: s.transitDurationMin },
      });
    }
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "熊野古道を歩いて本宮へ、ゴトビキ岩の神倉神社や熊野古道 大門坂、世界遺産のつぼ湯もめぐる、熊野三山すべてと熊野信仰を深く体感できる本格的な1泊2日プランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
