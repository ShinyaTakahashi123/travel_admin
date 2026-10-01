/**
 * #105 66d185f1 の直し(3回目)。企画運営(2026-10-01 10:11)の指摘:
 * 白糸の滝210分・まかいの牧場150分・ふもとっぱら210分・道の駅朝霧高原100分は
 * いずれも水増し(それぞれ60分くらい・昼食込みで100分くらい・60分くらい・
 * 30分くらいまでが妥当)。D1・D2とも、さらに新しい実在の行き先を足して
 * 空いた時間を埋めた(時間を延ばすのではなく、行き先を足す形)。
 *
 * D1: 白糸の滝75分(ほぼ指摘どおり)。白糸自然公園(新規)・内野神社(新規)を
 * 白糸の滝とまかいの牧場の間に、あさぎり温泉 風の湯(新規、日帰り入浴)を
 * まかいの牧場と富士ミルクランドの間に追加。まかいの牧場は100分(昼食込み、
 * 既存の「ここで昼食にしましょう」の一文はそのまま)。
 * D2: ふもとっぱら60分・道の駅朝霧高原30分。静岡県立朝霧野外活動センター
 * (新規)を朝霧自然公園とふもとっぱらの間に、富士正酒造(新規)・富士山
 * ワイナリー(新規)を道の駅のあとに追加。旅の締めと帰りの一言は富士山
 * ワイナリーに移した。
 *
 * 新規に追加したスポットの座標(OSM生APIで、朝霧高原一帯のbboxから実在の
 * ノード座標を確認):
 * - 白糸自然公園: 35.310149,138.5831419 / 内野神社: 35.3212774,138.5769176
 * - あさぎり温泉 風の湯: 35.3351094,138.584708
 * - 静岡県立朝霧野外活動センター: 35.3847517,138.5871936
 * - 富士正酒造: 35.4114811,138.5910436 / 富士山ワイナリー: 35.4170811,138.5853314
 *
 * 開いたURL(事実確認):
 * - 白糸自然公園(白糸の滝西側・富士山〜駿河湾を望む・ひまわり畑): https://www.city.fujinomiya.lg.jp/1030300000/shisetsu/p000084.html
 * - 内野神社(1971年、内野地区の5社を統合): https://yossy.main.jp/post-17571-17571.html
 * - あさぎり温泉 風の湯(バナジウム天然水・日帰り入浴専用施設): https://www.fujiyama-navi.jp/spots/DffTQ
 * - 富士正酒造(1866年創業・2012年朝霧高原へ移転・富士山にいちばん近い酒蔵とされる): https://www.fujimasa-sake.com/
 * - 富士山ワイナリー(甲州種・ミシュラン星付き店で使用): https://fujinomiya-foodvalley.jp/columns/42191.html
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const SHIRAITO_FROM = "この後は、車でおよそ8分、まかいの牧場へ向かいましょう。";
const SHIRAITO_TO = "この後は、車でおよそ10分、白糸自然公園へ向かいましょう。";

const SHIRAITOPARK_MEMO =
  "白糸の滝から車でおよそ10分、白糸自然公園に着きます。白糸の滝の西側に広がる、富士山から駿河湾までを見渡せる高台の公園です。季節ごとに表情を変える花々が植えられ、夏にはひまわり畑が一面に咲き誇ります。富士山を背に広がる花畑の眺めは、この公園ならではの魅力です。この後は、車でおよそ5分、内野神社へ向かいましょう。";

const UCHINOJINJA_MEMO =
  "白糸自然公園から車でおよそ5分、内野神社に着きます。昭和46年(1971)、内野地区にあった5つの神社を統合してまつられた神社です。伊弉諾尊や天照大御神、菅原道真など、合祀された神社それぞれの祭神が、あわせてまつられています。参拝の際は、敬意を込めて手を合わせましょう。この後は、車でおよそ5分、まかいの牧場へ向かいましょう。";

const MAKAINO_FROM1 = "白糸の滝から車でおよそ8分、まかいの牧場に着きます。";
const MAKAINO_TO1 = "内野神社から車でおよそ5分、まかいの牧場に着きます。";
const MAKAINO_FROM2 = "ここで昼食にしましょう。この後は、車でおよそ3分、富士ミルクランドへ向かいましょう。";
const MAKAINO_TO2 = "ここで昼食にしましょう。この後は、車でおよそ3分、あさぎり温泉 風の湯へ向かいましょう。";

const KAZENOYU_MEMO =
  "まかいの牧場から車でおよそ3分、あさぎり温泉 風の湯に着きます。富士山の地下深くからくみ上げた、バナジウムを含む天然水を使用した日帰り温泉施設です。岩塩を使った岩塩風呂などもあり、牧場めぐりで歩き疲れた体をゆっくりと休められます。この後は、車でおよそ5分、富士ミルクランドへ向かいましょう。";

const MILKLAND_FROM = "まかいの牧場から車でおよそ3分、富士ミルクランドに着きます。";
const MILKLAND_TO = "あさぎり温泉 風の湯から車でおよそ5分、富士ミルクランドに着きます。";

const ASAGIRIKOGEN_FROM = "この後は、車でおよそ6分、朝霧自然公園へ向かいましょう。";
// 朝霧高原の文章は変更なし(確認用マーカーとして残す)

const ARENA_FROM = "この後は、車でおよそ6分、ふもとっぱらへ向かいましょう。";
const ARENA_TO = "この後は、車でおよそ6分、静岡県立朝霧野外活動センターへ向かいましょう。";

const YAGAI_MEMO =
  "朝霧自然公園から車でおよそ6分、静岡県立朝霧野外活動センターに着きます。静岡県が設置する、青少年の野外活動を目的とした施設です。富士山を望む広大な敷地には、キャンプ場や体育館、研修棟などが整い、学校や団体の野外活動・自然体験の場として利用されています。この後は、車でおよそ20分、ふもとっぱらへ向かいましょう。";

const FUMOTOPPARA_FROM = "朝霧自然公園から車でおよそ6分、ふもとっぱらに着きます。";
const FUMOTOPPARA_TO = "静岡県立朝霧野外活動センターから車でおよそ20分、ふもとっぱらに着きます。";

const MICHINOEKI_FROM = "地元の牛乳やチーズ、朝霧高原産の野菜などを扱う直売所や、乳製品を使ったスイーツの店が並び、最後の休憩にぴったりの場所です。高原1泊2日の旅はこれで終わりです。帰りは、新富士駅・富士宮駅方面へ、バスまたは車でお戻りください。";
const MICHINOEKI_TO = "地元の牛乳やチーズ、朝霧高原産の野菜などを扱う直売所や、乳製品を使ったスイーツの店が並んでいます。この後は、車でおよそ5分、富士正酒造へ向かいましょう。";

const FUJIMASA_MEMO =
  "道の駅朝霧高原から車でおよそ5分、富士正酒造に着きます。標高およそ900mの朝霧高原に蔵を構える、「富士山にいちばん近い酒蔵」として知られる酒蔵です。慶応2年(1866)の創業で、平成24年(2012)にこの地へ蔵を移しました。富士山の伏流水を仕込み水に使い、食事に寄り添うすっきりとした味わいの日本酒を醸しています。見学の後には、試飲も楽しめます。この後は、車でおよそ10分、富士山ワイナリーへ向かいましょう。";

const WINERY_MEMO =
  "富士正酒造から車でおよそ10分、富士山ワイナリーに着きます。標高1000mを超える山々に囲まれた高原で、良質なぶどうを育てているワイナリーです。日本古来の品種「甲州」を使ったワインづくりに力を入れており、ミシュランの星を獲得した和食店でも扱われるワインを生み出しています。近年の甲州ワイン人気を後押ししたワイナリーの一つともいわれています。試飲や、ぶどう畑を望む景色を楽しみながら、朝霧高原の牧場とふもとっぱら、富士山を望む高原1泊2日の旅を締めくくりましょう。帰りは、新富士駅・富士宮駅方面へ、バスまたは車でお戻りください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '66d185f1%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const shiraito = await findSpotInItinerary(itinId, { spotName: "白糸の滝" });
  const makaino = await findSpotInItinerary(itinId, { spotName: "まかいの牧場" });
  const milkland = await findSpotInItinerary(itinId, { spotName: "富士ミルクランド" });
  const jinba = await findSpotInItinerary(itinId, { spotName: "陣馬の滝" });

  const asagirikogen = await findSpotInItinerary(itinId, { spotName: "朝霧高原" });
  const arena = await findSpotInItinerary(itinId, { spotName: "朝霧自然公園" });
  const fumotoppara = await findSpotInItinerary(itinId, { spotName: "ふもとっぱら" });
  const michinoeki = await findSpotInItinerary(itinId, { spotName: "道の駅朝霧高原" });

  if (!shiraito.memo!.includes(SHIRAITO_FROM)) throw new Error("白糸の滝の文言が想定外です");
  if (!makaino.memo!.includes(MAKAINO_FROM1) || !makaino.memo!.includes(MAKAINO_FROM2)) throw new Error("まかいの牧場の文言が想定外です");
  if (!milkland.memo!.includes(MILKLAND_FROM)) throw new Error("富士ミルクランドの文言が想定外です");
  if (!arena.memo!.includes(ARENA_FROM)) throw new Error("朝霧自然公園の文言が想定外です");
  if (!fumotoppara.memo!.includes(FUMOTOPPARA_FROM)) throw new Error("ふもとっぱらの文言が想定外です");
  if (!michinoeki.memo!.includes(MICHINOEKI_FROM)) throw new Error("道の駅朝霧高原の文言が想定外です");

  const shiraitoMemo = shiraito.memo!.replace(SHIRAITO_FROM, SHIRAITO_TO);
  const makainoMemo = makaino.memo!.replace(MAKAINO_FROM1, MAKAINO_TO1).replace(MAKAINO_FROM2, MAKAINO_TO2);
  const milklandMemo = milkland.memo!.replace(MILKLAND_FROM, MILKLAND_TO);
  const arenaMemo = arena.memo!.replace(ARENA_FROM, ARENA_TO);
  const fumotopparaMemo = fumotoppara.memo!.replace(FUMOTOPPARA_FROM, FUMOTOPPARA_TO);
  const michinoekiMemo = michinoeki.memo!.replace(MICHINOEKI_FROM, MICHINOEKI_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: shiraito.id, data: { memo: shiraitoMemo, stayDurationMin: 75 } },
    {
      create: {
        name: "白糸自然公園",
        address: "静岡県富士宮市内野",
        lat: 35.310149,
        lng: 138.5831419,
        memo: SHIRAITOPARK_MEMO,
        visitTime: t(10, 25),
        stayDurationMin: 65,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
    {
      create: {
        name: "内野神社",
        address: "静岡県富士宮市内野",
        lat: 35.3212774,
        lng: 138.5769176,
        memo: UCHINOJINJA_MEMO,
        visitTime: t(11, 35),
        stayDurationMin: 25,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    { id: makaino.id, data: { memo: makainoMemo, visitTime: t(12, 5), stayDurationMin: 100, transitMode: "car", transitDurationMin: 5, transitLine: null } },
    {
      create: {
        name: "あさぎり温泉 風の湯",
        address: "静岡県富士宮市上井出",
        lat: 35.3351094,
        lng: 138.584708,
        memo: KAZENOYU_MEMO,
        visitTime: t(13, 48),
        stayDurationMin: 70,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    { id: milkland.id, data: { memo: milklandMemo, visitTime: t(15, 3), transitMode: "car", transitDurationMin: 5, transitLine: null } },
    { id: jinba.id, data: { visitTime: t(16, 3) } },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: asagirikogen.id, data: {} },
    { id: arena.id, data: { memo: arenaMemo } },
    {
      create: {
        name: "静岡県立朝霧野外活動センター",
        address: "静岡県富士宮市猪之頭",
        lat: 35.3847517,
        lng: 138.5871936,
        memo: YAGAI_MEMO,
        visitTime: t(11, 19),
        stayDurationMin: 25,
        transitMode: "car",
        transitDurationMin: 6,
        transitLine: null,
      },
    },
    { id: fumotoppara.id, data: { memo: fumotopparaMemo, visitTime: t(12, 4), stayDurationMin: 60, transitMode: "car", transitDurationMin: 20, transitLine: null } },
    { id: michinoeki.id, data: { memo: michinoekiMemo, visitTime: t(13, 11), stayDurationMin: 30 } },
    {
      create: {
        name: "富士正酒造",
        address: "静岡県富士宮市猪之頭",
        lat: 35.4114811,
        lng: 138.5910436,
        memo: FUJIMASA_MEMO,
        visitTime: t(13, 46),
        stayDurationMin: 70,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "富士山ワイナリー",
        address: "静岡県富士宮市上柚野",
        lat: 35.4170811,
        lng: 138.5853314,
        memo: WINERY_MEMO,
        visitTime: t(15, 6),
        stayDurationMin: 85,
        transitMode: "car",
        transitDurationMin: 10,
        transitLine: null,
      },
    },
  ];

  if (!COMMIT) return console.log("確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
