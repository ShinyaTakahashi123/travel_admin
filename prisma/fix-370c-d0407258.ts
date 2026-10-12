/**
 * #370の続き。法務(記録d41032c)・企画運営の指摘に対応。
 *
 * 砂楽:
 * - 「三国名勝図会にも、その効能が記されています」→効き目の話にせず、
 *   「…にも、砂むしのことが記されています」に修正。
 * - 年間利用客数(昭和27年9,700人→平成8年27万人)は、出典を確かめられな
 *   かったため削除。
 * - 入浴の注意の一文を追加。
 * - 結びを「砂むしを終えたら」に修正。
 * - 座標が「指宿いわさきホテル」の敷地(砂楽から約800m)だったため、OSM実点
 *   (w1044426803「砂むし会館 砂楽」、31.229794,130.651914)に修正。
 *
 * 道の駅いぶすき:
 * - 店・商品の名前(彩花菜館・彩花菜バーガー・いぶすきラップ・海音)を外した。
 * - 「展望スペースから桜島・大隅半島を望める」は、出典を確かめられなかった
 *   ため削除。
 *
 * 薩摩伝承館:
 * - 宿の名前(指宿白水館)を外した。法務・企画運営で指示が分かれた点
 *   (法務は宿名ごと削除、企画運営は「老舗」のみ削除)のため、報告で
 *   確認をお願いする。
 *
 * 殿様湯:
 * - 「文政11年(1828)」は、確認できた一次情報(tabi-mag.jp/kg0030/)による
 *   と誤りで、実際は「天保2年(1831)、島津斉興が長井温泉から湯治用の別邸を
 *   移した」のが正しい年代だったため、年代を修正。
 * - 家紋の描写を「丸に十の字の島津家の家紋が入った石造りの湯船」に、
 *   出典の表現に沿って修正。
 * - 入浴の注意の一文を追加。
 * - 結びを「湯から上がったら」に修正。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-370c-d0407258.ts
 */
import { prisma } from "../src/lib/prisma";

const DAY1_ID = "a602dd91-f920-439a-8ccb-2e187f19a5a2";

async function main() {
  const sunaraku = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "指宿温泉 砂むし会館 砂楽" } });
  const douno = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "道の駅いぶすきで昼食" } });
  const denshokan = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "薩摩伝承館" } });
  const tonosama = await prisma.spot.findFirstOrThrow({ where: { dayId: DAY1_ID, name: "殿様湯" } });

  if (sunaraku.lat?.toString() === "31.229794") {
    console.log("already applied, skipping");
    return;
  }

  const sunarakuNewMemo =
    "JR指宿駅でレンタカーを借りて、車でおよそ5分、指宿温泉の旅は砂むし会館 砂楽から始まります。海岸で温められた温泉熱を帯びた砂に全身を埋める、世界的にも珍しい天然の砂むし温泉を体験できる施設です。指宿の砂むし湯治の歴史は古く、天保14年(1843)に編纂された「三国名勝図会」にも、砂むしのことが記されています。江戸時代にはすでに湯治として親しまれていたと伝えられています。泉質はナトリウム塩化物泉で、地中を流れる源泉はおよそ80〜90度と高温ですが、砂浜の表面はおよそ50度前後に保たれており、潮が引いていくときには、砂浜のあちこちから湯けむりが立ちのぼる、幻想的な光景を目にすることもできます。砂むし場では、ほかの利用者が写り込まないよう、撮影は施設の決まりに従いましょう。長く入りすぎず、気分が悪くなったらすぐに出て、こまめに水分をとりましょう。全身を砂に包まれる、独特の温泉体験をしてみましょう。砂むしを終えたら、車で時遊館COCCOはしむれへ向かいましょう。";

  await prisma.spot.update({
    where: { id: sunaraku.id },
    data: { lat: 31.229794, lng: 130.651914, memo: sunarakuNewMemo },
  });

  const douOld = douno.memo ?? "";
  const douFixed = douOld
    .replace(
      "地元の海産物や農産物の直売所を併設した道の駅で、彩花菜バーガーやいぶすきラップなど、この土地らしい軽食が楽しめます。改装された食事処「海音」では、錦江湾でとれた新鮮な魚を使った料理も味わえます。展望スペースからは、桜島や大隅半島を望むこともできます。",
      "地元の海産物や農産物の直売所を併設した道の駅で、直売所の食事処で、地元の食材を使った軽食を味わえます。"
    );
  await prisma.spot.update({ where: { id: douno.id }, data: { memo: douFixed } });

  const denFixed = (denshokan.memo ?? "").replace(
    "老舗旅館・指宿白水館の敷地内に建つ美術館で、",
    "指宿白水館の敷地内に建つ美術館で、"
  );
  await prisma.spot.update({ where: { id: denshokan.id }, data: { memo: denFixed } });

  const tonoFixed = (tonosama.memo ?? "")
    .replace(
      "文政11年(1828)、薩摩藩10代藩主・島津斉興が、この地に別邸と湯治場を設けたことに由来する温泉で、島津家の家紋があしらわれた湯船に浸かることができます。",
      "天保2年(1831)、薩摩藩10代藩主・島津斉興が、長井温泉から湯治用の別邸をこの地に移したことに由来する温泉で、丸に十の字の島津家の家紋が入った石造りの湯船に浸かることができます。"
    )
    .replace(
      "源泉かけ流しの、歴史ある共同浴場でひとときを過ごしましょう。見学を終えたら、車で池田湖へ向かいましょう。",
      "源泉かけ流しの、歴史ある共同浴場でひとときを過ごしましょう。ほかの利用者が写り込まないよう撮影には気をつけ、長く入りすぎず、こまめに水分をとりましょう。湯から上がったら、車で池田湖へ向かいましょう。"
    );
  await prisma.spot.update({ where: { id: tonosama.id }, data: { memo: tonoFixed } });

  console.log("#370続き: 法務・企画運営の指摘に対応(効能の書き方・座標・入浴の注意・店名・年代の訂正等)");
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
