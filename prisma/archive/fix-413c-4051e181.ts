/**
 * #413 4051e181 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 決まり2「最後の行き先を出るのが16:30〜17:00」、車・帰りの一言、書き出しと前のスポット）
 * 1日目（車）: 天岩戸神社 → 天安河原 → 高千穂峡 → 道の駅高千穂（昼食）→ 高千穂神社 → 槵觸神社 → 国見ヶ丘 → 荒立神社（新規）（8か所 09:00〜16:55）
 *   最初に車の旅の一言、高千穂峡の書き出しを前のスポット（天安河原）に合わせる、最後に帰りの一言。説明文も合わせる
 * 本文の出典: 高千穂町観光協会 https://takachiho-kanko.info/sightseeing/7/ （荒立神社）
 * 座標の出典: OSM（荒立神社 node 5089460864 32.711623,131.316970）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-413c-4051e181.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "4051e181-6ad7-4f7a-8270-b9ed12c4231f";
const DAY1_ID = "0bd8ac8d-d309-42fa-830b-3844b8a416c4";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const RESPECT = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY1_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const want = ["天岩戸神社", "天安河原", "高千穂峡", "道の駅高千穂（昼食）", "高千穂神社", "槵觸神社", "国見ヶ丘"];
  if (day.spots.map((s) => s.name).join() !== want.join()) throw new Error("1日目が想定と違います");
  const [iwato, kawara, kyo, michi, jinja, kushi, kunimi] = day.spots;
  const iwatoMemo = "この旅は車（レンタカーなど）でめぐります。旅の始まりは天岩戸神社へ。" + (iwato.memo ?? "");
  const kyoMemo = rep(kyo.memo ?? "", "天岩戸神社から車で約20分。", "天安河原から天岩戸神社の駐車場へ戻り、車で約20分。");
  const description = rep(it.description ?? "", "最後は国見ヶ丘から高千穂の山々を見渡す、日本神話の舞台をめぐる日帰りプランです。",
    "国見ヶ丘から高千穂の山々を見渡したら、最後は猿田彦命と天鈿女命ゆかりの荒立神社へ。日本神話の舞台をめぐる日帰りプランです。");

  const order = [
    { id: iwato.id, data: { memo: iwatoMemo } },
    { id: kawara.id, data: {} },
    { id: kyo.id, data: { memo: kyoMemo } },
    { id: michi.id, data: {} },
    { id: jinja.id, data: {} },
    { id: kushi.id, data: {} },
    { id: kunimi.id, data: {} },
    { create: { name: "荒立神社", visitTime: t(16, 35), stayDurationMin: 20, transitMode: "car", transitDurationMin: 15, transitLine: null, lat: 32.711623, lng: 131.31697, address: "宮崎県西臼杵郡高千穂町",
      memo: "国見ヶ丘から車で、町なかの荒立神社へ。瓊々杵尊が降臨する途中で道案内をした猿田彦命と、天鈿女命が結婚して住んだ地と伝えられ、切り出したばかりの荒木で急いで宮居を造ったことから「荒立宮」と名付けられたといわれています。この言い伝えから、縁結びを願う人がお参りする神社です。境内には、7回打つと7つの願いがかなうといわれる「七福徳寿板木」などの板木があります。" + RESPECT + "日本神話の舞台をめぐる旅を、ここで締めくくりましょう。帰りは、レンタカーを返す場所まで安全運転で。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`天岩戸神社: ${iwatoMemo.slice(0, 50)}…`);
  console.log(`高千穂峡: ${kyoMemo.slice(0, 50)}…`);
  console.log("1日目: …国見ヶ丘 15:30〜16:20 →（車15分）荒立神社 16:35〜16:55");
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
