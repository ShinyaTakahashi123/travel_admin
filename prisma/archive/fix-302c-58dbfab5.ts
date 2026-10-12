/**
 * チェックリスト #302 の修正記録(企画運営4点・法務1点)。
 * しおり「ひがし茶屋街と近江町市場、金沢の花街とグルメを楽しむプラン」
 * (58dbfab5-20c1-42b9-8315-8ad8f4afdf7c)
 *
 * 企画運営の指摘:
 * 1. 近江町市場・ひがし茶屋街のガイド口調(「皆様、本日ご案内するのは」
 *    「ご案内いたします」等)を、ほかのスポットと同じ地の文に統一。
 * 2. 金沢21世紀美術館の「有料の」を外す(法務も同じ指摘)。あわせて能登
 *    半島地震後の公開状況を確認(下記出典参照。2024年6月22日に全面再開
 *    済み。本文の「休館日があるので確かめましょう」の一般的な案内のみ
 *    残し、特定の時期は書かない)。
 * 3. しおりのdescriptionを、追加後の6か所の内容に合わせて更新。
 * 4. 尾山神社の配慮の一文を、ほかのスポットと同じ言い回しに統一。
 *
 * 出典(直接開いたURL、再開状況):
 * https://www.tokyoartbeat.com/articles/-/kanazawa21-reopening-news-202402
 * (2024年6月下旬に全館再開)
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-302c-58dbfab5.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "58dbfab5-20c1-42b9-8315-8ad8f4afdf7c";

async function main() {
  const ichiba = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "近江町市場" } });
  const newIchiba =
    "近江町市場は、金沢駅から徒歩でおよそ15分、享保6年(1721)ごろから、加賀藩の御膳所として、また金沢市民の台所として、およそ300年にわたって親しまれてきた市場です。「おみちょ」の愛称で呼ばれ、アーケードの下には鮮魚や青果、飲食店など数多くの店が軒を連ねています。日本海の海の幸をはじめ、加賀野菜など地元の食材が豊富に並び、市民の日常の買い物だけでなく、料亭の料理人も仕入れに訪れるほど、質の高さでも知られています。威勢のいい掛け声が飛び交う市場の活気を、五感で感じながら食べ歩きを楽しみましょう。散策のあとは、加賀百万石の風情を伝えるひがし茶屋街へ向かいましょう。";
  if (ichiba.memo?.includes("皆様、本日ご案内するのは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: ichiba.id }, { memo: newIchiba });
  }

  const chayagai = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "ひがし茶屋街" } });
  const newChayagai =
    "近江町市場から歩いておよそ15分、ひがし茶屋街です。文政3年(1820)、加賀藩によって公認された茶屋街で、金沢の三茶屋街の中でも最も格式が高いとされてきました。紅殻格子と呼ばれる、紅殻(べにがら)を塗った赤みを帯びた格子戸を持つ、二階建ての茶屋建築が石畳の通りの両側に連なり、国の重要伝統的建造物群保存地区にも選定されています。中でも、文政3年建築の茶屋「志摩」は、江戸時代の茶屋建築の様式を今に伝える建物として、内部が一般公開されています。金箔専門店や甘味処なども多く、食べ歩きをしながらの散策も楽しめます。加賀百万石の時代から続く、花街ならではの粋な風情を楽しんでください。散策の途中には甘味処や茶房も多いので、ここで昼食をとりましょう。午後は兼六園や金沢城公園など、加賀百万石の城下町をめぐります。";
  if (chayagai.memo?.includes("続いてご案内するのは")) {
    await updateSpotInItinerary(ITIN_ID, { spotId: chayagai.id }, { memo: newChayagai });
  }

  const museum = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "金沢21世紀美術館" } });
  if (museum.memo) {
    const fixed = museum.memo
      .replace("チケットがなくても入れる交流ゾーンには", "交流ゾーンには")
      .replace("有料の展覧会ゾーンでは", "展覧会ゾーンでは");
    if (fixed !== museum.memo) {
      await updateSpotInItinerary(ITIN_ID, { spotId: museum.id }, { memo: fixed });
    }
  }

  const oyama = await prisma.spot.findFirstOrThrow({ where: { day: { itineraryId: ITIN_ID }, name: "尾山神社" } });
  const oldOyamaLine = "参拝の際は、静かに、敬意をもって見学しましょう。";
  const newOyamaLine = "今も祈りが続く場所ですので、静かに、敬意をもってお参りください。";
  if (oyama.memo?.includes(oldOyamaLine)) {
    await updateSpotInItinerary(ITIN_ID, { spotId: oyama.id }, { memo: oyama.memo.replace(oldOyamaLine, newOyamaLine) });
  }

  await prisma.itinerary.update({
    where: { id: ITIN_ID },
    data: {
      description:
        "紅殻格子の町家が並ぶひがし茶屋街と、「金沢の台所」近江町市場でグルメを味わったあと、兼六園・金沢城公園・金沢21世紀美術館・尾山神社と、加賀百万石の城下町を巡るプランです。",
    },
  });

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
