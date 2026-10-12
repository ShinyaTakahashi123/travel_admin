/**
 * #435 8e7d688e の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 16:30まで、決まり8「バスがある区間はタクシーにしない」、帰りの一言）
 * 1日目: …伊香保露天風呂 →（歩き10分）ハワイ王国公使別邸（新規）15:00〜15:30 →（バス20分）水澤寺 15:50〜16:40
 *   伊香保温泉→水沢観音は、群馬バスの高崎伊香保線などが通るので、タクシーからバスに直す（渋川伊香保温泉観光協会 アクセス、群馬バス 路線図）
 *   ハワイ王国公使別邸は 9:00〜16:30・火曜休館など（渋川市）。本文に時刻・曜日は書かない
 * 本文の出典: 渋川市 https://www.city.shibukawa.lg.jp/kyouiku/000135/000140/p000266.html （ハワイ王国公使別邸）、渋川伊香保温泉観光協会 https://www.ikaho-kankou.com/access/ 、
 *   群馬バス 高崎伊香保線 https://gunbus.co.jp/routebus/pdf/takasakiikahosen.pdf
 * 座標の出典: ハワイ王国公使別邸は OSM に点がないので、地理院の住所検索（渋川市伊香保町伊香保32）36.499046,138.916779
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-435d-8e7d688e.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "8e7d688e-1378-4f2e-a324-47bbc747576c";
const DAY1_ID = "1d7a8ee6-236d-4e25-b389-2994ef3b993b";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY1_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const want = ["石段街", "伊香保関所", "徳冨蘆花記念文学館", "伊香保神社", "河鹿橋", "伊香保露天風呂", "水澤寺"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const mizu = day.spots[6];
  const mizuMemo = rep(
    rep(mizu.memo ?? "", "伊香保温泉からタクシーで、水澤観世音とも呼ばれる水澤寺へ。", "伊香保温泉のバス停から、群馬バスなどで水沢観音へ。水澤観世音とも呼ばれる水澤寺です。"),
    "伊香保温泉さんぽの旅を、ここで締めくくりましょう。", "伊香保温泉さんぽの旅を、ここで締めくくりましょう。帰りは、水沢観音のバス停から伊香保温泉や渋川駅・高崎駅方面へ。最終便の時刻は公式の案内で確かめましょう。");
  const description = rep(it.description ?? "", "源泉「黄金の湯」の露天風呂でひと休み。", "源泉「黄金の湯」の露天風呂でひと休み。駐日ハワイ王国公使の別荘だったハワイ王国公使別邸を訪ね、");
  const description2 = rep(description, "最後は坂東三十三観音の札所・水澤寺へ。", "最後はバスで坂東三十三観音の札所・水澤寺へ。");

  const order = [
    ...day.spots.slice(0, 6).map((s) => ({ id: s.id, data: {} })),
    { create: { name: "ハワイ王国公使別邸", visitTime: t(15, 0), stayDurationMin: 30, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 36.499046, lng: 138.916779, address: "群馬県渋川市伊香保町伊香保32",
      memo: "露天風呂から温泉街を歩いて、ハワイ王国公使別邸へ。ハワイ州がまだ独立国だった時代に、駐日ハワイ王国弁理公使のロバート・W・アルウィンが、夏の別荘として使っていた建物の一部です。平成25年（2013年）に移築・改修され、渋川市の史跡として公開されています。隣のガイダンス施設では、伊香保とハワイ王国のかかわりを紹介しています。休館日は公式の案内で確かめましょう。" } },
    { id: mizu.id, data: { memo: mizuMemo, visitTime: t(15, 50), stayDurationMin: 50, transitMode: "bus", transitDurationMin: 20, transitLine: "群馬バス" } },
  ];
  console.log(`説明文: ${description2}`);
  console.log(`水澤寺: ${mizuMemo.slice(0, 50)}…${mizuMemo.slice(-70)}`);
  console.log("1日目: …露天風呂 13:45〜14:50 →（歩き10分）ハワイ王国公使別邸 15:00〜15:30 →（バス20分）水澤寺 15:50〜16:40");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description: description2 } });
    await setDaySpotOrder(DAY1_ID, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
