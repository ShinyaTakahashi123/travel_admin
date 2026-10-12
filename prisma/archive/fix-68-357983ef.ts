/**
 * #68 357983ef（満願寺・黒川温泉）ユーザー決定「全部直す」の対象。D2(現状09:00〜14:14)
 * に実在スポットを2件追加。滞在は延ばさず(決まりA。杖立温泉のみ、日の最後の
 * 温泉での滞在として黒川温泉90分[本しおりD1]と同水準の90分に。決まり通り単独では
 * 延ばさず、実在の追加で埋める方針は維持)。
 * 坂本善三美術館(実在、小国町黒渕、OSM node 1423801397、開館9:00〜17:00・月曜休)。
 * 下城の大イチョウ(実在、国天然記念物、小国町下城、OSM未掲載のためGSI住所点を使用)。
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder, SpotOrderItem } from "./lib/spot-order";

const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const DAY2_ID = "7d107671-a6f2-44b7-9e87-d7c4b70620a3";

const MICHINOEKI_MEMO_TO_ZENZO =
  "北里柴三郎記念館から車でおよそ10分、平成9年(1997)に開業したとされる道の駅です。1階には小国町の特産品や熊本県内の土産物が並び、2階には情報コーナーや休憩スペースがあります。ここで昼食にしましょう。旅の中休みに、ゆっくりと立ち寄ってみてください。この後は、車でおよそ8分、坂本善三美術館へ向かいましょう。";

const ZENZO_MEMO =
  "道の駅小国ゆうステーションから車でおよそ8分、坂本善三美術館に着きます。小国町出身の抽象画家・坂本善三の作品を紹介する美術館で、「グレーの画家」とも評されるモノトーンを基調とした作品で知られています。明治5年(1872)に建てられた民家を移築し、小国地方特有の「置き屋根」の蔵を模した展示棟・収蔵棟を新築して、平成7年(1995)に開館しました。館内はすべて畳敷きという、全国的にも珍しいつくりです。休館日(毎週月曜日など)があるので、訪れる前に公式サイトで確かめましょう。静かな畳の展示室で、坂本善三の世界をゆっくりと味わってみてください。この後は、車でおよそ4分、鍋ヶ滝へ向かいましょう。";

const NABEGATAKI_MEMO_TO_GINKGO =
  "坂本善三美術館から車でおよそ4分、鍋ヶ滝に着きます。幅約20メートルにわたって扇状に流れ落ちる滝で、裏側から滝を眺められる「裏見の滝」としても知られています。CMのロケ地としても使われたことがあり、緑に囲まれた滝の裏側から差し込む光と、流れ落ちる水のカーテンが織りなす景色は必見です。シーズン中は混雑するため、事前予約が必要な場合があるので、訪れる前に公式サイトで予約してください。駐車場から滝までは階段や急な勾配があるので、足元に気をつけて歩きましょう。滝の裏側や川の対岸に立ち入る際は、自己責任での行動が求められます。この後は、車でおよそ8分、下城の大イチョウへ向かいましょう。";

const GINKGO_MEMO =
  "鍋ヶ滝から車でおよそ8分、下城の大イチョウに着きます。樹齢1000年以上ともいわれる、熊本県内最大級の大イチョウで、幹回りおよそ12m、高さおよそ25mの巨木です。昭和9年(1934)には国の天然記念物に指定されました。母乳の出が良くなるという言い伝えから「ちちこぶさん」の愛称でも親しまれています。10月中旬から11月にかけての黄葉の時期にはライトアップも行われます。近くには下城滝・鍋釜滝もあり、あわせて散策を楽しめます。悠久の時を重ねてきた巨木を、見上げてみてください。この後は、車でおよそ5分、杖立温泉へ向かいましょう。";

const TSUETATE_MEMO_OPENER_FROM = "鍋ヶ滝から車でおよそ10分、";
const TSUETATE_MEMO_OPENER_TO = "下城の大イチョウから車でおよそ5分、";

async function main() {
  const tsuetate = await prisma.spot.findUniqueOrThrow({ where: { id: "89bb6701-2529-4312-8efc-807b1c876927" } });
  if (!tsuetate.memo!.includes(TSUETATE_MEMO_OPENER_FROM)) throw new Error("一致しません(杖立温泉)");
  const tsuetateNewMemo = tsuetate.memo!.split(TSUETATE_MEMO_OPENER_FROM).join(TSUETATE_MEMO_OPENER_TO);

  const day2Spots: SpotOrderItem[] = [
    { id: "dfc5bc54-680a-43af-b9fc-26bef21a68b0", data: {} }, // 満願寺温泉館
    { id: "7a5656e6-0d3b-4c81-a905-23a3288b4216", data: {} }, // 北里柴三郎記念館
    {
      id: "14c3a825-2e00-4c25-b0f0-0d7384a5ee21", // 道の駅小国ゆうステーション
      data: { memo: MICHINOEKI_MEMO_TO_ZENZO, visitTime: t(11, 22), stayDurationMin: 55 },
    },
    {
      create: {
        name: "坂本善三美術館",
        address: "熊本県阿蘇郡小国町黒渕2422",
        lat: 33.127025,
        lng: 131.037025,
        memo: ZENZO_MEMO,
        visitTime: t(12, 25),
        stayDurationMin: 65,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      id: "c0ecb5a4-f142-4ada-b02b-24fcc8b3ab9d", // 鍋ヶ滝
      data: { memo: NABEGATAKI_MEMO_TO_GINKGO, visitTime: t(13, 34), stayDurationMin: 40, transitMode: "car", transitDurationMin: 4 },
    },
    {
      create: {
        name: "下城の大イチョウ",
        address: "熊本県阿蘇郡小国町下城693",
        lat: 33.167187,
        lng: 131.026199,
        memo: GINKGO_MEMO,
        visitTime: t(14, 22),
        stayDurationMin: 35,
        transitMode: "car",
        transitDurationMin: 8,
        transitLine: null,
      },
    },
    {
      id: "89bb6701-2529-4312-8efc-807b1c876927", // 杖立温泉
      data: { memo: tsuetateNewMemo, visitTime: t(15, 2), stayDurationMin: 90, transitMode: "car", transitDurationMin: 5 },
    },
  ];

  const hm = (m: number) => `${String(Math.floor(m / 60)).padStart(2, "0")}:${String(m % 60).padStart(2, "0")}`;
  let prevEnd = -1;
  for (const x of day2Spots) {
    const d = ("id" in x ? x.data : x.create) as Record<string, unknown>;
    const vt = d.visitTime as Date | undefined;
    const st = d.stayDurationMin as number | undefined;
    if (!vt || st == null) continue;
    const s0 = vt.getUTCHours() * 60 + vt.getUTCMinutes();
    console.log(`${hm(s0)}-${hm(s0 + st)}${prevEnd < 0 ? "" : ` (間${s0 - prevEnd}分)`}`);
    prevEnd = s0 + st;
  }

  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(async (tx) => {
    await setDaySpotOrder(DAY2_ID, day2Spots, { tx });
  }, { timeout: 60000 });
  console.log("COMMITTED");
}

main().finally(() => prisma.$disconnect());
