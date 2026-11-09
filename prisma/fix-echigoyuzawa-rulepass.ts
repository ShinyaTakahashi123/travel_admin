/**
 * 法務の10章見直し（追加の見直し）、越後湯沢(04fcc64b)の分。終わりの文・書き出しの文、
 * 両方に分がない3区間（分は今の移動のまま）。
 *  ガーラ湯沢駅・スキーセンター カワバンガ↔ゲレンデ(他7)
 *  ゲレンデ↔SPAガーラの湯(他7+歩3=あわせて10)
 *  越後湯沢駅のまわり↔西口駅前広場足湯(歩1): 「歩いてすぐ」も法務の追加の見直しC
 *  （「すぐ」にも分を書く）に当たるため、両端とも「歩いておよそ1分」に直す
 *  （企画運営 2026-11-02）
 *
 * あわせて、札幌・小樽(180bc90c)で直し忘れていた1件も一緒に書き込む。
 *  二条市場「『のれん横丁』では食べ歩きも楽しめます。」→「『のれん横丁』には、
 *  食事のできる店も集まっています。」（法務指摘。3章）
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");
const ITIN_ID = "04fcc64b-72d2-4b60-8484-ca892ff27f12";
const SAPPORO_OTARU_ITIN_ID = "180bc90c-02d3-4f11-a6ea-5866d0bd0da6";

type Fix = { name: string; from: string; to: string };

const fixes: Fix[] = [
  {
    name: "ガーラ湯沢駅・スキーセンター カワバンガ",
    from: "準備ができたら、ゴンドラでゲレンデへ向かいましょう。",
    to: "準備ができたら、ゴンドラでおよそ7分、ゲレンデへ向かいましょう。",
  },
  {
    name: "ゲレンデ",
    from: "スキーセンターから徒歩すぐ、ゴンドラでゲレンデへ向かいます。",
    to: "スキーセンターからゴンドラでおよそ7分、ゲレンデへ向かいます。",
  },
  {
    name: "ゲレンデ",
    from: "この後は、ゴンドラで山麓へ戻り、SPAガーラの湯へ向かいましょう。",
    to: "この後は、ゴンドラで山麓へ戻り、歩いて、あわせておよそ10分、SPAガーラの湯へ向かいましょう。",
  },
  {
    name: "SPAガーラの湯",
    from: "ゴンドラで山麓へ戻り、駅から歩いてすぐ（約3分）、SPAガーラの湯に着きます。",
    to: "ゴンドラで山麓へ戻り、歩いて、あわせておよそ10分、SPAガーラの湯に着きます。",
  },
  {
    name: "越後湯沢駅のまわり",
    from: "この後は、歩いてすぐ、西口駅前広場足湯へ向かいましょう。",
    to: "この後は、歩いておよそ1分、西口駅前広場足湯へ向かいましょう。",
  },
  {
    name: "西口駅前広場足湯",
    from: "越後湯沢駅のまわりから歩いてすぐ、西口駅前広場足湯に着きます。",
    to: "越後湯沢駅のまわりから歩いておよそ1分、西口駅前広場足湯に着きます。",
  },
];

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  const updates: { id: string; name: string; before: string; after: string }[] = [];
  for (const f of fixes) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: ITIN_ID } } });
    const already = updates.find((u) => u.id === spot.id);
    const base = already ? already.after : spot.memo ?? "";
    if (!base.includes(f.from)) throw new Error(`${f.name}: 期待する文「${f.from}」が見つかりません`);
    const after = base.replace(f.from, f.to);
    if (already) already.after = after;
    else updates.push({ id: spot.id, name: f.name, before: spot.memo ?? "", after });
  }

  for (const u of updates) {
    console.log(`\n[${u.name}]\n旧: ${u.before}\n新: ${u.after}`);
  }

  const nijoFrom = "「のれん横丁」では食べ歩きも楽しめます。";
  const nijoTo = "「のれん横丁」には、食事のできる店も集まっています。";
  const nijoSpot = await prisma.spot.findFirstOrThrow({
    where: { name: "二条市場", day: { itineraryId: SAPPORO_OTARU_ITIN_ID } },
  });
  if (!nijoSpot.memo || !nijoSpot.memo.includes(nijoFrom)) {
    throw new Error("二条市場(札幌・小樽): 期待する文が見つかりません");
  }
  const nijoAfter = nijoSpot.memo.replace(nijoFrom, nijoTo);
  console.log(`\n[二条市場(札幌・小樽 180bc90c)]\n旧: ${nijoSpot.memo}\n新: ${nijoAfter}`);

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    for (const u of updates) {
      await tx.spot.update({ where: { id: u.id }, data: { memo: u.after } });
    }
    await tx.spot.update({ where: { id: nijoSpot.id }, data: { memo: nijoAfter } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
