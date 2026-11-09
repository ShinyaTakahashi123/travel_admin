/**
 * #103 白石・蔵王、法務の本番確認(2026-10-30 18:05)の指摘3件。企画運営の案(18:0x、
 * 宿を遠刈田温泉のまわりに)で直す。
 *
 * 1. 白石市商家資料館の締め「車でおよそ30分」→実際の移動(22分)に合わせる
 * 2. 蔵王酪農センターの締め「車でおよそ12分」→実際の移動(8分)に合わせる
 * 3. 宿の一文・2日目の書き出し: 宿を「遠刈田温泉のまわり」とし、傑山寺の締めに
 *    そこまでの移動(車27分、OSRM22.0分+5)、蔵王酪農センターの書き出しに宿からの
 *    移動(車8分、OSRM3.0分+5)を追加
 *
 * 時刻は変更なし(傑山寺16:17、蔵王酪農センター09:30のまま)。
 *
 * 実行方法:
 *   確認: npm run prod -- npx tsx prisma/fix-103-correction3.ts
 *   反映: npm run prod -- npx tsx prisma/fix-103-correction3.ts --commit
 */
import { prisma } from "../src/lib/prisma";

const SHOKAN_ID = "169dc777-6f22-474a-b99f-ab6c487ed2d2";
const KESSANJI_ID = "b64bb527-e2b8-442b-8c91-a6297bba31c2";
const RAKUNO_ID = "c867ab08-70b7-426b-bd4e-abd012346139";

const PAIRS: { id: string; label: string; find: string; replace: string }[] = [
  {
    id: SHOKAN_ID,
    label: "白石市商家資料館(締め)",
    find: "続いては、車でおよそ30分のみやぎ蔵王キツネ村へ向かいましょう。",
    replace: "続いては、車でおよそ22分のみやぎ蔵王キツネ村へ向かいましょう。",
  },
  {
    id: KESSANJI_ID,
    label: "傑山寺(宿の一文)",
    find: "今夜はこの近くの宿に泊まりましょう。",
    replace: "見学を終えたら、車でおよそ27分の遠刈田温泉へ向かいましょう。この夜は、遠刈田温泉のまわりの宿に泊まりましょう。",
  },
  {
    id: RAKUNO_ID,
    label: "蔵王酪農センター(書き出し・締め)",
    find: "旅の2日目は、遠刈田温泉のほど近くにある蔵王酪農センターから始めましょう。牧場でのびのびと過ごす牛たちを眺めながら、チーズ・バター・アイスクリームの手作り体験に挑戦できます。国産初とされるナチュラルチーズ専門工場として昭和55年(1980)に誕生し、40年を超える歴史を持つこの工房では、蔵王の澄んだ空気と水を生かしたナチュラルチーズが作られています。生クリームからバターを作ったり、自分だけのオリジナルアイスクリームを作ったりと、いくつかの手作り体験の中から好きなものを選んで挑戦してみましょう。牧場の風景の中で、牛たちともふれあってみましょう。続いては、車でおよそ12分の神の湯へ向かいましょう。",
    replace: "遠刈田温泉のまわりの宿を出て、車でおよそ8分、2日目は蔵王酪農センターから始めましょう。牧場でのびのびと過ごす牛たちを眺めながら、チーズ・バター・アイスクリームの手作り体験に挑戦できます。国産初とされるナチュラルチーズ専門工場として昭和55年(1980)に誕生し、40年を超える歴史を持つこの工房では、蔵王の澄んだ空気と水を生かしたナチュラルチーズが作られています。生クリームからバターを作ったり、自分だけのオリジナルアイスクリームを作ったりと、いくつかの手作り体験の中から好きなものを選んで挑戦してみましょう。牧場の風景の中で、牛たちともふれあってみましょう。続いては、車でおよそ8分の神の湯へ向かいましょう。",
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

  console.log("=== #103 法務指摘その3(文のみ、時刻変更なし) ===\n");
  for (const id of ids) {
    console.log(memoById.get(id)!.slice(0, 50) + " ... " + memoById.get(id)!.slice(-90));
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
