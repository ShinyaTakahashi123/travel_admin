/**
 * チェックリスト #303 の修正記録(ふだんの見直し)。
 * しおり「清水寺と八坂神社、東福寺と伏見稲荷大社をめぐり御朱印をいただく
 * 京都1泊2日」(5bb2acee-21b8-4703-97e7-8ba1d3d4988c)
 *
 * 本番でDay1が3か所09:30〜14:00、Day2が2か所09:30〜12:25のみで、決まり
 * (1日4か所以上・終了16:30〜17:00)に届いていないことが判明。東山・
 * 伏見/京都駅西側の実在の観光地を追加した。
 *
 * Day1(東山): 円山公園・高台寺・知恩院・青蓮院を追加(いずれも京都市公式
 * サイト等で出典を確認)。
 * 出典: https://www.city.kyoto.lg.jp/kensetu/page/0000257049.html (円山公園、
 * 京都市公式。明治19年指定・祇園の夜桜)
 * 出典: https://ja.kyoto.travel/tourism/single01.php?category_id=7&tourism_id=374
 * (青蓮院、京都市公式観光Navi。青蓮坊が起源・楠の天然記念物)
 * 高台寺(北政所ねね・慶長11年開創)・知恩院(三門は元和7年・徳川秀忠公の
 * 命)は、公式サイトの記載が薄かったため、そうだ京都、行こう。等の複数の
 * 旅行メディアで裏取りした一般的に知られた歴史(「と伝わる」でヘッジ)。
 *
 * Day2(伏見・京都駅西側): 東寺・梅小路公園・京都鉄道博物館・二条城を追加。
 * 出典: https://toji.or.jp/smp/guide/gojunoto/ (東寺、公式。五重塔の高さ・
 * 1644年再建)
 * 出典: https://www.city.kyoto.lg.jp/kensetu/page/0000257046.html (梅小路公園、
 * 京都市公式。1995年開園・貨物駅跡地)
 * 出典: https://nijo-jocastle.city.kyoto.lg.jp/introduction/highlights/ (二条城、
 * 世界遺産元離宮二条城公式)
 * 京都鉄道博物館の扇形車庫(1914年建設・2004年重要文化財)は公式サイトが
 * JS描画で本文を確認できなかったため、複数の旅行メディアで裏取り。
 *
 * 座標はすべてNominatim(OSM)で確認。
 *
 * あわせて、八坂神社にあった宿泊の一言(「今夜はこの近くの宿にご宿泊いただ
 * きます」)は、後ろに4か所続く現在の構成では日中に来てしまうため、Day1の
 * 最後になる青蓮院に移し、八坂神社には昼食の案内に差し替えた。伏見稲荷大社
 * 末尾の(旧2か所構成の)締めの一言も、東寺への案内に差し替えた。
 *
 * itinerary-audit.cjs・flow-check.cjs・prayer-check.cjs 確認予定。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-303-5bb2acee.ts
 * (実行済み。円山公園の有無で確認するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "5bb2acee-21b8-4703-97e7-8ba1d3d4988c";

async function main() {
  const itin = await prisma.itinerary.findUniqueOrThrow({
    where: { id: ITIN_ID },
    include: { days: { orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } } },
  });
  const day1 = itin.days[0];
  const day2 = itin.days[1];

  if (day1.spots.some((s) => s.name === "円山公園")) {
    console.log("既に反映済み。何もしません。");
    return;
  }

  const kiyomizu = day1.spots.find((s) => s.name === "清水寺")!;
  const rokuharamitsuji = day1.spots.find((s) => s.name === "六波羅蜜寺")!;
  const yasaka = day1.spots.find((s) => s.name === "八坂神社")!;

  const oldYasakaTail = "静かに、敬意をもってお参りください。今夜はこの近くの宿にご宿泊いただきます。";
  const newYasakaTail =
    "静かに、敬意をもってお参りください。参道の四条通周辺には飲食店が多いので、ここで昼食をとりましょう。午後は円山公園から高台寺・知恩院・青蓮院へと、東山の寺社をめぐります。";
  const yasakaMemo = (yasaka.memo ?? "").includes(oldYasakaTail)
    ? (yasaka.memo ?? "").replace(oldYasakaTail, newYasakaTail)
    : yasaka.memo;

  await updateSpotInItinerary(ITIN_ID, { spotId: yasaka.id }, {
    visitTime: new Date(Date.UTC(1970, 0, 1, 12, 17)),
    memo: yasakaMemo,
  });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day1.id,
      [
        { id: kiyomizu.id, data: {} },
        { id: rokuharamitsuji.id, data: {} },
        { id: yasaka.id, data: {} },
        {
          create: {
            name: "円山公園",
            address: "京都市東山区円山町",
            lat: 35.0037618,
            lng: 135.7814763,
            visitTime: new Date(Date.UTC(1970, 0, 1, 13, 22)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              "八坂神社からは徒歩5分ほどです。円山公園は、明治19年(1886)に指定された、京都市内で最も古い公園です。自然の丘陵を生かした回遊式庭園で、瓢箪池や噴水などが見どころです。中央に立つ枝垂れ桜は「祇園の夜桜」として知られ、現在の木は昭和24年(1949)に植えられた二代目で、桜の時期にはライトアップも行われます。八坂神社や高台寺、知恩院などの寺社に隣接しているので、散策の合間の一休みにも向いています。",
          },
        },
        {
          create: {
            name: "高台寺",
            address: "京都市東山区高台寺下河原町526",
            lat: 35.0003033,
            lng: 135.7805956,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 0)),
            stayDurationMin: 60,
            transitMode: "walk",
            transitDurationMin: 8,
            memo:
              "円山公園からは徒歩8分ほどです。高台寺は、豊臣秀吉の正室・北政所ねねが、夫の菩提を弔うため、慶長11年(1606)に開いたと伝わる禅寺です。創建当時の姿を伝える開山堂や、ねねの墓所である霊屋、茶室の傘亭・時雨亭などは重要文化財に指定されています。庭園は小堀遠州の作と伝わり、モミジと池が織りなす景観が見どころです。歴史に思いをはせながら、静かな境内を歩いてみましょう。",
          },
        },
        {
          create: {
            name: "知恩院",
            address: "京都市東山区林下町400",
            lat: 35.0056216,
            lng: 135.7835389,
            visitTime: new Date(Date.UTC(1970, 0, 1, 15, 12)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 12,
            memo:
              "高台寺からは徒歩12分ほどです。知恩院は、浄土宗の宗祖・法然上人の教えを受け継ぐ、浄土宗の総本山です。入り口にそびえる三門は、元和7年(1621)に徳川2代将軍・秀忠の命で建てられた国宝で、高さおよそ24m、幅およそ50mという、日本最大級の木造の門です。「空・無相・無願」という3つの解脱の境地にちなみ、三門と呼ばれています。境内には御影堂など見応えのある建造物が多いので、拝観時間を公式の案内で確かめてから訪れましょう。静かに、敬意をもってお参りください。",
          },
        },
        {
          create: {
            name: "青蓮院",
            address: "京都市東山区粟田口三条坊町69-1",
            lat: 35.0076015,
            lng: 135.7833999,
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 2)),
            stayDurationMin: 45,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              "知恩院からは徒歩5分ほどです。青蓮院は、天台宗の三門跡寺院の一つで、伝教大師最澄以来の比叡山の住坊「青蓮坊」を起源とします。平安時代末期には「粟田御所」とも呼ばれた格式ある寺院です。門前にそびえる楠の大木は、親鸞聖人のお手植えと伝えられ、京都市の天然記念物に指定されています。相阿弥作と伝わる庭園や、小堀遠州作の霧島の庭など、四季折々の景観も見どころです。静かに、敬意をもってお参りください。今夜はこの近くの宿にご宿泊いただきます。",
          },
        },
      ],
      { tx }
    );
  }, { timeout: 60000 });

  // Day2
  const tofukuji = day2.spots.find((s) => s.name === "東福寺")!;
  const fushimiInari = day2.spots.find((s) => s.name === "伏見稲荷大社")!;

  const oldFushimiTail =
    "清水寺と八坂神社、東福寺と伏見稲荷大社をめぐり御朱印をいただく1泊2日をお楽しみいただけたことでしょう。";
  const newFushimiTail = "参拝のあとは、電車で東寺方面へ向かいましょう。";
  const fushimiMemo = (fushimiInari.memo ?? "").includes(oldFushimiTail)
    ? (fushimiInari.memo ?? "").replace(oldFushimiTail, newFushimiTail)
    : fushimiInari.memo;

  await updateSpotInItinerary(ITIN_ID, { spotId: fushimiInari.id }, { memo: fushimiMemo });

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(
      day2.id,
      [
        { id: tofukuji.id, data: {} },
        { id: fushimiInari.id, data: {} },
        {
          create: {
            name: "東寺",
            address: "京都市南区九条町1",
            lat: 34.9806311,
            lng: 135.7477192,
            visitTime: new Date(Date.UTC(1970, 0, 1, 12, 45)),
            stayDurationMin: 60,
            transitMode: "train",
            transitDurationMin: 20,
            memo:
              "伏見稲荷大社からは電車で20分ほどです。東寺は、延暦15年(796)、桓武天皇による平安京遷都ののち、平安京の守り寺として創建された官寺で、正式には教王護国寺といいます。嵯峨天皇から弘法大師空海に託され、真言密教の根本道場となりました。1994年、世界遺産に登録されています。シンボルの五重塔は、江戸時代の1644年、徳川家光の寄進で再建された5代目で、高さおよそ55mは木造の建造物として日本一の高さを誇ります。塔内には、空海が唐から持ち帰ったと伝わる仏舎利が納められています。新幹線の車窓からも見える、京都のランドマークです。",
          },
        },
        {
          create: {
            name: "梅小路公園",
            address: "京都市下京区観喜寺町56-3",
            lat: 34.9874451,
            lng: 135.7444987,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 0)),
            stayDurationMin: 30,
            transitMode: "walk",
            transitDurationMin: 15,
            memo:
              "東寺からは徒歩15分ほどです。梅小路公園は、かつての梅小路駅貨物ヤードの跡地に、平成7年(1995)に開園した公園です。平安建都1200年を記念して造られた池泉回遊式庭園「朱雀の庭」や、広々とした芝生広場、京都市電の車両が走る「チンチン電車」など、市街地の中心にありながらゆったりと過ごせる見どころがそろっています。",
          },
        },
        {
          create: {
            name: "京都鉄道博物館",
            address: "京都市下京区観喜寺町",
            lat: 34.9864888,
            lng: 135.7426965,
            visitTime: new Date(Date.UTC(1970, 0, 1, 14, 35)),
            stayDurationMin: 75,
            transitMode: "walk",
            transitDurationMin: 5,
            memo:
              "梅小路公園からは徒歩5分ほどです。京都鉄道博物館は、梅小路公園に隣接する、日本最大級の鉄道博物館です。大正3年(1914)に建てられた扇形車庫は、現存する日本最古の鉄筋コンクリート造りの車庫で、国の重要文化財に指定されています。転車台とともに、明治から昭和にかけて活躍した蒸気機関車が動態保存・展示されており、実際に走る「SLスチーム号」に乗ることもできます。鉄道の歴史を、間近で感じてみましょう。",
          },
        },
        {
          create: {
            name: "二条城",
            address: "京都市中京区二条通堀川西入二条城町541",
            lat: 35.0140076,
            lng: 135.7485369,
            visitTime: new Date(Date.UTC(1970, 0, 1, 16, 10)),
            stayDurationMin: 45,
            transitMode: "train",
            transitDurationMin: 20,
            memo:
              "京都鉄道博物館からは電車で20分ほどです。二条城は、慶長8年(1603)、徳川家康が京都御所の守護と将軍上洛の際の宿所として築いた城です。3代将軍・家光の代に、後水尾天皇の行幸を迎えるための大規模な改修が行われました。二の丸御殿は、書院造の代表例として国宝に指定されており、狩野派による豪華な障壁画や、歩くと鳥の声のような音が鳴る「鶯張り」の廊下が見どころです。1994年、世界遺産に登録されています。見学を終えたら、地下鉄やバスで京都駅へ戻りましょう。",
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

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "清水寺・六波羅蜜寺・八坂神社と東山の名所をめぐり、円山公園・高台寺・知恩院・青蓮院へ。2日目は東福寺・伏見稲荷大社から東寺・梅小路公園・京都鉄道博物館・二条城まで、御朱印をいただきながら京都の定番と穴場を巡る1泊2日です。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
