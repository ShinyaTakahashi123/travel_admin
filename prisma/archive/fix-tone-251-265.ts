/**
 * 企画運営2026-10-01 06:54の依頼。#251(15185f58)・#265(22e33bac)に、
 * 最初の一覧になかった案内口調(パワースポット・本日・おすすめ・到着です)が
 * 残っていた。時刻・行き先は変えず、該当する文だけを直す(口調のみの直しの
 * ため法務の確認は不要とのこと)。
 *
 * #251: タイトル・説明文・三峯神社の「パワースポット」(3か所)、
 *       「本日の目的地」「本日いちばん」「本日最後に」、
 *       「〜のもおすすめです」(2か所)、「〜に到着です」(2か所、企画運営指摘の
 *       「本日の目的地」と同じ文および大滝温泉遊湯館の文)。
 *       タイトルは中身(渓谷・祭り)に合う形に変更。
 * #265: 「本日は」、「〜のもおすすめです」
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-tone-251-265.ts
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ID_251 = "15185f58-5c6a-441b-a1a0-321b50f7a606";
const ID_265 = "22e33bac-7b3c-4cc1-bd56-d225434ade10";

const NEW_TITLE_251 = "三峯神社の霧海と気運、秩父の渓谷と祭りの町を巡る1泊2日";
const NEW_DESC_251 =
  "標高1100mの山中に鎮座する三峯神社。大滝温泉や渓谷美、秩父神社の彫刻、荒川に架かるハープ橋まで、秩父の自然と信仰をめぐる1泊2日のプランです。";

type Rep = { itinId: string; spotName: string; old: string; next: string };

const reps: Rep[] = [
  {
    itinId: ID_251,
    spotName: "大滝温泉遊湯館",
    old: "車で山あいを進み、大滝温泉遊湯館に到着です。",
    next: "車で山あいを進むと、大滝温泉遊湯館が見えてきます。",
  },
  {
    itinId: ID_251,
    spotName: "秩父湖",
    old: "周囲の山々を静かに映す湖面を眺めたら、車でいよいよ本日いちばんの目的地、三峯神社へ向かいましょう。",
    next: "周囲の山々を静かに映す湖面を眺めたら、車でいよいよこの旅でいちばんの目的地、三峯神社へ向かいましょう。",
  },
  {
    itinId: ID_251,
    spotName: "三峯神社",
    old: "車を走らせること25分ほどで、本日の目的地、三峯神社に到着です。",
    next: "車を走らせること25分ほどで、この旅でいちばんの目的地、三峯神社に着きます。",
  },
  {
    itinId: ID_251,
    spotName: "三峯神社",
    old: "近年はパワースポットとしても多くの人が訪れ、雲海に包まれる幻想的な光景に出会えることもあります。",
    next: "雲海に包まれる幻想的な光景に出会えることもあります。",
  },
  {
    itinId: ID_251,
    spotName: "三峯神社",
    old: "時間と体力に余裕がある方は、奥宮が鎮座する妙法ヶ岳への登拝(往復3時間ほどの山道で、入山できる時期は初夏から秋ごろに限られます)に挑戦するのもおすすめです。",
    next: "時間と体力に余裕がある方は、奥宮が鎮座する妙法ヶ岳への登拝(往復3時間ほどの山道で、入山できる時期は初夏から秋ごろに限られます)に挑戦することもできます。",
  },
  {
    itinId: ID_251,
    spotName: "道の駅あらかわ",
    old: "本日最後に訪れるのは道の駅あらかわです。",
    next: "旅の1日目、最後に訪れるのは道の駅あらかわです。",
  },
  {
    itinId: ID_251,
    spotName: "秩父神社",
    old: "神社前の番場通り周辺には食事処が並んでいるので、このあたりで昼食をとるのもおすすめです。",
    next: "神社前の番場通り周辺には食事処が並んでいるので、このあたりで昼食をとるとよいでしょう。",
  },
  {
    itinId: ID_265,
    spotName: "門司港駅",
    old: "本日は、大正ロマン漂う門司港レトロの建築を巡る旅、門司港駅からスタートです。",
    next: "大正ロマン漂う門司港レトロの建築を巡る旅は、門司港駅からスタートです。",
  },
  {
    itinId: ID_265,
    spotName: "関門トンネル人道",
    old: "時間と体力に余裕があれば、実際にトンネルを歩いて渡ってみるのもおすすめです。",
    next: "時間と体力に余裕があれば、実際にトンネルを歩いて渡ってみるのもよいでしょう。",
  },
];

async function main() {
  const itin251 = await prisma.itinerary.findUniqueOrThrow({ where: { id: ID_251 } });
  if (itin251.title === NEW_TITLE_251) {
    console.log("#251 title already fixed, skipping title/desc update");
  } else {
    await prisma.itinerary.update({ where: { id: ID_251 }, data: { title: NEW_TITLE_251, description: NEW_DESC_251 } });
    console.log("#251 title/description fixed");
  }

  for (const r of reps) {
    const spot = await prisma.spot.findFirstOrThrow({ where: { name: r.spotName, day: { itineraryId: r.itinId } } });
    // old not present = already replaced (checking for `next` is unsafe here since a couple of
    // `next` strings are trailing substrings of their own `old`, which would false-positive as "done")
    if (!spot.memo?.includes(r.old)) {
      console.log(`[${r.itinId.slice(0, 8)}] ${r.spotName}: already fixed`);
      continue;
    }
    await updateSpotInItinerary(r.itinId, { spotId: spot.id }, { memo: spot.memo.replace(r.old, r.next) });
    console.log(`[${r.itinId.slice(0, 8)}] ${r.spotName}: fixed`);
  }
  console.log("done");
}
main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
