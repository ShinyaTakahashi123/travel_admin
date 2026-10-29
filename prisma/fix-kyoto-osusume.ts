/**
 * fc54731b（京都3泊4日）の「おすすめ」言い回し3か所を直す（法務指摘、2026-10-29）
 * 法務の決まりで、言い切り・すすめの言い方は書かない。もとからある文だが見直しの対象
 */
import { prisma } from "../src/lib/prisma";

const commit = process.argv.includes("--commit");

const PONTOCHO = "d6542e97-1cb9-43fa-aa77-24858d62ebfe"; // day4
const NINENZAKA = "33cefa42-bd3d-4f92-b986-17289a68cfff"; // day2
const HANAMIKOJI = "8a296585-2776-428f-a077-82281d29ac7d"; // day3

const PONTOCHO_MEMO_OLD =
  "鴨川のほとりから、先斗町へ向かいましょう。鴨川沿いに広がる情緒あふれる飲食店街です。正徳2年（1712年）ごろ、高瀬川を行き来する船の船頭や旅人を相手にした茶屋が始まりと伝えられています。「先斗町」という珍しい読み方は、ポルトガル語で「先端」を意味する言葉に由来するとも、鴨川と高瀬川に挟まれた様子を鼓に見立てた音にちなむとも伝えられています。この時間に、情緒ある路地の食事処で昼食をとりましょう。大人の夜歩きにもおすすめの一角です。";
const PONTOCHO_MEMO_NEW =
  "鴨川のほとりから、先斗町へ向かいましょう。鴨川沿いに広がる情緒あふれる飲食店街です。正徳2年（1712年）ごろ、高瀬川を行き来する船の船頭や旅人を相手にした茶屋が始まりと伝えられています。「先斗町」という珍しい読み方は、ポルトガル語で「先端」を意味する言葉に由来するとも、鴨川と高瀬川に挟まれた様子を鼓に見立てた音にちなむとも伝えられています。この時間に、情緒ある路地の食事処で昼食をとりましょう。夜には、また違った表情を見せる一角です。";

const NINENZAKA_MEMO_OLD =
  "石畳の坂道に土産物店が並ぶ、京都散策の定番コースです。上の「産寧坂」は、豊臣秀吉の妻・ねねが安産祈願のためこの坂を上ったからとも、清水寺の塔頭にある安産祈願の塔にちなむとも伝えられています。その下に続く坂は、いつしか「二年坂」と呼ばれるようになったそうです。八坂神社・円山公園・高台寺と、清水寺を結ぶ坂道です。食事処も多いので、この辺りで少し早めの昼食をとるのもおすすめです。この先は、ねねの道を通って高台寺へ向かいましょう。";
const NINENZAKA_MEMO_NEW =
  "石畳の坂道に土産物店が並ぶ、京都散策の定番コースです。上の「産寧坂」は、豊臣秀吉の妻・ねねが安産祈願のためこの坂を上ったからとも、清水寺の塔頭にある安産祈願の塔にちなむとも伝えられています。その下に続く坂は、いつしか「二年坂」と呼ばれるようになったそうです。八坂神社・円山公園・高台寺と、清水寺を結ぶ坂道です。食事処も多いので、この辺りで少し早めの昼食にしましょう。この先は、ねねの道を通って高台寺へ向かいましょう。";

const HANAMIKOJI_MEMO_OLD =
  "町家が並ぶ風情ある通りです。もとは建仁寺の敷地でしたが、明治6〜7年（1873〜74年）ごろ、祇園甲部のお茶屋組合がこの土地を譲り受けたのが花街としての始まりと伝えられています。紅殻格子と犬矢来が続くお茶屋建築の町並みを、大人の足取りでゆっくり歩いてみましょう。石畳の路地を入った奥にも、昔ながらの佇まいが残ります。舞妓さんを見かけても、呼び止めたり無断で撮影したりせず、そっと見守るのがマナーです。「私道」の表示がある路地には入らないようにしましょう。付近には老舗の料亭や食事処も多いので、この時間に昼食をとるのもおすすめです。";
const HANAMIKOJI_MEMO_NEW =
  "町家が並ぶ風情ある通りです。もとは建仁寺の敷地でしたが、明治6〜7年（1873〜74年）ごろ、祇園甲部のお茶屋組合がこの土地を譲り受けたのが花街としての始まりと伝えられています。紅殻格子と犬矢来が続くお茶屋建築の町並みを、大人の足取りでゆっくり歩いてみましょう。石畳の路地を入った奥にも、昔ながらの佇まいが残ります。舞妓さんを見かけても、呼び止めたり無断で撮影したりせず、そっと見守るのがマナーです。「私道」の表示がある路地には入らないようにしましょう。付近には老舗の料亭や食事処も多いので、この時間に昼食にしましょう。";

async function main() {
  const spots = await prisma.spot.findMany({
    where: { id: { in: [PONTOCHO, NINENZAKA, HANAMIKOJI] } },
    select: { id: true, memo: true },
  });
  const byId = new Map(spots.map((s) => [s.id, s]));

  const checks: [string, string][] = [
    [PONTOCHO, PONTOCHO_MEMO_OLD],
    [NINENZAKA, NINENZAKA_MEMO_OLD],
    [HANAMIKOJI, HANAMIKOJI_MEMO_OLD],
  ];
  for (const [id, old] of checks) {
    const s = byId.get(id);
    if (!s) throw new Error(`spot not found: ${id}`);
    if (s.memo !== old) throw new Error(`${id}: memo mismatch.\n現在値: ${s.memo}`);
  }
  console.log("前提の確認OK。\n");

  console.log(`[先斗町]\n[旧] ${PONTOCHO_MEMO_OLD}\n[新] ${PONTOCHO_MEMO_NEW}\n`);
  console.log(`[二年坂・産寧坂]\n[旧] ${NINENZAKA_MEMO_OLD}\n[新] ${NINENZAKA_MEMO_NEW}\n`);
  console.log(`[祇園花見小路]\n[旧] ${HANAMIKOJI_MEMO_OLD}\n[新] ${HANAMIKOJI_MEMO_NEW}\n`);

  if (!commit) {
    console.log("確認モードです。--commit を付けると書き込みます。");
    return;
  }

  await prisma.$transaction([
    prisma.spot.update({ where: { id: PONTOCHO }, data: { memo: PONTOCHO_MEMO_NEW } }),
    prisma.spot.update({ where: { id: NINENZAKA }, data: { memo: NINENZAKA_MEMO_NEW } }),
    prisma.spot.update({ where: { id: HANAMIKOJI }, data: { memo: HANAMIKOJI_MEMO_NEW } }),
  ]);

  console.log("書き込みました。");
}

main().finally(() => prisma.$disconnect());
