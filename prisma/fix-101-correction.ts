/**
 * #101 猪苗代、法務の本番確認(2026-10-30 16:51)の指摘。文だけの直しのため、法務のOKで書き込む。
 *
 * 1. 書き出しに前のスポットと分数がない(決まり145): 天鏡閣・亀ヶ城公園
 * 2. バスの分数がない: 七日町通り(書き出し)・鶴ヶ城(書き出し)・御薬園(帰りの一文)
 * 3. 御薬園「確かめてください」→「確かめましょう」
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-101-correction.ts
 *   反映: npm run prod -- npx tsx prisma/fix-101-correction.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const TENKYOKAKU_ID = "c1f5d0a6-7e2c-4796-b8b2-32a8fd670d3c";
const KAMEGAJO_ID = "f09c8173-1414-4071-9653-ca0322923120";
const NANOKAMACHI_ID = "8c2ecf6d-e0da-4f73-995e-cc2236320e15";
const TSURUGAJO_ID = "c9c23a9c-fe73-43a8-9fc2-3fac6957689f";
const OYAKUEN_ID = "ceea85b2-4254-41c1-9c9f-f6c1c8fae2f6";

const PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: TENKYOKAKU_ID,
    label: "天鏡閣(書き出しに分数)",
    find: "湖を見下ろす丘に立つ洋館です。",
    replace: "野口英世記念館からタクシーで約9分。湖を見下ろす丘に立つ洋館です。",
  },
  {
    id: KAMEGAJO_ID,
    label: "亀ヶ城公園(書き出しに分数)",
    find: "鎌倉時代のはじめ、建久2年（1191年）",
    replace: "長浜からタクシーで約13分。鎌倉時代のはじめ、建久2年（1191年）",
  },
  {
    id: NANOKAMACHI_ID,
    label: "七日町通り(書き出しのバス分数)",
    find: "猪苗代駅からJR磐越西線で約30分の会津若松駅へ出て、周遊バスで七日町へ。",
    replace: "猪苗代駅からJR磐越西線で約30分の会津若松駅へ出て、周遊バスで約20分、七日町へ。時刻は公式の案内で確かめましょう。",
  },
  {
    id: TSURUGAJO_ID,
    label: "鶴ヶ城(書き出しのバス分数)",
    find: "七日町から周遊バスで鶴ヶ城へ。",
    replace: "七日町から周遊バスで約15分、鶴ヶ城へ。",
  },
  {
    id: OYAKUEN_ID,
    label: "御薬園(帰りの一文のバス分数・言い回し)",
    find: "入園できる時間は公式の案内で確かめてください。帰りは周遊バスで会津若松駅へ。",
    replace: "入園できる時間は公式の案内で確かめましょう。帰りは周遊バスで約10分の会津若松駅へ。時刻は公式の案内で確かめましょう。",
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

  console.log("=== #101 法務指摘(文のみ) ===\n");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 90));
    console.log();
  }

  if (!commit) {
    console.log("[確認モード] --commit を付けずに実行したため、書き込みは行っていません。");
    return;
  }

  await prisma.$transaction(ids.map((id) => prisma.spot.update({ where: { id }, data: { memo: memoById.get(id)! } })));

  console.log("[--commit] 書き込みました。");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
