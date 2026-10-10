/**
 * #95 310ab81d 企画運営(2026-10-01 00:55〜00:56)の5点+1点、法務(00:55)の3点
 * への対応。
 *
 * 企画運営:
 * 1) レンタカーの行き方: 表浜海岸(D1-1)に「豊橋駅近くでレンタカーを借り」を
 *    追加(OSRM実測でおよそ18分)。普門寺(D2最後)を「豊橋駅へ戻り、車を
 *    返しましょう」の結びに(OSRM実測でおよそ23分)。
 * 2) 道の駅: あかばねロコステーションは「販売」「サーフショップ」等の
 *    店の紹介を外し、赤羽根海岸・サーフィン大会の話に絞って短く(40→20分)。
 *    クリスタルポルトも「販売」「オリジナル商品」を外し、港とフェリーの
 *    眺めだけの短い内容に(50→25分)。あわせて、宿(伊良湖岬灯台の近く)
 *    からの行き方(車でおよそ4分、OSRM実測)を追加。
 * 3) 岩屋緑地公園の100分は長すぎたため45分に短縮。空いた時間は、実在の
 *    普門寺(開山1300年、市内最多の文化財、天然記念物の大杉)を新規に
 *    追加して埋めた(岩屋緑地から車でおよそ14分、OSRM実測)。
 * 4)+6) 白谷海浜公園: 夏の海水浴中心の書き方から、通年楽しめる書き方に
 *    直し、「8月15日」という日付(決まり9)も「夏には」に変えた。
 * 5) タイトル: 「太平洋を望む豊橋の海1泊2日」に渥美半島を入れた。
 *
 * 法務:
 * A) 表浜海岸・恋路ヶ浜に「波が高く、遊泳が禁止されている場所も多いので、
 *    波打ち際に近づきすぎないようにしましょう。」を追加。
 * B) 表浜海岸のアカウミガメに「産卵の様子を見かけても、近づいたり、
 *    ライトを当てたりしないようにしましょう。」を追加。
 * C) 日出の石門に「岩場は滑りやすいので、足元に気をつけましょう。」を追加。
 *
 * 開いたURL(今回の追加分):
 * - 豊橋駅周辺のレンタカー(複数社が徒歩圏): WebSearch集約(ニッポンレンタカー
 *   公式等)。店名は本文に書かない。
 * - 普門寺(開山1300年・文化財数・大杉・夫婦檜・もみじ祭り): WebSearch集約
 *   (浜松・浜名湖だいすきネット、ウェザーニュース等)
 * - 豊橋駅・普門寺・クリスタルポルト⇔伊良湖岬灯台の車での所要時間:
 *   OSRM実測(http://router.project-osrm.org/route/v1/driving/…)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";
import { findSpotInItinerary } from "./lib/spot-lookup";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const TITLE = "表浜海岸とサーフィン文化、渥美半島と太平洋を望む1泊2日";

const OMOTEHAMA_MEMO =
  "JR豊橋駅の近くでレンタカーを借りて、車でおよそ18分、表浜海岸に着きます。渥美半島の伊良湖岬から浜名湖の近くまで、およそ50キロメートルにわたって続く太平洋沿いの海岸で、「片浜十三里」とも呼ばれています。遠州灘の荒波が生み出す変化に富んだ地形は、国内外から多くのサーファーが集まるサーフィンの盛んな海岸として知られ、過去には世界大会も開催されました。また、絶滅が心配されるアカウミガメの産卵地としても知られ、5月ごろから8月にかけて、砂浜に上陸して産卵する姿が見られることがあります。産卵の様子を見かけても、近づいたり、ライトを当てたりしないようにしましょう。波が高く、遊泳が禁止されている場所も多いので、波打ち際に近づきすぎないようにしましょう。サーフィンを楽しむ人々の姿と、太平洋の雄大な景色が広がっています。この後は、車でおよそ26分、サンテパルクたはらへ向かいましょう。";

const AKABANE_MEMO =
  "太平洋ロングビーチから車でおよそ2分、道の駅あかばねロコステーションに着きます。展望台からは、全国有数のサーフポイントとして知られる赤羽根海岸を望むことができ、サーフィンの世界大会が開かれたこともあります。波と戯れるサーファーたちの姿を、しばし眺めてみてください。この後は、車でおよそ12分、恋路ヶ浜へ向かいましょう。";

const KOIJIGAHAMA_MEMO =
  "道の駅あかばねロコステーションから車でおよそ12分、恋路ヶ浜に着きます。伊良湖岬灯台から日出の石門まで、およそ1キロメートルにわたって続く、太平洋の荒波をうけて弓なりに湾曲する美しい砂浜です。渥美半島の先端らしい、雄大な太平洋の景色を眺めながら歩いてみてください。波が高く、遊泳が禁止されている場所も多いので、波打ち際に近づきすぎないようにしましょう。この後は、車でおよそ4分、日出の石門へ向かいましょう。";

const HIIDENOSEKIMON_MEMO =
  "恋路ヶ浜から車でおよそ4分、日出の石門に着きます。太平洋の荒波の浸食によってできた、中央に洞穴のあいた岩で、沖の石門と岸の石門の2つがあります。日の出の時間帯に見られる美しいシルエットでも知られ、荒々しい岩と青い海が織りなす景色を楽しめます。岩場は滑りやすいので、足元に気をつけましょう。この後は、車でおよそ5分、伊良湖岬灯台へ向かいましょう。";

const CRYSTALPORT_MEMO =
  "旅の2日目は、宿から車でおよそ4分、道の駅伊良湖クリスタルポルトからスタートです。伊良湖岬にあるフェリーターミナルを兼ねた道の駅で、フェリー乗り場からは、伊勢湾を行き交う船の姿や、伊良湖の穏やかな海を眺めることができます。この後は、車でおよそ20分、白谷海浜公園へ向かいましょう。";

const SHIROYA_MEMO =
  "道の駅伊良湖クリスタルポルトから車でおよそ20分、白谷海浜公園に着きます。三河湾国定公園内にある、白い砂浜が広がる公園で、平成9年(1997)には海水浴場が、平成13年(2001)にはトラック(陸上競技場)が整備されました。夏は海水浴でにぎわいますが、それ以外の季節も、海風を感じながら自然豊かな園内をゆっくり散策できます。夏には、地元に伝わる「竜宮まつり」が開かれることでも知られています。この後は、車でおよそ10分、蔵王山展望台へ向かいましょう。";

const IWAYA_MEMO =
  "田原市博物館から車でおよそ20分、岩屋緑地公園に着きます。天平2年(730)、行基がこの地を訪れた際、千手観音像を刻んで岩窟に安置したのが起源と伝えられる岩屋観音があり、東海道を行き交う旅人たちの信仰を集めてきました。岩窟の前では、静かにお参りしましょう。頂上には高さ15メートルの展望台があり、豊橋市街を一望でき、晴れた日には鈴鹿山脈まで望めます。この後は、車でおよそ14分、普門寺へ向かいましょう。";

const FUMONJI_MEMO =
  "岩屋緑地公園から車でおよそ14分、普門寺に着きます。開山から1300年という古刹で、国の重要文化財をはじめ、市内でもっとも多くの文化財を所蔵しています。境内には、樹齢450年ともいわれる市の天然記念物「大杉」や、樹齢250年の「夫婦檜」もあり、豊かな自然に包まれています。11月下旬から12月にかけては、県内でも遅くまで紅葉が楽しめる「もみじ寺」としても知られています。静かに、敬意をもってお参りください。渥美半島と太平洋を望む1泊2日の旅は、ここで終わりです。お帰りは、車でおよそ23分、豊橋駅へ戻り、レンタカーを返しましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '310ab81d%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const omotehama = await findSpotInItinerary(itinId, { spotName: "表浜海岸" });
  const akabane = await findSpotInItinerary(itinId, { spotName: "道の駅あかばねロコステーション" });
  const koiji = await findSpotInItinerary(itinId, { spotName: "恋路ヶ浜" });
  const hiide = await findSpotInItinerary(itinId, { spotName: "日出の石門" });
  const irago = await findSpotInItinerary(itinId, { spotName: "伊良湖岬灯台" });

  const crystal = await findSpotInItinerary(itinId, { spotName: "道の駅伊良湖クリスタルポルト" });
  const shiroya = await findSpotInItinerary(itinId, { spotName: "白谷海浜公園" });
  const zaosan = await findSpotInItinerary(itinId, { spotName: "蔵王山展望台" });
  const tahara = await findSpotInItinerary(itinId, { spotName: "田原市博物館" });
  const iwaya = await findSpotInItinerary(itinId, { spotName: "岩屋緑地公園" });
  const fumonjiExisting = await (async () => {
    try {
      return await findSpotInItinerary(itinId, { spotName: "普門寺" });
    } catch {
      return null;
    }
  })();

  const day1Spots: SpotOrderItem[] = [
    { id: omotehama.id, data: { memo: OMOTEHAMA_MEMO } },
    { id: (await findSpotInItinerary(itinId, { spotName: "サンテパルクたはら" })).id, data: {} },
    { id: (await findSpotInItinerary(itinId, { spotName: "太平洋ロングビーチ" })).id, data: {} },
    { id: akabane.id, data: { memo: AKABANE_MEMO, stayDurationMin: 20 } },
    { id: koiji.id, data: { memo: KOIJIGAHAMA_MEMO, stayDurationMin: 70 } },
    { id: hiide.id, data: { memo: HIIDENOSEKIMON_MEMO } },
    { id: irago.id, data: {} },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: crystal.id, data: { memo: CRYSTALPORT_MEMO, stayDurationMin: 25 } },
    { id: shiroya.id, data: { memo: SHIROYA_MEMO } },
    { id: zaosan.id, data: {} },
    { id: tahara.id, data: { stayDurationMin: 100 } },
    { id: iwaya.id, data: { memo: IWAYA_MEMO, stayDurationMin: 45 } },
    fumonjiExisting
      ? { id: fumonjiExisting.id, data: { memo: FUMONJI_MEMO, stayDurationMin: 60, transitMode: "car", transitDurationMin: 14, transitLine: null } }
      : {
          create: {
            name: "普門寺",
            address: "愛知県豊橋市岩崎町",
            lat: 34.745185,
            lng: 137.472835,
            memo: FUMONJI_MEMO,
            stayDurationMin: 60,
            transitMode: "car",
            transitDurationMin: 14,
            transitLine: null,
          },
        },
  ];

  // visitTimeは09:00/09:30始まりから、stayDurationMin・transitDurationMinの
  // 積み上げで再計算する(手打ちのずれを防ぐため)
  const applyTimes = (spots: SpotOrderItem[], start: { h: number; m: number }) => {
    let cursor = start.h * 60 + start.m;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      d.visitTime = t(Math.floor(cursor / 60), cursor % 60);
      cursor += (d.stayDurationMin as number) ?? 0;
      const nextIdx = spots.indexOf(x) + 1;
      if (nextIdx < spots.length) {
        const nd = ("id" in spots[nextIdx] ? spots[nextIdx].data : (spots[nextIdx] as any).create) as Record<string, unknown>;
        cursor += (nd.transitDurationMin as number) ?? 0;
      }
    }
  };
  // stayDurationMinが指定されていない項目(今回changeなし)は、DBの現在値を
  // 使う必要があるため、まず現在値を読み込んで埋める
  const fillCurrentStay = async (spots: SpotOrderItem[]) => {
    for (const x of spots) {
      if (!("id" in x)) continue;
      if (x.data.stayDurationMin !== undefined && x.data.transitDurationMin !== undefined) continue;
      const cur = await prisma.spot.findUniqueOrThrow({ where: { id: x.id } });
      if (x.data.stayDurationMin === undefined) x.data.stayDurationMin = cur.stayDurationMin ?? 0;
      if (x.data.transitDurationMin === undefined) x.data.transitDurationMin = cur.transitDurationMin ?? 0;
    }
  };
  await fillCurrentStay(day1Spots);
  await fillCurrentStay(day2Spots);
  applyTimes(day1Spots, { h: 9, m: 0 });
  applyTimes(day2Spots, { h: 9, m: 30 });

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const printSchedule = (label: string, spots: SpotOrderItem[]) => {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date;
      const st = d.stayDurationMin as number;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  };
  printSchedule("D1", day1Spots);
  printSchedule("D2", day2Spots);

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { title: TITLE } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
