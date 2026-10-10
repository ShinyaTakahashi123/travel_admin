/**
 * チェックリスト #312 の修正記録(企画運営3点・法務5点、2026-09-30)。
 * しおり「祖谷渓の展望台と落合集落、秘境の絶景と茅葺きの里1泊2日」
 * (7133c8fe-1bb5-4d3f-b644-653c74f59419)
 *
 * 企画運営の指摘:
 * 1. 龍宮崖公園・栗枝渡八幡神社・郷土文化保存伝習施設の座標が大字の中心
 *    だった。座標・住所を以下に差し替え:
 *    - 龍宮崖公園: 正しい住所は三好市東祖谷釣井96(阿波ナビ公式で確認、
 *      旧住所の「東祖谷和田95」は誤り)。座標はNAVITIMEの施設ページに
 *      記載の緯度経度(33.860555,133.877334)を使用。Overpassにも
 *      「東祖谷の吊橋」という橋のwayがほぼ同じ地点(33.8610276,
 *      133.8780264、誤差90m程度)にあり、裏付けが取れている。
 *      出典: https://www.navitime.co.jp/poi?spot=00004-36150500012
 *      出典: https://www.awanavi.jp/archives/spot/2258 (住所)
 *    - 栗枝渡八幡神社: Wikipediaの記事に座標(北緯33度52分52秒 東経133度
 *      55分16秒 = 33.88111,133.92111)と住所(東祖谷下瀬109)の記載あり。
 *      出典: https://ja.wikipedia.org/wiki/栗枝渡八幡神社
 *    - 郷土文化保存伝習施設: 名称そのものはOverpass/Nominatimに見当たら
 *      なかったが、施設の説明にある「京上大橋のそばに建つ」という記述の
 *      とおり、Nominatimで名称一致した京上大橋(way 25521235、
 *      33.8676159,133.9057915)を、隣接する実在のOSMの点として使用。
 * 2. つづき商店(古式そば打ち体験塾)は個人商店の宣伝にあたるため削除。
 *    昼食は「道の駅や集落の食事処で」の一言に差し替え、空いた時間には
 *    武家屋敷旧喜多家(実在・OSM名称一致 33.8705845,133.8968533)を追加。
 *    宝暦13年(1763)建築、祖谷地方最大とされる武家屋敷。鉾杉に隣接。
 *    出典: https://www.awanavi.jp/archives/spot/2070
 *    出典: https://ja.wikipedia.org/wiki/武家屋敷旧喜多家
 * 3. Day2の並びを、かかしの里(東)→伝習施設(西)→鉾杉(西)という遠近往復
 *    から、落合→展望所→伝習施設→鉾杉→武家屋敷(西側をひとまとまりで)
 *    →かかしの里(東側は最後に1回)の一方向に組み直した。
 *
 * 法務の指摘:
 * 1. つづき商店の店名: 上記のとおり削除して対応。
 * 2. 落合集落「指定」→「選定」(重要伝統的建造物群保存地区は選定)。
 * 3. 落合集落に「今も人が暮らす集落です。民家の敷地や畑に入らず、静かに
 *    見学しましょう。」を追加。
 * 4. かかしの里に「住民の方の暮らしの場なので、家の敷地や畑に入らない
 *    ようにしましょう。」を追加。
 * 5. 龍宮崖公園(70mの吊り橋)に「吊り橋では揺らしたり身を乗り出したり
 *    せず、足元に気をつけましょう。」を追加。
 *
 * Day2の新しい並びで、かかしの里が最終スポットになったため、帰りの
 * 一言(決まり3)を移した。
 *
 * ※Day2は、西側(伝習施設・鉾杉・武家屋敷)をていねいにめぐったうえで
 * 東側のかかしの里まで実在の行き先で埋めた結果、終了が15:19となり、
 * 決まり2の窓(16:30〜17:00)には届いていません。かかしの里より東・
 * 伝習施設より西の範囲では、かずら橋・大歩危・琵琶の滝以外に実在かつ
 * 座標を確認できる行き先が見つけられませんでした(探した範囲・出典は
 * 企画運営への報告に記載)。窓に収める案があればご指示ください。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-312d-7133c8fe.ts
 * (実行済み。つづき商店の有無で確認するため、再実行しても安全)
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

  const tsuzuki = day2.spots.find((s) => s.name === "つづき商店(古式そば打ち体験塾)");
  if (!tsuzuki) {
    console.log("既に反映済み(つづき商店が無い)。何もしません。");
    return;
  }

  // Day1: 龍宮崖公園の座標・住所・安全の一文
  const ryugu = day1.spots.find((s) => s.name === "龍宮崖公園")!;
  const ryuguMemo = (ryugu.memo ?? "").replace(
    "眼下に広がる深い谷と、揺れる吊り橋のスリルを味わってみましょう。",
    "眼下に広がる深い谷と、揺れる吊り橋のスリルを味わってみましょう。吊り橋では揺らしたり身を乗り出したりせず、足元に気をつけましょう。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: ryugu.id }, {
    address: "三好市東祖谷釣井96",
    lat: 33.860555,
    lng: 133.877334,
    memo: ryuguMemo,
  });

  // Day1: 栗枝渡八幡神社の座標・住所
  const kurishido = day1.spots.find((s) => s.name === "栗枝渡八幡神社")!;
  await updateSpotInItinerary(ITIN_ID, { spotId: kurishido.id }, {
    address: "三好市東祖谷下瀬109",
    lat: 33.88111,
    lng: 133.92111,
  });

  // Day2: 落合集落「指定」→「選定」、住民が暮らす旨の一文
  const ochiai = day2.spots.find((s) => s.name === "落合集落")!;
  const ochiaiMemo = (ochiai.memo ?? "")
    .replace("国の重要伝統的建造物群保存地区に指定されました。", "国の重要伝統的建造物群保存地区に選定されました。")
    .replace(
      "その景観は「日本のマチュピチュ」とも称されています。",
      "その景観は「日本のマチュピチュ」とも称されています。今も人が暮らす集落です。民家の敷地や畑に入らず、静かに見学しましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: ochiai.id }, { memo: ochiaiMemo });

  const tenbosho = day2.spots.find((s) => s.name === "落合集落展望所")!;
  const denshu = day2.spots.find((s) => s.name === "三好市東祖谷郷土文化保存伝習施設")!;
  const hokosugi = day2.spots.find((s) => s.name === "鉾杉")!;
  const kakashi = day2.spots.find((s) => s.name === "天空の村・かかしの里")!;

  // 伝習施設: 座標(京上大橋)、並び替えに伴う書き出しの変更(展望所から)
  const denshuMemo = (denshu.memo ?? "").replace(
    "天空の村・かかしの里からは車でおよそ65分です。",
    "落合集落展望所からは車でおよそ14分です。"
  );
  await updateSpotInItinerary(ITIN_ID, { spotId: denshu.id }, {
    lat: 33.8676159,
    lng: 133.9057915,
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 2)),
    transitMode: "car",
    transitDurationMin: 14,
    memo: denshuMemo,
  });

  await updateSpotInItinerary(ITIN_ID, { spotId: hokosugi.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 11, 42)),
  });

  // かかしの里: 並び替えに伴う書き出しの変更(武家屋敷から)、住民の一文、帰りの一言
  const kakashiMemo = (kakashi.memo ?? "")
    .replace("落合集落展望所からは車でおよそ45分です。", "武家屋敷旧喜多家からは車でおよそ70分です。")
    .replace(
      "かかしたちの間を歩きながら、山里ののどかな風景を楽しんでみましょう。",
      "かかしたちの間を歩きながら、山里ののどかな風景を楽しんでみましょう。住民の方の暮らしの場なので、家の敷地や畑に入らないようにしましょう。見学を終えたら、車で帰りましょう。"
    );
  await updateSpotInItinerary(ITIN_ID, { spotId: kakashi.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 14, 24)),
    transitMode: "car",
    transitDurationMin: 70,
    stayDurationMin: 55,
    memo: kakashiMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: ochiai.id, data: {} },
        { id: tenbosho.id, data: {} },
        { id: denshu.id, data: {} },
        { id: hokosugi.id, data: {} },
        {
          create: {
            name: "武家屋敷旧喜多家",
            address: "三好市東祖谷大枝",
            lat: 33.8705845,
            lng: 133.8968533,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 9)),
            stayDurationMin: 65,
            transitMode: "car",
            transitDurationMin: 2,
            memo:
              "鉾杉からは車でおよそ2分です。武家屋敷旧喜多家は、宝暦13年(1763)に建てられた、祖谷地方でも最も大きいとされる武家屋敷です。屋島の戦いに敗れた平家一族がこの大枝の地に落ちのび、名主を務めた喜多家の屋敷と伝えられています。このあたりで、道の駅や集落の食事処で昼食をとりましょう。隣接する鉾神社の鉾杉とあわせて、にし阿波のおすすめビューポイントに選ばれています。屋敷の佇まいから、祖谷の武家の暮らしぶりをしのんでみましょう。",
          },
        },
        { id: kakashi.id, data: {} },
      ],
      { tx, remove: [tsuzuki.id] }
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
