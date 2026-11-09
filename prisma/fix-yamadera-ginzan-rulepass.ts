/**
 * 法務の10章見直し(docs/content/20261102-winter-feature-rule-pass.md)、山寺・銀山温泉
 * (b461a3e0)の3件。
 *   - Day2の1か所目(白銀の滝)に、宿(銀山温泉)からの行き方と分がなかった。routed-footで
 *     642m・8.6分→9分を確認し、追加
 *   - 最後の文(山形まるごと館紅の蔵)「山形駅へは、ここから歩いて戻ることができます」に
 *     分がなかった。routed-footで1013m・13.5分→14分を確認し、追加
 *   - 山形美術館のlng=140.3324(小数4けた)は、OSM(38.2558691,140.3323997)の6桁丸めと
 *     数値として同じ(140.332400)ため、変更なし(日光の二荒山神社・竜頭の滝と同じ「たまたま
 *     4けたの正しい値」のパターン、法務の指摘を踏まえて確認)
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const SHIRAGANE_ID_NAME = "白銀の滝";
const SHIRAGANE_OLD =
  "旅の2日目は白銀の滝からスタートです。銀山温泉街のいちばん奥、川をさかのぼった先にある、落差22メートルの滝です。大小2筋に分かれて流れ落ちる姿が特徴で、水量が多い時期には3筋目が現れることもあるのだそうです。大正期には、滝の水を利用した水力発電も行われていたと伝えられ、鉱山とともに歩んできたこの地の歴史を今に伝えています。冬は滝の一部が凍りつき、氷の造形と流れ落ちる水音が織りなす、寒い季節ならではの景色に出会えます。積雪や凍結の状況によっては通れないことがありますので、訪れる前に地元の案内所などで確かめておきましょう。足元が雪に覆われていますので、十分注意しながら進みましょう。見学を終えたら、歩いておよそ5分のしろがね湯へ向かいましょう。";
const SHIRAGANE_NEW = SHIRAGANE_OLD.replace(
  "旅の2日目は白銀の滝からスタートです。",
  "銀山温泉の宿から歩いておよそ9分、2日目は白銀の滝からスタートです。"
);

const KURANOKURA_ID_NAME = "山形まるごと館紅の蔵";
const KURANOKURA_OLD =
  "文翔館を見学したら、歩いておよそ16分の山形まるごと館紅の蔵へ向かいましょう。紅花商人の蔵屋敷だった建物群を活用した施設で、築120年あまりの蔵を改修し、そば処や食堂、土産物店、地場の農産物直売所などが入っています。山形の食や工芸にふれながら、蔵のたたずまいをゆっくり楽しみましょう。山寺の石段から銀山温泉のガス灯、そしてここまで、雪の山形を巡る旅の締めくくりに、ゆっくりと見学しましょう。山形駅へは、ここから歩いて戻ることができます。";
const KURANOKURA_NEW = KURANOKURA_OLD.replace(
  "山形駅へは、ここから歩いて戻ることができます。",
  "山形駅までは、歩いておよそ14分です。駅から帰りましょう。"
);

async function main() {
  console.log(commit ? "=== 書き込みモード ===" : "=== 確認モード(--commitで書き込み) ===");

  for (const f of [
    { name: SHIRAGANE_ID_NAME, oldMemo: SHIRAGANE_OLD, newMemo: SHIRAGANE_NEW },
    { name: KURANOKURA_ID_NAME, oldMemo: KURANOKURA_OLD, newMemo: KURANOKURA_NEW },
  ]) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: f.name, day: { itineraryId: "b461a3e0-87c6-48dd-b5e8-886ba0345df7" } } });
    if (spot.memo !== f.oldMemo) throw new Error(`${f.name}: memo現在値が期待と不一致`);
    console.log(`\n[${f.name}]\n旧: ${f.oldMemo}\n\n新: ${f.newMemo}`);
  }
  console.log("\n[山形美術館] lng=140.3324は変更なし(OSM値と数値として同じ)");

  if (!commit) {
    console.log("\n前提の確認OK。--commitで書き込みます。");
    return;
  }

  await prisma.$transaction(async (tx) => {
    const s1 = await tx.spot.findFirstOrThrow({ where: { name: SHIRAGANE_ID_NAME, day: { itineraryId: "b461a3e0-87c6-48dd-b5e8-886ba0345df7" } } });
    await tx.spot.update({ where: { id: s1.id }, data: { memo: SHIRAGANE_NEW } });
    const s2 = await tx.spot.findFirstOrThrow({ where: { name: KURANOKURA_ID_NAME, day: { itineraryId: "b461a3e0-87c6-48dd-b5e8-886ba0345df7" } } });
    await tx.spot.update({ where: { id: s2.id }, data: { memo: KURANOKURA_NEW } });
  });
  console.log("書き込みました。");
}
main().finally(() => prisma.$disconnect());
