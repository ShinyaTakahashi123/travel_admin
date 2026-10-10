/**
 * #440 9903e2ef の追いの修正（しおりえ(制作補助2)、企画運営の指摘: 仕様の決まり3「最終日も16:30〜17:00まで」）
 * 2日目（車）: 追分宿郷土館 → 堀辰雄文学記念館 → 追分宿の分去れ → 軽井沢タリアセン（昼食）→ 軽井沢野鳥の森（新規）→ 軽井沢安東美術館（新規）（6か所 09:00〜16:30）
 *   安東美術館は 10:00〜17:00（入館は閉館の30分前まで）、12/31・1/1と冬のメンテナンス期間（1月か2月）・展示替えで休館（公式）。本文は「休館日は公式で」
 *   タリアセンの住所を、観光協会どおり「長倉塩沢217」に直す（前は「塩沢818」）
 * 本文の出典: 環境省 信越自然環境事務所 https://chubu.env.go.jp/shinetsu/wildlife/mat/m_2.html （国設軽井沢野鳥の森）、
 *   軽井沢観光協会 https://karuizawa-kankokyokai.jp/spot/1015/ （軽井沢安東美術館）・/spot/1203/ （タリアセンの住所）、軽井沢安東美術館 https://www.musee-ando.com/
 * 座標の出典: OSM/Overpass（軽井沢野鳥の森の入口にあるビジターセンターの建物 way 1280085230 36.363653,138.591431。保護区の面の中心 way 1464925652 は森の奥なので使わない）、
 *   地理院の住所検索（軽井沢安東美術館「軽井沢東43」36.346527,138.639557。OSM に点がないため）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-440c-9903e2ef.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "9903e2ef-b144-43b3-885f-c552bc7cc906";
const DAY2_ID = "79a64fd4-2674-4b30-a37c-24d5cd25c4a4";
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
  if (day.spots.map((s) => s.name).join() !== ["追分宿郷土館", "堀辰雄文学記念館", "追分宿の分去れ", "軽井沢タリアセン"].join()) throw new Error("2日目が想定と違います");
  const tal = day.spots[3];
  const talMemo = rep(tal.memo ?? "", "軽井沢の旅を、ここで締めくくりましょう。", "");
  const description = rep(it.description ?? "", "塩沢湖畔の軽井沢タリアセンへ。", "塩沢湖畔の軽井沢タリアセン、軽井沢野鳥の森、藤田嗣治の作品を集めた軽井沢安東美術館へ。");

  const order = [
    ...day.spots.slice(0, 3).map((s) => ({ id: s.id, data: {} })),
    { id: tal.id, data: { memo: talMemo, address: "長野県北佐久郡軽井沢町大字長倉塩沢217" } },
    { create: { name: "軽井沢野鳥の森", visitTime: t(13, 50), stayDurationMin: 70, transitMode: "car", transitDurationMin: 20, transitLine: null, lat: 36.363653, lng: 138.591431, address: "長野県北佐久郡軽井沢町星野",
      memo: "タリアセンから車で、中軽井沢の星野地区にある国設軽井沢野鳥の森へ。国指定浅間鳥獣保護区の中にあり、数多くの野鳥がすむ場所として知られています。環境省が遊歩道や休憩所を整えていて、入口のそばのビジターセンターで地図を手に入れてから、森の中を歩けます。野生の動物がすむ森なので、遊歩道から外れず、道の状態は季節によって変わるため、歩きやすい靴で出かけましょう。" } },
    { create: { name: "軽井沢安東美術館", visitTime: t(15, 20), stayDurationMin: 70, transitMode: "car", transitDurationMin: 20, transitLine: null, lat: 36.346527, lng: 138.639557, address: "長野県北佐久郡軽井沢町大字軽井沢東43-10",
      memo: "旅の締めくくりは、軽井沢駅の近くにある軽井沢安東美術館へ。画家・藤田嗣治の作品だけを展示する美術館で、「少女」「猫」「聖母子」の絵を中心に約200点を所蔵し、藤田の歩みをたどることができます。ヨーロッパで高く評価された「乳白色の下地」の作品も展示されています。休館日は公式の案内で確かめましょう。軽井沢の自然と歴史、アートにふれた旅を、ここで締めくくりましょう。帰りは、すぐ近くの軽井沢駅から。" } },
  ];
  console.log(`説明文: ${description}`);
  console.log(`タリアセンの最後: …${talMemo.slice(-60)}`);
  console.log("2日目: 追分宿郷土館 09:00 → 堀辰雄 → 分去れ → タリアセン 11:30〜13:30（昼食）→（車20分）野鳥の森 13:50〜15:00 →（車20分）安東美術館 15:20〜16:30");
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
