/**
 * #58 51cda3be の追加の直し（しおりえ(制作補助2)、法務 10/30 15:13。決まり329: スポット名にもメモにも宿の名前は書かない）
 * スポット名「新富良野プリンスホテル・ニングルテラス」→「ニングルテラス」、メモのホテルの名前3か所を外す。文とスポット名だけ（法務のOKで書き込む）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fld-058b-51cda3be.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";

const ITINERARY_ID = "51cda3be-9832-4e7b-ac74-42bb780ebb89";
const KAZE = "119cf6f3-f263-4a1c-9e3c-4aea9f0de373";
const NING = "53efefcb-272e-4429-b23c-5ef8b129423d";
const NING_NAME = { from: "新富良野プリンスホテル・ニングルテラス", to: "ニングルテラス" };
const COMMIT = process.argv.includes("--commit");

const MEMO_EDITS: Record<string, { from: string; to: string }[]> = {
  [KAZE]: [{ from: "新富良野プリンスホテルの敷地内に作られた庭園です。", to: "ホテルの敷地内に作られた庭園です。" }],
  [NING]: [
    { from: "新富良野プリンスホテルの敷地に広がるニングルテラスです。", to: "ホテルの敷地に広がるニングルテラスです。" },
    { from: "いずれもこの新富良野プリンスホテルの周辺が舞台になっていて、", to: "いずれもこのあたりが舞台になっていて、" },
  ],
};

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, include: { days: { include: { spots: true } } } });
  const all = it.days.flatMap((d) => d.spots);
  const ning = all.find((s) => s.id === NING)!;
  if (ning.name !== NING_NAME.from) throw new Error(`スポット名が想定と違います: ${ning.name}`);
  const memos: Record<string, string> = {};
  for (const [id, edits] of Object.entries(MEMO_EDITS)) {
    const s = all.find((x) => x.id === id)!;
    let m = s.memo ?? "";
    for (const e of edits) {
      if (m.split(e.from).length !== 2) throw new Error(`${s.name}: 置き換え元が見つかりません: ${e.from.slice(0, 24)}`);
      m = m.replace(e.from, e.to);
      console.log(`${s.name}: → ${e.to}`);
    }
    memos[id] = m;
  }
  console.log(`スポット名: ${NING_NAME.from} → ${NING_NAME.to}`);
  const left = [it.title, it.description ?? "", ...all.map((s) => (s.id === NING ? NING_NAME.to : s.name)), ...all.map((s) => memos[s.id] ?? s.memo ?? "")].filter((x) => x.includes("プリンス"));
  console.log(`直したあとに「プリンス」が残る所: ${left.length} 件`);
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.spot.update({ where: { id: KAZE }, data: { memo: memos[KAZE] } });
    await tx.spot.update({ where: { id: NING }, data: { name: NING_NAME.to, memo: memos[NING] } });
  });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
