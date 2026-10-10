/**
 * #74 6dc83721（さいたま新都心）ユーザー決定「全部直す」の対象(現状D1 15:03・
 * D2 3か所12:50、4か所未達)。滞在を延ばさず(決まりA)、実在スポットを追加。
 * D1: 大宮公園のあとに大宮公園小動物園(実在、無料、OSM未掲載のためGSI住所検索の
 * 番地までの点)と埼玉県立歴史と民俗の博物館(実在、同じく高鼻町4、GSI住所検索の
 * 番地までの点)を追加。いずれも大宮公園の本文で既に「小動物園や...博物館も
 * 備わっています」と言及されていた施設。
 * D2: 秋ヶ瀬公園のあとに桜草公園(実在、国指定天然記念物の自生地、OSM way
 * 459329570)・荒川彩湖公園(実在、OSM way 460118506)を追加し4か所以上に。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

const OMIYAKOEN_MEMO =
  "武蔵一宮氷川神社から歩いておよそ8分、氷川神社に隣接する大宮公園に着きます。明治18年(1885)に開設された、県営公園の中でも古い歴史を持つ公園です。ソメイヨシノを中心に1,000本を超える桜が植えられ、桜の名所としても知られています。緑豊かな園内を、のんびりと歩いてみてください。この後は、歩いておよそ3分、大宮公園小動物園へ向かいましょう。";

const ZOO_MEMO =
  "大宮公園から歩いておよそ3分、大宮公園小動物園に着きます。入園無料の小さな動物園で、ツキノワグマやブチハイエナといった猛獣から、シシオザルやケナガクモザルなどの珍しいサルまで、身近に見学できます。公園の中にありながら、多彩な動物たちと出会える人気のスポットです。この後は、歩いておよそ3分、埼玉県立歴史と民俗の博物館へ向かいましょう。";

const REKIMIN_MEMO =
  "大宮公園小動物園から歩いておよそ3分、埼玉県立歴史と民俗の博物館に着きます。埼玉県の歴史・民俗・美術工芸を紹介する人文系の総合博物館で、国宝の太刀・短刀をはじめ、県ゆかりの貴重な資料を数多く収蔵しています。埼玉の暮らしと歴史を、じっくりとたどってみてください。この後は、歩いておよそ13分、大宮盆栽美術館へ向かいましょう。";

const BONSAI_MEMO_OPENER_FROM = "大宮公園から歩いておよそ15分、大宮盆栽美術館に着きます。";
const BONSAI_MEMO_OPENER_TO = "埼玉県立歴史と民俗の博物館から歩いておよそ13分、大宮盆栽美術館に着きます。";

const AKIGASE_MEMO_FROM =
  "近くには食事処もあるので、ここで昼食にするのもおすすめです。さいたま新都心けやきひろばと三橋総合公園、都市型リラックス1泊2日も、ここで無事に終了です。お疲れさまでした。";
const AKIGASE_MEMO_TO =
  "近くには食事処もあるので、ここで昼食にするのもおすすめです。この後は、車でおよそ5分、桜草公園へ向かいましょう。";

const SAKURASOU_MEMO =
  "秋ヶ瀬公園から車でおよそ5分、桜草公園に着きます。国の天然記念物に指定されている、野生のサクラソウの自生地として知られる公園です。かつて荒川流域に広く見られたサクラソウの群生地は、開発によってほとんど姿を消しましたが、この地では今も守り伝えられています。見ごろは4月ごろで、それ以外の季節は静かな草原の景色を楽しめます。花を傷つけないよう、決められた場所から見学してください。この後は、車でおよそ3分、荒川彩湖公園へ向かいましょう。";

const ARAKAWASAIKO_MEMO =
  "桜草公園から車でおよそ3分、荒川彩湖公園に着きます。カマキリの形をした遊具があることから「カマキリ公園」の愛称でも親しまれる、荒川沿いの広々とした公園です。滑り台やブランコなどの遊具のほか、芝生広場や湖を眺められる散策路もあり、家族連れにも人気です。都会の喧騒を離れて、川辺のひとときをゆっくりと過ごしてみてください。けやきひろば、そしてさいたま清河寺温泉から続いた、都市型リラックス1泊2日の旅も、ここで無事に終了です。お疲れさまでした。お帰りは、駐車場に置いた車でご利用ください。";

async function main() {
  const rows: any[] = await prisma.$queryRawUnsafe(`select id::text from itinerary where id::text like '6dc83721%'`);
  const itinId = rows[0].id;
  const day1 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 1 } });
  const day2 = await prisma.day.findFirstOrThrow({ where: { itineraryId: itinId, dayNumber: 2 } });

  const bonsai = await prisma.spot.findUniqueOrThrow({ where: { id: "30a5295f-8daf-4f1d-b7f6-b55bf1b2aedc" } });
  if (!bonsai.memo!.includes(BONSAI_MEMO_OPENER_FROM)) throw new Error("一致しません(大宮盆栽美術館)");
  const bonsaiNewMemo = bonsai.memo!.split(BONSAI_MEMO_OPENER_FROM).join(BONSAI_MEMO_OPENER_TO);

  const akigase = await prisma.spot.findUniqueOrThrow({ where: { id: "eee93d29-1590-4771-9966-93f40b705dfc" } });
  if (!akigase.memo!.includes(AKIGASE_MEMO_FROM)) throw new Error("一致しません(秋ヶ瀬公園)");
  const akigaseNewMemo = akigase.memo!.split(AKIGASE_MEMO_FROM).join(AKIGASE_MEMO_TO);

  const day1Spots: SpotOrderItem[] = [
    { id: "0966c437-8a46-4b53-922d-64aa2ef1c6cf", data: {} }, // けやきひろば
    { id: "06b3b98a-4aff-4ae5-81bc-b40013bb2010", data: {} }, // 武蔵一宮氷川神社
    {
      id: "ac6e20a8-a72e-43e5-8622-c3adfd45d792", // 大宮公園
      data: { memo: OMIYAKOEN_MEMO },
    },
    {
      create: {
        name: "大宮公園小動物園",
        address: "埼玉県さいたま市大宮区高鼻町4",
        lat: 35.921021,
        lng: 139.630447,
        memo: ZOO_MEMO,
        visitTime: t(12, 1),
        stayDurationMin: 40,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      create: {
        name: "埼玉県立歴史と民俗の博物館",
        address: "埼玉県さいたま市大宮区高鼻町4-219",
        lat: 35.921021,
        lng: 139.630447,
        memo: REKIMIN_MEMO,
        visitTime: t(12, 44),
        stayDurationMin: 45,
        transitMode: "walk",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
    {
      id: "30a5295f-8daf-4f1d-b7f6-b55bf1b2aedc", // 大宮盆栽美術館
      data: { memo: bonsaiNewMemo, visitTime: t(13, 42), stayDurationMin: 50, transitMode: "walk", transitDurationMin: 13 },
    },
    { id: "9d78e2da-9bdf-41aa-8f4b-00a2dbf60b8b", data: { visitTime: t(14, 52), stayDurationMin: 100 } }, // 鉄道博物館
  ];

  const day2Spots: SpotOrderItem[] = [
    { id: "e2ccacf9-311d-44e1-bb9b-0916515698a8", data: {} }, // さいたま清河寺温泉
    { id: "e679227f-f532-46d4-a269-2eb1abc31817", data: {} }, // 三橋総合公園
    { id: "eee93d29-1590-4771-9966-93f40b705dfc", data: { memo: akigaseNewMemo } }, // 秋ヶ瀬公園
    {
      create: {
        name: "桜草公園",
        address: "埼玉県さいたま市桜区田島",
        lat: 35.8374754,
        lng: 139.6135105,
        memo: SAKURASOU_MEMO,
        visitTime: t(12, 55),
        stayDurationMin: 110,
        transitMode: "car",
        transitDurationMin: 5,
        transitLine: null,
      },
    },
    {
      create: {
        name: "荒川彩湖公園",
        address: "埼玉県さいたま市桜区大字田島3513-1",
        lat: 35.8349187,
        lng: 139.6222736,
        memo: ARAKAWASAIKO_MEMO,
        visitTime: t(14, 48),
        stayDurationMin: 105,
        transitMode: "car",
        transitDurationMin: 3,
        transitLine: null,
      },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  for (const [label, order] of [["D1", day1Spots], ["D2", day2Spots]] as const) {
    let prevEnd = -1;
    for (const x of order) {
      const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
      const vt = d.visitTime as Date | undefined;
      const st = d.stayDurationMin as number | undefined;
      if (!vt || st == null) continue;
      const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
      console.log(`${label} ${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
      prevEnd = s0 + st;
    }
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(day1.id, day1Spots, { tx });
    await setDaySpotOrder(day2.id, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
