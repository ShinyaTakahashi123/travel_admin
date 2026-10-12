/**
 * #91 11ddbe6f（阿嘉島・ニシハマビーチ、静かな離島の絶景ビーチを楽しむ1泊2日）
 * 通常の見直し。既存はD1がニシハマビーチ1か所(10:00〜12:00)・D2が集落展望
 * 1か所(09:30〜10:10)のみで、両日とも4か所未満・開始・終了とも規定外。
 *
 * 【離島の前提】座間味村公式サイトでフェリー時刻表を確認したところ、高速船は
 * 那覇09:00発→阿嘉09:50着、復路は阿嘉17:00頃発→那覇18:10着(この日最終)。
 * 企画運営の案(22:40)により、1か所目を那覇泊港(とまりん)とし、乗船手続き
 * ほどの短い滞在のあと、50分の乗船を移動として扱い、阿嘉島側の観光に続ける。
 * D2は17:00頃の船に間に合うよう、最後の場所から阿嘉港へ戻る形にした。
 * 島内の移動は、高良家住宅の公式アクセス情報に「阿嘉港から自転車で約20分」
 * とあったことから、レンタサイクル(transitMode: "other")を採用。
 *
 * 開いたURL:
 * - フェリー時刻表: https://www.vill.zamami.okinawa.jp/ship/
 * - 高良家住宅(由緒・アクセス): https://www.okinawastory.jp/spot/30000079
 * - 前浜ビーチ・阿嘉港: WebSearch集約(沖縄観光サイト複数)
 * - 阿嘉ビーチ(ウミガメ・アクセス): WebSearch集約(複数のダイビング・観光サイト)
 * - 阿嘉大橋・慶留間橋・外地展望台(位置・内容): WebSearch集約(複数の沖縄観光サイト)
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const DESCRIPTION =
  "「東洋一美しい」とも称される阿嘉島のニシハマビーチ。渡嘉敷島や座間味島より静かな、隠れた名ビーチと、橋でつながる慶留間島・外地島の展望台まで足をのばす1泊2日です。";

const TOMARIN_MEMO =
  "那覇市の泊港旅客ターミナル「とまりん」から、阿嘉島行きの高速船に乗り込みます。乗船手続きを済ませたら出航です。この後は、高速船でおよそ50分、阿嘉島へ向かいましょう。";

const NISHIHAMA_FROM = "那覇泊港から高速船で約70分、阿嘉島のメインビーチ、ニシハマビーチにやってきました。";
const NISHIHAMA_TO = "とまりんから高速船とビーチまでの徒歩で1時間ほど、阿嘉港に着き、阿嘉島のメインビーチ、ニシハマビーチにやってきました。";
const NISHIHAMA_TAIL_FROM = "今日はこのビーチでゆっくり過ごして、明日は阿嘉島の集落を見渡す展望スポットへ向かいましょう。";
const NISHIHAMA_TAIL_TO =
  "泳げる場所や時期は現地の案内で確かめ、サンゴは踏んだり持ち帰ったりしないようにしましょう。この後は、レンタサイクルでおよそ15分、前浜ビーチへ向かいましょう。島の中はレンタサイクルでめぐります。自転車は港の近くで借りられるので、借りられるか事前に確かめておきましょう。坂道や車に気をつけて走りましょう。";

const MAEHAMA_MEMO =
  "ニシハマビーチからレンタサイクルでおよそ15分、阿嘉港のそばにある前浜ビーチに着きます。港からも近く、集落のどこからでも歩いてすぐの、阿嘉島では珍しい遠浅のビーチです。テーブルやベンチもあり、地元の人が夕涼みに訪れることもある、集落の暮らしに寄り添ったビーチです。あわせて、東西に細長い阿嘉島の集落も歩いてみましょう。昼食は、島には店が少ないため、あらかじめ用意しておくと安心です。この後は、レンタサイクルでおよそ10分、阿嘉ビーチへ向かいましょう。";

const AKABEACH_MEMO =
  "前浜ビーチからレンタサイクルでおよそ5分、阿嘉ビーチに着きます。潮の流れが穏やかで、岸からほど近いところでウミガメに出会えることもあるビーチです。サンゴ礁も広がっていて、シュノーケリングを楽しむ人でにぎわいます。ウミガメを見つけても、追いかけて沖へ出過ぎないようにしましょう。泳げる場所や時期は現地の案内で確かめ、サンゴは踏んだり持ち帰ったりしないようにしましょう。夕方は、西向きの浜で夕日を眺めながら過ごすのもよいでしょう。今夜は阿嘉島の宿に泊まります。";

const TENJO_TAIL_FROM = "眼下に広がる島の暮らしと海の景色を、時間をかけてゆっくり眺めながら、慶良間の旅を締めくくってください。";
const TENJO_TAIL_TO =
  "眼下に広がる島の暮らしと海の景色を、時間をかけてゆっくり眺めましょう。この後は、レンタサイクルでおよそ8分、阿嘉大橋へ向かいましょう。";

const AKAOHASHI_MEMO =
  "天城展望台からレンタサイクルでおよそ8分、阿嘉大橋に着きます。阿嘉島と慶留間島を結ぶ橋で、橋の上からは、山の緑と海と空の青、砂浜の白が織りなす景色を見渡せます。橋を渡る風を感じながら、慶良間ブルーと呼ばれる海の色を間近に楽しみましょう。この後は、レンタサイクルでおよそ11分、慶留間島の高良家住宅へ向かいましょう。";

const TAKARAKE_MEMO =
  "阿嘉大橋からレンタサイクルでおよそ11分、慶留間島の高良家住宅に着きます。琉球王府時代の末期、唐へ渡る公用船の船頭職を務めた仲村渠親雲上によって、19世紀後半に建てられたと伝わる旧家です。建築当初は茅葺きでしたが、大正年間に赤瓦葺きへと改められました。屋敷の周りには石灰岩の石垣がめぐらされ、南向きの母屋の前にはヒンプン(目隠しの塀)が建っています。畳敷きの座敷や板敷きの部屋が残る沖縄離島の古民家として、国の重要文化財に指定されています。休館日・見学時間は公式サイトで確かめてから訪れましょう。この後は、レンタサイクルでおよそ3分、慶留間橋へ向かいましょう。";

const GERUMABASHI_MEMO =
  "高良家住宅からレンタサイクルでおよそ3分、慶留間橋に着きます。1989年に完成した、慶留間島と外地島を結ぶ長さ240メートルの橋です。橋の上からは、透き通ったケラマブルーの海と、まるでその中に浮かんでいるかのように見える慶留間小中学校の校舎を望むことができます。慶留間島には、国の天然記念物に指定されているケラマジカが暮らしています。姿を見かけても、近づいたりえさを与えたりしないようにしましょう。この後は、レンタサイクルでおよそ5分、外地展望台へ向かいましょう。";

const FUKAJI_MEMO =
  "慶留間橋からレンタサイクルでおよそ5分、外地島の外地展望台に着きます。2階建ての展望台からは、慶良間空港の滑走路を見下ろせるほか、慶良間諸島の島々とケラマブルーの海を見渡せます。空港は、船が欠航したときや緊急時のヘリポートとしても使われています。ゆっくりと景色を楽しんだら、来た道をレンタサイクルで戻り、阿嘉港へ向かいましょう。阿嘉港からの最終便の時刻は、事前に公式サイトで確かめておきましょう。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '11ddbe6f%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const { findSpotInItinerary } = await import("./lib/spot-lookup");
  const nishihama = await findSpotInItinerary(itinId, { spotName: "ニシハマビーチ" });
  const tenjo = await findSpotInItinerary(itinId, { spotName: "阿嘉島 集落展望" });

  const check = (memo: string | null, from: string, label: string) => {
    if (!memo!.includes(from)) throw new Error(`一致しません(${label})`);
  };
  check(nishihama.memo, NISHIHAMA_FROM, "ニシハマ本文冒頭");
  check(nishihama.memo, NISHIHAMA_TAIL_FROM, "ニシハマ結び");
  check(tenjo.memo, TENJO_TAIL_FROM, "天城展望台結び");

  const nishihamaNewMemo = nishihama
    .memo!.replace(NISHIHAMA_FROM, NISHIHAMA_TO)
    .replace(NISHIHAMA_TAIL_FROM, NISHIHAMA_TAIL_TO);
  const tenjoNewMemo = tenjo.memo!.replace(TENJO_TAIL_FROM, TENJO_TAIL_TO);

  const day1Spots: SpotOrderItem[] = [
    {
      create: {
        name: "泊港旅客ターミナル「とまりん」",
        address: "沖縄県那覇市前島3-25-1",
        lat: 26.2237073,
        lng: 127.6838423,
        memo: TOMARIN_MEMO,
        visitTime: t(8, 50),
        stayDurationMin: 10,
        transitMode: null,
        transitDurationMin: null,
        transitLine: null,
      },
    },
    {
      id: nishihama.id,
      data: { memo: nishihamaNewMemo, transitMode: "other", transitDurationMin: 60, transitLine: null },
    },
    {
      create: {
        name: "前浜ビーチ",
        address: "沖縄県島尻郡座間味村阿嘉",
        lat: 26.1895314,
        lng: 127.2813591,
        memo: MAEHAMA_MEMO,
        visitTime: t(12, 15),
        stayDurationMin: 60,
        transitMode: "other",
        transitDurationMin: 15,
        transitLine: null,
      },
    },
    {
      create: {
        name: "阿嘉ビーチ",
        address: "沖縄県島尻郡座間味村阿嘉",
        lat: 26.1892633,
        lng: 127.2789668,
        memo: AKABEACH_MEMO,
        visitTime: t(13, 20),
        stayDurationMin: 150,
        transitMode: "other",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: tenjo.id, data: { memo: tenjoNewMemo } },
    {
      create: {
        name: "阿嘉大橋",
        address: "沖縄県島尻郡座間味村阿嘉",
        lat: 26.1888949,
        lng: 127.2849617,
        memo: AKAOHASHI_MEMO,
        visitTime: t(10, 18),
        stayDurationMin: 40,
        transitMode: "other",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      create: {
        name: "高良家住宅",
        address: "沖縄県島尻郡座間味村慶留間",
        lat: 26.1770634,
        lng: 127.293007,
        memo: TAKARAKE_MEMO,
        visitTime: t(11, 9),
        stayDurationMin: 60,
        transitMode: "other",
        transitDurationMin: 11,
        transitLine: null,
      },
    },
    {
      create: {
        name: "慶留間橋",
        address: "沖縄県島尻郡座間味村慶留間",
        lat: 26.1755123,
        lng: 127.2932119,
        memo: GERUMABASHI_MEMO,
        visitTime: t(12, 12),
        stayDurationMin: 60,
        transitMode: "other",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "外地展望台",
        address: "沖縄県島尻郡座間味村外地",
        lat: 26.1719897,
        lng: 127.2910617,
        memo: FUKAJI_MEMO,
        visitTime: t(13, 17),
        stayDurationMin: 90,
        transitMode: "other",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  const printSchedule = (label: string, spots: SpotOrderItem[], knownStay: Record<string, number>) => {
    console.log(`--- ${label} ---`);
    let prevEnd = -1;
    for (const x of spots) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = (d.stayDurationMin as number | undefined) ?? ("id" in x ? knownStay[x.id] : undefined);
      if (!vt) { console.log("(visitTime未変更)"); continue; }
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${hm(s0)}${st != null ? `-${hm(s0 + st)}` : ""}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      if (st != null) prevEnd = s0 + st;
    }
  };
  printSchedule("D1", day1Spots, { [nishihama.id]: 120 });
  printSchedule("D2", day2Spots, { [tenjo.id]: 40 });

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: itinId }, data: { description: DESCRIPTION } });
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}
main().finally(() => prisma.$disconnect());
