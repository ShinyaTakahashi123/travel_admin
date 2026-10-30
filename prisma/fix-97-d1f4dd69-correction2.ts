/**
 * #97 訂正その2。法務の本番確認(2026-10-30)の指摘に対応する、文言だけの直し。
 *
 * 1. タクシーの文を法務の指定どおりに組み直す(言い切りを直したときに分数が読みにくくなっていた)
 * 2. 岡寺の「奈良交通のバス」から会社名を外す
 *
 * 向原寺の座標34.482197,135.812653は、地理院の住所検索「奈良県明日香村豊浦630番地」と
 * 完全一致(番地まで合った点)。座標の変更はなし、法務への報告のみ。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-97-d1f4dd69-correction2.ts
 *   反映: npm run prod -- npx tsx prisma/fix-97-d1f4dd69-correction2.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const YAMADADERA_ID = "2fa34160-c69b-4f3a-94fb-dfb952ca70b1";
const ABEMONJUIN_ID = "15a94742-ad3b-4a43-8f51-a08835c8ddc5";
const OKADERA_ID = "1f931004-ff9d-4f2b-9163-94286a8465f7";

const PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: YAMADADERA_ID,
    label: "山田寺跡(終わりの一文)",
    find: "この後は、この区間はタクシーを使うと便利です。タクシーでおよそ10分、安倍文殊院へ向かいましょう。",
    replace: "この後は、タクシーでおよそ10分、安倍文殊院へ向かいましょう。この区間は、タクシーを使うと便利です。",
  },
  {
    id: ABEMONJUIN_ID,
    label: "安倍文殊院(書き出し)",
    find: "山田寺跡からは、タクシーを使うと便利です。タクシーでおよそ10分で、1日目最後は安倍文殊院です。",
    replace: "山田寺跡からタクシーでおよそ10分、1日目最後の安倍文殊院に着きます。",
  },
  {
    id: OKADERA_ID,
    label: "岡寺(帰りの一文)",
    find: "参拝を終えたら、岡寺前バス停まで歩いておよそ9分、奈良交通のバスでおよそ24分、近鉄橿原神宮前駅へ戻りましょう。",
    replace: "参拝を終えたら、岡寺前バス停まで歩いておよそ9分、バスでおよそ24分、近鉄橿原神宮前駅へ戻りましょう。",
  },
];

async function main() {
  const commit = process.argv.includes("--commit");

  const ids = [...new Set(PAIRS.map((p) => p.id))];
  const spots = await prisma.spot.findMany({ where: { id: { in: ids } } });
  const memoById = new Map(spots.map((s) => [s.id, s.memo ?? ""]));

  for (const p of PAIRS) {
    if (!memoById.get(p.id)!.includes(p.find)) {
      console.log(`[想定と違います] ${p.label} に「${p.find}」が見つかりません。処理を中止します。`);
      return;
    }
  }
  for (const p of PAIRS) {
    memoById.set(p.id, memoById.get(p.id)!.replace(p.find, p.replace));
  }

  console.log("=== #97 訂正その2 ===\n");
  for (const p of PAIRS) {
    console.log(`[${p.label}]`);
    console.log(memoById.get(p.id)!.slice(0, 120));
    console.log();
  }

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(
    ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } }))
  );

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
