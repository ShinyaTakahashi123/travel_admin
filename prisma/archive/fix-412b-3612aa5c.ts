/**
 * #412 3612aa5c の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 決まり2「最後の行き先を出るのが16:30〜17:00」、決まり8「バスがある区間はバス」、帰りの一言）
 * 1日目: 竹瓦温泉 → 別府タワー →（タクシー）竹細工伝統産業会館 →（タクシー）鉄輪温泉の街歩き（昼食）→ 鉄輪むし湯（新規）→ 湯けむり展望台 →（亀の井バス）みょうばん湯の里（7か所 09:00〜16:30）
 *   竹細工伝産会館前を通る亀の井バス25番は平日のみ（亀の井バス 公式）なので、その2区間はタクシーのままとし、理由を本文に書く
 *   湯けむり展望台 → みょうばん湯の里は、鉄輪から亀の井バス5番・41番で地蔵湯前（徒歩約3分）があるので、バスに直す
 *   みょうばん湯の里は 9:00〜18:00・年中無休（別府市観光協会）
 * 本文の出典: 別府市観光協会 https://www.beppu-tourism.com/onsen/kannawa-mushiyu/ （鉄輪むし湯）・/spot/myoban-yunosato/ 、亀の井バス https://kamenoibus.com/scheduled_howto/ 、
 *   みょうばん湯の里 アクセス（5番・41番、地蔵湯前 徒歩3分）
 * 座標の出典: OSM（鉄輪むし湯 way 427361851 33.316377,131.478066）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-412b-3612aa5c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "3612aa5c-ab57-4826-8223-bff49f4d8f23";
const DAY1_ID = "ff773043-95db-4a9c-8e41-a8e1b11c209f";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const BATH = "浴場ではほかの入浴客を撮らず、施設の決まりに従いましょう。長湯を避けて、こまめに水分をとりましょう。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY1_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const want = ["竹瓦温泉", "別府タワー", "別府市竹細工伝統産業会館", "鉄輪温泉の街歩き（昼食）", "湯けむり展望台", "みょうばん湯の里"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const [take, tower, bamboo, kannawa, tenbo, myoban] = day.spots;

  const bambooMemo = rep(bamboo.memo ?? "", "別府タワーから車で約10分。", "別府タワーからタクシーで約10分（竹細工伝産会館前を通るバスは平日だけのため）。");
  const kannawaMemo = rep(kannawa.memo ?? "", "竹細工伝統産業会館から車で約15分。", "竹細工伝統産業会館からタクシーで約15分（バスは平日だけのため）。");
  const tenboMemo = rep(tenbo.memo ?? "", "鉄輪の街から歩いて約10分。", "むし湯から歩いて約10分。");
  const myobanMemo = rep(myoban.memo ?? "", "湯けむり展望台から車で約10分。", "鉄輪のバス停へ戻り、亀の井バス（5番・41番）で地蔵湯前へ。歩いて約3分。")
    + "別府の温泉街をめぐる旅を、ここで締めくくりましょう。帰りは、バスで別府駅へ戻ります。";
  const description = rep(it.description ?? "", "鉄輪の温泉街で地獄蒸しの昼食を。", "鉄輪の温泉街で地獄蒸しの昼食を。石菖を敷いた鉄輪むし湯で温まり、");

  const order = [
    { id: take.id, data: {} },
    { id: tower.id, data: {} },
    { id: bamboo.id, data: { memo: bambooMemo } },
    { id: kannawa.id, data: { memo: kannawaMemo, stayDurationMin: 85 } },
    { create: { name: "鉄輪むし湯", visitTime: t(13, 35), stayDurationMin: 45, transitMode: "walk", transitDurationMin: 5, transitLine: null, lat: 33.316377, lng: 131.478066, address: "大分県別府市鉄輪",
      memo: "鉄輪の街の中にある鉄輪むし湯へ。鎌倉時代の建治2年（1276年）に一遍上人が創設したといわれる蒸し湯で、約8畳の石室に、清流沿いにしか群生しない石菖（セキショウ）という草が敷き詰められ、その上に横になって温まります。蒸し湯の利用は約8分で一度声をかけてもらえます。入口には足だけを蒸す「足蒸し」もあります。" + BATH } },
    { id: tenbo.id, data: { memo: tenboMemo, visitTime: t(14, 30), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 10 } },
    { id: myoban.id, data: { memo: myobanMemo, visitTime: t(15, 20), stayDurationMin: 70, transitMode: "bus", transitDurationMin: 25, transitLine: "亀の井バス" } },
  ];
  console.log(`説明文: ${description}`);
  for (const [n, m] of [["竹細工", bambooMemo], ["鉄輪", kannawaMemo], ["展望台", tenboMemo], ["みょうばん", myobanMemo]] as const) console.log(`${n}: ${m.slice(0, 60)}…${m.slice(-40)}`);
  console.log("1日目: …竹細工 11:00 → 鉄輪 12:05〜13:30（昼食）→ むし湯 13:35〜14:20 → 展望台 14:30〜14:55 →（バス25分）みょうばん湯の里 15:20〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
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
