/**
 * #445 b0b1115c の追いの修正（しおりえ(制作補助2)、企画運営・法務の指摘）
 *   - 2日目も16:30ごろまで（仕様の決まり3）: 奥宮のあと、大山寺のあたりで昼食 → 桝水高原（新規）→ とっとり花回廊（新規）
 *   - 2日目の最初に、米子駅の近くでレンタカーを借りることを書く
 *   - 言い切り: 水鳥公園「山陰屈指の野鳥の生息地です」→「山陰でも有数の野鳥の生息地とされます」、奥宮「日本最大級の権現造りの社殿で」→「日本最大級とされる権現造りの社殿で」、
 *     皆生温泉「日本で初めてのトライアスロン」→「日本で初めてとされるトライアスロン」
 * 本文の出典: とっとり旅 https://www.tottori-guide.jp/tourism/tour/view/539（桝水高原）・/202（とっとり花回廊）
 * 座標の出典: 地理院の地名検索（桝水高原 35.36840244,133.5129026）、Nominatim（とっとり花回廊 バス停 35.3478011,133.4229894）
 * 使い方(admin-site): npm run prod -- npx tsx prisma/fix-445b-b0b1115c.ts [--commit]
 */
import { prisma } from "../src/lib/prisma";
import { setDaySpotOrder } from "./lib/spot-order";

const ITINERARY_ID = "b0b1115c-0677-4979-82d1-b4045b052e90";
const DAY1_ID = "5bdd4101-34e2-4b8c-b2ff-b317636eb6ed";
const DAY2_ID = "7d93bbdc-2b04-4898-b5ec-e8a12f5ad1ff";
const COMMIT = process.argv.includes("--commit");
const t = (h: number, m: number) => new Date(Date.UTC(1970, 0, 1, h, m));

function rep(text: string, from: string, to: string) {
  if (!text.includes(from)) throw new Error(`本文が想定と違います: ${from}`);
  return text.replace(from, to);
}

async function main() {
  const days = await prisma.day.findMany({ where: { itineraryId: ITINERARY_ID }, orderBy: { dayNumber: "asc" }, include: { spots: { orderBy: { orderNo: "asc" } } } });
  if (days.length !== 2 || days[0].id !== DAY1_ID || days[1].id !== DAY2_ID) throw new Error("構成が想定と違います");
  const d2 = days[1].spots;
  if (d2.map((s) => s.name).join() !== ["米子水鳥公園", "大神山神社（本社）", "大山寺", "大神山神社奥宮"].join()) throw new Error("2日目が想定と違います");
  const kaike = days[0].spots.find((s) => s.name === "皆生温泉");
  if (!kaike) throw new Error("皆生温泉がありません");

  const kaikeMemo = rep(kaike.memo ?? "", "日本で初めてのトライアスロンがこの海岸で開かれ", "日本で初めてとされるトライアスロンがこの海岸で開かれ");
  const mizudoriMemo = rep(
    rep(d2[0].memo ?? "", "2日目は車（レンタカーなど）でめぐります。", "2日目は、米子駅の近くでレンタカーを借りて、車でめぐります。"),
    "山陰屈指の野鳥の生息地です。", "山陰でも有数の野鳥の生息地とされます。");
  const okumiyaMemo = rep(
    rep(d2[3].memo ?? "", "日本最大級の権現造りの社殿で、", "日本最大級とされる権現造りの社殿で、"),
    "大山の信仰の地で、米子の旅を締めくくりましょう。", "参拝のあとは、大山寺のあたりで昼食にしましょう。");

  const order = [
    { id: d2[0].id, data: { memo: mizudoriMemo } },
    { id: d2[1].id, data: {} },
    { id: d2[2].id, data: {} },
    { id: d2[3].id, data: { memo: okumiyaMemo } },
    { create: { name: "桝水高原", visitTime: t(14, 20), stayDurationMin: 40, transitMode: "car", transitDurationMin: 20, transitLine: null, lat: 35.368402, lng: 133.512903, address: "鳥取県西伯郡伯耆町大内",
      memo: "昼食のあとは、車で桝水高原へ。大山の正面の中腹、標高700〜900mの斜面に広がる大草原で、天空リフトで展望台に上ると、日本海や弓ヶ浜、島根半島の景色を一望できます。冬はスキー場になり、リフトの運行期間や運休日は季節で変わるので、公式の案内で確かめましょう。" } },
    { create: { name: "とっとり花回廊", visitTime: t(15, 25), stayDurationMin: 65, transitMode: "car", transitDurationMin: 25, transitLine: null, lat: 35.347801, lng: 133.422989, address: "鳥取県西伯郡南部町鶴田110",
      memo: "旅の締めくくりは、南部町のとっとり花回廊へ。西日本最大級のフラワーパークとされ、大温室や展示館があるので、天気や季節に左右されずに花や植物を楽しめます。園を囲む周囲1kmの屋根付きの展望回廊があり、雨の日でも傘をささずに歩けます。ユリをメインの花として一年中展示しています。開園時間や開園日は季節によって変わるので、公式の案内で確かめてから出かけましょう。米子と大山をめぐる旅を、ここで締めくくりましょう。" } },
  ];
  console.log(`皆生: …${kaikeMemo.slice(170, 260)}…`);
  console.log(`水鳥: ${mizudoriMemo.slice(0, 120)}…`);
  console.log(`奥宮: ${okumiyaMemo}`);
  console.log("2日目: 水鳥公園 09:00 → 本社 10:15 → 大山寺 11:15 → 奥宮 12:15〜13:15 →（昼食）→ 桝水高原 14:20〜15:00 → とっとり花回廊 15:25〜16:30");
  if (!COMMIT) return console.log("\n確認モードです。--commit で書き込みます。");

  await prisma.$transaction(
    async (tx) => {
      await tx.spot.update({ where: { id: kaike.id }, data: { memo: kaikeMemo } });
      await setDaySpotOrder(DAY2_ID, order, { tx });
    },
    { timeout: 60000 }
  );
  console.log("\n書き込みました。");
}

main()
  .catch((e) => {
    console.error("エラー:", e?.code, e?.message?.slice(0, 600));
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
