/**
 * 組み直し、218ccf2d（のんほいパーク、動物園・植物園・自然史博物館を一日で巡る複合施設プラン）。
 * (7本目/10・v3)
 *
 * v3の直し(法務の2・3回目の指摘、2026-11-02):
 *  1. 植物園ゾーンの滞在は70分に戻す(決まりAは「縮めた滞在はまず戻す」。70分でも商家駒屋
 *     への到着16:28・終わり16:53は16:30〜17:00に収まる)
 *  2. 昼食のスポット名を「のんほいパーク東門のあたり（昼食）」に変更(企画運営の決定。ほかの
 *     しおりの「〇〇のまわり（昼食）」と同じ形)。展望塔に飲食店が集まることの出典: 公式
 *     (nonhoi.jp/restaurant/、トラットリアチェントロ・コアコスタリカが展望塔1階、ステラ
 *     カフェが最上階)。展望塔の位置の出典: OSM「展望塔」building way160307159
 *     34.7204140,137.4345559(東門から約206m南西。法務の指摘どおり)
 *  3. 入口の分: routed-footは、南口側の自由通路がOSMに入っていないため大きく迂回する
 *     (東門まで18.3分などと出る。法務の指摘)。公式の「JR二川駅の南口から徒歩約6分」
 *     (nonhoi.jp/information/)は、二川駅から東門までの直線距離(約550m)と合うため、東門
 *     までをこの6分とし、東門から1か所目の点「極地動物館」までを routed-foot で測った
 *     9分(0.68km・9.1分)を別に足す形にする
 *
 * (v2までの直し: 動物園ゾーンの点を文にある名前のある地物「極地動物館」(building
 *  way160234318 34.7186027,137.4312205)に変更。帰りの一文(商家駒屋→二川駅、routed-foot
 *  1.3km・17.5分)。昼食のスポットを植物園ゾーンと遊園地ゾーンの間に新規追加(どちらからも
 *  300m前後で、戻りが生まれない)。遊園地ゾーンの滞在は60分のまま(昼食のための延長は
 *  決まりAの水増しに当たるため、別のスポットにした)。動物園「全国でも珍しい公立の複合施設」
 *  に「とされる」のぼかしを追加。商家駒屋の開館時間を公式(komaya.futagawa.org/overview/)で
 *  確認: 9:00〜17:00)
 *
 * 時刻の組み直し:
 *  動物園09:00(100分)→博物館10:48(70分)→植物園12:02(70分)→東門のあたり(昼食)13:17(35分)→
 *  遊園地13:56(60分)→本陣資料館15:23(60分)→商家駒屋16:28(25分)、終わり16:53
 *
 * 点の直し(OSM、Nominatim、v1から変更なし):
 *  植物園ゾーン → leisure=garden way1013611752「豊橋総合動植物公園 植物園」34.7217651,137.4339192
 *  遊園地ゾーン → tourism=theme_park way1013611750「豊橋総合動植物公園 遊園地」34.7196778,137.4353191
 *  自然史博物館 → tourism=museum relation13569829「豊橋市自然史博物館」34.7211172,137.4316788
 * 順番: 動物園→博物館→植物園→(東門のあたり)→遊園地の順にすると戻りがない
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const commit = process.argv.includes("--commit");
const ITIN_ID = "218ccf2d-4a04-4996-a6e4-c96435a0e455";

function t(h: number, m: number) {
  return new Date(Date.UTC(1970, 0, 1, h, m));
}

const ZOO = "のんほいパーク（動物園ゾーン）";
const BOT = "のんほいパーク（植物園ゾーン）";
const MUS = "のんほいパーク（自然史博物館）";
const AMU = "のんほいパーク（遊園地ゾーン）";

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const zoo = await prisma.spot.findFirstOrThrow({ where: { name: ZOO, day: { itineraryId: ITIN_ID } } });
  const bot = await prisma.spot.findFirstOrThrow({ where: { name: BOT, day: { itineraryId: ITIN_ID } } });
  const mus = await prisma.spot.findFirstOrThrow({ where: { name: MUS, day: { itineraryId: ITIN_ID } } });
  const amu = await prisma.spot.findFirstOrThrow({ where: { name: AMU, day: { itineraryId: ITIN_ID } } });

  const checks: { name: string; lat: number; lng: number; got: { lat: unknown; lng: unknown } }[] = [
    { name: ZOO, lat: 34.721111, lng: 137.431944, got: zoo },
    { name: BOT, lat: 34.7198, lng: 137.4335, got: bot },
    { name: MUS, lat: 34.7224, lng: 137.4332, got: mus },
    { name: AMU, lat: 34.723, lng: 137.4305, got: amu },
  ];
  for (const c of checks) {
    if (Math.abs(Number(c.got.lat) - c.lat) > 1e-4 || Math.abs(Number(c.got.lng) - c.lng) > 1e-4) {
      throw new Error(`${c.name}: 座標現在値が期待と不一致(現在 ${c.got.lat},${c.got.lng})`);
    }
  }

  const ZOO_MEMO_OLD =
    "本日は、動物園・植物園・遊園地・自然史博物館が一体となった、全国でも珍しい公立の複合施設、のんほいパーク(豊橋総合動植物公園)からスタートです。まずは動物園ゾーンから見学しましょう。およそ40haの広大な敷地に、およそ140種類の動物を飼育しており、野生に近い環境を目指したアフリカ園やオーストラリア園、サルたちを間近に観察できるサルデッキなどが見どころです。「極地動物館」では、水中を泳ぐペンギンやアザラシ、目の前でホッキョクグマが水に飛び込む姿を、水族館さながらの水中窓から観察でき、人気を集めています。アジアゾウのエリアには、およそ6000平方メートルという国内最大級ともいわれる放飼場があり、群れで暮らすゾウたちがのびのびと過ごす姿を見ることができます。広い園内なので、時間に余裕を持ってゆっくり見学しましょう。見学を終えたら、歩いて植物園ゾーンへ向かいましょう。";
  const ZOO_MEMO_NEW =
    "JR二川駅の南口から歩いておよそ6分で東門に着き、園内を歩いておよそ9分、動物園ゾーンに着きます。本日は、動物園・植物園・遊園地・自然史博物館が一体となった、全国でも珍しい公立の複合施設とされる、のんほいパーク(豊橋総合動植物公園)を巡る一日です。まずは動物園ゾーンから見学しましょう。およそ40haの広大な敷地に、およそ140種類の動物を飼育しており、野生に近い環境を目指したアフリカ園やオーストラリア園、サルたちを間近に観察できるサルデッキなどが見どころです。「極地動物館」では、水中を泳ぐペンギンやアザラシ、目の前でホッキョクグマが水に飛び込む姿を、水族館さながらの水中窓から観察できます。アジアゾウのエリアには、およそ6000平方メートルという国内最大級ともいわれる放飼場があり、群れで暮らすゾウたちがのびのびと過ごす姿を見ることができます。広い園内なので、時間に余裕を持ってゆっくり見学しましょう。見学を終えたら、歩いておよそ8分、自然史博物館へ向かいましょう。";
  if (zoo.memo !== ZOO_MEMO_OLD) throw new Error("動物園ゾーン: memo現在値が期待と不一致");

  const MUS_MEMO_OLD =
    "植物園ゾーンを見学したら、歩いて自然史博物館へ向かいましょう。生物の進化と、郷土・東三河の自然をテーマにした博物館で、恐竜をはじめとする化石や、郷土の動植物の標本など、4200点を超える資料が展示されています。大きな恐竜の骨格標本は、子どもから大人まで楽しめる見どころです。見学を終えたら、歩いて遊園地ゾーンへ向かいましょう。";
  const MUS_MEMO_NEW =
    "動物園ゾーンから歩いておよそ8分、自然史博物館に着きます。生物の進化と、郷土・東三河の自然をテーマにした博物館で、恐竜をはじめとする化石や、郷土の動植物の標本など、4200点を超える資料が展示されています。大きな恐竜の骨格標本は、子どもから大人まで楽しめる見どころです。見学を終えたら、歩いておよそ4分、植物園ゾーンへ向かいましょう。";
  if (mus.memo !== MUS_MEMO_OLD) throw new Error("自然史博物館: memo現在値が期待と不一致");

  const BOT_MEMO_OLD =
    "動物園ゾーンを見学したら、歩いて植物園ゾーンへ向かいましょう。大温室では、熱帯・亜熱帯の色とりどりの植物を観察できます。平成8年(1996)の開園を記念して整備された「モネの庭」では、画家クロード・モネのフランスの庭園から譲り受けたスイレンやシダレヤナギを見ることができます。四季折々の花壇や庭園もあわせて、緑豊かなひとときを楽しみましょう。見学を終えたら、歩いて自然史博物館へ向かいましょう。";
  const BOT_MEMO_NEW =
    "自然史博物館から歩いておよそ4分、植物園ゾーンに着きます。大温室では、熱帯・亜熱帯の色とりどりの植物を観察できます。平成8年(1996)の開園を記念して整備された「モネの庭」では、画家クロード・モネのフランスの庭園から譲り受けたスイレンやシダレヤナギを見ることができます。四季折々の花壇や庭園もあわせて、緑豊かなひとときを楽しみましょう。見学を終えたら、歩いておよそ5分、のんほいパーク東門のあたりへ向かいましょう。";
  if (bot.memo !== BOT_MEMO_OLD) throw new Error("植物園ゾーン: memo現在値が期待と不一致");

  const HIGASHIMON_MEMO_NEW =
    "植物園ゾーンから歩いておよそ5分、のんほいパーク東門のあたりに着きます。東門を入ったところに立つ展望塔に、飲食店が集まっています。ここで昼食にしましょう。昼食を終えたら、歩いておよそ4分、遊園地ゾーンへ向かいましょう。";

  const AMU_MEMO_OLD =
    "自然史博物館を見学したら、歩いて遊園地ゾーンへ向かいましょう。大観覧車をはじめ、家族で楽しめる乗り物がそろっています。観覧車からは、動物園や植物園の緑あふれる敷地を上から見渡すこともできます。動物・植物・化石・遊びと、盛りだくさんの複合施設を、一日かけてゆっくり楽しみましょう。のんほいパークを巡る本日の旅は、これで終わりです。";
  const AMU_MEMO_NEW =
    "のんほいパーク東門のあたりから歩いておよそ4分、遊園地ゾーンに着きます。大観覧車をはじめ、家族で楽しめる乗り物がそろっています。観覧車からは、動物園や植物園の緑あふれる敷地を上から見渡すこともできます。動物・植物・化石・遊びと、盛りだくさんの複合施設を、ゆっくり楽しみましょう。見学を終えたら、歩いておよそ27分、二川宿本陣資料館へ向かいましょう。";
  if (amu.memo !== AMU_MEMO_OLD) throw new Error("遊園地ゾーン: memo現在値が期待と不一致");

  const HONJIN_MEMO_NEW =
    "のんほいパーク(遊園地ゾーン)から歩いておよそ27分、二川宿本陣資料館に着きます。文化4年(1807)から60年ほど、東海道・二川宿の本陣を務めた馬場家の屋敷を保存・公開している資料館です。明治以降に取り壊されていた書院棟などを復原し、大名が休んだ上段の間を含む本陣の建物全体を見学できます。隣接する土蔵・主屋・玄関棟・表門も、馬場家の遺構として残されています。資料館本館では、東海道・二川宿・本陣の3つのテーマで、宿場の歴史や当時の旅のようすを紹介しています。見学を終えたら、歩いておよそ5分、商家駒屋へ向かいましょう。";

  const KOMAYA_MEMO_NEW =
    "二川宿本陣資料館から歩いておよそ5分、旅の最後は商家駒屋です。入館の締め切りの時刻に気をつけましょう。旧東海道・二川宿で米穀商と質屋を営んだ田村家の屋敷で、問屋役や名主など宿村役人も務めました。江戸時代から大正時代にかけて建てられた主屋・離れ屋敷・土蔵など8棟からなり、当時の商家の形式をよく残しているとされています。豊橋市が江戸から大正期の姿に復原し、茶屋や離れ座敷、中庭などを見ることができます。帰りは、歩いておよそ18分の二川駅から、電車に乗りましょう。のんほいパーク、動物園・植物園・遊園地・自然史博物館を一日で巡る複合施設プランは、これで終わりです。";

  const DESC_OLD = "動物園・植物園・遊園地・自然史博物館が集まる、豊橋総合動植物公園「のんほいパーク」。吉田城跡とは違う、家族で楽しむプランです。";
  const DESC_NEW = "動物園・植物園・遊園地・自然史博物館が集まる、豊橋総合動植物公園「のんほいパーク」のあと、二川宿本陣資料館・商家駒屋を歩いて巡ります。吉田城跡とは違う、家族で楽しむプランです。";
  const itin = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITIN_ID } });
  if (itin.description !== DESC_OLD) throw new Error("description現在値が期待と不一致");

  console.log(`\n[動物園ゾーン]\n旧: ${ZOO_MEMO_OLD}\n新: ${ZOO_MEMO_NEW}`);
  console.log(`\n[自然史博物館(2番目)]\n旧: ${MUS_MEMO_OLD}\n新: ${MUS_MEMO_NEW}`);
  console.log(`\n[植物園ゾーン(3番目)]\n旧: ${BOT_MEMO_OLD}\n新: ${BOT_MEMO_NEW}`);
  console.log(`\n[のんほいパーク東門のあたり（昼食）(新規・4番目)]\n新: ${HIGASHIMON_MEMO_NEW}`);
  console.log(`\n[遊園地ゾーン(5番目)]\n旧: ${AMU_MEMO_OLD}\n新: ${AMU_MEMO_NEW}`);
  console.log(`\n[二川宿本陣資料館(新規・6番目)]\n新: ${HONJIN_MEMO_NEW}`);
  console.log(`\n[商家駒屋(新規・最後)]\n新: ${KOMAYA_MEMO_NEW}`);
  console.log(`\n[説明文]\n旧: ${DESC_OLD}\n新: ${DESC_NEW}`);

  console.log("\n[書き込む内容(点・時刻・滞在・区間)、1か所ずつ]");
  console.log(`動物園ゾーン(極地動物館の点): 座標34.7186027,137.4312205 / 時刻09:30→09:00 / 滞在190→100分`);
  console.log(`自然史博物館: 座標34.7211172,137.4316788 / 順番3→2 / 時刻14:10→10:48 / 滞在70分(変更なし) / incoming walk8分`);
  console.log(`植物園ゾーン: 座標34.7217651,137.4339192 / 順番2→3 / 時刻12:50→12:02 / 滞在70分(変更なし) / incoming walk4分`);
  console.log(`のんほいパーク東門のあたり（昼食）(新規): 座標34.7212101,137.4365872 / 時刻13:17 / 滞在35分 / incoming walk5分`);
  console.log(`遊園地ゾーン: 座標変更なし / 時刻15:30→13:56 / 滞在95→60分(もとに戻す) / incoming walk4分`);
  console.log(`二川宿本陣資料館(新規): 座標34.723261,137.449891 / 時刻16:21→15:23 / 滞在60分(変更なし) / incoming walk27分`);
  console.log(`商家駒屋(新規・最後): 座標34.723254,137.45257 / 時刻16:28 / 滞在25分(変更なし) / incoming walk5分`);
  console.log("終わり: 16:28+25分=16:53（日帰りの発車16:30〜17:00の中）。商家駒屋の到着16:28は入館締切16:30の2分前。帰りは歩いておよそ18分の二川駅");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  const dayId = zoo.dayId;

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITIN_ID }, data: { description: DESC_NEW } });
    await setDaySpotOrder(
      dayId,
      [
        {
          id: zoo.id,
          data: {
            memo: ZOO_MEMO_NEW,
            lat: 34.7186027,
            lng: 137.4312205,
            visitTime: t(9, 0),
            stayDurationMin: 100,
          },
        },
        {
          id: mus.id,
          data: {
            memo: MUS_MEMO_NEW,
            lat: 34.7211172,
            lng: 137.4316788,
            visitTime: t(10, 48),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 8 }] },
          },
        },
        {
          id: bot.id,
          data: {
            memo: BOT_MEMO_NEW,
            lat: 34.7217651,
            lng: 137.4339192,
            visitTime: t(12, 2),
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
        {
          create: {
            name: "のんほいパーク東門のあたり（昼食）",
            lat: 34.7212101,
            lng: 137.4365872,
            memo: HIGASHIMON_MEMO_NEW,
            visitTime: t(13, 17),
            stayDurationMin: 35,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
        {
          id: amu.id,
          data: {
            memo: AMU_MEMO_NEW,
            visitTime: t(13, 56),
            stayDurationMin: 60,
            transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 4 }] },
          },
        },
        {
          create: {
            name: "二川宿本陣資料館",
            lat: 34.723261,
            lng: 137.449891,
            memo: HONJIN_MEMO_NEW,
            visitTime: t(15, 23),
            stayDurationMin: 60,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 27 }] },
          },
        },
        {
          create: {
            name: "商家駒屋",
            lat: 34.723254,
            lng: 137.45257,
            memo: KOMAYA_MEMO_NEW,
            visitTime: t(16, 28),
            stayDurationMin: 25,
            transitLegs: { create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 5 }] },
          },
        },
      ],
      { remove: [], tx }
    );
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
