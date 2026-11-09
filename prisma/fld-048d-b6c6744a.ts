/**
 * 函館の点のそろえに続く直し b6c6744a（日帰り、しおりえ(制作補助2)、企画運営 10/30 の判断 (B)）
 * - 大沼国定公園: 点は大沼国際交流プラザのまま。「道南では唯一となる」→「道南では唯一とされる」（同じ文に弱める言葉、法務 OK）
 * - 島巡りの路: 点が大沼公園駅の stop_position（node 264424430）だったので、鈴蘭橋（way 41310002、Nominatim 41.9842861,140.6681001）に。
 *   公式の地図（https://www.onuma-guide.com/navimap/category/route/route2/）の湖月橋・公魚島などは OSM・地理院の地名になく、
 *   鈴蘭橋が島巡りの路にかかるかは確かめられないため、メモを点に合わせ「木の橋を渡りながら、鈴蘭橋のあたりまで」とする（企画運営の文を法務が直した）
 *   プラザから foot 780m・10.4分 → 歩き12→10分。時刻は 15:45→15:43、滞在50分のまま 16:33 に出る（延ばさない）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-048d-b6c6744a.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const COMMIT = process.argv.includes("--commit");
const ONUMA = "1e6485ed-3f15-43f1-be5b-e42a6b91b41b";
const SHIMA = "d9d45cb8-f957-49e3-b428-6011e85ccabb";
const FROM: [number, number] = [41.980839, 140.669966];
const TO: [number, number] = [41.984286, 140.6681];
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));
const EDITS: Record<string, { from: string; to: string }[]> = {
  [ONUMA]: [
    { from: "道南では唯一となる国定公園に指定されました。", to: "道南では唯一とされる国定公園に指定されました。" },
    {
      from: "この後は、湖に浮かぶ島々を橋づたいに歩く「島巡りの路」へ向かいましょう。",
      to: "この後は、歩いて約10分、湖に浮かぶ島々を橋づたいに歩く「島巡りの路」へ向かいましょう。",
    },
  ],
  [SHIMA]: [
    {
      from: "大沼の湖畔から、木橋で結ばれた7つの島をめぐる遊歩道「島巡りの路」を歩いてみましょう。",
      to: "大沼国際交流プラザから歩いて約10分。公園広場の左手には、木の橋で島々を結ぶ散策路「島巡りの路」があります。木の橋を渡りながら、鈴蘭橋のあたりまで歩いてみましょう。",
    },
    // 浮島橋の名前が確かめられないので消す（法務 10/30）
    { from: "中でも太鼓橋の「浮島橋」からの眺めは、大沼を代表する撮影スポットの一つです。", to: "" },
  ],
};

async function main() {
  const spots = await prisma.spot.findMany({ where: { id: { in: [ONUMA, SHIMA] } }, include: { transitLegs: true, day: { select: { itineraryId: true } } } });
  const get = (id: string) => spots.find((s) => s.id === id)!;
  const shima = get(SHIMA);
  if (!shima.day.itineraryId.startsWith("b6c6744a") || !get(ONUMA).day.itineraryId.startsWith("b6c6744a")) throw new Error("しおりが想定と違います");
  const vt = shima.visitTime!;
  const legs = shima.transitLegs.map((l) => `${l.transitMode}${l.transitDurationMin}`).join("+");
  if (Number(shima.lat) !== FROM[0] || Number(shima.lng) !== FROM[1] || vt.getUTCHours() !== 15 || vt.getUTCMinutes() !== 45 || shima.stayDurationMin !== 50 || legs !== "walk12")
    throw new Error(`島巡りの路: いまの値が想定と違います（${shima.lat},${shima.lng} ${vt.toISOString()} ${shima.stayDurationMin} ${legs}）`);
  const memo: Record<string, string> = {};
  for (const [id, edits] of Object.entries(EDITS)) {
    let m = get(id).memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${id}: 置き換え元が見つかりません: ${e.from.slice(0, 20)}`);
      m = m.replace(e.from, e.to);
      console.log(`${get(id).name} → ${e.to}`);
    }
    memo[id] = m;
  }
  console.log(`島巡りの路: 座標 ${FROM.join(",")} → ${TO.join(",")}、15:45 walk12 → 15:43 walk10（滞在50分、16:33 に出る）`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction([
    prisma.spot.update({ where: { id: ONUMA }, data: { memo: memo[ONUMA] } }),
    prisma.spot.update({
      where: { id: SHIMA },
      data: {
        memo: memo[SHIMA],
        lat: TO[0],
        lng: TO[1],
        visitTime: t(15, 43),
        transitLegs: { deleteMany: {}, create: [{ orderNo: 1, transitMode: "walk", transitDurationMin: 10, transitLine: null }] },
      },
    }),
  ]);
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
