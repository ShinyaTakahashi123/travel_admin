/**
 * 初日・最終日の見直し #166 b9b5d943 の追加の直し（しおりえ(制作補助2)、法務・企画運営 10/30）
 * 言葉の決まりは、見直しの範囲の日でなくても、しおりのすべての文に当てはめる（企画運営 10/30）
 * 1. 2日目 沖縄県立博物館・美術館: 前から残っていた「…掘り下げてみるのもおすすめです。」→「…掘り下げてみましょう。」
 * 2. 3日目 波上宮: 「…静かにお参りしましょう。」を決まりの祈りの一文にそろえる（itinerary-rules 236）
 * 3. 3日目 旧海軍司令部壕: 慰霊の場の一文を足す（itinerary-rules 261）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-166b-b9b5d943.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "b9b5d943-e02a-4013-95e8-89ca62f50842";
const EDITS: { id: string; from: string; to: string }[] = [
  {
    id: "26ee9308-6007-43c2-a800-5c1213f566af",
    from: "ここまで見てきた琉球の歴史を、館内の展示でさらに掘り下げてみるのもおすすめです。",
    to: "ここまで見てきた琉球の歴史を、館内の展示でさらに掘り下げてみましょう。",
  },
  {
    id: "27dd882f-3ddc-4231-bd38-b21fd2e3c2a4",
    from: "崖の上から那覇港を望む景色もあわせて、静かにお参りしましょう。",
    to: "崖の上から那覇港を望む景色もあわせて眺めましょう。今も祈りが続く場所ですので、静かに、敬意をもってお参りしましょう。",
  },
  {
    id: "726117bc-9e18-4bfc-9263-da63c6191ccc",
    from: "平和について考えながら、じっくりと見て回りましょう。",
    to: "平和について考えながら、じっくりと見て回りましょう。慰霊の場でもあるので、静かに、敬意をもって見学しましょう。",
  },
];
const COMMIT = process.argv.includes("--commit");

async function main() {
  const next: { id: string; memo: string }[] = [];
  for (const e of EDITS) {
    const s = await prisma.spot.findUniqueOrThrow({ where: { id: e.id }, include: { day: true } });
    if (s.day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
    const memo = s.memo ?? "";
    if (memo.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません`);
    next.push({ id: e.id, memo: memo.replace(e.from, e.to) });
    console.log(`${s.name}: → ${e.to}`);
  }
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(next.map((n) => prisma.spot.update({ where: { id: n.id }, data: { memo: n.memo } })));
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
