/**
 * チェックリスト #301 の修正記録(3巡目、企画運営の指摘7点、口調とつながり)。
 * しおり「酒蔵めぐりと飛騨高山まちの博物館、大人の高山グルメ1泊2日」
 * (581607ca-db3c-489b-8490-50733dcf918d)
 *
 * 1. 日枝神社: 「この旅で最初に立ち寄るのは」→「2日目の朝は、日枝神社から」
 * 2. 中橋: 前のスポットが高山市政記念館に変わったため、冒頭の移動元を修正
 * 3. 古い町並み: 案内口調(「続いてご案内するのは」「どうぞお楽しみください」)を修正、
 *    「自慢の」を削除(宣伝に寄るため)、「この日は高山にご宿泊いただきます」を
 *    東山遊歩道へ移動、昼食の一言を追加
 * 4. 東山遊歩道: 寺院群を巡るため配慮の一文を追加、坂・石段の足元の一言を追加、
 *    1日目最後として宿泊の一言を追加
 * 5. 城山公園: 「高山市内でもっとも大きな公園です」の言い切りをぼかす
 * 6. 宮川朝市: 案内口調を修正、末尾の古い結びの一文を削除
 * 7. 飛驒高山美術館: 旅の締めくくりとして、帰りの交通手段の一言を追加(決まり3)
 *
 * itinerary-audit.cjs・prayer-check.cjs 再確認済み。
 *
 * 実行方法: npm run prod -- npx tsx prisma/fix-301c-581607ca.ts
 * (実行済み。現在の本文を確かめてから変更するため、再実行しても安全)
 */
import { prisma } from "../src/lib/prisma";
import { findSpotInItinerary, updateSpotInItinerary } from "./lib/spot-lookup";

const ITIN_ID = "581607ca-db3c-489b-8490-50733dcf918d";

async function main() {
  // 1) 日枝神社
  const hie = await findSpotInItinerary(ITIN_ID, { spotName: "日枝神社" });
  const hieRow = await prisma.spot.findUniqueOrThrow({ where: { id: hie.id } });
  if (hieRow.memo?.includes("この旅で最初に立ち寄るのは日枝神社です。")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: hie.id },
      {
        memo: hieRow.memo.replace(
          "この旅で最初に立ち寄るのは日枝神社です。",
          "2日目の朝は、日枝神社から始めます。"
        ),
      }
    );
  }

  // 2) 中橋
  const nakabashi = await findSpotInItinerary(ITIN_ID, { spotName: "中橋" });
  const nakabashiRow = await prisma.spot.findUniqueOrThrow({ where: { id: nakabashi.id } });
  if (nakabashiRow.memo?.startsWith("高山陣屋からは歩いて2分ほどです。")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: nakabashi.id },
      {
        memo: nakabashiRow.memo.replace(
          "高山陣屋からは歩いて2分ほどです。",
          "高山市政記念館からは歩いて1分ほどです。"
        ),
      }
    );
  }

  // 3) 古い町並み
  const sanmachi = await findSpotInItinerary(ITIN_ID, { spotName: "古い町並み（さんまち）" });
  const sanmachiRow = await prisma.spot.findUniqueOrThrow({ where: { id: sanmachi.id } });
  if (sanmachiRow.memo?.includes("続いてご案内するのは")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: sanmachi.id },
      {
        memo: "中橋からは歩いて2分ほどです。古い町並み(さんまち)は、高山陣屋の門前、宮川の東側に南北に連なる通りを総称した呼び名で、「三町(さんまち)」とも呼ばれ、国の重要伝統的建造物群保存地区に選定されています。江戸時代から続く老舗の造り酒屋が軒を連ね、蔵元の日本酒を飲み比べできる店も多く、大人の町歩きにぴったりの通りです。冬から春にかけては、新酒が搾られたことを知らせる青々とした杉玉が軒先に下がり、酒蔵ごとに違う香りや味わいを楽しめます。車を運転する方は試飲をひかえましょう。あわせて、飛騨牛の握りや串焼きといった、食べ歩きグルメも充実しており、昼食もこのあたりでとるとよいでしょう。木造・切妻屋根の町家が織りなす、江戸時代さながらの風情のなかで、大人ならではの高山グルメを楽しんでください。",
      }
    );
  }

  // 4) 東山遊歩道
  const higashiyama = await findSpotInItinerary(ITIN_ID, { spotName: "東山遊歩道" });
  const higashiyamaRow = await prisma.spot.findUniqueOrThrow({ where: { id: higashiyama.id } });
  if (!higashiyamaRow.memo?.includes("今も祈りが続く場所")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: higashiyama.id },
      {
        memo: "城山公園からは歩いて9分ほどです。東山遊歩道は、戦国武将・金森長近が、京都の東山になぞらえて築いた「東山寺町」を巡る、およそ4kmの散策路です。天正年間、長近は町の東側の高台に寺院を集め、信仰の拠点であると同時に、城下を守る備えともしました。今も十数か寺が軒を連ね、四季折々の風情を楽しめます。長近の菩提寺である素玄寺の本堂は、高山城の遺構を伝える貴重な建物と伝わり、雲龍寺の鐘楼門も、城の解体時に移築されたものです。寺の建物や庭園は、それぞれの行事にあわせて公開日が異なるため、山門など、静かな門前をたどりながら歩いてみてください。坂や石段のある道が続くので、足元に気をつけましょう。今も祈りが続く場所ですので、静かに、敬意をもって歩きましょう。今夜は高山の宿でゆっくりお休みください。",
      }
    );
  }

  // 5) 城山公園
  const shiroyama = await findSpotInItinerary(ITIN_ID, { spotName: "城山公園" });
  const shiroyamaRow = await prisma.spot.findUniqueOrThrow({ where: { id: shiroyama.id } });
  if (shiroyamaRow.memo?.includes("高山市内でもっとも大きな公園です")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: shiroyama.id },
      {
        memo: shiroyamaRow.memo.replace(
          "高山市内でもっとも大きな公園です",
          "高山市内でも有数の大きな公園です"
        ),
      }
    );
  }

  // 6) 宮川朝市
  const asaichi = await findSpotInItinerary(ITIN_ID, { spotName: "宮川朝市" });
  const asaichiRow = await prisma.spot.findUniqueOrThrow({ where: { id: asaichi.id } });
  if (asaichiRow.memo?.includes("旅の2日目にご案内するのは")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: asaichi.id },
      {
        memo: "日枝神社からは歩いて17分ほどです。宮川朝市は、宮川の東岸、鍛冶橋から弥生橋にかけての川沿いで開かれる、石川県の輪島朝市、千葉県の勝浦朝市とあわせて、日本三大朝市の一つに数えられることもある朝市です。文政3年(1820)ごろに高山別院を中心に開かれていた桑市が始まりと伝えられ、今も地元の農家が育てた野菜や漬物、民芸品などを商う露店が、川沿いにずらりと並びます。昨夜の酒蔵めぐりの余韻を感じながら、朝の澄んだ空気の中、地元の人との会話を楽しみつつそぞろ歩いてみてください。開催時刻は季節によって変わりますので、お出かけ前に確かめてください。",
      }
    );
  }

  // 7) 飛驒高山美術館
  const bijutsukan = await findSpotInItinerary(ITIN_ID, { spotName: "飛驒高山美術館" });
  const bijutsukanRow = await prisma.spot.findUniqueOrThrow({ where: { id: bijutsukan.id } });
  if (!bijutsukanRow.memo?.includes("さるぼぼバス")) {
    await updateSpotInItinerary(
      ITIN_ID,
      { spotId: bijutsukan.id },
      { memo: bijutsukanRow.memo + "ゆっくりと鑑賞を楽しんだら、帰りはさるぼぼバスで高山駅へ向かいましょう。" }
    );
  }

  console.log("done");
}
main().catch((e) => { console.error(e); process.exit(1); }).finally(() => prisma.$disconnect());
