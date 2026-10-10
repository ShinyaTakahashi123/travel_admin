/**
 * #467 56395886 の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」、書き出しと前のスポット）
 * 2日目: 雷門 → 仲見世通り → 浅草寺 → 隅田公園 → すみだリバーウォーク → 東京スカイツリー（ふもとで昼食）→（電車）すみだ北斎美術館（新規）→ 旧安田庭園（新規）（8か所 09:00〜16:30）
 *   東京スカイツリーの書き出し「東京ミズマチから歩いて約15分」は、前のスポット（すみだリバーウォーク）と合わないので直す
 *   すみだ北斎美術館 9:30〜17:30（入館は閉館の30分前まで）・月曜と年末年始休館、旧安田庭園 10〜3月は9:00〜18:00（墨田区・墨田区観光協会）。本文に時刻・曜日は書かない
 * 本文の出典: 墨田区観光協会 https://visit-sumida.jp/wp/spot/15074 （すみだ北斎美術館）・https://visit-sumida.jp/wp/spot/6085 （旧安田庭園）、
 *   墨田区 https://www.city.sumida.lg.jp/sisetu_info/kouen/kunai_park_annai/sumida_park/park08.html （旧安田庭園の沿革）
 * 座標の出典: OSM/Overpass（すみだ北斎美術館 way 444853841 35.696331,139.800487／旧安田庭園 way 157050769 35.698384,139.793834）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-467c-56395886.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "56395886-d541-4396-b650-e006867bef6a";
const DAY2_ID = "9599b353-bdac-4c29-9018-dd14c2a94137";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const it = await prisma.itinerary.findUniqueOrThrow({ where: { id: ITINERARY_ID }, select: { description: true } });
  const day = await prisma.day.findUniqueOrThrow({ where: { id: DAY2_ID }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (day.itineraryId !== ITINERARY_ID) throw new Error("しおりが違います");
  const names = day.spots.map((s) => s.name);
  if (names.join() !== ["雷門", "仲見世通り", "浅草寺", "隅田公園", "すみだリバーウォーク", "東京スカイツリー"].join()) throw new Error("2日目が想定と違います");
  const sky = day.spots[5];
  const skyMemo = rep(
    rep(sky.memo ?? "", "東京ミズマチから歩いて約15分。", "すみだリバーウォークを渡り、隅田川沿いの東京ミズマチを通って歩いて約15分。"),
    "展望台を楽しんだら、ふもとで昼食をとり、2日間の上野・浅草の旅を締めくくりましょう。", "展望台を楽しんだら、ふもとで昼食にしましょう。");
  const description = rep(it.description ?? "", "東京スカイツリーへ。", "東京スカイツリーへ。午後は両国のすみだ北斎美術館と旧安田庭園へ。");
  console.log(`説明文: ${description}`);

  const order = [
    ...day.spots.slice(0, 5).map((s) => ({ id: s.id, data: {} })),
    { id: sky.id, data: { memo: skyMemo } },
    { create: { name: "すみだ北斎美術館", visitTime: t(14, 55), stayDurationMin: 60, transitMode: "train", transitDurationMin: 25, transitLine: "東京メトロ半蔵門線・JR総武線", lat: 35.696331, lng: 139.800487, address: "東京都墨田区亀沢",
      memo: "押上駅から電車を乗り継いで両国駅へ向かい、歩いてすみだ北斎美術館へ。世界的な画家として評価の高い葛飾北斎は、本所割下水（今の墨田区亀沢のあたり）で生まれたといわれ、90年の生涯のほとんどを今の墨田区内で過ごしながら、多くの作品を残しました。常設展では、北斎の生涯に沿って、その人物像や作品、すみだとのかかわりなどを紹介しています。休館日は公式の案内で確かめましょう。" } },
    { create: { name: "旧安田庭園", visitTime: t(16, 5), stayDurationMin: 25, transitMode: "walk", transitDurationMin: 10, transitLine: null, lat: 35.698384, lng: 139.793834, address: "東京都墨田区横網1-12-1",
      memo: "北斎美術館から歩いて、旧安田庭園へ。元禄年間に常陸笠間藩主・本庄宗資が下屋敷に築いたと伝えられる庭園で、「心」の字をかたどった池に隅田川の水を引き入れ、潮の満ち引きで変わる景色を楽しむ潮入り池泉廻遊式庭園です（今は人工的に潮入りを再現しています）。のちに安田財閥の創始者・安田善次郎の所有となり、その没後に東京市へ寄付されました。池のまわりでは足元に気をつけましょう。上野・浅草から両国まで、下町をめぐった2日間の旅を、ここで締めくくりましょう。帰りは、歩いてすぐの両国駅から。" } },
  ];
  console.log(`スカイツリー: ${skyMemo.slice(0, 50)}…${skyMemo.slice(-30)}`);
  console.log("2日目: 雷門 09:00 → 仲見世 → 浅草寺 → 隅田公園 → リバーウォーク → スカイツリー 12:30〜14:30（昼食）→（電車25分）北斎美術館 14:55〜15:55 → 旧安田庭園 16:05〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");
  await prisma.$transaction(async (tx) => {
    await tx.itinerary.update({ where: { id: ITINERARY_ID }, data: { description } });
    await setDaySpotOrder(DAY2_ID, order, { tx });
  }, { timeout: 60000 });
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
