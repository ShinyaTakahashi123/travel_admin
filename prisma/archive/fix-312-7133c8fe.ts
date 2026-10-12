/**
 * チェックリスト #312 の修正記録(ふだんの見直し)。
 * しおり「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」
 * (7133c8fe-1bb5-4d3f-b644-653c74f59419)
 *
 * 本番でDay1が1か所10:00〜10:40、Day2が1か所09:30〜10:30のみで、決まり
 * (1日4か所以上・開始8:30〜9:30・終了16:30〜17:00)に届いていないことが
 * 判明。descriptionが「かずら橋や大歩危とは違う」と明記しているため、
 * かずら橋・大歩危・琵琶の滝(かずら橋のすぐそば)・妖怪屋敷/妖怪街道(大歩危
 * の観光クラスター)は避け、西祖谷・東祖谷の実在の別スポットを追加した。
 *
 * Day1(西祖谷、小便小僧展望台を8:30〜9:30の窓に収まるよう09:00に変更):
 * 平家屋敷民俗資料館・道の駅にしいや(昼食)・龍宮崖公園・東祖谷歴史民俗
 * 資料館・栗枝渡八幡神社を追加。
 * 出典: https://r.goope.jp/heike-1408/about (平家屋敷民俗資料館 公式。
 * 堀川内記の伝承・慶応3年建築)
 * 出典: https://miyoshi-city.jp/spot/... (道の駅にしいや。祖谷渓谷の中央)
 * 出典: https://www.navitime.co.jp/poi?spot=00004-36150500012 等(龍宮崖公園。
 * 70mの吊り橋)
 * 出典: https://nishi-awa.jp/course/2494/ (東祖谷観光モデルコース公式。
 * 落合集落展望所・かかしの里の滞在時間の目安、龍宮崖公園の紹介)
 * 出典: https://www.awanavi.jp/archives/spot/2744 (栗枝渡八幡神社。安徳天皇
 * 崩御の伝承・鳥居のない理由。「と伝わる」でヘッジ)
 *
 * Day2(東祖谷、落合集落は09:30のまま):
 * 落合集落展望所・天空の村かかしの里(名頃)・三好市東祖谷郷土文化保存伝習
 * 施設・鉾杉・つづき商店(古式そば打ち体験塾、昼食体験)を追加。
 * 出典: https://miyoshi-city.jp/spot/... (天空の村・かかしの里。300体以上の
 * かかし・名頃地区)
 * 出典: https://www.topics.or.jp/articles/-/1306310 (京上地区、郷土文化保存
 * 伝習施設。生活用具337点)
 * 出典: 徳島県教育委員会等(鉾杉。樹齢800年超・徳島県指定天然記念物・
 * 平国盛が植えたという伝承。「と伝わる」でヘッジ)
 * 出典: https://www.awanavi.jp/archives/spot/1990 (つづき商店 古式そば打ち
 * 体験塾。石臼から始める古式そば打ち・山菜御膳)
 * ※奥祖谷観光周遊モノレールは2021年から休業中のため対象から除外。
 *
 * 座標: 平家屋敷民俗資料館・鉾杉・落合集落展望所はOverpass(OSM)の名称一致
 * ノード、道の駅にしいや・かかしの里はNominatim(OSM)の名称一致ノードを
 * 使用。龍宮崖公園・栗枝渡八幡神社・郷土文化保存伝習施設はOverpass/
 * Nominatimに名称一致がなく(前者2件は複数回タイムアウト)、GSIの住所検索に
 * 番地まで入れたフルの住所で照会したが、いずれも大字までの解像度しか無く、
 * 大字の中心点が返った(番地レベルのデータが無いための挙動で、最初から
 * 大字止まりで検索したものではない)。
 *
 * 移動時間は、祖谷の山道が細く曲がりくねっていることを踏まえ、直線距離に
 * 対して片道1.5〜1.6倍・時速18km程度を目安に見積もった。
 *
 * 小便小僧展望台・落合集落の書き出しを、他のしおりと合わせて「皆様、
 * 本日ご案内するのは」「旅の2日目にご案内するのは」から通常の文体に
 * 直し、この旅は車でめぐる旨を明記(決まり8)。落合集落末尾の締めの一言
 * (旧・唯一のスポットだった名残)は次のスポットへの案内に差し替え、
 * つづき商店の体験のあとに帰路の一言を追加(決まり3)。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312-7133c8fe.ts
 * (実行済み。平家屋敷民俗資料館の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "7133c8fe-1bb5-4d3f-b644-653c74f59419";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "平家屋敷民俗資料館")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const oben = day1.spots.find((s) => s.name === "祖谷渓 小便小僧展望台")!;
  const ochiai = day2.spots.find((s) => s.name === "落合集落")!;

  // Day1: 小便小僧展望台を8:30〜9:30の窓に収まる09:00へ。書き出しを直し、宿の一言を次スポットへの案内に差し替え
  const obenMemo = (oben.memo ?? "")
    .replace("皆様、本日ご案内するのは祖谷渓 小便小僧展望台です。", "この旅は、車でめぐります。最初にご案内するのは、祖谷渓 小便小僧展望台です。")
    .replace("今夜はこの近くの宿にご宿泊いただきます。", "続いては、車でおよそ19分の平家屋敷民俗資料館へ向かいましょう。");
  await updateSpotInItinerary(ITIN_ID, { spotId: oben.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 9, 0)),
    memo: obenMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: oben.id, data: {} },
        {
          create: {
            name: "平家屋敷民俗資料館",
            address: "三好市西祖谷山村東西岡46",
            lat: 33.8827888,
            lng: 133.7808864,
            visitTime: new Date(Date.UTC(1970, 0, 1, 9, 59)),
            stayDurationMin: 70,
            transitMode: "car",
            transitDurationMin: 19,
            memo:
              "小便小僧展望台からは車でおよそ19分です。平家屋敷民俗資料館は、慶応3年(1867)建築の、三好市の重要有形文化財に指定された古民家を利用した資料館です。伝承によれば、平家の都落ちに従い屋島まで逃れた堀川内記が、平家滅亡ののち祖谷に入山し、山野に薬草が豊富なことに感動して秘薬を採取し、医業を営んだのがこの屋敷の始まりとされます。時代を経た建築と庭の老樹に囲まれ、四季折々の表情を見せる館内で、祖谷の歴史に触れてみましょう。",
          },
        },
        {
          create: {
            name: "道の駅にしいや",
            address: "三好市西祖谷山村尾井ノ内348-2",
            lat: 33.8888559,
            lng: 133.8110178,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 24)),
            stayDurationMin: 70,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "平家屋敷民俗資料館からは車でおよそ15分です。道の駅にしいやは、祖谷渓谷のほぼ中央に位置する道の駅です。祖谷そばやそば米雑炊など、地元の味覚を生かした軽食のほか、地元産直の野菜や土産物も並びます。ここで昼食をとり、午後に備えてひと休みしましょう。",
          },
        },
        {
          create: {
            name: "龍宮崖公園",
            address: "三好市東祖谷和田95",
            lat: 33.869637,
            lng: 133.875992,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 12)),
            stayDurationMin: 65,
            transitMode: "car",
            transitDurationMin: 38,
            memo:
              "道の駅にしいやからは車でおよそ38分です。龍宮崖公園は、高さおよそ70mの断崖にかかる吊り橋から、祖谷川を見下ろすことができる公園です。眼下に広がる深い谷と、揺れる吊り橋のスリルを味わってみましょう。コテージやバーベキュー施設も備えた、ひと休みにも向いた場所です。",
          },
        },
        {
          create: {
            name: "東祖谷歴史民俗資料館",
            address: "三好市東祖谷京上",
            lat: 33.8681591,
            lng: 133.906376,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 32)),
            stayDurationMin: 75,
            transitMode: "car",
            transitDurationMin: 15,
            memo:
              "龍宮崖公園からは車でおよそ15分です。東祖谷歴史民俗資料館は、祖谷地域に伝わる平家の落人伝説と、かつての祖谷の暮らしを紹介する資料館です。急峻な山の斜面で暮らしてきた人々が使ってきた民具や衣類などが展示されており、秘境と呼ばれるこの土地の歴史を、じっくりと学ぶことができます。",
          },
        },
        {
          create: {
            name: "栗枝渡八幡神社",
            address: "三好市東祖谷下瀬",
            lat: 33.877316,
            lng: 133.920639,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 56)),
            stayDurationMin: 35,
            transitMode: "car",
            transitDurationMin: 9,
            memo:
              "東祖谷歴史民俗資料館からは車でおよそ9分です。栗枝渡八幡神社は、安徳天皇にまつわる伝承が残る神社です。屋島の戦いに敗れたのち祖谷山に入られた安徳帝は、文治2年(1186)にこの地で崩御されたと伝わり、御遺骨を祀ったことがこの神社の起源とされています。当社が安徳天皇の御陵にあたるとして、鳥居を立てない習わしが今も守られています。静かに、敬意をもってお参りしましょう。今夜はこの近くの宿にご宿泊いただきます。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  // Day2: 落合集落の書き出しを直し、締めの一言を次スポットへの案内に差し替え
  const ochiaiMemo = (ochiai.memo ?? "")
    .replace("旅の2日目にご案内するのは落合集落です。", "この旅は、車でめぐります。旅の2日目、最初にご案内するのは落合集落です。")
    .replace(
      "祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日をお楽しみいただけたことでしょう。",
      "続いては、車でおよそ3分の落合集落展望所から、この集落の全体を見渡してみましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: ochiai.id }, { memo: ochiaiMemo });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: ochiai.id, data: {} },
        {
          create: {
            name: "落合集落展望所",
            address: "三好市東祖谷落合",
            lat: 33.8766388,
            lng: 133.9332271,
            visitTime: new Date(Date.UTC(1970, 0, 1, 10, 33)),
            stayDurationMin: 15,
            transitMode: "car",
            transitDurationMin: 3,
            memo:
              "落合集落からは車でおよそ3分です。落合集落展望所は、祖谷川と支流・落合谷の合流点を見下ろす山の斜面から、先ほど歩いた落合集落の全景を一望できるビューポイントです。急な斜面に民家が連なる独特の景観を、少し離れた場所から眺めてみましょう。",
          },
        },
        {
          create: {
            name: "天空の村・かかしの里",
            address: "三好市東祖谷名頃",
            lat: 33.8553661,
            lng: 134.020489,
            visitTime: new Date(Date.UTC(1970, 0, 1, 11, 33)),
            stayDurationMin: 50,
            transitMode: "car",
            transitDurationMin: 45,
            memo:
              "落合集落展望所からは車でおよそ45分です。天空の村・かかしの里は、東祖谷の名頃地区に300体以上のかかしが置かれた集落です。農作業をしたり、井戸端会議をしたりする様子を表したかかしたちが、家々の軒先や畑のあちこちに佇んでおり、まるで住民のように暮らしの一コマを演じています。かかしたちの間を歩きながら、山里ののどかな風景を楽しんでみましょう。",
          },
        },
        {
          create: {
            name: "三好市東祖谷郷土文化保存伝習施設",
            address: "三好市東祖谷京上14-3",
            lat: 33.870876,
            lng: 133.905273,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 28)),
            stayDurationMin: 35,
            transitMode: "car",
            transitDurationMin: 65,
            memo:
              "天空の村・かかしの里からは車でおよそ65分です。三好市東祖谷郷土文化保存伝習施設は、京上大橋のそばに建つ施設で、祖谷地方で使われてきた農機具や衣類など、暮らしの道具およそ337点が展示されています。急な斜面の多いこの土地で、人々がどのように暮らしてきたかを、実際の道具を通して感じることができます。",
          },
        },
        {
          create: {
            name: "鉾杉",
            address: "三好市東祖谷大枝",
            lat: 33.8701197,
            lng: 133.8967601,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 8)),
            stayDurationMin: 25,
            transitMode: "car",
            transitDurationMin: 5,
            memo:
              "三好市東祖谷郷土文化保存伝習施設からは車でおよそ5分です。鉾杉は、樹齢800年を超えるとされる、徳島県指定天然記念物の杉の巨木です。周囲およそ11m、高さおよそ35mという大きさは、四国でも屈指と伝わります。文治元年(1185)、安徳帝の祖谷入りに供をした平国盛が、平家の再興を願って植えたと伝えられ、「国盛杉」とも呼ばれています。空に向かってまっすぐ伸びる大杉の姿を、見上げてみましょう。",
          },
        },
        {
          create: {
            name: "つづき商店(古式そば打ち体験塾)",
            address: "三好市東祖谷若林84-1",
            lat: 33.860451,
            lng: 133.895248,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 40)),
            stayDurationMin: 110,
            transitMode: "car",
            transitDurationMin: 7,
            memo:
              "鉾杉からは車でおよそ7分です。つづき商店の古式そば打ち体験塾では、石臼でそば粉をひくところから始める、昔ながらの「古式そば打ち」を体験できます。自分で打った祖谷そばに、山菜御膳が添えられた昼食をいただきながら、秘境の味覚をじっくりと楽しんでみましょう。体験を終えたら、車で帰路につきましょう。",
          },
        },
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

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
